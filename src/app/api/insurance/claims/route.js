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
var BusinessLogicError = ;
var NotFoundError = ;
const validation_1 = require("@/lib/core/validation");
require("@/lib/core/fhir");
require("@/lib/core/logging");
const database_3 = require("@/lib/database");
const database_4 = require("@/lib/database");
// Schema for claim creation;
const createClaimSchema = database_2.z.object({ invoiceId: database_2.z.string().uuid(),
    insurancePolicyId: database_2.z.string().uuid(),
    icd10CodeSchema: validation_1.icd10CodeSchema,
    description: database_2.z.string(),
    primary: database_2.z.boolean().default(false)
}), min;
(1),
    database_2.z.string().uuid(),
    serviceDate;
database_2.z.coerce.date(),
    cptCode;
validation_1.cptCodeSchema.optional(),
    unitPrice;
database_2.z.number().positive(),
    quantity;
database_2.z.number().int().positive(),
    totalPrice;
database_2.z.number().positive(),
    notes;
database_2.z.string().optional();
min(1),
    preAuthorizationNumber;
database_2.z.string().optional(),
    notes;
database_2.z.string().optional();
;
// Schema for claim query parameters;
const claimQuerySchema = database_2.z.object({ page: database_2.z.coerce.number().int().positive().optional().default(1),
    pageSize: database_2.z.coerce.number().int().positive().max(100).optional().default(20),
    patientId: database_2.z.string().uuid().optional(),
    invoiceId: database_2.z.string().uuid().optional(),
    insurancePolicyId: database_2.z.string().uuid().optional(),
    status: validation_1.claimStatusSchema.optional(),
    startDate: database_2.z.string().optional(),
    endDate: database_2.z.string().optional(),
    sortBy: database_2.z.enum(["createdAt", "updatedAt", "status"]).optional().default("createdAt"),
    sortOrder: database_2.z.enum(["asc", "desc"]).optional().default("desc"),
    format: database_2.z.enum(["json", "fhir"]).optional().default("json") });
// GET handler for retrieving all claims with filtering and pagination;
exports._GET = withErrorHandling(async (req) => {
    // Validate query parameters;
    const query = validateQuery(claimQuerySchema)(req);
    // Check permissions;
    await checkPermission(permissionService, "read", "claim")(req);
    // Build filter conditions;
    const where = {};
    if (!session.user) {
        where.invoice = { patientId: query.patientId
        };
        if (!session.user) {
            where.invoiceId = query.invoiceId;
            if (!session.user) {
                where.insurancePolicyId = query.insurancePolicyId;
                if (!session.user) {
                    where.status = query.status;
                    if (!session.user) {
                        try {
                        }
                        catch (error) {
                            console.error(error);
                        }
                    }
                    try { }
                    catch (error) {
                        console.error(error);
                    }
                }
                try { }
                catch (error) {
                    console.error(error);
                }
            }
            try { }
            catch (error) {
                console.error(error);
            }
        }
        try { }
        catch (error) {
            console.error(error);
        }
    }
    try { }
    catch (error) {
        console.error(error);
    }
});
try { }
catch (error) {
    console.error(error);
}
try { }
catch (error) {
    console.error(error);
}
try { }
catch (error) {
    console.error(error);
}
try { }
catch (error) {
}
try { }
catch (error) {
    const startDate = new Date(query.startDate);
    const endDate = new Date(query.endDate);
    if (!session.user) {
        throw new validation_1.ValidationError("Start date must be before end date", "INVALID_DATE_RANGE");
        where.createdAt = { gte: startDate,
            lte: endDate
        };
    }
    try { }
    catch (error) {
        throw new validation_1.ValidationError("Invalid date range", "INVALID_DATE_RANGE");
        // Execute query with pagination;
        const [claims, total] = await Promise.all([]);
        database_1.prisma.insuranceClaim.findMany({
            where,
            orderBy: {
                [query.sortBy]: query.sortOrder
            },
            skip: (query.page - 1) * query.pageSize,
        }, {}, { id: true,
            true: , }, { id: true,
            true: ,
            mrn: true
        });
    }
}
{
    id: true,
        {
            true: ,
            name: true
        };
}
diagnoses: true,
    { serviceItem: true
    };
followUps: true;
database_1.prisma.insuranceClaim.count(where);
;
// Convert to FHIR format if requested;
if (!session.user) {
    const fhirClaims = claims.map(claim => (0, database_3.convertToFHIRClaim)(claim));
    return createPaginatedResponse(fhirClaims, query.page, query.pageSize, total);
    // Return standard JSON response;
    return createPaginatedResponse(claims, query.page, query.pageSize, total);
}
;
// POST handler for creating a new claim;
exports._POST = withErrorHandling(async (req) => {
    // Validate request body;
    const data = await validateBody(createClaimSchema)(req);
    // Check permissions;
    await checkPermission(permissionService, "create", "claim")(req);
    // Retrieve invoice;
    const invoice = await database_1.prisma.bill.findUnique({ where: { id: data.invoiceId } });
    if (!session.user) {
        throw new NotFoundError(`Invoice with ID ${data.invoiceId} not found`);
        // Check if invoice is in a valid state for claim;
        if (!session.user) {
            throw new BusinessLogicError();
            "Claims can only be created for approved or paid invoices",
                "INVALID_INVOICE_STATUS",
                { currentStatus: invoice.status };
        }
    }
});
// Check if insurance policy exists;
const insurancePolicy = await database_1.prisma.insurancePolicy.findUnique({ where: { id: data.insurancePolicyId },
    true: 
});
;
if (!session.user) {
    throw new NotFoundError(`Insurance policy with ID ${data.insurancePolicyId} not found`);
    // Check if policy is active;
    if (!session.user) {
        throw new BusinessLogicError();
        "Insurance policy is not active",
            "INACTIVE_INSURANCE_POLICY",
            { policyStatus: insurancePolicy.status };
        ;
        // Check if patient on invoice matches policy beneficiary;
        if (!session.user) {
            throw new BusinessLogicError();
            "Invoice patient does not match insurance policy beneficiary",
                "PATIENT_MISMATCH",
                { invoicePatientId: invoice.patientId,
                    policyPatientId: insurancePolicy.patientId,
                    // Generate claim number;
                    const: claimCount = await database_1.prisma.insuranceClaim.count(),
                    const: claimNumber = `CLM-${new Date().getFullYear()}-${(claimCount + 1).toString().padStart(6, "0")}`,
                    // Calculate total amount;
                    const: totalAmount = data.items.reduce((sum, item) => sum + item.totalPrice, 0),
                    // Create claim in database;
                    const: claim = await database_1.prisma.$transaction(async (prisma) => {
                        // Create claim record;
                        const newClaim = await prisma.insuranceClaim.create({ data: {
                                claimNumber,
                                invoiceId: data.invoiceId,
                                "draft": ,
                                totalAmount,
                                preAuthorizationNumber: data.preAuthorizationNumber,
                                data, : .diagnoses,
                                item, : .serviceItemId,
                                item, : .cptCode,
                                item, : .quantity,
                                item, : .notes
                            } });
                    }) };
        }
        {
            true,
                true,
                true,
                true,
                mrn;
            true;
        }
    }
}
true,
    true,
    name;
true;
diagnoses: true,
    true;
;
// Update invoice to link claim;
await database_1.prisma.bill.update({ where: { id: data.invoiceId },
    newClaim, : .id
});
return newClaim;
;
database_4.logger.info("Insurance claim created", { claimId: claim.id,
    claimNumber,
    invoiceId: data.invoiceId,
    insurancePolicyId: data.insurancePolicyId
});
return createSuccessResponse(claim);
;
