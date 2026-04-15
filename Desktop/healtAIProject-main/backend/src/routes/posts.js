const express = require('express');
const router = express.Router();
const postsController = require('../controllers/postsController');
const { verifyToken } = require('../middleware/auth');
// Activity logger will be attached at the app level for specific routes or inside routers

router.use(verifyToken); // All post routes require authentication

router.get('/', postsController.getAllPosts);
router.get('/:id', postsController.getPostById);
router.post('/', postsController.createPost);
router.put('/:id', postsController.updatePost);
router.patch('/:id/status', postsController.changeStatus);
router.delete('/:id', postsController.deletePost);

module.exports = router;
