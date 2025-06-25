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
// GET /api/laboratory/categories - Get all laboratory test categories;
const _GET = async () => {
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
const database = await getDB(); // Fixed: Await the promise returned by getDB();
// Execute query using db.query;
// Assuming db.query exists and returns {results:[...] } based on db.ts mock;
const categoriesResult = await database.query();
"SELECT * FROM lab_test_categories ORDER BY name ASC";
;
return server_1.NextResponse.json(categoriesResult.results || []); // Changed .rows to .results;
try { }
catch (error) {
    const errorMessage = ;
    error instanceof Error ? error.message : "An unknown error occurred";
    return server_1.NextResponse.json();
    {
        error: "Failed to fetch laboratory test categories",
            details;
        errorMessage;
    }
    {
        status: 500;
    }
    ;
}
// POST /api/laboratory/categories - Create a new laboratory test category;
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
        // Check permissions (using mock session data);
        // Assuming permissions are correctly populated in the mock session;
        // Fixed: Added parentheses around the nullish coalescing operation;
        const canCreateCategory = ;
        (session.user.permissions?.includes("lab_category:create") ?? false) || ;
        session.user.roleName === "Admin" || ;
        session.user.roleName === "Lab Manager"; // Adjusted roles/permissions;
        if (!session.user) {
            return server_1.NextResponse.json({ error: "Forbidden" }, { status: 403 });
            // Parse request body with type assertion;
            const body = (await request.json());
            // Validate required fields;
            if (!session.user) {
                // Also check if name is not just whitespace;
                return server_1.NextResponse.json();
                {
                    error: "Missing or empty required field: name";
                }
                {
                    status: 400;
                }
                ;
                const database = await getDB(); // Fixed: Await the promise returned by getDB();
                // Insert new category using db.query;
                // Mock query doesn-	 return last_row_id;
                // Assuming db.query exists and returns {results:[...] } based on db.ts mock;
                await database.query();
                `;
      INSERT INTO lab_test_categories (name, description);
      VALUES (?, ?);
    `,
                    [
                        body.name.trim(), // Trim whitespace from name;
                        body.description?.trim() || "", // Trim whitespace from description;
                    ];
                ;
                // Cannot reliably get the new record from mock DB;
                return server_1.NextResponse.json();
                {
                    message: "Category created (mock operation)";
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
                // Check for potential duplicate entry errors if the DB provides specific codes;
                // if (!session.user) { // Example for SQLite;
                //   return NextResponse.json({error:"Category name already exists" }, {status:409 });
                // }
                return server_1.NextResponse.json();
                {
                    error: "Failed to create laboratory test category",
                        details;
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
