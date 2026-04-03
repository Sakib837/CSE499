import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';

// Pages
import Login from './pages/Auth/Login';
import SignUp from './pages/Auth/SignUp';
import AdminDashboard from './pages/Dashboard/AdminDashboard';
import EmployeeDashboard from './pages/Dashboard/EmployeeDashboard';
import UserDashboard from './pages/Dashboard/UserDashboard';

// Components
import ProtectedRoute from './components/common/ProtectedRoute';

function App() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-slate-900">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        {/* Auth Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />

        {/* Dashboard Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              {user?.role === 'admin' && <AdminDashboard />}
              {user?.role === 'employee' && <EmployeeDashboard />}
              {user?.role === 'user' && <UserDashboard />}
            </ProtectedRoute>
          }
        />

        {/* Redirect to dashboard if logged in, else login */}
        <Route path="/" element={user ? <Navigate to="/dashboard" /> : <Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;
