
import React from 'react';

interface ScoreBarProps {
  name: string;
  score: number;
  color: string;
}

const ScoreBar: React.FC<ScoreBarProps> = ({ name, score, color }) => {
  return (
    <div>
      <div className="flex justify-between text-sm text-gray-700 mb-1">
        <span>{name}</span>
        <span className="font-semibold">{score > 0 ? '+' : ''}{score.toFixed(1)}</span>
      </div>
      <div className="h-4 bg-gray-200 rounded-full overflow-hidden relative">
        <div 
          className={`absolute top-0 bottom-0 h-full bg-gradient-to-r ${color} transition-all duration-500 ease-out`}
          style={{ width: `${((score + 100) / 200) * 100}%` }}
        />
        <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gray-400 opacity-50"></div>
      </div>
    </div>
  );
};

export default ScoreBar;
