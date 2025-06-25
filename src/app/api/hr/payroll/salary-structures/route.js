"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports._POST = void 0;
require("@/lib/hr/salary-service");
require("next/server");
require("zod");
const database_1 = require("@/lib/database");
from;
"@/lib/database";
// Schema for salary structure creation;
const salaryStructureSchema = z.object({ name: z.string().min(1, "Name is required"),
    description: z.string().optional(),
    components: z.array(),
    z, : .object({ name: z.string().min(1, "Component name is required"),
        type: z.enum(["EARNING", "DEDUCTION", "TAX"], { errorMap: () => ({ message: "Type must be EARNING, DEDUCTION, or TAX" }) }),
        calculationType: z.enum(["FIXED", "PERCENTAGE", "FORMULA"], { errorMap: () => ({ message: "Calculation type must be FIXED, PERCENTAGE, or FORMULA" }) }),
        value: z.number(),
        formula: z.string().optional(),
        taxable: z.boolean(),
        isBase: z.boolean().optional()
    }) }).min(1, "At least one component is required");
;
// POST handler for creating salary structure;
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
const validationResult = salaryStructureSchema.safeParse(body);
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
    // Create salary structure;
    const salaryStructure = await database_1.salaryService.createSalaryStructure(validationResult.data);
    return server_1.NextResponse.json(salaryStructure);
}
try { }
catch (error) {
    return server_1.NextResponse.json();
    {
        error: "Failed to create salary structure", details;
        error.message;
    }
    {
        status: 500;
    }
    ;
    // GET handler for listing salary structures;
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
    const salaryStructures = await database_1.salaryService.listSalaryStructures();
    return server_1.NextResponse.json({ salaryStructures });
}
try { }
catch (error) {
    return server_1.NextResponse.json();
    {
        error: "Failed to fetch salary structures", details;
        error.message;
    }
    {
        status: 500;
    }
    ;
}
