const MeetingRequest = require('../models/MeetingRequest');
const Post = require('../models/Post');
const User = require('../models/User');
const { Op } = require('sequelize');

const getAllMeetings = async (req, res, next) => {
  try {
    const meetings = await MeetingRequest.findAll({
      where: {
        [Op.or]: [{ requester_id: req.userId }, { owner_id: req.userId }]
      },
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
    const { postId, message, ndaAccepted, proposedSlots } = req.body;

    // Validate NDA
    if (!ndaAccepted) {
      return res.status(400).json({ message: 'NDA must be accepted' });
    }

    const sanitizedSlots = Array.isArray(proposedSlots) ? proposedSlots.filter(Boolean) : [];
    if (sanitizedSlots.length === 0 || sanitizedSlots.length > 2) {
      return res.status(400).json({ message: 'Please provide one or two proposed time slots.' });
    }

    const post = await Post.findByPk(postId);
    if (!post) {
      return res.status(404).json({ message: 'Post not found.' });
    }

    if (post.user_id === req.userId) {
      return res.status(400).json({ message: 'You cannot create a meeting request for your own post.' });
    }

    if (post.status !== 'active') {
      return res.status(400).json({ message: 'Meeting requests can only be sent for active posts.' });
    }

    const requester = await User.findByPk(req.userId);
    const owner = await User.findByPk(post.user_id);
    if (!requester || !owner) {
      return res.status(404).json({ message: 'Meeting participants could not be resolved.' });
    }

    const existingPending = await MeetingRequest.findOne({
      where: {
        post_id: post.id,
        requester_id: req.userId,
        status: 'pending'
      }
    });
    if (existingPending) {
      return res.status(409).json({ message: 'You already have a pending meeting request for this post.' });
    }

    const meeting = await MeetingRequest.create({
      post_id: post.id,
      postTitle: post.title,
      requester_id: req.userId,
      requesterName: requester.name,
      owner_id: owner.id,
      ownerName: owner.name,
      message: message || '',
      ndaAccepted,
      proposedSlots: sanitizedSlots
    });

    req.actionTarget = `Post #${postId}`;
    
    // Also update post status if you want it to jump to scheduled directly?
    // Actually the mock says it's pending and owner accepts it later.
    
    const data = meeting.toJSON();
    data.postId = data.post_id;
    data.requesterId = data.requester_id;
    data.ownerId = data.owner_id;

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
    if (!['accepted', 'declined'].includes(action)) {
      return res.status(400).json({ message: 'Action must be accepted or declined.' });
    }
    if (meeting.status !== 'pending') {
      return res.status(400).json({ message: 'Only pending requests can be responded to.' });
    }

    let confirmedSlot = null;
    if (action === 'accepted' && meeting.proposedSlots && meeting.proposedSlots.length > 0) {
       confirmedSlot = meeting.proposedSlots[0];
       // Also update Post status
       await Post.update({ status: 'meeting_scheduled' }, { where: { id: meeting.post_id } });
    }

    await meeting.update({ status: action, confirmedSlot });
    req.actionTarget = `Meeting #${meeting.id} -> ${action}`;
    const data = meeting.toJSON();
    data.postId = data.post_id;
    data.requesterId = data.requester_id;
    data.ownerId = data.owner_id;
    res.status(200).json(data);
  } catch (error) {
    next(error);
  }
};

module.exports = { getAllMeetings, createMeeting, respondMeeting };
