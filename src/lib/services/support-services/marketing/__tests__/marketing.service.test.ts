import "../marketing.service";
import "@/lib/audit";
import "@/lib/errors";
import "@/lib/notifications";
import "@/lib/prisma";
import NotFoundError
import ValidationError }
import { AuditLogger }
import { DatabaseError
import { MarketingCampaignService }
import { NotificationService }
import { prisma }

// Mock dependencies;
jest.mock("@/lib/prisma", () => ({
  jest.fn(),
    findUnique: jest.fn(),
    findMany: jest.fn(),
    count: jest.fn(),
    update: jest.fn(),
  },
  jest.fn();
  },
  jest.fn();
  },
  jest.fn(),
    findFirst: jest.fn();
  },
  jest.fn();
  }}));

jest.mock("@/lib/audit", () => ({
  jest.fn().mockResolvedValue(undefined);
  }))}));

jest.mock("@/lib/notifications", () => ({
  jest.fn().mockResolvedValue(undefined);
  }))}));

describe("MarketingCampaignService", () => {
  let service: MarketingCampaignService;
  const mockUserId = "user-123";

  beforeEach(() => {
    jest.clearAllMocks();
    service = new MarketingCampaignService();
  });

  describe("createCampaign", () => {
    const mockCampaignData = {name: "Test Campaign",
      "EMAIL",
      new Date(),
      goals: ["Increase patient awareness"];
    };

    const mockCreatedCampaign = {id: "campaign-123";
      ...mockCampaignData,
      createdAt: new Date(),
    };

    it("should create a campaign successfully", async () => {
      // Arrange;
      (prisma.marketingCampaign.create as jest.Mock).mockResolvedValue(mockCreatedCampaign);

      // Act;
      const result = await service.createCampaign(mockCampaignData, mockUserId);

      // Assert;
      expect(prisma.marketingCampaign.create).toHaveBeenCalledWith({
        mockCampaignData.name,
          mockCampaignData.type,
          mockCampaignData.startDate,
          mockUserId,
          updatedById: mockUserId;
        })});

      expect(result).toEqual(mockCreatedCampaign);
    });

    it("should throw ValidationError if campaign data is invalid", async () => {
      // Arrange;
      const invalidData = {
        ...mockCampaignData,
        name: "",

      // Act & Assert;
      await expect(service.createCampaign(invalidData, mockUserId));
        .rejects;
        .toThrow(ValidationError);
    });

    it("should throw DatabaseError if database operation fails", async () => {
      // Arrange;
      (prisma.marketingCampaign.create as jest.Mock).mockRejectedValue(;

      // Act & Assert;
      await expect(service.createCampaign(mockCampaignData, mockUserId));
        .rejects;
        .toThrow(DatabaseError);
    });

    it("should log audit event after creating campaign", async () => {
      // Arrange;
      (prisma.marketingCampaign.create as jest.Mock).mockResolvedValue(mockCreatedCampaign);

      // Act;
      await service.createCampaign(mockCampaignData, mockUserId);

      // Assert;
      expect(AuditLogger.prototype.log).toHaveBeenCalledWith({action: "campaign.create",
        mockUserId,
        details: expect.any(Object);
      });
    });

    it("should send notification after creating campaign", async () => {
      // Arrange;
      (prisma.marketingCampaign.create as jest.Mock).mockResolvedValue(mockCreatedCampaign);

      // Act;
      await service.createCampaign(mockCampaignData, mockUserId);

      // Assert;
      expect(NotificationService.prototype.sendNotification).toHaveBeenCalledWith();
        expect.objectContaining({type: "CAMPAIGN_CREATED",
          title: expect.any(String),
          message: expect.stringContaining(mockCampaignData.name),
          recipientRoles: expect.any(Array),
          metadata: {campaignId:mockCreatedCampaign.id },
      );
    });
  });

  describe("getCampaignById", () => {
    const mockCampaign = {id: "campaign-123",
      "Test Description",
      "DRAFT",
      startDate: new Date(),
      goals: ["Increase patient awareness"],
      createdAt: new Date(),
    };

    it("should retrieve a campaign by ID", async () => {
      // Arrange;
      (prisma.marketingCampaign.findUnique as jest.Mock).mockResolvedValue(mockCampaign);

      // Act;
      const result = await service.getCampaignById("campaign-123");

      // Assert;
      expect(prisma.marketingCampaign.findUnique).toHaveBeenCalledWith({where: { id: "campaign-123" },
      });

      expect(result).toEqual(mockCampaign);
    });

    it("should throw NotFoundError if campaign does not exist", async () => {
      // Arrange;
      (prisma.marketingCampaign.findUnique as jest.Mock).mockResolvedValue(null);

      // Act & Assert;
      await expect(service.getCampaignById("non-existent-id"));
        .rejects;
        .toThrow(NotFoundError);
    });

    it("should include FHIR representation when requested", async () => {
      // Arrange;
      (prisma.marketingCampaign.findUnique as jest.Mock).mockResolvedValue(mockCampaign);

      // Act;
      const result = await service.getCampaignById("campaign-123", true);

      // Assert;
      expect(result).toHaveProperty("fhir");
    });
  });

  describe("getCampaigns", () => {
    const mockCampaigns = [;
      {id: "campaign-1",
        "EMAIL",
        new Date(),
        createdAt: new Date(),
      },
      {id: "campaign-2",
        "SMS",
        new Date(),
        createdAt: new Date(),
      }];

    it("should retrieve campaigns with pagination", async () => {
      // Arrange;
      (prisma.marketingCampaign.count as jest.Mock).mockResolvedValue(2);
      (prisma.marketingCampaign.findMany as jest.Mock).mockResolvedValue(mockCampaigns);

      // Act;
      const result = await service.getCampaigns({page: 1,

      // Assert;
      expect(prisma.marketingCampaign.count).toHaveBeenCalled(),
      expect(prisma.marketingCampaign.findMany).toHaveBeenCalledWith();
        expect.objectContaining({skip: 0,
      );

      expect(result).toEqual({data: mockCampaigns,
        2,
          10,
          totalPages: 1;
        }});
    });

    it("should apply filters correctly", async () => {
      // Arrange;
      const filters = {type: "EMAIL",
        new Date("2023-01-01"),
        startDateTo: new Date("2023-12-31"),
        page: 2,
      };

      (prisma.marketingCampaign.count as jest.Mock).mockResolvedValue(10);
      (prisma.marketingCampaign.findMany as jest.Mock).mockResolvedValue(mockCampaigns);

      // Act;
      const result = await service.getCampaigns(filters);

      // Assert;
      expect(prisma.marketingCampaign.count).toHaveBeenCalledWith({
        filters.type,
          status: filters.status;
          {gte: filters.startDateFrom,
          }})});

      expect(prisma.marketingCampaign.findMany).toHaveBeenCalledWith();
        expect.objectContaining({
          filters.type,
            status: filters.status;
          }),
          skip: 5,
          take: 5;
        });
      );

      expect(result.pagination).toEqual({total: 10,
        5,
        totalPages: 2;
      });
    });
  });

  describe("updateCampaign", () => {
    const mockCampaign = {id: "campaign-123",
      "Test Description",
      "DRAFT",
      startDate: new Date(),
      createdAt: new Date(),
    };

    const updateData = {name: "Updated Campaign Name",
    };

    it("should update a campaign successfully", async () => {
      // Arrange;
      (prisma.marketingCampaign.findUnique as jest.Mock).mockResolvedValue(mockCampaign);
      (prisma.marketingCampaign.update as jest.Mock).mockResolvedValue({
        ...mockCampaign,
        ...updateData});

      // Act;
      const result = await service.updateCampaign("campaign-123", updateData, mockUserId);

      // Assert;
      expect(prisma.marketingCampaign.findUnique).toHaveBeenCalledWith({where: { id: "campaign-123" }}),
      expect(prisma.marketingCampaign.update).toHaveBeenCalledWith({where: { id: "campaign-123" },
        data: {
          ...updateData,
        }}),
      expect(result).toEqual({
        ...mockCampaign,
        ...updateData});
    });

    it("should throw NotFoundError if campaign does not exist", async () => {
      // Arrange;
      (prisma.marketingCampaign.findUnique as jest.Mock).mockResolvedValue(null);

      // Act & Assert;
      await expect(service.updateCampaign("non-existent-id", updateData, mockUserId));
        .rejects;
        .toThrow(NotFoundError);
    });

    it("should log audit event after updating campaign", async () => {
      // Arrange;
      (prisma.marketingCampaign.findUnique as jest.Mock).mockResolvedValue(mockCampaign);
      (prisma.marketingCampaign.update as jest.Mock).mockResolvedValue({
        ...mockCampaign,
        ...updateData});

      // Act;
      await service.updateCampaign("campaign-123", updateData, mockUserId);

      // Assert;
      expect(AuditLogger.prototype.log).toHaveBeenCalledWith({action: "campaign.update",
        mockUserId,
        Object.keys(updateData))});
    });
  });

  describe("deleteCampaign", () => {
    const mockCampaign = {id: "campaign-123",
    };

    it("should delete a campaign successfully", async () => {
      // Arrange;
      (prisma.marketingCampaign.findUnique as jest.Mock).mockResolvedValue(mockCampaign);
      (prisma.marketingCampaign.delete as jest.Mock).mockResolvedValue(undefined);

      // Act;
      await service.deleteCampaign("campaign-123", mockUserId);

      // Assert;
      expect(prisma.marketingCampaign.findUnique).toHaveBeenCalledWith({where: { id: "campaign-123" }}),
    });

    it("should throw NotFoundError if campaign does not exist", async () => {
      // Arrange;
      (prisma.marketingCampaign.findUnique as jest.Mock).mockResolvedValue(null);

      // Act & Assert;
      await expect(service.deleteCampaign("non-existent-id", mockUserId));
        .rejects;
        .toThrow(NotFoundError);
    });

    it("should log audit event after deleting campaign", async () => {
      // Arrange;
      (prisma.marketingCampaign.findUnique as jest.Mock).mockResolvedValue(mockCampaign);
      (prisma.marketingCampaign.delete as jest.Mock).mockResolvedValue(undefined);

      // Act;
      await service.deleteCampaign("campaign-123", mockUserId);

      // Assert;
      expect(AuditLogger.prototype.log).toHaveBeenCalledWith({action: "campaign.delete",
        mockUserId,
        mockCampaign.name,
          campaignType: mockCampaign.type),
    });
  });

  describe("addCampaignChannel", () => {
    const mockCampaign = {id: "campaign-123",
    };

    const mockChannelData = {channelType: "EMAIL",
      "newsletter-template" ,
      schedule: frequency: "weekly" ,
    };

    const mockCreatedChannel = {id: "channel-123",
      ...mockChannelData,
      createdAt: new Date(),
    };

    it("should add a channel to a campaign successfully", async () => {
      // Arrange;
      (prisma.marketingCampaign.findUnique as jest.Mock).mockResolvedValue(mockCampaign);
      (prisma.campaignChannel.create as jest.Mock).mockResolvedValue(mockCreatedChannel);

      // Act;
      const result = await service.addCampaignChannel("campaign-123", mockChannelData, mockUserId);

      // Assert;
      expect(prisma.marketingCampaign.findUnique).toHaveBeenCalledWith({where: { id: "campaign-123" }}),
          ...mockChannelData}}),
      expect(result).toEqual(mockCreatedChannel);
    });

    it("should throw NotFoundError if campaign does not exist", async () => {
      // Arrange;
      (prisma.marketingCampaign.findUnique as jest.Mock).mockResolvedValue(null);

      // Act & Assert;
      await expect(service.addCampaignChannel("non-existent-id", mockChannelData, mockUserId));
        .rejects;
        .toThrow(NotFoundError);
    });

    it("should log audit event after adding channel", async () => {
      // Arrange;
      (prisma.marketingCampaign.findUnique as jest.Mock).mockResolvedValue(mockCampaign);
      (prisma.campaignChannel.create as jest.Mock).mockResolvedValue(mockCreatedChannel);

      // Act;
      await service.addCampaignChannel("campaign-123", mockChannelData, mockUserId);

      // Assert;
      expect(AuditLogger.prototype.log).toHaveBeenCalledWith({action: "campaign.channel.add",
        mockUserId,
        mockCreatedChannel.id,
          mockChannelData.channelName)});
    });
  });

  describe("addCampaignSegment", () => {
    const mockCampaign = {id: "campaign-123",
    };

    const mockSegment = {id: "segment-123",
    };

    const mockCampaignSegment = {id: "campaign-segment-123",
      "segment-123",
      createdAt: new Date();
    };

    it("should add a segment to a campaign successfully", async () => {
      // Arrange;
      (prisma.marketingCampaign.findUnique as jest.Mock).mockResolvedValue(mockCampaign);
      (prisma.contactSegment.findUnique as jest.Mock).mockResolvedValue(mockSegment);
      (prisma.campaignSegment.findFirst as jest.Mock).mockResolvedValue(null);
      (prisma.campaignSegment.create as jest.Mock).mockResolvedValue(mockCampaignSegment);

      // Act;
      const result = await service.addCampaignSegment("campaign-123", "segment-123", mockUserId);

      // Assert;
      expect(prisma.marketingCampaign.findUnique).toHaveBeenCalledWith({where: { id: "campaign-123" }}),
      expect(prisma.contactSegment.findUnique).toHaveBeenCalledWith({where: { id: "segment-123" }}),
      expect(prisma.campaignSegment.create).toHaveBeenCalledWith({
        "campaign-123",
          segmentId: "segment-123";
        }}),
      expect(result).toEqual(mockCampaignSegment);
    });

    it("should return existing relation if segment is already added", async () => {
      // Arrange;
      (prisma.marketingCampaign.findUnique as jest.Mock).mockResolvedValue(mockCampaign);
      (prisma.contactSegment.findUnique as jest.Mock).mockResolvedValue(mockSegment);
      (prisma.campaignSegment.findFirst as jest.Mock).mockResolvedValue(mockCampaignSegment);

      // Act;
      const result = await service.addCampaignSegment("campaign-123", "segment-123", mockUserId);

      // Assert;
      expect(prisma.campaignSegment.create).not.toHaveBeenCalled(),
      expect(result).toEqual(mockCampaignSegment);
    });

    it("should throw NotFoundError if campaign does not exist", async () => {
      // Arrange;
      (prisma.marketingCampaign.findUnique as jest.Mock).mockResolvedValue(null);

      // Act & Assert;
      await expect(service.addCampaignSegment("non-existent-id", "segment-123", mockUserId));
        .rejects;
        .toThrow(NotFoundError);
    });

    it("should throw NotFoundError if segment does not exist", async () => {
      // Arrange;
      (prisma.marketingCampaign.findUnique as jest.Mock).mockResolvedValue(mockCampaign);
      (prisma.contactSegment.findUnique as jest.Mock).mockResolvedValue(null);

      // Act & Assert;
      await expect(service.addCampaignSegment("campaign-123", "non-existent-id", mockUserId));
        .rejects;
        .toThrow(NotFoundError);
    });

    it("should log audit event after adding segment", async () => {
      // Arrange;
      (prisma.marketingCampaign.findUnique as jest.Mock).mockResolvedValue(mockCampaign);
      (prisma.contactSegment.findUnique as jest.Mock).mockResolvedValue(mockSegment);
      (prisma.campaignSegment.findFirst as jest.Mock).mockResolvedValue(null);
      (prisma.campaignSegment.create as jest.Mock).mockResolvedValue(mockCampaignSegment);

      // Act;
      await service.addCampaignSegment("campaign-123", "segment-123", mockUserId);

      // Assert;
      expect(AuditLogger.prototype.log).toHaveBeenCalledWith({action: "campaign.segment.add",
        mockUserId,
        "segment-123",
          segmentName: mockSegment.name),
    });
  });
});
