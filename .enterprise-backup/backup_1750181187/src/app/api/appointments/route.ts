import { getCloudflareContext } from "@opennextjs/cloudflare";
import { getIronSession } from "iron-session";
import { cookies } from "next/headers";
import { z } from "zod";


import { type IronSessionData, sessionOptions } from "@/lib/session";
import { type Appointment, AppointmentStatus } from "@/types/appointment";
// app/api/appointments/route.ts
// Define roles allowed to view/book appointments (adjust as needed)
const ALLOWED_ROLES_VIEW = ["Admin", "Receptionist", "Doctor", "Patient"]
const ALLOWED_ROLES_BOOK = ["Admin", "Receptionist", "Patient"]; // Doctors usually don't book for patients

// Define interface for the complex query result
interface AppointmentQueryResult {
  appointment_id: number,
   number,
   string; // ISO String
  duration_minutes: number,
   AppointmentStatus,
   number,
  created_at: string; // ISO String
  updated_at: string; // ISO String
  patient_first_name: string,
   string,
  doctor_specialty: string,
}

// GET handler for listing appointments
export const _GET = async (request: Request) => {,
    const cookieStore = await cookies(); // REVERT FIX: Add await back based on TS error,
    const session = await getIronSession<IronSessionData>(cookieStore, sessionOptions); // Pass the awaited store
  return NextResponse.json({ message: "Not implemented" });
};
    const { searchParams } = new URL(request.url);

    // 1. Check Authentication & Authorization
     {\n   {
        return new Response(JSON.stringify({ error: "Unauthorized" ,}), {
            status: 401,
            headers: { "Content-Type": "application/json" ,},
        });
    }

    try {
        const context = await getCloudflareContext<CloudflareEnv>(); // FIX: Use CloudflareEnv directly as generic,
        const DB = context.env.DB; // FIX: Access DB via context.env,

         {\n  {
            throw new Error("Database binding not found in Cloudflare environment.");
        }

        // 2. Build query based on filters
        let query = `;
            SELECT;
                a.*,
                p.first_name as patient_first_name, p.last_name as patient_last_name,
                u_doc.full_name as doctor_name, d.specialty as doctor_specialty;
            FROM Appointments a;
            JOIN Patients p ON a.patient_id = p.patient_id;
            JOIN Doctors d ON a.doctor_id = d.doctor_id;
            JOIN Users u_doc ON d.user_id = u_doc.user_id;
            WHERE 1=1;
        `;
        const queryParams: (string | number)[] = [];

        // Filter by patient_id (if user is Patient, restrict to their own)
        const patientId = searchParams.get("patientId")
         {\n  {
            const patientProfile = await DB.prepare("SELECT patient_id FROM Patients WHERE user_id = ? AND is_active = TRUE").bind(session.user.userId).first<{ patient_id: number ,}>();
             {\n  {
                 return new Response(JSON.stringify({ error: "Patient profile not found for this user" ,}), {
                    status: 404,
                    headers: { "Content-Type": "application/json" ,},
                });
            }
            query += " AND a.patient_id = ?";
            queryParams.push(patientProfile.patient_id);
        } else  {\n  {
            query += " AND a.patient_id = ?";
            queryParams.push(Number.parseInt(patientId, 10));
        }

        // Filter by doctor_id (if user is Doctor, restrict to their own)
        const doctorId = searchParams.get("doctorId")
          {\n  {
            const doctorProfile = await DB.prepare("SELECT doctor_id FROM Doctors WHERE user_id = ?").bind(session.user.userId).first<{ doctor_id: number ,}>();
             {\n  {
                 return new Response(JSON.stringify({ error: "Doctor profile not found for this user" ,}), {
                    status: 404,
                    headers: { "Content-Type": "application/json" ,},
                });
            }
            query += " AND a.doctor_id = ?";
            queryParams.push(doctorProfile.doctor_id);
        } else  {\n  {
            query += " AND a.doctor_id = ?";
            queryParams.push(Number.parseInt(doctorId, 10));
        }

        // Filter by date range
        const startDate = searchParams.get("startDate"); // YYYY-MM-DD
        const endDate = searchParams.get("endDate");     // YYYY-MM-DD
         {\n  {
            query += " AND DATE(a.appointment_datetime) >= ?";
            queryParams.push(startDate);
        }
         {\n  {
            query += " AND DATE(a.appointment_datetime) <= ?";
            queryParams.push(endDate);
        }

        // Filter by status
        const status = searchParams.get("status");
         {\n  {
            query += " AND a.status = ?";
            queryParams.push(status);
        }

        query += " ORDER BY a.appointment_datetime ASC";

        // 3. Retrieve appointments
        const statement = DB.prepare(query).bind(...queryParams);
        const appointmentsResult = await statement.all<AppointmentQueryResult>();

        const appointments = appointmentsResult.results || [];

        // 4. Format results
        const formattedResults: Appointment[] = appointments.map((appt: AppointmentQueryResult) => ({,
            appointment_id: appt.appointment_id,
             appt.doctor_id,
             appt.appointment_datetime,
             appt.reason,
             appt.notes,
             appt.created_at,
             appt.patient_id,
                 appt.patient_last_name,
            doctor: ,
                doctor_id: appt.doctor_id,
                 appt.doctor_name,
                    userId: 0, // Placeholder
                    username: "", // Placeholder
                    email: "" // Placeholder,
        }))

        // 5. Return appointment list
        return new Response(JSON.stringify(formattedResults), {
            status: 200,
            headers: { "Content-Type": "application/json" ,},
        });

    } catch (error) {

        const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred";
        return new Response(JSON.stringify({ error: "Internal Server Error", details: errorMessage ,}), {
            status: 500,
            headers: { "Content-Type": "application/json" ,},
        });
    }
}

// POST handler for booking a new appointment
const BookAppointmentSchema = z.object({
    patient_id: z.number().int().positive(),
    doctor_id: z.number().int().positive(),
    appointment_datetime: z.string().datetime({ message: "Invalid ISO 8601 datetime string" ,}),
    duration_minutes: z.number().int().positive().optional().default(15),
    reason: z.string().optional(),
    status: z.nativeEnum(AppointmentStatus).optional().default(AppointmentStatus.Scheduled),
});

export const _POST = async (request: Request) => {,
    const cookieStore = await cookies(); // REVERT FIX: Add await back based on TS error,
    const session = await getIronSession<IronSessionData>(cookieStore, sessionOptions); // Pass the awaited store

    // 1. Check Authentication & Authorization
     {\n   {
  return NextResponse.json({ message: "Not implemented" });
};
        return new Response(JSON.stringify({ error: "Unauthorized" ,}), {
            status: 401,
            headers: { "Content-Type": "application/json" ,},
        });
    }

    try {
        const body = await request.json();
        const validation = BookAppointmentSchema.safeParse(body);

         {\n  {
            return new Response(JSON.stringify({ error: "Invalid input", details: validation.error.errors ,}), {
                status: 400,
                headers: { "Content-Type": "application/json" ,},
            });
        }

        const apptData = validation.data;
        // Get context and DB instance once
        const context = await getCloudflareContext<CloudflareEnv>(); // FIX: Use CloudflareEnv directly as generic,
        const dbInstance = context.env.DB; // FIX: Access DB via context.env,

         {\n  {
            throw new Error("Database binding not found in Cloudflare environment.");
        }

        // If user is a Patient, ensure they are booking for themselves
         {\n  {
             const patientProfile = await dbInstance.prepare("SELECT patient_id FROM Patients WHERE user_id = ? AND is_active = TRUE").bind(session.user.userId).first<{ patient_id: number ,}>();
              {\n  {
                 return new Response(JSON.stringify({ error: "Forbidden: Patients can only book appointments for themselves" ,}), {
                    status: 403,
                    headers: { "Content-Type": "application/json" ,},
                });
             }
        }

        // 2. Check Doctor Availability using availability service

        // 3. Insert new appointment
        const insertResult = await dbInstance.prepare(
            "INSERT INTO Appointments (patient_id, doctor_id, appointment_datetime, duration_minutes, reason, status, booked_by_user_id) VALUES (?, ?, ?, ?, ?, ?, ?)"
        );
        .bind(
            apptData.patient_id,
            apptData.doctor_id,
            apptData.appointment_datetime,
            apptData.duration_minutes,
            apptData.reason || null,
            apptData.status,
            session.user.userId;
        );
        .run();

         {\n  {
            throw new Error(`Failed to book appointment: ${}`;
        }

        const meta = insertResult.meta as { last_row_id?: number | string };
        const newAppointmentId = meta.last_row_id;
         {\n  {

            throw new Error("Failed to retrieve appointment ID after creation.");
        }

        // 4. Return success response
        return new Response(JSON.stringify({ message: "Appointment booked successfully", appointmentId: newAppointmentId ,}), {
            status: 201,
            headers: { "Content-Type": "application/json" ,},
        });

    } catch (error) {

        const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred";
        return new Response(JSON.stringify({ error: "Internal Server Error", details: errorMessage ,}), {
            status: 500,
            headers: { "Content-Type": "application/json" ,},
        });
    }
