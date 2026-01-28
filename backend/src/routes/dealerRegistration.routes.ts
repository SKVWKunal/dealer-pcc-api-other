import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { query } from '../config/database';
import { AppError } from '../middleware/errorHandler';
import { authenticate, authorize } from '../middleware/auth.middleware';
import { hashPassword } from '../utils/auth';
import { logger } from '../utils/logger';

const router = Router();

// Validation schema for dealer registration request
const dealerRegistrationSchema = z.object({
  dealerCode: z.string().min(3, 'Dealer code must be at least 3 characters'),
  dealerName: z.string().min(3, 'Dealer name is required'),
  contactPersonName: z.string().min(2, 'Contact person name is required'),
  contactPersonEmail: z.string().email('Valid email is required'),
  contactPersonPhone: z.string().min(10, 'Valid phone number is required'),
  contactPersonDesignation: z.string().optional(),
  address: z.string().min(10, 'Address is required'),
  city: z.string().min(2, 'City is required'),
  state: z.string().min(2, 'State is required'),
  country: z.string().default('India'),
  postalCode: z.string().min(5, 'Postal code is required'),
  phone: z.string().min(10, 'Dealership phone is required'),
  email: z.string().email('Valid dealership email is required'),
  brand: z.enum(['Volkswagen', 'Skoda', 'Both']),
  businessRegistrationNumber: z.string().optional(),
  gstNumber: z.string().optional(),
  panNumber: z.string().optional(),
  requestedModules: z.array(z.string()).default([]),
  additionalInfo: z.string().optional(),
});

// POST /api/v1/dealer-registration/request - Submit new dealer registration request (Public)
router.post('/request', async (req: Request, res: Response, next) => {
  try {
    const requestData = dealerRegistrationSchema.parse(req.body);

    // Check if dealer code already exists
    const existingDealer = await query(
      'SELECT id FROM dealers WHERE dealer_code = $1',
      [requestData.dealerCode]
    );

    if (existingDealer.rows.length > 0) {
      throw new AppError('Dealer code already exists', 400, 'DEALER_EXISTS');
    }

    // Check if there's a pending request with same dealer code or email
    const existingRequest = await query(
      `SELECT id, status FROM dealer_registration_requests 
       WHERE (dealer_code = $1 OR contact_person_email = $2) 
       AND status IN ('pending', 'under_review')`,
      [requestData.dealerCode, requestData.contactPersonEmail]
    );

    if (existingRequest.rows.length > 0) {
      throw new AppError(
        'A registration request with this dealer code or email is already pending',
        400,
        'REQUEST_PENDING'
      );
    }

    // Create registration request
    const result = await query(
      `INSERT INTO dealer_registration_requests (
        dealer_code, dealer_name, contact_person_name, contact_person_email,
        contact_person_phone, contact_person_designation, address, city, state,
        country, postal_code, phone, email, brand, business_registration_number,
        gst_number, pan_number, requested_modules, additional_info, status
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, 'pending')
      RETURNING id, dealer_code, status, created_at`,
      [
        requestData.dealerCode,
        requestData.dealerName,
        requestData.contactPersonName,
        requestData.contactPersonEmail,
        requestData.contactPersonPhone,
        requestData.contactPersonDesignation || null,
        requestData.address,
        requestData.city,
        requestData.state,
        requestData.country,
        requestData.postalCode,
        requestData.phone,
        requestData.email,
        requestData.brand,
        requestData.businessRegistrationNumber || null,
        requestData.gstNumber || null,
        requestData.panNumber || null,
        requestData.requestedModules,
        requestData.additionalInfo || null,
      ]
    );

    // Log the action
    await query(
      `INSERT INTO dealer_registration_audit_log (
        request_id, action, new_status, ip_address, user_agent
      ) VALUES ($1, 'created', 'pending', $2, $3)`,
      [result.rows[0].id, req.ip, req.headers['user-agent'] || '']
    );

    logger.info(`New dealer registration request created: ${result.rows[0].dealer_code}`);

    res.status(201).json({
      success: true,
      message: 'Registration request submitted successfully. You will be notified once reviewed.',
      data: result.rows[0],
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/v1/dealer-registration/requests - Get all registration requests (Admin only)
router.get('/requests', authenticate, authorize(['super_admin', 'manufacturer_admin']), async (req: Request, res: Response, next) => {
  try {
    const { status, page = '1', limit = '20' } = req.query;
    const offset = (parseInt(page as string) - 1) * parseInt(limit as string);

    let queryText = `
      SELECT 
        r.*,
        rv.name as reviewed_by_name,
        ap.name as approved_by_name
      FROM dealer_registration_requests r
      LEFT JOIN users rv ON r.reviewed_by = rv.id
      LEFT JOIN users ap ON r.approved_by = ap.id
    `;

    const params: any[] = [];
    if (status) {
      queryText += ` WHERE r.status = $1`;
      params.push(status);
    }

    queryText += ` ORDER BY r.created_at DESC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
    params.push(parseInt(limit as string), offset);

    const result = await query(queryText, params);

    // Get total count
    let countQuery = 'SELECT COUNT(*) FROM dealer_registration_requests';
    const countParams: any[] = [];
    if (status) {
      countQuery += ' WHERE status = $1';
      countParams.push(status);
    }
    const countResult = await query(countQuery, countParams);
    const total = parseInt(countResult.rows[0].count);

    res.json({
      success: true,
      data: {
        requests: result.rows,
        pagination: {
          page: parseInt(page as string),
          limit: parseInt(limit as string),
          total,
          totalPages: Math.ceil(total / parseInt(limit as string)),
        },
      },
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/v1/dealer-registration/requests/:id - Get specific request details (Admin only)
router.get('/requests/:id', authenticate, authorize(['super_admin', 'manufacturer_admin']), async (req: Request, res: Response, next) => {
  try {
    const { id } = req.params;

    const result = await query(
      `SELECT 
        r.*,
        rv.name as reviewed_by_name,
        ap.name as approved_by_name
      FROM dealer_registration_requests r
      LEFT JOIN users rv ON r.reviewed_by = rv.id
      LEFT JOIN users ap ON r.approved_by = ap.id
      WHERE r.id = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      throw new AppError('Registration request not found', 404, 'NOT_FOUND');
    }

    // Get audit log
    const auditLog = await query(
      `SELECT 
        a.*,
        u.name as performed_by_name
      FROM dealer_registration_audit_log a
      LEFT JOIN users u ON a.performed_by = u.id
      WHERE a.request_id = $1
      ORDER BY a.created_at DESC`,
      [id]
    );

    res.json({
      success: true,
      data: {
        request: result.rows[0],
        auditLog: auditLog.rows,
      },
    });
  } catch (error) {
    next(error);
  }
});

// PUT /api/v1/dealer-registration/requests/:id/review - Update request status (Admin only)
router.put('/requests/:id/review', authenticate, authorize(['super_admin', 'manufacturer_admin']), async (req: Request, res: Response, next) => {
  try {
    const { id } = req.params;
    const { status, comments } = z.object({
      status: z.enum(['under_review', 'more_info_required']),
      comments: z.string().optional(),
    }).parse(req.body);

    const user = (req as any).user;

    // Get current request
    const currentRequest = await query(
      'SELECT status FROM dealer_registration_requests WHERE id = $1',
      [id]
    );

    if (currentRequest.rows.length === 0) {
      throw new AppError('Registration request not found', 404, 'NOT_FOUND');
    }

    const previousStatus = currentRequest.rows[0].status;

    // Update request
    await query(
      `UPDATE dealer_registration_requests 
       SET status = $1, reviewed_by = $2, reviewed_at = NOW(), review_comments = $3
       WHERE id = $4`,
      [status, user.userId, comments || null, id]
    );

    // Log the action
    await query(
      `INSERT INTO dealer_registration_audit_log (
        request_id, action, performed_by, previous_status, new_status, comments, ip_address, user_agent
      ) VALUES ($1, 'reviewed', $2, $3, $4, $5, $6, $7)`,
      [id, user.userId, previousStatus, status, comments || null, req.ip, req.headers['user-agent'] || '']
    );

    logger.info(`Dealer registration request ${id} reviewed by ${user.email}: ${status}`);

    res.json({
      success: true,
      message: `Request marked as ${status}`,
    });
  } catch (error) {
    next(error);
  }
});

// POST /api/v1/dealer-registration/requests/:id/approve - Approve and create dealer account (Admin only)
router.post('/requests/:id/approve', authenticate, authorize(['super_admin', 'manufacturer_admin']), async (req: Request, res: Response, next) => {
  try {
    const { id } = req.params;
    const { modules, comments, defaultPassword } = z.object({
      modules: z.array(z.string()).min(1, 'At least one module must be assigned'),
      comments: z.string().optional(),
      defaultPassword: z.string().min(8, 'Password must be at least 8 characters'),
    }).parse(req.body);

    const user = (req as any).user;

    // Get registration request
    const requestResult = await query(
      'SELECT * FROM dealer_registration_requests WHERE id = $1',
      [id]
    );

    if (requestResult.rows.length === 0) {
      throw new AppError('Registration request not found', 404, 'NOT_FOUND');
    }

    const request = requestResult.rows[0];

    if (request.status === 'approved') {
      throw new AppError('Request already approved', 400, 'ALREADY_APPROVED');
    }

    // Start transaction
    await query('BEGIN');

    try {
      // Create dealer
      const dealerResult = await query(
        `INSERT INTO dealers (
          dealer_code, dealer_name, address, city, state, country, postal_code, phone, email, brand, status
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, 'active')
        RETURNING id`,
        [
          request.dealer_code,
          request.dealer_name,
          request.address,
          request.city,
          request.state,
          request.country,
          request.postal_code,
          request.phone,
          request.email,
          request.brand,
        ]
      );

      const dealerId = dealerResult.rows[0].id;

      // Create user account
      const hashedPassword = await hashPassword(defaultPassword);
      const userResult = await query(
        `INSERT INTO users (
          email, password_hash, name, role, user_type, dealer_id, designation, is_active, created_by
        ) VALUES ($1, $2, $3, 'service_manager', 'dealer', $4, $5, true, $6)
        RETURNING id`,
        [
          request.contact_person_email,
          hashedPassword,
          request.contact_person_name,
          dealerId,
          request.contact_person_designation || 'Service Manager',
          user.userId,
        ]
      );

      const userId = userResult.rows[0].id;

      // Assign modules
      for (const module of modules) {
        await query(
          `INSERT INTO module_access (user_id, module, can_view, can_create, can_edit, granted_by)
           VALUES ($1, $2, true, true, true, $3)`,
          [userId, module, user.userId]
        );
      }

      // Update registration request
      await query(
        `UPDATE dealer_registration_requests 
         SET status = 'approved', approved_by = $1, approved_at = NOW(), 
             dealer_id = $2, user_id = $3, review_comments = $4
         WHERE id = $5`,
        [user.userId, dealerId, userId, comments || null, id]
      );

      // Log the action
      await query(
        `INSERT INTO dealer_registration_audit_log (
          request_id, action, performed_by, previous_status, new_status, comments, ip_address, user_agent
        ) VALUES ($1, 'approved', $2, $3, 'approved', $4, $5, $6)`,
        [id, user.userId, request.status, comments || null, req.ip, req.headers['user-agent'] || '']
      );

      await query('COMMIT');

      logger.info(`Dealer registration approved: ${request.dealer_code} by ${user.email}`);

      res.json({
        success: true,
        message: 'Dealer registration approved and account created successfully',
        data: {
          dealerId,
          userId,
          dealerCode: request.dealer_code,
          email: request.contact_person_email,
        },
      });
    } catch (error) {
      await query('ROLLBACK');
      throw error;
    }
  } catch (error) {
    next(error);
  }
});

// POST /api/v1/dealer-registration/requests/:id/reject - Reject registration request (Admin only)
router.post('/requests/:id/reject', authenticate, authorize(['super_admin', 'manufacturer_admin']), async (req: Request, res: Response, next) => {
  try {
    const { id } = req.params;
    const { reason } = z.object({
      reason: z.string().min(10, 'Rejection reason is required'),
    }).parse(req.body);

    const user = (req as any).user;

    // Get current request
    const currentRequest = await query(
      'SELECT status FROM dealer_registration_requests WHERE id = $1',
      [id]
    );

    if (currentRequest.rows.length === 0) {
      throw new AppError('Registration request not found', 404, 'NOT_FOUND');
    }

    const previousStatus = currentRequest.rows[0].status;

    // Update request
    await query(
      `UPDATE dealer_registration_requests 
       SET status = 'rejected', reviewed_by = $1, reviewed_at = NOW(), rejection_reason = $2
       WHERE id = $3`,
      [user.userId, reason, id]
    );

    // Log the action
    await query(
      `INSERT INTO dealer_registration_audit_log (
        request_id, action, performed_by, previous_status, new_status, comments, ip_address, user_agent
      ) VALUES ($1, 'rejected', $2, $3, 'rejected', $4, $5, $6)`,
      [id, user.userId, previousStatus, reason, req.ip, req.headers['user-agent'] || '']
    );

    logger.info(`Dealer registration request ${id} rejected by ${user.email}`);

    res.json({
      success: true,
      message: 'Registration request rejected',
    });
  } catch (error) {
    next(error);
  }
});

export default router;
