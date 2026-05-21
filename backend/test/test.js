const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../server');
const User = require('../models/User');

jest.setTimeout(60000); 

describe('Tour API Tests', () => {
  let authToken;
  let cartItemId;
  const sampleTourId = "6a05c123f42ecfa629809578"; // Need to fill in real Tour Id
  
  // Define testing account information
  const testUser = {
    username: "autotestuser",
    email: "autotest@example.com",
    password: "password123"
  };

  beforeAll(async () => {
    // 1. Ensure database is connected
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(process.env.MONGO_URI);
    }

    // 2. Clear the environment
    await User.deleteOne({ email: testUser.email });

    // 3. Build test accounts
    await User.create(testUser);

    // 4. Execute login and get Token
    const loginRes = await request(app).post('/api/auth/login').send({
      email: testUser.email,
      password: testUser.password
    });
    authToken = loginRes.body.token;
  });


  it('should add item to cart and get cartItemId', async () => {
    const res = await request(app)
      .post('/api/cart/add')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        tourId: sampleTourId,
        quantity: 2,
        tourDate: "2026-05-20",
        personalInfo: { fullName: "Tester", phone: "0900123456" }
      });
    
    expect(res.statusCode).toBe(201);
    cartItemId = res.body.items[0]._id;
  });

  // --- Ending test ---

  afterAll(async () => {
    // 5. Test finish: Delete test account
    await User.deleteOne({ email: testUser.email });

    // 6. Close database connection
    await mongoose.connection.close();
    await new Promise(resolve => setTimeout(() => resolve(), 500));
  });
});