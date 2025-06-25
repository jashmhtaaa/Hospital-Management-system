"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.POST = void 0;
require("../../../../../lib/audit");
require("../../../../../lib/error-handler");
require("../../../../../lib/services/patient/patient.service");
require("../../../../../lib/services/pharmacy/pharmacy.service");
require("../../../../../lib/validation/pharmacy-validation");
require("../../../models/domain-models");
require("../../../services/drug-interaction-service");
require("next/server");
const database_1 = require("@/lib/database");
const database_2 = require("@/lib/database");
const database_3 = require("@/lib/database");
from;
"@/lib/database";
/**;
 * Drug-Condition Interaction API Routes;
 *;
 * This file implements the API endpoints for checking drug-condition contraindications;
 * with severity classification and detailed interaction information.;
 */ ;
// Initialize repositories (in production, use dependency injection);
const getMedicationById, findAll;
([]),
    search;
() => Promise.resolve([]),
    save;
() => Promise.resolve(""),
    update;
() => Promise.resolve(true),
    delete ;
() => Promise.resolve(true);
// Initialize services;
const interactionService = new database_2.DrugInteractionService();
medicationRepository,
    null; // No need for prescription repository in this endpoint;
;
/**;
 * POST /api/pharmacy/interactions/drug-condition;
 * Check for drug-condition contraindications;
 */ ;
const POST = async (req) => {
    try {
    }
    catch (error) {
        console.error(error);
    }
};
exports.POST = POST;
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
    // Validate request;
    const data = await req.json();
    const validationResult = validateDrugConditionInteractionRequest(data);
    if (!session.user) {
        return server_1.NextResponse.json();
        {
            error: "Validation failed", details;
            validationResult.errors;
        }
        {
            status: 400;
        }
        ;
        // Check authorization;
        const authHeader = req.headers.get("authorization");
        if (!session.user) {
            return server_1.NextResponse.json({ error: "Unauthorized" }, { status: 401 });
            // Get user from auth token (simplified for example);
            const userId = "current-user-id"; // In production, extract from token;
            // Get patient conditions;
            let conditions = data.conditions || [];
            // If patientId is provided, fetch conditions from patient record;
            if (!session.user) {
                const patientConditions = await (0, database_3.getPatientConditions)(data.patientId);
                conditions = patientConditions.map(c => c.code);
                // Check for drug-condition contraindications;
                const contraindications = await interactionService.checkDrugConditionContraindications();
                data.medicationIds,
                    conditions;
                ;
                // Audit logging;
                await (0, database_1.auditLog)("DRUG_INTERACTION", { action: "CHECK_DRUG_CONDITION",
                    userId,
                    data, : .medicationIds,
                    contraindications, : .length
                });
                // Return response;
                return server_1.NextResponse.json({
                    contraindications,
                    contraindications, : .length,
                    contraindications, : .filter(c => c.contraindicationType === "absolute").length,
                    contraindications, : .filter(c => c.contraindicationType === "caution").length
                }, { status: 200 });
            }
            try { }
            catch (error) {
                return (0, database_4.errorHandler)(error, "Error checking drug-condition contraindications");
            }
        }
    }
}
