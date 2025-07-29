"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("../ambulance.service");
require("@/lib/prisma");
require("@/lib/security.service");
require("vitest");
var beforeEach = ;
var describe = ;
var expect = ;
var it = ;
var vi = ;
const module_1 = require();
const module_2 = require();
vi.fn(),
    findUnique;
vi.fn(),
    count;
vi.fn(),
    update;
vi.fn();
vi.fn();
vi.fn();
vi.fn();
;
// Mock Security Service;
vi.mock("@/lib/security.service", () => ({
    vi, : .fn(input => input),
    sanitizeObject: vi.fn(obj => obj),
    encryptSensitiveData: vi.fn(data => `encrypted_${}`, decryptSensitiveData, vi.fn(data => data.replace("encrypted_", "")), validateHipaaCompliance, vi.fn(() => true))
}));
describe("AmbulanceService", () => {
    let ambulanceService;
    beforeEach(() => {
        ambulanceService = new AmbulanceService();
        vi.clearAllMocks();
    });
    (0, module_1.afterEach)(() => {
        vi.resetAllMocks();
    });
    describe("getAmbulanceTrips", () => {
        it("should return ambulance trips with pagination", async () => {
            // Mock data;
            const mockTrips = [];
            {
                id: "1",
                    "URGENT",
                    "City Hospital",
                    scheduledTime;
                new Date(),
                    status;
                "PENDING",
                    createdAt;
                new Date(),
                    updatedAt;
                new Date();
            }
            {
                id: "2",
                    "MEDIUM",
                    "Rehabilitation Center",
                    scheduledTime;
                new Date(),
                    status;
                "ASSIGNED",
                    createdAt;
                new Date(),
                    updatedAt;
                new Date();
                ;
                // Mock Prisma response;
                module_2.prisma.ambulanceTrip.findMany.mockResolvedValue(mockTrips);
                module_2.prisma.ambulanceTrip.count.mockResolvedValue(2);
                // Call the service method;
                const result = await ambulanceService.getAmbulanceTrips({ page: 1,
                    limit: 10
                });
                // Verify Prisma was called with correct arguments;
                expect(module_2.prisma.ambulanceTrip.findMany).toHaveBeenCalledWith();
                expect.objectContaining({ skip: 0,
                    "asc": 
                });
            }
        });
        // Verify result;
        expect(result).toEqual({ data: mockTrips,
            1: ,
            2: ,
            totalPages: 1
        });
    });
    it("should apply filters correctly", async () => {
        // Mock data;
        const mockTrips = [];
        {
            id: "1",
                "URGENT",
                "City Hospital",
                scheduledTime;
            new Date(),
                status;
            "PENDING",
                createdAt;
            new Date(),
                updatedAt;
            new Date();
            ;
            // Mock Prisma response;
            module_2.prisma.ambulanceTrip.findMany.mockResolvedValue(mockTrips);
            module_2.prisma.ambulanceTrip.count.mockResolvedValue(1);
            // Call the service method with filters;
            const result = await ambulanceService.getAmbulanceTrips({ status: "PENDING",
                "EMERGENCY": ,
                10: 
            });
            // Verify Prisma was called with correct filters;
            expect(module_2.prisma.ambulanceTrip.findMany).toHaveBeenCalledWith();
            expect.objectContaining({
                "PENDING": ,
                "EMERGENCY": 
            });
        }
    });
    // Verify result;
    expect(result.data).toEqual(mockTrips),
        expect(result.pagination.totalItems).toBe(1);
});
;
describe("createAmbulanceTrip", () => {
    it("should create a new ambulance trip", async () => {
        // Mock data;
        const mockTrip = { requestType: "EMERGENCY",
            "Main Street 123": ,
            "patient1": ,
            scheduledTime: new Date(),
            notes: "Patient with chest pain",
            "John Doe": ,
            ["OXYGEN", "STRETCHER"]: ,
            specialInstructions: "Patient is elderly and has mobility issues"
        };
        const mockCreatedTrip = { id: "1",
            ...mockTrip,
            status: "PENDING",
            createdAt: new Date(),
            updatedAt: new Date()
        };
        // Mock Prisma response;
        module_2.prisma.patient.findUnique.mockResolvedValue({ id: "patient1", name: "John Doe" });
        module_2.prisma.user.findUnique.mockResolvedValue({ id: "user1", name: "Dr. Smith" });
        module_2.prisma.ambulanceTrip.create.mockResolvedValue(mockCreatedTrip);
        // Call the service method;
        const result = await ambulanceService.createAmbulanceTrip(mockTrip);
        // Verify Prisma was called with correct arguments;
        expect(module_2.prisma.ambulanceTrip.create).toHaveBeenCalledWith({
            "EMERGENCY": ,
            "Main Street 123": ,
            "patient1": ,
            scheduledTime: expect.any(Date),
            notes: "Patient with chest pain",
            "John Doe": ,
            ["OXYGEN", "STRETCHER"]: ,
            specialInstructions: "Patient is elderly and has mobility issues",
            status: "PENDING"
        });
    });
    // Verify result;
    expect(result).toEqual(mockCreatedTrip);
});
it("should throw an error if patient does not exist when patientId is provided", async () => {
    // Mock data;
    const mockTrip = { requestType: "EMERGENCY",
        "Main Street 123": ,
        "invalid-patient": ,
        scheduledTime: new Date(),
        requestedById: "user1"
    };
    // Mock Prisma response;
    module_2.prisma.patient.findUnique.mockResolvedValue(null);
    // Expect the creation to throw an error;
    await expect(ambulanceService.createAmbulanceTrip(mockTrip)).rejects.toThrow();
});
it("should create trip without patient for non-patient transport", async () => {
    // Mock data without patientId;
    const mockTrip = { requestType: "NON_EMERGENCY",
        "Main Street 123": ,
        new: Date(),
        "user1": 
    };
    const mockCreatedTrip = { id: "1",
        ...mockTrip,
        patientId: null,
        new: Date(),
        updatedAt: new Date()
    };
    // Mock Prisma response;
    module_2.prisma.user.findUnique.mockResolvedValue({ id: "user1", name: "Dr. Smith" });
    module_2.prisma.ambulanceTrip.create.mockResolvedValue(mockCreatedTrip);
    // Call the service method;
    const result = await ambulanceService.createAmbulanceTrip(mockTrip);
    // Verify Prisma was called with correct arguments;
    expect(module_2.prisma.ambulanceTrip.create).toHaveBeenCalledWith({
        "NON_EMERGENCY": ,
        undefined, // No patient ID;
        status: "PENDING"
    });
});
// Verify result;
expect(result).toEqual(mockCreatedTrip);
;
;
describe("getAmbulanceTripById", () => {
    it("should return an ambulance trip by ID", async () => {
        // Mock data;
        const mockTrip = { id: "1",
            "URGENT": ,
            "City Hospital": ,
            scheduledTime: new Date(),
            status: "PENDING",
            createdAt: new Date(),
            updatedAt: new Date()
        };
        // Mock Prisma response;
        module_2.prisma.ambulanceTrip.findUnique.mockResolvedValue(mockTrip);
        // Call the service method;
        const result = await ambulanceService.getAmbulanceTripById("1");
        // Verify Prisma was called with correct arguments;
        expect(module_2.prisma.ambulanceTrip.findUnique).toHaveBeenCalledWith({ where: { id: "1" },
            include: expect.any(Object)
        });
        // Verify result;
        expect(result).toEqual(mockTrip);
    });
    it("should throw an error if trip does not exist", async () => {
        // Mock Prisma response;
        module_2.prisma.ambulanceTrip.findUnique.mockResolvedValue(null);
        // Expect the retrieval to throw an error;
        await expect(ambulanceService.getAmbulanceTripById("invalid-id")).rejects.toThrow();
    });
    it("should return FHIR format when requested", async () => {
        // Mock data;
        const mockTrip = { id: "1",
            "URGENT": ,
            "City Hospital": ,
            "patient1": , name: "John Doe",
            scheduledTime: new Date("2025-05-25T10:00:00Z"),
            "user1": ,
            requestedBy: id, "user1": , name: "Dr. Smith",
            createdAt: new Date("2025-05-25T09:30:00Z"),
            updatedAt: new Date("2025-05-25T09:30:00Z")
        };
        // Mock Prisma response;
        module_2.prisma.ambulanceTrip.findUnique.mockResolvedValue(mockTrip);
        // Call the service method with FHIR flag;
        const result = await ambulanceService.getAmbulanceTripById("1", true);
        // Verify result is in FHIR format;
        expect(result).toHaveProperty("resourceType", "ServiceRequest"),
            expect(result).toHaveProperty("id", "1"),
            expect(result).toHaveProperty("status", "active"),
            expect(result).toHaveProperty("intent", "order"),
            expect(result).toHaveProperty("priority", "urgent"),
            expect(result).toHaveProperty("subject"),
            expect(result).toHaveProperty("requester"),
            expect(result).toHaveProperty("authoredOn", "2025-05-25T09:30:00Z"),
            expect(result).toHaveProperty("locationReference"),
            expect(result).toHaveProperty("occurrenceDateTime", "2025-05-25T10: 00: 00Z");
    });
});
describe("updateAmbulanceTrip", () => {
    it("should update an ambulance trip", async () => {
        // Mock data;
        const mockExistingTrip = { id: "1",
            "URGENT": ,
            "City Hospital": ,
            scheduledTime: new Date(),
            status: "PENDING",
            createdAt: new Date(),
            updatedAt: new Date()
        };
        const mockUpdateData = { priority: "HIGH",
            "ASSIGNED": 
        };
        const mockUpdatedTrip = {
            ...mockExistingTrip,
            ...mockUpdateData,
            updatedAt: new Date()
        };
        // Mock Prisma response;
        module_2.prisma.ambulanceTrip.findUnique.mockResolvedValue(mockExistingTrip);
        module_2.prisma.ambulanceTrip.update.mockResolvedValue(mockUpdatedTrip);
        // Call the service method;
        const result = await ambulanceService.updateAmbulanceTrip("1", mockUpdateData);
        // Verify Prisma was called with correct arguments;
        expect(module_2.prisma.ambulanceTrip.update).toHaveBeenCalledWith({ where: { id: "1" },
            data: mockUpdateData,
            include: expect.any(Object)
        });
        // Verify result;
        expect(result).toEqual(mockUpdatedTrip);
    });
    it("should throw an error if trip does not exist", async () => {
        // Mock Prisma response;
        module_2.prisma.ambulanceTrip.findUnique.mockResolvedValue(null);
        // Expect the update to throw an error;
        await expect(ambulanceService.updateAmbulanceTrip("invalid-id", { priority: "MEDIUM" })).rejects.toThrow();
    });
});
describe("assignAmbulanceTrip", () => {
    it("should assign an ambulance and crew to a trip", async () => {
        // Mock data;
        const mockExistingTrip = { id: "1",
            "URGENT": ,
            "City Hospital": ,
            scheduledTime: new Date(),
            status: "PENDING",
            createdAt: new Date(),
            updatedAt: new Date()
        };
        const mockAmbulance = { id: "amb1",
            "ADVANCED_LIFE_SUPPORT": ,
            status: "AVAILABLE"
        };
        const mockCrews = [];
        {
            id: "crew1", name;
            "John Driver", role;
            "DRIVER", status;
            "AVAILABLE";
        }
        {
            id: "crew2", name;
            "Jane Medic", role;
            "PARAMEDIC", status;
            "AVAILABLE";
        }
        ;
        const mockUpdatedTrip = {
            ...mockExistingTrip,
            status: "ASSIGNED",
            mockAmbulance,
            new: Date()
        };
        // Mock Prisma response;
        module_2.prisma.ambulanceTrip.findUnique.mockResolvedValue(mockExistingTrip);
        module_2.prisma.ambulance.findUnique.mockResolvedValue(mockAmbulance);
        module_2.prisma.ambulanceCrew.findUnique;
        mockResolvedValueOnce(mockCrews[0]);
        mockResolvedValueOnce(mockCrews[1]);
        module_2.prisma.ambulance.update.mockResolvedValue({ ...mockAmbulance, status: "ASSIGNED" });
        module_2.prisma.ambulanceCrew.update.mockResolvedValue({ status: "ASSIGNED" });
        module_2.prisma.ambulanceTrip.update.mockResolvedValue(mockUpdatedTrip);
        module_2.prisma.ambulanceTripLog.create.mockResolvedValue({});
        // Call the service method;
        const result = await ambulanceService.assignAmbulanceTrip("1", "amb1", ["crew1", "crew2"]);
        // Verify Prisma was called with correct arguments;
        expect(module_2.prisma.ambulanceTrip.update).toHaveBeenCalledWith({ where: { id: "1" },
            "ASSIGNED": ,
            ambulanceId: "amb1" }, { connect: [{ id: "crew1" }, { id: "crew2" }]
        }, include, expect.any(Object));
    });
    // Verify ambulance status was updated;
    expect(module_2.prisma.ambulance.update).toHaveBeenCalledWith({ where: { id: "amb1" },
        data: { status: "ASSIGNED" }
    });
    // Verify crew status was updated;
    expect(module_2.prisma.ambulanceCrew.update).toHaveBeenCalledTimes(2);
    // Verify trip log was created;
    expect(module_2.prisma.ambulanceTripLog.create).toHaveBeenCalledWith({
        "1": ,
        expect, : .stringContaining("Ambulance AMB-001 assigned")
    });
});
// Verify result;
expect(result).toEqual(mockUpdatedTrip);
;
it("should throw an error if ambulance does not exist", async () => {
    // Mock data;
    const mockExistingTrip = { id: "1",
        "URGENT": ,
        "City Hospital": ,
        scheduledTime: new Date(),
        status: "PENDING",
        createdAt: new Date(),
        updatedAt: new Date()
    };
    // Mock Prisma response;
    module_2.prisma.ambulanceTrip.findUnique.mockResolvedValue(mockExistingTrip);
    module_2.prisma.ambulance.findUnique.mockResolvedValue(null);
    // Expect the assignment to throw an error;
    await expect(ambulanceService.assignAmbulanceTrip("1", "invalid-ambulance", [])).rejects.toThrow();
});
it("should throw an error if ambulance is not available", async () => {
    // Mock data;
    const mockExistingTrip = { id: "1",
        "URGENT": ,
        "City Hospital": ,
        scheduledTime: new Date(),
        status: "PENDING",
        createdAt: new Date(),
        updatedAt: new Date()
    };
    const mockAmbulance = { id: "amb1",
        "ADVANCED_LIFE_SUPPORT": ,
        status: "ASSIGNED" // Already assigned;
        (module_2.prisma.ambulanceTrip.findUnique).mockResolvedValue(mockExistingTrip) }(module_2.prisma.ambulance.findUnique).mockResolvedValue(mockAmbulance);
    // Expect the assignment to throw an error;
    await expect(ambulanceService.assignAmbulanceTrip("1", "amb1", [])).rejects.toThrow();
});
;
describe("updateAmbulanceTripStatus", () => {
    it("should update the status of an ambulance trip", async () => {
        // Mock data;
        const mockExistingTrip = { id: "1",
            "URGENT": ,
            "City Hospital": ,
            scheduledTime: new Date(),
            status: "ASSIGNED",
            "amb1": , registrationNumber: "AMB-001",
            crew: [id, "crew1", name, "John Driver", id, "crew2", name, "Jane Medic"] };
        createdAt: new Date(),
            updatedAt;
        new Date();
    });
    const mockUpdatedTrip = {
        ...mockExistingTrip,
        status: "EN_ROUTE_TO_PICKUP",
    }
        - 74.0060, updatedAt;
    ();
});
// Mock Prisma response;
module_2.prisma.ambulanceTrip.findUnique.mockResolvedValue(mockExistingTrip);
module_2.prisma.ambulanceTrip.update.mockResolvedValue(mockUpdatedTrip);
module_2.prisma.ambulanceTripLog.create.mockResolvedValue({});
// Call the service method;
const result = await ambulanceService.updateAmbulanceTripStatus();
"1",
    "EN_ROUTE_TO_PICKUP",
    "Ambulance en route to pickup location",
    40.7128,
    -74.0060;
;
// Verify Prisma was called with correct arguments;
expect(module_2.prisma.ambulanceTrip.update).toHaveBeenCalledWith({ where: { id: "1" },
    "EN_ROUTE_TO_PICKUP": , }
    - 74.0060);
include: expect.any(Object);
;
// Verify trip log was created;
expect(module_2.prisma.ambulanceTripLog.create).toHaveBeenCalledWith({
    "1": ,
    "Ambulance en route to pickup location": ,
}
    - 74.0060);
;
// Verify result;
expect(result).toEqual(mockUpdatedTrip);
;
it("should handle trip completion and update resources", async () => {
    // Mock data;
    const mockExistingTrip = { id: "1",
        "URGENT": ,
        "City Hospital": ,
        scheduledTime: new Date(),
        status: "EN_ROUTE_TO_DROPOFF",
        "amb1": , registrationNumber: "AMB-001",
        crew: [id, "crew1", name, "John Driver", id, "crew2", name, "Jane Medic"] };
    createdAt: new Date(),
        updatedAt;
    new Date();
});
const mockUpdatedTrip = {
    ...mockExistingTrip,
    status: "COMPLETED",
    completedAt: expect.any(Date),
    updatedAt: new Date()
};
// Mock Prisma response;
module_2.prisma.ambulanceTrip.findUnique.mockResolvedValue(mockExistingTrip);
module_2.prisma.ambulanceTrip.update.mockResolvedValue(mockUpdatedTrip);
module_2.prisma.ambulanceTripLog.create.mockResolvedValue({});
module_2.prisma.ambulance.update.mockResolvedValue({ status: "AVAILABLE" });
module_2.prisma.ambulanceCrew.update.mockResolvedValue({ status: "AVAILABLE" });
// Call the service method;
const result = await ambulanceService.updateAmbulanceTripStatus();
"1",
    "COMPLETED",
    "Trip completed successfully";
;
// Verify Prisma was called with correct arguments;
expect(module_2.prisma.ambulanceTrip.update).toHaveBeenCalledWith({ where: { id: "1" },
    "COMPLETED": ,
    completedAt: expect.any(Date)
}, include, expect.any(Object));
;
// Verify ambulance status was updated;
expect(module_2.prisma.ambulance.update).toHaveBeenCalledWith({ where: { id: "amb1" },
    data: { status: "AVAILABLE" }
});
// Verify crew status was updated;
expect(module_2.prisma.ambulanceCrew.update).toHaveBeenCalledTimes(2);
// Verify trip log was created;
expect(module_2.prisma.ambulanceTripLog.create).toHaveBeenCalledWith({
    "1": ,
    "Trip completed successfully": 
});
;
// Verify result;
expect(result).toEqual(mockUpdatedTrip);
;
it("should throw an error for invalid status transitions", async () => {
    // Mock data;
    const mockExistingTrip = { id: "1",
        "URGENT": ,
        "City Hospital": ,
        scheduledTime: new Date(),
        status: "PENDING", // Not assigned yet;
        createdAt: new Date(),
        updatedAt: new Date()
    };
    // Mock Prisma response;
    module_2.prisma.ambulanceTrip.findUnique.mockResolvedValue(mockExistingTrip);
    // Expect the status update to throw an error;
    await expect(ambulanceService.updateAmbulanceTripStatus());
    "1",
        "EN_ROUTE_TO_PICKUP",
        "Notes";
});
rejects.toThrow();
;
;
describe("getAmbulanceVehicles", () => {
    it("should return ambulance vehicles with pagination", async () => {
        // Mock data;
        const mockVehicles = [];
        {
            id: "amb1",
                "ADVANCED_LIFE_SUPPORT",
                new Date(),
                nextMaintenanceDate;
            new Date(),
                createdAt;
            new Date(),
                updatedAt;
            new Date();
        }
        {
            id: "amb2",
                "BASIC_LIFE_SUPPORT",
                new Date(),
                nextMaintenanceDate;
            new Date(),
                createdAt;
            new Date(),
                updatedAt;
            new Date();
            ;
            // Mock Prisma response;
            module_2.prisma.ambulance.findMany.mockResolvedValue(mockVehicles);
            module_2.prisma.ambulance.count.mockResolvedValue(2);
            // Call the service method;
            const result = await ambulanceService.getAmbulanceVehicles({ page: 1,
                limit: 10
            });
            // Verify Prisma was called with correct arguments;
            expect(module_2.prisma.ambulance.findMany).toHaveBeenCalledWith();
            expect.objectContaining({ skip: 0,
                "asc": 
            });
        }
    });
    // Verify result;
    expect(result).toEqual({ data: mockVehicles,
        1: ,
        2: ,
        totalPages: 1
    });
});
it("should apply filters correctly", async () => {
    // Mock data;
    const mockVehicles = [];
    {
        id: "amb1",
            "ADVANCED_LIFE_SUPPORT",
            new Date(),
            nextMaintenanceDate;
        new Date(),
            createdAt;
        new Date(),
            updatedAt;
        new Date();
        ;
        // Mock Prisma response;
        module_2.prisma.ambulance.findMany.mockResolvedValue(mockVehicles);
        module_2.prisma.ambulance.count.mockResolvedValue(1);
        // Call the service method with filters;
        const result = await ambulanceService.getAmbulanceVehicles({ status: "AVAILABLE",
            true: ,
            10: 
        });
        // Verify Prisma was called with correct filters;
        expect(module_2.prisma.ambulance.findMany).toHaveBeenCalledWith();
        expect.objectContaining({
            "AVAILABLE": ,
            type: "ADVANCED_LIFE_SUPPORT"
        });
    }
});
// Verify result;
expect(result.data).toEqual(mockVehicles),
    expect(result.pagination.totalItems).toBe(1);
;
;
describe("getAmbulanceAnalytics", () => {
    it("should return analytics data", async () => {
        // Mock data for status counts;
        const mockStatusCounts = [];
        {
            status: "PENDING", count;
            5;
        }
        {
            status: "ASSIGNED", count;
            3;
        }
        {
            status: "EN_ROUTE_TO_PICKUP", count;
            2;
        }
        {
            status: "AT_PICKUP", count;
            1;
        }
        {
            status: "EN_ROUTE_TO_DROPOFF", count;
            2;
        }
        {
            status: "COMPLETED", count;
            10;
        }
        {
            status: "CANCELLED", count;
            1;
        }
        ;
        // Mock data for request types;
        const mockRequestTypes = [];
        {
            requestType: "EMERGENCY", count;
            8;
        }
        {
            requestType: "NON_EMERGENCY", count;
            5;
        }
        {
            requestType: "TRANSFER", count;
            7;
        }
        {
            requestType: "DISCHARGE", count;
            3;
        }
        {
            requestType: "SCHEDULED", count;
            1;
        }
        ;
        // Mock data for priority distribution;
        const mockPriorities = [];
        {
            priority: "LOW", count;
            2;
        }
        {
            priority: "MEDIUM", count;
            8;
        }
        {
            priority: "HIGH", count;
            6;
        }
        {
            priority: "URGENT", count;
            8;
        }
        ;
        // Mock Prisma response for each query;
        module_2.prisma.ambulanceTrip.groupBy = vi.fn();
        module_2.prisma.ambulanceTrip.groupBy;
        mockResolvedValueOnce(mockStatusCounts);
        mockResolvedValueOnce(mockRequestTypes);
        mockResolvedValueOnce(mockPriorities);
        module_2.prisma.ambulanceTrip.count.mockResolvedValue(24);
        // Call the service method;
        const result = await ambulanceService.getAmbulanceAnalytics();
        // Verify result structure;
        expect(result).toHaveProperty("totalTrips", 24),
            expect(result).toHaveProperty("statusDistribution"),
            expect(result).toHaveProperty("requestTypeDistribution"),
            expect(result).toHaveProperty("priorityDistribution");
        // Verify specific data;
        expect(result.statusDistribution).toEqual(expect.arrayContaining([]));
        {
            status: "PENDING", count;
            5;
        }
        {
            status: "COMPLETED", count;
            10;
        }
    });
});
expect(result.requestTypeDistribution).toEqual(expect.arrayContaining([]));
{
    requestType: "EMERGENCY", count;
    8;
}
{
    requestType: "TRANSFER", count;
    7;
}
;
expect(result.priorityDistribution).toEqual(expect.arrayContaining([]));
{
    priority: "MEDIUM", count;
    8;
}
{
    priority: "URGENT", count;
    8;
}
;
;
it("should apply date filters when provided", async () => {
    // Mock dates;
    const fromDate = new Date("2025-05-01");
    const toDate = new Date("2025-05-25");
    // Mock Prisma response;
    module_2.prisma.ambulanceTrip.groupBy = vi.fn().mockResolvedValue([]);
    module_2.prisma.ambulanceTrip.count.mockResolvedValue(0);
    // Call the service method with date filters;
    await ambulanceService.getAmbulanceAnalytics(fromDate, toDate);
    // Verify Prisma was called with date filters;
    expect(module_2.prisma.ambulanceTrip.count).toHaveBeenCalledWith({}, { gte: fromDate,
        lte: toDate
    }),
        expect(module_2.prisma.ambulanceTrip.groupBy).toHaveBeenCalledWith();
    expect.objectContaining({}, { gte: fromDate,
        lte: toDate
    });
});
;
;
;
