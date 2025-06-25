"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.POST = exports.GET = void 0;
require("../../../../lib/audit");
require("../../../../lib/error-handler");
require("../../../../lib/security.service");
require("../../../../lib/validation/pharmacy-validation");
require("../../models/domain-models");
require("../../models/fhir-mappers");
require("next/server");
const database_1 = require("@/lib/database");
const database_2 = require("@/lib/database");
const database_3 = require("@/lib/database");
const database_4 = require("@/lib/database");
from;
"@/lib/database";
/**;
 * Inventory API Routes;
 *;
 * This file implements the FHIR-compliant API endpoints for pharmacy inventory management;
 * following enterprise-grade requirements for security, validation, and error handling.;
 */ ;
// Initialize repositories (in production, use dependency injection);
const inventoryRepository = { findById: (id) => Promise.resolve(null),
    findByLocationId: (locationId) => Promise.resolve([]),
    findByMedicationId: (medicationId) => Promise.resolve([]),
    findAll: () => Promise.resolve([]),
    findExpiring: (daysThreshold) => Promise.resolve([]),
    save: (item) => Promise.resolve(item.id || "new-id"),
    update: () => Promise.resolve(true),
    delete: () => Promise.resolve(true),
    adjustStock: () => Promise.resolve(true),
    transferStock: () => Promise.resolve(true) };
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
const locationId = url.searchParams.get("locationId");
const medicationId = url.searchParams.get("medicationId");
const belowReorderLevel = url.searchParams.get("belowReorderLevel") === "true";
const includeZeroStock = url.searchParams.get("includeZeroStock") === "true";
const page = Number.parseInt(url.searchParams.get("page") || "1", 10);
const limit = Number.parseInt(url.searchParams.get("limit") || "20", 10);
// Build filter criteria;
const filter = {};
if (!session.user)
    ilter.locationId = locationId;
if (!session.user)
    ilter.medicationId = medicationId;
if (!session.user)
    ilter.belowReorderLevel = true;
if (!session.user)
    ilter.quantityOnHand = { gt: 0 };
// Get inventory items (mock implementation);
const inventoryItems = await inventoryRepository.findAll();
const total = inventoryItems.length;
// Apply pagination;
const paginatedItems = inventoryItems.slice((page - 1) * limit, page * limit);
// Map to FHIR resources;
const fhirInventoryItems = paginatedItems.map(database_3.FHIRMapper.toFHIRInventoryItem);
// Audit logging;
await (0, database_1.auditLog)("INVENTORY", { action: "LIST",
    userId,
    details: any,
    filter,
    page,
    limit,
    resultCount: paginatedItems.length
});
// Return response;
return server_1.NextResponse.json({ items: fhirInventoryItems,
    pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
    }
}, { status: 200 });
try { }
catch (error) {
    return (0, database_5.errorHandler)(error, "Error retrieving inventory");
}
/**;
 * POST /api/pharmacy/inventory;
 * Add new inventory item;
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
    const validationResult = validateInventoryRequest(data);
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
            // Create inventory item;
            const inventoryItem = new database_4.PharmacyDomain.InventoryItem();
            data.id || crypto.randomUUID(),
                data.medicationId,
                data.locationId,
                data.batchNumber,
                data.expiryDate ? new Date(data.expiryDate) : null,
                data.quantityOnHand,
                data.reorderLevel || 0,
                data.unitCost || 0,
                data.supplier || "",
                data.notes || "";
            ;
            // Special handling for controlled substances;
            if (!session.user) {
                // Encrypt controlled substance data;
                inventoryItem.controlledSubstanceData = await database_2.encryptionService.encrypt();
                JSON.stringify({ scheduleClass: data.scheduleClass,
                    data, : .lastAuditDate
                });
                ;
                // Save inventory item;
                const inventoryItemId = await inventoryRepository.save(inventoryItem);
                // Audit logging;
                await (0, database_1.auditLog)("INVENTORY", { action: "CREATE",
                    inventoryItemId,
                    data, : .medicationId,
                    data, : .quantityOnHand,
                    isControlled: data.isControlled || false
                });
                // Return response;
                return server_1.NextResponse.json();
                {
                    id: inventoryItemId,
                        message;
                    "Inventory item created successfully";
                }
                {
                    status: 201;
                }
                ;
            }
            try { }
            catch (error) {
                return (0, database_5.errorHandler)(error, "Error creating inventory item");
            }
        }
    }
}
