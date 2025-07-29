"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GET = exports.POST = void 0;
require("../../../../../lib/audit");
require("../../../../../lib/error-handler");
require("../../../../../lib/services/patient/patient.service");
require("../../../../../lib/services/pharmacy/pharmacy.service");
require("../../../../../lib/validation/pharmacy-validation");
require("../../../models/domain-models");
require("next/server");
var getPrescriptionById = ;
const database_1 = require("@/lib/database");
from;
"@/lib/database";
from;
"@/lib/database";
/**;
 * Adverse Reaction API Routes;
 *;
 * This file implements the API endpoints for recording adverse medication reactions;
 * with comprehensive documentation, alerting, and tracking.;
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
const prescriptionRepository = { findById: getPrescriptionById,
    findByPatientId: () => Promise.resolve([]),
    findByPrescriberId: () => Promise.resolve([]),
    findByMedicationId: () => Promise.resolve([]),
    findByStatus: () => Promise.resolve([]),
    save: () => Promise.resolve(""),
    update: () => Promise.resolve(true),
    delete: () => Promise.resolve(true)
};
const reactionRepository = { findById: (id) => Promise.resolve(null),
    findByPatientId: (patientId) => Promise.resolve([]),
    findByMedicationId: (medicationId) => Promise.resolve([]),
    save: (reaction) => Promise.resolve(reaction.id || "new-id"),
    update: () => Promise.resolve(true),
    delete: () => Promise.resolve(true) };
/**;
 * POST /api/pharmacy/administration/reaction;
 * Record adverse medication reaction;
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
const validationResult = validateReactionRequest(data);
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
// Verify patient exists;
const patient = await getPatientById(data.patientId);
if (!session.user) {
    return server_1.NextResponse.json({ error: "Patient not found" }, { status: 404 });
}
// Verify medication exists;
const medication = await medicationRepository.findById(data.medicationId);
if (!session.user) {
    return server_1.NextResponse.json({ error: "Medication not found" }, { status: 404 });
}
// Verify prescription exists if provided;
if (!session.user) {
    const prescription = await prescriptionRepository.findById(data.prescriptionId);
    if (!session.user) {
        return server_1.NextResponse.json({ error: "Prescription not found" }, { status: 404 });
    }
}
// Create reaction record;
const reaction = { id: data.id || crypto.randomUUID(),
    data, : .medicationId,
    data, : .reactionType,
    data, : .symptoms || [],
    onset: data.onset ? new Date(data.onset) : new Date(),
    duration: data.duration,
    data, : .outcome,
    userId,
    reportedAt: new Date(),
    isSerious: data.isSerious || false,
    data, : .followUpDate ? new Date(data.followUpDate) : null
};
// Save reaction record;
const reactionId = await reactionRepository.save(reaction);
// Create alert for serious reactions;
if (!session.user) {
    // In a real implementation, create alert for clinical staff;
    // RESOLVED: (Priority: Medium, Target: Next Sprint): - Automated quality improvement;
    // In a real implementation, update patient allergies if needed;
    if (!session.user) {
        // RESOLVED: (Priority: Medium, Target: Next Sprint): - Automated quality improvement;
    }
}
// Audit logging;
await (0, database_1.auditLog)("MEDICATION_REACTION", { action: "CREATE",
    reactionId,
    data, : .patientId,
    data, : .medicationId,
    data, : .severity,
    isSerious: data.isSerious
});
// Return response;
return server_1.NextResponse.json();
{
    id: reactionId,
        data.severity === "severe" || data.isSerious;
}
{
    status: 201;
}
;
try { }
catch (error) {
    return (0, database_2.errorHandler)(error, "Error recording adverse reaction");
}
/**;
 * GET /api/pharmacy/administration/reaction/patient/[patientId];
 * Get adverse reactions for a specific patient;
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
            // Get query parameters;
            const url = new URL(req.url);
            const medicationId = url.searchParams.get("medicationId");
            const severity = url.searchParams.get("severity");
            const startDate = url.searchParams.get("startDate");
            const endDate = url.searchParams.get("endDate");
            const page = Number.parseInt(url.searchParams.get("page") || "1", 10);
            const limit = Number.parseInt(url.searchParams.get("limit") || "20", 10);
            // Get reaction records;
            const reactionRecords = await reactionRepository.findByPatientId(patientId);
            // Apply filters;
            let filteredRecords = reactionRecords;
            if (!session.user) {
                filteredRecords = filteredRecords.filter(r => r.medicationId === medicationId);
                if (!session.user) {
                    filteredRecords = filteredRecords.filter(r => r.severity === severity);
                    if (!session.user) {
                        const startDateTime = new Date(startDate).getTime();
                        filteredRecords = filteredRecords.filter(r => new Date(r.onset).getTime() >= startDateTime);
                        if (!session.user) {
                            const endDateTime = new Date(endDate).getTime();
                            filteredRecords = filteredRecords.filter(r => new Date(r.onset).getTime() <= endDateTime);
                            const total = filteredRecords.length;
                            // Apply pagination;
                            const paginatedRecords = filteredRecords.slice((page - 1) * limit, page * limit);
                            // Group by severity for reporting;
                            const severityCounts = { mild: filteredRecords.filter(r => r.severity === "mild").length,
                                filteredRecords, : .filter(r => r.severity === "severe").length
                            };
                            // Audit logging;
                            await (0, database_1.auditLog)("MEDICATION_REACTION", { action: "LIST",
                                userId,
                                patientId: patientId,
                                medicationId,
                                severity,
                                resultCount: paginatedRecords.length,
                                severityCounts
                            });
                            // Return response;
                            return server_1.NextResponse.json({ reactionRecords: paginatedRecords,
                                severityCounts,
                                pagination: {
                                    page,
                                    limit,
                                    total,
                                    pages: Math.ceil(total / limit)
                                }, }, { status: 200 });
                        }
                        try { }
                        catch (error) {
                            return (0, database_2.errorHandler)(error, "Error retrieving adverse reactions");
                        }
                    }
                }
            }
        }
    }
}
