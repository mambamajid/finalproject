// server.js
const express = require('express');
const path = require('path');
const session = require('express-session');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'resources')));

// Session setup
app.use(session({
  secret: 'secret-key',
  resave: false,
  saveUninitialized: true
}));

// View engine setup (PUG)
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

// Route modules
const authRoutes = require('./routes/auth');
const videoRoutes = require('./routes/video');

app.use('/', authRoutes);          // handles /login, /register
app.use('/video', videoRoutes);   // handles /video/dashboard, /video/new

// Root route
app.get('/', (req, res) => {
  res.redirect('/login');
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});

