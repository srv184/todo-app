const jwt = require('jsonwebtoken');

module.exports = function auth(req, res, next) {
  // Protected task routes require a Bearer token in the Authorization header.
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'No token provided' });
  }
  const token = header.split(' ')[1];
  try {
    // Verify the signed JWT before trusting its user identity on the request.
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // Controllers use this identity to scope every task operation to its owner.
    req.userId = decoded.userId;
    next();
  } catch (err) {
    // Reject invalid or expired credentials without revealing token internals.
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};
