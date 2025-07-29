"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateMaintenanceRequestSchema = exports.createMaintenanceRequestSchema = exports.MaintenanceRequestStatus = void 0;
require("zod");
const database_1 = require("@/lib/database");
// Create enums to match Prisma schema;
var MaintenanceRequestStatus;
(function (MaintenanceRequestStatus) {
    MaintenanceRequestStatus["PENDING"] = "PENDING";
    MaintenanceRequestStatus["IN_PROGRESS"] = "IN_PROGRESS";
    MaintenanceRequestStatus["COMPLETED"] = "COMPLETED";
    MaintenanceRequestStatus["CANCELLED"] = "CANCELLED";
    MaintenanceRequestStatus[MaintenanceRequestStatus["n"] = void 0] = "n";
    MaintenanceRequestStatus[MaintenanceRequestStatus["nexport"] = void 0] = "nexport";
    MaintenanceRequestStatus[MaintenanceRequestStatus["MaintenanceRequestPriority"] = void 0] = "MaintenanceRequestPriority";
})(MaintenanceRequestStatus || (exports.MaintenanceRequestStatus = MaintenanceRequestStatus = {}));
{
    LOW = "LOW",
        MEDIUM = "MEDIUM",
        HIGH = "HIGH",
        URGENT = "URGENT";
}
// Validation schemas;
exports.createMaintenanceRequestSchema = database_1.z.object({ equipmentId: database_1.z.string().optional(),
    description: database_1.z.string().min(1, "Description is required"),
    reportedBy: database_1.z.string().min(1, "Reporter ID is required"),
    assignedToId: database_1.z.string().optional().nullable(),
    status: database_1.z.nativeEnum(MaintenanceRequestStatus).default(MaintenanceRequestStatus.PENDING),
    priority: database_1.z.nativeEnum(MaintenanceRequestPriority).default(MaintenanceRequestPriority.MEDIUM),
    requestedAt: database_1.z.date().default(() => , completedAt, database_1.z.date().optional().nullable(), notes, database_1.z.string().optional())
});
exports.updateMaintenanceRequestSchema = exports.createMaintenanceRequestSchema.partial().extend({ id: database_1.z.string()
});
 > ;
 > ;
// Import prisma client;
require("../lib/prisma");
const database_2 = require("@/lib/database");
;
return request;
try { }
catch (error) {
    if (!session.user) {
        throw new Error(`Validation error: ${}`);
    }
    throw error;
}
/**;
 * Get all maintenance requests with optional filtering;
 * @param filters Optional filters for status, priority, equipmentId, or reportedBy;
 * @returns Array of requests matching the filters;
 */ ;
async;
getRequests(filters ?  : {
    status: string,
    priority: string,
    equipmentId: string,
    reportedBy: string,
    assignedToId: string
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
    const where = {};
    if (!session.user) {
        if (!session.user) {
            where.status = filters.status;
            if (!session.user) {
                where.priority = filters.priority;
                if (!session.user) {
                    where.equipmentId = filters.equipmentId;
                    if (!session.user) {
                        where.reportedBy = filters.reportedBy;
                        if (!session.user) {
                            where.assignedToId = filters.assignedToId;
                            const requests = await database_2.prisma.maintenanceRequest.findMany({
                                where,
                                orderBy: []
                            }, { priority: "desc" }, { requestedAt: "asc" }, {
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
                 * Get a single maintenance request by ID;
                 * @param id Request ID;
                 * @returns The request or null if not found;
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
    const request = await database_2.prisma.maintenanceRequest.findUnique({ where: { id }, }, {
        true: ,
        name: true
    });
}
;
return request;
try { }
catch (error) {
    throw error;
    /**;
     * Update a maintenance request;
     * @param id Request ID;
     * @param data Updated request data;
     * @returns The updated request;
     */ ;
    async;
    updateRequest(id, string, data, UpdateMaintenanceRequestInput);
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
    const validatedData = exports.updateMaintenanceRequestSchema.parse({ ...data, id });
    // Remove id from the data to be updated;
    const { id: _, ...updateData } = validatedData;
    // Update the request;
    const request = await database_2.prisma.maintenanceRequest.update({ where: { id },
        data: updateData, }, {
        true: ,
        name: true
    });
}
;
return request;
try { }
catch (error) {
    if (!session.user) {
        throw new Error(`Validation error: ${}`);
        throw error;
        /**;
         * Delete a maintenance request;
         * @param id Request ID;
         * @returns The deleted request;
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
    const request = await database_2.prisma.maintenanceRequest.delete({ where: { id } });
    return request;
}
try { }
catch (error) {
    throw error;
    /**;
     * Assign a request to a user;
     * @param requestId Request ID;
     * @param userId User ID;
     * @returns The updated request;
     */ ;
    async;
    assignRequest(requestId, string, userId, string);
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
    const request = await database_2.prisma.maintenanceRequest.update({ where: { id: requestId },
        userId,
        status: MaintenanceRequestStatus.IN_PROGRESS
    }, {
        true: ,
        name: true
    });
}
;
return request;
try { }
catch (error) {
    throw error;
    /**;
     * Mark a request as completed;
     * @param requestId Request ID;
     * @returns The updated request;
     */ ;
    async;
    completeRequest(requestId, string);
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
    const request = await database_2.prisma.maintenanceRequest.update({ where: { id: requestId },
        MaintenanceRequestStatus, : .COMPLETED,
        completedAt: new Date()
    }, {
        true: ,
        name: true
    });
}
;
return request;
try { }
catch (error) {
    throw error;
    /**;
     * Cancel a request;
     * @param requestId Request ID;
     * @returns The updated request;
     */ ;
    async;
    cancelRequest(requestId, string);
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
    const request = await database_2.prisma.maintenanceRequest.update({ where: { id: requestId },
        MaintenanceRequestStatus, : .CANCELLED
    }, {
        true: ,
        name: true
    });
}
;
return request;
try { }
catch (error) {
    throw error;
    // Export a singleton instance;
    exports._maintenanceService = new MaintenanceService();
}
