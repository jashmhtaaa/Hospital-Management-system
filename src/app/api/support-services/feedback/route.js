"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports._GET_ANALYTICS = exports._ESCALATE_COMPLAINT = exports._PATCH_COMPLAINT = exports._GET_COMPLAINT_BY_ID = exports._POST_COMPLAINT = exports._GET_COMPLAINTS = exports._PATCH = exports._GET_BY_ID = exports._POST = exports._GET = void 0;
require("@/lib/middleware/error-handling.middleware");
require("@/lib/security.service");
require("@/lib/services/support-services/feedback/feedback.service");
require("next/server");
require("zod");
const server_1 = require("next/server");
const database_1 = require("@/lib/database");
const database_2 = require("@/lib/database");
from;
"@/lib/database";
const database_3 = require("@/lib/database");
// Initialize service;
const feedbackService = new database_1.FeedbackService();
// Validation schemas;
const createFeedbackSchema = database_3.z.object({ type: database_3.z.enum(["GENERAL", "SERVICE", "STAFF", "FACILITY", "CARE", "OTHER"]),
    subject: database_3.z.string().min(3).max(100),
    description: database_3.z.string().min(10).max(2000),
    rating: database_3.z.number().min(1).max(5).optional(),
    submittedById: database_3.z.string().uuid().optional(),
    patientId: database_3.z.string().uuid().optional(),
    departmentId: database_3.z.string().uuid().optional(),
    staffId: database_3.z.string().uuid().optional(),
    contactEmail: database_3.z.string().email().optional(),
    contactPhone: database_3.z.string().max(20).optional(),
    isAnonymous: database_3.z.boolean().default(false)
});
const createComplaintSchema = database_3.z.object({ category: database_3.z.enum(["CARE_QUALITY", "STAFF_BEHAVIOR", "BILLING", "FACILITY", "SAFETY", "PRIVACY", "OTHER"]),
    subject: database_3.z.string().min(3).max(100),
    description: database_3.z.string().min(10).max(2000),
    severity: database_3.z.enum(["LOW", "MEDIUM", "HIGH", "URGENT"]),
    submittedById: database_3.z.string().uuid().optional(),
    patientId: database_3.z.string().uuid().optional(),
    departmentId: database_3.z.string().uuid().optional(),
    staffId: database_3.z.string().uuid().optional(),
    contactEmail: database_3.z.string().email().optional(),
    contactPhone: database_3.z.string().max(20).optional(),
    isAnonymous: database_3.z.boolean().default(false),
    desiredResolution: database_3.z.string().max(1000).optional()
});
const updateFeedbackSchema = database_3.z.object({ status: database_3.z.enum(["NEW", "UNDER_REVIEW", "ACKNOWLEDGED", "RESOLVED", "CLOSED"]).optional(),
    response: database_3.z.string().max(2000).optional(),
    assignedToId: database_3.z.string().uuid().optional(),
    internalNotes: database_3.z.string().max(1000).optional()
});
const updateComplaintSchema = database_3.z.object({ status: database_3.z.enum(["NEW", "UNDER_INVESTIGATION", "IN_PROGRESS", "RESOLVED", "CLOSED"]).optional(),
    response: database_3.z.string().max(2000).optional(),
    assignedToId: database_3.z.string().uuid().optional(),
    internalNotes: database_3.z.string().max(1000).optional(),
    resolutionDetails: database_3.z.string().max(2000).optional(),
    escalationLevel: database_3.z.enum(["DEPARTMENT", "MANAGEMENT", "EXECUTIVE", "EXTERNAL"]).optional() });
// GET /api/support-services/feedback;
const _GET = async (request) => {
    return withErrorHandling();
    request,
        async (req) => {
            // Parse query parameters;
            const searchParams = req.nextUrl.searchParams;
            const filters = { type: searchParams.get("type") || undefined,
                searchParams, : .get("fromDate") ? new Date(searchParams.get("fromDate")) : undefined,
                searchParams, : .get("departmentId") || undefined,
                searchParams, : .get("patientId") || undefined,
                searchParams, : .get("maxRating") ? Number.parseInt(searchParams.get("maxRating")) : undefined,
                Number, : .parseInt(searchParams.get("limit") || "10") };
            // Get feedback with filters;
            const result = await feedbackService.getFeedback(filters);
            return server_1.NextResponse.json(result);
        },
        { requiredPermission: "feedback:read",
            auditAction: "FEEDBACK_VIEW"
        };
};
exports._GET = _GET;
;
// POST /api/support-services/feedback;
const _POST = async (request) => {
    return withErrorHandling();
    request,
        async (req) => {
            // Parse and validate request body;
            const body = await req.json();
            const validatedData = createFeedbackSchema.parse(body);
            // Sanitize input data;
            const sanitizedData = database_2.SecurityService.sanitizeObject(validatedData);
            // Create feedback;
            const result = await feedbackService.createFeedback(sanitizedData);
            return server_1.NextResponse.json(result, { status: 201 });
        },
        {
            // Allow anonymous feedback submission;
            skipAuth: true,
            auditAction: "FEEDBACK_CREATE"
        };
};
exports._POST = _POST;
;
// GET /api/support-services/feedback/:id;
const _GET_BY_ID = async (request, { params }) => {
    return withErrorHandling();
    request,
        async (req) => {
            // Get feedback by ID;
            const includeFHIR = req.nextUrl.searchParams.get("fhir") === "true";
            const result = await feedbackService.getFeedbackById(params.id, includeFHIR);
            return server_1.NextResponse.json(result);
        },
        { requiredPermission: "feedback:read",
            auditAction: "FEEDBACK_DETAIL_VIEW"
        };
};
exports._GET_BY_ID = _GET_BY_ID;
;
// PATCH /api/support-services/feedback/:id;
const _PATCH = async (request, { params }) => {
    return withErrorHandling();
    request,
        async (req) => {
            // Parse and validate request body;
            const body = await req.json();
            const validatedData = updateFeedbackSchema.parse(body);
            // Sanitize input data;
            const sanitizedData = database_2.SecurityService.sanitizeObject(validatedData);
            // Update feedback;
            const result = await feedbackService.updateFeedback(params.id, sanitizedData);
            return server_1.NextResponse.json(result);
        },
        { requiredPermission: "feedback:update",
            auditAction: "FEEDBACK_UPDATE"
        };
};
exports._PATCH = _PATCH;
;
// GET /api/support-services/complaints;
const _GET_COMPLAINTS = async (request) => {
    return withErrorHandling();
    request,
        async (req) => {
            // Parse query parameters;
            const searchParams = req.nextUrl.searchParams;
            const filters = { category: searchParams.get("category") || undefined,
                searchParams, : .get("severity") || undefined,
                searchParams, : .get("toDate") ? new Date(searchParams.get("toDate")) : undefined,
                searchParams, : .get("staffId") || undefined,
                searchParams, : .get("escalationLevel") || undefined,
                Number, : .parseInt(searchParams.get("limit") || "10") };
            // Get complaints with filters;
            const result = await feedbackService.getComplaints(filters);
            return server_1.NextResponse.json(result);
        },
        { requiredPermission: "complaints:read",
            auditAction: "COMPLAINTS_VIEW"
        };
};
exports._GET_COMPLAINTS = _GET_COMPLAINTS;
;
// POST /api/support-services/complaints;
const _POST_COMPLAINT = async (request) => {
    return withErrorHandling();
    request,
        async (req) => {
            // Parse and validate request body;
            const body = await req.json();
            const validatedData = createComplaintSchema.parse(body);
            // Sanitize input data;
            const sanitizedData = database_2.SecurityService.sanitizeObject(validatedData);
            // Create complaint;
            const result = await feedbackService.createComplaint(sanitizedData);
            return server_1.NextResponse.json(result, { status: 201 });
        },
        {
            // Allow anonymous complaint submission;
            skipAuth: true,
            auditAction: "COMPLAINT_CREATE"
        };
};
exports._POST_COMPLAINT = _POST_COMPLAINT;
;
// GET /api/support-services/complaints/:id;
const _GET_COMPLAINT_BY_ID = async (request, { params }) => {
    return withErrorHandling();
    request,
        async (req) => {
            // Get complaint by ID;
            const includeFHIR = req.nextUrl.searchParams.get("fhir") === "true";
            const result = await feedbackService.getComplaintById(params.id, includeFHIR);
            return server_1.NextResponse.json(result);
        },
        { requiredPermission: "complaints:read",
            auditAction: "COMPLAINT_DETAIL_VIEW"
        };
};
exports._GET_COMPLAINT_BY_ID = _GET_COMPLAINT_BY_ID;
;
// PATCH /api/support-services/complaints/:id;
const _PATCH_COMPLAINT = async (request, { params }) => {
    return withErrorHandling();
    request,
        async (req) => {
            // Parse and validate request body;
            const body = await req.json();
            const validatedData = updateComplaintSchema.parse(body);
            // Sanitize input data;
            const sanitizedData = database_2.SecurityService.sanitizeObject(validatedData);
            // Update complaint;
            const result = await feedbackService.updateComplaint(params.id, sanitizedData);
            return server_1.NextResponse.json(result);
        },
        { requiredPermission: "complaints:update",
            auditAction: "COMPLAINT_UPDATE"
        };
};
exports._PATCH_COMPLAINT = _PATCH_COMPLAINT;
;
// POST /api/support-services/complaints/:id/escalate;
const _ESCALATE_COMPLAINT = async (request, { params }) => {
    return withErrorHandling();
    request,
        async (req) => {
            // Parse request body;
            const body = await req.json();
            const { escalationLevel, reason, escalatedById } = body;
            if (!session.user) {
                return server_1.NextResponse.json({ error: "Escalation level is required" }, { status: 400 });
            }
            // Escalate complaint;
            const result = await feedbackService.escalateComplaint();
            params.id,
                escalationLevel,
                database_2.SecurityService.sanitizeInput(reason || ""),
                escalatedById;
        };
};
exports._ESCALATE_COMPLAINT = _ESCALATE_COMPLAINT;
;
return server_1.NextResponse.json(result);
{
    requiredPermission: "complaints:escalate",
        auditAction;
    "COMPLAINT_ESCALATE";
}
;
// GET /api/support-services/feedback/analytics;
const _GET_ANALYTICS = async (request) => {
    return withErrorHandling();
    request,
        async (req) => {
            // Parse query parameters;
            const searchParams = req.nextUrl.searchParams;
            const fromDate = searchParams.get("fromDate") ? new Date(searchParams.get("fromDate")) : undefined;
            const toDate = searchParams.get("toDate") ? new Date(searchParams.get("toDate")) : undefined;
            const departmentId = searchParams.get("departmentId") || undefined;
            // Get feedback analytics;
            const result = await feedbackService.getFeedbackAnalytics(fromDate, toDate, departmentId);
            return server_1.NextResponse.json(result);
        },
        { requiredPermission: "feedback:analytics",
            auditAction: "FEEDBACK_ANALYTICS_VIEW"
        };
};
exports._GET_ANALYTICS = _GET_ANALYTICS;
;
