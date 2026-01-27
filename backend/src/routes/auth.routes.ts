import { Router, Request, Response } from 'express';
import rateLimit from 'express-rate-limit';
import { z } from 'zod';
import { query } from '../config/database';
import {
  comparePassword,
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from '../utils/auth';
import { AppError } from '../middleware/errorHandler';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

// Login rate limiter
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: 'Too many login attempts, please try again later.',
  skipSuccessfulRequests: true,
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => {
    return req.headers['x-forwarded-for'] as string || req.ip || 'unknown';
  },
});

// Validation schemas
const loginSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  userType: z.enum(['dealer', 'manufacturer']),
});

const refreshSchema = z.object({
  refreshToken: z.string(),
});

// POST /api/v1/auth/login
router.post('/login', loginLimiter, async (req: Request, res: Response, next) => {
  try {
    const { email, password, userType } = loginSchema.parse(req.body);

    // Get user from database
    const userResult = await query(
      `SELECT u.*, d.dealer_code, d.dealer_name 
       FROM users u
       LEFT JOIN dealers d ON u.dealer_id = d.id
       WHERE u.email = $1 AND u.user_type = $2 AND u.is_active = true`,
      [email, userType]
    );

    if (userResult.rows.length === 0) {
      throw new AppError('Invalid credentials', 401, 'INVALID_CREDENTIALS');
    }

    const user = userResult.rows[0];

    // Verify password
    const isPasswordValid = await comparePassword(password, user.password_hash);
    if (!isPasswordValid) {
      throw new AppError('Invalid credentials', 401, 'INVALID_CREDENTIALS');
    }

    // Get user modules
    const modulesResult = await query(
      `SELECT module FROM module_access WHERE user_id = $1`,
      [user.id]
    );

    const modules = modulesResult.rows.map((row) => row.module);

    // Generate tokens
    const tokenPayload = {
      userId: user.id,
      email: user.email,
      role: user.role,
      dealerId: user.dealer_id,
    };

    const accessToken = generateAccessToken(tokenPayload);
    const refreshToken = generateRefreshToken(tokenPayload);

    // Update last login
    await query(
      `UPDATE users SET last_login = NOW() WHERE id = $1`,
      [user.id]
    );

    // Create session log
    await query(
      `INSERT INTO session_logs (user_id, token_hash, ip_address, user_agent, expires_at)
       VALUES ($1, $2, $3, $4, NOW() + INTERVAL '7 days')`,
      [
        user.id,
        Buffer.from(refreshToken).toString('base64').substring(0, 50),
        req.ip,
        req.headers['user-agent'] || '',
      ]
    );

    res.json({
      success: true,
      data: {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          dealerCode: user.dealer_code,
          dealerName: user.dealer_name,
          designation: user.designation,
          modules,
        },
        accessToken,
        refreshToken,
      },
    });
  } catch (error) {
    next(error);
  }
});

// POST /api/v1/auth/refresh
router.post('/refresh', async (req: Request, res: Response, next) => {
  try {
    const { refreshToken } = refreshSchema.parse(req.body);

    const decoded = verifyRefreshToken(refreshToken);

    // Verify session is still valid
    const sessionResult = await query(
      `SELECT * FROM session_logs 
       WHERE user_id = $1 AND is_active = true AND expires_at > NOW()`,
      [decoded.userId]
    );

    if (sessionResult.rows.length === 0) {
      throw new AppError('Invalid or expired session', 401, 'INVALID_SESSION');
    }

    // Generate new access token
    const accessToken = generateAccessToken(decoded);

    res.json({
      success: true,
      data: { accessToken },
    });
  } catch (error) {
    next(error);
  }
});

// POST /api/v1/auth/logout
router.post('/logout', authenticate, async (req: Request, res: Response, next) => {
  try {
    // Invalidate all active sessions
    await query(
      `UPDATE session_logs SET is_active = false, logout_at = NOW()
       WHERE user_id = $1 AND is_active = true`,
      [req.user!.userId]
    );

    res.json({
      success: true,
      message: 'Logged out successfully',
    });
  } catch (error) {
    next(error);
  }
});

export default router;
