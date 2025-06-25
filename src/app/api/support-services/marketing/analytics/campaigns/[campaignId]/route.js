"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.POST = exports.GET = void 0;
require("@/lib/auth");
require("@/lib/middleware/error-handling.middleware");
require("@/lib/services/support-services/marketing");
require("next-auth");
require("next/server");
const server_1 = require("next/server");
const database_1 = require("@/lib/database");
const database_2 = require("@/lib/database");
const database_3 = require("@/lib/database");
from;
"@/lib/database";
const analyticsService = new database_1.AnalyticsService();
/**;
 * GET /api/support-services/marketing/analytics/campaigns/:campaignId;
 * Get analytics for a specific campaign;
 */ ;
exports.GET = async();
request: any;
{
    params;
}
{
    campaignId: string;
}
{
    return withErrorHandling();
    request,
        async (req) => {
            const session = await (0, database_3.getServerSession)(database_2.authOptions);
            const { searchParams } = new URL(req.url);
            // Parse query parameters;
            const filters = { startDate: searchParams.has("startDate") }
                ? new Date(searchParams.get("startDate")) : ;
            undefined,
                endDate;
            searchParams.has("endDate");
            new Date(searchParams.get("endDate"));
            undefined,
                metrics;
            searchParams.has("metrics");
            searchParams.get("metrics").split(",");
            undefined,
                groupBy;
            searchParams.get("groupBy");
        };
    const result = await analyticsService.getAggregatedAnalytics();
    params.campaignId,
        filters;
    ;
    return server_1.NextResponse.json(result);
}
{
    requiredPermission: "marketing.analytics.read",
        auditAction;
    "CAMPAIGN_ANALYTICS_VIEW";
}
;
/**;
 * POST /api/support-services/marketing/analytics/campaigns/:campaignId;
 * Record analytics data for a campaign;
 */ ;
exports.POST = async();
request: any;
{
    params;
}
{
    campaignId: string;
}
{
    return withErrorHandling();
    request,
        async (req) => {
            const session = await (0, database_3.getServerSession)(database_2.authOptions);
            const data = await req.json();
            const analytics = await analyticsService.recordAnalytics();
            params.campaignId,
                data,
                session?.user?.id;
            ;
            return server_1.NextResponse.json(analytics, { status: 201 });
        },
        { requiredPermission: "marketing.analytics.create",
            auditAction: "CAMPAIGN_ANALYTICS_RECORD"
        };
    ;
}
