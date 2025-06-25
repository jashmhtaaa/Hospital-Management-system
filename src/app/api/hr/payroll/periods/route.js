"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports._POST = void 0;
require("@/lib/hr/payroll-service");
require("next/server");
require("zod");
const database_1 = require("@/lib/database");
from;
"@/lib/database";
// Schema for payroll period creation;
const payrollPeriodSchema = z.object({ name: z.string().min(1, "Name is required"),
    startDate: z.string().refine(val => !isNaN(Date.parse(val)), { message: "Invalid start date format"
    }),
    endDate: z.string().refine(val => !isNaN(Date.parse(val)), { message: "Invalid end date format"
    }),
    paymentDate: z.string().refine(val => !isNaN(Date.parse(val)), { message: "Invalid payment date format"
    }),
    notes: z.string().optional()
});
// POST handler for creating payroll period;
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
const validationResult = payrollPeriodSchema.safeParse(body);
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
    const { name, startDate, endDate, paymentDate, notes } = validationResult.data;
    // Create payroll period;
    const payrollPeriod = await database_1.payrollService.createPayrollPeriod({
        name,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        paymentDate: new Date(paymentDate),
        status: "DRAFT",
        notes
    });
    return server_1.NextResponse.json(payrollPeriod);
}
try { }
catch (error) {
    return server_1.NextResponse.json();
    {
        error: "Failed to create payroll period", details;
        error.message;
    }
    {
        status: 500;
    }
    ;
    // GET handler for listing payroll periods;
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
    const status = searchParams.get("status") || undefined;
    const startDate = searchParams.get("startDate") ?  : undefined;
    const endDate = searchParams.get("endDate") ?  : undefined;
    // Get payroll periods;
    const result = await database_1.payrollService.listPayrollPeriods({
        skip,
        take,
        status,
        startDate,
        endDate
    });
    return server_1.NextResponse.json(result);
}
try { }
catch (error) {
    return server_1.NextResponse.json();
    {
        error: "Failed to fetch payroll periods", details;
        error.message;
    }
    {
        status: 500;
    }
    ;
}
