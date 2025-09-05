import { apiService } from './api';

class StoreService {
  async getStores(filters?: any) {
    return apiService.get('/stores', filters);
  }

  async getStore(id: number) {
    return apiService.get(`/stores/${id}`);
  }

  async createStore(storeData: any) {
    return apiService.post('/stores', storeData);
  }

  async updateStore(id: number, storeData: any) {
    return apiService.patch(`/stores/${id}`, storeData);
  }

  async deleteStore(id: number) {
    return apiService.delete(`/stores/${id}`);
  }

  async getStoreStatistics() {
    return apiService.get('/stores/statistics');
  }

  async getMyStores() {
    return apiService.get('/stores/my-stores');
  }
}

export const storeService = new StoreService();