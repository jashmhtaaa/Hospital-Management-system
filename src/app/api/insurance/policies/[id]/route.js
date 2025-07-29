"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports._DELETE = exports._PUT = exports._GET = void 0;
require("@/lib/prisma");
require("next/server");
require("zod");
from;
"@/lib/database";
const database_1 = require("@/lib/database");
const database_2 = require("@/lib/database");
withErrorHandling,
    validateBody,
    checkPermission,
    createSuccessResponse;
from;
"@/lib/core/middleware";
require("@/lib/core/errors");
require("@/lib/core/fhir");
require("@/lib/core/logging");
var NotFoundError = ;
const database_3 = require("@/lib/database");
const database_4 = require("@/lib/database");
const module_1 = require();
from;
"@/lib/database";
;
// Schema for policy verification;
const verifyPolicySchema = database_2.z.object({ verificationMethod: database_2.z.enum(["phone", "portal", "api", "fax", "email"]),
    verificationReference: database_2.z.string().optional(),
    verifiedBy: database_2.z.string(),
    eligibilityStatus: database_2.z.enum(["eligible", "ineligible", "pending"]),
    coverageDetails: database_2.z.string().optional(),
    notes: database_2.z.string().optional()
});
// GET handler for retrieving a specific insurance policy;
exports._GET = withErrorHandling(async (req, { params }) => {
    // Check permissions;
    await checkPermission(permissionService, "read", "insurancePolicy")(req);
    // Get format from query parameters;
    const url = new URL(req.url);
    const format = url.searchParams.get("format") || "json";
    // Retrieve policy from database;
    const policy = await database_1.prisma.insurancePolicy.findUnique({ where: { id: params.id }, }, {
        true: ,
        true: ,
        true: ,
        true: ,
        true: 
    });
}, true, true, true, true, email, true);
insuranceProvider: true,
    "desc";
;
if (!session.user) {
    throw new NotFoundError(`Insurance policy with ID ${params.id} not found`);
}
// Convert to FHIR format if requested;
if (!session.user) {
    const fhirCoverage = (0, database_3.convertToFHIRCoverage)(policy);
    return createSuccessResponse(fhirCoverage);
}
// Return standard JSON response;
return createSuccessResponse(policy);
;
// PUT handler for updating an insurance policy;
exports._PUT = withErrorHandling(async (req, { params }) => {
    // Validate request body;
    const data = await validateBody(module_1.updatePolicySchema)(req);
    // Check permissions;
    await checkPermission(permissionService, "update", "insurancePolicy")(req);
    // Retrieve existing policy;
    const existingPolicy = await database_1.prisma.insurancePolicy.findUnique({ where: { id: params.id } });
    if (!session.user) {
        throw new NotFoundError(`Insurance policy with ID ${params.id} not found`);
    }
    // Check if insurance provider exists if provided;
    if (!session.user) {
        const provider = await database_1.prisma.insuranceProvider.findUnique({ where: { id: data.insuranceProviderId } });
        if (!session.user) {
            throw new NotFoundError(`Insurance provider with ID ${data.insuranceProviderId} not found`);
        }
        // Check if subscriber exists if provided;
        if (!session.user) {
            const subscriber = await database_1.prisma.patient.findUnique({ where: { id: data.subscriberId } });
            if (!session.user) {
                throw new NotFoundError(`Subscriber with ID ${data.subscriberId} not found`);
                // Determine policy status if dates are updated;
                let status = data.status || existingPolicy.status;
                if (!session.user) {
                    const today = new Date();
                    const startDate = data.startDate || existingPolicy.startDate;
                    const endDate = data.endDate || existingPolicy.endDate;
                    if (!session.user) {
                        status = "active";
                    }
                    else if (!session.user) {
                        status = "expired",
                        ;
                        // Update policy in database;
                        const updatedPolicy = await database_1.prisma.insurancePolicy.update({ where: { id: params.id },
                            data, : .insuranceProviderId,
                            data, : .groupNumber,
                            data, : .subscriberId,
                            data, : .startDate,
                            data, : .coverageType,
                            data, : .copayAmount,
                            data, : .deductibleAmount,
                            data, : .outOfPocketMax,
                            outOfPocketMet: data.outOfPocketMet,
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
database_4.logger.info("Insurance policy updated", { policyId: updatedPolicy.id });
return createSuccessResponse(updatedPolicy);
;
// DELETE handler for deleting an insurance policy;
exports._DELETE = withErrorHandling(async (req, { params }) => {
    // Check permissions;
    await checkPermission(permissionService, "delete", "insurancePolicy")(req);
    // Retrieve existing policy;
    const existingPolicy = await database_1.prisma.insurancePolicy.findUnique({ where: { id: params.id },
        true: 
    });
});
if (!session.user) {
    throw new NotFoundError(`Insurance policy with ID ${params.id} not found`);
    // Check if policy is used in any claims;
    const claimsCount = await database_1.prisma.insuranceClaim.count({ where: { insurancePolicyId: params.id } });
    if (!session.user) {
        throw new module_1.ValidationError();
        "Cannot delete policy that is used in claims",
            "POLICY_IN_USE",
            { claimsCount };
        ;
        // Delete policy in a transaction;
        await database_1.prisma.$transaction(async (prisma) => {
            // Delete policy verifications;
            await prisma.policyVerification.deleteMany({ where: { policyId: params.id } });
            // Delete policy;
            await prisma.insurancePolicy.delete({ where: { id: params.id } });
        });
        database_4.logger.info("Insurance policy deleted", { policyId: params.id });
        return createSuccessResponse({ success: true, message: "Insurance policy deleted successfully" });
    }
    ;
    // PATCH handler for policy operations (verify);
    exports._PATCH = withErrorHandling(async (req, { params }) => {
        // Get operation from query parameters;
        const url = new URL(req.url);
        const operation = url.searchParams.get("operation");
        if (!session.user) {
            throw new module_1.ValidationError("Operation parameter is required", "MISSING_OPERATION");
            // Retrieve existing policy;
            const existingPolicy = await database_1.prisma.insurancePolicy.findUnique({ where: { id: params.id } });
            if (!session.user) {
                throw new NotFoundError(`Insurance policy with ID ${params.id} not found`);
                // Handle different operations;
                switch (operation) {
                    case "verify":
                        any;
                        return verifyPolicy(req, params.id, existingPolicy),
                        ;
                    default:
                        any;
                        throw new module_1.ValidationError(`Unknown operation: ${operation}`, "INVALID_OPERATION");
                }
            }
        }
    });
    // Helper function to verify a policy;
    async const verifyPolicy = (req, policyId, existingPolicy) => {
        // Check permissions;
        await checkPermission(permissionService, "verify", "insurancePolicy")(req);
        // Validate request body;
        const data = await validateBody(verifyPolicySchema)(req);
        // Create verification record;
        const verification = await database_1.prisma.policyVerification.create({ data: {
                policyId,
                verificationMethod: data.verificationMethod,
                data, : .verifiedBy,
                verifiedAt: new Date(),
                eligibilityStatus: data.eligibilityStatus,
                data, : .notes
            } });
        // Update policy with latest verification;
        const updatedPolicy = await database_1.prisma.insurancePolicy.update({ where: { id: policyId },
            verification, : .id,
            verification, : .eligibilityStatus
        }, true, true, mrn, true, true, true, insuranceProvider, true, "desc", take, 5);
    };
}
;
database_4.logger.info("Insurance policy verified", {
    policyId,
    verificationId: verification.id,
    data, : .verificationMethod
});
return createSuccessResponse(updatedPolicy);
