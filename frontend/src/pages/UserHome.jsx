import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../axiosConfig';
import { useAuth } from '../context/AuthContext';

const UserHome = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [tours, setTours] = useState([]);
  const [bookingCount, setBookingCount] = useState(0);

  useEffect(() => {
    axiosInstance.get('/api/tours').then(res => setTours(res.data));
    if (user) {
      axiosInstance.get('/api/bookings/my-bookings')
        .then(res => setBookingCount(res.data.length))
        .catch(err => console.error(err));
    }
  }, [user]);

  return (
    <div className="max-w-[420px] mx-auto bg-[#FBFBFB] min-h-screen pt-24 pb-20 px-6 font-sans">
      {/* 1. 問候區 (移除了重複的 Logo) */}
      <div className="mb-8">
        <h2 className="text-gray-400 text-[10px] font-black uppercase tracking-widest mb-1">Good Morning!</h2>
        <h1 className="text-3xl font-black text-slate-800 tracking-tighter flex items-center">
          Hello, {user?.username} <span className="ml-2">👋</span>
        </h1>
      </div>

      {/* 2. 我的訂單卡片 */}
      <div 
        onClick={() => navigate('/my-bookings')}
        className="bg-white p-6 rounded-[35px] shadow-sm flex items-center justify-between mb-8 border border-white cursor-pointer active:scale-95 transition-all"
      >
        <div className="flex items-center space-x-4">
          <div className="bg-blue-50 w-12 h-12 rounded-2xl flex items-center justify-center text-lg">📋</div>
          <div>
            <p className="text-gray-400 text-[9px] font-black uppercase tracking-widest">My Current Bookings</p>
            <p className="text-2xl font-black text-slate-800">{bookingCount}</p>
          </div>
        </div>
        <div className="text-blue-500 font-bold text-[10px] uppercase tracking-tighter">View All →</div>
      </div>

      {/* 3. 搜尋列 (Figma 風格) */}
      <div className="relative mb-10">
        <input 
          type="text" 
          placeholder="Where do you want to go?" 
          className="w-full bg-white border border-gray-100 p-5 rounded-[22px] shadow-sm outline-none pl-14 text-sm font-medium"
        />
        <span className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-300">🔍</span>
      </div>

      {/* 4. 行程列表 */}
      <h3 className="font-black text-slate-800 text-lg mb-6 tracking-tight">Recent Popular Tour</h3>
      <div className="space-y-6">
        {tours.map(tour => (
          <div key={tour._id} onClick={() => navigate(`/tour/${tour._id}`)} className="flex items-center space-x-5 group cursor-pointer bg-white p-3 rounded-[30px] shadow-sm hover:shadow-md transition-all">
            <img 
              src={tour.imageUrl?.startsWith('http') ? tour.imageUrl : `${tour.imageUrl}`} 
              className="w-24 h-24 rounded-[22px] object-cover" 
              alt={tour.title}
            />
            <div className="flex-1">
              <h4 className="font-black text-slate-800 text-sm mb-1">{tour.title}</h4>
              <p className="text-gray-400 text-[10px] font-bold mb-3">📍 {tour.location}</p>
              <div className="bg-[#ADFF2F] inline-block px-3 py-1 rounded-lg text-[10px] font-black text-[#004D25]">AUD {tour.price}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserHome;