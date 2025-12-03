const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/User.cjs');

const router = express.Router();

router.post('/signup', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }
    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters' });
    }
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already registered' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ name, email, password: hashedPassword });
    await user.save();
    req.session.userId = user._id.toString();
    res.status(201).json({
      message: 'User created successfully',
      user: { name: user.name, email: user.email, createdAt: user.createdAt }
    });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ message: 'Server error during signup' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
    req.session.userId = user._id.toString();
    res.json({
      message: 'Login successful',
      user: { name: user.name, email: user.email, createdAt: user.createdAt }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
});

router.get('/current-user', async (req, res) => {
  try {
    if (!req.session.userId) {
      return res.status(401).json({ message: 'Not authenticated', user: null });
    }
    const user = await User.findById(req.session.userId).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found', user: null });
    }
    res.json({
      user: { name: user.name, email: user.email, createdAt: user.createdAt }
    });
  } catch (error) {
    console.error('Current user error:', error);
    res.status(500).json({ message: 'Server error', user: null });
  }
});

router.post('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error('Logout error:', err);
      return res.status(500).json({ message: 'Logout failed' });
    }
    res.clearCookie('connect.sid');
    res.json({ message: 'Logged out successfully' });
  });
});

module.exports = router;