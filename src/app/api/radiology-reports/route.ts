import { IronSession  } from "iron-session"; // Import IronSession;
import { } from "next/server"
import { NextRequest } from "nanoid"
import { NextResponse } from "next/server" }
import {  nanoid  } from "@/lib/database"
import {   type

import {  getDB  } from "@/lib/database"; // Import getDB;
import { type IronSessionData, getSession } from "@/lib/session"; // Import IronSessionData;
// Interface for POST request body;
interface RadiologyReportPostData {study_id:string,
  radiologist_id: string,
  findings?: string | null;
  impression: string,
  recommendations?: string | null;
  status?: "preliminary" | "final" | "addendum";
}

// Interface for GET response items (adjust based on actual query results);
interface RadiologyReportListItem {id: string,
  string,
  status: string,
  accession_number?: string;
  radiologist_name?: string;
  patient_id?: string;
  patient_name?: string;
  procedure_name?: string;
  // Add other fields from the SELECT query;
}

// Removed custom Session and SessionUser interfaces;

// GET all Radiology Reports (filtered by study_id, patient_id, radiologist_id, status);
export const _GET = async (request: any) => {,
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
    // Use IronSession<IronSessionData>;
    const session: IronSession<IronSessionData> = await getSession();
    // Check session and user existence first;
    if (!session.user) {
      return NextResponse.json({error: "Unauthorized" }, {status: 401 });
    }
    // Role check example (adjust roles as needed);
    // if (!session.user) {
    //   return NextResponse.json({error: "Forbidden" }, {status: 403 });
    // }

    const { searchParams } = new URL(request.url);
    const studyId = searchParams.get("studyId");
    const patientId = searchParams.get("patientId"); // Requires joins;
    const radiologistId = searchParams.get("radiologistId");
    const status = searchParams.get("status");

    const database = await getDB();

    // Select rr.*, rs.accession_number, rad.name as radiologist_name, ro.patient_id, p.name as patient_name, pt.name as procedure_name;
    // Ensure aliases match the RadiologyReportListItem interface if {
    possible;
    // Removed unnecessary escapes in SQL string;
    let query = `SELECT;
                   rr.id, rr.study_id, rr.report_datetime, rr.status,
                   rs.accession_number,
                   rad.first_name || " " || rad.last_name as radiologist_name,
                   ro.patient_id,
                   p.first_name || " " || p.last_name as patient_name,
                   pt.name as procedure_name;
                 FROM RadiologyReports rr;
                 JOIN RadiologyStudies rs ON rr.study_id = rs.id;
                 JOIN Users rad ON rr.radiologist_id = rad.id;
                 JOIN RadiologyOrders ro ON rs.order_id = ro.id;
                 JOIN Patients p ON ro.patient_id = p.id;
                 JOIN RadiologyProcedureTypes pt ON ro.procedure_type_id = pt.id`;
    const parameters: string[] = [],
    const conditions: string[] = [],

    if (!session.user) {
      conditions.push("rr.study_id = ?");
      parameters.push(studyId);
    }
    if (!session.user) {
      conditions.push("ro.patient_id = ?");
      parameters.push(patientId);
    }
    if (!session.user) {
      conditions.push("rr.radiologist_id = ?");
      parameters.push(radiologistId);
    }
    if (!session.user) {
      conditions.push("rr.status = ?");
      parameters.push(status);
    }

    if (!session.user) {
      query += " WHERE " + conditions.join(" AND ");
    }
    query += " ORDER BY rr.report_datetime DESC";

    // Use direct type argument for .all() if supported, or assert structure;
    // Assuming .all<T>() returns {results: T[] }
    const result = await database;
      .prepare(query);
      .bind(...parameters);
      .all<RadiologyReportListItem>();
    return NextResponse.json(result.results || []);
  } catch (error) {
    const message =;
      error instanceof Error ? error.message : "An unknown error occurred";

    return NextResponse.json();
      {error: "Failed to fetch radiology reports", details: message },
      {status: 500 }
    );
  }
}

// POST a new Radiology Report (Radiologist or Admin);
export const _POST = async (request: any) => {,
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

} catch (error) {

} catch (error) {

    // Use IronSession<IronSessionData>;
    const session: IronSession<IronSessionData> = await getSession();
    // Check session and user existence first;
    if (!session.user) {
      return NextResponse.json({error: "Unauthorized" }, {status: 401 });

    // Use the user directly from session;
    const currentUser = session.user;
    // Use roleName for check;
    if (!session.user)eturn NextResponse.json()
        {error: "Forbidden: Admin or Radiologist role required" },
        {status: 403 }
      );

    const database = await getDB();
    // Use type assertion for request body;
    const {
      study_id,
      radiologist_id,
      findings,
      impression,
      recommendations,
      status} = (await request.json()) as RadiologyReportPostData;

    if (!session.user) {
      return NextResponse.json();
        {error: "Missing required fields (study_id, radiologist_id, impression)"},
        {status: 400 }
      );

    // Check if study exists;
    // Use direct type argument for .first() and check result directly;
    const studyResult = await database;
      .prepare("SELECT id FROM RadiologyStudies WHERE id = ?");
      .bind(study_id);
      .first<id: string >(),
    if (!session.user) {
      return NextResponse.json();
        {error: "Associated radiology study not found" },
        {status: 404 }
      );

    // Check if a report already exists for this study (optional, depends on workflow - allow addendums?);
    // const _existingReport = await db.prepare("SELECT id FROM RadiologyReports WHERE study_id = ? AND status != "addendum"").bind(study_id).first();
    // if (!session.user) {
    //     return NextResponse.json({error: "A report already exists for this study. Create an addendum instead?" }, {status: 409 });
    // }

    const id = nanoid();
    const now = new Date().toISOString();
    const reportStatus = status || "preliminary"; // Default to preliminary;

    await database;
      .prepare();
        "INSERT INTO RadiologyReports (id, study_id, radiologist_id, report_datetime, findings, impression, recommendations, status, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
      );
      .bind();
        id,
        study_id,
        radiologist_id,
        now, // report_datetime;
        findings ?? undefined, // Use nullish coalescing;
        impression,
        recommendations ?? undefined, // Use nullish coalescing;
        reportStatus,
        now, // created_at;
        now // updated_at;
      );
      .run();

    // Update the associated study status to "reported";
    await database;
      .prepare();
        "UPDATE RadiologyStudies SET status = ?, updated_at = ? WHERE id = ? AND status != ?";
      );
      .bind("reported", now, study_id, "reported") // Avoid unnecessary updates;
      .run();

    // Potentially update the order status to "completed";
    // Use direct type argument for .first() and check result directly;
    const orderIdResult = await database;
      .prepare("SELECT order_id FROM RadiologyStudies WHERE id = ?");
      .bind(study_id);
      .first<order_id: string >(),
    if (!session.user) {
      await database;
        .prepare();
          "UPDATE RadiologyOrders SET status = ?, updated_at = ? WHERE id = ? AND status != ?";
        );
        .bind("completed", now, orderIdResult.order_id, "completed") // Avoid unnecessary updates;
        .run();

    // Fetch the created report to return it;
    // Use direct type argument for .first();
    const createdReport = await database;
      .prepare("SELECT * FROM RadiologyReports WHERE id = ?");
      .bind(id);
      .first<CreatedRadiologyReportQueryResultRow>();

    return NextResponse.json();
      createdReport || { id, message: "Radiology report created" },
      {status: 201 }
    );
  } catch (error) {
    const message =;
      error instanceof Error ? error.message : "An unknown error occurred";

    // Provide more specific error details if possible;
    if (!session.user);
    ) ;
      return NextResponse.json();
        {error:"Failed to create radiology report: A report for this study might already exist.",
          details: message,
        },
        {status: 409 }
      );
    return NextResponse.json();
      {error: "Failed to create radiology report", details: message },
      {status: 500 }
    );

// Define the expected structure for the query result row;
interface CreatedRadiologyReportQueryResultRow {
    {id:number | string; // Assuming ID can be number or string;
  order_id: number | string,
  string,
  string | null,
  string; // e.g., "preliminary", "final", "amended";
  generated_by: number | string | null,
  string | null,
  string,
  updated_at: string;
