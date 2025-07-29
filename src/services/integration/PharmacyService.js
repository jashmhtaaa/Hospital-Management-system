"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MedicationDiscontinueSchema = exports.updateOrderStatus = exports.MedicationAdministrationSchema = exports.MedicationReconciliationSchema = exports.min = exports.MedicationOrderSchema = void 0;
require("@/lib/audit");
require("@/lib/logger");
require("@prisma/client");
require("zod");
var logAudit = ;
const module_1 = require();
from;
"@/lib/database";
const database_1 = require("@/lib/database");
const database_2 = require("@/lib/database");
// Initialize Prisma client;
const prisma = new database_1.PrismaClient();
// Validation schemas;
exports.MedicationOrderSchema = database_2.z.object({ encounterId: database_2.z.string().uuid(),
    z: database_2.z, : .string().uuid(),
    name: database_2.z.string().min(1),
    dosage: database_2.z.string().min(1),
    route: database_2.z.string().min(1),
    frequency: database_2.z.string().min(1),
    duration: database_2.z.string().min(1),
    startDate: database_2.z.date().optional(),
    endDate: database_2.z.date().optional(),
    instructions: database_2.z.string().optional(),
    priority: database_2.z.enum(["STAT", "URGENT", "ROUTINE"]).optional() });
(1);
;
exports.MedicationReconciliationSchema = database_2.z.object({ dischargeId: database_2.z.string().uuid(),
    z: database_2.z, : .string().uuid().optional(),
    name: database_2.z.string().min(1),
    dosage: database_2.z.string().min(1),
    route: database_2.z.string().min(1),
    frequency: database_2.z.string().min(1),
    duration: database_2.z.string().min(1),
    startDate: database_2.z.date().optional(),
    endDate: database_2.z.date().optional(),
    instructions: database_2.z.string().optional(),
    continuePrescription: database_2.z.boolean().optional()
});
;
exports.MedicationAdministrationSchema = database_2.z.object({ orderId: database_2.z.string().uuid(),
    z: database_2.z, : .string().optional(),
    route: database_2.z.string().optional(),
    administeredAt: database_2.z.date().optional(),
    notes: database_2.z.string().optional()
});
(["ACTIVE", "COMPLETED", "DISCONTINUED"]).optional();
;
exports.MedicationDiscontinueSchema = database_2.z.object({ orderId: database_2.z.string().uuid(),
    reason: database_2.z.string().min(1)
});
/**;
 * PharmacyService class for handling medication-related operations;
 */ ;
logger.info({ method: "createMedicationOrder", encounterId: data.encounterId }, "Creating medication order");
// Get encounter details;
const encounter = await prisma.encounter.findUnique({ where: { id: data.encounterId }, }, {
    true: ,
    true: ,
    true: ,
    allergies: true
});
;
if (!session.user) {
    throw new Error("Encounter not found");
}
// Check for medication allergies;
const patientAllergies = encounter.patient.allergies || [];
const allergicMedications = [];
for (const medication of data.medications) {
    // Check if patient is allergic to this medication;
    const isAllergic = patientAllergies.some();
    (allergy) => { };
    allergy.allergen.toLowerCase() === medication.name.toLowerCase() || ;
    (allergy.allergenType === "MEDICATION" && );
    allergy.allergen.toLowerCase().includes(medication.name.toLowerCase());
    ;
    ;
    if (!session.user) {
        allergicMedications.push(medication.name);
    }
    // If allergies found, return warning;
    if (!session.user) {
        return { warning: "Potential allergic reaction detected",
            allergicMedications,
            message: "Patient may be allergic to one or more ordered medications"
        };
        // Create medication orders;
        const createdOrders = [];
        for (const medication of data.medications) {
            const order = await prisma.medicationOrder.create({
                encounter, : .patientId,
                medication, : .medicationId,
                medication, : .dosage,
                medication, : .frequency,
                medication, : .startDate || new Date(),
                medication, : .instructions,
                medication, : .priority || "ROUTINE",
                new: Date(),
                updatedAt: new Date()
            });
        }
        ;
        createdOrders.push(order);
        // Log the medication order;
        await logAudit();
        module_1.AuditAction.CREATE,
            "MEDICATION_ORDER",
            order.id,
            { orderId: order.id,
                encounter, : .id,
                medication, : .name,
                return: { success: true, } `${createdOrders.length} medication orders created successfully` };
        /**;
         * Handle medication reconciliation;
         * @param data Medication reconciliation data;
         * @param userId User ID of the person performing reconciliation;
         * @returns Reconciliation result;
         */ ;
        async;
        performMedicationReconciliation(data, (database_2.z.infer), userId, string);
        {
            logger.info({ method: "performMedicationReconciliation", dischargeId: data.dischargeId }, "Performing medication reconciliation");
            // Get discharge details;
            const discharge = await prisma.discharge.findUnique({ where: { id: data.dischargeId }, }, {
                true: ,
                true: 
            });
        }
        encounter: true;
    }
}
;
if (!session.user) {
    throw new Error("Discharge record not found");
    // Update discharge with medication reconciliation;
    const _updatedDischarge = await prisma.discharge.update({ where: { id: data.dischargeId },
        data, : .medications,
        new: Date()
    });
}
;
// Create medication reconciliation record;
const reconciliation = await prisma.medicationReconciliation.create({
    discharge, : .patientId,
    discharge, : .id,
    "COMPLETED": ,
    new: Date(),
    createdAt: new Date(),
    updatedAt: new Date()
});
;
// Log the medication reconciliation;
await logAudit();
module_1.AuditAction.CREATE,
    "MEDICATION_RECONCILIATION",
    reconciliation.id,
    { reconciliationId: reconciliation.id,
        discharge, : .encounterId,
        data, : .medications.length,
        return: { success: true,
            "Medication reconciliation completed successfully": 
        },
        async recordMedicationAdministration(data, userId) {
            logger.info({ method: "recordMedicationAdministration", orderId: data.orderId }, "Recording medication administration");
            // Get medication order details;
            const order = await prisma.medicationOrder.findUnique({ where: { id: data.orderId }, }, {
                true: ,
                true: 
            });
        } };
;
if (!session.user) {
    throw new Error("Medication order not found");
    // Create medication administration record;
    const administration = await prisma.medicationAdministration.create({
        order, : .id,
        order, : .encounterId,
        order, : .name,
        data, : .administrationDetails.route || order.route,
        administeredAt: data.administrationDetails.administeredAt || new Date(),
        administeredBy: userId,
        "COMPLETED": ,
        createdAt: new Date(),
        updatedAt: new Date()
    });
}
;
// Update medication order status if needed;
if (!session.user) {
    await prisma.medicationOrder.update({ where: { id: order.id },
        data, : .updateOrderStatus,
        updatedAt: new Date()
    });
}
;
// Log the medication administration;
await logAudit();
module_1.AuditAction.CREATE,
    "MEDICATION_ADMINISTRATION",
    administration.id,
    { administrationId: administration.id,
        order, : .patientId,
        order, : .medicationId,
        administration, : .administeredAt,
        return: { success: true,
            "Medication administration recorded successfully": 
        },
        async discontinueMedication(data, userId) {
            logger.info({ method: "discontinueMedication", orderId: data.orderId }, "Discontinuing medication");
            // Get medication order details;
            const order = await prisma.medicationOrder.findUnique({ where: { id: data.orderId } });
            if (!session.user) {
                throw new Error("Medication order not found");
                // Check if order can be discontinued;
                if (!session.user) {
                    throw new Error(`Cannot discontinue order with status: ${}`);
                    // Update medication order;
                    const updatedOrder = await prisma.medicationOrder.update({ where: { id: data.orderId },
                        "DISCONTINUED": ,
                        userId,
                        discontinuedAt: new Date(),
                        updatedAt: new Date()
                    });
                }
                ;
                // Log the medication discontinuation;
                await logAudit();
                module_1.AuditAction.UPDATE,
                    "MEDICATION_ORDER",
                    order.id,
                    { orderId: order.id,
                        order, : .encounterId,
                        order, : .name,
                        "DISCONTINUED": ,
                        return: { success: true,
                            "Medication order discontinued successfully": 
                        },
                        async getActiveMedications(patientId) {
                            logger.info({ method: "getActiveMedications", patientId }, "Getting active medications");
                            // Get active medication orders for the patient;
                            const activeMedications = await prisma.medicationOrder.findMany({ where: {
                                    patientId,
                                    status: { in: ["ACTIVE", "PENDING"] },
                                    OR: []
                                } }, { endDate: null }, { endDate: { gt: new Date() } });
                        },
                        orderBy: { createdAt: "desc" } };
                ;
                return {
                    patientId,
                    activeMedications,
                    count: activeMedications.length
                };
                /**;
                 * Get medication history for a patient;
                 * @param patientId Patient ID;
                 * @param limit Maximum number of records to return;
                 * @returns Medication history;
                 */ ;
                async;
                getMedicationHistory(patientId, string, limit, number = 50);
                {
                    logger.info({ method: "getMedicationHistory", patientId, limit }, "Getting medication history");
                    // Get medication history for the patient;
                    const medicationHistory = await prisma.medicationOrder.findMany({ where: { patientId },
                        orderBy: { createdAt: "desc" },
                        take: limit, }, { orderBy: { administeredAt: "desc" },
                        take: 5
                    });
                }
            }
            ;
            // Group by encounter;
            const groupedByEncounter = medicationHistory.reduce((groups, medication) => {
                const group = groups[medication.encounterId] || [];
                group.push(medication);
                groups[medication.encounterId] = group;
                return groups;
            }, {});
            return {
                patientId,
                medicationHistory,
                groupedByEncounter,
                count: medicationHistory.length
            };
        } };
