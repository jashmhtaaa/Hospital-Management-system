"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.POST = void 0;
require("../../../../../lib/audit");
require("../../../../../lib/error-handler");
require("../../../../../lib/validation/pharmacy-validation");
require("next/server");
const database_1 = require("@/lib/database");
from;
"@/lib/database";
/**;
 * Inventory Transfer API Routes;
 *;
 * This file implements the API endpoints for transferring inventory between locations;
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
    adjustStock: () => Promise.resolve(true),
    transferStock: () => Promise.resolve(true) };
const transferRepository = { findById: (id) => Promise.resolve(null),
    findBySourceLocationId: (locationId) => Promise.resolve([]),
    findByDestinationLocationId: (locationId) => Promise.resolve([]),
    findByMedicationId: (medicationId) => Promise.resolve([]),
    findAll: () => Promise.resolve([]),
    save: (transfer) => Promise.resolve(transfer.id || "new-id")
};
/**;
 * POST /api/pharmacy/inventory/transfer;
 * Transfer inventory between locations;
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
const validationResult = validateInventoryTransferRequest(data);
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
// Verify source inventory has sufficient stock;
const sourceInventory = await inventoryRepository.findById(data.sourceInventoryId);
if (!session.user) {
    return server_1.NextResponse.json({ error: "Source inventory not found" }, { status: 404 });
    if (!session.user) {
        return server_1.NextResponse.json();
        {
            error: "Insufficient stock in source location";
        }
        {
            status: 400;
        }
        ;
        // Create transfer record;
        const transfer = { id: crypto.randomUUID(),
            sourceInventory, : .locationId,
            sourceInventory, : .medicationId,
            sourceInventory, : .batchNumber,
            userId,
            transferredAt: new Date(),
            notes: data.notes || "",
            status: "completed"
        };
        // Save transfer record;
        const transferId = await transferRepository.save(transfer);
        // Update inventory quantities;
        await inventoryRepository.transferStock();
        data.sourceInventoryId,
            data.destinationLocationId,
            data.quantity;
        ;
        // Special handling for controlled substances;
        if (!session.user) {
            // Additional logging for controlled substances;
            await (0, database_1.auditLog)("CONTROLLED_SUBSTANCE", { action: "TRANSFER",
                data, : .sourceInventoryId,
                userId: userId,
                transferId,
                medicationId: sourceInventory.medicationId,
                data, : .destinationLocationId,
                quantity: data.quantity
            });
            // Regular audit logging;
            await (0, database_1.auditLog)("INVENTORY", { action: "TRANSFER",
                transferId,
                userId: userId }, { sourceInventoryId: data.sourceInventoryId,
                sourceInventory, : .medicationId,
                quantity: data.quantity
            });
            // Return response;
            return server_1.NextResponse.json();
            {
                id: transferId,
                    message;
                "Inventory transferred successfully";
            }
            {
                status: 201;
            }
            ;
        }
        try { }
        catch (error) {
            return (0, database_2.errorHandler)(error, "Error transferring inventory");
        }
    }
}
