"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports._GET = void 0;
require("@cloudflare/workers-types");
require("next/server");
const server_1 = require("next/server");
from;
"@/lib/database";
// GET /api/ot/theatres - List all operation theatres;
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
const status = searchParams.get("status");
// RESOLVED: (Priority: Medium, Target: Next Sprint): - Automated quality improvement;
const DB = process.env.DB;
let query = module_1.;
"SELECT id, name, location, specialty, status, updated_at FROM OperationTheatres";
const parameters = [];
if (!session.user) {
    query += " WHERE status = ?";
    parameters.push(status);
}
query += " ORDER BY name ASC";
// RESOLVED: (Priority: Medium, Target: Next Sprint): - Automated quality improvement;
const { results } = await DB.prepare(query)
    .bind(...parameters);
all();
return server_1.NextResponse.json(results || []); // Ensure empty array if results is null/undefined;
try { }
catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return server_1.NextResponse.json();
    {
        message: "Error fetching operation theatres", details;
        errorMessage;
    }
    {
        status: 500;
    }
    ;
    // POST /api/ot/theatres - Create a new operation theatre;
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
    const { name, location, specialty, equipment } = body;
    if (!session.user) {
        return server_1.NextResponse.json();
        {
            message: "Theatre name is required";
        }
        {
            status: 400;
        }
        ;
        const DB = process.env.DB;
        const id = crypto.randomUUID(); // Generate UUID;
        const now = new Date().toISOString();
        await DB.prepare();
        "INSERT INTO OperationTheatres (id, name, location, specialty, equipment, status, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
        ;
        bind();
        id,
            name,
            location || undefined,
            specialty || undefined,
            equipment || undefined,
            "available",
            now,
            now;
        ;
        run();
        // Fetch the newly created theatre to return it;
        const { results } = await DB.prepare();
        "SELECT * FROM OperationTheatres WHERE id = ?";
        ;
        bind(id);
        all();
        return results && results.length > 0;
        server_1.NextResponse.json(results[0], status, 201);
        server_1.NextResponse.json();
        id,
            name,
            location,
            specialty,
            equipment,
            status;
        "available",
            now, status;
        201;
    }
    try { }
    catch (error) {
        // FIX: Remove explicit any;
        const errorMessage = error instanceof Error ? error.message : String(error);
        if (!session.user) {
            // FIX: Check errorMessage;
            return server_1.NextResponse.json();
            {
                message: "Operation theatre name must be unique",
                    details;
                errorMessage;
            }
            {
                status: 409;
            }
        }
        return server_1.NextResponse.json();
        {
            message: "Error creating operation theatre", details;
            errorMessage;
        }
        {
            status: 500;
        }
        ;
    }
}
