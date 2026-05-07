import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axiosInstance from '../axiosConfig';

const EditBooking = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [bookingDate, setBookingDate] = useState('');
  const [phone, setPhone] = useState('');

  // 1. 抓取舊訂單資料
  useEffect(() => {
    axiosInstance.get(`/api/bookings/${id}`)
      .then(res => {
        const data = res.data;
        setBooking(data);
        setQuantity(data.quantity);
        setBookingDate(data.tourDate ? data.tourDate.split('T')[0] : '');
        setPhone(data.personalInfo?.phone || '');
      })
      .catch(err => console.error(err));
  }, [id]);

  if (!booking) return <div className="pt-20 text-center font-black text-gray-300 tracking-widest">LOADING...</div>;

  const unitPrice = booking.totalPrice / booking.quantity; // 算出單價
  const newTotalPrice = unitPrice * quantity;

  // 2. 提交修改
  const handleUpdate = async () => {
    try {
      const payload = {
        tourDate: bookingDate,
        quantity: quantity,
        totalPrice: newTotalPrice,
        personalInfo: {
          ...booking.personalInfo,
          phone: phone
        }
      };

      await axiosInstance.put(`/api/bookings/${id}`, payload);
      alert("Booking updated successfully!");
      navigate('/my-bookings');
    } catch (err) {
      alert("Update failed: " + (err.response?.data?.message || "Error"));
    }
  };

  const labelStyle = "text-[10px] font-black text-gray-400 mb-1 block uppercase tracking-widest";
  const inputStyle = "w-full border-b border-gray-100 py-3 outline-none text-sm font-bold text-slate-800 bg-transparent";

  return (
    <div className="max-w-[420px] mx-auto bg-white min-h-screen font-sans pb-10">
      {/* 綠色 Header */}
      <div className="bg-[#18C07A] p-6 pt-12 rounded-b-[40px] text-white shadow-lg">
        <div className="flex justify-between items-center mb-6">
          <button onClick={() => navigate(-1)} className="text-xl">←</button>
          <h2 className="font-bold text-sm uppercase tracking-widest">Edit Booking</h2>
          <button onClick={() => navigate('/')} className="text-xl">🏠</button>
        </div>
        <h1 className="font-black text-[15px]">{booking.tour?.title}</h1>
        <p className="text-[10px] opacity-70 uppercase tracking-tighter">Current Order ID: {id.substring(0,8)}...</p>
      </div>

      <div className="p-8 space-y-7">
        {/* 日期修改 */}
        <div>
          <label className={labelStyle}>Change Tour Date</label>
          <input 
            type="date" 
            value={bookingDate} 
            onChange={(e) => setBookingDate(e.target.value)} 
            className={inputStyle} 
          />
        </div>

        {/* 數量修改 */}
        <div className="flex justify-between items-center bg-gray-50 p-5 rounded-[24px]">
          <span className="text-sm font-black text-slate-600 uppercase tracking-tighter">Quantity</span>
          <div className="flex items-center space-x-5">
            <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-9 h-9 bg-white rounded-xl shadow-sm font-black">-</button>
            <span className="font-black text-lg">{quantity}</span>
            <button onClick={() => setQuantity(quantity + 1)} className="w-9 h-9 bg-white rounded-xl shadow-sm font-black">+</button>
          </div>
        </div>

        {/* 電話修改 */}
        <div>
          <label className={`${labelStyle} text-blue-500`}>Update Phone Number</label>
          <input 
            type="tel" 
            value={phone} 
            onChange={(e) => setPhone(e.target.value)} 
            className={inputStyle}
          />
        </div>

        {/* 新價格 */}
        <div className="flex justify-between items-center border-t border-dashed pt-6">
          <span className="text-gray-400 font-black text-xs uppercase">New Total :</span>
          <span className="text-2xl font-black text-[#4C4DDC]">AUD {newTotalPrice}.00</span>
        </div>

        <button 
          onClick={handleUpdate} 
          className="w-full bg-[#4C4DDC] text-white font-black py-5 rounded-[22px] shadow-lg mt-6 active:scale-95 transition-all uppercase tracking-widest text-xs"
        >
            Save Changes
        </button>
      </div>
    </div>
  );
};

export default EditBooking;