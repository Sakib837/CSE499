import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useTheme } from '../../hooks/useTheme';
import { Sun, Moon, LogOut } from 'lucide-react';

export default function EmployeeDashboard() {
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
        <h2 className="text-3xl font-bold mb-8">My Station Overview</h2>

        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-slate-200 dark:border-slate-700 p-6">
          <p className="text-slate-600 dark:text-slate-400">Employee dashboard content coming soon...</p>
        </div>
      </main>
    </div>
  );
}
