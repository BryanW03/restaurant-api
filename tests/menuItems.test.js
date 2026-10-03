const request = require('supertest');
const app = require('../src/app');
const { FAKE_ID, connect, disconnect } = require('./helpers');

beforeAll(connect);
afterAll(disconnect);

describe('GET /menu-items', () => {
  test('returns 200 and an array', async () => {
    const res = await request(app).get('/menu-items');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  test('returns one menu item when the id exists', async () => {
    const list = await request(app).get('/menu-items');
    if (list.body.length === 0) return; // run "npm run seed" first to test this case
    const res = await request(app).get(`/menu-items/${list.body[0]._id}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('price');
  });

  test('returns 400 for an invalid id', async () => {
    const res = await request(app).get('/menu-items/not-an-id');
    expect(res.statusCode).toBe(400);
  });

  test('returns 404 when the menu item does not exist', async () => {
    const res = await request(app).get(`/menu-items/${FAKE_ID}`);
    expect(res.statusCode).toBe(404);
  });
});
