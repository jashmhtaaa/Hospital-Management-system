"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports._POST = void 0;
require("@/lib/hr/biometric-service");
require("next/server");
require("zod");
const database_1 = require("@/lib/database");
from;
"@/lib/database";
// Schema for biometric verification;
const biometricVerificationSchema = z.object({ employeeId: z.string().min(1, "Employee ID is required"),
    templateType: z.enum(["FINGERPRINT", "FACIAL", "IRIS"], { errorMap: () => ({ message: "Template type must be FINGERPRINT, FACIAL, or IRIS" }) }),
    sampleData: z.string().min(1, "Sample data is required") });
// POST handler for verifying biometric data;
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
    const validationResult = biometricVerificationSchema.safeParse(body);
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
        // Verify biometric data;
        const result = await database_1.biometricService.verifyBiometric(validationResult.data);
        return server_1.NextResponse.json(result);
    }
    try { }
    catch (error) {
        return server_1.NextResponse.json({ error: "Failed to verify biometric data", details: error.message }, { status: 500 });
    }
    ;
}
