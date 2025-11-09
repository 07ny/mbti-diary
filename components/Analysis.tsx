
import React from 'react';
import { Entry } from '../types';
import { MBTI_JAPANESE_NAMES } from '../constants';
import { TrendingUp, PieChart } from 'lucide-react';
import MBTIBadge from './common/MBTIBadge';

interface AnalysisProps {
  entries: Entry[];
}

const Analysis: React.FC<AnalysisProps> = ({ entries }) => {
  const typeDistribution = entries.reduce((acc, entry) => {
    acc[entry.mbtiType] = (acc[entry.mbtiType] || 0) + 1;
    return acc;
  }, {} as { [key: string]: number });

  return (
    <div className="bg-white rounded-xl shadow-lg border border-orange-100 p-6 animate-fade-in">
      <div className="flex items-center gap-3 mb-6">
        <TrendingUp className="w-6 h-6 text-rose-500" />
        <h2 className="text-xl font-bold text-gray-800">詳細分析 🧠</h2>
      </div>
      
      {entries.length === 0 ? (
        <div className="text-center py-16">
          <TrendingUp className="w-16 h-16 mx-auto text-orange-300 mb-4" />
          <p className="text-gray-700">分析するデータがありません</p>
          <p className="text-sm text-gray-500 mt-2">日記をいくつか書くと、ここに詳細な分析が表示されます。</p>
        </div>
      ) : (
        <div className="space-y-8">
          <div>
            <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                <PieChart className="w-5 h-5" /> MBTIタイプの分布
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {Object.entries(typeDistribution)
                .sort(([, a], [, b]) => b - a)
                .map(([type, count]) => (
                <div key={type} className="p-4 rounded-lg text-center border bg-white shadow-sm">
                  <MBTIBadge type={type} size="medium"/>
                  <div className="text-xs text-gray-600 mt-1">{MBTI_JAPANESE_NAMES[type]}</div>
                  <div className="font-bold text-lg mt-2">{count}回</div>
                  <div className="text-xs text-gray-500">({Math.round((count / entries.length) * 100)}%)</div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5" /> スコアの推移 (最新10件)
            </h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-xs font-bold text-gray-500">
                <span className="w-20">日付</span>
                <div className="flex-1 grid grid-cols-4 gap-2 text-center">
                  <span>E/I</span>
                  <span>S/N</span>
                  <span>T/F</span>
                  <span>J/P</span>
                </div>
              </div>
              {entries.slice(0, 10).reverse().map((entry) => (
                <div key={entry.id} className="flex items-center gap-3">
                  <span className="text-xs text-gray-600 w-20">{entry.date}</span>
                  <div className="flex-1 grid grid-cols-4 gap-2">
                    {['EI', 'SN', 'TF', 'JP'].map((dim, idx) => {
                      const score = entry.mbtiScores[dim as keyof typeof entry.mbtiScores];
                      const colors = ['bg-pink-400', 'bg-orange-400', 'bg-amber-400', 'bg-rose-400'];
                      return (
                        <div key={dim} className="h-6 bg-gray-200 rounded-full overflow-hidden relative" title={`${dim}: ${score.toFixed(0)}`}>
                          <div 
                            className={`h-full ${colors[idx]} transition-all`}
                            style={{ width: `${((score + 100) / 200) * 100}%` }}
                          />
                           <div className="absolute left-1/2 top-0 bottom-0 w-px bg-white opacity-50"></div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Analysis;
