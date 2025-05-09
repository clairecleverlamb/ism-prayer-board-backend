const express = require('express');
const router = express.Router();
const Prayer = require('../models/prayer');
const requireAuth = require('../middlewares/requireAuth'); 

// POST /api/prayers
router.post('/', requireAuth, async (req, res) => {
  try {
    const { studentName, ministryGroup, status, content } = req.body;

    const prayer = await Prayer.create({
      studentName,
      ministryGroup,
      status,
      content,
      createdBy: req.user.id, 
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
router.patch('/:id/pray', requireAuth, async (req, res) => {
  try {
    const prayer = await Prayer.findById(req.params.id);
    if (!prayer) return res.status(404).json({ error: 'Prayer not found' });

    const userId = req.user.id;

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

// DELETE /api/prayers/:id - All users can delete
router.delete('/:id', requireAuth, async (req, res) => {
  try {
    const prayer = await Prayer.findById(req.params.id);

    if (!prayer) {
      return res.status(404).json({ error: 'Prayer not found' });
    }

    const isOwner = prayer.createdBy.toString() === req.user.id;
    const isAdmin = req.user.isAdmin;

    if (!isOwner && !isAdmin) {
      return res.status(403).json({ error: 'Forbidden: Not owner or admin' });
    }

    await prayer.deleteOne();
    res.json({ message: 'Prayer deleted successfully' });
  } catch (error) {
    console.error("DELETE PRAYER ERROR:", error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
