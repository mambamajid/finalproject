const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();

const USERS_PATH = path.join(__dirname, '..', 'data', 'users.json');

// Load users from JSON file
function getUsers() {
  if (!fs.existsSync(USERS_PATH)) return [];
  const data = fs.readFileSync(USERS_PATH, 'utf8');
  return JSON.parse(data || '[]');
}

// Save users to JSON file
function saveUsers(users) {
  fs.writeFileSync(USERS_PATH, JSON.stringify(users, null, 2));
}

// GET: Login Page
router.get('/login', (req, res) => {
  res.render('login');
});

// POST: Login Submission
router.post('/login', (req, res) => {
  const { username, password } = req.body;
  const users = getUsers();
  const user = users.find(u => u.username === username && u.password === password);

  if (user) {
    req.session.user = user;
    res.redirect('/video/dashboard/all');
  } else {
    res.render('login', { error: 'Invalid credentials' });
  }
});

// GET: Register Page
router.get('/register', (req, res) => {
  res.render('register');
});

// POST: Register Submission
router.post('/register', (req, res) => {
  const { username, password } = req.body;
  let users = getUsers();

  if (users.some(u => u.username === username)) {
    return res.render('register', { error: 'Username already exists' });
  }

  users.push({ username, password });
  saveUsers(users);

  req.session.user = { username };
  res.redirect('/video/dashboard/all');
});

// GET: Logout
router.get('/logout', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/login');
  });
});

module.exports = router;

