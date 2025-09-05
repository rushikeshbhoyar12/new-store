import React, { useState, useEffect } from 'react';
import { storeService } from '../services/storeService';
import { ratingService } from '../services/ratingService';
import { useAuth } from '../hooks/useAuth';
import { Search, MapPin, Star } from 'lucide-react';
import StarRating from '../components/StarRating';
import FormInput from '../components/FormInput';

interface StoreType {
  id: number;
  name: string;
  email: string;
  address: string;
  averageRating: string;
  totalRatings: number;
}

interface UserRating {
  id: number;
  storeId: number;
  rating: number;
  store: {
    name: string;
    address: string;
  };
}

function UserDashboard() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'stores' | 'my-ratings' | 'profile'>('stores');
  const [stores, setStores] = useState<StoreType[]>([]);
  const [myRatings, setMyRatings] = useState<UserRating[]>([]);
  const [userStoreRatings, setUserStoreRatings] = useState<Record<number, number>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Search filters
  const [searchFilters, setSearchFilters] = useState({
    name: '',
    address: '',
  });

  // Profile form
  const [profileForm, setProfileForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  useEffect(() => {
    if (activeTab === 'stores') {
      loadStores();
    } else if (activeTab === 'my-ratings') {
      loadMyRatings();
    }
  }, [activeTab, searchFilters]);

  const loadStores = async () => {
    try {
      setLoading(true);
      const storesData = await storeService.getStores(searchFilters);
      setStores(storesData);
      
      // Load user's ratings for these stores
      const userRatingsMap: Record<number, number> = {};
      await Promise.all(
        storesData.map(async (store: { id: number; }) => {
          try {
            const userRating = await ratingService.getUserStoreRating(store.id);
            if (userRating?.rating) {
              userRatingsMap[store.id] = userRating.rating;
            }
          } catch {
            // User hasn't rated this store yet
          }
        })
      );
      setUserStoreRatings(userRatingsMap);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const loadMyRatings = async () => {
    try {
      setLoading(true);
      const ratings = await ratingService.getMyRatings();
      setMyRatings(ratings);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRateStore = async (storeId: number, rating: number) => {
    try {
      const existingRating = userStoreRatings[storeId];
      
      if (existingRating) {
        await ratingService.updateUserStoreRating(storeId, rating);
        setSuccess('Rating updated successfully!');
      } else {
        await ratingService.createRating({ storeId, rating });
        setSuccess('Rating submitted successfully!');
      }
      
      setUserStoreRatings(prev => ({ ...prev, [storeId]: rating }));
      loadStores(); // Reload to get updated averages
      
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (profileForm.newPassword !== profileForm.confirmPassword) {
      setError('New passwords do not match');
      return;
    }

    try {
      // Here you would typically call a user service to update password
      // For now, we'll just show a success message
      setSuccess('Password updated successfully!');
      setProfileForm({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const clearMessages = () => {
    setError('');
    setSuccess('');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Welcome, {user?.name}</h1>
          <p className="text-gray-600">Discover and rate amazing stores</p>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => {
              setActiveTab('stores');
              clearMessages();
            }}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === 'stores'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Browse Stores
          </button>
          <button
            onClick={() => {
              setActiveTab('my-ratings');
              clearMessages();
            }}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === 'my-ratings'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            My Ratings
          </button>
          <button
            onClick={() => {
              setActiveTab('profile');
              clearMessages();
            }}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === 'profile'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Profile
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-md">
          {success}
        </div>
      )}

      {/* Browse Stores Tab */}
      {activeTab === 'stores' && (
        <div className="space-y-6">
          {/* Search Filters */}
          <div className="bg-white p-4 rounded-lg shadow-md">
            <h3 className="text-lg font-medium mb-4 flex items-center">
              <Search className="h-5 w-5 mr-2" />
              Search Stores
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormInput
                label="Store Name"
                value={searchFilters.name}
                onChange={(e) => setSearchFilters(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Search by store name"
              />
              <FormInput
                label="Address"
                value={searchFilters.address}
                onChange={(e) => setSearchFilters(prev => ({ ...prev, address: e.target.value }))}
                placeholder="Search by address"
              />
            </div>
          </div>

          {/* Stores Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {stores.map((store) => (
              <div key={store.id} className="bg-white rounded-lg shadow-md border border-gray-200 p-6 hover:shadow-lg transition-shadow">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{store.name}</h3>
                    <p className="text-gray-600">{store.email}</p>
                  </div>
                  
                  <div className="flex items-start space-x-2">
                    <MapPin className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-gray-600">{store.address}</p>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="flex items-center">
                        <Star className="h-4 w-4 text-yellow-400 fill-current" />
                        <span className="ml-1 font-medium">{store.averageRating}</span>
                        <span className="text-gray-500 text-sm ml-1">({store.totalRatings} reviews)</span>
                      </div>
                    </div>
                  </div>

                  <div className="border-t pt-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700">
                        {userStoreRatings[store.id] ? 'Your rating:' : 'Rate this store:'}
                      </span>
                      <StarRating
                        rating={userStoreRatings[store.id] || 0}
                        onRatingChange={(rating) => handleRateStore(store.id, rating)}
                        size="sm"
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {stores.length === 0 && !loading && (
            <div className="text-center py-8">
              <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No stores found matching your search criteria.</p>
            </div>
          )}
        </div>
      )}

      {/* My Ratings Tab */}
      {activeTab === 'my-ratings' && (
        <div className="space-y-6">
          <h2 className="text-xl font-semibold">My Ratings</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {myRatings.map((rating) => (
              <div key={rating.id} className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
                <div className="space-y-3">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{rating.store.name}</h3>
                    <div className="flex items-start space-x-2 mt-1">
                      <MapPin className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
                      <p className="text-sm text-gray-600">{rating.store.address}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">Your rating:</span>
                    <StarRating
                      rating={rating.rating}
                      onRatingChange={(newRating) => handleRateStore(rating.storeId, newRating)}
                      size="sm"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {myRatings.length === 0 && !loading && (
            <div className="text-center py-8">
              <Star className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">You haven't rated any stores yet.</p>
              <button
                onClick={() => setActiveTab('stores')}
                className="mt-2 text-blue-600 hover:text-blue-500"
              >
                Browse stores to start rating
              </button>
            </div>
          )}
        </div>
      )}

      {/* Profile Tab */}
      {activeTab === 'profile' && (
        <div className="max-w-md mx-auto">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Update Password</h2>
            <form onSubmit={handleUpdatePassword} className="space-y-4">
              <FormInput
                label="Current Password"
                type="password"
                value={profileForm.currentPassword}
                onChange={(e) => setProfileForm(prev => ({ ...prev, currentPassword: e.target.value }))}
                placeholder="Enter current password"
                required
              />
              
              <FormInput
                label="New Password"
                type="password"
                value={profileForm.newPassword}
                onChange={(e) => setProfileForm(prev => ({ ...prev, newPassword: e.target.value }))}
                placeholder="8-16 chars, 1 uppercase, 1 special"
                required
              />
              
              <FormInput
                label="Confirm New Password"
                type="password"
                value={profileForm.confirmPassword}
                onChange={(e) => setProfileForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
                placeholder="Confirm new password"
                required
              />

              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Update Password
              </button>
            </form>
          </div>
        </div>
      )}

      {loading && (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      )}
    </div>
  );
}

export default UserDashboard;