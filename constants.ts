
export const MBTI_JAPANESE_NAMES: { [key: string]: string } = {
  'ISTJ': '管理者', 'ISFJ': '擁護者', 'INFJ': '提唱者', 'INTJ': '建築家',
  'ISTP': '巨匠', 'ISFP': '冒険家', 'INFP': '仲介者', 'INTP': '論理学者',
  'ESTP': '起業家', 'ESFP': 'エンターテイナー', 'ENFP': '広報運動家', 'ENTP': '討論者',
  'ESTJ': '幹部', 'ESFJ': '領事官', 'ENFJ': '主人公', 'ENTJ': '指揮官',
};

export const getMBTIColor = (type: string): string => {
  const colors: { [key: string]: string } = {
    'INTJ': 'bg-purple-100 text-purple-800 border-purple-200',
    'INTP': 'bg-indigo-100 text-indigo-800 border-indigo-200',
    'ENTJ': 'bg-red-100 text-red-800 border-red-200',
    'ENTP': 'bg-amber-100 text-amber-800 border-amber-200',
    'INFJ': 'bg-teal-100 text-teal-800 border-teal-200',
    'INFP': 'bg-cyan-100 text-cyan-800 border-cyan-200',
    'ENFJ': 'bg-green-100 text-green-800 border-green-200',
    'ENFP': 'bg-lime-100 text-lime-800 border-lime-200',
    'ISTJ': 'bg-slate-100 text-slate-800 border-slate-200',
    'ISFJ': 'bg-stone-100 text-stone-800 border-stone-200',
    'ESTJ': 'bg-zinc-100 text-zinc-800 border-zinc-200',
    'ESFJ': 'bg-rose-100 text-rose-800 border-rose-200',
    'ISTP': 'bg-gray-100 text-gray-800 border-gray-200',
    'ISFP': 'bg-pink-100 text-pink-800 border-pink-200',
    'ESTP': 'bg-orange-100 text-orange-800 border-orange-200',
    'ESFP': 'bg-fuchsia-100 text-fuchsia-800 border-fuchsia-200',
  };
  return colors[type] || 'bg-gray-100 text-gray-800 border-gray-200';
};
