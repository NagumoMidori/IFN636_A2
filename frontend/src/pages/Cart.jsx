import { useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/cartContext';
import { getImageUrl } from '../utils/imageUtils';

const formatPrice = (value) => `AUD ${Number(value || 0).toLocaleString('en-AU')}`;

const Cart = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const { cart, removeFromCart, updateCartItem, loading } = useCart();
  
  const items = cart?.items || [];

  const cartTotal = useMemo(
    () => items.reduce((total, item) => total + (Number(item.tour?.price || 0) * item.quantity), 0),
    [items]
  );

  const hasInvalidItems = items.some(
    (item) => !item.tourDate || !item.personalInfo?.phone || Number(item.quantity) < 1
  );

  // call Context method to update backend information
  const handleItemUpdate = (cartItemId, updates) => {
    updateCartItem(cartItemId, updates);
  };

  // call Context method to delete item from database
  const handleRemove = (cartItemId) => {
    if (window.confirm('Are you sure to remove this trip?')) {
      removeFromCart(cartItemId);
    }
  };

  const handleCheckout = () => {
    if (items.length === 0) return;
    if (hasInvalidItems) {
      alert('Please fill in the dates and contact numbers for all your trips before checkout.');
      return;
    }
    navigate('/payment');
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-20 text-center">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-brand-600 border-r-transparent"></div>
        <p className="mt-4 text-gray-500">Loading cart...</p>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <section className="bg-white">
        <div className="mx-auto flex min-h-[62vh] max-w-3xl flex-col items-center justify-center px-4 py-20 text-center sm:px-6 lg:px-8">
          <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-brand-50 text-brand-700">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-8 w-8">
              <path fillRule="evenodd" d="M7.5 6V5.25a4.5 4.5 0 019 0V6h2.25A2.25 2.25 0 0121 8.25v10.5A2.25 2.25 0 0118.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H7.5zm1.5 0h6V5.25a3 3 0 00-6 0V6z" clipRule="evenodd" />
            </svg>
          </div>
          <h1 className="text-3xl font-semibold text-gray-900">The cart is empty.</h1>
          <p className="mt-3 max-w-xl text-sm leading-6 text-gray-500">
            Explore Australia's amazing itineraries and add your favorite experiences to your booking list.
          </p>
          <Link to="/" className="mt-8 inline-flex items-center justify-center rounded-lg bg-brand-600 px-5 py-3 text-sm font-semibold text-white hover:bg-brand-700">
            Start exploring
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-white">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
        <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold text-brand-700">My booking list</p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight text-gray-900">Confirm reservation details.</h1>
          </div>
          <Link to="/" className="text-sm font-semibold text-gray-700 hover:text-gray-900">Continue to add the trips.</Link>
        </div>

        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px]">
          <div className="space-y-5">
            {items.map((item) => (
              <article key={item._id} className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm sm:p-5">
                <div className="grid gap-5 md:grid-cols-[180px_minmax(0,1fr)]">
                  <img
                    src={getImageUrl(item.tour?.imageUrl)}
                    alt={item.tour?.title}
                    className="aspect-[4/3] w-full rounded-xl object-cover md:h-full"
                    onError={(e) => { e.currentTarget.src = '/images/bondi_beach.jpg'; }}
                  />

                  <div className="min-w-0">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <h2 className="text-xl font-semibold text-gray-900">{item.tour?.title}</h2>
                        <p className="mt-1 text-sm text-gray-500">{item.tour?.location}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemove(item._id)}
                        className="self-start rounded-lg border border-gray-200 px-3 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-50"
                      >
                        remove
                      </button>
                    </div>

                    <div className="mt-5 grid gap-4 sm:grid-cols-3">
                      <label className="block">
                        <span className="text-xs font-semibold uppercase text-gray-500">Appointment date</span>
                        <input
                          type="date"
                          value={item.tourDate || ''}
                          onChange={(e) => handleItemUpdate(item._id, { tourDate: e.target.value })}
                          className="mt-2 w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
                        />
                      </label>

                      <label className="block">
                        <span className="text-xs font-semibold uppercase text-gray-500">Contact number</span>
                        <input
                          type="tel"
                          value={item.personalInfo?.phone || ''}
                          onChange={(e) => handleItemUpdate(item._id, { 
                            personalInfo: { ...item.personalInfo, phone: e.target.value } 
                          })}
                          placeholder="0412 345 678"
                          className="mt-2 w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
                        />
                      </label>

                      <div>
                        <span className="text-xs font-semibold uppercase text-gray-500">Number of people</span>
                        <div className="mt-2 flex h-[42px] items-center justify-between rounded-lg border border-gray-200">
                          <button
                            type="button"
                            onClick={() => handleItemUpdate(item._id, { quantity: Math.max(1, item.quantity - 1) })}
                            className="h-full w-11 text-lg font-semibold text-gray-700 hover:bg-gray-50"
                          >
                            -
                          </button>
                          <span className="text-sm font-semibold text-gray-900">{item.quantity}</span>
                          <button
                            type="button"
                            onClick={() => handleItemUpdate(item._id, { quantity: item.quantity + 1 })}
                            className="h-full w-11 text-lg font-semibold text-gray-700 hover:bg-gray-50"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="mt-5 flex items-center justify-between border-t border-gray-100 pt-4">
                      <p className="text-sm text-gray-500">
                        {formatPrice(item.tour?.price)} <span className="text-gray-400">/ every person</span>
                      </p>
                      <p className="text-lg font-semibold text-gray-900">
                        {formatPrice(item.tour?.price * item.quantity)}
                      </p>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>

          <aside className="h-fit rounded-2xl border border-gray-200 bg-white p-6 shadow-sm lg:sticky lg:top-28">
            <h2 className="text-lg font-semibold text-gray-900">Cost details</h2>
            <div className="mt-5 space-y-3 border-b border-gray-100 pb-5 text-sm">
              <div className="flex justify-between text-gray-600">
                <span>Number of trips</span>
                <span>{items.length} trips</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Total number of people</span>
                <span>{items.reduce((total, item) => total + item.quantity, 0)} person</span>
              </div>
            </div>
            <div className="mt-5 flex items-center justify-between">
              <span className="text-base font-semibold text-gray-900">Total amount</span>
              <span className="text-2xl font-semibold text-gray-900">{formatPrice(cartTotal)}</span>
            </div>
            {hasInvalidItems && (
              <p className="mt-4 rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-800">
                Please fill in the dates and phone numbers for all your trips to proceed with checkout.
              </p>
            )}
            <button
              type="button"
              onClick={handleCheckout}
              disabled={hasInvalidItems}
              className="mt-6 w-full rounded-lg bg-brand-600 px-5 py-3 text-sm font-semibold text-white hover:bg-brand-700 disabled:cursor-not-allowed disabled:bg-gray-300"
            >
              Checkout
            </button>
          </aside>
        </div>
      </div>
    </section>
  );
};

export default Cart;