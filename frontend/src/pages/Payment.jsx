import { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axiosInstance from '../axiosConfig';
import { useCart } from '../context/cartContext';
import { useNotification } from '../context/NotificationContext';
import { getImageUrl } from '../utils/imageUtils';

const formatPrice = (value) => `AUD ${Number(value || 0).toLocaleString('en-AU')}`;

const Payment = () => {
  const navigate = useNavigate();
  // From Context get cart information and clear method
  const { cart, clearCart } = useCart();
  const { notifySuccess, notifyError, notifyWarning } = useNotification();
  const items = useMemo(() => cart?.items || [], [cart?.items]);
  const [processing, setProcessing] = useState(false);

  const cartTotal = useMemo(
    () => items.reduce((total, item) => total + (Number(item.tour?.price || 0) * item.quantity), 0),
    [items]
  );

  const hasInvalidItems = items.some(
    (item) => !item.tourDate || !item.personalInfo?.phone || Number(item.quantity) < 1
  );

  const handlePay = async () => {
    if (items.length === 0) {
      notifyWarning('Please add at least one tour before checkout.');
      navigate('/cart');
      return;
    }

    if (hasInvalidItems) {
      notifyWarning('Please return to your shopping cart and fill in all the dates and phone numbers for your trip.');
      navigate('/cart');
      return;
    }

    setProcessing(true);

    try {
      await axiosInstance.post('/api/orders');
      clearCart();

      notifySuccess('Payment successful! Your order has been created.');
      navigate('/my-bookings');
    } catch (err) {
      notifyError(`Payment failed: ${err.response?.data?.message || 'Please try again later.'}`);
    } finally {
      setProcessing(false);
    }
  };

  if (items.length === 0) {
    return (
      <section className="bg-white">
        <div className="mx-auto flex min-h-[62vh] max-w-3xl flex-col items-center justify-center px-4 py-20 text-center sm:px-6 lg:px-8">
          <h1 className="text-3xl font-semibold text-gray-900">There are no trips scheduled for checkout yet.</h1>
          <p className="mt-3 max-w-xl text-sm leading-6 text-gray-500">
            Please add the trip to your shopping cart before proceeding to checkout.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link to="/" className="rounded-lg bg-brand-600 px-5 py-3 text-sm font-semibold text-white hover:bg-brand-700">
              Explore tours
            </Link>
            <Link to="/cart" className="rounded-lg border border-gray-200 px-5 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50">
              Check cart
            </Link>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-white">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
        <button
          type="button"
          onClick={() => navigate('/cart')}
          className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-gray-700 hover:text-gray-900"
        >
          <span aria-hidden="true">&larr;</span>
          Back to cart
        </button>

        <div className="mb-8">
          <p className="text-sm font-semibold text-brand-700">Checkout</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-gray-900">Confirm and pay</h1>
        </div>

        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px]">
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900">Credit card information</h2>
            <div className="mt-6 grid gap-4">
              <label className="block">
                <span className="text-xs font-semibold uppercase text-gray-500">Card Number</span>
                <input
                  type="text"
                  placeholder="4242 4242 4242 4242"
                  className="mt-2 w-full rounded-lg border border-gray-200 px-3 py-3 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
                />
              </label>
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block">
                  <span className="text-xs font-semibold uppercase text-gray-500">expire date</span>
                  <input type="text" placeholder="MM/YY" className="mt-2 w-full rounded-lg border border-gray-200 px-3 py-3 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100" />
                </label>
                <label className="block">
                  <span className="text-xs font-semibold uppercase text-gray-500">CVC</span>
                  <input type="text" placeholder="123" className="mt-2 w-full rounded-lg border border-gray-200 px-3 py-3 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100" />
                </label>
              </div>
            </div>

            <div className="mt-8 rounded-2xl bg-gray-50 p-5">
              <h3 className="text-sm font-semibold text-gray-900">Contact Information</h3>
              <div className="mt-4 space-y-2 text-sm text-gray-600">
                <p>{items[0]?.personalInfo?.fullName || 'Traveler'}</p>
                <p>{items[0]?.personalInfo?.email || 'Email not provided'}</p>
                <p>{items[0]?.personalInfo?.phone || 'Phone number not provided'}</p>
              </div>
            </div>
          </div>

          <aside className="h-fit rounded-2xl border border-gray-200 bg-white p-6 shadow-sm lg:sticky lg:top-28">
            <h2 className="text-lg font-semibold text-gray-900">Booking Summary</h2>
            <div className="mt-5 space-y-4">
              {items.map((item) => (
                <div key={item._id} className="flex gap-3 border-b border-gray-100 pb-4 last:border-b-0 last:pb-0">
                  <img
                    src={getImageUrl(item.tour?.imageUrl)}
                    alt={item.tour?.title}
                    className="h-16 w-20 rounded-lg object-cover"
                    onError={(e) => { e.currentTarget.src = '/images/bondi_beach.jpg'; }}
                  />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-gray-900">{item.tour?.title}</p>
                    <p className="mt-1 text-xs text-gray-500">{item.quantity} travelers &middot; {item.tourDate}</p>
                    <p className="mt-1 text-sm font-semibold text-gray-900">
                      {formatPrice(item.tour?.price * item.quantity)}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 flex items-center justify-between border-t border-gray-100 pt-5">
              <span className="text-base font-semibold text-gray-900">Total</span>
              <span className="text-2xl font-semibold text-gray-900">{formatPrice(cartTotal)}</span>
            </div>

            <button
              type="button"
              onClick={handlePay}
              disabled={processing}
              className="mt-6 w-full rounded-lg bg-brand-600 px-5 py-3 text-sm font-semibold text-white hover:bg-brand-700 disabled:cursor-not-allowed disabled:bg-gray-300"
            >
              {processing ? 'Processing...' : 'Confirm payment'}
            </button>
          </aside>
        </div>
      </div>
    </section>
  );
};

export default Payment;