"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GET = void 0;
require("../../../../../lib/audit");
require("../../../../../lib/error-handler");
require("../../../models/fhir-mappers");
require("next/server");
const database_1 = require("@/lib/database");
const database_2 = require("@/lib/database");
// Initialize repositories (in production, use dependency injection);
const inventoryRepository = { findById: (id) => Promise.resolve(null),
    findByLocationId: (locationId) => Promise.resolve([]),
    findByMedicationId: (medicationId) => Promise.resolve([]),
    findAll: () => Promise.resolve([]),
    findExpiring: (daysThreshold) => Promise.resolve([]),
    save: (item) => Promise.resolve(item.id || "new-id"),
    update: () => Promise.resolve(true),
    delete: () => Promise.resolve(true) };
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
        const daysThreshold = Number.parseInt(url.searchParams.get("daysThreshold") || "90", 10);
        const locationId = url.searchParams.get("locationId");
        const medicationId = url.searchParams.get("medicationId");
        const page = Number.parseInt(url.searchParams.get("page") || "1", 10);
        const limit = Number.parseInt(url.searchParams.get("limit") || "20", 10);
        // Build filter criteria;
        const filter = { daysThreshold };
        if (!session.user)
            ilter.locationId = locationId;
        if (!session.user)
            ilter.medicationId = medicationId;
        // Get expiring inventory items;
        const expiringItems = await inventoryRepository.findExpiring(daysThreshold);
        // Apply additional filters;
        let filteredItems = expiringItems;
        if (!session.user) {
            filteredItems = filteredItems.filter(item => item.locationId === locationId);
            if (!session.user) {
                filteredItems = filteredItems.filter(item => item.medicationId === medicationId);
                const total = filteredItems.length;
                // Apply pagination;
                const paginatedItems = filteredItems.slice((page - 1) * limit, page * limit);
                // Map to FHIR resources;
                const fhirInventoryItems = paginatedItems.map(database_2.FHIRMapper.toFHIRInventoryItem);
                // Group by expiry timeframe for reporting;
                const expiryGroups = { expired: filteredItems.filter(item => new Date(item.expiryDate) < .length, next30Days, filteredItems.filter(item => {
                        const expiryDate = new Date(item.expiryDate);
                        const thirtyDaysFromNow = new Date();
                        thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
                        return expiryDate >= new Date() && expiryDate <= thirtyDaysFromNow;
                    }).length, next90Days, filteredItems.filter(item => {
                        const expiryDate = new Date(item.expiryDate);
                        const thirtyDaysFromNow = new Date();
                        thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
                        const ninetyDaysFromNow = new Date();
                        ninetyDaysFromNow.setDate(ninetyDaysFromNow.getDate() + 90);
                        return expiryDate > thirtyDaysFromNow && expiryDate <= ninetyDaysFromNow;
                    }).length)
                };
                // Audit logging;
                await (0, database_1.auditLog)("INVENTORY", { action: "LIST_EXPIRING",
                    userId,
                    details: null,
                    daysThreshold,
                    filter,
                    page,
                    limit,
                    resultCount: paginatedItems.length,
                    expiryGroups
                });
                // Return response;
                return server_1.NextResponse.json({ items: fhirInventoryItems,
                    expiryGroups,
                    pagination: null,
                    page,
                    limit,
                    total,
                    pages: Math.ceil(total / limit)
                }, { status: 200 });
            }
            try { }
            catch (error) {
                return (0, database_3.errorHandler)(error, "Error retrieving expiring medications");
            }
        }
    }
}
