import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
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

const CancelBooking = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);
  const [agreed, setAgreed] = useState(false);
  const [cancelled, setCancelled] = useState(false);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        const response = await axiosInstance.get(`/api/bookings/${id}`);
        setBooking(response.data);
      } catch (err) {
        console.error('Failed to fetch booking:', err);
      }
    };

    fetchBooking();
  }, [id]);

  const handleConfirmCancel = async () => {
    if (!agreed) return;

    setProcessing(true);

    try {
      await axiosInstance.delete(`/api/bookings/${id}`);
      setCancelled(true);
    } catch (err) {
      alert(`Cancellation failed: ${err.response?.data?.message || 'Please try again.'}`);
    } finally {
      setProcessing(false);
    }
  };

  if (cancelled) {
    return (
      <section className="bg-white">
        <div className="mx-auto flex min-h-[62vh] max-w-3xl flex-col items-center justify-center px-4 py-20 text-center sm:px-6 lg:px-8">
          <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-red-50 text-red-700">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-8 w-8">
              <path fillRule="evenodd" d="M16.5 4.478v.227a48.816 48.816 0 013.878.512.75.75 0 11-.256 1.478l-.209-.035-1.005 13.07A2.25 2.25 0 0116.664 21H7.336a2.25 2.25 0 01-2.244-2.27L4.087 6.66l-.209.035a.75.75 0 01-.256-1.478 48.567 48.567 0 013.878-.512v-.227c0-1.564 1.214-2.978 2.783-2.978h3.434c1.57 0 2.783 1.414 2.783 2.978zM9 8.25a.75.75 0 011.5 0v8.25a.75.75 0 01-1.5 0V8.25zm5.25-.75a.75.75 0 00-.75.75v8.25a.75.75 0 001.5 0V8.25a.75.75 0 00-.75-.75z" clipRule="evenodd" />
            </svg>
          </div>
          <h1 className="text-3xl font-semibold text-gray-900">Booking cancelled</h1>
          <p className="mt-3 max-w-xl text-sm leading-6 text-gray-500">
            The booking has been removed from your account. You can return to your booking list or explore new tours.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link to="/my-bookings" className="rounded-lg bg-brand-600 px-5 py-3 text-sm font-semibold text-white hover:bg-brand-700">
              Back to bookings
            </Link>
            <Link to="/" className="rounded-lg border border-gray-200 px-5 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50">
              Explore tours
            </Link>
          </div>
        </div>
      </section>
    );
  }

  if (!booking) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="h-64 animate-pulse rounded-2xl bg-gray-100" />
      </div>
    );
  }

  return (
    <section className="bg-white">
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
        <button
          type="button"
          onClick={() => navigate('/my-bookings')}
          className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-gray-700 hover:text-gray-900"
        >
          <span aria-hidden="true">&larr;</span>
          Back to bookings
        </button>

        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px]">
          <div>
            <p className="text-sm font-semibold text-red-700">Cancel booking</p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight text-gray-900">Confirm cancellation</h1>
            <p className="mt-3 text-sm leading-6 text-gray-500">
              Review the booking details and acknowledge the cancellation terms before removing this booking.
            </p>

            <div className="mt-8 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
              <div className="grid gap-5 md:grid-cols-[180px_minmax(0,1fr)]">
                <img
                  src={getImageUrl(booking.tour?.imageUrl)}
                  alt={booking.tour?.title || 'Booked tour'}
                  className="aspect-[4/3] w-full rounded-xl object-cover"
                  onError={(event) => {
                    event.currentTarget.src = '/images/bondi_beach.jpg';
                  }}
                />
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">{booking.tour?.title || 'Unknown tour'}</h2>
                  <p className="mt-1 text-sm text-gray-500">{booking.tour?.location || 'Location unavailable'}</p>
                  <div className="mt-5 grid gap-4 sm:grid-cols-3">
                    <div>
                      <p className="text-xs font-semibold uppercase text-gray-500">Date</p>
                      <p className="mt-1 text-sm font-semibold text-gray-900">{formatDate(booking.tourDate)}</p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase text-gray-500">Guests</p>
                      <p className="mt-1 text-sm font-semibold text-gray-900">{booking.quantity || 1}</p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase text-gray-500">Total</p>
                      <p className="mt-1 text-sm font-semibold text-gray-900">{formatPrice(booking.totalPrice)}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 rounded-2xl bg-red-50 p-6">
              <h2 className="text-lg font-semibold text-red-900">Important notes</h2>
              <ul className="mt-4 list-disc space-y-2 pl-5 text-sm leading-6 text-red-800">
                <li>Cancellation may be subject to provider policies and refund processing times.</li>
                <li>Once cancelled, this booking will be removed from your active booking list.</li>
                <li>Contact support if you need help with refunds or rescheduling.</li>
              </ul>
            </div>
          </div>

          <aside className="h-fit rounded-2xl border border-gray-200 bg-white p-6 shadow-sm lg:sticky lg:top-28">
            <h2 className="text-lg font-semibold text-gray-900">Cancellation confirmation</h2>
            <label className="mt-5 flex gap-3 rounded-xl border border-gray-200 p-4">
              <input
                type="checkbox"
                checked={agreed}
                onChange={(event) => setAgreed(event.target.checked)}
                className="mt-1 h-4 w-4 rounded border-gray-300 text-brand-600 focus:ring-brand-500"
              />
              <span className="text-sm leading-6 text-gray-600">
                I understand this booking will be cancelled and removed from my account.
              </span>
            </label>
            <button
              type="button"
              onClick={handleConfirmCancel}
              disabled={!agreed || processing}
              className="mt-6 w-full rounded-lg bg-red-600 px-5 py-3 text-sm font-semibold text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:bg-gray-300"
            >
              {processing ? 'Cancelling...' : 'Confirm cancellation'}
            </button>
          </aside>
        </div>
      </div>
    </section>
  );
};

export default CancelBooking;
