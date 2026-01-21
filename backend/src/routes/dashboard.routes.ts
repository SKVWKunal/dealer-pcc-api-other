import { Router, Request, Response } from 'express';
import { authenticate } from '../middleware/auth.middleware';
import { query } from '../config/database';

const router = Router();
router.use(authenticate);

// GET /api/v1/dashboard/summary
router.get('/summary', async (req: Request, res: Response, next) => {
  try {
    const dealerId = req.user!.dealerId;

    if (dealerId) {
      // Dealer dashboard
      const [pcc, api, mt, workshop, warranty, technical] = await Promise.all([
        query('SELECT COUNT(*) as total, COUNT(CASE WHEN status = \'approved\' THEN 1 END) as approved FROM dealer_pcc WHERE dealer_id = $1', [dealerId]),
        query('SELECT COUNT(*) as total FROM api_registrations WHERE dealer_id = $1', [dealerId]),
        query('SELECT COUNT(*) as total FROM mt_meet_registrations WHERE dealer_id = $1', [dealerId]),
        query('SELECT COUNT(*) as total FROM workshop_surveys WHERE dealer_id = $1', [dealerId]),
        query('SELECT COUNT(*) as total FROM warranty_surveys WHERE dealer_id = $1', [dealerId]),
        query('SELECT COUNT(*) as total FROM technical_surveys WHERE dealer_id = $1', [dealerId]),
      ]);

      return res.json({
        success: true,
        data: {
          dealerPCC: pcc.rows[0],
          apiRegistrations: api.rows[0],
          mtMeet: mt.rows[0],
          surveys: {
            workshop: workshop.rows[0],
            warranty: warranty.rows[0],
            technical: technical.rows[0],
          },
        },
      });
    }

    // Manufacturer dashboard
    const [pcc, api, mt, workshop, warranty, technical] = await Promise.all([
      query('SELECT COUNT(*) as total, COUNT(CASE WHEN status = \'pending\' THEN 1 END) as pending, COUNT(CASE WHEN status = \'approved\' THEN 1 END) as approved FROM dealer_pcc'),
      query('SELECT COUNT(*) as total FROM api_registrations'),
      query('SELECT COUNT(*) as total FROM mt_meet_registrations'),
      query('SELECT COUNT(*) as total FROM workshop_surveys'),
      query('SELECT COUNT(*) as total FROM warranty_surveys'),
      query('SELECT COUNT(*) as total FROM technical_surveys'),
    ]);

    res.json({
      success: true,
      data: {
        dealerPCC: pcc.rows[0],
        apiRegistrations: api.rows[0],
        mtMeet: mt.rows[0],
        surveys: {
          workshop: workshop.rows[0],
          warranty: warranty.rows[0],
          technical: technical.rows[0],
        },
      },
    });
  } catch (error) {
    next(error);
  }
});

export default router;
