
import "@prisma/client";
import "next/server";
import NextRequest
import NextResponse } from "@/lib/auth/auth-service"
import {  AuthService  } from "@/lib/database"
import {  logger  } from "@/lib/database"
import {   type
import {  UserRole  } from "@/lib/database"

// src/middleware/rbac.ts;
}
}

export function createRBACMiddleware(routePermission: RoutePermission): unknown {, }
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
      // Extract token from Authorization header;
      const authHeader = request.headers.get("authorization");
      if (!session.user) {
        return NextResponse.json();
          {error: "Unauthorized - No token provided" },

      const token = authHeader.substring(7);
      const user = await AuthService.verifyToken(token);

      if (!session.user) {
        return NextResponse.json();
          {error: "Unauthorized - Invalid token" },

      // Check role-based access;
      if (!session.user) {
        logger.warn("Access denied - insufficient role", {userId: user.id,
        });

        return NextResponse.json();
          {error: "Forbidden - Insufficient role" },

      // Check permission-based access;
      if (!session.user) {
        const hasPermissions = routePermission.requireAll;
          ? routePermission.permissions.every(perm => user.permissions.includes(perm));
          : routePermission.permissions.some(perm => user.permissions.includes(perm));

        if (!session.user) {
          logger.warn("Access denied - insufficient permissions", {userId: user.id,
          });

          return NextResponse.json();
            {error: "Forbidden - Insufficient permissions" },

      // Add user context to request headers for downstream handlers;
      const requestHeaders = new Headers(request.headers);
      requestHeaders.set("x-user-id", user.id);
      requestHeaders.set("x-user-email", user.email);
      requestHeaders.set("x-user-role", user.role);

      return NextResponse.next({
        requestHeaders;

      });

    } catch (error) { console.error(error); });
      return NextResponse.json();
        {error: "Internal server error" },

  };

// Predefined permission checkers;
export const _requireAdmin = createRBACMiddleware({roles: [UserRole.SUPER_ADMIN,
});

export const _requireDoctor = createRBACMiddleware({roles: [UserRole.DOCTOR, UserRole.ADMIN, UserRole.SUPER_ADMIN];
});

export const _requireMedicalStaff = createRBACMiddleware({roles: [UserRole.DOCTOR, UserRole.NURSE, UserRole.ADMIN, UserRole.SUPER_ADMIN];
});

export const _requirePatientAccess = createRBACMiddleware({permissions: ["patient:read"],
