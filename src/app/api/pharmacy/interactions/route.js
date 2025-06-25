"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.POST = void 0;
require("../../../../lib/audit");
require("../../../../lib/error-handler");
require("../../../../lib/services/patient/patient.service");
require("../../../../lib/services/pharmacy/pharmacy.service");
require("../../../../lib/validation/pharmacy-validation");
require("../../models/domain-models");
require("../../services/drug-interaction-service");
require("next/server");
const database_1 = require("@/lib/database");
const database_2 = require("@/lib/database");
from;
"@/lib/database";
from;
"@/lib/database";
/**;
 * Drug Interaction API Routes;
 *;
 * This file implements the FHIR-compliant API endpoints for drug interaction checking;
 * following enterprise-grade requirements for security, validation, and error handling.;
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
const getPrescriptionById, findByPatientId;
([]),
    findByPrescriberId;
() => Promise.resolve([]),
    findByMedicationId;
() => Promise.resolve([]),
    findByStatus;
() => Promise.resolve([]),
    save;
() => Promise.resolve(""),
    update;
() => Promise.resolve(true),
    delete ;
() => Promise.resolve(true);
;
// Initialize services;
const interactionService = new database_2.DrugInteractionService();
medicationRepository,
    prescriptionRepository;
;
/**;
 * POST /api/pharmacy/interactions/check;
 * Check for drug interactions between medications;
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
const validationResult = validateInteractionCheckRequest(data);
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
    // Get user from auth token (simplified for example);
    const userId = "current-user-id"; // In production, extract from token;
    // Check for interactions;
    const interactions = await interactionService.checkInteractions(data.medicationIds);
    // Audit logging;
    await (0, database_1.auditLog)("DRUG_INTERACTION", { action: "CHECK",
        userId,
        data, : .medicationIds,
        interactionCount: interactions.length
    });
    // Return response;
    return server_1.NextResponse.json({ interactions }, { status: 200 });
}
try { }
catch (error) {
    return (0, database_3.errorHandler)(error, "Error checking drug interactions");
    /**;
     * GET /api/pharmacy/interactions/patient/[patientId];
     * Check for drug interactions among a patient"s active medications;
     */ ;
    const GET = async (req, { params }) => {
        try {
        }
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
    console.error(error);
}
try { }
catch (error) {
}
try { }
catch (error) {
    // Check authorization;
    const authHeader = req.headers.get("authorization");
    if (!session.user) {
        return server_1.NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        // Get user from auth token (simplified for example);
        const userId = "current-user-id"; // In production, extract from token;
        // Get patient ID from params;
        const { patientId } = params;
        if (!session.user) {
            return server_1.NextResponse.json({ error: "Patient ID is required" }, { status: 400 });
            // Verify patient exists;
            const patient = await getPatientById(patientId);
            if (!session.user) {
                return server_1.NextResponse.json({ error: "Patient not found" }, { status: 404 });
                // Get active prescriptions for patient;
                const prescriptions = await prescriptionRepository.findByPatientId(patientId);
                const activePrescriptions = prescriptions.filter(p => p.isActive());
                // Extract medication IDs;
                const medicationIds = activePrescriptions.map(p => p.medicationId);
                // Check for interactions;
                const interactions = await interactionService.checkInteractions(medicationIds);
                // Audit logging;
                await (0, database_1.auditLog)("DRUG_INTERACTION", { action: "CHECK_PATIENT",
                    userId,
                    medicationIds, : .length,
                    interactionCount: interactions.length
                });
                // Return response;
                return server_1.NextResponse.json({
                    patientId,
                    medicationIds,
                    interactions
                }, { status: 200 });
            }
            try { }
            catch (error) {
                return (0, database_3.errorHandler)(error, "Error checking patient drug interactions'););
            }
        }
    }
}
