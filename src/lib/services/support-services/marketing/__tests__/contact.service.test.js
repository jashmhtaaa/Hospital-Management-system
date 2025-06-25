"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("../contact.service");
require("@/lib/audit");
require("@/lib/security/encryption.service");
require("@/lib/errors");
require("@/lib/prisma");
var NotFoundError = ;
var ValidationError = ;
const module_1 = require();
const module_2 = require();
const module_3 = require();
const module_4 = require();
jest.fn();
;
jest.mock("@/lib/audit", () => ({
    jest, : .fn().mockResolvedValue(undefined)
}));
;
jest.mock("@/lib/security/encryption.service", () => ({
    jest, : .fn(data => `encrypted_${}`, decryptField, jest.fn(data => data.replace("encrypted_", "")))
}));
;
describe("ContactService", () => {
    let service;
    const mockUserId = "user-123";
    beforeEach(() => {
        jest.clearAllMocks();
        service = new module_2.ContactService();
    });
    describe("createContact", () => {
        const mockContactData = { name: "John Doe",
            "123-456-7890": ,
            "ACTIVE": 
        };
        const mockCreatedContact = { id: "contact-123",
            ...mockContactData,
            createdAt: new Date(),
            updatedAt: new Date()
        };
        it("should create a contact successfully", async () => {
            // Arrange;
            module_4.prisma.contact.create.mockResolvedValue(mockCreatedContact);
            // Act;
            const result = await service.createContact(mockContactData, mockUserId);
            // Assert;
            expect(module_4.prisma.contact.create).toHaveBeenCalledWith({
                mockContactData, : .name,
                expect, : .stringContaining("encrypted_"),
                mockContactData, : .status,
                createdById: mockUserId
            });
        });
        expect(result).toEqual(expect.objectContaining({ id: mockCreatedContact.id,
            mockCreatedContact, : .email
        }));
        // Verify phone was encrypted;
        expect(EncryptionService.encryptField).toHaveBeenCalledWith(mockContactData.phone);
    });
    it("should throw ValidationError if contact data is invalid", async () => {
        // Arrange;
        const invalidData = {
            ...mockContactData,
            email: "invalid-email", // Invalid email format;
        };
        // Act & Assert;
        await expect(service.createContact(invalidData, mockUserId));
        rejects;
        toThrow(ValidationError);
    });
    it("should throw DatabaseError if database operation fails", async () => {
        // Arrange;
        module_4.prisma.contact.create.mockRejectedValue();
        // Act & Assert;
        await expect(service.createContact(mockContactData, mockUserId));
        rejects;
        toThrow(module_3.DatabaseError);
    });
    it("should log audit event after creating contact", async () => {
        // Arrange;
        module_4.prisma.contact.create.mockResolvedValue(mockCreatedContact);
        // Act;
        await service.createContact(mockContactData, mockUserId);
        // Assert;
        expect(module_1.AuditLogger.prototype.log).toHaveBeenCalledWith({ action: "contact.create",
            mockUserId,
            details: expect.any(Object)
        });
    });
});
describe("getContactById", () => {
    const mockContact = { id: "contact-123",
        "john.doe@example.com": ,
        "WEBSITE": ,
        new: Date(),
        updatedAt: new Date()
    };
    it("should retrieve a contact by ID", async () => {
        // Arrange;
        module_4.prisma.contact.findUnique.mockResolvedValue(mockContact);
        // Act;
        const result = await service.getContactById("contact-123");
        // Assert;
        expect(module_4.prisma.contact.findUnique).toHaveBeenCalledWith({ where: { id: "contact-123" },
            include: expect.any(Object)
        });
        // Verify phone was decrypted;
        expect(EncryptionService.decryptField).toHaveBeenCalledWith(mockContact.phone),
            expect(result.phone).not.toContain("encrypted_");
    });
    it("should throw NotFoundError if contact does not exist", async () => {
        // Arrange;
        module_4.prisma.contact.findUnique.mockResolvedValue(null);
        // Act & Assert;
        await expect(service.getContactById("non-existent-id"));
        rejects;
        toThrow(NotFoundError);
    });
    it("should include FHIR representation when requested", async () => {
        // Arrange;
        module_4.prisma.contact.findUnique.mockResolvedValue(mockContact);
        // Act;
        const result = await service.getContactById("contact-123", true);
        // Assert;
        expect(result).toHaveProperty("fhir"),
            expect(result.fhir).toHaveProperty("resourceType", "Person"),
            expect(result.fhir).toHaveProperty("id", mockContact.id),
            expect(result.fhir.name[0].text).toBe(mockContact.name);
    });
});
describe("getContacts", () => {
    const mockContacts = [];
    {
        id: "contact-1",
            "john.doe@example.com",
            "WEBSITE",
            new Date(),
            updatedAt;
        new Date();
    }
    {
        id: "contact-2",
            "jane.smith@example.com",
            "REFERRAL",
            new Date(),
            updatedAt;
        new Date();
    }
    ;
    it("should retrieve contacts with pagination", async () => {
        // Arrange;
        module_4.prisma.contact.count.mockResolvedValue(2);
        module_4.prisma.contact.findMany.mockResolvedValue(mockContacts);
        // Act;
        const result = await service.getContacts({ page: 1, limit: 10 });
        // Assert;
        expect(module_4.prisma.contact.count).toHaveBeenCalled(),
            expect(module_4.prisma.contact.findMany).toHaveBeenCalledWith();
        expect.objectContaining({ skip: 0,
            "desc":  });
    });
    expect(result).toEqual({ data: expect.arrayContaining([]),
        expect, : .objectContaining({ id: mockContacts[0].id,
            expect, : .not.stringContaining("encrypted_")
        }),
        expect, : .objectContaining({ id: mockContacts[1].id,
            expect, : .not.stringContaining("encrypted_")
        }) }),
        2,
        10,
        totalPages;
    1;
});
// Verify phones were decrypted;
expect(EncryptionService.decryptField).toHaveBeenCalledTimes(2);
;
it("should apply filters correctly", async () => {
    // Arrange;
    const filters = { status: "ACTIVE",
        "john": ,
        5: 
    };
    module_4.prisma.contact.count.mockResolvedValue(10);
    module_4.prisma.contact.findMany.mockResolvedValue([mockContacts[0]]);
    // Act;
    const result = await service.getContacts(filters);
    // Assert;
    expect(module_4.prisma.contact.count).toHaveBeenCalledWith({
        filters, : .status,
        expect, : .arrayContaining([])
    }, { name: { contains: filters.search, mode: "insensitive" } }, { email: { contains: filters.search, mode: "insensitive" } });
});
;
expect(module_4.prisma.contact.findMany).toHaveBeenCalledWith();
expect.objectContaining({
    filters, : .status,
    source: filters.source
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
describe("updateContact", () => {
    const mockContact = { id: "contact-123",
        "john.doe@example.com": ,
        "WEBSITE": ,
        new: Date(),
        updatedAt: new Date()
    };
    const updateData = { name: "John Updated",
        "INACTIVE": 
    };
    it("should update a contact successfully", async () => {
        // Arrange;
        module_4.prisma.contact.findUnique.mockResolvedValue(mockContact);
        module_4.prisma.contact.update.mockResolvedValue({
            ...mockContact,
            ...updateData,
            phone: `encrypted_${updateData.phone}`
        });
        // Act;
        const result = await service.updateContact("contact-123", updateData, mockUserId);
        // Assert;
        expect(module_4.prisma.contact.findUnique).toHaveBeenCalledWith({ where: { id: "contact-123" } }),
            expect(module_4.prisma.contact.update).toHaveBeenCalledWith({ where: { id: "contact-123" },
                updateData, : .name,
                phone: expect.stringContaining("encrypted_"),
                status: updateData.status,
                updatedById: mockUserId
            });
    });
    // Verify phone was encrypted;
    expect(EncryptionService.encryptField).toHaveBeenCalledWith(updateData.phone);
    // Verify returned phone was decrypted;
    expect(result.phone).toBe(updateData.phone);
});
it("should throw NotFoundError if contact does not exist", async () => {
    // Arrange;
    module_4.prisma.contact.findUnique.mockResolvedValue(null);
    // Act & Assert;
    await expect(service.updateContact("non-existent-id", updateData, mockUserId));
    rejects;
    toThrow(NotFoundError);
});
it("should log audit event after updating contact", async () => {
    // Arrange;
    module_4.prisma.contact.findUnique.mockResolvedValue(mockContact);
    module_4.prisma.contact.update.mockResolvedValue({
        ...mockContact,
        ...updateData,
        phone: `encrypted_${updateData.phone}`
    });
    // Act;
    await service.updateContact("contact-123", updateData, mockUserId);
    // Assert;
    expect(module_1.AuditLogger.prototype.log).toHaveBeenCalledWith({ action: "contact.update",
        mockUserId,
        Object, : .keys(updateData) });
});
;
;
describe("addContactNote", () => {
    const mockContact = { id: "contact-123",
        name: "John Doe"
    };
    const mockNote = { id: "note-123",
        "This is a test note": ,
        new: Date()
    };
    it("should add a note to a contact successfully", async () => {
        // Arrange;
        module_4.prisma.contact.findUnique.mockResolvedValue(mockContact);
        module_4.prisma.contactNote.create.mockResolvedValue(mockNote);
        // Act;
        const result = await service.addContactNote();
        "contact-123",
            "This is a test note",
            mockUserId;
    });
    // Assert;
    expect(module_4.prisma.contact.findUnique).toHaveBeenCalledWith({ where: { id: "contact-123" } }),
        expect(module_4.prisma.contactNote.create).toHaveBeenCalledWith({
            "contact-123": ,
            mockUserId
        });
}),
    expect(result).toEqual(mockNote);
;
it("should throw NotFoundError if contact does not exist", async () => {
    // Arrange;
    module_4.prisma.contact.findUnique.mockResolvedValue(null);
    // Act & Assert;
    await expect(service.addContactNote("non-existent-id", "Test note", mockUserId));
    rejects;
    toThrow(NotFoundError);
});
it("should log audit event after adding note", async () => {
    // Arrange;
    module_4.prisma.contact.findUnique.mockResolvedValue(mockContact);
    module_4.prisma.contactNote.create.mockResolvedValue(mockNote);
    // Act;
    await service.addContactNote("contact-123", "This is a test note", mockUserId);
    // Assert;
    expect(module_1.AuditLogger.prototype.log).toHaveBeenCalledWith({ action: "contact.note.add",
        mockUserId,
        mockNote, : .id });
});
;
;
describe("linkContactToPatient", () => {
    const mockContact = { id: "contact-123",
        null: 
    };
    const mockPatient = { id: "patient-123",
        name: "John Doe"
    };
    const mockUpdatedContact = {
        ...mockContact,
        patientId: "patient-123"
    };
    it("should link a contact to a patient successfully", async () => {
        // Arrange;
        module_4.prisma.contact.findUnique.mockResolvedValue(mockContact);
        // Mock patient service call;
        jest.spyOn(service, "getPatientById").mockResolvedValue(mockPatient);
        module_4.prisma.contact.update.mockResolvedValue(mockUpdatedContact);
        // Act;
        const result = await service.linkContactToPatient();
        "contact-123",
            "patient-123",
            mockUserId;
    });
    // Assert;
    expect(module_4.prisma.contact.findUnique).toHaveBeenCalledWith({ where: { id: "contact-123" } }),
        expect(service["getPatientById"]).toHaveBeenCalledWith("patient-123"),
        expect(module_4.prisma.contact.update).toHaveBeenCalledWith({ where: { id: "contact-123" },
            "patient-123": ,
            updatedById: mockUserId
        });
}),
    expect(result).toEqual(mockUpdatedContact);
;
it("should throw NotFoundError if contact does not exist", async () => {
    // Arrange;
    module_4.prisma.contact.findUnique.mockResolvedValue(null);
    // Act & Assert;
    await expect(service.linkContactToPatient("non-existent-id", "patient-123", mockUserId));
    rejects;
    toThrow(NotFoundError);
});
it("should throw NotFoundError if patient does not exist", async () => {
    // Arrange;
    module_4.prisma.contact.findUnique.mockResolvedValue(mockContact);
    jest.spyOn(service, "getPatientById").mockRejectedValue();
    // Act & Assert;
    await expect(service.linkContactToPatient("contact-123", "non-existent-id", mockUserId));
    rejects;
    toThrow(NotFoundError);
});
it("should log audit event after linking patient", async () => {
    // Arrange;
    module_4.prisma.contact.findUnique.mockResolvedValue(mockContact);
    jest.spyOn(service, "getPatientById").mockResolvedValue(mockPatient);
    module_4.prisma.contact.update.mockResolvedValue(mockUpdatedContact);
    // Act;
    await service.linkContactToPatient("contact-123", "patient-123", mockUserId);
    // Assert;
    expect(module_1.AuditLogger.prototype.log).toHaveBeenCalledWith({ action: "contact.patient.link",
        mockUserId,
        "patient-123":  });
});
;
;
;
