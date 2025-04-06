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
});

router.get('/', async (req, res) => {
    try {
        const meals = await Meal.find({owner: req.user._id });
        res.status(200).json(meals);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/:mealId', async (req, res) => {
    try {
        const meal = await Meal.findById(req.params.mealId);
        res.status(200).json(meal);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error.message });
    }
});

router.put('/:mealId', async (req, res) => {
    try {
        const meal = await Meal.findById(req.params.mealId);

        if(!meal.owner.equals(req.user._id)) {
            return res.status(403).send('Access denied.');
        }

        const updatedMeal = await Meal.findByIdAndUpdate(
            req.params.mealId,
            req.body,
            { new: true }
        )

        updatedMeal._doc.owner = req.user;

        res.status(200).json(updatedMeal);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.delete('/:mealId', async (req, res) => {
    try {
        const meal = await Meal.findById(req.params.mealId);
        if(!meal.owner.equals(req.user._id)) {
            return res.status(403).send('Access denied!');
        }

        const deletedMeal = await Meal.findByIdAndDelete(req.params.mealId);
        res.status(200).json(deletedMeal);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;