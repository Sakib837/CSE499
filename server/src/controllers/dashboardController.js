import Transaction from '../models/Transaction.js';
import User from '../models/User.js';
import Machine from '../models/Machine.js';
import UserBalance from '../models/UserBalance.js';
import { asyncHandler } from '../middleware/asyncHandler.js';
import { ForbiddenError } from '../middleware/errorHandler.js';
import { ROLES } from '../config/constants.js';

/**
 * Admin Dashboard Data
 */
export const getAdminDashboard = asyncHandler(async (req, res) => {
  if (req.user.role !== ROLES.ADMIN) {
    throw new ForbiddenError('Only admins can access admin dashboard');
  }

  const now = new Date();
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  // Get today's stats
  const todayTransactions = await Transaction.find({
    createdAt: { $gte: startOfDay },
  });

  // Get month stats
  const monthTransactions = await Transaction.find({
    createdAt: { $gte: startOfMonth },
  });

  // Get pending employees
  const pendingEmployees = await User.find({
    role: ROLES.EMPLOYEE,
    status: 'pending',
  }).select('-passwordHash');

  // Get active machines
  const activeMachines = await Machine.find({ status: 'online' });

  // Calculate metrics
  const todayRevenue = todayTransactions.reduce((sum, t) => sum + (t.cost || 0), 0);
  const todayLiters = todayTransactions.reduce((sum, t) => sum + (t.actualAmount || 0), 0);
  const monthRevenue = monthTransactions.reduce((sum, t) => sum + (t.cost || 0), 0);
  const monthLiters = monthTransactions.reduce((sum, t) => sum + (t.actualAmount || 0), 0);

  // Transaction trend (last 7 days)
  const last7Days = [];
  for (let i = 6; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    date.setHours(0, 0, 0, 0);
    
    const dayTransactions = monthTransactions.filter(t => {
      const tDate = new Date(t.createdAt);
      tDate.setHours(0, 0, 0, 0);
      return tDate.getTime() === date.getTime();
    });

    last7Days.push({
      date: date.toISOString().split('T')[0],
      transactions: dayTransactions.length,
      revenue: dayTransactions.reduce((sum, t) => sum + (t.cost || 0), 0),
      liters: dayTransactions.reduce((sum, t) => sum + (t.actualAmount || 0), 0),
    });
  }

  // Top users by spending (month)
  const userSpending = {};
  monthTransactions.forEach(t => {
    const userId = t.userId.toString();
    userSpending[userId] = (userSpending[userId] || 0) + t.cost;
  });

  const topUsers = await Promise.all(
    Object.entries(userSpending)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(async ([userId, spent]) => {
        const user = await User.findById(userId);
        return {
          userId,
          name: `${user?.firstName} ${user?.lastName}`,
          spent,
        };
      })
  );

  res.json({
    success: true,
    data: {
      metrics: {
        today: {
          transactions: todayTransactions.length,
          revenue: todayRevenue,
          liters: todayLiters,
        },
        month: {
          transactions: monthTransactions.length,
          revenue: monthRevenue,
          liters: monthLiters,
        },
      },
      trend: last7Days,
      topUsers,
      pendingEmployees: pendingEmployees.length,
      activeMachines: activeMachines.length,
      totalUsers: await User.countDocuments(),
    },
  });
});

/**
 * Employee Dashboard Data
 */
export const getEmployeeDashboard = asyncHandler(async (req, res) => {
  if (req.user.role !== ROLES.EMPLOYEE) {
    throw new ForbiddenError('Only employees can access employee dashboard');
  }

  const now = new Date();
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  // Get employee's assigned stations
  const employee = await User.findById(req.user.userId).populate('assignedStations');

  // Get today's transactions for employee's machines
  const todayTransactions = await Transaction.find({
    createdAt: { $gte: startOfDay },
  });

  // Get recent transactions
  const recentTransactions = await Transaction.find()
    .sort({ createdAt: -1 })
    .limit(10)
    .populate('userId', 'firstName lastName')
    .populate('machineId', 'machineId');

  res.json({
    success: true,
    data: {
      metrics: {
        today: {
          transactions: todayTransactions.length,
          revenue: todayTransactions.reduce((sum, t) => sum + (t.cost || 0), 0),
          liters: todayTransactions.reduce((sum, t) => sum + (t.actualAmount || 0), 0),
        },
      },
      recentTransactions,
      stationsAssigned: employee?.assignedStations?.length || 0,
    },
  });
});

/**
 * User Dashboard Data
 */
export const getUserDashboard = asyncHandler(async (req, res) => {
  const userId = req.user.userId;

  // Get user balance
  const balance = await UserBalance.findOne({ userId });

  // Get user's transactions
  const userTransactions = await Transaction.find({ userId })
    .sort({ createdAt: -1 })
    .limit(20);

  // Calculate statistics
  const totalSpent = userTransactions.reduce((sum, t) => sum + (t.cost || 0), 0);
  const totalLiters = userTransactions.reduce((sum, t) => sum + (t.actualAmount || 0), 0);
  const transactionCount = userTransactions.length;

  // Last 30 days trend
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const last30DaysTransactions = userTransactions.filter(
    t => new Date(t.createdAt) >= thirtyDaysAgo
  );

  const trend = [];
  for (let i = 29; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    date.setHours(0, 0, 0, 0);

    const dayTransactions = last30DaysTransactions.filter(t => {
      const tDate = new Date(t.createdAt);
      tDate.setHours(0, 0, 0, 0);
      return tDate.getTime() === date.getTime();
    });

    trend.push({
      date: date.toISOString().split('T')[0],
      spending: dayTransactions.reduce((sum, t) => sum + (t.cost || 0), 0),
      liters: dayTransactions.reduce((sum, t) => sum + (t.actualAmount || 0), 0),
    });
  }

  res.json({
    success: true,
    data: {
      balance: balance?.balance || 0,
      statistics: {
        totalSpent,
        totalLiters,
        transactionCount,
        averageTransaction: transactionCount > 0 ? totalSpent / transactionCount : 0,
      },
      recentTransactions: userTransactions.slice(0, 10),
      trend,
    },
  });
});

export default { getAdminDashboard, getEmployeeDashboard, getUserDashboard };
