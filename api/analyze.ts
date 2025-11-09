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
export default async function handler(req: Request) {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: '許可されていないメソッドです。' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const { text } = await req.json();

    if (!text || typeof text !== 'string' || text.length < 20) {
        return new Response(JSON.stringify({ error: '有効なテキスト（20文字以上）が必要です。' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' },
        });
    }

    // Vercelの環境変数からAPIキーを取得します。
    const apiKey = process.env.API_KEY;
    if (!apiKey) {
      console.error("API_KEY environment variable not set on Vercel.");
      return new Response(JSON.stringify({ error: 'サーバーにAPIキーが設定されていません。Vercelのプロジェクト設定を確認してください。' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
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

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: analysisSchema,
        },
    });

    // AIからの応答テキストを取得し、前後の空白やMarkdownコードブロックを除去
    let jsonString = response.text.trim();
    if (jsonString.startsWith('```json')) {
      jsonString = jsonString.slice(7, -3).trim();
    } else if (jsonString.startsWith('```')) {
      jsonString = jsonString.slice(3, -3).trim();
    }
    
    const result = JSON.parse(jsonString);

    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

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

    return new Response(JSON.stringify({ error: userFriendlyMessage }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
