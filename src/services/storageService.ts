import { QuizState } from '@/types/QuizState';
import { StorageData, UserStats, SavedQuiz, AppSettings, SubjectProgress } from '@/types/Storage';

const STORAGE_KEYS = {
  USER_STATS: 'user_stats',
  SAVED_QUIZZES: 'saved_quizzes',
  CURRENT_QUIZ: 'current_quiz',
  SETTINGS: 'app_settings',
} as const;

// Dados padrão
const defaultUserStats: UserStats = {
  totalQuizzes: 0,
  totalQuestions: 0,
  totalCorrect: 0,
  averageScore: 0,
  totalTimeSpent: 0,
  lastQuizDate: null,
  subjectsProgress: {},
};

const defaultSettings: AppSettings = {
  theme: 'dark',
  soundEnabled: true,
  hapticEnabled: true,
  autoSave: true,
};

// Funções auxiliares
const generateQuizId = (): string => {
  return `quiz_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

const calculateAverageScore = (totalCorrect: number, totalQuestions: number): number => {
  return totalQuestions > 0 ? Math.round((totalCorrect / totalQuestions) * 100) : 0;
};

const getUserKey = (base: string, userId: string) => `${base}_${userId}`;

// Serviço de Storage
export class StorageService {
  // Carregar dados do usuário
  static async loadUserStats(userId: string): Promise<UserStats> {
    try {
      const key = getUserKey(STORAGE_KEYS.USER_STATS, userId);
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : defaultUserStats;
    } catch (error) {
      console.error('Error loading user stats:', error);
      return defaultUserStats;
    }
  }

  // Salvar dados do usuário
  static async saveUserStats(userId: string, stats: UserStats): Promise<void> {
    try {
      const key = getUserKey(STORAGE_KEYS.USER_STATS, userId);
      localStorage.setItem(key, JSON.stringify(stats));
    } catch (error) {
      console.error('Error saving user stats:', error);
    }
  }

  // Carregar quizzes salvos
  static async loadSavedQuizzes(userId: string): Promise<SavedQuiz[]> {
    try {
      const key = getUserKey(STORAGE_KEYS.SAVED_QUIZZES, userId);
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error loading saved quizzes:', error);
      return [];
    }
  }

  // Salvar quiz
  static async saveQuiz(userId: string, quizState: QuizState): Promise<void> {
    try {
      const savedQuizzes = await this.loadSavedQuizzes(userId);
      const newQuiz: SavedQuiz = {
        id: generateQuizId(),
        date: new Date().toISOString(),
        questions: quizState.questions,
        answers: quizState.answers,
        score: quizState.score,
        totalQuestions: quizState.questions.length,
        subjects: quizState.selectedSubjects,
        timeSpent: quizState.elapsedTime,
      };
      const updatedQuizzes = [newQuiz, ...savedQuizzes].slice(0, 50);
      const key = getUserKey(STORAGE_KEYS.SAVED_QUIZZES, userId);
      localStorage.setItem(key, JSON.stringify(updatedQuizzes));
      await this.updateUserStats(userId, newQuiz);
    } catch (error) {
      console.error('Error saving quiz:', error);
    }
  }

  // Carregar quiz atual
  static async loadCurrentQuiz(userId: string): Promise<Partial<QuizState> | null> {
    try {
      const key = getUserKey(STORAGE_KEYS.CURRENT_QUIZ, userId);
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Error loading current quiz:', error);
      return null;
    }
  }

  // Salvar quiz atual
  static async saveCurrentQuiz(userId: string, quizState: Partial<QuizState>): Promise<void> {
    try {
      const key = getUserKey(STORAGE_KEYS.CURRENT_QUIZ, userId);
      localStorage.setItem(key, JSON.stringify(quizState));
    } catch (error) {
      console.error('Error saving current quiz:', error);
    }
  }

  // Limpar quiz atual
  static async clearCurrentQuiz(userId: string): Promise<void> {
    try {
      const key = getUserKey(STORAGE_KEYS.CURRENT_QUIZ, userId);
      localStorage.removeItem(key);
    } catch (error) {
      console.error('Error clearing current quiz:', error);
    }
  }

  // Carregar configurações
  static async loadSettings(userId: string): Promise<AppSettings> {
    try {
      const key = getUserKey(STORAGE_KEYS.SETTINGS, userId);
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : defaultSettings;
    } catch (error) {
      console.error('Error loading settings:', error);
      return defaultSettings;
    }
  }

  // Salvar configurações
  static async saveSettings(userId: string, settings: AppSettings): Promise<void> {
    try {
      const key = getUserKey(STORAGE_KEYS.SETTINGS, userId);
      localStorage.setItem(key, JSON.stringify(settings));
    } catch (error) {
      console.error('Error saving settings:', error);
    }
  }

  // Atualizar estatísticas do usuário
  private static async updateUserStats(userId: string, quiz: SavedQuiz): Promise<void> {
    try {
      const currentStats = await this.loadUserStats(userId);
      const newTotalQuizzes = currentStats.totalQuizzes + 1;
      const newTotalQuestions = currentStats.totalQuestions + quiz.totalQuestions;
      const newTotalCorrect = currentStats.totalCorrect + quiz.score;
      const newTotalTimeSpent = currentStats.totalTimeSpent + quiz.timeSpent;
      const updatedStats: UserStats = {
        ...currentStats,
        totalQuizzes: newTotalQuizzes,
        totalQuestions: newTotalQuestions,
        totalCorrect: newTotalCorrect,
        averageScore: calculateAverageScore(newTotalCorrect, newTotalQuestions),
        totalTimeSpent: newTotalTimeSpent,
        lastQuizDate: quiz.date,
        subjectsProgress: this.updateSubjectProgress(currentStats.subjectsProgress, quiz),
      };
      await this.saveUserStats(userId, updatedStats);
    } catch (error) {
      console.error('Error updating user stats:', error);
    }
  }

  // Atualizar progresso por assunto
  private static updateSubjectProgress(
    currentProgress: Record<string, SubjectProgress>,
    quiz: SavedQuiz
  ): Record<string, SubjectProgress> {
    const updatedProgress = { ...currentProgress };

    quiz.subjects.forEach(subject => {
      const subjectQuestions = quiz.questions.filter(q => q.subject === subject).length;
      const subjectCorrect = quiz.questions
        .filter(q => q.subject === subject)
        .reduce((acc, q) => {
          const questionIndex = quiz.questions.indexOf(q);
          const userAnswer = quiz.answers[questionIndex];
          return acc + (userAnswer === q.answer ? 1 : 0);
        }, 0);

      if (updatedProgress[subject]) {
        const current = updatedProgress[subject];
        const newTotalQuestions = current.totalQuestions + subjectQuestions;
        const newTotalCorrect = current.correctAnswers + subjectCorrect;
        
        updatedProgress[subject] = {
          totalQuestions: newTotalQuestions,
          correctAnswers: newTotalCorrect,
          averageScore: calculateAverageScore(newTotalCorrect, newTotalQuestions),
          lastQuizDate: quiz.date,
        };
      } else {
        updatedProgress[subject] = {
          totalQuestions: subjectQuestions,
          correctAnswers: subjectCorrect,
          averageScore: calculateAverageScore(subjectCorrect, subjectQuestions),
          lastQuizDate: quiz.date,
        };
      }
    });

    return updatedProgress;
  }

  // Limpar todos os dados do usuário
  static async clearAllData(userId: string): Promise<void> {
    try {
      Object.keys(localStorage).forEach(key => {
        if (key.includes(userId)) {
          localStorage.removeItem(key);
        }
      });
    } catch (error) {
      console.error('Error clearing all data:', error);
    }
  }

  // Exportar dados do usuário
  static async exportData(userId: string): Promise<StorageData> {
    try {
      const [userStats, savedQuizzes, settings] = await Promise.all([
        this.loadUserStats(userId),
        this.loadSavedQuizzes(userId),
        this.loadSettings(userId),
      ]);

      return {
        userStats,
        savedQuizzes,
        settings,
      };
    } catch (error) {
      console.error('Error exporting data:', error);
      throw error;
    }
  }

  // Importar dados do usuário
  static async importData(userId: string, data: StorageData): Promise<void> {
    try {
      await Promise.all([
        this.saveUserStats(userId, data.userStats),
        this.saveSettings(userId, data.settings),
      ]);

      // Salvar quizzes importados
      const key = getUserKey(STORAGE_KEYS.SAVED_QUIZZES, userId);
      localStorage.setItem(key, JSON.stringify(data.savedQuizzes));
    } catch (error) {
      console.error('Error importing data:', error);
      throw error;
    }
  }
} 