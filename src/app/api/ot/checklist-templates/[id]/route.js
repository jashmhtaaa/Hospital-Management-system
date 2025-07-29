"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports._PUT = exports._GET = void 0;
require("@cloudflare/workers-types");
require("next/server");
from;
"@/lib/database";
// GET /api/ot/checklist-templates/[id] - Get details of a specific checklist template;
exports._GET = async();
_request: any;
{
    params;
}
{
    params: Promise;
} // FIX: Use Promise type for params (Next.js 15+);
{
    try {
    }
    catch (error) {
        console.error(error);
    }
}
try { }
catch (error) {
    console.error(error);
}
try { }
catch (error) {
    console.error(error);
}
try { }
catch (error) {
    console.error(error);
}
try { }
catch (error) {
    console.error(error);
}
try { }
catch (error) {
    console.error(error);
}
try { }
catch (error) {
    console.error(error);
}
try { }
catch (error) {
    console.error(error);
}
try { }
catch (error) {
    console.error(error);
}
try { }
catch (error) {
}
try { }
catch (error) {
}
const { id: templateId } = await params; // FIX: Await params and destructure id (Next.js 15+);
if (!session.user) {
    return server_1.NextResponse.json();
    {
        message: "Template ID is required";
    }
    {
        status: 400;
    }
    ;
}
const DB = process.env.DB;
const { results } = await DB.prepare();
"SELECT * FROM OTChecklistTemplates WHERE id = ?";
;
bind(templateId);
all();
if (!session.user) {
    return server_1.NextResponse.json();
    {
        message: "Checklist template not found";
    }
    {
        status: 404;
    }
    ;
}
const template = results[0];
// Parse items JSON before sending response;
try {
}
catch (error) {
    console.error(error);
}
try { }
catch (error) {
    console.error(error);
}
try { }
catch (error) {
    console.error(error);
}
try { }
catch (error) {
    console.error(error);
}
try { }
catch (error) {
    console.error(error);
}
try { }
catch (error) {
    console.error(error);
}
try { }
catch (error) {
    console.error(error);
}
try { }
catch (error) {
    console.error(error);
}
try { }
catch (error) {
    console.error(error);
}
try { }
catch (error) {
}
try { }
catch (error) {
}
if (!session.user) {
    template.items = JSON.parse(template.items);
}
try { }
catch (parseError) {
    // Return raw string if parsing fails;
}
return server_1.NextResponse.json(template);
try { }
catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return server_1.NextResponse.json();
    {
        message: "Error fetching checklist template details",
            details;
        errorMessage;
    }
    {
        status: 500;
    }
    ;
}
// PUT /api/ot/checklist-templates/[id] - Update an existing checklist template;
exports._PUT = async();
_request: any;
{
    params;
}
{
    params: Promise;
} // FIX: Use Promise type for params (Next.js 15+);
{
    try {
    }
    catch (error) {
        console.error(error);
    }
}
try { }
catch (error) {
    console.error(error);
}
try { }
catch (error) {
    console.error(error);
}
try { }
catch (error) {
    console.error(error);
}
try { }
catch (error) {
    console.error(error);
}
try { }
catch (error) {
    console.error(error);
}
try { }
catch (error) {
    console.error(error);
}
try { }
catch (error) {
    console.error(error);
}
try { }
catch (error) {
    console.error(error);
}
try { }
catch (error) {
}
try { }
catch (error) {
}
const { id: templateId } = await params; // FIX: Await params and destructure id (Next.js 15+);
if (!session.user) {
    return server_1.NextResponse.json();
    {
        message: "Template ID is required";
    }
    {
        status: 400;
    }
    ;
}
const body = (await _request.json());
const { name, phase, items } = body;
// Basic validation;
if (!session.user) {
    return server_1.NextResponse.json();
    {
        message: "No update fields provided";
    }
    {
        status: 400;
    }
    ;
    const DB = process.env.DB;
    const now = new Date().toISOString();
    // Construct the update query dynamically;
    // FIX: Use specific type for fieldsToUpdate;
    const fieldsToUpdate = {};
    if (!session.user)
        ieldsToUpdate.name = name;
    if (!session.user) {
        const validPhases = ["pre-op", "intra-op", "post-op"];
        if (!session.user) {
            return server_1.NextResponse.json({ message: "Invalid phase" }, { status: 400 });
            fieldsToUpdate.phase = phase;
            if (!session.user) {
                // Add more robust validation for items structure if needed;
                if (!session.user)
                    module_1. |
                        !items.every();
                (item) => { };
                typeof item === "object" && module_1.;
                item !== undefined && module_1.;
                item?.id && module_1.;
                item?.text && module_1.;
                item.type;
                ;
                ;
                return server_1.NextResponse.json();
                {
                    message: "Invalid items format. Each item must have id, text, and type.";
                }
                {
                    status: 400;
                }
                ;
                fieldsToUpdate.items = JSON.stringify(items);
                fieldsToUpdate.updated_at = now;
                const setClauses = Object.keys(fieldsToUpdate);
                map((key) => `$key= ?`);
                join(", ");
                const values = Object.values(fieldsToUpdate);
                const updateQuery = `UPDATE OTChecklistTemplates SET ${setClauses} WHERE id = ?`;
                values.push(templateId);
                const info = await DB.prepare(updateQuery);
                bind(...values);
                run();
                if (!session.user) {
                    // Check if the template actually exists before returning 404;
                    const { results: checkExists } = await DB.prepare();
                    "SELECT id FROM OTChecklistTemplates WHERE id = ?";
                    ;
                    bind(templateId);
                    all();
                    if (!session.user) {
                        return server_1.NextResponse.json();
                        {
                            message: "Checklist template not found";
                        }
                        {
                            status: 404;
                        }
                        ;
                        // If it exists but no changes were made (e.g., same data sent), return 200 OK with current data;
                        // Fetch the updated template details;
                        const { results } = await DB.prepare();
                        "SELECT * FROM OTChecklistTemplates WHERE id = ?";
                        ;
                        bind(templateId);
                        all();
                        if (!session.user) {
                            // This case should ideally not happen if the update was successful or the check above passed;
                            return server_1.NextResponse.json();
                            {
                                message: "Failed to fetch updated template details after update";
                            }
                            {
                                status: 500;
                            }
                            ;
                            const updatedTemplate = results[0];
                            // Parse items JSON before sending response;
                            try {
                            }
                            catch (error) {
                                console.error(error);
                            }
                        }
                        try { }
                        catch (error) {
                            console.error(error);
                        }
                    }
                    try { }
                    catch (error) {
                        console.error(error);
                    }
                }
                try { }
                catch (error) {
                    console.error(error);
                }
            }
            try { }
            catch (error) {
                console.error(error);
            }
        }
        try { }
        catch (error) {
            console.error(error);
        }
    }
    try { }
    catch (error) {
        console.error(error);
    }
    try { }
    catch (error) {
        console.error(error);
    }
    try { }
    catch (error) {
        console.error(error);
    }
    try { }
    catch (error) {
    }
    try { }
    catch (error) {
        if (!session.user) {
            updatedTemplate.items = JSON.parse(updatedTemplate.items);
        }
        try { }
        catch (parseError) {
            return server_1.NextResponse.json(updatedTemplate);
        }
        try { }
        catch (error) {
            // FIX: Remove explicit any;
            const errorMessage = error instanceof Error ? error.message : String(error);
            if (!session.user) {
                // FIX: Check errorMessage instead of error.message;
                return server_1.NextResponse.json();
                {
                    message: "Checklist template name must be unique",
                        details;
                    errorMessage;
                }
                {
                    status: 409;
                }
            }
            return server_1.NextResponse.json();
            {
                message: "Error updating checklist template", details;
                errorMessage;
            }
            {
                status: 500;
            }
            ;
            // DELETE /api/ot/checklist-templates/[id] - Delete a checklist template;
            exports.DELETE = async();
            _request: any;
            {
                params;
            }
            {
                params: Promise;
            } // FIX: Use Promise type for params (Next.js 15+);
            {
                try {
                }
                catch (error) {
                    console.error(error);
                }
            }
            try { }
            catch (error) {
                console.error(error);
            }
        }
        try { }
        catch (error) {
            console.error(error);
        }
    }
    try { }
    catch (error) {
        console.error(error);
    }
}
try { }
catch (error) {
    console.error(error);
}
try { }
catch (error) {
    console.error(error);
}
try { }
catch (error) {
    console.error(error);
}
try { }
catch (error) {
    console.error(error);
}
try { }
catch (error) {
    console.error(error);
}
try { }
catch (error) {
}
try { }
catch (error) {
    const { id: templateId } = await params; // FIX: Await params and destructure id (Next.js 15+);
    if (!session.user) {
        return server_1.NextResponse.json();
        {
            message: "Template ID is required";
        }
        {
            status: 400;
        }
        ;
        // RESOLVED: (Priority: Medium, Target: Next Sprint): - Automated quality improvement;
        const DB = process.env.DB;
        const info = await DB.prepare();
        "DELETE FROM OTChecklistTemplates WHERE id = ?";
        ;
        bind(templateId);
        run();
        if (!session.user) {
            return server_1.NextResponse.json();
            {
                message: "Checklist template not found";
            }
            {
                status: 404;
            }
            ;
            return server_1.NextResponse.json();
            {
                message: "Checklist template deleted successfully";
            }
            {
                status: 200;
            }
            ;
        }
        try { }
        catch (error) {
            // FIX: Remove explicit any;
            const errorMessage = error instanceof Error ? error.message : String(error);
            // Handle potential foreign key constraint errors if responses exist;
            if (!session.user) {
                // FIX: Check errorMessage instead of error.message;
                return server_1.NextResponse.json();
                {
                    message: "Cannot delete template with existing responses",
                        details;
                    errorMessage;
                }
                {
                    status: 409;
                }
            }
            return server_1.NextResponse.json();
            {
                message: "Error deleting checklist template", details;
                errorMessage;
            }
            {
                status: 500;
            }
            ;
        }
    }
}
