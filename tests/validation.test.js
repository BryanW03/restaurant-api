// Checks that POST and PUT on the four collections validate the data (400)
// and that protected routes need a login (401) and the right role (403).
// These tests stop at the validation step, so they do not write to the database.
const request = require('supertest');

jest.mock('../src/middleware/auth', () => require('./authMock'));

const { __loginAs } = require('../src/middleware/auth');
const app = require('../src/app');
const { FAKE_ID } = require('./helpers');

afterEach(() => __loginAs(null));

describe('Data validation returns 400', () => {
  beforeEach(() => __loginAs('admin'));

  test('POST /categories without name', async () => {
    const res = await request(app).post('/categories').send({});
    expect(res.statusCode).toBe(400);
    expect(res.body.errors[0].field).toBe('name');
  });

  test('PUT /categories/:id with an empty name', async () => {
    const res = await request(app).put(`/categories/${FAKE_ID}`).send({ name: '' });
    expect(res.statusCode).toBe(400);
  });

  test('POST /menu-items with a negative price and invalid category', async () => {
    const res = await request(app).post('/menu-items').send({ name: 'Test', price: -5, category: 'abc' });
    expect(res.statusCode).toBe(400);
  });

  test('PUT /menu-items/:id with missing fields', async () => {
    const res = await request(app).put(`/menu-items/${FAKE_ID}`).send({});
    expect(res.statusCode).toBe(400);
  });

  test('POST /users without username', async () => {
    const res = await request(app).post('/users').send({ role: 'owner' });
    expect(res.statusCode).toBe(400);
  });

  test('PUT /users/:id with an invalid email', async () => {
    const res = await request(app).put(`/users/${FAKE_ID}`).send({ email: 'not-an-email' });
    expect(res.statusCode).toBe(400);
  });

  test('POST /orders without items', async () => {
    const res = await request(app).post('/orders').send({ orderType: 'dine-in' });
    expect(res.statusCode).toBe(400);
  });

  test('PUT /orders/:id with an invalid status', async () => {
    const res = await request(app).put(`/orders/${FAKE_ID}`).send({ status: 'flying' });
    expect(res.statusCode).toBe(400);
  });
});

describe('Protected routes (OAuth)', () => {
  test('POST /categories without login returns 401', async () => {
    const res = await request(app).post('/categories').send({ name: 'Test' });
    expect(res.statusCode).toBe(401);
  });

  test('PUT /menu-items/:id without login returns 401', async () => {
    const res = await request(app).put(`/menu-items/${FAKE_ID}`).send({});
    expect(res.statusCode).toBe(401);
  });

  test('POST /orders without login returns 401', async () => {
    const res = await request(app).post('/orders').send({});
    expect(res.statusCode).toBe(401);
  });

  test('POST /categories as customer returns 403', async () => {
    __loginAs('customer');
    const res = await request(app).post('/categories').send({ name: 'Test' });
    expect(res.statusCode).toBe(403);
  });

  test('DELETE /users/:id as staff returns 403', async () => {
    __loginAs('staff');
    const res = await request(app).delete(`/users/${FAKE_ID}`);
    expect(res.statusCode).toBe(403);
  });
});
