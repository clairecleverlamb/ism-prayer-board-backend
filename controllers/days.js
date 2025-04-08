const express = require("express");
const router = express.Router();
const Day = require("../models/day"); 
const Meal = require("../models/meal");

// POST /days - Create a new day entry for the logged-in user 
router.post("/", async (req, res) => {
    try{
        const { date, breakfast, lunch, dinner, firstSnack, secondSnack } = req.body;
        const userId = req.user._id;

        const day = await Day.create({
            date: date || Date.now(), 
            owner: userId,
            breakfast,
            lunch,
            dinner,
            firstSnack,
            secondSnack,
        });
        res.status(201).json(day);
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ error: error.message });
    }
});


// GET /days - Get all days for the logged-in user
router.get("/", async (req, res) => {
    try {
      const days = await Day.find({ owner: req.user._id })
        .populate("breakfast")
        .populate("lunch")
        .populate("dinner")
        .populate("firstSnack")
        .populate("secondSnack");
  
      res.status(200).json(days);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: error.message }); 
    }
});

// GET /days/:dayId - Get a specific day by ID
router.get("/:dayId", async (req, res) => {
    try {
      const day = await Day.findById(req.params.dayId)
        .populate("breakfast")
        .populate("lunch")
        .populate("dinner")
        .populate("firstSnack")
        .populate("secondSnack");
  
      if (!day) {
        return res.status(404).json({ error: "Day not found" }); 
      }

      if (!day.owner.equals(req.user._id)) {
        return res.status(403).json({ error: "Access denied" }); 
      }
  
      res.status(200).json(day); 
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: error.message }); 
    }
});


// DELETE /days/:dayId - Delete a specific day
router.delete("/:dayId", async (req, res) => {
    try {
      const day = await Day.findById(req.params.dayId);
  
      if (!day) {
        return res.status(404).json({ error: "Day not found" }); 
      }
  
      if (!day.owner.equals(req.user._id)) {
        return res.status(403).json({ error: "Access denied" });
      }
  
      const deletedDay = await Day.findByIdAndDelete(req.params.dayId);
      res.status(200).json(deletedDay); 
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: error.message }); 
    }
});

// PUT /days/:dayId - Update a specific day
router.put("/:dayId", async (req, res) => {
    try {
      const day = await Day.findById(req.params.dayId);
  
      if (!day) {
        return res.status(404).json({ error: "Day not found" }); 
      }
  
      if (!day.owner.equals(req.user._id)) {
        return res.status(403).json({ error: "Access denied" });
      }
  
      const updatedDay = await Day.findByIdAndUpdate(
        req.params.dayId,
        req.body,
        { new: true } 
      )
        .populate("breakfast")
        .populate("lunch")
        .populate("dinner")
        .populate("firstSnack")
        .populate("secondSnack");
  
      res.status(200).json(updatedDay); 
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: error.message }); 
    }
});

module.exports = router;