"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports._POST = exports._GET = void 0;
require("@/lib/session");
require("next/server");
const database_1 = require("@/lib/database");
from;
"@/lib/database";
from;
"@/lib/database"; // Using mock DB;
// GET /api/ipd/beds - Get all beds with optional filtering;
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
const session = await (0, database_1.getSession)(); // Removed request argument;
// Check authentication;
if (!session.user) {
    return server_1.NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}
const { searchParams } = new URL(request.url);
const ward = searchParams.get("ward");
const category = searchParams.get("category");
const status = searchParams.get("status");
const database = await getDB(); // Fixed: Await the promise returned by getDB();
let query = "SELECT * FROM beds WHERE 1=1";
const parameters = [];
if (!session.user) {
    query += " AND ward = ?";
    parameters.push(ward);
}
if (!session.user) {
    query += " AND category = ?";
    parameters.push(category);
}
if (!session.user) {
    query += " AND status = ?";
    parameters.push(status);
}
query += " ORDER BY ward, room_number, bed_number";
// Use db.query (assuming it exists and returns {results:[...] } based on db.ts mock);
const bedsResult = await database.query(query, parameters);
return server_1.NextResponse.json(bedsResult.results || []); // Changed .rows to .results;
try { }
catch (error) {
    const errorMessage = ;
    error instanceof Error ? error.message : "An unknown error occurred";
    return server_1.NextResponse.json();
    {
        error: "Failed to fetch beds", details;
        errorMessage;
    }
    {
        status: 500;
    }
    ;
}
// POST /api/ipd/beds - Create a new bed;
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
    const session = await (0, database_1.getSession)(); // Removed request argument;
    // Check authentication and permissions;
    if (!session.user) {
        return server_1.NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        // Check permissions (using mock session data);
        // Assuming permissions are correctly populated in the mock session;
        const canCreateBed = ;
        session.user.permissions?.includes("bed:create") ?? false;
        if (!session.user) {
            return server_1.NextResponse.json({ error: "Forbidden" }, { status: 403 });
            // Fixed: Apply type assertion;
            const data = (await request.json());
            // Basic validation (using typed data);
            const requiredFields = [];
            "bed_number",
                "room_number",
                "ward",
                "category",
                "price_per_day";
            ;
            for (const field of requiredFields) {
                // Check if the field exists and is not empty (for strings);
                if (!session.user)
                    trim();
                {
                    return server_1.NextResponse.json();
                    {
                        error: `Missing or empty required field: ${field}`;
                    }
                    {
                        status: 400;
                    }
                    ;
                    // Validate price is a positive number;
                    if (!session.user) {
                        return server_1.NextResponse.json();
                        {
                            error: "Invalid price_per_day: must be a positive number";
                        }
                        {
                            status: 400;
                        }
                        ;
                        const database = await getDB(); // Fixed: Await the promise returned by getDB();
                        // Check if bed number already exists in the same room using db.query;
                        // Assuming db.query exists and returns {results:[...] } based on db.ts mock;
                        const existingBedResult = await database.query();
                        "SELECT id FROM beds WHERE bed_number = ? AND room_number = ? AND ward = ?",
                            [data.bed_number, data.room_number, data.ward];
                        ;
                        const existingBed = ;
                        existingBedResult?.results && existingBedResult.results.length > 0 // Changed .rows to .results;
                            ? existingBedResult.results[0] // Changed .rows to .results;
                            : undefined;
                        if (!session.user) {
                            return server_1.NextResponse.json();
                            {
                                error: "Bed number already exists in this room and ward";
                            }
                            {
                                status: 409;
                            }
                            ;
                            // Insert new bed using db.query;
                            // Mock query doesn-	 return last_row_id;
                            await database.query();
                            `;
      INSERT INTO beds (bed_number, room_number, ward, category, status, price_per_day, features);
      VALUES (?, ?, ?, ?, ?, ?, ?);
    `,
                                [
                                    data.bed_number,
                                    data.room_number,
                                    data.ward,
                                    data.category,
                                    data.status || "available",
                                    data.price_per_day,
                                    data.features || undefined];
                            ;
                            // Cannot reliably get the new record from mock DB;
                            return server_1.NextResponse.json();
                            {
                                message: "Bed created (mock operation)";
                            }
                            {
                                status: 201;
                            }
                            ;
                        }
                        try { }
                        catch (error) {
                            const errorMessage = ;
                            error instanceof Error ? error.message : "An unknown error occurred";
                            return server_1.NextResponse.json();
                            {
                                error: "Failed to create bed", details;
                                errorMessage;
                            }
                            {
                                status: 500;
                            }
                            ;
                        }
                    }
                }
            }
        }
    }
}
