// src/middleware/rbac.ts
import { NextRequest, NextResponse } from 'next/server';
import { AuthService } from '@/lib/auth/auth-service';
import { UserRole } from '@prisma/client';
import { logger } from '@/lib/logger';

export interface RoutePermission {
  roles?: UserRole[];
  permissions?: string[];
  requireAll?: boolean; // If true, user must have ALL permissions
}

export function createRBACMiddleware(routePermission: RoutePermission) {
  return async (request: NextRequest) => {
    try {
      // Extract token from Authorization header
      const authHeader = request.headers.get('authorization');
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return NextResponse.json(
          { error: 'Unauthorized - No token provided' },
          { status: 401 }
        );
      }

      const token = authHeader.substring(7);
      const user = await AuthService.verifyToken(token);

      if (!user) {
        return NextResponse.json(
          { error: 'Unauthorized - Invalid token' },
          { status: 401 }
        );
      }

      // Check role-based access
      if (routePermission.roles && !routePermission.roles.includes(user.role)) {
        logger.warn('Access denied - insufficient role', {
          userId: user.id,
          userRole: user.role,
          requiredRoles: routePermission.roles
        });
        
        return NextResponse.json(
          { error: 'Forbidden - Insufficient role' },
          { status: 403 }
        );
      }

      // Check permission-based access
      if (routePermission.permissions && routePermission.permissions.length > 0) {
        const hasPermissions = routePermission.requireAll
          ? routePermission.permissions.every(perm => user.permissions.includes(perm))
          : routePermission.permissions.some(perm => user.permissions.includes(perm));

        if (!hasPermissions) {
          logger.warn('Access denied - insufficient permissions', {
            userId: user.id,
            userPermissions: user.permissions,
            requiredPermissions: routePermission.permissions
          });
          
          return NextResponse.json(
            { error: 'Forbidden - Insufficient permissions' },
            { status: 403 }
          );
        }
      }

      // Add user context to request headers for downstream handlers
      const requestHeaders = new Headers(request.headers);
      requestHeaders.set('x-user-id', user.id);
      requestHeaders.set('x-user-email', user.email);
      requestHeaders.set('x-user-role', user.role);

      return NextResponse.next({
        request: {
          headers: requestHeaders
        }
      });

    } catch (error) {
      logger.error('RBAC middleware error', { error });
      return NextResponse.json(
        { error: 'Internal server error' },
        { status: 500 }
      );
    }
  };
}

// Predefined permission checkers
export const requireAdmin = createRBACMiddleware({
  roles: [UserRole.SUPER_ADMIN, UserRole.ADMIN]
});

export const requireDoctor = createRBACMiddleware({
  roles: [UserRole.DOCTOR, UserRole.ADMIN, UserRole.SUPER_ADMIN]
});

export const requireMedicalStaff = createRBACMiddleware({
  roles: [UserRole.DOCTOR, UserRole.NURSE, UserRole.ADMIN, UserRole.SUPER_ADMIN]
});

export const requirePatientAccess = createRBACMiddleware({
  permissions: ['patient:read']
});
