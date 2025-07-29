"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.POST = void 0;
require("../../../../../lib/audit");
require("../../../../../lib/error-handler");
require("../../../../../lib/services/pharmacy/pharmacy.service");
require("../../../../../lib/validation/pharmacy-validation");
require("../../../models/domain-models");
require("../../../services/drug-interaction-service");
require("next/server");
const database_1 = require("@/lib/database");
const database_2 = require("@/lib/database");
from;
"@/lib/database";
/**;
 * Drug-Drug Interaction API Routes;
 *;
 * This file implements the API endpoints for checking drug-drug interactions;
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
 * POST /api/pharmacy/interactions/drug-drug;
 * Check for drug-drug interactions between specific medications;
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
    const validationResult = validateDrugDrugInteractionRequest(data);
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
            // Check for drug-drug interactions;
            const interactions = await interactionService.checkDrugDrugInteractions();
            data.medicationIds,
                data.includeMonographs || false;
            ;
            // Audit logging;
            await (0, database_1.auditLog)("DRUG_INTERACTION", { action: "CHECK_DRUG_DRUG",
                userId,
                data, : .medicationIds,
                data, : .includeMonographs || false
            });
            // Return response;
            return server_1.NextResponse.json({
                interactions,
                interactions, : .length,
                interactions, : .filter(i => i.severity === "contraindicated").length,
                interactions, : .filter(i => i.severity === "moderate").length,
                interactions, : .filter(i => i.severity === "unknown").length
            }, { status: 200 });
        }
        try { }
        catch (error) {
            return (0, database_3.errorHandler)(error, "Error checking drug-drug interactions");
        }
    }
}
