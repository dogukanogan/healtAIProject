const MeetingRequest = require('../models/MeetingRequest');
const Post = require('../models/Post');
const User = require('../models/User');

const getAllMeetings = async (req, res, next) => {
  try {
    const meetings = await MeetingRequest.findAll({
      order: [['createdAt', 'DESC']]
    });

    // Formatting for frontend compatibility
    const formatted = meetings.map(m => {
      const data = m.toJSON();
      data.postId = data.post_id;
      data.requesterId = data.requester_id;
      data.ownerId = data.owner_id;
      return data;
    });

    res.status(200).json(formatted);
  } catch (error) {
    next(error);
  }
};

const createMeeting = async (req, res, next) => {
  try {
    const { postId, postTitle, ownerId, ownerName, message, ndaAccepted, proposedSlots } = req.body;
    
    // Validate NDA
    if (!ndaAccepted) {
      return res.status(400).json({ message: 'NDA must be accepted' });
    }

    const meeting = await MeetingRequest.create({
      post_id: postId,
      postTitle,
      requester_id: req.userId,
      requesterName: req.body.requesterName, // or fetch from user
      owner_id: ownerId,
      ownerName,
      message,
      ndaAccepted,
      proposedSlots
    });

    req.actionTarget = `Post #${postId}`;
    
    // Also update post status if you want it to jump to scheduled directly?
    // Actually the mock says it's pending and owner accepts it later.
    
    const data = meeting.toJSON();
    data.id = data.id; // ensure ID exists
    
    res.status(201).json(data);
  } catch (error) {
    next(error);
  }
};

const respondMeeting = async (req, res, next) => {
  try {
    const { action } = req.body; // 'accepted' or 'declined'
    const meeting = await MeetingRequest.findByPk(req.params.id);
    
    if (!meeting) return res.status(404).json({ message: 'Meeting not found' });
    if (meeting.owner_id !== req.userId) return res.status(403).json({ message: 'Not authorized' });

    let confirmedSlot = null;
    if (action === 'accepted' && meeting.proposedSlots && meeting.proposedSlots.length > 0) {
       confirmedSlot = meeting.proposedSlots[0];
       // Also update Post status
       await Post.update({ status: 'meeting_scheduled' }, { where: { id: meeting.post_id } });
    }

    await meeting.update({ status: action, confirmedSlot });
    req.actionTarget = `Meeting #${meeting.id} -> ${action}`;

    res.status(200).json(meeting);
  } catch (error) {
    next(error);
  }
};

module.exports = { getAllMeetings, createMeeting, respondMeeting };
