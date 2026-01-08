const User = require('../models/User');
const bcrypt = require('bcryptjs');
const generateToken = require('../utils/generateToken');

exports.register = async (req, res) => {
  const { name, email, password, role } = req.body;

  const exists = await User.findOne({ email });
  if (exists) return res.status(400).json({ message: 'User exists' });

  const hashed = await bcrypt.hash(password, 10);

  await User.create({
    name,
    email,
    password: hashed,
    role: role === 'admin' ? 'admin' : 'user',
  });

  res.json({ message: 'Signup successful' });
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ message: 'Invalid login' });

  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.status(400).json({ message: 'Invalid login' });

  res.json({
    token: generateToken(user._id, user.role),
    role: user.role,
  });
};

exports.adminLogin = async (req, res) => {
  const { email, password } = req.body;

  const admin = await User.findOne({ email, role: 'admin' });
  if (!admin) return res.status(403).json({ message: 'Not admin' });

  const match = await bcrypt.compare(password, admin.password);
  if (!match) return res.status(400).json({ message: 'Invalid login' });

  res.json({
    token: generateToken(admin._id, admin.role),
    role: admin.role,
  });
};
