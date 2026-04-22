const User = require('../models/User');
const Post = require('../models/Post');
const MeetingRequest = require('../models/MeetingRequest');
const ActivityLog = require('../models/ActivityLog');

// GET /api/profile/me
const getMe = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.userId, {
      attributes: ['id', 'name', 'email', 'role', 'verified', 'suspended']
    });
    if (!user) return res.status(404).json({ message: 'User not found.' });
    res.status(200).json({ user });
  } catch (err) { next(err); }
};

// PUT /api/profile/me — sadece name güncellenebilir
const updateMe = async (req, res, next) => {
  try {
    const { name } = req.body;
    if (!name || name.trim().length < 2) {
      return res.status(400).json({ message: 'Name must be at least 2 characters.' });
    }
    const user = await User.findByPk(req.userId);
    if (!user) return res.status(404).json({ message: 'User not found.' });
    await user.update({ name: name.trim() });
    res.status(200).json({ user: { id: user.id, name: user.name, email: user.email, role: user.role, verified: user.verified } });
  } catch (err) { next(err); }
};

// GET /api/profile/me/export — GDPR data export
const exportMyData = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.userId, {
      attributes: ['id', 'name', 'email', 'role', 'verified', 'created_at']
    });
    const posts = await Post.findAll({ where: { user_id: req.userId } });
    const meetings = await MeetingRequest.findAll({
      where: { [require('sequelize').Op.or]: [{ requester_id: req.userId }, { owner_id: req.userId }] }
    });
    const logs = await ActivityLog.findAll({ where: { user_id: req.userId } });

    res.status(200).json({ user, posts, meetings, activityLogs: logs });
  } catch (err) { next(err); }
};

// DELETE /api/profile/me — hesap silme (email re-confirm)
const deleteAccount = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await User.findByPk(req.userId);
    if (!user) return res.status(404).json({ message: 'User not found.' });
    if (user.email !== email?.trim().toLowerCase()) {
      return res.status(400).json({ message: 'Email confirmation does not match.' });
    }
    await user.destroy();
    res.status(200).json({ message: 'Account deleted successfully.' });
  } catch (err) { next(err); }
};

module.exports = { getMe, updateMe, exportMyData, deleteAccount };
