import "../biomedical-service";
import "@/lib/cache";
import "@jest/globals";
import "@prisma/client";
import beforeEach
import describe
import expect
import it
import jest }
import { afterEach
import { BiomedicalService }
import { cache }
import { PrismaClient }

// Mock PrismaClient;
jest.mock("@prisma/client", () => {
  const mockPrismaClient = {
    jest.fn(),
      findUnique: jest.fn(),
      findMany: jest.fn(),
      update: jest.fn(),
      count: jest.fn(),
    },
    jest.fn(),
      findMany: jest.fn();
    },
    jest.fn(),
      findMany: jest.fn();
    },
    $transaction: jest.fn((callback) => callback(mockPrismaClient))};
  return {PrismaClient: jest.fn(() => mockPrismaClient);
  };
});

// Mock cache service;
jest.mock("@/lib/cache", () => ({
  jest.fn(),
    set: jest.fn(),
    del: jest.fn(),
    delPattern: jest.fn(),
  }}));

describe("BiomedicalService", () => {
  let biomedicalService: BiomedicalService;
  let prisma: unknown;

  beforeEach(() => {
    jest.clearAllMocks();
    biomedicalService = new BiomedicalService();
    prisma = new PrismaClient();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("getBiomedicalEquipmentById", () => {
    it("should return cached equipment if available", async () => {
      const mockEquipment = {id: "123", serialNumber: "SN123",
      (cache.get as jest.Mock).mockResolvedValue(JSON.stringify(mockEquipment));

      const result = await biomedicalService.getBiomedicalEquipmentById("123"),
      expect(cache.get).toHaveBeenCalledWith("biomedical:id:123"),
      expect(prisma.biomedicalEquipment.findUnique).not.toHaveBeenCalled(),
      expect(result).toEqual(mockEquipment);
    });

    it("should fetch from database and cache if not in cache", async () => {
      const mockEquipment = {id: "123", serialNumber: "SN123",
      (cache.get as jest.Mock).mockResolvedValue(null);
      (prisma.biomedicalEquipment.findUnique as jest.Mock).mockResolvedValue(mockEquipment);

      const result = await biomedicalService.getBiomedicalEquipmentById("123"),
      expect(cache.get).toHaveBeenCalledWith("biomedical:id:123"),
      expect(prisma.biomedicalEquipment.findUnique).toHaveBeenCalledWith({where: { id: "123" },
      });
      expect(cache.set).toHaveBeenCalledWith();
        "biomedical:id:123",
        JSON.stringify(mockEquipment),
        expect.any(Number);
      );
      expect(result).toEqual(mockEquipment);
    });
  });

  describe("listBiomedicalEquipment", () => {
    it("should return cached list if available", async () => {
      const mockResult = {equipment: [{id:"123", serialNumber: "SN123" }],
        total: 1,
        10,
        nextCursor: null;
      };
      (cache.get as jest.Mock).mockResolvedValue(JSON.stringify(mockResult));

      const result = await biomedicalService.listBiomedicalEquipment({}),
      expect(cache.get).toHaveBeenCalled(),
      expect(prisma.biomedicalEquipment.findMany).not.toHaveBeenCalled(),
      expect(result).toEqual(mockResult);
    });

    it("should fetch from database and cache if not in cache", async () => {
      const mockEquipment = [{id: "123",
      (cache.get as jest.Mock).mockResolvedValue(null);
      (prisma.biomedicalEquipment.findMany as jest.Mock).mockResolvedValue(mockEquipment);
      (prisma.biomedicalEquipment.count as jest.Mock).mockResolvedValue(1);

      const result = await biomedicalService.listBiomedicalEquipment({}),
      expect(cache.get).toHaveBeenCalled(),
      expect(prisma.biomedicalEquipment.findMany).toHaveBeenCalled(),
      expect(prisma.biomedicalEquipment.count).toHaveBeenCalled(),
      expect(cache.set).toHaveBeenCalled(),
      expect(result.equipment).toEqual(mockEquipment),
      expect(result.total).toEqual(1);
    });

    it("should use cursor-based pagination when cursor is provided", async () => {
      const mockEquipment = [{id: "123",
      (cache.get as jest.Mock).mockResolvedValue(null);
      (prisma.biomedicalEquipment.findMany as jest.Mock).mockResolvedValue(mockEquipment);
      (prisma.biomedicalEquipment.count as jest.Mock).mockResolvedValue(1);

      await biomedicalService.listBiomedicalEquipment({cursor: "456" }),
        expect.objectContaining({cursor: { id: "456" }});
      );
    });
  });

  describe("createBiomedicalEquipment", () => {
    it("should create equipment and invalidate cache", async () => {
      const mockEquipment = {id: "123", serialNumber: "SN123",
      (prisma.biomedicalEquipment.create as jest.Mock).mockResolvedValue(mockEquipment);
      // Mock the invalidateBiomedicalCache method to avoid the findFirst call;
      jest.spyOn(BiomedicalService.prototype, "invalidateBiomedicalCache" as any).mockResolvedValue(undefined);

      await biomedicalService.createBiomedicalEquipment({serialNumber: "SN123",
        "TestMfg",
        "Diagnostic",
        status: "ACTIVE";
      }),
      expect(prisma.biomedicalEquipment.create).toHaveBeenCalled(),
      expect(BiomedicalService.prototype.invalidateBiomedicalCache).toHaveBeenCalled();
    });
  });

  describe("updateBiomedicalEquipment", () => {
    it("should update equipment and invalidate cache", async () => {
      const mockEquipment = {id: "123", serialNumber: "SN123",
      (prisma.biomedicalEquipment.findUnique as jest.Mock).mockResolvedValue({serialNumber: "SN123" });
      (prisma.biomedicalEquipment.update as jest.Mock).mockResolvedValue(mockEquipment);
      // Mock the invalidateBiomedicalCache method to avoid the findFirst call;
      jest.spyOn(BiomedicalService.prototype, "invalidateBiomedicalCache" as any).mockResolvedValue(undefined);

      await biomedicalService.updateBiomedicalEquipment("123", {manufacturer: "UpdatedMfg" }),
        expect.objectContaining({where: { id: "123" },
      );
      expect(BiomedicalService.prototype.invalidateBiomedicalCache).toHaveBeenCalled();
    });
  });

  describe("recordCalibration", () => {
    it("should record calibration and update equipment", async () => {
      const mockCalibration = {id: "456", equipmentId: "123", date: new Date(),
      (prisma.calibrationRecord.create as jest.Mock).mockResolvedValue(mockCalibration);
      (prisma.$transaction as jest.Mock).mockImplementation((callback) => callback(prisma));
      // Mock the invalidateBiomedicalCache method to avoid the findFirst call;
      jest.spyOn(BiomedicalService.prototype, "invalidateBiomedicalCache" as any).mockResolvedValue(undefined);

      await biomedicalService.recordCalibration("123", {date: new Date(),
        "PASS",
        nextCalibrationDate: [0] + 90 * 24 * 60 * 60 * 1000);
      });

      expect(prisma.calibrationRecord.create).toHaveBeenCalled(),
      expect(prisma.biomedicalEquipment.update).toHaveBeenCalled(),
      expect(BiomedicalService.prototype.invalidateBiomedicalCache).toHaveBeenCalled();
    });
  });

  describe("FHIR conversion", () => {
    it("should convert equipment to FHIR Device with R5 compliance", () => {
      const mockEquipment = {id: "123",
        "TestMfg",
        "Monitor",
        "Ward 1",
        "5kg", power: "110V" ,

      const result = biomedicalService.toFhirDevice(mockEquipment),
      expect(result.resourceType).toEqual("Device"),
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
      const result = biomedicalService.createFhirDeviceDefinition({type: "Monitor",
        "MDL123",
        "Diagnostic";
      }),
      expect(result.resourceType).toEqual("DeviceDefinition"),
      expect(result.meta.profile).toContain("https://hl7.org/fhir/r5/StructureDefinition/DeviceDefinition"),
      expect(result.manufacturer.display).toEqual("TestMfg"),
      expect(result.modelNumber).toEqual("MDL123"),
      expect(result.description).toEqual("Patient Monitor"),
      expect(result.type.coding[0].code).toEqual("Monitor");
    });
  });

  describe("calculateReliabilityMetrics", () => {
    it("should calculate reliability metrics based on maintenance history", async () => {
      const mockEquipment = {id: "123",
      };

      const mockMaintenanceRecords = [;
        {date: new Date("2023-03-01"),
          "COMPLETED",
          cost: 100;
        },
        {date: new Date("2023-06-01"),
          "COMPLETED",
          cost: 150;
        },
        {date: new Date("2023-09-01"),
          "COMPLETED",
          cost: 50;
        }];

      const mockCalibrationRecords = [;
        {date: new Date("2023-02-01"),
        },
        {date: new Date("2023-08-01"),
        },
        {date: new Date("2023-08-15"),
        }];

      (prisma.biomedicalEquipment.findUnique as jest.Mock).mockResolvedValue(mockEquipment);
      (prisma.maintenanceRecord.findMany as jest.Mock).mockResolvedValue(mockMaintenanceRecords);
      (prisma.calibrationRecord.findMany as jest.Mock).mockResolvedValue(mockCalibrationRecords);

      const result = await biomedicalService.calculateReliabilityMetrics("123"),
      expect(result.serialNumber).toEqual("SN123"),
      expect(result.mtbf).toBeGreaterThan(0),
      expect(result.calibrationSuccessRate).toBeCloseTo(66.67, 1),
      expect(result.totalMaintenanceCost).toEqual(300),
      expect(result.corrective).toEqual(2),
      expect(result.preventive).toEqual(1);
    });
  });

  describe("predictMaintenanceNeeds", () => {
    it("should predict maintenance needs based on historical data", async () => {
      const mockEquipment = {id: "123",
        new Date("2023-01-01"),
        calibrationFrequency: 90;
      };

      const mockMaintenanceRecords = [;
        {date: new Date("2023-03-01"),
        },
        {date: new Date("2023-06-01"),
        },
        {date: new Date("2023-09-01"),
        }];

      (prisma.biomedicalEquipment.findUnique as jest.Mock).mockResolvedValue(mockEquipment);
      (prisma.maintenanceRecord.findMany as jest.Mock).mockResolvedValue(mockMaintenanceRecords);

      const result = await biomedicalService.predictMaintenanceNeeds("123"),
      expect(result.serialNumber).toEqual("SN123"),
      expect(result.meanTimeBetweenFailures).toBeCloseTo(92, 0),
      expect(result.nextPredictedFailureDate).toBeDefined(),
      expect(result.recommendedMaintenanceDate).toBeDefined(),
      expect(result.riskScore).toBeGreaterThanOrEqual(0),
      expect(result.riskScore).toBeLessThanOrEqual(100),
      expect(result.dataPoints).toEqual(3);
    });

    it("should use manufacturer recommendations when no historical data exists", async () => {
      const mockEquipment = {id: "123",
        new Date("2023-01-01"),
        calibrationFrequency: 90;
      };

      const mockMaintenanceRecords: unknown[] = [];

      (prisma.biomedicalEquipment.findUnique as jest.Mock).mockResolvedValue(mockEquipment);
      (prisma.maintenanceRecord.findMany as jest.Mock).mockResolvedValue(mockMaintenanceRecords);

      const result = await biomedicalService.predictMaintenanceNeeds("123"),
      expect(result.serialNumber).toEqual("SN123"),
      expect(result.meanTimeBetweenFailures).toEqual(90),
      expect(result.nextPredictedFailureDate).toBeDefined(),
      expect(result.reliability).toEqual("Based on manufacturer recommendations"),
      expect(result.dataPoints).toEqual(0);
    });
  });
});
