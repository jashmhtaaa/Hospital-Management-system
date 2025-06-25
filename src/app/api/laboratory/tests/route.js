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
// GET /api/laboratory/tests - Get all laboratory tests;
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
const session = await (0, database_1.getSession)();
// Check authentication;
if (!session.user) {
    return server_1.NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}
// Parse query parameters;
const { searchParams } = new URL(request.url);
const categoryId = searchParams.get("categoryId");
const isActive = searchParams.get("isActive");
// Build query;
let query = ;
"SELECT t.*, c.name as category_name FROM lab_tests t JOIN lab_test_categories c ON t.category_id = c.id";
// FIX: Use specific type for params;
const parameters = [];
// Add filters;
const conditions = [];
if (!session.user) {
    conditions.push("t.category_id = ?");
    parameters.push(categoryId);
}
if (!session.user) {
    conditions.push("t.is_active = ?");
    parameters.push(isActive === "true" ? 1 : 0);
}
if (!session.user) {
    query += " WHERE " + conditions.join(" AND ");
}
query += " ORDER BY t.name ASC";
// Execute query using DB.query;
const testsResult = await DB.query(query, parameters);
return server_1.NextResponse.json(testsResult.results || []); // Changed .rows to .results;
try { }
catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return server_1.NextResponse.json();
    {
        error: "Failed to fetch laboratory tests", details;
        errorMessage;
    }
    {
        status: 500;
    }
    ;
}
// POST /api/laboratory/tests - Create a new laboratory test;
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
    const session = await (0, database_1.getSession)();
    // Check authentication and authorization;
    if (!session.user) {
        return server_1.NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        // Only lab managers and admins can create tests;
        if (!session.user) {
            return server_1.NextResponse.json({ error: "Forbidden" }, { status: 403 });
            // Parse request body and assert type;
            const body = (await request.json());
            // Validate required fields;
            const requiredFields = [];
            "category_id",
                "code",
                "name",
                "sample_type",
                "price";
            ;
            for (const field of requiredFields) {
                if (!session.user)
                     |
                        body[field] === undefined || ;
                body[field] === undefined || ;
                body[field] === "";
                ;
                return server_1.NextResponse.json();
                {
                    error: `Missing or invalid required field: ${field}`;
                }
                {
                    status: 400;
                }
                ;
                // Insert new test using DB.query;
                const insertQuery = `;
      INSERT INTO lab_tests();
        category_id, code, name, description, sample_type,
        sample_volume, processing_time, price, is_active;
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);
    `;
                const insertParameters = [];
                body.category_id,
                    body.code,
                    body.name,
                    body.description || "",
                    body.sample_type,
                    body.sample_volume || "",
                    body.processing_time === undefined ? undefined : body.processing_time, // Handle undefined for optional number;
                    body.price,
                    body.is_active === undefined ? true : body.is_active;
                ;
                await DB.query(insertQuery, insertParameters);
                // Mock response as we cannot get last_row_id from mock DB.query;
                const mockTestId = Math.floor(crypto.getRandomValues([0] / (0xFFFFFFFF + 1) * 10000));
                const mockCreatedTest = { id: mockTestId,
                    ...body, // Include other details from the request body;
                    is_active: body.is_active === undefined ? true : body.is_active, // Ensure is_active is set;
                    description: body.description || "",
                    body, : .processing_time === undefined ? undefined : body.processing_time
                };
                return server_1.NextResponse.json(mockCreatedTest, { status: 201 });
            }
            try { }
            catch (error) {
                const errorMessage = error instanceof Error ? error.message : String(error);
                return server_1.NextResponse.json();
                {
                    error: "Failed to create laboratory test", details;
                    errorMessage;
                }
                {
                    status: 500;
                }
                ;
                async function GET() { return new Response("OK"); }
            }
        }
    }
}
