import React, { createContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('accessToken'));
  const [loading, setLoading] = useState(true);

  // Validate token on component mount or when token changes
  useEffect(() => {
    const validateToken = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/auth/verify`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.ok) {
          const data = await response.json();
          setUser(data.user);
        } else {
          // Token invalid or expired
          setUser(null);
          setToken(null);
          localStorage.removeItem('accessToken');
        }
      } catch (err) {
        console.error('Token validation error:', err);
        setUser(null);
        setToken(null);
        localStorage.removeItem('accessToken');
      } finally {
        setLoading(false);
      }
    };

    validateToken();
  }, [token]);

  const login = async (email, password) => {
    try {
      const url = `${process.env.REACT_APP_API_BASE_URL}/auth/login`;
      console.log('Attempting login to:', url);
      
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
        credentials: 'include',
      });

      console.log('Login response status:', response.status);

      const data = await response.json();
      console.log('Login response data:', data);

      if (data.success) {
        console.log('Login successful, setting token and user');
        setToken(data.accessToken);
        setUser(data.user);
        localStorage.setItem('accessToken', data.accessToken);
        return { success: true };
      }

      console.log('Login failed:', data.message);
      return { success: false, error: data.message };
    } catch (err) {
      console.error('Login error:', err);
      return { success: false, error: err.message };
    }
  };

  const register = async (userData) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
        credentials: 'include',
      });

      const data = await response.json();

      if (data.success) {
        // Only set token if user is active (not pending)
        if (data.accessToken) {
          setToken(data.accessToken);
          localStorage.setItem('accessToken', data.accessToken);
        }
        
        setUser(data.user);
        
        return { 
          success: true, 
          status: data.status,
          message: data.message 
        };
      }

      return { success: false, error: data.message };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('accessToken');
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export default AuthContext;
