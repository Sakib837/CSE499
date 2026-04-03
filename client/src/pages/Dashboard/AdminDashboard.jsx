import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useTheme } from '../../hooks/useTheme';
import { Sun, Moon, LogOut } from 'lucide-react';

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white transition-colors">
      {/* Header */}
      <header className="bg-white dark:bg-slate-800/50 dark:backdrop-blur-xl shadow-lg border-b border-slate-200 dark:border-slate-700/50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">Fuel Dispensing System</h1>
            <p className="text-sm text-slate-600 dark:text-slate-400">Admin Dashboard</p>
          </div>

          <div className="flex items-center gap-4">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition"
              title="Toggle theme"
            >
              {isDark ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            {/* User Info */}
            <div className="text-right mr-4 border-r border-slate-200 dark:border-slate-600 pr-4">
              <p className="font-medium text-sm">{user?.firstName} {user?.lastName}</p>
              <p className="text-xs text-slate-600 dark:text-slate-400 uppercase tracking-wider font-semibold">{user?.role}</p>
            </div>

            {/* Logout */}
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
          <h2 className="text-4xl font-bold mb-2">Welcome, {user?.firstName}! 👋</h2>
          <p className="text-slate-600 dark:text-slate-400 text-lg">Admin Control Center</p>
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Quick Stats Card */}
          <div className="bg-white dark:bg-slate-800/50 dark:backdrop-blur-xl rounded-xl shadow-lg border border-slate-200 dark:border-slate-700/50 p-6 hover:shadow-xl transition">
            <h3 className="text-lg font-semibold mb-4">📊 Dashboard</h3>
            <p className="text-slate-600 dark:text-slate-400 mb-4">View real-time metrics and analytics</p>
            <button className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition font-medium">
              View Metrics
            </button>
          </div>

          {/* Employees Card */}
          <div className="bg-white dark:bg-slate-800/50 dark:backdrop-blur-xl rounded-xl shadow-lg border border-slate-200 dark:border-slate-700/50 p-6 hover:shadow-xl transition">
            <h3 className="text-lg font-semibold mb-4">👥 Employee Approvals</h3>
            <p className="text-slate-600 dark:text-slate-400 mb-4">Review and approve pending employee accounts</p>
            <button className="w-full px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition font-medium">
              Manage Approvals
            </button>
          </div>

          {/* Machines Card */}
          <div className="bg-white dark:bg-slate-800/50 dark:backdrop-blur-xl rounded-xl shadow-lg border border-slate-200 dark:border-slate-700/50 p-6 hover:shadow-xl transition">
            <h3 className="text-lg font-semibold mb-4">🔧 Machines</h3>
            <p className="text-slate-600 dark:text-slate-400 mb-4">Monitor fuel dispensing machines</p>
            <button className="w-full px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition font-medium">
              View Machines
            </button>
          </div>

          {/* Transactions Card */}
          <div className="bg-white dark:bg-slate-800/50 dark:backdrop-blur-xl rounded-xl shadow-lg border border-slate-200 dark:border-slate-700/50 p-6 hover:shadow-xl transition">
            <h3 className="text-lg font-semibold mb-4">💰 Transactions</h3>
            <p className="text-slate-600 dark:text-slate-400 mb-4">Track all fuel dispensing transactions</p>
            <button className="w-full px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg transition font-medium">
              View Transactions
            </button>
          </div>

          {/* Inventory Card */}
          <div className="bg-white dark:bg-slate-800/50 dark:backdrop-blur-xl rounded-xl shadow-lg border border-slate-200 dark:border-slate-700/50 p-6 hover:shadow-xl transition">
            <h3 className="text-lg font-semibold mb-4">📦 Inventory</h3>
            <p className="text-slate-600 dark:text-slate-400 mb-4">Manage fuel inventory levels</p>
            <button className="w-full px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg transition font-medium">
              View Inventory
            </button>
          </div>

          {/* Settings Card */}
          <div className="bg-white dark:bg-slate-800/50 dark:backdrop-blur-xl rounded-xl shadow-lg border border-slate-200 dark:border-slate-700/50 p-6 hover:shadow-xl transition">
            <h3 className="text-lg font-semibold mb-4">⚙️ Settings</h3>
            <p className="text-slate-600 dark:text-slate-400 mb-4">Configure system settings and preferences</p>
            <button className="w-full px-4 py-2 bg-slate-600 hover:bg-slate-700 text-white rounded-lg transition font-medium">
              Open Settings
            </button>
          </div>
        </div>

        {/* Info Banner */}
        <div className="mt-12 bg-blue-50 dark:bg-blue-900/30 border-l-4 border-blue-500 rounded-lg p-6">
          <p className="text-blue-900 dark:text-blue-200">
            <strong>👋 Welcome to Admin Dashboard!</strong> All features are being built with real-time data integration. 
            Coming soon: Live metrics, employee management, machine monitoring, and analytics.
          </p>
        </div>
      </main>
    </div>
  );
}
