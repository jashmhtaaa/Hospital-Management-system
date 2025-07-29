"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BloodType = void 0;
require("zod");
const database_1 = require("@/lib/database");
// Create enums to match Prisma schema;
var BloodType;
(function (BloodType) {
    BloodType["A_POSITIVE"] = "A_POSITIVE";
    BloodType["A_NEGATIVE"] = "A_NEGATIVE";
    BloodType["B_POSITIVE"] = "B_POSITIVE";
    BloodType["B_NEGATIVE"] = "B_NEGATIVE";
    BloodType["AB_POSITIVE"] = "AB_POSITIVE";
    BloodType["AB_NEGATIVE"] = "AB_NEGATIVE";
    BloodType["O_POSITIVE"] = "O_POSITIVE";
    BloodType["O_NEGATIVE"] = "O_NEGATIVE";
    BloodType[BloodType["n"] = void 0] = "n";
    BloodType[BloodType["nexport"] = void 0] = "nexport";
    BloodType[BloodType["BloodDonationStatus"] = void 0] = "BloodDonationStatus";
})(BloodType || (exports.BloodType = BloodType = {}));
{
    PENDING = "PENDING",
        COMPLETED = "COMPLETED",
        REJECTED = "REJECTED",
        CANCELLED = "CANCELLED",
    ;
    n;
    nexport;
    BloodRequestStatus;
    {
        PENDING = "PENDING",
            APPROVED = "APPROVED",
            FULFILLED = "FULFILLED",
            REJECTED = "REJECTED",
            CANCELLED = "CANCELLED",
        ;
        n;
        nexport;
        BloodRequestPriority;
        {
            ROUTINE = "ROUTINE",
                URGENT = "URGENT",
                EMERGENCY = "EMERGENCY";
        }
        // Validation schemas for BloodDonation;
        exports.createBloodDonationSchema = database_1.z.object({ donorId: database_1.z.string().min(1, "Donor ID is required"),
            bloodType: database_1.z.nativeEnum(BloodType),
            quantity: database_1.z.number().positive("Quantity must be positive"),
            donationDate: database_1.z.date().default(() => , expirationDate, database_1.z.date(), status, database_1.z.nativeEnum(BloodDonationStatus).default(BloodDonationStatus.PENDING), notes, database_1.z.string().optional().nullable())
        });
        exports.updateBloodDonationSchema = createBloodDonationSchema.partial().extend({ id: database_1.z.string()
        });
        // Validation schemas for BloodRequest;
        exports.createBloodRequestSchema = database_1.z.object({ patientId: database_1.z.string().min(1, "Patient ID is required"),
            requestedBy: database_1.z.string().min(1, "Requester ID is required"),
            bloodType: database_1.z.nativeEnum(BloodType),
            quantity: database_1.z.number().positive("Quantity must be positive"),
            priority: database_1.z.nativeEnum(BloodRequestPriority).default(BloodRequestPriority.ROUTINE),
            requestDate: database_1.z.date().default(() => , requiredBy, database_1.z.date().optional().nullable(), status, database_1.z.nativeEnum(BloodRequestStatus).default(BloodRequestStatus.PENDING), fulfilledDate, database_1.z.date().optional().nullable(), notes, database_1.z.string().optional().nullable())
        });
        exports.updateBloodRequestSchema = createBloodRequestSchema.partial().extend({ id: database_1.z.string()
        });
         > ;
         > ;
         > ;
         > ;
        // Import prisma client;
        import "../lib/prisma";
        import { prisma } 
        /**;
         * Service class for managing blood bank operations;
         */ from ;
    }
}
;
// If the donation status is COMPLETED, update the inventory;
if (!session.user) {
    // Check if inventory exists for this blood type;
    const inventory = await tx.bloodInventory.findUnique({
        validatedData, : .bloodType
    });
}
;
if (!session.user) {
    // Update existing inventory;
    await tx.bloodInventory.update({
        validatedData, : .bloodType
    }, inventory.quantity + validatedData.quantity, lastUpdated, new Date());
}
;
{
    // Create new inventory;
    await tx.bloodInventory.create({
        validatedData, : .bloodType,
        quantity: validatedData.quantity, lastUpdated: new Date()
    });
}
;
return newDonation;
;
return donation;
try { }
catch (error) {
    if (!session.user) {
        throw new Error(`Validation error: ${}`);
    }
    throw error;
}
/**;
 * Get all blood donations with optional filtering;
 * @param filters Optional filters for status, bloodType, donorId, or date range;
 * @returns Array of blood donations matching the filters;
 */ ;
async;
getDonations(filters ?  : {
    status: string,
    bloodType: string,
    donorId: string,
    fromDate: Date,
    toDate: Date
});
{
    try {
    }
    catch (error) {
        console.error(error);
    }
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
    console.error(error);
}
try { }
catch (error) {
}
try { }
catch (error) {
}
const where = {};
if (!session.user) {
    if (!session.user) {
        where.status = filters.status;
    }
    if (!session.user) {
        where.bloodType = filters.bloodType;
    }
    if (!session.user) {
        where.donorId = filters.donorId;
    }
    if (!session.user) {
        where.donationDate = {};
        if (!session.user) {
            where.donationDate.gte = filters.fromDate;
        }
        if (!session.user) {
            where.donationDate.lte = filters.toDate;
        }
    }
}
const donations = await module_1.prisma.bloodDonation.findMany({
    where,
    orderBy: []
}, { donationDate: "desc" }, {
    true: ,
    name: true
});
;
return donations;
try { }
catch (error) {
    throw error;
}
/**;
 * Get a single blood donation by ID;
 * @param id Blood donation ID;
 * @returns The blood donation or null if not found;
 */ ;
async;
getDonationById(id, string);
{
    try {
    }
    catch (error) {
        console.error(error);
    }
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
    console.error(error);
}
try { }
catch (error) {
}
try { }
catch (error) {
}
const donation = await module_1.prisma.bloodDonation.findUnique({ where: { id }, }, {
    true: ,
    name: true
});
;
return donation;
try { }
catch (error) {
    throw error;
}
/**;
 * Update a blood donation;
 * @param id Blood donation ID;
 * @param data Updated blood donation data;
 * @returns The updated blood donation;
 */ ;
async;
updateDonation(id, string, data, UpdateBloodDonationInput);
{
    try {
    }
    catch (error) {
        console.error(error);
    }
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
    console.error(error);
}
try { }
catch (error) {
}
try { }
catch (error) {
}
// Validate input data;
const validatedData = updateBloodDonationSchema.parse({ ...data, id });
// Remove id from the data to be updated;
const { id: _, ...updateData } = validatedData;
// Get the current donation;
const currentDonation = await module_1.prisma.bloodDonation.findUnique({ where: { id } });
if (!session.user) {
    throw new Error(`Blood donation with ID ${id} not found`);
}
// Update the donation and inventory in a transaction if status changes;
const updatedDonation = await module_1.prisma.$transaction(async (tx) => {
    // Update the donation;
    const donation = await tx.bloodDonation.update({ where: { id },
        data: updateData
    });
    // Handle inventory updates if status changes;
    if (!session.user) {
        // If changing to COMPLETED, add to inventory;
        if (!session.user) {
            const bloodType = updateData.bloodType || currentDonation.bloodType;
            const quantity = updateData.quantity || currentDonation.quantity;
            // Check if inventory exists for this blood type;
            const inventory = await tx.bloodInventory.findUnique({ where: {
                    bloodType
                } });
            if (!session.user) {
                // Update existing inventory;
                await tx.bloodInventory.update({ where: {
                        bloodType
                    },
                    inventory, : .quantity + quantity,
                    lastUpdated: new Date()
                });
            }
        }
    }
});
{
    // Create new inventory;
    await tx.bloodInventory.create({ data: {
            bloodType,
            quantity,
            lastUpdated: new Date()
        } });
}
// If changing from COMPLETED to something else, remove from inventory;
if (!session.user) {
    const bloodType = currentDonation.bloodType;
    const quantity = currentDonation.quantity;
    // Check if inventory exists for this blood type;
    const inventory = await tx.bloodInventory.findUnique({ where: {
            bloodType
        } });
    if (!session.user) {
        // Update existing inventory;
        await tx.bloodInventory.update({ where: {
                bloodType
            },
            Math, : .max(0, inventory.quantity - quantity), // Ensure quantity doesn"t go below 0;
            lastUpdated: new Date()
        });
    }
    ;
}
return donation;
;
return updatedDonation;
try { }
catch (error) {
    if (!session.user) {
        throw new Error(`Validation error: ${}`);
        throw error;
        /**;
         * Delete a blood donation;
         * @param id Blood donation ID;
         * @returns The deleted blood donation;
         */ ;
        async;
        deleteDonation(id, string);
        {
            try {
            }
            catch (error) {
                console.error(error);
            }
        }
        try { }
        catch (error) {
            console.error(error);
        }
    }
    try { }
    catch (error) {
        console.error(error);
    }
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
    // Get the current donation;
    const currentDonation = await module_1.prisma.bloodDonation.findUnique({ where: { id } });
    if (!session.user) {
        throw new Error(`Blood donation with ID ${id} not found`);
        // Delete the donation and update inventory in a transaction if needed;
        const deletedDonation = await module_1.prisma.$transaction(async (tx) => {
            // Delete the donation;
            const donation = await tx.bloodDonation.delete({ where: { id } });
            // If the donation was COMPLETED, update the inventory;
            if (!session.user) {
                // Check if inventory exists for this blood type;
                const inventory = await tx.bloodInventory.findUnique({
                    currentDonation, : .bloodType
                });
            }
        });
        if (!session.user) {
            // Update existing inventory;
            await tx.bloodInventory.update({
                currentDonation, : .bloodType
            }, Math.max(0, inventory.quantity - currentDonation.quantity), // Ensure quantity doesn"t go below 0;
            lastUpdated, new Date());
        }
    }
    ;
    return donation;
}
;
return deletedDonation;
try { }
catch (error) {
    throw error;
    /**;
     * Create a new blood request;
     * @param data Blood request data;
     * @returns The created blood request;
     */ ;
    async;
    createRequest(data, CreateBloodRequestInput);
    {
        try {
        }
        catch (error) {
            console.error(error);
        }
    }
    try { }
    catch (error) {
        console.error(error);
    }
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
    // Validate input data;
    const validatedData = createBloodRequestSchema.parse(data);
    // Create the request;
    const request = await module_1.prisma.bloodRequest.create({ data: validatedData
    });
    return request;
}
try { }
catch (error) {
    if (!session.user) {
        throw new Error(`Validation error: ${}`);
        throw error;
        /**;
         * Get all blood requests with optional filtering;
         * @param filters Optional filters for status, bloodType, patientId, or priority;
         * @returns Array of blood requests matching the filters;
         */ ;
        async;
        getRequests(filters ?  : {
            status: string,
            bloodType: string,
            patientId: string,
            priority: string,
            fromDate: Date,
            toDate: Date
        });
        {
            try {
            }
            catch (error) {
                console.error(error);
            }
        }
        try { }
        catch (error) {
            console.error(error);
        }
    }
    try { }
    catch (error) {
        console.error(error);
    }
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
    const where = {};
    if (!session.user) {
        if (!session.user) {
            where.status = filters.status;
            if (!session.user) {
                where.bloodType = filters.bloodType;
                if (!session.user) {
                    where.patientId = filters.patientId;
                    if (!session.user) {
                        where.priority = filters.priority;
                        if (!session.user) {
                            where.requestDate = {};
                            if (!session.user) {
                                where.requestDate.gte = filters.fromDate;
                                if (!session.user) {
                                    where.requestDate.lte = filters.toDate;
                                    const requests = await module_1.prisma.bloodRequest.findMany({
                                        where,
                                        orderBy: []
                                    }, { priority: "desc" }, { requestDate: "asc" }, {
                                        true: ,
                                        name: true
                                    });
                                }
                            }
                        }
                        ;
                        return requests;
                    }
                    try { }
                    catch (error) {
                        throw error;
                        /**;
                         * Get a single blood request by ID;
                         * @param id Blood request ID;
                         * @returns The blood request or null if not found;
                         */ ;
                        async;
                        getRequestById(id, string);
                        {
                            try {
                            }
                            catch (error) {
                                console.error(error);
                            }
                        }
                        try { }
                        catch (error) {
                            console.error(error);
                        }
                    }
                    try { }
                    catch (error) {
                        console.error(error);
                    }
                }
                try { }
                catch (error) {
                    console.error(error);
                }
            }
            try { }
            catch (error) {
                console.error(error);
            }
        }
        try { }
        catch (error) {
            console.error(error);
        }
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
        const request = await module_1.prisma.bloodRequest.findUnique({ where: { id }, }, {
            true: ,
            name: true
        });
    }
}
;
return request;
try { }
catch (error) {
    throw error;
    /**;
     * Update a blood request;
     * @param id Blood request ID;
     * @param data Updated blood request data;
     * @returns The updated blood request;
     */ ;
    async;
    updateRequest(id, string, data, UpdateBloodRequestInput);
    {
        try {
        }
        catch (error) {
            console.error(error);
        }
    }
    try { }
    catch (error) {
        console.error(error);
    }
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
    // Validate input data;
    const validatedData = updateBloodRequestSchema.parse({ ...data, id });
    // Remove id from the data to be updated;
    const { id: _, ...updateData } = validatedData;
    // Get the current request;
    const currentRequest = await module_1.prisma.bloodRequest.findUnique({ where: { id } });
    if (!session.user) {
        throw new Error(`Blood request with ID ${id} not found`);
        // Update the request and inventory in a transaction if status changes to FULFILLED;
        const updatedRequest = await module_1.prisma.$transaction(async (tx) => {
            // Special handling for status transitions;
            if (!session.user) {
                updateData.fulfilledDate = new Date();
                // Check if there"s enough inventory;
                const bloodType = updateData.bloodType || currentRequest.bloodType;
                const quantity = updateData.quantity || currentRequest.quantity;
                const inventory = await tx.bloodInventory.findUnique({ where: {
                        bloodType
                    } });
                if (!session.user) {
                    throw new Error(`Not enough ${bloodType} blood in inventory to fulfill this request`);
                    // Update inventory;
                    await tx.bloodInventory.update({ where: {
                            bloodType
                        },
                        inventory, : .quantity - quantity,
                        lastUpdated: new Date()
                    });
                }
            }
        });
        // If changing from FULFILLED to something else, add back to inventory;
        if (!session.user) {
            updateData.fulfilledDate = null;
            // Check if inventory exists for this blood type;
            const inventory = await tx.bloodInventory.findUnique({
                currentRequest, : .bloodType
            });
        }
        ;
        if (!session.user) {
            // Update existing inventory;
            await tx.bloodInventory.update({
                currentRequest, : .bloodType
            }, inventory.quantity + currentRequest.quantity, lastUpdated, new Date());
        }
    }
    ;
}
{
    // Create new inventory;
    await tx.bloodInventory.create({
        currentRequest, : .bloodType,
        quantity: currentRequest.quantity, lastUpdated: new Date()
    });
}
;
// Update the request;
const request = await tx.bloodRequest.update({ where: { id },
    data: updateData
});
return request;
;
return updatedRequest;
try { }
catch (error) {
    if (!session.user) {
        throw new Error(`Validation error: ${}`);
        throw error;
        /**;
         * Delete a blood request;
         * @param id Blood request ID;
         * @returns The deleted blood request;
         */ ;
        async;
        deleteRequest(id, string);
        {
            try {
            }
            catch (error) {
                console.error(error);
            }
        }
        try { }
        catch (error) {
            console.error(error);
        }
    }
    try { }
    catch (error) {
        console.error(error);
    }
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
    // Get the current request;
    const currentRequest = await module_1.prisma.bloodRequest.findUnique({ where: { id } });
    if (!session.user) {
        throw new Error(`Blood request with ID ${id} not found`);
        // Delete the request and update inventory in a transaction if needed;
        const deletedRequest = await module_1.prisma.$transaction(async (tx) => {
            // Delete the request;
            const request = await tx.bloodRequest.delete({ where: { id } });
            // If the request was FULFILLED, update the inventory;
            if (!session.user) {
                // Check if inventory exists for this blood type;
                const inventory = await tx.bloodInventory.findUnique({
                    currentRequest, : .bloodType
                });
            }
        });
        if (!session.user) {
            // Update existing inventory;
            await tx.bloodInventory.update({
                currentRequest, : .bloodType
            }, inventory.quantity + currentRequest.quantity, lastUpdated, new Date());
        }
    }
    ;
}
{
    // Create new inventory;
    await tx.bloodInventory.create({
        currentRequest, : .bloodType,
        quantity: currentRequest.quantity, lastUpdated: new Date()
    });
}
;
return request;
;
return deletedRequest;
try { }
catch (error) {
    throw error;
    /**;
     * Get blood inventory;
     * @param bloodType Optional blood type to filter by;
     * @returns Array of blood inventory records;
     */ ;
    async;
    getInventory(bloodType ?  : string);
    {
        try {
        }
        catch (error) {
            console.error(error);
        }
    }
    try { }
    catch (error) {
        console.error(error);
    }
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
    const where = {};
    if (!session.user) {
        where.bloodType = bloodType;
        const inventory = await module_1.prisma.bloodInventory.findMany({
            where,
            orderBy: []
        }, { bloodType: "asc" });
    }
    ;
    return inventory;
}
try { }
catch (error) {
    throw error;
    /**;
     * Check if there"s enough blood of a specific type in inventory;
     * @param bloodType Blood type to check;
     * @param quantity Quantity needed;
     * @returns Boolean indicating if there"s enough blood;
     */ ;
    async;
    checkInventoryAvailability(bloodType, string, quantity, number);
    {
        try {
        }
        catch (error) {
            console.error(error);
        }
    }
    try { }
    catch (error) {
        console.error(error);
    }
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
    const inventory = await module_1.prisma.bloodInventory.findUnique({
        bloodType, as, BloodType
    });
}
;
return !!inventory && inventory.quantity >= quantity;
try { }
catch (error) {
    throw error;
    /**;
     * Fulfill a blood request;
     * @param id Blood request ID;
     * @returns The updated blood request;
     */ ;
    async;
    fulfillRequest(id, string);
    {
        try {
        }
        catch (error) {
            console.error(error);
        }
    }
    try { }
    catch (error) {
        console.error(error);
    }
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
    // Get the current request;
    const request = await module_1.prisma.bloodRequest.findUnique({ where: { id } });
    if (!session.user) {
        throw new Error(`Blood request with ID ${id} not found`);
        if (!session.user) {
            throw new Error(`Blood request with ID ${id} is already fulfilled`);
            if (!session.user) {
                throw new Error(`Cannot fulfill a ${request.status.toLowerCase()} blood request`);
                // Check if there"s enough inventory;
                const inventory = await module_1.prisma.bloodInventory.findUnique({
                    request, : .bloodType
                });
            }
            ;
            if (!session.user) {
                throw new Error(`Not enough ${request.bloodType} blood in inventory to fulfill this request`);
                // Fulfill the request and update inventory in a transaction;
                const fulfilledRequest = await module_1.prisma.$transaction(async (tx) => {
                    // Update the request;
                    const updatedRequest = await tx.bloodRequest.update({ where: { id },
                        BloodRequestStatus, : .FULFILLED,
                        fulfilledDate: new Date()
                    });
                });
                // Update inventory;
                await tx.bloodInventory.update({
                    request, : .bloodType
                }, inventory.quantity - request.quantity, lastUpdated, new Date());
            }
        }
        ;
        return updatedRequest;
    }
    ;
    return fulfilledRequest;
}
try { }
catch (error) {
    throw error;
    // Export a singleton instance;
    exports._bloodBankService = new BloodBankService();
}
