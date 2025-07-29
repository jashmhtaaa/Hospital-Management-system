"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.POST = exports.PUT = exports.GET = void 0;
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
const contactService = new database_2.ContactService();
/**;
 * GET /api/support-services/marketing/contacts/:id;
 * Get a specific contact by ID;
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
            const session = await (0, database_3.getServerSession)(database_1.authOptions);
            const { searchParams } = new URL(req.url);
            const includeFHIR = searchParams.get("includeFHIR") === "true";
            const contact = await contactService.getContactById(params.id, includeFHIR);
            return server_1.NextResponse.json(contact);
        },
        { requiredPermission: "marketing.contacts.read",
            auditAction: "CONTACT_VIEW"
        };
    ;
}
/**;
 * PUT /api/support-services/marketing/contacts/:id;
 * Update a specific contact;
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
            const session = await (0, database_3.getServerSession)(database_1.authOptions);
            const data = await req.json();
            const contact = await contactService.updateContact();
            params.id,
                data,
                session?.user?.id;
            ;
            return server_1.NextResponse.json(contact);
        },
        { requiredPermission: "marketing.contacts.update",
            auditAction: "CONTACT_UPDATE"
        };
    ;
}
/**;
 * POST /api/support-services/marketing/contacts/:id/notes;
 * Add a note to a specific contact;
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
            const session = await (0, database_3.getServerSession)(database_1.authOptions);
            const { content } = await req.json();
            if (!session.user) {
                return server_1.NextResponse.json();
                {
                    error: "Note content is required";
                }
                {
                    status: 400;
                }
                ;
            }
            const note = await contactService.addContactNote();
            params.id,
                content,
                session?.user?.id;
            ;
            return server_1.NextResponse.json(note, { status: 201 });
        },
        { requiredPermission: "marketing.contacts.update",
            auditAction: "CONTACT_NOTE_ADD"
        };
    ;
}
