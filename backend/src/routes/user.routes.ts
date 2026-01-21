import { Router, Request, Response } from 'express';
import { authenticate, authorize } from '../middleware/auth.middleware';
import { query } from '../config/database';

const router = Router();

// All routes require authentication
router.use(authenticate);

// GET /api/v1/users/me
router.get('/me', async (req: Request, res: Response, next) => {
  try {
    const userResult = await query(
      `SELECT u.id, u.email, u.name, u.role, u.designation, u.last_login,
              d.dealer_code, d.dealer_name
       FROM users u
       LEFT JOIN dealers d ON u.dealer_id = d.id
       WHERE u.id = $1`,
      [req.user!.userId]
    );

    if (userResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'User not found' },
      });
    }

    const modulesResult = await query(
      `SELECT module FROM module_access WHERE user_id = $1`,
      [req.user!.userId]
    );

    const user = {
      ...userResult.rows[0],
      modules: modulesResult.rows.map((row) => row.module),
    };

    res.json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
});

// GET /api/v1/users (Admin only)
router.get(
  '/',
  authorize(['super_admin', 'manufacturer_admin']),
  async (req: Request, res: Response, next) => {
    try {
      const { page = '1', limit = '20', role, dealerId, search } = req.query;
      const offset = (parseInt(page as string) - 1) * parseInt(limit as string);

      let queryText = `
        SELECT u.id, u.email, u.name, u.role, u.designation, u.is_active, u.last_login,
               d.dealer_code, d.dealer_name
        FROM users u
        LEFT JOIN dealers d ON u.dealer_id = d.id
        WHERE 1=1
      `;
      const params: any[] = [];
      let paramCount = 1;

      if (role) {
        queryText += ` AND u.role = $${paramCount++}`;
        params.push(role);
      }

      if (dealerId) {
        queryText += ` AND u.dealer_id = $${paramCount++}`;
        params.push(dealerId);
      }

      if (search) {
        queryText += ` AND (u.name ILIKE $${paramCount++} OR u.email ILIKE $${paramCount})`;
        params.push(`%${search}%`, `%${search}%`);
        paramCount++;
      }

      queryText += ` ORDER BY u.created_at DESC LIMIT $${paramCount++} OFFSET $${paramCount}`;
      params.push(limit, offset);

      const result = await query(queryText, params);

      // Get total count
      const countResult = await query(
        `SELECT COUNT(*) FROM users u WHERE 1=1${role ? ' AND role = $1' : ''}`,
        role ? [role] : []
      );

      res.json({
        success: true,
        data: result.rows,
        pagination: {
          page: parseInt(page as string),
          limit: parseInt(limit as string),
          total: parseInt(countResult.rows[0].count),
          totalPages: Math.ceil(countResult.rows[0].count / parseInt(limit as string)),
        },
      });
    } catch (error) {
      next(error);
    }
  }
);

export default router;
