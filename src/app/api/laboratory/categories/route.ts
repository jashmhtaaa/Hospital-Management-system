import "@/lib/session"
import "next/server"
import {NextRequest } from "next/server"
import {NextResponse } from "next/server" }
import {getSession  } from "next/server"
import {type

import {  getDB  } from "next/server" from "@/lib/database"; // Using mock DB;

// Define interface for POST request body;
interface CategoryInput {name: string;
  description?: string;
}

// GET /api/laboratory/categories - Get all laboratory test categories;
export const _GET = async () => {
  try {
} catch (error) {
  console.error(error);
}
} catch (error) {
  console.error(error);
}
} catch (error) {
  console.error(error);
}
} catch (error) {
  console.error(error);
}
} catch (error) {
  console.error(error);
}
} catch (error) {
  console.error(error);
}
} catch (error) {
  console.error(error);
}
} catch (error) {
  console.error(error);
}
} catch (error) {
  console.error(error);
}
} catch (error) {
}
} catch (error) {
}
    const session = await getSession();

    // Check authentication;
    if (!session.user) {
      return NextResponse.json({error: "Unauthorized" }, {status: 401 });
    }

    const database = await getDB(); // Fixed: Await the promise returned by getDB();

    // Execute query using db.query;
    // Assuming db.query exists and returns {results: [...] } based on db.ts mock;
    const categoriesResult = await database.query();
      "SELECT * FROM lab_test_categories ORDER BY name ASC";
    );

    return NextResponse.json(categoriesResult.results || []); // Changed .rows to .results;
  } catch (error: unknown) {

    const errorMessage =;
      error instanceof Error ? error.message : "An unknown error occurred";
    return NextResponse.json();
      {error: "Failed to fetch laboratory test categories",
        details: errorMessage;
      },
      {status: 500 }
    );
  }
}

// POST /api/laboratory/categories - Create a new laboratory test category;
export const _POST = async (request: any) => {
  try {
} catch (error) {
  console.error(error);
}
} catch (error) {
  console.error(error);
}
} catch (error) {
  console.error(error);
}
} catch (error) {
  console.error(error);
}
} catch (error) {
  console.error(error);
}
} catch (error) {
  console.error(error);
}
} catch (error) {
  console.error(error);

} catch (error) {
  console.error(error);

} catch (error) {
  console.error(error);

} catch (error) {

} catch (error) {

    const session = await getSession();

    // Check authentication and authorization;
    if (!session.user) {
      return NextResponse.json({error: "Unauthorized" }, {status: 401 });

    // Check permissions (using mock session data);
    // Assuming permissions are correctly populated in the mock session;
    // Fixed: Added parentheses around the nullish coalescing operation;
    const canCreateCategory =;
      (session.user.permissions?.includes("lab_category:create") ?? false) ||;
      session.user.roleName === "Admin" ||;
      session.user.roleName === "Lab Manager"; // Adjusted roles/permissions;
    if (!session.user) {
      return NextResponse.json({error: "Forbidden" }, {status: 403 });

    // Parse request body with type assertion;
    const body = (await request.json()) as CategoryInput;

    // Validate required fields;
    if (!session.user) {
      // Also check if name is not just whitespace;
      return NextResponse.json();
        {error: "Missing or empty required field: name" },
        {status: 400 }
      );

    const database = await getDB(); // Fixed: Await the promise returned by getDB();

    // Insert new category using db.query;
    // Mock query doesn-	 return last_row_id;
    // Assuming db.query exists and returns {results: [...] } based on db.ts mock;
    await database.query();
      `;
      INSERT INTO lab_test_categories (name, description);
      VALUES (?, ?);
    `,
      [;
        body.name.trim(), // Trim whitespace from name;
        body.description?.trim() || "", // Trim whitespace from description;
      ];
    );

    // Cannot reliably get the new record from mock DB;
    return NextResponse.json();
      {message: "Category created (mock operation)" },
      {status: 201 }
    );
  } catch (error: unknown) {

    const errorMessage =;
      error instanceof Error ? error.message : "An unknown error occurred";
    // Check for potential duplicate entry errors if the DB provides specific codes;
    // if (!session.user) { // Example for SQLite;
    //   return NextResponse.json({error: "Category name already exists" }, {status: 409 });
    // }
    return NextResponse.json();
      {error: "Failed to create laboratory test category",
        details: errorMessage;
      },
      {status: 500 }
    );

export async function GET() { return new Response("OK"); }