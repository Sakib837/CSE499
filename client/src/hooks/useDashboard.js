import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';

export function useDashboard(dashboardType) {
  const { token } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboard = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await fetch(
          `${process.env.REACT_APP_API_BASE_URL}/dashboard/${dashboardType}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error('Failed to fetch dashboard data');
        }

        const result = await response.json();
        setData(result.data);
        setError(null);
      } catch (err) {
        console.error('Dashboard fetch error:', err);
        setError(err.message);
        setData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, [token, dashboardType]);

  return { data, loading, error };
}
