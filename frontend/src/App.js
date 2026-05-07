import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminHome from './pages/AdminHome';
import UserHome from './pages/UserHome'; 
import TourDetail from './pages/TourDetail';
import ManageTours from './pages/ManageTours'; 
import EditTour from './pages/EditTour';
import Navbar from './components/Navbar';
import MyBookings from './pages/MyBookings';
import BookTour from './pages/BookTour';  
import Payment from './pages/Payment';    
import EditBooking from './pages/EditBooking';
import CancelBooking from './pages/CancelBooking'; 
import AdminOrders from './pages/AdminOrders';

function App() {
  const { user } = useAuth();

  return (
    <Router>
      <Navbar />
      
      <div className="min-h-screen bg-gray-50">
        <Routes>
          {/* 1. 首頁：動態判斷 Admin 或 User */}
          <Route path="/" element={
            user ? (
              user.role === 'admin' ? <AdminHome /> : <UserHome />
            ) : (
              <Navigate to="/login" />
            )
          } />

          {/* 2. 認證路由 */}
          <Route path="/login" element={!user ? <Login /> : <Navigate to="/" />} />
          <Route path="/register" element={!user ? <Register /> : <Navigate to="/" />} />
          
          {/* 3. User 專屬：詳情與預訂流程 */}
          <Route path="/tour/:id" element={user ? <TourDetail /> : <Navigate to="/login" />} />
          
          {/* 🔴 補上這兩行，預訂功能才能正常運作 */}
          <Route path="/book-tour/:id" element={user ? <BookTour /> : <Navigate to="/login" />} />
          <Route path="/payment" element={user ? <Payment /> : <Navigate to="/login" />} />
          <Route path="/edit-booking/:id" element={user ? <EditBooking /> : <Navigate to="/login" />} />
          <Route path="/my-bookings" element={user ? <MyBookings /> : <Navigate to="/login" />} />
          <Route path="/cancel-booking/:id" element={user ? <CancelBooking /> : <Navigate to="/login" />} />

          {/* 4. Admin 專屬路由 */}
          <Route 
            path="/manage-tours" 
            element={user?.role === 'admin' ? <ManageTours /> : <Navigate to="/" />} 
          />
          <Route 
            path="/admin-orders" 
            element={user?.role === 'admin' ? <AdminOrders /> : <Navigate to="/" />} 
          />
          <Route 
            path="/edit-tour/:id" 
            element={user?.role === 'admin' ? <EditTour /> : <Navigate to="/" />} 
          />

          {/* 5. 防錯路由 */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;