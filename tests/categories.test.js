const request = require('supertest');

jest.mock('../src/middleware/auth', () => require('./authMock'));

const app = require('../src/app');
const { FAKE_ID, connect, disconnect } = require('./helpers');

beforeAll(connect);
afterAll(disconnect);

describe('GET /categories', () => {
  test('1. GET all returns 200 and an array', async () => {
    const res = await request(app).get('/categories');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  test('2. GET all items have a name (run "npm run seed" first)', async () => {
    const res = await request(app).get('/categories');
    res.body.forEach((category) => expect(category).toHaveProperty('name'));
  });

  test('3. GET one returns 200 when the id exists', async () => {
    const list = await request(app).get('/categories');
    if (list.body.length === 0) return; // run "npm run seed" first to test this case
    const res = await request(app).get(`/categories/${list.body[0]._id}`);
    expect(res.statusCode).toBe(200);
    expect(res.body._id).toBe(list.body[0]._id);
  });

  test('4. GET one returns 400 for an invalid id', async () => {
    const res = await request(app).get('/categories/not-an-id');
    expect(res.statusCode).toBe(400);
  });

  test('5. GET one returns 404 when the category does not exist', async () => {
    const res = await request(app).get(`/categories/${FAKE_ID}`);
    expect(res.statusCode).toBe(404);
  });
});
