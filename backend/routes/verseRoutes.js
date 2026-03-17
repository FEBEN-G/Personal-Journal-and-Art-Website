const express = require('express');
const router = express.Router();
const Verse = require('../models/Verse');

// GET all verses
router.get('/', async (req, res) => {
    try {
        const verses = await Verse.find().sort({ createdAt: -1 });
        res.json(verses);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

const auth = require('../middleware/auth');

// POST new verse
router.post('/', auth, async (req, res) => {
    const { verseText, reference, reflection, date } = req.body;
    const verse = new Verse({
        verseText,
        reference,
        reflection,
        date
    });

    try {
        const newVerse = await verse.save();
        res.status(201).json(newVerse);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// PUT update verse
router.put('/:id', auth, async (req, res) => {
    try {
        if (!require('mongoose').Types.ObjectId.isValid(req.params.id)) {
            return res.status(404).json({ message: 'Invalid Entry ID' });
        }
        const updatedVerse = await Verse.findByIdAndUpdate(
            req.params.id,
            { $set: req.body },
            { new: true, runValidators: true }
        );
        if (!updatedVerse) return res.status(404).json({ message: 'Verse not found' });
        res.json(updatedVerse);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// DELETE verse
router.delete('/:id', auth, async (req, res) => {
    try {
        if (!require('mongoose').Types.ObjectId.isValid(req.params.id)) {
            return res.status(404).json({ message: 'Invalid Entry ID' });
        }
        const deletedVerse = await Verse.findByIdAndDelete(req.params.id);
        if (!deletedVerse) return res.status(404).json({ message: 'Verse not found' });
        res.json({ message: 'Verse deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
