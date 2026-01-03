const express = require('express');
const router = express.Router();
const Journal = require('../models/Journal');

// GET all journal entries
router.get('/', async (req, res) => {
    try {
        const entries = await Journal.find().sort({ createdAt: -1 });
        res.json(entries);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// GET single journal entry
router.get('/:id', async (req, res) => {
    try {
        if (!require('mongoose').Types.ObjectId.isValid(req.params.id)) {
            return res.status(404).json({ message: 'Invalid Entry ID' });
        }
        const entry = await Journal.findById(req.params.id);
        if (!entry) return res.status(404).json({ message: 'Entry not found' });
        res.json(entry);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

const auth = require('../middleware/auth');

// POST new journal entry
router.post('/', auth, async (req, res) => {
    const { title, contentText, images, date, time } = req.body;
    const journal = new Journal({
        title,
        contentText,
        images,
        date,
        time
    });

    try {
        const newJournal = await journal.save();
        res.status(201).json(newJournal);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

module.exports = router;
