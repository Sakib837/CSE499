import express from 'express';
import { auth } from '../middleware/auth.js';
import {
  getAllUsers,
  getAllTransactions,
  getAllMachines,
  getAllStations,
  deleteUserRecord,
  deleteTransactionRecord,
  getEmployeeTransactions,
} from '../controllers/databaseController.js';

const router = express.Router();

// Admin endpoints - Database management
router.get('/admin/users', auth, getAllUsers);
router.get('/admin/transactions', auth, getAllTransactions);
router.get('/admin/machines', auth, getAllMachines);
router.get('/admin/stations', auth, getAllStations);
router.delete('/admin/users/:userId', auth, deleteUserRecord);
router.delete('/admin/transactions/:transactionId', auth, deleteTransactionRecord);

// Employee endpoints - View their transactions
router.get('/employee/transactions', auth, getEmployeeTransactions);

export default router;
