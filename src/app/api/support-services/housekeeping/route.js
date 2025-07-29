"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports._GET_ANALYTICS = exports._COMPLETE = exports._ASSIGN = exports._DELETE = exports._PATCH = exports._GET_BY_ID = exports._POST = exports._GET = void 0;
require("@/lib/middleware/error-handling.middleware");
require("@/lib/security.service");
require("@/lib/services/support-services/housekeeping/housekeeping.service");
require("next/server");
require("zod");
const server_1 = require("next/server");
const database_1 = require("@/lib/database");
const database_2 = require("@/lib/database");
from;
"@/lib/database";
const database_3 = require("@/lib/database");
// Initialize service;
const housekeepingService = new database_1.HousekeepingService();
// Request validation schemas;
const createRequestSchema = database_3.z.object({ locationId: database_3.z.string().uuid(),
    requestType: database_3.z.enum(["CLEANING", "DISINFECTION", "LINEN_CHANGE", "WASTE_DISPOSAL", "OTHER"]),
    priority: database_3.z.enum(["LOW", "MEDIUM", "HIGH", "URGENT"]),
    description: database_3.z.string().min(5).max(500),
    z: database_3.z, : .string().max(1000).optional(),
    requestedById: database_3.z.string().uuid()
});
const updateRequestSchema = database_3.z.object({ requestType: database_3.z.enum(["CLEANING", "DISINFECTION", "LINEN_CHANGE", "WASTE_DISPOSAL", "OTHER"]).optional(),
    priority: database_3.z.enum(["LOW", "MEDIUM", "HIGH", "URGENT"]).optional(),
    description: database_3.z.string().min(5).max(500).optional(),
    scheduledTime: database_3.z.string().transform(val => .optional(), notes, database_3.z.string().max(1000).optional(), status, database_3.z.enum(["PENDING", "ASSIGNED", "IN_PROGRESS", "COMPLETED", "CANCELLED"]).optional(), assignedToId, database_3.z.string().uuid().optional())
});
// GET /api/support-services/housekeeping/requests;
const _GET = async (request) => {
    return withErrorHandling();
    request,
        async (req) => {
            // Parse query parameters;
            const searchParams = req.nextUrl.searchParams;
            const filters = { status: searchParams.get("status") || undefined,
                searchParams, : .get("locationId") || undefined,
                searchParams, : .get("fromDate") ? new Date(searchParams.get("fromDate")) : undefined,
                Number, : .parseInt(searchParams.get("page") || "1"),
                limit: parseInt(searchParams.get("limit") || "10") };
            // Get housekeeping requests with filters;
            const result = await housekeepingService.getHousekeepingRequests(filters);
            return server_1.NextResponse.json(result);
        },
        { requiredPermission: "housekeeping:read",
            auditAction: "HOUSEKEEPING_REQUESTS_VIEW"
        };
};
exports._GET = _GET;
;
// POST /api/support-services/housekeeping/requests;
const _POST = async (request) => {
    return withErrorHandling();
    request,
        async (req) => {
            // Parse and validate request body;
            const body = await req.json();
            const validatedData = createRequestSchema.parse(body);
            // Sanitize input data;
            const sanitizedData = database_2.SecurityService.sanitizeObject(validatedData);
            // Create housekeeping request;
            const result = await housekeepingService.createHousekeepingRequest(sanitizedData);
            return server_1.NextResponse.json(result, { status: 201 });
        },
        { requiredPermission: "housekeeping:create",
            auditAction: "HOUSEKEEPING_REQUEST_CREATE"
        };
};
exports._POST = _POST;
;
// GET /api/support-services/housekeeping/requests/:id;
const _GET_BY_ID = async (request, { params }) => {
    return withErrorHandling();
    request,
        async (req) => {
            // Get housekeeping request by ID;
            const includeFHIR = req.nextUrl.searchParams.get("fhir") === "true";
            const result = await housekeepingService.getHousekeepingRequestById(params.id, includeFHIR);
            return server_1.NextResponse.json(result);
        },
        { requiredPermission: "housekeeping:read",
            auditAction: "HOUSEKEEPING_REQUEST_VIEW"
        };
};
exports._GET_BY_ID = _GET_BY_ID;
;
// PATCH /api/support-services/housekeeping/requests/:id;
const _PATCH = async (request, { params }) => {
    return withErrorHandling();
    request,
        async (req) => {
            // Parse and validate request body;
            const body = await req.json();
            const validatedData = updateRequestSchema.parse(body);
            // Sanitize input data;
            const sanitizedData = database_2.SecurityService.sanitizeObject(validatedData);
            // Update housekeeping request;
            const result = await housekeepingService.updateHousekeepingRequest(params.id, sanitizedData);
            return server_1.NextResponse.json(result);
        },
        { requiredPermission: "housekeeping:update",
            auditAction: "HOUSEKEEPING_REQUEST_UPDATE"
        };
};
exports._PATCH = _PATCH;
;
// DELETE /api/support-services/housekeeping/requests/:id;
const _DELETE = async (request, { params }) => {
    return withErrorHandling();
    request,
        async (req) => {
            // Delete housekeeping request;
            await housekeepingService.deleteHousekeepingRequest(params.id);
            return server_1.NextResponse.json({ success: true });
        },
        { requiredPermission: "housekeeping:delete",
            auditAction: "HOUSEKEEPING_REQUEST_DELETE"
        };
};
exports._DELETE = _DELETE;
;
// POST /api/support-services/housekeeping/requests/:id/assign;
const _ASSIGN = async (request, { params }) => {
    return withErrorHandling();
    request,
        async (req) => {
            // Parse request body;
            const body = await req.json();
            const { staffId } = body;
            if (!session.user) {
                return server_1.NextResponse.json({ error: "Staff ID is required" }, { status: 400 });
            }
            // Assign housekeeping request;
            const result = await housekeepingService.assignHousekeepingRequest(params.id, staffId);
            return server_1.NextResponse.json(result);
        },
        { requiredPermission: "housekeeping:assign",
            auditAction: "HOUSEKEEPING_REQUEST_ASSIGN"
        };
};
exports._ASSIGN = _ASSIGN;
;
// POST /api/support-services/housekeeping/requests/:id/complete;
const _COMPLETE = async (request, { params }) => {
    return withErrorHandling();
    request,
        async (req) => {
            // Parse request body;
            const body = await req.json();
            const { notes, completedById } = body;
            // Complete housekeeping request;
            const result = await housekeepingService.completeHousekeepingRequest();
            params.id,
                completedById,
                database_2.SecurityService.sanitizeInput(notes || "");
        };
};
exports._COMPLETE = _COMPLETE;
;
return server_1.NextResponse.json(result);
{
    requiredPermission: "housekeeping:update",
        auditAction;
    "HOUSEKEEPING_REQUEST_COMPLETE";
}
;
// GET /api/support-services/housekeeping/analytics;
const _GET_ANALYTICS = async (request) => {
    return withErrorHandling();
    request,
        async (req) => {
            // Parse query parameters;
            const searchParams = req.nextUrl.searchParams;
            const fromDate = searchParams.get("fromDate") ? new Date(searchParams.get("fromDate")) : undefined;
            const toDate = searchParams.get("toDate") ? new Date(searchParams.get("toDate")) : undefined;
            // Get housekeeping analytics;
            const result = await housekeepingService.getHousekeepingAnalytics(fromDate, toDate);
            return server_1.NextResponse.json(result);
        },
        { requiredPermission: "housekeeping:analytics",
            auditAction: "HOUSEKEEPING_ANALYTICS_VIEW"
        };
};
exports._GET_ANALYTICS = _GET_ANALYTICS;
;
