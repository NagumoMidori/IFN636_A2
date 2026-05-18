import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axiosInstance from '../axiosConfig';
import { getImageUrl } from '../utils/imageUtils';

const AdminOrderDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axiosInstance.get(`/api/bookings/${id}`)
      .then((res) => setBooking(res.data))
      .catch((err) => console.error('Failed to fetch order:', err))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="p-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-48" />
          <div className="h-[500px] bg-gray-200 rounded-xl max-w-4xl" />
        </div>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="p-8">
        <p className="text-gray-500">Order not found.</p>
        <button onClick={() => navigate('/admin/orders')} className="mt-4 text-sm text-emerald-600 hover:text-emerald-700 font-medium">
          Back to Orders
        </button>
      </div>
    );
  }

  const tour = booking.tour;
  const imageUrl = getImageUrl(tour?.imageUrl);

  const statusColor = {
    Confirmed: 'bg-green-50 text-green-700',
    Pending: 'bg-amber-50 text-amber-700',
    Cancelled: 'bg-red-50 text-red-700',
  };

  const labelStyle = 'text-sm text-gray-500';
  const valueStyle = 'text-sm font-medium text-gray-900 mt-0.5';

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Order Detail</h1>
          <p className="text-sm text-gray-500 mt-1">Order ID: {booking._id}</p>
        </div>
        <button
          onClick={() => navigate('/admin/orders')}
          className="text-sm font-medium text-gray-500 hover:text-gray-700 border border-gray-200 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors"
        >
          Back to Orders
        </button>
      </div>

      <div className="max-w-4xl space-y-6">
        {/* Tour Info */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-base font-semibold text-gray-900 mb-4">Tour Information</h2>
          <div className="flex items-start gap-5">
            <img
              src={imageUrl}
              alt={tour?.title}
              className="w-28 h-20 rounded-lg object-cover bg-gray-100 flex-shrink-0"
              onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=200&h=140&fit=crop'; }}
            />
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-8 gap-y-4 flex-1">
              <div>
                <p className={labelStyle}>Tour Name</p>
                <p className={valueStyle}>{tour?.title || 'N/A'}</p>
              </div>
              <div>
                <p className={labelStyle}>Location</p>
                <p className={valueStyle}>{tour?.location || 'N/A'}</p>
              </div>
              <div>
                <p className={labelStyle}>Unit Price</p>
                <p className={valueStyle}>AUD ${tour?.price || 0}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Customer Info */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-base font-semibold text-gray-900 mb-4">Customer Information</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-8 gap-y-4">
            <div>
              <p className={labelStyle}>Full Name</p>
              <p className={valueStyle}>{booking.personalInfo?.fullName || booking.user?.username || 'N/A'}</p>
            </div>
            <div>
              <p className={labelStyle}>Email</p>
              <p className={valueStyle}>{booking.personalInfo?.email || 'N/A'}</p>
            </div>
            <div>
              <p className={labelStyle}>Phone</p>
              <p className={valueStyle}>{booking.personalInfo?.phone || 'N/A'}</p>
            </div>
          </div>
        </div>

        {/* Booking Details */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-base font-semibold text-gray-900 mb-4">Booking Details</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-x-8 gap-y-4">
            <div>
              <p className={labelStyle}>Tour Date</p>
              <p className={valueStyle}>
                {booking.tourDate ? new Date(booking.tourDate).toLocaleDateString() : 'N/A'}
              </p>
            </div>
            <div>
              <p className={labelStyle}>Guests</p>
              <p className={valueStyle}>{booking.quantity || 1}</p>
            </div>
            <div>
              <p className={labelStyle}>Total Price</p>
              <p className={valueStyle}>AUD ${booking.totalPrice || 0}</p>
            </div>
            <div>
              <p className={labelStyle}>Status</p>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium mt-0.5 ${statusColor[booking.status] || statusColor.Pending}`}>
                {booking.status || 'Pending'}
              </span>
            </div>
          </div>
        </div>

        {/* Timestamps */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-base font-semibold text-gray-900 mb-4">Timeline</h2>
          <div className="grid grid-cols-2 gap-x-8 gap-y-4">
            <div>
              <p className={labelStyle}>Created At</p>
              <p className={valueStyle}>
                {booking.createdAt ? new Date(booking.createdAt).toLocaleString() : 'N/A'}
              </p>
            </div>
            <div>
              <p className={labelStyle}>Last Updated</p>
              <p className={valueStyle}>
                {booking.updatedAt ? new Date(booking.updatedAt).toLocaleString() : 'N/A'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminOrderDetail;
