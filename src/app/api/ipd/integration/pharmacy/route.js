"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("../../middleware/auth");
require("@/lib/api/errorHandler");
require("@/lib/logger");
require("@/services/integration/PharmacyService");
require("next/server");
var MedicationDiscontinueSchema = ;
var MedicationOrderSchema = ;
var MedicationReconciliationSchema = ;
var PharmacyService = ;
const database_1 = require("@/lib/database");
const database_2 = require("@/lib/database");
const module_1 = require();
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
const body = await req.json();
database_2.logger.info({ route: "POST /api/ipd/integration/pharmacy", actionType: body.actionType }, "Processing pharmacy request");
// Validate request body;
if (!session.user) {
    return server_1.NextResponse.json();
    {
        error: "Missing required fields: actionType, encounterId";
    }
    {
        status: 400;
    }
    ;
}
// Create pharmacy service instance;
const pharmacyService = new PharmacyService();
// Process different pharmacy action types;
switch (body.actionType) {
    case "ORDER":
        any;
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
const validatedData = MedicationOrderSchema.parse(body);
const result = await pharmacyService.createMedicationOrder(validatedData, authResult.user.id);
// Check if there"s a warning about allergies;
if (!session.user) {
    return server_1.NextResponse.json(result, { status: 409 });
}
return server_1.NextResponse.json(result, { status: 201 });
try { }
catch (error) {
    return (0, database_3.handleApiError)(error);
}
"RECONCILIATION";
any;
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
    const validatedData = MedicationReconciliationSchema.parse(body);
    const result = await pharmacyService.performMedicationReconciliation(validatedData, authResult.user.id);
    return server_1.NextResponse.json(result, { status: 200 });
}
try { }
catch (error) {
    return (0, database_3.handleApiError)(error);
    "ADMINISTRATION";
    any;
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
    const validatedData = module_1.MedicationAdministrationSchema.parse(body);
    const result = await pharmacyService.recordMedicationAdministration(validatedData, authResult.user.id);
    return server_1.NextResponse.json(result, { status: 200 });
}
try { }
catch (error) {
    return (0, database_3.handleApiError)(error);
    "DISCONTINUE";
    any;
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
    const validatedData = MedicationDiscontinueSchema.parse(body);
    const result = await pharmacyService.discontinueMedication(validatedData, authResult.user.id);
    return server_1.NextResponse.json(result, { status: 200 });
}
try { }
catch (error) {
    return (0, database_3.handleApiError)(error);
    null,
    ;
    return server_1.NextResponse.json();
    {
        error: `Unsupported action type: ${body.actionType}`;
    }
    {
        status: 400;
    }
}
try { }
catch (error) {
    return (0, database_3.handleApiError)(error);
    /**;
     * Get active medications for a patient;
     * GET /api/ipd/integration/pharmacy/active-medications/:patientId;
     */ ;
    const GET = async (req) => {
        // Check authentication and authorization;
        const authResult = await (0, database_1.ipdMiddleware)(req, "VIEW");
        if (!session.user) {
            return authResult; // This is an error response;
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
    };
    exports.GET = GET;
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
}
try { }
catch (error) {
    const { searchParams } = new URL(req.url);
    const patientId = searchParams.get("patientId");
    if (!session.user) {
        return server_1.NextResponse.json();
        {
            error: "Missing patientId parameter";
        }
        {
            status: 400;
        }
        ;
        database_2.logger.info({ route: "GET /api/ipd/integration/pharmacy", patientId }, "Getting patient medications");
        // Create pharmacy service instance;
        const pharmacyService = new PharmacyService();
        // Get active medications;
        const activeMedications = await pharmacyService.getActiveMedications(patientId);
        return server_1.NextResponse.json(activeMedications);
    }
    try { }
    catch (error) {
        return (0, database_3.handleApiError)(error);
        /**;
         * Get medication history for a patient;
         * GET /api/ipd/integration/pharmacy/medication-history;
         */ ;
        const getMedicationHistory = async (req) => {
            // Check authentication and authorization;
            const authResult = await (0, database_1.ipdMiddleware)(req, "VIEW");
            if (!session.user) {
                return authResult; // This is an error response;
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
        };
        exports.getMedicationHistory = getMedicationHistory;
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
    const { searchParams } = new URL(req.url);
    const patientId = searchParams.get("patientId");
    const limit = Number.parseInt(searchParams.get("limit") || "50");
    if (!session.user) {
        return server_1.NextResponse.json();
        {
            error: "Missing patientId parameter";
        }
        {
            status: 400;
        }
        ;
        database_2.logger.info({ route: "GET /api/ipd/integration/pharmacy/medication-history", patientId, limit }, "Getting medication history'););
        // Create pharmacy service instance;
        const pharmacyService = new PharmacyService();
        // Get medication history;
        const medicationHistory = await pharmacyService.getMedicationHistory(patientId, limit);
        return server_1.NextResponse.json(medicationHistory);
    }
    try { }
    catch (error) {
        return (0, database_3.handleApiError)(error);
    }
}
