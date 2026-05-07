import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../axiosConfig';

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true); // 🔴 新增 Loading 狀態
  const navigate = useNavigate();

  useEffect(() => {
    axiosInstance.get('/api/bookings/my-bookings')
      .then(res => {
        setBookings(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="max-w-[420px] mx-auto bg-[#FBFBFB] min-h-screen p-6 font-sans">
      {/* Header */}
      <div className="flex items-center mb-8 pt-10">
        <button 
          onClick={() => navigate('/')} 
          className="mr-4 w-10 h-10 bg-white rounded-2xl shadow-sm flex items-center justify-center text-xl active:scale-90 transition-all border border-gray-50"
        >
          ←
        </button>
        <h1 className="text-xl font-black text-slate-800 tracking-tight">My Bookings</h1>
      </div>

      {loading ? (
        <div className="flex justify-center mt-32">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      ) : bookings.length === 0 ? (
        <div className="flex flex-col items-center mt-32 space-y-4">
          <div className="text-5xl grayscale opacity-20">🏝️</div>
          <p className="text-gray-400 font-black uppercase text-[10px] tracking-[2px]">No bookings yet.</p>
          <button 
            onClick={() => navigate('/')}
            className="text-blue-500 font-bold text-xs underline"
          >
            Go explore tours
          </button>
        </div>
      ) : (
        <div className="space-y-5">
          {bookings.map((booking) => (
            <div key={booking._id} className="bg-white p-6 rounded-[35px] border border-white shadow-sm hover:shadow-md transition-all">
              {/* 頂部：標題與狀態 */}
              <div className="flex justify-between items-start mb-4">
                <h3 className="font-black text-slate-800 text-[15px] leading-tight flex-1 pr-4">
                  {booking.tour?.title || "Unknown Tour"}
                </h3>
                <span className={`text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-tighter ${
                  booking.status === 'Cancelled' 
                  ? 'bg-red-50 text-red-500' 
                  : 'bg-blue-50 text-blue-600'
                }`}>
                  {booking.status || 'Confirmed'}
                </span>
              </div>

              {/* 資訊區：日期與人數 */}
              <div className="space-y-2 bg-gray-50/50 p-3 rounded-2xl">
                <p className="text-gray-500 text-[11px] font-bold flex items-center">
                  <span className="mr-2 opacity-50">📅</span> 
                  {booking.tourDate ? new Date(booking.tourDate).toLocaleDateString('en-AU', {
                    day: 'numeric', month: 'short', year: 'numeric'
                  }) : 'Date not set'}
                </p>
                <p className="text-gray-500 text-[11px] font-bold flex items-center">
                  <span className="mr-2 opacity-50">👥</span> 
                  {booking.quantity} {booking.quantity > 1 ? 'People' : 'Person'}
                </p>
              </div>

              {/* 底部：操作按鈕與金額 (已優化結構) */}
              <div className="mt-5 pt-5 border-t border-gray-50 flex justify-between items-end">
                <div className="flex flex-wrap gap-2">
                  {/* 如果訂單已取消，則不顯示修改按鈕 */}
                  {booking.status !== 'Cancelled' && (
                    <>
                      <button 
                        onClick={() => navigate(`/edit-booking/${booking._id}`)} 
                        className="text-[10px] font-black text-blue-600 uppercase border border-blue-100 px-4 py-2 rounded-xl bg-blue-50/50 hover:bg-blue-100 transition-colors"
                      >
                        Modify
                      </button>
                      <button 
                        onClick={() => navigate(`/cancel-booking/${booking._id}`)} 
                        className="text-[10px] font-black text-red-400 uppercase border border-red-50 px-4 py-2 rounded-xl bg-red-50/50 hover:bg-red-100 transition-colors"
                      >
                        Cancel
                      </button>
                    </>
                  )}
                </div>
                
                <div className="text-right">
                  <p className="text-[9px] font-black text-gray-300 uppercase tracking-widest mb-1">Total Paid</p>
                  <p className="font-black text-slate-800 text-lg tracking-tighter leading-none">
                    AUD {booking.totalPrice}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyBookings;