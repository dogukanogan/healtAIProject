const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { verifyToken, requireRole } = require('../middleware/auth');
const activityLogger = require('../middleware/activityLogger');

router.use(verifyToken);
router.use(requireRole('admin'));

router.get('/users', adminController.getUsers);
router.patch('/users/:id/suspend', activityLogger('suspend_user'), adminController.suspendUser);
router.get('/logs', adminController.getLogs);
// Delete post is handled in posts.js with admin override logic already! We just call DELETE /api/posts/:id from frontend. Oh wait, mockApi calls adminApi? No, mockApi just calls postsApi.delete(id). Admin has power to delete any post in postsController.deletePost if role is admin.
// Wait, the mock says postsApi.delete(id). We will rely on that route.

module.exports = router;
