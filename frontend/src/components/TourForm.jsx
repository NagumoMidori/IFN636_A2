import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import axiosInstance from '../axiosConfig';

const TourForm = ({ editingTour, onSuccess, onClose }) => {
  const { user } = useAuth();
  const { notifySuccess, notifyError, notifyWarning } = useNotification();
  const fileInputRef = useRef(null);

  // 1. Form state fields
  const [formData, setFormData] = useState({
    title: '',
    location: '',
    startDate: '',
    endDate: '',
    description: '',
    importantNotes: '',
    capacity: '',
    originalPrice: '',
    type: 'day',
    status: 'Available'
  });

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [confirmingDelete, setConfirmingDelete] = useState(false);

  useEffect(() => {
    if (editingTour) {
      // Edit mode: populate with existing data
      const formattedData = { ...editingTour };
      // Convert date format for HTML date input (YYYY-MM-DD)
      if (editingTour.startDate) formattedData.startDate = editingTour.startDate.split('T')[0];
      if (editingTour.endDate) formattedData.endDate = editingTour.endDate.split('T')[0];

      setFormData(formattedData);

      // If an existing image URL is present, use it as the preview
      if (editingTour.imageUrl) {
        setImagePreview(editingTour.imageUrl);
      }
    } else {
      // Create mode: reset all state
      setFormData({
        title: '', location: '', startDate: '', endDate: '',
        description: '', importantNotes: '', capacity: '',
        originalPrice: '', type: 'day', status: 'Available'
      });
      setImageFile(null);
      setImagePreview(null);
    }
  }, [editingTour]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);

      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user?.token) { notifyWarning('Please login again.'); return; }

    try {
      const data = new FormData();

      // 1. Append text fields to FormData
      Object.keys(formData).forEach(key => {
        if (!['_id', '__v', 'createdAt', 'updatedAt'].includes(key)) {
          // Only send non-null fields to avoid backend validation errors
          if (formData[key] !== null) {
            data.append(key, formData[key]);
          }
        }
      });

      // 2. Append image file if a new one was selected
      if (imageFile) {
        data.append('image', imageFile);
      }

      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
          'Content-Type': 'multipart/form-data'
        },
      };

      if (editingTour) {
        // Update
        await axiosInstance.put(`/api/tours/${editingTour._id}`, data, config);
      } else {
        // Create
        await axiosInstance.post('/api/tours', data, config);
      }

      notifySuccess(editingTour ? 'Tour updated successfully.' : 'Tour created successfully.');
      onSuccess();
    } catch (error) {
      console.error(error);
      notifyError('Save failed: ' + (error.response?.data?.message || 'Check Server Logs'));
    }
  };

  const handleDelete = async () => {
    try {
      await axiosInstance.delete(`/api/tours/${editingTour._id}`, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      notifySuccess('Deleted successfully.');
      onSuccess();
    } catch (error) {
      console.error(error);
      notifyError('Delete failed.');
    } finally {
      setConfirmingDelete(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-white font-sans text-sm">
      {/* Header */}
      <div className="flex justify-between items-center p-5 border-b sticky top-0 bg-white z-10">
        <button type="button" onClick={onClose} className="text-2xl text-gray-400 hover:text-gray-800 transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
        </button>
        <h1 className="text-xl font-black text-gray-900 tracking-tight">
          {editingTour ? 'Edit Tour Package' : 'Add Tour Package'}
        </h1>
        <button type="button" onClick={onClose} className="text-2xl text-gray-400 hover:text-gray-800 transition-colors">🏠</button>
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-6 flex-1 overflow-y-auto pb-32">

        {/* Tour Title */}
        <div className="space-y-2">
          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">Tour Title</label>
          <input
            type="text"
            placeholder="Enter tour title"
            value={formData.title}
            onChange={e => setFormData({...formData, title: e.target.value})}
            className="w-full p-4 bg-white border border-gray-100 rounded-xl focus:ring-2 focus:ring-emerald-400 outline-none shadow-sm placeholder-gray-300"
            required
          />
        </div>

        {/* Location */}
        <div className="space-y-2">
          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">Location</label>
          <input
            type="text"
            placeholder="Enter tour location"
            value={formData.location}
            onChange={e => setFormData({...formData, location: e.target.value})}
            className="w-full p-4 bg-white border border-gray-100 rounded-xl outline-none shadow-sm placeholder-gray-300"
          />
        </div>

        {/* Start & End Date */}
        <div className="flex space-x-4">
          <div className="flex-1 space-y-2">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">Start Date</label>
            <input
              type="date"
              value={formData.startDate}
              onChange={e => setFormData({...formData, startDate: e.target.value})}
              className="w-full p-4 bg-white border border-gray-100 rounded-xl text-gray-500 shadow-sm"
            />
          </div>
          <div className="flex-1 space-y-2">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">End Date</label>
            <input
              type="date"
              value={formData.endDate}
              onChange={e => setFormData({...formData, endDate: e.target.value})}
              className="w-full p-4 bg-white border border-gray-100 rounded-xl text-gray-500 shadow-sm"
            />
          </div>
        </div>

        {/* Description */}
        <div className="space-y-2">
          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">What is it about</label>
          <textarea
            placeholder="Enter description"
            rows="6"
            value={formData.description}
            onChange={e => setFormData({...formData, description: e.target.value})}
            className="w-full p-4 bg-white border border-gray-100 rounded-xl outline-none shadow-sm placeholder-gray-300 resize-none"
          />
        </div>

        {/* Important Notes */}
        <div className="space-y-2">
          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">Important Notes:</label>
          <textarea
            placeholder="Enter Important Notes of the tour"
            rows="3"
            value={formData.importantNotes}
            onChange={e => setFormData({...formData, importantNotes: e.target.value})}
            className="w-full p-4 bg-white border border-gray-100 rounded-xl outline-none shadow-sm placeholder-gray-300 resize-none"
          />
        </div>

        {/* Image upload area */}
        <div className="space-y-2">
          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">Upload cover picture</label>

          <label className="cursor-pointer block">
            <div className={`border-2 border-dashed rounded-[30px] p-6 text-center bg-gray-50 hover:bg-gray-100 transition-all ${imagePreview ? 'border-emerald-400' : 'border-gray-200'}`}>
               <div className="flex flex-col items-center justify-center min-h-[150px]">

                  {imagePreview ? (
                     <div className="relative w-full h-40 group">
                        <img src={imagePreview} alt="Preview" className="w-full h-full object-cover rounded-2xl shadow-sm" />
                        <div className="absolute inset-0 bg-black bg-opacity-40 rounded-2xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                           <span className="text-white text-xs font-bold bg-gray-900 bg-opacity-70 px-3 py-1 rounded-full">Click to change</span>
                        </div>
                     </div>
                  ) : (
                     <>
                        <div className="bg-white p-3 rounded-full shadow-sm mb-3">
                           <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                           </svg>
                        </div>
                        <p className="font-bold text-gray-700 text-sm">Click to upload cover picture</p>
                        <p className="text-[10px] text-gray-400 mt-1 uppercase tracking-tight">SVG, PNG, JPG or GIF (MAX. 800x400px)</p>
                     </>
                  )}
               </div>
            </div>
            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
          </label>
        </div>

        {/* Capacity */}
        <div className="space-y-2">
          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">Capacity (/day)</label>
          <input
            type="number"
            placeholder="Enter the maximum daily capacity"
            value={formData.capacity}
            onChange={e => setFormData({...formData, capacity: e.target.value})}
            className="w-full p-4 bg-white border border-gray-100 rounded-xl outline-none shadow-sm placeholder-gray-300"
          />
        </div>

        {/* Price & Tour Type */}
        <div className="flex space-x-4">
          <div className="flex-1 space-y-2">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">Price (in AUD)</label>
            <div className="relative">
              <span className="absolute left-4 top-[17px] text-gray-400 font-bold">$</span>
              <input
                type="number"
                placeholder="Enter price"
                value={formData.originalPrice}
                onChange={e => setFormData({...formData, originalPrice: e.target.value})}
                className="w-full p-4 pl-9 bg-white border border-gray-100 rounded-xl outline-none shadow-sm placeholder-gray-300"
                required
              />
            </div>
          </div>
          <div className="flex-1 space-y-2">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">Tour Type</label>
            <div className="relative">
              <select
                value={formData.type}
                onChange={e => setFormData({...formData, type: e.target.value})}
                className="w-full p-4 bg-white border border-gray-100 rounded-xl appearance-none outline-none shadow-sm text-gray-700 cursor-pointer"
              >
                <option value="day">Day Tour</option>
                <option value="promo">Promo (10% off)</option>
              </select>
              <div className="absolute right-4 top-5 pointer-events-none text-emerald-500">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Status */}
        <div className="space-y-2 pb-10">
          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">Status</label>
          <div className="relative">
            <select
              value={formData.status}
              onChange={e => setFormData({...formData, status: e.target.value})}
              className="w-full p-4 bg-white border border-gray-100 rounded-xl appearance-none outline-none shadow-sm text-gray-700 cursor-pointer"
            >
              <option value="Available">Available</option>
              <option value="Unavailable">Unavailable</option>
            </select>
            <div className="absolute right-4 top-5 pointer-events-none text-emerald-500">
               <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
               </svg>
            </div>
          </div>
        </div>

        {/* Submit Buttons */}
        <div className="pt-4 pb-20 space-y-3 sticky bottom-0 bg-white bg-opacity-90 backdrop-blur-sm -mx-6 px-6">
          <button
            type="submit"
            className="w-full bg-emerald-500 text-white font-black text-lg py-5 rounded-[24px] shadow-xl shadow-emerald-100 hover:bg-emerald-600 active:scale-95 transition-all"
          >
            {editingTour ? 'Update Changes' : 'Submit'}
          </button>

          {editingTour && !confirmingDelete && (
            <button
              type="button"
              onClick={() => setConfirmingDelete(true)}
              className="w-full text-red-500 font-bold py-3 mt-2 hover:bg-red-50 rounded-xl transition-colors"
            >
              Delete Tour Package
            </button>
          )}
          {editingTour && confirmingDelete && (
            <div className="flex gap-3 mt-2">
              <button type="button" onClick={() => setConfirmingDelete(false)} className="flex-1 py-3 font-bold text-gray-600 hover:bg-gray-100 rounded-xl transition-colors">
                Cancel
              </button>
              <button type="button" onClick={handleDelete} className="flex-1 py-3 font-bold text-white bg-red-500 hover:bg-red-600 rounded-xl transition-colors">
                Confirm delete
              </button>
            </div>
          )}
        </div>
      </form>
    </div>
  );
};

export default TourForm;
