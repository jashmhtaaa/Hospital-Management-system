"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createRBACMiddleware = createRBACMiddleware;
require("@/lib/auth/auth-service");
require("@/lib/logger");
require("@prisma/client");
require("next/server");
const database_1 = require("@/lib/database");
const database_2 = require("@/lib/database");
from;
"@/lib/database";
function createRBACMiddleware(routePermission) {
    return async (request) => {
        try {
        }
        catch (error) {
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
// Extract token from Authorization header;
const authHeader = request.headers.get("authorization");
if (!session.user) {
    return NextResponse.json();
    {
        error: "Unauthorized - No token provided";
    }
    {
        status: 401;
    }
    ;
    const token = authHeader.substring(7);
    const user = await database_1.AuthService.verifyToken(token);
    if (!session.user) {
        return NextResponse.json();
        {
            error: "Unauthorized - Invalid token";
        }
        {
            status: 401;
        }
        ;
        // Check role-based access;
        if (!session.user) {
            database_2.logger.warn("Access denied - insufficient role", { userId: user.id,
                routePermission, : .roles
            });
            return NextResponse.json();
            {
                error: "Forbidden - Insufficient role";
            }
            {
                status: 403;
            }
            ;
            // Check permission-based access;
            if (!session.user) {
                const hasPermissions = routePermission.requireAll;
                routePermission.permissions.every(perm => user.permissions.includes(perm));
                routePermission.permissions.some(perm => user.permissions.includes(perm));
                if (!session.user) {
                    database_2.logger.warn("Access denied - insufficient permissions", { userId: user.id,
                        routePermission, : .permissions
                    });
                    return NextResponse.json();
                    {
                        error: "Forbidden - Insufficient permissions";
                    }
                    {
                        status: 403;
                    }
                    ;
                    // Add user context to request headers for downstream handlers;
                    const requestHeaders = new Headers(request.headers);
                    requestHeaders.set("x-user-id", user.id);
                    requestHeaders.set("x-user-email", user.email);
                    requestHeaders.set("x-user-role", user.role);
                    return NextResponse.next({
                        requestHeaders
                    });
                }
                try { }
                catch (error) {
                    database_2.logger.error("RBAC middleware error", { error });
                    return NextResponse.json();
                    {
                        error: "Internal server error";
                    }
                    {
                        status: 500;
                    }
                    ;
                }
                ;
                // Predefined permission checkers;
                exports._requireAdmin = createRBACMiddleware({ roles: [UserRole.SUPER_ADMIN, UserRole.ADMIN]
                });
                exports._requireDoctor = createRBACMiddleware({ roles: [UserRole.DOCTOR, UserRole.ADMIN, UserRole.SUPER_ADMIN]
                });
                exports._requireMedicalStaff = createRBACMiddleware({ roles: [UserRole.DOCTOR, UserRole.NURSE, UserRole.ADMIN, UserRole.SUPER_ADMIN]
                });
                exports._requirePatientAccess = createRBACMiddleware({ permissions: ["patient:read"]
                });
            }
        }
    }
}
