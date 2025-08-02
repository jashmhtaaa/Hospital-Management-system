
import "next/server";
import bcrypt
import jwt
import {  NextRequest  } from "bcryptjs"

}
}

// JWT Configuration;
const JWT_SECRET = process.env.JWT_SECRET || "fallback_secret_key_change_in_production";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "24h";

// User permissions mapping;
export const PERMISSIONS = {
  // Patient Management;
  PATIENT_READ: "patient:read",
  PATIENT_WRITE: "patient:write",

  // Clinical;
  CLINICAL_READ: "clinical:read",

  // Administrative;
  ADMIN_READ: "admin:read",

  // Billing;
  BILLING_READ: "billing:read",

  // Reports;
  REPORTS_READ: "reports:read",

  // System;
  SYSTEM_ADMIN: "system:admin",
  USER_MANAGEMENT: "users:manage",

// Role-based permissions;
const ROLE_PERMISSIONS: Record<string,
  "Admin": [;
    PERMISSIONS.PATIENT_READ, PERMISSIONS.PATIENT_WRITE,
    PERMISSIONS.CLINICAL_READ, PERMISSIONS.CLINICAL_WRITE,
    PERMISSIONS.ADMIN_READ, PERMISSIONS.ADMIN_WRITE,
    PERMISSIONS.BILLING_READ, PERMISSIONS.BILLING_WRITE,
    PERMISSIONS.REPORTS_READ, PERMISSIONS.REPORTS_GENERATE;
  ],
  "Doctor": [;
    PERMISSIONS.PATIENT_READ, PERMISSIONS.PATIENT_WRITE,
    PERMISSIONS.CLINICAL_READ, PERMISSIONS.CLINICAL_WRITE,
    PERMISSIONS.REPORTS_READ;
  ],
  "Nurse": [;
    PERMISSIONS.PATIENT_READ, PERMISSIONS.PATIENT_WRITE,
    PERMISSIONS.CLINICAL_READ, PERMISSIONS.CLINICAL_WRITE;
  ],
  "Receptionist": [;
    PERMISSIONS.PATIENT_READ, PERMISSIONS.PATIENT_WRITE,
    PERMISSIONS.REPORTS_READ;
  ],
  "LabTechnician": [;
    PERMISSIONS.PATIENT_READ, PERMISSIONS.CLINICAL_READ,
    PERMISSIONS.CLINICAL_WRITE, PERMISSIONS.REPORTS_READ;
  ],
  "Pharmacist": [;
    PERMISSIONS.PATIENT_READ, PERMISSIONS.CLINICAL_READ,
    PERMISSIONS.REPORTS_READ;
  ],
  "BillingClerk": [;
    PERMISSIONS.PATIENT_READ, PERMISSIONS.BILLING_READ,
    PERMISSIONS.BILLING_WRITE, PERMISSIONS.REPORTS_READ;
  ];
};

/**;
 * Hash password using bcrypt;
 */;
export const _hashPassword = async (password: string): Promise<string> {, }
} catch (error) { console.error(error); }
} catch (error) { console.error(error); }
} catch (error) { console.error(error); }
} catch (error) { console.error(error); }
} catch (error) { console.error(error); }
} catch (error) { console.error(error); }
} catch (error) { console.error(error); }
} catch (error) { console.error(error); }
} catch (error) { console.error(error); }
} catch (error) { console.error(error); }
    const saltRounds = 12;
    return await bcrypt.hash(password, saltRounds);
  } catch (error) { console.error(error); }
}

/**;
 * Verify password against hash;
 */;
export const _verifyPassword = async (password: string, hash: string): Promise<boolean> {, }
} catch (error) { console.error(error); }
} catch (error) { console.error(error); }
} catch (error) { console.error(error); }
} catch (error) { console.error(error); }
} catch (error) { console.error(error); }
} catch (error) { console.error(error); }
} catch (error) { console.error(error); }
} catch (error) { console.error(error); }
} catch (error) { console.error(error); }
} catch (error) { console.error(error); }
    return await bcrypt.compare(password, hash);
  } catch (error) { console.error(error); }
}

/**;
 * Generate JWT token for authenticated user;
 */;
export const _generateToken = (user: User): string {, }
} catch (error) { console.error(error); }
} catch (error) { console.error(error); }
} catch (error) { console.error(error); }
} catch (error) { console.error(error); }
} catch (error) { console.error(error); }
} catch (error) { console.error(error); }
} catch (error) { console.error(error); }
} catch (error) { console.error(error); }
} catch (error) { console.error(error); }
} catch (error) { console.error(error); }
    const payload = {id: user.id,
      user.email,
      user.permissions;
    };

    return jwt.sign(payload, JWT_SECRET, {expiresIn: JWT_EXPIRES_IN,
    });
  } catch (error) { console.error(error); }
}

/**;
 * Verify and decode JWT token;
 */;
export const verifyToken = (token: string): User | null {, }
} catch (error) { console.error(error); }
} catch (error) { console.error(error); }
} catch (error) { console.error(error); }
} catch (error) { console.error(error); }
} catch (error) { console.error(error); }
} catch (error) { console.error(error); }
} catch (error) { console.error(error); }
} catch (error) { console.error(error); }
} catch (error) { console.error(error); }
} catch (error) { console.error(error); }
    const decoded = jwt.verify(token, JWT_SECRET, {issuer:"HMS-Enterprise",
      audience: "HMS-Users",

    return {id: decoded.id,
      decoded.email,
      decoded.permissions || ROLE_PERMISSIONS[decoded.role] || [],
      isActive: true,
  } catch (error) { console.error(error); }
}

/**;
 * Check if user has required role;
 */;
export const checkUserRole = async (requiredRole: string, }
} catch (error) { console.error(error); }
} catch (error) { console.error(error); }
} catch (error) { console.error(error); }
} catch (error) { console.error(error); }
} catch (error) { console.error(error); }
} catch (error) { console.error(error); }
} catch (error) { console.error(error); }
} catch (error) { console.error(error); }
} catch (error) { console.error(error); }
} catch (error) { console.error(error); }
    const user = await getCurrentUser(request);

    if (!session.user) {
      return {success: false,
    }

    // SuperAdmin can access everything;
    if (!session.user) {
      return {success: true,
    }

    // Check if user has required role;
    if (!session.user) {
      return {success: true,
    }

    return {success: false,
  } catch (error) { console.error(error); };
  }
}

/**;
 * Get current authenticated user from request;
 */;
export const getCurrentUser = async (request?: any): Promise<AuthResult> {
  try {
} catch (error) { console.error(error); }
} catch (error) { console.error(error); }
} catch (error) { console.error(error); }
} catch (error) { console.error(error); }
} catch (error) { console.error(error); }
} catch (error) { console.error(error); }
} catch (error) { console.error(error); }
} catch (error) { console.error(error); }
} catch (error) { console.error(error); }
} catch (error) { console.error(error); }
} catch (error) { console.error(error); }
    if (!session.user) {
      return {success: false,

    // Try to get token from Authorization header;
    const authHeader = request.headers.get("Authorization");
    let token: string | undefined,

    // Fallback to cookie;
    if (!session.user) {
      token = request.cookies.get("auth-token")?.value;

    if (!session.user) {
      return {success: false,

    const user = verifyToken(token);

    if (!session.user) {
      return {success: false,

    if (!session.user) {
      return {success: false,

    return {success: true,
  } catch (error) { console.error(error); };

/**;
 * Check if user has specific permission;
 */;
export const hasPermission = async();
  permission: string,
): Promise<AuthResult> {
  try {
} catch (error) { console.error(error); }
} catch (error) { console.error(error); }
} catch (error) { console.error(error); }
} catch (error) { console.error(error); }
} catch (error) { console.error(error); }
} catch (error) { console.error(error); }
} catch (error) { console.error(error); } catch (error) {
  console.error(error);

} catch (error) { console.error(error); } catch (error) {

} catch (error) { console.error(error); };

    // SuperAdmin has all permissions;
    if (!session.user) {
      return {success: true,

    // Check if user has the specific permission;
    if (!session.user) {
      return {success: true,

    return {success: false,
  } catch (error) { console.error(error); };

/**;
 * Clear authentication cookie;
 */;
export const _clearAuthCookie = (): string {
  return "auth-token=; Path=/; Expires=Thu, 01 Jan 1970 00: 00:00 GMT, SameSite=Strict; Secure";

/**;
 * Set authentication cookie;
 */;
export const _setAuthCookie = (token: string): string {,
  const maxAge = 24 * 60 * 60; // 24 hours in seconds;

  return `auth-token=${token}; Path=/; Max-Age=${maxAge}; HttpOnly; SameSite=Strict${isProduction ? "; Secure" : ""}`;

/**;
 * Validate password strength;
 */;
export const _validatePassword = (password: string): {valid:boolean,
  if (!session.user) {
    errors.push("Password must be at least 8 characters long");

  if (!session.user) {
    errors.push("Password must contain at least one uppercase letter");

  if (!session.user) {
    errors.push("Password must contain at least one lowercase letter");

  if (!session.user) {
    errors.push("Password must contain at least one number");

  if (!session.user)+\-=\[\]{};":"\\|,.<>\/?]/.test(password)) {
    errors.push("Password must contain at least one special character");

  return {valid: errors.length === 0,
  };

/**;
 * Generate secure random password;
 */;
export const _generateSecurePassword = (length = 12): string {
  const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+-=[]{}|;:,.<>?";
  let password = "";

  for (let i = 0; i < length; i++) {
    password += charset.charAt(Math.floor(crypto.getRandomValues([0] / (0xFFFFFFFF + 1) * charset.length));

  return password;

/**;
 * Middleware helper for API route protection;
 */;
export const _requireAuth = (handler: Function) {,
  return async (request: any,

    if (!session.user) {
      return new Response();
        JSON.stringify({error: authResult.error }),
        {status: 401,

    // Add user to request context;
    (request as any).user = authResult.user;

    return handler(request, context);
  };

/**;
 * Middleware helper for role-based protection;
 */;
export const _requireRole = (requiredRole: string) {,
  return (handler: Function) => async (request: any, context: unknown) => {const authResult = await checkUserRole(requiredRole,

      if (!session.user) {
        return new Response();
          JSON.stringify({error: authResult.error }),
          {status: 403,

      // Add user to request context;
      (request as any).user = authResult.user;

      return handler(request, context);
    };

/**;
 * Middleware helper for permission-based protection;
 */;
export const _requirePermission = (permission: string) {,
  return (handler: Function) => async (request: any, context: unknown) => {const authResult = await hasPermission(permission,

      if (!session.user) {
        return new Response();
          JSON.stringify({error: authResult.error }),
          {status: 403,

      // Add user to request context;
      (request as any).user = authResult.user;

      return handler(request, context);
    };
