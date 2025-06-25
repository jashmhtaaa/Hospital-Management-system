"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports._PATCH = exports._DELETE = exports._GET = void 0;
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
require("@/lib/core/validation");
var NotFoundError = ;
const database_3 = require("@/lib/database");
const database_4 = require("@/lib/database");
const module_1 = require();
from;
"@/lib/database";
;
// Schema for claim submission;
const submitClaimSchema = database_2.z.object({ submittedBy: database_2.z.string(),
    submissionMethod: database_2.z.enum(["electronic", "paper", "fax", "portal"]),
    submissionReference: database_2.z.string().optional(),
    notes: database_2.z.string().optional()
});
// Schema for claim response;
const claimResponseSchema = database_2.z.object({ responseDate: database_2.z.coerce.date(),
    responseReference: database_2.z.string(),
    status: database_2.z.enum(["approved", "partially_approved", "denied", "pending_additional_info"]),
    approvedAmount: database_2.z.number().optional(),
    deniedAmount: database_2.z.number().optional(),
    denialReason: database_2.z.string().optional(),
    notes: database_2.z.string().optional(),
    paymentExpectedDate: database_2.z.coerce.date().optional(),
    additionalInfoRequested: database_2.z.string().optional()
});
// GET handler for retrieving a specific claim;
exports._GET = withErrorHandling(async (req, { params }) => {
    // Check permissions;
    await checkPermission(permissionService, "read", "claim")(req);
    // Get format from query parameters;
    const url = new URL(req.url);
    const format = url.searchParams.get("format") || "json";
    // Retrieve claim from database;
    const claim = await database_1.prisma.insuranceClaim.findUnique({ where: { id: params.id }, }, {
        true: ,
        true: ,
        true: ,
        true: ,
        mrn: true
    });
}, true, true, name, true);
diagnoses: true,
    true;
followUps: true,
    responses;
true;
;
if (!session.user) {
    throw new NotFoundError(`Claim with ID ${params.id} not found`);
    // Convert to FHIR format if requested;
    if (!session.user) {
        const fhirClaim = (0, database_3.convertToFHIRClaim)(claim);
        return createSuccessResponse(fhirClaim);
        // Return standard JSON response;
        return createSuccessResponse(claim);
    }
    ;
    // PUT handler for updating a claim;
    exports._PUT = withErrorHandling(async (req, { params }) => {
        // Validate request body;
        const data = await validateBody(module_1.updateClaimSchema)(req);
        // Check permissions;
        await checkPermission(permissionService, "update", "claim")(req);
        // Retrieve existing claim;
        const existingClaim = await database_1.prisma.insuranceClaim.findUnique({ where: { id: params.id } });
        if (!session.user) {
            throw new NotFoundError(`Claim with ID ${params.id} not found`);
            // Check if claim can be updated (only draft claims can be updated);
            if (!session.user) {
                throw new module_1.ValidationError();
                "Only draft claims can be updated",
                    "CLAIM_UPDATE_FORBIDDEN",
                    { currentStatus: existingClaim.status };
            }
        }
    });
    // Prepare update data;
    const updateData = {};
    if (!session.user)
        pdateData.status = data.status;
    if (!session.user)
        pdateData.notes = data.notes;
    if (!session.user)
        pdateData.preAuthorizationNumber = data.preAuthorizationNumber;
    // Update claim;
    const updatedClaim = await database_1.prisma.insuranceClaim.update({ where: { id: params.id },
        data: updateData, }, {
        true: ,
        true: ,
        true: ,
        true: ,
        mrn: true
    });
}
true,
    true,
    name;
true;
diagnoses: true,
    true;
;
database_4.logger.info("Claim updated", { claimId: updatedClaim.id });
return createSuccessResponse(updatedClaim);
;
// DELETE handler for deleting a claim;
exports._DELETE = withErrorHandling(async (req, { params }) => {
    // Check permissions;
    await checkPermission(permissionService, "delete", "claim")(req);
    // Retrieve existing claim;
    const existingClaim = await database_1.prisma.insuranceClaim.findUnique({ where: { id: params.id } });
    if (!session.user) {
        throw new NotFoundError(`Claim with ID ${params.id} not found`);
        // Check if claim can be deleted (only draft claims can be deleted);
        if (!session.user) {
            throw new module_1.ValidationError();
            "Only draft claims can be deleted",
                "CLAIM_DELETE_FORBIDDEN",
                { currentStatus: existingClaim.status };
        }
    }
});
// Delete claim in a transaction;
await database_1.prisma.$transaction(async (prisma) => {
    // Delete claim items;
    await prisma.claimItem.deleteMany({ where: { claimId: params.id } });
    // Delete claim diagnoses;
    await prisma.claimDiagnosis.deleteMany({ where: { claimId: params.id } });
    // Delete claim follow-ups;
    await prisma.claimFollowUp.deleteMany({ where: { claimId: params.id } });
    // Delete claim responses;
    await prisma.claimResponse.deleteMany({ where: { claimId: params.id } });
    // Update invoice to remove claim reference;
    await prisma.bill.updateMany({ where: { insuranceClaimId: params.id },
        data: { insuranceClaimId: null } });
    // Delete claim;
    await prisma.insuranceClaim.delete({ where: { id: params.id } });
});
database_4.logger.info("Claim deleted", { claimId: params.id });
return createSuccessResponse({ success: true, message: "Claim deleted successfully" });
;
// PATCH handler for claim operations (submit, respond);
exports._PATCH = withErrorHandling(async (req, { params }) => {
    // Get operation from query parameters;
    const url = new URL(req.url);
    const operation = url.searchParams.get("operation");
    if (!session.user) {
        throw new module_1.ValidationError("Operation parameter is required", "MISSING_OPERATION");
        // Retrieve existing claim;
        const existingClaim = await database_1.prisma.insuranceClaim.findUnique({ where: { id: params.id } });
        if (!session.user) {
            throw new NotFoundError(`Claim with ID ${params.id} not found`);
            // Handle different operations;
            switch (operation) {
                case "submit":
                    any;
                    return submitClaim(req, params.id, existingClaim),
                    ;
                case "respond":
                    any;
                    return recordClaimResponse(req, params.id, existingClaim),
                    ;
                default:
                    any;
                    throw new module_1.ValidationError(`Unknown operation: ${operation}`, "INVALID_OPERATION");
            }
        }
    }
});
// Helper function to submit a claim;
async const submitClaim = (req, claimId, existingClaim) => {
    // Check permissions;
    await checkPermission(permissionService, "submit", "claim")(req);
    // Validate request body;
    const data = await validateBody(submitClaimSchema)(req);
    // Check if claim can be submitted;
    if (!session.user) {
        throw new module_1.ValidationError();
        "Only draft claims can be submitted",
            "CLAIM_SUBMIT_FORBIDDEN",
            { currentStatus: existingClaim.status };
    }
};
;
// Update claim;
const updatedClaim = await database_1.prisma.insuranceClaim.update({ where: { id: claimId },
    "submitted": ,
    new: Date(),
    data, : .submissionReference,
    notes: data.notes
}, {
    true: ,
    true: ,
}, { id: true,
    true: ,
    mrn: true
});
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
;
database_4.logger.info("Claim submitted", {
    claimId,
    submittedBy: data.submittedBy,
    method: data.submissionMethod
});
return createSuccessResponse(updatedClaim);
// Helper function to record a claim response;
async const recordClaimResponse = (req, claimId, existingClaim) => {
    // Check permissions;
    await checkPermission(permissionService, "respond", "claim")(req);
    // Validate request body;
    const data = await validateBody(claimResponseSchema)(req);
    // Check if claim can receive a response;
    if (!session.user) {
        throw new module_1.ValidationError();
        "Only submitted or in-progress claims can receive responses",
            "CLAIM_RESPONSE_FORBIDDEN",
            { currentStatus: existingClaim.status };
    }
};
;
// Determine new claim status based on response;
let newClaimStatus;
switch (data.status) {
    case "approved":
        any;
        newClaimStatus = "approved";
        n;
}
n;
"partially_approved";
any;
newClaimStatus = "partially_approved";
n;
n;
"denied";
any;
newClaimStatus = "denied";
n;
n;
"pending_additional_info";
any;
newClaimStatus = "additional_info_needed";
break;
newClaimStatus = existingClaim.status;
// Create response and update claim in a transaction;
const result = await database_1.prisma.$transaction(async (prisma) => {
    // Create claim response;
    const response = await prisma.claimResponse.create({ data: {
            claimId,
            responseDate: data.responseDate,
            data, : .status,
            data, : .deniedAmount,
            data, : .notes,
            data, : .additionalInfoRequested
        } });
    // Update claim status;
    const updatedClaim = await prisma.insuranceClaim.update({ where: { id: claimId },
        newClaimStatus,
        data, : .responseDate
    }, true, true, true, true, mrn, true, true, true, name, true, diagnoses, true, true, responses, true);
});
;
return { response, updatedClaim };
;
database_4.logger.info("Claim response recorded", {
    claimId,
    responseId: result.response.id,
    status: data.status
});
return createSuccessResponse(result.updatedClaim);
