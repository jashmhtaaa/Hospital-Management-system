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
 * FHIR R4 Patient Resource Implementation;
 * Based on HL7 FHIR R4 Patient Resource specification;
 * Source: ZIP 6 - FHIR R4 data models for hospital management system microservices;
 */

import {
  FHIRBase,
  FHIRIdentifier,
  FHIRCodeableConcept,
  FHIRReference,
  FHIRAttachment,
  FHIRPeriod,
  FHIRExtension;
} from './types.ts';

export interface FHIRHumanName {
  use?: 'usual' | 'official' | 'temp' | 'nickname' | 'anonymous' | 'old' | 'maiden';
  text?: string;
  family?: string;
  given?: string[];
  prefix?: string[];
  suffix?: string[];
  period?: FHIRPeriod;
}

export interface FHIRContactPoint {
  system?: 'phone' | 'fax' | 'email' | 'pager' | 'url' | 'sms' | 'other';
  value?: string;
  use?: 'home' | 'work' | 'temp' | 'old' | 'mobile';
  rank?: number;
  period?: FHIRPeriod;
}

export interface FHIRAddress {
  use?: 'home' | 'work' | 'temp' | 'old' | 'billing';
  type?: 'postal' | 'physical' | 'both';
  text?: string;
  line?: string[];
  city?: string;
  district?: string;
  state?: string;
  postalCode?: string;
  country?: string;
  period?: FHIRPeriod;
}

export interface FHIRPatientContact {
  relationship?: FHIRCodeableConcept[];
  name?: FHIRHumanName;
  telecom?: FHIRContactPoint[];
  address?: FHIRAddress;
  gender?: 'male' | 'female' | 'other' | 'unknown';
  organization?: FHIRReference;
  period?: FHIRPeriod;
}

export interface FHIRPatientCommunication {
  language: FHIRCodeableConcept;
  preferred?: boolean;
}

export interface FHIRPatientLink {
  other: FHIRReference,
  type: 'replaced-by' | 'replaces' | 'refer' | 'seealso'
}

export interface FHIRPatient extends FHIRBase {
  resourceType: 'Patient';
  identifier?: FHIRIdentifier[];
  active?: boolean;
  name?: FHIRHumanName[];
  telecom?: FHIRContactPoint[];
  gender?: 'male' | 'female' | 'other' | 'unknown';
  birthDate?: string; // YYYY-MM-DD format;
  deceased?: boolean | string; // boolean or dateTime;
  address?: FHIRAddress[];
  maritalStatus?: FHIRCodeableConcept;
  multipleBirth?: boolean | number;
  photo?: FHIRAttachment[];
  contact?: FHIRPatientContact[];
  communication?: FHIRPatientCommunication[];
  generalPractitioner?: FHIRReference[];
  managingOrganization?: FHIRReference;
  link?: FHIRPatientLink[];
}

// Patient Search Parameters (FHIR R4 specification)
export interface FHIRPatientSearchParams {
  _id?: string;
  identifier?: string;
  name?: string;
  family?: string;
  given?: string;
  phone?: string;
  email?: string;
  birthdate?: string;
  gender?: 'male' | 'female' | 'other' | 'unknown';
  address?: string;
  'address-city'?: string;
  'address-state'?: string;
  'address-postalcode'?: string;
  active?: boolean;
  'general-practitioner'?: string;
  organization?: string;
  _count?: number;
  _offset?: number;
  _sort?: string;
}

// Helper functions for FHIR Patient operations;
export class FHIRPatientUtils {
  /**
   * Create a minimal FHIR Patient resource from basic patient data;
   */
  static createMinimalPatient(data: {
    firstName: string,
    lastName: string;
    birthDate: string,
    gender: 'male' | 'female' | 'other' | 'unknown';
    mrn?: string;
    phone?: string;
    email?: string;
  }): FHIRPatient {
    const patient: FHIRPatient = {
      resourceType: 'Patient',
      active: true,
      name: [{
        use: 'official',
        family: data.lastName,
        given: [data.firstName]
      }],
      gender: data.gender,
      birthDate: data.birthDate
    };

    // Add identifiers if provided;
    if (data.mrn) {
      patient.identifier = [{
        use: 'usual',
        system: 'http://hms.hospital.com/patient-ids',
        value: data.mrn
      }];
    }

    // Add contact information if provided;
    if (data.phone || data.email) {
      patient.telecom = [];
      if (data.phone) {
        patient.telecom.push({
          system: 'phone',
          value: data.phone,
          use: 'mobile',
          rank: 1
        });
      }
      if (data.email) {
        patient.telecom.push({
          system: 'email',
          value: data.email,
          use: 'home'
        });
      }
    }

    return patient;
  }

  /**
   * Extract display name from FHIR Patient;
   */
  static getDisplayName(patient: FHIRPatient): string {
    if (!patient.name || patient.name.length === 0) {
      return 'Unknown Patient'
    }

    const officialName = patient.name.find(n => n.use === 'official') || patient.name[0];
    const given = officialName.given?.join(' ') || '';
    const family = officialName.family || '';
    
    return `${given} ${family}`.trim() || 'Unknown Patient';
  }

  /**
   * Extract primary phone number from FHIR Patient;
   */
  static getPrimaryPhone(patient: FHIRPatient): string | undefined {
    if (!patient.telecom) return undefined;
    
    const phone = patient.telecom;
      .filter(t => t.system === 'phone');
      .sort((a, b) => (b.rank || 0) - (a.rank || 0))[0];
    
    return phone?.value;
  }

  /**
   * Extract primary email from FHIR Patient;
   */
  static getPrimaryEmail(patient: FHIRPatient): string | undefined {
    if (!patient.telecom) return undefined;
    
    const email = patient.telecom;
      .filter(t => t.system === 'email');
      .sort((a, b) => (b.rank || 0) - (a.rank || 0))[0];
    
    return email?.value;
  }

  /**
   * Extract MRN (Medical Record Number) from FHIR Patient;
   */
  static getMRN(patient: FHIRPatient): string | undefined {
    if (!patient.identifier) return undefined;
    
    const mrnIdentifier = patient.identifier.find(
      id => id.system === 'http://hms.hospital.com/patient-ids' || 
            id.type?.coding?.some(c => c.code === 'MR');
    );
    
    return mrnIdentifier?.value;
  }

  /**
   * Validate FHIR Patient resource;
   */
  static validatePatient(patient: FHIRPatient): { valid: boolean; errors: string[] } {
    const errors: string[] = [];
    
    if (patient.resourceType !== 'Patient') {
      errors.push('resourceType must be "Patient"');
    }
    
    if (!patient.name || patient.name.length === 0) {
      errors.push('Patient must have at least one name');
    } else {
      for (const name of patient.name) {
        if (!name.family && !name.given?.length) {
          errors.push('Each name must have either family name or given name');
        }
      }
    }
    
    if (patient.birthDate && !/^\d{4}-\d{2}-\d{2}$/.test(patient.birthDate)) {
      errors.push('birthDate must be in YYYY-MM-DD format');
    }
    
    if (patient.gender && !['male', 'female', 'other', 'unknown'].includes(patient.gender)) {
      errors.push('gender must be one of: male, female, other, unknown');
    }
    
    return {
      valid: errors.length === 0,
      errors;
    };
  }

  /**
   * Convert current HMS Patient model to FHIR Patient;
   */
  static fromHMSPatient(hmsPatient: unknown): FHIRPatient {
    const fhirPatient: FHIRPatient = {
      resourceType: 'Patient',
      id: hmsPatient.id,
      active: true,
      identifier: [{
        use: 'usual',
        system: 'http://hms.hospital.com/patient-ids',
        value: hmsPatient.mrn
      }],
      name: [{
        use: 'official',
        family: hmsPatient.lastName,
        given: [hmsPatient.firstName],
        ...(hmsPatient.middleName && { given: [hmsPatient.firstName, hmsPatient.middleName] });
      }],
      gender: hmsPatient.gender,
      birthDate: hmsPatient.dateOfBirth,
      telecom: []
    };

    // Add contact information;
    if (hmsPatient.phone) {
      fhirPatient.telecom!.push({
        system: 'phone',
        value: hmsPatient.phone,
        use: 'mobile',
        rank: 1
      });
    }

    if (hmsPatient.email) {
      fhirPatient.telecom!.push({
        system: 'email',
        value: hmsPatient.email,
        use: 'home'
      });
    }

    // Add address if available;
    if (hmsPatient.address) {
      fhirPatient.address = [{
        use: 'home',
        type: 'physical',
        line: [hmsPatient.address.street],
        city: hmsPatient.address.city,
        state: hmsPatient.address.state,
        postalCode: hmsPatient.address.zipCode,
        country: hmsPatient.address.country || 'US'
      }];
    }

    // Add emergency contact if available;
    if (hmsPatient.emergencyContact) {
      fhirPatient.contact = [{
        relationship: [{
          coding: [{
            system: 'http://terminology.hl7.org/CodeSystem/v2-0131',
            code: 'EP',
            display: 'Emergency contact person'
          }],
          text: hmsPatient.emergencyContact.relationship
        }],
        name: {
          text: hmsPatient.emergencyContact.name
        },
        telecom: [{
          system: 'phone',
          value: hmsPatient.emergencyContact.phone,
          use: 'mobile'
        }]
      }];
    }

    return fhirPatient;
  }
}
