import { Router, Request, Response } from 'express';
import { authenticate, authorizeModule } from '../middleware/auth.middleware';
import { query } from '../config/database';

const router = Router();
router.use(authenticate);
router.use(authorizeModule('api_registration'));

// GET /api/v1/api-registration
router.get('/', async (req: Request, res: Response, next) => {
  try {
    const { page = '1', limit = '20', status, dealerId } = req.query;
    const offset = (parseInt(page as string) - 1) * parseInt(limit as string);

    let queryText = `
      SELECT r.*, d.dealer_name, d.dealer_code
      FROM api_registrations r
      JOIN dealers d ON r.dealer_id = d.id
      WHERE 1=1
    `;
    const params: any[] = [];
    let paramCount = 1;

    if (req.user!.dealerId) {
      queryText += ` AND r.dealer_id = $${paramCount++}`;
      params.push(req.user!.dealerId);
    } else if (dealerId) {
      queryText += ` AND r.dealer_id = $${paramCount++}`;
      params.push(dealerId);
    }

    if (status) {
      queryText += ` AND r.status = $${paramCount++}`;
      params.push(status);
    }

    queryText += ` ORDER BY r.created_at DESC LIMIT $${paramCount++} OFFSET $${paramCount}`;
    params.push(limit, offset);

    const result = await query(queryText, params);
    res.json({ success: true, data: result.rows });
  } catch (error) {
    next(error);
  }
});

// POST /api/v1/api-registration
router.post('/', async (req: Request, res: Response, next) => {
  try {
    const { employeeName, employeeEmail, employeePhone, employeeDesignation, eventName, eventDate, eventLocation, criteriaData } = req.body;

    if (!req.user!.dealerId) {
      return res.status(403).json({
        success: false,
        error: { code: 'FORBIDDEN', message: 'Only dealers can create registrations' },
      });
    }

    const registrationNumber = `API-${Date.now()}`;

    const result = await query(
      `INSERT INTO api_registrations 
       (dealer_id, registered_by, registration_number, employee_name, employee_email, employee_phone, 
        employee_designation, event_name, event_date, event_location, criteria_data, status)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, 'registered')
       RETURNING *`,
      [req.user!.dealerId, req.user!.userId, registrationNumber, employeeName, employeeEmail, employeePhone,
       employeeDesignation, eventName, eventDate, eventLocation, JSON.stringify(criteriaData)]
    );

    res.status(201).json({ success: true, data: result.rows[0] });
  } catch (error) {
    next(error);
  }
});

// GET /api/v1/api-registration/dashboard/stats
router.get('/dashboard/stats', async (req: Request, res: Response, next) => {
  try {
    const dealerId = req.user!.dealerId;
    const whereClause = dealerId ? 'WHERE dealer_id = $1' : '';
    const params = dealerId ? [dealerId] : [];

    const result = await query(
      `SELECT 
        COUNT(*) as total,
        COUNT(CASE WHEN status = 'registered' THEN 1 END) as registered,
        COUNT(CASE WHEN status = 'confirmed' THEN 1 END) as confirmed,
        COUNT(CASE WHEN status = 'attended' THEN 1 END) as attended
       FROM api_registrations ${whereClause}`,
      params
    );

    res.json({ success: true, data: result.rows[0] });
  } catch (error) {
    next(error);
  }
});

export default router;
