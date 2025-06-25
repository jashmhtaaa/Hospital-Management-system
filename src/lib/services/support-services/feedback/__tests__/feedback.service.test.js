"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("../feedback.service");
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
    findMany;
vi.fn();
vi.fn(),
    findMany;
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
describe("FeedbackService", () => {
    let feedbackService;
    beforeEach(() => {
        feedbackService = new FeedbackService();
        vi.clearAllMocks();
    });
    (0, module_1.afterEach)(() => {
        vi.resetAllMocks();
    });
    describe("getFeedbacks", () => {
        it("should return feedbacks with pagination", async () => {
            // Mock data;
            const mockFeedbacks = [];
            {
                id: "1",
                    "dept1",
                    4,
                    "NEW",
                    createdAt;
                new Date(),
                    updatedAt;
                new Date();
            }
            {
                id: "2",
                    "dept2",
                    5,
                    "REVIEWED",
                    createdAt;
                new Date(),
                    updatedAt;
                new Date();
                ;
                // Mock Prisma response;
                module_2.prisma.feedback.findMany.mockResolvedValue(mockFeedbacks);
                module_2.prisma.feedback.count.mockResolvedValue(2);
                // Call the service method;
                const result = await feedbackService.getFeedbacks({ page: 1,
                    limit: 10
                });
                // Verify Prisma was called with correct arguments;
                expect(module_2.prisma.feedback.findMany).toHaveBeenCalledWith();
                expect.objectContaining({ skip: 0,
                    "desc": 
                });
            }
        });
        // Verify result;
        expect(result).toEqual({ data: mockFeedbacks,
            1: ,
            2: ,
            totalPages: 1
        });
    });
    it("should apply filters correctly", async () => {
        // Mock data;
        const mockFeedbacks = [];
        {
            id: "1",
                "dept1",
                4,
                "NEW",
                createdAt;
            new Date(),
                updatedAt;
            new Date();
            ;
            // Mock Prisma response;
            module_2.prisma.feedback.findMany.mockResolvedValue(mockFeedbacks);
            module_2.prisma.feedback.count.mockResolvedValue(1);
            // Call the service method with filters;
            const result = await feedbackService.getFeedbacks({ status: "NEW",
                "dept1": ,
                1: ,
                limit: 10
            });
            // Verify Prisma was called with correct filters;
            expect(module_2.prisma.feedback.findMany).toHaveBeenCalledWith();
            expect.objectContaining({
                "NEW": ,
                "dept1": ,
                rating: { gte: 4 }
            });
        }
    });
    // Verify result;
    expect(result.data).toEqual(mockFeedbacks),
        expect(result.pagination.totalItems).toBe(1);
});
;
describe("createFeedback", () => {
    it("should create a new feedback", async () => {
        // Mock data;
        const mockFeedback = { patientId: "patient1",
            "GENERAL": ,
            "Great service": ,
            "555-1234": ,
            isAnonymous: false
        };
        const mockCreatedFeedback = { id: "1",
            ...mockFeedback,
            status: "NEW",
            createdAt: new Date(),
            updatedAt: new Date()
        };
        // Mock Prisma response;
        module_2.prisma.patient.findUnique.mockResolvedValue({ id: "patient1", name: "John Doe" });
        module_2.prisma.department.findUnique.mockResolvedValue({ id: "dept1", name: "Cardiology" });
        module_2.prisma.feedback.create.mockResolvedValue(mockCreatedFeedback);
        // Call the service method;
        const result = await feedbackService.createFeedback(mockFeedback);
        // Verify Prisma was called with correct arguments;
        expect(module_2.prisma.feedback.create).toHaveBeenCalledWith({
            "patient1": ,
            "GENERAL": ,
            "Great service": ,
            contactEmail: expect.stringContaining("encrypted_"),
            contactPhone: expect.stringContaining("encrypted_"),
            "NEW": 
        });
    });
    // Verify result;
    expect(result).toEqual(mockCreatedFeedback);
});
it("should create anonymous feedback without patient ID", async () => {
    // Mock data;
    const mockFeedback = { departmentId: "dept1",
        4: ,
        true: 
    };
    const mockCreatedFeedback = { id: "1",
        ...mockFeedback,
        patientId: null,
        new: Date(),
        updatedAt: new Date()
    };
    // Mock Prisma response;
    module_2.prisma.department.findUnique.mockResolvedValue({ id: "dept1", name: "Cardiology" });
    module_2.prisma.feedback.create.mockResolvedValue(mockCreatedFeedback);
    // Call the service method;
    const result = await feedbackService.createFeedback(mockFeedback);
    // Verify Prisma was called with correct arguments;
    expect(module_2.prisma.feedback.create).toHaveBeenCalledWith({
        "dept1": ,
        4: ,
        true: ,
        status: "NEW"
    });
});
// Verify result;
expect(result).toEqual(mockCreatedFeedback);
;
it("should throw an error if department does not exist", async () => {
    // Mock data;
    const mockFeedback = { departmentId: "invalid-dept",
        4: ,
        true: 
    };
    // Mock Prisma response;
    module_2.prisma.department.findUnique.mockResolvedValue(null);
    // Expect the creation to throw an error;
    await expect(feedbackService.createFeedback(mockFeedback)).rejects.toThrow();
});
;
describe("getFeedbackById", () => {
    it("should return a feedback by ID", async () => {
        // Mock data;
        const mockFeedback = { id: "1",
            "dept1": ,
            4: ,
            "NEW": ,
            createdAt: new Date(),
            updatedAt: new Date()
        };
        // Mock Prisma response;
        module_2.prisma.feedback.findUnique.mockResolvedValue(mockFeedback);
        // Call the service method;
        const result = await feedbackService.getFeedbackById("1");
        // Verify Prisma was called with correct arguments;
        expect(module_2.prisma.feedback.findUnique).toHaveBeenCalledWith({ where: { id: "1" },
            include: expect.any(Object)
        });
        // Verify result;
        expect(result).toEqual(mockFeedback);
    });
    it("should throw an error if feedback does not exist", async () => {
        // Mock Prisma response;
        module_2.prisma.feedback.findUnique.mockResolvedValue(null);
        // Expect the retrieval to throw an error;
        await expect(feedbackService.getFeedbackById("invalid-id")).rejects.toThrow();
    });
});
describe("updateFeedbackStatus", () => {
    it("should update a feedback status", async () => {
        // Mock data;
        const mockExistingFeedback = { id: "1",
            "dept1": ,
            4: ,
            "NEW": ,
            createdAt: new Date(),
            updatedAt: new Date()
        };
        const mockUpdatedFeedback = {
            ...mockExistingFeedback,
            status: "REVIEWED",
            "user1": , name: "Admin User",
            reviewedAt: expect.any(Date),
            updatedAt: new Date()
        };
        // Mock Prisma response;
        module_2.prisma.feedback.findUnique.mockResolvedValue(mockExistingFeedback);
        module_2.prisma.user.findUnique.mockResolvedValue({ id: "user1", name: "Admin User" });
        module_2.prisma.feedback.update.mockResolvedValue(mockUpdatedFeedback);
        // Call the service method;
        const result = await feedbackService.updateFeedbackStatus("1", "REVIEWED", "user1");
        // Verify Prisma was called with correct arguments;
        expect(module_2.prisma.feedback.update).toHaveBeenCalledWith({ where: { id: "1" },
            "REVIEWED": ,
            expect, : .any(Date)
        }, include, expect.any(Object));
    });
    // Verify result;
    expect(result).toEqual(mockUpdatedFeedback);
});
it("should throw an error if feedback does not exist", async () => {
    // Mock Prisma response;
    module_2.prisma.feedback.findUnique.mockResolvedValue(null);
    // Expect the update to throw an error;
    await expect(feedbackService.updateFeedbackStatus("invalid-id", "REVIEWED", "user1")).rejects.toThrow();
});
;
describe("respondToFeedback", () => {
    it("should create a response to feedback", async () => {
        // Mock data;
        const mockExistingFeedback = { id: "1",
            "dept1": ,
            4: ,
            "REVIEWED": ,
            createdAt: new Date(),
            updatedAt: new Date()
        };
        const mockResponse = { feedbackId: "1",
            "user1": 
        };
        const mockCreatedResponse = { id: "resp1",
            ...mockResponse,
            createdAt: new Date(),
            updatedAt: new Date()
        };
        const mockUpdatedFeedback = {
            ...mockExistingFeedback,
            status: "RESPONDED",
            updatedAt: new Date()
        };
        // Mock Prisma response;
        module_2.prisma.feedback.findUnique.mockResolvedValue(mockExistingFeedback);
        module_2.prisma.user.findUnique.mockResolvedValue({ id: "user1", name: "Admin User" });
        module_2.prisma.feedbackResponse.create.mockResolvedValue(mockCreatedResponse);
        module_2.prisma.feedback.update.mockResolvedValue(mockUpdatedFeedback);
        // Call the service method;
        const result = await feedbackService.respondToFeedback("1", "Thank you for your feedback", "user1");
        // Verify Prisma was called with correct arguments;
        expect(module_2.prisma.feedbackResponse.create).toHaveBeenCalledWith({
            "1": ,
            "user1": 
        }),
            expect(module_2.prisma.feedback.update).toHaveBeenCalledWith({ id: "1",
                "RESPONDED": ,
                include: expect.any(Object)
            });
        // Verify result;
        expect(result).toEqual({ feedback: mockUpdatedFeedback,
            response: mockCreatedResponse
        });
    });
    it("should throw an error if feedback does not exist", async () => {
        // Mock Prisma response;
        module_2.prisma.feedback.findUnique.mockResolvedValue(null);
        // Expect the response creation to throw an error;
        await expect(feedbackService.respondToFeedback("invalid-id", "Response", "user1")).rejects.toThrow();
    });
});
describe("getComplaints", () => {
    it("should return complaints with pagination", async () => {
        // Mock data;
        const mockComplaints = [];
        {
            id: "1",
                "dept1",
                "Long waiting time",
                "OPEN",
                createdAt;
            new Date(),
                updatedAt;
            new Date();
        }
        {
            id: "2",
                "dept2",
                "Incorrect charges",
                "INVESTIGATING",
                createdAt;
            new Date(),
                updatedAt;
            new Date();
            ;
            // Mock Prisma response;
            module_2.prisma.complaint.findMany.mockResolvedValue(mockComplaints);
            module_2.prisma.complaint.count.mockResolvedValue(2);
            // Call the service method;
            const result = await feedbackService.getComplaints({ page: 1,
                limit: 10
            });
            // Verify Prisma was called with correct arguments;
            expect(module_2.prisma.complaint.findMany).toHaveBeenCalledWith();
            expect.objectContaining({ skip: 0,
                "desc": 
            });
        }
    });
    // Verify result;
    expect(result).toEqual({ data: mockComplaints,
        1: ,
        2: ,
        totalPages: 1
    });
});
it("should apply filters correctly", async () => {
    // Mock data;
    const mockComplaints = [];
    {
        id: "1",
            "dept1",
            "Long waiting time",
            "OPEN",
            createdAt;
        new Date(),
            updatedAt;
        new Date();
        ;
        // Mock Prisma response;
        module_2.prisma.complaint.findMany.mockResolvedValue(mockComplaints);
        module_2.prisma.complaint.count.mockResolvedValue(1);
        // Call the service method with filters;
        const result = await feedbackService.getComplaints({ status: "OPEN",
            "dept1": ,
            1: ,
            limit: 10
        });
        // Verify Prisma was called with correct filters;
        expect(module_2.prisma.complaint.findMany).toHaveBeenCalledWith();
        expect.objectContaining({
            "OPEN": ,
            "dept1": ,
            severity: "MEDIUM"
        });
    }
});
// Verify result;
expect(result.data).toEqual(mockComplaints),
    expect(result.pagination.totalItems).toBe(1);
;
;
describe("createComplaint", () => {
    it("should create a new complaint", async () => {
        // Mock data;
        const mockComplaint = { patientId: "patient1",
            "SERVICE_QUALITY": ,
            "MEDIUM": ,
            incidentDate: new Date(),
            contactEmail: "patient@example.com",
            "EMAIL": ,
            isAnonymous: false
        };
        const mockCreatedComplaint = { id: "1",
            ...mockComplaint,
            status: "OPEN",
            createdAt: new Date(),
            updatedAt: new Date()
        };
        // Mock Prisma response;
        module_2.prisma.patient.findUnique.mockResolvedValue({ id: "patient1", name: "John Doe" });
        module_2.prisma.department.findUnique.mockResolvedValue({ id: "dept1", name: "Cardiology" });
        module_2.prisma.complaint.create.mockResolvedValue(mockCreatedComplaint);
        // Call the service method;
        const result = await feedbackService.createComplaint(mockComplaint);
        // Verify Prisma was called with correct arguments;
        expect(module_2.prisma.complaint.create).toHaveBeenCalledWith({
            "patient1": ,
            "SERVICE_QUALITY": ,
            "MEDIUM": ,
            incidentDate: expect.any(Date),
            contactEmail: expect.stringContaining("encrypted_"),
            contactPhone: expect.stringContaining("encrypted_"),
            preferredContactMethod: "EMAIL",
            "OPEN": 
        });
    });
    // Verify result;
    expect(result).toEqual(mockCreatedComplaint);
});
it("should create anonymous complaint without patient ID", async () => {
    // Mock data;
    const mockComplaint = { departmentId: "dept1",
        "Long waiting time": ,
        new: Date(),
        isAnonymous: true
    };
    const mockCreatedComplaint = { id: "1",
        ...mockComplaint,
        patientId: null,
        new: Date(),
        updatedAt: new Date()
    };
    // Mock Prisma response;
    module_2.prisma.department.findUnique.mockResolvedValue({ id: "dept1", name: "Cardiology" });
    module_2.prisma.complaint.create.mockResolvedValue(mockCreatedComplaint);
    // Call the service method;
    const result = await feedbackService.createComplaint(mockComplaint);
    // Verify Prisma was called with correct arguments;
    expect(module_2.prisma.complaint.create).toHaveBeenCalledWith({
        "dept1": ,
        "Long waiting time": ,
        expect, : .any(Date),
        "OPEN": 
    });
});
// Verify result;
expect(result).toEqual(mockCreatedComplaint);
;
;
describe("getComplaintById", () => {
    it("should return a complaint by ID", async () => {
        // Mock data;
        const mockComplaint = { id: "1",
            "dept1": ,
            "Long waiting time": ,
            "OPEN": ,
            createdAt: new Date(),
            updatedAt: new Date()
        };
        // Mock Prisma response;
        module_2.prisma.complaint.findUnique.mockResolvedValue(mockComplaint);
        // Call the service method;
        const result = await feedbackService.getComplaintById("1");
        // Verify Prisma was called with correct arguments;
        expect(module_2.prisma.complaint.findUnique).toHaveBeenCalledWith({ where: { id: "1" },
            include: expect.any(Object)
        });
        // Verify result;
        expect(result).toEqual(mockComplaint);
    });
    it("should throw an error if complaint does not exist", async () => {
        // Mock Prisma response;
        module_2.prisma.complaint.findUnique.mockResolvedValue(null);
        // Expect the retrieval to throw an error;
        await expect(feedbackService.getComplaintById("invalid-id")).rejects.toThrow();
    });
});
describe("updateComplaintStatus", () => {
    it("should update a complaint status", async () => {
        // Mock data;
        const mockExistingComplaint = { id: "1",
            "dept1": ,
            "Long waiting time": ,
            "OPEN": ,
            createdAt: new Date(),
            updatedAt: new Date()
        };
        const mockUpdatedComplaint = {
            ...mockExistingComplaint,
            status: "INVESTIGATING",
            "user1": , name: "Admin User",
            updatedAt: new Date()
        };
        // Mock Prisma response;
        module_2.prisma.complaint.findUnique.mockResolvedValue(mockExistingComplaint);
        module_2.prisma.user.findUnique.mockResolvedValue({ id: "user1", name: "Admin User" });
        module_2.prisma.complaint.update.mockResolvedValue(mockUpdatedComplaint);
        // Call the service method;
        const result = await feedbackService.updateComplaintStatus("1", "INVESTIGATING", "user1", "Started investigation");
        // Verify Prisma was called with correct arguments;
        expect(module_2.prisma.complaint.update).toHaveBeenCalledWith({ where: { id: "1" },
            "INVESTIGATING": ,
            assignedToId: "user1"
        }, include, expect.any(Object));
    });
    expect(module_2.prisma.complaintResolution.create).toHaveBeenCalledWith({
        "1": ,
        "Started investigation": ,
        createdById: "user1"
    });
    // Verify result;
    expect(result).toEqual(mockUpdatedComplaint);
});
it("should throw an error if complaint does not exist", async () => {
    // Mock Prisma response;
    module_2.prisma.complaint.findUnique.mockResolvedValue(null);
    // Expect the update to throw an error;
    await expect(feedbackService.updateComplaintStatus("invalid-id", "INVESTIGATING", "user1")).rejects.toThrow();
});
;
describe("resolveComplaint", () => {
    it("should resolve a complaint", async () => {
        // Mock data;
        const mockExistingComplaint = { id: "1",
            "dept1": ,
            "Long waiting time": ,
            "INVESTIGATING": ,
            new: Date(),
            updatedAt: new Date()
        };
        const mockResolution = { complaintId: "1",
            "PROCESS_IMPROVEMENT": ,
            resolvedById: "user1"
        };
        const mockCreatedResolution = { id: "res1",
            ...mockResolution,
            status: "RESOLVED",
            createdAt: new Date(),
            updatedAt: new Date()
        };
        const mockUpdatedComplaint = {
            ...mockExistingComplaint,
            status: "RESOLVED",
            resolvedAt: expect.any(Date),
            updatedAt: new Date()
        };
        // Mock Prisma response;
        module_2.prisma.complaint.findUnique.mockResolvedValue(mockExistingComplaint);
        module_2.prisma.user.findUnique.mockResolvedValue({ id: "user1", name: "Admin User" });
        module_2.prisma.complaintResolution.create.mockResolvedValue(mockCreatedResolution);
        module_2.prisma.complaint.update.mockResolvedValue(mockUpdatedComplaint);
        // Call the service method;
        const result = await feedbackService.resolveComplaint();
        "1",
            "Added more staff to reduce waiting time",
            "PROCESS_IMPROVEMENT",
            "user1";
    });
    // Verify Prisma was called with correct arguments;
    expect(module_2.prisma.complaintResolution.create).toHaveBeenCalledWith({
        "1": ,
        "Added more staff to reduce waiting time": ,
        "user1": 
    }),
        expect(module_2.prisma.complaint.update).toHaveBeenCalledWith({ id: "1",
            "RESOLVED": ,
            resolvedAt: expect.any(Date),
            include: expect.any(Object)
        });
    // Verify result;
    expect(result).toEqual({ complaint: mockUpdatedComplaint,
        resolution: mockCreatedResolution
    });
});
it("should throw an error if complaint does not exist", async () => {
    // Mock Prisma response;
    module_2.prisma.complaint.findUnique.mockResolvedValue(null);
    // Expect the resolution to throw an error;
    await expect(feedbackService.resolveComplaint());
    "invalid-id",
        "Resolution details",
        "PROCESS_IMPROVEMENT",
        "user1";
});
rejects.toThrow();
;
it("should throw an error if complaint is already resolved", async () => {
    // Mock data;
    const mockExistingComplaint = { id: "1",
        new: Date()
    };
    // Mock Prisma response;
    module_2.prisma.complaint.findUnique.mockResolvedValue(mockExistingComplaint);
    // Expect the resolution to throw an error;
    await expect(feedbackService.resolveComplaint());
    "1",
        "Resolution details",
        "PROCESS_IMPROVEMENT",
        "user1";
});
rejects.toThrow();
;
;
describe("getFeedbackAnalytics", () => {
    it("should return feedback analytics data", async () => {
        // Mock data for feedback types;
        const mockFeedbackTypes = [];
        {
            feedbackType: "GENERAL", count;
            10;
        }
        {
            feedbackType: "CARE_QUALITY", count;
            15;
        }
        {
            feedbackType: "STAFF", count;
            8;
        }
        {
            feedbackType: "FACILITIES", count;
            5;
        }
        ;
        // Mock data for ratings distribution;
        const mockRatings = [];
        {
            rating: 1, count;
            2;
        }
        {
            rating: 2, count;
            3;
        }
        {
            rating: 3, count;
            8;
        }
        {
            rating: 4, count;
            15;
        }
        {
            rating: 5, count;
            10;
        }
        ;
        // Mock data for department distribution;
        const mockDepartments = [];
        {
            departmentId: "dept1", _count;
            {
                id: 12;
            }
        }
        {
            departmentId: "dept2", _count;
            {
                id: 8;
            }
        }
        {
            departmentId: "dept3", _count;
            {
                id: 5;
            }
        }
        ;
        // Mock Prisma response for each query;
        module_2.prisma.feedback.groupBy = vi.fn();
        module_2.prisma.feedback.groupBy;
        mockResolvedValueOnce(mockFeedbackTypes);
        mockResolvedValueOnce(mockRatings);
        module_2.prisma.feedback.count.mockResolvedValue(38);
        module_2.prisma.feedback.groupBy.mockResolvedValue(mockDepartments);
        // Call the service method;
        const result = await feedbackService.getFeedbackAnalytics();
        // Verify result structure;
        expect(result).toHaveProperty("totalFeedbacks", 38),
            expect(result).toHaveProperty("feedbackTypeDistribution"),
            expect(result).toHaveProperty("ratingDistribution"),
            expect(result).toHaveProperty("departmentDistribution"),
            expect(result).toHaveProperty("averageRating");
        // Verify specific data;
        expect(result.feedbackTypeDistribution).toEqual(expect.arrayContaining([]));
        {
            feedbackType: "GENERAL", count;
            10;
        }
        {
            feedbackType: "CARE_QUALITY", count;
            15;
        }
    });
});
expect(result.ratingDistribution).toEqual(expect.arrayContaining([]));
{
    rating: 4, count;
    15;
}
{
    rating: 5, count;
    10;
}
;
// Verify average rating calculation;
const totalRatings = mockRatings.reduce((sum, item) => sum + (item.rating * item.count), 0);
const totalCount = mockRatings.reduce((sum, item) => sum + item.count, 0);
expect(result.averageRating).toBeCloseTo(totalRatings / totalCount, 2);
;
it("should apply date filters when provided", async () => {
    // Mock dates;
    const fromDate = new Date("2025-05-01");
    const toDate = new Date("2025-05-25");
    // Mock Prisma response;
    module_2.prisma.feedback.groupBy = vi.fn().mockResolvedValue([]);
    module_2.prisma.feedback.count.mockResolvedValue(0);
    // Call the service method with date filters;
    await feedbackService.getFeedbackAnalytics(fromDate, toDate);
    // Verify Prisma was called with date filters;
    expect(module_2.prisma.feedback.count).toHaveBeenCalledWith({}, { gte: fromDate,
        lte: toDate
    }),
        expect(module_2.prisma.feedback.groupBy).toHaveBeenCalledWith();
    expect.objectContaining({}, { gte: fromDate,
        lte: toDate
    });
});
;
;
describe("getComplaintAnalytics", () => {
    it("should return complaint analytics data", async () => {
        // Mock data for complaint types;
        const mockComplaintTypes = [];
        {
            complaintType: "SERVICE_QUALITY", count;
            8;
        }
        {
            complaintType: "BILLING", count;
            12;
        }
        {
            complaintType: "STAFF_BEHAVIOR", count;
            5;
        }
        {
            complaintType: "FACILITIES", count;
            3;
        }
        ;
        // Mock data for status distribution;
        const mockStatuses = [];
        {
            status: "OPEN", count;
            10;
        }
        {
            status: "INVESTIGATING", count;
            8;
        }
        {
            status: "RESOLVED", count;
            7;
        }
        {
            status: "CLOSED", count;
            3;
        }
        ;
        // Mock data for severity distribution;
        const mockSeverities = [];
        {
            severity: "LOW", count;
            5;
        }
        {
            severity: "MEDIUM", count;
            12;
        }
        {
            severity: "HIGH", count;
            8;
        }
        {
            severity: "CRITICAL", count;
            3;
        }
        ;
        // Mock Prisma response for each query;
        module_2.prisma.complaint.groupBy = vi.fn();
        module_2.prisma.complaint.groupBy;
        mockResolvedValueOnce(mockComplaintTypes);
        mockResolvedValueOnce(mockStatuses);
        mockResolvedValueOnce(mockSeverities);
        module_2.prisma.complaint.count.mockResolvedValue(28);
        // Call the service method;
        const result = await feedbackService.getComplaintAnalytics();
        // Verify result structure;
        expect(result).toHaveProperty("totalComplaints", 28),
            expect(result).toHaveProperty("complaintTypeDistribution"),
            expect(result).toHaveProperty("statusDistribution"),
            expect(result).toHaveProperty("severityDistribution"),
            expect(result).toHaveProperty("resolutionRate");
        // Verify specific data;
        expect(result.complaintTypeDistribution).toEqual(expect.arrayContaining([]));
        {
            complaintType: "SERVICE_QUALITY", count;
            8;
        }
        {
            complaintType: "BILLING", count;
            12;
        }
    });
});
expect(result.statusDistribution).toEqual(expect.arrayContaining([]));
{
    status: "OPEN", count;
    10;
}
{
    status: "RESOLVED", count;
    7;
}
;
expect(result.severityDistribution).toEqual(expect.arrayContaining([]));
{
    severity: "MEDIUM", count;
    12;
}
{
    severity: "HIGH", count;
    8;
}
;
// Verify resolution rate calculation;
const resolvedCount = mockStatuses.find(s => s.status === "RESOLVED")?.count || 0;
const closedCount = mockStatuses.find(s => s.status === "CLOSED")?.count || 0;
const totalCount = mockStatuses.reduce((sum, item) => sum + item.count, 0);
expect(result.resolutionRate).toBeCloseTo(((resolvedCount + closedCount) / totalCount) * 100, 2);
;
it("should apply date filters when provided", async () => {
    // Mock dates;
    const fromDate = new Date("2025-05-01");
    const toDate = new Date("2025-05-25");
    // Mock Prisma response;
    module_2.prisma.complaint.groupBy = vi.fn().mockResolvedValue([]);
    module_2.prisma.complaint.count.mockResolvedValue(0);
    // Call the service method with date filters;
    await feedbackService.getComplaintAnalytics(fromDate, toDate);
    // Verify Prisma was called with date filters;
    expect(module_2.prisma.complaint.count).toHaveBeenCalledWith({}, { gte: fromDate,
        lte: toDate
    }),
        expect(module_2.prisma.complaint.groupBy).toHaveBeenCalledWith();
    expect.objectContaining({}, { gte: fromDate,
        lte: toDate
    });
});
;
;
;
