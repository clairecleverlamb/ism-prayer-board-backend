const express = require('express');
const router = express.Router();
const Prayer = require('../models/prayer');

// POST /api/prayers
router.post('/', async (req, res) => {
  try {
    const { studentName, ministryGroup, content, createdBy } = req.body;

    if (!createdBy) {
      return res.status(400).json({ error: 'createdBy userId is required' });
    }

    const prayer = await Prayer.create({
      studentName,
      ministryGroup,
      content,
      createdBy,
    });

    res.status(201).json(prayer);
  } catch (error) {
    console.error("CREATE PRAYER ERROR:", error);
    res.status(500).json({ error: error.message });
  }
});

// GET /api/prayers
router.get('/', async (req, res) => {
  try {
    const prayers = await Prayer.find().populate('createdBy prayedBy');
    res.json(prayers);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

// PATCH /api/prayers/:id/pray
router.patch('/:id/pray', async (req, res) => {
  try {
    const prayer = await Prayer.findById(req.params.id);
    if (!prayer) return res.status(404).json({ error: 'Prayer not found' });

    const { userId } = req.body;
    if (!userId) {
      return res.status(400).json({ error: 'userId is required' });
    }

    const alreadyPrayed = prayer.prayedBy.some(
      (id) => id.toString() === userId
    );

    if (alreadyPrayed) {
      prayer.prayedBy = prayer.prayedBy.filter(
        (id) => id.toString() !== userId
      );
    } else {
      prayer.prayedBy.push(userId);
    }

    await prayer.save();
    res.json(prayer);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

// DELETE /api/prayers/:id - Delete a prayer (if needed)
router.delete('/:id', async (req, res) => {
    try {
      const prayer = await Prayer.findById(req.params.id);
  
      if (!prayer) {
        return res.status(404).json({ error: 'Prayer not found' });
      }
  
      await prayer.deleteOne();  
      res.json({ message: 'Prayer deleted successfully' });
    } catch (error) {
      console.error("DELETE PRAYER ERROR:", error);
      res.status(500).json({ error: error.message });
    }
  });
  

module.exports = router;
