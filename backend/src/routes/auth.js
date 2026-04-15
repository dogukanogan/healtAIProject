const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { verifyToken } = require('../middleware/auth');
const rateLimit = require('express-rate-limit');
const activityLogger = require('../middleware/activityLogger');

// Rate limiting for login
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 requests per windowMs
  message: { message: 'Too many login attempts, please try again after 15 minutes' }
});

router.post('/register', activityLogger('register'), authController.register);
router.post('/login', loginLimiter, activityLogger('login'), authController.login);
router.post('/logout', activityLogger('logout'), authController.logout);
router.get('/me', verifyToken, activityLogger('get_me'), authController.me);

module.exports = router;
