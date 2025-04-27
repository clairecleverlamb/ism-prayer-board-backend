const express = require('express');
const router = express.Router();
const User = require('../models/user');

// POST /api/users - Create a new user
router.post('/', async (req, res) => {
  try {
    const { username } = req.body;
    if (!username) {
      return res.status(400).json({ error: 'Username is required' });
    }

    const user = await User.create({ username });
    res.status(201).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
