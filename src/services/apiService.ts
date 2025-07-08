import { ApiErrorType } from "@/types/ApiErrorType";
import ApiError from "@/utils/ApiError";

export class ApiService {
  private readonly baseUrl: string;
  private readonly defaultRetryAttempts = 3;
  private readonly retryDelay = 1000;

  constructor() {
    const API_URL = process.env.NEXT_PUBLIC_API_URL;
    if (!API_URL) throw new Error('API_URL environment variable is not defined');
    
    this.baseUrl = API_URL.endsWith('/') ? API_URL.slice(0, -1) : API_URL;
  }

  private async handleRequest<T>(
    endpoint: string, 
    options?: RequestInit,
    retryAttempts: number = this.defaultRetryAttempts
  ): Promise<T> {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        ...options,
        signal: controller.signal,
      });
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        throw new ApiError(
          this.getErrorType(response.status),
          response.status
        );
      }

      return await response.json();
    } catch (error) {
      console.error(`API request error: ${endpoint}`, error);
      
      // Retry logic for network errors
      if (retryAttempts > 0 && this.shouldRetry(error)) {
        console.log(`Retrying request to ${endpoint}, attempts left: ${retryAttempts - 1}`);
        await this.delay(this.retryDelay);
        return this.handleRequest<T>(endpoint, options, retryAttempts - 1);
      }
      
      throw error;
    }
  }

  private getErrorType(status: number): ApiErrorType {
    switch (status) {
      case 401: return ApiErrorType.UNAUTHORIZED;
      case 404: return ApiErrorType.NOT_FOUND;
      case 400: return ApiErrorType.VALIDATION_ERROR;
      case 500:
      case 502:
      case 503:
      case 504: return ApiErrorType.SERVER_ERROR;
      default: return ApiErrorType.UNKNOWN_ERROR;
    }
  }

  private shouldRetry(error: unknown): boolean {
    return error instanceof TypeError || // Network errors
           (error instanceof ApiError && error.type === ApiErrorType.SERVER_ERROR);
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private getAuthHeaders(token: string): Record<string, string> {
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    };
  }

  // Public methods with consistent error handling
  public async get<T>(endpoint: string): Promise<T> {
    return this.handleRequest<T>(endpoint);
  }

  public async post<T>(endpoint: string, data: Record<string, unknown>, token: string): Promise<T> {
    return this.handleRequest<T>(endpoint, {
      method: 'POST',
      headers: this.getAuthHeaders(token),
      body: JSON.stringify(data),
    });
  }

  public async put<T>(endpoint: string, data: Record<string, unknown>, token: string): Promise<T> {
    return this.handleRequest<T>(endpoint, {
      method: 'PUT',
      headers: this.getAuthHeaders(token),
      body: JSON.stringify(data),
    });
  }

  public async delete<T>(endpoint: string, token: string): Promise<T> {
    return this.handleRequest<T>(endpoint, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
  }

  // Health check method
  public async healthCheck(): Promise<boolean> {
    try {
      await this.get('/health');
      return true;
    } catch {
      return false;
    }
  }
}

export default new ApiService();