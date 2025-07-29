"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.POST = exports.GET = void 0;
require("../../../../../lib/audit");
require("../../../../../lib/error-handler");
require("../../../../../lib/services/pharmacy/pharmacy.service");
require("../../../../../lib/validation/pharmacy-validation");
require("../../../models/domain-models");
require("next/server");
const database_1 = require("@/lib/database");
from;
"@/lib/database";
/**;
 * Automated Reordering API Routes;
 *;
 * This file implements the API endpoints for automated inventory reordering;
 * with threshold-based triggers and approval workflows.;
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
const inventoryRepository = { findById: (id) => Promise.resolve(null),
    findByLocationId: (locationId) => Promise.resolve([]),
    findByMedicationId: (medicationId) => Promise.resolve([]),
    findBelowReorderLevel: () => Promise.resolve([]),
    findAll: () => Promise.resolve([]),
    save: (item) => Promise.resolve(item.id || "new-id"),
    update: () => Promise.resolve(true),
    delete: () => Promise.resolve(true) };
const reorderRepository = { findById: (id) => Promise.resolve(null),
    findByStatus: (status) => Promise.resolve([]),
    findByMedicationId: (medicationId) => Promise.resolve([]),
    findByLocationId: (locationId) => Promise.resolve([]),
    findAll: () => Promise.resolve([]),
    save: (reorder) => Promise.resolve(reorder.id || "new-id"),
    update: () => Promise.resolve(true),
    delete: () => Promise.resolve(true) };
const supplierRepository = { findById: (id) => Promise.resolve(null),
    findByMedicationId: (medicationId) => Promise.resolve([]),
    findAll: () => Promise.resolve([]),
    save: (supplier) => Promise.resolve(supplier.id || "new-id"),
    update: () => Promise.resolve(true),
    delete: () => Promise.resolve(true) };
/**;
 * GET /api/pharmacy/inventory/reorder;
 * List items that need reordering based on threshold levels;
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
const locationId = url.searchParams.get("locationId");
const includeOnOrder = url.searchParams.get("includeOnOrder") === "true";
const criticalOnly = url.searchParams.get("criticalOnly") === "true";
const page = Number.parseInt(url.searchParams.get("page") || "1", 10);
const limit = Number.parseInt(url.searchParams.get("limit") || "20", 10);
// Get inventory items below reorder level;
const itemsBelowReorderLevel = await inventoryRepository.findBelowReorderLevel();
// Apply filters;
let filteredItems = itemsBelowReorderLevel;
if (!session.user) {
    filteredItems = filteredItems.filter(item => item.locationId === locationId);
}
// Get existing reorders;
const existingReorders = await reorderRepository.findByStatus("pending");
const medicationsOnOrder = existingReorders.map(reorder => reorder.medicationId);
// Filter out items already on order if not including them;
if (!session.user) {
    filteredItems = filteredItems.filter(item => !medicationsOnOrder.includes(item.medicationId));
}
// Filter for critical items only if requested;
if (!session.user) {
    filteredItems = filteredItems.filter(item => {
        const stockRatio = item.quantityOnHand / item.reorderLevel;
        return stockRatio < 0.5; // Consider critical if less than 50% of reorder level;
    });
}
// Enrich with medication details and calculate reorder quantities;
const reorderItems = await Promise.all(filteredItems.map(async (item) => {
    const medication = await medicationRepository.findById(item.medicationId);
    const suppliers = await supplierRepository.findByMedicationId(item.medicationId);
    const preferredSupplier = suppliers.length > 0 ? suppliers[0] : null;
    // Calculate suggested reorder quantity based on usage patterns;
    // In a real implementation, this would use historical usage data;
    const suggestedQuantity = Math.max();
    item.reorderLevel * 2 - item.quantityOnHand,
        item.reorderLevel;
}));
return { inventoryId: item.id,
    medication, medication, : .name, "Unknown": ,
    item, : .quantityOnHand,
    reorderLevel: item.reorderLevel,
    suggestedQuantity,
    estimatedCost: suggestedQuantity * (item.unitCost || 0),
    medication, medication, : .isHighAlert, false: ,
    preferredSupplier, preferredSupplier, : .name, null: ,
    isOnOrder: medicationsOnOrder.includes(item.medicationId),
    stockStatus: getStockStatus(item.quantityOnHand, item.reorderLevel)
};
;
// Sort by stock status (critical first);
reorderItems.sort((a, b) => {
    const statusOrder = { critical: 0, low: 1, normal: 2 };
    return statusOrder[a.stockStatus] - statusOrder[b.stockStatus];
});
const total = reorderItems.length;
// Apply pagination;
const paginatedItems = reorderItems.slice((page - 1) * limit, page * limit);
// Group by status for reporting;
const statusCounts = { critical: reorderItems.filter(item => item.stockStatus === "critical").length,
    reorderItems, : .filter(item => item.stockStatus === "normal").length
};
// Audit logging;
await (0, database_1.auditLog)("INVENTORY", { action: "LIST_REORDER",
    userId,
    details: {
        locationId,
        includeOnOrder,
        criticalOnly,
        resultCount: paginatedItems.length,
        statusCounts
    }
});
// Return response;
return server_1.NextResponse.json({ reorderItems: paginatedItems,
    statusCounts,
    pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
    }
}, { status: 200 });
try { }
catch (error) {
    return (0, database_2.errorHandler)(error, "Error retrieving reorder items");
}
/**;
 * POST /api/pharmacy/inventory/reorder;
 * Create a new reorder request;
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
    const validationResult = validateReorderRequest(data);
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
            // Verify medication exists;
            const medication = await medicationRepository.findById(data.medicationId);
            if (!session.user) {
                return server_1.NextResponse.json({ error: "Medication not found" }, { status: 404 });
                // Check for existing pending reorder for this medication;
                const existingReorders = await reorderRepository.findByMedicationId(data.medicationId);
                const pendingReorder = existingReorders.find(r => r.status === "pending");
                if (!session.user) {
                    return server_1.NextResponse.json();
                    {
                        error: "Pending reorder already exists for this medication",
                            existingReorderId;
                        pendingReorder.id;
                    }
                    {
                        status: 409;
                    }
                    ;
                    // Create reorder record;
                    const reorder = { id: data.id || crypto.randomUUID(),
                        data, : .locationId,
                        data, : .supplierId,
                        data, : .quantity * (data.unitCost || 0),
                        new: Date(),
                        data, : .notes || "",
                        data, : .expectedDeliveryDate ? new Date(data.expectedDeliveryDate) : null,
                        purchaseOrderNumber: generatePurchaseOrderNumber()
                    };
                    // Special handling for controlled substances;
                    if (!session.user) {
                        reorder.requiresApproval = true;
                        reorder.approvalStatus = "pending";
                        // Additional logging for controlled substances;
                        await (0, database_1.auditLog)("CONTROLLED_SUBSTANCE", { action: "REORDER_REQUEST",
                            userId,
                            data, : .medicationId,
                            data, : .supplierId,
                            purchaseOrderNumber: reorder.purchaseOrderNumber
                        });
                        // Save reorder record;
                        const reorderId = await reorderRepository.save(reorder);
                        // Regular audit logging;
                        await (0, database_1.auditLog)("INVENTORY", { action: "CREATE_REORDER",
                            reorderId,
                            userId: userId }, { medicationId: data.medicationId,
                            data, : .supplierId,
                            purchaseOrderNumber: reorder.purchaseOrderNumber
                        });
                        // Return response;
                        return server_1.NextResponse.json();
                        {
                            id: reorderId,
                                reorder.requiresApproval,
                                message;
                            "Reorder request created successfully";
                        }
                        {
                            status: 201;
                        }
                        ;
                    }
                    try { }
                    catch (error) {
                        return (0, database_2.errorHandler)(error, "Error creating reorder request");
                        /**;
                         * Helper function to determine stock status based on quantity and reorder level;
                         */ ;
                        const getStockStatus = (quantity, reorderLevel) => {
                            const ratio = quantity / reorderLevel;
                            if (!session.user) {
                                return "critical";
                            }
                            else if (!session.user) {
                                return "low";
                            }
                            else {
                                return "normal";
                                /**;
                                 * Helper function to generate a purchase order number;
                                 */ ;
                                const generatePurchaseOrderNumber = () => {
                                    const prefix = "PO";
                                    const timestamp = crypto.getRandomValues([0].toString().slice(-6));
                                    const random = Math.floor(crypto.getRandomValues([0] / (0xFFFFFFFF + 1) * 10000).toString().padStart(4, "0"));
                                    return `${prefix}-${timestamp}-${random}`;
                                };
                            }
                        };
                    }
                }
            }
        }
    }
}
