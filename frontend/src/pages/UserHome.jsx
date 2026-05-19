import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axiosInstance from '../axiosConfig';
import { useAuth } from '../context/AuthContext';
// Import CartContext and Image Utility
import { useCart } from '../context/cartContext';
import { getImageUrl } from '../utils/imageUtils';


 //Format date string to Australian standard
const formatDate = (value) => {
  if (!value) return 'Date not set';
  return new Date(value).toLocaleDateString('en-AU', {
    day: 'numeric', month: 'short', year: 'numeric',
  });
};


//Format price to AUD currency format

const formatPrice = (value) => `AUD ${Number(value || 0).toLocaleString('en-AU')}`;

const UserHome = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  // Get cart state from Context for real-time synchronization
  const { cart } = useCart();
  
  const [tours, setTours] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Derive cart item count from the centralized state
  const cartCount = cart?.items?.length || 0;


  // Fetch tours and user orders on component mount

  useEffect(() => {
    const fetchDashboard = async () => {
      setLoading(true);
      try {
        const [toursResponse, ordersResponse] = await Promise.all([
          axiosInstance.get('/api/tours'),
          axiosInstance.get('/api/orders/my'),
        ]);
        setTours(toursResponse.data);
        setOrders(ordersResponse.data);
      } catch (err) {
        console.error('Failed to load dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  // Filter top 3 recent orders and top 4 recommended tours for the dashboard view
  const recentOrders = useMemo(() => orders.slice(0, 3), [orders]);
  const recommendedTours = useMemo(() => tours.slice(0, 4), [tours]);

  const summariseOrderTours = (order) => {
    const items = order.items || [];
    if (items.length === 0) return 'No tour items';
    const firstTitle = items[0].tour?.title || 'Unknown tour';
    const extra = items.length - 1;
    return extra > 0 ? `${firstTitle} + ${extra} more` : firstTitle;
  };

  return (
    <section className="bg-white">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
        
        {/* Welcome Hero Section */}
        <div className="mb-8 rounded-3xl bg-gray-900 px-6 py-8 text-white sm:px-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-sm font-semibold text-brand-300">Account Overview</p>
              <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
                Welcome back, {user?.username}
              </h1>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-gray-300">
                Manage your travel bookings, review your cart, and discover more Australian tour packages here.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link to="/cart" className="rounded-lg bg-white px-5 py-3 text-sm font-semibold text-gray-900 hover:bg-gray-100">
                View Cart
              </Link>
              <Link to="/my-bookings" className="rounded-lg border border-white/20 px-5 py-3 text-sm font-semibold text-white hover:bg-white/10">
                My Bookings
              </Link>
            </div>
          </div>
        </div>

        {/* Statistical Summary Cards */}
        <div className="mb-10 grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-gray-500">Items in Cart</p>
            {/* Display count from synchronized CartContext */}
            <p className="mt-2 text-3xl font-semibold text-gray-900">{cartCount}</p>
          </div>
          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-gray-500">Total Orders</p>
            <p className="mt-2 text-3xl font-semibold text-gray-900">{orders.length}</p>
          </div>
          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-gray-500">Available Tours</p>
            <p className="mt-2 text-3xl font-semibold text-gray-900">{tours.length}</p>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px]">
          
          {/* Recommended Tours Section */}
          <div>
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-2xl font-semibold text-gray-900">Recommended Tours</h2>
              <Link to="/" className="text-sm font-semibold text-gray-700 hover:text-gray-900">View All</Link>
            </div>

            {loading ? (
              <div className="grid gap-5 sm:grid-cols-2">
                {Array.from({ length: 4 }).map((_, index) => (
                  <div key={index} className="h-72 animate-pulse rounded-2xl bg-gray-100" />
                ))}
              </div>
            ) : (
              <div className="grid gap-5 sm:grid-cols-2">
                {recommendedTours.map((tour) => (
                  <article
                    key={tour._id}
                    onClick={() => navigate(`/tours/${tour._id}`)}
                    className="group cursor-pointer rounded-2xl border border-gray-200 bg-white p-4 shadow-sm transition hover:shadow-md"
                  >
                    <img
                      src={getImageUrl(tour.imageUrl)}
                      alt={tour.title}
                      className="aspect-[4/3] w-full rounded-xl object-cover"
                      onError={(e) => { e.currentTarget.src = '/images/bondi_beach.jpg'; }}
                    />
                    <h3 className="mt-4 truncate text-lg font-semibold text-gray-900 group-hover:underline">{tour.title}</h3>
                    <p className="mt-1 text-sm text-gray-500">{tour.location}</p>
                    <p className="mt-3 text-sm font-semibold text-gray-900">{formatPrice(tour.price)} / per person</p>
                  </article>
                ))}
              </div>
            )}
          </div>

          {/* Sidebar: Recent Orders */}
          <aside className="h-fit rounded-2xl border border-gray-200 bg-white p-6 shadow-sm lg:sticky lg:top-28">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Recent Orders</h2>
              <Link to="/my-bookings" className="text-sm font-semibold text-gray-700 hover:text-gray-900">Manage</Link>
            </div>

            {recentOrders.length === 0 ? (
              <div className="mt-6 rounded-xl bg-gray-50 p-5 text-sm leading-6 text-gray-500">
                No orders yet. Start your journey by adding tours to the cart and checking out.
              </div>
            ) : (
              <div className="mt-5 space-y-4">
                {recentOrders.map((order) => (
                  <button
                    key={order._id}
                    type="button"
                    onClick={() => navigate('/my-bookings')}
                    className="block w-full rounded-xl border border-gray-100 p-4 text-left hover:bg-gray-50"
                  >
                    <p className="truncate text-sm font-semibold text-gray-900">
                      {summariseOrderTours(order)}
                    </p>
                    <p className="mt-1 text-xs text-gray-500">{formatDate(order.createdAt)}</p>
                    <p className="mt-2 text-sm font-semibold text-gray-900">{formatPrice(order.totalAmount)}</p>
                  </button>
                ))}
              </div>
            )}
          </aside>
        </div>
      </div>
    </section>
  );
};

export default UserHome;