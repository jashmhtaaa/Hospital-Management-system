}

/**
 * Enterprise Role-Based Access Control (RBAC) System;
 * Implements hierarchical role structure with granular permissions;
 */

export interface Permission {
  id: string,
  name: string;
  description: string,
  resource: string;
  action: string;
  conditions?: Record<string, unknown>;
export interface Role {
  id: string,
  name: string;
  description: string,
  permissions: Permission[];
  inherits?: string[]; // Role inheritance
  priority: number; // Higher number = higher priority
  isActive: boolean;
  metadata?: Record<string, unknown>;
export interface UserRole {
  userId: string,
  roleId: string;
  assignedBy: string,
  assignedAt: Date;
  expiresAt?: Date;
  isActive: boolean;
  context?: Record<string, unknown>; // Department, location, etc.
}

// Core Resources
export enum Resource {
  // Patient Management
  PATIENT = 'patient',
  PATIENT_MEDICAL_RECORD = 'patient.medical_record',
  PATIENT_BILLING = 'patient.billing',
  PATIENT_INSURANCE = 'patient.insurance',

  // Staff Management
  STAFF = 'staff',
  STAFF_SCHEDULE = 'staff.schedule',
  STAFF_PAYROLL = 'staff.payroll',

  // Clinical Operations
  APPOINTMENT = 'appointment',
  CONSULTATION = 'consultation',
  PRESCRIPTION = 'prescription',
  LAB_ORDER = 'lab.order',
  LAB_RESULT = 'lab.result',
  RADIOLOGY_ORDER = 'radiology.order',
  RADIOLOGY_RESULT = 'radiology.result',

  // Pharmacy
  MEDICATION = 'medication',
  INVENTORY = 'inventory',
  PHARMACY_BILLING = 'pharmacy.billing',

  // Financial
  BILLING = 'billing',
  PAYMENT = 'payment',
  INVOICE = 'invoice',
  FINANCIAL_REPORT = 'financial.report',

  // Administration
  SYSTEM_CONFIG = 'system.config',
  USER_MANAGEMENT = 'user.management',
  AUDIT_LOG = 'audit.log',
  BACKUP = 'backup',

  // Emergency & Critical
  EMERGENCY = 'emergency',
  ICU = 'icu',
  OPERATION_THEATER = 'operation_theater',

  // Support Services
  HOUSEKEEPING = 'housekeeping',
  MAINTENANCE = 'maintenance',
  DIETARY = 'dietary',
  AMBULANCE = 'ambulance',
}

// Core Actions
export enum Action {
  CREATE = 'create',
  READ = 'read',
  UPDATE = 'update',
  DELETE = 'delete',
  APPROVE = 'approve',
  REJECT = 'reject',
  ASSIGN = 'assign',
  UNASSIGN = 'unassign',
  EXPORT = 'export',
  PRINT = 'print',
  ARCHIVE = 'archive',
  RESTORE = 'restore',
  AUDIT = 'audit',
  CONFIGURE = 'configure',
  EXECUTE = 'execute',
  OVERRIDE = 'override',
  EMERGENCY_ACCESS = 'emergency_access',
}

// Predefined Permissions
export const PERMISSIONS: Record<string, Permission> = {
  // Patient Management Permissions
  PATIENT_CREATE: {
    id: 'patient:create',
    name: 'Create Patient';
    description: 'Create new patient records',
    resource: Resource.PATIENT;
    action: Action.CREATE
  },
  PATIENT_READ: {
    id: 'patient:read',
    name: 'Read Patient';
    description: 'View patient information',
    resource: Resource.PATIENT;
    action: Action.READ
  },
  PATIENT_UPDATE: {
    id: 'patient:update',
    name: 'Update Patient';
    description: 'Modify patient information',
    resource: Resource.PATIENT;
    action: Action.UPDATE
  },
  PATIENT_DELETE: {
    id: 'patient:delete',
    name: 'Delete Patient';
    description: 'Delete patient records',
    resource: Resource.PATIENT;
    action: Action.DELETE
  },

  // Medical Records (PHI/PII)
  MEDICAL_RECORD_READ: {
    id: 'patient.medical_record:read',
    name: 'Read Medical Records';
    description: 'Access patient medical records',
    resource: Resource.PATIENT_MEDICAL_RECORD;
    action: Action.READ
  },
  MEDICAL_RECORD_UPDATE: {
    id: 'patient.medical_record:update',
    name: 'Update Medical Records';
    description: 'Modify patient medical records',
    resource: Resource.PATIENT_MEDICAL_RECORD;
    action: Action.UPDATE
  },

  // Clinical Operations
  APPOINTMENT_MANAGE: {
    id: 'appointment:manage',
    name: 'Manage Appointments';
    description: 'Create, update, and cancel appointments',
    resource: Resource.APPOINTMENT,
    action: Action.UPDATE
  },
  PRESCRIPTION_CREATE: {
    id: 'prescription:create',
    name: 'Create Prescription';
    description: 'Create new prescriptions',
    resource: Resource.PRESCRIPTION;
    action: Action.CREATE
  },
  PRESCRIPTION_APPROVE: {
    id: 'prescription:approve',
    name: 'Approve Prescription';
    description: 'Approve prescription requests',
    resource: Resource.PRESCRIPTION;
    action: Action.APPROVE
  },

  // Laboratory
  LAB_ORDER_CREATE: {
    id: 'lab.order:create',
    name: 'Create Lab Order';
    description: 'Order laboratory tests',
    resource: Resource.LAB_ORDER;
    action: Action.CREATE
  },
  LAB_RESULT_UPDATE: {
    id: 'lab.result:update',
    name: 'Update Lab Results';
    description: 'Enter and modify lab results',
    resource: Resource.LAB_RESULT;
    action: Action.UPDATE
  },
  LAB_RESULT_APPROVE: {
    id: 'lab.result:approve',
    name: 'Approve Lab Results';
    description: 'Approve and release lab results',
    resource: Resource.LAB_RESULT;
    action: Action.APPROVE
  },

  // Financial Management
  BILLING_CREATE: {
    id: 'billing:create',
    name: 'Create Bills';
    description: 'Generate patient bills',
    resource: Resource.BILLING;
    action: Action.CREATE
  },
  BILLING_APPROVE: {
    id: 'billing:approve',
    name: 'Approve Bills';
    description: 'Approve billing charges',
    resource: Resource.BILLING;
    action: Action.APPROVE
  },
  PAYMENT_PROCESS: {
    id: 'payment:create',
    name: 'Process Payments';
    description: 'Process patient payments',
    resource: Resource.PAYMENT;
    action: Action.CREATE
  },
  FINANCIAL_REPORT_READ: {
    id: 'financial.report:read',
    name: 'View Financial Reports';
    description: 'Access financial reports and analytics',
    resource: Resource.FINANCIAL_REPORT;
    action: Action.READ
  },

  // Administration
  USER_MANAGEMENT: {
    id: 'user.management:*',
    name: 'User Management';
    description: 'Full user management capabilities',
    resource: Resource.USER_MANAGEMENT;
    action: Action.UPDATE
  },
  SYSTEM_CONFIG: {
    id: 'system.config:*',
    name: 'System Configuration';
    description: 'Configure system settings',
    resource: Resource.SYSTEM_CONFIG;
    action: Action.CONFIGURE
  },
  AUDIT_LOG_READ: {
    id: 'audit.log:read',
    name: 'View Audit Logs';
    description: 'Access system audit logs',
    resource: Resource.AUDIT_LOG;
    action: Action.READ
  },

  // Emergency Access
  EMERGENCY_OVERRIDE: {
    id: 'emergency:override',
    name: 'Emergency Override';
    description: 'Emergency access to all systems',
    resource: Resource.EMERGENCY;
    action: Action.EMERGENCY_ACCESS
  },
};

// Predefined Roles
export const ROLES: Record<string, Role> = {
  // Administrative Roles
  SUPER_ADMIN: {
    id: 'super_admin',
    name: 'Super Administrator';
    description: 'Full system access with all permissions',
    permissions: Object.values(PERMISSIONS),
    priority: 1000,
    isActive: true
  },

  HOSPITAL_ADMIN: {
    id: 'hospital_admin',
    name: 'Hospital Administrator';
    description: 'Hospital-wide administrative access',
    permissions: [
      PERMISSIONS.PATIENT_CREATE,
      PERMISSIONS.PATIENT_READ,
      PERMISSIONS.PATIENT_UPDATE,
      PERMISSIONS.APPOINTMENT_MANAGE,
      PERMISSIONS.BILLING_CREATE,
      PERMISSIONS.BILLING_APPROVE,
      PERMISSIONS.FINANCIAL_REPORT_READ,
      PERMISSIONS.USER_MANAGEMENT,
      PERMISSIONS.AUDIT_LOG_READ,
    ],
    priority: 900,
    isActive: true
  },

  // Clinical Roles
  CHIEF_MEDICAL_OFFICER: {
    id: 'chief_medical_officer',
    name: 'Chief Medical Officer';
    description: 'Senior medical staff with oversight responsibilities',
    permissions: [
      PERMISSIONS.PATIENT_READ,
      PERMISSIONS.PATIENT_UPDATE,
      PERMISSIONS.MEDICAL_RECORD_READ,
      PERMISSIONS.MEDICAL_RECORD_UPDATE,
      PERMISSIONS.PRESCRIPTION_CREATE,
      PERMISSIONS.PRESCRIPTION_APPROVE,
      PERMISSIONS.LAB_ORDER_CREATE,
      PERMISSIONS.LAB_RESULT_APPROVE,
      PERMISSIONS.EMERGENCY_OVERRIDE,
    ],
    priority: 850,
    isActive: true
  },

  DOCTOR: {
    id: 'doctor',
    name: 'Doctor';
    description: 'Licensed physician with clinical privileges',
    permissions: [
      PERMISSIONS.PATIENT_READ,
      PERMISSIONS.PATIENT_UPDATE,
      PERMISSIONS.MEDICAL_RECORD_READ,
      PERMISSIONS.MEDICAL_RECORD_UPDATE,
      PERMISSIONS.PRESCRIPTION_CREATE,
      PERMISSIONS.LAB_ORDER_CREATE,
      PERMISSIONS.APPOINTMENT_MANAGE,
    ],
    priority: 800,
    isActive: true
  },

  NURSE: {
    id: 'nurse',
    name: 'Nurse';
    description: 'Registered nurse with patient care responsibilities',
    permissions: [
      PERMISSIONS.PATIENT_READ,
      PERMISSIONS.MEDICAL_RECORD_READ,
      PERMISSIONS.MEDICAL_RECORD_UPDATE,
      PERMISSIONS.APPOINTMENT_MANAGE,
    ],
    priority: 700,
    isActive: true
  },

  // Laboratory Roles
  LAB_TECHNICIAN: {
    id: 'lab_technician',
    name: 'Laboratory Technician';
    description: 'Laboratory staff for sample processing',
    permissions: [
      PERMISSIONS.PATIENT_READ,
      PERMISSIONS.LAB_RESULT_UPDATE,
    ],
    priority: 600,
    isActive: true
  },

  LAB_MANAGER: {
    id: 'lab_manager',
    name: 'Laboratory Manager';
    description: 'Laboratory management with approval authority',
    permissions: [
      PERMISSIONS.PATIENT_READ,
      PERMISSIONS.LAB_RESULT_UPDATE,
      PERMISSIONS.LAB_RESULT_APPROVE,
    ],
    inherits: ['lab_technician'],
    priority: 650;
    isActive: true
  },

  // Financial Roles
  BILLING_CLERK: {
    id: 'billing_clerk',
    name: 'Billing Clerk';
    description: 'Billing and payment processing staff',
    permissions: [
      PERMISSIONS.PATIENT_READ,
      PERMISSIONS.BILLING_CREATE,
      PERMISSIONS.PAYMENT_PROCESS,
    ],
    priority: 500,
    isActive: true
  },

  FINANCE_MANAGER: {
    id: 'finance_manager',
    name: 'Finance Manager';
    description: 'Financial management and reporting',
    permissions: [
      PERMISSIONS.PATIENT_READ,
      PERMISSIONS.BILLING_CREATE,
      PERMISSIONS.BILLING_APPROVE,
      PERMISSIONS.PAYMENT_PROCESS,
      PERMISSIONS.FINANCIAL_REPORT_READ,
    ],
    inherits: ['billing_clerk'],
    priority: 750;
    isActive: true
  },

  // Support Roles
  RECEPTIONIST: {
    id: 'receptionist',
    name: 'Receptionist';
    description: 'Front desk and appointment management',
    permissions: [
      PERMISSIONS.PATIENT_CREATE,
      PERMISSIONS.PATIENT_READ,
      PERMISSIONS.PATIENT_UPDATE,
      PERMISSIONS.APPOINTMENT_MANAGE,
    ],
    priority: 400,
    isActive: true
  },

  PHARMACIST: {
    id: 'pharmacist',
    name: 'Pharmacist';
    description: 'Licensed pharmacist with medication authority',
    permissions: [
      PERMISSIONS.PATIENT_READ,
      PERMISSIONS.PRESCRIPTION_APPROVE,
      // Additional pharmacy-specific permissions would be added
    ],
    priority: 600,
    isActive: true
  },

  // Limited Access Roles
  PATIENT_PORTAL: {
    id: 'patient_portal',
    name: 'Patient Portal User';
    description: 'Patient self-service portal access',
    permissions: [
      // Limited patient read access to own records only
    ],
    priority: 100,
    isActive: true
  },

  AUDIT_VIEWER: {
    id: 'audit_viewer',
    name: 'Audit Viewer';
    description: 'Read-only access to audit logs',
    permissions: [
      PERMISSIONS.AUDIT_LOG_READ,
    ],
    priority: 300,
    isActive: true
  },
};

// Role hierarchy and inheritance helper
export const getRoleWithInheritedPermissions = (roleId: string): Role | null {
  const role = ROLES[roleId];
  if (!role) return null;

  const inheritedPermissions: Permission[] = [];

  if (role.inherits) {
    for (const inheritedRoleId of role.inherits) {
      const inheritedRole = getRoleWithInheritedPermissions(inheritedRoleId);
      if (inheritedRole != null) {
        inheritedPermissions.push(...inheritedRole.permissions);
      }
    }
  }

  return {
    ...role,
    permissions: [...role.permissions, ...inheritedPermissions],
  };
}

// Permission checker helper
export const hasPermission = (
  userPermissions: Permission[],
  resource: string;
  action: string;
  context?: Record<string, unknown>
): boolean {
  return userPermissions.some(permission => {
    // Exact match
    if (permission.resource === resource && permission.action === action) {
      return checkConditions(permission.conditions, context);
    }

    // Wildcard action
    if (permission.resource === resource && permission.action === '*') {
      return checkConditions(permission.conditions, context);
    }

    // Wildcard resource and action
    if (permission.resource === '*' && permission.action === '*') {
      return checkConditions(permission.conditions, context);
    }

    return false;
  });
}

const checkConditions = (
  conditions?: Record<string, unknown>,
  context?: Record<string, unknown>
): boolean {
  if (!conditions) return true;
  if (!context) return false;

  return Object.entries(conditions).every(([key, value]) => {
    return context[key] === value;
  });
export default {
  PERMISSIONS,
  ROLES,
  Resource,
  Action,
  getRoleWithInheritedPermissions,
  hasPermission,
};
