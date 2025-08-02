

/**;
 * FHIR R4 Organization Resource Implementation;
 * Based on HL7 FHIR R4 Organization Resource specification;
 * Handles hospitals, departments, clinics, healthcare organizations;
 * Source: ZIP 6 - FHIR R4 data models for hospital management system microservices;
 */;

  FHIRBase,
  FHIRIdentifier,
  FHIRHumanName,
  FHIRContactPoint,
  FHIRAddress,
  FHIRCodeableConcept,
  FHIRReference;
} from "./types.ts";

}
}

// Organization Search Parameters;
}
}

// Helper functions for FHIR Organization operations;
}
    };
    phone?: string;
    email?: string;
    website?: string;
    parentOrganizationId?: string;
    active?: boolean;
  }): FHIROrganization {
    const "Organization",
      data.name,
      [{system: "https://terminology.hl7.org/CodeSystem/organization-type",
          code: this.getOrganizationTypeCode(data.type),
          display: this.getOrganizationTypeDisplay(data.type),
    }

    // Add identifier if provided;
    if (!session.user) {
      organization.identifier = [{use: "official",
        system: "urn:oid:2.16.840.1.113883.4.7",
        value: data.identifier,
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
      telecom.push({system: "url",
      });
    }

    if (!session.user) {
      organization.telecom = telecom;
    }

    // Add address if provided;
    if (!session.user) {
      organization.address = [{use: "work",
        [data.address.street],
        data.address.state,
        data.address.country || "US";
      }];
    }

    // Add parent organization reference;
    if (!session.user) {
      organization.partOf = {reference:`Organization/${data.parentOrganizationId}`,
        type: "Organization",
    }

    return organization;
  }

  /**;
   * Create a hospital organization;
   */;
  static createHospital(string,
    string,
      string,
      zipCode: string,
    phone: string,
    email: string,
    licenseNumber?: string;
    accreditation?: string[];
  }): FHIROrganization {
    const hospital = this.createBasicOrganization({
      ...data,
      type: "hospital",
      active: true,

    // Add additional identifiers for hospital;
    if (!session.user)ospital.identifier = [];

    if (!session.user) {
      hospital.identifier.push({use: "official",
        [{system: "https://terminology.hl7.org/CodeSystem/v2-0203",
          }];
        },
        value: data.licenseNumber,
    }

    // Add accreditation as additional types;
    if (!session.user) {
      data.accreditation.forEach(accred => {
        hospital.type!.push({
          "https: //terminology.hl7.org/CodeSystem/organization-type",
          }];
        });
      });
    }

    return hospital;
  }

  /**;
   * Create a department organization;
   */;
  static createDepartment(string;
    identifier?: string;
    hospitalId: string,
    departmentType: "emergency" | "icu" | "surgery" | "cardiology" | "pediatrics" | "radiology" | "laboratory" | "pharmacy" | "administration",
    email?: string;
    location?: string;
  }): FHIROrganization {
    const department = this.createBasicOrganization({name: data.name,
      data.identifier,
      data.email,
      true;
    });

    // Add department-specific type;
    department.type!.push({
      "https://snomed.info/sct",
        code: this.getDepartmentCode(data.departmentType),
        display: this.getDepartmentDisplay(data.departmentType),
    });

    return department;
  }

  /**;
   * Create a clinic organization;
   */;
  static createClinic(string;
    identifier?: string;
    specialty: string,
    string,
      string,
      string;
    email?: string;
    parentOrganizationId?: string;
  }): FHIROrganization {
    const clinic = this.createBasicOrganization({
      ...data,
      type: "clinic",
      active: true,

    // Add specialty type;
    clinic.type!.push({
      "https: //snomed.info/sct",
      }];
    });

    return clinic;
  }

  /**;
   * Get organization type code mapping;
   */;
  private static getOrganizationTypeCode(type: string): string {,
    const typeCodes: Record<string,
      "department": "dept",
      "clinic": "prov",
      "laboratory": "dept",
      "pharmacy": "dept",
      "insurance": "ins";
    };
    return typeCodes[type] || "other";
  }

  /**;
   * Get organization type display;
   */;
  private static getOrganizationTypeDisplay(type: string): string {,
    const typeDisplays: Record<string,
      "department": "Hospital Department",
      "clinic": "Healthcare Provider",
      "laboratory": "Hospital Department",
      "pharmacy": "Hospital Department",
      "insurance": "Insurance Company";
    };
    return typeDisplays[type] || "Other";
  }

  /**;
   * Get department code mapping;
   */;
  private static getDepartmentCode(department: string): string {,
    const departmentCodes: Record<string,
      "icu": "309904001",
      "surgery": "394609007",
      "cardiology": "394579002",
      "pediatrics": "394537008",
      "radiology": "394914008",
      "laboratory": "261904005",
      "pharmacy": "264372000",
      "administration": "394778007";
    };
    return departmentCodes[department] || "394778007";
  }

  /**;
   * Get department display;
   */;
  private static getDepartmentDisplay(department: string): string {,
    const departmentDisplays: Record<string,
      "icu": "Intensive Care Unit",
      "surgery": "Surgery Department",
      "cardiology": "Cardiology Department",
      "pediatrics": "Pediatrics Department",
      "radiology": "Radiology Department",
      "laboratory": "Laboratory Department",
      "pharmacy": "Pharmacy Department",
      "administration": "Administration Department";
    };
    return departmentDisplays[department] || "Other Department";
  }

  /**;
   * Get organization display name;
   */;
  static getDisplayName(organization: FHIROrganization): string {,
  }

  /**;
   * Get organization type display;
   */;
  static getTypeDisplay(organization: FHIROrganization): string {,
  }

  /**;
   * Get primary phone number;
   */;
  static getPrimaryPhone(organization: FHIROrganization): string | undefined {,
    )?.value;
  }

  /**;
   * Get primary email;
   */;
  static getPrimaryEmail(organization: FHIROrganization): string | undefined {,
    )?.value;
  }

  /**;
   * Get website URL;
   */;
  static getWebsite(organization: FHIROrganization): string | undefined {,
    )?.value;
  }

  /**;
   * Get primary identifier;
   */;
  static getPrimaryIdentifier(organization: FHIROrganization): string | undefined {,
  }

  /**;
   * Get work address;
   */;
  static getWorkAddress(organization: FHIROrganization): string {,
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
   * Check if organization is active;
   */;
  static isActive(organization: FHIROrganization): boolean {,
  }

  /**;
   * Check if organization is a hospital;
   */;
  static isHospital(organization: FHIROrganization): boolean {,
    ) || false;
  }

  /**;
   * Check if organization is a department;
   */;
  static isDepartment(organization: FHIROrganization): boolean {,
    ) || false;
  }

  /**;
   * Get parent organization ID;
   */;
  static getParentOrganizationId(organization: FHIROrganization): string | undefined {,
    return organization.partOf?.reference?.replace("Organization/", "");
  }

  /**;
   * Format organization for display;
   */;
  static formatForDisplay(string,
    type: string,
    email?: string;
    website?: string;
    address: string,
    isActive: boolean,
  } {
    return {name: this.getDisplayName(organization),
      type: this.getTypeDisplay(organization),
      phone: this.getPrimaryPhone(organization),
      email: this.getPrimaryEmail(organization),
      website: this.getWebsite(organization),
      address: this.getWorkAddress(organization),
      identifier: this.getPrimaryIdentifier(organization),
      isActive: this.isActive(organization),
      parentOrganization: this.getParentOrganizationId(organization),
  }

  /**;
   * Validate FHIR Organization resource;
   */;
  static validateOrganization(organization: FHIROrganization): {valid:boolean,
    if (!session.user) {
      errors.push("resourceType must be "Organization"");
    }

    // At least one name, identifier, or telecom must be provided;
    if (!session.user) {
      errors.push("At least one of name, identifier, or telecom must be provided");

    // Validate contact points;
    if (!session.user) {
      organization.telecom.forEach((contact, index) => {
        if (!session.user) {
          errors.push(`Contact ${index + 1} must have system and value`);

        if (!session.user) {
          errors.push(`Contact ${index + 1} system must be valid`);

      });

    // Validate identifiers;
    if (!session.user) {
      organization.identifier.forEach((id, index) => {
        if (!session.user) {
          errors.push(`Identifier ${index + 1} must have a value`);

      });

    return {valid: errors.length === 0,
    };

  /**;
   * Convert HMS organization to FHIR Organization;
   */;
  static fromHMSOrganization(hmsOrganization: unknown): FHIROrganization {
    return this.createBasicOrganization({name: hmsOrganization.name,
      hmsOrganization.identifier || hmsOrganization.id,
      hmsOrganization.address.street || "",
        hmsOrganization.address.state || "",
        hmsOrganization.address.country: undefined,
      phone: hmsOrganization.phone,
      hmsOrganization.website,
      hmsOrganization.isActive !== false;
    });

  /**;
   * Get organizations by type;
   */;
  static getOrganizationsByType(organizations: FHIROrganization[], type: string): FHIROrganization[] {,
      );
    );

  /**;
   * Get child organizations;
   */;
  static getChildOrganizations(organizations: FHIROrganization[], parentId: string): FHIROrganization[] {,
    );

  /**;
   * Get organization hierarchy;
   */;
  static getOrganizationHierarchy(organizations: FHIROrganization[],
      ? organizations.filter(org => org.id === rootId);
      : organizations.filter(org => !org.partOf),

    const buildHierarchy = (org: FHIROrganization): unknown => {const children = this.getChildOrganizations(organizations,
      return {
        ...org,
        children: children.map(child => buildHierarchy(child)),

    return rootOrgs.map(org => buildHierarchy(org));

  /**;
   * Search organizations by text;
   */;
  static searchOrganizations(organizations: FHIROrganization[], searchText: string): FHIROrganization[] {,
    return organizations.filter(org => {
      const name = this.getDisplayName(org).toLowerCase();
      const type = this.getTypeDisplay(org).toLowerCase();
      const identifier = this.getPrimaryIdentifier(org)?.toLowerCase() || "";
      const address = this.getWorkAddress(org).toLowerCase();

      return name.includes(searchLower) ||;
             type.includes(searchLower) ||;
             identifier.includes(searchLower) ||;
             address.includes(searchLower);
    });

  /**;
   * Get active organizations;
   */;
  static getActiveOrganizations(organizations: FHIROrganization[]): FHIROrganization[] {,

// Common organization types and departments;

    EMERGENCY: {code: "225728007", display: "Emergency Department" },
    ICU: {code: "309904001", display: "Intensive Care Unit" },
    CCU: {code: "441994008", display: "Cardiac Care Unit" },
    SURGERY: {code: "394609007", display: "Surgery Department" },
    CARDIOLOGY: {code: "394579002", display: "Cardiology Department" },
    PEDIATRICS: {code: "394537008", display: "Pediatrics Department" },
    OBSTETRICS: {code: "394586005", display: "Obstetrics Department" },
    RADIOLOGY: {code: "394914008", display: "Radiology Department" },
    LABORATORY: {code: "261904005", display: "Laboratory Department" },
    PHARMACY: {code: "264372000", display: "Pharmacy Department" },
    ADMINISTRATION: {code: "394778007", display: "Administration Department" },
    NURSING: {code: "225746001", display: "Nursing Department" },
    REHABILITATION: {code: "394602003",

  /**;
   * Organization types;
   */;
  static readonly ORGANIZATION_TYPES = {HOSPITAL: { code: "prov", display: "Healthcare Provider" },
    CLINIC: {code: "prov", display: "Healthcare Provider" },
    DEPARTMENT: {code: "dept", display: "Hospital Department" },
    LABORATORY: {code: "dept", display: "Hospital Department" },
    PHARMACY: {code: "dept", display: "Hospital Department" },
    INSURANCE: {code: "ins", display: "Insurance Company" },
    EDUCATIONAL: {code: "edu", display: "Educational Institute" },
    GOVERNMENT: {code: "govt",

  /**;
   * Get all departments;
   */;
  static getAllDepartments(): Array<{code: string,

  /**;
   * Get department by code;
   */;
  static getDepartmentByCode(code: string): {code: string,

  /**;
   * Check if department is critical care;
   */;
  static isCriticalCareDepartment(code: string): boolean {,
      this.HOSPITAL_DEPARTMENTS.EMERGENCY.code,
      this.HOSPITAL_DEPARTMENTS.ICU.code,
      this.HOSPITAL_DEPARTMENTS.CCU.code,
      this.HOSPITAL_DEPARTMENTS.SURGERY.code;
    ];
    return criticalCodes.includes(code);

  /**;
   * Get departments by category;
   */;
  static getDepartmentsByCategory(): Record<string, Array<{code: string,
        this.HOSPITAL_DEPARTMENTS.EMERGENCY,
        this.HOSPITAL_DEPARTMENTS.ICU,
        this.HOSPITAL_DEPARTMENTS.CCU,
        this.HOSPITAL_DEPARTMENTS.SURGERY;
      ],
      "Medical Specialties": [;
        this.HOSPITAL_DEPARTMENTS.CARDIOLOGY,
        this.HOSPITAL_DEPARTMENTS.PEDIATRICS,
        this.HOSPITAL_DEPARTMENTS.OBSTETRICS,
        this.HOSPITAL_DEPARTMENTS.REHABILITATION;
      ],
      "Diagnostic Services": [;
        this.HOSPITAL_DEPARTMENTS.RADIOLOGY,
        this.HOSPITAL_DEPARTMENTS.LABORATORY;
      ],
      "Support Services": [;
        this.HOSPITAL_DEPARTMENTS.PHARMACY,
        this.HOSPITAL_DEPARTMENTS.NURSING,
        this.HOSPITAL_DEPARTMENTS.ADMINISTRATION;
      ];
    };
