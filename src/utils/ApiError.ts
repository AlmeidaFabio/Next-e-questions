import { ApiErrorType } from "@/types/ApiErrorType";

class ApiError extends Error {
    constructor(
      public type: ApiErrorType,
      public status?: number,
      public originalError?: Error
    ) {
      super(`API Error: ${type} ${status ? `(${status})` : ''}`);
      this.name = 'ApiError';
    }
  }

  export default ApiError;