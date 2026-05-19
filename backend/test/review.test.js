const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../server');
const User = require('../models/User');
const Tour = require('../models/Tour');
const Order = require('../models/Order');
const Review = require('../models/Review');

jest.setTimeout(30000);

describe('Review API', () => {
  const runId = Date.now();
  const password = 'password123';
  let buyerToken;
  let secondBuyerToken;
  let unpurchasedToken;
  let adminToken;
  let buyer;
  let secondBuyer;
  let unpurchasedUser;
  let adminUser;
  let tour;
  let secondTour;
  let buyerOrder;
  let secondBuyerOrder;

  const login = async (email) => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email, password });

    return res.body.token;
  };

  beforeAll(async () => {
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(process.env.MONGO_URI);
    }

    [buyer, secondBuyer, unpurchasedUser, adminUser] = await User.create([
      {
        username: 'Review Buyer',
        email: `review-buyer-${runId}@example.com`,
        password
      },
      {
        username: 'Review Second Buyer',
        email: `review-second-buyer-${runId}@example.com`,
        password
      },
      {
        username: 'Review Unpurchased User',
        email: `review-unpurchased-${runId}@example.com`,
        password
      },
      {
        username: 'Review Admin',
        email: `review-admin-${runId}@example.com`,
        password,
        role: 'admin'
      }
    ]);

    [tour, secondTour] = await Tour.create([
      {
        title: `Review Test Tour ${runId}`,
        location: 'Brisbane',
        price: 100,
        imageUrl: '/images/bondi_beach.webp',
        status: 'Available'
      },
      {
        title: `Review Test Second Tour ${runId}`,
        location: 'Perth',
        price: 140,
        imageUrl: '/images/bondi_beach.webp',
        status: 'Available'
      }
    ]);

    [buyerOrder, secondBuyerOrder] = await Order.create([
      {
        user: buyer._id,
        items: [{
          tour: tour._id,
          tourDate: '2026-07-01',
          quantity: 1,
          unitPrice: 100,
          totalPrice: 100,
          personalInfo: {
            fullName: 'Review Buyer',
            email: buyer.email,
            phone: '0400000002'
          }
        }],
        totalAmount: 100,
        status: 'Confirmed',
        paymentStatus: 'Paid'
      },
      {
        user: secondBuyer._id,
        items: [{
          tour: tour._id,
          tourDate: '2026-07-02',
          quantity: 1,
          unitPrice: 100,
          totalPrice: 100,
          personalInfo: {
            fullName: 'Review Second Buyer',
            email: secondBuyer.email,
            phone: '0400000003'
          }
        }],
        totalAmount: 100,
        status: 'Confirmed',
        paymentStatus: 'Paid'
      }
    ]);

    buyerToken = await login(buyer.email);
    secondBuyerToken = await login(secondBuyer.email);
    unpurchasedToken = await login(unpurchasedUser.email);
    adminToken = await login(adminUser.email);
  });

  beforeEach(async () => {
    await Review.deleteMany({
      user: { $in: [buyer._id, secondBuyer._id, unpurchasedUser._id, adminUser._id] }
    });
  });

  afterAll(async () => {
    const userIds = [buyer, secondBuyer, unpurchasedUser, adminUser].filter(Boolean).map((item) => item._id);
    const orderIds = [buyerOrder, secondBuyerOrder].filter(Boolean).map((item) => item._id);
    const tourIds = [tour, secondTour].filter(Boolean).map((item) => item._id);

    await Review.deleteMany({
      user: { $in: userIds }
    });
    await Order.deleteMany({ _id: { $in: orderIds } });
    await Tour.deleteMany({ _id: { $in: tourIds } });
    await User.deleteMany({ _id: { $in: userIds } });
    await mongoose.connection.close();
  });

  const createBuyerReview = (rating = 5, comment = 'Excellent tour experience') => request(app)
    .post('/api/reviews')
    .set('Authorization', `Bearer ${buyerToken}`)
    .send({ tour: tour._id.toString(), rating, comment });

  test('purchased user can create review', async () => {
    const res = await createBuyerReview();

    expect(res.statusCode).toBe(201);
    expect(res.body.rating).toBe(5);
    expect(res.body.status).toBe('Visible');
  });

  test('unpurchased user cannot create review', async () => {
    const res = await request(app)
      .post('/api/reviews')
      .set('Authorization', `Bearer ${unpurchasedToken}`)
      .send({ tour: tour._id.toString(), rating: 4, comment: 'Looks good' });

    expect(res.statusCode).toBe(403);
  });

  test('unauthenticated user cannot create review', async () => {
    const res = await request(app)
      .post('/api/reviews')
      .send({ tour: tour._id.toString(), rating: 4, comment: 'Looks good' });

    expect(res.statusCode).toBe(401);
  });

  test('same user cannot review same tour twice', async () => {
    await createBuyerReview();
    const res = await createBuyerReview(4, 'Second review');

    expect(res.statusCode).toBe(400);
  });

  test('different users can review same tour', async () => {
    const firstRes = await createBuyerReview(5, 'First review');
    const secondRes = await request(app)
      .post('/api/reviews')
      .set('Authorization', `Bearer ${secondBuyerToken}`)
      .send({ tour: tour._id.toString(), rating: 4, comment: 'Another buyer review' });

    expect(firstRes.statusCode).toBe(201);
    expect(secondRes.statusCode).toBe(201);
  });

  test('tour review list returns visible reviews', async () => {
    await createBuyerReview(5, 'Visible review');
    await Review.create({
      user: secondBuyer._id,
      tour: tour._id,
      order: secondBuyerOrder._id,
      rating: 2,
      comment: 'Hidden review',
      status: 'Hidden'
    });

    const res = await request(app).get(`/api/reviews/tour/${tour._id}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.reviews).toHaveLength(1);
    expect(res.body.reviews[0].comment).toBe('Visible review');
  });

  test('public tour review list does not expose user email or internal fields', async () => {
    await createBuyerReview(5, 'Public review payload check');

    const res = await request(app).get(`/api/reviews/tour/${tour._id}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.reviews).toHaveLength(1);

    const review = res.body.reviews[0];
    expect(review.user).toBeDefined();
    expect(review.user.username).toBe('Review Buyer');
    expect(review.user.email).toBeUndefined();
    expect(review.order).toBeUndefined();
    expect(review.tour).toBeUndefined();
    expect(Object.keys(review.user)).toEqual(['username']);
    expect(Object.keys(review).sort()).toEqual(['_id', 'comment', 'createdAt', 'rating', 'user']);
  });

  test('invalid tour id returns 400 for public review list', async () => {
    const res = await request(app).get('/api/reviews/tour/not-a-valid-id');

    expect(res.statusCode).toBe(400);
  });

  test('review list returns average rating and review count', async () => {
    await createBuyerReview(5, 'Great review');
    await request(app)
      .post('/api/reviews')
      .set('Authorization', `Bearer ${secondBuyerToken}`)
      .send({ tour: tour._id.toString(), rating: 3, comment: 'Good review' });

    const res = await request(app).get(`/api/reviews/tour/${tour._id}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.reviewCount).toBe(2);
    expect(res.body.averageRating).toBe(4);
  });

  test('user can update own review', async () => {
    const createRes = await createBuyerReview(3, 'Original comment');

    const res = await request(app)
      .put(`/api/reviews/${createRes.body._id}`)
      .set('Authorization', `Bearer ${buyerToken}`)
      .send({ rating: 5, comment: 'Updated comment' });

    expect(res.statusCode).toBe(200);
    expect(res.body.rating).toBe(5);
    expect(res.body.comment).toBe('Updated comment');
  });

  test('user cannot update another user review', async () => {
    const createRes = await createBuyerReview(3, 'Original comment');

    const res = await request(app)
      .put(`/api/reviews/${createRes.body._id}`)
      .set('Authorization', `Bearer ${secondBuyerToken}`)
      .send({ rating: 5, comment: 'Wrong user update' });

    expect(res.statusCode).toBe(403);
  });

  test('admin can hide review', async () => {
    const createRes = await createBuyerReview(5, 'Review to hide');

    const res = await request(app)
      .patch(`/api/reviews/${createRes.body._id}/status`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ status: 'Hidden' });

    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('Hidden');
  });

  test('non-admin cannot hide review', async () => {
    const createRes = await createBuyerReview(5, 'Review to hide');

    const res = await request(app)
      .patch(`/api/reviews/${createRes.body._id}/status`)
      .set('Authorization', `Bearer ${buyerToken}`)
      .send({ status: 'Hidden' });

    expect(res.statusCode).toBe(403);
  });

  test('admin cannot set invalid review status', async () => {
    const createRes = await createBuyerReview(5, 'Review with invalid status update');

    const res = await request(app)
      .patch(`/api/reviews/${createRes.body._id}/status`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ status: 'Archived' });

    expect(res.statusCode).toBe(400);
  });

  test('hidden review does not appear in public tour review list', async () => {
    const createRes = await createBuyerReview(5, 'Review to hide');
    await request(app)
      .patch(`/api/reviews/${createRes.body._id}/status`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ status: 'Hidden' });

    const res = await request(app).get(`/api/reviews/tour/${tour._id}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.reviews).toHaveLength(0);
    expect(res.body.reviewCount).toBe(0);
    expect(res.body.averageRating).toBe(0);
  });

  test('user can fetch own hidden review state for duplicate form suppression', async () => {
    const createRes = await createBuyerReview(5, 'Hidden but still owned review');
    await request(app)
      .patch(`/api/reviews/${createRes.body._id}/status`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ status: 'Hidden' });

    const res = await request(app)
      .get(`/api/reviews/my/${tour._id}`)
      .set('Authorization', `Bearer ${buyerToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.review._id).toBe(createRes.body._id);
    expect(res.body.review.status).toBe('Hidden');
  });
});
