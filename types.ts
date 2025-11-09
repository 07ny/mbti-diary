export interface MBTIScores {
  EI: number; // Extroversion vs Introversion
  SN: number; // Sensing vs Intuition
  TF: number; // Thinking vs Feeling
  JP: number; // Judging vs Perceiving
}

export interface Entry {
  id: string;
  date: string;
  content: string;
  mbtiScores: MBTIScores;
  mbtiType: string;
}

export type ToastType = 'success' | 'error';

export interface Toast {
  id: number;
  message: string;
  type: ToastType;
}

export type ActiveTab = 'calendar' | 'dashboard' | 'analysis';