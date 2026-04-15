const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User');

const Post = sequelize.define('Post', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: 'id'
    }
  },
  authorName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  role: {
    type: DataTypes.STRING,
    allowNull: false
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  domain: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  expertiseRequired: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  city: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  country: {
    type: DataTypes.STRING,
  },
  projectStage: {
    type: DataTypes.STRING,
  },
  commitmentLevel: {
    type: DataTypes.STRING,
  },
  collaborationType: {
    type: DataTypes.STRING,
  },
  confidentiality: {
    type: DataTypes.STRING,
  },
  expiryDate: {
    type: DataTypes.DATEONLY,
  },
  status: {
    type: DataTypes.ENUM('draft', 'active', 'meeting_scheduled', 'closed', 'expired'),
    defaultValue: 'draft',
  }
}, {
  tableName: 'posts',
  timestamps: true,
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
});

// Relationships
User.hasMany(Post, { foreignKey: 'user_id' });
Post.belongsTo(User, { foreignKey: 'user_id' });

module.exports = Post;
