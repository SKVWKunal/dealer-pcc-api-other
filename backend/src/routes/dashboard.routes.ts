import { Router, Request, Response } from 'express';
import { authenticate, authorize } from '../middleware/auth.middleware';
import { query } from '../config/database';
import { AppError } from '../middleware/errorHandler';

const router = Router();
router.use(authenticate);

// GET /api/v1/dashboard/dealer - Dealer Dashboard with individual KPIs
router.get('/dealer', async (req: Request, res: Response, next) => {
  try {
    const user = (req as any).user;
    const dealerId = user.dealerId;

    if (!dealerId) {
      throw new AppError('Dealer ID not found', 400, 'NO_DEALER_ID');
    }

    // Get dealer info
    const dealerInfo = await query(
      'SELECT dealer_code, dealer_name, brand, city, state FROM dealers WHERE id = $1',
      [dealerId]
    );

    // PCC KPIs
    const pccStats = await query(
      `SELECT 
        COUNT(*) as total,
        COUNT(CASE WHEN status = 'pending' THEN 1 END) as pending,
        COUNT(CASE WHEN status = 'under_review' THEN 1 END) as under_review,
        COUNT(CASE WHEN status = 'approved' THEN 1 END) as approved,
        COUNT(CASE WHEN status = 'rejected' THEN 1 END) as rejected,
        COALESCE(AVG(CASE WHEN status = 'approved' THEN 
          EXTRACT(DAY FROM approved_at - created_at) END), 0) as avg_approval_days
      FROM dealer_pcc WHERE dealer_id = $1`,
      [dealerId]
    );

    // API Registration KPIs
    const apiStats = await query(
      `SELECT 
        COUNT(*) as total,
        COUNT(CASE WHEN status = 'registered' THEN 1 END) as registered,
        COUNT(CASE WHEN status = 'confirmed' THEN 1 END) as confirmed,
        COUNT(CASE WHEN status = 'attended' THEN 1 END) as attended,
        COUNT(CASE WHEN status = 'cancelled' THEN 1 END) as cancelled
      FROM api_registrations WHERE dealer_id = $1`,
      [dealerId]
    );

    // MT Meet KPIs
    const mtMeetStats = await query(
      `SELECT 
        COUNT(*) as total,
        COUNT(CASE WHEN status = 'registered' THEN 1 END) as registered,
        COUNT(CASE WHEN status = 'confirmed' THEN 1 END) as confirmed,
        COUNT(CASE WHEN status = 'attended' THEN 1 END) as attended,
        COUNT(DISTINCT technician_email) as unique_technicians
      FROM mt_meet_registrations WHERE dealer_id = $1`,
      [dealerId]
    );

    // Survey KPIs
    const surveyStats = await query(
      `SELECT 
        (SELECT COUNT(*) FROM workshop_surveys WHERE dealer_id = $1) as workshop_total,
        (SELECT COUNT(*) FROM warranty_surveys WHERE dealer_id = $1) as warranty_total,
        (SELECT COUNT(*) FROM technical_surveys WHERE dealer_id = $1) as technical_total,
        (SELECT AVG(overall_score) FROM workshop_surveys WHERE dealer_id = $1) as workshop_avg_score,
        (SELECT AVG(overall_score) FROM warranty_surveys WHERE dealer_id = $1) as warranty_avg_score,
        (SELECT AVG(overall_score) FROM technical_surveys WHERE dealer_id = $1) as technical_avg_score
      `,
      [dealerId]
    );

    // Recent activities
    const recentActivities = await query(
      `(SELECT 'PCC' as type, application_number as reference, status, created_at 
        FROM dealer_pcc WHERE dealer_id = $1 ORDER BY created_at DESC LIMIT 5)
       UNION ALL
       (SELECT 'API' as type, registration_number as reference, status, created_at 
        FROM api_registrations WHERE dealer_id = $1 ORDER BY created_at DESC LIMIT 5)
       UNION ALL
       (SELECT 'MT Meet' as type, registration_number as reference, status, created_at 
        FROM mt_meet_registrations WHERE dealer_id = $1 ORDER BY created_at DESC LIMIT 5)
       ORDER BY created_at DESC LIMIT 10`,
      [dealerId, dealerId, dealerId]
    );

    // Monthly trend (last 6 months)
    const monthlyTrend = await query(
      `SELECT 
        TO_CHAR(date_trunc('month', created_at), 'YYYY-MM') as month,
        COUNT(CASE WHEN EXISTS(SELECT 1 FROM dealer_pcc dp WHERE dp.dealer_id = $1 AND date_trunc('month', dp.created_at) = date_trunc('month', created_at)) THEN 1 END) as pcc_count,
        COUNT(CASE WHEN EXISTS(SELECT 1 FROM api_registrations ar WHERE ar.dealer_id = $1 AND date_trunc('month', ar.created_at) = date_trunc('month', created_at)) THEN 1 END) as api_count,
        COUNT(CASE WHEN EXISTS(SELECT 1 FROM mt_meet_registrations mr WHERE mr.dealer_id = $1 AND date_trunc('month', mr.created_at) = date_trunc('month', created_at)) THEN 1 END) as mt_count
      FROM generate_series(
        date_trunc('month', NOW() - INTERVAL '5 months'),
        date_trunc('month', NOW()),
        '1 month'::interval
      ) created_at
      GROUP BY month
      ORDER BY month`,
      [dealerId, dealerId, dealerId]
    );

    res.json({
      success: true,
      data: {
        dealer: dealerInfo.rows[0],
        kpis: {
          pcc: pccStats.rows[0],
          apiRegistrations: apiStats.rows[0],
          mtMeet: mtMeetStats.rows[0],
          surveys: surveyStats.rows[0],
        },
        recentActivities: recentActivities.rows,
        monthlyTrend: monthlyTrend.rows,
      },
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/v1/dashboard/manufacturer - Manufacturer Dashboard with all dealers KPIs
router.get('/manufacturer', authorize(['super_admin', 'manufacturer_admin']), async (req: Request, res: Response, next) => {
  try {
    // Overall statistics
    const overallStats = await query(
      `SELECT 
        (SELECT COUNT(*) FROM dealers WHERE status = 'active') as active_dealers,
        (SELECT COUNT(*) FROM dealers) as total_dealers,
        (SELECT COUNT(*) FROM users WHERE user_type = 'dealer') as total_dealer_users,
        (SELECT COUNT(*) FROM dealer_pcc WHERE status = 'pending') as pending_pcc_approvals,
        (SELECT COUNT(*) FROM dealer_registration_requests WHERE status = 'pending') as pending_registrations
      `
    );

    // PCC Statistics by dealer
    const pccByDealer = await query(
      `SELECT 
        d.id,
        d.dealer_code,
        d.dealer_name,
        d.brand,
        d.city,
        COUNT(dp.id) as total_submissions,
        COUNT(CASE WHEN dp.status = 'approved' THEN 1 END) as approved,
        COUNT(CASE WHEN dp.status = 'pending' THEN 1 END) as pending,
        COUNT(CASE WHEN dp.status = 'rejected' THEN 1 END) as rejected,
        MAX(dp.created_at) as last_submission
      FROM dealers d
      LEFT JOIN dealer_pcc dp ON d.id = dp.dealer_id
      WHERE d.status = 'active'
      GROUP BY d.id, d.dealer_code, d.dealer_name, d.brand, d.city
      ORDER BY total_submissions DESC
      LIMIT 20`
    );

    // API Registration Statistics by dealer
    const apiByDealer = await query(
      `SELECT 
        d.id,
        d.dealer_code,
        d.dealer_name,
        COUNT(ar.id) as total_registrations,
        COUNT(CASE WHEN ar.status = 'attended' THEN 1 END) as attended
      FROM dealers d
      LEFT JOIN api_registrations ar ON d.id = ar.dealer_id
      WHERE d.status = 'active'
      GROUP BY d.id, d.dealer_code, d.dealer_name
      ORDER BY total_registrations DESC
      LIMIT 20`
    );

    // MT Meet Statistics by dealer
    const mtByDealer = await query(
      `SELECT 
        d.id,
        d.dealer_code,
        d.dealer_name,
        COUNT(mr.id) as total_registrations,
        COUNT(CASE WHEN mr.status = 'attended' THEN 1 END) as attended,
        COUNT(DISTINCT mr.technician_email) as unique_technicians
      FROM dealers d
      LEFT JOIN mt_meet_registrations mr ON d.id = mr.dealer_id
      WHERE d.status = 'active'
      GROUP BY d.id, d.dealer_code, d.dealer_name
      ORDER BY total_registrations DESC
      LIMIT 20`
    );

    // Survey Completion by dealer
    const surveyByDealer = await query(
      `SELECT 
        d.id,
        d.dealer_code,
        d.dealer_name,
        d.brand,
        COUNT(ws.id) as workshop_surveys,
        COUNT(war.id) as warranty_surveys,
        COUNT(ts.id) as technical_surveys,
        AVG(ws.overall_score) as workshop_avg_score,
        AVG(war.overall_score) as warranty_avg_score,
        AVG(ts.overall_score) as technical_avg_score
      FROM dealers d
      LEFT JOIN workshop_surveys ws ON d.id = ws.dealer_id
      LEFT JOIN warranty_surveys war ON d.id = war.dealer_id
      LEFT JOIN technical_surveys ts ON d.id = ts.dealer_id
      WHERE d.status = 'active'
      GROUP BY d.id, d.dealer_code, d.dealer_name, d.brand
      ORDER BY (workshop_surveys + warranty_surveys + technical_surveys) DESC
      LIMIT 20`
    );

    // Brand-wise statistics
    const brandStats = await query(
      `SELECT 
        brand,
        COUNT(DISTINCT d.id) as dealer_count,
        COUNT(dp.id) as total_pcc,
        COUNT(ar.id) as total_api,
        COUNT(mr.id) as total_mt
      FROM dealers d
      LEFT JOIN dealer_pcc dp ON d.id = dp.dealer_id
      LEFT JOIN api_registrations ar ON d.id = ar.dealer_id
      LEFT JOIN mt_meet_registrations mr ON d.id = mr.dealer_id
      WHERE d.status = 'active'
      GROUP BY brand`
    );

    // Regional statistics
    const regionalStats = await query(
      `SELECT 
        state,
        COUNT(DISTINCT d.id) as dealer_count,
        COUNT(dp.id) as total_pcc,
        COUNT(ar.id) as total_api,
        COUNT(mr.id) as total_mt
      FROM dealers d
      LEFT JOIN dealer_pcc dp ON d.id = dp.dealer_id
      LEFT JOIN api_registrations ar ON d.id = ar.dealer_id
      LEFT JOIN mt_meet_registrations mr ON d.id = mr.dealer_id
      WHERE d.status = 'active'
      GROUP BY state
      ORDER BY dealer_count DESC
      LIMIT 10`
    );

    // Monthly trend across all dealers
    const monthlyTrend = await query(
      `SELECT 
        TO_CHAR(month_date, 'YYYY-MM') as month,
        COALESCE(pcc.count, 0) as pcc_submissions,
        COALESCE(api.count, 0) as api_registrations,
        COALESCE(mt.count, 0) as mt_registrations,
        COALESCE(surveys.count, 0) as survey_submissions
      FROM generate_series(
        date_trunc('month', NOW() - INTERVAL '11 months'),
        date_trunc('month', NOW()),
        '1 month'::interval
      ) month_date
      LEFT JOIN (
        SELECT date_trunc('month', created_at) as month, COUNT(*) as count 
        FROM dealer_pcc GROUP BY month
      ) pcc ON date_trunc('month', month_date) = pcc.month
      LEFT JOIN (
        SELECT date_trunc('month', created_at) as month, COUNT(*) as count 
        FROM api_registrations GROUP BY month
      ) api ON date_trunc('month', month_date) = api.month
      LEFT JOIN (
        SELECT date_trunc('month', created_at) as month, COUNT(*) as count 
        FROM mt_meet_registrations GROUP BY month
      ) mt ON date_trunc('month', month_date) = mt.month
      LEFT JOIN (
        SELECT date_trunc('month', created_at) as month, COUNT(*) as count 
        FROM (
          SELECT created_at FROM workshop_surveys
          UNION ALL SELECT created_at FROM warranty_surveys
          UNION ALL SELECT created_at FROM technical_surveys
        ) all_surveys GROUP BY month
      ) surveys ON date_trunc('month', month_date) = surveys.month
      ORDER BY month`
    );

    // Top performing dealers (by overall activity)
    const topDealers = await query(
      `SELECT 
        d.dealer_code,
        d.dealer_name,
        d.brand,
        d.city,
        COUNT(DISTINCT dp.id) + COUNT(DISTINCT ar.id) + COUNT(DISTINCT mr.id) + 
        COUNT(DISTINCT ws.id) + COUNT(DISTINCT war.id) + COUNT(DISTINCT ts.id) as total_activity
      FROM dealers d
      LEFT JOIN dealer_pcc dp ON d.id = dp.dealer_id
      LEFT JOIN api_registrations ar ON d.id = ar.dealer_id
      LEFT JOIN mt_meet_registrations mr ON d.id = mr.dealer_id
      LEFT JOIN workshop_surveys ws ON d.id = ws.dealer_id
      LEFT JOIN warranty_surveys war ON d.id = war.dealer_id
      LEFT JOIN technical_surveys ts ON d.id = ts.dealer_id
      WHERE d.status = 'active'
      GROUP BY d.id, d.dealer_code, d.dealer_name, d.brand, d.city
      HAVING COUNT(DISTINCT dp.id) + COUNT(DISTINCT ar.id) + COUNT(DISTINCT mr.id) + 
             COUNT(DISTINCT ws.id) + COUNT(DISTINCT war.id) + COUNT(DISTINCT ts.id) > 0
      ORDER BY total_activity DESC
      LIMIT 10`
    );

    res.json({
      success: true,
      data: {
        overall: overallStats.rows[0],
        pccByDealer: pccByDealer.rows,
        apiByDealer: apiByDealer.rows,
        mtByDealer: mtByDealer.rows,
        surveyByDealer: surveyByDealer.rows,
        brandStats: brandStats.rows,
        regionalStats: regionalStats.rows,
        monthlyTrend: monthlyTrend.rows,
        topDealers: topDealers.rows,
      },
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/v1/dashboard/summary (Legacy endpoint - redirects based on user type)
router.get('/summary', async (req: Request, res: Response, next) => {
  try {
    const user = (req as any).user;
    
    if (user.dealerId) {
      // Redirect to dealer dashboard
      return res.redirect(307, '/api/v1/dashboard/dealer');
    } else {
      // Redirect to manufacturer dashboard  
      return res.redirect(307, '/api/v1/dashboard/manufacturer');
    }
  } catch (error) {
    next(error);
  }
});

export default router;
