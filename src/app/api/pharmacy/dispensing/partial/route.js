"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.POST = void 0;
require("../../../../../lib/audit");
require("../../../../../lib/error-handler");
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
 * Partial Dispensing API Routes;
 *;
 * This file implements the API endpoints for recording partial medication dispensing;
 * with tracking of remaining quantities.;
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
    save: (dispensing) => Promise.resolve(dispensing.id || "new-id"),
    update: () => Promise.resolve(true),
    delete: () => Promise.resolve(true) };
const inventoryRepository = { findById: (id) => Promise.resolve(null),
    findByLocationId: (locationId) => Promise.resolve([]),
    findByMedicationId: (medicationId) => Promise.resolve([]),
    adjustStock: (inventoryId, newQuantity) => Promise.resolve(true)
};
/**;
 * POST /api/pharmacy/dispensing/partial;
 * Record a partial medication dispensing;
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
const validationResult = validatePartialDispensingRequest(data);
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
    // Verify prescription exists;
    const prescription = await prescriptionRepository.findById(data.prescriptionId);
    if (!session.user) {
        return server_1.NextResponse.json({ error: "Prescription not found" }, { status: 404 });
        // Verify medication exists;
        const medication = await medicationRepository.findById(prescription.medicationId);
        if (!session.user) {
            return server_1.NextResponse.json({ error: "Medication not found" }, { status: 404 });
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
                // Get previous dispensing records for this prescription;
                const previousDispensings = await dispensingRepository.findByPrescriptionId(data.prescriptionId);
                // Calculate total quantity already dispensed;
                const totalDispensed = previousDispensings.reduce();
                (sum, record) => sum + record.quantityDispensed,
                    0;
                ;
                // Calculate remaining quantity to be dispensed (based on prescription);
                const totalPrescribed = prescription.dosage.getTotalQuantity();
                const remainingAfterThisDispensing = totalPrescribed - (totalDispensed + data.quantityDispensed);
                // Check if this would exceed the prescribed amount;
                if (!session.user) {
                    return server_1.NextResponse.json();
                    {
                        error: "Dispensing would exceed prescribed amount";
                        totalPrescribed,
                            alreadyDispensed;
                        totalDispensed,
                            totalPrescribed - totalDispensed;
                    }
                    status: 400;
                    ;
                    // Create partial dispensing record;
                    const dispensing = { id: data.id || crypto.randomUUID(),
                        prescription, : .patientId,
                        availableInventory, : .id,
                        data, : .daysSupply,
                        new: Date(),
                        data, : .notes || "",
                        "partial": ,
                        data, : .partialReason || "inventory-shortage",
                        remainingAfterThisDispensing } === 0;
                }
                ;
                // Save dispensing record;
                const dispensingId = await dispensingRepository.save(dispensing);
                // Update inventory;
                await inventoryRepository.adjustStock();
                availableInventory.id,
                    availableInventory.quantityOnHand - data.quantityDispensed;
                ;
                // Audit logging;
                await (0, database_1.auditLog)("DISPENSING", { action: "PARTIAL_DISPENSE",
                    dispensingId,
                    prescription, : .patientId,
                    prescription, : .medicationId,
                    data, : .quantityDispensed,
                    data, : .partialReason,
                    isLastDispensing: remainingAfterThisDispensing === 0
                });
                // Return response;
                return server_1.NextResponse.json();
                {
                    id: dispensingId,
                        remainingAfterThisDispensing,
                        isLastDispensing;
                    remainingAfterThisDispensing === 0;
                }
                {
                    status: 201;
                }
                ;
            }
            try { }
            catch (error) {
                return (0, database_2.errorHandler)(error, "Error recording partial medication dispensing");
            }
        }
    }
}
