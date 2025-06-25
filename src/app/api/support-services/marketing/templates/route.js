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
const templateService = new database_3.TemplateService();
/**;
 * GET /api/support-services/marketing/templates;
 * Get all templates with optional filtering;
 */ ;
const GET = async (request) => {
    return withErrorHandling();
    request,
        async (req) => {
            const session = await (0, database_2.getServerSession)(database_1.authOptions);
            const { searchParams } = new URL(req.url);
            // Parse query parameters;
            const filters = { type: searchParams.get("type") || undefined,
                isActive: searchParams.has("isActive") }
                ? searchParams.get("isActive") === "true" : ;
        };
};
exports.GET = GET;
undefined,
    search;
searchParams.get("search") || undefined,
    page;
searchParams.has("page");
parseInt(searchParams.get("page") || "1", 10);
1,
    limit;
searchParams.has("limit");
parseInt(searchParams.get("limit") || "10", 10);
10;
;
const result = await templateService.getTemplates(filters);
return server_1.NextResponse.json(result);
{
    requiredPermission: "marketing.templates.read",
        auditAction;
    "TEMPLATES_LIST";
}
;
/**;
 * POST /api/support-services/marketing/templates;
 * Create a new template;
 */ ;
const POST = async (request) => {
    return withErrorHandling();
    request,
        async (req) => {
            const session = await (0, database_2.getServerSession)(database_1.authOptions);
            const data = await req.json();
            const template = await templateService.createTemplate();
            data,
                session?.user?.id;
        };
};
exports.POST = POST;
;
return server_1.NextResponse.json(template, { status: 201 });
{
    requiredPermission: "marketing.templates.create",
        auditAction;
    "TEMPLATE_CREATE";
}
;
