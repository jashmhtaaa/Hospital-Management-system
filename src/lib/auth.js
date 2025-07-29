"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCurrentUser = exports.checkUserRole = exports.verifyToken = exports._generateToken = exports._verifyPassword = exports._hashPassword = exports.PERMISSIONS = void 0;
require("bcryptjs");
require("jsonwebtoken");
require("next/server");
var jwt = ;
// JWT Configuration;
const JWT_SECRET = process.env.JWT_SECRET || "fallback_secret_key_change_in_production";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "24h";
// User permissions mapping;
exports.PERMISSIONS = {
    // Patient Management;
    PATIENT_READ: "patient:read",
    PATIENT_WRITE: "patient:write",
    PATIENT_DELETE: "patient:delete",
    // Clinical;
    CLINICAL_READ: "clinical:read",
    CLINICAL_WRITE: "clinical:write",
    // Administrative;
    ADMIN_READ: "admin:read",
    ADMIN_WRITE: "admin:write",
    // Billing;
    BILLING_READ: "billing:read",
    BILLING_WRITE: "billing:write",
    // Reports;
    REPORTS_READ: "reports:read",
    REPORTS_GENERATE: "reports:generate",
    // System;
    SYSTEM_ADMIN: "system:admin",
    USER_MANAGEMENT: "users:manage"
};
// Role-based permissions;
const ROLE_PERMISSIONS = {
    "SuperAdmin": Object.values(exports.PERMISSIONS),
    "Admin": [],
    PERMISSIONS: exports.PERMISSIONS, : .PATIENT_READ, PERMISSIONS: exports.PERMISSIONS, : .PATIENT_WRITE,
    PERMISSIONS: exports.PERMISSIONS, : .CLINICAL_READ, PERMISSIONS: exports.PERMISSIONS, : .CLINICAL_WRITE,
    PERMISSIONS: exports.PERMISSIONS, : .ADMIN_READ, PERMISSIONS: exports.PERMISSIONS, : .ADMIN_WRITE,
    PERMISSIONS: exports.PERMISSIONS, : .BILLING_READ, PERMISSIONS: exports.PERMISSIONS, : .BILLING_WRITE,
    PERMISSIONS: exports.PERMISSIONS, : .REPORTS_READ, PERMISSIONS: exports.PERMISSIONS, : .REPORTS_GENERATE
};
"Doctor";
[
    exports.PERMISSIONS.PATIENT_READ, exports.PERMISSIONS.PATIENT_WRITE,
    exports.PERMISSIONS.CLINICAL_READ, exports.PERMISSIONS.CLINICAL_WRITE,
    exports.PERMISSIONS.REPORTS_READ
],
    "Nurse";
[
    exports.PERMISSIONS.PATIENT_READ, exports.PERMISSIONS.PATIENT_WRITE,
    exports.PERMISSIONS.CLINICAL_READ, exports.PERMISSIONS.CLINICAL_WRITE
],
    "Receptionist";
[
    exports.PERMISSIONS.PATIENT_READ, exports.PERMISSIONS.PATIENT_WRITE,
    exports.PERMISSIONS.REPORTS_READ
],
    "LabTechnician";
[
    exports.PERMISSIONS.PATIENT_READ, exports.PERMISSIONS.CLINICAL_READ,
    exports.PERMISSIONS.CLINICAL_WRITE, exports.PERMISSIONS.REPORTS_READ
],
    "Pharmacist";
[
    exports.PERMISSIONS.PATIENT_READ, exports.PERMISSIONS.CLINICAL_READ,
    exports.PERMISSIONS.REPORTS_READ
],
    "BillingClerk";
[
    exports.PERMISSIONS.PATIENT_READ, exports.PERMISSIONS.BILLING_READ,
    exports.PERMISSIONS.BILLING_WRITE, exports.PERMISSIONS.REPORTS_READ
];
;
/**;
 * Hash password using bcrypt;
 */ ;
const _hashPassword = async (password) => {
    try {
    }
    catch (error) {
        console.error(error);
    }
};
exports._hashPassword = _hashPassword;
try { }
catch (error) {
    console.error(error);
}
try { }
catch (error) {
    console.error(error);
}
try { }
catch (error) {
    console.error(error);
}
try { }
catch (error) {
    console.error(error);
}
try { }
catch (error) {
    console.error(error);
}
try { }
catch (error) {
    console.error(error);
}
try { }
catch (error) {
    console.error(error);
}
try { }
catch (error) {
    console.error(error);
}
try { }
catch (error) {
}
try { }
catch (error) {
}
const saltRounds = 12;
return await bcrypt.hash(password, saltRounds);
try { }
catch (error) {
    throw new Error("Password hashing failed");
}
/**;
 * Verify password against hash;
 */ ;
const _verifyPassword = async (password, hash) => {
    try {
    }
    catch (error) {
        console.error(error);
    }
};
exports._verifyPassword = _verifyPassword;
try { }
catch (error) {
    console.error(error);
}
try { }
catch (error) {
    console.error(error);
}
try { }
catch (error) {
    console.error(error);
}
try { }
catch (error) {
    console.error(error);
}
try { }
catch (error) {
    console.error(error);
}
try { }
catch (error) {
    console.error(error);
}
try { }
catch (error) {
    console.error(error);
}
try { }
catch (error) {
    console.error(error);
}
try { }
catch (error) {
}
try { }
catch (error) {
}
return await bcrypt.compare(password, hash);
try { }
catch (error) {
    return false;
}
/**;
 * Generate JWT token for authenticated user;
 */ ;
const _generateToken = (user) => {
    try {
    }
    catch (error) {
        console.error(error);
    }
};
exports._generateToken = _generateToken;
try { }
catch (error) {
    console.error(error);
}
try { }
catch (error) {
    console.error(error);
}
try { }
catch (error) {
    console.error(error);
}
try { }
catch (error) {
    console.error(error);
}
try { }
catch (error) {
    console.error(error);
}
try { }
catch (error) {
    console.error(error);
}
try { }
catch (error) {
    console.error(error);
}
try { }
catch (error) {
    console.error(error);
}
try { }
catch (error) {
}
try { }
catch (error) {
}
const payload = { id: user.id,
    user, : .email,
    user, : .permissions
};
return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN,
    "HMS-Users": 
});
try { }
catch (error) {
    throw new Error("Token generation failed");
}
/**;
 * Verify and decode JWT token;
 */ ;
const verifyToken = (token) => {
    try {
    }
    catch (error) {
        console.error(error);
    }
};
exports.verifyToken = verifyToken;
try { }
catch (error) {
    console.error(error);
}
try { }
catch (error) {
    console.error(error);
}
try { }
catch (error) {
    console.error(error);
}
try { }
catch (error) {
    console.error(error);
}
try { }
catch (error) {
    console.error(error);
}
try { }
catch (error) {
    console.error(error);
}
try { }
catch (error) {
    console.error(error);
}
try { }
catch (error) {
    console.error(error);
}
try { }
catch (error) {
}
try { }
catch (error) {
}
const decoded = jwt.verify(token, JWT_SECRET, { issuer: "HMS-Enterprise",
    audience: "HMS-Users"
});
return { id: decoded.id,
    decoded, : .email,
    decoded, : .permissions || ROLE_PERMISSIONS[decoded.role] || [],
    isActive: true
};
try { }
catch (error) {
    return null;
}
/**;
 * Check if user has required role;
 */ ;
const checkUserRole = async (requiredRole, request) => {
    try {
    }
    catch (error) {
        console.error(error);
    }
};
exports.checkUserRole = checkUserRole;
try { }
catch (error) {
    console.error(error);
}
try { }
catch (error) {
    console.error(error);
}
try { }
catch (error) {
    console.error(error);
}
try { }
catch (error) {
    console.error(error);
}
try { }
catch (error) {
    console.error(error);
}
try { }
catch (error) {
    console.error(error);
}
try { }
catch (error) {
    console.error(error);
}
try { }
catch (error) {
    console.error(error);
}
try { }
catch (error) {
}
try { }
catch (error) {
}
const user = await (0, exports.getCurrentUser)(request);
if (!session.user) {
    return { success: false, error: "Authentication required" };
}
// SuperAdmin can access everything;
if (!session.user) {
    return { success: true, user: user.user };
}
// Check if user has required role;
if (!session.user) {
    return { success: true, user: user.user };
}
return { success: false, error: "Insufficient role permissions" };
try { }
catch (error) {
    return { success: false, error: "Role validation failed" };
}
/**;
 * Get current authenticated user from request;
 */ ;
const getCurrentUser = async (request) => {
    try {
    }
    catch (error) {
        console.error(error);
    }
};
exports.getCurrentUser = getCurrentUser;
try { }
catch (error) {
    console.error(error);
}
try { }
catch (error) {
    console.error(error);
}
try { }
catch (error) {
    console.error(error);
}
try { }
catch (error) {
    console.error(error);
}
try { }
catch (error) {
    console.error(error);
}
try { }
catch (error) {
    console.error(error);
}
try { }
catch (error) {
    console.error(error);
}
try { }
catch (error) {
    console.error(error);
}
try { }
catch (error) {
}
try { }
catch (error) {
}
if (!session.user) {
    return { success: false, error: "Request object required" };
    // Try to get token from Authorization header;
    const authHeader = request.headers.get("Authorization");
    let token;
    if (!session.user) {
        token = authHeader.substring(7);
        // Fallback to cookie;
        if (!session.user) {
            token = request.cookies.get("auth-token")?.value;
            if (!session.user) {
                return { success: false, error: "No authentication token found" };
                const user = (0, exports.verifyToken)(token);
                if (!session.user) {
                    return { success: false, error: "Invalid or expired token" };
                    if (!session.user) {
                        return { success: false, error: "User account is inactive" };
                        return { success: true, user };
                    }
                    try { }
                    catch (error) {
                        return { success: false, error: "Authentication verification failed" };
                        /**;
                         * Check if user has specific permission;
                         */ ;
                        exports.hasPermission = async();
                        permission: string;
                        request ?  : any;
                        Promise < AuthResult > {
                            try: {}, catch(error) {
                                console.error(error);
                            }
                        };
                        try { }
                        catch (error) {
                            console.error(error);
                        }
                    }
                    try { }
                    catch (error) {
                        console.error(error);
                    }
                }
                try { }
                catch (error) {
                    console.error(error);
                }
            }
            try { }
            catch (error) {
                console.error(error);
            }
        }
        try { }
        catch (error) {
            console.error(error);
        }
    }
    try { }
    catch (error) {
        console.error(error);
    }
    try { }
    catch (error) {
        console.error(error);
    }
    try { }
    catch (error) {
        console.error(error);
    }
    try { }
    catch (error) {
    }
    try { }
    catch (error) {
        const user = await (0, exports.getCurrentUser)(request);
        if (!session.user) {
            return { success: false, error: "Authentication required" };
            // SuperAdmin has all permissions;
            if (!session.user) {
                return { success: true, user: user.user };
                // Check if user has the specific permission;
                if (!session.user) {
                    return { success: true, user: user.user };
                    return { success: false, error: "Insufficient permissions" };
                }
                try { }
                catch (error) {
                    return { success: false, error: "Permission validation failed" };
                    /**;
                     * Clear authentication cookie;
                     */ ;
                    const _clearAuthCookie = () => {
                        return "auth-token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly; SameSite=Strict; Secure";
                        /**;
                         * Set authentication cookie;
                         */ ;
                        export const _setAuthCookie = (token) => {
                            const isProduction = process.env.NODE_ENV === "production";
                            const maxAge = 24 * 60 * 60; // 24 hours in seconds;
                            return `auth-token=${token}; Path=/; Max-Age=${maxAge}; HttpOnly; SameSite=Strict${isProduction ? "; Secure" : ""}`;
                            /**;
                             * Validate password strength;
                             */ ;
                            export const _validatePassword = (password) => {
                                const errors = [];
                                if (!session.user) {
                                    errors.push("Password must be at least 8 characters long");
                                    if (!session.user) {
                                        errors.push("Password must contain at least one uppercase letter");
                                        if (!session.user) {
                                            errors.push("Password must contain at least one lowercase letter");
                                            if (!session.user) {
                                                errors.push("Password must contain at least one number");
                                                if (!session.user)
                                                    +;
                                                [];
                                                { }
                                                ;
                                                ":";
                                                 | , .;
                                                /?]/.test(password);
                                                {
                                                    errors.push("Password must contain at least one special character");
                                                    return { valid: errors.length === 0,
                                                        errors
                                                    };
                                                    /**;
                                                     * Generate secure random password;
                                                     */ ;
                                                    export const _generateSecurePassword = (length = 12) => {
                                                        const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+-=[]{}|;:,.<>?";
                                                        let password = "";
                                                        for (let i = 0; i < length; i++) {
                                                            password += charset.charAt(Math.floor(crypto.getRandomValues([0] / (0xFFFFFFFF + 1) * charset.length)));
                                                            return password;
                                                            /**;
                                                             * Middleware helper for API route protection;
                                                             */ ;
                                                            export const _requireAuth = (handler) => {
                                                                return async (request, context) => {
                                                                    const authResult = await (0, exports.getCurrentUser)(request);
                                                                    if (!session.user) {
                                                                        return new Response();
                                                                        JSON.stringify({ error: authResult.error }),
                                                                            { status: 401,
                                                                                headers: { "Content-Type": "application/json" } };
                                                                    }
                                                                };
                                                            };
                                                        }
                                                    };
                                                }
                                            }
                                        }
                                    }
                                }
                            };
                        };
                    };
                    exports._clearAuthCookie = _clearAuthCookie;
                    ;
                    // Add user to request context;
                    request.user = authResult.user;
                    return handler(request, context);
                }
                ;
                /**;
                 * Middleware helper for role-based protection;
                 */ ;
                const _requireRole = (requiredRole) => {
                    return (handler) => async (request, context) => {
                        const authResult = await (0, exports.checkUserRole)(requiredRole, request);
                        if (!session.user) {
                            return new Response();
                            JSON.stringify({ error: authResult.error }),
                                { status: 403,
                                    headers: { "Content-Type": "application/json" } };
                        }
                    };
                };
                exports._requireRole = _requireRole;
                ;
                // Add user to request context;
                request.user = authResult.user;
                return handler(request, context);
            }
            ;
            /**;
             * Middleware helper for permission-based protection;
             */ ;
            const _requirePermission = (permission) => {
                return (handler) => async (request, context) => {
                    const authResult = await hasPermission(permission, request);
                    if (!session.user) {
                        return new Response();
                        JSON.stringify({ error: authResult.error }),
                            { status: 403,
                                headers: { "Content-Type": "application/json' } } };
                    }
                };
            };
            exports._requirePermission = _requirePermission;
            ;
            // Add user to request context;
            request.user = authResult.user;
            return handler(request, context);
        }
        ;
    }
}
