const User = require('../models/User');
const ActivityLog = require('../models/ActivityLog');
const Post = require('../models/Post');

const getUsers = async (req, res, next) => {
  try {
    const { role } = req.query;
    let whereClause = {};
    if (role) whereClause.role = role;

    const users = await User.findAll({
      where: whereClause,
      attributes: ['id', 'name', 'email', 'role', 'verified', 'suspended'],
      order: [['created_at', 'DESC']]
    });

    res.status(200).json(users);
  } catch (error) {
    next(error);
  }
};

const suspendUser = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    if (user.role === 'admin') return res.status(403).json({ message: 'Cannot suspend an admin' });

    await user.update({ suspended: true });
    
    req.actionTarget = `User #${user.id}`;
    res.status(200).json({ message: 'User suspended' });
  } catch (error) {
    next(error);
  }
};

const getLogs = async (req, res, next) => {
  try {
    const { action, userId } = req.query;
    let whereClause = {};
    if (action) whereClause.action = action;
    if (userId) whereClause.user_id = userId;

    const logs = await ActivityLog.findAll({
      where: whereClause,
      order: [['createdAt', 'DESC']]
    });

    res.status(200).json(logs);
  } catch (error) {
    next(error);
  }
};

module.exports = { getUsers, suspendUser, getLogs };
