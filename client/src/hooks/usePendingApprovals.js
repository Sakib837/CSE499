import { useState, useCallback } from 'react';
import { useAuth } from './useAuth';

export const usePendingApprovals = () => {
  const { token } = useAuth();
  const [pendingEmployees, setPendingEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchPendingApprovals = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(
        `${process.env.REACT_APP_API_BASE_URL}/auth/approvals/pending`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch pending approvals');
      }

      const data = await response.json();
      setPendingEmployees(data.data || []);
      return data.data || [];
    } catch (err) {
      setError(err.message);
      return [];
    } finally {
      setLoading(false);
    }
  }, [token]);

  const approveEmployee = useCallback(async (userId) => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_BASE_URL}/auth/approvals/${userId}/approve`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to approve employee');
      }

      const data = await response.json();
      
      // Remove from pending list
      setPendingEmployees(prev => prev.filter(emp => emp._id !== userId));
      
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, [token]);

  const rejectEmployee = useCallback(async (userId) => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_BASE_URL}/auth/approvals/${userId}/reject`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to reject employee');
      }

      const data = await response.json();
      
      // Remove from pending list
      setPendingEmployees(prev => prev.filter(emp => emp._id !== userId));
      
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, [token]);

  return {
    pendingEmployees,
    loading,
    error,
    fetchPendingApprovals,
    approveEmployee,
    rejectEmployee,
  };
};
