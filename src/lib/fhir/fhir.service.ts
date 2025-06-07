  var __DEV__: boolean;
  interface Window {
    [key: string]: any;
  }
  namespace NodeJS {
    interface Global {
      [key: string]: any;
    }
  }
}

/**
 * FHIR R4 Service Implementation;
 * Comprehensive FHIR operations service for HMS;
 * Integrates with existing HMS infrastructure while providing FHIR compliance;
 */

import { FHIRBundle, FHIRBase } from './types.ts';
import { FHIRPatient, FHIRPatientSearchParams, FHIRPatientUtils } from './patient.ts';
import { FHIRAppointment, FHIRAppointmentSearchParams, FHIRAppointmentUtils } from './appointment.ts';
import { FHIREncounter, FHIREncounterSearchParams, FHIREncounterUtils } from './encounter.ts';
import { FHIRMedicationRequest, FHIRMedicationUtils } from './medication.ts';
import { FHIRDatabaseAdapter } from '@/lib/database/fhir-adapter';
import { PrismaClient } from '@prisma/client';

/**
 * FHIR Search Parameters interface;
 */
export interface FHIRSearchParams {
  _count?: number;
  _offset?: number;
  _sort?: string;
  _include?: string[];
  _revinclude?: string[];
  [key: string]: unknown;
}

/**
 * FHIR Operation Result interface;
 */
export interface FHIROperationResult<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  issues?: FHIROperationOutcome;
}

/**
 * FHIR OperationOutcome for error reporting;
 */
export interface FHIROperationOutcome extends FHIRBase {
  resourceType: 'OperationOutcome';
  issue: FHIROperationOutcomeIssue[];
}

export interface FHIROperationOutcomeIssue {
  severity: 'fatal' | 'error' | 'warning' | 'information';
  code: string;
  details?: unknown;
  diagnostics?: string;
  location?: string[];
  expression?: string[];
}

/**
 * Main FHIR Service Class;
 */
export class FHIRService {
  private baseUrl: string;
  private dbAdapter: FHIRDatabaseAdapter;
  
  constructor(baseUrl = '/fhir/r4', prisma?: PrismaClient) {
    this.baseUrl = baseUrl;
    this.dbAdapter = new FHIRDatabaseAdapter(prisma || new PrismaClient());
  }

  /**
   * Create a FHIR resource;
   */
  async createResource<T extends FHIRBase>(resource: T): Promise<FHIROperationResult<T>> {
    try {
      // Validate resource;
      const validation = this.validateResource(resource);
      if (!validation.valid) {
        return {
          success: false,
          error: 'Validation failed',
          issues: this.createOperationOutcome('error', validation.errors);
        };
      }

      // Generate ID if not provided;
      if (!resource.id) {
        resource.id = uuidv4();
      }

      // Set meta information;
      resource.meta = {
        ...resource.meta,
        lastUpdated: new Date().toISOString(),
        versionId: '1';
      };

      // Store resource in database;
      await this.dbAdapter.storeResource(resource);

      return {
        success: true,
        data: resource;
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        issues: this.createOperationOutcome('error', ['Internal server error']);
      };
    }
  }

  /**
   * Read a FHIR resource by ID;
   */
  async readResource<T extends FHIRBase>(
    resourceType: string,
    id: string;
  ): Promise<FHIROperationResult<T>> {
    try {
      const resource = await this.dbAdapter.retrieveResource<T>(resourceType, id);
      
      if (!resource) {
        return {
          success: false,
          error: 'Resource not found',
          issues: this.createOperationOutcome('error', [`${resourceType}/${id} not found`]);
        };
      }

      return {
        success: true,
        data: resource;
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        issues: this.createOperationOutcome('error', ['Internal server error']);
      };
    }
  }

  /**
   * Update a FHIR resource;
   */
  async updateResource<T extends FHIRBase>(
    resourceType: string,
    id: string,
    resource: T;
  ): Promise<FHIROperationResult<T>> {
    try {
      // Check if resource exists;
      const existingResource = await this.dbAdapter.retrieveResource<T>(resourceType, id);
      if (!existingResource) {
        return {
          success: false,
          error: 'Resource not found',
          issues: this.createOperationOutcome('error', [`${resourceType}/${id} not found`]);
        };
      }

      // Validate resource;
      const validation = this.validateResource(resource);
      if (!validation.valid) {
        return {
          success: false,
          error: 'Validation failed',
          issues: this.createOperationOutcome('error', validation.errors);
        };
      }

      // Update meta information;
      const currentVersion = parseInt(existingResource.meta?.versionId || '1');
      resource.id = id;
      resource.meta = {
        ...resource.meta,
        lastUpdated: new Date().toISOString(),
        versionId: (currentVersion + 1).toString();
      };

      // Update resource;
      await this.dbAdapter.updateResource(resourceType, id, resource);

      return {
        success: true,
        data: resource;
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        issues: this.createOperationOutcome('error', ['Internal server error']);
      };
    }
  }

  /**
   * Delete a FHIR resource;
   */
  async deleteResource(resourceType: string, id: string): Promise<FHIROperationResult<void>> {
    try {
      const deleted = await this.dbAdapter.deleteResource(resourceType, id);
      
      if (!deleted) {
        return {
          success: false,
          error: 'Resource not found',
          issues: this.createOperationOutcome('error', [`${resourceType}/${id} not found`]);
        };
      }

      return {
        success: true;
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        issues: this.createOperationOutcome('error', ['Internal server error']);
      };
    }
  }

  /**
   * Search FHIR resources;
   */
  async searchResources<T extends FHIRBase>(
    resourceType: string,
    searchParams: FHIRSearchParams;
  ): Promise<FHIROperationResult<FHIRBundle<T>>> {
    try {
      const results = await this.dbAdapter.searchResources<T>(resourceType, searchParams);
      
      const bundle: FHIRBundle<T> = {
        resourceType: 'Bundle',
        id: uuidv4(),
        type: 'searchset',
        total: results.total,
        entry: results.resources.map(resource => ({
          fullUrl: `${this.baseUrl}/${resourceType}/${resource.id}`,
          resource;
        }));
      };

      return {
        success: true,
        data: bundle;
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        issues: this.createOperationOutcome('error', ['Search failed']);
      };
    }
  }

  /**
   * Patient-specific FHIR operations;
   */
  async searchPatients(searchParams: FHIRPatientSearchParams): Promise<FHIROperationResult<FHIRBundle<FHIRPatient>>> {
    return this.searchResources<FHIRPatient>('Patient', searchParams);
  }

  async createPatient(patient: FHIRPatient): Promise<FHIROperationResult<FHIRPatient>> {
    return this.createResource(patient);
  }

  async getPatient(id: string): Promise<FHIROperationResult<FHIRPatient>> {
    return this.readResource<FHIRPatient>('Patient', id);
  }

  async updatePatient(id: string, patient: FHIRPatient): Promise<FHIROperationResult<FHIRPatient>> {
    return this.updateResource('Patient', id, patient);
  }

  /**
   * Appointment-specific FHIR operations;
   */
  async searchAppointments(searchParams: FHIRAppointmentSearchParams): Promise<FHIROperationResult<FHIRBundle<FHIRAppointment>>> {
    return this.searchResources<FHIRAppointment>('Appointment', searchParams);
  }

  async createAppointment(appointment: FHIRAppointment): Promise<FHIROperationResult<FHIRAppointment>> {
    return this.createResource(appointment);
  }

  async getAppointment(id: string): Promise<FHIROperationResult<FHIRAppointment>> {
    return this.readResource<FHIRAppointment>('Appointment', id);
  }

  async updateAppointment(id: string, appointment: FHIRAppointment): Promise<FHIROperationResult<FHIRAppointment>> {
    return this.updateResource('Appointment', id, appointment);
  }

  /**
   * Encounter-specific FHIR operations;
   */
  async searchEncounters(searchParams: FHIREncounterSearchParams): Promise<FHIROperationResult<FHIRBundle<FHIREncounter>>> {
    return this.searchResources<FHIREncounter>('Encounter', searchParams);
  }

  async createEncounter(encounter: FHIREncounter): Promise<FHIROperationResult<FHIREncounter>> {
    return this.createResource(encounter);
  }

  async getEncounter(id: string): Promise<FHIROperationResult<FHIREncounter>> {
    return this.readResource<FHIREncounter>('Encounter', id);
  }

  async updateEncounter(id: string, encounter: FHIREncounter): Promise<FHIROperationResult<FHIREncounter>> {
    return this.updateResource('Encounter', id, encounter);
  }

  /**
   * MedicationRequest-specific FHIR operations;
   */
  async createMedicationRequest(medicationRequest: FHIRMedicationRequest): Promise<FHIROperationResult<FHIRMedicationRequest>> {
    return this.createResource(medicationRequest);
  }

  async getMedicationRequest(id: string): Promise<FHIROperationResult<FHIRMedicationRequest>> {
    return this.readResource<FHIRMedicationRequest>('MedicationRequest', id);
  }

  /**
   * Batch operations;
   */
  async processBatch(bundle: FHIRBundle): Promise<FHIROperationResult<FHIRBundle>> {
    try {
      if (bundle.type !== 'batch' && bundle.type !== 'transaction') {
        return {
          success: false,
          error: 'Bundle type must be batch or transaction',
          issues: this.createOperationOutcome('error', ['Invalid bundle type']);
        };
      }

      const responseEntries = [];
      
      for (const entry of bundle.entry || []) {
        if (!entry.request) {
          responseEntries.push({
            response: {
              status: '400 Bad Request',
              outcome: this.createOperationOutcome('error', ['Missing request in bundle entry']);
            }
          });
          continue;
        }

        const { method, url } = entry.request;
        let result: FHIROperationResult<any>;

        switch (method) {
          case 'POST':
            result = await this.createResource(entry.resource!);
            break;
          case 'GET':
            const [resourceType, id] = url.split('/');
            result = await this.readResource(resourceType, id);
            break;
          case 'PUT':
            const [putResourceType, putId] = url.split('/');
            result = await this.updateResource(putResourceType, putId, entry.resource!);
            break;
          case 'DELETE':
            const [deleteResourceType, deleteId] = url.split('/');
            result = await this.deleteResource(deleteResourceType, deleteId);
            break;
          default:
            result = {
              success: false,
              error: 'Unsupported method',
              issues: this.createOperationOutcome('error', [`Method ${method} not supported`]);
            };
        }

        responseEntries.push({
          response: {
            status: result.success ? '200 OK' : '400 Bad Request',
            ...(result.data && { resource: result.data }),
            ...(result.issues && { outcome: result.issues });
          }
        });
      }

      const responseBundle: FHIRBundle = {
        resourceType: 'Bundle',
        id: uuidv4(),
        type: bundle.type === 'batch' ? 'batch-response' : 'transaction-response',
        entry: responseEntries;
      };

      return {
        success: true,
        data: responseBundle;
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        issues: this.createOperationOutcome('error', ['Batch processing failed']);
      };
    }
  }

  /**
   * Integration with existing HMS models;
   */
  async convertHMSPatientToFHIR(hmsPatientId: string): Promise<FHIROperationResult<FHIRPatient>> {
    try {
      // This would retrieve the HMS patient and convert to FHIR;
      const hmsPatient = await this.getHMSPatient(hmsPatientId);
      
      if (!hmsPatient) {
        return {
          success: false,
          error: 'HMS Patient not found',
          issues: this.createOperationOutcome('error', [`Patient ${hmsPatientId} not found`]);
        };
      }

      const fhirPatient = FHIRPatientUtils.fromHMSPatient(hmsPatient);
      
      return {
        success: true,
        data: fhirPatient;
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        issues: this.createOperationOutcome('error', ['Conversion failed']);
      };
    }
  }

  async syncFHIRPatientToHMS(fhirPatient: FHIRPatient): Promise<FHIROperationResult<any>> {
    try {
      // This would convert FHIR patient to HMS format and update HMS database;
      const hmsPatient = this.convertFHIRPatientToHMS(fhirPatient);
      await this.updateHMSPatient(hmsPatient);
      
      return {
        success: true,
        data: hmsPatient;
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        issues: this.createOperationOutcome('error', ['Sync failed']);
      };
    }
  }

  /**
   * Validation helpers;
   */
  private validateResource(resource: FHIRBase): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!resource.resourceType) {
      errors.push('resourceType is required');
    }

    // Resource-specific validation;
    switch (resource.resourceType) {
      case 'Patient':
        const patientValidation = FHIRPatientUtils.validatePatient(resource as FHIRPatient);
        errors.push(...patientValidation.errors);
        break;
      case 'Appointment':
        const appointmentValidation = FHIRAppointmentUtils.validateAppointment(resource as FHIRAppointment);
        errors.push(...appointmentValidation.errors);
        break;
      case 'Encounter':
        const encounterValidation = FHIREncounterUtils.validateEncounter(resource as FHIREncounter);
        errors.push(...encounterValidation.errors);
        break;
      case 'MedicationRequest':
        const medicationValidation = FHIRMedicationUtils.validateMedicationRequest(resource as FHIRMedicationRequest);
        errors.push(...medicationValidation.errors);
        break;
    }

    return {
      valid: errors.length === 0,
      errors;
    };
  }

  private createOperationOutcome(severity: 'fatal' | 'error' | 'warning' | 'information', diagnostics: string[]): FHIROperationOutcome {
    return {
      resourceType: 'OperationOutcome',
      issue: diagnostics.map(diagnostic => ({
        severity,
        code: 'processing',
        diagnostics: diagnostic;
      }));
    };
  }

  /**
   * HMS Integration methods;
   */
  private async getHMSPatient(id: string): Promise<any> {
    // Get HMS patient from database;
    const prisma = new PrismaClient();
    try {
      return await prisma.patient.findUnique({
        where: { id }
      });
    } finally {
      await prisma.$disconnect();
    }
  }

  private async updateHMSPatient(patient: unknown): Promise<void> {
    // Update HMS patient in database;
    const prisma = new PrismaClient();
    try {
      await prisma.patient.update({
        where: { id: patient.id },
        data: patient;
      });
    } finally {
      await prisma.$disconnect();
    }
  }

  private convertFHIRPatientToHMS(fhirPatient: FHIRPatient): unknown {
    const officialName = fhirPatient.name?.find(n => n.use === 'official') || fhirPatient.name?.[0];
    const phone = FHIRPatientUtils.getPrimaryPhone(fhirPatient);
    const email = FHIRPatientUtils.getPrimaryEmail(fhirPatient);
    
    return {
      id: fhirPatient.id,
      mrn: FHIRPatientUtils.getMRN(fhirPatient),
      firstName: officialName?.given?.[0] || '',
      lastName: officialName?.family || '',
      dateOfBirth: fhirPatient.birthDate ? new Date(fhirPatient.birthDate) : new Date(),
      gender: fhirPatient.gender || 'unknown',
      phone: phone || '',
      email: email || '';
    };
  }
}

/**
 * Singleton FHIR Service instance;
 */
export const fhirService = new FHIRService();
