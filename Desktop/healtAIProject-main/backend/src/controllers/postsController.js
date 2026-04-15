const { Op } = require('sequelize');
const Post = require('../models/Post');
const User = require('../models/User');

const updateExpiredPosts = async () => {
  const today = new Date().toISOString().split('T')[0];
  await Post.update(
    { status: 'expired' },
    { 
      where: { 
        expiryDate: { [Op.lt]: today },
        status: { [Op.in]: ['active', 'meeting_scheduled'] }
      } 
    }
  );
};

const getAllPosts = async (req, res, next) => {
  try {
    await updateExpiredPosts(); // Automatically expire posts on fetch
    
    const { domain, city, expertise, stage, status } = req.query;
    let whereClause = {};

    if (domain)    whereClause.domain = { [Op.iLike]: `%${domain}%` };
    if (city)      whereClause.city = { [Op.iLike]: `%${city}%` };
    if (expertise) whereClause.expertiseRequired = { [Op.iLike]: `%${expertise}%` };
    if (stage)     whereClause.projectStage = stage;
    if (status)    whereClause.status = status;
    else           whereClause.status = 'active'; // Default to active for public browsing

    const posts = await Post.findAll({ 
      where: whereClause,
      order: [['createdAt', 'DESC']]
    });

    res.status(200).json(posts);
  } catch (error) {
    next(error);
  }
};

const getPostById = async (req, res, next) => {
  try {
    await updateExpiredPosts();
    const post = await Post.findByPk(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });
    
    // Convert DB fields to match frontend expected names if necessary
    const postData = post.toJSON();
    postData.userId = postData.user_id;

    res.status(200).json(postData);
  } catch (error) {
    next(error);
  }
};

const createPost = async (req, res, next) => {
  try {
    const { title, domain, description, expertiseRequired, city, country, projectStage, commitmentLevel, collaborationType, confidentiality, expiryDate, status } = req.body;
    
    // Find author to inject names directly as per mock
    const user = await User.findByPk(req.userId);

    const newPost = await Post.create({
      user_id: req.userId,
      authorName: user.name,
      role: user.role,
      title, domain, description, expertiseRequired, city, country, 
      projectStage, commitmentLevel, collaborationType, confidentiality, 
      expiryDate: expiryDate || null, 
      status: status || 'draft'
    });

    const postData = newPost.toJSON();
    postData.userId = postData.user_id;

    req.actionTarget = `Post #${newPost.id}`;
    res.status(201).json(postData);
  } catch (error) {
    next(error);
  }
};

const updatePost = async (req, res, next) => {
  try {
    const post = await Post.findByPk(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });
    if (post.user_id !== req.userId) return res.status(403).json({ message: 'Not authorized to edit this post' });

    await post.update(req.body);

    const postData = post.toJSON();
    postData.userId = postData.user_id;
    
    req.actionTarget = `Post #${post.id}`;
    res.status(200).json(postData);
  } catch (error) {
    next(error);
  }
};

const changeStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const post = await Post.findByPk(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });
    if (post.user_id !== req.userId && req.userRole !== 'admin') {
        return res.status(403).json({ message: 'Not authorized to change status' });
    }

    await post.update({ status });
    
    const postData = post.toJSON();
    postData.userId = postData.user_id;
    
    req.actionTarget = `Post #${post.id} -> ${status}`;
    res.status(200).json(postData);
  } catch (error) {
    next(error);
  }
};

const deletePost = async (req, res, next) => {
  try {
    const post = await Post.findByPk(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });
    if (post.user_id !== req.userId && req.userRole !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to delete this post' });
    }

    await post.destroy();
    req.actionTarget = `Post #${req.params.id}`;
    res.status(200).json({ message: 'Post removed successfully' });
  } catch (error) {
    next(error);
  }
};

module.exports = { getAllPosts, getPostById, createPost, updatePost, changeStatus, deletePost };
