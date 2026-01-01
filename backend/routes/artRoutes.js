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

// POST new art piece
router.post('/', async (req, res) => {
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

module.exports = router;
