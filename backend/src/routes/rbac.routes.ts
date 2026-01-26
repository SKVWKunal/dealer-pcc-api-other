import { Router, Request, Response } from 'express';
import { query } from '../config/database';
import { authenticate } from '../middleware/auth.middleware';
import { checkApprovalStatus } from '../middleware/rbac.middleware';
import { logger } from '../utils/logger';

const router = Router();

/**
 * GET /api/v1/auth/user/profile
 * Get current user profile with roles and accessible features
 */
router.get(
  '/user/profile',
  authenticate,
  checkApprovalStatus,
  async (req: Request, res: Response, next) => {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          error: { code: 'UNAUTHORIZED', message: 'No user in request' },
        });
      }

      // Get user details
      const userResult = await query(
        `SELECT 
          u.id, u.email, u.name, u.user_type, u.dealer_id,
          d.dealer_code, d.dealer_name,
          uas.status as approval_status
         FROM users u
         LEFT JOIN dealers d ON u.dealer_id = d.id
         LEFT JOIN user_approval_status uas ON u.id = uas.user_id
         WHERE u.id = $1`,
        [req.user.userId]
      );

      if (userResult.rows.length === 0) {
        return res.status(404).json({
          success: false,
          error: { code: 'USER_NOT_FOUND', message: 'User not found' },
        });
      }

      const user = userResult.rows[0];

      // Get user roles
      const rolesResult = await query(
        `SELECT r.id, r.name, r.display_name
         FROM user_roles ur
         JOIN roles r ON ur.role_id = r.id
         WHERE ur.user_id = $1 AND r.is_active = true`,
        [req.user.userId]
      );

      const userRoles = rolesResult.rows;

      // Get accessible features
      const featuresResult = await query(
        `SELECT DISTINCT 
          f.id, f.slug, f.name, f.description, f.icon, f.route_path, f.display_order,
          rfp.can_view, rfp.can_create, rfp.can_edit, rfp.can_delete, rfp.can_approve
         FROM user_roles ur
         JOIN roles r ON ur.role_id = r.id
         JOIN role_feature_permissions rfp ON r.id = rfp.role_id
         JOIN features f ON rfp.feature_id = f.id
         WHERE ur.user_id = $1 AND f.is_active = true AND r.is_active = true
         ORDER BY f.display_order ASC`,
        [req.user.userId]
      );

      const features = featuresResult.rows;

      res.json({
        success: true,
        data: {
          user: {
            id: user.id,
            email: user.email,
            name: user.name,
            userType: user.user_type,
            dealerId: user.dealer_id,
            dealerCode: user.dealer_code,
            dealerName: user.dealer_name,
            approvalStatus: user.approval_status,
          },
          roles: userRoles,
          features: features.map((f) => ({
            id: f.id,
            slug: f.slug,
            name: f.name,
            description: f.description,
            icon: f.icon,
            routePath: f.route_path,
            displayOrder: f.display_order,
            permissions: {
              canView: f.can_view,
              canCreate: f.can_create,
              canEdit: f.can_edit,
              canDelete: f.can_delete,
              canApprove: f.can_approve,
            },
          })),
        },
      });
    } catch (error) {
      logger.error('Error fetching user profile:', error);
      next(error);
    }
  }
);

/**
 * GET /api/v1/auth/features
 * Get all available features (for dashboard rendering)
 */
router.get(
  '/features',
  authenticate,
  checkApprovalStatus,
  async (req: Request, res: Response, next) => {
    try {
      // Get features accessible to this user
      const result = await query(
        `SELECT DISTINCT 
          f.id, f.slug, f.name, f.description, f.icon, f.route_path, f.display_order,
          rfp.can_view, rfp.can_create, rfp.can_edit, rfp.can_delete
         FROM user_roles ur
         JOIN roles r ON ur.role_id = r.id
         JOIN role_feature_permissions rfp ON r.id = rfp.role_id
         JOIN features f ON rfp.feature_id = f.id
         WHERE ur.user_id = $1 AND f.is_active = true AND r.is_active = true
         ORDER BY f.display_order ASC`,
        [req.user?.userId]
      );

      const features = result.rows.map((row) => ({
        id: row.id,
        slug: row.slug,
        name: row.name,
        description: row.description,
        icon: row.icon,
        routePath: row.route_path,
        displayOrder: row.display_order,
        permissions: {
          canView: row.can_view,
          canCreate: row.can_create,
          canEdit: row.can_edit,
          canDelete: row.can_delete,
        },
      }));

      res.json({
        success: true,
        data: { features },
      });
    } catch (error) {
      logger.error('Error fetching features:', error);
      next(error);
    }
  }
);

/**
 * GET /api/v1/auth/features/:slug/access
 * Check if user has access to a specific feature
 */
router.get(
  '/features/:slug/access',
  authenticate,
  async (req: Request, res: Response, next) => {
    try {
      const { slug } = req.params;

      const result = await query(
        `SELECT 
          f.slug, f.name,
          rfp.can_view, rfp.can_create, rfp.can_edit, rfp.can_delete, rfp.can_approve
         FROM user_roles ur
         JOIN roles r ON ur.role_id = r.id
         JOIN role_feature_permissions rfp ON r.id = rfp.role_id
         JOIN features f ON rfp.feature_id = f.id
         WHERE ur.user_id = $1 AND f.slug = $2 AND f.is_active = true AND r.is_active = true
         LIMIT 1`,
        [req.user?.userId, slug]
      );

      const hasAccess = result.rows.length > 0;

      res.json({
        success: true,
        data: {
          slug,
          hasAccess,
          permissions: hasAccess
            ? {
                canView: result.rows[0].can_view,
                canCreate: result.rows[0].can_create,
                canEdit: result.rows[0].can_edit,
                canDelete: result.rows[0].can_delete,
                canApprove: result.rows[0].can_approve,
              }
            : null,
        },
      });
    } catch (error) {
      logger.error('Error checking feature access:', error);
      next(error);
    }
  }
);

export default router;
