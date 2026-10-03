const request = require('supertest');
const app = require('../src/app');
const { FAKE_ID, connect, disconnect } = require('./helpers');

beforeAll(connect);
afterAll(disconnect);

// Orders are private data, so without a login the API must answer 401.
describe('GET /orders (not logged in)', () => {
  test('GET /orders returns 401', async () => {
    const res = await request(app).get('/orders');
    expect(res.statusCode).toBe(401);
  });

  test('GET /orders/:id returns 401', async () => {
    const res = await request(app).get(`/orders/${FAKE_ID}`);
    expect(res.statusCode).toBe(401);
  });
});
