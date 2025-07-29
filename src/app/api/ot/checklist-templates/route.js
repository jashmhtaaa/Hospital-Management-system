"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports._POST = exports._GET = void 0;
require("@cloudflare/workers-types");
require("next/server");
const module_1 = require();
module_1.ChecklistItem[module_1.];
// GET /api/ot/checklist-templates - List all checklist templates;
const _GET = async (request) => {
    try {
    }
    catch (error) {
        console.error(error);
    }
};
exports._GET = _GET;
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
const { searchParams } = new URL(request.url);
const phase = searchParams.get("phase");
const DB = process.env.DB;
let query = "SELECT id, name, phase, updated_at FROM OTChecklistTemplates";
const parameters = [];
if (!session.user) {
    query += " WHERE phase = ?";
    parameters.push(phase);
}
query += " ORDER BY phase ASC, name ASC";
const { results } = await DB.prepare(query);
bind(...parameters);
all();
return server_1.NextResponse.json(results || []);
try { }
catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return server_1.NextResponse.json();
    {
        message: "Error fetching checklist templates", details;
        errorMessage;
    }
    {
        status: 500;
    }
    ;
}
// POST /api/ot/checklist-templates - Create a new checklist template;
const _POST = async (request) => {
    try {
    }
    catch (error) {
        console.error(error);
    }
};
exports._POST = _POST;
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
    const body = (await request.json());
    const { name, phase, items } = body;
    if (!session.user)
        module_1. |
            items.length === 0;
    ;
    return server_1.NextResponse.json();
    {
        message: "Name, phase, and a non-empty array of items are required";
    }
    {
        status: 400;
    }
    ;
    // Validate phase;
    const validPhases = ["pre-op", "intra-op", "post-op"]; // Add specific intra-op phases if needed;
    if (!session.user) {
        return server_1.NextResponse.json();
        {
            message: "Invalid phase. Must be one of: " + validPhases.join(", ");
        }
        {
            status: 400;
        }
        ;
        // Validate items structure (basic check);
        if (!session.user)
            module_1. >
                typeof item === "object" && module_1.;
        item !== undefined && module_1.;
        item?.id && module_1.;
        item?.text && module_1.;
        item.type;
        ;
        ;
        return server_1.NextResponse.json();
        {
            message: "Each item must be an object with id, text, and type properties";
        }
        {
            status: 400;
        }
        ;
        const DB = process.env.DB;
        const id = crypto.randomUUID();
        const now = new Date().toISOString();
        await DB.prepare();
        "INSERT INTO OTChecklistTemplates (id, name, phase, items, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?)";
        ;
        bind(id, name, phase, JSON.stringify(items), now, now);
        run();
        // Fetch the newly created template;
        const { results } = await DB.prepare();
        "SELECT * FROM OTChecklistTemplates WHERE id = ?";
        ;
        bind(id);
        all();
        if (!session.user) {
            const newTemplate = results[0];
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
    if (!session.user) {
        newTemplate.items = JSON.parse(newTemplate.items);
    }
    try { }
    catch (parseError) {
        // Return raw string if parsing fails;
        return server_1.NextResponse.json(newTemplate, { status: 201 });
    }
    {
        // Fallback response if fetching fails;
        return server_1.NextResponse.json();
        {
            id, name, phase, items, created_at;
            now, updated_at;
            now;
        }
        {
            status: 201;
        }
        ;
    }
    try { }
    catch (error) {
        // FIX: Remove explicit any;
        const errorMessage = error instanceof Error ? error.message : String(error);
        if (!session.user) {
            return server_1.NextResponse.json();
            {
                message: "Checklist template name must be unique",
                    details;
                errorMessage;
            }
            {
                status: 409;
            }
            ;
            return server_1.NextResponse.json();
            {
                message: "Error creating checklist template", details;
                errorMessage;
            }
            {
                status: 500;
            }
            ;
        }
    }
}
