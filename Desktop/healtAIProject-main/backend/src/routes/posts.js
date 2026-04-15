const express = require('express');
const router = express.Router();
const postsController = require('../controllers/postsController');
const { verifyToken } = require('../middleware/auth');
const activityLogger = require('../middleware/activityLogger');

router.use(verifyToken); // All post routes require authentication

router.get('/', postsController.getAllPosts);
router.get('/:id', postsController.getPostById);
router.post('/', activityLogger('post_create'), postsController.createPost);
router.put('/:id', activityLogger('post_update'), postsController.updatePost);
router.patch('/:id/status', activityLogger('post_change_status'), postsController.changeStatus);
router.delete('/:id', activityLogger('post_remove'), postsController.deletePost);

module.exports = router;
