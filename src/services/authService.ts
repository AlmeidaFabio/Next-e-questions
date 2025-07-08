const API_URL = process.env.NEXT_PUBLIC_API_URL;

export interface User {
  id: string;
  name: string;
  email: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

// Função auxiliar para verificar se estamos no cliente
function isClient() {
  return typeof window !== 'undefined';
}

// Função auxiliar para acessar localStorage com segurança
function getLocalStorageItem(key: string): string | null {
  if (!isClient()) return null;
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

function setLocalStorageItem(key: string, value: string): void {
  if (!isClient()) return;
  try {
    localStorage.setItem(key, value);
  } catch (error) {
    console.error('Erro ao salvar no localStorage:', error);
  }
}

function removeLocalStorageItem(key: string): void {
  if (!isClient()) return;
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error('Erro ao remover do localStorage:', error);
  }
}

class AuthService {
  async login(email: string, password: string): Promise<User | null> {
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      if (!response.ok) {
        return null;
      }
      const data: AuthResponse = await response.json();
      setLocalStorageItem('@token', data.token);
      setLocalStorageItem('@user', JSON.stringify(data.user));
      return data.user;
    } catch (error) {
      console.error('Erro no login:', error);
      return null;
    }
  }

  async register(name: string, email: string, password: string, password_confirmation: string): Promise<User | null> {
    try {
      const response = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, password_confirmation }),
      });
      if (!response.ok) {
        return null;
      }
      const data: AuthResponse = await response.json();
      setLocalStorageItem('@token', data.token);
      setLocalStorageItem('@user', JSON.stringify(data.user));
      return data.user;
    } catch (error) {
      console.error('Erro no registro:', error);
      return null;
    }
  }

  async getAuthenticatedUser(): Promise<User | null> {
    const token = await this.getToken();
    if (!token) return null;
    
    try {
      const response = await fetch(`${API_URL}/user`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      
      if (response.status === 401) {
        // Token expirado ou inválido
        await this.logout();
        return null;
      }
      
      if (!response.ok) return null;
      const user: User = await response.json();
      setLocalStorageItem('@user', JSON.stringify(user));
      return user;
    } catch {
      return null;
    }
  }

  async logout() {
    try {
      const token = await this.getToken();
      if (token) {
        // Tentar fazer logout no servidor
        await fetch(`${API_URL}/auth/logout`, {
          method: 'POST',
          headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
        });
      }
    } catch {
      // Ignorar erros de logout no servidor
    } finally {
      // Sempre limpar o localStorage
      removeLocalStorageItem('@token');
      removeLocalStorageItem('@user');
    }
  }

  async getCurrentUser(): Promise<User | null> {
    // Primeiro verificar se há dados no localStorage
    const cachedUser = getLocalStorageItem('@user');
    const token = getLocalStorageItem('@token');
    
    if (!token || !cachedUser) {
      return null;
    }

    try {
      // Parsear dados do cache
      const user = JSON.parse(cachedUser);
      
      // Retornar usuário do cache imediatamente
      // A validação será feita apenas quando necessário (ex: ao fazer requisições)
      return user;
    } catch (error) {
      // Erro ao parsear dados do localStorage
      console.error('Erro ao parsear dados do localStorage:', error);
      removeLocalStorageItem('@user');
      return null;
    }
  }

  async getToken(): Promise<string | null> {
    return getLocalStorageItem('@token');
  }

  async validateToken(): Promise<boolean> {
    const token = await this.getToken();
    if (!token) return false;

    try {
      const response = await fetch(`${API_URL}/auth/validate`, {
        method: 'GET',
        headers: { 'Authorization': `Bearer ${token}` },
      });
      return response.ok;
    } catch {
      return false;
    }
  }

  // Método para verificar se o usuário está autenticado sem fazer requisição ao servidor
  isAuthenticated(): boolean {
    const token = getLocalStorageItem('@token');
    const user = getLocalStorageItem('@user');
    return !!(token && user);
  }

  // Método para limpar dados de autenticação
  clearAuthData() {
    removeLocalStorageItem('@token');
    removeLocalStorageItem('@user');
  }
}

export const authService = new AuthService(); 