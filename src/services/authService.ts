import { apiService } from './api';

class AuthService {
  async login(email: string, password: string) {
    return apiService.post('/auth/login', { email, password });
  }

  async register(userData: any) {
    return apiService.post('/auth/register', userData);
  }
}

export const authService = new AuthService();