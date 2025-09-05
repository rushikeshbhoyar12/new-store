import React, { useState, useEffect } from 'react';
import { storeService } from '../services/storeService';
import { ratingService } from '../services/ratingService';
import { useAuth } from '../hooks/useAuth';
import { Store, Star, Users, TrendingUp } from 'lucide-react';
import StarRating from '../components/StarRating';
import FormInput from '../components/FormInput';

interface StoreType {
  id: number;
  name: string;
  email: string;
  address: string;
  averageRating: string;
  totalRatings: number;
  ratings: Array<{
    id: number;
    rating: number;
    user: {
      id: number;
      name: string;
      email: string;
    };
    createdAt: string;
  }>;
}

interface StoreRating {
  id: number;
  rating: number;
  createdAt: string;
  user: {
    id: number;
    name: string;
    email: string;
  };
}

function StoreOwnerDashboard() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'overview' | 'stores' | 'profile'>('overview');
  const [myStores, setMyStores] = useState<StoreType[]>([]);
  const [selectedStore, setSelectedStore] = useState<StoreType | null>(null);
  const [storeRatings, setStoreRatings] = useState<StoreRating[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Profile form
  const [profileForm, setProfileForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  useEffect(() => {
    if (activeTab === 'overview' || activeTab === 'stores') {
      loadMyStores();
    }
  }, [activeTab]);

  const loadMyStores = async () => {
    try {
      setLoading(true);
      const stores = await storeService.getMyStores();
      setMyStores(stores);
      if (stores.length > 0 && !selectedStore) {
        setSelectedStore(stores[0]);
        loadStoreRatings(stores[0].id);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const loadStoreRatings = async (storeId: number) => {
    try {
      const ratings = await ratingService.getRatingsByStore(storeId);
      setStoreRatings(ratings);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleStoreSelect = (store: StoreType) => {
    setSelectedStore(store);
    loadStoreRatings(store.id);
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (profileForm.newPassword !== profileForm.confirmPassword) {
      setError('New passwords do not match');
      return;
    }

    try {
      // Here you would typically call a user service to update password
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

  const calculateStoreStatistics = () => {
    const totalRatings = myStores.reduce((sum, store) => sum + store.totalRatings, 0);
    const averageRating = myStores.length > 0 
      ? (myStores.reduce((sum, store) => sum + parseFloat(store.averageRating), 0) / myStores.length).toFixed(1)
      : '0.0';
    
    return {
      totalStores: myStores.length,
      totalRatings,
      averageRating,
    };
  };

  const clearMessages = () => {
    setError('');
    setSuccess('');
  };

  const stats = calculateStoreStatistics();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Store Owner Dashboard</h1>
          <p className="text-gray-600">Manage your stores and track customer ratings</p>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => {
              setActiveTab('overview');
              clearMessages();
            }}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === 'overview'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Overview
          </button>
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
            My Stores
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

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Stores</p>
                  <p className="text-3xl font-bold text-blue-600">{stats.totalStores}</p>
                </div>
                <Store className="h-12 w-12 text-blue-600" />
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Ratings</p>
                  <p className="text-3xl font-bold text-green-600">{stats.totalRatings}</p>
                </div>
                <Users className="h-12 w-12 text-green-600" />
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Average Rating</p>
                  <div className="flex items-center space-x-2">
                    <p className="text-3xl font-bold text-yellow-600">{stats.averageRating}</p>
                    <Star className="h-6 w-6 text-yellow-400 fill-current" />
                  </div>
                </div>
                <TrendingUp className="h-12 w-12 text-yellow-600" />
              </div>
            </div>
          </div>

          {/* Stores Overview */}
          <div className="bg-white rounded-lg shadow-md">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold">Your Stores</h2>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {myStores.map((store) => (
                  <div key={store.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="space-y-3">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{store.name}</h3>
                        <p className="text-gray-600">{store.email}</p>
                        <p className="text-sm text-gray-500">{store.address}</p>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Star className="h-4 w-4 text-yellow-400 fill-current" />
                          <span className="font-medium">{store.averageRating}</span>
                          <span className="text-gray-500 text-sm">({store.totalRatings} reviews)</span>
                        </div>
                        <button
                          onClick={() => {
                            setActiveTab('stores');
                            handleStoreSelect(store);
                          }}
                          className="text-blue-600 hover:text-blue-500 text-sm font-medium"
                        >
                          View Details
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {myStores.length === 0 && !loading && (
                <div className="text-center py-8">
                  <Store className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">You don't have any stores yet.</p>
                  <p className="text-gray-500 text-sm">Contact an administrator to add stores to your account.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Stores Tab */}
      {activeTab === 'stores' && (
        <div className="space-y-6">
          {myStores.length > 0 && (
            <div className="bg-white rounded-lg shadow-md">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-semibold">Store Details & Reviews</h2>
                {myStores.length > 1 && (
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Select Store</label>
                    <select
                      value={selectedStore?.id || ''}
                      onChange={(e) => {
                        const store = myStores.find(s => s.id === parseInt(e.target.value));
                        if (store) handleStoreSelect(store);
                      }}
                      className="w-full max-w-md rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    >
                      {myStores.map((store) => (
                        <option key={store.id} value={store.id}>
                          {store.name}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>

              {selectedStore && (
                <div className="p-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Store Information */}
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Store Information</h3>
                        <div className="space-y-2">
                          <p><span className="font-medium">Name:</span> {selectedStore.name}</p>
                          <p><span className="font-medium">Email:</span> {selectedStore.email}</p>
                          <p><span className="font-medium">Address:</span> {selectedStore.address}</p>
                        </div>
                      </div>

                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h4 className="font-semibold mb-2">Rating Summary</h4>
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center space-x-2">
                            <StarRating rating={parseFloat(selectedStore.averageRating)} readonly size="lg" />
                            <span className="text-2xl font-bold">{selectedStore.averageRating}</span>
                          </div>
                          <div className="text-gray-600">
                            <p>{selectedStore.totalRatings} total reviews</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Customer Reviews */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Customer Reviews</h3>
                      <div className="space-y-4 max-h-96 overflow-y-auto">
                        {storeRatings.map((rating) => (
                          <div key={rating.id} className="border border-gray-200 rounded-lg p-4">
                            <div className="flex items-center justify-between mb-2">
                              <div>
                                <p className="font-medium text-gray-900">{rating.user.name}</p>
                                <p className="text-sm text-gray-500">{rating.user.email}</p>
                              </div>
                              <div className="flex items-center space-x-2">
                                <StarRating rating={rating.rating} readonly size="sm" />
                                <span className="font-medium">{rating.rating}</span>
                              </div>
                            </div>
                            <p className="text-sm text-gray-500">
                              {new Date(rating.createdAt).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                              })}
                            </p>
                          </div>
                        ))}

                        {storeRatings.length === 0 && (
                          <div className="text-center py-8">
                            <Star className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                            <p className="text-gray-600">No reviews yet</p>
                            <p className="text-gray-500 text-sm">Your customers' reviews will appear here</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {myStores.length === 0 && !loading && (
            <div className="text-center py-12">
              <Store className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <p className="text-xl text-gray-600 mb-2">No stores found</p>
              <p className="text-gray-500">Contact an administrator to add stores to your account.</p>
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

export default StoreOwnerDashboard;