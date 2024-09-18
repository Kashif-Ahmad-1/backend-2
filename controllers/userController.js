
const User = require('../models/User');

exports.getUsers = async (req, res) => {
  const { role } = req.user;
  if (role !== 'admin') {
    return res.status(403).json({ error: 'Access denied' });
  }
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching users' });
  }
};

// Get all engineers (for admin and accountant)
exports.getEngineers = async (req, res) => {
  const { role } = req.user;
  if (role !== 'admin' && role !== 'accountant') {
    return res.status(403).json({ error: 'Access denied' });
  }
  
  try {
    const engineers = await User.find({ role: 'engineer' });
    res.json(engineers);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching engineers' });
  }
};

// Get all Admins (for admin)
exports.getAdmins = async (req, res) => {
  const { role } = req.user;
  if (role !== 'admin') {
    return res.status(403).json({ error: 'Access denied' });
  }
  
  try {
    const admins = await User.find({ role: 'admin' });
    res.json(admins);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching admins' });
  }
};

// Get all Accountants (for admin)
exports.getAccountants = async (req, res) => {
  const { role } = req.user;
  if (role !== 'admin') {
    return res.status(403).json({ error: 'Access denied' });
  }
  
  try {
    const accountants = await User.find({ role: 'accountant' });
    res.json(accountants);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching accountants' });
  }
};


  
