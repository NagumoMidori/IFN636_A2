import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../axiosConfig';

const AdminOrders = () => {
  const [bookings, setBookings] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axiosInstance.get('/api/bookings/all')
      .then(res => setBookings(res.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="max-w-[420px] mx-auto bg-white min-h-screen font-sans">
      {/* Header */}
      <div className="flex items-center justify-between p-6 pt-12 border-b border-gray-50">
        <button onClick={() => navigate('/')} className="text-xl">←</button>
        <h1 className="text-xl font-black text-slate-800">Order</h1>
        <button onClick={() => navigate('/')} className="text-xl">🏠</button>
      </div>

      <div className="p-6 space-y-8">
        {/* 訂單列表 (這裡可以做分組，或者直接列出) */}
        {bookings.length === 0 ? (
          <p className="text-center text-gray-300 font-bold py-20">NO ORDERS YET</p>
        ) : (
          bookings.map((booking) => (
            <div key={booking._id} className="mb-6">
              {/* 使用者名稱小標題 */}
              <p className="text-[11px] font-black text-slate-800 uppercase tracking-widest mb-3">
                Name : {booking.personalInfo?.fullName || booking.user?.username}
              </p>
              
              {/* 訂單卡片 */}
              <div 
                onClick={() => navigate(`/admin/order-detail/${booking._id}`)}
                className="flex items-center space-x-4 bg-white p-4 rounded-[28px] border border-gray-100 shadow-sm active:scale-95 transition-all"
              >
                <img 
                  src={booking.tour?.imageUrl?.startsWith('http') ? booking.tour.imageUrl : `${booking.tour?.imageUrl}`} 
                  className="w-14 h-14 rounded-xl object-cover" 
                  alt="" 
                />
                <div className="flex-1">
                  <h4 className="font-black text-slate-800 text-[11px] leading-tight mb-1">{booking.tour?.title}</h4>
                  <p className="text-gray-400 text-[9px] font-bold uppercase">{new Date(booking.tourDate).toLocaleDateString()}</p>
                </div>
                
                {/* 狀態標籤 (依照 Figma) */}
                <span className={`text-[8px] font-black px-2 py-1 rounded-full uppercase ${
                   booking.status === 'Cancelled' 
                   ? 'bg-red-50 text-red-500' 
                   : 'bg-green-50 text-green-500'
                }`}>
                  {booking.status === 'Cancelled' ? 'Cancel' : 'Confirm'}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AdminOrders;