import { MBTIScores } from '../types';

interface AnalysisResult {
    mbtiScores: MBTIScores;
    mbtiType: string;
}

export const analyzeDiaryEntry = async (text: string): Promise<AnalysisResult> => {
    try {
        const response = await fetch('/api/analyze', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ text }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'API request failed');
        }

        const result = await response.json();
        
        // Validate the result structure
        if (result && result.mbtiType && result.mbtiScores) {
            return result as AnalysisResult;
        } else {
            throw new Error("Invalid response format from API");
        }

    } catch (error) {
        console.error("Error analyzing diary via backend:", error);
        const errorMessage = error instanceof Error ? error.message : "Failed to analyze the diary entry. Please try again.";
        throw new Error(errorMessage);
    }
};
