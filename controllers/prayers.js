const express = require('express');
const router = express.Router();
const Prayer = require('../models/prayer');
const verifyToken = require('../middlewares/verify-token');

// POST /api/prayers - Create new prayer card
router.post('/', async (req, res) => {
    try {
      const { studentName, ministryGroup, content } = req.body;
      const fakeUserId = "6630e4a00000000000000000"; // <<-- dummy ObjectId
  
      const prayer = await Prayer.create({
        studentName,
        ministryGroup,
        content,
        createdBy: fakeUserId,
      });
  
      res.status(201).json(prayer);
    } catch (error) {
      console.error("CREATE PRAYER ERROR:", error);
      res.status(500).json({ error: error.message });
    }
});
  

// GET /api/prayers - Get all prayer cards
router.get('/', async (req, res) => {
  try {
    const prayers = await Prayer.find().populate('createdBy prayedBy');
    res.json(prayers);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

// PATCH /api/prayers/:id/pray - Pray/unpray a prayer
router.patch('/:id/pray', async (req, res) => {
  try {
    const prayer = await Prayer.findById(req.params.id);
    if (!prayer) return res.status(404).json({ error: 'Prayer not found' });

    const alreadyPrayed = prayer.prayedBy.some(
      (id) => id.toString() === req.user._id.toString()
    );

    if (alreadyPrayed) {
      prayer.prayedBy = prayer.prayedBy.filter(
        (id) => id.toString() !== req.user._id.toString()
      );
    } else {
      prayer.prayedBy.push(req.user._id);
    }

    await prayer.save();
    res.json(prayer);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

// Optional: DELETE /api/prayers/:id - Delete a prayer (if needed)
router.delete('/:id', async (req, res) => {
  try {
    const prayer = await Prayer.findById(req.params.id);
    if (!prayer) return res.status(404).json({ error: 'Prayer not found' });
    if (prayer.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Unauthorized' });
    }
    await Prayer.findByIdAndDelete(req.params.id);
    res.json({ message: 'Prayer deleted' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
