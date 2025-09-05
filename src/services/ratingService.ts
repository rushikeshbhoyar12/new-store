import { apiService } from './api';

class RatingService {
  async getRatings() {
    return apiService.get('/ratings');
  }

  async createRating(ratingData: any) {
    return apiService.post('/ratings', ratingData);
  }

  async updateRating(id: number, ratingData: any) {
    return apiService.patch(`/ratings/${id}`, ratingData);
  }

  async updateUserStoreRating(storeId: number, rating: number) {
    return apiService.patch('/ratings/user-store-rating', { storeId, rating });
  }

  async deleteRating(id: number) {
    return apiService.delete(`/ratings/${id}`);
  }

  async getMyRatings() {
    return apiService.get('/ratings/my-ratings');
  }

  async getRatingsByStore(storeId: number) {
    return apiService.get(`/ratings/store/${storeId}`);
  }

  async getUserStoreRating(storeId: number) {
    return apiService.get('/ratings/user-store-rating', { storeId: storeId.toString() });
  }

  async getRatingStatistics() {
    return apiService.get('/ratings/statistics');
  }
}

export const ratingService = new RatingService();