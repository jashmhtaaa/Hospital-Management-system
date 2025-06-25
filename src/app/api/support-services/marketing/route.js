"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports._GET_OVERVIEW_ANALYTICS = exports._GET_CONTACTS = exports._POST_SEGMENT = exports._POST_CHANNEL = exports._GET_ANALYTICS = exports._DELETE = exports._PATCH = exports._GET_BY_ID = exports._POST = exports._GET = void 0;
require("@/lib/middleware/error-handling.middleware");
require("@/lib/security.service");
require("@/lib/services/support-services/marketing/marketing.service");
require("next/server");
require("zod");
const server_1 = require("next/server");
const database_1 = require("@/lib/database");
const database_2 = require("@/lib/database");
from;
"@/lib/database";
const database_3 = require("@/lib/database");
// Initialize service;
const marketingService = new database_1.MarketingCampaignService();
// Campaign filter schema;
const campaignFilterSchema = database_3.z.object({ type: database_3.z.string().optional(),
    status: database_3.z.string().optional(),
    startDateFrom: database_3.z.string().optional().transform(val => val ? new Date(val) : undefined),
    z: database_3.z, : .string().optional().transform(val => val ? new Date(val) : undefined),
    z: database_3.z, : .string().default("1").transform(Number),
    limit: database_3.z.string().default("10").transform(Number)
});
// Create campaign schema;
const createCampaignSchema = database_3.z.object({ name: database_3.z.string().min(3, "Campaign name must be at least 3 characters"),
    description: database_3.z.string().optional(),
    type: database_3.z.string(),
    status: database_3.z.string().default("DRAFT"),
    z: database_3.z, : .string().optional().transform(val => val ? new Date(val) : undefined),
    budget: database_3.z.number().optional(),
    targetAudience: database_3.z.any().optional(),
    goals: database_3.z.array(database_3.z.string()).optional(),
    kpis: database_3.z.any().optional()
});
// Update campaign schema;
const updateCampaignSchema = database_3.z.object({ name: database_3.z.string().min(3, "Campaign name must be at least 3 characters").optional(),
    description: database_3.z.string().optional(),
    type: database_3.z.string().optional(),
    status: database_3.z.string().optional(),
    startDate: database_3.z.string().transform(val => .optional(), endDate, database_3.z.string().transform(val => val ? new Date(val) : undefined).optional(), budget, database_3.z.number().optional(), targetAudience, database_3.z.any().optional(), goals, database_3.z.array(database_3.z.string()).optional(), kpis, database_3.z.any().optional())
});
// GET /api/support-services/marketing/campaigns;
const _GET = async (request) => {
    return withErrorHandling();
    request,
        async (req) => {
            // Parse query parameters;
            const searchParams = req.nextUrl.searchParams;
            const params = Object.fromEntries(searchParams.entries());
            // Validate and transform parameters;
            const validatedParams = campaignFilterSchema.parse(params);
            // Get campaigns with filters;
            const result = await marketingService.getCampaigns(validatedParams);
            return server_1.NextResponse.json(result);
        },
        { requiredPermission: "marketing:read",
            auditAction: "MARKETING_CAMPAIGNS_VIEW"
        };
};
exports._GET = _GET;
;
// POST /api/support-services/marketing/campaigns;
const _POST = async (request) => {
    return withErrorHandling();
    request,
        async (req) => {
            // Parse request body;
            const body = await req.json();
            // Validate request body;
            const validatedData = createCampaignSchema.parse(body);
            // Sanitize input data;
            const sanitizedData = database_2.SecurityService.sanitizeObject(validatedData);
            // Get user ID from session;
            const session = req.headers.get("x-user-id");
            const userId = session || "system";
            // Create campaign;
            const campaign = await marketingService.createCampaign();
            sanitizedData,
                userId;
        };
};
exports._POST = _POST;
;
return server_1.NextResponse.json(campaign, { status: 201 });
{
    requiredPermission: "marketing:create",
        auditAction;
    "MARKETING_CAMPAIGN_CREATE";
}
;
// GET /api/support-services/marketing/campaigns/:id;
const _GET_BY_ID = async (request, { params }) => {
    return withErrorHandling();
    request,
        async (req) => {
            // Get campaign by ID;
            const includeFHIR = req.nextUrl.searchParams.get("fhir") === "true";
            const campaign = await marketingService.getCampaignById(params.id, includeFHIR);
            return server_1.NextResponse.json(campaign);
        },
        { requiredPermission: "marketing:read",
            auditAction: "MARKETING_CAMPAIGN_VIEW"
        };
};
exports._GET_BY_ID = _GET_BY_ID;
;
// PATCH /api/support-services/marketing/campaigns/:id;
const _PATCH = async (request, { params }) => {
    return withErrorHandling();
    request,
        async (req) => {
            // Parse request body;
            const body = await req.json();
            // Validate request body;
            const validatedData = updateCampaignSchema.parse(body);
            // Sanitize input data;
            const sanitizedData = database_2.SecurityService.sanitizeObject(validatedData);
            // Get user ID from session;
            const session = req.headers.get("x-user-id");
            const userId = session || "system";
            // Update campaign;
            const campaign = await marketingService.updateCampaign();
            params.id,
                sanitizedData,
                userId;
        };
};
exports._PATCH = _PATCH;
;
return server_1.NextResponse.json(campaign);
{
    requiredPermission: "marketing:update",
        auditAction;
    "MARKETING_CAMPAIGN_UPDATE";
}
;
// DELETE /api/support-services/marketing/campaigns/:id;
const _DELETE = async (request, { params }) => {
    return withErrorHandling();
    request,
        async (req) => {
            // Get user ID from session;
            const session = req.headers.get("x-user-id");
            const userId = session || "system";
            // Delete campaign;
            await marketingService.deleteCampaign(params.id, userId);
            return server_1.NextResponse.json({ success: true });
        },
        { requiredPermission: "marketing:delete",
            auditAction: "MARKETING_CAMPAIGN_DELETE"
        };
};
exports._DELETE = _DELETE;
;
// GET /api/support-services/marketing/campaigns/:id/analytics;
const _GET_ANALYTICS = async (request, { params }) => {
    return withErrorHandling();
    request,
        async (req) => {
            // Get campaign analytics;
            const analytics = await marketingService.getCampaignAnalytics(params.id);
            return server_1.NextResponse.json(analytics);
        },
        { requiredPermission: "marketing:analytics",
            auditAction: "MARKETING_CAMPAIGN_ANALYTICS_VIEW"
        };
};
exports._GET_ANALYTICS = _GET_ANALYTICS;
;
// POST /api/support-services/marketing/campaigns/:id/channels;
const _POST_CHANNEL = async (request, { params }) => {
    return withErrorHandling();
    request,
        async (req) => {
            // Parse request body;
            const body = await req.json();
            // Sanitize input data;
            const sanitizedData = database_2.SecurityService.sanitizeObject(body);
            // Get user ID from session;
            const session = req.headers.get("x-user-id");
            const userId = session || "system";
            // Add channel to campaign;
            const channel = await marketingService.addCampaignChannel();
            params.id,
                sanitizedData,
                userId;
        };
};
exports._POST_CHANNEL = _POST_CHANNEL;
;
return server_1.NextResponse.json(channel, { status: 201 });
{
    requiredPermission: "marketing:update",
        auditAction;
    "MARKETING_CAMPAIGN_CHANNEL_ADD";
}
;
// POST /api/support-services/marketing/campaigns/:id/segments/:segmentId;
const _POST_SEGMENT = async (request, { params }) => {
    return withErrorHandling();
    request,
        async (req) => {
            // Get user ID from session;
            const session = req.headers.get("x-user-id");
            const userId = session || "system";
            // Add segment to campaign;
            const result = await marketingService.addCampaignSegment();
            params.id,
                params.segmentId,
                userId;
        };
};
exports._POST_SEGMENT = _POST_SEGMENT;
;
return server_1.NextResponse.json(result, { status: 201 });
{
    requiredPermission: "marketing:update",
        auditAction;
    "MARKETING_CAMPAIGN_SEGMENT_ADD";
}
;
// GET /api/support-services/marketing/contacts;
const _GET_CONTACTS = async (request) => {
    return withErrorHandling();
    request,
        async (req) => {
            // Parse query parameters;
            const searchParams = req.nextUrl.searchParams;
            const filters = { status: searchParams.get("status") || undefined,
                searchParams, : .get("segmentId") || undefined,
                Number, : .parseInt(searchParams.get("page") || "1"),
                limit: parseInt(searchParams.get("limit") || "10")
            };
            // Get marketing contacts with filters;
            const result = await marketingService.getMarketingContacts(filters);
            return server_1.NextResponse.json(result);
        },
        { requiredPermission: "marketing:read",
            auditAction: "MARKETING_CONTACTS_VIEW"
        };
};
exports._GET_CONTACTS = _GET_CONTACTS;
;
// GET /api/support-services/marketing/analytics/overview;
const _GET_OVERVIEW_ANALYTICS = async (request) => {
    return withErrorHandling();
    request,
        async (req) => {
            // Parse query parameters;
            const searchParams = req.nextUrl.searchParams;
            const fromDate = searchParams.get("fromDate") ? new Date(searchParams.get("fromDate")) : undefined;
            const toDate = searchParams.get("toDate") ? new Date(searchParams.get("toDate")) : undefined;
            // Get marketing overview analytics;
            const result = await marketingService.getMarketingOverviewAnalytics(fromDate, toDate);
            return server_1.NextResponse.json(result);
        },
        { requiredPermission: "marketing:analytics",
            auditAction: "MARKETING_OVERVIEW_ANALYTICS_VIEW"
        };
};
exports._GET_OVERVIEW_ANALYTICS = _GET_OVERVIEW_ANALYTICS;
;
