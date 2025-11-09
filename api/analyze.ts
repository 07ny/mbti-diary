// Vercelでは、このファイルはNode.js環境で実行されます。
import { GoogleGenAI, Type } from "@google/genai";

// この関数はリクエストを処理します。VercelではRequest/Responseオブジェクトが使えます。
export default async function handler(req: Request) {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const { text } = await req.json();

    if (!text || typeof text !== 'string') {
        return new Response(JSON.stringify({ error: 'Text is required' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' },
        });
    }

    // Vercelの環境変数からAPIキーを取得します。
    // process.env.API_KEY は、Vercelのプロジェクト設定でセットします。
    const apiKey = process.env.API_KEY;
    if (!apiKey) {
      return new Response(JSON.stringify({ error: 'API key not configured' }), {
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

    const prompt = `
        Analyze the following diary entry to determine the author's MBTI personality type.
        Provide a score for each of the four dichotomies on a scale of -100 to 100:
        - EI: Extroversion (+) vs. Introversion (-)
        - SN: Sensing (+) vs. Intuition (-)
        - TF: Thinking (+) vs. Feeling (-)
        - JP: Judging (+) vs. Perceiving (-)
        Based on these scores, determine the final 4-letter MBTI type.
        Return the result as a JSON object.
        Diary Entry: "${text}"
    `;

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: analysisSchema,
        },
    });

    const jsonString = response.text.trim();
    const result = JSON.parse(jsonString);

    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in /api/analyze:', error);
    return new Response(JSON.stringify({ error: 'Failed to analyze entry.' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
