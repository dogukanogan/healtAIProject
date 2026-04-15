const express = require('express');
const router = express.Router();
const meetingsController = require('../controllers/meetingsController');
const { verifyToken } = require('../middleware/auth');
const activityLogger = require('../middleware/activityLogger');

router.use(verifyToken);

router.get('/', meetingsController.getAllMeetings);
router.post('/', activityLogger('meeting_request'), meetingsController.createMeeting);
router.patch('/:id/respond', activityLogger('meeting_response'), meetingsController.respondMeeting);

module.exports = router;
