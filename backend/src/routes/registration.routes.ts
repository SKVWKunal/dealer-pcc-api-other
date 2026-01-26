import { Router, Request, Response } from 'express';
import { z } from 'zod';
import bcrypt from 'bcryptjs';
import { query } from '../config/database';
import { AppError } from '../middleware/errorHandler';
import { authenticate } from '../middleware/auth.middleware';
import {
  authorizeManufacturerAdmin,
  checkApprovalStatus,
} from '../middleware/rbac.middleware';
import { logger } from '../utils/logger';
import { ROLES, APPROVAL_STATUS } from '../config/rbac.config';

const router = Router();

// ============================================================================
// DEALER REGISTRATION APIs (Public - No auth required)
// ============================================================================

/**
 * POST /api/v1/auth/dealer/register
 * Generic dealer user registration with role selection
 */
const registrationSchema = z.object({
  dealerCode: z.string().min(3, 'Dealer code is required'),
  dealerName: z.string().min(2, 'Dealer name is required'),
  userName: z.string().min(2, 'User name is required'),
  email: z.string().email('Invalid email format'),
  mobileNumber: z.string().regex(/^\d{10}$/, 'Mobile number must be 10 digits'),
  selectedRole: z.enum([
    ROLES.DEALER_GM,
    ROLES.SERVICE_HEAD,
    ROLES.SERVICE_MANAGER,
    ROLES.MASTER_TECHNICIAN,
    ROLES.WARRANTY_MANAGER,
  ]),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  additionalInfo: z.record(z.any()).optional(),
});

router.post('/dealer/register', async (req: Request, res: Response, next) => {
  try {
    const validatedData = registrationSchema.parse(req.body);

    // Check if email already exists
    const existingUser = await query(
      'SELECT id FROM users WHERE email = $1',
      [validatedData.email]
    );

    if (existingUser.rows.length > 0) {
      throw new AppError('Email already registered', 409, 'EMAIL_EXISTS');
    }

    // Check if registration request already exists
    const existingRequest = await query(
      'SELECT id FROM dealer_registration_requests WHERE email = $1 AND status != $2',
      [validatedData.email, APPROVAL_STATUS.REJECTED]
    );

    if (existingRequest.rows.length > 0) {
      throw new AppError(
        'Registration request already submitted',
        409,
        'REG_REQUEST_EXISTS'
      );
    }

    // Create registration request (status: pending)
    const registrationResult = await query(
      `INSERT INTO dealer_registration_requests 
       (dealer_code, dealer_name, brand, user_name, email, mobile_number, requested_role, additional_info, status)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
       RETURNING id, status, submission_date`,
      [
        validatedData.dealerCode,
        validatedData.dealerName,
        'Volkswagen', // Default brand, can be extended
        validatedData.userName,
        validatedData.email,
        validatedData.mobileNumber,
        validatedData.selectedRole,
        JSON.stringify(validatedData.additionalInfo || {}),
        APPROVAL_STATUS.PENDING,
      ]
    );

    const registrationRequest = registrationResult.rows[0];

    // Log the registration request
    logger.info(
      `Dealer registration request created - Email: ${validatedData.email}, Role: ${validatedData.selectedRole}`
    );

    res.status(201).json({
      success: true,
      message: 'Registration request submitted successfully',
      data: {
        registrationId: registrationRequest.id,
        status: registrationRequest.status,
        submissionDate: registrationRequest.submission_date,
        message:
          'Your registration is pending manufacturer approval. You will be able to login once approved.',
      },
    });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/v1/auth/dealer/registration-status/:email
 * Check registration and approval status
 */
router.get(
  '/dealer/registration-status/:email',
  async (req: Request, res: Response, next) => {
    try {
      const { email } = req.params;

      // Check if user exists
      const userResult = await query(
        `SELECT u.id, u.is_active, uas.status as approval_status, uas.rejection_reason
         FROM users u
         LEFT JOIN user_approval_status uas ON u.id = uas.user_id
         WHERE u.email = $1`,
        [email]
      );

      if (userResult.rows.length === 0) {
        // Check registration request
        const regRequest = await query(
          `SELECT id, status, rejection_reason FROM dealer_registration_requests WHERE email = $1`,
          [email]
        );

        if (regRequest.rows.length === 0) {
          throw new AppError('No registration found', 404, 'REG_NOT_FOUND');
        }

        const request = regRequest.rows[0];
        return res.json({
          success: true,
          data: {
            stage: 'registration',
            status: request.status,
            rejectionReason: request.rejection_reason,
            canLogin: false,
          },
        });
      }

      const user = userResult.rows[0];
      return res.json({
        success: true,
        data: {
          stage: 'user',
          approvalStatus: user.approval_status || APPROVAL_STATUS.PENDING,
          rejectionReason: user.rejection_reason,
          isActive: user.is_active,
          canLogin: user.is_active && user.approval_status === APPROVAL_STATUS.APPROVED,
        },
      });
    } catch (error) {
      next(error);
    }
  }
);

// ============================================================================
// MANUFACTURER/ADMIN APPROVAL WORKFLOW APIs
// ============================================================================

/**
 * GET /api/v1/admin/registrations/pending
 * Get all pending registration requests
 */
router.get(
  '/admin/registrations/pending',
  authenticate,
  authorizeManufacturerAdmin,
  async (req: Request, res: Response, next) => {
    try {
      const { page = '1', limit = '10' } = req.query;
      const offset = (parseInt(page as string) - 1) * parseInt(limit as string);

      const countResult = await query(
        'SELECT COUNT(*) as total FROM dealer_registration_requests WHERE status = $1',
        [APPROVAL_STATUS.PENDING]
      );

      const dataResult = await query(
        `SELECT 
          id, dealer_code, dealer_name, user_name, email, mobile_number,
          requested_role, additional_info, submission_date, status
         FROM dealer_registration_requests
         WHERE status = $1
         ORDER BY submission_date DESC
         LIMIT $2 OFFSET $3`,
        [APPROVAL_STATUS.PENDING, parseInt(limit as string), offset]
      );

      res.json({
        success: true,
        data: {
          total: parseInt(countResult.rows[0].total),
          page: parseInt(page as string),
          limit: parseInt(limit as string),
          registrations: dataResult.rows,
        },
      });
    } catch (error) {
      next(error);
    }
  }
);

/**
 * GET /api/v1/admin/registrations/:id
 * Get registration request details
 */
router.get(
  '/admin/registrations/:id',
  authenticate,
  authorizeManufacturerAdmin,
  async (req: Request, res: Response, next) => {
    try {
      const { id } = req.params;

      const result = await query(
        `SELECT * FROM dealer_registration_requests WHERE id = $1`,
        [id]
      );

      if (result.rows.length === 0) {
        throw new AppError('Registration not found', 404, 'REG_NOT_FOUND');
      }

      res.json({
        success: true,
        data: result.rows[0],
      });
    } catch (error) {
      next(error);
    }
  }
);

/**
 * POST /api/v1/admin/registrations/:id/approve
 * Approve a dealer registration request and create user
 */
const approveSchema = z.object({
  password: z.string().min(8, 'Password must be at least 8 characters'),
  additionalRoles: z.array(z.string()).optional(), // Can assign multiple roles
});

router.post(
  '/admin/registrations/:id/approve',
  authenticate,
  authorizeManufacturerAdmin,
  async (req: Request, res: Response, next) => {
    const client = await query('BEGIN');

    try {
      const { id } = req.params;
      const validatedData = approveSchema.parse(req.body);

      // Get registration request
      const regResult = await query(
        'SELECT * FROM dealer_registration_requests WHERE id = $1',
        [id]
      );

      if (regResult.rows.length === 0) {
        throw new AppError('Registration not found', 404, 'REG_NOT_FOUND');
      }

      const regRequest = regResult.rows[0];

      // Check if user already exists
      const existingUser = await query(
        'SELECT id FROM users WHERE email = $1',
        [regRequest.email]
      );

      if (existingUser.rows.length > 0) {
        throw new AppError('User already exists', 409, 'USER_EXISTS');
      }

      // Check if dealer exists
      let dealerId: string;
      const dealerResult = await query(
        'SELECT id FROM dealers WHERE dealer_code = $1',
        [regRequest.dealer_code]
      );

      if (dealerResult.rows.length === 0) {
        // Create dealer if doesn't exist
        const newDealerResult = await query(
          `INSERT INTO dealers (dealer_code, dealer_name) VALUES ($1, $2) RETURNING id`,
          [regRequest.dealer_code, regRequest.dealer_name]
        );
        dealerId = newDealerResult.rows[0].id;
      } else {
        dealerId = dealerResult.rows[0].id;
      }

      // Hash password
      const passwordHash = await bcrypt.hash(validatedData.password, 10);

      // Create user
      const userResult = await query(
        `INSERT INTO users 
         (email, password_hash, name, role, user_type, dealer_id, is_active, created_by)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
         RETURNING id`,
        [
          regRequest.email,
          passwordHash,
          regRequest.user_name,
          regRequest.requested_role,
          'dealer',
          dealerId,
          true,
          req.user?.userId || null,
        ]
      );

      const userId = userResult.rows[0].id;

      // Assign primary role
      const roleResult = await query(
        'SELECT id FROM roles WHERE name = $1',
        [regRequest.requested_role]
      );

      if (roleResult.rows.length > 0) {
        await query(
          `INSERT INTO user_roles (user_id, role_id, assigned_by)
           VALUES ($1, $2, $3)`,
          [userId, roleResult.rows[0].id, req.user?.userId || null]
        );
      }

      // Assign additional roles if provided
      if (validatedData.additionalRoles && validatedData.additionalRoles.length > 0) {
        for (const roleName of validatedData.additionalRoles) {
          const additionalRoleResult = await query(
            'SELECT id FROM roles WHERE name = $1',
            [roleName]
          );

          if (additionalRoleResult.rows.length > 0) {
            await query(
              `INSERT INTO user_roles (user_id, role_id, assigned_by)
               VALUES ($1, $2, $3)
               ON CONFLICT DO NOTHING`,
              [userId, additionalRoleResult.rows[0].id, req.user?.userId || null]
            );
          }
        }
      }

      // Create approval record
      await query(
        `INSERT INTO user_approval_status 
         (user_id, registration_request_id, status, approval_date, approved_by)
         VALUES ($1, $2, $3, NOW(), $4)`,
        [
          userId,
          id,
          APPROVAL_STATUS.APPROVED,
          req.user?.userId || null,
        ]
      );

      // Update registration request status
      await query(
        `UPDATE dealer_registration_requests 
         SET status = $1, reviewed_by = $2, reviewed_at = NOW()
         WHERE id = $3`,
        [APPROVAL_STATUS.APPROVED, req.user?.userId || null, id]
      );

      await query('COMMIT');

      logger.info(
        `Dealer registration approved - User ID: ${userId}, Email: ${regRequest.email}, Role: ${regRequest.requested_role}`
      );

      res.json({
        success: true,
        message: 'Registration approved successfully',
        data: {
          userId,
          email: regRequest.email,
          userName: regRequest.user_name,
          role: regRequest.requested_role,
          status: APPROVAL_STATUS.APPROVED,
        },
      });
    } catch (error) {
      await query('ROLLBACK');
      next(error);
    }
  }
);

/**
 * POST /api/v1/admin/registrations/:id/reject
 * Reject a dealer registration request
 */
const rejectSchema = z.object({
  reason: z.string().min(10, 'Rejection reason must be at least 10 characters'),
});

router.post(
  '/admin/registrations/:id/reject',
  authenticate,
  authorizeManufacturerAdmin,
  async (req: Request, res: Response, next) => {
    try {
      const { id } = req.params;
      const validatedData = rejectSchema.parse(req.body);

      // Get registration request
      const regResult = await query(
        'SELECT * FROM dealer_registration_requests WHERE id = $1',
        [id]
      );

      if (regResult.rows.length === 0) {
        throw new AppError('Registration not found', 404, 'REG_NOT_FOUND');
      }

      const regRequest = regResult.rows[0];

      // Update registration request
      await query(
        `UPDATE dealer_registration_requests 
         SET status = $1, reviewed_by = $2, reviewed_at = NOW(), review_comments = $3
         WHERE id = $4`,
        [APPROVAL_STATUS.REJECTED, req.user?.userId || null, validatedData.reason, id]
      );

      logger.info(
        `Dealer registration rejected - Email: ${regRequest.email}, Reason: ${validatedData.reason}`
      );

      res.json({
        success: true,
        message: 'Registration rejected successfully',
        data: {
          registrationId: id,
          status: APPROVAL_STATUS.REJECTED,
          reason: validatedData.reason,
        },
      });
    } catch (error) {
      next(error);
    }
  }
);

/**
 * GET /api/v1/admin/registrations
 * Get all registrations with filtering
 */
router.get(
  '/admin/registrations',
  authenticate,
  authorizeManufacturerAdmin,
  async (req: Request, res: Response, next) => {
    try {
      const { status = 'pending', page = '1', limit = '10' } = req.query;
      const offset =
        (parseInt(page as string) - 1) * parseInt(limit as string);

      const countResult = await query(
        'SELECT COUNT(*) as total FROM dealer_registration_requests WHERE status = $1',
        [status]
      );

      const dataResult = await query(
        `SELECT 
          id, dealer_code, dealer_name, user_name, email, mobile_number,
          requested_role, submission_date, status, review_comments
         FROM dealer_registration_requests
         WHERE status = $1
         ORDER BY submission_date DESC
         LIMIT $2 OFFSET $3`,
        [status, parseInt(limit as string), offset]
      );

      res.json({
        success: true,
        data: {
          total: parseInt(countResult.rows[0].total),
          page: parseInt(page as string),
          limit: parseInt(limit as string),
          registrations: dataResult.rows,
        },
      });
    } catch (error) {
      next(error);
    }
  }
);

export default router;
