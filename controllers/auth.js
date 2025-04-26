const express = require('express');
const router = express.Router();
const User = require('../models/user');

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { username } = req.body;
    let user = await User.findOne({ username });
    if (!user) {
      user = await User.create({ username });
    }
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;