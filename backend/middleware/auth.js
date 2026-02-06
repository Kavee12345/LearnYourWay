const jwt = require('jsonwebtoken');

/**
 * Authentication Middleware
 * Verifies JWT token and adds user to request
 */
function authMiddleware(req, res, next) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const token = authHeader.slice(7);

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;
      next();
    } catch (err) {
      return res.status(401).json({ error: 'Invalid token' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

/**
 * Optional Authentication Middleware
 * Doesn't require token but adds user if available
 */
function optionalAuthMiddleware(req, res, next) {
  try {
    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.slice(7);

      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
      } catch (err) {
        // Token is invalid but we continue without user
      }
    }

    next();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

module.exports = {
  authMiddleware,
  optionalAuthMiddleware
};
