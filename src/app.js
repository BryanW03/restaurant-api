require('dotenv').config({ quiet: true });
const express = require('express');
const session = require('express-session');
const connectMongo = require('connect-mongo');
const MongoStore = connectMongo.default || connectMongo;
const passport = require('passport');
const cors = require('cors');
const helmet = require('helmet');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('../swagger.json');

require('./config/passport');
const routes = require('./routes');
const { notFound, errorHandler } = require('./middleware/errorHandler');

const app = express();

// Render (and most hosts) put a proxy in front of the app; needed for secure cookies.
app.set('trust proxy', 1);

app.use(helmet({ contentSecurityPolicy: false })); // CSP off so Swagger UI can load
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());

const sessionConfig = {
  secret: process.env.SESSION_SECRET || 'dev-only-secret',
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 1000 * 60 * 60 * 24,
  },
};
if (process.env.NODE_ENV !== 'test' && process.env.MONGODB_URI) {
  sessionConfig.store = MongoStore.create({ mongoUrl: process.env.MONGODB_URI });
}
app.use(session(sessionConfig));
app.use(passport.initialize());
app.use(passport.session());

// Swagger always points to the real server URL (set BASE_URL in production).
const swaggerDoc = {
  ...swaggerDocument,
  servers: [{ url: process.env.BASE_URL || `http://localhost:${process.env.PORT || 3000}` }],
};
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDoc));

app.use('/', routes);
app.use(notFound);
app.use(errorHandler);

module.exports = app;
