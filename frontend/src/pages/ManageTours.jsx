import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../axiosConfig';

const ManageTours = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [preview, setPreview] = useState(null);

  const [formData, setFormData] = useState({
    title: '',
    location: '',
    startDate: '',
    endDate: '',
    description: '',
    notes: '',
    capacity: '',
    price: '',
    discount: '',
    status: 'Available'
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = new FormData();
      Object.keys(formData).forEach(key => {
        data.append(key, formData[key]);
      });
      if (formData.imageFile) data.append('imageFile', formData.imageFile);

      await axiosInstance.post('/api/tours', data);
      alert('Tour added successfully!');
      navigate('/');
    } catch (err) {
      alert(`Error: ${err.response?.data?.message || 'Unauthorized'}`);
    }
  };

  // Figma 樣式定義
  const labelStyle = "text-[11px] font-bold text-gray-500 mb-2 block";
  const inputStyle = "w-full bg-white border border-gray-200 p-3 rounded-lg outline-none text-sm font-medium text-slate-700 placeholder:text-gray-300 focus:border-green-500 transition-all";

  return (
    <div className="max-w-[420px] mx-auto bg-white min-h-screen pb-40 font-sans border-x border-gray-100">
      {/* 1. Header (還原 Figma) */}
      <div className="sticky top-0 bg-white z-50 px-6 py-6 flex items-center justify-between">
        <button onClick={() => navigate(-1)} className="text-xl">←</button>
        <h1 className="text-md font-black tracking-tight">Add Tour Package</h1>
        <button onClick={() => navigate('/')} className="text-xl">🏠</button>
      </div>

      <form onSubmit={handleSubmit} className="px-6 space-y-6">
        {/* 2. Title & Location */}
        <div>
          <label className={labelStyle}>Tour Title</label>
          <input type="text" name="title" placeholder="Enter tour title" onChange={handleChange} className={inputStyle} />
        </div>

        <div>
          <label className={labelStyle}>Location</label>
          <input type="text" name="location" placeholder="Enter tour location" onChange={handleChange} className={inputStyle} />
        </div>

        {/* 3. Date Selection */}
        <div className="flex space-x-4">
          <div className="flex-1">
            <label className={labelStyle}>Start Date</label>
            <input type="date" name="startDate" onChange={handleChange} className={inputStyle} />
          </div>
          <div className="flex-1">
            <label className={labelStyle}>End Date</label>
            <input type="date" name="endDate" onChange={handleChange} className={inputStyle} />
          </div>
        </div>

        {/* 4. Description */}
        <div>
          <label className={labelStyle}>What is it about</label>
          <textarea 
            name="description" 
            rows="8" 
            placeholder="Enter description" 
            onChange={handleChange} 
            className={`${inputStyle} resize-none leading-relaxed text-xs`}
          />
        </div>

        {/* 5. Important Notes */}
        <div>
          <label className={labelStyle}>Important Notes:</label>
          <textarea 
            name="notes" 
            rows="5" 
            placeholder="Enter Important Notes of the tour" 
            onChange={handleChange} 
            className={`${inputStyle} resize-none text-xs`}
          />
        </div>

        {/* 6. Upload Section (Figma 虛線框) */}
        <div>
          <label className={labelStyle}>Upload cover picture</label>
          <div 
            onClick={() => fileInputRef.current.click()} 
            className="w-full h-32 border-2 border-dashed border-gray-200 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition-all overflow-hidden"
          >
            {preview ? (
              <img src={preview} className="w-full h-full object-cover" alt="Preview" />
            ) : (
              <div className="text-center">
                <div className="text-2xl mb-1">☁️</div>
                <p className="text-[10px] font-bold text-slate-800">Click to upload</p>
                <p className="text-[8px] text-gray-400 mt-1">SVG, PNG, JPG or GIF (max. 800x400px)</p>
              </div>
            )}
          </div>
          <input 
            type="file" 
            ref={fileInputRef} 
            className="hidden" 
            onChange={(e) => {
              const file = e.target.files[0];
              if (file) {
                setPreview(URL.createObjectURL(file));
                setFormData({ ...formData, imageFile: file });
              }
            }} 
          />
        </div>

        {/* 7. Capacity, Price, Discount */}
        <div>
          <label className={labelStyle}>Capacity (/day)</label>
          <input type="number" name="capacity" placeholder="Enter the maximum daily capacity" onChange={handleChange} className={inputStyle} />
        </div>

        <div className="flex space-x-4">
          <div className="flex-1">
            <label className={labelStyle}>Price (in AUD)</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs">$</span>
              <input type="number" name="price" placeholder="Enter price" onChange={handleChange} className={`${inputStyle} pl-6`} />
            </div>
          </div>
          <div className="flex-1">
            <label className={labelStyle}>Discount</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs">$</span>
              <input type="number" name="discount" placeholder="Enter price" onChange={handleChange} className={`${inputStyle} pl-6`} />
            </div>
          </div>
        </div>

        {/* 8. Status Selector */}
        <div>
          <label className={labelStyle}>Status</label>
          <select name="status" onChange={handleChange} className={inputStyle}>
            <option value="Available">Available</option>
            <option value="Unavailable">Unavailable</option>
          </select>
        </div>
      </form>

      {/* 9. Bottom Submit Button (Figma Green) */}
      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[420px] p-6 bg-white border-t border-gray-50">
        <button 
          onClick={handleSubmit}
          className="w-full bg-[#00A651] text-white font-bold py-4 rounded-xl shadow-lg active:scale-95 transition-all"
        >
          Submit
        </button>
      </div>
    </div>
  );
};

export default ManageTours;