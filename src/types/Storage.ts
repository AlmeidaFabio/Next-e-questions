import { QuizState } from './QuizState';

export interface UserStats {
  totalQuizzes: number;
  totalQuestions: number;
  totalCorrect: number;
  averageScore: number;
  totalTimeSpent: number;
  lastQuizDate: string | null;
  subjectsProgress: Record<string, SubjectProgress>;
}

export interface SubjectProgress {
  totalQuestions: number;
  correctAnswers: number;
  averageScore: number;
  lastQuizDate: string | null;
}

export interface SavedQuiz {
  id: string;
  date: string;
  questions: QuizState['questions'];
  answers: QuizState['answers'];
  score: number;
  totalQuestions: number;
  subjects: string[];
  timeSpent: number;
}

export interface StorageData {
  userStats: UserStats;
  savedQuizzes: SavedQuiz[];
  currentQuiz?: Partial<QuizState>;
  settings: AppSettings;
}

export interface AppSettings {
  theme: 'light' | 'dark' | 'auto';
  soundEnabled: boolean;
  hapticEnabled: boolean;
  autoSave: boolean;
} 