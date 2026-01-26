// RBAC Configuration - Single source of truth for roles, features, and permissions
// This config is used by both backend and frontend to maintain consistency

export const ROLES = {
  DEALER_GM: 'dealer_gm',
  SERVICE_HEAD: 'service_head',
  SERVICE_MANAGER: 'service_manager',
  MASTER_TECHNICIAN: 'master_technician',
  WARRANTY_MANAGER: 'warranty_manager',
} as const;

export const ROLE_DISPLAY_NAMES = {
  [ROLES.DEALER_GM]: 'Dealer GM',
  [ROLES.SERVICE_HEAD]: 'Service Head',
  [ROLES.SERVICE_MANAGER]: 'Service Manager',
  [ROLES.MASTER_TECHNICIAN]: 'Master Technician',
  [ROLES.WARRANTY_MANAGER]: 'Warranty Manager',
};

export const FEATURES = {
  API_REGISTRATION: 'api_registration',
  MT_MEET: 'mt_meet',
  WORKSHOP_SURVEY: 'workshop_survey',
  WARRANTY_SURVEY: 'warranty_survey',
  TECHNICAL_AWARENESS: 'technical_awareness',
  DATABASE: 'database',
} as const;

export const FEATURE_CONFIG = {
  [FEATURES.API_REGISTRATION]: {
    name: 'API Registration',
    description: 'Register for API awareness events',
    icon: 'FileText',
    route: '/modules/api-registration',
    displayOrder: 1,
  },
  [FEATURES.MT_MEET]: {
    name: 'MT Meet Registration',
    description: 'Register for Master Technician meetings',
    icon: 'Users',
    route: '/modules/mt-meet',
    displayOrder: 2,
  },
  [FEATURES.WORKSHOP_SURVEY]: {
    name: 'Workshop Survey',
    description: 'Submit workshop performance surveys',
    icon: 'BarChart3',
    route: '/modules/workshop-survey',
    displayOrder: 3,
  },
  [FEATURES.WARRANTY_SURVEY]: {
    name: 'Warranty Survey',
    description: 'Submit warranty related information',
    icon: 'Shield',
    route: '/modules/warranty-survey',
    displayOrder: 4,
  },
  [FEATURES.TECHNICAL_AWARENESS]: {
    name: 'Technical Awareness',
    description: 'Technical awareness and training',
    icon: 'BookOpen',
    route: '/modules/technical-awareness',
    displayOrder: 5,
  },
  [FEATURES.DATABASE]: {
    name: 'Database',
    description: 'Access to dealer database and records',
    icon: 'Database',
    route: '/modules/database',
    displayOrder: 6,
  },
} as const;

// Role-to-Feature Mapping (Central permission matrix)
export const ROLE_FEATURE_PERMISSIONS = {
  [ROLES.DEALER_GM]: [FEATURES.API_REGISTRATION],
  [ROLES.SERVICE_HEAD]: [FEATURES.API_REGISTRATION],
  [ROLES.SERVICE_MANAGER]: [
    FEATURES.WORKSHOP_SURVEY,
    FEATURES.DATABASE,
  ],
  [ROLES.MASTER_TECHNICIAN]: [
    FEATURES.MT_MEET,
    FEATURES.WORKSHOP_SURVEY,
    FEATURES.TECHNICAL_AWARENESS,
    FEATURES.DATABASE,
  ],
  [ROLES.WARRANTY_MANAGER]: [
    FEATURES.WORKSHOP_SURVEY,
    FEATURES.WARRANTY_SURVEY,
    FEATURES.DATABASE,
  ],
} as const;

// Role-specific form fields for registration
export const ROLE_SPECIFIC_FIELDS = {
  [ROLES.DEALER_GM]: {
    fields: ['department', 'yearsExperience'],
    description: 'General Manager at Dealer',
  },
  [ROLES.SERVICE_HEAD]: {
    fields: ['department', 'yearsExperience', 'certificateNumber'],
    description: 'Head of Service Department',
  },
  [ROLES.SERVICE_MANAGER]: {
    fields: ['department', 'yearsExperience', 'serviceAreaCode'],
    description: 'Manager in Service Department',
  },
  [ROLES.MASTER_TECHNICIAN]: {
    fields: [
      'technician_id',
      'certification_level',
      'specialization',
      'experience_years',
    ],
    description: 'Master Level Technician',
  },
  [ROLES.WARRANTY_MANAGER]: {
    fields: ['warranty_zone', 'experience_years', 'team_size'],
    description: 'Warranty Department Manager',
  },
} as const;

// Approval Status Values
export const APPROVAL_STATUS = {
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected',
} as const;

export const APPROVAL_STATUS_DISPLAY = {
  [APPROVAL_STATUS.PENDING]: { label: 'Pending Approval', color: 'yellow' },
  [APPROVAL_STATUS.APPROVED]: { label: 'Approved', color: 'green' },
  [APPROVAL_STATUS.REJECTED]: { label: 'Rejected', color: 'red' },
} as const;

/**
 * Check if a role has access to a feature
 */
export const canAccessFeature = (
  role: string,
  feature: string
): boolean => {
  const roleFeatures =
    ROLE_FEATURE_PERMISSIONS[role as keyof typeof ROLE_FEATURE_PERMISSIONS];
  return roleFeatures ? Array.from(roleFeatures).includes(feature as any) : false;
};

/**
 * Get all features accessible to a role
 */
export const getFeaturesByRole = (role: string): string[] => {
  const features =
    ROLE_FEATURE_PERMISSIONS[role as keyof typeof ROLE_FEATURE_PERMISSIONS];
  return features ? Array.from(features) : [];
};

/**
 * Get all roles that can access a feature
 */
export const getRolesByFeature = (feature: string): string[] => {
  const roles: string[] = [];
  Object.entries(ROLE_FEATURE_PERMISSIONS).forEach(([role, features]) => {
    if ((features as readonly string[]).includes(feature)) {
      roles.push(role);
    }
  });
  return roles;
};

/**
 * Check if a role can perform an action on a feature
 */
export const canPerformAction = (
  role: string,
  feature: string,
  action: 'view' | 'create' | 'edit' | 'delete' | 'approve'
): boolean => {
  const hasAccess = canAccessFeature(role, feature);
  if (!hasAccess) return false;

  // Default permissions based on feature access
  // You can extend this with more granular control
  const actionPermissions: Record<string, boolean> = {
    view: true,
    create: true,
    edit: true,
    delete: false,
    approve: false,
  };

  return actionPermissions[action] ?? false;
};

/**
 * Get field configuration for a role
 */
export const getRoleFieldConfig = (role: string) => {
  return (
    ROLE_SPECIFIC_FIELDS[
      role as keyof typeof ROLE_SPECIFIC_FIELDS
    ] || {
      fields: [],
      description: '',
    }
  );
};

export type Role = keyof typeof ROLES;
export type Feature = keyof typeof FEATURES;
export type ApprovalStatus = keyof typeof APPROVAL_STATUS;
