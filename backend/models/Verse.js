const mongoose = require('mongoose');

const VerseSchema = new mongoose.Schema({
    verseText: {
        type: String,
        required: true
    },
    reference: {
        type: String,
        required: true
    },
    reflection: {
        type: String
    },
    date: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Verse', VerseSchema);
