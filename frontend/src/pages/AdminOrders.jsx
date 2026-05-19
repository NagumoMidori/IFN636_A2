import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../axiosConfig';

const formatDate = (value) => {
  if (!value) return 'N/A';
  return new Date(value).toLocaleDateString('en-AU', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
};

const formatPrice = (value) => `AUD ${Number(value || 0).toLocaleString('en-AU')}`;

const getStatusClass = (status) => {
  if (status === 'Cancelled') return 'bg-red-50 text-red-700';
  if (status === 'Confirmed') return 'bg-green-50 text-green-700';
  return 'bg-amber-50 text-amber-700';
};

const AdminOrders = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axiosInstance.get('/api/orders/all')
      .then((res) => setOrders(res.data))
      .catch((err) => console.error('Failed to fetch orders:', err))
      .finally(() => setLoading(false));
  }, []);

  const summary = useMemo(() => ({
    confirmed: orders.filter((order) => order.status === 'Confirmed').length,
    pending: orders.filter((order) => !order.status || order.status === 'Pending').length,
    cancelled: orders.filter((order) => order.status === 'Cancelled').length,
  }), [orders]);

  if (loading) {
    return (
      <div className="p-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 w-48 rounded bg-gray-200" />
          <div className="grid grid-cols-3 gap-6">
            {[1, 2, 3].map((item) => <div key={item} className="h-20 rounded-xl bg-gray-200" />)}
          </div>
          <div className="h-96 rounded-xl bg-gray-200" />
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Orders</h1>
        <p className="mt-1 text-sm text-gray-500">{orders.length} orders total</p>
      </div>

      <div className="mb-8 grid grid-cols-2 gap-6 sm:grid-cols-4">
        <div className="rounded-xl border border-gray-200 bg-white p-5">
          <p className="text-sm text-gray-500">Total Orders</p>
          <p className="mt-1 text-2xl font-bold text-gray-900">{orders.length}</p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-5">
          <p className="text-sm text-gray-500">Confirmed</p>
          <p className="mt-1 text-2xl font-bold text-green-700">{summary.confirmed}</p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-5">
          <p className="text-sm text-gray-500">Pending</p>
          <p className="mt-1 text-2xl font-bold text-amber-700">{summary.pending}</p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-5">
          <p className="text-sm text-gray-500">Cancelled</p>
          <p className="mt-1 text-2xl font-bold text-red-700">{summary.cancelled}</p>
        </div>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white">
        <div className="overflow-x-auto">
          <table className="w-full table-fixed text-left">
            <colgroup>
              <col className="w-[22%]" />
              <col className="w-[18%]" />
              <col className="w-[14%]" />
              <col className="w-[16%]" />
              <col className="w-[14%]" />
              <col className="w-[16%]" />
            </colgroup>
            <thead>
              <tr className="border-b border-gray-100">
                <th className="px-6 py-4 text-xs font-medium uppercase tracking-wider text-gray-500">Customer</th>
                <th className="px-6 py-4 text-xs font-medium uppercase tracking-wider text-gray-500">Order</th>
                <th className="px-6 py-4 text-xs font-medium uppercase tracking-wider text-gray-500">Items</th>
                <th className="px-6 py-4 text-xs font-medium uppercase tracking-wider text-gray-500">Created</th>
                <th className="px-6 py-4 text-xs font-medium uppercase tracking-wider text-gray-500">Total</th>
                <th className="px-6 py-4 text-xs font-medium uppercase tracking-wider text-gray-500">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {orders.map((order) => (
                <tr
                  key={order._id}
                  onClick={() => navigate(`/admin/orders/${order._id}`)}
                  className="cursor-pointer transition-colors hover:bg-gray-50"
                >
                  <td className="px-6 py-5 text-sm font-medium text-gray-900">
                    <div className="truncate">{order.user?.username || 'N/A'}</div>
                    <div className="truncate text-xs font-normal text-gray-500">{order.user?.email || 'No email'}</div>
                  </td>
                  <td className="px-6 py-5 text-sm text-gray-500">
                    #{order._id.slice(-6).toUpperCase()}
                  </td>
                  <td className="px-6 py-5 text-sm text-gray-500">
                    {order.items?.length || 0} item(s)
                  </td>
                  <td className="px-6 py-5 text-sm text-gray-500">
                    {formatDate(order.createdAt)}
                  </td>
                  <td className="px-6 py-5 text-sm font-medium text-gray-900">
                    {formatPrice(order.totalAmount)}
                  </td>
                  <td className="px-6 py-5">
                    <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusClass(order.status)}`}>
                      {order.status || 'Pending'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {orders.length === 0 && (
            <div className="py-16 text-center text-sm text-gray-400">
              No orders yet.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminOrders;
