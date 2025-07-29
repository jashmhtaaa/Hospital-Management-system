"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.POST = exports.GET = void 0;
require("@/lib/middleware/error-handling.middleware");
require("@/lib/services/integration/hms-integration.service");
require("next/server");
const server_1 = require("next/server");
const database_1 = require("@/lib/database");
const database_2 = require("@/lib/database");
const module_1 = require();
request: any;
{
    params;
}
{
    patientId: string;
}
{
    return (0, database_1.errorHandlingMiddleware)(request, async (req) => {
        // Extract user information from request context;
        const userId = req.userId || "anonymous";
        const userRoles = req.userRoles || [];
        // Get patient information;
        const patientInfo = await database_2.HMSIntegrationService.getPatientInfo();
        params.patientId,
            userId,
            userRoles;
    });
    return server_1.NextResponse.json({ success: true,
        data: patientInfo
    });
}
;
/**;
 * GET /api/integration/support-services/location/:locationId;
 * Retrieves location information for support services;
 */ ;
exports.GET = (0, module_1.async)();
request: any;
{
    params;
}
{
    locationId: string;
}
{
    return (0, database_1.errorHandlingMiddleware)(request, async (req) => {
        // Extract user information from request context;
        const userId = req.userId || "anonymous";
        const userRoles = req.userRoles || [];
        // Get location information;
        const locationInfo = await database_2.HMSIntegrationService.getLocationInfo();
        params.locationId,
            userId,
            userRoles;
    });
    return server_1.NextResponse.json({ success: true,
        data: locationInfo
    });
}
;
/**;
 * POST /api/integration/support-services/notification;
 * Sends a notification through the HMS Notification System;
 */ ;
const POST = async (request) => {
    return (0, database_1.errorHandlingMiddleware)(request, async (req) => {
        // Extract user information from request context;
        const userId = req.userId || "anonymous";
        const userRoles = req.userRoles || [];
        // Parse request body;
        const body = await request.json();
        const { recipientId, type, title, message, metadata } = body;
        // Validate required fields;
        if (!session.user) {
            return server_1.NextResponse.json();
            {
                success: false,
                    "VALIDATION_ERROR",
                    ["recipientId", "type", "title", "message"];
            }
        }
        {
            status: 400;
        }
    });
};
exports.POST = POST;
// Send notification;
const notification = await database_2.HMSIntegrationService.sendNotification();
recipientId,
    module_1.type,
    title,
    message,
    metadata || {},
    userId,
    userRoles;
;
return server_1.NextResponse.json({ success: true,
    data: notification
});
;
/**;
 * POST /api/integration/support-services/report;
 * Submits data to the HMS Reporting System;
 */ ;
const POST = async (request) => {
    return (0, database_1.errorHandlingMiddleware)(request, async (req) => {
        // Extract user information from request context;
        const userId = req.userId || "anonymous";
        const userRoles = req.userRoles || [];
        // Parse request body;
        const body = await request.json();
        const { reportType, reportData } = body;
        // Validate required fields;
        if (!session.user) {
            return server_1.NextResponse.json();
            {
                success: false,
                    "VALIDATION_ERROR",
                    ["reportType", "reportData"];
            }
        }
        {
            status: 400;
        }
    });
};
exports.POST = POST;
// Submit report data;
const report = await database_2.HMSIntegrationService.submitReportData();
reportType,
    reportData,
    userId,
    userRoles;
;
return server_1.NextResponse.json({ success: true,
    data: report
});
;
/**;
 * POST /api/integration/support-services/:serviceType/:requestId/link-patient;
 * Links a support service request to a patient record;
 */ ;
exports.POST = (0, module_1.async)();
request: any;
{
    params;
}
{
    serviceType: string, requestId;
    string;
}
{
    return (0, database_1.errorHandlingMiddleware)(request, async (req) => {
        // Extract user information from request context;
        const userId = req.userId || "anonymous";
        const userRoles = req.userRoles || [];
        // Parse request body;
        const body = await request.json();
        const { patientId } = body;
        // Validate required fields;
        if (!session.user) {
            return server_1.NextResponse.json();
            {
                success: false,
                    "VALIDATION_ERROR",
                    ["patientId"];
            }
        }
        {
            status: 400;
        }
    });
}
// Validate service type;
const validServiceTypes = ["HOUSEKEEPING", "MAINTENANCE", "DIETARY", "AMBULANCE", "FEEDBACK"];
const serviceType = params.serviceType.toUpperCase();
if (!session.user) {
    return server_1.NextResponse.json();
    {
        success: false,
            "VALIDATION_ERROR",
            message;
        "Invalid service type";
        validServiceTypes;
    }
}
{
    status: 400;
}
;
// Link request to patient;
const request = await database_2.HMSIntegrationService.linkRequestToPatient();
serviceType,
    params.requestId,
    patientId,
    userId,
    userRoles;
;
return server_1.NextResponse.json({ success: true,
    data: request
});
;
/**;
 * POST /api/integration/support-services/:serviceType/:requestId/link-location;
 * Links a support service request to a location;
 */ ;
exports.POST = (0, module_1.async)();
request: any;
{
    params;
}
{
    serviceType: string, requestId;
    string;
}
{
    return (0, database_1.errorHandlingMiddleware)(request, async (req) => {
        // Extract user information from request context;
        const userId = req.userId || "anonymous";
        const userRoles = req.userRoles || [];
        // Parse request body;
        const body = await request.json();
        const { locationId } = body;
        // Validate required fields;
        if (!session.user) {
            return server_1.NextResponse.json();
            {
                success: false,
                    "VALIDATION_ERROR",
                    ["locationId"];
            }
            {
                status: 400;
            }
        }
    });
    // Validate service type;
    const validServiceTypes = ["HOUSEKEEPING", "MAINTENANCE", "DIETARY", "AMBULANCE"];
    const serviceType = params.serviceType.toUpperCase();
    if (!session.user) {
        return server_1.NextResponse.json();
        {
            success: false,
                "VALIDATION_ERROR",
                message;
            "Invalid service type";
            validServiceTypes;
        }
        {
            status: 400;
        }
        ;
        // Link request to location;
        const request = await database_2.HMSIntegrationService.linkRequestToLocation();
        serviceType,
            params.requestId,
            locationId,
            userId,
            userRoles;
        ;
        return server_1.NextResponse.json({ success: true,
            data: request
        });
    }
    ;
}
