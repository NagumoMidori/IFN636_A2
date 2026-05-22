import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../axiosConfig';

const ManageTours = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    location: '',
    startDate: '',
    endDate: '',
    description: '',
    importantNotes: '',
    capacity: '',
    originalPrice: '',
    discount: '',
    status: 'Available',
    type: '',
    imageFile: null,
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = new FormData();
      Object.keys(formData).forEach((key) => {
        if (key === 'imageFile') {
          if (formData[key] instanceof File) data.append('imageFile', formData[key]);
        } else {
          data.append(key, formData[key]);
        }
      });

      await axiosInstance.post('/api/tours', data);
      navigate('/admin/tours');
    } catch (err) {
      alert(`Error: ${err.response?.data?.message || 'Failed to add tour'}`);
    } finally {
      setLoading(false);
    }
  };

  const labelStyle = 'block text-sm font-medium text-gray-700 mb-1.5';
  const inputStyle = 'w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all text-sm text-gray-900';

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Add New Tour</h1>
          <p className="text-sm text-gray-500 mt-1">Fill in the details to create a new tour package</p>
        </div>
        <button
          onClick={() => navigate('/admin/tours')}
          className="text-sm font-medium text-red-500 hover:text-white hover:bg-red-500 border border-red-300 px-4 py-2 rounded-lg transition-colors"
        >
          Cancel
        </button>
      </div>

      {/* Form Card */}
      <div className="bg-white rounded-xl border border-gray-200 p-8 max-w-5xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title & Location */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className={labelStyle}>Tour Title</label>
              <input type="text" name="title" placeholder="Enter tour title" onChange={handleChange} className={inputStyle} required />
            </div>
            <div>
              <label className={labelStyle}>Location</label>
              <input type="text" name="location" placeholder="Enter location" onChange={handleChange} className={inputStyle} required />
            </div>
          </div>

          {/* Dates */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className={labelStyle}>Start Date</label>
              <input type="date" name="startDate" onChange={handleChange} className={inputStyle} />
            </div>
            <div>
              <label className={labelStyle}>End Date</label>
              <input type="date" name="endDate" onChange={handleChange} className={inputStyle} />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className={labelStyle}>Description</label>
            <textarea
              name="description"
              rows="5"
              placeholder="Describe the tour experience..."
              onChange={handleChange}
              className={`${inputStyle} resize-none`}
            />
          </div>

          {/* Notes */}
          <div>
            <label className={labelStyle}>Important Notes</label>
            <textarea
              name="importantNotes"
              rows="3"
              placeholder="Any important information for travellers..."
              onChange={handleChange}
              className={`${inputStyle} resize-none`}
            />
          </div>

          {/* Image Upload */}
          <div>
            <label className={labelStyle}>Cover Image</label>
            <div
              onClick={() => fileInputRef.current.click()}
              className="w-full h-40 border-2 border-dashed border-gray-200 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition-all overflow-hidden"
            >
              {preview ? (
                <img src={preview} className="w-full h-full object-cover" alt="Preview" />
              ) : (
                <div className="text-center">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-8 h-8 text-gray-300 mx-auto mb-2">
                    <path fillRule="evenodd" d="M1 5.25A2.25 2.25 0 013.25 3h13.5A2.25 2.25 0 0119 5.25v9.5A2.25 2.25 0 0116.75 17H3.25A2.25 2.25 0 011 14.75v-9.5zm1.5 5.81V14.75c0 .414.336.75.75.75h13.5a.75.75 0 00.75-.75v-2.06l-2.22-2.22a.75.75 0 00-1.06 0L9.06 15H3.25a.75.75 0 01-.75-.75v-3.19zM12 7a1 1 0 11-2 0 1 1 0 012 0z" clipRule="evenodd" />
                  </svg>
                  <p className="text-sm font-medium text-gray-500">Click to upload</p>
                  <p className="text-xs text-gray-400 mt-1">PNG, JPG or WebP</p>
                </div>
              )}
            </div>
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files[0];
                if (file) {
                  setPreview(URL.createObjectURL(file));
                  setFormData({ ...formData, imageFile: file });
                }
              }}
            />
          </div>

          {/* Capacity, Price, Discount */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div>
              <label className={labelStyle}>Capacity / day</label>
              <input type="number" name="capacity" placeholder="60" onChange={handleChange} className={inputStyle} />
            </div>
            <div>
              <label className={labelStyle}>Price (AUD)</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm">$</span>
                <input type="number" name="originalPrice" placeholder="0" onChange={handleChange} className={`${inputStyle} pl-8`} required />
              </div>
              {formData.type === 'promo' && formData.price && (
                <p className="text-xs font-semibold text-emerald-600 mt-1.5 animate-pulse">
                  Promo active: Final price will be AUD {(Number(formData.price) * 0.9).toFixed(2)} (10% OFF)
                </p>
              )}
            </div>
          </div>

          {/* Tour Type form */}
          <div className="max-w-xs mb-6">
            <label className={labelStyle}>Tour Type</label>
            <select name="type" value={formData.type} onChange={handleChange} className={inputStyle}>
              <option value="day">Day Tour </option>
              <option value="promo">Promo Tour (10% Off)</option>
            </select>
          </div>

          {/* Status */}
          <div className="max-w-xs">
            <label className={labelStyle}>Status</label>
            <select name="status" onChange={handleChange} className={inputStyle}>
              <option value="Available">Available</option>
              <option value="Unavailable">Unavailable</option>
            </select>
          </div>

          {/* Submit */}
          <div className="pt-4 border-t border-gray-100 flex items-center gap-3">
            <button
              type="submit"
              disabled={loading}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-6 py-2.5 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
            >
              {loading ? 'Creating...' : 'Create Tour'}
            </button>
            <button
              type="button"
              onClick={() => navigate('/admin/tours')}
              className="text-sm font-medium text-gray-500 hover:text-gray-700 px-6 py-2.5 rounded-lg hover:bg-gray-100 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ManageTours;
