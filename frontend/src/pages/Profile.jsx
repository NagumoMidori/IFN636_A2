import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import axiosInstance from '../axiosConfig';

const Profile = () => {
  const { user, login } = useAuth();
  const { notifySuccess, notifyError } = useNotification();

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    phone: '',
    university: '',
    address: '',
    password: '',
    confirmPassword: '',
  });

  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user?.token) return;
      try {
        setLoading(true);
        const response = await axiosInstance.get('/api/users/profile', {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        
        setFormData({
          username: response.data.username || '',
          email: response.data.email || '',
          phone: response.data.phone || '',
          university: response.data.university || '',
          address: response.data.address || '',
          password: '',
          confirmPassword: '',
        });
      } catch (error) {
        notifyError('Failed to fetch profile. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user, notifyError]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.username.trim() || !formData.email.trim()) {
      notifyError('Username and email are required.');
      return;
    }

    if (formData.password) {
      if (formData.password.length < 6) {
        notifyError('New password must be at least 6 characters long.');
        return;
      }
      if (formData.password !== formData.confirmPassword) {
        notifyError('Passwords do not match.');
        return;
      }
    }

    setUpdating(true);
    try {
      const payload = {
        username: formData.username,
        email: formData.email,
        phone: formData.phone,
        university: formData.university,
        address: formData.address,
      };

      if (formData.password) {
        payload.password = formData.password;
      }

      const response = await axiosInstance.put('/api/users/profile', payload, {
        headers: { Authorization: `Bearer ${user.token}` },
      });

      // Synchronize the update with the authentication context
      login({
        ...user,
        username: response.data.username,
        email: response.data.email,
        token: response.data.token,
      });

      setFormData((prev) => ({
        ...prev,
        password: '',
        confirmPassword: '',
      }));

      notifySuccess('Profile updated successfully!');
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to update profile.';
      notifyError(message);
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-brand-600 border-t-transparent" />
        <span className="ml-3 text-gray-500 font-medium">Loading profile...</span>
      </div>
    );
  }

  const userInitials = formData.username
    ? formData.username.slice(0, 2).toUpperCase()
    : 'US';

  return (
    <div className="bg-gray-50/50 min-h-screen py-10 sm:py-16">
      <div className="max-w-2xl mx-auto px-4 sm:px-6">
        
        {/* Profile Card Header */}
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 sm:p-8 mb-8">
          <div className="flex flex-col sm:flex-row items-center gap-5 text-center sm:text-left">
            <div className="w-20 h-20 bg-brand-600 rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-md shadow-brand-100">
              {userInitials}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{formData.username}</h1>
              <p className="text-gray-500 text-sm mt-1">{formData.email}</p>
              <div className="mt-3 flex flex-wrap gap-2 justify-center sm:justify-start">
                <span className="px-3 py-1 bg-brand-50 text-brand-700 text-xs font-semibold rounded-full border border-brand-100">
                  {user?.role === 'admin' ? 'Administrator' : 'Explorer'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Main profile form */}
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 sm:p-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Profile Settings</h2>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid gap-6 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Username</label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  className="block w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
                  placeholder="Username"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Email Address</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="block w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
                  placeholder="Email"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Phone Number</label>
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="block w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
                  placeholder="e.g. +61 400 000 000"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">University</label>
                <input
                  type="text"
                  name="university"
                  value={formData.university}
                  onChange={handleChange}
                  className="block w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
                  placeholder="e.g. QUT"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Address</label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                className="block w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
                placeholder="e.g. George St, Brisbane"
              />
            </div>

            {/* Password section */}
            <div className="border-t border-gray-100 pt-6 mt-8">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Change Password</h3>
              <p className="text-xs text-gray-400 mb-4">Leave blank if you do not wish to update your password.</p>
              
              <div className="grid gap-6 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">New Password</label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="block w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
                    placeholder="••••••••"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Confirm New Password</label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="block w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
                    placeholder="••••••••"
                  />
                </div>
              </div>
            </div>

            <div className="pt-4">
              <button
                type="submit"
                disabled={updating}
                className="w-full sm:w-auto px-8 py-3 bg-brand-600 hover:bg-brand-700 disabled:bg-brand-400 text-white font-semibold rounded-xl shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2"
              >
                {updating ? 'Saving changes...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;
