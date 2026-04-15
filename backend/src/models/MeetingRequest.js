const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Post = require('./Post');
const User = require('./User');

const MeetingRequest = sequelize.define('MeetingRequest', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  post_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: Post, key: 'id' }
  },
  postTitle: {
    type: DataTypes.STRING,
  },
  requester_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: User, key: 'id' }
  },
  requesterName: {
    type: DataTypes.STRING,
  },
  owner_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: User, key: 'id' }
  },
  ownerName: {
    type: DataTypes.STRING,
  },
  message: {
    type: DataTypes.TEXT,
  },
  ndaAccepted: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true,
  },
  proposedSlots: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    defaultValue: [],
  },
  confirmedSlot: {
    type: DataTypes.STRING,
  },
  status: {
    type: DataTypes.ENUM('pending', 'accepted', 'declined', 'cancelled'),
    defaultValue: 'pending',
  }
}, {
  tableName: 'meeting_requests',
  timestamps: true,
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
});

Post.hasMany(MeetingRequest, { foreignKey: 'post_id' });
MeetingRequest.belongsTo(Post, { foreignKey: 'post_id' });

User.hasMany(MeetingRequest, { foreignKey: 'requester_id', as: 'RequestsMade' });
User.hasMany(MeetingRequest, { foreignKey: 'owner_id', as: 'RequestsReceived' });
MeetingRequest.belongsTo(User, { as: 'Requester', foreignKey: 'requester_id' });
MeetingRequest.belongsTo(User, { as: 'Owner', foreignKey: 'owner_id' });

module.exports = MeetingRequest;
