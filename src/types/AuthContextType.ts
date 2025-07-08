import { User } from "@/services/authService";

export interface AuthContextType {
    user: User | null;
    isLoading: boolean;
    isInitialized: boolean;
    isAuthenticated: () => boolean;
    login: (email: string, password: string) => Promise<boolean>;
    logout: () => Promise<void>;
    register: (name: string, email: string, password: string, password_confirmation: string) => Promise<boolean>;
  }