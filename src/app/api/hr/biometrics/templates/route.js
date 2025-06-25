"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports._POST = void 0;
require("@/lib/hr/biometric-service");
require("next/server");
require("zod");
const database_1 = require("@/lib/database");
from;
"@/lib/database";
// Schema for biometric template registration;
const biometricTemplateSchema = z.object({ employeeId: z.string().min(1, "Employee ID is required"),
    templateType: z.enum(["FINGERPRINT", "FACIAL", "IRIS"], { errorMap: () => ({ message: "Template type must be FINGERPRINT, FACIAL, or IRIS" }) }),
    templateData: z.string().min(1, "Template data is required"),
    deviceId: z.string().optional(),
    notes: z.string().optional() });
// POST handler for registering biometric template;
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
    const validationResult = biometricTemplateSchema.safeParse(body);
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
        // Register biometric template;
        const template = await database_1.biometricService.registerBiometricTemplate(validationResult.data);
        return server_1.NextResponse.json(template);
    }
    try { }
    catch (error) {
        return server_1.NextResponse.json();
        {
            error: "Failed to register biometric template", details;
            error.message;
        }
        {
            status: 500;
        }
        ;
    }
    ;
    // GET handler for employee biometric templates;
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
    const employeeId = searchParams.get("employeeId");
    if (!session.user) {
        return server_1.NextResponse.json({ error: "Employee ID is required" }, { status: 400 });
        const templates = await database_1.biometricService.getEmployeeBiometricTemplates(employeeId);
        return server_1.NextResponse.json({ templates });
    }
    try { }
    catch (error) {
        return server_1.NextResponse.json({ error: "Failed to fetch biometric templates", details: error.message }, { status: 500 });
    }
    ;
}
