import { verifyAccessToken } from '../config/jwt.js';
import { ERROR_CODES } from '../config/constants.js';

export const auth = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        error: ERROR_CODES.INVALID_TOKEN,
        message: 'No token provided',
      });
    }

    const decoded = verifyAccessToken(token);
    req.user = decoded;
    next();
  } catch (err) {
    // Don't expose raw JWT error message - use generic message
    return res.status(401).json({
      success: false,
      error: ERROR_CODES.INVALID_TOKEN,
      message: 'Invalid or expired token',
    });
  }
};

export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        error: ERROR_CODES.UNAUTHORIZED,
        message: 'Access denied. Insufficient permissions.',
      });
    }
    next();
  };
};

export default { auth, authorize };
