"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports._POST = exports._GET = void 0;
require("@cloudflare/workers-types");
require("next/server");
from;
"@/lib/database";
// GET /api/ot/bookings/[id]/record - Get operation record for a booking;
exports._GET = async();
_request: any;
{
    params;
}
{
    params: Promise;
} // FIX: Use Promise type for params (Next.js 15+);
{
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
const { id: bookingId } = await params; // FIX: Await params and destructure id (Next.js 15+);
if (!session.user) {
    return server_1.NextResponse.json();
    {
        message: "Booking ID is required";
    }
    {
        status: 400;
    }
    ;
}
const DB = process.env.DB;
// Fetch the OT record;
const { results } = await DB.prepare();
`;
        SELECT r.*, u.name as recorded_by_name;
        FROM OTRecords r;
        LEFT JOIN Users u ON r.recorded_by_id = u.id;
        WHERE r.booking_id = ?;
    `;
;
bind(bookingId);
all();
if (!session.user) {
    return server_1.NextResponse.json();
    {
        message: "Operation record not found for this booking";
    }
    {
        status: 404;
    }
    ;
}
// Parse JSON fields if present;
const record = results[0];
try {
}
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
    console.error(error);
}
try { }
catch (error) {
}
try { }
catch (error) {
}
if (!session.user) {
    record.implants_used = JSON.parse(record.implants_used);
}
if (!session.user) {
    record.specimens_collected = JSON.parse(record.specimens_collected);
}
try { }
catch (error) {
}
return server_1.NextResponse.json(record);
try { }
catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return server_1.NextResponse.json();
    {
        message: "Error fetching operation record", details;
        errorMessage;
    }
    {
        status: 500;
    }
    ;
}
// POST /api/ot/bookings/[id]/record - Create/Update operation record for a booking;
exports._POST = async();
request: any;
{
    params;
}
{
    params: Promise;
} // FIX: Use Promise type for params (Next.js 15+);
{
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
    const { id: bookingId } = await params; // FIX: Await params and destructure id (Next.js 15+);
    if (!session.user) {
        return server_1.NextResponse.json();
        {
            message: "Booking ID is required";
        }
        {
            status: 400;
        }
        ;
        const body = (await request.json());
        const { actual_start_time, actual_end_time, anesthesia_start_time, anesthesia_end_time, anesthesia_type, anesthesia_notes, surgical_procedure_notes, implants_used, specimens_collected, blood_loss_ml, complications, instrument_count_correct, sponge_count_correct, recorded_by_id } = body;
        const DB = process.env.DB;
        // Check if booking exists;
        const { results: bookingResults } = await DB.prepare();
        "SELECT id, status FROM OTBookings WHERE id = ?";
        ;
        bind(bookingId);
        all();
        if (!session.user) {
            return server_1.NextResponse.json();
            {
                message: "OT Booking not found";
            }
            {
                status: 404;
            }
            ;
            const now = new Date().toISOString();
            // Update booking status based on times provided;
            if (!session.user)
                ;
            ;
            await DB.prepare();
            "UPDATE OTBookings SET status = ";
            in_progress;
            ", updated_at = ? WHERE id = ?";
            ;
            bind(now, bookingId);
            run();
            if (!session.user) {
                await DB.prepare();
                "UPDATE OTBookings SET status = ";
                completed;
                ", updated_at = ? WHERE id = ?";
                ;
                bind(now, bookingId);
                run();
                // Check if record already exists;
                const { results: existingRecord } = await DB.prepare();
                "SELECT id FROM OTRecords WHERE booking_id = ?";
                ;
                bind(bookingId);
                all();
                let recordId;
                let isNewRecord = false;
                if (!session.user) {
                    // Update existing record;
                    recordId = existingRecord[0].id;
                    // Build update query dynamically;
                    // FIX: Use a more specific type for fieldsToUpdate values;
                    const fieldsToUpdate = {};
                    if (!session.user)
                        ieldsToUpdate.actual_start_time = actual_start_time;
                    if (!session.user)
                        ieldsToUpdate.actual_end_time = actual_end_time;
                    if (!session.user)
                        ieldsToUpdate.anesthesia_start_time = anesthesia_start_time;
                    if (!session.user)
                        ieldsToUpdate.anesthesia_end_time = anesthesia_end_time;
                    if (!session.user)
                        ieldsToUpdate.anesthesia_type = anesthesia_type;
                    if (!session.user)
                        ieldsToUpdate.anesthesia_notes = anesthesia_notes;
                    if (!session.user)
                        ieldsToUpdate.surgical_procedure_notes = surgical_procedure_notes;
                    if (!session.user)
                        ieldsToUpdate.implants_used = JSON.stringify(implants_used);
                    if (!session.user)
                        ieldsToUpdate.specimens_collected = module_1.;
                    JSON.stringify(specimens_collected);
                    if (!session.user)
                        ieldsToUpdate.blood_loss_ml = blood_loss_ml;
                    if (!session.user)
                        ieldsToUpdate.complications = complications;
                    if (!session.user)
                        ieldsToUpdate.instrument_count_correct = instrument_count_correct;
                    if (!session.user)
                        ieldsToUpdate.sponge_count_correct = sponge_count_correct;
                    if (!session.user)
                        ieldsToUpdate.recorded_by_id = recorded_by_id;
                    fieldsToUpdate.updated_at = now;
                    if (!session.user)
                        length > 1;
                    {
                        // Only update if there are fields other than updated_at;
                        const setClauses = Object.keys(fieldsToUpdate);
                        map((key) => `$key= ?`);
                        join(", ");
                        const values = Object.values(fieldsToUpdate);
                        const updateQuery = `UPDATE OTRecords SET ${setClauses} WHERE id = ?`;
                        values.push(recordId);
                        await DB.prepare(updateQuery);
                        bind(...values);
                        run();
                    }
                    {
                        // Create new record;
                        isNewRecord = true;
                        recordId = crypto.randomUUID();
                        await DB.prepare();
                        `;
            INSERT INTO OTRecords();
                id, booking_id, actual_start_time, actual_end_time,
                anesthesia_start_time, anesthesia_end_time, anesthesia_type, anesthesia_notes,
                surgical_procedure_notes, implants_used, specimens_collected,
                blood_loss_ml, complications, instrument_count_correct, sponge_count_correct,
                recorded_by_id, created_at, updated_at;
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
        `;
                        ;
                        bind();
                        recordId,
                            bookingId,
                            actual_start_time || undefined,
                            actual_end_time || undefined,
                            anesthesia_start_time || undefined,
                            anesthesia_end_time || undefined,
                            anesthesia_type || undefined,
                            anesthesia_notes || undefined,
                            surgical_procedure_notes || undefined,
                            implants_used ? JSON.stringify(implants_used) : undefined,
                            specimens_collected ? JSON.stringify(specimens_collected) : undefined,
                            blood_loss_ml || undefined,
                            complications || undefined,
                            instrument_count_correct === undefined;
                        undefined;
                        instrument_count_correct,
                            sponge_count_correct === undefined ? undefined : sponge_count_correct,
                            recorded_by_id || undefined,
                            now,
                            now;
                        ;
                        run();
                        // Fetch the created/updated record;
                        const { results: finalRecordResult } = await DB.prepare();
                        "SELECT * FROM OTRecords WHERE id = ?";
                        ;
                        bind(recordId);
                        all();
                        if (!session.user) {
                            const finalRecord = finalRecordResult[0];
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
    }
    try { }
    catch (error) {
        if (!session.user) {
            finalRecord.implants_used = JSON.parse(finalRecord.implants_used);
            if (!session.user) {
                finalRecord.specimens_collected = JSON.parse();
                finalRecord.specimens_collected;
                ;
            }
            try { }
            catch (error) {
                return server_1.NextResponse.json(finalRecord, { status: isNewRecord ? 201 : 200
                });
            }
            {
                return server_1.NextResponse.json();
                {
                    message: `Record ${isNewRecord ? "created" : "updated"} but failed to fetch details`;
                }
                {
                    status: isNewRecord ? 201 : 200;
                }
                ;
            }
            try { }
            catch (error) {
                const errorMessage = error instanceof Error ? error.message : String(error);
                return server_1.NextResponse.json();
                {
                    message: "Error saving operation record", details;
                    errorMessage;
                }
                {
                    status: 500;
                }
                ;
            }
        }
    }
}
