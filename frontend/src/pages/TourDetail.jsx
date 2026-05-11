import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import axiosInstance from '../axiosConfig';
import { useAuth } from '../context/AuthContext';
import { addCartItem, getImageUrl } from '../utils/cartStorage';

const formatPrice = (value) => `AUD ${Number(value || 0).toLocaleString('en-AU')}`;

const TourDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [tour, setTour] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [tourDate, setTourDate] = useState('');
  const [phone, setPhone] = useState('');

  useEffect(() => {
    const fetchTour = async () => {
      setLoading(true);
      setError('');

      try {
        const response = await axiosInstance.get(`/api/tours/${id}`);
        setTour(response.data);
      } catch (err) {
        setError('This tour could not be loaded.');
      } finally {
        setLoading(false);
      }
    };

    fetchTour();
  }, [id]);

  useEffect(() => {
    if (user?.phone && !phone) setPhone(user.phone);
  }, [phone, user]);

  const totalPrice = useMemo(() => Number(tour?.price || 0) * quantity, [quantity, tour]);
  const minDate = useMemo(() => new Date().toISOString().split('T')[0], []);

  const handleRemove = async () => {
    if (!window.confirm('Are you sure you want to delete this tour?')) return;

    try {
      await axiosInstance.delete(`/api/tours/${id}`);
      alert('Tour deleted successfully.');
      navigate('/admin/tours');
    } catch (err) {
      alert(`Delete failed: ${err.response?.data?.message || 'Unauthorized'}`);
    }
  };

  const handleAddToCart = () => {
    if (!user) {
      alert('Please sign in before adding a tour to your cart.');
      navigate('/login');
      return;
    }

    if (user.role === 'admin') {
      alert('Admin accounts cannot add tours to cart.');
      return;
    }

    if (!tourDate) {
      alert('Please select a tour date.');
      return;
    }

    if (!phone.trim()) {
      alert('Please enter your phone number.');
      return;
    }

    addCartItem({
      tour: tour._id,
      tourTitle: tour.title,
      tourLocation: tour.location,
      tourImageUrl: tour.imageUrl,
      unitPrice: Number(tour.price) || 0,
      tourDate,
      quantity,
      personalInfo: {
        fullName: user.username,
        email: user.email,
        phone: phone.trim(),
      },
    });

    navigate('/cart');
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="animate-pulse">
          <div className="h-6 w-40 rounded bg-gray-200" />
          <div className="mt-8 aspect-[16/7] rounded-3xl bg-gray-200" />
          <div className="mt-8 h-8 w-2/3 rounded bg-gray-200" />
          <div className="mt-4 h-4 w-1/2 rounded bg-gray-200" />
        </div>
      </div>
    );
  }

  if (error || !tour) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20 text-center sm:px-6 lg:px-8">
        <h1 className="text-2xl font-semibold text-gray-900">{error || 'Tour not found'}</h1>
        <Link to="/" className="mt-6 inline-flex rounded-lg bg-brand-600 px-5 py-3 text-sm font-semibold text-white">
          Back to tours
        </Link>
      </div>
    );
  }

  return (
    <section className="bg-white">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-gray-700 hover:text-gray-900"
        >
          <span aria-hidden="true">&larr;</span>
          Back
        </button>

        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight text-gray-900 sm:text-4xl">{tour.title}</h1>
            <p className="mt-2 flex items-center gap-2 text-sm text-gray-600">
              <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-brand-50 text-brand-700">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
                  <path fillRule="evenodd" d="m9.69 18.933.003.001C9.89 19.02 10 19 10 19s.11.02.308-.066l.002-.001.006-.003.018-.008a5.741 5.741 0 00.281-.14c.186-.096.446-.24.757-.433.62-.384 1.445-.966 2.274-1.765C15.302 14.988 17 12.493 17 9A7 7 0 103 9c0 3.492 1.698 5.988 3.355 7.584a13.731 13.731 0 002.273 1.765 11.842 11.842 0 00.976.544l.062.029.018.008.006.003zM10 11.25a2.25 2.25 0 100-4.5 2.25 2.25 0 000 4.5z" clipRule="evenodd" />
                </svg>
              </span>
              {tour.location}
            </p>
          </div>
          <p className="text-xl font-semibold text-gray-900">
            {formatPrice(tour.price)} <span className="text-sm font-normal text-gray-500">per person</span>
          </p>
        </div>

        <div className="overflow-hidden rounded-3xl bg-gray-100">
          <img
            src={getImageUrl(tour.imageUrl)}
            alt={tour.title}
            className="aspect-[16/7] w-full object-cover"
            onError={(event) => {
              event.currentTarget.src = '/images/bondi_beach.jpg';
            }}
          />
        </div>

        <div className="mt-10 grid gap-10 lg:grid-cols-[minmax(0,1fr)_380px]">
          <div className="min-w-0">
            <div className="grid gap-4 border-b border-gray-100 pb-8 sm:grid-cols-3">
              <div>
                <p className="text-sm font-semibold text-gray-900">Daily capacity</p>
                <p className="mt-1 text-sm text-gray-500">{tour.capacity || 60} guests</p>
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900">Best for</p>
                <p className="mt-1 text-sm text-gray-500">Groups, couples, and solo travellers</p>
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900">Booking flow</p>
                <p className="mt-1 text-sm text-gray-500">Add to cart before checkout</p>
              </div>
            </div>

            <div className="py-8">
              <h2 className="text-2xl font-semibold text-gray-900">About this tour</h2>
              <p className="mt-4 max-w-3xl text-base leading-7 text-gray-600">{tour.description}</p>
            </div>

            {tour.notes && (
              <div className="rounded-2xl border border-gray-200 bg-gray-50 p-6">
                <h2 className="text-lg font-semibold text-gray-900">Important notes</h2>
                <p className="mt-3 text-sm leading-6 text-gray-600">{tour.notes}</p>
              </div>
            )}
          </div>

          <aside className="h-fit rounded-2xl border border-gray-200 bg-white p-6 shadow-lg shadow-gray-100 lg:sticky lg:top-28">
            {user?.role === 'admin' ? (
              <>
                <h2 className="text-lg font-semibold text-gray-900">Admin actions</h2>
                <p className="mt-2 text-sm text-gray-500">Manage this tour package from the admin workspace.</p>
                <div className="mt-6 space-y-3">
                  <button
                    type="button"
                    onClick={() => navigate(`/admin/tours/${tour._id}/edit`)}
                    className="w-full rounded-lg bg-gray-900 px-5 py-3 text-sm font-semibold text-white hover:bg-gray-800"
                  >
                    Edit tour
                  </button>
                  <button
                    type="button"
                    onClick={handleRemove}
                    className="w-full rounded-lg border border-red-200 px-5 py-3 text-sm font-semibold text-red-700 hover:bg-red-50"
                  >
                    Remove tour
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="flex items-baseline justify-between">
                  <h2 className="text-lg font-semibold text-gray-900">Add to cart</h2>
                  <p className="text-sm text-gray-500">{formatPrice(tour.price)} each</p>
                </div>

                <div className="mt-6 space-y-4">
                  <label className="block">
                    <span className="text-xs font-semibold uppercase text-gray-500">Tour date</span>
                    <input
                      type="date"
                      min={minDate}
                      value={tourDate}
                      onChange={(event) => setTourDate(event.target.value)}
                      className="mt-2 w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
                    />
                  </label>

                  <label className="block">
                    <span className="text-xs font-semibold uppercase text-gray-500">Phone number</span>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(event) => setPhone(event.target.value)}
                      placeholder="0412 345 678"
                      className="mt-2 w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
                    />
                  </label>

                  <div>
                    <span className="text-xs font-semibold uppercase text-gray-500">Guests</span>
                    <div className="mt-2 flex h-11 items-center justify-between rounded-lg border border-gray-200">
                      <button
                        type="button"
                        onClick={() => setQuantity((value) => Math.max(1, value - 1))}
                        className="h-full w-12 text-lg font-semibold text-gray-700 hover:bg-gray-50"
                      >
                        -
                      </button>
                      <span className="text-sm font-semibold text-gray-900">{quantity}</span>
                      <button
                        type="button"
                        onClick={() => setQuantity((value) => value + 1)}
                        className="h-full w-12 text-lg font-semibold text-gray-700 hover:bg-gray-50"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex items-center justify-between border-t border-gray-100 pt-5">
                  <span className="text-sm font-semibold text-gray-600">Subtotal</span>
                  <span className="text-2xl font-semibold text-gray-900">{formatPrice(totalPrice)}</span>
                </div>

                <button
                  type="button"
                  onClick={handleAddToCart}
                  className="mt-6 w-full rounded-lg bg-brand-600 px-5 py-3 text-sm font-semibold text-white hover:bg-brand-700"
                >
                  Add to cart
                </button>
                <p className="mt-3 text-center text-xs text-gray-500">All tours must be added to cart before checkout.</p>
              </>
            )}
          </aside>
        </div>
      </div>
    </section>
  );
};

export default TourDetail;
