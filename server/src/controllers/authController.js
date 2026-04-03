import authService from '../services/authService.js';
import { asyncHandler } from '../middleware/asyncHandler.js';
import User from '../models/User.js';
import { ForbiddenError, NotFoundError } from '../middleware/errorHandler.js';
import { ROLES, USER_STATUS } from '../config/constants.js';

export const register = asyncHandler(async (req, res) => {
  const { email, password, firstName, lastName, role, phone } = req.body;

  const { user, tokens, message } = await authService.register({
    email,
    password,
    firstName,
    lastName,
    role,
    phone,
  });

  // Only set token cookie if account is active
  if (tokens) {
    res.cookie('refreshToken', tokens.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'Strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });
  }

  res.status(201).json({
    success: true,
    message: message || 'User registered successfully',
    user,
    accessToken: tokens?.accessToken || null,
    status: user.status,
  });
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const { user, tokens } = await authService.login(email, password);

  // Set refresh token in httpOnly cookie
  res.cookie('refreshToken', tokens.refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'Strict',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  res.json({
    success: true,
    message: 'Login successful',
    user,
    accessToken: tokens.accessToken,
  });
});

export const refresh = asyncHandler(async (req, res) => {
  const { refreshToken } = req.cookies;

  if (!refreshToken) {
    return res.status(401).json({
      success: false,
      message: 'Refresh token not found',
    });
  }

  const tokens = authService.generateTokens(req.user.userId, req.user.role);

  res.json({
    success: true,
    message: 'Token refreshed',
    accessToken: tokens.accessToken,
  });
});

export const logout = asyncHandler(async (req, res) => {
  res.clearCookie('refreshToken');

  res.json({
    success: true,
    message: 'Logged out successfully',
  });
});

/**
 * Verify token and return user data (used by frontend on app load)
 */
export const verify = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.userId).select('-passwordHash');

  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'User not found',
    });
  }

  res.json({
    success: true,
    user: user.toJSON(),
  });
});

/**
 * Admin only: Get all pending employee approval requests
 */
export const getPendingApprovals = asyncHandler(async (req, res) => {
  // Check if user is admin
  if (req.user.role !== ROLES.ADMIN) {
    throw new ForbiddenError('Only admins can view approval requests');
  }

  const pendingEmployees = await User.find({
    role: ROLES.EMPLOYEE,
    status: USER_STATUS.PENDING,
  }).select('-passwordHash');

  res.json({
    success: true,
    data: pendingEmployees,
    count: pendingEmployees.length,
  });
});

/**
 * Admin only: Approve an employee account
 */
export const approveEmployee = asyncHandler(async (req, res) => {
  // Check if user is admin
  if (req.user.role !== ROLES.ADMIN) {
    throw new ForbiddenError('Only admins can approve employees');
  }

  const { userId } = req.params;

  const user = await User.findById(userId);
  if (!user) {
    throw new NotFoundError('User not found');
  }

  if (user.role !== ROLES.EMPLOYEE) {
    throw new ForbiddenError('User is not an employee');
  }

  if (user.status !== USER_STATUS.PENDING) {
    throw new ForbiddenError('User is not in pending status');
  }

  user.status = USER_STATUS.ACTIVE;
  await user.save();

  res.json({
    success: true,
    message: 'Employee approved successfully',
    user: user.toJSON(),
  });
});

/**
 * Admin only: Reject an employee account
 */
export const rejectEmployee = asyncHandler(async (req, res) => {
  // Check if user is admin
  if (req.user.role !== ROLES.ADMIN) {
    throw new ForbiddenError('Only admins can reject employees');
  }

  const { userId } = req.params;

  const user = await User.findById(userId);
  if (!user) {
    throw new NotFoundError('User not found');
  }

  if (user.role !== ROLES.EMPLOYEE) {
    throw new ForbiddenError('User is not an employee');
  }

  if (user.status !== USER_STATUS.PENDING) {
    throw new ForbiddenError('User is not in pending status');
  }

  // Delete the rejected employee
  await User.deleteOne({ _id: userId });

  res.json({
    success: true,
    message: 'Employee account rejected and deleted',
  });
});

export default { register, login, refresh, logout, verify, getPendingApprovals, approveEmployee, rejectEmployee };
