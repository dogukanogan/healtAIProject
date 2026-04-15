const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User');

const ActivityLog = sequelize.define('ActivityLog', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: { model: User, key: 'id' }
  },
  userName: {
    type: DataTypes.STRING,
  },
  role: {
    type: DataTypes.STRING,
  },
  action: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  target: {
    type: DataTypes.STRING,
  },
  result: {
    type: DataTypes.STRING,
    defaultValue: 'success',
  },
  ip_address: {
    type: DataTypes.STRING,
  },
  timestamp: {
    type: DataTypes.STRING,
  }
}, {
  tableName: 'activity_logs',
  timestamps: true, // We will also explicitly set timestamp string as requested by mockup
});

User.hasMany(ActivityLog, { foreignKey: 'user_id' });
ActivityLog.belongsTo(User, { foreignKey: 'user_id' });

module.exports = ActivityLog;
