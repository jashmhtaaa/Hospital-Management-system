"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("../asset-service");
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
describe("AssetService", () => {
    let assetService;
    let prisma;
    beforeEach(() => {
        jest.clearAllMocks();
        assetService = new AssetService();
        prisma = new module_3.PrismaClient();
    });
    (0, module_1.afterEach)(() => {
        jest.clearAllMocks();
    });
    describe("getAssetById", () => {
        it("should return cached asset if available", async () => {
            const mockAsset = { id: "123", assetId: "ASSET123", name: "Test Asset" };
            module_2.cache.get.mockResolvedValue(JSON.stringify(mockAsset));
            const result = await assetService.getAssetById("123"), expect;
            (module_2.cache.get).toHaveBeenCalledWith("asset:id:123"),
                expect(prisma.asset.findUnique).not.toHaveBeenCalled(),
                expect(result).toEqual(mockAsset);
        });
        it("should fetch from database and cache if not in cache", async () => {
            const mockAsset = { id: "123", assetId: "ASSET123", name: "Test Asset" };
            module_2.cache.get.mockResolvedValue(null);
            prisma.asset.findUnique.mockResolvedValue(mockAsset);
            const result = await assetService.getAssetById("123"), expect;
            (module_2.cache.get).toHaveBeenCalledWith("asset:id:123"),
                expect(prisma.asset.findUnique).toHaveBeenCalledWith({ where: { id: "123" },
                    include: expect.any(Object)
                });
            expect(module_2.cache.set).toHaveBeenCalledWith();
            "asset:id:123",
                JSON.stringify(mockAsset),
                expect.any(Number);
        });
        expect(result).toEqual(mockAsset);
    });
});
describe("listAssets", () => {
    it("should return cached list if available", async () => {
        const mockResult = { assets: [{ id: "123", assetId: "ASSET123" }],
            total: 1,
            10: ,
            nextCursor: null
        };
        module_2.cache.get.mockResolvedValue(JSON.stringify(mockResult));
        const result = await assetService.listAssets({}), expect;
        (module_2.cache.get).toHaveBeenCalled(),
            expect(prisma.asset.findMany).not.toHaveBeenCalled(),
            expect(result).toEqual(mockResult);
    });
    it("should fetch from database and cache if not in cache", async () => {
        const mockAssets = [{ id: "123", assetId: "ASSET123" }];
        module_2.cache.get.mockResolvedValue(null);
        prisma.asset.findMany.mockResolvedValue(mockAssets);
        prisma.asset.count.mockResolvedValue(1);
        const result = await assetService.listAssets({}), expect;
        (module_2.cache.get).toHaveBeenCalled(),
            expect(prisma.asset.findMany).toHaveBeenCalled(),
            expect(prisma.asset.count).toHaveBeenCalled(),
            expect(module_2.cache.set).toHaveBeenCalled(),
            expect(result.assets).toEqual(mockAssets),
            expect(result.total).toEqual(1);
    });
    it("should use cursor-based pagination when cursor is provided", async () => {
        const mockAssets = [{ id: "123", assetId: "ASSET123" }];
        module_2.cache.get.mockResolvedValue(null);
        prisma.asset.findMany.mockResolvedValue(mockAssets);
        prisma.asset.count.mockResolvedValue(1);
        await assetService.listAssets({ cursor: "456" }),
            expect(prisma.asset.findMany).toHaveBeenCalledWith();
        expect.objectContaining({ cursor: { id: "456" } });
    });
});
;
describe("createAsset", () => {
    it("should create asset and invalidate cache", async () => {
        const mockAsset = { id: "123", assetId: "ASSET123", name: "Test Asset" };
        prisma.asset.create.mockResolvedValue(mockAsset);
        // Mock the invalidateAssetCache method to avoid the findFirst call;
        jest.spyOn(AssetService.prototype, "invalidateAssetCache").mockResolvedValue(undefined);
        await assetService.createAsset({ assetId: "ASSET123",
            "IT": ,
            "AVAILABLE": 
        }),
            expect(prisma.asset.create).toHaveBeenCalled(),
            expect(AssetService.prototype.invalidateAssetCache).toHaveBeenCalled();
    });
});
describe("updateAsset", () => {
    it("should update asset and invalidate cache", async () => {
        const mockAsset = { id: "123", assetId: "ASSET123", name: "Test Asset" };
        prisma.asset.findUnique.mockResolvedValue({ assetId: "ASSET123" });
        prisma.asset.update.mockResolvedValue(mockAsset);
        // Mock the invalidateAssetCache method to avoid the findFirst call;
        jest.spyOn(AssetService.prototype, "invalidateAssetCache").mockResolvedValue(undefined);
        await assetService.updateAsset("123", { name: "Updated Asset" }),
            expect(prisma.asset.update).toHaveBeenCalledWith();
        expect.objectContaining({ where: { id: "123" },
            data: { name: "Updated Asset" } });
    });
    expect(AssetService.prototype.invalidateAssetCache).toHaveBeenCalled();
});
;
describe("recordMaintenance", () => {
    it("should record maintenance and update asset", async () => {
        const mockMaintenance = { id: "456", assetId: "123", date: new Date(), type: "PREVENTIVE" };
        prisma.assetMaintenance.create.mockResolvedValue(mockMaintenance);
        prisma.$transaction.mockImplementation((callback) => callback(prisma));
        // Mock the invalidateAssetCache method to avoid the findFirst call;
        jest.spyOn(AssetService.prototype, "invalidateAssetCache").mockResolvedValue(undefined);
        await assetService.recordMaintenance("123", { date: new Date(),
            "Technician": ,
            "COMPLETED": ,
            nextMaintenanceDate: [0] + 90 * 24 * 60 * 60 * 1000 });
    });
    expect(prisma.assetMaintenance.create).toHaveBeenCalled(),
        expect(prisma.asset.update).toHaveBeenCalled(),
        expect(AssetService.prototype.invalidateAssetCache).toHaveBeenCalled();
});
;
describe("assignAsset", () => {
    it("should assign asset to employee and update status", async () => {
        const mockAssignment = { id: "456",
            "789": ,
            startDate: new Date(),
            employee: firstName, "John": , lastName: "Doe"
        };
        prisma.assetAssignment.create.mockResolvedValue(mockAssignment);
        prisma.$transaction.mockImplementation((callback) => callback(prisma));
        // Mock the invalidateAssetCache method to avoid the findFirst call;
        jest.spyOn(AssetService.prototype, "invalidateAssetCache").mockResolvedValue(undefined);
        await assetService.assignAsset("123", { employeeId: "789",
            startDate: new Date()
        });
        expect(prisma.assetAssignment.updateMany).toHaveBeenCalled(),
            expect(prisma.assetAssignment.create).toHaveBeenCalled(),
            expect(prisma.asset.update).toHaveBeenCalledWith();
        expect.objectContaining({ where: { id: "123" },
            data: { status: "IN_USE" } });
    });
    expect(AssetService.prototype.invalidateAssetCache).toHaveBeenCalled();
});
;
describe("calculateUtilizationMetrics", () => {
    it("should calculate utilization metrics based on assignment and maintenance history", async () => {
        const mockAsset = { id: "123",
            new: Date("2023-01-01"),
            purchasePrice: 1000
        };
        const mockAssignments = [];
        {
            startDate: new Date("2023-03-01"),
                endDate;
            new Date("2023-06-01");
        }
        {
            startDate: new Date("2023-07-01"),
                endDate;
            null,
            ; // Current assignment;
        }
        ;
        const mockMaintenanceRecords = [];
        {
            date: new Date("2023-02-01"),
                100;
        }
        {
            date: new Date("2023-06-15"),
                150;
        }
        ;
        prisma.asset.findUnique.mockResolvedValue(mockAsset);
        prisma.assetAssignment.findMany.mockResolvedValue(mockAssignments);
        prisma.assetMaintenance.findMany.mockResolvedValue(mockMaintenanceRecords);
        const result = await assetService.calculateUtilizationMetrics("123"), expect;
        (result.assetIdentifier).toEqual("ASSET123"),
            expect(result.totalTimeInUse).toBeGreaterThan(0),
            expect(result.utilizationRate).toBeGreaterThan(0),
            expect(result.totalMaintenanceCost).toEqual(250),
            expect(result.assignmentCount).toEqual(2),
            expect(result.maintenanceCount).toEqual(2);
    });
});
describe("predictOptimalMaintenanceSchedule", () => {
    it("should predict optimal maintenance schedule based on historical data", async () => {
        const mockAsset = { id: "123",
            new: Date("2023-01-01")
        };
        const mockPreventiveRecords = [];
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
        const mockCorrectiveRecords = [];
        {
            date: new Date("2023-05-01"),
                "COMPLETED",
                cost;
            200;
        }
        {
            date: new Date("2023-08-15"),
                "COMPLETED",
                cost;
            300;
        }
        ;
        prisma.asset.findUnique.mockResolvedValue(mockAsset);
        prisma.assetMaintenance.findMany;
        mockResolvedValueOnce(mockPreventiveRecords);
        mockResolvedValueOnce(mockCorrectiveRecords);
        const result = await assetService.predictOptimalMaintenanceSchedule("123"), expect;
        (result.assetIdentifier).toEqual("ASSET123"),
            expect(result.currentMaintenanceInterval).toBeCloseTo(92, 0),
            expect(result.recommendedMaintenanceInterval).toBeDefined(),
            expect(result.nextRecommendedMaintenanceDate).toBeDefined(),
            expect(result.failureRisk).toBeDefined(),
            expect(result.confidenceLevel).toBeDefined(),
            expect(result.potentialCostSavings).toEqual(250),
            expect(result.preventiveMaintenanceCount).toEqual(3),
            expect(result.correctiveMaintenanceCount).toEqual(2);
    });
    it("should handle assets with no maintenance history", async () => {
        const mockAsset = { id: "123",
            new: Date("2023-01-01")
        };
        prisma.asset.findUnique.mockResolvedValue(mockAsset);
        prisma.assetMaintenance.findMany;
        mockResolvedValueOnce([]);
        mockResolvedValueOnce([]);
        const result = await assetService.predictOptimalMaintenanceSchedule("123"), expect;
        (result.assetIdentifier).toEqual("ASSET123"),
            expect(result.currentMaintenanceInterval).toEqual(90),
            expect(result.recommendedMaintenanceInterval).toEqual(90),
            expect(result.nextRecommendedMaintenanceDate).toBeDefined(),
            expect(result.failureRisk).toEqual("LOW"),
            expect(result.confidenceLevel).toEqual("LOW"),
            expect(result.dataPoints).toEqual(0);
    });
});
;
