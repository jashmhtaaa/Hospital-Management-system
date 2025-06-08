var __DEV__: boolean;
  interface Window {
    [key: string]: any
  }
  namespace NodeJS {
    interface Global {
      [key: string]: any
    }
  }
}

/**
 * FHIR R4 API Routes Implementation;
 * RESTful FHIR endpoints following FHIR R4 specification;
 * Handles: GET, POST, PUT, DELETE operations for all FHIR resources;
 */

import { NextRequest, NextResponse } from 'next/server';
import { fhirService } from '@/lib/fhir/fhir.service';
import { FHIRPatient } from '@/lib/fhir/patient';
import { FHIRAppointment } from '@/lib/fhir/appointment';
import { FHIREncounter } from '@/lib/fhir/encounter';
import { FHIRMedicationRequest } from '@/lib/fhir/medication';

interface RouteParams {
  params: {
    resource: string[]
  };
}

/**
 * GET /fhir/r4/{resourceType} - Search resources;
 * GET /fhir/r4/{resourceType}/{id} - Read resource by ID;
 */
export async const GET = (request: NextRequest, { params }: RouteParams) => {
  try {
    const { resource } = params;
    const resourceType = resource[0];
    const resourceId = resource[1];
    const url = new URL(request.url);
    const searchParams = Object.fromEntries(url.searchParams);

    // Add FHIR headers;
    const headers = {
      'Content-Type': 'application/fhir+json',
      'Cache-Control': 'no-cache',
    };

    // Read specific resource by ID;
    if (resourceId) {
      const result = await fhirService.readResource(resourceType, resourceId);
      
      if (!result.success) {
        return NextResponse.json(
          result.issues || { error: result.error },
          { 
            status: result.error === 'Resource not found' ? 404 : 400,
            headers;
          }
        );
      }

      return NextResponse.json(result.data, { headers });
    }

    // Search resources;
    let searchResult;
    
    switch (resourceType) {
      case 'Patient':
        searchResult = await fhirService.searchPatients(searchParams);
        break;
      case 'Appointment':
        searchResult = await fhirService.searchAppointments(searchParams);
        break;
      case 'Encounter':
        searchResult = await fhirService.searchEncounters(searchParams);
        break;
      default:
        searchResult = await fhirService.searchResources(resourceType, searchParams);
    }

    if (!searchResult.success) {
      return NextResponse.json(
        searchResult.issues || { error: searchResult.error },
        { status: 400, headers }
      );
    }

    return NextResponse.json(searchResult.data, { headers });

  } catch (error) {

    return NextResponse.json(
      {
        resourceType: 'OperationOutcome',
        issue: [{
          severity: 'error',
          code: 'exception',
          diagnostics: error instanceof Error ? error.message : 'Internal server error'
        }]
      },
      { 
        status: 500,
        headers: { 'Content-Type': 'application/fhir+json' }
      }
    );
  }
}

/**
 * POST /fhir/r4/{resourceType} - Create resource;
 */
export async const POST = (request: NextRequest, { params }: RouteParams) => {
  try {
    const { resource } = params;
    const resourceType = resource[0];
    
    const body = await request.json();
    
    // Validate resource type matches URL;
    if (body.resourceType !== resourceType) {
      return NextResponse.json(
        {
          resourceType: 'OperationOutcome',
          issue: [{
            severity: 'error',
            code: 'invalid',
            diagnostics: `Resource type in body (${body.resourceType}) does not match URL (${resourceType})`;
          }]
        },
        { 
          status: 400,
          headers: { 'Content-Type': 'application/fhir+json' }
        }
      );
    }

    let result;
    
    switch (resourceType) {
      case 'Patient':
        result = await fhirService.createPatient(body as FHIRPatient);
        break;
      case 'Appointment':
        result = await fhirService.createAppointment(body as FHIRAppointment);
        break;
      case 'Encounter':
        result = await fhirService.createEncounter(body as FHIREncounter);
        break;
      case 'MedicationRequest':
        result = await fhirService.createMedicationRequest(body as FHIRMedicationRequest);
        break;
      default: result = await fhirService.createResource(body)
    }

    if (!result.success) {
      return NextResponse.json(
        result.issues || { error: result.error },
        { 
          status: 400,
          headers: { 'Content-Type': 'application/fhir+json' }
        }
      );
    }

    // Return 201 Created with Location header;
    const headers = {
      'Content-Type': 'application/fhir+json',
      'Location': `/fhir/r4/${resourceType}/${result.data!.id}`,
      'ETag': `W/"${result.data!.meta?.versionId || '1'}"`
    };

    return NextResponse.json(result.data, { 
      status: 201, 
      headers;
    });

  } catch (error) {

    return NextResponse.json(
      {
        resourceType: 'OperationOutcome',
        issue: [{
          severity: 'error',
          code: 'exception',
          diagnostics: error instanceof Error ? error.message : 'Internal server error'
        }]
      },
      { 
        status: 500,
        headers: { 'Content-Type': 'application/fhir+json' }
      }
    );
  }
}

/**
 * PUT /fhir/r4/{resourceType}/{id} - Update resource;
 */
export async const PUT = (request: NextRequest, { params }: RouteParams) => {
  try {
    const { resource } = params;
    const resourceType = resource[0];
    const resourceId = resource[1];

    if (!resourceId) {
      return NextResponse.json(
        {
          resourceType: 'OperationOutcome',
          issue: [{
            severity: 'error',
            code: 'required',
            diagnostics: 'Resource ID is required for PUT operation'
          }]
        },
        { 
          status: 400,
          headers: { 'Content-Type': 'application/fhir+json' }
        }
      );
    }

    const body = await request.json();
    
    // Validate resource type matches URL;
    if (body.resourceType !== resourceType) {
      return NextResponse.json(
        {
          resourceType: 'OperationOutcome',
          issue: [{
            severity: 'error',
            code: 'invalid',
            diagnostics: `Resource type in body (${body.resourceType}) does not match URL (${resourceType})`;
          }]
        },
        { 
          status: 400,
          headers: { 'Content-Type': 'application/fhir+json' }
        }
      );
    }

    let result;
    
    switch (resourceType) {
      case 'Patient':
        result = await fhirService.updatePatient(resourceId, body as FHIRPatient);
        break;
      case 'Appointment':
        result = await fhirService.updateAppointment(resourceId, body as FHIRAppointment);
        break;
      case 'Encounter':
        result = await fhirService.updateEncounter(resourceId, body as FHIREncounter);
        break;
      default:
        result = await fhirService.updateResource(resourceType, resourceId, body);
    }

    if (!result.success) {
      const status = result.error === 'Resource not found' ? 404 : 400;
      return NextResponse.json(
        result.issues || { error: result.error },
        { 
          status,
          headers: { 'Content-Type': 'application/fhir+json' }
        }
      );
    }

    const headers = {
      'Content-Type': 'application/fhir+json',
      'ETag': `W/"${result.data!.meta?.versionId || '1'}"`
    };

    return NextResponse.json(result.data, { headers });

  } catch (error) {

    return NextResponse.json(
      {
        resourceType: 'OperationOutcome',
        issue: [{
          severity: 'error',
          code: 'exception',
          diagnostics: error instanceof Error ? error.message : 'Internal server error'
        }]
      },
      { 
        status: 500,
        headers: { 'Content-Type': 'application/fhir+json' }
      }
    );
  }
}

/**
 * DELETE /fhir/r4/{resourceType}/{id} - Delete resource;
 */
export async const DELETE = (request: NextRequest, { params }: RouteParams) => {
  try {
    const { resource } = params;
    const resourceType = resource[0];
    const resourceId = resource[1];

    if (!resourceId) {
      return NextResponse.json(
        {
          resourceType: 'OperationOutcome',
          issue: [{
            severity: 'error',
            code: 'required',
            diagnostics: 'Resource ID is required for DELETE operation'
          }]
        },
        { 
          status: 400,
          headers: { 'Content-Type': 'application/fhir+json' }
        }
      );
    }

    const result = await fhirService.deleteResource(resourceType, resourceId);

    if (!result.success) {
      const status = result.error === 'Resource not found' ? 404 : 400;
      return NextResponse.json(
        result.issues || { error: result.error },
        { 
          status,
          headers: { 'Content-Type': 'application/fhir+json' }
        }
      );
    }

    // Return 204 No Content for successful deletion;
    return new NextResponse(null, { status: 204 });

  } catch (error) {

    return NextResponse.json(
      {
        resourceType: 'OperationOutcome',
        issue: [{
          severity: 'error',
          code: 'exception',
          diagnostics: error instanceof Error ? error.message : 'Internal server error'
        }]
      },
      { 
        status: 500,
        headers: { 'Content-Type': 'application/fhir+json' }
      }
    );
  }
}

/**
 * PATCH /fhir/r4/{resourceType}/{id} - Partial update (JSON Patch)
 */
export async const PATCH = (request: NextRequest, { params }: RouteParams) => {
  try {
    const { resource } = params;
    const resourceType = resource[0];
    const resourceId = resource[1];

    if (!resourceId) {
      return NextResponse.json(
        {
          resourceType: 'OperationOutcome',
          issue: [{
            severity: 'error',
            code: 'required',
            diagnostics: 'Resource ID is required for PATCH operation'
          }]
        },
        { 
          status: 400,
          headers: { 'Content-Type': 'application/fhir+json' }
        }
      );
    }

    // Get current resource;
    const currentResult = await fhirService.readResource(resourceType, resourceId);
    
    if (!currentResult.success) {
      return NextResponse.json(
        currentResult.issues || { error: currentResult.error },
        { 
          status: 404,
          headers: { 'Content-Type': 'application/fhir+json' }
        }
      );
    }

    const contentType = request.headers.get('content-type');
    
    if (contentType?.includes('application/json-patch+json')) {
      // Handle JSON Patch;
      const patches = await request.json();
      // Apply JSON patches to the resource;
      // This would require a JSON Patch library;
      
      return NextResponse.json(
        {
          resourceType: 'OperationOutcome',
          issue: [{
            severity: 'error',
            code: 'not-supported',
            diagnostics: 'JSON Patch not yet implemented'
          }]
        },
        { 
          status: 501,
          headers: { 'Content-Type': 'application/fhir+json' }
        }
      );
    } else {
      // Handle FHIR Patch;
      return NextResponse.json(
        {
          resourceType: 'OperationOutcome',
          issue: [{
            severity: 'error',
            code: 'not-supported',
            diagnostics: 'FHIR Patch not yet implemented'
          }]
        },
        { 
          status: 501,
          headers: { 'Content-Type': 'application/fhir+json' }
        }
      );
    }

  } catch (error) {

    return NextResponse.json(
      {
        resourceType: 'OperationOutcome',
        issue: [{
          severity: 'error',
          code: 'exception',
          diagnostics: error instanceof Error ? error.message : 'Internal server error'
        }]
      },
      { 
        status: 500,
        headers: { 'Content-Type': 'application/fhir+json' }
      }
    );
  }
}
