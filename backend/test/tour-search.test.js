const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../server');
const Tour = require('../models/Tour');

jest.setTimeout(30000);

describe('GET /api/tours?search=', () => {
  const runId = Date.now();
  let tourSydney;
  let tourMelbourne;
  let tourOutback;

  beforeAll(async () => {
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(process.env.MONGO_URI);
    }

    [tourSydney, tourMelbourne, tourOutback] = await Tour.create([
      {
        title: `Sydney Harbour Cruise ${runId}`,
        location: 'Sydney',
        originalPrice: 150,
        description: 'A scenic cruise around the harbour.',
        status: 'Available',
      },
      {
        title: `Great Ocean Road ${runId}`,
        location: 'Melbourne',
        originalPrice: 200,
        description: 'Drive along the stunning coastline near Sydney and Melbourne.',
        status: 'Available',
      },
      {
        title: `Outback Adventure ${runId}`,
        location: 'Alice Springs',
        originalPrice: 300,
        description: 'Explore the red desert.',
        status: 'Available',
      },
    ]);
  });

  afterAll(async () => {
    await Tour.deleteMany({ _id: { $in: [tourSydney._id, tourMelbourne._id, tourOutback._id] } });
    await mongoose.connection.close();
  });

  it('returns all tours when no search param is provided', async () => {
    const res = await request(app).get('/api/tours');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    const ids = res.body.map((t) => t._id);
    expect(ids).toContain(tourSydney._id.toString());
    expect(ids).toContain(tourMelbourne._id.toString());
    expect(ids).toContain(tourOutback._id.toString());
  });

  it('returns all tours when search param is empty string', async () => {
    const res = await request(app).get('/api/tours?search=');
    expect(res.status).toBe(200);
    const ids = res.body.map((t) => t._id);
    expect(ids).toContain(tourSydney._id.toString());
  });

  it('returns all tours when search param is whitespace only', async () => {
    const res = await request(app).get('/api/tours?search=%20%20');
    expect(res.status).toBe(200);
    const ids = res.body.map((t) => t._id);
    expect(ids).toContain(tourSydney._id.toString());
  });

  it('matches tours by title (case-insensitive)', async () => {
    const res = await request(app).get(`/api/tours?search=sydney+harbour+cruise+${runId}`);
    expect(res.status).toBe(200);
    const ids = res.body.map((t) => t._id);
    expect(ids).toContain(tourSydney._id.toString());
    expect(ids).not.toContain(tourOutback._id.toString());
  });

  it('matches tours by location', async () => {
    const res = await request(app).get('/api/tours?search=Alice+Springs');
    expect(res.status).toBe(200);
    const ids = res.body.map((t) => t._id);
    expect(ids).toContain(tourOutback._id.toString());
  });

  it('matches tours by description', async () => {
    const res = await request(app).get('/api/tours?search=red+desert');
    expect(res.status).toBe(200);
    const ids = res.body.map((t) => t._id);
    expect(ids).toContain(tourOutback._id.toString());
    expect(ids).not.toContain(tourSydney._id.toString());
  });

  it('returns empty array when nothing matches', async () => {
    const res = await request(app).get('/api/tours?search=zzz_no_match_ever');
    expect(res.status).toBe(200);
    expect(res.body).toEqual([]);
  });

  it('handles special regex characters safely', async () => {
    const res = await request(app).get('/api/tours?search=(test)%24');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});
