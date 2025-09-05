import { apiService } from './api';

class UserService {
  async getUsers(filters?: any) {
    return apiService.get('/users', filters);
  }

  async getUser(id: number) {
    return apiService.get(`/users/${id}`);
  }

  async createUser(userData: any) {
    return apiService.post('/users', userData);
  }

  async updateUser(id: number, userData: any) {
    return apiService.patch(`/users/${id}`, userData);
  }

  async deleteUser(id: number) {
    return apiService.delete(`/users/${id}`);
  }

  async getUserStatistics() {
    return apiService.get('/users/statistics');
  }
}

export const userService = new UserService();