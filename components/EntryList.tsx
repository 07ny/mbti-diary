
import React from 'react';
import { Entry } from '../types';
import { MBTI_JAPANESE_NAMES } from '../constants';
import { Calendar, Trash2 } from 'lucide-react';
import MBTIBadge from './common/MBTIBadge';

interface EntryListProps {
  entries: Entry[];
  onDelete: (id: string) => void;
}

const EntryList: React.FC<EntryListProps> = ({ entries, onDelete }) => {
  return (
    <div className="bg-white rounded-xl shadow-lg border border-orange-100 p-6 animate-fade-in">
      <div className="flex items-center gap-3 mb-6">
        <Calendar className="w-6 h-6 text-rose-500" />
        <h2 className="text-xl font-bold text-gray-800">日記一覧 📅</h2>
      </div>
      
      {entries.length === 0 ? (
        <div className="text-center py-16">
          <Calendar className="w-16 h-16 mx-auto text-orange-300 mb-4" />
          <p className="text-gray-700">まだ日記がありません</p>
          <p className="text-sm text-gray-500 mt-2">「新規日記」タブから最初の日記を書いてみましょう！</p>
        </div>
      ) : (
        <div className="space-y-4">
          {entries.map(entry => (
            <div key={entry.id} className="border-l-4 border-l-rose-400 bg-white shadow-md rounded-r-lg p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <MBTIBadge type={entry.mbtiType} size="medium" />
                  <span className="text-sm text-gray-600 font-medium hidden sm:inline">{MBTI_JAPANESE_NAMES[entry.mbtiType]}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm text-gray-600">{entry.date}</span>
                  <button
                    onClick={() => onDelete(entry.id)}
                    className="text-gray-400 hover:text-red-500 transition-colors"
                    aria-label="Delete entry"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              
              <div className="bg-amber-50/50 p-4 rounded-lg border border-amber-100 mb-4">
                <p className="text-gray-800 whitespace-pre-wrap">{entry.content}</p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                {[
                  { label: '外向/内向', score: entry.mbtiScores.EI, bg: 'bg-blue-50/50', border: 'border-blue-100' },
                  { label: '感覚/直感', score: entry.mbtiScores.SN, bg: 'bg-green-50/50', border: 'border-green-100' },
                  { label: '思考/感情', score: entry.mbtiScores.TF, bg: 'bg-orange-50/50', border: 'border-orange-100' },
                  { label: '判断/知覚', score: entry.mbtiScores.JP, bg: 'bg-pink-50/50', border: 'border-pink-100' }
                ].map(item => (
                  <div key={item.label} className={`${item.bg} p-3 rounded-lg border ${item.border}`}>
                    <span className="text-gray-600">{item.label}:</span>
                    <span className="ml-2 font-medium text-gray-800">
                      {item.score > 0 ? '+' : ''}{item.score.toFixed(0)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default EntryList;
