import asyncHandler from 'express-async-handler';
import User from '../models/User.js';
import Transaction from '../models/Transaction.js';
import Machine from '../models/Machine.js';
import Station from '../models/Station.js';
import { ForbiddenError } from '../middleware/errorHandler.js';
import { ROLES } from '../constants/roles.js';

/**
 * Admin only: Get all users with details
 */
export const getAllUsers = asyncHandler(async (req, res) => {
  if (req.user.role !== ROLES.ADMIN) {
    throw new ForbiddenError('Only admins can access user database');
  }

  const users = await User.find().select('-passwordHash');
  res.json({
    success: true,
    data: users,
    count: users.length,
  });
});

/**
 * Admin only: Get all transactions with details
 */
export const getAllTransactions = asyncHandler(async (req, res) => {
  if (req.user.role !== ROLES.ADMIN) {
    throw new ForbiddenError('Only admins can access transaction database');
  }

  const transactions = await Transaction.find()
    .populate('userId', 'email firstName lastName')
    .populate('machineId', 'name location')
    .sort({ createdAt: -1 });

  res.json({
    success: true,
    data: transactions,
    count: transactions.length,
  });
});

/**
 * Admin only: Get all machines
 */
export const getAllMachines = asyncHandler(async (req, res) => {
  if (req.user.role !== ROLES.ADMIN) {
    throw new ForbiddenError('Only admins can access machine database');
  }

  const machines = await Machine.find()
    .populate('stationId', 'name location')
    .populate('assignedTo', 'email firstName lastName');

  res.json({
    success: true,
    data: machines,
    count: machines.length,
  });
});

/**
 * Admin only: Get all stations
 */
export const getAllStations = asyncHandler(async (req, res) => {
  if (req.user.role !== ROLES.ADMIN) {
    throw new ForbiddenError('Only admins can access station database');
  }

  const stations = await Station.find();
  res.json({
    success: true,
    data: stations,
    count: stations.length,
  });
});

/**
 * Admin only: Delete a user
 */
export const deleteUserRecord = asyncHandler(async (req, res) => {
  if (req.user.role !== ROLES.ADMIN) {
    throw new ForbiddenError('Only admins can delete users');
  }

  const { userId } = req.params;
  const user = await User.findByIdAndDelete(userId);

  if (!user) {
    return res.status(404).json({ success: false, message: 'User not found' });
  }

  res.json({
    success: true,
    message: 'User deleted successfully',
    deletedUser: user.email,
  });
});

/**
 * Admin only: Delete a transaction
 */
export const deleteTransactionRecord = asyncHandler(async (req, res) => {
  if (req.user.role !== ROLES.ADMIN) {
    throw new ForbiddenError('Only admins can delete transactions');
  }

  const { transactionId } = req.params;
  const transaction = await Transaction.findByIdAndDelete(transactionId);

  if (!transaction) {
    return res.status(404).json({ success: false, message: 'Transaction not found' });
  }

  res.json({
    success: true,
    message: 'Transaction deleted successfully',
  });
});

/**
 * Employee: Get their own transactions
 */
export const getEmployeeTransactions = asyncHandler(async (req, res) => {
  if (req.user.role !== ROLES.EMPLOYEE) {
    throw new ForbiddenError('Only employees can access their transactions');
  }

  const transactions = await Transaction.find({ userId: req.user._id })
    .populate('machineId', 'name location')
    .sort({ createdAt: -1 });

  res.json({
    success: true,
    data: transactions,
    count: transactions.length,
  });
});

export default {
  getAllUsers,
  getAllTransactions,
  getAllMachines,
  getAllStations,
  deleteUserRecord,
  deleteTransactionRecord,
  getEmployeeTransactions,
};
