"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports._GET_ANALYTICS = exports._GET_ASSETS = exports._COMPLETE = exports._START = exports._ASSIGN = exports._DELETE = exports._PATCH = exports._GET_BY_ID = exports._POST = exports._GET = void 0;
require("@/lib/middleware/error-handling.middleware");
require("@/lib/security.service");
require("@/lib/services/support-services/maintenance/maintenance.service");
require("next/server");
require("zod");
const server_1 = require("next/server");
const database_1 = require("@/lib/database");
const database_2 = require("@/lib/database");
from;
"@/lib/database";
const database_3 = require("@/lib/database");
// Initialize service;
const maintenanceService = new database_1.MaintenanceService();
// Request validation schemas;
const createRequestSchema = database_3.z.object({ assetId: database_3.z.string().uuid(),
    requestType: database_3.z.enum(["PREVENTIVE", "CORRECTIVE", "EMERGENCY", "INSPECTION", "INSTALLATION", "OTHER"]),
    priority: database_3.z.enum(["LOW", "MEDIUM", "HIGH", "URGENT"]),
    description: database_3.z.string().min(5).max(500),
    z: database_3.z, : .string().max(1000).optional(),
    requestedById: database_3.z.string().uuid(),
    departmentId: database_3.z.string().uuid().optional(),
    estimatedDuration: database_3.z.number().min(1).optional(), // in minutes;
});
const updateRequestSchema = database_3.z.object({ requestType: database_3.z.enum(["PREVENTIVE", "CORRECTIVE", "EMERGENCY", "INSPECTION", "INSTALLATION", "OTHER"]).optional(),
    priority: database_3.z.enum(["LOW", "MEDIUM", "HIGH", "URGENT"]).optional(),
    description: database_3.z.string().min(5).max(500).optional(),
    scheduledTime: database_3.z.string().transform(val => .optional(), notes, database_3.z.string().max(1000).optional(), status, database_3.z.enum(["PENDING", "ASSIGNED", "IN_PROGRESS", "ON_HOLD", "COMPLETED", "CANCELLED"]).optional(), assignedToId, database_3.z.string().uuid().optional(), estimatedDuration, database_3.z.number().min(1).optional(), database_3.z.string().uuid(), quantity, database_3.z.number().min(1))
}), optional;
();
;
// GET /api/support-services/maintenance/requests;
const _GET = async (request) => {
    return withErrorHandling();
    request,
        async (req) => {
            // Parse query parameters;
            const searchParams = req.nextUrl.searchParams;
            const filters = { status: searchParams.get("status") || undefined,
                searchParams, : .get("assetId") || undefined,
                searchParams, : .get("departmentId") || undefined,
                searchParams, : .get("toDate") ? new Date(searchParams.get("toDate")) : undefined,
                Number, : .parseInt(searchParams.get("page") || "1"),
                limit: parseInt(searchParams.get("limit") || "10") };
            // Get maintenance requests with filters;
            const result = await maintenanceService.getMaintenanceRequests(filters);
            return server_1.NextResponse.json(result);
        },
        { requiredPermission: "maintenance:read",
            auditAction: "MAINTENANCE_REQUESTS_VIEW"
        };
};
exports._GET = _GET;
;
// POST /api/support-services/maintenance/requests;
const _POST = async (request) => {
    return withErrorHandling();
    request,
        async (req) => {
            // Parse and validate request body;
            const body = await req.json();
            const validatedData = createRequestSchema.parse(body);
            // Sanitize input data;
            const sanitizedData = database_2.SecurityService.sanitizeObject(validatedData);
            // Create maintenance request;
            const result = await maintenanceService.createMaintenanceRequest(sanitizedData);
            return server_1.NextResponse.json(result, { status: 201 });
        },
        { requiredPermission: "maintenance:create",
            auditAction: "MAINTENANCE_REQUEST_CREATE"
        };
};
exports._POST = _POST;
;
// GET /api/support-services/maintenance/requests/:id;
const _GET_BY_ID = async (request, { params }) => {
    return withErrorHandling();
    request,
        async (req) => {
            // Get maintenance request by ID;
            const includeFHIR = req.nextUrl.searchParams.get("fhir") === "true";
            const result = await maintenanceService.getMaintenanceRequestById(params.id, includeFHIR);
            return server_1.NextResponse.json(result);
        },
        { requiredPermission: "maintenance:read",
            auditAction: "MAINTENANCE_REQUEST_VIEW"
        };
};
exports._GET_BY_ID = _GET_BY_ID;
;
// PATCH /api/support-services/maintenance/requests/:id;
const _PATCH = async (request, { params }) => {
    return withErrorHandling();
    request,
        async (req) => {
            // Parse and validate request body;
            const body = await req.json();
            const validatedData = updateRequestSchema.parse(body);
            // Sanitize input data;
            const sanitizedData = database_2.SecurityService.sanitizeObject(validatedData);
            // Update maintenance request;
            const result = await maintenanceService.updateMaintenanceRequest(params.id, sanitizedData);
            return server_1.NextResponse.json(result);
        },
        { requiredPermission: "maintenance:update",
            auditAction: "MAINTENANCE_REQUEST_UPDATE"
        };
};
exports._PATCH = _PATCH;
;
// DELETE /api/support-services/maintenance/requests/:id;
const _DELETE = async (request, { params }) => {
    return withErrorHandling();
    request,
        async (req) => {
            // Delete maintenance request;
            await maintenanceService.deleteMaintenanceRequest(params.id);
            return server_1.NextResponse.json({ success: true });
        },
        { requiredPermission: "maintenance:delete",
            auditAction: "MAINTENANCE_REQUEST_DELETE"
        };
};
exports._DELETE = _DELETE;
;
// POST /api/support-services/maintenance/requests/:id/assign;
const _ASSIGN = async (request, { params }) => {
    return withErrorHandling();
    request,
        async (req) => {
            // Parse request body;
            const body = await req.json();
            const { technicianId } = body;
            if (!session.user) {
                return server_1.NextResponse.json({ error: "Technician ID is required" }, { status: 400 });
            }
            // Assign maintenance request;
            const result = await maintenanceService.assignMaintenanceRequest(params.id, technicianId);
            return server_1.NextResponse.json(result);
        },
        { requiredPermission: "maintenance:assign",
            auditAction: "MAINTENANCE_REQUEST_ASSIGN"
        };
};
exports._ASSIGN = _ASSIGN;
;
// POST /api/support-services/maintenance/requests/:id/start;
const _START = async (request, { params }) => {
    return withErrorHandling();
    request,
        async (req) => {
            // Parse request body;
            const body = await req.json();
            const { technicianId, notes } = body;
            if (!session.user) {
                return server_1.NextResponse.json({ error: "Technician ID is required" }, { status: 400 });
            }
            // Start maintenance work;
            const result = await maintenanceService.startMaintenanceWork();
            params.id,
                technicianId,
                database_2.SecurityService.sanitizeInput(notes || "");
        };
};
exports._START = _START;
;
return server_1.NextResponse.json(result);
{
    requiredPermission: "maintenance:update",
        auditAction;
    "MAINTENANCE_WORK_START";
}
;
// POST /api/support-services/maintenance/requests/:id/complete;
const _COMPLETE = async (request, { params }) => {
    return withErrorHandling();
    request,
        async (req) => {
            // Parse request body;
            const body = await req.json();
            const { technicianId, notes, partsUsed, laborHours } = body;
            if (!session.user) {
                return server_1.NextResponse.json({ error: "Technician ID is required" }, { status: 400 });
            }
            // Complete maintenance request;
            const result = await maintenanceService.completeMaintenanceRequest();
            params.id,
                technicianId,
                database_2.SecurityService.sanitizeInput(notes || ""),
                partsUsed || [],
                laborHours || 0;
        };
};
exports._COMPLETE = _COMPLETE;
;
return server_1.NextResponse.json(result);
{
    requiredPermission: "maintenance:update",
        auditAction;
    "MAINTENANCE_REQUEST_COMPLETE";
}
;
// GET /api/support-services/maintenance/assets;
const _GET_ASSETS = async (request) => {
    return withErrorHandling();
    request,
        async (req) => {
            // Parse query parameters;
            const searchParams = req.nextUrl.searchParams;
            const filters = { type: searchParams.get("type") || undefined,
                searchParams, : .get("locationId") || undefined,
                Number, : .parseInt(searchParams.get("page") || "1"),
                limit: parseInt(searchParams.get("limit") || "10")
            };
            // Get maintenance assets with filters;
            const result = await maintenanceService.getMaintenanceAssets(filters);
            return server_1.NextResponse.json(result);
        },
        { requiredPermission: "maintenance:read",
            auditAction: "MAINTENANCE_ASSETS_VIEW"
        };
};
exports._GET_ASSETS = _GET_ASSETS;
;
// GET /api/support-services/maintenance/analytics;
const _GET_ANALYTICS = async (request) => {
    return withErrorHandling();
    request,
        async (req) => {
            // Parse query parameters;
            const searchParams = req.nextUrl.searchParams;
            const fromDate = searchParams.get("fromDate") ? new Date(searchParams.get("fromDate")) : undefined;
            const toDate = searchParams.get("toDate") ? new Date(searchParams.get("toDate")) : undefined;
            // Get maintenance analytics;
            const result = await maintenanceService.getMaintenanceAnalytics(fromDate, toDate);
            return server_1.NextResponse.json(result);
        },
        { requiredPermission: "maintenance:analytics",
            auditAction: "MAINTENANCE_ANALYTICS_VIEW"
        };
};
exports._GET_ANALYTICS = _GET_ANALYTICS;
;
