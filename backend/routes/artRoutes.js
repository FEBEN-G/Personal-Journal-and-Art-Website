const express = require('express');
const router = express.Router();
const Art = require('../models/Art');

// GET all art pieces
router.get('/', async (req, res) => {
    try {
        const artPieces = await Art.find().sort({ createdAt: -1 });
        res.json(artPieces);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

const auth = require('../middleware/auth');

// POST new art piece
router.post('/', auth, async (req, res) => {
    const { title, imageUrl, description, date } = req.body;
    const art = new Art({
        title,
        imageUrl,
        description,
        date
    });

    try {
        const newArt = await art.save();
        res.status(201).json(newArt);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// PUT update art piece
router.put('/:id', auth, async (req, res) => {
    try {
        if (!require('mongoose').Types.ObjectId.isValid(req.params.id)) {
            return res.status(404).json({ message: 'Invalid Entry ID' });
        }
        const updatedArt = await Art.findByIdAndUpdate(
            req.params.id,
            { $set: req.body },
            { new: true, runValidators: true }
        );
        if (!updatedArt) return res.status(404).json({ message: 'Art not found' });
        res.json(updatedArt);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// DELETE art piece
router.delete('/:id', auth, async (req, res) => {
    try {
        if (!require('mongoose').Types.ObjectId.isValid(req.params.id)) {
            return res.status(404).json({ message: 'Invalid Entry ID' });
        }
        const deletedArt = await Art.findByIdAndDelete(req.params.id);
        if (!deletedArt) return res.status(404).json({ message: 'Art not found' });
        res.json({ message: 'Art deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
