import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../axiosConfig';
import { useAuth } from '../context/AuthContext';

const AdminHome = () => {
  const { user } = useAuth(); // 移除這裡的 logout 呼叫，統一用 Navbar 的
  const navigate = useNavigate();
  const [tours, setTours] = useState([]);
  const [totalOrderCount, setTotalOrderCount] = useState(0);

  useEffect(() => {
    // 抓取行程
    axiosInstance.get('/api/tours').then(res => setTours(res.data));
    // 🔴 抓取全系統訂單總數
    axiosInstance.get('/api/bookings/all').then(res => setTotalOrderCount(res.data.length));
  }, []);

  return (
    <div className="max-w-[420px] mx-auto bg-[#FBFBFB] min-h-screen pt-24 pb-32 px-6 font-sans">
      {/* 1. Header: 移除 Admin 旁邊的 Logout */}
      <div className="mb-8">
        <h2 className="text-gray-400 text-[10px] font-black uppercase tracking-widest mb-1">Good Morning!</h2>
        <h1 className="text-3xl font-black text-slate-800 tracking-tighter">Admin ({user?.username})</h1>
      </div>
      
      {/* 2. Order List 卡片: 點擊前往訂單總表 */}
      <div 
        onClick={() => navigate('/admin-orders')} 
        className="bg-white p-6 rounded-[35px] shadow-sm flex items-center justify-between mb-8 border border-white cursor-pointer active:scale-95 transition-all"
      >
        <div className="flex items-center space-x-4">
          <div className="bg-orange-50 w-12 h-12 rounded-2xl flex items-center justify-center text-lg shadow-inner text-orange-400">📋</div>
          <div>
            <p className="text-gray-400 text-[9px] font-black uppercase tracking-widest leading-none mb-1">Total Order List</p>
            <p className="text-3xl font-black text-slate-800 leading-none">{totalOrderCount}</p>
          </div>
        </div>
        <div className="text-orange-400 font-black text-xs">View All →</div>
      </div>

      <h3 className="font-black text-slate-800 text-lg mb-6 tracking-tight">Manage Packages</h3>

      {/* 行程列表保持不變... */}
      <div className="space-y-6">
        {tours.map(tour => (
          <div key={tour._id} onClick={() => navigate(`/tour/${tour._id}`)} className="flex items-center space-x-4 group cursor-pointer bg-white p-3 rounded-[30px] shadow-sm">
            <img src={tour.imageUrl?.startsWith('http') ? tour.imageUrl : `https://www.google.com/search?q=http://13.239.24.246:5001/uploads/${tour.image}`} className="w-20 h-20 rounded-[22px] object-cover" alt="" />
            <div className="flex-1">
              <h4 className="font-black text-slate-800 text-sm mb-1">{tour.title}</h4>
              <p className="text-gray-400 text-[10px] font-bold">📍 {tour.location}</p>
              <div className="mt-2 bg-[#ADFF2F] inline-block px-3 py-1 rounded-lg text-[9px] font-black text-[#004D25]">AUD {tour.price}</div>
            </div>
          </div>
        ))}
      </div>

      {/* 底部新增按鈕 */}
      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[420px] p-6 bg-white/80 backdrop-blur-md border-t border-gray-50">
        <button onClick={() => navigate('/manage-tours')} className="w-full bg-[#00A651] text-white font-black py-4 rounded-2xl shadow-lg uppercase tracking-widest text-[11px]">
          Add Tour Package
        </button>
      </div>
    </div>
  );
};

export default AdminHome;