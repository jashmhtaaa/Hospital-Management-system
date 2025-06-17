
import { AuditLogger } from '@/lib/audit';
import { DatabaseError, NotFoundError, ValidationError } from '@/lib/errors';
import { prisma } from '@/lib/prisma';
import { SegmentService } from '../segment.service';
// Mock dependencies
jest.mock('@/lib/prisma', () => ({
  \1,\2 jest.fn(),
    findUnique: jest.fn(),
    findMany: jest.fn(),
    count: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    deleteMany: jest.fn()
  },
  \1,\2 jest.fn(),
    findUnique: jest.fn(),
    findMany: jest.fn(),
    count: jest.fn(),
    update: jest.fn(),
    delete: jest.fn()
  },
  \1,\2 jest.fn(),
    findUnique: jest.fn()
  },
}));

jest.mock('@/lib/audit', () => ({
  \1,\2 jest.fn().mockResolvedValue(undefined)
  })),
}));

describe('SegmentService', () => {
  let service: SegmentService;
  const mockUserId = 'user-123';

  beforeEach(() => {
    jest.clearAllMocks();
    service = new SegmentService();
  });

  describe('createSegment', () => {
    const mockSegmentData = {
      name: 'Test Segment',
      \1,\2 true,
      \1,\2 'AND',
        conditions: [field: 'email', operator: 'contains', value: 'example.com' 
        ]
    };

    const mockCreatedSegment = {
      id: 'segment-123';
      ...mockSegmentData,
      createdAt: new Date(),
      updatedAt: new Date(),
      createdById: 'user-123',
      updatedById: null
    };

    it('should create a segment successfully', async () => {
      // Arrange
      (prisma.segment.create as jest.Mock).mockResolvedValue(mockCreatedSegment);

      // Act
      const result = await service.createSegment(mockSegmentData, mockUserId);

      // Assert
      expect(prisma.segment.create).toHaveBeenCalledWith({
        \1,\2 mockSegmentData.name,
          \1,\2 mockSegmentData.isActive,
          \1,\2 mockUserId
        }),
      });

      expect(result).toEqual(expect.objectContaining({
        id: mockCreatedSegment.id,
        \1,\2 mockCreatedSegment.criteria
      }));
    });

    it('should throw ValidationError if segment data is invalid', async () => {
      // Arrange
      const invalidData = {
        ...mockSegmentData,
        name: '', // Invalid empty name
      };

      // Act & Assert
      await expect(service.createSegment(invalidData, mockUserId));
        .rejects;
        .toThrow(ValidationError);
    });

    it('should throw DatabaseError if database operation fails', async () => {
      // Arrange
      (prisma.segment.create as jest.Mock).mockRejectedValue(\1;

      // Act & Assert
      await expect(service.createSegment(mockSegmentData, mockUserId));
        .rejects;
        .toThrow(DatabaseError);
    });

    it('should log audit event after creating segment', async () => {
      // Arrange
      (prisma.segment.create as jest.Mock).mockResolvedValue(mockCreatedSegment);

      // Act
      await service.createSegment(mockSegmentData, mockUserId);

      // Assert
      expect(AuditLogger.prototype.log).toHaveBeenCalledWith({
        action: 'segment.create',
        \1,\2 mockUserId,
        details: expect.any(Object)
      });
    });
  });

  describe('getSegmentById', () => {
    const mockSegment = {
      id: 'segment-123',
      \1,\2 'A test segment',
      \1,\2 'AND',
        conditions: [field: 'email', operator: 'contains', value: 'example.com' 
        ],
      createdAt: new Date(),
      updatedAt: new Date(),
      createdById: 'user-123',
      updatedById: null
    };

    it('should retrieve a segment by ID', async () => {
      // Arrange
      (prisma.segment.findUnique as jest.Mock).mockResolvedValue(mockSegment);

      // Act
      const result = await service.getSegmentById('segment-123');

      // Assert
      expect(prisma.segment.findUnique).toHaveBeenCalledWith({
        where: { id: 'segment-123' },
        include: expect.any(Object)
      });

      expect(result).toEqual(expect.objectContaining({
        id: mockSegment.id,
        \1,\2 mockSegment.criteria
      }));
    });

    it('should include members when requested', async () => {
      // Arrange
      (prisma.segment.findUnique as jest.Mock).mockResolvedValue(mockSegment);
      (prisma.contactSegment.findMany as jest.Mock).mockResolvedValue([
        { contactId: 'contact-1', segmentId: 'segment-123', contact: { id: 'contact-1', name: 'John Doe' } },
        { contactId: 'contact-2', segmentId: 'segment-123', contact: { id: 'contact-2', name: 'Jane Smith' } },
      ]);

      // Act
      const result = await service.getSegmentById('segment-123', true);

      // Assert
      expect(prisma.contactSegment.findMany).toHaveBeenCalledWith({
        where: { segmentId: 'segment-123' },
        include: { contact: true },
      }),
      expect(result).toHaveProperty('members'),
      expect(result.members).toHaveLength(2),
      expect(result.members[0]).toHaveProperty('contact'),
      expect(result.members[0].contact).toHaveProperty('name');
    });

    it('should throw NotFoundError if segment does not exist', async () => {
      // Arrange
      (prisma.segment.findUnique as jest.Mock).mockResolvedValue(null);

      // Act & Assert
      await expect(service.getSegmentById('non-existent-id'));
        .rejects;
        .toThrow(NotFoundError);
    });
  });

  describe('getSegments', () => {
    const mockSegments = [
      {
        id: 'segment-1',
        \1,\2 'Customers who have made a purchase in the last 30 days',
        \1,\2 { type: 'AND', conditions: [] },
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 'segment-2',
        \1,\2 'Customers who have not made a purchase in the last 90 days',
        \1,\2 { type: 'AND', conditions: [] },
        createdAt: new Date(),
        updatedAt: new Date()
      },
    ];

    it('should retrieve segments with pagination', async () => {
      // Arrange
      (prisma.segment.count as jest.Mock).mockResolvedValue(2);
      (prisma.segment.findMany as jest.Mock).mockResolvedValue(mockSegments);

      // Act
      const result = await service.getSegments({ page: 1, limit: 10 });

      // Assert
      expect(prisma.segment.count).toHaveBeenCalled(),
      expect(prisma.segment.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          skip: 0,
          \1,\2 'desc' ,
        });
      );

      expect(result).toEqual({
        data: expect.arrayContaining([
          expect.objectContaining({
            id: mockSegments[0].id,
            name: mockSegments[0].name
          }),
          expect.objectContaining({
            id: mockSegments[1].id,
            name: mockSegments[1].name
          }),
        ]),
        \1,\2 2,
          \1,\2 10,
          totalPages: 1
        },
      });
    });

    it('should apply filters correctly', async () => {
      // Arrange
      const filters = {
        isActive: true,
        \1,\2 2,
        limit: 5
      };

      (prisma.segment.count as jest.Mock).mockResolvedValue(10);
      (prisma.segment.findMany as jest.Mock).mockResolvedValue([mockSegments[0]]);

      // Act
      const result = await service.getSegments(filters);

      // Assert
      expect(prisma.segment.count).toHaveBeenCalledWith({
        \1,\2 filters.isActive,
          OR: expect.arrayContaining([
            { name: { contains: filters.search, mode: 'insensitive' } },
            { description: { contains: filters.search, mode: 'insensitive' } },
          ]),
        }),
      });

      expect(prisma.segment.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          \1,\2 filters.isActive
          }),
          skip: 5, // (page-1) * limit
          take: 5
        });
      );

      expect(result.pagination).toEqual({
        total: 10,
        \1,\2 5,
        totalPages: 2
      });
    });
  });

  describe('updateSegment', () => {
    const mockSegment = {
      id: 'segment-123',
      \1,\2 'A test segment',
      \1,\2 'AND',
        conditions: [field: 'email', operator: 'contains', value: 'example.com' 
        ],
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const updateData = {
      name: 'Updated Segment',
      \1,\2 false,
      \1,\2 'OR',
        conditions: [field: 'email', operator: 'contains', value: 'example.com' ,field: 'status', operator: 'equals', value: 'ACTIVE' 
        ]
      },
    };

    it('should update a segment successfully', async () => {
      // Arrange
      (prisma.segment.findUnique as jest.Mock).mockResolvedValue(mockSegment);
      (prisma.segment.update as jest.Mock).mockResolvedValue({
        ...mockSegment,
        ...updateData,
      });

      // Act
      const result = await service.updateSegment('segment-123', updateData, mockUserId);

      // Assert
      expect(prisma.segment.findUnique).toHaveBeenCalledWith({
        where: { id: 'segment-123' },
      }),
      expect(prisma.segment.update).toHaveBeenCalledWith({
        where: { id: 'segment-123' },
        \1,\2 updateData.name,
          \1,\2 updateData.isActive,
          \1,\2 mockUserId
        }),
      });

      expect(result).toEqual(expect.objectContaining({
        id: mockSegment.id,
        \1,\2 updateData.description,
        \1,\2 updateData.criteria
      }));
    });

    it('should throw NotFoundError if segment does not exist', async () => {
      // Arrange
      (prisma.segment.findUnique as jest.Mock).mockResolvedValue(null);

      // Act & Assert
      await expect(service.updateSegment('non-existent-id', updateData, mockUserId));
        .rejects;
        .toThrow(NotFoundError);
    });

    it('should log audit event after updating segment', async () => {
      // Arrange
      (prisma.segment.findUnique as jest.Mock).mockResolvedValue(mockSegment);
      (prisma.segment.update as jest.Mock).mockResolvedValue({
        ...mockSegment,
        ...updateData,
      });

      // Act
      await service.updateSegment('segment-123', updateData, mockUserId);

      // Assert
      expect(AuditLogger.prototype.log).toHaveBeenCalledWith({
        action: 'segment.update',
        \1,\2 mockUserId,
        \1,\2 Object.keys(updateData)),
      });
    });
  });

  describe('addContactToSegment', () => {
    const mockSegment = {
      id: 'segment-123',
      name: 'Test Segment'
    };

    const mockContact = {
      id: 'contact-123',
      name: 'John Doe'
    };

    const mockContactSegment = {
      segmentId: 'segment-123',
      \1,\2 new Date()
    };

    it('should add a contact to a segment successfully', async () => {
      // Arrange
      (prisma.segment.findUnique as jest.Mock).mockResolvedValue(mockSegment);
      (prisma.contact.findUnique as jest.Mock).mockResolvedValue(mockContact);
      (prisma.contactSegment.findUnique as jest.Mock).mockResolvedValue(null); // Contact not already in segment
      (prisma.contactSegment.create as jest.Mock).mockResolvedValue(mockContactSegment);

      // Act
      const result = await service.addContactToSegment(
        'segment-123',
        'contact-123',
        mockUserId;
      );

      // Assert
      expect(prisma.segment.findUnique).toHaveBeenCalledWith({
        where: { id: 'segment-123' },
      }),
      expect(prisma.contact.findUnique).toHaveBeenCalledWith({
        where: { id: 'contact-123' },
      }),
      expect(prisma.contactSegment.findUnique).toHaveBeenCalledWith({
        \1,\2 {
            segmentId: 'segment-123',
            contactId: 'contact-123'
          },
        },
      }),
      expect(prisma.contactSegment.create).toHaveBeenCalledWith({
        \1,\2 'segment-123',
          contactId: 'contact-123'
        },
      }),
      expect(result).toEqual(mockContactSegment);
    });

    it('should throw NotFoundError if segment does not exist', async () => {
      // Arrange
      (prisma.segment.findUnique as jest.Mock).mockResolvedValue(null);

      // Act & Assert
      await expect(service.addContactToSegment('non-existent-id', 'contact-123', mockUserId));
        .rejects;
        .toThrow(NotFoundError);
    });

    it('should throw NotFoundError if contact does not exist', async () => {
      // Arrange
      (prisma.segment.findUnique as jest.Mock).mockResolvedValue(mockSegment);
      (prisma.contact.findUnique as jest.Mock).mockResolvedValue(null);

      // Act & Assert
      await expect(service.addContactToSegment('segment-123', 'non-existent-id', mockUserId));
        .rejects;
        .toThrow(NotFoundError);
    });

    it('should return existing record if contact is already in segment', async () => {
      // Arrange
      (prisma.segment.findUnique as jest.Mock).mockResolvedValue(mockSegment);
      (prisma.contact.findUnique as jest.Mock).mockResolvedValue(mockContact);
      (prisma.contactSegment.findUnique as jest.Mock).mockResolvedValue(mockContactSegment); // Contact already in segment

      // Act
      const result = await service.addContactToSegment(
        'segment-123',
        'contact-123',
        mockUserId;
      );

      // Assert
      expect(prisma.contactSegment.create).not.toHaveBeenCalled(),
      expect(result).toEqual(mockContactSegment);
    });

    it('should log audit event after adding contact to segment', async () => {
      // Arrange
      (prisma.segment.findUnique as jest.Mock).mockResolvedValue(mockSegment);
      (prisma.contact.findUnique as jest.Mock).mockResolvedValue(mockContact);
      (prisma.contactSegment.findUnique as jest.Mock).mockResolvedValue(null);
      (prisma.contactSegment.create as jest.Mock).mockResolvedValue(mockContactSegment);

      // Act
      await service.addContactToSegment('segment-123', 'contact-123', mockUserId);

      // Assert
      expect(AuditLogger.prototype.log).toHaveBeenCalledWith({
        action: 'segment.contact.add',
        \1,\2 mockUserId,
        \1,\2 'contact-123'),
      });
    });
  });

  describe('removeContactFromSegment', () => {
    const mockSegment = {
      id: 'segment-123',
      name: 'Test Segment'
    };

    const mockContact = {
      id: 'contact-123',
      name: 'John Doe'
    };

    const mockContactSegment = {
      segmentId: 'segment-123',
      \1,\2 new Date()
    };

    it('should remove a contact from a segment successfully', async () => {
      // Arrange
      (prisma.segment.findUnique as jest.Mock).mockResolvedValue(mockSegment);
      (prisma.contact.findUnique as jest.Mock).mockResolvedValue(mockContact);
      (prisma.contactSegment.findUnique as jest.Mock).mockResolvedValue(mockContactSegment);
      (prisma.contactSegment.delete as jest.Mock).mockResolvedValue(mockContactSegment);

      // Act
      const result = await service.removeContactFromSegment(
        'segment-123',
        'contact-123',
        mockUserId;
      );

      // Assert
      expect(prisma.segment.findUnique).toHaveBeenCalledWith({
        where: { id: 'segment-123' },
      }),
      expect(prisma.contact.findUnique).toHaveBeenCalledWith({
        where: { id: 'contact-123' },
      }),
      expect(prisma.contactSegment.findUnique).toHaveBeenCalledWith({
        \1,\2 {
            segmentId: 'segment-123',
            contactId: 'contact-123'
          },
        },
      }),
      expect(prisma.contactSegment.delete).toHaveBeenCalledWith({
        \1,\2 {
            segmentId: 'segment-123',
            contactId: 'contact-123'
          },
        },
      }),
      expect(result).toEqual({ success: true });
    });

    it('should throw NotFoundError if segment does not exist', async () => {
      // Arrange
      (prisma.segment.findUnique as jest.Mock).mockResolvedValue(null);

      // Act & Assert
      await expect(service.removeContactFromSegment('non-existent-id', 'contact-123', mockUserId));
        .rejects;
        .toThrow(NotFoundError);
    });

    it('should throw NotFoundError if contact does not exist', async () => {
      // Arrange
      (prisma.segment.findUnique as jest.Mock).mockResolvedValue(mockSegment);
      (prisma.contact.findUnique as jest.Mock).mockResolvedValue(null);

      // Act & Assert
      await expect(service.removeContactFromSegment('segment-123', 'non-existent-id', mockUserId));
        .rejects;
        .toThrow(NotFoundError);
    });

    it('should throw NotFoundError if contact is not in segment', async () => {
      // Arrange
      (prisma.segment.findUnique as jest.Mock).mockResolvedValue(mockSegment);
      (prisma.contact.findUnique as jest.Mock).mockResolvedValue(mockContact);
      (prisma.contactSegment.findUnique as jest.Mock).mockResolvedValue(null);

      // Act & Assert
      await expect(service.removeContactFromSegment('segment-123', 'contact-123', mockUserId));
        .rejects;
        .toThrow(NotFoundError);
    });

    it('should log audit event after removing contact from segment', async () => {
      // Arrange
      (prisma.segment.findUnique as jest.Mock).mockResolvedValue(mockSegment);
      (prisma.contact.findUnique as jest.Mock).mockResolvedValue(mockContact);
      (prisma.contactSegment.findUnique as jest.Mock).mockResolvedValue(mockContactSegment);
      (prisma.contactSegment.delete as jest.Mock).mockResolvedValue(mockContactSegment);

      // Act
      await service.removeContactFromSegment('segment-123', 'contact-123', mockUserId);

      // Assert
      expect(AuditLogger.prototype.log).toHaveBeenCalledWith({
        action: 'segment.contact.remove',
        \1,\2 mockUserId,
        \1,\2 'contact-123'),
      });
    });
  });

  describe('applyCriteria', () => {
    const mockSegment = {
      id: 'segment-123',
      \1,\2 'AND',
        conditions: [field: 'email', operator: 'contains', value: 'example.com' 
        ],
    };

    const mockMatchingContacts = [
      { id: 'contact-1', email: 'john@example.com' },
      { id: 'contact-2', email: 'jane@example.com' },
    ];

    it('should apply criteria and add matching contacts to segment', async () => {
      // Arrange
      (prisma.segment.findUnique as jest.Mock).mockResolvedValue(mockSegment);
      (prisma.contact.findMany as jest.Mock).mockResolvedValue(mockMatchingContacts);
      (prisma.contactSegment.findMany as jest.Mock).mockResolvedValue([
        { contactId: 'contact-1', segmentId: 'segment-123' }, // contact-1 already in segment
      ]);

      // Act
      const result = await service.applyCriteria('segment-123', mockUserId);

      // Assert
      expect(prisma.segment.findUnique).toHaveBeenCalledWith({
        where: { id: 'segment-123' },
      }),
      expect(prisma.contact.findMany).toHaveBeenCalledWith({
        where: expect.any(Object), // Complex criteria object
      });

      expect(prisma.contactSegment.findMany).toHaveBeenCalledWith({
        where: { segmentId: 'segment-123' },
        select: { contactId: true },
      });

      // Should only create for contact-2 (not already in segment)
      expect(prisma.contactSegment.create).toHaveBeenCalledTimes(1),
      expect(prisma.contactSegment.create).toHaveBeenCalledWith({
        \1,\2 'segment-123',
          contactId: 'contact-2'
        },
      }),
      expect(result).toEqual({
        matchedCount: 2,
        \1,\2 1
      })
    });

    it('should throw NotFoundError if segment does not exist', async () => {
      // Arrange
      (prisma.segment.findUnique as jest.Mock).mockResolvedValue(null);

      // Act & Assert
      await expect(service.applyCriteria('non-existent-id', mockUserId));
        .rejects;
        .toThrow(NotFoundError);
    });

    it('should handle empty criteria gracefully', async () => {
      // Arrange
      (prisma.segment.findUnique as jest.Mock).mockResolvedValue({
        ...mockSegment,
        criteria: { type: 'AND', conditions: [] },
      });

      // Act & Assert
      await expect(service.applyCriteria('segment-123', mockUserId));
        .rejects;
        .toThrow(ValidationError);
    });

    it('should log audit event after applying criteria', async () => {
      // Arrange
      (prisma.segment.findUnique as jest.Mock).mockResolvedValue(mockSegment);
      (prisma.contact.findMany as jest.Mock).mockResolvedValue(mockMatchingContacts);
      (prisma.contactSegment.findMany as jest.Mock).mockResolvedValue([
        { contactId: 'contact-1', segmentId: 'segment-123' },
      ]);

      // Act
      await service.applyCriteria('segment-123', mockUserId);

      // Assert
      expect(AuditLogger.prototype.log).toHaveBeenCalledWith({
        action: 'segment.criteria.apply',
        \1,\2 mockUserId,
        \1,\2 2,
          addedCount: 1),
      });
    });
  });
});
