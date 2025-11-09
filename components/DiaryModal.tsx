import React, { useState, useEffect } from 'react';
import { X, Sparkles, Trash2 } from 'lucide-react';
import { Entry } from '../types';
import { analyzeDiaryEntry } from '../services/geminiService';

interface DiaryModalProps {
  isOpen: boolean;
  onClose: () => void;
  date: string | null;
  entry: Entry | null;
  onSave: (entry: Entry) => void;
  onDelete: (id: string) => void;
  showToast: (message: string, type: 'success' | 'error') => void;
}

const DiaryModal: React.FC<DiaryModalProps> = ({ isOpen, onClose, date, entry, onSave, onDelete, showToast }) => {
  const [content, setContent] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  useEffect(() => {
    if (entry) {
      setContent(entry.content);
    } else {
      setContent('');
    }
  }, [entry, date]);
  
  if (!isOpen || !date) return null;

  const handleSubmit = async () => {
    if (content.trim().length < 20) {
      showToast('日記は20文字以上入力してください', 'error');
      return;
    }
    setIsAnalyzing(true);
    try {
      const { mbtiScores, mbtiType } = await analyzeDiaryEntry(content);
      const newEntry: Entry = {
        id: entry?.id || Date.now().toString(),
        date: date,
        content: content,
        mbtiScores,
        mbtiType
      };
      onSave(newEntry);
      showToast(`日記を保存しました！分析結果: ${mbtiType}`, 'success');
    } catch (error) {
       const errorMessage = error instanceof Error ? error.message : "分析中にエラーが発生しました。";
       showToast(errorMessage, 'error');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleDelete = () => {
    if (entry && window.confirm("この日記を本当に削除しますか？")) {
        onDelete(entry.id);
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white rounded-xl shadow-lg border border-orange-100 p-6 w-full max-w-2xl relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
          <X className="w-6 h-6" />
        </button>

        <h2 className="text-xl font-bold text-gray-800 mb-2">
          {date} の日記
        </h2>
        <p className="text-sm text-gray-600 mb-4">
          今日の出来事や気持ちを自由に書いてください。
        </p>

        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="今日は..."
          className="w-full h-64 p-4 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-shadow"
          disabled={isAnalyzing}
        />
        <p className="text-sm text-gray-500 mt-1">
          {content.length} 文字（最低20文字）
        </p>

        <div className="mt-4 flex flex-col sm:flex-row gap-2 justify-between">
            {entry && (
                <button
                    onClick={handleDelete}
                    disabled={isAnalyzing}
                    className="flex items-center justify-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg disabled:opacity-50 transition-colors"
                >
                    <Trash2 className="w-4 h-4" /> 削除
                </button>
            )}
            <button
                onClick={handleSubmit}
                disabled={isAnalyzing || content.trim().length < 20}
                className="w-full sm:w-auto mt-2 sm:mt-0 bg-rose-500 hover:bg-rose-600 text-white font-bold py-3 px-6 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-all duration-300"
                style={{ marginLeft: entry ? 'auto' : '0' }}
            >
            {isAnalyzing ? (
                <>
                <Sparkles className="w-5 h-5 animate-spin" />
                AIが分析中...
                </>
            ) : (
                <>
                <Sparkles className="w-5 h-5" />
                {entry ? '更新して再分析' : '保存して分析する'}
                </>
            )}
            </button>
        </div>
      </div>
    </div>
  );
};

export default DiaryModal;
