import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="fixed top-0 left-0 right-0 z-50 flex justify-center px-4">
      <nav className="mt-2 w-full max-w-[420px] bg-white/80 backdrop-blur-lg border border-gray-100 px-6 py-3 flex justify-between items-center shadow-xl rounded-2xl">
        
        {/* 左側：返回鍵與標題 */}
        <div className="flex items-center">
          {location.pathname !== '/' && (
            <button 
              onClick={() => navigate(-1)} 
              className="mr-3 p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-600"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          )}
          <Link to="/" className="flex flex-col">
            <span className="text-xs font-bold text-emerald-500 uppercase tracking-widest leading-none mb-1">Explore Australia</span>
            <span className="text-lg font-black text-slate-800 leading-none">Welcome</span>
          </Link>
        </div>
        
        {/* 右側按鈕群 */}
        <div className="flex items-center space-x-3">
          {user ? (
            <>
              {/* 🏠 新增的小房子按鈕 (Home) */}
              <Link 
                to="/" 
                title="Home"
                className={`p-2 rounded-xl transition-all ${
                  location.pathname === '/' 
                  ? 'bg-emerald-50 text-emerald-600' 
                  : 'text-gray-400 hover:bg-gray-50'
                }`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
              </Link>

              {/* 登出按鈕 */}
              <button
                onClick={handleLogout}
                className="text-[10px] font-black text-slate-400 border border-slate-100 px-2.5 py-2 rounded-xl uppercase hover:bg-red-50 hover:text-red-500 hover:border-red-100 transition-all"
              >
                Logout
              </button>

              {/* 使用者頭像 */}
              <div className="w-9 h-9 bg-emerald-500 rounded-full border-2 border-white shadow-md overflow-hidden flex items-center justify-center text-white font-black text-xs">
                {user.username?.substring(0, 2).toUpperCase()}
              </div>
            </>
          ) : (
            /* 未登入狀態 */
            <Link 
              to={location.pathname === '/login' ? '/register' : '/login'} 
              className="px-5 py-2.5 bg-emerald-500 text-white text-xs font-black rounded-xl shadow-lg shadow-emerald-100 hover:bg-emerald-600 transition-all uppercase tracking-tight"
            >
              {location.pathname === '/login' ? 'Sign Up' : 'Sign In'}
            </Link>
          )}
        </div>
      </nav>
    </div>
  );
};

export default Navbar;