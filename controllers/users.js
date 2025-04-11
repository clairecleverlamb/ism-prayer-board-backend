const express = require('express');
const router = express.Router();
const User = require('../models/user');

// GET /users "get all users"
router.get('/', async (req, res) => {
    try {
        const users = await User.find({});
        res.json(users);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error.message });
    }
});

// GET /users/:userId "get a single user's details"
router.get('/:userId', async (req, res) => {
    try {
        if(req.user._id !== req.params.userId) {
            return res.status(403).json({ error: 'Unauthorized' });
        }

        const user = await User.findById(req.params.userId);
        
        if(!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json( user ); // TESTING 
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error.message });
    }
});

// PUT /users/update "update the authenticated user's profile"
router.put('/update', async (req, res) => {
    try {
        const userId = req.user._id;
        const { username, email, bio, avatar } = req.body;

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { username, email, bio, avatar },
            { new: true, runValidators: true } 
        );
        if (!updatedUser) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json(updatedUser);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;