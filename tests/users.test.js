const request = require('supertest');

jest.mock('../src/middleware/auth', () => require('./authMock'));

const { __loginAs, OBJECT_IDS } = require('../src/middleware/auth');
const app = require('../src/app');
const { FAKE_ID, connect, disconnect } = require('./helpers');

beforeAll(connect);
afterAll(disconnect);
afterEach(() => __loginAs(null));

describe('GET /users', () => {
  test('1. GET all without login returns 401', async () => {
    const res = await request(app).get('/users');
    expect(res.statusCode).toBe(401);
  });

  test('2. GET all as customer returns 403', async () => {
    __loginAs('customer');
    const res = await request(app).get('/users');
    expect(res.statusCode).toBe(403);
  });

  test('3. GET all as admin returns 200 and an array', async () => {
    __loginAs('admin');
    const res = await request(app).get('/users');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  test('4. GET one with an invalid id returns 400', async () => {
    __loginAs('admin');
    const res = await request(app).get('/users/not-an-id');
    expect(res.statusCode).toBe(400);
  });

  test('5. GET one that does not exist returns 404', async () => {
    __loginAs('admin');
    const res = await request(app).get(`/users/${FAKE_ID}`);
    expect(res.statusCode).toBe(404);
  });

  test('6. GET one as customer asking for another user returns 403', async () => {
    __loginAs('customer');
    const res = await request(app).get(`/users/${OBJECT_IDS.admin}`);
    expect(res.statusCode).toBe(403);
  });
});
