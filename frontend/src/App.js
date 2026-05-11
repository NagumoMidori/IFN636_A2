import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import PublicLayout from './layouts/PublicLayout';
import AuthLayout from './layouts/AuthLayout';
import AdminLayout from './layouts/AdminLayout';
import ProtectedRoute from './components/ProtectedRoute';

import Homepage from './pages/Homepage';
import Login from './pages/Login';
import Register from './pages/Register';
import TourDetail from './pages/TourDetail';
import Cart from './pages/Cart';
import Payment from './pages/Payment';
import MyBookings from './pages/MyBookings';
import EditBooking from './pages/EditBooking';
import CancelBooking from './pages/CancelBooking';
import UserHome from './pages/UserHome';

import AdminHome from './pages/AdminHome';
import TourList from './pages/TourList';
import ManageTours from './pages/ManageTours';
import EditTour from './pages/EditTour';
import AdminOrders from './pages/AdminOrders';
import AdminOrderDetail from './pages/AdminOrderDetail';

function App() {
  return (
    <Router>
      <Routes>
        {/* Auth pages: no footer */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Route>

        {/* C-end: Public Layout */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Homepage />} />
          <Route path="/tours/:id" element={<TourDetail />} />

          <Route path="/cart" element={<ProtectedRoute><Cart /></ProtectedRoute>} />
          <Route path="/payment" element={<ProtectedRoute><Payment /></ProtectedRoute>} />
          <Route path="/my-bookings" element={<ProtectedRoute><MyBookings /></ProtectedRoute>} />
          <Route path="/edit-booking/:id" element={<ProtectedRoute><EditBooking /></ProtectedRoute>} />
          <Route path="/cancel-booking/:id" element={<ProtectedRoute><CancelBooking /></ProtectedRoute>} />
          <Route path="/dashboard" element={<ProtectedRoute><UserHome /></ProtectedRoute>} />
        </Route>

        {/* B-end: Admin Layout */}
        <Route element={<AdminLayout />}>
          <Route path="/admin" element={<ProtectedRoute requiredRole="admin"><AdminHome /></ProtectedRoute>} />
          <Route path="/admin/tours" element={<ProtectedRoute requiredRole="admin"><TourList /></ProtectedRoute>} />
          <Route path="/admin/tours/new" element={<ProtectedRoute requiredRole="admin"><ManageTours /></ProtectedRoute>} />
          <Route path="/admin/tours/:id/edit" element={<ProtectedRoute requiredRole="admin"><EditTour /></ProtectedRoute>} />
          <Route path="/admin/orders" element={<ProtectedRoute requiredRole="admin"><AdminOrders /></ProtectedRoute>} />
          <Route path="/admin/orders/:id" element={<ProtectedRoute requiredRole="admin"><AdminOrderDetail /></ProtectedRoute>} />
        </Route>

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
