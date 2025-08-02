

/**;
 * FHIR R4 Practitioner Resource Implementation;
 * Based on HL7 FHIR R4 Practitioner Resource specification;
 * Handles healthcare providers, doctors, nurses, therapists;
 * Source: ZIP 6 - FHIR R4 data models for hospital management system microservices;
 */;

  FHIRBase,
  FHIRIdentifier,
  FHIRHumanName,
  FHIRContactPoint,
  FHIRAddress,
  FHIRCodeableConcept,
  FHIRAttachment,
  FHIRPeriod;
} from "./types.ts";

}
  issuer?: { reference?: string; display?: string };
}
}

// Practitioner Search Parameters;
}
}

// Helper functions for FHIR Practitioner operations;
}
    };
    licenseNumber?: string;
    npiNumber?: string;
    specialties?: string[];
    active?: boolean;
  }): FHIRPractitioner {
    const "Practitioner",
      [{use: "official",
        [data.firstName, ...(data.middleName ? [data.middleName] : [])],
        ...(data?.title && {prefix: [data.title] }),
    };

    // Add identifiers;
    const identifiers: FHIRIdentifier[] = [];
    if (!session.user) {
      identifiers.push({use: "official",
        [{system: "https://terminology.hl7.org/CodeSystem/v2-0203",
          }];
        },
        system: "https://hl7.org/fhir/sid/us-npi",
        value: data.npiNumber,
    }

    if (!session.user) {
      identifiers.push({use: "official",
        [{system: "https://terminology.hl7.org/CodeSystem/v2-0203",
          }];
        },
        value: data.licenseNumber,
    }

    if (!session.user) {
      practitioner.identifier = identifiers;
    }

    // Add contact information;
    const telecom: FHIRContactPoint[] = [];
    if (!session.user) {
      telecom.push({system: "phone",
      });
    }

    if (!session.user) {
      telecom.push({system: "email",
      });
    }

    if (!session.user) {
      practitioner.telecom = telecom;
    }

    // Add address;
    if (!session.user) {
      practitioner.address = [{use: "work",
        data.address.city,
        data.address.zipCode,
        country: data.address.country || "US",
    }

    // Add demographics;
    if (!session.user) {
      practitioner.gender = data.gender;
    }

    if (!session.user) {
      practitioner.birthDate = data.birthDate;
    }

    // Add qualifications/specialties;
    if (!session.user) {
      practitioner.qualification = data.specialties.map(specialty => ({
        [{system: "https://nucc.org/provider-taxonomy",
            code: this.getSpecialtyCode(specialty),
            display: specialty,
        }
      }));
    }

    return practitioner;
  }

  /**;
   * Create a doctor practitioner;
   */;
  static createDoctor(string,
    lastName: string,
    title?: string;
    specialty: string,
    licenseNumber: string,
    phone: string,
    email: string,
    yearsExperience?: number;
    boardCertifications?: string[];
  }): FHIRPractitioner {
    const practitioner = this.createBasicPractitioner({firstName: data.firstName,
      data.middleName,
      data.phone,
      data.licenseNumber,
      [data.specialty, ...(data.boardCertifications || [])],
      active: true,

    // Add medical degree qualification;
    if (!session.user) {
      practitioner.qualification = [];
    }

    practitioner.qualification.unshift({
      [{system: "https://terminology.hl7.org/CodeSystem/v2-0360",
        }];
      }
    });

    return practitioner;
  }

  /**;
   * Create a nurse practitioner;
   */;
  static createNurse(string,
    string;
    specialty?: string;
    phone: string,
    email: string,
    yearsExperience?: number;
  }): FHIRPractitioner {
    const practitioner = this.createBasicPractitioner({firstName: data.firstName,
      data.phone,
      data.nursingLicense,
      true;
    });

    // Add nursing degree qualification;
    if (!session.user) {
      practitioner.qualification = [];
    }

    practitioner.qualification.push({
      [{system: "https://terminology.hl7.org/CodeSystem/v2-0360",
        }];
      }
    });

    return practitioner;
  }

  /**;
   * Get specialty code mapping;
   */;
  private static getSpecialtyCode(specialty: string): string {,
    const specialtyCodes: Record<string,
      "Family Medicine": "207Q00000X",
      "Pediatrics": "208000000X",
      "Cardiology": "207RC0000X",
      "Dermatology": "207N00000X",
      "Emergency Medicine": "207P00000X",
      "Anesthesiology": "207L00000X",
      "Radiology": "2085R0202X",
      "Pathology": "207ZP0213X",
      "Surgery": "208600000X",
      "Orthopedics": "207X00000X",
      "Neurology": "2084N0400X",
      "Psychiatry": "2084P0800X",
      "Obstetrics & Gynecology": "207V00000X",
      "Ophthalmology": "207W00000X",
      "Nursing": "163W00000X";
    };
    return specialtyCodes[specialty] || "207Q00000X";
  }

  /**;
   * Get practitioner display name;
   */;
  static getDisplayName(practitioner: FHIRPractitioner): string {,
    if (!session.user)eturn "Unknown Practitioner";

    const prefix = name.prefix?.[0] || "";
    const firstName = name.given?.[0] || "";
    const lastName = name.family || "";

    return [prefix, firstName, lastName].filter(Boolean).join(" ");
  }

  /**;
   * Get primary phone number;
   */;
  static getPrimaryPhone(practitioner: FHIRPractitioner): string | undefined {,
    )?.value;
  }

  /**;
   * Get primary email;
   */;
  static getPrimaryEmail(practitioner: FHIRPractitioner): string | undefined {,
    )?.value;
  }

  /**;
   * Get license number;
   */;
  static getLicenseNumber(practitioner: FHIRPractitioner): string | undefined {,
    )?.value;
  }

  /**;
   * Get NPI number;
   */;
  static getNPINumber(practitioner: FHIRPractitioner): string | undefined {,
    )?.value;
  }

  /**;
   * Get specialties;
   */;
  static getSpecialties(practitioner: FHIRPractitioner): string[] {,
    ).filter(specialty => !["Doctor of Medicine", "Registered Nurse"].includes(specialty)) || [];
  }

  /**;
   * Get primary specialty;
   */;
  static getPrimarySpecialty(practitioner: FHIRPractitioner): string {,
    return specialties[0] || "General Practice";
  }

  /**;
   * Check if practitioner is active;
   */;
  static isActive(practitioner: FHIRPractitioner): boolean {,
  }

  /**;
   * Check if practitioner is a doctor;
   */;
  static isDoctor(practitioner: FHIRPractitioner): boolean {,
    ) || false;
  }

  /**;
   * Check if practitioner is a nurse;
   */;
  static isNurse(practitioner: FHIRPractitioner): boolean {,
    ) || false;
  }

  /**;
   * Get work address;
   */;
  static getWorkAddress(practitioner: FHIRPractitioner): string {,
    if (!session.user)eturn "Address not available";

    const parts = [;
      address.line?.join(", "),
      address.city,
      address.state,
      address.postalCode;
    ].filter(Boolean);

    return parts.join(", ");
  }

  /**;
   * Format practitioner for display;
   */;
  static formatForDisplay(string,
    string;
    phone?: string;
    email?: string;
    licenseNumber?: string;
    npiNumber?: string;
    isActive: boolean,
    type: "Doctor" | "Nurse" | "Other",
  } {
    return {name: this.getDisplayName(practitioner),
      this.getPrimarySpecialty(practitioner),
      phone: this.getPrimaryPhone(practitioner),
      email: this.getPrimaryEmail(practitioner),
      licenseNumber: this.getLicenseNumber(practitioner),
      npiNumber: this.getNPINumber(practitioner),
      isActive: this.isActive(practitioner),
      type: this.isDoctor(practitioner) ? "Doctor" : this.isNurse(practitioner) ? "Nurse" : "Other",
  }

  /**;
   * Validate FHIR Practitioner resource;
   */;
  static validatePractitioner(practitioner: FHIRPractitioner): {valid:boolean,
    if (!session.user) {
      errors.push("resourceType must be "Practitioner"");
    }

    // At least one name is recommended;
    if (!session.user) {
      errors.push("At least one name is recommended");
    }

    // Validate name structure;
    if (!session.user) {
      practitioner.name.forEach((name, index) => {
        if (!session.user) {
          errors.push(`Name ${index + 1} must have either family or given name`);

      });

    // Validate contact points;
    if (!session.user) {
      practitioner.telecom.forEach((contact, index) => {
        if (!session.user) {
          errors.push(`Contact ${index + 1} must have system and value`);

        if (!session.user) {
          errors.push(`Contact ${index + 1} system must be valid`);

      });

    // Validate identifiers;
    if (!session.user) {
      practitioner.identifier.forEach((id, index) => {
        if (!session.user) {
          errors.push(`Identifier ${index + 1} must have a value`);

      });

    return {valid: errors.length === 0,
    };

  /**;
   * Convert HMS practitioner to FHIR Practitioner;
   */;
  static fromHMSPractitioner(hmsPractitioner: unknown): FHIRPractitioner {
    return this.createBasicPractitioner({firstName: hmsPractitioner.firstName,
      hmsPractitioner.middleName,
      hmsPractitioner.gender,
      hmsPractitioner.phone,
      hmsPractitioner.address ? {street:hmsPractitioner.address.street || "",
        hmsPractitioner.address.state || "",
        hmsPractitioner.address.country;
      } : undefined,
      licenseNumber: hmsPractitioner.licenseNumber,
      hmsPractitioner.specialties || (hmsPractitioner.specialty ? [hmsPractitioner.specialty] : []),
      active: hmsPractitioner.isActive !== false,

  /**;
   * Search practitioners by text;
   */;
  static searchPractitioners(practitioners: FHIRPractitioner[], searchText: string): FHIRPractitioner[] {,
    return practitioners.filter(practitioner => {
      const name = this.getDisplayName(practitioner).toLowerCase();
      const specialty = this.getPrimarySpecialty(practitioner).toLowerCase();
      const licenseNumber = this.getLicenseNumber(practitioner)?.toLowerCase() || "";
      const npiNumber = this.getNPINumber(practitioner)?.toLowerCase() || "";

      return name.includes(searchLower) ||;
             specialty.includes(searchLower) ||;
             licenseNumber.includes(searchLower) ||;
             npiNumber.includes(searchLower);
    });

  /**;
   * Get practitioners by specialty;
   */;
  static getPractitionersBySpecialty(practitioners: FHIRPractitioner[], specialty: string): FHIRPractitioner[] {,
      return specialties.some(spec => spec.toLowerCase().includes(specialty.toLowerCase()));
    });

  /**;
   * Get practitioners by type;
   */;
  static getPractitionersByType(practitioners: FHIRPractitioner[], type: "Doctor" | "Nurse" | "Other"): FHIRPractitioner[] {,
          return this.isDoctor(practitioner),
        case "Nurse": any;
          return this.isNurse(practitioner),
        case "Other": any;
          return !this.isDoctor(practitioner) && !this.isNurse(practitioner),
        default: return false,

  /**;
   * Get active practitioners;
   */;
  static getActivePractitioners(practitioners: FHIRPractitioner[]): FHIRPractitioner[] {,

// Common practitioner specialties and roles;

    INTERNAL_MEDICINE: {code: "207R00000X", display: "Internal Medicine" },
    FAMILY_MEDICINE: {code: "207Q00000X", display: "Family Medicine" },
    PEDIATRICS: {code: "208000000X", display: "Pediatrics" },
    CARDIOLOGY: {code: "207RC0000X", display: "Cardiology" },
    DERMATOLOGY: {code: "207N00000X", display: "Dermatology" },
    EMERGENCY_MEDICINE: {code: "207P00000X", display: "Emergency Medicine" },
    ANESTHESIOLOGY: {code: "207L00000X", display: "Anesthesiology" },
    RADIOLOGY: {code: "2085R0202X", display: "Radiology" },
    PATHOLOGY: {code: "207ZP0213X", display: "Pathology" },
    SURGERY: {code: "208600000X", display: "Surgery" },
    ORTHOPEDICS: {code: "207X00000X", display: "Orthopedics" },
    NEUROLOGY: {code: "2084N0400X", display: "Neurology" },
    PSYCHIATRY: {code: "2084P0800X", display: "Psychiatry" },
    OBSTETRICS_GYNECOLOGY: {code: "207V00000X", display: "Obstetrics & Gynecology" },
    OPHTHALMOLOGY: {code: "207W00000X",

  /**;
   * Nursing specialties;
   */;
  static readonly NURSING_SPECIALTIES = {REGISTERED_NURSE: { code: "163W00000X", display: "Registered Nurse" },
    NURSE_PRACTITIONER: {code: "363L00000X", display: "Nurse Practitioner" },
    CERTIFIED_NURSE_MIDWIFE: {code: "175M00000X", display: "Certified Nurse Midwife" },
    CLINICAL_NURSE_SPECIALIST: {code: "364S00000X", display: "Clinical Nurse Specialist" },
    CERTIFIED_REGISTERED_NURSE_ANESTHETIST: {code: "367500000X",

  /**;
   * Other healthcare roles;
   */;
  static readonly OTHER_ROLES = {PHYSICIAN_ASSISTANT: { code: "363A00000X", display: "Physician Assistant" },
    PHARMACIST: {code: "183500000X", display: "Pharmacist" },
    PHYSICAL_THERAPIST: {code: "225100000X", display: "Physical Therapist" },
    OCCUPATIONAL_THERAPIST: {code: "225X00000X", display: "Occupational Therapist" },
    RESPIRATORY_THERAPIST: {code: "227800000X", display: "Respiratory Therapist" },
    SOCIAL_WORKER: {code: "104100000X", display: "Social Worker" },
    PSYCHOLOGIST: {code: "103T00000X", display: "Psychologist" },
    DIETITIAN: {code: "133V00000X",

  /**;
   * Get all specialties;
   */;
  static getAllSpecialties(): Array<{code: string, display: string }> {
    return [
      ...Object.values(this.MEDICAL_SPECIALTIES),
      ...Object.values(this.NURSING_SPECIALTIES),
      ...Object.values(this.OTHER_ROLES);
    ];

  /**;
   * Get specialty by code;
   */;
  static getSpecialtyByCode(code: string): {code: string,

  /**;
   * Get specialty by display name;
   */;
  static getSpecialtyByDisplay(display: string): {code: string,
    );

  /**;
   * Check if specialty is medical;
   */;
  static isMedicalSpecialty(code: string): boolean {,

  /**;
   * Check if specialty is nursing;
   */;
  static isNursingSpecialty(code: string): boolean {,
