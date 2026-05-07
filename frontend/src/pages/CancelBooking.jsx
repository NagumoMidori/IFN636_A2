import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axiosInstance from '../axiosConfig';

const CancelBooking = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);
  const [isAgreed, setIsAgreed] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false); // 🔴 用來切換「成功畫面」

  useEffect(() => {
    // 取得訂單資訊以顯示在頂部小卡
    axiosInstance.get(`/api/bookings/${id}`)
      .then(res => setBooking(res.data))
      .catch(err => console.error(err));
  }, [id]);

  const handleConfirmCancel = async () => {
    try {
      // 呼叫後端徹底刪除 (或改狀態) 的 API
      await axiosInstance.delete(`/api/bookings/${id}`); // 🔴 這裡建議用 DELETE
      
      // 🔴 成功後，不跳轉，直接切換到成功 UI
      setIsSuccess(true);
    } catch (err) {
      alert("Cancellation failed: " + (err.response?.data?.message || "Error"));
    }
  };

  if (!booking && !isSuccess) return <div className="pt-20 text-center font-black text-gray-300">LOADING...</div>;

  // ---------------------------------------------------------
  // 🔴 成功取消後的 UI (對應 Figma 成功示意圖)
  // ---------------------------------------------------------
  if (isSuccess) {
    return (
      <div className="max-w-[420px] mx-auto bg-white min-h-screen font-sans flex flex-col items-center justify-center p-10 text-center">
        <div className="w-24 h-24 bg-red-50 rounded-full flex items-center justify-center text-4xl mb-6 shadow-inner">
          🗑️
        </div>
        <h2 className="text-[#FF4C4C] font-black text-3xl mb-4 tracking-tighter">Canceled</h2>
        <p className="text-gray-400 text-[11px] font-bold leading-relaxed mb-12 px-4">
          Your order has been canceled. <br />
          If you have any question please mail us.
        </p>
        <button 
          onClick={() => navigate('/my-bookings')}
          className="w-full bg-[#FF6B9D] text-white font-black py-4 rounded-[22px] shadow-lg shadow-pink-100 uppercase tracking-widest text-[11px] active:scale-95 transition-all"
        >
          Back to My Bookings
        </button>
      </div>
    );
  }

  // ---------------------------------------------------------
  // ⚪ 原始的取消確認 UI (對應 Figma image_ece6de.png)
  // ---------------------------------------------------------
  return (
    <div className="max-w-[420px] mx-auto bg-white min-h-screen font-sans pb-10">
      {/* 頂部綠色 Header */}
      <div className="bg-[#18C07A] p-6 pt-12 rounded-b-[40px] text-white shadow-lg mb-8">
        <div className="flex justify-between items-center mb-6">
          <button onClick={() => navigate(-1)} className="text-xl">←</button>
          <h2 className="font-black text-lg">Cancel Order</h2>
          <button onClick={() => navigate('/')} className="text-xl">🏠</button>
        </div>
        <div className="flex items-center space-x-4 bg-white/10 p-3 rounded-2xl border border-white/20">
            <img 
              src={booking?.tour?.imageUrl?.startsWith('http') ? booking.tour.imageUrl : `${booking?.tour?.imageUrl}`} 
              alt="" 
              className="w-14 h-14 rounded-xl object-cover" 
            />
            <div>
                <h1 className="font-black text-sm">{booking?.tour?.title}</h1>
                <p className="text-[10px] opacity-70 uppercase">📍 {booking?.tour?.location}</p>
            </div>
        </div>
      </div>

      {/* 內容區 */}
      <div className="p-8">
        <h3 className="text-[#FF4C4C] font-black text-xl mb-4 tracking-tight">Important Notes</h3>
        <p className="text-[11px] text-gray-500 font-bold mb-6">Before cancelling your travel booking, please take note of the following:</p>
        
        <ul className="space-y-5 text-[10px] text-gray-400 leading-relaxed list-disc pl-5 mb-12">
          <li><strong>Cancellation Fees:</strong> Depending on the timing of your cancellation, fees may apply.</li>
          <li><strong>Refund Policy:</strong> Refund eligibility varies by provider. Some bookings may be non-refundable.</li>
          <li><strong>Cancellation Deadline:</strong> Make sure to cancel before the specified deadline.</li>
          <li><strong>Processing Time:</strong> Refunds may take several business days or weeks.</li>
        </ul>

        {/* 勾選框 */}
        <div className="flex items-center space-x-4 mb-10 bg-gray-50 p-4 rounded-2xl border border-gray-100">
          <input 
            type="checkbox" 
            id="agree" 
            checked={isAgreed} 
            onChange={() => setIsAgreed(!isAgreed)}
            className="w-5 h-5 accent-[#FF6B9D] cursor-pointer"
          />
          <label htmlFor="agree" className="text-xs font-black text-slate-700 cursor-pointer select-none">I Agree</label>
        </div>

        {/* 按鈕 */}
        <button 
          onClick={handleConfirmCancel}
          disabled={!isAgreed}
          className={`w-full py-5 rounded-[22px] font-black text-white text-[11px] uppercase tracking-widest transition-all shadow-lg ${
            isAgreed 
            ? 'bg-[#FF6B9D] shadow-pink-100 active:scale-95' 
            : 'bg-gray-200 cursor-not-allowed text-gray-400 shadow-none'
          }`}
        >
          Confirm
        </button>
      </div>
    </div>
  );
};

export default CancelBooking;