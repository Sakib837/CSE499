import { useState, useEffect, useCallback } from 'react';
import { useAuth } from './useAuth';

export const useDatabaseManager = () => {
  const { token } = useAuth();
  const [users, setUsers] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [machines, setMachines] = useState([]);
  const [stations, setStations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchAllData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch all users
      const usersResp = await fetch(
        `${process.env.REACT_APP_API_BASE_URL}/admin/users`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (usersResp.ok) {
        const usersData = await usersResp.json();
        setUsers(usersData.data || []);
      }

      // Fetch all transactions
      const transactionsResp = await fetch(
        `${process.env.REACT_APP_API_BASE_URL}/admin/transactions`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (transactionsResp.ok) {
        const transData = await transactionsResp.json();
        setTransactions(transData.data || []);
      }

      // Fetch all machines
      const machinesResp = await fetch(
        `${process.env.REACT_APP_API_BASE_URL}/admin/machines`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (machinesResp.ok) {
        const machinesData = await machinesResp.json();
        setMachines(machinesData.data || []);
      }

      // Fetch all stations
      const stationsResp = await fetch(
        `${process.env.REACT_APP_API_BASE_URL}/admin/stations`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (stationsResp.ok) {
        const stationsData = await stationsResp.json();
        setStations(stationsData.data || []);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [token]);

  const deleteUser = useCallback(async (userId) => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_BASE_URL}/admin/users/${userId}`,
        {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!response.ok) throw new Error('Failed to delete user');

      setUsers(prev => prev.filter(u => u._id !== userId));
      return true;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, [token]);

  const deleteTransaction = useCallback(async (transactionId) => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_BASE_URL}/admin/transactions/${transactionId}`,
        {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!response.ok) throw new Error('Failed to delete transaction');

      setTransactions(prev => prev.filter(t => t._id !== transactionId));
      return true;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, [token]);

  return {
    users,
    transactions,
    machines,
    stations,
    loading,
    error,
    fetchAllData,
    deleteUser,
    deleteTransaction,
  };
};
