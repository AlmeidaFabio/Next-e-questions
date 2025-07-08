import { Edital } from '@/types/Question';
import apiService from './apiService';

class EditalService {
  async fetchAll(): Promise<Edital[]> {
    return apiService.get<Edital[]>('/editais');
  }

  async fetchById(id: number): Promise<Edital> {
    return apiService.get<Edital>(`/editais/${id}`);
  }

  async create(edital: Partial<Edital>, token: string): Promise<Edital> {
    return apiService.post<Edital>('/editais', edital, token);
  }

  async update(id: number, edital: Partial<Edital>, token: string): Promise<Edital> {
    return apiService.put<Edital>(`/editais/${id}`, edital, token);
  }

  async delete(id: number, token: string): Promise<void> {
    await apiService.delete<void>(`/editais/${id}`, token);
  }

  async fetchSubjects(editalId: number): Promise<string[]> {
    return apiService.get<string[]>(`/editais/${editalId}/subjects`);
  }
}

export default new EditalService();