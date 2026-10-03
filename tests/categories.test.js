const request = require('supertest');
const app = require('../src/app');
const { FAKE_ID, connect, disconnect } = require('./helpers');

beforeAll(connect);
afterAll(disconnect);

describe('GET /categories', () => {
  test('returns 200 and an array', async () => {
    const res = await request(app).get('/categories');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  test('returns one category when the id exists', async () => {
    const list = await request(app).get('/categories');
    if (list.body.length === 0) return; // run "npm run seed" first to test this case
    const res = await request(app).get(`/categories/${list.body[0]._id}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('name');
  });

  test('returns 400 for an invalid id', async () => {
    const res = await request(app).get('/categories/not-an-id');
    expect(res.statusCode).toBe(400);
  });

  test('returns 404 when the category does not exist', async () => {
    const res = await request(app).get(`/categories/${FAKE_ID}`);
    expect(res.statusCode).toBe(404);
  });
});
