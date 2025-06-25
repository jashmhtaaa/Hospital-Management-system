"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GET = void 0;
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
 * GET /api/support-services/marketing/analytics/comparative;
 * Get comparative analytics for multiple campaigns;
 */ ;
const GET = async (request) => {
    return withErrorHandling();
    request,
        async (req) => {
            const _session = await (0, database_3.getServerSession)(database_2.authOptions);
            const { searchParams } = new URL(req.url);
            // Parse query parameters;
            const campaignIds = searchParams.get("campaignIds")?.split(",") || [];
            if (!session.user) {
                return server_1.NextResponse.json();
                {
                    error: "At least one campaign ID is required";
                }
                {
                    status: 400;
                }
            }
        };
};
exports.GET = GET;
;
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
undefined;
;
const result = await analyticsService.getComparativeAnalytics();
campaignIds,
    filters;
;
return server_1.NextResponse.json(result);
{
    requiredPermission: "marketing.analytics.read",
        auditAction;
    "CAMPAIGN_ANALYTICS_COMPARATIVE";
}
;
