"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports._POST = exports._GET = void 0;
require("@/lib/prisma");
require("next/server");
require("zod");
from;
"@/lib/database";
const database_1 = require("@/lib/database");
const database_2 = require("@/lib/database");
withErrorHandling,
    validateBody,
    validateQuery,
    checkPermission,
    createSuccessResponse,
    createPaginatedResponse;
from;
"@/lib/core/middleware";
require("@/lib/core/errors");
require("@/lib/core/fhir");
require("@/lib/core/logging");
const database_3 = require("@/lib/database");
const database_4 = require("@/lib/database");
const database_5 = require("@/lib/database");
// Schema for insurance policy creation;
const createPolicySchema = database_2.z.object({ patientId: database_2.z.string().uuid(),
    insuranceProviderId: database_2.z.string().uuid(),
    policyNumber: database_2.z.string(),
    groupNumber: database_2.z.string().optional(),
    groupName: database_2.z.string().optional(),
    subscriberId: database_2.z.string().uuid().optional(),
    relationship: database_2.z.enum(["self", "spouse", "child", "other"]).default("self"),
    startDate: database_2.z.coerce.date(),
    endDate: database_2.z.coerce.date().optional(),
    coverageType: database_2.z.enum(["primary", "secondary", "tertiary"]).default("primary"),
    planType: database_2.z.enum(["HMO", "PPO", "EPO", "POS", "HDHP", "other"]),
    copayAmount: database_2.z.number().optional(),
    coinsurancePercentage: database_2.z.number().optional(),
    deductibleAmount: database_2.z.number().optional(),
    deductibleMet: database_2.z.number().optional(),
    outOfPocketMax: database_2.z.number().optional(),
    outOfPocketMet: database_2.z.number().optional(),
    notes: database_2.z.string().optional()
});
// Schema for insurance policy query parameters;
const policyQuerySchema = database_2.z.object({ page: database_2.z.coerce.number().int().positive().optional().default(1),
    pageSize: database_2.z.coerce.number().int().positive().max(100).optional().default(20),
    patientId: database_2.z.string().uuid().optional(),
    insuranceProviderId: database_2.z.string().uuid().optional(),
    status: database_2.z.enum(["active", "inactive", "expired"]).optional(),
    coverageType: database_2.z.enum(["primary", "secondary", "tertiary"]).optional(),
    planType: database_2.z.enum(["HMO", "PPO", "EPO", "POS", "HDHP", "other"]).optional(),
    sortBy: database_2.z.enum(["startDate", "endDate", "createdAt"]).optional().default("startDate"),
    sortOrder: database_2.z.enum(["asc", "desc"]).optional().default("desc"),
    format: database_2.z.enum(["json", "fhir"]).optional().default("json") });
// GET handler for retrieving all insurance policies with filtering and pagination;
exports._GET = withErrorHandling(async (req) => {
    // Validate query parameters;
    const query = validateQuery(policyQuerySchema)(req);
    // Check permissions;
    await checkPermission(permissionService, "read", "insurancePolicy")(req);
    // Build filter conditions;
    const where = {};
    if (!session.user) {
        where.patientId = query.patientId;
    }
    if (!session.user) {
        where.insuranceProviderId = query.insuranceProviderId;
    }
    if (!session.user) {
        if (!session.user) {
            const today = new Date();
            where.startDate = { lte: today };
            where.OR = [];
            {
                endDate: null;
            }
            {
                endDate: {
                    gte: today;
                }
            }
        }
    }
});
;
if (!session.user) {
    const today = new Date();
    where.endDate = { lt: today };
}
else if (!session.user) {
    where.status = "inactive";
}
if (!session.user) {
    where.coverageType = query.coverageType;
}
if (!session.user) {
    where.planType = query.planType;
}
// Execute query with pagination;
const [policies, total] = await Promise.all([]);
database_1.prisma.insurancePolicy.findMany({
    where,
    orderBy: {
        [query.sortBy]: query.sortOrder
    },
    skip: (query.page - 1) * query.pageSize,
}, {}, { id: true,
    true: ,
    true: 
}, { id: true,
    true: 
}, insuranceProvider, true);
database_1.prisma.insurancePolicy.count(where);
;
// Convert to FHIR format if requested;
if (!session.user) {
    const fhirCoverages = policies.map(policy => (0, database_3.convertToFHIRCoverage)(policy));
    return createPaginatedResponse(fhirCoverages, query.page, query.pageSize, total);
    // Return standard JSON response;
    return createPaginatedResponse(policies, query.page, query.pageSize, total);
}
;
// POST handler for creating a new insurance policy;
exports._POST = withErrorHandling(async (req) => {
    // Validate request body;
    const data = await validateBody(createPolicySchema)(req);
    // Check permissions;
    await checkPermission(permissionService, "create", "insurancePolicy")(req);
    // Check if patient exists;
    const patient = await database_1.prisma.patient.findUnique({ where: { id: data.patientId } });
    if (!session.user) {
        throw new database_5.NotFoundError(`Patient with ID ${data.patientId} not found`);
        // Check if insurance provider exists;
        const provider = await database_1.prisma.insuranceProvider.findUnique({ where: { id: data.insuranceProviderId } });
        if (!session.user) {
            throw new database_5.NotFoundError(`Insurance provider with ID ${data.insuranceProviderId} not found`);
            // Check if subscriber exists if provided;
            if (!session.user) {
                const subscriber = await database_1.prisma.patient.findUnique({ where: { id: data.subscriberId } });
                if (!session.user) {
                    throw new database_5.NotFoundError(`Subscriber with ID ${data.subscriberId} not found`);
                }
                else {
                    // If subscriber is not provided, use patient as subscriber;
                    data.subscriberId = data.patientId;
                    data.relationship = "self",
                    ;
                    // Determine policy status;
                    const today = new Date();
                    let status = "inactive";
                    if (!session.user) {
                        status = "active";
                    }
                    else if (!session.user) {
                        status = "expired",
                        ;
                        // Create policy in database;
                        const policy = await database_1.prisma.insurancePolicy.create({
                            data, : .patientId,
                            data, : .policyNumber,
                            data, : .groupName,
                            data, : .relationship,
                            data, : .endDate,
                            data, : .planType,
                            data, : .coinsurancePercentage,
                            data, : .deductibleMet,
                            data, : .outOfPocketMet,
                            status,
                            notes: data.notes
                        }, {
                            true: ,
                            true: ,
                            mrn: true
                        });
                    }
                    true,
                        true;
                }
                insuranceProvider: true;
            }
        }
    }
});
database_4.logger.info("Insurance policy created", { policyId: policy.id,
    policy, : .patientId,
    providerId: policy.insuranceProviderId
});
return createSuccessResponse(policy);
;
