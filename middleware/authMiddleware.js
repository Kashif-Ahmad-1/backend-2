// const jwt = require('jsonwebtoken');

// exports.authMiddleware = (req, res, next) => {
//   const token = req.header('Authorization');
//   if (!token) {
//     return res.status(401).json({ error: 'No token, authorization denied' });
//   }
//   try {
//     const decoded = jwt.verify(token.split(' ')[1], process.env.JWT_SECRET);
//     req.user = decoded;
//     next();
//   } catch (error) {
//     res.status(401).json({ error: 'Token is not valid' });
//   }
// };


const jwt = require('jsonwebtoken');

// Assuming blacklistedTokens is available here, you might want to import it
let blacklistedTokens = new Set(); // Consider a more persistent storage in production

exports.setBlacklistedTokens = (tokens) => {
  blacklistedTokens = tokens;
};

exports.authMiddleware = (req, res, next) => {
  const token = req.header('Authorization');
  if (!token) {
    return res.status(401).json({ error: 'No token, authorization denied' });
  }

  const tokenValue = token.split(' ')[1]; // Extract the actual token
  if (blacklistedTokens.has(tokenValue)) {
    return res.status(401).json({ error: 'Token has been blacklisted' });
  }

  try {
    const decoded = jwt.verify(tokenValue, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Token is not valid' });
  }
};
