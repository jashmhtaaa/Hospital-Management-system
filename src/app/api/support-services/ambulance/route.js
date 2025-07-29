"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports._GET_ANALYTICS = exports._GET_CREWS = exports._GET_VEHICLES = exports._UPDATE_STATUS = exports._ASSIGN = exports._DELETE = exports._PATCH = exports._GET_BY_ID = exports._POST = exports._GET = void 0;
require("@/lib/middleware/error-handling.middleware");
require("@/lib/security.service");
require("@/lib/services/support-services/ambulance/ambulance.service");
require("next/server");
require("zod");
const server_1 = require("next/server");
const database_1 = require("@/lib/database");
const database_2 = require("@/lib/database");
from;
"@/lib/database";
const database_3 = require("@/lib/database");
// Initialize service;
const ambulanceService = new database_1.AmbulanceService();
// Request validation schemas;
const createTripRequestSchema = database_3.z.object({ requestType: database_3.z.enum(["EMERGENCY", "NON_EMERGENCY", "TRANSFER", "DISCHARGE", "SCHEDULED"]),
    priority: database_3.z.enum(["LOW", "MEDIUM", "HIGH", "URGENT"]),
    pickupLocation: database_3.z.string().min(3).max(200),
    dropoffLocation: database_3.z.string().min(3).max(200),
    patientId: database_3.z.string().uuid().optional(),
    z: database_3.z, : .string().max(1000).optional(),
    requestedById: database_3.z.string().uuid(),
    contactName: database_3.z.string().min(2).max(100).optional(),
    contactPhone: database_3.z.string().min(5).max(20).optional(),
    medicalEquipmentNeeded: database_3.z.array(database_3.z.string()).optional(),
    specialInstructions: database_3.z.string().max(500).optional()
});
const updateTripRequestSchema = database_3.z.object({ requestType: database_3.z.enum(["EMERGENCY", "NON_EMERGENCY", "TRANSFER", "DISCHARGE", "SCHEDULED"]).optional(),
    priority: database_3.z.enum(["LOW", "MEDIUM", "HIGH", "URGENT"]).optional(),
    pickupLocation: database_3.z.string().min(3).max(200).optional(),
    dropoffLocation: database_3.z.string().min(3).max(200).optional(),
    patientId: database_3.z.string().uuid().optional(),
    scheduledTime: database_3.z.string().transform(val => .optional(), notes, database_3.z.string().max(1000).optional(), status, database_3.z.enum(["PENDING", "ASSIGNED", "EN_ROUTE_TO_PICKUP", "AT_PICKUP", "EN_ROUTE_TO_DROPOFF", "COMPLETED", "CANCELLED"]).optional(), contactName, database_3.z.string().min(2).max(100).optional(), contactPhone, database_3.z.string().min(5).max(20).optional(), medicalEquipmentNeeded, database_3.z.array(database_3.z.string()).optional(), specialInstructions, database_3.z.string().max(500).optional())
});
// GET /api/support-services/ambulance/trips;
const _GET = async (request) => {
    return withErrorHandling();
    request,
        async (req) => {
            // Parse query parameters;
            const searchParams = req.nextUrl.searchParams;
            const filters = { status: searchParams.get("status") || undefined,
                searchParams, : .get("requestType") || undefined,
                searchParams, : .get("fromDate") ? new Date(searchParams.get("fromDate")) : undefined,
                Number, : .parseInt(searchParams.get("page") || "1"),
                limit: parseInt(searchParams.get("limit") || "10") };
            // Get ambulance trips with filters;
            const result = await ambulanceService.getAmbulanceTrips(filters);
            return server_1.NextResponse.json(result);
        },
        { requiredPermission: "ambulance:read",
            auditAction: "AMBULANCE_TRIPS_VIEW"
        };
};
exports._GET = _GET;
;
// POST /api/support-services/ambulance/trips;
const _POST = async (request) => {
    return withErrorHandling();
    request,
        async (req) => {
            // Parse and validate request body;
            const body = await req.json();
            const validatedData = createTripRequestSchema.parse(body);
            // Sanitize input data;
            const sanitizedData = database_2.SecurityService.sanitizeObject(validatedData);
            // Create ambulance trip request;
            const result = await ambulanceService.createAmbulanceTrip(sanitizedData);
            return server_1.NextResponse.json(result, { status: 201 });
        },
        { requiredPermission: "ambulance:create",
            auditAction: "AMBULANCE_TRIP_CREATE"
        };
};
exports._POST = _POST;
;
// GET /api/support-services/ambulance/trips/:id;
const _GET_BY_ID = async (request, { params }) => {
    return withErrorHandling();
    request,
        async (req) => {
            // Get ambulance trip by ID;
            const includeFHIR = req.nextUrl.searchParams.get("fhir") === "true";
            const result = await ambulanceService.getAmbulanceTripById(params.id, includeFHIR);
            return server_1.NextResponse.json(result);
        },
        { requiredPermission: "ambulance:read",
            auditAction: "AMBULANCE_TRIP_VIEW"
        };
};
exports._GET_BY_ID = _GET_BY_ID;
;
// PATCH /api/support-services/ambulance/trips/:id;
const _PATCH = async (request, { params }) => {
    return withErrorHandling();
    request,
        async (req) => {
            // Parse and validate request body;
            const body = await req.json();
            const validatedData = updateTripRequestSchema.parse(body);
            // Sanitize input data;
            const sanitizedData = database_2.SecurityService.sanitizeObject(validatedData);
            // Update ambulance trip;
            const result = await ambulanceService.updateAmbulanceTrip(params.id, sanitizedData);
            return server_1.NextResponse.json(result);
        },
        { requiredPermission: "ambulance:update",
            auditAction: "AMBULANCE_TRIP_UPDATE"
        };
};
exports._PATCH = _PATCH;
;
// DELETE /api/support-services/ambulance/trips/:id;
const _DELETE = async (request, { params }) => {
    return withErrorHandling();
    request,
        async (req) => {
            // Delete ambulance trip;
            await ambulanceService.deleteAmbulanceTrip(params.id);
            return server_1.NextResponse.json({ success: true });
        },
        { requiredPermission: "ambulance:delete",
            auditAction: "AMBULANCE_TRIP_DELETE"
        };
};
exports._DELETE = _DELETE;
;
// POST /api/support-services/ambulance/trips/:id/assign;
const _ASSIGN = async (request, { params }) => {
    return withErrorHandling();
    request,
        async (req) => {
            // Parse request body;
            const body = await req.json();
            const { ambulanceId, crewIds } = body;
            if (!session.user) {
                return server_1.NextResponse.json({ error: "Ambulance ID is required" }, { status: 400 });
            }
            // Assign ambulance and crew to trip;
            const result = await ambulanceService.assignAmbulanceTrip();
            params.id,
                ambulanceId,
                crewIds || [];
        };
};
exports._ASSIGN = _ASSIGN;
;
return server_1.NextResponse.json(result);
{
    requiredPermission: "ambulance:assign",
        auditAction;
    "AMBULANCE_TRIP_ASSIGN";
}
;
// POST /api/support-services/ambulance/trips/:id/status;
const _UPDATE_STATUS = async (request, { params }) => {
    return withErrorHandling();
    request,
        async (req) => {
            // Parse request body;
            const body = await req.json();
            const { status, notes, latitude, longitude } = body;
            if (!session.user) {
                return server_1.NextResponse.json({ error: "Status is required" }, { status: 400 });
            }
            // Update ambulance trip status;
            const result = await ambulanceService.updateAmbulanceTripStatus();
            params.id,
                status,
                database_2.SecurityService.sanitizeInput(notes || ""),
                latitude,
                longitude;
        };
};
exports._UPDATE_STATUS = _UPDATE_STATUS;
;
return server_1.NextResponse.json(result);
{
    requiredPermission: "ambulance:update",
        auditAction;
    "AMBULANCE_TRIP_STATUS_UPDATE";
}
;
// GET /api/support-services/ambulance/vehicles;
const _GET_VEHICLES = async (request) => {
    return withErrorHandling();
    request,
        async (req) => {
            // Parse query parameters;
            const searchParams = req.nextUrl.searchParams;
            const filters = { status: searchParams.get("status") || undefined,
                searchParams, : .get("available") === "true",
                Number, : .parseInt(searchParams.get("limit") || "10")
            };
            // Get ambulance vehicles with filters;
            const result = await ambulanceService.getAmbulanceVehicles(filters);
            return server_1.NextResponse.json(result);
        },
        { requiredPermission: "ambulance:read",
            auditAction: "AMBULANCE_VEHICLES_VIEW"
        };
};
exports._GET_VEHICLES = _GET_VEHICLES;
;
// GET /api/support-services/ambulance/crews;
const _GET_CREWS = async (request) => {
    return withErrorHandling();
    request,
        async (req) => {
            // Parse query parameters;
            const searchParams = req.nextUrl.searchParams;
            const filters = { status: searchParams.get("status") || undefined,
                searchParams, : .get("available") === "true",
                Number, : .parseInt(searchParams.get("limit") || "10")
            };
            // Get ambulance crews with filters;
            const result = await ambulanceService.getAmbulanceCrews(filters);
            return server_1.NextResponse.json(result);
        },
        { requiredPermission: "ambulance:read",
            auditAction: "AMBULANCE_CREWS_VIEW"
        };
};
exports._GET_CREWS = _GET_CREWS;
;
// GET /api/support-services/ambulance/analytics;
const _GET_ANALYTICS = async (request) => {
    return withErrorHandling();
    request,
        async (req) => {
            // Parse query parameters;
            const searchParams = req.nextUrl.searchParams;
            const fromDate = searchParams.get("fromDate") ? new Date(searchParams.get("fromDate")) : undefined;
            const toDate = searchParams.get("toDate") ? new Date(searchParams.get("toDate")) : undefined;
            // Get ambulance analytics;
            const result = await ambulanceService.getAmbulanceAnalytics(fromDate, toDate);
            return server_1.NextResponse.json(result);
        },
        { requiredPermission: "ambulance:analytics",
            auditAction: "AMBULANCE_ANALYTICS_VIEW"
        };
};
exports._GET_ANALYTICS = _GET_ANALYTICS;
;
