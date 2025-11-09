// Vercelでは、このファイルはNode.js環境で実行されます。
import { GoogleGenAI, Type } from "@google/genai";

const getAnalysisPrompt = (text: string) => `
あなたはプロのMBTI分析家です。以下の日本語の日記を分析し、著者のMBTIパーソナリティタイプを特定してください。

分析の際には、以下の4つの性格指標について、それぞれ-100から100の範囲でスコアを付けてください。
- EI: 外向性(+) vs 内向性(-)
- SN: 感覚(+) vs 直観(-)
- TF: 思考(+) vs 感情(-)
- JP: 判断(+) vs 知覚(-)

これらのスコアに基づき、最終的な4文字のMBTIタイプを決定してください。
結果は必ず指定されたJSON形式で返してください。他の説明や前置きは一切不要です。

日記: "${text}"
`;

// この関数はリクエストを処理します。
// VercelのNode.jsランタイムに合わせ、 (req, res) のシグネチャに変更します。
export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: '許可されていないメソッドです。' });
  }

  try {
    // req.json() の代わりに req.body を使用します。
    // Vercelが自動的にJSONボディをパースしてくれます。
    const { text } = req.body;

    if (!text || typeof text !== 'string' || text.length < 20) {
        return res.status(400).json({ error: '有効なテキスト（20文字以上）が必要です。' });
    }

    // Vercelの環境変数からAPIキーを取得します。
    const apiKey = process.env.API_KEY;
    if (!apiKey) {
      console.error("API_KEY environment variable not set on Vercel.");
      return res.status(500).json({ error: 'サーバーにAPIキーが設定されていません。Vercelのプロジェクト設定を確認してください。' });
    }

    const ai = new GoogleGenAI({ apiKey });

    const analysisSchema = {
        type: Type.OBJECT,
        properties: {
            mbtiType: { type: Type.STRING },
            mbtiScores: {
                type: Type.OBJECT,
                properties: {
                    EI: { type: Type.NUMBER },
                    SN: { type: Type.NUMBER },
                    TF: { type: Type.NUMBER },
                    JP: { type: Type.NUMBER },
                },
                required: ["EI", "SN", "TF", "JP"],
            },
        },
        required: ["mbtiType", "mbtiScores"],
    };
    
    const prompt = getAnalysisPrompt(text);

    const geminiResponse = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: analysisSchema,
        },
    });

    // AIからの応答テキストを取得し、前後の空白やMarkdownコードブロックを除去
    let jsonString = geminiResponse.text.trim();
    if (jsonString.startsWith('```json')) {
      jsonString = jsonString.slice(7, -3).trim();
    } else if (jsonString.startsWith('```')) {
      jsonString = jsonString.slice(3, -3).trim();
    }
    
    const result = JSON.parse(jsonString);

    // new Response() の代わりに res.status().json() を使用
    return res.status(200).json(result);

  } catch (error) {
    console.error('Error in /api/analyze:', error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    
    let userFriendlyMessage = 'AIによる分析中に不明なエラーが発生しました。';
    if (errorMessage.includes('API key not valid') || errorMessage.includes('API_KEY_INVALID')) {
        userFriendlyMessage = 'サーバーに設定されたAPIキーが無効です。Vercelの設定を再度確認してください。';
    } else if (errorMessage.includes('timed out')) {
        userFriendlyMessage = 'AIの応答がタイムアウトしました。しばらくしてから再度お試しください。';
    } else if (errorMessage.includes("FETCH_ERROR")) {
        userFriendlyMessage = 'AIサーバーへの接続に失敗しました。ネットワークの問題か、APIキーが間違っている可能性があります。'
    }

    // new Response() の代わりに res.status().json() を使用
    return res.status(500).json({ error: userFriendlyMessage });
  }
}
