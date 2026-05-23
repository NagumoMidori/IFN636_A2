import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import axiosInstance from '../axiosConfig';

const TourForm = ({ editingTour, onSuccess, onClose }) => {
  const { user } = useAuth();
  // 使用 useRef 來觸發隱藏的 file input
  const fileInputRef = useRef(null);
  
  // 1. 基本資料狀態 (對齊 Figma 欄位)
  const [formData, setFormData] = useState({ 
    title: '', 
    location: '', 
    startDate: '', 
    endDate: '', 
    description: '', 
    importantNotes: '',
    capacity: '',
    price: '', 
    discount: '',
    status: 'Available'
  });

  // 2. 圖片相關狀態
  const [imageFile, setImageFile] = useState(null); // 真正的圖片檔案 (上傳用)
  const [imagePreview, setImagePreview] = useState(null); // 圖片的網址 (預覽用)

  useEffect(() => {
    if (editingTour) {
      // 編輯模式：帶入現有資料
      const formattedData = { ...editingTour };
      // 轉換日期格式以適應 HTML date input (YYYY-MM-DD)
      if (editingTour.startDate) formattedData.startDate = editingTour.startDate.split('T')[0];
      if (editingTour.endDate) formattedData.endDate = editingTour.endDate.split('T')[0];
      
      setFormData(formattedData);
      
      // 如果原本就有圖片，顯示原本的圖片作為預覽
      if (editingTour.imageUrl) {
        setImagePreview(editingTour.imageUrl);
      }
    } else {
      // 新增模式：清空所有狀態
      setFormData({ 
        title: '', location: '', startDate: '', endDate: '', 
        description: '', importantNotes: '', capacity: '', 
        price: '', discount: '', status: 'Available' 
      });
      setImageFile(null);
      setImagePreview(null);
    }
  }, [editingTour]);

  // 處理圖片選擇與本地預覽
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file); // 儲存檔案以備上傳
      
      // 產生本地預覽網址
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result); // 將預覽網址塞入狀態，顯示在畫面上
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user?.token) return alert("Please login again.");

    try {
      // 🔴 關鍵：使用 FormData 來處理包含檔案的表單
      const data = new FormData();
      
      // 1. 將文字欄位塞入 FormData
      Object.keys(formData).forEach(key => {
        // 排除系統內建的 _id 欄位
        if (!['_id', '__v', 'createdAt', 'updatedAt'].includes(key)) {
          // 如果欄位有值才傳送，避免傳送空字串造成後端 Model 驗證失敗
          if (formData[key] !== null) {
            data.append(key, formData[key]);
          }
        }
      });
      
      // 2. 如果有選擇新圖片，塞入圖片檔案 (對齊後端的 upload.single('image'))
      if (imageFile) {
        data.append('image', imageFile); 
      }

      const config = {
        headers: { 
          Authorization: `Bearer ${user.token}`,
          // 🔴 關鍵：告訴 axios 這是 FormData，它會自動設定 correct boundary
          'Content-Type': 'multipart/form-data' 
        },
      };

      if (editingTour) {
        // 編輯 (Update)
        await axiosInstance.put(`/api/tours/${editingTour._id}`, data, config);
      } else {
        // 新增 (Create)
        await axiosInstance.post('/api/tours', data, config);
      }
      
      alert('Success!');
      onSuccess(); // 成功後關閉彈窗並刷新列表
    } catch (error) {
      console.error(error);
      alert('Save failed: ' + (error.response?.data?.message || 'Check Server Logs'));
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this tour package?")) return;
    try {
      await axiosInstance.delete(`/api/tours/${editingTour._id}`, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      alert('Deleted Successfully!');
      onSuccess();
    } catch (error) {
      console.error(error);
      alert('Delete failed.');
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-white font-sans text-sm">
      {/* 1. Header (對齊 Figma 高擬真設計) */}
      <div className="flex justify-between items-center p-5 border-b sticky top-0 bg-white z-10">
        <button type="button" onClick={onClose} className="text-2xl text-gray-400 hover:text-gray-800 transition-colors">
          {/* 返回箭頭 Icon */}
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
        </button>
        <h1 className="text-xl font-black text-gray-900 tracking-tight">
          {editingTour ? 'Edit Tour Package' : 'Add Tour Package'}
        </h1>
        {/* 首頁 Icon */}
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

        {/* Start & End Date (Figma 並排設計) */}
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

        {/* Description (Figma 大文字域) */}
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

        {/* 🔴 關鍵修改：Cloudinary 圖片上傳區 UI (對齊 Figma 虛線框) */}
        <div className="space-y-2">
          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">Upload cover picture</label>
          
          {/* 將 label 變為點擊區域，點擊會觸發隱藏的 file input */}
          <label className="cursor-pointer block">
            <div className={`border-2 border-dashed rounded-[30px] p-6 text-center bg-gray-50 hover:bg-gray-100 transition-all ${imagePreview ? 'border-emerald-400' : 'border-gray-200'}`}>
               <div className="flex flex-col items-center justify-center min-h-[150px]">
                  
                  {/* 如果有預覽網址 (本地選取或原本就有)，顯示圖片預覽 */}
                  {imagePreview ? (
                     <div className="relative w-full h-40 group">
                        <img src={imagePreview} alt="Preview" className="w-full h-full object-cover rounded-2xl shadow-sm" />
                        <div className="absolute inset-0 bg-black bg-opacity-40 rounded-2xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                           <span className="text-white text-xs font-bold bg-gray-900 bg-opacity-70 px-3 py-1 rounded-full">Click to change</span>
                        </div>
                     </div>
                  ) : (
                     // 否則顯示 Figma 原本的 ☁️ Icon UI
                     <>
                        <div className="bg-white p-3 rounded-full shadow-sm mb-3">
                           {/* 雲端上傳 Icon */}
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
            {/* 🔴 隱藏的真正檔案輸入器，限制只能選圖片 */}
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

        {/* Price & Discount (Figma 並排設計) */}
        <div className="flex space-x-4">
          <div className="flex-1 space-y-2">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">Price (in AUD)</label>
            <div className="relative">
              {/* 貨幣符號固定在左側 */}
              <span className="absolute left-4 top-[17px] text-gray-400 font-bold">$</span>
              <input 
                type="number" 
                placeholder="Enter price" 
                value={formData.price} 
                onChange={e => setFormData({...formData, price: e.target.value})} 
                className="w-full p-4 pl-9 bg-white border border-gray-100 rounded-xl outline-none shadow-sm placeholder-gray-300" 
                required 
              />
            </div>
          </div>
          <div className="flex-1 space-y-2">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">Discount (%)</label>
            <input 
              type="number" 
              placeholder="Enter discount" 
              value={formData.discount} 
              onChange={e => setFormData({...formData, discount: e.target.value})} 
              className="w-full p-4 bg-white border border-gray-100 rounded-xl outline-none shadow-sm placeholder-gray-300" 
            />
          </div>
        </div>

        {/* Status (Figma 下拉選單) */}
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
            {/* 下拉箭頭 Icon */}
            <div className="absolute right-4 top-5 pointer-events-none text-emerald-500">
               <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
               </svg>
            </div>
          </div>
        </div>

        {/* 3. Submit Buttons (對齊 Figma 底部設計) */}
        <div className="pt-4 pb-20 space-y-3 sticky bottom-0 bg-white bg-opacity-90 backdrop-blur-sm -mx-6 px-6">
          <button 
            type="submit" 
            className="w-full bg-emerald-500 text-white font-black text-lg py-5 rounded-[24px] shadow-xl shadow-emerald-100 hover:bg-emerald-600 active:scale-95 transition-all"
          >
            {editingTour ? 'Update Changes' : 'Submit'}
          </button>
          
          {/* 🔴 刪除按鈕只在編輯模式出現 */}
          {editingTour && (
            <button 
              type="button" 
              onClick={handleDelete} 
              className="w-full text-red-500 font-bold py-3 mt-2 hover:bg-red-50 rounded-xl transition-colors"
            >
              Delete Tour Package
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default TourForm;