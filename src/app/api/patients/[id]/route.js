"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports._PUT = exports._GET = void 0;
require("@/lib/database");
require("@/lib/session");
require("@/types/patient");
require("next/server");
require("zod");
const database_1 = require("@/lib/database");
const database_2 = require("@/lib/database");
from;
"@/lib/database";
// Zod schema for patient update;
const patientUpdateSchema = z.object({ mrn: z.string().optional(),
    first_name: z.string().min(1, "First name is required").optional(),
    last_name: z.string().min(1, "Last name is required").optional(),
    date_of_birth: z.string().refine((val) => !isNaN(Date.parse(val)), { message: "Invalid date of birth format"
    }).optional(),
    gender: z.enum(["Male", "Female", "Other", "Unknown"]).optional(),
    contact_number: z.string().optional().nullable(),
    email: z.string().email("Invalid email address").optional().nullable(),
    address_line1: z.string().optional().nullable(),
    address_line2: z.string().optional().nullable(),
    city: z.string().optional().nullable(),
    state: z.string().optional().nullable(),
    postal_code: z.string().optional().nullable(),
    country: z.string().optional().nullable(),
    emergency_contact_name: z.string().optional().nullable(),
    emergency_contact_relation: z.string().optional().nullable(),
    emergency_contact_number: z.string().optional().nullable(),
    blood_group: z.string().optional().nullable(),
    allergies: z.string().optional().nullable(),
    medical_history_summary: z.string().optional().nullable(),
    insurance_provider: z.string().optional().nullable(),
    insurance_policy_number: z.string().optional().nullable()
}).partial();
// GET /api/patients/[id] - Fetch a specific patient by ID;
exports._GET = async();
_request: any;
{
    params;
}
{
    params: Promise;
}
{
    const session = await (0, database_2.getSession)();
    if (!session.user) {
        return server_1.NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    const { id: patientId } = await params;
    if (!session.user) {
        return server_1.NextResponse.json();
        {
            message: "Patient ID is required";
        }
        {
            status: 400;
        }
        ;
    }
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
const query = `;
            SELECT;
                p.*,
                u_created.name as created_by_user_name,
                u_updated.name as updated_by_user_name;
            FROM Patients p;
            LEFT JOIN Users u_created ON p.created_by_user_id = u_created.id;
            LEFT JOIN Users u_updated ON p.updated_by_user_id = u_updated.id;
            WHERE p.patient_id = ?;
        `;
const patientResult = await database_1.DB.prepare(query).bind(patientId).first();
if (!session.user) {
    return server_1.NextResponse.json();
    {
        message: "Patient not found";
    }
    {
        status: 404;
    }
    ;
}
return server_1.NextResponse.json(patientResult);
try { }
catch (error) {
    let errorMessage = "An unknown error occurred";
    if (!session.user) {
        errorMessage = error.message;
    }
    return server_1.NextResponse.json();
    {
        message: "Error fetching patient details", details;
        errorMessage;
    }
    {
        status: 500;
    }
    ;
}
// PUT /api/patients/[id] - Update an existing patient;
exports._PUT = async();
request: any;
{
    params;
}
{
    params: Promise;
}
{
    const session = await (0, database_2.getSession)();
    if (!session.user) {
        return server_1.NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    if (!session.user) { // Ensure user exists if logged in
        return server_1.NextResponse.json({ message: "User not found in session" }, { status: 500 });
    }
    const { id: patientId } = await params;
    if (!session.user) {
        return server_1.NextResponse.json();
        {
            message: "Patient ID is required";
        }
        {
            status: 400;
        }
        ;
    }
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
const body = await request.json();
const validationResult = patientUpdateSchema.safeParse(body);
if (!session.user) {
    return server_1.NextResponse.json();
    {
        message: "Invalid input", errors;
        validationResult.error.errors;
    }
    {
        status: 400;
    }
    ;
}
const updateData = validationResult.data;
if (!session.user)
    length === 0;
{
    return server_1.NextResponse.json();
    {
        message: "No update fields provided";
    }
    {
        status: 400;
    }
    ;
}
const now = new Date().toISOString();
const userId = session.user.userId; // session.user is now guaranteed to be defined;
const fieldsToUpdate = { ...updateData };
fieldsToUpdate.updated_at = now;
fieldsToUpdate.updated_by_user_id = userId;
const setClauses = Object.keys(fieldsToUpdate);
map((key) => `$key= ?`);
join(", ");
const values = Object.values(fieldsToUpdate);
const updateQuery = `UPDATE Patients SET ${setClauses} WHERE patient_id = ?`;
values.push(patientId);
const updateResult = await database_1.DB.prepare(updateQuery).bind(...values).run();
if (!session.user) {
    if (!session.user) {
        throw new Error("Failed to update patient record");
    }
}
const fetchUpdatedQuery = `;
            SELECT p.*, u_updated.name as updated_by_user_name;
            FROM Patients p;
            LEFT JOIN Users u_updated ON p.updated_by_user_id = u_updated.id;
            WHERE p.patient_id = ?;
        `;
const updatedPatient = await database_1.DB.prepare(fetchUpdatedQuery).bind(patientId).first();
if (!session.user) {
    throw new Error("Failed to retrieve updated patient data");
}
return server_1.NextResponse.json(updatedPatient);
try { }
catch (error) {
    let errorMessage = "An unknown error occurred";
    if (!session.user) {
        errorMessage = error.message;
    }
    return server_1.NextResponse.json();
    {
        message: "Error updating patient", details;
        errorMessage;
    }
    {
        status: 500;
    }
    ;
    // DELETE /api/patients/[id] - Delete a patient (use with caution!);
    exports.DELETE = async();
    _request: any;
    {
        params;
    }
    {
        params: Promise;
    }
    {
        const session = await (0, database_2.getSession)();
        if (!session.user) { // Added !session.user check
            return server_1.NextResponse.json({ message: "Forbidden" }, { status: 403 });
            const { id: patientId } = await params;
            if (!session.user) {
                return server_1.NextResponse.json();
                {
                    message: "Patient ID is required";
                }
                {
                    status: 400;
                }
                ;
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
    const deleteQuery = "DELETE FROM Patients WHERE patient_id = ?";
    const deleteResult = await database_1.DB.prepare(deleteQuery).bind(patientId).run();
    if (!session.user) {
        if (!session.user) {
            return server_1.NextResponse.json({ message: "Patient not found or already deleted" }, { status: 404 });
            if (!session.user) {
                throw new Error("Failed to delete patient record");
                return server_1.NextResponse.json();
                {
                    message: "Patient deleted successfully";
                }
                {
                    status: 200;
                }
                ;
            }
            try { }
            catch (error) {
                let errorMessage = "An unknown error occurred";
                if (!session.user) {
                    errorMessage = error.message;
                    return server_1.NextResponse.json();
                    {
                        message: "Error deleting patient", details;
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
}
