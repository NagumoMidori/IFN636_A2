import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axiosInstance from '../axiosConfig';
import { getImageUrl } from '../utils/cartStorage';

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
  if (status === 'Pending') return 'bg-amber-50 text-amber-700 ring-amber-100';
  return 'bg-brand-50 text-brand-700 ring-brand-100';
};

const MyBookings = () => {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      setLoading(true);

      try {
        const response = await axiosInstance.get('/api/bookings/my-bookings');
        setBookings(response.data);
      } catch (err) {
        console.error('Failed to fetch bookings:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  const activeBookings = useMemo(
    () => bookings.filter((booking) => booking.status !== 'Cancelled').length,
    [bookings]
  );

  return (
    <section className="bg-white">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold text-brand-700">My bookings</p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight text-gray-900">Your upcoming trips</h1>
            <p className="mt-2 text-sm text-gray-500">Manage tour dates, contact details, and cancellations.</p>
          </div>
          <Link to="/" className="rounded-lg bg-brand-600 px-5 py-3 text-sm font-semibold text-white hover:bg-brand-700">
            Explore more tours
          </Link>
        </div>

        <div className="mb-8 grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-gray-500">Total bookings</p>
            <p className="mt-2 text-3xl font-semibold text-gray-900">{bookings.length}</p>
          </div>
          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-gray-500">Active bookings</p>
            <p className="mt-2 text-3xl font-semibold text-gray-900">{activeBookings}</p>
          </div>
          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-gray-500">Total paid</p>
            <p className="mt-2 text-3xl font-semibold text-gray-900">
              {formatPrice(bookings.reduce((total, booking) => total + Number(booking.totalPrice || 0), 0))}
            </p>
          </div>
        </div>

        {loading ? (
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="h-40 animate-pulse rounded-2xl bg-gray-100" />
            ))}
          </div>
        ) : bookings.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-gray-300 px-6 py-16 text-center">
            <h2 className="text-2xl font-semibold text-gray-900">No bookings yet</h2>
            <p className="mt-3 text-sm text-gray-500">Add tours to your cart and checkout to see bookings here.</p>
            <Link
              to="/"
              className="mt-6 inline-flex rounded-lg bg-brand-600 px-5 py-3 text-sm font-semibold text-white hover:bg-brand-700"
            >
              Start exploring
            </Link>
          </div>
        ) : (
          <div className="space-y-5">
            {bookings.map((booking) => (
              <article key={booking._id} className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm sm:p-5">
                <div className="grid gap-5 md:grid-cols-[180px_minmax(0,1fr)]">
                  <img
                    src={getImageUrl(booking.tour?.imageUrl)}
                    alt={booking.tour?.title || 'Booked tour'}
                    className="aspect-[4/3] w-full rounded-xl object-cover md:h-full"
                    onError={(event) => {
                      event.currentTarget.src = '/images/bondi_beach.jpg';
                    }}
                  />

                  <div className="min-w-0">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <h2 className="text-xl font-semibold text-gray-900">{booking.tour?.title || 'Unknown tour'}</h2>
                        <p className="mt-1 text-sm text-gray-500">{booking.tour?.location || 'Location unavailable'}</p>
                      </div>
                      <span className={`w-fit rounded-full px-3 py-1 text-xs font-semibold ring-1 ${getStatusClass(booking.status)}`}>
                        {booking.status || 'Confirmed'}
                      </span>
                    </div>

                    <div className="mt-5 grid gap-4 sm:grid-cols-4">
                      <div>
                        <p className="text-xs font-semibold uppercase text-gray-500">Date</p>
                        <p className="mt-1 text-sm font-semibold text-gray-900">{formatDate(booking.tourDate)}</p>
                      </div>
                      <div>
                        <p className="text-xs font-semibold uppercase text-gray-500">Guests</p>
                        <p className="mt-1 text-sm font-semibold text-gray-900">{booking.quantity || 1}</p>
                      </div>
                      <div>
                        <p className="text-xs font-semibold uppercase text-gray-500">Phone</p>
                        <p className="mt-1 text-sm font-semibold text-gray-900">{booking.personalInfo?.phone || 'Not provided'}</p>
                      </div>
                      <div>
                        <p className="text-xs font-semibold uppercase text-gray-500">Total</p>
                        <p className="mt-1 text-sm font-semibold text-gray-900">{formatPrice(booking.totalPrice)}</p>
                      </div>
                    </div>

                    <div className="mt-5 flex flex-wrap gap-3 border-t border-gray-100 pt-5">
                      {booking.status !== 'Cancelled' && (
                        <>
                          <button
                            type="button"
                            onClick={() => navigate(`/edit-booking/${booking._id}`)}
                            className="rounded-lg border border-gray-200 px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50"
                          >
                            Modify booking
                          </button>
                          <button
                            type="button"
                            onClick={() => navigate(`/cancel-booking/${booking._id}`)}
                            className="rounded-lg border border-red-200 px-4 py-2.5 text-sm font-semibold text-red-700 hover:bg-red-50"
                          >
                            Cancel booking
                          </button>
                        </>
                      )}
                    </div>
                  </div>
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
