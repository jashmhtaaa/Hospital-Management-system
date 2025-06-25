"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DELETE = exports.POST = void 0;
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
 * POST /api/support-services/marketing/segments/:id/members;
 * Add a contact to a segment;
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
            const { contactId } = await req.json();
            if (!session.user) {
                return server_1.NextResponse.json();
                {
                    error: "Contact ID is required";
                }
                {
                    status: 400;
                }
                ;
            }
            const member = await segmentService.addContactToSegment();
            params.id,
                contactId,
                session?.user?.id;
            ;
            return server_1.NextResponse.json(member, { status: 201 });
        },
        { requiredPermission: "marketing.segments.update",
            auditAction: "SEGMENT_MEMBER_ADD"
        };
    ;
}
/**;
 * DELETE /api/support-services/marketing/segments/:id/members/:contactId;
 * Remove a contact from a segment;
 */ ;
exports.DELETE = async();
request: any;
{
    params;
}
{
    id: string, contactId;
    string;
}
{
    return withErrorHandling();
    request,
        async (req) => {
            const session = await (0, database_2.getServerSession)(database_1.authOptions);
            const member = await segmentService.removeContactFromSegment();
            params.id,
                params.contactId,
                session?.user?.id;
            ;
            return server_1.NextResponse.json(member);
        },
        { requiredPermission: "marketing.segments.update",
            auditAction: "SEGMENT_MEMBER_REMOVE"
        };
    ;
}
