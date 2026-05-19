const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../server');
const User = require('../models/User');
const Tour = require('../models/Tour');
const Cart = require('../models/Cart');
const Order = require('../models/Order');
const Review = require('../models/Review');

jest.setTimeout(30000);

describe('Order API', () => {
  const runId = Date.now();
  const password = 'password123';
  let userToken;
  let otherUserToken;
  let adminToken;
  let user;
  let otherUser;
  let adminUser;
  let tourOne;
  let tourTwo;
  let createdOrder;

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

    user = await User.create({
      username: 'Order Test User',
      email: `order-user-${runId}@example.com`,
      password
    });

    otherUser = await User.create({
      username: 'Order Other User',
      email: `order-other-${runId}@example.com`,
      password
    });

    adminUser = await User.create({
      username: 'Order Admin User',
      email: `order-admin-${runId}@example.com`,
      password,
      role: 'admin'
    });

    [tourOne, tourTwo] = await Tour.create([
      {
        title: `Order Test Tour One ${runId}`,
        location: 'Sydney',
        price: 120,
        imageUrl: '/images/bondi_beach.webp',
        status: 'Available'
      },
      {
        title: `Order Test Tour Two ${runId}`,
        location: 'Melbourne',
        price: 80,
        imageUrl: '/images/bondi_beach.webp',
        status: 'Available'
      }
    ]);

    userToken = await login(user.email);
    otherUserToken = await login(otherUser.email);
    adminToken = await login(adminUser.email);
  });

  beforeEach(async () => {
    await Cart.deleteMany({ user: { $in: [user._id, otherUser._id] } });
  });

  afterAll(async () => {
    const userIds = [user, otherUser, adminUser].filter(Boolean).map((item) => item._id);
    const tourIds = [tourOne, tourTwo].filter(Boolean).map((item) => item._id);

    await Review.deleteMany({ user: { $in: userIds } });
    await Order.deleteMany({ user: { $in: userIds } });
    await Cart.deleteMany({ user: { $in: userIds } });
    await Tour.deleteMany({ _id: { $in: tourIds } });
    await User.deleteMany({ _id: { $in: userIds } });
    await mongoose.connection.close();
  });

  const seedUserCart = async () => {
    await Cart.create({
      user: user._id,
      items: [
        {
          tour: tourOne._id,
          quantity: 2,
          tourDate: '2026-06-01',
          personalInfo: {
            fullName: 'Order Test User',
            email: user.email,
            phone: '0400000001'
          }
        },
        {
          tour: tourTwo._id,
          quantity: 1,
          tourDate: '2026-06-03',
          personalInfo: {
            fullName: 'Order Test User',
            email: user.email,
            phone: '0400000001'
          }
        }
      ]
    });
  };

  test('authenticated user can create one order from a cart with multiple items', async () => {
    await seedUserCart();

    const res = await request(app)
      .post('/api/orders')
      .set('Authorization', `Bearer ${userToken}`)
      .send({ totalAmount: 1 });

    expect(res.statusCode).toBe(201);
    expect(res.body._id).toBeDefined();
    expect(res.body.items).toHaveLength(2);
    createdOrder = res.body;
  });

  test('created order contains all cart items and correct backend total amount', async () => {
    await seedUserCart();

    const res = await request(app)
      .post('/api/orders')
      .set('Authorization', `Bearer ${userToken}`)
      .send({ totalAmount: 1 });

    expect(res.statusCode).toBe(201);
    expect(res.body.items.map((item) => item.quantity)).toEqual([2, 1]);
    expect(res.body.totalAmount).toBe(320);
    expect(res.body.items[0].unitPrice).toBe(120);
    expect(res.body.items[0].totalPrice).toBe(240);
    createdOrder = res.body;
  });

  test('cart is cleared after successful checkout', async () => {
    await seedUserCart();

    const res = await request(app)
      .post('/api/orders')
      .set('Authorization', `Bearer ${userToken}`);

    const cart = await Cart.findOne({ user: user._id });

    expect(res.statusCode).toBe(201);
    expect(cart).toBeNull();
  });

  test('empty cart cannot create order', async () => {
    const res = await request(app)
      .post('/api/orders')
      .set('Authorization', `Bearer ${userToken}`);

    expect(res.statusCode).toBe(400);
  });

  test('unauthenticated user cannot create order', async () => {
    const res = await request(app).post('/api/orders');

    expect(res.statusCode).toBe(401);
  });

  test('checkout fails when a referenced tour no longer exists', async () => {
    const missingTourId = new mongoose.Types.ObjectId();
    await Cart.create({
      user: user._id,
      items: [{
        tour: missingTourId,
        quantity: 1,
        tourDate: '2026-06-09',
        personalInfo: {
          fullName: 'Order Test User',
          email: user.email,
          phone: '0400000001'
        }
      }]
    });

    const res = await request(app)
      .post('/api/orders')
      .set('Authorization', `Bearer ${userToken}`);

    expect(res.statusCode).toBe(404);
  });

  test('current user can fetch own orders', async () => {
    await seedUserCart();
    await request(app).post('/api/orders').set('Authorization', `Bearer ${userToken}`);

    const res = await request(app)
      .get('/api/orders/my')
      .set('Authorization', `Bearer ${userToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBeGreaterThan(0);
    expect(res.body.every((order) => order.user === user._id.toString())).toBe(true);
  });

  test('admin can fetch all orders', async () => {
    await seedUserCart();
    await request(app).post('/api/orders').set('Authorization', `Bearer ${userToken}`);

    const res = await request(app)
      .get('/api/orders/all')
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.some((order) => order.user._id === user._id.toString())).toBe(true);
  });

  test('non-admin cannot fetch all orders', async () => {
    const res = await request(app)
      .get('/api/orders/all')
      .set('Authorization', `Bearer ${userToken}`);

    expect(res.statusCode).toBe(403);
  });

  test('owner can fetch one order', async () => {
    await seedUserCart();
    const createRes = await request(app).post('/api/orders').set('Authorization', `Bearer ${userToken}`);

    const res = await request(app)
      .get(`/api/orders/${createRes.body._id}`)
      .set('Authorization', `Bearer ${userToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body._id).toBe(createRes.body._id);
  });

  test('admin can fetch one order', async () => {
    await seedUserCart();
    const createRes = await request(app).post('/api/orders').set('Authorization', `Bearer ${userToken}`);

    const res = await request(app)
      .get(`/api/orders/${createRes.body._id}`)
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body._id).toBe(createRes.body._id);
  });

  test('non-owner cannot fetch another user order', async () => {
    await seedUserCart();
    const createRes = await request(app).post('/api/orders').set('Authorization', `Bearer ${userToken}`);

    const res = await request(app)
      .get(`/api/orders/${createRes.body._id}`)
      .set('Authorization', `Bearer ${otherUserToken}`);

    expect(res.statusCode).toBe(403);
  });

  test('invalid order id returns 400', async () => {
    const res = await request(app)
      .get('/api/orders/not-a-valid-id')
      .set('Authorization', `Bearer ${userToken}`);

    expect(res.statusCode).toBe(400);
  });

  test('admin can update order status', async () => {
    await seedUserCart();
    const createRes = await request(app).post('/api/orders').set('Authorization', `Bearer ${userToken}`);

    const res = await request(app)
      .patch(`/api/orders/${createRes.body._id}/status`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ status: 'Confirmed' });

    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('Confirmed');
  });

  test('non-admin cannot update order status', async () => {
    await seedUserCart();
    const createRes = await request(app).post('/api/orders').set('Authorization', `Bearer ${userToken}`);

    const res = await request(app)
      .patch(`/api/orders/${createRes.body._id}/status`)
      .set('Authorization', `Bearer ${userToken}`)
      .send({ status: 'Confirmed' });

    expect(res.statusCode).toBe(403);
  });

  test('admin cannot update order to invalid status', async () => {
    await seedUserCart();
    const createRes = await request(app).post('/api/orders').set('Authorization', `Bearer ${userToken}`);

    const res = await request(app)
      .patch(`/api/orders/${createRes.body._id}/status`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ status: 'Finished' });

    expect(res.statusCode).toBe(400);
  });
});
