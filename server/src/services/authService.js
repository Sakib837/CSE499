import bcryptjs from 'bcryptjs';
import { generateAccessToken, generateRefreshToken } from '../config/jwt.js';
import User from '../models/User.js';
import UserBalance from '../models/UserBalance.js';
import { ConflictError, UnauthorizedError } from '../middleware/errorHandler.js';

export const authService = {
  async register(userData) {
    const { email, password, firstName, lastName, role, phone } = userData;

    // Check if user already exists
    let user = await User.findOne({ email: email.toLowerCase() });
    if (user) {
      throw new ConflictError('User already exists with this email');
    }

    // Hash password
    const saltRounds = 10;
    const passwordHash = await bcryptjs.hash(password, saltRounds);

    // Determine status: employees need admin approval, others are active immediately
    const userRole = role || 'user';
    const userStatus = userRole === 'employee' ? 'pending' : 'active';

    // Create user
    user = new User({
      email: email.toLowerCase(),
      passwordHash,
      firstName,
      lastName,
      role: userRole,
      phone,
      status: userStatus,
    });

    await user.save();

    // Create balance record for user (even if pending)
    const balance = new UserBalance({
      userId: user._id,
      balance: 1000, // Initial balance
      currency: 'USD',
    });

    await balance.save();

    // Only generate tokens if user is active, otherwise return waiting message
    let tokens = null;
    if (userStatus === 'active') {
      tokens = this.generateTokens(user._id, user.role);
    }

    return {
      user: user.toJSON(),
      tokens,
      message: userStatus === 'pending' ? 'Your employee account is pending admin approval' : 'Account created successfully',
    };
  },

  async login(email, password) {
    // Find user by email
    const user = await User.findOne({ email: email.toLowerCase() }).select('+passwordHash');

    if (!user) {
      throw new UnauthorizedError('Invalid email or password');
    }

    // Check account status
    if (user.status === 'pending') {
      throw new UnauthorizedError('Your account is pending admin approval. Please wait for confirmation.');
    }

    if (user.status !== 'active') {
      throw new UnauthorizedError('Your account has been suspended or is inactive');
    }

    // Compare password
    const isMatch = await bcryptjs.compare(password, user.passwordHash);
    if (!isMatch) {
      throw new UnauthorizedError('Invalid email or password');
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    // Generate tokens
    const tokens = this.generateTokens(user._id, user.role);

    return {
      user: user.toJSON(),
      tokens,
    };
  },

  generateTokens(userId, role) {
    const accessToken = generateAccessToken(userId, role);
    const refreshToken = generateRefreshToken(userId, role);

    return { accessToken, refreshToken };
  },

  async verifyEmail(token) {
    // TODO: Implement email verification
  },

  async resetPassword(email) {
    // TODO: Implement password reset
  },
};

export default authService;
