import { Request, Response, NextFunction } from 'express';
import { query } from '../config/database';
import { logger } from '../utils/logger';
import { APPROVAL_STATUS } from '../config/rbac.config';

/**
 * Middleware to check if user is approved (has passed manufacturer approval)
 */
export const checkApprovalStatus = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: {
          code: 'UNAUTHORIZED',
          message: 'Authentication required',
        },
      });
    }

    // Check approval status
    const approvalResult = await query(
      `SELECT status, rejection_reason FROM user_approval_status WHERE user_id = $1`,
      [req.user.userId]
    );

    if (approvalResult.rows.length === 0) {
      return res.status(403).json({
        success: false,
        error: {
          code: 'NOT_APPROVED',
          message: 'Your account is not yet approved',
          details: 'pending',
        },
      });
    }

    const approvalStatus = approvalResult.rows[0];

    if (approvalStatus.status === APPROVAL_STATUS.PENDING) {
      return res.status(403).json({
        success: false,
        error: {
          code: 'APPROVAL_PENDING',
          message: 'Your account approval is pending',
          details: 'pending',
        },
      });
    }

    if (approvalStatus.status === APPROVAL_STATUS.REJECTED) {
      return res.status(403).json({
        success: false,
        error: {
          code: 'APPROVAL_REJECTED',
          message: 'Your account has been rejected',
          details: 'rejected',
          reason: approvalStatus.rejection_reason,
        },
      });
    }

    // Add approval status to request
    (req as any).approvalStatus = approvalStatus.status;
    next();
  } catch (error) {
    logger.error('Approval status check error:', error);
    return res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Error checking approval status',
      },
    });
  }
};

/**
 * Middleware to check if user has specific role
 */
export const authorizeByRole = (allowedRoles: string[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          error: {
            code: 'UNAUTHORIZED',
            message: 'Authentication required',
          },
        });
      }

      // Get all user roles
      const rolesResult = await query(
        `SELECT r.name FROM user_roles ur
         JOIN roles r ON ur.role_id = r.id
         WHERE ur.user_id = $1 AND r.is_active = true`,
        [req.user.userId]
      );

      const userRoles = rolesResult.rows.map((r) => r.name);

      // Check if user has any of the allowed roles
      const hasRole = userRoles.some((role) =>
        allowedRoles.includes(role)
      );

      if (!hasRole) {
        logger.warn(
          `Unauthorized role access attempt - User: ${req.user.userId}, Allowed roles: ${allowedRoles.join(',')}, User roles: ${userRoles.join(',')}`
        );
        return res.status(403).json({
          success: false,
          error: {
            code: 'FORBIDDEN',
            message: 'Insufficient permissions for this resource',
          },
        });
      }

      // Attach user roles to request
      (req as any).userRoles = userRoles;
      next();
    } catch (error) {
      logger.error('Role authorization error:', error);
      return res.status(500).json({
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Error checking authorization',
        },
      });
    }
  };
};

/**
 * Middleware to check if user has access to a feature
 */
export const authorizeByFeature = (featureSlugs: string[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          error: {
            code: 'UNAUTHORIZED',
            message: 'Authentication required',
          },
        });
      }

      // Get user roles and their accessible features
      const permissionsResult = await query(
        `SELECT DISTINCT f.slug
         FROM user_roles ur
         JOIN roles r ON ur.role_id = r.id
         JOIN role_feature_permissions rfp ON r.id = rfp.role_id
         JOIN features f ON rfp.feature_id = f.id
         WHERE ur.user_id = $1 AND f.is_active = true AND r.is_active = true`,
        [req.user.userId]
      );

      const userFeatures = permissionsResult.rows.map((f) => f.slug);

      // Check if user can access any of the required features
      const hasFeatureAccess = featureSlugs.some((feature) =>
        userFeatures.includes(feature)
      );

      if (!hasFeatureAccess) {
        logger.warn(
          `Unauthorized feature access attempt - User: ${req.user.userId}, Required features: ${featureSlugs.join(',')}, User features: ${userFeatures.join(',')}`
        );
        return res.status(403).json({
          success: false,
          error: {
            code: 'FEATURE_FORBIDDEN',
            message: 'You do not have access to this feature',
          },
        });
      }

      // Attach user features to request
      (req as any).userFeatures = userFeatures;
      next();
    } catch (error) {
      logger.error('Feature authorization error:', error);
      return res.status(500).json({
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Error checking feature authorization',
        },
      });
    }
  };
};

/**
 * Middleware to check if user can perform specific action on feature
 */
export const authorizeFeatureAction = (
  feature: string,
  action: 'view' | 'create' | 'edit' | 'delete' | 'approve'
) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          error: {
            code: 'UNAUTHORIZED',
            message: 'Authentication required',
          },
        });
      }

      // Get user's permission for this feature
      const permissionResult = await query(
        `SELECT can_view, can_create, can_edit, can_delete, can_approve
         FROM role_feature_permissions
         WHERE role_id IN (
           SELECT role_id FROM user_roles WHERE user_id = $1
         )
         AND feature_id = (
           SELECT id FROM features WHERE slug = $2 AND is_active = true
         )`,
        [req.user.userId, feature]
      );

      if (permissionResult.rows.length === 0) {
        return res.status(403).json({
          success: false,
          error: {
            code: 'FEATURE_FORBIDDEN',
            message: 'You do not have access to this feature',
          },
        });
      }

      // Check specific action permission
      const permission = permissionResult.rows[0];
      const actionPermissions: Record<string, boolean> = {
        view: permission.can_view,
        create: permission.can_create,
        edit: permission.can_edit,
        delete: permission.can_delete,
        approve: permission.can_approve,
      };

      if (!actionPermissions[action]) {
        logger.warn(
          `Unauthorized action attempt - User: ${req.user.userId}, Feature: ${feature}, Action: ${action}`
        );
        return res.status(403).json({
          success: false,
          error: {
            code: 'ACTION_FORBIDDEN',
            message: `You do not have permission to ${action} this resource`,
          },
        });
      }

      next();
    } catch (error) {
      logger.error('Feature action authorization error:', error);
      return res.status(500).json({
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Error checking action authorization',
        },
      });
    }
  };
};

/**
 * Middleware for manufacturer/admin users only
 */
export const authorizeManufacturerAdmin = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: {
          code: 'UNAUTHORIZED',
          message: 'Authentication required',
        },
      });
    }

    const userType = (req.user as any).userType;
    if (userType !== 'manufacturer') {
      logger.warn(
        `Unauthorized admin access attempt - User: ${req.user.userId}, Type: ${userType}`
      );
      return res.status(403).json({
        success: false,
        error: {
          code: 'ADMIN_FORBIDDEN',
          message: 'This endpoint is only for manufacturer administrators',
        },
      });
    }

    next();
  } catch (error) {
    logger.error('Manufacturer admin authorization error:', error);
    return res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Error checking authorization',
      },
    });
  }
};
