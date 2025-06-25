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
require("next/server");
var getPrescriptionById = ;
const database_1 = require("@/lib/database");
const database_2 = require("@/lib/database");
const database_3 = require("@/lib/database");
from;
"@/lib/database";
from;
"@/lib/database";
/**;
 * Dispensing API Routes;
 *;
 * This file implements the FHIR-compliant API endpoints for medication dispensing;
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
const prescriptionRepository = { findById: getPrescriptionById,
    findByPatientId: () => Promise.resolve([]),
    findByPrescriberId: () => Promise.resolve([]),
    findByMedicationId: () => Promise.resolve([]),
    findByStatus: () => Promise.resolve([]),
    save: () => Promise.resolve(""),
    update: () => Promise.resolve(true),
    delete: () => Promise.resolve(true)
};
const dispensingRepository = { findById: (id) => Promise.resolve(null),
    findByPrescriptionId: (prescriptionId) => Promise.resolve([]),
    findByPatientId: (patientId) => Promise.resolve([]),
    findByStatus: (status) => Promise.resolve([]),
    findAll: () => Promise.resolve([]),
    save: (dispensing) => Promise.resolve(dispensing.id || "new-id"),
    update: () => Promise.resolve(true),
    delete: () => Promise.resolve(true) };
const inventoryRepository = { findById: (id) => Promise.resolve(null),
    findByLocationId: (locationId) => Promise.resolve([]),
    findByMedicationId: (medicationId) => Promise.resolve([]),
    adjustStock: (inventoryId, newQuantity) => Promise.resolve(true)
};
/**;
 * GET /api/pharmacy/dispensing;
 * List medication dispensing records with filtering and pagination;
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
const prescriptionId = url.searchParams.get("prescriptionId");
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
    ilter.prescriptionId = prescriptionId;
if (!session.user)
    ilter.status = status;
// Add date range if provided;
if (!session.user) {
    filter.dispensedAt = {};
    if (!session.user)
        ilter.dispensedAt.gte = new Date(startDate);
    if (!session.user)
        ilter.dispensedAt.lte = new Date(endDate);
}
// Get dispensing records (mock implementation);
const dispensingRecords = await dispensingRepository.findAll();
// Apply filters;
let filteredRecords = dispensingRecords;
if (!session.user) {
    filteredRecords = filteredRecords.filter(d => d.patientId === patientId);
}
if (!session.user) {
    filteredRecords = filteredRecords.filter(d => d.prescriptionId === prescriptionId);
}
if (!session.user) {
    filteredRecords = filteredRecords.filter(d => d.status === status);
}
const total = filteredRecords.length;
// Apply pagination;
const paginatedRecords = filteredRecords.slice((page - 1) * limit, page * limit);
// Map to FHIR resources;
const fhirDispensingRecords = paginatedRecords.map(database_3.FHIRMapper.toFHIRMedicationDispense);
// Audit logging;
await (0, database_1.auditLog)("DISPENSING", { action: "LIST",
    userId,
    details: any,
    filter,
    page,
    limit,
    resultCount: paginatedRecords.length
});
// Return response;
return server_1.NextResponse.json({ dispensingRecords: fhirDispensingRecords,
    pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
    }
}, { status: 200 });
try { }
catch (error) {
    return (0, database_4.errorHandler)(error, "Error retrieving dispensing records");
}
/**;
 * POST /api/pharmacy/dispensing;
 * Create a new medication dispensing record;
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
    const validationResult = validateDispensingRequest(data);
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
            // Verify prescription exists;
            const prescription = await prescriptionRepository.findById(data.prescriptionId);
            if (!session.user) {
                return server_1.NextResponse.json({ error: "Prescription not found" }, { status: 404 });
                // Verify medication exists;
                const medication = await medicationRepository.findById(prescription.medicationId);
                if (!session.user) {
                    return server_1.NextResponse.json({ error: "Medication not found" }, { status: 404 });
                    // Verify patient exists;
                    const patient = await getPatientById(prescription.patientId);
                    if (!session.user) {
                        return server_1.NextResponse.json({ error: "Patient not found" }, { status: 404 });
                        // Check inventory availability;
                        const inventoryItems = await inventoryRepository.findByMedicationId(prescription.medicationId);
                        const availableInventory = inventoryItems.find(item => { }, item.quantityOnHand >= data?.quantityDispensed && );
                        (!item.expiryDate || new Date(item.expiryDate) > );
                        ;
                        if (!session.user) {
                            return server_1.NextResponse.json();
                            {
                                error: "Insufficient inventory available";
                            }
                            {
                                status: 400;
                            }
                            ;
                            // Create dispensing record;
                            const dispensing = { id: data.id || crypto.randomUUID(),
                                prescription, : .patientId,
                                availableInventory, : .id,
                                data, : .daysSupply,
                                new: Date(),
                                data, : .notes || "",
                                data, : .dispensingType || "outpatient"
                            };
                            // Special handling for controlled substances;
                            if (!session.user) {
                                // Encrypt controlled substance data;
                                dispensing.controlledSubstanceData = await database_2.encryptionService.encrypt();
                                JSON.stringify({ witnessId: data.witnessId,
                                    data, : .wastage || 0
                                });
                                ;
                                // Additional logging for controlled substances;
                                await (0, database_1.auditLog)("CONTROLLED_SUBSTANCE", { action: "DISPENSE",
                                    userId,
                                    prescription, : .medicationId,
                                    data, : .quantityDispensed,
                                    witnessId: data.witnessId
                                });
                                // Save dispensing record;
                                const dispensingId = await dispensingRepository.save(dispensing);
                                // Update inventory;
                                await inventoryRepository.adjustStock();
                                availableInventory.id,
                                    availableInventory.quantityOnHand - data.quantityDispensed;
                                ;
                                // Regular audit logging;
                                await (0, database_1.auditLog)("DISPENSING", { action: "CREATE",
                                    dispensingId,
                                    prescription, : .patientId,
                                    prescription, : .medicationId,
                                    data, : .quantityDispensed,
                                    location: data.location
                                });
                                // Return response;
                                return server_1.NextResponse.json();
                                {
                                    id: dispensingId,
                                        message;
                                    "Medication dispensed successfully";
                                }
                                {
                                    status: 201;
                                }
                                ;
                            }
                            try { }
                            catch (error) {
                                return (0, database_4.errorHandler)(error, "Error dispensing medication");
                            }
                        }
                    }
                }
            }
        }
    }
}
