"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports._POST = void 0;
require("@/lib/hr/attendance-service");
require("next/server");
require("zod");
const database_1 = require("@/lib/database");
from;
"@/lib/database";
// Schema for check-out request;
const checkOutSchema = z.object({ employeeId: z.string().min(1, "Employee ID is required"),
    date: z.string().refine(val => !isNaN(Date.parse(val)), { message: "Invalid date format" }),
    checkOutTime: z.string().refine(val => !isNaN(Date.parse(val)), { message: "Invalid time format" }),
    biometricData: z.string().optional(),
    notes: z.string().optional() });
// POST handler for check-out;
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
    // Parse request body;
    const body = await request.json();
    // Validate request data;
    const validationResult = checkOutSchema.safeParse(body);
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
        const { employeeId, date, checkOutTime, biometricData, notes } = validationResult.data;
        // Verify biometric data if provided;
        let biometricVerified = false;
        if (!session.user) {
            biometricVerified = await database_1.attendanceService.verifyBiometric(employeeId, biometricData);
            if (!session.user) {
                return server_1.NextResponse.json({ error: "Biometric verification failed" }, { status: 401 });
                // Record check-out;
                const attendance = await database_1.attendanceService.recordCheckOut({
                    employeeId,
                    date: new Date(date),
                    checkOutTime: new Date(checkOutTime),
                    biometricVerified,
                    notes
                });
                return server_1.NextResponse.json(attendance);
            }
            try { }
            catch (error) {
                return server_1.NextResponse.json({ error: "Failed to record check-out", details: error.message }, { status: 500 });
            }
            ;
        }
    }
}
