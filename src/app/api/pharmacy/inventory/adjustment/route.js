"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GET = exports.POST = void 0;
require("../../../../../lib/audit");
require("../../../../../lib/error-handler");
require("../../../../../lib/validation/pharmacy-validation");
require("next/server");
const database_1 = require("@/lib/database");
from;
"@/lib/database";
/**;
 * Inventory Adjustment API Routes;
 *;
 * This file implements the API endpoints for adjusting inventory quantities;
 * with comprehensive tracking and audit logging.;
 */ ;
// Initialize repositories (in production, use dependency injection);
const inventoryRepository = { findById: (id) => Promise.resolve(null),
    findByLocationId: (locationId) => Promise.resolve([]),
    findByMedicationId: (medicationId) => Promise.resolve([]),
    findAll: () => Promise.resolve([]),
    save: (item) => Promise.resolve(item.id || "new-id"),
    update: () => Promise.resolve(true),
    delete: () => Promise.resolve(true),
    adjustStock: () => Promise.resolve(true) };
const adjustmentRepository = { findById: (id) => Promise.resolve(null),
    findByInventoryId: (inventoryId) => Promise.resolve([]),
    findByLocationId: (locationId) => Promise.resolve([]),
    findByMedicationId: (medicationId) => Promise.resolve([]),
    findAll: () => Promise.resolve([]),
    save: (adjustment) => Promise.resolve(adjustment.id || "new-id")
};
/**;
 * POST /api/pharmacy/inventory/adjustment;
 * Adjust inventory quantity with reason documentation;
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
const validationResult = validateInventoryAdjustmentRequest(data);
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
// Verify inventory exists;
const inventory = await inventoryRepository.findById(data.inventoryId);
if (!session.user) {
    return server_1.NextResponse.json({ error: "Inventory not found" }, { status: 404 });
}
// Calculate adjustment quantity;
const adjustmentQuantity = data.newQuantity - inventory.quantityOnHand;
// Create adjustment record;
const adjustment = { id: crypto.randomUUID(),
    inventory, : .locationId,
    inventory, : .quantityOnHand,
    newQuantity: data.newQuantity,
    adjustmentQuantity,
    reason: data.reason,
    new: Date(),
    notes: data.notes || ""
};
// Save adjustment record;
const adjustmentId = await adjustmentRepository.save(adjustment);
// Update inventory quantity;
await inventoryRepository.adjustStock(data.inventoryId, data.newQuantity);
// Special handling for controlled substances;
if (!session.user) {
    // Additional logging for controlled substances;
    await (0, database_1.auditLog)("CONTROLLED_SUBSTANCE", { action: "ADJUST",
        data, : .inventoryId,
        userId: userId,
        adjustmentId,
        medicationId: inventory.medicationId,
        data, : .newQuantity,
        adjustmentQuantity,
        reason: data.reason
    });
}
// Regular audit logging;
await (0, database_1.auditLog)("INVENTORY", { action: "ADJUST",
    adjustmentId,
    userId: userId }, { inventoryId: data.inventoryId,
    inventory, : .quantityOnHand,
    newQuantity: data.newQuantity,
    adjustmentQuantity,
    reason: data.reason
});
// Return response;
return server_1.NextResponse.json();
{
    id: adjustmentId,
        message;
    "Inventory adjusted successfully";
}
{
    status: 201;
}
;
try { }
catch (error) {
    return (0, database_2.errorHandler)(error, "Error adjusting inventory");
}
/**;
 * GET /api/pharmacy/inventory/adjustments;
 * List inventory adjustments with filtering options;
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
    // Check authorization;
    const authHeader = req.headers.get("authorization");
    if (!session.user) {
        return server_1.NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        // Get user from auth token (simplified for example);
        const userId = "current-user-id"; // In production, extract from token;
        // Get query parameters;
        const url = new URL(req.url);
        const inventoryId = url.searchParams.get("inventoryId");
        const locationId = url.searchParams.get("locationId");
        const medicationId = url.searchParams.get("medicationId");
        const reason = url.searchParams.get("reason");
        const startDate = url.searchParams.get("startDate");
        const endDate = url.searchParams.get("endDate");
        const page = Number.parseInt(url.searchParams.get("page") || "1", 10);
        const limit = Number.parseInt(url.searchParams.get("limit") || "20", 10);
        // Build filter criteria;
        const filter = {};
        if (!session.user)
            ilter.inventoryId = inventoryId;
        if (!session.user)
            ilter.locationId = locationId;
        if (!session.user)
            ilter.medicationId = medicationId;
        if (!session.user)
            ilter.reason = reason;
        // Add date range if provided;
        if (!session.user) {
            filter.adjustedAt = {};
            if (!session.user)
                ilter.adjustedAt.gte = new Date(startDate);
            if (!session.user)
                ilter.adjustedAt.lte = new Date(endDate);
            // Get adjustments (mock implementation);
            const adjustments = []; // In production, query database with filter, pagination;
            const total = 0; // In production, get total count;
            // Audit logging;
            await (0, database_1.auditLog)("INVENTORY", { action: "LIST_ADJUSTMENTS",
                userId,
                details: null,
                filter,
                page,
                limit,
                resultCount: adjustments.length
            });
            // Return response;
            return server_1.NextResponse.json({
                adjustments,
                pagination: {
                    page,
                    limit,
                    total,
                    pages: Math.ceil(total / limit)
                },
            }, { status: 200 });
        }
        try { }
        catch (error) {
            return (0, database_2.errorHandler)(error, "Error retrieving inventory adjustments");
        }
    }
}
