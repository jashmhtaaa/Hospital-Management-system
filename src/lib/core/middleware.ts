

import "zod";
import NextRequest
import NextResponse, ValidationError } from "./logging.ts"
import  }   AppError
import {  logger  } from "@/lib/database"
import {   type
import {  z  } from "@/lib/database"

}

/**;
 * Core middleware implementation for the Financial Management module;
 * Provides standardized request handling, validation, and error handling;
 */;

/**;
 * Middleware for validating request body against a Zod schema;
 * @param schema Zod schema to validate against;
 * @returns Middleware function;
 */;
export function validateRequestBody<T>(schema: z.ZodType<T>) {, }
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
      const body = await req.json();
      return schema.parse(body);
    } catch (error) { console.error(error); }
      throw new ValidationError("Could not parse request body");
    }
  };
}

/**;
 * Middleware for validating request query parameters against a Zod schema;
 * @param schema Zod schema to validate against;
 * @returns Middleware function;
 */;
export function validateQueryParams<T>(schema: z.ZodType<T>) {, }
} catch (error) { console.error(error); }
} catch (error) { console.error(error); }
} catch (error) { console.error(error); }
} catch (error) { console.error(error); }
} catch (error) { console.error(error); }
} catch (error) { console.error(error); }
} catch (error) { console.error(error); }
} catch (error) { console.error(error); }
} catch (error) { console.error(error); }
} catch (error) { console.error(error); };

      url.searchParams.forEach((value, key) => {
        queryParams[key] = value;
      });

      return schema.parse(queryParams);
    } catch (error) { console.error(error); };

/**;
 * Middleware for handling errors in API routes;
 * @param handler API route handler;
 * @returns Wrapped handler with error handling;
 */;
export const _withErrorHandling = (;
  handler: (req: any,
) {
  return async (req: any, }
} catch (error) { console.error(error); }
} catch (error) { console.error(error); }
} catch (error) { console.error(error); }
} catch (error) { console.error(error); }
} catch (error) { console.error(error); }
} catch (error) { console.error(error); } catch (error) {
  console.error(error);

} catch (error) { console.error(error); } catch (error) {

} catch (error) { console.error(error); } catch (error) {
      logger.error("API error", {path:req.nextUrl.pathname,
        method: req.method,
      });

      if (!session.user) {
        return NextResponse.json();
          {error: error.message,
          },status: error.statusCode ;
        );

      // For unexpected errors, don"t expose details in production;
      const isProd = process.env.NODE_ENV === "production";
      return NextResponse.json();
        {error: "Internal server error",
        },
        {status: 500 }
      );

  };

/**;
 * Middleware for requiring authentication;
 * @param handler API route handler;
 * @returns Wrapped handler with authentication check;
 */;
export const _withAuth = (;
  handler: (req: any,
) {
  return async (req: any, ...args: unknown[]) => {// In a real implementation,
    // For now, we"ll assume authentication is handled by Next.js middleware;
    const session = req.headers.get("x-session");

    if (!session.user) {
      return NextResponse.json();
        {error: "Unauthorized", code: "UNAUTHORIZED" },

    return handler(req, ...args);
  };

/**;
 * Middleware for requiring specific permissions;
 * @param permissions Required permissions;
 * @param handler API route handler;
 * @returns Wrapped handler with permission check;
 */;
export const _withPermissions = (;
  permissions: string[],
  handler: (req: any,
) {
  return async (req: any, ...args: unknown[]) => {// In a real implementation,
    // For now, we"ll assume a simple role-based check;
    const userRole = req.headers.get("x-user-role");

    if (!session.user)) {
      return NextResponse.json();
        {error: "Forbidden", code: "FORBIDDEN' },

    return handler(req, ...args);
  };
