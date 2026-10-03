const request = require('supertest');
const app = require('../src/app');

describe('Auth and basic routes', () => {
  test('GET / returns API info', async () => {
    const res = await request(app).get('/');
    expect(res.statusCode).toBe(200);
    expect(res.body.docs).toBe('/api-docs');
  });

  test('GET /auth/me without login says authenticated: false', async () => {
    const res = await request(app).get('/auth/me');
    expect(res.body.authenticated).toBe(false);
  });

  test('POST /categories without login returns 401', async () => {
    const res = await request(app).post('/categories').send({ name: 'Test' });
    expect(res.statusCode).toBe(401);
  });

  test('POST /orders without login returns 401', async () => {
    const res = await request(app).post('/orders').send({});
    expect(res.statusCode).toBe(401);
  });

  test('Unknown route returns 404', async () => {
    const res = await request(app).get('/nothing-here');
    expect(res.statusCode).toBe(404);
  });

  test('Swagger docs are available at /api-docs', async () => {
    const res = await request(app).get('/api-docs/');
    expect(res.statusCode).toBe(200);
  });
});
