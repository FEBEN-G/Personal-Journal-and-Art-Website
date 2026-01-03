const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

// Login Route
router.post('/login', (req, res) => {
  const { username, password } = req.body;

  // Use credentials from Env or fall back to the ones provided by the user
  const adminUser = process.env.ADMIN_USERNAME || 'PhebGetch';
  const adminPass = process.env.ADMIN_PASSWORD || 'Pheb@getch580$';

  if (username === adminUser && password === adminPass) {
    const token = jwt.sign(
      { username: adminUser },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: '24h' }
    );
    return res.json({ token });
  }

  res.status(401).json({ message: 'Invalid credentials' });
});

module.exports = router;
