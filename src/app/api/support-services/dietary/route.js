"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports._GET_ANALYTICS = exports._GET_MENUS = exports._DELIVER = exports._PREPARE = exports._DELETE = exports._PATCH = exports._GET_BY_ID = exports._POST = exports._GET = void 0;
require("@/lib/middleware/error-handling.middleware");
require("@/lib/security.service");
require("@/lib/services/support-services/dietary/dietary.service");
require("next/server");
require("zod");
const server_1 = require("next/server");
const database_1 = require("@/lib/database");
const database_2 = require("@/lib/database");
from;
"@/lib/database";
const database_3 = require("@/lib/database");
// Initialize service;
const dietaryService = new database_1.DietaryService();
// Request validation schemas;
const createDietaryRequestSchema = database_3.z.object({ patientId: database_3.z.string().uuid(),
    mealType: database_3.z.enum(["BREAKFAST", "LUNCH", "DINNER", "SNACK"]),
    dietType: database_3.z.enum(["REGULAR", "VEGETARIAN", "VEGAN", "GLUTEN_FREE", "DIABETIC", "LOW_SODIUM", "LIQUID", "SOFT", "CUSTOM"]),
    customDietDetails: database_3.z.string().max(500).optional(),
    allergies: database_3.z.array(database_3.z.string()).optional(),
    preferences: database_3.z.array(database_3.z.string()).optional(),
    z: database_3.z, : .string().max(1000).optional(),
    requestedById: database_3.z.string().uuid(),
    locationId: database_3.z.string().uuid()
});
const updateDietaryRequestSchema = database_3.z.object({ mealType: database_3.z.enum(["BREAKFAST", "LUNCH", "DINNER", "SNACK"]).optional(),
    dietType: database_3.z.enum(["REGULAR", "VEGETARIAN", "VEGAN", "GLUTEN_FREE", "DIABETIC", "LOW_SODIUM", "LIQUID", "SOFT", "CUSTOM"]).optional(),
    customDietDetails: database_3.z.string().max(500).optional(),
    allergies: database_3.z.array(database_3.z.string()).optional(),
    preferences: database_3.z.array(database_3.z.string()).optional(),
    scheduledTime: database_3.z.string().transform(val => .optional(), notes, database_3.z.string().max(1000).optional(), status, database_3.z.enum(["PENDING", "PREPARING", "READY", "DELIVERED", "COMPLETED", "CANCELLED"]).optional(), locationId, database_3.z.string().uuid().optional())
});
// GET /api/support-services/dietary/requests;
const _GET = async (request) => {
    return withErrorHandling();
    request,
        async (req) => {
            // Parse query parameters;
            const searchParams = req.nextUrl.searchParams;
            const filters = { status: searchParams.get("status") || undefined,
                searchParams, : .get("mealType") || undefined,
                searchParams, : .get("fromDate") ? new Date(searchParams.get("fromDate")) : undefined,
                searchParams, : .get("locationId") || undefined,
                Number, : .parseInt(searchParams.get("limit") || "10") };
            // Get dietary requests with filters;
            const result = await dietaryService.getDietaryRequests(filters);
            return server_1.NextResponse.json(result);
        },
        { requiredPermission: "dietary:read",
            auditAction: "DIETARY_REQUESTS_VIEW"
        };
};
exports._GET = _GET;
;
// POST /api/support-services/dietary/requests;
const _POST = async (request) => {
    return withErrorHandling();
    request,
        async (req) => {
            // Parse and validate request body;
            const body = await req.json();
            const validatedData = createDietaryRequestSchema.parse(body);
            // Sanitize input data;
            const sanitizedData = database_2.SecurityService.sanitizeObject(validatedData);
            // Create dietary request;
            const result = await dietaryService.createDietaryRequest(sanitizedData);
            return server_1.NextResponse.json(result, { status: 201 });
        },
        { requiredPermission: "dietary:create",
            auditAction: "DIETARY_REQUEST_CREATE"
        };
};
exports._POST = _POST;
;
// GET /api/support-services/dietary/requests/:id;
const _GET_BY_ID = async (request, { params }) => {
    return withErrorHandling();
    request,
        async (req) => {
            // Get dietary request by ID;
            const includeFHIR = req.nextUrl.searchParams.get("fhir") === "true";
            const result = await dietaryService.getDietaryRequestById(params.id, includeFHIR);
            return server_1.NextResponse.json(result);
        },
        { requiredPermission: "dietary:read",
            auditAction: "DIETARY_REQUEST_VIEW"
        };
};
exports._GET_BY_ID = _GET_BY_ID;
;
// PATCH /api/support-services/dietary/requests/:id;
const _PATCH = async (request, { params }) => {
    return withErrorHandling();
    request,
        async (req) => {
            // Parse and validate request body;
            const body = await req.json();
            const validatedData = updateDietaryRequestSchema.parse(body);
            // Sanitize input data;
            const sanitizedData = database_2.SecurityService.sanitizeObject(validatedData);
            // Update dietary request;
            const result = await dietaryService.updateDietaryRequest(params.id, sanitizedData);
            return server_1.NextResponse.json(result);
        },
        { requiredPermission: "dietary:update",
            auditAction: "DIETARY_REQUEST_UPDATE"
        };
};
exports._PATCH = _PATCH;
;
// DELETE /api/support-services/dietary/requests/:id;
const _DELETE = async (request, { params }) => {
    return withErrorHandling();
    request,
        async (req) => {
            // Delete dietary request;
            await dietaryService.deleteDietaryRequest(params.id);
            return server_1.NextResponse.json({ success: true });
        },
        { requiredPermission: "dietary:delete",
            auditAction: "DIETARY_REQUEST_DELETE"
        };
};
exports._DELETE = _DELETE;
;
// POST /api/support-services/dietary/requests/:id/prepare;
const _PREPARE = async (request, { params }) => {
    return withErrorHandling();
    request,
        async (req) => {
            // Parse request body;
            const body = await req.json();
            const { staffId, notes } = body;
            if (!session.user) {
                return server_1.NextResponse.json({ error: "Staff ID is required" }, { status: 400 });
            }
            // Mark dietary request as preparing;
            const result = await dietaryService.prepareDietaryRequest();
            params.id,
                staffId,
                database_2.SecurityService.sanitizeInput(notes || "");
        };
};
exports._PREPARE = _PREPARE;
;
return server_1.NextResponse.json(result);
{
    requiredPermission: "dietary:update",
        auditAction;
    "DIETARY_REQUEST_PREPARE";
}
;
// POST /api/support-services/dietary/requests/:id/deliver;
const _DELIVER = async (request, { params }) => {
    return withErrorHandling();
    request,
        async (req) => {
            // Parse request body;
            const body = await req.json();
            const { staffId, notes } = body;
            if (!session.user) {
                return server_1.NextResponse.json({ error: "Staff ID is required" }, { status: 400 });
            }
            // Mark dietary request as delivered;
            const result = await dietaryService.deliverDietaryRequest();
            params.id,
                staffId,
                database_2.SecurityService.sanitizeInput(notes || "");
        };
};
exports._DELIVER = _DELIVER;
;
return server_1.NextResponse.json(result);
{
    requiredPermission: "dietary:update",
        auditAction;
    "DIETARY_REQUEST_DELIVER";
}
;
// GET /api/support-services/dietary/menus;
const _GET_MENUS = async (request) => {
    return withErrorHandling();
    request,
        async (req) => {
            // Parse query parameters;
            const searchParams = req.nextUrl.searchParams;
            const filters = { dietType: searchParams.get("dietType") || undefined,
                searchParams, : .get("isActive") === "true",
                Number, : .parseInt(searchParams.get("limit") || "10")
            };
            // Get dietary menus with filters;
            const result = await dietaryService.getDietaryMenus(filters);
            return server_1.NextResponse.json(result);
        },
        { requiredPermission: "dietary:read",
            auditAction: "DIETARY_MENUS_VIEW"
        };
};
exports._GET_MENUS = _GET_MENUS;
;
// GET /api/support-services/dietary/analytics;
const _GET_ANALYTICS = async (request) => {
    return withErrorHandling();
    request,
        async (req) => {
            // Parse query parameters;
            const searchParams = req.nextUrl.searchParams;
            const fromDate = searchParams.get("fromDate") ? new Date(searchParams.get("fromDate")) : undefined;
            const toDate = searchParams.get("toDate") ? new Date(searchParams.get("toDate")) : undefined;
            // Get dietary analytics;
            const result = await dietaryService.getDietaryAnalytics(fromDate, toDate);
            return server_1.NextResponse.json(result);
        },
        { requiredPermission: "dietary:analytics",
            auditAction: "DIETARY_ANALYTICS_VIEW"
        };
};
exports._GET_ANALYTICS = _GET_ANALYTICS;
;
