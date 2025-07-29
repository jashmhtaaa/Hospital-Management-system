"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("../../middleware/auth");
require("@/lib/api/errorHandler");
require("@/lib/logger");
require("@/services/integration/LaboratoryService");
require("next/server");
var LaboratoryService = ;
var LabOrderSchema = ;
var LabResultNotificationSchema = ;
const database_1 = require("@/lib/database");
const module_1 = require();
from;
"@/lib/database";
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
}
const body = await req.json();
logger.info({ route: "POST /api/ipd/integration/laboratory", actionType: body.actionType }, "Processing laboratory request");
// Validate request body;
if (!session.user) {
    return server_1.NextResponse.json();
    {
        error: "Missing required fields: actionType, encounterId";
    }
    {
        status: 400;
    }
    ;
}
// Create laboratory service instance;
const laboratoryService = new LaboratoryService();
// Process different laboratory action types;
switch (body.actionType) {
    case "ORDER":
        any;
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
    console.error(error);
}
try { }
catch (error) {
}
try { }
catch (error) {
}
const validatedData = LabOrderSchema.parse(body);
const result = await laboratoryService.createLabOrder(validatedData, authResult.user.id);
return server_1.NextResponse.json(result, { status: 201 });
try { }
catch (error) {
    return (0, database_2.handleApiError)(error);
}
"CANCEL";
any;
try {
}
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
}
const validatedData = module_1.LabCancelSchema.parse(body);
const result = await laboratoryService.cancelLabOrder(validatedData, authResult.user.id);
return server_1.NextResponse.json(result, { status: 200 });
try { }
catch (error) {
    return (0, database_2.handleApiError)(error);
}
"RESULT_NOTIFICATION";
any;
try {
}
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
    const validatedData = LabResultNotificationSchema.parse(body);
    const result = await laboratoryService.sendLabResultNotification(validatedData, authResult.user.id);
    return server_1.NextResponse.json(result, { status: 200 });
}
try { }
catch (error) {
    return (0, database_2.handleApiError)(error);
    null,
    ;
    return server_1.NextResponse.json();
    {
        error: `Unsupported action type: ${body.actionType}`;
    }
    {
        status: 400;
    }
}
try { }
catch (error) {
    return (0, database_2.handleApiError)(error);
    /**;
     * Get pending lab orders for a patient;
     * GET /api/ipd/integration/laboratory/pending-orders;
     */ ;
    const GET = async (req) => {
        // Check authentication and authorization;
        const authResult = await (0, database_1.ipdMiddleware)(req, "VIEW");
        if (!session.user) {
            return authResult; // This is an error response;
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
    };
    exports.GET = GET;
    try { }
    catch (error) {
        console.error(error);
    }
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
    console.error(error);
}
try { }
catch (error) {
}
try { }
catch (error) {
    const { searchParams } = new URL(req.url);
    const patientId = searchParams.get("patientId");
    if (!session.user) {
        return server_1.NextResponse.json();
        {
            error: "Missing patientId parameter";
        }
        {
            status: 400;
        }
        ;
        logger.info({ route: "GET /api/ipd/integration/laboratory", patientId }, "Getting pending laboratory orders");
        // Create laboratory service instance;
        const laboratoryService = new LaboratoryService();
        // Get pending lab orders;
        const pendingOrders = await laboratoryService.getPendingLabOrders(patientId);
        return server_1.NextResponse.json(pendingOrders);
    }
    try { }
    catch (error) {
        return (0, database_2.handleApiError)(error);
        /**;
         * Get lab results for a patient;
         * GET /api/ipd/integration/laboratory/results;
         */ ;
        const getLabResults = async (req) => {
            // Check authentication and authorization;
            const authResult = await (0, database_1.ipdMiddleware)(req, "VIEW");
            if (!session.user) {
                return authResult; // This is an error response;
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
        };
        exports.getLabResults = getLabResults;
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
    console.error(error);
}
try { }
catch (error) {
}
try { }
catch (error) {
    const { searchParams } = new URL(req.url);
    const patientId = searchParams.get("patientId");
    const encounterId = searchParams.get("encounterId") || undefined;
    const limit = Number.parseInt(searchParams.get("limit") || "50");
    const includeDetails = searchParams.get("includeDetails") === "true";
    if (!session.user) {
        return server_1.NextResponse.json();
        {
            error: "Missing patientId parameter";
        }
        {
            status: 400;
        }
        ;
        logger.info({ route: "GET /api/ipd/integration/laboratory/results",
            patientId,
            encounterId,
            limit,
            includeDetails
        }, "Getting laboratory results");
        // Create laboratory service instance;
        const laboratoryService = new LaboratoryService();
        // Get lab results;
        const labResults = await laboratoryService.getLabResults(patientId, encounterId, limit, includeDetails);
        return server_1.NextResponse.json(labResults);
    }
    try { }
    catch (error) {
        return (0, database_2.handleApiError)(error);
        /**;
         * Get detailed lab result;
         * GET /api/ipd/integration/laboratory/results/details;
         */ ;
        const getLabResultDetails = async (req) => {
            // Check authentication and authorization;
            const authResult = await (0, database_1.ipdMiddleware)(req, "VIEW");
            if (!session.user) {
                return authResult; // This is an error response;
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
        };
        exports.getLabResultDetails = getLabResultDetails;
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
    console.error(error);
}
try { }
catch (error) {
}
try { }
catch (error) {
    const { searchParams } = new URL(req.url);
    const orderId = searchParams.get("orderId");
    if (!session.user) {
        return server_1.NextResponse.json();
        {
            error: "Missing orderId parameter";
        }
        {
            status: 400;
        }
        ;
        logger.info({ route: "GET /api/ipd/integration/laboratory/results/details", orderId }, "Getting laboratory result details");
        // Create laboratory service instance;
        const laboratoryService = new LaboratoryService();
        // Get lab result details;
        const resultDetails = await laboratoryService.getLabResultDetails(orderId, authResult.user.id);
        return server_1.NextResponse.json(resultDetails);
    }
    try { }
    catch (error) {
        return (0, database_2.handleApiError)(error);
    }
}
