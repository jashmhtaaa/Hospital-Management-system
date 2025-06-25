"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports._createMedication = exports.MedicationOrderSchema = exports.MedicationInventorySchema = exports.MedicationSchema = void 0;
require("zod");
const database_1 = require("@/lib/database");
/**;
 * Domain Models for Pharmacy Module;
 *;
 * This file contains the domain models for the pharmacy module,
 * following domain-driven design principles.;
 */ ;
;
;
discrepancies: Array > ;
// Validation schemas using Zod;
exports.MedicationSchema = database_1.z.object({ id: database_1.z.string(),
    name: database_1.z.string(),
    brandName: database_1.z.string(),
    ndc: database_1.z.string(),
    form: database_1.z.string(),
    strength: database_1.z.number().positive(),
    unit: database_1.z.string(),
    isControlled: database_1.z.boolean(),
    isHighAlert: database_1.z.boolean(),
    controlledSubstanceSchedule: database_1.z.string().optional(),
    therapeuticClass: database_1.z.string().optional(),
    manufacturer: database_1.z.string().optional(),
    description: database_1.z.string().optional(),
    warnings: database_1.z.array(database_1.z.string()).optional(),
    contraindications: database_1.z.array(database_1.z.string()).optional(),
    interactions: database_1.z.array(database_1.z.string()).optional(),
    sideEffects: database_1.z.array(database_1.z.string()).optional(),
    storageRequirements: database_1.z.string().optional(),
    requiresRefrigeration: database_1.z.boolean().optional(),
    requiresControlledStorage: database_1.z.boolean().optional()
});
exports.MedicationInventorySchema = database_1.z.object({ id: database_1.z.string(),
    medicationId: database_1.z.string(),
    locationId: database_1.z.string(),
    batchNumber: database_1.z.string(),
    lotNumber: database_1.z.string(),
    expirationDate: database_1.z.date(),
    quantity: database_1.z.number().int().nonnegative(),
    reorderThreshold: database_1.z.number().int().nonnegative(),
    reorderQuantity: database_1.z.number().int().positive(),
    lastCountDate: database_1.z.date(),
    status: database_1.z.enum(["active", "expired", "recalled", "depleted"]),
    cost: database_1.z.number().nonnegative(),
    supplier: database_1.z.string(),
    receivedDate: database_1.z.date(),
    notes: database_1.z.string().optional()
});
exports.MedicationOrderSchema = database_1.z.object({ id: database_1.z.string(),
    patientId: database_1.z.string(),
    providerId: database_1.z.string(),
    medicationId: database_1.z.string(),
    status: database_1.z.enum([]),
    "draft": , "active": , "on-hold": , "cancelled": , "completed": ,
    "entered-in-error": , "stopped": , "unknown":  });
orderDate: database_1.z.date(),
    database_1.z.string(),
    route;
database_1.z.string(),
    duration;
database_1.z.string(),
    startDate;
database_1.z.date().optional(),
    endDate;
database_1.z.date().optional(),
    indication;
database_1.z.string().optional(),
    notes;
database_1.z.string().optional(),
    isStatOrder;
database_1.z.boolean().optional(),
    prn;
database_1.z.boolean().optional(),
    prnReason;
database_1.z.string().optional(),
    reconciliationId;
database_1.z.string().optional();
;
// Factory functions to create domain objects with validation;
const _createMedication = (data) => {
    return exports.MedicationSchema.parse(data);
    export const _createMedicationInventory = (data) => {
        return exports.MedicationInventorySchema.parse(data);
        export const _createMedicationOrder = (data) => {
            return exports.MedicationOrderSchema.parse(data);
        };
    };
};
exports._createMedication = _createMedication;
