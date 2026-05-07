import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../axiosConfig';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const { login } = useAuth();
  const navigate = useNavigate();

  // 🔴 修正：所有非同步請求必須在 handleSubmit 函式內部執行
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // 1. 發送登入請求
      const response = await axiosInstance.post('/api/auth/login', formData);
      
      // 2. 呼叫 AuthContext 的 login 函式存入使用者資料與 Token
      login(response.data);

      // 3. ✅ 統一跳轉邏輯：
      // 不管是 Admin 還是 User，登入後都先去首頁。
      // Admin 如果要管理，再點擊 Navbar 上的齒輪按鈕即可。
      navigate('/');
      
    } catch (error) {
      // 取得後端回傳的錯誤訊息（例如：信箱或密碼錯誤）
      const message = error.response?.data?.message || 'Login failed. Please try again.';
      alert(message);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 px-4">
      <form onSubmit={handleSubmit} className="bg-white p-8 shadow-xl rounded-2xl border border-gray-100">
        <h1 className="text-3xl font-black mb-8 text-center text-slate-800 uppercase tracking-wider">
          Login
        </h1>
        
        <div className="space-y-4">
          {/* Email 欄位 */}
          <input
            type="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
            required
          />
          
          {/* 密碼欄位 */}
          <input
            type="password"
            placeholder="Password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
            required
          />
          
          {/* 登入按鈕 - 使用藍色調符合專業質感 */}
          <button 
            type="submit" 
            className="w-full bg-[#007AFF] hover:bg-blue-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-blue-100 transition-all active:scale-95 mt-4"
          >
            SIGN IN
          </button>
        </div>
        
        {/* 跳轉到註冊頁面 */}
        <div className="mt-6 flex justify-between items-center text-sm">
          <span className="text-gray-400">Don't have an account?</span>
          <button 
            type="button"
            onClick={() => navigate('/register')}
            className="text-blue-600 font-bold hover:underline"
          >
            Create Account
          </button>
        </div>
      </form>
    </div>
  );
};

export default Login;