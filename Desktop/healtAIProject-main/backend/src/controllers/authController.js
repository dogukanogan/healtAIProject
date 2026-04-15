const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const register = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;

    if (!email.endsWith('.edu')) {
      return res.status(400).json({ message: 'Only institutional .edu email addresses are allowed.' });
    }

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: 'This email is already registered.' });
    }

    const salt = await bcrypt.genSalt(12);
    const password_hash = await bcrypt.hash(password, salt);

    const newUser = await User.create({
      name,
      email,
      password_hash,
      role,
      verified: true // As per V1 scope in dummy phase, V2 will introduce email conf
    });

    const userResponse = { id: newUser.id, name: newUser.name, email: newUser.email, role: newUser.role, verified: newUser.verified };

    res.status(201).json({
      message: 'Registration successful. Please log in.',
      user: userResponse
    });
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    if (user.suspended) {
      return res.status(403).json({ message: 'Your account has been suspended by an administrator.' });
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    const userResponse = { id: user.id, name: user.name, email: user.email, role: user.role, verified: user.verified };

    // Request is successful, ActivityLogger middleware will log this route's activity (if attached to router)
    req.actionTarget = '-'; // no specific target for login
    req.loggedUserId = user.id;
    req.loggedUserRole = user.role;
    req.loggedUserName = user.name;

    res.status(200).json({ message: 'Login successful', token, user: userResponse });
  } catch (error) {
    next(error);
  }
};

const logout = (req, res) => {
  // Client is responsible for deleting the token from localStorage
  res.status(200).json({ message: 'Logged out successfully.' });
};

// Validates the current token
const me = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.userId, { attributes: ['id', 'name', 'email', 'role', 'verified', 'suspended'] });
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.status(200).json({ user });
  } catch (error) {
    next(error);
  }
};

module.exports = { register, login, logout, me };
