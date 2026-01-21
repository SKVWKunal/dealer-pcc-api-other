import { Router, Request, Response } from 'express';
import { authenticate, authorize } from '../middleware/auth.middleware';
import { query } from '../config/database';

const router = Router();
router.use(authenticate);

// GET /api/v1/dealers
router.get('/', async (req: Request, res: Response, next) => {
  try {
    const { page = '1', limit = '20', status, brand, search } = req.query;
    const offset = (parseInt(page as string) - 1) * parseInt(limit as string);

    let queryText = 'SELECT * FROM dealers WHERE 1=1';
    const params: any[] = [];
    let paramCount = 1;

    if (status) {
      queryText += ` AND status = $${paramCount++}`;
      params.push(status);
    }

    if (brand) {
      queryText += ` AND brand = $${paramCount++}`;
      params.push(brand);
    }

    if (search) {
      queryText += ` AND (dealer_name ILIKE $${paramCount++} OR dealer_code ILIKE $${paramCount})`;
      params.push(`%${search}%`, `%${search}%`);
      paramCount++;
    }

    queryText += ` ORDER BY dealer_name LIMIT $${paramCount++} OFFSET $${paramCount}`;
    params.push(limit, offset);

    const result = await query(queryText, params);
    const countResult = await query('SELECT COUNT(*) FROM dealers');

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
});

// GET /api/v1/dealers/:id
router.get('/:id', async (req: Request, res: Response, next) => {
  try {
    const result = await query('SELECT * FROM dealers WHERE id = $1', [req.params.id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Dealer not found' },
      });
    }

    res.json({ success: true, data: result.rows[0] });
  } catch (error) {
    next(error);
  }
});

export default router;
