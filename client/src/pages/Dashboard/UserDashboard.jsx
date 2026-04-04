import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useTheme } from '../../hooks/useTheme';
import { useDashboard } from '../../hooks/useDashboard';
import { Sun, Moon, LogOut, CreditCard, Fuel, TrendingDown, AlertCircle } from 'lucide-react';
import {
  LineChart, Line, AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts';

export default function UserDashboard() {
  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const { data, loading, error } = useDashboard('user');
  const [activeTab, setActiveTab] = useState('overview');

  const handleLogout = () => {
    logout();
  };

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
            <p className="text-sm text-slate-600 dark:text-slate-400">User Dashboard</p>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition"
            >
              {isDark ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            <div className="text-right mr-4 border-r border-slate-200 dark:border-slate-600 pr-4">
              <p className="font-medium text-sm">{user?.firstName} {user?.lastName}</p>
              <p className="text-xs text-slate-600 dark:text-slate-400 uppercase tracking-wider font-semibold">User</p>
            </div>

            <button
              onClick={handleLogout}
              className="p-2 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 text-red-600 dark:text-red-400 transition"
            >
              <LogOut size={20} />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-12">
          <h2 className="text-3xl font-bold mb-2">My Account</h2>
          <p className="text-slate-600 dark:text-slate-400">Track your fuel purchases and account balance</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 border-b border-slate-200 dark:border-slate-700">
          {['overview', 'transactions', 'history'].map(tab => (
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
            <p className="mt-4 text-slate-600 dark:text-slate-400">Loading account data...</p>
          </div>
        ) : (
          <>
            {/* Overview Tab */}
            {activeTab === 'overview' && data && (
              <div className="space-y-6">
                {/* Balance Card */}
                <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl p-8 text-white shadow-xl">
                  <p className="text-blue-100 text-sm font-medium">Account Balance</p>
                  <p className="text-5xl font-bold mt-3">${data.balance.toFixed(2)}</p>
                  <p className="text-blue-100 text-sm mt-4">Current balance available for refueling</p>
                </div>

                {/* Stat Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Total Spent */}
                  <div className="bg-white dark:bg-slate-800/50 dark:backdrop-blur-xl rounded-xl p-6 shadow-lg border border-slate-200 dark:border-slate-700/50">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-slate-600 dark:text-slate-400 text-sm font-medium">Total Spent</p>
                        <p className="text-2xl font-bold mt-2 text-green-600">${data.statistics.totalSpent.toFixed(2)}</p>
                      </div>
                      <CreditCard size={32} className="text-slate-300 dark:text-slate-600" />
                    </div>
                  </div>

                  {/* Total Liters */}
                  <div className="bg-white dark:bg-slate-800/50 dark:backdrop-blur-xl rounded-xl p-6 shadow-lg border border-slate-200 dark:border-slate-700/50">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-slate-600 dark:text-slate-400 text-sm font-medium">Total Liters</p>
                        <p className="text-2xl font-bold mt-2 text-blue-600">{data.statistics.totalLiters.toFixed(0)}L</p>
                      </div>
                      <Fuel size={32} className="text-slate-300 dark:text-slate-600" />
                    </div>
                  </div>

                  {/* Transactions */}
                  <div className="bg-white dark:bg-slate-800/50 dark:backdrop-blur-xl rounded-xl p-6 shadow-lg border border-slate-200 dark:border-slate-700/50">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-slate-600 dark:text-slate-400 text-sm font-medium">Transactions</p>
                        <p className="text-2xl font-bold mt-2 text-purple-600">{data.statistics.transactionCount}</p>
                      </div>
                      <TrendingDown size={32} className="text-slate-300 dark:text-slate-600" />
                    </div>
                  </div>
                </div>

                {/* Average Transaction */}
                <div className="bg-white dark:bg-slate-800/50 dark:backdrop-blur-xl rounded-xl p-6 shadow-lg border border-slate-200 dark:border-slate-700/50">
                  <p className="text-slate-600 dark:text-slate-400">Average per Transaction</p>
                  <p className="text-3xl font-bold mt-2">${data.statistics.averageTransaction.toFixed(2)}</p>
                </div>

                {/* Spending Trend */}
                <div className="bg-white dark:bg-slate-800/50 dark:backdrop-blur-xl rounded-xl shadow-lg border border-slate-200 dark:border-slate-700/50 p-6">
                  <h3 className="text-lg font-semibold mb-4">30-Day Spending Trend</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={data.trend}>
                      <defs>
                        <linearGradient id="colorSpending" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8} />
                          <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#334155' : '#e2e8f0'} />
                      <XAxis dataKey="date" stroke={isDark ? '#94a3b8' : '#64748b'} />
                      <YAxis stroke={isDark ? '#94a3b8' : '#64748b'} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: isDark ? '#1e293b' : '#fff',
                          border: isDark ? '1px solid #475569' : '1px solid #e2e8f0',
                        }}
                      />
                      <Area
                        type="monotone"
                        dataKey="spending"
                        stroke="#3B82F6"
                        fillOpacity={1}
                        fill="url(#colorSpending)"
                        name="Spending ($)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>

                {/* Liters Trend */}
                <div className="bg-white dark:bg-slate-800/50 dark:backdrop-blur-xl rounded-xl shadow-lg border border-slate-200 dark:border-slate-700/50 p-6">
                  <h3 className="text-lg font-semibold mb-4">30-Day Fuel Consumption</h3>
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
                      <Line type="monotone" dataKey="liters" stroke="#10B981" name="Liters" strokeWidth={2} dot={{ r: 3 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}

            {/* Transactions Tab */}
            {activeTab === 'transactions' && data && (
              <div className="space-y-6">
                <div className="bg-white dark:bg-slate-800/50 dark:backdrop-blur-xl rounded-xl shadow-lg border border-slate-200 dark:border-slate-700/50 p-6">
                  <h3 className="text-lg font-semibold mb-4">Recent Transactions</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead className="border-b border-slate-200 dark:border-slate-700">
                        <tr>
                          <th className="text-left py-3 px-4 font-semibold">Date</th>
                          <th className="text-left py-3 px-4 font-semibold">Machine</th>
                          <th className="text-left py-3 px-4 font-semibold">Amount</th>
                          <th className="text-left py-3 px-4 font-semibold">Cost</th>
                          <th className="text-left py-3 px-4 font-semibold">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {data.recentTransactions.length === 0 ? (
                          <tr>
                            <td colSpan="5" className="text-center py-8 text-slate-600 dark:text-slate-400">
                              No transactions yet
                            </td>
                          </tr>
                        ) : (
                          data.recentTransactions.map((txn, idx) => (
                            <tr key={idx} className="border-b border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50">
                              <td className="py-3 px-4 text-xs">{new Date(txn.createdAt).toLocaleDateString()} {new Date(txn.createdAt).toLocaleTimeString()}</td>
                              <td className="py-3 px-4 text-blue-600 dark:text-blue-400 font-medium">{txn.machineId?.machineId || 'N/A'}</td>
                              <td className="py-3 px-4">{txn.actualAmount?.toFixed(2) || 0}L</td>
                              <td className="py-3 px-4 font-semibold text-green-600">${txn.cost?.toFixed(2) || 0}</td>
                              <td className="py-3 px-4">
                                <span className="px-3 py-1 rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 text-xs font-semibold">
                                  Complete
                                </span>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* History Tab */}
            {activeTab === 'history' && data && (
              <div className="space-y-6">
                <div className="bg-white dark:bg-slate-800/50 dark:backdrop-blur-xl rounded-xl shadow-lg border border-slate-200 dark:border-slate-700/50 p-6">
                  <h3 className="text-lg font-semibold mb-4">Account Statistics</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center">
                      <p className="text-slate-600 dark:text-slate-400 text-sm">Total Transactions</p>
                      <p className="text-2xl font-bold mt-2">{data.statistics.transactionCount}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-slate-600 dark:text-slate-400 text-sm">Total Spent</p>
                      <p className="text-2xl font-bold mt-2 text-green-600">${data.statistics.totalSpent.toFixed(0)}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-slate-600 dark:text-slate-400 text-sm">Total Liters</p>
                      <p className="text-2xl font-bold mt-2 text-blue-600">{data.statistics.totalLiters.toFixed(0)}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-slate-600 dark:text-slate-400 text-sm">Avg. per Trip</p>
                      <p className="text-2xl font-bold mt-2 text-purple-600">${data.statistics.averageTransaction.toFixed(2)}</p>
                    </div>
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
