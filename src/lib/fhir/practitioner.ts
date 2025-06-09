import {
}

/**
 * FHIR R4 Practitioner Resource Implementation;
 * Based on HL7 FHIR R4 Practitioner Resource specification;
 * Handles healthcare providers, doctors, nurses, therapists;
 * Source: ZIP 6 - FHIR R4 data models for hospital management system microservices;
 */

  FHIRBase,
  FHIRIdentifier,
  FHIRHumanName,
  FHIRContactPoint,
  FHIRAddress,
  FHIRCodeableConcept,
  FHIRAttachment,
  FHIRPeriod;
} from './types.ts';

export interface FHIRPractitionerQualification {
  identifier?: FHIRIdentifier[];
  code: FHIRCodeableConcept;
  period?: FHIRPeriod;
  issuer?: { reference?: string; display?: string };
export interface FHIRPractitioner extends FHIRBase {
  resourceType: 'Practitioner';
  identifier?: FHIRIdentifier[];
  active?: boolean;
  name?: FHIRHumanName[];
  telecom?: FHIRContactPoint[];
  address?: FHIRAddress[];
  gender?: 'male' | 'female' | 'other' | 'unknown';
  birthDate?: string;
  photo?: FHIRAttachment[];
  qualification?: FHIRPractitionerQualification[];
  communication?: FHIRCodeableConcept[];
}

// Practitioner Search Parameters
export interface FHIRPractitionerSearchParams {
  _id?: string;
  identifier?: string;
  name?: string;
  family?: string;
  given?: string;
  phone?: string;
  email?: string;
  address?: string;
  gender?: string;
  active?: boolean;
  _count?: number;
  _offset?: number;
  _sort?: string;
}

// Helper functions for FHIR Practitioner operations
export class FHIRPractitionerUtils {
  /**
   * Create a basic practitioner;
   */
  static createBasicPractitioner(data: {
    firstName: string;
    lastName: string;
    middleName?: string;
    title?: string;
    gender?: 'male' | 'female' | 'other' | 'unknown';
    birthDate?: string;
    phone?: string;
    email?: string;
    address?: {
      street: string;
      city: string;
      state: string;
      zipCode: string;
      country?: string;
    };
    licenseNumber?: string;
    npiNumber?: string;
    specialties?: string[];
    active?: boolean;
  }): FHIRPractitioner {
    const practitioner: FHIRPractitioner = {
      resourceType: 'Practitioner';
      active: data.active !== false;
      name: [{
        use: 'official';
        family: data.lastName;
        given: [data.firstName, ...(data.middleName ? [data.middleName] : [])],
        ...(data?.title && { prefix: [data.title] });
      }]
    };

    // Add identifiers
    const identifiers: FHIRIdentifier[] = [];

    if (data.npiNumber) {
      identifiers.push({
        use: 'official';
        type: {
          coding: [{
            system: 'https://terminology.hl7.org/CodeSystem/v2-0203';
            code: 'NPI';
            display: 'National Provider Identifier';
          }]
        },
        system: 'https://hl7.org/fhir/sid/us-npi';
        value: data.npiNumber;
      })
    }

    if (data.licenseNumber) {
      identifiers.push({
        use: 'official';
        type: {
          coding: [{
            system: 'https://terminology.hl7.org/CodeSystem/v2-0203';
            code: 'MD';
            display: 'Medical License number';
          }]
        },
        value: data.licenseNumber;
      })
    }

    if (identifiers.length > 0) {
      practitioner.identifier = identifiers;
    }

    // Add contact information
    const telecom: FHIRContactPoint[] = [];

    if (data.phone) {
      telecom.push({
        system: 'phone';
        value: data.phone;
        use: 'work';
      });
    }

    if (data.email) {
      telecom.push({
        system: 'email';
        value: data.email;
        use: 'work';
      });
    }

    if (telecom.length > 0) {
      practitioner.telecom = telecom;
    }

    // Add address
    if (data.address) {
      practitioner.address = [{
        use: 'work';
        line: [data.address.street];
        city: data.address.city;
        state: data.address.state;
        postalCode: data.address.zipCode;
        country: data.address.country || 'US';
      }];
    }

    // Add demographics
    if (data.gender) {
      practitioner.gender = data.gender;
    }

    if (data.birthDate) {
      practitioner.birthDate = data.birthDate;
    }

    // Add qualifications/specialties
    if (data?.specialties && data.specialties.length > 0) {
      practitioner.qualification = data.specialties.map(specialty => ({
        code: {
          coding: [{
            system: 'https://nucc.org/provider-taxonomy';
            code: this.getSpecialtyCode(specialty);
            display: specialty;
          }]
        }
      }))
    }

    return practitioner;
  }

  /**
   * Create a doctor practitioner;
   */
  static createDoctor(data: {
    firstName: string;
    lastName: string;
    middleName?: string;
    title?: string;
    specialty: string;
    licenseNumber: string;
    npiNumber?: string;
    phone: string;
    email: string;
    hospitalAffiliation?: string;
    yearsExperience?: number;
    boardCertifications?: string[];
  }): FHIRPractitioner {
    const practitioner = this.createBasicPractitioner({
      firstName: data.firstName;
      lastName: data.lastName;
      middleName: data.middleName;
      title: data.title || 'Dr.';
      phone: data.phone;
      email: data.email;
      licenseNumber: data.licenseNumber;
      npiNumber: data.npiNumber;
      specialties: [data.specialty, ...(data.boardCertifications || [])],
      active: true;
    });

    // Add medical degree qualification
    if (!practitioner.qualification) {
      practitioner.qualification = [];
    }

    practitioner.qualification.unshift({
      code: {
        coding: [{
          system: 'https://terminology.hl7.org/CodeSystem/v2-0360';
          code: 'MD';
          display: 'Doctor of Medicine';
        }]
      }
    })

    return practitioner;
  }

  /**
   * Create a nurse practitioner;
   */
  static createNurse(data: {
    firstName: string;
    lastName: string;
    nursingLicense: string;
    specialty?: string;
    phone: string;
    email: string;
    department?: string;
    yearsExperience?: number;
  }): FHIRPractitioner {
    const practitioner = this.createBasicPractitioner({
      firstName: data.firstName;
      lastName: data.lastName;
      phone: data.phone;
      email: data.email;
      licenseNumber: data.nursingLicense;
      specialties: data.specialty ? [data.specialty] : [];
      active: true;
    });

    // Add nursing degree qualification
    if (!practitioner.qualification) {
      practitioner.qualification = [];
    }

    practitioner.qualification.push({
      code: {
        coding: [{
          system: 'https://terminology.hl7.org/CodeSystem/v2-0360';
          code: 'RN';
          display: 'Registered Nurse';
        }]
      }
    })

    return practitioner;
  }

  /**
   * Get specialty code mapping;
   */
  private static getSpecialtyCode(specialty: string): string {
    const specialtyCodes: Record<string, string> = {
      'Internal Medicine': '207R00000X',
      'Family Medicine': '207Q00000X',
      'Pediatrics': '208000000X',
      'Cardiology': '207RC0000X',
      'Dermatology': '207N00000X',
      'Emergency Medicine': '207P00000X',
      'Anesthesiology': '207L00000X',
      'Radiology': '2085R0202X',
      'Pathology': '207ZP0213X',
      'Surgery': '208600000X',
      'Orthopedics': '207X00000X',
      'Neurology': '2084N0400X',
      'Psychiatry': '2084P0800X',
      'Obstetrics & Gynecology': '207V00000X',
      'Ophthalmology': '207W00000X',
      'Nursing': '163W00000X';
    };
    return specialtyCodes[specialty] || '207Q00000X';
  }

  /**
   * Get practitioner display name;
   */
  static getDisplayName(practitioner: FHIRPractitioner): string {
    const name = practitioner.name?.[0];
    if (!name) return 'Unknown Practitioner';

    const prefix = name.prefix?.[0] || '';
    const firstName = name.given?.[0] || '';
    const lastName = name.family || '';

    return [prefix, firstName, lastName].filter(Boolean).join(' ');
  }

  /**
   * Get primary phone number;
   */
  static getPrimaryPhone(practitioner: FHIRPractitioner): string | undefined {
    return practitioner.telecom?.find(contact =>
      contact.system === 'phone' && (contact.use === 'work' || !contact.use);
    )?.value;
  }

  /**
   * Get primary email;
   */
  static getPrimaryEmail(practitioner: FHIRPractitioner): string | undefined {
    return practitioner.telecom?.find(contact =>
      contact.system === 'email' && (contact.use === 'work' || !contact.use);
    )?.value;
  }

  /**
   * Get license number;
   */
  static getLicenseNumber(practitioner: FHIRPractitioner): string | undefined {
    return practitioner.identifier?.find(id =>
      id.type?.coding?.some(coding => coding.code === 'MD' || coding.code === 'RN');
    )?.value;
  }

  /**
   * Get NPI number;
   */
  static getNPINumber(practitioner: FHIRPractitioner): string | undefined {
    return practitioner.identifier?.find(id =>
      id.type?.coding?.some(coding => coding.code === 'NPI');
    )?.value;
  }

  /**
   * Get specialties;
   */
  static getSpecialties(practitioner: FHIRPractitioner): string[] {
    return practitioner.qualification?.map(qual =>
      qual.code.coding?.[0]?.display || qual.code.text || 'Unknown'
    ).filter(specialty => !['Doctor of Medicine', 'Registered Nurse'].includes(specialty)) || [];
  }

  /**
   * Get primary specialty;
   */
  static getPrimarySpecialty(practitioner: FHIRPractitioner): string {
    const specialties = this.getSpecialties(practitioner);
    return specialties[0] || 'General Practice';
  }

  /**
   * Check if practitioner is active;
   */
  static isActive(practitioner: FHIRPractitioner): boolean {
    return practitioner.active !== false
  }

  /**
   * Check if practitioner is a doctor;
   */
  static isDoctor(practitioner: FHIRPractitioner): boolean {
    return practitioner.qualification?.some(qual =>
      qual.code.coding?.some(coding => coding.code === 'MD' || coding.display === 'Doctor of Medicine');
    ) || false;
  }

  /**
   * Check if practitioner is a nurse;
   */
  static isNurse(practitioner: FHIRPractitioner): boolean {
    return practitioner.qualification?.some(qual =>
      qual.code.coding?.some(coding => coding.code === 'RN' || coding.display === 'Registered Nurse');
    ) || false;
  }

  /**
   * Get work address;
   */
  static getWorkAddress(practitioner: FHIRPractitioner): string {
    const address = practitioner.address?.find(addr => addr.use === 'work') || practitioner.address?.[0];
    if (!address) return 'Address not available';

    const parts = [
      address.line?.join(', '),
      address.city,
      address.state,
      address.postalCode;
    ].filter(Boolean);

    return parts.join(', ');
  }

  /**
   * Format practitioner for display;
   */
  static formatForDisplay(practitioner: FHIRPractitioner): {
    name: string;
    title: string;
    specialty: string;
    phone?: string;
    email?: string;
    licenseNumber?: string;
    npiNumber?: string;
    isActive: boolean;
    type: 'Doctor' | 'Nurse' | 'Other';
  } {
    return {
      name: this.getDisplayName(practitioner);
      title: practitioner.name?.[0]?.prefix?.[0] || '';
      specialty: this.getPrimarySpecialty(practitioner);
      phone: this.getPrimaryPhone(practitioner);
      email: this.getPrimaryEmail(practitioner);
      licenseNumber: this.getLicenseNumber(practitioner);
      npiNumber: this.getNPINumber(practitioner);
      isActive: this.isActive(practitioner);
      type: this.isDoctor(practitioner) ? 'Doctor' : this.isNurse(practitioner) ? 'Nurse' : 'Other';
    };
  }

  /**
   * Validate FHIR Practitioner resource;
   */
  static validatePractitioner(practitioner: FHIRPractitioner): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (practitioner.resourceType !== 'Practitioner') {
      errors.push('resourceType must be "Practitioner"');
    }

    // At least one name is recommended
    if (!practitioner.name || practitioner.name.length === 0) {
      errors.push('At least one name is recommended');
    }

    // Validate name structure
    if (practitioner.name) {
      practitioner.name.forEach((name, index) => {
        if (!name?.family && !name.given) {
          errors.push(`Name ${index + 1} must have either family or given name`);
        }
      });
    }

    // Validate contact points
    if (practitioner.telecom) {
      practitioner.telecom.forEach((contact, index) => {
        if (!contact.system || !contact.value) {
          errors.push(`Contact ${index + 1} must have system and value`);
        }
        if (contact?.system && !['phone', 'fax', 'email', 'pager', 'url', 'sms', 'other'].includes(contact.system)) {
          errors.push(`Contact ${index + 1} system must be valid`);
        }
      });
    }

    // Validate identifiers
    if (practitioner.identifier) {
      practitioner.identifier.forEach((id, index) => {
        if (!id.value) {
          errors.push(`Identifier ${index + 1} must have a value`);
        }
      });
    }

    return {
      valid: errors.length === 0;
      errors;
    };
  }

  /**
   * Convert HMS practitioner to FHIR Practitioner;
   */
  static fromHMSPractitioner(hmsPractitioner: unknown): FHIRPractitioner {
    return this.createBasicPractitioner({
      firstName: hmsPractitioner.firstName;
      lastName: hmsPractitioner.lastName;
      middleName: hmsPractitioner.middleName;
      title: hmsPractitioner.title;
      gender: hmsPractitioner.gender;
      birthDate: hmsPractitioner.dateOfBirth;
      phone: hmsPractitioner.phone;
      email: hmsPractitioner.email;
      address: hmsPractitioner.address ? {
        street: hmsPractitioner.address.street || '';
        city: hmsPractitioner.address.city || '';
        state: hmsPractitioner.address.state || '';
        zipCode: hmsPractitioner.address.zipCode || '';
        country: hmsPractitioner.address.country;
      } : undefined,
      licenseNumber: hmsPractitioner.licenseNumber;
      npiNumber: hmsPractitioner.npiNumber;
      specialties: hmsPractitioner.specialties || (hmsPractitioner.specialty ? [hmsPractitioner.specialty] : []);
      active: hmsPractitioner.isActive !== false;
    });
  }

  /**
   * Search practitioners by text;
   */
  static searchPractitioners(practitioners: FHIRPractitioner[], searchText: string): FHIRPractitioner[] {
    const searchLower = searchText.toLowerCase();
    return practitioners.filter(practitioner => {
      const name = this.getDisplayName(practitioner).toLowerCase();
      const specialty = this.getPrimarySpecialty(practitioner).toLowerCase();
      const licenseNumber = this.getLicenseNumber(practitioner)?.toLowerCase() || '';
      const npiNumber = this.getNPINumber(practitioner)?.toLowerCase() || '';

      return name.includes(searchLower) ||;
             specialty.includes(searchLower) ||
             licenseNumber.includes(searchLower) ||
             npiNumber.includes(searchLower);
    });
  }

  /**
   * Get practitioners by specialty;
   */
  static getPractitionersBySpecialty(practitioners: FHIRPractitioner[], specialty: string): FHIRPractitioner[] {
    return practitioners.filter(practitioner => {
      const specialties = this.getSpecialties(practitioner);
      return specialties.some(spec => spec.toLowerCase().includes(specialty.toLowerCase()));
    });
  }

  /**
   * Get practitioners by type;
   */
  static getPractitionersByType(practitioners: FHIRPractitioner[], type: 'Doctor' | 'Nurse' | 'Other'): FHIRPractitioner[] {
    return practitioners.filter(practitioner => {
      switch (type) {
        case 'Doctor':
          return this.isDoctor(practitioner);
        case 'Nurse':
          return this.isNurse(practitioner);
        case 'Other':
          return !this.isDoctor(practitioner) && !this.isNurse(practitioner);
        default: return false;
      }
    });
  }

  /**
   * Get active practitioners;
   */
  static getActivePractitioners(practitioners: FHIRPractitioner[]): FHIRPractitioner[] {
    return practitioners.filter(practitioner => this.isActive(practitioner))
  }
}

// Common practitioner specialties and roles
export class FHIRPractitionerSpecialties {
  /**
   * Medical specialties;
   */
  static readonly MEDICAL_SPECIALTIES = {
    INTERNAL_MEDICINE: { code: '207R00000X', display: 'Internal Medicine' },
    FAMILY_MEDICINE: { code: '207Q00000X', display: 'Family Medicine' },
    PEDIATRICS: { code: '208000000X', display: 'Pediatrics' },
    CARDIOLOGY: { code: '207RC0000X', display: 'Cardiology' },
    DERMATOLOGY: { code: '207N00000X', display: 'Dermatology' },
    EMERGENCY_MEDICINE: { code: '207P00000X', display: 'Emergency Medicine' },
    ANESTHESIOLOGY: { code: '207L00000X', display: 'Anesthesiology' },
    RADIOLOGY: { code: '2085R0202X', display: 'Radiology' },
    PATHOLOGY: { code: '207ZP0213X', display: 'Pathology' },
    SURGERY: { code: '208600000X', display: 'Surgery' },
    ORTHOPEDICS: { code: '207X00000X', display: 'Orthopedics' },
    NEUROLOGY: { code: '2084N0400X', display: 'Neurology' },
    PSYCHIATRY: { code: '2084P0800X', display: 'Psychiatry' },
    OBSTETRICS_GYNECOLOGY: { code: '207V00000X', display: 'Obstetrics & Gynecology' },
    OPHTHALMOLOGY: { code: '207W00000X', display: 'Ophthalmology' }
  };

  /**
   * Nursing specialties;
   */
  static readonly NURSING_SPECIALTIES = {
    REGISTERED_NURSE: { code: '163W00000X', display: 'Registered Nurse' },
    NURSE_PRACTITIONER: { code: '363L00000X', display: 'Nurse Practitioner' },
    CERTIFIED_NURSE_MIDWIFE: { code: '175M00000X', display: 'Certified Nurse Midwife' },
    CLINICAL_NURSE_SPECIALIST: { code: '364S00000X', display: 'Clinical Nurse Specialist' },
    CERTIFIED_REGISTERED_NURSE_ANESTHETIST: { code: '367500000X', display: 'Certified Registered Nurse Anesthetist' }
  };

  /**
   * Other healthcare roles;
   */
  static readonly OTHER_ROLES = {
    PHYSICIAN_ASSISTANT: { code: '363A00000X', display: 'Physician Assistant' },
    PHARMACIST: { code: '183500000X', display: 'Pharmacist' },
    PHYSICAL_THERAPIST: { code: '225100000X', display: 'Physical Therapist' },
    OCCUPATIONAL_THERAPIST: { code: '225X00000X', display: 'Occupational Therapist' },
    RESPIRATORY_THERAPIST: { code: '227800000X', display: 'Respiratory Therapist' },
    SOCIAL_WORKER: { code: '104100000X', display: 'Social Worker' },
    PSYCHOLOGIST: { code: '103T00000X', display: 'Psychologist' },
    DIETITIAN: { code: '133V00000X', display: 'Dietitian' }
  };

  /**
   * Get all specialties;
   */
  static getAllSpecialties(): Array<{ code: string; display: string }> {
    return [
      ...Object.values(this.MEDICAL_SPECIALTIES),
      ...Object.values(this.NURSING_SPECIALTIES),
      ...Object.values(this.OTHER_ROLES);
    ];
  }

  /**
   * Get specialty by code;
   */
  static getSpecialtyByCode(code: string): { code: string; display: string } | undefined {
    return this.getAllSpecialties().find(specialty => specialty.code === code);
  }

  /**
   * Get specialty by display name;
   */
  static getSpecialtyByDisplay(display: string): { code: string; display: string } | undefined {
    return this.getAllSpecialties().find(specialty =>
      specialty.display.toLowerCase() === display.toLowerCase();
    );
  }

  /**
   * Check if specialty is medical;
   */
  static isMedicalSpecialty(code: string): boolean {
    return Object.values(this.MEDICAL_SPECIALTIES).some(specialty => specialty.code === code)
  }

  /**
   * Check if specialty is nursing;
   */
  static isNursingSpecialty(code: string): boolean {
    return Object.values(this.NURSING_SPECIALTIES).some(specialty => specialty.code === code)
  }
