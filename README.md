# Restaurant Management API

CSE 341 final project. REST API built with Node.js, Express and MongoDB (Mongoose).

- **Live API:** https://restaurant-api-f8ap.onrender.com
- **API documentation (Swagger):** https://restaurant-api-f8ap.onrender.com/api-docs
- **Repository:** https://github.com/BryanW03/restaurant-api

## Team

- Davi Ferreira do Vale
- Sthephani Yamileth Platero
- Diego Ledesma
- Sebastian Camilo Plazas
- Brayan De Leon
- Juan Diego Sebastian Sosa

## Features

- Login with GitHub OAuth 2.0 (sessions stored in MongoDB)
- Roles: `customer`, `staff`, `admin`
- Collections: `users`, `categories`, `menuitems`, `orders`
- Full CRUD (GET, POST, PUT, DELETE) on the four collections
- Data validation on every POST and PUT (returns 400)
- try/catch error handling on every route (400, 401, 403, 404, 409, 500)
- Swagger docs at `/api-docs`
- Unit tests for all GET and GET-all routes (Jest + Supertest)

## Run locally

```bash
npm install
cp .env.example .env      # then fill in your values
npm run seed              # optional: sample categories and menu items
npm run dev               # http://localhost:3000
npm test                  # unit tests (need MONGODB_URI in .env)
```

## Environment variables

Never commit your `.env` file. It is listed in `.gitignore`; only `.env.example` is uploaded.

| Name | What it is |
| --- | --- |
| `MONGODB_URI` | MongoDB Atlas connection string (ends with `/restaurant_db`) |
| `SESSION_SECRET` | Long random text used to sign the session cookie |
| `GITHUB_CLIENT_ID` / `GITHUB_CLIENT_SECRET` | From your GitHub OAuth App |
| `GITHUB_CALLBACK_URL` | `<your-url>/auth/github/callback` |
| `BASE_URL` | Public URL of the API (used by Swagger) |
| `ADMIN_GITHUB_USERNAMES` | Comma-separated GitHub usernames that become `admin` |
| `STAFF_GITHUB_USERNAMES` | Comma-separated GitHub usernames that become `staff` |

## Authentication

1. Open `/auth/github` and sign in with GitHub.
2. `/auth/me` shows your user and your role.
3. `/auth/logout` closes the session.

## Who can do what

| Endpoint | Public | customer | staff | admin |
| --- | :-: | :-: | :-: | :-: |
| GET categories, menu-items | yes | yes | yes | yes |
| POST/PUT/DELETE categories, menu-items | | | yes | yes |
| GET /users | | | yes | yes |
| GET/PUT /users/:id | | own profile | own profile (GET any) | all |
| POST/DELETE /users | | | | yes |
| POST /orders | | yes | yes | yes |
| GET/PUT/DELETE orders | | own orders (pending for PUT/DELETE) | all | all |

## Status codes

| Code | When |
| --- | --- |
| 200 / 201 | Success (read, update, delete / create) |
| 400 | Invalid data or invalid id format |
| 401 | Not logged in |
| 403 | Logged in but the role is not allowed |
| 404 | Record or route not found |
| 409 | Duplicate value (for example a repeated category name) |
| 500 | Unexpected server error |

## Testing

```bash
npm run seed   # the GET tests need the sample categories and menu items
npm test
```

The `tests` folder has one file per collection (`users`, `categories`, `menuItems`, `orders`) with tests for the GET and GET-all routes, plus `validation.test.js` for the 400, 401 and 403 responses. `authMock.js` simulates a logged-in customer, staff or admin so the tests do not need GitHub.

## Project structure

```
server.js            starts the server
src/app.js           Express app (used by tests too)
src/config/          db connection and passport (GitHub OAuth)
src/models/          Mongoose schemas
src/routes/          route files
src/controllers/     logic for each endpoint
src/middleware/      auth, validation and error handling
src/validators/      express-validator rules
scripts/seed.js      sample data
tests/               Jest + Supertest
swagger.json         API documentation
```

## Known issues and ideas

- The Render free plan sleeps after inactivity, so the first request can take around a minute.
- The GET tests use the real database, so they need `npm run seed` first.
- Possible next steps: pagination on the list routes, order history by date, and a front end for customers.
