const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const requireAuth = require('../middlewares/requireAuth');

// POST /api/users - Create current logged-in user in DB if not exists
router.post('/', requireAuth, async (req, res) => {
  try {
    const token = req.cookies.token;
    if (!token) return res.status(401).json({ error: 'Not authenticated' });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const { email, name } = decoded;

    if (!email || !name) {
      return res.status(400).json({ error: 'Missing user info from token' });
    }

    let user = await User.findOne({ email });
    if (!user) {
      user = await User.create({
        email,
        name,
        isAdmin: decoded.isAdmin || false
      });
    }

    res.status(201).json(user);
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
