require('dotenv').config();
const express = require('express');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const path = require('path');
const ejsMate = require('ejs-mate');
const User = require('./models/user.cjs');

const app = express();

const MONGODB_URI = process.env.MONGODB_URI;
const SESSION_SECRET = process.env.SESSION_SECRET || 'fallback-secret-key';
const PORT = process.env.PORT || 3001;

// MongoDB Connection
mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('✅ Connected to MongoDB Atlas');
    console.log('📦 Database: educonnect');
  })
  .catch(err => {
    console.error('❌ MongoDB connection error:', err.message);
    process.exit(1);
  });

// View Engine Setup
app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Session Configuration
app.use(session({
  secret: SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: MONGODB_URI,
    touchAfter: 24 * 3600,
    crypto: {
      secret: SESSION_SECRET
    }
  }),
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax'
  },
  name: 'connect.sid'
}));

// Make current user available to all templates
app.use((req, res, next) => {
  res.locals.currUser = req.session.userId ? req.session.user : null;
  next();
});

// Routes

// Home Page
app.get('/', (req, res) => {
  res.render('home', { title: 'EduConnect - Home' });
});

// Courses Page
app.get('/courses', (req, res) => {
  res.render('courses', { title: 'Courses' });
});

// Departments Page
app.get('/departments', (req, res) => {
  res.render('departments', { title: 'Departments' });
});

// FAQ Page
app.get('/faq', (req, res) => {
  res.render('faq', { title: 'FAQ' });
});

// Contact Page
app.get('/contact', (req, res) => {
  res.render('contact', { title: 'Contact' });
});

// Inquiry Page
app.get('/inquiry', (req, res) => {
  res.render('inquiry', { title: 'Submit Inquiry' });
});

// Signup Page
app.get('/signup', (req, res) => {
  if (req.session.userId) {
    return res.redirect('/');
  }
  res.render('signup', { title: 'Sign Up', error: null });
});

// Signup POST
app.post('/signup', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validation
    if (!name || !email || !password) {
      return res.render('signup', { 
        title: 'Sign Up', 
        error: 'All fields are required' 
      });
    }

    if (password.length < 6) {
      return res.render('signup', { 
        title: 'Sign Up', 
        error: 'Password must be at least 6 characters' 
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.render('signup', { 
        title: 'Sign Up', 
        error: 'Email already registered' 
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = new User({
      name,
      email: email.toLowerCase(),
      password: hashedPassword
    });

    await newUser.save();

    // Set session
    req.session.userId = newUser._id;
    req.session.user = {
      name: newUser.name,
      email: newUser.email
    };

    res.redirect('/');
  } catch (error) {
    console.error('Signup error:', error);
    res.render('signup', { 
      title: 'Sign Up', 
      error: 'Registration failed. Please try again.' 
    });
  }
});

// Login Page
app.get('/login', (req, res) => {
  if (req.session.userId) {
    return res.redirect('/');
  }
  res.render('login', { title: 'Login', error: null });
});

// Login POST
app.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.render('login', { 
        title: 'Login', 
        error: 'Email and password are required' 
      });
    }

    // Find user
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.render('login', { 
        title: 'Login', 
        error: 'Invalid email or password' 
      });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.render('login', { 
        title: 'Login', 
        error: 'Invalid email or password' 
      });
    }

    // Set session
    req.session.userId = user._id;
    req.session.user = {
      name: user.name,
      email: user.email
    };

    res.redirect('/');
  } catch (error) {
    console.error('Login error:', error);
    res.render('login', { 
      title: 'Login', 
      error: 'Login failed. Please try again.' 
    });
  }
});

// Logout
app.get('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error('Logout error:', err);
    }
    res.redirect('/');
  });
});

// Admin Page (protected route example)
app.get('/admin', (req, res) => {
  if (!req.session.userId) {
    return res.redirect('/login');
  }
  res.render('admin', { title: 'Admin Dashboard' });
});

// 404 Handler
app.use((req, res) => {
  res.status(404).render('404', { title: 'Page Not Found' });
});

// Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).render('error', { title: 'Error', error: err.message });
});

app.listen(PORT, () => {
  console.log(`\n🚀 Server running on http://localhost:${PORT}`);
  console.log(`📝 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔗 Access at: http://localhost:${PORT}\n`);
});