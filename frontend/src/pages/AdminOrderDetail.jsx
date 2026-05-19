import { useCallback, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axiosInstance from '../axiosConfig';
import { getImageUrl } from '../utils/imageUtils';

const formatDate = (value) => {
  if (!value) return 'N/A';
  return new Date(value).toLocaleString('en-AU', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

const formatPrice = (value) => `AUD ${Number(value || 0).toLocaleString('en-AU')}`;

const statusColor = {
  Confirmed: 'bg-green-50 text-green-700',
  Pending: 'bg-amber-50 text-amber-700',
  Cancelled: 'bg-red-50 text-red-700',
};

const labelStyle = 'text-sm text-gray-500';
const valueStyle = 'mt-0.5 text-sm font-medium text-gray-900';

const AdminOrderDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [statusSaving, setStatusSaving] = useState(false);

  const fetchOrder = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get(`/api/orders/${id}`);
      setOrder(response.data);
    } catch (err) {
      console.error('Failed to fetch order:', err);
      setOrder(null);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchOrder();
  }, [fetchOrder]);

  const handleStatusChange = async (status) => {
    setStatusSaving(true);
    try {
      const response = await axiosInstance.patch(`/api/orders/${id}/status`, { status });
      setOrder(response.data);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update order status.');
    } finally {
      setStatusSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="p-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 w-48 rounded bg-gray-200" />
          <div className="h-[500px] max-w-5xl rounded-xl bg-gray-200" />
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="p-8">
        <p className="text-gray-500">Order not found.</p>
        <button
          onClick={() => navigate('/admin/orders')}
          className="mt-4 text-sm font-medium text-emerald-600 hover:text-emerald-700"
        >
          Back to Orders
        </button>
      </div>
    );
  }

  const firstItem = order.items?.[0];
  const primaryContact = firstItem?.personalInfo || {};

  return (
    <div className="p-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Order Detail</h1>
          <p className="mt-1 text-sm text-gray-500">Order ID: {order._id}</p>
        </div>
        <button
          onClick={() => navigate('/admin/orders')}
          className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700"
        >
          Back to Orders
        </button>
      </div>

      <div className="max-w-5xl space-y-6">
        <div className="rounded-xl border border-gray-200 bg-white p-6">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <h2 className="mb-4 text-base font-semibold text-gray-900">Customer Information</h2>
              <div className="grid gap-x-8 gap-y-4 sm:grid-cols-3">
                <div>
                  <p className={labelStyle}>Full Name</p>
                  <p className={valueStyle}>{primaryContact.fullName || order.user?.username || 'N/A'}</p>
                </div>
                <div>
                  <p className={labelStyle}>Email</p>
                  <p className={valueStyle}>{primaryContact.email || order.user?.email || 'N/A'}</p>
                </div>
                <div>
                  <p className={labelStyle}>Phone</p>
                  <p className={valueStyle}>{primaryContact.phone || 'N/A'}</p>
                </div>
              </div>
            </div>

            <div className="min-w-[220px] rounded-xl bg-gray-50 p-4">
              <p className={labelStyle}>Order Total</p>
              <p className="mt-1 text-2xl font-bold text-gray-900">{formatPrice(order.totalAmount)}</p>
              <span className={`mt-3 inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${statusColor[order.status] || statusColor.Pending}`}>
                {order.status || 'Pending'}
              </span>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-6">
          <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="text-base font-semibold text-gray-900">Order Items</h2>
            <p className="text-sm text-gray-500">{order.items?.length || 0} item(s)</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full table-fixed text-left">
              <colgroup>
                <col className="w-[36%]" />
                <col className="w-[18%]" />
                <col className="w-[14%]" />
                <col className="w-[16%]" />
                <col className="w-[16%]" />
              </colgroup>
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="py-3 pr-4 text-xs font-medium uppercase tracking-wider text-gray-500">Tour</th>
                  <th className="py-3 pr-4 text-xs font-medium uppercase tracking-wider text-gray-500">Date</th>
                  <th className="py-3 pr-4 text-xs font-medium uppercase tracking-wider text-gray-500">Guests</th>
                  <th className="py-3 pr-4 text-xs font-medium uppercase tracking-wider text-gray-500">Unit Price</th>
                  <th className="py-3 text-xs font-medium uppercase tracking-wider text-gray-500">Item Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {(order.items || []).map((item) => (
                  <tr key={item._id}>
                    <td className="py-4 pr-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={getImageUrl(item.tour?.imageUrl)}
                          alt={item.tour?.title || 'Tour'}
                          className="h-12 w-16 rounded-lg bg-gray-100 object-cover"
                          onError={(event) => {
                            event.currentTarget.src = '/images/bondi_beach.jpg';
                          }}
                        />
                        <div className="min-w-0">
                          <p className="truncate text-sm font-medium text-gray-900">{item.tour?.title || 'N/A'}</p>
                          <p className="truncate text-xs text-gray-500">{item.tour?.location || 'Location unavailable'}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 pr-4 text-sm text-gray-500">{item.tourDate || 'N/A'}</td>
                    <td className="py-4 pr-4 text-sm text-gray-500">{item.quantity || 1}</td>
                    <td className="py-4 pr-4 text-sm text-gray-900">{formatPrice(item.unitPrice)}</td>
                    <td className="py-4 text-sm font-medium text-gray-900">{formatPrice(item.totalPrice)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-6">
          <h2 className="mb-4 text-base font-semibold text-gray-900">Status Management</h2>
          <div className="flex flex-wrap gap-3">
            {['Pending', 'Confirmed', 'Cancelled'].map((status) => (
              <button
                key={status}
                type="button"
                onClick={() => handleStatusChange(status)}
                disabled={statusSaving || order.status === status}
                className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-400"
              >
                {order.status === status ? `${status} selected` : `Set ${status}`}
              </button>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-6">
          <h2 className="mb-4 text-base font-semibold text-gray-900">Timeline</h2>
          <div className="grid gap-x-8 gap-y-4 sm:grid-cols-3">
            <div>
              <p className={labelStyle}>Created At</p>
              <p className={valueStyle}>{formatDate(order.createdAt)}</p>
            </div>
            <div>
              <p className={labelStyle}>Last Updated</p>
              <p className={valueStyle}>{formatDate(order.updatedAt)}</p>
            </div>
            <div>
              <p className={labelStyle}>Payment</p>
              <p className={valueStyle}>{order.paymentStatus || 'Paid'}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminOrderDetail;
