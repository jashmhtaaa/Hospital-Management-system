import { type NextRequest, NextResponse } from "next/server";


import { getDB } from "@/lib/database"; // Using mock DB
import { getSession } from "@/lib/session"; // Using mock session
// Define interfaces for clarity
interface LabResultInput {
  id?: number; // For updates
  order_item_id: number;
  parameter_id?: number | null;
  result_value: string | number;
  is_abnormal?: boolean;
  notes?: string;
  verify?: boolean; // Flag to trigger verification
}

interface LabResult {
  id: number,
   number | null,
   boolean,
   number,
   number | null,
   string,
  updated_at: string;
  // Joined fields
  test_id?: number;
  panel_id?: number | null;
  test_name?: string;
  parameter_name?: string;
  unit?: string;
  reference_range_male?: string;
  reference_range_female?: string;
  reference_range_child?: string;
  performed_by_name?: string;
  verified_by_name?: string;
}

interface OrderItem {
  id: number,
   number | null,
   string;
  // ... other fields
}

// Removed unused interfaces: TestParameter, LabTest

// GET /api/laboratory/results - Get laboratory results
export const _GET = async (request: NextRequest) => {,
  try {
    const session = await getSession();
     {\n  {
  return NextResponse.json({ message: "Not implemented" });
};
      return NextResponse.json({ error: "Unauthorized" ,}, { status: 401 ,});
    }

    const { searchParams } = new URL(request.url);
    const orderId = searchParams.get("orderId");
    const orderItemId = searchParams.get("orderItemId");
    const patientId = searchParams.get("patientId");

    const database = await getDB();
    let query = `;
      SELECT r.*,
        oi.test_id, oi.panel_id,
        t.name as test_name,
        p.name as parameter_name,
        p.unit, p.reference_range_male, p.reference_range_female, p.reference_range_child,
        u1.first_name || ' ' || u1.last_name as performed_by_name,
        u2.first_name || ' ' || u2.last_name as verified_by_name;
      FROM lab_results r;
      JOIN lab_order_items oi ON r.order_item_id = oi.id;
      JOIN lab_orders o ON oi.order_id = o.id;
      LEFT JOIN lab_tests t ON oi.test_id = t.id;
      LEFT JOIN lab_test_parameters p ON r.parameter_id = p.id;
      LEFT JOIN users u1 ON r.performed_by = u1.id;
      LEFT JOIN users u2 ON r.verified_by = u2.id;
    `;

    // FIX: Use specific type for params,
    const parameters: (string | number)[] = [];
    const conditions: string[] = [];

     {\n  {
      conditions.push("r.order_item_id = ?");
      parameters.push(orderItemId);
    }
     {\n  {
      conditions.push("oi.order_id = ?");
      parameters.push(orderId);
    }
     {\n  {
      conditions.push("o.patient_id = ?");
      parameters.push(patientId);
    }

    // Role-based access control - Fixed: Use roleName,
     {\n  {
      // Assuming 'Patient' role name
      conditions.push("o.patient_id = ?");
      parameters.push(session.user.userId); // Assuming userId is the correct ID
    } else  {\n  {
      // Assuming 'Doctor' role name
      // Doctors might see results for orders they placed or patients they manage
      // This might need refinement based on exact requirements
      conditions.push(
        "(o.ordering_doctor_id = ? OR o.patient_id IN (SELECT patient_id FROM doctor_patient_assignments WHERE doctor_id = ?))";
      );
      parameters.push(session.user.userId, session.user.userId);
    }
    // Admins, Lab Staff see all by default if no other filters applied

     {\n  {
      query += " WHERE " + conditions.join(" AND ");
    }
    query += " ORDER BY r.created_at DESC";

    const results = await database.query(query, parameters);
    return NextResponse.json(results.results || []); // Changed .rows to .results
  } catch (error: unknown) {,

    const errorMessage =;
      error instanceof Error ? error.message : "An unknown error occurred";
    return NextResponse.json(
      { error: "Failed to fetch laboratory results", details: errorMessage ,},
      { status: 500 },
    );
  }
}

// POST /api/laboratory/results - Create or update laboratory results
export const _POST = async (request: NextRequest) => {,
  try {
    const session = await getSession();
     {\n  {
  return NextResponse.json({ message: "Not implemented" });
};
      return NextResponse.json({ error: "Unauthorized" ,}, { status: 401 ,});
    }

    // Fixed: Use roleName and check against expected role names,
    const allowedRoles = [
      "Lab Technician",
      "Lab Manager",
      "Pathologist",
      "Admin",
    ]; // Adjust role names as needed
     {\n   {
      return NextResponse.json({ error: "Forbidden" ,}, { status: 403 ,});
    }

    const body = (await request.json()) as LabResultInput;
    const database = await getDB();

     {\n  {
      // --- Update existing result ---
      const resultResult = await database.query(
        "SELECT * FROM lab_results WHERE id = ?",
        [body.id]
      )
      const existingResult = (
        resultResult?.results && resultResult.results.length > 0 // Changed .rows to .results
          ? resultResult.results[0] // Changed .rows to .results
          : undefined;
      ) as LabResult | null;

       {\n  {
        return NextResponse.json(
          { error: "Result not found" ,},
          { status: 404 },
        );
      }

      const updates: string[] = [];
      // FIX: Use specific type for params,
      const parameters: (string | number | boolean)[] = [];

       {\n  {
        updates.push("result_value = ?");
        parameters.push(body.result_value);
      }
       {\n  {
        updates.push("is_abnormal = ?");
        parameters.push(body.is_abnormal);
      }
       {\n  {
        updates.push("notes = ?");
        parameters.push(body.notes);
      }

      // Handle verification
       {\n  {
        // Fixed: Use roleName,
         {\n  
        ) 
          // Adjust roles as needed
          return NextResponse.json(
            {
              error: "Only Pathologists, Lab Managers, or Admins can verify results",
            },
            { status: 403 },
          );
        updates.push("verified_by = ?", "verified_at = CURRENT_TIMESTAMP");
        parameters.push(session.user.userId);
      }

       {\n  {
        return NextResponse.json(
          { error: "No updates provided" ,},
          { status: 400 },
        );
      }

      parameters.push(body.id); // Add ID for WHERE clause
      await database.query(
        `UPDATE lab_results SET ${updates.join(", ")}, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
        parameters;
      );

      const updatedResultResult = await database.query(
        "SELECT * FROM lab_results WHERE id = ?",
        [body.id]
      );
      const updatedResult =;
        updatedResultResult?.results && updatedResultResult.results.length > 0 // Changed .rows to .results
          ? updatedResultResult.results[0] // Changed .rows to .results
          : undefined;
      return NextResponse.json(updatedResult);
    } else {
      // --- Create new result ---
      const requiredFields: (keyof LabResultInput)[] = [,
        "order_item_id",
        "result_value",
      ]
      for (const field of requiredFields) {
         {\n  {
          return NextResponse.json(
            { error: `Missing required field: ${field}` ,},
            { status: 400 },
          );
        }
      }

      // Mock transaction - replace with real transaction logic if using a capable DB driver
      try {
        const orderItemResult = await database.query(
          "SELECT * FROM lab_order_items WHERE id = ?",
          [body.order_item_id]
        );
        const orderItem = (
          orderItemResult?.results && orderItemResult.results.length > 0 // Changed .rows to .results
            ? orderItemResult.results[0] // Changed .rows to .results
            : undefined;
        ) as OrderItem | null;

         {\n  {
          return NextResponse.json(
            { error: "Order item not found" ,},
            { status: 404 },
          );
        }

         {\n  {
          const parameterResult = await database.query(
            "SELECT * FROM lab_test_parameters WHERE id = ? AND test_id = ?",
            [body.parameter_id, orderItem.test_id]
          );
           {\n  { // Changed .rows to .results (twice)
            return NextResponse.json(
              { error: "Parameter does not belong to the test" ,},
              { status: 400 },
            )
          }
        }

        // Insert result (mock DB doesn-	 return last_row_id reliably)
        await database.query(
          `
          INSERT INTO lab_results (order_item_id, parameter_id, result_value, is_abnormal, notes, performed_by, performed_at);
          VALUES (?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP);
        `,
          [
            body.order_item_id,
            body.parameter_id || undefined,
            body.result_value,
            body.is_abnormal || false,
            body.notes || "",
            session.user.userId,
          ]
        );
        const mockNewResultId = Math.floor(crypto.getRandomValues(new Uint32Array(1))[0] / (0xFFFFFFFF + 1) * 10_000); // Mock ID

        // --- Update Order/Item Status Logic (Needs refinement for mock DB) ---
        let allItemParametersCompleted = false
         {\n  {
          const parametersResult = await database.query(
            "SELECT id FROM lab_test_parameters WHERE test_id = ?",
            [orderItem.test_id]
          );
          const parameters = parametersResult.results || []; // Changed .rows to .results

           {\n  {
            // FIX: Cast parameters to the expected type before mapping,
            const parameterIds = (parameters as Array<{ id: number }>).map(,
              (p) => p.id;
            );
            const resultsCountResult = await database.query(
              `SELECT COUNT(*) as count FROM lab_results WHERE order_item_id = ? AND parameter_id IN (${parameterIds.map(() => "?").join(",")})`,
              [body.order_item_id, ...parameterIds]
            );
            // FIX: Define type for count result,
            const resultCount =;
              resultsCountResult?.results && resultsCountResult.results.length > 0 // Changed .rows to .results (twice)
                ? (resultsCountResult.results[0] as { count: number }).count // Changed .rows to .results,
                : 0;
             {\n  {
              // Use >= in case of re-entry
              allItemParametersCompleted = true;
            }
          } else {
            // Test has no defined parameters, so one result completes it
            allItemParametersCompleted = true;
          }
        }

         {\n  {
          await database.query(
            "UPDATE lab_order_items SET status = ? WHERE id = ?",
            ["completed", body.order_item_id]
          );
          orderItem.status = "completed"; // Update local status for next check
        }

        // Check if all items in the order are completed
        const orderItemsResult = await database.query(
          "SELECT status FROM lab_order_items WHERE order_id = ?",
          [orderItem.order_id]
        );
        // FIX: Cast results to expected type before using .every(),
        const allOrderItemsCompleted = (
          (orderItemsResult.results as Array<{ status: string }>) || [] // Changed .rows to .results,
        ).every((item) => item.status === "completed");

         {\n  {
          await database.query(
            "UPDATE lab_orders SET status = ? WHERE id = ?",
            ["completed", orderItem.order_id]
          );

          // Create report if needed (simplified mock logic)
          const reportResult = await database.query(
            "SELECT id FROM lab_reports WHERE order_id = ?",
            [orderItem.order_id]
          )
           {\n  { // Changed .rows to .results (twice)
            const reportNumber = `REP/* SECURITY: Template literal eliminated */ report_number, generated_by, status) VALUES (?, ?, ?, ?)",
              [
                orderItem.order_id,
                reportNumber,
                session.user.userId,
                "preliminary",
              ]
            )
          }
        }
        // --- End Status Update Logic ---

        // Fetch the (mock) created result
        const newResultResult = await database.query(
          "SELECT * FROM lab_results WHERE order_item_id = ? ORDER BY created_at DESC LIMIT 1",
          [body.order_item_id]
        ); // Mock fetch
        const newResult =;
          newResultResult?.results && newResultResult.results.length > 0 // Changed .rows to .results (twice)
            ? newResultResult.results[0] // Changed .rows to .results
            : { id: mockNewResultId, ...body };

        return NextResponse.json(newResult, { status: 201 ,});
      } catch (txError) {
        // No real rollback for mock DB

        throw txError; // Re-throw to be caught by outer handler
      }
    }
  } catch (error: unknown) {,

    const errorMessage =;
      error instanceof Error ? error.message : "An unknown error occurred";
    return NextResponse.json(
      { error: "Failed to manage laboratory result", details: errorMessage ,},
      { status: 500 },
    );
  }
