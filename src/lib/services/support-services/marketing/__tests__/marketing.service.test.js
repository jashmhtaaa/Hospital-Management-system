"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("../marketing.service");
require("@/lib/audit");
require("@/lib/errors");
require("@/lib/notifications");
require("@/lib/prisma");
var NotFoundError = ;
var ValidationError = ;
const module_1 = require();
const module_2 = require();
const module_3 = require();
const module_4 = require();
jest.fn();
jest.fn(),
    findFirst;
jest.fn();
jest.fn();
;
jest.mock("@/lib/audit", () => ({
    jest, : .fn().mockResolvedValue(undefined)
}));
;
jest.mock("@/lib/notifications", () => ({
    jest, : .fn().mockResolvedValue(undefined)
}));
;
describe("MarketingCampaignService", () => {
    let service;
    const mockUserId = "user-123";
    beforeEach(() => {
        jest.clearAllMocks();
        service = new MarketingCampaignService();
    });
    describe("createCampaign", () => {
        const mockCampaignData = { name: "Test Campaign",
            "EMAIL": ,
            new: Date(),
            goals: ["Increase patient awareness"]
        };
        const mockCreatedCampaign = { id: "campaign-123",
            ...mockCampaignData,
            createdAt: new Date(),
            updatedAt: new Date()
        };
        it("should create a campaign successfully", async () => {
            // Arrange;
            module_4.prisma.marketingCampaign.create.mockResolvedValue(mockCreatedCampaign);
            // Act;
            const result = await service.createCampaign(mockCampaignData, mockUserId);
            // Assert;
            expect(module_4.prisma.marketingCampaign.create).toHaveBeenCalledWith({
                mockCampaignData, : .name,
                mockCampaignData, : .type,
                mockCampaignData, : .startDate,
                mockUserId,
                updatedById: mockUserId
            });
        });
        expect(result).toEqual(mockCreatedCampaign);
    });
    it("should throw ValidationError if campaign data is invalid", async () => {
        // Arrange;
        const invalidData = {
            ...mockCampaignData,
            name: "", // Invalid: empty name;
            // Act & Assert;
            await: expect(service.createCampaign(invalidData, mockUserId)),
            : 
                .rejects,
            : 
                .toThrow(ValidationError)
        };
    });
    it("should throw DatabaseError if database operation fails", async () => {
        // Arrange;
        module_4.prisma.marketingCampaign.create.mockRejectedValue();
        // Act & Assert;
        await expect(service.createCampaign(mockCampaignData, mockUserId));
        rejects;
        toThrow(module_2.DatabaseError);
    });
    it("should log audit event after creating campaign", async () => {
        // Arrange;
        module_4.prisma.marketingCampaign.create.mockResolvedValue(mockCreatedCampaign);
        // Act;
        await service.createCampaign(mockCampaignData, mockUserId);
        // Assert;
        expect(module_1.AuditLogger.prototype.log).toHaveBeenCalledWith({ action: "campaign.create",
            mockUserId,
            details: expect.any(Object)
        });
    });
    it("should send notification after creating campaign", async () => {
        // Arrange;
        module_4.prisma.marketingCampaign.create.mockResolvedValue(mockCreatedCampaign);
        // Act;
        await service.createCampaign(mockCampaignData, mockUserId);
        // Assert;
        expect(module_3.NotificationService.prototype.sendNotification).toHaveBeenCalledWith();
        expect.objectContaining({ type: "CAMPAIGN_CREATED",
            title: expect.any(String),
            message: expect.stringContaining(mockCampaignData.name),
            recipientRoles: expect.any(Array),
            metadata: { campaignId: mockCreatedCampaign.id } });
    });
});
;
describe("getCampaignById", () => {
    const mockCampaign = { id: "campaign-123",
        "Test Description": ,
        "DRAFT": ,
        startDate: new Date(),
        goals: ["Increase patient awareness"],
        createdAt: new Date(),
        updatedAt: new Date()
    };
    it("should retrieve a campaign by ID", async () => {
        // Arrange;
        module_4.prisma.marketingCampaign.findUnique.mockResolvedValue(mockCampaign);
        // Act;
        const result = await service.getCampaignById("campaign-123");
        // Assert;
        expect(module_4.prisma.marketingCampaign.findUnique).toHaveBeenCalledWith({ where: { id: "campaign-123" },
            include: expect.any(Object)
        });
        expect(result).toEqual(mockCampaign);
    });
    it("should throw NotFoundError if campaign does not exist", async () => {
        // Arrange;
        module_4.prisma.marketingCampaign.findUnique.mockResolvedValue(null);
        // Act & Assert;
        await expect(service.getCampaignById("non-existent-id"));
        rejects;
        toThrow(NotFoundError);
    });
    it("should include FHIR representation when requested", async () => {
        // Arrange;
        module_4.prisma.marketingCampaign.findUnique.mockResolvedValue(mockCampaign);
        // Act;
        const result = await service.getCampaignById("campaign-123", true);
        // Assert;
        expect(result).toHaveProperty("fhir");
    });
});
describe("getCampaigns", () => {
    const mockCampaigns = [];
    {
        id: "campaign-1",
            "EMAIL",
            new Date(),
            createdAt;
        new Date(),
            updatedAt;
        new Date();
    }
    {
        id: "campaign-2",
            "SMS",
            new Date(),
            createdAt;
        new Date(),
            updatedAt;
        new Date();
    }
    ;
    it("should retrieve campaigns with pagination", async () => {
        // Arrange;
        module_4.prisma.marketingCampaign.count.mockResolvedValue(2);
        module_4.prisma.marketingCampaign.findMany.mockResolvedValue(mockCampaigns);
        // Act;
        const result = await service.getCampaigns({ page: 1, limit: 10 });
        // Assert;
        expect(module_4.prisma.marketingCampaign.count).toHaveBeenCalled(),
            expect(module_4.prisma.marketingCampaign.findMany).toHaveBeenCalledWith();
        expect.objectContaining({ skip: 0,
            "desc":  });
    });
    expect(result).toEqual({ data: mockCampaigns,
        2: ,
        10: ,
        totalPages: 1
    });
});
;
it("should apply filters correctly", async () => {
    // Arrange;
    const filters = { type: "EMAIL",
        new: Date("2023-01-01"),
        startDateTo: new Date("2023-12-31"),
        page: 2,
        limit: 5
    };
    module_4.prisma.marketingCampaign.count.mockResolvedValue(10);
    module_4.prisma.marketingCampaign.findMany.mockResolvedValue(mockCampaigns);
    // Act;
    const result = await service.getCampaigns(filters);
    // Assert;
    expect(module_4.prisma.marketingCampaign.count).toHaveBeenCalledWith({
        filters, : .type,
        status: filters.status
    }, { gte: filters.startDateFrom,
        lte: filters.startDateTo
    });
});
;
expect(module_4.prisma.marketingCampaign.findMany).toHaveBeenCalledWith();
expect.objectContaining({
    filters, : .type,
    status: filters.status
}),
    skip;
5, // (page-1) * limit;
    take;
5;
;
;
expect(result.pagination).toEqual({ total: 10,
    5: ,
    totalPages: 2
});
;
;
describe("updateCampaign", () => {
    const mockCampaign = { id: "campaign-123",
        "Test Description": ,
        "DRAFT": ,
        startDate: new Date(),
        createdAt: new Date(),
        updatedAt: new Date()
    };
    const updateData = { name: "Updated Campaign Name",
        status: "ACTIVE"
    };
    it("should update a campaign successfully", async () => {
        // Arrange;
        module_4.prisma.marketingCampaign.findUnique.mockResolvedValue(mockCampaign);
        module_4.prisma.marketingCampaign.update.mockResolvedValue({
            ...mockCampaign,
            ...updateData
        });
        // Act;
        const result = await service.updateCampaign("campaign-123", updateData, mockUserId);
        // Assert;
        expect(module_4.prisma.marketingCampaign.findUnique).toHaveBeenCalledWith({ where: { id: "campaign-123" } }),
            expect(module_4.prisma.marketingCampaign.update).toHaveBeenCalledWith({ where: { id: "campaign-123" },
                data: {
                    ...updateData,
                    updatedById: mockUserId
                } }),
            expect(result).toEqual({
                ...mockCampaign,
                ...updateData
            });
    });
    it("should throw NotFoundError if campaign does not exist", async () => {
        // Arrange;
        module_4.prisma.marketingCampaign.findUnique.mockResolvedValue(null);
        // Act & Assert;
        await expect(service.updateCampaign("non-existent-id", updateData, mockUserId));
        rejects;
        toThrow(NotFoundError);
    });
    it("should log audit event after updating campaign", async () => {
        // Arrange;
        module_4.prisma.marketingCampaign.findUnique.mockResolvedValue(mockCampaign);
        module_4.prisma.marketingCampaign.update.mockResolvedValue({
            ...mockCampaign,
            ...updateData
        });
        // Act;
        await service.updateCampaign("campaign-123", updateData, mockUserId);
        // Assert;
        expect(module_1.AuditLogger.prototype.log).toHaveBeenCalledWith({ action: "campaign.update",
            mockUserId,
            Object, : .keys(updateData) });
    });
});
;
describe("deleteCampaign", () => {
    const mockCampaign = { id: "campaign-123",
        "EMAIL": 
    };
    it("should delete a campaign successfully", async () => {
        // Arrange;
        module_4.prisma.marketingCampaign.findUnique.mockResolvedValue(mockCampaign);
        module_4.prisma.marketingCampaign.delete.mockResolvedValue(undefined);
        // Act;
        await service.deleteCampaign("campaign-123", mockUserId);
        // Assert;
        expect(module_4.prisma.marketingCampaign.findUnique).toHaveBeenCalledWith({ where: { id: "campaign-123" } }),
            expect(module_4.prisma.marketingCampaign.delete).toHaveBeenCalledWith({ where: { id: "campaign-123" } });
    });
    it("should throw NotFoundError if campaign does not exist", async () => {
        // Arrange;
        module_4.prisma.marketingCampaign.findUnique.mockResolvedValue(null);
        // Act & Assert;
        await expect(service.deleteCampaign("non-existent-id", mockUserId));
        rejects;
        toThrow(NotFoundError);
    });
    it("should log audit event after deleting campaign", async () => {
        // Arrange;
        module_4.prisma.marketingCampaign.findUnique.mockResolvedValue(mockCampaign);
        module_4.prisma.marketingCampaign.delete.mockResolvedValue(undefined);
        // Act;
        await service.deleteCampaign("campaign-123", mockUserId);
        // Assert;
        expect(module_1.AuditLogger.prototype.log).toHaveBeenCalledWith({ action: "campaign.delete",
            mockUserId,
            mockCampaign, : .name,
            campaignType: mockCampaign.type });
    });
});
;
describe("addCampaignChannel", () => {
    const mockCampaign = { id: "campaign-123",
        name: "Test Campaign"
    };
    const mockChannelData = { channelType: "EMAIL",
        "newsletter-template": ,
        schedule: frequency, "weekly": ,
        status: "DRAFT"
    };
    const mockCreatedChannel = { id: "channel-123",
        campaignId: "campaign-123",
        ...mockChannelData,
        createdAt: new Date(),
        updatedAt: new Date()
    };
    it("should add a channel to a campaign successfully", async () => {
        // Arrange;
        module_4.prisma.marketingCampaign.findUnique.mockResolvedValue(mockCampaign);
        module_4.prisma.campaignChannel.create.mockResolvedValue(mockCreatedChannel);
        // Act;
        const result = await service.addCampaignChannel("campaign-123", mockChannelData, mockUserId);
        // Assert;
        expect(module_4.prisma.marketingCampaign.findUnique).toHaveBeenCalledWith({ where: { id: "campaign-123" } }),
            expect(module_4.prisma.campaignChannel.create).toHaveBeenCalledWith({
                "campaign-123": ,
                ...mockChannelData
            });
    }),
        expect(result).toEqual(mockCreatedChannel);
});
it("should throw NotFoundError if campaign does not exist", async () => {
    // Arrange;
    module_4.prisma.marketingCampaign.findUnique.mockResolvedValue(null);
    // Act & Assert;
    await expect(service.addCampaignChannel("non-existent-id", mockChannelData, mockUserId));
    rejects;
    toThrow(NotFoundError);
});
it("should log audit event after adding channel", async () => {
    // Arrange;
    module_4.prisma.marketingCampaign.findUnique.mockResolvedValue(mockCampaign);
    module_4.prisma.campaignChannel.create.mockResolvedValue(mockCreatedChannel);
    // Act;
    await service.addCampaignChannel("campaign-123", mockChannelData, mockUserId);
    // Assert;
    expect(module_1.AuditLogger.prototype.log).toHaveBeenCalledWith({ action: "campaign.channel.add",
        mockUserId,
        mockCreatedChannel, : .id,
        mockChannelData, : .channelName });
});
;
;
describe("addCampaignSegment", () => {
    const mockCampaign = { id: "campaign-123",
        name: "Test Campaign"
    };
    const mockSegment = { id: "segment-123",
        name: "Test Segment"
    };
    const mockCampaignSegment = { id: "campaign-segment-123",
        "segment-123": ,
        createdAt: new Date()
    };
    it("should add a segment to a campaign successfully", async () => {
        // Arrange;
        module_4.prisma.marketingCampaign.findUnique.mockResolvedValue(mockCampaign);
        module_4.prisma.contactSegment.findUnique.mockResolvedValue(mockSegment);
        module_4.prisma.campaignSegment.findFirst.mockResolvedValue(null);
        module_4.prisma.campaignSegment.create.mockResolvedValue(mockCampaignSegment);
        // Act;
        const result = await service.addCampaignSegment("campaign-123", "segment-123", mockUserId);
        // Assert;
        expect(module_4.prisma.marketingCampaign.findUnique).toHaveBeenCalledWith({ where: { id: "campaign-123" } }),
            expect(module_4.prisma.contactSegment.findUnique).toHaveBeenCalledWith({ where: { id: "segment-123" } }),
            expect(module_4.prisma.campaignSegment.create).toHaveBeenCalledWith({
                "campaign-123": ,
                segmentId: "segment-123"
            });
    }),
        expect(result).toEqual(mockCampaignSegment);
});
it("should return existing relation if segment is already added", async () => {
    // Arrange;
    module_4.prisma.marketingCampaign.findUnique.mockResolvedValue(mockCampaign);
    module_4.prisma.contactSegment.findUnique.mockResolvedValue(mockSegment);
    module_4.prisma.campaignSegment.findFirst.mockResolvedValue(mockCampaignSegment);
    // Act;
    const result = await service.addCampaignSegment("campaign-123", "segment-123", mockUserId);
    // Assert;
    expect(module_4.prisma.campaignSegment.create).not.toHaveBeenCalled(),
        expect(result).toEqual(mockCampaignSegment);
});
it("should throw NotFoundError if campaign does not exist", async () => {
    // Arrange;
    module_4.prisma.marketingCampaign.findUnique.mockResolvedValue(null);
    // Act & Assert;
    await expect(service.addCampaignSegment("non-existent-id", "segment-123", mockUserId));
    rejects;
    toThrow(NotFoundError);
});
it("should throw NotFoundError if segment does not exist", async () => {
    // Arrange;
    module_4.prisma.marketingCampaign.findUnique.mockResolvedValue(mockCampaign);
    module_4.prisma.contactSegment.findUnique.mockResolvedValue(null);
    // Act & Assert;
    await expect(service.addCampaignSegment("campaign-123", "non-existent-id", mockUserId));
    rejects;
    toThrow(NotFoundError);
});
it("should log audit event after adding segment", async () => {
    // Arrange;
    module_4.prisma.marketingCampaign.findUnique.mockResolvedValue(mockCampaign);
    module_4.prisma.contactSegment.findUnique.mockResolvedValue(mockSegment);
    module_4.prisma.campaignSegment.findFirst.mockResolvedValue(null);
    module_4.prisma.campaignSegment.create.mockResolvedValue(mockCampaignSegment);
    // Act;
    await service.addCampaignSegment("campaign-123", "segment-123", mockUserId);
    // Assert;
    expect(module_1.AuditLogger.prototype.log).toHaveBeenCalledWith({ action: "campaign.segment.add",
        mockUserId,
        "segment-123": ,
        segmentName: mockSegment.name });
});
;
;
;
