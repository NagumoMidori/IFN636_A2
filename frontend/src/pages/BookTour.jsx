import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axiosInstance from '../axiosConfig';

const BookTour = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [tour, setTour] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [bookingDate, setBookingDate] = useState('');
  const [phone, setPhone] = useState(''); // 🔴 新增：電話狀態

  useEffect(() => {
    axiosInstance.get(`/api/tours/${id}`)
      .then(res => setTour(res.data))
      .catch(err => console.error(err));
  }, [id]);

  if (!tour) return <div className="pt-20 text-center font-black text-gray-300">LOADING...</div>;

  const totalPrice = tour.price * quantity;

  const handleNext = () => {
    // 🔴 驗證：確保日期與電話都有填寫
    if (!bookingDate) return alert("Please select a tour date!");
    if (!phone) return alert("Please enter your phone number!");

    // 🔴 依照後端要求的特定結構 (Schema) 傳遞資料
    navigate('/payment', { 
      state: { 
        tour: id,               // 後端要求欄位名為 tour (非 tourId)
        tourDate: bookingDate,  // 後端要求欄位名為 tourDate
        quantity, 
        totalPrice,
        tourTitle: tour.title,  // 僅供 Payment 頁面顯示用
        personalInfo: {         // 🔴 後端要求的巢狀物件結構
          fullName: user?.username,
          email: user?.email,
          phone: phone          // 使用者剛填寫的電話
        }
      } 
    });
  };

  const labelStyle = "text-[10px] font-black text-gray-400 mb-1 block uppercase tracking-widest";
  const inputStyle = "w-full border-b border-gray-100 py-3 outline-none text-sm font-bold text-slate-800 bg-transparent focus:border-[#00A651] transition-all";

  return (
    <div className="max-w-[420px] mx-auto bg-white min-h-screen font-sans pb-10">
      {/* 頂部綠色 Header */}
      <div className="bg-[#18C07A] p-6 pt-12 rounded-b-[40px] text-white shadow-lg">
        <div className="flex justify-between items-center mb-6">
          <button onClick={() => navigate(-1)} className="text-xl">←</button>
          <h2 className="font-bold text-sm uppercase tracking-widest">Tour details</h2>
          <button onClick={() => navigate('/')} className="text-xl">🏠</button>
        </div>
        <div className="flex items-center space-x-5">
            <img 
              src={tour.imageUrl?.startsWith('http') ? tour.imageUrl : `${tour.imageUrl}`} 
              alt={tour.title}
              className="w-16 h-16 rounded-2xl object-cover border-2 border-white/20" 
            />
            <div>
                <h1 className="font-black text-[15px] leading-tight">{tour.title}</h1>
                <p className="text-[10px] opacity-70 mt-1 uppercase">📍 {tour.location}</p>
            </div>
        </div>
      </div>

      <div className="p-8 space-y-7">
        <h2 className="text-2xl font-black text-slate-800 tracking-tighter">Book the tour</h2>
        
        {/* 日期選擇 */}
        <div>
          <label className={labelStyle}>Please select a tour date</label>
          <input 
            type="date" 
            value={bookingDate} 
            onChange={(e) => setBookingDate(e.target.value)} 
            className={inputStyle} 
          />
        </div>

        {/* 數量選擇 */}
        <div className="flex justify-between items-center bg-gray-50 p-5 rounded-[24px] border border-white shadow-sm">
          <span className="text-sm font-black text-slate-600 uppercase tracking-tighter">Quantity</span>
          <div className="flex items-center space-x-5">
            <button 
              onClick={() => setQuantity(Math.max(1, quantity - 1))} 
              className="w-9 h-9 bg-white rounded-xl shadow-sm font-black text-slate-800 active:scale-90 transition-all border border-gray-100"
            >-</button>
            <span className="font-black text-lg text-slate-800">{quantity}</span>
            <button 
              onClick={() => setQuantity(quantity + 1)} 
              className="w-9 h-9 bg-white rounded-xl shadow-sm font-black text-slate-800 active:scale-90 transition-all border border-gray-100"
            >+</button>
          </div>
        </div>

        {/* 個人資料區 */}
        <div className="space-y-5 pt-4">
          <h3 className="font-black text-[11px] text-[#00A651] uppercase tracking-[2px]">Contact Information</h3>
          
          <div>
            <label className={labelStyle}>Full Name</label>
            <input readOnly value={user?.username || ''} className={`${inputStyle} text-slate-400`} />
          </div>

          <div>
            <label className={labelStyle}>Email Address</label>
            <input readOnly value={user?.email || ''} className={`${inputStyle} text-slate-400`} />
          </div>

          {/* 🔴 關鍵修正：電話欄位 */}
          <div>
            <label className={`${labelStyle} text-blue-500`}>Phone Number (Required)</label>
            <input 
              type="tel" 
              placeholder="e.g. 0412 345 678" 
              value={phone} 
              onChange={(e) => setPhone(e.target.value)} 
              className={`${inputStyle} border-blue-100 focus:border-blue-500`}
            />
          </div>
        </div>

        {/* 總價計算 */}
        <div className="flex justify-between items-center border-t border-dashed border-gray-200 pt-6">
          <span className="text-gray-400 font-black text-xs uppercase">Total Price :</span>
          <span className="text-2xl font-black text-[#00A651]">AUD {totalPrice}.00</span>
        </div>

        <button 
          onClick={handleNext} 
          className="w-full bg-[#00A651] text-white font-black py-5 rounded-[22px] shadow-[0_10px_20px_rgba(0,166,81,0.2)] mt-6 active:scale-95 transition-all uppercase tracking-widest text-xs"
        >
            Continue to Payment
        </button>
      </div>
    </div>
  );
};

export default BookTour;