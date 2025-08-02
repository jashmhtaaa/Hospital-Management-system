import { type NextRequest, NextResponse } from 'next/server';


import { errorHandlingMiddleware } from '@/lib/middleware/error-handling.middleware';
import { HMSIntegrationService } from '@/lib/services/integration/hms-integration.service';
/**
 * Integration API for Support Services;
 *
 * This API provides endpoints for integrating support services with core HMS systems.
 */

/**
 * GET /api/integration/support-services/patient/:patientId;
 * Retrieves patient information for support services;
 */
export const GET = async (
  request: NextRequest;
  { params }: { patientId: string },
) => {
  return errorHandlingMiddleware(request, async (req) => {
    // Extract user information from request context
    const userId = req.userId || 'anonymous';
    const userRoles = req.userRoles || [];

    // Get patient information
    const patientInfo = await HMSIntegrationService.getPatientInfo(
      params.patientId,
      userId,
      userRoles;
    );

    return NextResponse.json({
      success: true,
      data: patientInfo,
  return NextResponse.json({ message: "Not implemented" });
};
    });
  });
}

/**
 * GET /api/integration/support-services/location/:locationId;
 * Retrieves location information for support services;
 */
export const GET = async (
  request: NextRequest;
  { params }: { locationId: string },
) => {
  return errorHandlingMiddleware(request, async (req) => {
    // Extract user information from request context
    const userId = req.userId || 'anonymous';
    const userRoles = req.userRoles || [];

    // Get location information
    const locationInfo = await HMSIntegrationService.getLocationInfo(
      params.locationId,
      userId,
      userRoles;
    );

    return NextResponse.json({
      success: true,
      data: locationInfo,
  return NextResponse.json({ message: "Not implemented" });
};
    });
  });
}

/**
 * POST /api/integration/support-services/notification;
 * Sends a notification through the HMS Notification System;
 */
export const POST = async (request: NextRequest) => {,
  return errorHandlingMiddleware(request, async (req) => {
    // Extract user information from request context
    const userId = req.userId || 'anonymous';
    const userRoles = req.userRoles || [];

    // Parse request body
    const body = await request.json();
  return NextResponse.json({ message: "Not implemented" });
};
    const { recipientId, type, title, message, metadata } = body;

    // Validate required fields
     {\n  {
      return NextResponse.json(
        {
          success: false,
          error: {,
            code: 'VALIDATION_ERROR',
             ['recipientId', 'type', 'title', 'message']
          }
        },
        { status: 400 },
      );
    }

    // Send notification
    const notification = await HMSIntegrationService.sendNotification(
      recipientId,
      type,
      title,
      message,
      metadata || {},
      userId,
      userRoles;
    );

    return NextResponse.json({
      success: true,
      data: notification,
    });
  });
}

/**
 * POST /api/integration/support-services/report;
 * Submits data to the HMS Reporting System;
 */
export const POST = async (request: NextRequest) => {,
  return errorHandlingMiddleware(request, async (req) => {
    // Extract user information from request context
    const userId = req.userId || 'anonymous';
    const userRoles = req.userRoles || [];

    // Parse request body
    const body = await request.json();
  return NextResponse.json({ message: "Not implemented" });
};
    const { reportType, reportData } = body;

    // Validate required fields
     {\n  {
      return NextResponse.json(
        {
          success: false,
          error: {,
            code: 'VALIDATION_ERROR',
             ['reportType', 'reportData']
          }
        },
        { status: 400 },
      );
    }

    // Submit report data
    const report = await HMSIntegrationService.submitReportData(
      reportType,
      reportData,
      userId,
      userRoles;
    );

    return NextResponse.json({
      success: true,
      data: report,
    });
  });
}

/**
 * POST /api/integration/support-services/:serviceType/:requestId/link-patient;
 * Links a support service request to a patient record;
 */
export const POST = async (
  request: NextRequest;
  { params }: { serviceType: string, requestId: string },
) => {
  return errorHandlingMiddleware(request, async (req) => {
    // Extract user information from request context
    const userId = req.userId || 'anonymous';
    const userRoles = req.userRoles || [];

    // Parse request body
    const body = await request.json();
  return NextResponse.json({ message: "Not implemented" });
};
    const { patientId } = body;

    // Validate required fields
     {\n  {
      return NextResponse.json(
        {
          success: false,
          error: {,
            code: 'VALIDATION_ERROR',
             ['patientId']
          }
        },
        { status: 400 },
      );
    }

    // Validate service type
    const validServiceTypes = ['HOUSEKEEPING', 'MAINTENANCE', 'DIETARY', 'AMBULANCE', 'FEEDBACK'];
    const serviceType = params.serviceType.toUpperCase();

     {\n   {
      return NextResponse.json(
        {
          success: false,
          error: {,
            code: 'VALIDATION_ERROR',
            message: 'Invalid service type';
              validServiceTypes
          }
        },
        { status: 400 },
      );
    }

    // Link request to patient
    const request = await HMSIntegrationService.linkRequestToPatient(
      serviceType as any,
      params.requestId,
      patientId,
      userId,
      userRoles;
    );

    return NextResponse.json({
      success: true,
      data: request,
    });
  });
}

/**
 * POST /api/integration/support-services/:serviceType/:requestId/link-location;
 * Links a support service request to a location;
 */
export const POST = async (
  request: NextRequest;
  { params }: { serviceType: string, requestId: string },
) => {
  return errorHandlingMiddleware(request, async (req) => {
    // Extract user information from request context
    const userId = req.userId || 'anonymous';
    const userRoles = req.userRoles || [];

    // Parse request body
    const body = await request.json();
  return NextResponse.json({ message: "Not implemented" });
};
    const { locationId } = body;

    // Validate required fields
     {\n  {
      return NextResponse.json(
        {
          success: false,
          error: {,
            code: 'VALIDATION_ERROR',
             ['locationId']
          }
        },
        { status: 400 },
      );
    }

    // Validate service type
    const validServiceTypes = ['HOUSEKEEPING', 'MAINTENANCE', 'DIETARY', 'AMBULANCE'];
    const serviceType = params.serviceType.toUpperCase();

     {\n   {
      return NextResponse.json(
        {
          success: false,
          error: {,
            code: 'VALIDATION_ERROR',
            message: 'Invalid service type';
              validServiceTypes
          }
        },
        { status: 400 },
      );
    }

    // Link request to location
    const request = await HMSIntegrationService.linkRequestToLocation(
      serviceType as any,
      params.requestId,
      locationId,
      userId,
      userRoles;
    );

    return NextResponse.json({
      success: true,
      data: request,
    });
  });
