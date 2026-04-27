const express = require('express');
const router = express.Router();
const profileController = require('../controllers/profileController');
const { verifyToken } = require('../middleware/auth');
const activityLogger = require('../middleware/activityLogger');

router.use(verifyToken);

router.get('/me',         profileController.getMe);
router.put('/me',         activityLogger('profile_update'), profileController.updateMe);
router.get('/me/export',  activityLogger('data_export'),    profileController.exportMyData);
router.delete('/me',      activityLogger('account_delete'), profileController.deleteAccount);

module.exports = router;
