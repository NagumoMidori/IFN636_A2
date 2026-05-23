// src/pages/Home.jsx
import { useAuth } from '../context/AuthContext';
import AdminHome from './AdminHome';
import UserHome from './UserHome';

const Home = () => {
  const { user } = useAuth();
  return user?.role === 'admin' ? <AdminHome /> : <UserHome />;
};

export default Home;