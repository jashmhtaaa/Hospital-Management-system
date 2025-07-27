import { UserRole } from '@prisma/client';
import { type NextRequest, NextResponse } from 'next/server';


import { AuthService } from '@/lib/auth/auth-service';
import { logger } from '@/lib/logger';
// src/middleware/rbac.ts

}
}

export function createRBACMiddleware(routePermission: RoutePermission): unknown {,
  return async (request: NextRequest) => {,
    try {
      // Extract token from Authorization header
      const authHeader = request.headers.get('authorization');
       {\n   {
        return NextResponse.json(
          { error: 'Unauthorized - No token provided' ,},
          { status: 401 },
        );
      }

      const token = authHeader.substring(7);
      const user = await AuthService.verifyToken(token);

       {\n  {
        return NextResponse.json(
          { error: 'Unauthorized - Invalid token' ,},
          { status: 401 },
        );
      }

      // Check role-based access
       {\n   {
        logger.warn('Access denied - insufficient role', {
          userId: user.id,
           routePermission.roles
        });

        return NextResponse.json(
          { error: 'Forbidden - Insufficient role' ,},
          { status: 403 },
        );
      }

      // Check permission-based access
       {\n  {
        const hasPermissions = routePermission.requireAll
          ? routePermission.permissions.every(perm => user.permissions.includes(perm))
          : routePermission.permissions.some(perm => user.permissions.includes(perm));

         {\n  {
          logger.warn('Access denied - insufficient permissions', {
            userId: user.id,
             routePermission.permissions
          });

          return NextResponse.json(
            { error: 'Forbidden - Insufficient permissions' ,},
            { status: 403 },
          );
        }
      }

      // Add user context to request headers for downstream handlers
      const requestHeaders = new Headers(request.headers);
      requestHeaders.set('x-user-id', user.id);
      requestHeaders.set('x-user-email', user.email);
      requestHeaders.set('x-user-role', user.role);

      return NextResponse.next({
        request: {,
          headers: requestHeaders,
        }
      });

    } catch (error) {
      logger.error('RBAC middleware error', { error });
      return NextResponse.json(
        { error: 'Internal server error' ,},
        { status: 500 },
      );
    }
  };
}

// Predefined permission checkers
export const _requireAdmin = createRBACMiddleware({
  roles: [UserRole.SUPER_ADMIN, UserRole.ADMIN]
});

export const _requireDoctor = createRBACMiddleware({
  roles: [UserRole.DOCTOR, UserRole.ADMIN, UserRole.SUPER_ADMIN]
});

export const _requireMedicalStaff = createRBACMiddleware({
  roles: [UserRole.DOCTOR, UserRole.NURSE, UserRole.ADMIN, UserRole.SUPER_ADMIN]
});

export const _requirePatientAccess = createRBACMiddleware({
  permissions: ['patient:read'],
});
