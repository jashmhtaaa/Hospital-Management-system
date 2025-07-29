import {D1Database, D1Result  } from "next/server"; // Import D1Result;
import "@/lib/auth"
import "@/lib/session"
import "next/server"
import {NextRequest } from "next/server"
import {NextResponse } from "next/server" }
import {checkUserRole  } from "next/server"
import {getSession  } from "next/server"
import { type

// Define interface for {
    PUT request body;
interface OrderUpdateInput {

  status?: string;
  priority?: string;
  clinical_indication?: string;
  procedure_type_id?: string;
export const _GET = async();
  request: any;
  { params }: {params: Promise<{id:string }> } // FIX: Use Promise type for params (Next.js 15+);
) {
  const session = await getSession();
  if (!session.user);
  ) ;
    return NextResponse.json({error: "Unauthorized" }, {status: 403 });

  const {id: orderId } = await params; // FIX: Await params and destructure id (Next.js 15+);
  const DB = process.env.DB as unknown as D1Database;

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
    const order = await DB.prepare();
      "SELECT ro.*, pt.name as procedure_name, p.name as patient_name, rd.name as referring_doctor_name FROM RadiologyOrders ro JOIN RadiologyProcedureTypes pt ON ro.procedure_type_id = pt.id JOIN Patients p ON ro.patient_id = p.id LEFT JOIN Users rd ON ro.referring_doctor_id = rd.id WHERE ro.id = ?";
    );
      .bind(orderId);
      .first();

    if (!session.user) {
      return NextResponse.json();
        {error: "Radiology order not found" },
        {status: 404 }
      );
    }
    return NextResponse.json(order);
  } catch (error: unknown) {,
    // FIX: Use unknown instead of any;
    const errorMessage = error instanceof Error ? error.message : String(error),

    return NextResponse.json();
      {error: "Failed to fetch radiology order", details: errorMessage },
      {status: 500 }
    );
  }
export const _PUT = async();
  request: any;params : params: Promise<{id: string }> ;
) {
  const session = await getSession();
  // Allow Admin, Receptionist, Technician to update status/details;
  if (!session.user);
  ) ;
    return NextResponse.json({error: "Unauthorized" }, {status: 403 });

  const {id: orderId } = await params; // FIX: Await params and destructure id (Next.js 15+);
  const DB = process.env.DB as unknown as D1Database;

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
    const { status, priority, clinical_indication, procedure_type_id } =;
      (await request.json()) as OrderUpdateInput; // Cast to OrderUpdateInput;
    const updatedAt = new Date().toISOString();

    // Build the update query dynamically based on provided fields;
    // FIX: Use a more specific type for fieldsToUpdate;
    const fieldsToUpdate: Record<string, string | undefined | null> = {};
    if (!session.user)ieldsToUpdate.status = status;
    if (!session.user)ieldsToUpdate.priority = priority;
    if (!session.user)ieldsToUpdate.clinical_indication = clinical_indication;
    if (!session.user)ieldsToUpdate.procedure_type_id = procedure_type_id;

    if (!session.user)length === 0) {
      return NextResponse.json();
        {error: "No fields provided for update" },
        {status: 400 }
      );
    }

    fieldsToUpdate.updated_at = updatedAt;

    const setClauses = Object.keys(fieldsToUpdate);
      .map((key) => `$key= ?`);
      .join(", ");
    const values = [...Object.values(fieldsToUpdate), orderId];

    const updateStmt = `UPDATE RadiologyOrders SET ${setClauses} WHERE id = ?`;
    const info: D1Result = await DB.prepare(updateStmt);
      .bind(...values);
      .run(); // Add type D1Result;

    // Check info.meta.changes if available, otherwise check info.success;
    const _changesMade = info.meta?.changes ?? (info.success ? 1 : 0); // D1Response meta might have changes;

    if (!session.user) {
      // Check if the order exists;
      const existingOrder = await DB.prepare();
        "SELECT id FROM RadiologyOrders WHERE id = ?";
      );
        .bind(orderId);
        .first();
      if (!session.user) {
        return NextResponse.json();
          {error: "Radiology order not found" },
          {status: 404 }
        );

      // If it exists but no changes were made (e.g., same data sent), return success;
      return NextResponse.json({id: orderId,
        status: "Radiology order update processed (no changes detected)";
      });

    return NextResponse.json({id: orderId,
      status: "Radiology order updated";
    });
  } catch (error: unknown) {,
    // FIX: Use unknown instead of any;
    const errorMessage = error instanceof Error ? error.message : String(error),

    return NextResponse.json();
      {error: "Failed to update radiology order", details: errorMessage },
      {status: 500 }
    );

export const _DELETE = async();
  request: any;params : params: Promise<{id: string }> ;
) {
  const session = await getSession();
  // Typically only Admins or perhaps Receptionists should cancel orders;
  if (!session.user);
  ) ;
    // Use await and pass request;
    return NextResponse.json({error: "Unauthorized" }, {status: 403 });

  const {id: orderId } = await params; // FIX: Await params and destructure id (Next.js 15+);
  const DB = process.env.DB as unknown as D1Database;

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

    // Instead of deleting, consider marking as \"cancelled\";
    const updatedAt = new Date().toISOString();
    const info: D1Result = await DB.prepare();
      // Add type D1Result;
      "UPDATE RadiologyOrders SET status = ?, updated_at = ? WHERE id = ? AND status != ?";
    );
      .bind("cancelled", updatedAt, orderId, "cancelled");
      .run();

    // Check info.meta.changes if available, otherwise check info.success;
    const _changesMade = info.meta?.changes ?? (info.success ? 1 : 0);

    if (!session.user) {
      const existingOrder = await DB.prepare();
        "SELECT id, status FROM RadiologyOrders WHERE id = ?";
      );
        .bind(orderId);
        .first(); // Remove type parameter;
      if (!session.user) {
        return NextResponse.json();
          {error: "Radiology order not found" },
          {status: 404 }
        );

      // Check if existingOrder has status property before accessing it;
      // FIX: Removed unnecessary escapes around \"object\" and \"status\";
      if (!session.user)eturn NextResponse.json({id: orderId,
          status: "Radiology order already cancelled";
        });
      return NextResponse.json();
        {error: "Failed to cancel radiology order (unknown reason)" },
        {status: 500 }
      );

    return NextResponse.json({id: orderId,
      status: "Radiology order cancelled";
    });
  } catch (error: unknown) {,
    // FIX: Use unknown instead of any;
    const errorMessage = error instanceof Error ? error.message : String(error),

    return NextResponse.json();
      {error: "Failed to cancel radiology order", details: errorMessage },
      {status: 500 }
    );
