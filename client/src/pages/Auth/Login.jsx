import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Mail, Lock } from 'lucide-react';

export default function Login() {
  const navigate = useNavigate();
  const { login, loading } = useAuth();
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const result = await login(formData.email, formData.password);
    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.error || 'Login failed');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      {/* Background accent */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-600 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-2000"></div>
      </div>

      <div className="relative bg-white dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl shadow-2xl p-8 w-full max-w-md border border-slate-200 dark:border-slate-700/50">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
            Fuel Dispensing
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            Smart Fuel Management System
          </p>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800/50 text-red-700 dark:text-red-300 rounded-lg flex items-start">
            <span className="text-lg mr-3">⚠️</span>
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
              Email Address
            </label>
            <div className="flex items-center border border-slate-300 dark:border-slate-600 rounded-lg px-4 py-3 focus-within:border-blue-500 dark:focus-within:border-blue-400 focus-within:ring-2 focus-within:ring-blue-500/20 dark:focus-within:ring-blue-400/20 transition">
              <Mail size={18} className="text-slate-400 mr-3" />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="flex-1 outline-none bg-transparent dark:text-white"
                placeholder="your@email.com"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
              Password
            </label>
            <div className="flex items-center border border-slate-300 dark:border-slate-600 rounded-lg px-4 py-3 focus-within:border-blue-500 dark:focus-within:border-blue-400 focus-within:ring-2 focus-within:ring-blue-500/20 dark:focus-within:ring-blue-400/20 transition">
              <Lock size={18} className="text-slate-400 mr-3" />
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="flex-1 outline-none bg-transparent dark:text-white"
                placeholder="••••••••"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-3 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <p className="text-center mt-6 text-slate-600 dark:text-slate-400">
          Don't have an account?{' '}
          <Link to="/signup" className="text-blue-600 hover:underline font-semibold">
            Sign up here
          </Link>
        </p>
      </div>
    </div>
  );
}
