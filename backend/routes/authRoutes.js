const express = require('express');
const { register, login, getMe, updatePassword, logout } = require('../controllers/authController');
const { protect } = require('../middleware/auth');
const rateLimit = require('../middleware/rateLimit');

const router = express.Router();

router.post('/register', rateLimit({ windowMs: 15 * 60 * 1000, max: 20 }), register);
router.post('/login', rateLimit({ windowMs: 15 * 60 * 1000, max: 30 }), login);
router.get('/me', protect, getMe);
router.put('/update-password', protect, updatePassword);
router.post('/logout', protect, logout);

module.exports = router;
