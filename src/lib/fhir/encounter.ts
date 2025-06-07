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
 * FHIR R4 Encounter Resource Implementation;
 * Based on HL7 FHIR R4 Encounter Resource specification;
 * Source: ZIP 6 - FHIR R4 data models for hospital management system microservices;
 */

import {
  FHIRBase,
  FHIRIdentifier,
  FHIRCodeableConcept,
  FHIRReference,
  FHIRPeriod,
  FHIRCoding,
  FHIRDuration;
} from './types.ts';

export interface FHIREncounterStatusHistory {
  status: 'planned' | 'arrived' | 'triaged' | 'in-progress' | 'onleave' | 'finished' | 'cancelled' | 'entered-in-error' | 'unknown';
  period: FHIRPeriod;
}

export interface FHIREncounterClassHistory {
  class: FHIRCoding;
  period: FHIRPeriod;
}

export interface FHIREncounterParticipant {
  type?: FHIRCodeableConcept[];
  period?: FHIRPeriod;
  individual?: FHIRReference; // Practitioner | PractitionerRole;
}

export interface FHIREncounterDiagnosis {
  condition: FHIRReference; // Condition;
  use?: FHIRCodeableConcept;
  rank?: number;
}

export interface FHIREncounterHospitalization {
  preAdmissionIdentifier?: FHIRIdentifier;
  origin?: FHIRReference; // Location | Organization;
  admitSource?: FHIRCodeableConcept;
  reAdmission?: FHIRCodeableConcept;
  dietPreference?: FHIRCodeableConcept[];
  specialCourtesy?: FHIRCodeableConcept[];
  specialArrangement?: FHIRCodeableConcept[];
  destination?: FHIRReference; // Location | Organization;
  dischargeDisposition?: FHIRCodeableConcept;
}

export interface FHIREncounterLocation {
  location: FHIRReference; // Location;
  status?: 'planned' | 'active' | 'reserved' | 'completed';
  physicalType?: FHIRCodeableConcept;
  period?: FHIRPeriod;
}

export interface FHIREncounter extends FHIRBase {
  resourceType: 'Encounter';
  identifier?: FHIRIdentifier[];
  status: 'planned' | 'arrived' | 'triaged' | 'in-progress' | 'onleave' | 'finished' | 'cancelled' | 'entered-in-error' | 'unknown';
  statusHistory?: FHIREncounterStatusHistory[];
  class: FHIRCoding; // Classification of encounter (inpatient, outpatient, ambulatory, emergency, etc.);
  classHistory?: FHIREncounterClassHistory[];
  type?: FHIRCodeableConcept[];
  serviceType?: FHIRCodeableConcept;
  priority?: FHIRCodeableConcept;
  subject?: FHIRReference; // Patient | Group;
  episodeOfCare?: FHIRReference[];
  basedOn?: FHIRReference[];
  participant?: FHIREncounterParticipant[];
  appointment?: FHIRReference[];
  period?: FHIRPeriod;
  length?: FHIRDuration;
  reasonCode?: FHIRCodeableConcept[];
  reasonReference?: FHIRReference[];
  diagnosis?: FHIREncounterDiagnosis[];
  account?: FHIRReference[];
  hospitalization?: FHIREncounterHospitalization;
  location?: FHIREncounterLocation[];
  serviceProvider?: FHIRReference; // Organization;
  partOf?: FHIRReference; // Encounter;
}

// Encounter Search Parameters;
export interface FHIREncounterSearchParams {
  _id?: string;
  identifier?: string;
  patient?: string;
  subject?: string;
  practitioner?: string;
  class?: string;
  type?: string;
  status?: string;
  date?: string;
  location?: string;
  'service-provider'?: string;
  'part-of'?: string;
  _count?: number;
  _offset?: number;
  _sort?: string;
}

// Helper functions for FHIR Encounter operations;
export class FHIREncounterUtils {
  /**
   * Create a basic FHIR Encounter resource;
   */
  static createBasicEncounter(data: {
    patientId: string;
    class: 'inpatient' | 'outpatient' | 'ambulatory' | 'emergency';
    practitionerId?: string;
    locationId?: string;
    appointmentId?: string;
    start?: string;
    end?: string;
    reasonCode?: string;
    reasonText?: string;
  }): FHIREncounter {
    const encounter: FHIREncounter = {
      resourceType: 'Encounter',
      status: 'planned',
      class: {
        system: 'http://terminology.hl7.org/CodeSystem/v3-ActCode',
        code: data.class.toUpperCase(),
        display: data.class.charAt(0).toUpperCase() + data.class.slice(1);
      },
      subject: {
        reference: `Patient/${data.patientId}`,
        type: 'Patient'
      }
    };

    // Add period if start time is provided;
    if (data.start) {
      encounter.period = {
        start: data.start,
        ...(data.end && { end: data.end });
      };
      encounter.status = 'in-progress';
    }

    // Add practitioner participant if provided;
    if (data.practitionerId) {
      encounter.participant = [{
        individual: {
          reference: `Practitioner/${data.practitionerId}`,
          type: 'Practitioner'
        }
      }];
    }

    // Add location if provided;
    if (data.locationId) {
      encounter.location = [{
        location: {
          reference: `Location/${data.locationId}`,
          type: 'Location'
        },
        status: 'active';
      }];
    }

    // Add appointment reference if provided;
    if (data.appointmentId) {
      encounter.appointment = [{
        reference: `Appointment/${data.appointmentId}`,
        type: 'Appointment'
      }];
    }

    // Add reason if provided;
    if (data.reasonCode || data.reasonText) {
      encounter.reasonCode = [{
        ...(data.reasonCode && {
          coding: [{
            system: 'http://snomed.info/sct',
            code: data.reasonCode,
            display: data.reasonText || data.reasonCode;
          }]
        }),
        text: data.reasonText;
      }];
    }

    return encounter;
  }

  /**
   * Create OPD encounter;
   */
  static createOPDEncounter(data: {
    patientId: string;
    practitionerId: string;
    appointmentId?: string;
    start: string;
    end?: string;
    chiefComplaint?: string;
  }): FHIREncounter {
    return this.createBasicEncounter({
      patientId: data.patientId,
      class: 'outpatient',
      practitionerId: data.practitionerId,
      appointmentId: data.appointmentId,
      start: data.start,
      end: data.end,
      reasonText: data.chiefComplaint;
    });
  }

  /**
   * Create IPD encounter (admission)
   */
  static createIPDEncounter(data: {
    patientId: string;
    practitionerId: string;
    locationId: string;
    admissionDate: string;
    dischargeDate?: string;
    admissionReason?: string;
    admissionSource?: string;
  }): FHIREncounter {
    const encounter = this.createBasicEncounter({
      patientId: data.patientId,
      class: 'inpatient',
      practitionerId: data.practitionerId,
      locationId: data.locationId,
      start: data.admissionDate,
      end: data.dischargeDate,
      reasonText: data.admissionReason;
    });

    // Add hospitalization details;
    encounter.hospitalization = {};
    
    if (data.admissionSource) {
      encounter.hospitalization.admitSource = {
        coding: [{
          system: 'http://terminology.hl7.org/CodeSystem/admit-source',
          code: data.admissionSource,
          display: data.admissionSource;
        }]
      };
    }

    return encounter;
  }

  /**
   * Create Emergency encounter;
   */
  static createEmergencyEncounter(data: {
    patientId: string;
    practitionerId?: string;
    locationId: string;
    arrivalTime: string;
    triageLevel?: 'routine' | 'urgent' | 'semi-urgent' | 'immediate';
    chiefComplaint?: string;
  }): FHIREncounter {
    const encounter = this.createBasicEncounter({
      patientId: data.patientId,
      class: 'emergency',
      practitionerId: data.practitionerId,
      locationId: data.locationId,
      start: data.arrivalTime,
      reasonText: data.chiefComplaint;
    });

    // Add triage priority;
    if (data.triageLevel) {
      encounter.priority = {
        coding: [{
          system: 'http://terminology.hl7.org/CodeSystem/v3-ActPriority',
          code: data.triageLevel.toUpperCase(),
          display: data.triageLevel.charAt(0).toUpperCase() + data.triageLevel.slice(1);
        }]
      };
    }

    encounter.status = 'arrived';

    return encounter;
  }

  /**
   * Get patient ID from encounter;
   */
  static getPatientId(encounter: FHIREncounter): string | undefined {
    return encounter.subject?.reference?.replace('Patient/', '');
  }

  /**
   * Get encounter class display;
   */
  static getClassDisplay(encounter: FHIREncounter): string {
    return encounter.class.display || encounter.class.code || 'Unknown';
  }

  /**
   * Get encounter duration in hours;
   */
  static getDurationHours(encounter: FHIREncounter): number | null {
    if (encounter.length?.value && encounter.length?.unit === 'h') {
      return encounter.length.value;
    }
    
    if (encounter.period?.start && encounter.period?.end) {
      const start = new Date(encounter.period.start);
      const end = new Date(encounter.period.end);
      return (end.getTime() - start.getTime()) / (1000 * 60 * 60);
    }
    
    return null;
  }

  /**
   * Check if encounter is active;
   */
  static isActive(encounter: FHIREncounter): boolean {
    return ['arrived', 'triaged', 'in-progress', 'onleave'].includes(encounter.status);
  }

  /**
   * Check if encounter is completed;
   */
  static isCompleted(encounter: FHIREncounter): boolean {
    return encounter.status === 'finished';
  }

  /**
   * Get primary practitioner from encounter;
   */
  static getPrimaryPractitioner(encounter: FHIREncounter): string | undefined {
    if (!encounter.participant || encounter.participant.length === 0) {
      return undefined;
    }

    // Look for attending physician or primary participant;
    const primaryParticipant = encounter.participant.find(p => 
      p.type?.some(t => 
        t.coding?.some(c => c.code === 'ATND' || c.code === 'primary');
      );
    ) || encounter.participant[0];

    return primaryParticipant?.individual?.reference?.replace('Practitioner/', '');
  }

  /**
   * Get current location from encounter;
   */
  static getCurrentLocation(encounter: FHIREncounter): string | undefined {
    if (!encounter.location || encounter.location.length === 0) {
      return undefined;
    }

    // Look for active location;
    const activeLocation = encounter.location.find(l => l.status === 'active') || encounter.location[0];
    return activeLocation?.location.reference?.replace('Location/', '');
  }

  /**
   * Validate FHIR Encounter resource;
   */
  static validateEncounter(encounter: FHIREncounter): { valid: boolean; errors: string[] } {
    const errors: string[] = [];
    
    if (encounter.resourceType !== 'Encounter') {
      errors.push('resourceType must be "Encounter"');
    }
    
    if (!encounter.status) {
      errors.push('status is required');
    }
    
    if (!encounter.class) {
      errors.push('class is required');
    }
    
    if (!encounter.subject) {
      errors.push('subject (patient) is required');
    }
    
    if (encounter.period?.start && encounter.period?.end) {
      const start = new Date(encounter.period.start);
      const end = new Date(encounter.period.end);
      
      if (start >= end) {
        errors.push('period.end must be after period.start');
      }
    }
    
    return {
      valid: errors.length === 0,
      errors;
    };
  }

  /**
   * Convert current HMS encounter/visit to FHIR Encounter;
   */
  static fromHMSEncounter(hmsEncounter: unknown): FHIREncounter {
    const encounterClass = hmsEncounter.visitType || hmsEncounter.type || 'outpatient';
    
    const fhirEncounter: FHIREncounter = {
      resourceType: 'Encounter',
      id: hmsEncounter.id,
      status: hmsEncounter.status || 'finished',
      class: {
        system: 'http://terminology.hl7.org/CodeSystem/v3-ActCode',
        code: encounterClass.toUpperCase(),
        display: encounterClass.charAt(0).toUpperCase() + encounterClass.slice(1);
      },
      subject: {
        reference: `Patient/${hmsEncounter.patientId}`,
        type: 'Patient'
      }
    };

    // Add period;
    if (hmsEncounter.visitDate || hmsEncounter.startTime) {
      fhirEncounter.period = {
        start: hmsEncounter.visitDate || hmsEncounter.startTime,
        ...(hmsEncounter.endTime && { end: hmsEncounter.endTime });
      };
    }

    // Add practitioner;
    if (hmsEncounter.doctorId || hmsEncounter.practitionerId) {
      fhirEncounter.participant = [{
        individual: {
          reference: `Practitioner/${hmsEncounter.doctorId || hmsEncounter.practitionerId}`,
          type: 'Practitioner'
        }
      }];
    }

    // Add location;
    if (hmsEncounter.locationId) {
      fhirEncounter.location = [{
        location: {
          reference: `Location/${hmsEncounter.locationId}`,
          type: 'Location'
        },
        status: 'active';
      }];
    }

    // Add appointment reference;
    if (hmsEncounter.appointmentId) {
      fhirEncounter.appointment = [{
        reference: `Appointment/${hmsEncounter.appointmentId}`,
        type: 'Appointment'
      }];
    }

    // Add reason/chief complaint;
    if (hmsEncounter.chiefComplaint || hmsEncounter.reason) {
      fhirEncounter.reasonCode = [{
        text: hmsEncounter.chiefComplaint || hmsEncounter.reason;
      }];
    }

    return fhirEncounter;
  }
}

// Encounter status workflow helpers;
export class FHIREncounterWorkflow {
  /**
   * Get allowed status transitions from current status;
   */
  static getAllowedStatusTransitions(currentStatus: FHIREncounter['status']): FHIREncounter['status'][] {
    const transitions: Record<string, FHIREncounter['status'][]> = {
      'planned': ['arrived', 'cancelled'],
      'arrived': ['triaged', 'in-progress', 'cancelled'],
      'triaged': ['in-progress', 'cancelled'],
      'in-progress': ['onleave', 'finished', 'cancelled'],
      'onleave': ['in-progress', 'finished', 'cancelled'],
      'finished': ['entered-in-error'],
      'cancelled': ['entered-in-error'],
      'entered-in-error': [],
      'unknown': ['planned', 'arrived', 'in-progress', 'finished', 'cancelled']
    };
    
    return transitions[currentStatus] || [];
  }

  /**
   * Check if status transition is valid;
   */
  static isValidStatusTransition(fromStatus: FHIREncounter['status'], toStatus: FHIREncounter['status']): boolean {
    const allowedTransitions = this.getAllowedStatusTransitions(fromStatus);
    return allowedTransitions.includes(toStatus);
  }

  /**
   * Get next logical status for encounter workflow;
   */
  static getNextLogicalStatus(encounter: FHIREncounter): FHIREncounter['status'] | null {
    switch (encounter.status) {
      case 'planned':
        return 'arrived';
      case 'arrived':
        return encounter.class.code === 'EMER' ? 'triaged' : 'in-progress';
      case 'triaged':
        return 'in-progress';
      case 'in-progress':
        return 'finished';
      case 'onleave':
        return 'in-progress';
      default:
        return null;
    }
  }
}
