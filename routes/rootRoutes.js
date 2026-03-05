import express from 'express';
import {
  getDashboardStats,
  getRecentActivity,
  getAllUsers,
  getAllPartners,
  getAllTransactions,
  getSystemLogs,
  getHealthStatus,
  autoFixDatabase
} from '../controllers/rootControllerMongoDB.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// Health check and auto-fix routes (no auth required for health check)
router.get('/health', getHealthStatus);
router.post('/auto-fix', authenticate, autoFixDatabase);

// All other root routes require authentication
router.use(authenticate);

// Dashboard routes
router.get('/stats', getDashboardStats);
router.get('/activity', getRecentActivity);

// Management routes
router.get('/users', getAllUsers);
router.get('/partners', getAllPartners);
router.get('/transactions', getAllTransactions);
router.get('/logs', getSystemLogs);

export default router;
