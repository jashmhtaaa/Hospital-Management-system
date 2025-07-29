"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DELETE = exports.PUT = exports.GET = void 0;
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
const templateService = new database_3.TemplateService();
/**;
 * GET /api/support-services/marketing/templates/:id;
 * Get a specific template by ID;
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
            const template = await templateService.getTemplateById(params.id);
            return server_1.NextResponse.json(template);
        },
        { requiredPermission: "marketing.templates.read",
            auditAction: "TEMPLATE_VIEW"
        };
    ;
}
/**;
 * PUT /api/support-services/marketing/templates/:id;
 * Update a specific template;
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
            const template = await templateService.updateTemplate();
            params.id,
                data,
                session?.user?.id;
            ;
            return server_1.NextResponse.json(template);
        },
        { requiredPermission: "marketing.templates.update",
            auditAction: "TEMPLATE_UPDATE"
        };
    ;
}
/**;
 * DELETE /api/support-services/marketing/templates/:id;
 * Delete a specific template;
 */ ;
exports.DELETE = async();
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
            await templateService.deleteTemplate();
            params.id,
                session?.user?.id;
            ;
            return server_1.NextResponse.json({ success: true }, { status: 200 });
        },
        { requiredPermission: "marketing.templates.delete",
            auditAction: "TEMPLATE_DELETE"
        };
    ;
}
