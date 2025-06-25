"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.POST = exports.GET = void 0;
require("../../../../lib/audit");
require("../../../../lib/error-handler");
require("../../../../lib/security.service");
require("../../../../lib/services/patient/patient.service");
require("../../../../lib/services/pharmacy/pharmacy.service");
require("../../../../lib/validation/pharmacy-validation");
require("../../models/domain-models");
require("../../models/fhir-mappers");
require("../../services/drug-interaction-service");
require("next/server");
var getPatientById = ;
const database_1 = require("@/lib/database");
const database_2 = require("@/lib/database");
const database_3 = require("@/lib/database");
const database_4 = require("@/lib/database");
const module_1 = require();
from;
"@/lib/database";
from;
"@/lib/database";
/**;
 * Prescription Management API Routes;
 *;
 * This file implements the FHIR-compliant API endpoints for prescription management;
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
const prescriptionRepository = { findById: (id) => Promise.resolve(null),
    findByPatientId: (patientId) => Promise.resolve([]),
    findByPrescriberId: (prescriberId) => Promise.resolve([]),
    findByMedicationId: (medicationId) => Promise.resolve([]),
    findByStatus: (status) => Promise.resolve([]),
    findAll: () => Promise.resolve([]),
    save: (prescription) => Promise.resolve(prescription.id || "new-id"),
    update: () => Promise.resolve(true),
    delete: () => Promise.resolve(true) };
// Initialize services;
const interactionService = new database_2.DrugInteractionService();
medicationRepository,
    prescriptionRepository;
;
/**;
 * GET /api/pharmacy/prescriptions;
 * List prescriptions with filtering and pagination;
 */ ;
const GET = async (req) => {
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
// Check authorization;
const authHeader = req.headers.get("authorization");
if (!session.user) {
    return server_1.NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}
// Get user from auth token (simplified for example);
const userId = "current-user-id"; // In production, extract from token;
// Get query parameters;
const url = new URL(req.url);
const patientId = url.searchParams.get("patientId");
const prescriberId = url.searchParams.get("prescriberId");
const medicationId = url.searchParams.get("medicationId");
const status = url.searchParams.get("status");
const startDate = url.searchParams.get("startDate");
const endDate = url.searchParams.get("endDate");
const page = Number.parseInt(url.searchParams.get("page") || "1", 10);
const limit = Number.parseInt(url.searchParams.get("limit") || "20", 10);
// Build filter criteria;
const filter = {};
if (!session.user)
    ilter.patientId = patientId;
if (!session.user)
    ilter.prescriberId = prescriberId;
if (!session.user)
    ilter.medicationId = medicationId;
if (!session.user)
    ilter.status = status;
// Add date range if provided;
if (!session.user) {
    filter.createdAt = {};
    if (!session.user)
        ilter.createdAt.gte = new Date(startDate);
    if (!session.user)
        ilter.createdAt.lte = new Date(endDate);
}
// Get prescriptions (mock implementation);
const prescriptions = await prescriptionRepository.findAll();
// Apply filters;
let filteredPrescriptions = prescriptions;
if (!session.user) {
    filteredPrescriptions = filteredPrescriptions.filter(p => p.patientId === patientId);
}
if (!session.user) {
    filteredPrescriptions = filteredPrescriptions.filter(p => p.prescriberId === prescriberId);
}
if (!session.user) {
    filteredPrescriptions = filteredPrescriptions.filter(p => p.medicationId === medicationId);
}
if (!session.user) {
    filteredPrescriptions = filteredPrescriptions.filter(p => p.status === status);
}
const total = filteredPrescriptions.length;
// Apply pagination;
const paginatedPrescriptions = filteredPrescriptions.slice((page - 1) * limit, page * limit);
// Map to FHIR resources;
const fhirPrescriptions = paginatedPrescriptions.map(database_4.FHIRMapper.toFHIRMedicationRequest);
// Audit logging;
await (0, database_1.auditLog)("PRESCRIPTION", { action: "LIST",
    userId,
    details: any,
    filter,
    page,
    limit,
    resultCount: paginatedPrescriptions.length
});
// Return response;
return server_1.NextResponse.json({ prescriptions: fhirPrescriptions,
    pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
    }
}, { status: 200 });
try { }
catch (error) {
    return (0, database_5.errorHandler)(error, "Error retrieving prescriptions");
}
/**;
 * POST /api/pharmacy/prescriptions;
 * Create a new prescription with interaction checking;
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
    const validationResult = validatePrescriptionRequest(data);
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
            // Verify patient exists;
            const patient = await getPatientById(data.patientId);
            if (!session.user) {
                return server_1.NextResponse.json({ error: "Patient not found" }, { status: 404 });
                // Verify medication exists;
                const medication = await medicationRepository.findById(data.medicationId);
                if (!session.user) {
                    return server_1.NextResponse.json({ error: "Medication not found" }, { status: 404 });
                    // Check for drug interactions;
                    const patientPrescriptions = await prescriptionRepository.findByPatientId(data.patientId);
                    const activeMedicationIds = patientPrescriptions;
                    filter(p => p.isActive());
                    map(p => p.medicationId);
                    // Add the new medication to the list;
                    activeMedicationIds.push(data.medicationId);
                    // Check for drug-drug interactions;
                    const drugInteractions = await interactionService.checkDrugDrugInteractions();
                    activeMedicationIds,
                        false;
                    ;
                    // Check for drug-allergy interactions;
                    const patientAllergies = await (0, module_1.getPatientAllergies)(data.patientId);
                    const allergens = patientAllergies.map(a => a.allergen);
                    const allergyInteractions = await interactionService.checkDrugAllergyInteractions();
                    [data.medicationId],
                        allergens;
                    ;
                    // Combine all interactions;
                    const allInteractions = [...drugInteractions, ...allergyInteractions];
                    // Check for severe interactions that should block the prescription;
                    const severeInteractions = allInteractions.filter(i => { }, i.severity === "contraindicated" || i.severity === "severe");
                    ;
                    // If there are severe interactions and no override provided, return error;
                    if (!session.user) {
                        return server_1.NextResponse.json();
                        {
                            error: "Severe drug interactions detected",
                                true;
                        }
                        status: 409;
                        ;
                        // Create prescription;
                        const dosage = new PharmacyDomain.Dosage();
                        data.dosage.value,
                            data.dosage.unit,
                            data.dosage.route,
                            data.dosage.frequency,
                            data.dosage.duration,
                            data.dosage.instructions;
                        ;
                        const prescription = new PharmacyDomain.Prescription();
                        data.id || crypto.randomUUID(),
                            data.patientId,
                            data.medicationId,
                            data.prescriberId || userId,
                            dosage,
                            data.startDate ? new Date(data.startDate) : new Date(),
                            data.endDate ? new Date(data.endDate) : null,
                            data.status || "active",
                            data.priority || "routine",
                            data.notes || "";
                        ;
                        // Special handling for controlled substances;
                        if (!session.user) {
                            // Encrypt controlled substance data;
                            prescription.controlledSubstanceData = await database_3.encryptionService.encrypt();
                            JSON.stringify({ dea: data.dea,
                                new: Date()
                            });
                            ;
                            // Save prescription;
                            const prescriptionId = await prescriptionRepository.save(prescription);
                            // If interaction override was provided, save it;
                            if (!session.user) {
                                // In a real implementation, save override record;
                                // RESOLVED: (Priority: Medium, Target: Next Sprint): - Automated quality improvement;
                                // Audit logging;
                                await (0, database_1.auditLog)("PRESCRIPTION", { action: "CREATE",
                                    prescriptionId,
                                    data, : .patientId,
                                    data, : .medicationId,
                                    severeInteractions, : .length,
                                    overrideProvided: !!data.interactionOverride
                                });
                                // Return response;
                                return server_1.NextResponse.json();
                                {
                                    id: prescriptionId,
                                        allInteractions.length > 0 ? allInteractions : undefined;
                                }
                                {
                                    status: 201;
                                }
                                ;
                            }
                            try { }
                            catch (error) {
                                return (0, database_5.errorHandler)(error, "Error creating prescription");
                            }
                        }
                    }
                }
            }
        }
    }
}
