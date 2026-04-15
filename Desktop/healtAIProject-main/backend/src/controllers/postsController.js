const { Op } = require('sequelize');
const Post = require('../models/Post');
const User = require('../models/User');
const EDITABLE_STATUSES = ['draft', 'active'];
const ALLOWED_STATUSES = ['draft', 'active', 'meeting_scheduled', 'closed', 'expired'];

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
    if (status) whereClause.status = status;

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

    if (!title || !domain || !description || !expertiseRequired || !city) {
      return res.status(400).json({ message: 'Title, domain, description, expertiseRequired and city are required.' });
    }

    if (status && !ALLOWED_STATUSES.includes(status)) {
      return res.status(400).json({ message: 'Invalid post status.' });
    }

    // Find author to inject names directly as per mock
    const user = await User.findByPk(req.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    const newPost = await Post.create({
      user_id: req.userId,
      authorName: user.name,
      role: user.role,
      title: title.trim(),
      domain: domain.trim(),
      description: description.trim(),
      expertiseRequired: expertiseRequired.trim(),
      city: city.trim(),
      country: country || null,
      projectStage: projectStage || null,
      commitmentLevel: commitmentLevel || null,
      collaborationType: collaborationType || null,
      confidentiality: confidentiality || null,
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
    if (post.user_id !== req.userId && req.userRole !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to edit this post' });
    }

    if (!EDITABLE_STATUSES.includes(post.status) && req.userRole !== 'admin') {
      return res.status(400).json({ message: 'Only draft or active posts can be edited.' });
    }

    const blockedFields = ['id', 'user_id', 'authorName', 'role', 'createdAt', 'updatedAt'];
    const updates = { ...req.body };
    blockedFields.forEach((field) => delete updates[field]);

    if (updates.status && !ALLOWED_STATUSES.includes(updates.status)) {
      return res.status(400).json({ message: 'Invalid post status.' });
    }

    await post.update(updates);

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

    if (!ALLOWED_STATUSES.includes(status)) {
      return res.status(400).json({ message: 'Invalid post status.' });
    }

    if (post.status === 'expired' || post.status === 'closed') {
      return res.status(400).json({ message: `Cannot change status of a ${post.status} post.` });
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
