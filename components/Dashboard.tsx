import React from 'react';
import { Entry } from '../types';
import { MBTI_JAPANESE_NAMES } from '../constants';
import { Brain, Feather } from 'lucide-react';
import MBTIBadge from './common/MBTIBadge';
import ScoreBar from './common/ScoreBar';
import { MBTI_IMAGES } from '../assets/mbtiImages';

interface DashboardProps {
  entries: Entry[];
}

const Dashboard: React.FC<DashboardProps> = ({ entries }) => {
  if (entries.length === 0) {
    return (
      <div className="space-y-6 animate-fade-in">
        <div className="bg-white rounded-xl shadow-lg border border-orange-100 p-6 text-center">
           <div className="w-48 h-48 rounded-lg overflow-hidden mx-auto mb-4">
              <img src={MBTI_IMAGES['default']} alt="日記を始めよう" className="w-full h-full object-cover"/>
           </div>
          <h2 className="text-xl font-bold text-gray-800">ようこそ！</h2>
          <p className="text-gray-600 mt-2">
            最初の日記を書いて、あなたの心の分析を始めましょう。
          </p>
           <p className="text-sm text-gray-500 mt-1">
            「カレンダー」タブから今日の日付を選んで日記を作成できます。
          </p>
        </div>
      </div>
    );
  }

  const avgScores = entries.reduce(
    (acc, entry) => ({
      EI: acc.EI + entry.mbtiScores.EI,
      SN: acc.SN + entry.mbtiScores.SN,
      TF: acc.TF + entry.mbtiScores.TF,
      JP: acc.JP + entry.mbtiScores.JP,
    }),
    { EI: 0, SN: 0, TF: 0, JP: 0 }
  );

  const numEntries = entries.length;
  Object.keys(avgScores).forEach((key) => {
    avgScores[key as keyof typeof avgScores] /= numEntries;
  });

  const currentType =
    (avgScores.EI > 0 ? 'E' : 'I') +
    (avgScores.SN > 0 ? 'S' : 'N') +
    (avgScores.TF > 0 ? 'T' : 'F') +
    (avgScores.JP > 0 ? 'J' : 'P');
    
  const mbtiImageUrl = MBTI_IMAGES[currentType] || MBTI_IMAGES['default'];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="bg-white rounded-xl shadow-lg border border-orange-100 p-6">
        <div className="flex items-center gap-3 mb-4">
          <Brain className="w-6 h-6 text-rose-500" />
          <h2 className="text-xl font-bold text-gray-800">総合分析結果 ✨</h2>
        </div>
        <p className="text-sm text-gray-600 mb-6">{entries.length}件の日記から分析</p>
        
        <div className="flex flex-col md:flex-row items-center justify-center gap-6 p-6 bg-gradient-to-r from-orange-50 to-pink-50 rounded-lg mb-6">
          <div className="w-48 h-48 rounded-lg overflow-hidden bg-gradient-to-br from-rose-100 to-amber-100 flex-shrink-0 shadow-inner">
             <img src={mbtiImageUrl} alt={`${currentType}のイメージイラスト`} className="w-full h-full object-cover"/>
          </div>
          <div className="text-center md:text-left">
            <p className="text-sm text-gray-700 mb-2">現在のあなたのタイプ</p>
            <MBTIBadge type={currentType} size="large" />
            <p className="text-gray-700 mt-2 font-semibold text-lg">{MBTI_JAPANESE_NAMES[currentType]}</p>
          </div>
        </div>

        <div className="space-y-4">
          {[
            { name: 'E/I: 外向 ↔ 内向', score: avgScores.EI, color: 'from-pink-300 to-pink-500' },
            { name: 'S/N: 感覚 ↔ 直感', score: avgScores.SN, color: 'from-orange-300 to-orange-500' },
            { name: 'T/F: 思考 ↔ 感情', score: avgScores.TF, color: 'from-amber-300 to-amber-500' },
            { name: 'J/P: 判断 ↔ 知覚', score: avgScores.JP, color: 'from-rose-300 to-rose-500' }
          ].map(dim => (
            <ScoreBar key={dim.name} name={dim.name} score={dim.score} color={dim.color} />
          ))}
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-lg border border-orange-100 p-6">
        <h3 className="text-lg font-bold text-gray-800 mb-4">最近の日記</h3>
        <div className="space-y-3">
          {entries.slice(0, 3).map(entry => (
            <div key={entry.id} className="border-l-4 border-l-rose-400 bg-amber-50/50 p-4 rounded-lg">
              <div className="flex justify-between items-start mb-2">
                <MBTIBadge type={entry.mbtiType} size="medium" />
                <span className="text-sm text-gray-600">{entry.date}</span>
              </div>
              <p className="text-gray-800 text-sm line-clamp-2">{entry.content}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
