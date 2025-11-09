
import React, { useState } from 'react';
import { PenLine, Sparkles } from 'lucide-react';
import { analyzeDiaryEntry } from '../services/geminiService';
import { Entry } from '../types';

interface NewEntryFormProps {
  onSave: (newEntry: Entry) => void;
  showToast: (message: string, type: 'success' | 'error') => void;
  onAnalysisStart: () => void;
}

const NewEntryForm: React.FC<NewEntryFormProps> = ({ onSave, showToast, onAnalysisStart }) => {
  const [newContent, setNewContent] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleSubmit = async (e: React.MouseEvent) => {
    e.preventDefault();
    
    if (newContent.trim().length < 20) {
      showToast('日記は20文字以上入力してください', 'error');
      return;
    }

    setIsAnalyzing(true);
    onAnalysisStart();
    
    try {
      const { mbtiScores, mbtiType } = await analyzeDiaryEntry(newContent);
      
      const newEntry: Entry = {
        id: Date.now().toString(),
        date: new Date().toISOString().split('T')[0],
        content: newContent,
        mbtiScores,
        mbtiType
      };

      onSave(newEntry);
      setNewContent('');
      showToast(`日記を保存しました！分析結果: ${mbtiType}`, 'success');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "分析中にエラーが発生しました。";
      showToast(errorMessage, 'error');
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-orange-100 p-6 max-w-3xl mx-auto animate-fade-in">
      <div className="flex items-center gap-3 mb-4">
        <PenLine className="w-5 h-5 text-rose-500" />
        <h2 className="text-xl font-bold text-gray-800">新しい日記を書く ✍️</h2>
      </div>
      <p className="text-sm text-gray-600 mb-6">
        今日の出来事や気持ちを書いてください。AIがあなたの性格傾向を分析します 💭
      </p>
      
      <div>
        <label htmlFor="diary-content" className="block text-sm font-medium text-gray-700 mb-2">
          日記の内容
        </label>
        <textarea
          id="diary-content"
          value={newContent}
          onChange={(e) => setNewContent(e.target.value)}
          placeholder="今日は..."
          className="w-full h-48 p-4 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-shadow"
          disabled={isAnalyzing}
        />
        <p className="text-sm text-gray-500 mt-2">
          {newContent.length} 文字（最低20文字）
        </p>

        <button
          onClick={handleSubmit}
          disabled={isAnalyzing || newContent.trim().length < 20}
          className="mt-4 w-full bg-rose-500 hover:bg-rose-600 text-white font-bold py-3 px-6 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-all duration-300"
        >
          {isAnalyzing ? (
            <>
              <Sparkles className="w-5 h-5 animate-spin" />
              AIが分析中...
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5" />
              保存して分析する
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default NewEntryForm;
