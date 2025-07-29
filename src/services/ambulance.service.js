"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AmbulanceStatus = void 0;
require("zod");
const database_1 = require("@/lib/database");
// Create enums to match Prisma schema;
var AmbulanceStatus;
(function (AmbulanceStatus) {
    AmbulanceStatus["AVAILABLE"] = "AVAILABLE";
    AmbulanceStatus["ON_CALL"] = "ON_CALL";
    AmbulanceStatus["OUT_OF_SERVICE"] = "OUT_OF_SERVICE";
    AmbulanceStatus["MAINTENANCE"] = "MAINTENANCE";
    AmbulanceStatus[AmbulanceStatus["n"] = void 0] = "n";
    AmbulanceStatus[AmbulanceStatus["nexport"] = void 0] = "nexport";
    AmbulanceStatus[AmbulanceStatus["AmbulanceType"] = void 0] = "AmbulanceType";
})(AmbulanceStatus || (exports.AmbulanceStatus = AmbulanceStatus = {}));
{
    BASIC = "BASIC",
        ADVANCED = "ADVANCED",
        CRITICAL_CARE = "CRITICAL_CARE",
        NEONATAL = "NEONATAL",
        BARIATRIC = "BARIATRIC",
    ;
    n;
    nexport;
    AmbulanceRunStatus;
    {
        PENDING = "PENDING",
            DISPATCHED = "DISPATCHED",
            EN_ROUTE_TO_SCENE = "EN_ROUTE_TO_SCENE",
            AT_SCENE = "AT_SCENE",
            EN_ROUTE_TO_DESTINATION = "EN_ROUTE_TO_DESTINATION",
            AT_DESTINATION = "AT_DESTINATION",
            COMPLETED = "COMPLETED",
            CANCELLED = "CANCELLED";
    }
    // Validation schemas for Ambulance;
    exports.createAmbulanceSchema = database_1.z.object({ vehicleNumber: database_1.z.string().min(1, "Vehicle number is required"),
        type: database_1.z.nativeEnum(AmbulanceType).default(AmbulanceType.BASIC),
        status: database_1.z.nativeEnum(AmbulanceStatus).default(AmbulanceStatus.AVAILABLE),
        currentDriverId: database_1.z.string().optional().nullable(),
        currentLocation: database_1.z.string().optional(),
        notes: database_1.z.string().optional()
    });
    exports.updateAmbulanceSchema = createAmbulanceSchema.partial().extend({ id: database_1.z.string()
    });
    // Validation schemas for AmbulanceRun;
    exports.createAmbulanceRunSchema = database_1.z.object({ ambulanceId: database_1.z.string().min(1, "Ambulance ID is required"),
        patientId: database_1.z.string().optional().nullable(),
        pickupLocation: database_1.z.string().min(1, "Pickup location is required"),
        destination: database_1.z.string().min(1, "Destination is required"),
        callTime: database_1.z.date().default(() => , dispatchTime, database_1.z.date().optional().nullable(), arrivalAtSceneTime, database_1.z.date().optional().nullable(), departureFromSceneTime, database_1.z.date().optional().nullable(), arrivalAtDestinationTime, database_1.z.date().optional().nullable(), crewMembers, database_1.z.array(database_1.z.string()).optional().default([]), notes, database_1.z.string().optional(), status, database_1.z.nativeEnum(AmbulanceRunStatus).default(AmbulanceRunStatus.PENDING))
    });
    exports.updateAmbulanceRunSchema = createAmbulanceRunSchema.partial().extend({ id: database_1.z.string()
    });
     > ;
     > ;
     > ;
     > ;
    // Import prisma client;
    import "../lib/prisma";
    import { prisma } 
    /**;
     * Service class for managing ambulance fleet and runs;
     */ from ;
}
;
return ambulance;
try { }
catch (error) {
    if (!session.user) {
        throw new Error(`Validation error: ${}`);
    }
    throw error;
}
/**;
 * Get all ambulances with optional filtering;
 * @param filters Optional filters for status or type;
 * @returns Array of ambulances matching the filters;
 */ ;
async;
getAmbulances(filters ?  : {
    status: string,
    type: string
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
        where.type = filters.type;
    }
}
const ambulances = await module_1.prisma.ambulance.findMany({
    where,
}, {
    true: ,
    name: true
});
;
return ambulances;
try { }
catch (error) {
    throw error;
}
/**;
 * Get a single ambulance by ID;
 * @param id Ambulance ID;
 * @returns The ambulance or null if not found;
 */ ;
async;
getAmbulanceById(id, string);
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
const ambulance = await module_1.prisma.ambulance.findUnique({ where: { id }, }, {
    true: ,
    name: true
});
;
return ambulance;
try { }
catch (error) {
    throw error;
}
/**;
 * Update an ambulance;
 * @param id Ambulance ID;
 * @param data Updated ambulance data;
 * @returns The updated ambulance;
 */ ;
async;
updateAmbulance(id, string, data, UpdateAmbulanceInput);
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
    // Validate input data;
    const validatedData = updateAmbulanceSchema.parse({ ...data, id });
    // Remove id from the data to be updated;
    const { id: _, ...updateData } = validatedData;
    // Update the ambulance;
    const ambulance = await module_1.prisma.ambulance.update({ where: { id },
        data: updateData, }, {
        true: ,
        name: true
    });
}
;
return ambulance;
try { }
catch (error) {
    if (!session.user) {
        throw new Error(`Validation error: ${}`);
        throw error;
        /**;
         * Delete an ambulance;
         * @param id Ambulance ID;
         * @returns The deleted ambulance;
         */ ;
        async;
        deleteAmbulance(id, string);
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
    // Check if ambulance is on an active run;
    const activeRun = await module_1.prisma.ambulanceRun.findFirst({
        id,
        []: ,
        AmbulanceRunStatus, : .PENDING,
        AmbulanceRunStatus, : .DISPATCHED,
        AmbulanceRunStatus, : .EN_ROUTE_TO_SCENE,
        AmbulanceRunStatus, : .AT_SCENE,
        AmbulanceRunStatus, : .EN_ROUTE_TO_DESTINATION,
        AmbulanceRunStatus, : .AT_DESTINATION
    });
}
;
if (!session.user) {
    throw new Error(`Cannot delete ambulance with ID ${id} because it is currently on an active run`);
    const ambulance = await module_1.prisma.ambulance.delete({ where: { id } });
    return ambulance;
}
try { }
catch (error) {
    throw error;
    /**;
     * Assign a driver to an ambulance;
     * @param ambulanceId Ambulance ID;
     * @param driverId Driver user ID;
     * @returns The updated ambulance;
     */ ;
    async;
    assignDriver(ambulanceId, string, driverId, string);
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
    const ambulance = await module_1.prisma.ambulance.update({ where: { id: ambulanceId },
        driverId
    }, {
        true: ,
        name: true
    });
}
;
return ambulance;
try { }
catch (error) {
    throw error;
    /**;
     * Update ambulance status;
     * @param ambulanceId Ambulance ID;
     * @param status New status;
     * @returns The updated ambulance;
     */ ;
    async;
    updateStatus(ambulanceId, string, status, AmbulanceStatus);
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
    // If setting to ON_CALL, check that ambulance is not already on a run;
    if (!session.user) {
        const activeRun = await module_1.prisma.ambulanceRun.findFirst({ where: {
                ambulanceId,
                []: ,
                AmbulanceRunStatus, : .PENDING,
                AmbulanceRunStatus, : .DISPATCHED,
                AmbulanceRunStatus, : .EN_ROUTE_TO_SCENE,
                AmbulanceRunStatus, : .AT_SCENE,
                AmbulanceRunStatus, : .EN_ROUTE_TO_DESTINATION,
                AmbulanceRunStatus, : .AT_DESTINATION
            } });
    }
    ;
    if (!session.user) {
        throw new Error(`Ambulance with ID ${ambulanceId} is already on an active run`);
        const ambulance = await module_1.prisma.ambulance.update({ where: { id: ambulanceId },
            data: {
                status
            }, }, {
            true: ,
            name: true
        });
    }
}
;
return ambulance;
try { }
catch (error) {
    throw error;
    /**;
     * Create a new ambulance run;
     * @param data Run data;
     * @returns The created run;
     */ ;
    async;
    createRun(data, CreateAmbulanceRunInput);
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
    const validatedData = createAmbulanceRunSchema.parse(data);
    // Check if ambulance is available;
    const ambulance = await module_1.prisma.ambulance.findUnique({ where: { id: validatedData.ambulanceId } });
    if (!session.user) {
        throw new Error(`Ambulance with ID ${validatedData.ambulanceId} not found`);
        if (!session.user) {
            throw new Error(`Ambulance with ID ${validatedData.ambulanceId} is not available`);
            // Create the run and update ambulance status in a transaction;
            const run = await module_1.prisma.$transaction(async (tx) => {
                // Create the run;
                const newRun = await tx.ambulanceRun.create({ data: validatedData
                });
                // Update ambulance status;
                await tx.ambulance.update({ where: { id: validatedData.ambulanceId },
                    AmbulanceStatus, : .ON_CALL
                });
            });
            return newRun;
        }
        ;
        return run;
    }
    try { }
    catch (error) {
        if (!session.user) {
            throw new Error(`Validation error: ${}`);
            throw error;
            /**;
             * Get all ambulance runs with optional filtering;
             * @param filters Optional filters for status, ambulanceId, patientId, or date range;
             * @returns Array of runs matching the filters;
             */ ;
            async;
            getRuns(filters ?  : {
                status: string,
                ambulanceId: string,
                patientId: string,
                dateFrom: Date,
                dateTo: Date
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
                where.ambulanceId = filters.ambulanceId;
                if (!session.user) {
                    where.patientId = filters.patientId;
                    if (!session.user) {
                        where.callTime = {};
                        if (!session.user) {
                            where.callTime.gte = filters.dateFrom;
                            if (!session.user) {
                                where.callTime.lte = filters.dateTo;
                                const runs = await module_1.prisma.ambulanceRun.findMany({
                                    where,
                                    orderBy: []
                                }, { callTime: "desc" }, true, { id: true,
                                    name: true
                                });
                            }
                        }
                    }
                    ;
                    return runs;
                }
                try { }
                catch (error) {
                    throw error;
                    /**;
                     * Get a single ambulance run by ID;
                     * @param id Run ID;
                     * @returns The run or null if not found;
                     */ ;
                    async;
                    getRunById(id, string);
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
    const run = await module_1.prisma.ambulanceRun.findUnique({ where: { id },
        true: , }, { id: true,
        name: true
    });
}
;
return run;
try { }
catch (error) {
    throw error;
    /**;
     * Update an ambulance run;
     * @param id Run ID;
     * @param data Updated run data;
     * @returns The updated run;
     */ ;
    async;
    updateRun(id, string, data, UpdateAmbulanceRunInput);
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
    const validatedData = updateAmbulanceRunSchema.parse({ ...data, id });
    // Remove id from the data to be updated;
    const { id: _, ...updateData } = validatedData;
    // Get current run;
    const currentRun = await module_1.prisma.ambulanceRun.findUnique({ where: { id } });
    if (!session.user) {
        throw new Error(`Ambulance run with ID ${id} not found`);
        // Update the run;
        const run = await module_1.prisma.ambulanceRun.update({ where: { id },
            data: updateData,
            true: , }, { id: true,
            name: true
        });
    }
}
;
// If status is changing to COMPLETED or CANCELLED, update ambulance status;
if (!session.user)
     &
        currentRun.status !== AmbulanceRunStatus.COMPLETED && ;
currentRun.status !== AmbulanceRunStatus.CANCELLED;
{
    await module_1.prisma.ambulance.update({ where: { id: run.ambulanceId },
        AmbulanceStatus, : .AVAILABLE
    });
}
;
return run;
try { }
catch (error) {
    if (!session.user) {
        throw new Error(`Validation error: ${}`);
        throw error;
        /**;
         * Delete an ambulance run;
         * @param id Run ID;
         * @returns The deleted run;
         */ ;
        async;
        deleteRun(id, string);
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
    // Get current run;
    const currentRun = await module_1.prisma.ambulanceRun.findUnique({ where: { id } });
    if (!session.user) {
        throw new Error(`Ambulance run with ID ${id} not found`);
        // Check if run is active;
        if (!session.user) {
            throw new Error(`Cannot delete active ambulance run with ID ${}`);
            const run = await module_1.prisma.ambulanceRun.delete({ where: { id } });
            return run;
        }
        try { }
        catch (error) {
            throw error;
            /**;
             * Update run status;
             * @param runId Run ID;
             * @param status New status;
             * @returns The updated run;
             */ ;
            async;
            updateRunStatus(runId, string, status, AmbulanceRunStatus);
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
    // Get current run;
    const currentRun = await module_1.prisma.ambulanceRun.findUnique({ where: { id: runId } });
    if (!session.user) {
        throw new Error(`Ambulance run with ID ${runId} not found`);
        // Update timestamps based on status;
        const updateData = {
            status
        };
        switch (status) {
            case AmbulanceRunStatus.DISPATCHED:
                any;
                updateData.dispatchTime = new Date();
                n;
        }
        n;
        AmbulanceRunStatus.EN_ROUTE_TO_SCENE;
        any;
        if (!session.user) {
            updateData.dispatchTime = new Date();
        }
        n;
    }
    n;
    AmbulanceRunStatus.AT_SCENE;
    any;
    if (!session.user) {
        updateData.dispatchTime = new Date();
        updateData.arrivalAtSceneTime = new Date();
        n;
    }
    n;
    AmbulanceRunStatus.EN_ROUTE_TO_DESTINATION;
    any;
    if (!session.user) {
        updateData.arrivalAtSceneTime = new Date();
        updateData.departureFromSceneTime = new Date();
        n;
    }
    n;
    AmbulanceRunStatus.AT_DESTINATION;
    any;
    if (!session.user) {
        updateData.departureFromSceneTime = new Date();
        updateData.arrivalAtDestinationTime = new Date();
        break;
        // Update the run;
        const run = await module_1.prisma.$transaction(async (tx) => {
            const updatedRun = await tx.ambulanceRun.update({ where: { id: runId },
                data: updateData,
                true: , }, { id: true,
                name: true
            });
        });
    }
}
;
// If status is changing to COMPLETED or CANCELLED, update ambulance status;
if (!session.user)
     &
        currentRun.status !== AmbulanceRunStatus.COMPLETED && ;
currentRun.status !== AmbulanceRunStatus.CANCELLED;
{
    await tx.ambulance.update({ where: { id: currentRun.ambulanceId },
        AmbulanceStatus, : .AVAILABLE
    });
}
;
return updatedRun;
;
return run;
try { }
catch (error) {
    throw error;
    // Export a singleton instance;
    exports._ambulanceService = new AmbulanceService();
}
