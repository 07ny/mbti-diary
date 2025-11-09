
import React from 'react';
import { getMBTIColor } from '../../constants';

interface MBTIBadgeProps {
  type: string;
  size?: 'small' | 'medium' | 'large';
}

const MBTIBadge: React.FC<MBTIBadgeProps> = ({ type, size = 'medium' }) => {
  const sizeClasses = {
    small: 'px-2 py-0.5 text-xs font-medium',
    medium: 'px-3 py-1 text-sm font-semibold',
    large: 'px-8 py-4 text-3xl font-bold',
  };

  return (
    <div className={`inline-block rounded-lg border ${getMBTIColor(type)} ${sizeClasses[size]}`}>
      {type}
    </div>
  );
};

export default MBTIBadge;
