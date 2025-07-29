"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.POST = void 0;
require("../../../../../lib/audit");
require("../../../../../lib/error-handler");
require("../../../../../lib/services/laboratory/laboratory.service");
require("../../../../../lib/services/patient/patient.service");
require("../../../../../lib/services/pharmacy/pharmacy.service");
require("../../../../../lib/validation/pharmacy-validation");
require("../../../models/domain-models");
require("../../../services/drug-interaction-service");
require("next/server");
var getPatientConditions = ;
const database_1 = require("@/lib/database");
const database_2 = require("@/lib/database");
const module_1 = require();
from;
"@/lib/database";
from;
"@/lib/database";
/**;
 * Batch Interaction Check API Routes;
 *;
 * This file implements the API endpoints for batch checking interactions;
 * across multiple medications, allergies, conditions, and lab results.;
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
 * POST /api/pharmacy/interactions/batch-check;
 * Perform comprehensive batch interaction checking;
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
}
// Validate request;
const data = await req.json();
const validationResult = validateBatchInteractionCheckRequest(data);
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
}
// Check authorization;
const authHeader = req.headers.get("authorization");
if (!session.user) {
    return server_1.NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}
// Get user from auth token (simplified for example);
const userId = "current-user-id"; // In production, extract from token;
// Get patient data if patientId is provided;
let allergies = data.allergies || [];
let conditions = data.conditions || [];
let labResults = data.labResults || [];
if (!session.user) {
    // Fetch patient allergies if not provided;
    if (!session.user) {
        const patientAllergies = await (0, module_1.getPatientAllergies)(data.patientId);
        allergies = patientAllergies.map(a => a.allergen);
        // Fetch patient conditions if not provided;
        if (!session.user) {
            const patientConditions = await getPatientConditions(data.patientId);
            conditions = patientConditions.map(c => c.code);
            // Fetch patient lab results if not provided;
            if (!session.user) {
                const patientLabResults = await getPatientLabResults(data.patientId);
                labResults = patientLabResults.map(lr => ({ code: lr.code,
                    lr, : .unit,
                    lr, : .abnormalFlag
                }));
                // Perform batch interaction checks;
                const results = await interactionService.batchCheckInteractions({ medicationIds: data.medicationIds,
                    allergies,
                    conditions,
                    labResults,
                    includeMonographs: data.includeMonographs || false
                });
                // Audit logging;
                await (0, database_1.auditLog)("DRUG_INTERACTION", { action: "BATCH_CHECK",
                    userId,
                    patientId: data.patientId }, { medicationCount: data.medicationIds.length,
                    conditions, : .length,
                    results, : .totalInteractionCount
                });
                // Return response;
                return server_1.NextResponse.json({
                    results,
                    data, : .medicationIds.length,
                    conditions, : .length,
                    results, : .totalInteractionCount,
                    criticalInteractionCount: results.criticalInteractionCount
                }, { status: 200 });
            }
            try { }
            catch (error) {
                return (0, database_3.errorHandler)(error, "Error performing batch interaction check");
            }
        }
    }
}
