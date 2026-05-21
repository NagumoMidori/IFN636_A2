import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import axiosInstance from '../axiosConfig';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/cartContext';
import { useNotification } from '../context/NotificationContext';
import TourImageGallery from '../components/TourImageGallery';

const formatPrice = (value) => `AUD ${Number(value || 0).toLocaleString('en-AU')}`;

const TourDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addToCart } = useCart();
  const { notifySuccess, notifyError, notifyWarning } = useNotification();
  const [tour, setTour] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [tourDate, setTourDate] = useState('');
  const [phone, setPhone] = useState('');
  const [orders, setOrders] = useState([]);
  const [reviewSummary, setReviewSummary] = useState({ reviews: [], averageRating: 0, reviewCount: 0 });
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [ownReview, setOwnReview] = useState(null);
  const [reviewSubmitting, setReviewSubmitting] = useState(false);
  const [reviewMessage, setReviewMessage] = useState('');
  const [confirmingDelete, setConfirmingDelete] = useState(false);

  

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

  const fetchReviews = useCallback(async () => {
    try {
      const response = await axiosInstance.get(`/api/reviews/tour/${id}`);
      setReviewSummary(response.data);
    } catch (err) {
      console.error('Failed to fetch reviews:', err);
      setReviewSummary({ reviews: [], averageRating: 0, reviewCount: 0 });
    }
  }, [id]);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user || user.role === 'admin') {
        setOrders([]);
        setOwnReview(null);
        return;
      }

      try {
        const [ordersResponse, ownReviewResponse] = await Promise.all([
          axiosInstance.get('/api/orders/my'),
          axiosInstance.get(`/api/reviews/my/${id}`),
        ]);
        setOrders(ordersResponse.data);
        setOwnReview(ownReviewResponse.data.review);
      } catch (err) {
        console.error('Failed to fetch user order or review state:', err);
        setOrders([]);
        setOwnReview(null);
      }
    };

    fetchOrders();
  }, [id, user]);

  useEffect(() => {
    if (user?.phone && !phone) setPhone(user.phone);
  }, [phone, user]);

  const totalPrice = useMemo(() => Number(tour?.price || 0) * quantity, [quantity, tour]);
  const minDate = useMemo(() => new Date().toISOString().split('T')[0], []);
  const importantNotes = tour?.importantNotes || tour?.notes;
  const hasPurchasedTour = useMemo(
    () => orders.some((order) => (
      order.status !== 'Cancelled'
      && (order.items || []).some((item) => {
        const itemTourId = item.tour?._id || item.tour;
        return itemTourId === id;
      })
    )),
    [id, orders]
  );
  const hasReviewedTour = Boolean(ownReview);
  const canCreateReview = Boolean(user && user.role !== 'admin' && hasPurchasedTour && !hasReviewedTour);

  const handleRemove = async () => {
    try {
      await axiosInstance.delete(`/api/tours/${id}`);
      notifySuccess('Tour deleted successfully.');
      navigate('/admin/tours');
    } catch (err) {
      notifyError(`Delete failed: ${err.response?.data?.message || 'Unauthorized'}`);
    } finally {
      setConfirmingDelete(false);
    }
  };



  const handleAddToCart = async () => {
    if (!user) {
      notifyWarning('Please sign in before adding a tour to your cart.');
      navigate('/login');
      return;
    }

    if (user.role === 'admin') {
      notifyWarning('Admin accounts cannot add tours to cart.');
      return;
    }

    if (!tourDate) {
      notifyWarning('Please select a tour date.');
      return;
    }

    if (!phone.trim()) {
      notifyWarning('Please enter your phone number.');
      return;
    }

    try {
      await addToCart(tour._id, quantity, tourDate, {
        fullName: user.username,
        email: user.email,
        phone: phone.trim(),
      });

      navigate('/cart');
    } catch (err) {
      // cartContext already shows the error notification
    }
  };

  const handleSubmitReview = async (event) => {
    event.preventDefault();
    setReviewMessage('');

    if (!reviewComment.trim()) {
      setReviewMessage('Please enter a review comment.');
      return;
    }

    setReviewSubmitting(true);

    try {
      await axiosInstance.post('/api/reviews', {
        tour: id,
        rating: Number(reviewRating),
        comment: reviewComment.trim(),
      });
      setReviewComment('');
      setReviewRating(5);
      setReviewMessage('Review submitted successfully.');
      setOwnReview({ _id: 'submitted' });
      await fetchReviews();
    } catch (err) {
      setReviewMessage(err.response?.data?.message || 'Failed to submit review.');
    } finally {
      setReviewSubmitting(false);
    }
  };


  if (loading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="animate-pulse">
          <div className="h-6 w-40 rounded bg-gray-200" />
          <div className="mt-8 h-[430px] rounded-3xl bg-gray-200" />
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
            <p className="mt-2 text-sm font-semibold text-gray-900">
              &#9733; {reviewSummary.averageRating || 'New'} <span className="font-normal text-gray-500">
                ({reviewSummary.reviewCount} review{reviewSummary.reviewCount === 1 ? '' : 's'})
              </span>
            </p>
          </div>
          <p className="text-xl font-semibold text-gray-900">
            {formatPrice(tour.price)} <span className="text-sm font-normal text-gray-500">per person</span>
          </p>
        </div>

        <TourImageGallery title={tour.title} imageUrl={tour.imageUrl} />

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

            {importantNotes && (
              <div className="rounded-2xl border border-gray-200 bg-gray-50 p-6">
                <h2 className="text-lg font-semibold text-gray-900">Important notes</h2>
                <p className="mt-3 text-sm leading-6 text-gray-600">{importantNotes}</p>
              </div>
            )}

            <section id="reviews" className="mt-8 border-t border-gray-100 pt-8">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <h2 className="text-2xl font-semibold text-gray-900">Reviews</h2>
                  <p className="mt-2 text-sm text-gray-500">
                    {reviewSummary.reviewCount > 0
                      ? `${reviewSummary.averageRating} average from ${reviewSummary.reviewCount} review${reviewSummary.reviewCount === 1 ? '' : 's'}`
                      : 'No reviews yet'}
                  </p>
                </div>
              </div>

              {canCreateReview && (
                <form onSubmit={handleSubmitReview} className="mt-6 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
                  <h3 className="text-lg font-semibold text-gray-900">Write a review</h3>
                  <div className="mt-4 grid gap-4 sm:grid-cols-[180px_minmax(0,1fr)]">
                    <label className="block">
                      <span className="text-xs font-semibold uppercase text-gray-500">Rating</span>
                      <select
                        value={reviewRating}
                        onChange={(event) => setReviewRating(event.target.value)}
                        className="mt-2 w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
                      >
                        {[5, 4, 3, 2, 1].map((rating) => (
                          <option key={rating} value={rating}>{rating} out of 5</option>
                        ))}
                      </select>
                    </label>

                    <label className="block">
                      <span className="text-xs font-semibold uppercase text-gray-500">Comment</span>
                      <textarea
                        value={reviewComment}
                        onChange={(event) => setReviewComment(event.target.value)}
                        rows="4"
                        placeholder="Share what stood out about this tour."
                        className="mt-2 w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
                      />
                    </label>
                  </div>
                  <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    {reviewMessage && <p className="text-sm text-gray-600">{reviewMessage}</p>}
                    <button
                      type="submit"
                      disabled={reviewSubmitting}
                      className="w-fit rounded-lg bg-brand-600 px-5 py-3 text-sm font-semibold text-white hover:bg-brand-700 disabled:cursor-not-allowed disabled:bg-gray-300"
                    >
                      {reviewSubmitting ? 'Submitting...' : 'Submit review'}
                    </button>
                  </div>
                </form>
              )}

              {user && user.role !== 'admin' && hasPurchasedTour && hasReviewedTour && (
                <p className="mt-6 rounded-2xl border border-gray-200 bg-gray-50 px-5 py-4 text-sm text-gray-600">
                  You have already reviewed this tour.
                </p>
              )}

              <div className="mt-6 flex flex-col gap-4">
                {(reviewSummary.reviews || []).map((review) => (
                  <article key={review._id} className="w-full rounded-2xl border border-gray-200 bg-white p-5">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-sm font-semibold text-gray-900">{review.user?.username || 'Traveler'}</p>
                        <p className="mt-1 text-xs text-gray-500">{new Date(review.createdAt).toLocaleDateString('en-AU')}</p>
                      </div>
                      <span className="rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-700">
                        &#9733; {review.rating}
                      </span>
                    </div>
                    <p className="mt-4 text-sm leading-6 text-gray-600">{review.comment}</p>
                  </article>
                ))}
              </div>

              {reviewSummary.reviewCount === 0 && (
                <div className="mt-6 rounded-2xl border border-dashed border-gray-300 px-6 py-10 text-center">
                  <p className="text-sm text-gray-500">Be the first traveler to review this tour after checkout.</p>
                </div>
              )}
            </section>
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
                  {confirmingDelete ? (
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => setConfirmingDelete(false)}
                        className="flex-1 rounded-lg border border-gray-200 px-4 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={handleRemove}
                        className="flex-1 rounded-lg bg-red-600 px-4 py-3 text-sm font-semibold text-white hover:bg-red-700"
                      >
                        Confirm delete
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setConfirmingDelete(true)}
                      className="w-full rounded-lg border border-red-200 px-5 py-3 text-sm font-semibold text-red-700 hover:bg-red-50"
                    >
                      Remove tour
                    </button>
                  )}
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
