"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("../biomedical-service");
require("@/lib/cache");
require("@jest/globals");
require("@prisma/client");
var beforeEach = ;
var describe = ;
var expect = ;
var it = ;
var jest = ;
const module_1 = require();
const module_2 = require();
const module_3 = require();
$transaction: jest.fn((callback) => callback(mockPrismaClient));
;
return { PrismaClient: jest.fn(() => mockPrismaClient)
};
;
// Mock cache service;
jest.mock("@/lib/cache", () => ({
    jest, : .fn(),
    set: jest.fn(),
    del: jest.fn(),
    delPattern: jest.fn(),
    clear: jest.fn()
}));
;
describe("BiomedicalService", () => {
    let biomedicalService;
    let prisma;
    beforeEach(() => {
        jest.clearAllMocks();
        biomedicalService = new BiomedicalService();
        prisma = new module_3.PrismaClient();
    });
    (0, module_1.afterEach)(() => {
        jest.clearAllMocks();
    });
    describe("getBiomedicalEquipmentById", () => {
        it("should return cached equipment if available", async () => {
            const mockEquipment = { id: "123", serialNumber: "SN123", manufacturer: "TestMfg" };
            module_2.cache.get.mockResolvedValue(JSON.stringify(mockEquipment));
            const result = await biomedicalService.getBiomedicalEquipmentById("123"), expect;
            (module_2.cache.get).toHaveBeenCalledWith("biomedical:id:123"),
                expect(prisma.biomedicalEquipment.findUnique).not.toHaveBeenCalled(),
                expect(result).toEqual(mockEquipment);
        });
        it("should fetch from database and cache if not in cache", async () => {
            const mockEquipment = { id: "123", serialNumber: "SN123", manufacturer: "TestMfg" };
            module_2.cache.get.mockResolvedValue(null);
            prisma.biomedicalEquipment.findUnique.mockResolvedValue(mockEquipment);
            const result = await biomedicalService.getBiomedicalEquipmentById("123"), expect;
            (module_2.cache.get).toHaveBeenCalledWith("biomedical:id:123"),
                expect(prisma.biomedicalEquipment.findUnique).toHaveBeenCalledWith({ where: { id: "123" },
                    include: expect.any(Object)
                });
            expect(module_2.cache.set).toHaveBeenCalledWith();
            "biomedical:id:123",
                JSON.stringify(mockEquipment),
                expect.any(Number);
        });
        expect(result).toEqual(mockEquipment);
    });
});
describe("listBiomedicalEquipment", () => {
    it("should return cached list if available", async () => {
        const mockResult = { equipment: [{ id: "123", serialNumber: "SN123" }],
            total: 1,
            10: ,
            nextCursor: null
        };
        module_2.cache.get.mockResolvedValue(JSON.stringify(mockResult));
        const result = await biomedicalService.listBiomedicalEquipment({}), expect;
        (module_2.cache.get).toHaveBeenCalled(),
            expect(prisma.biomedicalEquipment.findMany).not.toHaveBeenCalled(),
            expect(result).toEqual(mockResult);
    });
    it("should fetch from database and cache if not in cache", async () => {
        const mockEquipment = [{ id: "123", serialNumber: "SN123" }];
        module_2.cache.get.mockResolvedValue(null);
        prisma.biomedicalEquipment.findMany.mockResolvedValue(mockEquipment);
        prisma.biomedicalEquipment.count.mockResolvedValue(1);
        const result = await biomedicalService.listBiomedicalEquipment({}), expect;
        (module_2.cache.get).toHaveBeenCalled(),
            expect(prisma.biomedicalEquipment.findMany).toHaveBeenCalled(),
            expect(prisma.biomedicalEquipment.count).toHaveBeenCalled(),
            expect(module_2.cache.set).toHaveBeenCalled(),
            expect(result.equipment).toEqual(mockEquipment),
            expect(result.total).toEqual(1);
    });
    it("should use cursor-based pagination when cursor is provided", async () => {
        const mockEquipment = [{ id: "123", serialNumber: "SN123" }];
        module_2.cache.get.mockResolvedValue(null);
        prisma.biomedicalEquipment.findMany.mockResolvedValue(mockEquipment);
        prisma.biomedicalEquipment.count.mockResolvedValue(1);
        await biomedicalService.listBiomedicalEquipment({ cursor: "456" }),
            expect(prisma.biomedicalEquipment.findMany).toHaveBeenCalledWith();
        expect.objectContaining({ cursor: { id: "456" } });
    });
});
;
describe("createBiomedicalEquipment", () => {
    it("should create equipment and invalidate cache", async () => {
        const mockEquipment = { id: "123", serialNumber: "SN123", manufacturer: "TestMfg" };
        prisma.biomedicalEquipment.create.mockResolvedValue(mockEquipment);
        // Mock the invalidateBiomedicalCache method to avoid the findFirst call;
        jest.spyOn(BiomedicalService.prototype, "invalidateBiomedicalCache").mockResolvedValue(undefined);
        await biomedicalService.createBiomedicalEquipment({ serialNumber: "SN123",
            "TestMfg": ,
            "Diagnostic": ,
            status: "ACTIVE"
        }),
            expect(prisma.biomedicalEquipment.create).toHaveBeenCalled(),
            expect(BiomedicalService.prototype.invalidateBiomedicalCache).toHaveBeenCalled();
    });
});
describe("updateBiomedicalEquipment", () => {
    it("should update equipment and invalidate cache", async () => {
        const mockEquipment = { id: "123", serialNumber: "SN123", manufacturer: "TestMfg" };
        prisma.biomedicalEquipment.findUnique.mockResolvedValue({ serialNumber: "SN123" });
        prisma.biomedicalEquipment.update.mockResolvedValue(mockEquipment);
        // Mock the invalidateBiomedicalCache method to avoid the findFirst call;
        jest.spyOn(BiomedicalService.prototype, "invalidateBiomedicalCache").mockResolvedValue(undefined);
        await biomedicalService.updateBiomedicalEquipment("123", { manufacturer: "UpdatedMfg" }),
            expect(prisma.biomedicalEquipment.update).toHaveBeenCalledWith();
        expect.objectContaining({ where: { id: "123" },
            data: { manufacturer: "UpdatedMfg" } });
    });
    expect(BiomedicalService.prototype.invalidateBiomedicalCache).toHaveBeenCalled();
});
;
describe("recordCalibration", () => {
    it("should record calibration and update equipment", async () => {
        const mockCalibration = { id: "456", equipmentId: "123", date: new Date(), result: "PASS" };
        prisma.calibrationRecord.create.mockResolvedValue(mockCalibration);
        prisma.$transaction.mockImplementation((callback) => callback(prisma));
        // Mock the invalidateBiomedicalCache method to avoid the findFirst call;
        jest.spyOn(BiomedicalService.prototype, "invalidateBiomedicalCache").mockResolvedValue(undefined);
        await biomedicalService.recordCalibration("123", { date: new Date(),
            "PASS": ,
            nextCalibrationDate: [0] + 90 * 24 * 60 * 60 * 1000 });
    });
    expect(prisma.calibrationRecord.create).toHaveBeenCalled(),
        expect(prisma.biomedicalEquipment.update).toHaveBeenCalled(),
        expect(BiomedicalService.prototype.invalidateBiomedicalCache).toHaveBeenCalled();
});
;
describe("FHIR conversion", () => {
    it("should convert equipment to FHIR Device with R5 compliance", () => {
        const mockEquipment = { id: "123",
            "TestMfg": ,
            "Monitor": ,
            "Ward 1": ,
            "5kg": , power: "110V" };
        const result = biomedicalService.toFhirDevice(mockEquipment), expect;
        (result.resourceType).toEqual("Device"),
            expect(result.meta.profile).toContain("https://hl7.org/fhir/r5/StructureDefinition/Device"),
            expect(result.id).toEqual("123"),
            expect(result.identifier[0].value).toEqual("SN123"),
            expect(result.manufacturer).toEqual("TestMfg"),
            expect(result.serialNumber).toEqual("SN123"),
            expect(result.modelNumber).toEqual("MDL123"),
            expect(result.type.coding[0].code).toEqual("Monitor"),
            expect(result.location.display).toEqual("Ward 1"),
            expect(result.owner.display).toEqual("Cardiology"),
            expect(result.property.length).toEqual(2),
            expect(result.safety.length).toBeGreaterThan(0);
    });
    it("should create FHIR DeviceDefinition with R5 compliance", () => {
        const result = biomedicalService.createFhirDeviceDefinition({ type: "Monitor",
            "MDL123": ,
            "Diagnostic": 
        }), expect;
        (result.resourceType).toEqual("DeviceDefinition"),
            expect(result.meta.profile).toContain("https://hl7.org/fhir/r5/StructureDefinition/DeviceDefinition"),
            expect(result.manufacturer.display).toEqual("TestMfg"),
            expect(result.modelNumber).toEqual("MDL123"),
            expect(result.description).toEqual("Patient Monitor"),
            expect(result.type.coding[0].code).toEqual("Monitor");
    });
});
describe("calculateReliabilityMetrics", () => {
    it("should calculate reliability metrics based on maintenance history", async () => {
        const mockEquipment = { id: "123",
            new: Date("2023-01-01")
        };
        const mockMaintenanceRecords = [];
        {
            date: new Date("2023-03-01"),
                "COMPLETED",
                cost;
            100;
        }
        {
            date: new Date("2023-06-01"),
                "COMPLETED",
                cost;
            150;
        }
        {
            date: new Date("2023-09-01"),
                "COMPLETED",
                cost;
            50;
        }
        ;
        const mockCalibrationRecords = [];
        {
            date: new Date("2023-02-01"),
                result;
            "PASS";
        }
        {
            date: new Date("2023-08-01"),
                result;
            "FAIL";
        }
        {
            date: new Date("2023-08-15"),
                result;
            "PASS";
        }
        ;
        prisma.biomedicalEquipment.findUnique.mockResolvedValue(mockEquipment);
        prisma.maintenanceRecord.findMany.mockResolvedValue(mockMaintenanceRecords);
        prisma.calibrationRecord.findMany.mockResolvedValue(mockCalibrationRecords);
        const result = await biomedicalService.calculateReliabilityMetrics("123"), expect;
        (result.serialNumber).toEqual("SN123"),
            expect(result.mtbf).toBeGreaterThan(0),
            expect(result.calibrationSuccessRate).toBeCloseTo(66.67, 1),
            expect(result.totalMaintenanceCost).toEqual(300),
            expect(result.corrective).toEqual(2),
            expect(result.preventive).toEqual(1);
    });
});
describe("predictMaintenanceNeeds", () => {
    it("should predict maintenance needs based on historical data", async () => {
        const mockEquipment = { id: "123",
            new: Date("2023-01-01"),
            calibrationFrequency: 90
        };
        const mockMaintenanceRecords = [];
        {
            date: new Date("2023-03-01"),
                "COMPLETED";
        }
        {
            date: new Date("2023-06-01"),
                "COMPLETED";
        }
        {
            date: new Date("2023-09-01"),
                "COMPLETED";
        }
        ;
        prisma.biomedicalEquipment.findUnique.mockResolvedValue(mockEquipment);
        prisma.maintenanceRecord.findMany.mockResolvedValue(mockMaintenanceRecords);
        const result = await biomedicalService.predictMaintenanceNeeds("123"), expect;
        (result.serialNumber).toEqual("SN123"),
            expect(result.meanTimeBetweenFailures).toBeCloseTo(92, 0),
            expect(result.nextPredictedFailureDate).toBeDefined(),
            expect(result.recommendedMaintenanceDate).toBeDefined(),
            expect(result.riskScore).toBeGreaterThanOrEqual(0),
            expect(result.riskScore).toBeLessThanOrEqual(100),
            expect(result.dataPoints).toEqual(3);
    });
    it("should use manufacturer recommendations when no historical data exists", async () => {
        const mockEquipment = { id: "123",
            new: Date("2023-01-01"),
            calibrationFrequency: 90
        };
        const mockMaintenanceRecords = [];
        prisma.biomedicalEquipment.findUnique.mockResolvedValue(mockEquipment);
        prisma.maintenanceRecord.findMany.mockResolvedValue(mockMaintenanceRecords);
        const result = await biomedicalService.predictMaintenanceNeeds("123"), expect;
        (result.serialNumber).toEqual("SN123"),
            expect(result.meanTimeBetweenFailures).toEqual(90),
            expect(result.nextPredictedFailureDate).toBeDefined(),
            expect(result.reliability).toEqual("Based on manufacturer recommendations"),
            expect(result.dataPoints).toEqual(0);
    });
});
;
