const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../server');
const User = require('../models/User');

jest.setTimeout(30000);

describe('User CRUD & Profile API Tests', () => {
  let authToken1;
  let authToken2;
  let user1;
  let user2;

  const testUser1 = {
    username: "testuser1",
    email: "testuser1@example.com",
    password: "password123",
    phone: "0412345678",
    university: "QUT",
    address: "Brisbane City"
  };

  const testUser2 = {
    username: "testuser2",
    email: "testuser2@example.com",
    password: "password123"
  };

  beforeAll(async () => {
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(process.env.MONGO_URI);
    }

    // Clean up any leftovers
    await User.deleteMany({ email: { $in: [testUser1.email, testUser2.email, "updated1@example.com"] } });

    // Create testing users
    user1 = await User.create(testUser1);
    user2 = await User.create(testUser2);

    // Get Auth Tokens
    const loginRes1 = await request(app).post('/api/auth/login').send({
      email: testUser1.email,
      password: testUser1.password
    });
    authToken1 = loginRes1.body.token;

    const loginRes2 = await request(app).post('/api/auth/login').send({
      email: testUser2.email,
      password: testUser2.password
    });
    authToken2 = loginRes2.body.token;
  });

  afterAll(async () => {
    // Final cleanup
    await User.deleteMany({ email: { $in: [testUser1.email, testUser2.email, "updated1@example.com"] } });
    await mongoose.connection.close();
    await new Promise(resolve => setTimeout(() => resolve(), 500));
  });

  describe('GET /api/users/profile', () => {
    it('should successfully get the logged-in user profile details', async () => {
      const res = await request(app)
        .get('/api/users/profile')
        .set('Authorization', `Bearer ${authToken1}`);

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('email', testUser1.email);
      expect(res.body).toHaveProperty('username', testUser1.username);
      expect(res.body).toHaveProperty('phone', testUser1.phone);
      expect(res.body).toHaveProperty('university', testUser1.university);
      expect(res.body).toHaveProperty('address', testUser1.address);
      expect(res.body).not.toHaveProperty('password');
    });

    it('should block unauthorized requests without token', async () => {
      const res = await request(app).get('/api/users/profile');
      expect(res.statusCode).toBe(401);
    });
  });

  describe('PUT /api/users/profile', () => {
    it('should successfully update own profile fields', async () => {
      const updateData = {
        username: "updateduser1",
        phone: "0499999999",
        university: "UQ",
        address: "St Lucia"
      };

      const res = await request(app)
        .put('/api/users/profile')
        .set('Authorization', `Bearer ${authToken1}`)
        .send(updateData);

      expect(res.statusCode).toBe(200);
      expect(res.body.username).toBe(updateData.username);
      expect(res.body.phone).toBe(updateData.phone);
      expect(res.body.university).toBe(updateData.university);
      expect(res.body.address).toBe(updateData.address);
      expect(res.body).toHaveProperty('token');
    });

    it('should prevent updating email to one that is already in use', async () => {
      const res = await request(app)
        .put('/api/users/profile')
        .set('Authorization', `Bearer ${authToken1}`)
        .send({ email: testUser2.email });

      expect(res.statusCode).toBe(400);
      expect(res.body.message).toContain('Email is already in use');
    });
  });

  describe('DELETE /api/users/profile', () => {
    it('should delete own user account successfully', async () => {
      const res = await request(app)
        .delete('/api/users/profile')
        .set('Authorization', `Bearer ${authToken1}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.message).toContain('deleted successfully');

      // Verify that the user no longer exists in DB
      const deletedUser = await User.findById(user1._id);
      expect(deletedUser).toBeNull();
    });
  });
});
