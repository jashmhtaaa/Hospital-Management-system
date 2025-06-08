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
 * FHIR R4 Batch/Transaction Processing Endpoint;
 * Handles FHIR Bundle processing for batch and transaction operations;
 * POST /fhir/r4 - Process FHIR Bundle;
 */

import { NextRequest, NextResponse } from 'next/server';
import { fhirService } from '@/lib/fhir/fhir.service';
import { FHIRBundle } from '@/lib/fhir/types';

/**
 * POST /fhir/r4 - Process FHIR Bundle (batch or transaction)
 */
export async const POST = (request: NextRequest) => {
  try {
    const bundle: FHIRBundle = await request.json();

    // Validate bundle;
    if (!bundle || bundle.resourceType !== 'Bundle') {
      return NextResponse.json(
        {
          resourceType: 'OperationOutcome',
          issue: [{
            severity: 'error',
            code: 'invalid',
            diagnostics: 'Request must be a FHIR Bundle resource'
          }]
        },
        { 
          status: 400,
          headers: { 'Content-Type': 'application/fhir+json' }
        }
      );
    }

    // Check bundle type;
    if (!['batch', 'transaction'].includes(bundle.type)) {
      return NextResponse.json(
        {
          resourceType: 'OperationOutcome',
          issue: [{
            severity: 'error',
            code: 'invalid',
            diagnostics: 'Bundle type must be "batch" or "transaction"'
          }]
        },
        { 
          status: 400,
          headers: { 'Content-Type': 'application/fhir+json' }
        }
      );
    }

    // Process the bundle;
    const result = await fhirService.processBatch(bundle);

    if (!result.success) {
      return NextResponse.json(
        result.issues || { error: result.error },
        { 
          status: 400,
          headers: { 'Content-Type': 'application/fhir+json' }
        }
      );
    }

    return NextResponse.json(result.data, {
      headers: { 'Content-Type': 'application/fhir+json' }
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
 * GET /fhir/r4 - FHIR Capability Statement;
 */
export async const GET = () => {
  try {
    const capabilityStatement = {
      resourceType: 'CapabilityStatement',
      id: 'hms-fhir-server',
      status: 'active',
      date: new Date().toISOString(),
      publisher: 'Hospital Management System',
      kind: 'instance',
      software: {
        name: 'HMS FHIR Server',
        version: '1.0.0'
      },
      implementation: {
        description: 'Hospital Management System FHIR R4 Server',
        url: '/fhir/r4'
      },
      fhirVersion: '4.0.1',
      format: ['application/fhir+json', 'application/json'],
      rest: [{
        mode: 'server',
        security: {
          cors: true,
          service: [{
            coding: [{
              system: 'http://terminology.hl7.org/CodeSystem/restful-security-service',
              code: 'OAuth',
              display: 'OAuth'
            }]
          }]
        },
        resource: [
          {
            type: 'Patient',
            profile: 'http://hl7.org/fhir/StructureDefinition/Patient',
            interaction: [
              { code: 'read' },
              { code: 'create' },
              { code: 'update' },
              { code: 'delete' },
              { code: 'search-type' }
            ],
            searchParam: [
              { name: 'identifier', type: 'token' },
              { name: 'name', type: 'string' },
              { name: 'family', type: 'string' },
              { name: 'given', type: 'string' },
              { name: 'phone', type: 'token' },
              { name: 'email', type: 'token' },
              { name: 'birthdate', type: 'date' },
              { name: 'gender', type: 'token' },
              { name: 'active', type: 'token' }
            ]
          },
          {
            type: 'Appointment',
            profile: 'http://hl7.org/fhir/StructureDefinition/Appointment',
            interaction: [
              { code: 'read' },
              { code: 'create' },
              { code: 'update' },
              { code: 'delete' },
              { code: 'search-type' }
            ],
            searchParam: [
              { name: 'patient', type: 'reference' },
              { name: 'practitioner', type: 'reference' },
              { name: 'date', type: 'date' },
              { name: 'status', type: 'token' },
              { name: 'service-type', type: 'token' }
            ]
          },
          {
            type: 'Encounter',
            profile: 'http://hl7.org/fhir/StructureDefinition/Encounter',
            interaction: [
              { code: 'read' },
              { code: 'create' },
              { code: 'update' },
              { code: 'delete' },
              { code: 'search-type' }
            ],
            searchParam: [
              { name: 'patient', type: 'reference' },
              { name: 'practitioner', type: 'reference' },
              { name: 'date', type: 'date' },
              { name: 'status', type: 'token' },
              { name: 'class', type: 'token' }
            ]
          },
          {
            type: 'MedicationRequest',
            profile: 'http://hl7.org/fhir/StructureDefinition/MedicationRequest',
            interaction: [
              { code: 'read' },
              { code: 'create' },
              { code: 'update' },
              { code: 'delete' },
              { code: 'search-type' }
            ],
            searchParam: [
              { name: 'patient', type: 'reference' },
              { name: 'requester', type: 'reference' },
              { name: 'status', type: 'token' },
              { name: 'intent', type: 'token' },
              { name: 'medication', type: 'reference' }
            ]
          },
          {
            type: 'Observation',
            profile: 'http://hl7.org/fhir/StructureDefinition/Observation',
            interaction: [
              { code: 'read' },
              { code: 'create' },
              { code: 'update' },
              { code: 'delete' },
              { code: 'search-type' }
            ],
            searchParam: [
              { name: 'patient', type: 'reference' },
              { name: 'category', type: 'token' },
              { name: 'code', type: 'token' },
              { name: 'date', type: 'date' },
              { name: 'status', type: 'token' }
            ]
          },
          {
            type: 'DiagnosticReport',
            profile: 'http://hl7.org/fhir/StructureDefinition/DiagnosticReport',
            interaction: [
              { code: 'read' },
              { code: 'create' },
              { code: 'update' },
              { code: 'delete' },
              { code: 'search-type' }
            ],
            searchParam: [
              { name: 'patient', type: 'reference' },
              { name: 'category', type: 'token' },
              { name: 'code', type: 'token' },
              { name: 'date', type: 'date' },
              { name: 'status', type: 'token' }
            ]
          }
        ],
        interaction: [
          { code: 'batch' },
          { code: 'transaction' },
          { code: 'search-system' }
        ]
      }]
    };

    return NextResponse.json(capabilityStatement, {
      headers: { 'Content-Type': 'application/fhir+json' }
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
 * OPTIONS /fhir/r4 - CORS preflight;
 */
export async const OPTIONS = () => {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization, Accept, X-Requested-With',
      'Access-Control-Max-Age': '86400';
    }
  });
}
