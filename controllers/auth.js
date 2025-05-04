const express = require('express');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const router = express.Router();

// Trigger Google login
router.get(
  '/google',
  passport.authenticate('google', {
    scope: ['profile', 'email'],
    prompt: 'select_account' 
  })
);

// Handle Google OAuth2 callback
router.get(
  '/google/callback',
  passport.authenticate('google', { session: false, failureRedirect: '/' }),
  async (req, res) => {
    try {
      const profile = req.user;

      if (!profile || !profile.email) {
        return res.status(400).json({ error: 'Invalid Google profile data' });
      }

      const email = profile.email;

      if (!email.endsWith('@acts2.network')) {
        return res.status(403).json({ error: 'Only Acts2 emails allowed.' });
      }

      // Find or create user in DB
      let user = await User.findOne({ email });
      if (!user) {
        user = await User.create({
          googleId: profile.id,
          email,
          name: profile.name,
          isAdmin: email === 'shufei.lei@acts2.network', // Define admin
        });
      }

      // Sign JWT
      const token = jwt.sign(
        {
          id: user._id,
          email: user.email,
          name: user.name,
          isAdmin: user.isAdmin,
        },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
      );

      // Set secure cookie
      res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production', // only secure in prod
        sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax',
        maxAge: 3600000,
      });

      // Redirect to frontend
      res.redirect(process.env.FRONTEND_URL || 'http://localhost:5173');
    } catch (err) {
      console.error('OAuth Callback Error:', err);
      res.status(500).json({ error: 'OAuth login failed' });
    }
  }
);

// Auth check route
router.get('/me', async (req, res) => {
  const token = req.cookies.token;
  if (!token) return res.status(401).json({ message: 'Not authenticated' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select('-__v');
    res.json(user);
  } catch (err) {
    console.error('JWT verification error:', err);
    res.status(403).json({ message: 'Invalid token' });
  }
});

// Logout
router.post('/logout', (req, res) => {
  res.clearCookie('token', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax',
  });
  res.json({ message: 'Logged out successfully' });
});

module.exports = router;
