const router = require('express').Router();
const passport = require('passport');

router.get('/github', passport.authenticate('github', { scope: ['user:email'] }));

router.get(
  '/github/callback',
  passport.authenticate('github', { failureRedirect: '/auth/failure' }),
  (req, res) => res.redirect('/auth/me')
);

// The frontend can call this to know if there is a session and which role the user has.
router.get('/me', (req, res) => {
  if (!req.isAuthenticated()) return res.status(200).json({ authenticated: false });
  const { id, username, displayName, email, role } = req.user;
  return res.status(200).json({ authenticated: true, user: { id, username, displayName, email, role } });
});

router.get('/failure', (req, res) => res.status(401).json({ message: 'GitHub login failed' }));

router.get('/logout', (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);
    return req.session.destroy(() => {
      res.clearCookie('connect.sid');
      res.status(200).json({ message: 'Logged out' });
    });
  });
});

module.exports = router;
