// src/pages/Home.jsx
import { useAuth } from '../context/AuthContext';
import AdminHome from './AdminHome';
import UserHome from './UserHome';

const Home = () => {
  const { user } = useAuth();
  // 這樣你的程式碼就不會擠在一起，Admin 改 Admin 的，User 改 User 的
  return user?.role === 'admin' ? <AdminHome /> : <UserHome />;
};

export default Home;