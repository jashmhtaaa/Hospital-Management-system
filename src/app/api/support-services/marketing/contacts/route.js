"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.POST = exports.GET = void 0;
require("@/lib/auth");
require("@/lib/middleware/error-handling.middleware");
require("@/lib/services/support-services/marketing");
require("next-auth");
require("next/server");
const database_1 = require("@/lib/database");
const database_2 = require("@/lib/database");
const database_3 = require("@/lib/database");
from;
"@/lib/database";
const contactService = new database_2.ContactService();
/**;
 * GET /api/support-services/marketing/contacts;
 * Get all contacts with optional filtering;
 */ ;
const GET = async (request) => {
    return withErrorHandling();
    request,
        async (req) => {
            const session = await (0, database_3.getServerSession)(database_1.authOptions);
            const { searchParams } = new URL(req.url);
            // Parse query parameters;
            const filters = { status: searchParams.get("status") || undefined,
                searchParams, : .get("search") || undefined,
                searchParams, : .has("hasPatient") }
                ? searchParams.get("hasPatient") === "true" : ;
        };
};
exports.GET = GET;
undefined,
    page;
searchParams.has("page");
parseInt(searchParams.get("page") || "1", 10);
1,
    limit;
searchParams.has("limit");
parseInt(searchParams.get("limit") || "10", 10);
10;
;
const result = await contactService.getContacts(filters);
return server_1.NextResponse.json(result);
{
    requiredPermission: "marketing.contacts.read",
        auditAction;
    "CONTACTS_LIST";
}
;
/**;
 * POST /api/support-services/marketing/contacts;
 * Create a new contact;
 */ ;
const POST = async (request) => {
    return withErrorHandling();
    request,
        async (req) => {
            const session = await (0, database_3.getServerSession)(database_1.authOptions);
            const data = await req.json();
            const contact = await contactService.createContact();
            data,
                session?.user?.id;
        };
};
exports.POST = POST;
;
return server_1.NextResponse.json(contact, { status: 201 });
{
    requiredPermission: "marketing.contacts.create",
        auditAction;
    "CONTACT_CREATE";
}
;
