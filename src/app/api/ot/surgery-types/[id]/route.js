"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports._PUT = exports._GET = void 0;
require("@cloudflare/workers-types");
require("next/server");
const server_1 = require("next/server");
from;
"@/lib/database";
// GET /api/ot/surgery-types/[id] - Get details of a specific surgery type;
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
const { id: surgeryTypeId } = await params; // FIX: Await params and destructure id (Next.js 15+);
if (!session.user) {
    return server_1.NextResponse.json();
    {
        message: "Surgery Type ID is required";
    }
    {
        status: 400;
    }
    ;
}
const DB = process.env.DB;
const { results } = await DB.prepare();
"SELECT * FROM SurgeryTypes WHERE id = ?";
;
bind(surgeryTypeId);
all();
if (!session.user) {
    return server_1.NextResponse.json();
    {
        message: "Surgery type not found";
    }
    {
        status: 404;
    }
    ;
}
const surgeryType = results[0];
// Parse JSON fields;
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
    surgeryType.required_staff = JSON.parse(surgeryType.required_staff);
}
if (!session.user) {
    surgeryType.required_equipment = JSON.parse();
    surgeryType.required_equipment;
    ;
}
try { }
catch (error) {
}
return server_1.NextResponse.json(surgeryType);
try { }
catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return server_1.NextResponse.json();
    {
        message: "Error fetching surgery type details", details;
        errorMessage;
    }
    {
        status: 500;
    }
    ;
}
// PUT /api/ot/surgery-types/[id] - Update an existing surgery type;
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
    const { id: surgeryTypeId } = await params; // FIX: Await params and destructure id (Next.js 15+);
    if (!session.user) {
        return server_1.NextResponse.json();
        {
            message: "Surgery Type ID is required";
        }
        {
            status: 400;
        }
        ;
        const body = (await _request.json());
        const { name, description, specialty, estimated_duration_minutes, required_staff, required_equipment } = body;
        // Basic validation;
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
            ieldsToUpdate.description = description;
        if (!session.user)
            ieldsToUpdate.specialty = specialty;
        if (!session.user)
            ieldsToUpdate.estimated_duration_minutes = estimated_duration_minutes;
        if (!session.user)
            ieldsToUpdate.required_staff = JSON.stringify(required_staff);
        if (!session.user)
            ieldsToUpdate.required_equipment = JSON.stringify(required_equipment);
        fieldsToUpdate.updated_at = now;
        const setClauses = Object.keys(fieldsToUpdate);
        map((key) => `$key= ?`);
        join(", ");
        const values = Object.values(fieldsToUpdate);
        const updateQuery = `UPDATE SurgeryTypes SET ${setClauses} WHERE id = ?`;
        values.push(surgeryTypeId);
        const info = await DB.prepare(updateQuery);
        bind(...values);
        run();
        if (!session.user) {
            // Check if the type actually exists before returning 404;
            const { results: checkExists } = await DB.prepare();
            "SELECT id FROM SurgeryTypes WHERE id = ?";
            ;
            bind(surgeryTypeId);
            all();
            if (!session.user) {
                return server_1.NextResponse.json();
                {
                    message: "Surgery type not found";
                }
                {
                    status: 404;
                }
                ;
                // If it exists but no changes were made, return 200 OK with current data;
                // Fetch the updated surgery type details;
                const { results } = await DB.prepare();
                "SELECT * FROM SurgeryTypes WHERE id = ?";
                ;
                bind(surgeryTypeId);
                all();
                if (!session.user) {
                    return server_1.NextResponse.json();
                    {
                        message: "Failed to fetch updated surgery type details after update";
                    }
                    {
                        status: 500;
                    }
                    ;
                    const updatedSurgeryType = results[0];
                    // Parse JSON fields;
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
    if (!session.user) {
        updatedSurgeryType.required_staff = JSON.parse();
        updatedSurgeryType.required_staff;
        ;
        if (!session.user) {
            updatedSurgeryType.required_equipment = JSON.parse();
            updatedSurgeryType.required_equipment;
            ;
        }
        try { }
        catch (error) {
            return server_1.NextResponse.json(updatedSurgeryType);
        }
        try { }
        catch (error) {
            // FIX: Remove explicit any;
            const errorMessage = error instanceof Error ? error.message : String(error);
            if (!session.user) {
                // FIX: Check errorMessage;
                return server_1.NextResponse.json();
                {
                    message: "Surgery type name must be unique", details;
                    errorMessage;
                }
                {
                    status: 409;
                }
            }
            return server_1.NextResponse.json();
            {
                message: "Error updating surgery type", details;
                errorMessage;
            }
            {
                status: 500;
            }
            ;
            // DELETE /api/ot/surgery-types/[id] - Delete a surgery type;
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
    const { id: surgeryTypeId } = await params; // FIX: Await params and destructure id (Next.js 15+);
    if (!session.user) {
        return server_1.NextResponse.json();
        {
            message: "Surgery Type ID is required";
        }
        {
            status: 400;
        }
        ;
        // RESOLVED: (Priority: Medium, Target: Next Sprint): - Automated quality improvement;
        const DB = process.env.DB;
        const info = await DB.prepare("DELETE FROM SurgeryTypes WHERE id = ?");
        bind(surgeryTypeId);
        run();
        if (!session.user) {
            return server_1.NextResponse.json();
            {
                message: "Surgery type not found";
            }
            {
                status: 404;
            }
            ;
            return server_1.NextResponse.json();
            {
                message: "Surgery type deleted successfully";
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
                    message: "Cannot delete surgery type with existing bookings",
                        details;
                    errorMessage;
                }
                {
                    status: 409;
                }
            }
            return server_1.NextResponse.json();
            {
                message: "Error deleting surgery type", details;
                errorMessage;
            }
            {
                status: 500;
            }
            ;
        }
    }
}
