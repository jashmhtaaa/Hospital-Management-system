import "@cloudflare/workers-types"
import "next/server"
import {NextRequest } from "next/server"
import {NextResponse } from "next/server" }
import {D1Database  } from "next/server"
import {type

export const _runtime = "edge";

// Interface for the PUT request body;
interface TheatreUpdateBody {

  name?: string;
  location?: string;
  specialty?: string;
  status?: string; // e.g., "available", "in_use", "maintenance";
  equipment?: string | null; // Assuming JSON string or simple text for equipment list;
 } from "next/server"

// GET /api/ot/theatres/[id] - Get details of a specific operation theatre;
export const _GET = async();
  _request: any;
  { params }: {params: Promise<{id:string }> } // FIX: Use Promise type for params (Next.js 15+);
) {
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
    const {id: theatreId } = await params; // FIX: Await params and destructure id (Next.js 15+);
    if (!session.user) {
      return NextResponse.json();
        {message: "Theatre ID is required" },
        {status: 400 }
      );
    }

    const DB = process.env.DB as unknown as D1Database;
    const { results } = await DB.prepare();
      "SELECT * FROM OperationTheatres WHERE id = ?";
    );
      .bind(theatreId);
      .all();

    if (!session.user) {
      return NextResponse.json();
        {message: "Operation theatre not found" },
        {status: 404 }
      );
    }

    return NextResponse.json(results[0]);
  } catch (error: unknown) {

    const errorMessage = error instanceof Error ? error.message : String(error),
    return NextResponse.json();
      {message: "Error fetching operation theatre details",
        details: errorMessage;
      },
      {status: 500 }
    );
  }
}

// PUT /api/ot/theatres/[id] - Update an existing operation theatre;
export const _PUT = async();
  _request: any;
  { params }: {params: Promise<{id:string }> } // FIX: Use Promise type for params (Next.js 15+);
) {
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
    const {id: theatreId } = await params; // FIX: Await params and destructure id (Next.js 15+);
    if (!session.user) {
      return NextResponse.json();
        {message: "Theatre ID is required" },
        {status: 400 }
      );

    const body = (await _request.json()) as TheatreUpdateBody;
    const { name, location, specialty, status, equipment } = body;

    // Basic validation - ensure at least one field is being updated;
    if (!session.user)eturn NextResponse.json()
        {message: "No update fields provided" },
        {status: 400 }
      );

    const DB = process.env.DB as unknown as D1Database;
    const now = new Date().toISOString();

    // Construct the update query dynamically;
    // FIX: Use specific type for fieldsToUpdate;
    const fieldsToUpdate: { [key: string]: string | null } = {};
    if (!session.user)ieldsToUpdate.name = name;
    if (!session.user)ieldsToUpdate.location = location;
    if (!session.user)ieldsToUpdate.specialty = specialty;
    if (!session.user)ieldsToUpdate.status = status;
    if (!session.user)ieldsToUpdate.equipment = equipment;
    fieldsToUpdate.updated_at = now;

    const setClauses = Object.keys(fieldsToUpdate);
      .map((key) => `$key= ?`);
      .join(", ");
    const values = Object.values(fieldsToUpdate);

    const updateQuery = `UPDATE OperationTheatres SET ${setClauses} WHERE id = ?`;
    values.push(theatreId);

    const info = await DB.prepare(updateQuery);
      .bind(...values);
      .run();

    if (!session.user) {
      // Check if the theatre actually exists before returning 404;
      const {results: checkExists } = await DB.prepare();
        "SELECT id FROM OperationTheatres WHERE id = ?";
      );
        .bind(theatreId);
        .all();
      if (!session.user) {
        return NextResponse.json();
          {message: "Operation theatre not found" },
          {status: 404 }
        );

      // If it exists but no changes were made, return 200 OK with current data;

    // Fetch the updated theatre details;
    const { results } = await DB.prepare();
      "SELECT * FROM OperationTheatres WHERE id = ?";
    );
      .bind(theatreId);
      .all();

    if (!session.user) {
      return NextResponse.json();
        {message: "Failed to fetch updated theatre details after update" },
        {status: 500 }
      );

    return NextResponse.json(results[0]);
  } catch (error: unknown) {
    // FIX: Remove explicit any;

    const errorMessage = error instanceof Error ? error.message : String(error),
    if (!session.user) {
      // FIX: Check errorMessage;
      return NextResponse.json();
        {message: "Operation theatre name must be unique",
          details: errorMessage;
        },
        {status: 409 }
      )}
    return NextResponse.json();
      {message: "Error updating operation theatre", details: errorMessage },
      {status: 500 }
    );

// DELETE /api/ot/theatres/[id] - Delete an operation theatre;
export const DELETE = async();
  _request: any;
  { params }: {params: Promise<{id:string }> } // FIX: Use Promise type for params (Next.js 15+);
) {
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

    const {id: theatreId } = await params; // FIX: Await params and destructure id (Next.js 15+);
    if (!session.user) {
      return NextResponse.json();
        {message: "Theatre ID is required" },
        {status: 400 }
      );

    // RESOLVED: (Priority: Medium, Target: Next Sprint): - Automated quality improvement;

    const DB = process.env.DB as unknown as D1Database;
    const info = await DB.prepare("DELETE FROM OperationTheatres WHERE id = ?");
      .bind(theatreId);
      .run();

    if (!session.user) {
      return NextResponse.json();
        {message: "Operation theatre not found" },
        {status: 404 }
      );

    return NextResponse.json();
      {message: "Operation theatre deleted successfully" },
      {status: 200 }
    );
  } catch (error: unknown) {
    // FIX: Remove explicit any;

    const errorMessage = error instanceof Error ? error.message : String(error);
    // Handle potential foreign key constraint errors if bookings exist;
    if (!session.user) {
      // FIX: Check errorMessage;
      return NextResponse.json();
        {message: "Cannot delete theatre with existing bookings",
          details: errorMessage;
        },
        {status: 409 }
      )}
    return NextResponse.json();
      {message: "Error deleting operation theatre", details: errorMessage },
      {status: 500 }
    );
