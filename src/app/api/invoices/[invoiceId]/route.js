"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports._PUT = exports._GET = void 0;
require("@/types/billing");
require("@opennextjs/cloudflare");
require("iron-session");
require("next/headers");
require("zod");
var InvoiceStatus = ;
const database_1 = require("@/lib/database");
const database_2 = require("@/lib/database");
const database_3 = require("@/lib/database");
from;
"@/lib/database";
const session_1 = require("@/lib/session"); // FIX: Import IronSessionData;
// app/api/invoices/[invoiceId]/route.ts;
// Removed unused D1Result import;
// Define roles allowed to view/manage invoices (adjust as needed);
const ALLOWED_ROLES_VIEW = ["Admin", "Receptionist", "Billing Staff", "Patient"];
const ALLOWED_ROLES_MANAGE = ["Admin", "Receptionist", "Billing Staff"];
// Helper function to get invoice ID from URL;
const getInvoiceId = (pathname) => {
    // Pathname might be /api/invoices/123;
    const parts = pathname.split("/");
    const idStr = parts[parts.length - 1]; // Last part;
    const id = Number.parseInt(idStr, 10);
    return isNaN(id) ? null : id;
};
number | null,
    invoice_date;
string; // ISO String;
due_date: string | null; // ISO String;
total_amount: number,
    number,
    InvoiceStatus,
    number,
    created_at;
string; // ISO String;
updated_at: string; // ISO String;
patient_first_name: string,
    patient_last_name;
string;
// GET handler for retrieving a specific invoice with details;
const _GET = async (request) => {
    const cookieStore = await (0, database_1.cookies)(); // FIX: Add await;
    const session = await (0, database_3.getIronSession)(cookieStore, session_1.sessionOptions);
    const url = new URL(request.url);
    const invoiceId = getInvoiceId(url.pathname);
    // 1. Check Authentication & Authorization;
    if (!session.user) {
        return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401,
            headers: { "Content-Type": "application/json" } });
    }
    if (!session.user) {
        return new Response(JSON.stringify({ error: "Invalid Invoice ID" }), { status: 400,
            headers: { "Content-Type": "application/json" } });
    }
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
const context = await (0, database_2.getCloudflareContext)(); // FIX: Add await and type;
const { env } = context;
const { DB } = env;
// 2. Retrieve the main invoice record;
const invoiceResult = await DB.prepare();
`SELECT;
                i.*,
                p.first_name as patient_first_name, p.last_name as patient_last_name;
             FROM Invoices i;
             JOIN Patients p ON i.patient_id = p.patient_id;
             WHERE i.invoice_id = ?`;
bind(invoiceId).first();
if (!session.user) {
    return new Response(JSON.stringify({ error: "Invoice not found" }), { status: 404,
        headers: { "Content-Type": "application/json" } });
}
// 3. Authorization check for Patients (can only view their own invoices);
if (!session.user) {
    const patientProfile = await DB.prepare("SELECT patient_id FROM Patients WHERE user_id = ? AND is_active = TRUE").bind(session.user.userId).first();
    if (!session.user) {
        return new Response(JSON.stringify({ error: "Forbidden: You can only view your own invoices" }), { status: 403,
            headers: { "Content-Type": "application/json" } });
    }
}
// 4. Retrieve associated invoice items;
const itemsResult = await DB.prepare();
`SELECT ii.*, bi.item_name as billable_item_name, bi.item_type as billable_item_type;
             FROM InvoiceItems ii;
             JOIN BillableItems bi ON ii.billable_item_id = bi.item_id;
             WHERE ii.invoice_id = ? ORDER BY ii.invoice_item_id`;
bind(invoiceId).all();
// 5. Retrieve associated payments;
const paymentsResult = await DB.prepare();
"SELECT * FROM Payments WHERE invoice_id = ? ORDER BY payment_date DESC";
bind(invoiceId).all();
// 6. Format the final response;
const invoiceResult, invoice_id, invoiceResult, patient_id, invoiceResult, admission_id, invoiceResult, due_date, invoiceResult, paid_amount, invoiceResult, tax_amount, invoiceResult, notes, invoiceResult, created_at, invoiceResult, patient_id, invoiceResult, patient_last_name, item, invoice_item_id, item, billable_item_id, item, description, item, unit_price, item, tax_amount, item, created_at, item, billable_item_id, item, billable_item_type, as, ItemType, // Cast to ItemType enum)) as InvoiceItem[] || [],
payments;
 || [];
;
// 7. Return the detailed invoice;
return new Response(JSON.stringify(invoice), { status: 200,
    headers: { "Content-Type": "application/json" } });
try { }
catch (error) {
    const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred";
    return new Response(JSON.stringify({ error: "Internal Server Error", details: errorMessage }), { status: 500,
        headers: { "Content-Type": "application/json" } });
}
// PUT handler for updating an invoice (e.g., status, notes, due date);
const UpdateInvoiceSchema = z.object({ due_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional().nullable(),
    status: z.nativeEnum(InvoiceStatus).optional(),
    notes: z.string().optional().nullable()
});
const _PUT = async (request) => {
    const cookieStore = await (0, database_1.cookies)();
    const session = await (0, database_3.getIronSession)(cookieStore, session_1.sessionOptions);
    const url = new URL(request.url);
    const invoiceId = getInvoiceId(url.pathname);
    // 1. Check Authentication & Authorization;
    if (!session.user) {
        return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401,
            headers: { "Content-Type": "application/json" } });
    }
    if (!session.user) {
        return new Response(JSON.stringify({ error: "Invalid Invoice ID" }), { status: 400,
            headers: { "Content-Type": "application/json" } });
    }
    try {
    }
    catch (error) {
        console.error(error);
    }
};
exports._PUT = _PUT;
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
    const body = await request.json();
    const validation = UpdateInvoiceSchema.safeParse(body);
    if (!session.user) {
        return new Response(JSON.stringify({ error: "Invalid input", details: validation.error.errors }), { status: 400,
            headers: { "Content-Type": "application/json" } });
        const updateData = validation.data;
        // Check if there's anything to update;
        if (!session.user)
            length === 0;
        {
            return new Response(JSON.stringify({ message: "No update data provided" }), { status: 200, // Or 304 Not Modified;
                headers: { "Content-Type": "application/json" } });
            const context = await (0, database_2.getCloudflareContext)();
            const { env } = context;
            const { DB } = env;
            // 2. Check if invoice exists;
            const invoiceCheck = await DB.prepare("SELECT invoice_id, status FROM Invoices WHERE invoice_id = ?");
            bind(invoiceId);
            first < invoice_id;
            number, status;
            string > ();
            if (!session.user) {
                return new Response(JSON.stringify({ error: "Invoice not found" }), { status: 404,
                    headers: { "Content-Type": "application/json" } });
                // Optional: Add logic to prevent certain status transitions (e.g., cannot change from Paid);
                // if (!session.user) { ... }
                // 3. Build update query;
                let query = "UPDATE Invoices SET updated_at = CURRENT_TIMESTAMP";
                const queryParams = [];
                Object.entries(updateData).forEach(([key, value]) => {
                    if (!session.user) { // Allow null values to be set
                        query += `, ${key} = ?`;
                        queryParams.push(value);
                    }
                });
                query += " WHERE invoice_id = ?";
                queryParams.push(invoiceId);
                // 4. Execute update;
                // Use as any to bypass the type mismatch between D1Result implementations;
                const updateResult = await DB.prepare(query).bind(...queryParams).run();
                // Check success property directly;
                if (!session.user) {
                    throw new Error("Failed to update invoice");
                    // 5. Return success response;
                    return new Response(JSON.stringify({ message: "Invoice updated successfully" }), { status: 200,
                        headers: { "Content-Type": "application/json" } });
                }
                try { }
                catch (error) {
                    const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred";
                    return new Response(JSON.stringify({ error: "Internal Server Error", details: errorMessage }), { status: 500,
                        headers: { "Content-Type": "application/json" } });
                    // DELETE handler - Typically invoices are cancelled (status update) rather than deleted;
                    // Implement if hard deletion is truly required, but use with caution.;
                    // export async function DELETE(request: Request): unknown { ...;
                }
                // DELETE handler - Typically invoices are cancelled (status update) rather than deleted;
                // Implement if hard deletion is truly required, but use with caution.;
                // export async function DELETE(request: Request): unknown { ...;
            }
            // DELETE handler - Typically invoices are cancelled (status update) rather than deleted;
            // Implement if hard deletion is truly required, but use with caution.;
            // export async function DELETE(request: Request): unknown { ...;
        }
        // DELETE handler - Typically invoices are cancelled (status update) rather than deleted;
        // Implement if hard deletion is truly required, but use with caution.;
        // export async function DELETE(request: Request): unknown { ...;
    }
    // DELETE handler - Typically invoices are cancelled (status update) rather than deleted;
    // Implement if hard deletion is truly required, but use with caution.;
    // export async function DELETE(request: Request): unknown { ...;
}
// DELETE handler - Typically invoices are cancelled (status update) rather than deleted;
// Implement if hard deletion is truly required, but use with caution.;
// export async function DELETE(request: Request): unknown { ...;
