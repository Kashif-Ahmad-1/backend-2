// const User = require('../models/User');

// exports.getUsers = async (req, res) => {
//   const { role } = req.user;
//   if (role !== 'admin') {
//     return res.status(403).json({ error: 'Access denied' });
//   }
//   try {
//     const users = await User.find();
//     res.json(users);
//   } catch (error) {
//     res.status(500).json({ error: 'Error fetching users' });
//   }
// };

// // Get all engineers (for admin)
// exports.getEngineers = async (req, res) => {
//     try {
//       const engineers = await User.find({ role: 'engineer' });
//       res.json(engineers);
//     } catch (error) {
//       res.status(500).json({ error: 'Error fetching engineers' });
//     }
//   };


// // Get all Admin (for admin)
// exports.getAdmins = async (req, res) => {
//     try {
//       const admins = await User.find({ role: 'admin' });
//       res.json(admins);
//     } catch (error) {
//       res.status(500).json({ error: 'Error fetching admins' });
//     }
//   };

//   exports.getAccountants = async (req, res) => {
//     try {
//       const accountants = await User.find({ role: 'accountant' });
//       res.json(accountants);
//     } catch (error) {
//       res.status(500).json({ error: 'Error fetching accountants' });
//     }
//   };




// Get all users with the specified role
// exports.getUsersByRole = async (req, res) => {
//   const { role } = req.params; // role can be 'admin', 'accountant', or 'engineer'

//   try {
//     // Validate role
//     if (!['admin', 'accountant', 'engineer'].includes(role)) {
//       return res.status(400).json({ error: 'Invalid role' });
//     }

//     // Ensure only admins can access all users
//     if (req.user.role !== 'admin') {
//       return res.status(403).json({ error: 'Access denied' });
//     }

//     const users = await User.find({ role });
//     res.json(users);
//   } catch (error) {
//     res.status(500).json({ error: 'Error fetching users' });
//   }
// };




// Get all engineers (for accountants)
// exports.getEngineersForAccountant = async (req, res) => {
//     try {
//       // Ensure the user is an accountant
//       if (req.user.role !== 'accountant' && req.user.role !== 'admin') {
//         return res.status(403).json({ error: 'Access denied' });
//       }
  
//       const engineers = await User.find({ role: 'engineer' });
//       res.json(engineers);
//     } catch (error) {
//       res.status(500).json({ error: 'Error fetching engineers' });
//     }
//   };





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


  
