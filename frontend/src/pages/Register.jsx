import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../axiosConfig';

const Register = () => {
  // 🔴 修正 1：將 name 改為 username，並新增 phone 欄位（對齊 Figma）
  const [formData, setFormData] = useState({ 
    username: '', 
    email: '', 
    password: '',
    phone: '' 
  });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // 發送到後端時，formData 裡現在有 username 了
      await axiosInstance.post('/api/auth/register', formData);
      alert('Registration successful. Please log in.');
      navigate('/login');
    } catch (error) {
      // 建議：顯示後端回傳的具體錯誤訊息，方便除錯
      const errorMsg = error.response?.data?.message || 'Registration failed. Please try again.';
      alert(errorMsg);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 px-4">
      <form onSubmit={handleSubmit} className="bg-white p-8 shadow-xl rounded-2xl border border-gray-100">
        <h1 className="text-3xl font-black mb-8 text-center text-gray-800 uppercase tracking-wider">Register</h1>
        
        {/* 🔴 修正 2：Value 和 Set 都要對應 username */}
        <div className="space-y-4">
          <input
            type="text"
            placeholder="Username"
            value={formData.username}
            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
            className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 outline-none transition-all"
            required
          />
          
          <input
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 outline-none transition-all"
            required
          />

          {/* 🔴 修正 3：新增手機欄位（對齊你的後端與 Figma） */}
          <input
            type="text"
            placeholder="Phone Number"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 outline-none transition-all"
          />

          <input
            type="password"
            placeholder="Password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 outline-none transition-all"
            required
          />
          
          <button 
            type="submit" 
            className="w-full bg-[#00A651] hover:bg-green-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-green-100 transition-all active:scale-95 mt-4"
          >
            CREATE ACCOUNT
          </button>
        </div>
        
        <p className="text-center text-gray-400 text-sm mt-6">
          Already have an account? 
          <span className="text-green-600 font-bold cursor-pointer ml-1" onClick={() => navigate('/login')}>Login</span>
        </p>
      </form>
    </div>
  );
};

export default Register;