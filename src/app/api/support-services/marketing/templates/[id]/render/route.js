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
const templateService = new database_3.TemplateService();
/**;
 * POST /api/support-services/marketing/templates/:id/render;
 * Render a template with variables;
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
            const _session = await (0, database_2.getServerSession)(database_1.authOptions);
            const { variables } = await req.json();
            if (!session.user) {
                return server_1.NextResponse.json();
                {
                    error: "Variables must be a valid object";
                }
                {
                    status: 400;
                }
                ;
            }
            const renderedContent = await templateService.renderTemplate();
            params.id,
                variables;
            ;
            return server_1.NextResponse.json({ renderedContent });
        },
        { requiredPermission: "marketing.templates.read",
            auditAction: "TEMPLATE_RENDER"
        };
    ;
}
