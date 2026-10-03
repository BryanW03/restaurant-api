const passport = require('passport');
const GitHubStrategy = require('passport-github2').Strategy;
const User = require('../models/User');

const list = (value) =>
  (value || '').split(',').map((s) => s.trim().toLowerCase()).filter(Boolean);

const roleFor = (username) => {
  const name = username.toLowerCase();
  if (list(process.env.ADMIN_GITHUB_USERNAMES).includes(name)) return 'admin';
  if (list(process.env.STAFF_GITHUB_USERNAMES).includes(name)) return 'staff';
  return 'customer';
};

passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID || 'missing',
      clientSecret: process.env.GITHUB_CLIENT_SECRET || 'missing',
      callbackURL: process.env.GITHUB_CALLBACK_URL || 'http://localhost:3000/auth/github/callback',
      scope: ['user:email'],
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const username = profile.username;
        const email = profile.emails && profile.emails[0] ? profile.emails[0].value : undefined;
        let user = await User.findOne({ githubId: profile.id });

        if (!user) {
          user = await User.create({
            githubId: profile.id,
            username,
            displayName: profile.displayName || username,
            email,
            role: roleFor(username),
          });
        } else if (roleFor(username) === 'admin' && user.role !== 'admin') {
          user.role = 'admin';
          await user.save();
        }
        return done(null, user);
      } catch (err) {
        return done(err);
      }
    }
  )
);

passport.serializeUser((user, done) => done(null, user.id));

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user || false);
  } catch (err) {
    done(err);
  }
});
