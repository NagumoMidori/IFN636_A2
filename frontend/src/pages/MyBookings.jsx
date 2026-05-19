import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import axiosInstance from '../axiosConfig';
import { getImageUrl } from '../utils/imageUtils';

const formatDate = (value) => {
  if (!value) return 'Date not set';
  return new Date(value).toLocaleDateString('en-AU', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
};

const formatPrice = (value) => `AUD ${Number(value || 0).toLocaleString('en-AU')}`;

const getStatusClass = (status) => {
  if (status === 'Cancelled') return 'bg-red-50 text-red-700 ring-red-100';
  if (status === 'Confirmed') return 'bg-brand-50 text-brand-700 ring-brand-100';
  return 'bg-amber-50 text-amber-700 ring-amber-100';
};

const MyBookings = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);

      try {
        const response = await axiosInstance.get('/api/orders/my');
        setOrders(response.data);
      } catch (err) {
        console.error('Failed to fetch orders:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const activeOrders = useMemo(
    () => orders.filter((order) => order.status !== 'Cancelled').length,
    [orders]
  );

  const totalPaid = useMemo(
    () => orders.reduce((total, order) => total + Number(order.totalAmount || 0), 0),
    [orders]
  );

  return (
    <section className="bg-white">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold text-brand-700">My orders</p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight text-gray-900">Your upcoming trips</h1>
            <p className="mt-2 text-sm text-gray-500">Review order details, trip dates, and purchased tours.</p>
          </div>
          <Link to="/" className="rounded-lg bg-brand-600 px-5 py-3 text-sm font-semibold text-white hover:bg-brand-700">
            Explore more tours
          </Link>
        </div>

        <div className="mb-8 grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-gray-500">Total orders</p>
            <p className="mt-2 text-3xl font-semibold text-gray-900">{orders.length}</p>
          </div>
          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-gray-500">Active orders</p>
            <p className="mt-2 text-3xl font-semibold text-gray-900">{activeOrders}</p>
          </div>
          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-gray-500">Total paid</p>
            <p className="mt-2 text-3xl font-semibold text-gray-900">{formatPrice(totalPaid)}</p>
          </div>
        </div>

        {loading ? (
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="h-44 animate-pulse rounded-2xl bg-gray-100" />
            ))}
          </div>
        ) : orders.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-gray-300 px-6 py-16 text-center">
            <h2 className="text-2xl font-semibold text-gray-900">No orders yet</h2>
            <p className="mt-3 text-sm text-gray-500">Add tours to your cart and checkout to see orders here.</p>
            <Link
              to="/"
              className="mt-6 inline-flex rounded-lg bg-brand-600 px-5 py-3 text-sm font-semibold text-white hover:bg-brand-700"
            >
              Start exploring
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <article key={order._id} className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
                <div className="flex flex-col gap-4 border-b border-gray-100 pb-5 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <p className="text-xs font-semibold uppercase text-gray-500">Order placed {formatDate(order.createdAt)}</p>
                    <h2 className="mt-2 text-xl font-semibold text-gray-900">Order #{order._id.slice(-6).toUpperCase()}</h2>
                    <p className="mt-1 text-sm text-gray-500">{order.items?.length || 0} tour item(s)</p>
                  </div>
                  <div className="flex flex-wrap items-center gap-3">
                    <span className={`w-fit rounded-full px-3 py-1 text-xs font-semibold ring-1 ${getStatusClass(order.status)}`}>
                      {order.status || 'Pending'}
                    </span>
                    <span className="text-lg font-semibold text-gray-900">{formatPrice(order.totalAmount)}</span>
                  </div>
                </div>

                <div className="mt-5 space-y-4">
                  {(order.items || []).map((item) => (
                    <div key={item._id} className="grid gap-4 rounded-xl border border-gray-100 p-4 sm:grid-cols-[130px_minmax(0,1fr)]">
                      <Link to={item.tour?._id ? `/tours/${item.tour._id}` : '/my-bookings'}>
                        <img
                          src={getImageUrl(item.tour?.imageUrl)}
                          alt={item.tour?.title || 'Tour'}
                          className="aspect-[4/3] w-full rounded-lg object-cover"
                          onError={(event) => {
                            event.currentTarget.src = '/images/bondi_beach.jpg';
                          }}
                        />
                      </Link>

                      <div className="min-w-0">
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                          <div>
                            <Link
                              to={item.tour?._id ? `/tours/${item.tour._id}` : '/my-bookings'}
                              className="text-base font-semibold text-gray-900 hover:text-brand-700"
                            >
                              {item.tour?.title || 'Unknown tour'}
                            </Link>
                            <p className="mt-1 text-sm text-gray-500">{item.tour?.location || 'Location unavailable'}</p>
                          </div>
                          {order.status !== 'Cancelled' && item.tour?._id && (
                            <Link
                              to={`/tours/${item.tour._id}#reviews`}
                              className="w-fit rounded-lg border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"
                            >
                              Write a review
                            </Link>
                          )}
                        </div>

                        <div className="mt-4 grid gap-4 sm:grid-cols-4">
                          <div>
                            <p className="text-xs font-semibold uppercase text-gray-500">Date</p>
                            <p className="mt-1 text-sm font-semibold text-gray-900">{formatDate(item.tourDate)}</p>
                          </div>
                          <div>
                            <p className="text-xs font-semibold uppercase text-gray-500">Guests</p>
                            <p className="mt-1 text-sm font-semibold text-gray-900">{item.quantity || 1}</p>
                          </div>
                          <div>
                            <p className="text-xs font-semibold uppercase text-gray-500">Phone</p>
                            <p className="mt-1 text-sm font-semibold text-gray-900">{item.personalInfo?.phone || 'Not provided'}</p>
                          </div>
                          <div>
                            <p className="text-xs font-semibold uppercase text-gray-500">Item total</p>
                            <p className="mt-1 text-sm font-semibold text-gray-900">{formatPrice(item.totalPrice)}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default MyBookings;
