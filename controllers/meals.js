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

router.get('/', async (req, res) => {
    try {
        const meals = await Meal.find({owner: req.user._id });
        res.status(200).json(meals);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
})

router.get('/:mealId', async (req, res) => {
    try {
        const meal = await Meal.findById(req.params.mealId);
        res.status(200).json(meal);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error.message });
    }
})


module.exports = router;