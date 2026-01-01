const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = async () => {
    const config = require('./config/db');
    await config();
};

dotenv.config();

const app = express();

// Connect to Database
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/journal', require('./routes/journalRoutes'));
app.use('/api/verses', require('./routes/verseRoutes'));
app.use('/api/art', require('./routes/artRoutes'));

app.get('/', (req, res) => {
    res.send('API is running...');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
