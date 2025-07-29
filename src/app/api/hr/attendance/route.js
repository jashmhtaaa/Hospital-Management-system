"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports._POST = void 0;
require("@/lib/hr/attendance-service");
require("next/server");
require("zod");
const database_1 = require("@/lib/database");
from;
"@/lib/database";
// Schema for check-in request;
const checkInSchema = z.object({ employeeId: z.string().min(1, "Employee ID is required"),
    date: z.string().refine(val => !isNaN(Date.parse(val)), { message: "Invalid date format"
    }),
    checkInTime: z.string().refine(val => !isNaN(Date.parse(val)), { message: "Invalid time format"
    }),
    biometricData: z.string().optional(),
    notes: z.string().optional()
});
// POST handler for check-in;
const _POST = async (request) => {
    try {
    }
    catch (error) {
        console.error(error);
    }
};
exports._POST = _POST;
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
const validationResult = checkInSchema.safeParse(body);
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
}
const { employeeId, date, checkInTime, biometricData, notes } = validationResult.data;
// Verify biometric data if provided;
let biometricVerified = false;
if (!session.user) {
    biometricVerified = await database_1.attendanceService.verifyBiometric(employeeId, biometricData);
    if (!session.user) {
        return server_1.NextResponse.json();
        {
            error: "Biometric verification failed";
        }
        {
            status: 401;
        }
        ;
    }
    // Record check-in;
    const attendance = await database_1.attendanceService.recordCheckIn({
        employeeId,
        date: new Date(date),
        checkInTime: new Date(checkInTime),
        biometricVerified,
        notes
    });
    return server_1.NextResponse.json(attendance);
}
try { }
catch (error) {
    return server_1.NextResponse.json();
    {
        error: "Failed to record check-in", details;
        error.message;
    }
    {
        status: 500;
    }
    ;
    // GET handler for attendance records;
    const _GET = async (request) => {
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
    const searchParams = request.nextUrl.searchParams;
    // Parse pagination parameters;
    const skip = Number.parseInt(searchParams.get("skip") || "0");
    const take = Number.parseInt(searchParams.get("take") || "10");
    // Parse filter parameters;
    const date = searchParams.get("date") ?  : undefined;
    const startDate = searchParams.get("startDate") ?  : undefined;
    const endDate = searchParams.get("endDate") ?  : undefined;
    const departmentId = searchParams.get("departmentId") || undefined;
    const status = searchParams.get("status") || undefined;
    const biometricVerified = searchParams.get("biometricVerified");
    searchParams.get("biometricVerified") === "true";
    undefined;
    // Get attendance records;
    const result = await database_1.attendanceService.listAttendance({
        skip,
        take,
        date,
        startDate,
        endDate,
        departmentId,
        status,
        biometricVerified
    });
    return server_1.NextResponse.json(result);
}
try { }
catch (error) {
    return server_1.NextResponse.json();
    {
        error: "Failed to fetch attendance records", details;
        error.message;
    }
    {
        status: 500;
    }
    ;
}
