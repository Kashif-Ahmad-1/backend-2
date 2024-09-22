const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { addToken } = require('../utils/tokenManager');
const nodemailer = require('nodemailer');
require('dotenv').config();
const crypto = require('crypto');
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



// Forgot password function
exports.forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const resetToken = crypto.randomBytes(20).toString('hex');
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
    await user.save();

    const transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      to: user.email,
      subject: 'Password Reset',
      text: `You are receiving this email because you (or someone else) requested a password reset. 
              Please click on the following link, or paste this into your browser to complete the process: 
              http://localhost:3000/reset/${resetToken} 
              If you did not request this, please ignore this email.`,
    };

    // Log email details for debugging
    console.log("Sending email to:", user.email);
    console.log("Email options:", mailOptions);

    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: 'Password reset email sent' });
  } catch (error) {
    console.error("Error sending email:", error);
    // Provide more specific error message
    if (error.response) {
      return res.status(500).json({ error: 'Failed to send email: ' + error.response });
    }
    res.status(500).json({ error: 'Failed to send email' });
  }
};

// Reset password function (add this if you want to complete the flow)
exports.resetPassword = async (req, res) => {
  const { token, newPassword } = req.body;
  try {
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() }
    });
    if (!user) {
      return res.status(400).json({ message: 'Password reset token is invalid or has expired.' });
    }

    user.password = newPassword; // Hash password before saving
    user.resetPasswordToken = undefined; // Clear the reset token
    user.resetPasswordExpires = undefined; // Clear the expiration
    await user.save();
    res.status(200).json({ message: 'Password has been reset successfully.' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};


