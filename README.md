# Restaurant Management API

CSE 341 final project. REST API built with Node.js, Express and MongoDB (Mongoose).

- Login with GitHub OAuth 2.0 (sessions stored in MongoDB)
- Roles: `customer`, `staff`, `admin`
- Collections: `users`, `categories`, `menuitems`, `orders`
- Swagger docs at `/api-docs`

## Run locally

```bash
npm install
cp .env.example .env      # then fill in your values
npm run seed              # optional: sample categories and menu items
npm run dev               # http://localhost:3000
npm test                  # unit tests (need MONGODB_URI in .env)
```

## Environment variables

| Name | What it is |
| --- | --- |
| `MONGODB_URI` | MongoDB Atlas connection string (ends with `/restaurant_db`) |
| `SESSION_SECRET` | Long random text used to sign the session cookie |
| `GITHUB_CLIENT_ID` / `GITHUB_CLIENT_SECRET` | From your GitHub OAuth App |
| `GITHUB_CALLBACK_URL` | `<your-url>/auth/github/callback` |
| `BASE_URL` | Public URL of the API (used by Swagger) |
| `ADMIN_GITHUB_USERNAMES` | Comma-separated GitHub usernames that become `admin` |
| `STAFF_GITHUB_USERNAMES` | Comma-separated GitHub usernames that become `staff` |

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
