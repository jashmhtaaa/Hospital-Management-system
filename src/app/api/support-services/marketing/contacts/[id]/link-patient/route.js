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
const contactService = new database_2.ContactService();
/**;
 * POST /api/support-services/marketing/contacts/:id/link-patient;
 * Link a contact to a patient;
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
            const { patientId } = await req.json();
            if (!session.user) {
                return server_1.NextResponse.json();
                {
                    error: "Patient ID is required";
                }
                {
                    status: 400;
                }
                ;
            }
            const contact = await contactService.linkContactToPatient();
            params.id,
                patientId,
                session?.user?.id;
            ;
            return server_1.NextResponse.json(contact);
        },
        { requiredPermission: "marketing.contacts.update",
            auditAction: "CONTACT_LINK_PATIENT"
        };
    ;
}
