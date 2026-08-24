const jwt = require('jsonwebtoken');
const User = require('../models/User');

function generateToken(userId) {
  // Issue a time-limited JWT containing only the identity needed by protected routes.
  return jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
}

exports.register = async (req, res) => {
  try {
    // Validate uniqueness before creating an account; the User save hook hashes
    // the supplied password with bcrypt rather than persisting plaintext.
    const { email, password, name } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }
    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      return res.status(409).json({ message: 'An account with this email already exists' });
    }
    const user = await User.create({ email, password, name });
    const token = generateToken(user._id);
    res.status(201).json({
      token,
      user: { id: user._id, email: user.email, name: user.name },
    });
  } catch (err) {
    // Return a controlled API error instead of exposing an unhandled failure.
    res.status(500).json({ message: 'Registration failed', error: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    // Look up the normalized email and verify the candidate password against
    // the stored bcrypt hash before granting a token.
    const { email, password } = req.body;
    const user = await User.findOne({ email: (email || '').toLowerCase() });
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });

    const match = await user.comparePassword(password);
    if (!match) return res.status(401).json({ message: 'Invalid credentials' });

    const token = generateToken(user._id);
    res.json({
      token,
      user: { id: user._id, email: user.email, name: user.name },
    });
  } catch (err) {
    // Keep login failures in the API contract for the client to present safely.
    res.status(500).json({ message: 'Login failed', error: err.message });
  }
};
