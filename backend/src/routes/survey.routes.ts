import { Router, Request, Response } from 'express';
import { authenticate } from '../middleware/auth.middleware';
import { query } from '../config/database';

const router = Router();
router.use(authenticate);

// Workshop Survey Routes
router.post('/workshop', async (req: Request, res: Response, next) => {
  try {
    const { surveyPeriod, responses } = req.body;

    if (!req.user!.dealerId) {
      return res.status(403).json({
        success: false,
        error: { code: 'FORBIDDEN', message: 'Only dealers can submit surveys' },
      });
    }

    const surveyNumber = `WS-${Date.now()}`;

    const result = await query(
      `INSERT INTO workshop_surveys 
       (dealer_id, submitted_by, survey_number, survey_period, submission_date, responses, status)
       VALUES ($1, $2, $3, $4, CURRENT_DATE, $5, 'submitted')
       RETURNING *`,
      [req.user!.dealerId, req.user!.userId, surveyNumber, surveyPeriod, JSON.stringify(responses)]
    );

    res.status(201).json({ success: true, data: result.rows[0] });
  } catch (error) {
    next(error);
  }
});

router.get('/workshop', async (req: Request, res: Response, next) => {
  try {
    const dealerId = req.user!.dealerId;
    const whereClause = dealerId ? 'WHERE dealer_id = $1' : '';
    const params = dealerId ? [dealerId] : [];

    const result = await query(
      `SELECT * FROM workshop_surveys ${whereClause} ORDER BY created_at DESC`,
      params
    );

    res.json({ success: true, data: result.rows });
  } catch (error) {
    next(error);
  }
});

// Warranty Survey Routes
router.post('/warranty', async (req: Request, res: Response, next) => {
  try {
    const { surveyPeriod, responses } = req.body;

    if (!req.user!.dealerId) {
      return res.status(403).json({
        success: false,
        error: { code: 'FORBIDDEN', message: 'Only dealers can submit surveys' },
      });
    }

    const surveyNumber = `WR-${Date.now()}`;

    const result = await query(
      `INSERT INTO warranty_surveys 
       (dealer_id, submitted_by, survey_number, survey_period, submission_date, responses, status)
       VALUES ($1, $2, $3, $4, CURRENT_DATE, $5, 'submitted')
       RETURNING *`,
      [req.user!.dealerId, req.user!.userId, surveyNumber, surveyPeriod, JSON.stringify(responses)]
    );

    res.status(201).json({ success: true, data: result.rows[0] });
  } catch (error) {
    next(error);
  }
});

router.get('/warranty', async (req: Request, res: Response, next) => {
  try {
    const dealerId = req.user!.dealerId;
    const whereClause = dealerId ? 'WHERE dealer_id = $1' : '';
    const params = dealerId ? [dealerId] : [];

    const result = await query(
      `SELECT * FROM warranty_surveys ${whereClause} ORDER BY created_at DESC`,
      params
    );

    res.json({ success: true, data: result.rows });
  } catch (error) {
    next(error);
  }
});

// Technical Survey Routes
router.post('/technical', async (req: Request, res: Response, next) => {
  try {
    const { surveyPeriod, responses } = req.body;

    if (!req.user!.dealerId) {
      return res.status(403).json({
        success: false,
        error: { code: 'FORBIDDEN', message: 'Only dealers can submit surveys' },
      });
    }

    const surveyNumber = `TS-${Date.now()}`;

    const result = await query(
      `INSERT INTO technical_surveys 
       (dealer_id, submitted_by, survey_number, survey_period, submission_date, responses, status)
       VALUES ($1, $2, $3, $4, CURRENT_DATE, $5, 'submitted')
       RETURNING *`,
      [req.user!.dealerId, req.user!.userId, surveyNumber, surveyPeriod, JSON.stringify(responses)]
    );

    res.status(201).json({ success: true, data: result.rows[0] });
  } catch (error) {
    next(error);
  }
});

router.get('/technical', async (req: Request, res: Response, next) => {
  try {
    const dealerId = req.user!.dealerId;
    const whereClause = dealerId ? 'WHERE dealer_id = $1' : '';
    const params = dealerId ? [dealerId] : [];

    const result = await query(
      `SELECT * FROM technical_surveys ${whereClause} ORDER BY created_at DESC`,
      params
    );

    res.json({ success: true, data: result.rows });
  } catch (error) {
    next(error);
  }
});

export default router;
