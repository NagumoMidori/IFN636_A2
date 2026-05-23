import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../axiosConfig';

const AdminOrders = () => {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axiosInstance.get('/api/bookings/all')
      .then((res) => setBookings(res.data))
      .catch((err) => console.error('Failed to fetch orders:', err))
      .finally(() => setLoading(false));
  }, []);

  const confirmed = bookings.filter((b) => b.status === 'Confirmed').length;
  const pending = bookings.filter((b) => !b.status || b.status === 'Pending').length;
  const cancelled = bookings.filter((b) => b.status === 'Cancelled').length;

  if (loading) {
    return (
      <div className="p-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-48" />
          <div className="grid grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => <div key={i} className="h-20 bg-gray-200 rounded-xl" />)}
          </div>
          <div className="h-96 bg-gray-200 rounded-xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Orders</h1>
        <p className="text-sm text-gray-500 mt-1">{bookings.length} orders total</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <p className="text-sm text-gray-500">Total Orders</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{bookings.length}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <p className="text-sm text-gray-500">Confirmed</p>
          <p className="text-2xl font-bold text-green-700 mt-1">{confirmed}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <p className="text-sm text-gray-500">Pending</p>
          <p className="text-2xl font-bold text-amber-700 mt-1">{pending}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <p className="text-sm text-gray-500">Cancelled</p>
          <p className="text-2xl font-bold text-red-700 mt-1">{cancelled}</p>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200">
        <div className="overflow-x-auto">
          <table className="w-full text-left table-fixed">
            <colgroup>
              <col className="w-[22%]" />
              <col className="w-[22%]" />
              <col className="w-[16%]" />
              <col className="w-[12%]" />
              <col className="w-[14%]" />
              <col className="w-[14%]" />
            </colgroup>
            <thead>
              <tr className="border-b border-gray-100">
                <th className="px-6 py-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                <th className="px-6 py-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Tour</th>
                <th className="px-6 py-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Guests</th>
                <th className="px-6 py-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                <th className="px-6 py-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {bookings.map((booking) => (
                <tr key={booking._id} onClick={() => navigate(`/admin/orders/${booking._id}`)} className="hover:bg-gray-50 transition-colors cursor-pointer">
                  <td className="px-6 py-5 text-sm font-medium text-gray-900">
                    {booking.contactName || booking.personalInfo?.fullName || booking.user?.username || 'N/A'}
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-3">
                      <img
                        src={booking.tour?.imageUrl?.startsWith('http') ? booking.tour.imageUrl : `http://localhost:5001${booking.tour?.imageUrl}`}
                        alt={booking.tour?.title}
                        className="w-10 h-10 rounded-lg object-cover bg-gray-100"
                        onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=80&h=80&fit=crop'; }}
                      />
                      <span className="text-sm text-gray-700 truncate">{booking.tour?.title || 'N/A'}</span>
                    </div>
                  </td>
                  <td className="px-6 py-5 text-sm text-gray-500">
                    {booking.selectedDate
                      ? new Date(booking.selectedDate).toLocaleDateString()
                      : booking.tourDate
                        ? new Date(booking.tourDate).toLocaleDateString()
                        : 'N/A'}
                  </td>
                  <td className="px-6 py-5 text-sm text-gray-500">
                    {booking.quantity || booking.guests || '—'}
                  </td>
                  <td className="px-6 py-5 text-sm font-medium text-gray-900">
                    AUD ${booking.totalPrice || 0}
                  </td>
                  <td className="px-6 py-5">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      booking.status === 'Cancelled'
                        ? 'bg-red-50 text-red-700'
                        : booking.status === 'Confirmed'
                          ? 'bg-green-50 text-green-700'
                          : 'bg-amber-50 text-amber-700'
                    }`}>
                      {booking.status || 'Pending'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {bookings.length === 0 && (
            <div className="text-center py-16 text-sm text-gray-400">
              No orders yet.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminOrders;
