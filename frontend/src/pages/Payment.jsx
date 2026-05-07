import { useLocation, useNavigate } from 'react-router-dom';
import axiosInstance from '../axiosConfig';

const Payment = () => {
  const { state } = useLocation(); 
  const navigate = useNavigate();

  // 如果使用者沒經過 BookTour 直接跳過來，導回首頁
  if (!state) {
    setTimeout(() => navigate('/'), 0);
    return null;
  }

  const handlePay = async () => {
  try {

    const payload = {
      tour: state.tour,
      tourDate: state.tourDate,
      quantity: state.quantity,
      totalPrice: state.totalPrice,
      personalInfo: state.personalInfo 
    };

    await axiosInstance.post('/api/bookings', payload);
    
    alert("Payment Successful! Order created.");
    navigate('/my-bookings');
  } catch (err) {
    console.error("Payment Error:", err.response?.data);
    alert(`Payment failed: ${err.response?.data?.message || 'Please check your inputs'}`);
  }
};

  const inputStyle = "w-full p-4 bg-gray-50 rounded-2xl border border-gray-100 outline-none font-bold text-sm text-slate-800 placeholder:text-gray-300 focus:bg-white focus:border-blue-500 transition-all";

  return (
    <div className="max-w-[420px] mx-auto bg-white min-h-screen p-8 pt-20 font-sans flex flex-col">
      <div className="flex items-center mb-10">
        <button onClick={() => navigate(-1)} className="mr-4 text-xl">←</button>
        <h1 className="text-2xl font-black text-slate-800 tracking-tight">Payment System</h1>
      </div>

      <div className="space-y-6 flex-1">
        {/* 卡片欄位模擬 */}
        <div>
          <label className="text-[10px] font-black text-gray-400 uppercase mb-2 block">Card Number</label>
          <input type="text" placeholder="XXXX XXXX XXXX XXXX" className={inputStyle} />
        </div>

        <div className="flex space-x-4">
          <div className="flex-1">
            <label className="text-[10px] font-black text-gray-400 uppercase mb-2 block">Expiry</label>
            <input type="text" placeholder="MM/YY" className={inputStyle} />
          </div>
          <div className="flex-1">
            <label className="text-[10px] font-black text-gray-400 uppercase mb-2 block">CVC</label>
            <input type="text" placeholder="123" className={inputStyle} />
          </div>
        </div>
        
        {/* 支付金額摘要 */}
        <div className="mt-12 p-8 bg-blue-600 rounded-[35px] text-white shadow-xl shadow-blue-100 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-10 -mt-10"></div>
            <p className="text-[10px] font-bold uppercase tracking-[2px] opacity-70 mb-2">Total Amount to Pay</p>
            <div className="flex items-baseline space-x-1">
                <span className="text-lg opacity-80 font-bold">AUD</span>
                <span className="text-4xl font-black">{state.totalPrice}.00</span>
            </div>
            <p className="text-[10px] mt-4 opacity-60 font-medium italic">Booking for: {state.tourTitle}</p>
        </div>
      </div>

      {/* 提交按鈕 */}
      <div className="pb-8">
        <button 
          onClick={handlePay} 
          className="w-full bg-[#4C4DDC] text-white font-black py-5 rounded-[22px] shadow-lg shadow-indigo-100 active:scale-95 transition-all uppercase tracking-widest text-xs"
        >
          Confirm & Pay
        </button>
      </div>
    </div>
  );
};

export default Payment;