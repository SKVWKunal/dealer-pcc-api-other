import { Router, Request, Response } from 'express';
import { authenticate, authorizeModule } from '../middleware/auth.middleware';
import { query } from '../config/database';
import { v4 as uuidv4 } from 'uuid';

const router = Router();
router.use(authenticate);
router.use(authorizeModule('dealer_pcc'));

// GET /api/v1/dealer-pcc
router.get('/', async (req: Request, res: Response, next) => {
  try {
    const { page = '1', limit = '20', status, dealerId, fromDate, toDate } = req.query;
    const offset = (parseInt(page as string) - 1) * parseInt(limit as string);

    let queryText = `
      SELECT p.*, d.dealer_name, d.dealer_code, u.name as submitted_by_name
      FROM dealer_pcc p
      JOIN dealers d ON p.dealer_id = d.id
      JOIN users u ON p.submitted_by = u.id
      WHERE 1=1
    `;
    const params: any[] = [];
    let paramCount = 1;

    // Dealers can only see their own PCCs
    if (req.user!.dealerId) {
      queryText += ` AND p.dealer_id = $${paramCount++}`;
      params.push(req.user!.dealerId);
    } else if (dealerId) {
      queryText += ` AND p.dealer_id = $${paramCount++}`;
      params.push(dealerId);
    }

    if (status) {
      queryText += ` AND p.status = $${paramCount++}`;
      params.push(status);
    }

    if (fromDate) {
      queryText += ` AND p.application_date >= $${paramCount++}`;
      params.push(fromDate);
    }

    if (toDate) {
      queryText += ` AND p.application_date <= $${paramCount++}`;
      params.push(toDate);
    }

    queryText += ` ORDER BY p.created_at DESC LIMIT $${paramCount++} OFFSET $${paramCount}`;
    params.push(limit, offset);

    const result = await query(queryText, params);
    const countResult = await query(
      `SELECT COUNT(*) FROM dealer_pcc WHERE dealer_id = $1`,
      req.user!.dealerId ? [req.user!.dealerId] : []
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
});

// POST /api/v1/dealer-pcc
router.post('/', async (req: Request, res: Response, next) => {
  try {
    const { applicationDate, criteriaData } = req.body;

    if (!req.user!.dealerId) {
      return res.status(403).json({
        success: false,
        error: { code: 'FORBIDDEN', message: 'Only dealers can create PCC applications' },
      });
    }

    const applicationNumber = `PCC-${Date.now()}`;

    const result = await query(
      `INSERT INTO dealer_pcc 
       (dealer_id, submitted_by, application_number, application_date, criteria_data, status)
       VALUES ($1, $2, $3, $4, $5, 'draft')
       RETURNING *`,
      [req.user!.dealerId, req.user!.userId, applicationNumber, applicationDate, JSON.stringify(criteriaData)]
    );

    res.status(201).json({ success: true, data: result.rows[0] });
  } catch (error) {
    next(error);
  }
});

// GET /api/v1/dealer-pcc/dashboard/stats
router.get('/dashboard/stats', async (req: Request, res: Response, next) => {
  try {
    const dealerId = req.user!.dealerId;

    if (!dealerId) {
      // Manufacturer admin - get overall stats
      const result = await query(`
        SELECT 
          COUNT(*) as total,
          COUNT(CASE WHEN status = 'pending' THEN 1 END) as pending,
          COUNT(CASE WHEN status = 'approved' THEN 1 END) as approved,
          COUNT(CASE WHEN status = 'rejected' THEN 1 END) as rejected
        FROM dealer_pcc
      `);
      return res.json({ success: true, data: result.rows[0] });
    }

    // Dealer - get their stats
    const result = await query(
      `SELECT 
        COUNT(*) as total,
        COUNT(CASE WHEN status = 'pending' THEN 1 END) as pending,
        COUNT(CASE WHEN status = 'approved' THEN 1 END) as approved,
        COUNT(CASE WHEN status = 'rejected' THEN 1 END) as rejected
       FROM dealer_pcc
       WHERE dealer_id = $1`,
      [dealerId]
    );

    res.json({ success: true, data: result.rows[0] });
  } catch (error) {
    next(error);
  }
});

export default router;
