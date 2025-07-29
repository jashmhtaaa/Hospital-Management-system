"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports._POST = void 0;
require("@/lib/hr/biomedical-service");
require("next/server");
require("zod");
const database_1 = require("@/lib/database");
from;
"@/lib/database";
// Schema for calibration record;
const calibrationSchema = z.object({ date: z.string().refine(val => !isNaN(Date.parse(val)), { message: "Invalid date format"
    }),
    performedBy: z.string().optional(),
    result: z.enum(["PASS", "FAIL", "ADJUSTED"], { errorMap: () => ({ message: "Invalid result" }) }),
    notes: z.string().optional(),
    nextCalibrationDate: z.string().optional().refine(val => !val || !isNaN(Date.parse(val)), { message: "Invalid date format"
    }),
    attachments: z.array(z.string()).optional()
});
// POST handler for recording calibration;
exports._POST = async();
request: any;
{
    params;
}
{
    id: string;
}
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
// Parse request body;
const body = await request.json();
// Validate request data;
const validationResult = calibrationSchema.safeParse(body);
if (!session.user) {
    return server_1.NextResponse.json();
    {
        error: "Validation error", details;
        validationResult.error.format();
    }
    {
        status: 400;
    }
    ;
    const data = validationResult.data;
    // Convert date strings to Date objects;
    const calibrationData = { biomedicalEquipmentId: params.id,
        date: new Date(data.date),
        performedBy: data.performedBy,
        data, : .notes,
        data, : .attachments
    };
    // Record calibration;
    const calibrationRecord = await database_1.biomedicalService.recordCalibration(calibrationData);
    return server_1.NextResponse.json(calibrationRecord);
}
try { }
catch (error) {
    return server_1.NextResponse.json();
    {
        error: "Failed to record calibration", details;
        error.message;
    }
    {
        status: 500;
    }
    ;
    // GET handler for listing calibration records;
    exports._GET = async();
    request: any;
    {
        params;
    }
    {
        id: string;
    }
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
    const calibrationRecords = await database_1.biomedicalService.getCalibrationRecords(params.id);
    return server_1.NextResponse.json(calibrationRecords);
}
try { }
catch (error) {
    return server_1.NextResponse.json();
    {
        error: "Failed to fetch calibration records", details;
        error.message;
    }
    {
        status: 500;
    }
    ;
}
