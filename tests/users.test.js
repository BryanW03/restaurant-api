const request = require('supertest');
const app = require('../src/app');
const { FAKE_ID, connect, disconnect } = require('./helpers');

beforeAll(connect);
afterAll(disconnect);

// Users are private data, so without a login the API must answer 401.
describe('GET /users (not logged in)', () => {
  test('GET /users returns 401', async () => {
    const res = await request(app).get('/users');
    expect(res.statusCode).toBe(401);
  });

  test('GET /users/:id returns 401', async () => {
    const res = await request(app).get(`/users/${FAKE_ID}`);
    expect(res.statusCode).toBe(401);
  });
});
