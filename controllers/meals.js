const express = require("express");
const Meal = require("../models/meal.js");
const User = require("../models/user.js");
const router = express.Router();


router.post('/', async (req, res) => {
    try {
        const {title, note} = req.body;
        const userId = req.user._id;
        const meal = await Meal.create({ title, note, owner: userId });
        res.status(201).json(meal);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
})
module.exports = router;