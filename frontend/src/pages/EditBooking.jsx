import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axiosInstance from '../axiosConfig';
import { getImageUrl } from '../utils/cartStorage';

const formatPrice = (value) => `AUD ${Number(value || 0).toLocaleString('en-AU')}`;

const EditBooking = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [tourDate, setTourDate] = useState('');
  const [phone, setPhone] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        const response = await axiosInstance.get(`/api/bookings/${id}`);
        const data = response.data;
        setBooking(data);
        setQuantity(Number(data.quantity) || 1);
        setTourDate(data.tourDate ? data.tourDate.split('T')[0] : '');
        setPhone(data.personalInfo?.phone || '');
      } catch (err) {
        console.error('Failed to fetch booking:', err);
      }
    };

    fetchBooking();
  }, [id]);

  const unitPrice = useMemo(() => {
    if (!booking) return 0;
    if (booking.tour?.price) return Number(booking.tour.price);
    return Number(booking.totalPrice || 0) / Math.max(1, Number(booking.quantity || 1));
  }, [booking]);

  const totalPrice = unitPrice * quantity;
  const minDate = useMemo(() => new Date().toISOString().split('T')[0], []);

  const handleUpdate = async () => {
    if (!tourDate) {
      alert('Please select a tour date.');
      return;
    }

    if (!phone.trim()) {
      alert('Please enter a phone number.');
      return;
    }

    setSaving(true);

    try {
      await axiosInstance.put(`/api/bookings/${id}`, {
        tourDate,
        quantity,
        totalPrice,
        personalInfo: {
          ...booking.personalInfo,
          phone: phone.trim(),
        },
      });

      alert('Booking updated successfully.');
      navigate('/my-bookings');
    } catch (err) {
      alert(`Update failed: ${err.response?.data?.message || 'Please try again.'}`);
    } finally {
      setSaving(false);
    }
  };

  if (!booking) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="h-64 animate-pulse rounded-2xl bg-gray-100" />
      </div>
    );
  }

  return (
    <section className="bg-white">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
        <button
          type="button"
          onClick={() => navigate('/my-bookings')}
          className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-gray-700 hover:text-gray-900"
        >
          <span aria-hidden="true">&larr;</span>
          Back to bookings
        </button>

        <div className="mb-8">
          <p className="text-sm font-semibold text-brand-700">Modify booking</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-gray-900">Update your trip details</h1>
          <p className="mt-2 text-sm text-gray-500">Change the travel date, guests, or contact number for this booking.</p>
        </div>

        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px]">
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
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
                <p className="mt-4 text-sm text-gray-500">Booking ID</p>
                <p className="mt-1 break-all text-sm font-semibold text-gray-900">{booking._id}</p>
              </div>
            </div>

            <div className="mt-8 grid gap-5 sm:grid-cols-2">
              <label className="block">
                <span className="text-xs font-semibold uppercase text-gray-500">Tour date</span>
                <input
                  type="date"
                  min={minDate}
                  value={tourDate}
                  onChange={(event) => setTourDate(event.target.value)}
                  className="mt-2 w-full rounded-lg border border-gray-200 px-3 py-3 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
                />
              </label>

              <label className="block">
                <span className="text-xs font-semibold uppercase text-gray-500">Phone number</span>
                <input
                  type="tel"
                  value={phone}
                  onChange={(event) => setPhone(event.target.value)}
                  placeholder="0412 345 678"
                  className="mt-2 w-full rounded-lg border border-gray-200 px-3 py-3 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
                />
              </label>
            </div>

            <div className="mt-5">
              <span className="text-xs font-semibold uppercase text-gray-500">Guests</span>
              <div className="mt-2 flex h-12 max-w-xs items-center justify-between rounded-lg border border-gray-200">
                <button
                  type="button"
                  onClick={() => setQuantity((value) => Math.max(1, value - 1))}
                  className="h-full w-14 text-lg font-semibold text-gray-700 hover:bg-gray-50"
                >
                  -
                </button>
                <span className="text-sm font-semibold text-gray-900">{quantity}</span>
                <button
                  type="button"
                  onClick={() => setQuantity((value) => value + 1)}
                  className="h-full w-14 text-lg font-semibold text-gray-700 hover:bg-gray-50"
                >
                  +
                </button>
              </div>
            </div>
          </div>

          <aside className="h-fit rounded-2xl border border-gray-200 bg-white p-6 shadow-sm lg:sticky lg:top-28">
            <h2 className="text-lg font-semibold text-gray-900">Updated total</h2>
            <div className="mt-5 space-y-3 border-b border-gray-100 pb-5 text-sm text-gray-600">
              <div className="flex justify-between">
                <span>Unit price</span>
                <span>{formatPrice(unitPrice)}</span>
              </div>
              <div className="flex justify-between">
                <span>Guests</span>
                <span>{quantity}</span>
              </div>
            </div>
            <div className="mt-5 flex items-center justify-between">
              <span className="text-base font-semibold text-gray-900">Total</span>
              <span className="text-2xl font-semibold text-gray-900">{formatPrice(totalPrice)}</span>
            </div>
            <button
              type="button"
              onClick={handleUpdate}
              disabled={saving}
              className="mt-6 w-full rounded-lg bg-brand-600 px-5 py-3 text-sm font-semibold text-white hover:bg-brand-700 disabled:cursor-not-allowed disabled:bg-gray-300"
            >
              {saving ? 'Saving...' : 'Save changes'}
            </button>
          </aside>
        </div>
      </div>
    </section>
  );
};

export default EditBooking;
