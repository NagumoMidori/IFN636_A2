import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axiosInstance from '../axiosConfig';

const EditTour = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [preview, setPreview] = useState(null);

  // 🔴 確保所有 Figma 欄位都有初始值
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
    status: 'Available',
    imageFile: null
  });

  // 1. 初始化：抓取現有資料
  useEffect(() => {
    const fetchTour = async () => {
      try {
        const res = await axiosInstance.get(`/api/tours/${id}`);
        const data = res.data;
        setFormData({
          title: data.title || '',
          location: data.location || '',
          startDate: data.startDate ? data.startDate.split('T')[0] : '',
          endDate: data.endDate ? data.endDate.split('T')[0] : '',
          description: data.description || '',
          notes: data.notes || '',
          capacity: data.capacity || '',
          price: data.price || '',
          discount: data.discount || '',
          status: data.status || 'Available',
          imageFile: null
        });
        if (data.imageUrl) {
          setPreview(data.imageUrl.startsWith('http') ? data.imageUrl : `${data.imageUrl}`);
        }
      } catch (err) {
        console.error("Fetch error:", err);
      }
    };
    fetchTour();
  }, [id]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 2. 提交更新
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = new FormData();
      Object.keys(formData).forEach(key => {
        if (key === 'imageFile') {
          if (formData[key] instanceof File) data.append('imageFile', formData[key]);
        } else {
          data.append(key, formData[key]);
        }
      });

      await axiosInstance.put(`/api/tours/${id}`, data);
      alert('Update Successful!');
      navigate(`/tour/${id}`);
    } catch (err) {
      alert(`Update failed: ${err.response?.data?.message || 'Error'}`);
    }
  };

  const labelStyle = "text-[11px] font-bold text-gray-500 mb-2 block";
  const inputStyle = "w-full bg-white border border-gray-200 p-3 rounded-lg outline-none text-sm font-medium text-slate-700 focus:border-green-500 transition-all";

  return (
    <div className="max-w-[420px] mx-auto bg-white min-h-screen pb-40 font-sans border-x border-gray-100">
      {/* Header */}
      <div className="sticky top-0 bg-white z-50 px-6 py-6 flex items-center justify-between border-b border-gray-50">
        <button onClick={() => navigate(-1)} className="text-xl">←</button>
        <h1 className="text-md font-black tracking-tight text-slate-800">Edit Tour Package</h1>
        <button onClick={() => navigate('/')} className="text-xl">🏠</button>
      </div>

      <form onSubmit={handleSubmit} className="px-6 space-y-6 pt-6">
        {/* Title & Location */}
        <div>
          <label className={labelStyle}>Tour Title</label>
          <input type="text" name="title" value={formData.title} onChange={handleChange} className={inputStyle} />
        </div>

        <div>
          <label className={labelStyle}>Location</label>
          <input type="text" name="location" value={formData.location} onChange={handleChange} className={inputStyle} />
        </div>

        {/* Date Selection */}
        <div className="flex space-x-4">
          <div className="flex-1">
            <label className={labelStyle}>Start Date</label>
            <input type="date" name="startDate" value={formData.startDate} onChange={handleChange} className={inputStyle} />
          </div>
          <div className="flex-1">
            <label className={labelStyle}>End Date</label>
            <input type="date" name="endDate" value={formData.endDate} onChange={handleChange} className={inputStyle} />
          </div>
        </div>

        {/* Description */}
        <div>
          <label className={labelStyle}>What is it about</label>
          <textarea 
            name="description" 
            rows="8" 
            value={formData.description} 
            onChange={handleChange} 
            className={`${inputStyle} resize-none leading-relaxed text-xs`}
          />
        </div>

        {/* Important Notes */}
        <div>
          <label className={labelStyle}>Important Notes:</label>
          <textarea 
            name="notes" 
            rows="5" 
            value={formData.notes} 
            onChange={handleChange} 
            className={`${inputStyle} resize-none text-xs`}
          />
        </div>

        {/* Upload Section */}
        <div>
          <label className={labelStyle}>Edit cover picture</label>
          <div 
            onClick={() => fileInputRef.current.click()} 
            className="w-full h-32 border-2 border-dashed border-gray-200 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition-all overflow-hidden"
          >
            {preview ? (
              <img src={preview} className="w-full h-full object-cover" alt="Preview" />
            ) : (
              <div className="text-center text-gray-400">
                <p className="text-[10px] font-bold">No Image Selected</p>
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

        {/* Capacity, Price, Discount */}
        <div>
          <label className={labelStyle}>Capacity (/day)</label>
          <input type="number" name="capacity" value={formData.capacity} onChange={handleChange} className={inputStyle} />
        </div>

        <div className="flex space-x-4">
          <div className="flex-1">
            <label className={labelStyle}>Price (in AUD)</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs">$</span>
              <input type="number" name="price" value={formData.price} onChange={handleChange} className={`${inputStyle} pl-6`} />
            </div>
          </div>
          <div className="flex-1">
            <label className={labelStyle}>Discount</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs">$</span>
              <input type="number" name="discount" value={formData.discount} onChange={handleChange} className={`${inputStyle} pl-6`} />
            </div>
          </div>
        </div>

        {/* Status Selector */}
        <div>
          <label className={labelStyle}>Status</label>
          <select name="status" value={formData.status} onChange={handleChange} className={inputStyle}>
            <option value="Available">Available</option>
            <option value="Unavailable">Unavailable</option>
          </select>
        </div>
      </form>

      {/* Fixed Submit Button */}
      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[420px] p-6 bg-white border-t border-gray-50">
        <button 
          onClick={handleSubmit}
          className="w-full bg-[#4C4DDC] text-white font-bold py-4 rounded-xl shadow-lg active:scale-95 transition-all"
        >
          Save Changes
        </button>
      </div>
    </div>
  );
};

export default EditTour;