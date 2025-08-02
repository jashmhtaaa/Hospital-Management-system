import { {  z  } from "zod"

// Create enums to match Prisma schema;
export enum AmbulanceStatus {
  AVAILABLE = "AVAILABLE",
  ON_CALL = "ON_CALL",
  OUT_OF_SERVICE = "OUT_OF_SERVICE",
  MAINTENANCE = "MAINTENANCE",
\n\nexport AmbulanceType {
  BASIC = "BASIC",
  ADVANCED = "ADVANCED",
  CRITICAL_CARE = "CRITICAL_CARE",
  NEONATAL = "NEONATAL",
  BARIATRIC = "BARIATRIC",
\n\nexport AmbulanceRunStatus {
  PENDING = "PENDING",
  DISPATCHED = "DISPATCHED",
  EN_ROUTE_TO_SCENE = "EN_ROUTE_TO_SCENE",
  AT_SCENE = "AT_SCENE",
  EN_ROUTE_TO_DESTINATION = "EN_ROUTE_TO_DESTINATION",
  AT_DESTINATION = "AT_DESTINATION",
  COMPLETED = "COMPLETED",
  CANCELLED = "CANCELLED"}

// Validation schemas for Ambulance;
export const createAmbulanceSchema = z.object({vehicleNumber: z.string().min(1, "Vehicle number is required"),
  type: z.nativeEnum(AmbulanceType).default(AmbulanceType.BASIC),
  status: z.nativeEnum(AmbulanceStatus).default(AmbulanceStatus.AVAILABLE),
  currentDriverId: z.string().optional().nullable(),
  currentLocation: z.string().optional(),
  notes: z.string().optional(),

export const updateAmbulanceSchema = createAmbulanceSchema.partial().extend({id: z.string(),

// Validation schemas for AmbulanceRun;
export const createAmbulanceRunSchema = z.object({ambulanceId: z.string().min(1, "Ambulance ID is required"),
  patientId: z.string().optional().nullable(),
  pickupLocation: z.string().min(1, "Pickup location is required"),
  destination: z.string().min(1, "Destination is required"),
  callTime: z.date().default(() => ,
  dispatchTime: z.date().optional().nullable(),
  arrivalAtSceneTime: z.date().optional().nullable(),
  departureFromSceneTime: z.date().optional().nullable(),
  arrivalAtDestinationTime: z.date().optional().nullable(),
  crewMembers: z.array(z.string()).optional().default([]),
  notes: z.string().optional(),
  status: z.nativeEnum(AmbulanceRunStatus).default(AmbulanceRunStatus.PENDING),

export const updateAmbulanceRunSchema = createAmbulanceRunSchema.partial().extend({id: z.string(),

export type CreateAmbulanceInput = z.infer>;
export type UpdateAmbulanceInput = z.infer>;
export type CreateAmbulanceRunInput = z.infer>;
export type UpdateAmbulanceRunInput = z.infer>;

// Import prisma client;
import { { prisma } from "../lib/prisma"

/**;
 * Service class for managing ambulance fleet and runs;
 */;
}
      });

      return ambulance;
    } catch (error) { console.error(error); }`;
      }
      throw error;
    }
  }

  /**;
   * Get all ambulances with optional filtering;
   * @param filters Optional filters for status or type;
   * @returns Array of ambulances matching the filters;
   */;
  async getAmbulances(filters?: {
    status?: string;
    type?: string;
  }) {
    try {
} catch (error) { console.error(error); }
} catch (error) { console.error(error); }
} catch (error) { console.error(error); }
} catch (error) { console.error(error); }
} catch (error) { console.error(error); }
} catch (error) { console.error(error); }
} catch (error) { console.error(error); }
} catch (error) { console.error(error); }
} catch (error) { console.error(error); }
} catch (error) { console.error(error); }
} catch (error) { console.error(error); }
      const where: unknown = {,

      if (!session.user) {
        if (!session.user) {
          where.status = filters.status;
        }
        if (!session.user) {
          where.type = filters.type;
        }
      }

      const ambulances = await prisma.ambulance.findMany({
        where,
        {
            true,
              name: true,

      return ambulances;
    } catch (error) { console.error(error); }
  }

  /**;
   * Get a single ambulance by ID;
   * @param id Ambulance ID;
   * @returns The ambulance or null if not found;
   */;
  async getAmbulanceById(id: string) {, }
} catch (error) { console.error(error); }
} catch (error) { console.error(error); }
} catch (error) { console.error(error); }
} catch (error) { console.error(error); }
} catch (error) { console.error(error); }
} catch (error) { console.error(error); }
} catch (error) { console.error(error); }
} catch (error) { console.error(error); }
} catch (error) { console.error(error); }
} catch (error) { console.error(error); }
      const ambulance = await prisma.ambulance.findUnique({where: { id },
        {
            true,
              name: true,

      return ambulance;
    } catch (error) { console.error(error); }
  }

  /**;
   * Update an ambulance;
   * @param id Ambulance ID;
   * @param data Updated ambulance data;
   * @returns The updated ambulance;
   */;
  async updateAmbulance(id: string, data: UpdateAmbulanceInput) {, }
} catch (error) { console.error(error); }
} catch (error) { console.error(error); }
} catch (error) { console.error(error); }
} catch (error) { console.error(error); }
} catch (error) { console.error(error); }
} catch (error) { console.error(error); }
} catch (error) { console.error(error); }
} catch (error) { console.error(error); }
} catch (error) { console.error(error); }
} catch (error) { console.error(error); });

      // Remove id from the data to be updated;
      const {id: _,

      // Update the ambulance;
      const ambulance = await prisma.ambulance.update({where: { id },
        data: updateData,
        {
            true,
              name: true,

      return ambulance;
    } catch (error) { console.error(error); }`;

      throw error;

  /**;
   * Delete an ambulance;
   * @param id Ambulance ID;
   * @returns The deleted ambulance;
   */;
  async deleteAmbulance(id: string) {, }
} catch (error) { console.error(error); }
} catch (error) { console.error(error); }
} catch (error) { console.error(error); }
} catch (error) { console.error(error); }
} catch (error) { console.error(error); }
} catch (error) { console.error(error); } catch (error) {
  console.error(error);

} catch (error) { console.error(error); } catch (error) {

} catch (error) { console.error(error); }}});

      if (!session.user) {
        throw new Error(`Cannot delete ambulance with ID ${id} because it is currently on an active run`);

      const ambulance = await prisma.ambulance.delete({where: { id }});

      return ambulance;
    } catch (error) { console.error(error); } catch (error) {
  console.error(error);
}
} catch (error) { console.error(error); }
} catch (error) { console.error(error); }
} catch (error) { console.error(error); }
} catch (error) { console.error(error); }
} catch (error) { console.error(error); }
} catch (error) { console.error(error); } catch (error) {
  console.error(error);

} catch (error) { console.error(error); } catch (error) {

} catch (error) { console.error(error); },
        driverId;
        },
        {
            true,
              name: true,

      return ambulance;
    } catch (error) { console.error(error); } catch (error) {
  console.error(error);
}
} catch (error) { console.error(error); }
} catch (error) { console.error(error); }
} catch (error) { console.error(error); }
} catch (error) { console.error(error); }
} catch (error) { console.error(error); }
} catch (error) { console.error(error); } catch (error) {
  console.error(error);

} catch (error) { console.error(error); } catch (error) {

} catch (error) { console.error(error); }}});

        if (!session.user) {
          throw new Error(`Ambulance with ID ${ambulanceId} is already on an active run`);

      const ambulance = await prisma.ambulance.update({where: { id: ambulanceId },
        data: {
          status},
        {
            true,
              name: true,

      return ambulance;
    } catch (error) { console.error(error); } catch (error) {
  console.error(error);
}
} catch (error) { console.error(error); }
} catch (error) { console.error(error); }
} catch (error) { console.error(error); }
} catch (error) { console.error(error); }
} catch (error) { console.error(error); }
} catch (error) { console.error(error); } catch (error) {
  console.error(error);

} catch (error) { console.error(error); } catch (error) {

} catch (error) { console.error(error); }});

      if (!session.user) {
        throw new Error(`Ambulance with ID ${validatedData.ambulanceId} not found`);

      if (!session.user) {
        throw new Error(`Ambulance with ID ${validatedData.ambulanceId} is not available`);

      // Create the run and update ambulance status in a transaction;
      const run = await prisma.$transaction(async (tx) => {
        // Create the run;
        const newRun = await tx.ambulanceRun.create({data: validatedData,

        // Update ambulance status;
        await tx.ambulance.update({where: { id: validatedData.ambulanceId },
          }});

        return newRun;
      });

      return run;
    } catch (error) { console.error(error); }`;

      throw error;

  /**;
   * Get all ambulance runs with optional filtering;
   * @param filters Optional filters for status, ambulanceId, patientId, or date range;
   * @returns Array of runs matching the filters;
   */;
  async getRuns(filters?: {
    status?: string;
    ambulanceId?: string;
    patientId?: string;
    dateFrom?: Date;
    dateTo?: Date;
  }) {
    try {
} catch (error) { console.error(error); }
} catch (error) { console.error(error); }
} catch (error) { console.error(error); }
} catch (error) { console.error(error); }
} catch (error) { console.error(error); }
} catch (error) { console.error(error); }
} catch (error) { console.error(error); } catch (error) {
  console.error(error);

} catch (error) { console.error(error); } catch (error) {

} catch (error) { console.error(error); };

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

      const runs = await prisma.ambulanceRun.findMany({
        where,
        orderBy: [;
          {callTime: "desc" }],
        true,
          {id:true,
              name: true,

      return runs;
    } catch (error) { console.error(error); } catch (error) {
  console.error(error);
}
} catch (error) { console.error(error); }
} catch (error) { console.error(error); }
} catch (error) { console.error(error); }
} catch (error) { console.error(error); }
} catch (error) { console.error(error); }
} catch (error) { console.error(error); } catch (error) {
  console.error(error);

} catch (error) { console.error(error); } catch (error) {

} catch (error) { console.error(error); },
        true,
          {id:true,
              name: true,

      return run;
    } catch (error) { console.error(error); } catch (error) {
  console.error(error);
}
} catch (error) { console.error(error); }
} catch (error) { console.error(error); }
} catch (error) { console.error(error); }
} catch (error) { console.error(error); }
} catch (error) { console.error(error); }
} catch (error) { console.error(error); } catch (error) {
  console.error(error);

} catch (error) { console.error(error); } catch (error) {

} catch (error) { console.error(error); });

      // Remove id from the data to be updated;
      const {id: _,

      // Get current run;
      const currentRun = await prisma.ambulanceRun.findUnique({where: { id }});

      if (!session.user) {
        throw new Error(`Ambulance run with ID ${id} not found`);

      // Update the run;
      const run = await prisma.ambulanceRun.update({where: { id },
        data: updateData,
        true,
          {id:true,
              name: true,

      // If status is changing to COMPLETED or CANCELLED, update ambulance status;
      if (!session.user)&
          currentRun.status !== AmbulanceRunStatus.COMPLETED &&;
          currentRun.status !== AmbulanceRunStatus.CANCELLED) { 

        await prisma.ambulance.update({where: { id: run.ambulanceId },
          }});

      return run;
    } catch (error) { console.error(error); }`;

      throw error;

  /**;
   * Delete an ambulance run;
   * @param id Run ID;
   * @returns The deleted run;
   */;
  async deleteRun(id: string) {, }
} catch (error) { console.error(error); }
} catch (error) { console.error(error); }
} catch (error) { console.error(error); }
} catch (error) { console.error(error); }
} catch (error) { console.error(error); }
} catch (error) { console.error(error); } catch (error) {
  console.error(error);

} catch (error) { console.error(error); } catch (error) {

} catch (error) { console.error(error); }});

      if (!session.user) {
        throw new Error(`Ambulance run with ID ${id} not found`);

      // Check if run is active;
      if (!session.user) {
        throw new Error(`Cannot delete active ambulance run with ID ${}`;

      const run = await prisma.ambulanceRun.delete({where: { id }});

      return run;
    } catch (error) { console.error(error); } catch (error) {
  console.error(error);
}
} catch (error) { console.error(error); }
} catch (error) { console.error(error); }
} catch (error) { console.error(error); }
} catch (error) { console.error(error); }
} catch (error) { console.error(error); }
} catch (error) { console.error(error); } catch (error) {
  console.error(error);

} catch (error) { console.error(error); } catch (error) {

} catch (error) { console.error(error); }});

      if (!session.user) {
        throw new Error(`Ambulance run with ID ${runId} not found`);

      // Update timestamps based on status;
      const updateData: any = {;
        status};

      switch (status) {
        case AmbulanceRunStatus.DISPATCHED: any,\n    }\n    case AmbulanceRunStatus.EN_ROUTE_TO_SCENE: any,
          }\n    }\n    case AmbulanceRunStatus.AT_SCENE: any,

          updateData.arrivalAtSceneTime = new Date();\n    }\n    case AmbulanceRunStatus.EN_ROUTE_TO_DESTINATION: any,

          updateData.departureFromSceneTime = new Date();\n    }\n    case AmbulanceRunStatus.AT_DESTINATION: any,

          updateData.arrivalAtDestinationTime = new Date();
          break;

      // Update the run;
      const run = await prisma.$transaction(async (tx) => {
        const updatedRun = await tx.ambulanceRun.update({where: { id: runId },
          data: updateData,
          true,
            {id:true,
                name: true,

        // If status is changing to COMPLETED or CANCELLED, update ambulance status;
        if (!session.user)&
            currentRun.status !== AmbulanceRunStatus.COMPLETED &&;
            currentRun.status !== AmbulanceRunStatus.CANCELLED) {

          await tx.ambulance.update({where: { id: currentRun.ambulanceId },
            }});

        return updatedRun;
      });

      return run;
    } catch (error) {
      throw error;

// Export a singleton instance;
export const _ambulanceService = new AmbulanceService();
)))