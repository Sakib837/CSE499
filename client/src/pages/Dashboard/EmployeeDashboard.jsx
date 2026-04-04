import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useTheme } from '../../hooks/useTheme';
import { useDashboard } from '../../hooks/useDashboard';
import { Sun, Moon, LogOut, Fuel, DollarSign, TrendingUp, AlertCircle } from 'lucide-react';
import {
  LineChart, Line, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts';

export default function EmployeeDashboard() {
  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const { data, loading, error } = useDashboard('employee');
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
            <p className="text-sm text-slate-600 dark:text-slate-400">Employee Dashboard</p>
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
              <p className="text-xs text-slate-600 dark:text-slate-400 uppercase tracking-wider font-semibold">Employee</p>
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
          <h2 className="text-3xl font-bold mb-2">Station Overview</h2>
          <p className="text-slate-600 dark:text-slate-400">Monitor your assigned stations</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 border-b border-slate-200 dark:border-slate-700">
          {['overview', 'transactions'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 font-medium transition capitalize ${
                activeTab === tab
                  ? 'border-b-2 border-green-600 text-green-600 dark:text-green-400'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {loading && !data ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-600"></div>
            <p className="mt-4 text-slate-600 dark:text-slate-400">Loading station data...</p>
          </div>
        ) : (
          <>
            {/* Overview Tab */}
            {activeTab === 'overview' && data && (
              <div className="space-y-6">
                {/* Today's Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Today's Revenue */}
                  <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white shadow-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-green-100 text-sm font-medium">Today's Revenue</p>
                        <p className="text-2xl font-bold mt-2">${data.metrics.today.revenue.toFixed(2)}</p>
                      </div>
                      <DollarSign size={32} className="opacity-30" />
                    </div>
                  </div>

                  {/* Today's Liters */}
                  <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white shadow-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-blue-100 text-sm font-medium">Today's Liters</p>
                        <p className="text-2xl font-bold mt-2">{data.metrics.today.liters.toFixed(0)}L</p>
                      </div>
                      <Fuel size={32} className="opacity-30" />
                    </div>
                  </div>

                  {/* Transactions */}
                  <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white shadow-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-purple-100 text-sm font-medium">Today's Transactions</p>
                        <p className="text-2xl font-bold mt-2">{data.metrics.today.transactions}</p>
                      </div>
                      <TrendingUp size={32} className="opacity-30" />
                    </div>
                  </div>
                </div>

                {/* Station Info */}
                <div className="bg-white dark:bg-slate-800/50 dark:backdrop-blur-xl rounded-xl shadow-lg border border-slate-200 dark:border-slate-700/50 p-6">
                  <h3 className="text-lg font-semibold mb-4">Assigned Stations</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-600 dark:text-slate-400">Total Assigned Stations:</span>
                      <span className="font-bold text-lg">{data.stationsAssigned}</span>
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mt-4">
                      Manage your assigned fuel pumping stations and monitor real-time activity.
                    </p>
                  </div>
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
                          <th className="text-left py-3 px-4 font-semibold">User</th>
                          <th className="text-left py-3 px-4 font-semibold">Machine</th>
                          <th className="text-left py-3 px-4 font-semibold">Amount</th>
                          <th className="text-left py-3 px-4 font-semibold">Cost</th>
                          <th className="text-left py-3 px-4 font-semibold">Date</th>
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
                              <td className="py-3 px-4">{txn.userId?.firstName || 'N/A'} {txn.userId?.lastName || ''}</td>
                              <td className="py-3 px-4 text-blue-600 dark:text-blue-400">{txn.machineId?.machineId || 'N/A'}</td>
                              <td className="py-3 px-4">{txn.actualAmount?.toFixed(2) || 0}L</td>
                              <td className="py-3 px-4 font-semibold text-green-600">${txn.cost?.toFixed(2) || 0}</td>
                              <td className="py-3 px-4 text-xs text-slate-500">{new Date(txn.createdAt).toLocaleDateString()}</td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
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
