import React, { useState, useEffect } from 'react';
import { userService } from '../services/userService';
import { storeService } from '../services/storeService';
import { ratingService } from '../services/ratingService';
import { Users, Store, Star, Plus, Search, Filter, Eye, Edit, Trash2, ChevronUp, ChevronDown } from 'lucide-react';
import FormInput from '../components/FormInput';

interface User {
  id: number;
  name: string;
  email: string;
  address: string;
  role: string;
  createdAt: string;
  stores?: any[];
}

interface StoreType {
  id: number;
  name: string;
  email: string;
  address: string;
  averageRating: string;
  totalRatings: number;
  createdAt: string;
}

interface Statistics {
  users: { total: number; admins: number; users: number; storeOwners: number };
  stores: { total: number };
  ratings: { total: number };
}

function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'users' | 'stores'>('dashboard');
  const [statistics, setStatistics] = useState<Statistics | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [stores, setStores] = useState<StoreType[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Filters
  const [userFilters, setUserFilters] = useState({
    name: '',
    email: '',
    address: '',
    role: '',
  });
  const [storeFilters, setStoreFilters] = useState({
    name: '',
    email: '',
    address: '',
  });

  // Modals
  const [showUserModal, setShowUserModal] = useState(false);
  const [showStoreModal, setShowStoreModal] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [editingStore, setEditingStore] = useState<StoreType | null>(null);

  // Form states
  const [userForm, setUserForm] = useState({
    name: '',
    email: '',
    password: '',
    address: '',
    role: 'user',
  });
  const [storeForm, setStoreForm] = useState({
    name: '',
    email: '',
    address: '',
  });

  // Sorting
  const [userSort, setUserSort] = useState<{ field: string; direction: 'asc' | 'desc' }>({
    field: 'name',
    direction: 'asc',
  });
  const [storeSort, setStoreSort] = useState<{ field: string; direction: 'asc' | 'desc' }>({
    field: 'name',
    direction: 'asc',
  });

  useEffect(() => {
    loadStatistics();
  }, []);

  useEffect(() => {
    if (activeTab === 'users') {
      loadUsers();
    } else if (activeTab === 'stores') {
      loadStores();
    }
  }, [activeTab, userFilters, storeFilters]);

  const loadStatistics = async () => {
    try {
      setLoading(true);
      const [userStats, storeStats, ratingStats] = await Promise.all([
        userService.getUserStatistics(),
        storeService.getStoreStatistics(),
        ratingService.getRatingStatistics(),
      ]);
      setStatistics({
        users: userStats,
        stores: storeStats,
        ratings: ratingStats,
      });
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const loadUsers = async () => {
    try {
      setLoading(true);
      const response = await userService.getUsers(userFilters);
      setUsers(response);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const loadStores = async () => {
    try {
      setLoading(true);
      const response = await storeService.getStores(storeFilters);
      setStores(response);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateUser = async () => {
    try {
      await userService.createUser(userForm);
      setShowUserModal(false);
      resetUserForm();
      loadUsers();
      loadStatistics();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleCreateStore = async () => {
    try {
      await storeService.createStore(storeForm);
      setShowStoreModal(false);
      resetStoreForm();
      loadStores();
      loadStatistics();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleDeleteUser = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await userService.deleteUser(id);
        loadUsers();
        loadStatistics();
      } catch (err: any) {
        setError(err.message);
      }
    }
  };

  const handleDeleteStore = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this store?')) {
      try {
        await storeService.deleteStore(id);
        loadStores();
        loadStatistics();
      } catch (err: any) {
        setError(err.message);
      }
    }
  };

  const resetUserForm = () => {
    setUserForm({
      name: '',
      email: '',
      password: '',
      address: '',
      role: 'user',
    });
    setEditingUser(null);
  };

  const resetStoreForm = () => {
    setStoreForm({
      name: '',
      email: '',
      address: '',
    });
    setEditingStore(null);
  };

  const sortUsers = (field: string) => {
    const direction = userSort.field === field && userSort.direction === 'asc' ? 'desc' : 'asc';
    setUserSort({ field, direction });
    
    const sorted = [...users].sort((a, b) => {
      const aValue = a[field as keyof User] || '';
      const bValue = b[field as keyof User] || '';
      
      if (direction === 'asc') {
        return aValue.toString().localeCompare(bValue.toString());
      }
      return bValue.toString().localeCompare(aValue.toString());
    });
    
    setUsers(sorted);
  };

  const sortStores = (field: string) => {
    const direction = storeSort.field === field && storeSort.direction === 'asc' ? 'desc' : 'asc';
    setStoreSort({ field, direction });
    
    const sorted = [...stores].sort((a, b) => {
      const aValue = a[field as keyof StoreType] || '';
      const bValue = b[field as keyof StoreType] || '';
      
      if (direction === 'asc') {
        return aValue.toString().localeCompare(bValue.toString());
      }
      return bValue.toString().localeCompare(aValue.toString());
    });
    
    setStores(sorted);
  };

  const SortButton = ({ field, currentSort, onSort }: any) => (
    <button
      onClick={() => onSort(field)}
      className="ml-1 text-gray-400 hover:text-gray-600"
    >
      {currentSort.field === field ? (
        currentSort.direction === 'asc' ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />
      ) : (
        <ChevronUp className="h-4 w-4 opacity-50" />
      )}
    </button>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
        <div className="flex space-x-2">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === 'dashboard'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Dashboard
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === 'users'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Users
          </button>
          <button
            onClick={() => setActiveTab('stores')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === 'stores'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Stores
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md">
          {error}
        </div>
      )}

      {/* Dashboard Statistics */}
      {activeTab === 'dashboard' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Users</p>
                <p className="text-3xl font-bold text-blue-600">{statistics?.users.total || 0}</p>
                <div className="mt-2 text-sm text-gray-500">
                  <span>Admins: {statistics?.users.admins || 0}</span> •{' '}
                  <span>Users: {statistics?.users.users || 0}</span> •{' '}
                  <span>Store Owners: {statistics?.users.storeOwners || 0}</span>
                </div>
              </div>
              <Users className="h-12 w-12 text-blue-600" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Stores</p>
                <p className="text-3xl font-bold text-green-600">{statistics?.stores.total || 0}</p>
              </div>
              <Store className="h-12 w-12 text-green-600" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Ratings</p>
                <p className="text-3xl font-bold text-yellow-600">{statistics?.ratings.total || 0}</p>
              </div>
              <Star className="h-12 w-12 text-yellow-600" />
            </div>
          </div>
        </div>
      )}

      {/* Users Management */}
      {activeTab === 'users' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">User Management</h2>
            <button
              onClick={() => setShowUserModal(true)}
              className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="h-4 w-4" />
              <span>Add User</span>
            </button>
          </div>

          {/* User Filters */}
          <div className="bg-white p-4 rounded-lg shadow-md">
            <h3 className="text-lg font-medium mb-4">Filters</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <FormInput
                label="Name"
                value={userFilters.name}
                onChange={(e) => setUserFilters(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Filter by name"
              />
              <FormInput
                label="Email"
                value={userFilters.email}
                onChange={(e) => setUserFilters(prev => ({ ...prev, email: e.target.value }))}
                placeholder="Filter by email"
              />
              <FormInput
                label="Address"
                value={userFilters.address}
                onChange={(e) => setUserFilters(prev => ({ ...prev, address: e.target.value }))}
                placeholder="Filter by address"
              />
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                <select
                  value={userFilters.role}
                  onChange={(e) => setUserFilters(prev => ({ ...prev, role: e.target.value }))}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  <option value="">All Roles</option>
                  <option value="admin">Admin</option>
                  <option value="user">User</option>
                  <option value="store_owner">Store Owner</option>
                </select>
              </div>
            </div>
          </div>

          {/* Users Table */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <div className="flex items-center">
                      Name
                      <SortButton field="name" currentSort={userSort} onSort={sortUsers} />
                    </div>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <div className="flex items-center">
                      Email
                      <SortButton field="email" currentSort={userSort} onSort={sortUsers} />
                    </div>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Address
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <div className="flex items-center">
                      Role
                      <SortButton field="role" currentSort={userSort} onSort={sortUsers} />
                    </div>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium text-gray-900">{user.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-700">
                      {user.email}
                    </td>
                    <td className="px-6 py-4 text-gray-700">
                      <div className="max-w-xs truncate">{user.address}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        user.role === 'admin'
                          ? 'bg-red-100 text-red-800'
                          : user.role === 'store_owner'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-green-100 text-green-800'
                      }`}>
                        {user.role.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleDeleteUser(user.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Stores Management */}
      {activeTab === 'stores' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Store Management</h2>
            <button
              onClick={() => setShowStoreModal(true)}
              className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
            >
              <Plus className="h-4 w-4" />
              <span>Add Store</span>
            </button>
          </div>

          {/* Store Filters */}
          <div className="bg-white p-4 rounded-lg shadow-md">
            <h3 className="text-lg font-medium mb-4">Filters</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormInput
                label="Name"
                value={storeFilters.name}
                onChange={(e) => setStoreFilters(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Filter by name"
              />
              <FormInput
                label="Email"
                value={storeFilters.email}
                onChange={(e) => setStoreFilters(prev => ({ ...prev, email: e.target.value }))}
                placeholder="Filter by email"
              />
              <FormInput
                label="Address"
                value={storeFilters.address}
                onChange={(e) => setStoreFilters(prev => ({ ...prev, address: e.target.value }))}
                placeholder="Filter by address"
              />
            </div>
          </div>

          {/* Stores Table */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <div className="flex items-center">
                      Name
                      <SortButton field="name" currentSort={storeSort} onSort={sortStores} />
                    </div>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <div className="flex items-center">
                      Email
                      <SortButton field="email" currentSort={storeSort} onSort={sortStores} />
                    </div>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Address
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <div className="flex items-center">
                      Rating
                      <SortButton field="averageRating" currentSort={storeSort} onSort={sortStores} />
                    </div>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {stores.map((store) => (
                  <tr key={store.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium text-gray-900">{store.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-700">
                      {store.email}
                    </td>
                    <td className="px-6 py-4 text-gray-700">
                      <div className="max-w-xs truncate">{store.address}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Star className="h-4 w-4 text-yellow-400 fill-current mr-1" />
                        <span className="font-medium">{store.averageRating}</span>
                        <span className="text-gray-500 ml-1">({store.totalRatings})</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleDeleteStore(store.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* User Modal */}
      {showUserModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-medium mb-4">Add New User</h3>
            <div className="space-y-4">
              <FormInput
                label="Name"
                value={userForm.name}
                onChange={(e) => setUserForm(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Enter full name (20-60 characters)"
                required
              />
              <FormInput
                label="Email"
                type="email"
                value={userForm.email}
                onChange={(e) => setUserForm(prev => ({ ...prev, email: e.target.value }))}
                placeholder="Enter email address"
                required
              />
              <FormInput
                label="Password"
                type="password"
                value={userForm.password}
                onChange={(e) => setUserForm(prev => ({ ...prev, password: e.target.value }))}
                placeholder="8-16 chars, 1 uppercase, 1 special"
                required
              />
              <FormInput
                label="Address"
                value={userForm.address}
                onChange={(e) => setUserForm(prev => ({ ...prev, address: e.target.value }))}
                placeholder="Enter address (max 400 characters)"
                multiline
                rows={3}
                required
              />
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                <select
                  value={userForm.role}
                  onChange={(e) => setUserForm(prev => ({ ...prev, role: e.target.value }))}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                  <option value="store_owner">Store Owner</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => {
                  setShowUserModal(false);
                  resetUserForm();
                }}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateUser}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Create User
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Store Modal */}
      {showStoreModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-medium mb-4">Add New Store</h3>
            <div className="space-y-4">
              <FormInput
                label="Store Name"
                value={storeForm.name}
                onChange={(e) => setStoreForm(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Enter store name (20-60 characters)"
                required
              />
              <FormInput
                label="Email"
                type="email"
                value={storeForm.email}
                onChange={(e) => setStoreForm(prev => ({ ...prev, email: e.target.value }))}
                placeholder="Enter store email"
                required
              />
              <FormInput
                label="Address"
                value={storeForm.address}
                onChange={(e) => setStoreForm(prev => ({ ...prev, address: e.target.value }))}
                placeholder="Enter store address (max 400 characters)"
                multiline
                rows={3}
                required
              />
            </div>
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => {
                  setShowStoreModal(false);
                  resetStoreForm();
                }}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateStore}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                Create Store
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;