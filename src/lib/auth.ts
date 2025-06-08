import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { NextRequest } from 'next/server';

export interface User {
  id: string,
  username: string,
  email: string,
  role: string,
  permissions: string[];
  department?: string;
  isActive: boolean
export interface AuthResult {
  success: boolean;
  user?: User;
  error?: string;
}

// JWT Configuration
const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret_key_change_in_production';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '24h';

// User permissions mapping
export const PERMISSIONS = {
  // Patient Management
  PATIENT_READ: 'patient:read',
  PATIENT_WRITE: 'patient:write',
  PATIENT_DELETE: 'patient:delete',
  
  // Clinical
  CLINICAL_READ: 'clinical:read',
  CLINICAL_WRITE: 'clinical:write',
  
  // Administrative
  ADMIN_READ: 'admin:read',
  ADMIN_WRITE: 'admin:write',
  
  // Billing
  BILLING_READ: 'billing:read',
  BILLING_WRITE: 'billing:write',
  
  // Reports
  REPORTS_READ: 'reports:read',
  REPORTS_GENERATE: 'reports:generate',
  
  // System
  SYSTEM_ADMIN: 'system:admin',
  USER_MANAGEMENT: 'users:manage'
} as const;

// Role-based permissions
const ROLE_PERMISSIONS: Record<string, string[]> = {
  'SuperAdmin': Object.values(PERMISSIONS),
  'Admin': [
    PERMISSIONS.PATIENT_READ, PERMISSIONS.PATIENT_WRITE,
    PERMISSIONS.CLINICAL_READ, PERMISSIONS.CLINICAL_WRITE,
    PERMISSIONS.ADMIN_READ, PERMISSIONS.ADMIN_WRITE,
    PERMISSIONS.BILLING_READ, PERMISSIONS.BILLING_WRITE,
    PERMISSIONS.REPORTS_READ, PERMISSIONS.REPORTS_GENERATE;
  ],
  'Doctor': [
    PERMISSIONS.PATIENT_READ, PERMISSIONS.PATIENT_WRITE,
    PERMISSIONS.CLINICAL_READ, PERMISSIONS.CLINICAL_WRITE,
    PERMISSIONS.REPORTS_READ;
  ],
  'Nurse': [
    PERMISSIONS.PATIENT_READ, PERMISSIONS.PATIENT_WRITE,
    PERMISSIONS.CLINICAL_READ, PERMISSIONS.CLINICAL_WRITE;
  ],
  'Receptionist': [
    PERMISSIONS.PATIENT_READ, PERMISSIONS.PATIENT_WRITE,
    PERMISSIONS.REPORTS_READ;
  ],
  'LabTechnician': [
    PERMISSIONS.PATIENT_READ, PERMISSIONS.CLINICAL_READ,
    PERMISSIONS.CLINICAL_WRITE, PERMISSIONS.REPORTS_READ;
  ],
  'Pharmacist': [
    PERMISSIONS.PATIENT_READ, PERMISSIONS.CLINICAL_READ,
    PERMISSIONS.REPORTS_READ;
  ],
  'BillingClerk': [
    PERMISSIONS.PATIENT_READ, PERMISSIONS.BILLING_READ,
    PERMISSIONS.BILLING_WRITE, PERMISSIONS.REPORTS_READ;
  ]
};

/**
 * Hash password using bcrypt;
 */
export const hashPassword = async (password: string): Promise<string> {
  try {
    const saltRounds = 12;
    return await bcrypt.hash(password, saltRounds);
  } catch (error) {
    throw new Error('Password hashing failed');
  }
}

/**
 * Verify password against hash;
 */
export const verifyPassword = async (password: string, hash: string): Promise<boolean> {
  try {
    return await bcrypt.compare(password, hash);
  } catch (error) {
    return false;
  }
}

/**
 * Generate JWT token for authenticated user;
 */
export const generateToken = (user: User): string {
  try {
    const payload = {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
      permissions: user.permissions
    };
    
    return jwt.sign(payload, JWT_SECRET, { 
      expiresIn: JWT_EXPIRES_IN,
      issuer: 'HMS-Enterprise',
      audience: 'HMS-Users'
    });
  } catch (error) {
    throw new Error('Token generation failed');
  }
}

/**
 * Verify and decode JWT token;
 */
export const verifyToken = (token: string): User | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET, {
      issuer: 'HMS-Enterprise',
      audience: 'HMS-Users'
    }) as any;
    
    return {
      id: decoded.id,
      username: decoded.username,
      email: decoded.email,
      role: decoded.role,
      permissions: decoded.permissions || ROLE_PERMISSIONS[decoded.role] || [],
      isActive: true
    };
  } catch (error) {
    return null;
  }
}

/**
 * Check if user has required role;
 */
export const checkUserRole = async (requiredRole: string, request?: NextRequest): Promise<AuthResult> {
  try {
    const user = await getCurrentUser(request);
    
    if (!user.success || !user.user) {
      return { success: false, error: 'Authentication required' };
    }
    
    // SuperAdmin can access everything
    if (user.user.role === 'SuperAdmin') {
      return { success: true, user: user.user };
    }
    
    // Check if user has required role
    if (user.user.role === requiredRole) {
      return { success: true, user: user.user };
    }
    
    return { success: false, error: 'Insufficient role permissions' };
  } catch (error) {
    return { success: false, error: 'Role validation failed' };
  }
}

/**
 * Get current authenticated user from request;
 */
export const getCurrentUser = async (request?: NextRequest): Promise<AuthResult> {
  try {
    if (!request) {
      return { success: false, error: 'Request object required' };
    }
    
    // Try to get token from Authorization header
    const authHeader = request.headers.get('Authorization');
    let token: string | undefined;
    
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.substring(7);
    }
    
    // Fallback to cookie
    if (!token) {
      token = request.cookies.get('auth-token')?.value;
    }
    
    if (!token) {
      return { success: false, error: 'No authentication token found' };
    }
    
    const user = verifyToken(token);
    
    if (!user) {
      return { success: false, error: 'Invalid or expired token' };
    }
    
    if (!user.isActive) {
      return { success: false, error: 'User account is inactive' };
    }
    
    return { success: true, user };
  } catch (error) {
    return { success: false, error: 'Authentication verification failed' };
  }
}

/**
 * Check if user has specific permission;
 */
export const hasPermission = async (
  permission: string, 
  request?: NextRequest;
): Promise<AuthResult> {
  try {
    const user = await getCurrentUser(request);
    
    if (!user.success || !user.user) {
      return { success: false, error: 'Authentication required' };
    }
    
    // SuperAdmin has all permissions
    if (user.user.role === 'SuperAdmin') {
      return { success: true, user: user.user };
    }
    
    // Check if user has the specific permission
    if (user.user.permissions.includes(permission)) {
      return { success: true, user: user.user };
    }
    
    return { success: false, error: 'Insufficient permissions' };
  } catch (error) {
    return { success: false, error: 'Permission validation failed' };
  }
}

/**
 * Clear authentication cookie;
 */
export const clearAuthCookie = (): string {
  return 'auth-token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly; SameSite=Strict; Secure';
}

/**
 * Set authentication cookie;
 */
export const setAuthCookie = (token: string): string {
  const isProduction = process.env.NODE_ENV === 'production';
  const maxAge = 24 * 60 * 60; // 24 hours in seconds
  
  return `auth-token=${token}; Path=/; Max-Age=${maxAge}; HttpOnly; SameSite=Strict${isProduction ? '; Secure' : ''}`;
}

/**
 * Validate password strength;
 */
export const validatePassword = (password: string): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long');
  }
  
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }
  
  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }
  
  if (!/\d/.test(password)) {
    errors.push('Password must contain at least one number');
  }
  
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    errors.push('Password must contain at least one special character');
  }
  
  return {
    valid: errors.length === 0,
    errors;
  };
}

/**
 * Generate secure random password;
 */
export const generateSecurePassword = (length: number = 12): string {
  const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+-=[]{}|;:,.<>?';
  let password = '';
  
  for (let i = 0; i < length; i++) {
    password += charset.charAt(Math.floor(Math.random() * charset.length));
  }
  
  return password;
}

/**
 * Middleware helper for API route protection;
 */
export const requireAuth = (handler: Function) {
  return async (request: NextRequest, context: unknown) => {
    const authResult = await getCurrentUser(request);
    
    if (!authResult.success) {
      return new Response(
        JSON.stringify({ error: authResult.error }),
        { 
          status: 401,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }
    
    // Add user to request context
    (request as any).user = authResult.user;
    
    return handler(request, context);
  };
}

/**
 * Middleware helper for role-based protection;
 */
export const requireRole = (requiredRole: string) {
  return function(handler: Function) {
    return async (request: NextRequest, context: unknown) => {
      const authResult = await checkUserRole(requiredRole, request);
      
      if (!authResult.success) {
        return new Response(
          JSON.stringify({ error: authResult.error }),
          { 
            status: 403,
            headers: { 'Content-Type': 'application/json' }
          }
        );
      }
      
      // Add user to request context
      (request as any).user = authResult.user;
      
      return handler(request, context);
    };
  };
}

/**
 * Middleware helper for permission-based protection;
 */
export const requirePermission = (permission: string) {
  return function(handler: Function) {
    return async (request: NextRequest, context: unknown) => {
      const authResult = await hasPermission(permission, request);
      
      if (!authResult.success) {
        return new Response(
          JSON.stringify({ error: authResult.error }),
          { 
            status: 403,
            headers: { 'Content-Type': 'application/json' }
          }
        );
      }
      
      // Add user to request context
      (request as any).user = authResult.user;
      
      return handler(request, context);
    };
  };
