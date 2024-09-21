const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { addToken } = require('../utils/tokenManager');
exports.register = async (req, res) => {
  const { name, email, password, mobileNumber,address,role } = req.body;
  try {
    const user = new User({ name, email, password, mobileNumber, address, role });
    await user.save();
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    res.status(400).json({ error: 'Error registering user' });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }
    const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token ,role: user.role});
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

// Logout function
exports.logout = (req, res) => {
  const token = req.headers['authorization']?.split(' ')[1]; // Assuming Bearer token

  if (token) {
    addToken(token); // Add token to blacklist
    res.status(200).json({ message: 'Logout successful' });
  } else {
    res.status(400).json({ error: 'No token provided' });
  }
};
