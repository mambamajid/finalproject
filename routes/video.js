const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();

const VIDEOS_PATH = path.join(__dirname, '..', 'data', 'videos.json');

// Load videos from JSON
function getVideos() {
  if (!fs.existsSync(VIDEOS_PATH)) return [];
  const data = fs.readFileSync(VIDEOS_PATH, 'utf8');
  return JSON.parse(data || '[]');
}

// Save videos to JSON
function saveVideos(videos) {
  fs.writeFileSync(VIDEOS_PATH, JSON.stringify(videos, null, 2));
}

// Middleware to block unauthorized access
router.use((req, res, next) => {
  if (!req.session.user) return res.redirect('/login');
  next();
});

// GET: Dashboard view
router.get('/dashboard/:filter', (req, res) => {
  const { filter } = req.params;
  const username = req.session.user.username;
  const allVideos = getVideos();

  const videos = filter === 'mine'
    ? allVideos.filter(v => v.author === username)
    : allVideos;

  res.render('dashboard', { videos, username, filter });
});

// GET: New video form
router.get('/new_video', (req, res) => {
  res.render('new_video');
});

// POST: Submit new video
router.post('/new', (req, res) => {
  const { title, url } = req.body;
  const username = req.session.user.username;

  let videos = getVideos();
  videos.push({ title, url, author: username });
  saveVideos(videos);

  res.redirect('/video/dashboard/mine');
});

module.exports = router;

