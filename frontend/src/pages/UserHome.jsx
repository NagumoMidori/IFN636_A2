import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axiosInstance from '../axiosConfig';
import { useAuth } from '../context/AuthContext';
import { getCartCount, getImageUrl, subscribeToCartUpdates } from '../utils/cartStorage';

const formatDate = (value) => {
  if (!value) return 'Date not set';
  return new Date(value).toLocaleDateString('en-AU', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
};

const formatPrice = (value) => `AUD ${Number(value || 0).toLocaleString('en-AU')}`;

const UserHome = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [tours, setTours] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [cartCount, setCartCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      setLoading(true);

      try {
        const [toursResponse, bookingsResponse] = await Promise.all([
          axiosInstance.get('/api/tours'),
          axiosInstance.get('/api/bookings/my-bookings'),
        ]);
        setTours(toursResponse.data);
        setBookings(bookingsResponse.data);
      } catch (err) {
        console.error('Failed to load dashboard:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  useEffect(() => {
    const updateCartCount = () => setCartCount(getCartCount());
    updateCartCount();
    return subscribeToCartUpdates(updateCartCount);
  }, []);

  const recentBookings = useMemo(() => bookings.slice(0, 3), [bookings]);
  const recommendedTours = useMemo(() => tours.slice(0, 4), [tours]);

  return (
    <section className="bg-white">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
        <div className="mb-8 rounded-3xl bg-gray-900 px-6 py-8 text-white sm:px-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-sm font-semibold text-brand-300">Account overview</p>
              <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">Welcome back, {user?.username}</h1>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-gray-300">
                Review your cart, manage bookings, and keep exploring Australian tour packages from one place.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link to="/cart" className="rounded-lg bg-white px-5 py-3 text-sm font-semibold text-gray-900 hover:bg-gray-100">
                View cart
              </Link>
              <Link to="/my-bookings" className="rounded-lg border border-white/20 px-5 py-3 text-sm font-semibold text-white hover:bg-white/10">
                My bookings
              </Link>
            </div>
          </div>
        </div>

        <div className="mb-10 grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-gray-500">Cart guests</p>
            <p className="mt-2 text-3xl font-semibold text-gray-900">{cartCount}</p>
          </div>
          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-gray-500">Bookings</p>
            <p className="mt-2 text-3xl font-semibold text-gray-900">{bookings.length}</p>
          </div>
          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-gray-500">Available tours</p>
            <p className="mt-2 text-3xl font-semibold text-gray-900">{tours.length}</p>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_380px]">
          <div>
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-2xl font-semibold text-gray-900">Recommended tours</h2>
              <Link to="/" className="text-sm font-semibold text-gray-700 hover:text-gray-900">
                View all
              </Link>
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
                      onError={(event) => {
                        event.currentTarget.src = '/images/bondi_beach.jpg';
                      }}
                    />
                    <h3 className="mt-4 truncate text-lg font-semibold text-gray-900 group-hover:underline">{tour.title}</h3>
                    <p className="mt-1 text-sm text-gray-500">{tour.location}</p>
                    <p className="mt-3 text-sm font-semibold text-gray-900">{formatPrice(tour.price)} per person</p>
                  </article>
                ))}
              </div>
            )}
          </div>

          <aside className="h-fit rounded-2xl border border-gray-200 bg-white p-6 shadow-sm lg:sticky lg:top-28">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Recent bookings</h2>
              <Link to="/my-bookings" className="text-sm font-semibold text-gray-700 hover:text-gray-900">
                Manage
              </Link>
            </div>

            {recentBookings.length === 0 ? (
              <div className="mt-6 rounded-xl bg-gray-50 p-5 text-sm leading-6 text-gray-500">
                No bookings yet. Add tours to cart and checkout to begin your trip plan.
              </div>
            ) : (
              <div className="mt-5 space-y-4">
                {recentBookings.map((booking) => (
                  <button
                    key={booking._id}
                    type="button"
                    onClick={() => navigate('/my-bookings')}
                    className="block w-full rounded-xl border border-gray-100 p-4 text-left hover:bg-gray-50"
                  >
                    <p className="truncate text-sm font-semibold text-gray-900">{booking.tour?.title || 'Unknown tour'}</p>
                    <p className="mt-1 text-xs text-gray-500">{formatDate(booking.tourDate)}</p>
                    <p className="mt-2 text-sm font-semibold text-gray-900">{formatPrice(booking.totalPrice)}</p>
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
