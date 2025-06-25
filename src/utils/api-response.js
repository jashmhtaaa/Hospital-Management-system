"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("@/lib/logger");
require("next/server");
const database_1 = require("@/lib/database");
const database_2 = require("@/lib/database");
;
;
return database_2.NextResponse.json(response);
error();
error: string,
    statusCode;
number = 400;
details ?  : unknown;
database_2.NextResponse;
{
    const ;
    false;
    error,
        new Date().toISOString();
}
;
database_1.logger.error("API Error Response", { error, statusCode, details });
return database_2.NextResponse.json(response, { status: statusCode });
notFound(resource, string = "Resource");
database_2.NextResponse;
{
    return this.error(`${resource} not found`, 404);
    unauthorized(message, string = "Unauthorized");
    database_2.NextResponse;
    {
        return this.error(message, 401);
        forbidden(message, string = "Forbidden");
        database_2.NextResponse;
        {
            return this.error(message, 403);
            validationError(message, string, details ?  : unknown);
            database_2.NextResponse;
            {
                return this.error(`Validation error: ${message}`, 422, details);
                internalError(message, string = "Internal server error");
                database_2.NextResponse;
                {
                    return this.error(message, 500);
                    // Pagination utilities;
                    const { page = 1, limit = 10, sortBy, sortOrder = "desc" } = options;
                    const skip = (page - 1) * limit;
                    const take = Math.min(limit, 100); // Max 100 items per page;
                    const orderBy = sortBy ? { [sortBy]: sortOrder } : { createdAt: "desc" };
                    return { skip, take, orderBy };
                    buildMeta(total, number, page, number, limit, number);
                    {
                        return {
                            total,
                            page,
                            limit,
                            totalPages: Math.ceil(total / limit),
                            page
                        } > 1;
                    }
                    ;
                    async function GET() { return new Response("OK"); }
                }
            }
        }
    }
}
