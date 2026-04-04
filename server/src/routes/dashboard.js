import express from 'express';
import { getAdminDashboard, getEmployeeDashboard, getUserDashboard } from '../controllers/dashboardController.js';
import { auth } from '../middleware/auth.js';

const router = express.Router();

// All dashboard routes require authentication
router.use(auth);

// Dashboard endpoints
router.get('/admin', getAdminDashboard);
router.get('/employee', getEmployeeDashboard);
router.get('/user', getUserDashboard);

export default router;
