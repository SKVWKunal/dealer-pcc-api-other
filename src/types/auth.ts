// Authentication and User Types

export type UserRole = 
  | 'super_admin'
  | 'manufacturer_admin'
  | 'master_technician'
  | 'service_manager'
  | 'service_head'
  | 'warranty_manager';

export type DealerDesignation = 
  | 'master_technician'
  | 'service_manager'
  | 'service_head'
  | 'warranty_manager';

export type ModuleAccess = 
  | 'dealer_pcc'
  | 'api_registration'
  | 'mt_meet'
  | 'workshop_survey'
  | 'warranty_survey'
  | 'technical_survey';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  dealerCode?: string;
  dealerName?: string;
  designation?: DealerDesignation;
  modules: ModuleAccess[];
  isActive: boolean;
  createdAt: string;
  lastLogin?: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface LoginCredentials {
  email: string;
  password: string;
  userType: 'dealer' | 'manufacturer';
}

// Module Access Control Matrix
export const MODULE_ACCESS_CONTROL: Record<UserRole, ModuleAccess[]> = {
  super_admin: [
    'dealer_pcc',
    'api_registration',
    'mt_meet',
    'workshop_survey',
    'warranty_survey',
    'technical_survey'
  ],
  manufacturer_admin: [
    'dealer_pcc',
    'api_registration',
    'mt_meet',
    'workshop_survey',
    'warranty_survey',
    'technical_survey'
  ],
  master_technician: [
    'dealer_pcc',
    'workshop_survey',
    'warranty_survey',
    'technical_survey'
  ],
  service_manager: [
    'api_registration',
    'mt_meet',
    'workshop_survey',
    'warranty_survey',
    'technical_survey'
  ],
  service_head: [
    'api_registration',
    'mt_meet',
    'workshop_survey',
    'warranty_survey',
    'technical_survey'
  ],
  warranty_manager: [
    'workshop_survey',
    'warranty_survey',
    'technical_survey'
  ]
};

// Role display names
export const ROLE_NAMES: Record<UserRole, string> = {
  super_admin: 'Super Admin',
  manufacturer_admin: 'Manufacturer Admin',
  master_technician: 'Master Technician',
  service_manager: 'Service Manager',
  service_head: 'Service Head',
  warranty_manager: 'Warranty Manager'
};

// Module display names
export const MODULE_NAMES: Record<ModuleAccess, string> = {
  dealer_pcc: 'Dealer PCC',
  api_registration: 'API Registration',
  mt_meet: 'MT Meet',
  workshop_survey: 'Workshop System Survey',
  warranty_survey: 'Warranty Survey',
  technical_survey: 'Technical Awareness Survey'
};
