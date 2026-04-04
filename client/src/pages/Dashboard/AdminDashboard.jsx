import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useTheme } from '../../hooks/useTheme';
import { useDashboard } from '../../hooks/useDashboard';
import { usePendingApprovals } from '../../hooks/usePendingApprovals';
import { Sun, Moon, LogOut, TrendingUp, Fuel, DollarSign, CheckCircle, AlertCircle, Check, X } from 'lucide-react';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts';

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const { data, loading, error } = useDashboard('admin');
  const { pendingEmployees, loading: approvalsLoading, fetchPendingApprovals, approveEmployee, rejectEmployee } = usePendingApprovals();
  const [activeTab, setActiveTab] = useState('overview');
  const [approvingId, setApprovingId] = useState(null);
  const [rejectingId, setRejectingId] = useState(null);
  const [approvalMessage, setApprovalMessage] = useState(null);

  // Fetch pending approvals when approvals tab is opened
  useEffect(() => {
    if (activeTab === 'approvals') {
      fetchPendingApprovals();
    }
  }, [activeTab, fetchPendingApprovals]);

  const handleLogout = () => {
    logout();
  };

  const handleApprove = async (employeeId) => {
    try {
      setApprovingId(employeeId);
      await approveEmployee(employeeId);
      setApprovalMessage({ type: 'success', text: 'Employee approved successfully!' });
      setTimeout(() => setApprovalMessage(null), 3000);
    } catch (err) {
      setApprovalMessage({ type: 'error', text: err.message });
      setTimeout(() => setApprovalMessage(null), 3000);
    } finally {
      setApprovingId(null);
    }
  };

  const handleReject = async (employeeId) => {
    try {
      setRejectingId(employeeId);
      await rejectEmployee(employeeId);
      setApprovalMessage({ type: 'success', text: 'Employee rejected successfully!' });
      setTimeout(() => setApprovalMessage(null), 3000);
    } catch (err) {
      setApprovalMessage({ type: 'error', text: err.message });
      setTimeout(() => setApprovalMessage(null), 3000);
    } finally {
      setRejectingId(null);
    }
  };

  const COLORS = [
    '#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6',
    '#EC4899', '#14B8A6', '#F97316',
  ];

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white flex items-center justify-center">
        <div className="bg-white dark:bg-slate-800 rounded-lg p-8 text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">Error Loading Dashboard</h3>
          <p className="text-slate-600 dark:text-slate-400">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white transition-colors">
      {/* Header */}
      <header className="bg-white dark:bg-slate-800/50 dark:backdrop-blur-xl shadow-lg border-b border-slate-200 dark:border-slate-700/50 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">Fuel Dispensing System</h1>
            <p className="text-sm text-slate-600 dark:text-slate-400">Admin Dashboard</p>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition"
              title="Toggle theme"
            >
              {isDark ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            <div className="text-right mr-4 border-r border-slate-200 dark:border-slate-600 pr-4">
              <p className="font-medium text-sm">{user?.firstName} {user?.lastName}</p>
              <p className="text-xs text-slate-600 dark:text-slate-400 uppercase tracking-wider font-semibold">{user?.role}</p>
            </div>

            <button
              onClick={handleLogout}
              className="p-2 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 text-red-600 dark:text-red-400 transition"
              title="Logout"
            >
              <LogOut size={20} />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-12">
          <h2 className="text-3xl font-bold mb-2">Welcome, {user?.firstName}! 👋</h2>
          <p className="text-slate-600 dark:text-slate-400">Control and monitor your fuel dispensing network</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 border-b border-slate-200 dark:border-slate-700">
          {['overview', 'approvals', 'analytics'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 font-medium transition capitalize ${
                activeTab === tab
                  ? 'border-b-2 border-blue-600 text-blue-600 dark:text-blue-400'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {loading && !data ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
            <p className="mt-4 text-slate-600 dark:text-slate-400">Loading dashboard...</p>
          </div>
        ) : (
          <>
            {/* Overview Tab */}
            {activeTab === 'overview' && data && (
              <div className="space-y-6">
                {/* Key Metrics */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {/* Today's Revenue */}
                  <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white shadow-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-blue-100 text-sm font-medium">Today's Revenue</p>
                        <p className="text-2xl font-bold mt-2">${data.metrics.today.revenue.toFixed(2)}</p>
                      </div>
                      <DollarSign size={32} className="opacity-30" />
                    </div>
                  </div>

                  {/* Today's Liters */}
                  <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white shadow-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-green-100 text-sm font-medium">Today's Liters</p>
                        <p className="text-2xl font-bold mt-2">{data.metrics.today.liters.toFixed(0)}L</p>
                      </div>
                      <Fuel size={32} className="opacity-30" />
                    </div>
                  </div>

                  {/* Active Machines */}
                  <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white shadow-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-purple-100 text-sm font-medium">Online Machines</p>
                        <p className="text-2xl font-bold mt-2">{data.activeMachines}</p>
                      </div>
                      <TrendingUp size={32} className="opacity-30" />
                    </div>
                  </div>

                  {/* Pending Approvals */}
                  <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl p-6 text-white shadow-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-orange-100 text-sm font-medium">Pending Approvals</p>
                        <p className="text-2xl font-bold mt-2">{data.pendingEmployees}</p>
                      </div>
                      <AlertCircle size={32} className="opacity-30" />
                    </div>
                  </div>
                </div>

                {/* Monthly Stats */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Month Revenue */}
                  <div className="bg-white dark:bg-slate-800/50 dark:backdrop-blur-xl rounded-xl shadow-lg border border-slate-200 dark:border-slate-700/50 p-6">
                    <h3 className="text-lg font-semibold mb-4">Month Stats</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-600 dark:text-slate-400">Total Revenue:</span>
                        <span className="font-bold text-lg text-green-600">${data.metrics.month.revenue.toFixed(2)}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-600 dark:text-slate-400">Total Liters:</span>
                        <span className="font-bold text-lg text-blue-600">{data.metrics.month.liters.toFixed(0)}L</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-600 dark:text-slate-400">Transactions:</span>
                        <span className="font-bold text-lg text-purple-600">{data.metrics.month.transactions}</span>
                      </div>
                    </div>
                  </div>

                  {/* System Overview */}
                  <div className="bg-white dark:bg-slate-800/50 dark:backdrop-blur-xl rounded-xl shadow-lg border border-slate-200 dark:border-slate-700/50 p-6">
                    <h3 className="text-lg font-semibold mb-4">System Overview</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-600 dark:text-slate-400">Total Users:</span>
                        <span className="font-bold text-lg">{data.totalUsers}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-600 dark:text-slate-400">Active Machines:</span>
                        <span className="font-bold text-lg text-green-600">{data.activeMachines}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-600 dark:text-slate-400">Pending Employees:</span>
                        <span className="font-bold text-lg text-orange-600">{data.pendingEmployees}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 7-Day Trend Chart */}
                <div className="bg-white dark:bg-slate-800/50 dark:backdrop-blur-xl rounded-xl shadow-lg border border-slate-200 dark:border-slate-700/50 p-6">
                  <h3 className="text-lg font-semibold mb-4">7-Day Trend</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={data.trend}>
                      <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#334155' : '#e2e8f0'} />
                      <XAxis dataKey="date" stroke={isDark ? '#94a3b8' : '#64748b'} />
                      <YAxis stroke={isDark ? '#94a3b8' : '#64748b'} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: isDark ? '#1e293b' : '#fff',
                          border: isDark ? '1px solid #475569' : '1px solid #e2e8f0',
                        }}
                      />
                      <Legend />
                      <Line type="monotone" dataKey="revenue" stroke="#3B82F6" name="Revenue ($)" strokeWidth={2} />
                      <Line type="monotone" dataKey="liters" stroke="#10B981" name="Liters" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>

                {/* Top Users */}
                <div className="bg-white dark:bg-slate-800/50 dark:backdrop-blur-xl rounded-xl shadow-lg border border-slate-200 dark:border-slate-700/50 p-6">
                  <h3 className="text-lg font-semibold mb-4">Top Users (Monthly Spending)</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={data.topUsers}>
                      <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#334155' : '#e2e8f0'} />
                      <XAxis dataKey="name" stroke={isDark ? '#94a3b8' : '#64748b'} />
                      <YAxis stroke={isDark ? '#94a3b8' : '#64748b'} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: isDark ? '#1e293b' : '#fff',
                          border: isDark ? '1px solid #475569' : '1px solid #e2e8f0',
                        }}
                      />
                      <Bar dataKey="spent" fill="#3B82F6" name="Spending ($)" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}

            {/* Approvals Tab */}
            {activeTab === 'approvals' && data && (
              <div className="space-y-6">
                {approvalMessage && (
                  <div className={`p-4 rounded-lg ${
                    approvalMessage.type === 'success' 
                      ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300' 
                      : 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300'
                  }`}>
                    {approvalMessage.text}
                  </div>
                )}

                <div className="bg-white dark:bg-slate-800/50 dark:backdrop-blur-xl rounded-xl shadow-lg border border-slate-200 dark:border-slate-700/50 p-6">
                  <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
                    <CheckCircle size={20} />
                    Pending Employee Approvals
                  </h3>

                  {approvalsLoading ? (
                    <div className="text-center py-12">
                      <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600"></div>
                      <p className="mt-4 text-slate-600 dark:text-slate-400">Loading pending approvals...</p>
                    </div>
                  ) : pendingEmployees.length === 0 ? (
                    <p className="text-slate-600 dark:text-slate-400 text-center py-8">✓ No pending approvals - all employees are approved!</p>
                  ) : (
                    <div className="space-y-4">
                      {pendingEmployees.map((employee) => (
                        <div 
                          key={employee._id} 
                          className="p-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg border border-slate-200 dark:border-slate-600 flex items-center justify-between"
                        >
                          <div className="flex-1">
                            <h4 className="font-semibold text-slate-900 dark:text-white">
                              {employee.firstName} {employee.lastName}
                            </h4>
                            <p className="text-sm text-slate-600 dark:text-slate-400">{employee.email}</p>
                            <p className="text-xs text-slate-500 dark:text-slate-500 mt-1">
                              Applied: {new Date(employee.createdAt).toLocaleDateString()}
                            </p>
                          </div>

                          <div className="flex gap-3">
                            <button
                              onClick={() => handleApprove(employee._id)}
                              disabled={approvingId === employee._id}
                              className="px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white rounded-lg transition font-medium flex items-center gap-2"
                            >
                              <Check size={16} />
                              {approvingId === employee._id ? 'Approving...' : 'Approve'}
                            </button>
                            <button
                              onClick={() => handleReject(employee._id)}
                              disabled={rejectingId === employee._id}
                              className="px-4 py-2 bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white rounded-lg transition font-medium flex items-center gap-2"
                            >
                              <X size={16} />
                              {rejectingId === employee._id ? 'Rejecting...' : 'Reject'}
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Analytics Tab */}
            {activeTab === 'analytics' && data && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Transaction Distribution */}
                  <div className="bg-white dark:bg-slate-800/50 dark:backdrop-blur-xl rounded-xl shadow-lg border border-slate-200 dark:border-slate-700/50 p-6">
                    <h3 className="text-lg font-semibold mb-4">Daily Distribution</h3>
                    <ResponsiveContainer width="100%" height={250}>
                      <PieChart>
                        <Pie
                          data={data.trend}
                          dataKey="transactions"
                          nameKey="date"
                          cx="50%"
                          cy="50%"
                          outerRadius={80}
                        >
                          {data.trend.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>

                  {/* Revenue Distribution */}
                  <div className="bg-white dark:bg-slate-800/50 dark:backdrop-blur-xl rounded-xl shadow-lg border border-slate-200 dark:border-slate-700/50 p-6">
                    <h3 className="text-lg font-semibold mb-4">Top User Distribution</h3>
                    <ResponsiveContainer width="100%" height={250}>
                      <PieChart>
                        <Pie
                          data={data.topUsers}
                          dataKey="spent"
                          nameKey="name"
                          cx="50%"
                          cy="50%"
                          outerRadius={80}
                        >
                          {data.topUsers.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}
