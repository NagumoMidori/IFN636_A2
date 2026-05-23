import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../axiosConfig';

const Profile = () => {
  const { user, login, logout } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    phone: '',
    university: '',
    address: '',
  });
  const [passwordData, setPasswordData] = useState({
    newPassword: '',
    confirmPassword: '',
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [activeTab, setActiveTab] = useState('personal'); // 'personal' | 'security'

  // Fetch profile data on mount
  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      try {
        const response = await axiosInstance.get('/api/users/profile');
        const data = response.data;
        setFormData({
          username: data.username || '',
          email: data.email || '',
          phone: data.phone || '',
          university: data.university || '',
          address: data.address || '',
        });
      } catch (err) {
        setError('Failed to load profile. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    if (user) fetchProfile();
  }, [user]);

  // Auto-clear messages after 4 seconds
  useEffect(() => {
    if (success || error) {
      const timer = setTimeout(() => {
        setSuccess('');
        setError('');
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [success, error]);

  // Handle profile update
  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setSaving(true);

    try {
      const payload = { ...formData };

      // Include password if user is changing it
      if (activeTab === 'security') {
        if (passwordData.newPassword !== passwordData.confirmPassword) {
          setError('Passwords do not match.');
          setSaving(false);
          return;
        }
        if (passwordData.newPassword && passwordData.newPassword.length < 6) {
          setError('Password must be at least 6 characters.');
          setSaving(false);
          return;
        }
        if (passwordData.newPassword) {
          payload.password = passwordData.newPassword;
        }
      }

      const response = await axiosInstance.put('/api/users/profile', payload);

      // Update local auth context with new data
      login({
        ...user,
        username: response.data.username,
        email: response.data.email,
        token: response.data.token,
      });

      setSuccess(activeTab === 'security' ? 'Password updated successfully!' : 'Profile updated successfully!');
      setPasswordData({ newPassword: '', confirmPassword: '' });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  // Handle account deletion
  const handleDeleteAccount = async () => {
    setDeleting(true);
    setError('');
    try {
      await axiosInstance.delete('/api/users/profile');
      logout();
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete account. Please try again.');
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <section className="bg-white">
        <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="animate-pulse space-y-6">
            <div className="h-8 w-48 rounded bg-gray-200" />
            <div className="h-4 w-72 rounded bg-gray-100" />
            <div className="space-y-4 rounded-2xl border border-gray-200 p-6">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="space-y-2">
                  <div className="h-4 w-24 rounded bg-gray-100" />
                  <div className="h-11 rounded-lg bg-gray-100" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-white">
      <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-semibold tracking-tight text-gray-900">My Profile</h1>
          <p className="mt-2 text-sm text-gray-500">
            Manage your personal information and account settings.
          </p>
        </div>

        {/* Status Messages */}
        {success && (
          <div className="mb-6 flex items-center gap-3 rounded-lg border border-green-200 bg-green-50 p-4">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5 shrink-0 text-green-600">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
            </svg>
            <p className="text-sm font-medium text-green-700">{success}</p>
          </div>
        )}
        {error && (
          <div className="mb-6 flex items-center gap-3 rounded-lg border border-red-200 bg-red-50 p-4">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5 shrink-0 text-red-600">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
            </svg>
            <p className="text-sm font-medium text-red-700">{error}</p>
          </div>
        )}

        {/* Tabs */}
        <div className="mb-6 flex gap-1 rounded-xl bg-gray-100 p-1">
          <button
            type="button"
            onClick={() => setActiveTab('personal')}
            className={`flex-1 rounded-lg px-4 py-2.5 text-sm font-semibold transition-colors ${activeTab === 'personal'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
              }`}
          >
            Personal Details
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('security')}
            className={`flex-1 rounded-lg px-4 py-2.5 text-sm font-semibold transition-colors ${activeTab === 'security'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
              }`}
          >
            Security
          </button>
        </div>

        {/* Personal Details Tab */}
        {activeTab === 'personal' && (
          <form onSubmit={handleUpdateProfile}>
            <div className="rounded-2xl border border-gray-200 bg-white shadow-sm">
              <div className="border-b border-gray-100 px-6 py-4">
                <h2 className="text-lg font-semibold text-gray-900">Personal Information</h2>
                <p className="mt-1 text-sm text-gray-500">Update your name, email, phone, and other details.</p>
              </div>

              <div className="space-y-5 px-6 py-6">
                {/* Username */}
                <div>
                  <label htmlFor="profile-username" className="block text-sm font-medium text-gray-700 mb-1.5">
                    Full Name
                  </label>
                  <input
                    id="profile-username"
                    type="text"
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all text-gray-900"
                    placeholder="Your full name"
                    required
                  />
                </div>

                {/* Email */}
                <div>
                  <label htmlFor="profile-email" className="block text-sm font-medium text-gray-700 mb-1.5">
                    Email Address
                  </label>
                  <input
                    id="profile-email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all text-gray-900"
                    placeholder="you@example.com"
                    required
                  />
                </div>

                {/* Phone */}
                <div>
                  <label htmlFor="profile-phone" className="block text-sm font-medium text-gray-700 mb-1.5">
                    Phone Number
                  </label>
                  <input
                    id="profile-phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all text-gray-900"
                    placeholder="e.g. 0412 345 678"
                  />
                </div>

                {/* University */}
                <div>
                  <label htmlFor="profile-university" className="block text-sm font-medium text-gray-700 mb-1.5">
                    University
                  </label>
                  <input
                    id="profile-university"
                    type="text"
                    value={formData.university}
                    onChange={(e) => setFormData({ ...formData, university: e.target.value })}
                    className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all text-gray-900"
                    placeholder="e.g. Queensland University of Technology"
                  />
                </div>

                {/* Address */}
                <div>
                  <label htmlFor="profile-address" className="block text-sm font-medium text-gray-700 mb-1.5">
                    Address
                  </label>
                  <input
                    id="profile-address"
                    type="text"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all text-gray-900"
                    placeholder="Your address"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 border-t border-gray-100 px-6 py-4">
                <button
                  type="button"
                  onClick={() => navigate(-1)}
                  className="rounded-lg border border-gray-200 px-5 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-lg bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </div>
          </form>
        )}

        {/* Security Tab */}
        {activeTab === 'security' && (
          <div className="space-y-6">
            {/* Change Password */}
            <form onSubmit={handleUpdateProfile}>
              <div className="rounded-2xl border border-gray-200 bg-white shadow-sm">
                <div className="border-b border-gray-100 px-6 py-4">
                  <h2 className="text-lg font-semibold text-gray-900">Change Password</h2>
                  <p className="mt-1 text-sm text-gray-500">Update your password to keep your account secure.</p>
                </div>

                <div className="space-y-5 px-6 py-6">
                  <div>
                    <label htmlFor="profile-new-password" className="block text-sm font-medium text-gray-700 mb-1.5">
                      New Password
                    </label>
                    <input
                      id="profile-new-password"
                      type="password"
                      value={passwordData.newPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                      className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all text-gray-900"
                      placeholder="Enter new password"
                      minLength={6}
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="profile-confirm-password" className="block text-sm font-medium text-gray-700 mb-1.5">
                      Confirm New Password
                    </label>
                    <input
                      id="profile-confirm-password"
                      type="password"
                      value={passwordData.confirmPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                      className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all text-gray-900"
                      placeholder="Confirm new password"
                      minLength={6}
                      required
                    />
                  </div>
                </div>

                <div className="flex items-center justify-end gap-3 border-t border-gray-100 px-6 py-4">
                  <button
                    type="submit"
                    disabled={saving}
                    className="rounded-lg bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {saving ? 'Updating...' : 'Update Password'}
                  </button>
                </div>
              </div>
            </form>

            {/* Delete Account */}
            <div className="rounded-2xl border border-red-200 bg-white shadow-sm">
              <div className="border-b border-red-100 px-6 py-4">
                <h2 className="text-lg font-semibold text-red-700">Danger Zone</h2>
                <p className="mt-1 text-sm text-gray-500">
                  Permanently delete your account and all associated data. This action cannot be undone.
                </p>
              </div>

              <div className="px-6 py-4">
                {!showDeleteConfirm ? (
                  <button
                    type="button"
                    onClick={() => setShowDeleteConfirm(true)}
                    className="rounded-lg border border-red-200 px-5 py-2.5 text-sm font-semibold text-red-600 hover:bg-red-50 transition-colors"
                  >
                    Delete Account
                  </button>
                ) : (
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <p className="text-sm font-medium text-red-700">
                      Are you sure? This will permanently delete your account.
                    </p>
                    <div className="flex gap-3">
                      <button
                        type="button"
                        onClick={() => setShowDeleteConfirm(false)}
                        className="rounded-lg border border-gray-200 px-5 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={handleDeleteAccount}
                        disabled={deleting}
                        className="rounded-lg bg-red-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {deleting ? 'Deleting...' : 'Yes, Delete'}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default Profile;
