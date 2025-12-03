import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import Admin from '../models/Admin.js';

const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

// Middleware to verify JWT token
const verifyToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];

  if (!token) {
    return res.status(403).json({ message: 'No token provided' });
  }

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: 'Invalid or expired token' });
    }
    req.adminId = decoded.id;
    req.adminEmail = decoded.email;
    next();
  });
};

// Admin Signup
router.post('/signup', async (req, res) => {
  const { name, email, password, department } = req.body;

  try {
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email, and password are required' });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: 'Invalid email format' });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters' });
    }

    const existingAdmin = await Admin.findOne({ email: email.toLowerCase() });
    if (existingAdmin) {
      return res.status(409).json({ message: 'Admin with this email already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newAdmin = new Admin({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      department: department || null
    });

    await newAdmin.save();

    const token = jwt.sign(
      { id: newAdmin._id, email: newAdmin.email, role: 'admin' },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      message: 'Admin account created successfully',
      admin: {
        id: newAdmin._id,
        name: newAdmin.name,
        email: newAdmin.email,
        department: newAdmin.department
      },
      token
    });

  } catch (error) {
    console.error('Admin signup error:', error);
    res.status(500).json({ message: 'Server error during signup' });
  }
});

// Admin Login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const admin = await Admin.findOne({ email: email.toLowerCase() });
    if (!admin) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    if (admin.status === 'inactive') {
      return res.status(403).json({ message: 'Account is inactive. Contact support.' });
    }

    const isPasswordValid = await bcrypt.compare(password, admin.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const token = jwt.sign(
      { id: admin._id, email: admin.email, role: 'admin' },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(200).json({
      message: 'Login successful',
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        department: admin.department
      },
      token
    });

  } catch (error) {
    console.error('Admin login error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
});

// Get Admin Profile (Protected)
router.get('/profile', verifyToken, async (req, res) => {
  try {
    const admin = await Admin.findById(req.adminId).select('-password');
    
    if (!admin) {
      return res.status(404).json({ message: 'Admin not found' });
    }

    res.status(200).json({ admin });

  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update Admin Profile (Protected)
router.put('/profile', verifyToken, async (req, res) => {
  const { name, department } = req.body;

  try {
    const admin = await Admin.findById(req.adminId);
    
    if (!admin) {
      return res.status(404).json({ message: 'Admin not found' });
    }

    if (name) admin.name = name;
    if (department !== undefined) admin.department = department;

    await admin.save();

    res.status(200).json({
      message: 'Profile updated successfully',
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        department: admin.department
      }
    });

  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get All Admins (Protected)
router.get('/all', verifyToken, async (req, res) => {
  try {
    const admins = await Admin.find().select('-password').sort({ createdAt: -1 });
    
    res.status(200).json({
      count: admins.length,
      admins
    });

  } catch (error) {
    console.error('Get all admins error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete Admin (Protected)
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    const admin = await Admin.findByIdAndDelete(req.params.id);
    
    if (!admin) {
      return res.status(404).json({ message: 'Admin not found' });
    }

    res.status(200).json({ message: 'Admin deleted successfully' });

  } catch (error) {
    console.error('Delete admin error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;