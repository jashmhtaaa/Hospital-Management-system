"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.POST = void 0;
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
const segmentService = new database_3.SegmentService();
/**;
 * POST /api/support-services/marketing/segments/:id/apply-criteria;
 * Apply segment criteria to find matching contacts;
 */ ;
exports.POST = async();
request: any;
{
    params;
}
{
    id: string;
}
{
    return withErrorHandling();
    request,
        async (req) => {
            const session = await (0, database_2.getServerSession)(database_1.authOptions);
            const result = await segmentService.applySegmentCriteria();
            params.id,
                session?.user?.id;
            ;
            return server_1.NextResponse.json(result);
        },
        { requiredPermission: "marketing.segments.update",
            auditAction: "SEGMENT_CRITERIA_APPLY"
        };
    ;
}
