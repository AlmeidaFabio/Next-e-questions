import { Question } from '@/types/Question';
import apiService from './apiService';
import ApiError from '@/utils/ApiError';
import { ApiErrorType } from '@/types/ApiErrorType';

export class QuestionService {
  private readonly cacheKeys = {
    QUESTIONS_BY_SUBJECT: 'questions_by_subject_',
    ALL_QUESTIONS: 'all_questions',
  };

  async fetchQuestions(subject?: string): Promise<Question[]> {
    try {
      const endpoint = subject 
        ? `/questions?subject=${encodeURIComponent(subject)}` 
        : '/questions';
      
      const questions = await apiService.get<Question[]>(endpoint);
      
      return questions;
    } catch (error) {
      console.error('Error fetching questions:', error);
      throw error;
    }
  }

  async fetchQuestionsByEdital(editalId: number): Promise<Question[]> {
    try {
      const questions = await apiService.get<Question[]>(`/editais/${editalId}/questions`);
      return Array.isArray(questions) ? questions : [];
    } catch (error) {
      console.error(`Error fetching questions for edital ${editalId}:`, error);
      throw error;
    }
  }

  async fetchQuestionsByEditalAndSubject(editalId: number, subject: string): Promise<Question[]> {
    try {
      const endpoint = `/editais/${editalId}/questions/subject/${encodeURIComponent(subject)}`;
      const questions = await apiService.get<Question[]>(endpoint);
      return Array.isArray(questions) ? questions : [];
    } catch (error) {
      console.error(`Error fetching questions for edital ${editalId} and subject ${subject}:`, error);
      throw error;
    }
  }

  // Utility methods
  async getQuestionsCount(subject?: string): Promise<number> {
    try {
      const questions = await this.fetchQuestions(subject);
      return questions.length;
    } catch (error) {
      console.error('Error getting questions count:', error);
      return 0;
    }
  }

  async preloadQuestions(subjects: string[]): Promise<void> {
    const preloadPromises = subjects.map(subject => 
      this.fetchQuestions(subject).catch(error => {
        console.error(`Failed to preload questions for subject ${subject}:`, error);
      })
    );
    
    await Promise.allSettled(preloadPromises);
  }
}

export default new QuestionService();