"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PUT = exports.GET = void 0;
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
 * GET /api/support-services/marketing/segments/:id;
 * Get a specific segment by ID;
 */ ;
exports.GET = async();
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
            const { searchParams } = new URL(req.url);
            const includeMembers = searchParams.get("includeMembers") === "true";
            const segment = await segmentService.getSegmentById(params.id, includeMembers);
            return server_1.NextResponse.json(segment);
        },
        { requiredPermission: "marketing.segments.read",
            auditAction: "SEGMENT_VIEW"
        };
    ;
}
/**;
 * PUT /api/support-services/marketing/segments/:id;
 * Update a specific segment;
 */ ;
exports.PUT = async();
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
            const data = await req.json();
            const segment = await segmentService.updateSegment();
            params.id,
                data,
                session?.user?.id;
            ;
            return server_1.NextResponse.json(segment);
        },
        { requiredPermission: "marketing.segments.update",
            auditAction: "SEGMENT_UPDATE"
        };
    ;
}
