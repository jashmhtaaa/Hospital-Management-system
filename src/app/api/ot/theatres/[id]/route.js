"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports._PUT = exports._GET = void 0;
require("@cloudflare/workers-types");
require("next/server");
const server_1 = require("next/server");
from;
"@/lib/database";
// GET /api/ot/theatres/[id] - Get details of a specific operation theatre;
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
const { id: theatreId } = await params; // FIX: Await params and destructure id (Next.js 15+);
if (!session.user) {
    return server_1.NextResponse.json();
    {
        message: "Theatre ID is required";
    }
    {
        status: 400;
    }
    ;
}
const DB = process.env.DB;
const { results } = await DB.prepare();
"SELECT * FROM OperationTheatres WHERE id = ?";
;
bind(theatreId);
all();
if (!session.user) {
    return server_1.NextResponse.json();
    {
        message: "Operation theatre not found";
    }
    {
        status: 404;
    }
    ;
}
return server_1.NextResponse.json(results[0]);
try { }
catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return server_1.NextResponse.json();
    {
        message: "Error fetching operation theatre details",
            details;
        errorMessage;
    }
    {
        status: 500;
    }
    ;
}
// PUT /api/ot/theatres/[id] - Update an existing operation theatre;
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
const { id: theatreId } = await params; // FIX: Await params and destructure id (Next.js 15+);
if (!session.user) {
    return server_1.NextResponse.json();
    {
        message: "Theatre ID is required";
    }
    {
        status: 400;
    }
    ;
    const body = (await _request.json());
    const { name, location, specialty, status, equipment } = body;
    // Basic validation - ensure at least one field is being updated;
    if (!session.user)
        eturn;
    server_1.NextResponse.json();
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
    if (!session.user)
        ieldsToUpdate.location = location;
    if (!session.user)
        ieldsToUpdate.specialty = specialty;
    if (!session.user)
        ieldsToUpdate.status = status;
    if (!session.user)
        ieldsToUpdate.equipment = equipment;
    fieldsToUpdate.updated_at = now;
    const setClauses = Object.keys(fieldsToUpdate);
    map((key) => `$key= ?`);
    join(", ");
    const values = Object.values(fieldsToUpdate);
    const updateQuery = `UPDATE OperationTheatres SET ${setClauses} WHERE id = ?`;
    values.push(theatreId);
    const info = await DB.prepare(updateQuery);
    bind(...values);
    run();
    if (!session.user) {
        // Check if the theatre actually exists before returning 404;
        const { results: checkExists } = await DB.prepare();
        "SELECT id FROM OperationTheatres WHERE id = ?";
        ;
        bind(theatreId);
        all();
        if (!session.user) {
            return server_1.NextResponse.json();
            {
                message: "Operation theatre not found";
            }
            {
                status: 404;
            }
            ;
            // If it exists but no changes were made, return 200 OK with current data;
            // Fetch the updated theatre details;
            const { results } = await DB.prepare();
            "SELECT * FROM OperationTheatres WHERE id = ?";
            ;
            bind(theatreId);
            all();
            if (!session.user) {
                return server_1.NextResponse.json();
                {
                    message: "Failed to fetch updated theatre details after update";
                }
                {
                    status: 500;
                }
                ;
                return server_1.NextResponse.json(results[0]);
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
                    message: "Error updating operation theatre", details;
                    errorMessage;
                }
                {
                    status: 500;
                }
                ;
                // DELETE /api/ot/theatres/[id] - Delete an operation theatre;
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
    const { id: theatreId } = await params; // FIX: Await params and destructure id (Next.js 15+);
    if (!session.user) {
        return server_1.NextResponse.json();
        {
            message: "Theatre ID is required";
        }
        {
            status: 400;
        }
        ;
        // RESOLVED: (Priority: Medium, Target: Next Sprint): - Automated quality improvement;
        const DB = process.env.DB;
        const info = await DB.prepare("DELETE FROM OperationTheatres WHERE id = ?");
        bind(theatreId);
        run();
        if (!session.user) {
            return server_1.NextResponse.json();
            {
                message: "Operation theatre not found";
            }
            {
                status: 404;
            }
            ;
            return server_1.NextResponse.json();
            {
                message: "Operation theatre deleted successfully";
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
            // Handle potential foreign key constraint errors if bookings exist;
            if (!session.user) {
                // FIX: Check errorMessage;
                return server_1.NextResponse.json();
                {
                    message: "Cannot delete theatre with existing bookings",
                        details;
                    errorMessage;
                }
                {
                    status: 409;
                }
            }
            return server_1.NextResponse.json();
            {
                message: "Error deleting operation theatre", details;
                errorMessage;
            }
            {
                status: 500;
            }
            ;
        }
    }
}
