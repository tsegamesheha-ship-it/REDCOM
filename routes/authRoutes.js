import express from 'express';
import { login, getProfile, updateProfile, changePassword, rootLogin, verifyRoot } from '../controllers/authController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.post('/login', login);
router.post('/root/login', rootLogin);

// Protected routes
router.get('/me', authenticate, getProfile); // Get current user data (for permission refresh)
router.get('/profile', authenticate, getProfile);
router.put('/profile', authenticate, updateProfile);
router.post('/change-password', authenticate, changePassword);
router.get('/root/verify', authenticate, verifyRoot);

export default router;
