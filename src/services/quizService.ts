import { Question } from "../types/Question";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

if (!API_URL) {
  throw new Error('API_URL environment variable is not defined');
}

export const fetchQuestions = async (subject?: string): Promise<Question[]> => {
  try {
    const baseUrl = API_URL.endsWith('/') ? API_URL.slice(0, -1) : API_URL;
    const url = subject ? `${baseUrl}/questions?subject=${encodeURIComponent(subject)}` : `${baseUrl}/questions`;
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Failed to fetch questions');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching questions:', error);
    throw error;
  }
};