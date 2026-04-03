import express from 'express';
import { 
  register, 
  login, 
  refresh, 
  logout,
  verify,
  getPendingApprovals,
  approveEmployee,
  rejectEmployee 
} from '../controllers/authController.js';
import { validate } from '../middleware/validation.js';
import { registerSchema, loginSchema } from '../utils/validators.js';
import { auth } from '../middleware/auth.js';

const router = express.Router();

router.post('/register', validate(registerSchema), register);
router.post('/login', validate(loginSchema), login);
router.get('/verify', auth, verify);
router.post('/refresh', auth, refresh);
router.post('/logout', auth, logout);

// Admin endpoints for employee approval
router.get('/approvals/pending', auth, getPendingApprovals);
router.post('/approvals/:userId/approve', auth, approveEmployee);
router.post('/approvals/:userId/reject', auth, rejectEmployee);

export default router;
