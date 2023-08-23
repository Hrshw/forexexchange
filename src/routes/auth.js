const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();

router.post('/login', (req, res) => {
  const { username, password } = req.body;
  // console.log('Received credentials:', username, password);

  // Simulated user data
  const users = [
    { username: 'user1', password: 'password1' },
    { username: 'user2', password: 'password2' }
  ];

  // Check credentials
  const user = users.find(u => u.username === username && u.password === password);
  // Log user object
  // console.log('User:', user);

  if (!user) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  // Generate JWT token
  const token = jwt.sign({ username: user.username }, 'secretKey', { expiresIn: '1h' });

  // Set the token as an HTTP-only cookie
  res.cookie('authToken', token, { httpOnly: true });

  // Redirect to a protected route
  res.redirect('/conversion'); // Change to your protected route URL
});

module.exports = router;
