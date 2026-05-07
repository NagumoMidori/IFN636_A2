import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axiosInstance from '../axiosConfig';
import { useAuth } from '../context/AuthContext'; // 🔴 必須引入 Auth 以判斷角色

const TourDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth(); // 🔴 取得目前登入者資訊
  const [tour, setTour] = useState(null);

  useEffect(() => {
    axiosInstance.get(`/api/tours/${id}`)
      .then(res => setTour(res.data))
      .catch(err => console.error("Fetch detail error:", err));
  }, [id]);

  // 🔴 刪除邏輯
  const handleRemove = async () => {
    if (!window.confirm("Are you sure you want to delete this tour?")) return;
    try {
      await axiosInstance.delete(`/api/tours/${id}`);
      alert("Deleted successfully!");
      navigate('/');
    } catch (err) {
      alert(`Delete failed: ${err.response?.data?.message || 'Unauthorized'}`);
    }
  };

  if (!tour) return <div className="pt-32 text-center text-gray-300 font-black tracking-widest">LOADING...</div>;

  return (
    <div className="max-w-[420px] mx-auto bg-white min-h-screen relative font-sans overflow-x-hidden">
      
      {/* 1. 頂部綠色漸層區 (Figma 1:1 還原) */}
      <div className="h-[440px] relative pt-12 px-6 bg-gradient-to-b from-[#18C07A] to-white rounded-b-[40px]">
        <div className="flex justify-between items-center mb-6">
          <button onClick={() => navigate(-1)} className="text-white text-2xl">←</button>
          <h2 className="text-white font-bold text-lg">Tour details</h2>
          <button onClick={() => navigate('/')} className="text-white text-2xl">🏠</button>
        </div>

        {/* Hero 卡片區 */}
        <div className="bg-white p-5 rounded-[48px] shadow-2xl shadow-gray-200/50 flex items-center space-x-5 relative z-10">
          <div className="relative">
            <img 
              src={tour.imageUrl?.startsWith('http') ? tour.imageUrl : `${tour.imageUrl}`} 
              className="w-32 h-32 object-cover rounded-[32px]" 
              alt={tour.title} 
            />
            <div className="flex justify-center space-x-1.5 mt-3">
              <span className="w-1.5 h-1.5 bg-[#00A651] rounded-full"></span>
              <span className="w-1.5 h-1.5 bg-gray-200 rounded-full"></span>
              <span className="w-1.5 h-1.5 bg-gray-200 rounded-full"></span>
            </div>
          </div>

          <div className="flex-1">
            <div className="inline-block bg-gray-100 px-3 py-1 rounded-full">
              <p className="text-[10px] font-bold text-slate-800 uppercase tracking-tighter">
                Daily Capacity : <span className="text-[#00A651]">{tour.capacity || 60}</span>
              </p>
            </div>
            <h1 className="text-xl font-black text-slate-800 tracking-tight mt-2">{tour.title}</h1>
            <p className="text-blue-500 font-bold text-[10px] mt-1 uppercase tracking-widest">📍 {tour.location}</p>
            <div className="bg-[#ADFF2F] px-4 py-2 rounded-2xl text-xs font-black text-[#004D25] mt-4 inline-block">
              AUD {tour.price}
            </div>
          </div>
        </div>
      </div>

      {/* 2. 內容區域 */}
      <div className="p-8 pb-40 text-slate-600">
        <div className="mb-10">
          <h3 className="font-black text-slate-800 text-lg mb-4 tracking-tight">What's it about?</h3>
          <p className="text-slate-500 text-xs leading-relaxed">
            {tour.description}
          </p>
        </div>

        {tour.notes && (
          <div>
            <h3 className="font-black text-slate-800 text-lg mb-4 tracking-tight">Important Notes:</h3>
            <div className="bg-gray-50 p-6 rounded-[28px] border border-gray-100 text-slate-500 text-xs leading-relaxed">
              {tour.notes}
            </div>
          </div>
        )}
      </div>

      {/* 3. 🔴 底部按鈕區 (關鍵修正：根據角色切換按鈕) */}
      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[420px] bg-white/80 backdrop-blur-md p-6 border-t border-gray-100 z-50">
        {user?.role === 'admin' ? (
          <div className="flex flex-col space-y-3">
            {/* Admin 看到 Edit 和 Remove */}
            <button 
              onClick={() => navigate(`/edit-tour/${tour._id}`)} 
              className="w-full bg-[#4C4DDC] text-white font-black py-4 rounded-2xl shadow-lg uppercase tracking-widest text-[11px] active:scale-95 transition-all"
            >
              Edit Tour Package
            </button>
            <button 
              onClick={handleRemove} 
              className="w-full bg-[#FF4C4C] text-white font-black py-4 rounded-2xl shadow-lg uppercase tracking-widest text-[11px] active:scale-95 transition-all"
            >
              Remove Tour Package
            </button>
          </div>
        ) : (
          /* 一般 User 看到 Book Now */
          <button 
            onClick={() => navigate(`/book-tour/${tour._id}`)} // 🔴 導向預訂頁面
            className="w-full bg-[#00A651] ... "
          >
            BOOK NOW
          </button>
                  )}
      </div>
    </div>
  );
};

export default TourDetail;