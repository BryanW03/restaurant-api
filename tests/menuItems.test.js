const request = require('supertest');

jest.mock('../src/middleware/auth', () => require('./authMock'));

const app = require('../src/app');
const { FAKE_ID, connect, disconnect } = require('./helpers');

beforeAll(connect);
afterAll(disconnect);

describe('GET /menu-items', () => {
  test('1. GET all returns 200 and an array', async () => {
    const res = await request(app).get('/menu-items');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  test('2. GET all with ?available=true returns only available items', async () => {
    const res = await request(app).get('/menu-items?available=true');
    expect(res.statusCode).toBe(200);
    res.body.forEach((item) => expect(item.available).toBe(true));
  });

  test('3. GET one returns 200 when the id exists', async () => {
    const list = await request(app).get('/menu-items');
    if (list.body.length === 0) return; // run "npm run seed" first to test this case
    const res = await request(app).get(`/menu-items/${list.body[0]._id}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('price');
  });

  test('4. GET one returns 400 for an invalid id', async () => {
    const res = await request(app).get('/menu-items/not-an-id');
    expect(res.statusCode).toBe(400);
  });

  test('5. GET one returns 404 when the menu item does not exist', async () => {
    const res = await request(app).get(`/menu-items/${FAKE_ID}`);
    expect(res.statusCode).toBe(404);
  });
});
