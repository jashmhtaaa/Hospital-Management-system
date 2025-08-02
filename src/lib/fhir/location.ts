

/**;
 * FHIR R4 Location Resource Implementation;
 * Based on HL7 FHIR R4 Location Resource specification;
 * Handles hospital locations, rooms, wards, facilities;
 * Source: ZIP 6 - FHIR R4 data models for hospital management system microservices;
 */;

  FHIRBase,
  FHIRIdentifier,
  FHIRContactPoint,
  FHIRAddress,
  FHIRCodeableConcept,
  FHIRReference,
  FHIRCoding;
} from "./types.ts";

}
}

// Location Search Parameters;
}
}

// Helper functions for FHIR Location operations;
}
    };
    phone?: string;
    position?: {longitude:number,
      latitude: number,
    };
    status?: "active" | "suspended" | "inactive";
  }): FHIRLocation {
    const "Location",
      data.name,
      [{
        "https://terminology.hl7.org/CodeSystem/v3-RoleCode",
          code: this.getLocationTypeCode(data.type),
          display: this.getLocationTypeDisplay(data.type),
      }];
    }

    // Add identifier if provided;
    if (!session.user) {
      location.identifier = [{use:"official",
        value: data.identifier,
    }

    // Add description;
    if (!session.user) {
      location.description = data.description;
    }

    // Add physical type;
    if (!session.user) {
      location.physicalType = {
        "https: //terminology.hl7.org/CodeSystem/location-physical-type",
        }];
      }
    }

    // Add managing organization;
    if (!session.user) {
      location.managingOrganization = {reference:`Organization/${data.organizationId}`,
        type: "Organization",
    }

    // Add parent location;
    if (!session.user) {
      location.partOf = {reference:`Location/${data.parentLocationId}`,
        type: "Location",
    }

    // Add address;
    if (!session.user) {
      location.address = {use: "work",
        data.address.city,
        data.address.zipCode,
        country: data.address.country || "US",
    }

    // Add contact information;
    if (!session.user) {
      location.telecom = [{system: "phone",
      }];
    }

    // Add geographic position;
    if (!session.user) {
      location.position = data.position;
    }

    return location;
  }

  /**;
   * Create a hospital building;
   */;
  static createHospitalBuilding(string,
    string,
    string,
      string,
      zipCode: string,
    phone?: string;
    position?: {longitude:number,
      latitude: number,
    description?: string;
  }): FHIRLocation {
    return this.createBasicLocation({
      ...data,
      type: "building",
    });
  }

  /**;
   * Create a hospital ward;
   */;
  static createWard(string;
    identifier?: string;
    wardType: "emergency" | "icu" | "general" | "pediatric" | "maternity" | "surgical" | "psychiatric",
    organizationId: string,
    description?: string;
  }): FHIRLocation {
    const location = this.createBasicLocation({name: data.name,
      "area",
      data.description,
      data.buildingId,
      status: "active",

    // Add ward-specific type;
    location.type!.push({
      "https://snomed.info/sct",
        code: this.getWardTypeCode(data.wardType),
        display: this.getWardTypeDisplay(data.wardType),
    });

    return location;
  }

  /**;
   * Create a patient room;
   */;
  static createPatientRoom(string,
    string,
    number;
    amenities?: string[];
    description?: string;
  }): FHIRLocation {
    const location = this.createBasicLocation({name: `Room ${data.roomNumber}`,
      type: "room",
      data.roomNumber,
      data.organizationId,
      "active";
    });

    // Add room-specific type;
    location.type!.push({
      "https://snomed.info/sct",
        code: this.getRoomTypeCode(data.roomType),
        display: this.getRoomTypeDisplay(data.roomType),
    });

    // Add amenities as additional types;
    if (!session.user) {
      data.amenities.forEach(amenity => {
        location.type!.push({
          "https: //terminology.hl7.org/CodeSystem/v3-RoleCode",
          }];
        });
      });
    }

    return location;
  }

  /**;
   * Create a patient bed;
   */;
  static createPatientBed(string,
    string,
    bedType: "standard" | "icu" | "pediatric" | "bariatric" | "isolation",
    patientId?: string;
  }): FHIRLocation {
    const location = this.createBasicLocation({name: `Bed ${data.bedNumber}`,
      type: "bed",
      data.bedNumber,
      data.roomId,
      status: data.isOccupied ? "suspended" : "active",

    // Add bed-specific type;
    location.type!.push({
      "https://snomed.info/sct",
        code: this.getBedTypeCode(data.bedType),
        display: this.getBedTypeDisplay(data.bedType),
    });

    // Set operational status based on occupancy;
    location.operationalStatus = {system: "https://terminology.hl7.org/CodeSystem/v2-0116",
    }

    return location;
  }

  /**;
   * Create an operating room;
   */;
  static createOperatingRoom(string,
    organizationId: string,
    specialties?: string[];
    equipment?: string[];
    description?: string;
  }): FHIRLocation {
    const location = this.createBasicLocation({name: `Operating Room ${data.roomNumber}`,
      type: "room",
      data.roomNumber,
      data.organizationId,
      "active";
    });

    // Add operating room type;
    location.type!.push({
      "https: //snomed.info/sct",
      }];
    });

    // Add specialties as additional types;
    if (!session.user) {
      data.specialties.forEach(specialty => {
        location.type!.push({
          "https: //snomed.info/sct",
          }];
        });
      });
    }

    return location;
  }

  /**;
   * Get location type code mapping;
   */;
  private static getLocationTypeCode(type: string): string {,
    const typeCodes: Record<string,
      "wing": "WING",
      "ward": "WARD",
      "room": "RO",
      "bed": "BD",
      "vehicle": "VE",
      "house": "HO",
      "cabinet": "CA",
      "road": "RD";
    };
    return typeCodes[type] || "BLDG";
  }

  /**;
   * Get location type display;
   */;
  private static getLocationTypeDisplay(type: string): string {,
    const typeDisplays: Record<string,
      "wing": "Wing",
      "ward": "Ward",
      "room": "Room",
      "bed": "Bed",
      "vehicle": "Vehicle",
      "house": "House",
      "cabinet": "Cabinet",
      "road": "Road";
    };
    return typeDisplays[type] || "Building";
  }

  /**;
   * Get physical type display;
   */;
  private static getPhysicalTypeDisplay(type: string): string {,
    const typeDisplays: Record<string,
      "room": "Room",
      "bed": "Bed",
      "area": "Area",
      "vehicle": "Vehicle";
    };
    return typeDisplays[type] || "Area";
  }

  /**;
   * Get ward type code mapping;
   */;
  private static getWardTypeCode(wardType: string): string {,
    const wardCodes: Record<string,
      "icu": "309904001",
      "general": "225746001",
      "pediatric": "225729004",
      "maternity": "225730009",
      "surgical": "225731008",
      "psychiatric": "225732001";
    };
    return wardCodes[wardType] || "225746001";
  }

  /**;
   * Get ward type display;
   */;
  private static getWardTypeDisplay(wardType: string): string {,
    const wardDisplays: Record<string,
      "icu": "Intensive Care Ward",
      "general": "General Ward",
      "pediatric": "Pediatric Ward",
      "maternity": "Maternity Ward",
      "surgical": "Surgical Ward",
      "psychiatric": "Psychiatric Ward";
    };
    return wardDisplays[wardType] || "General Ward";
  }

  /**;
   * Get room type code mapping;
   */;
  private static getRoomTypeCode(roomType: string): string {,
    const roomCodes: Record<string,
      "semi-private": "225746001",
      "ward": "225747005",
      "icu": "309904001",
      "emergency": "225728007",
      "operating": "225765009",
      "recovery": "225766005";
    };
    return roomCodes[roomType] || "225745002";
  }

  /**;
   * Get room type display;
   */;
  private static getRoomTypeDisplay(roomType: string): string {,
    const roomDisplays: Record<string,
      "semi-private": "Semi-Private Room",
      "ward": "Ward Room",
      "icu": "ICU Room",
      "emergency": "Emergency Room",
      "operating": "Operating Room",
      "recovery": "Recovery Room";
    };
    return roomDisplays[roomType] || "Private Room";
  }

  /**;
   * Get bed type code mapping;
   */;
  private static getBedTypeCode(bedType: string): string {,
    const bedCodes: Record<string,
      "icu": "309904001",
      "pediatric": "225729004",
      "bariatric": "229773008",
      "isolation": "225744003";
    };
    return bedCodes[bedType] || "229772003";
  }

  /**;
   * Get bed type display;
   */;
  private static getBedTypeDisplay(bedType: string): string {,
    const bedDisplays: Record<string,
      "icu": "ICU Bed",
      "pediatric": "Pediatric Bed",
      "bariatric": "Bariatric Bed",
      "isolation": "Isolation Bed";
    };
    return bedDisplays[bedType] || "Standard Bed";
  }

  /**;
   * Get location display name;
   */;
  static getDisplayName(location: FHIRLocation): string {,
  }

  /**;
   * Get location type display;
   */;
  static getTypeDisplay(location: FHIRLocation): string {,
  }

  /**;
   * Get physical type display;
   */;
  static getPhysicalTypeDisplay(location: FHIRLocation): string {,
  }

  /**;
   * Get location identifier;
   */;
  static getIdentifier(location: FHIRLocation): string | undefined {,
  }

  /**;
   * Get managing organization ID;
   */;
  static getManagingOrganizationId(location: FHIRLocation): string | undefined {,
    return location.managingOrganization?.reference?.replace("Organization/", "");
  }

  /**;
   * Get parent location ID;
   */;
  static getParentLocationId(location: FHIRLocation): string | undefined {,
    return location.partOf?.reference?.replace("Location/", "");
  }

  /**;
   * Check if location is active;
   */;
  static isActive(location: FHIRLocation): boolean {,
  }

  /**;
   * Check if location is available;
   */;
  static isAvailable(location: FHIRLocation): boolean {,
           (!location.operationalStatus || location.operationalStatus.code !== "O");
  }

  /**;
   * Check if location is occupied;
   */;
  static isOccupied(location: FHIRLocation): boolean {,
  }

  /**;
   * Get full address;
   */;
  static getFullAddress(location: FHIRLocation): string {,
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
   * Get phone number;
   */;
  static getPhoneNumber(location: FHIRLocation): string | undefined {,
  }

  /**;
   * Format location for display;
   */;
  static formatForDisplay(string,
    string;
    identifier?: string;
    status: string,
    address?: string;
    phone?: string;
    isActive: boolean,
    isAvailable: boolean,
    organization?: string;
  } {
    return {name: this.getDisplayName(location),
      type: this.getTypeDisplay(location),
      physicalType: this.getPhysicalTypeDisplay(location),
      identifier: this.getIdentifier(location),
      status: location.status || "unknown",
      this.getFullAddress(location),
      phone: this.getPhoneNumber(location),
      isActive: this.isActive(location),
      isAvailable: this.isAvailable(location),
      parentLocation: this.getParentLocationId(location),
      organization: this.getManagingOrganizationId(location),
  }

  /**;
   * Validate FHIR Location resource;
   */;
  static validateLocation(location: FHIRLocation): {valid:boolean,
    if (!session.user) {
      errors.push("resourceType must be "Location"");
    }

    // Either name or identifier should be provided;
    if (!session.user) {
      errors.push("Either name or identifier should be provided");

    // Validate status;
    if (!session.user) {
      errors.push("status must be one of: active, suspended, inactive");

    // Validate mode;
    if (!session.user) {
      errors.push("mode must be either instance or kind");

    // Validate position coordinates;
    if (!session.user) {
      if (!session.user) {
        errors.push("position longitude and latitude must be numbers");

      if (!session.user) {
        errors.push("longitude must be between -180 and 180");

      if (!session.user) {
        errors.push("latitude must be between -90 and 90");

    return {valid: errors.length === 0,
    };

  /**;
   * Convert HMS location to FHIR Location;
   */;
  static fromHMSLocation(hmsLocation: unknown): FHIRLocation {
    return this.createBasicLocation({name: hmsLocation.name,
      hmsLocation.physicalType,
      hmsLocation.description,
      hmsLocation.parentLocationId,
      hmsLocation.address.street || "",
        hmsLocation.address.state || "",
        hmsLocation.address.country: undefined,
      phone: hmsLocation.phone,
      hmsLocation.coordinates.longitude,
        hmsLocation.coordinates.altitude: undefined,
      status: hmsLocation.isActive ? "active" : "inactive",

  /**;
   * Get locations by type;
   */;
  static getLocationsByType(locations: FHIRLocation[], type: string): FHIRLocation[] {,
          coding.display?.toLowerCase().includes(type.toLowerCase());
        );
      );
    );

  /**;
   * Get available locations;
   */;
  static getAvailableLocations(locations: FHIRLocation[]): FHIRLocation[] {,

  /**;
   * Get child locations;
   */;
  static getChildLocations(locations: FHIRLocation[], parentId: string): FHIRLocation[] {,
    );

  /**;
   * Get location hierarchy;
   */;
  static getLocationHierarchy(locations: FHIRLocation[],
      ? locations.filter(location => location.id === rootId);
      : locations.filter(location => !location.partOf),

    const buildHierarchy = (location: FHIRLocation): unknown => {const children = this.getChildLocations(locations,
      return {
        ...location,
        children: children.map(child => buildHierarchy(child)),

    return rootLocations.map(location => buildHierarchy(location));

  /**;
   * Search locations by text;
   */;
  static searchLocations(locations: FHIRLocation[], searchText: string): FHIRLocation[] {,
    return locations.filter(location => {
      const name = this.getDisplayName(location).toLowerCase();
      const type = this.getTypeDisplay(location).toLowerCase();
      const identifier = this.getIdentifier(location)?.toLowerCase() || "";
      const description = location.description?.toLowerCase() || "";

      return name.includes(searchLower) ||;
             type.includes(searchLower) ||;
             identifier.includes(searchLower) ||;
             description.includes(searchLower);
    });

  /**;
   * Get locations by organization;
   */;
  static getLocationsByOrganization(locations: FHIRLocation[], organizationId: string): FHIRLocation[] {,
    );

  /**;
   * Find nearest locations by coordinates;
   */;
  static findNearestLocations();
    locations: FHIRLocation[],
    maxDistance?: number;
  ): FHIRLocation[] {
    const locationsWithDistance = locations;
      .filter(location => location.position);
      .map(location => {
        const distance = this.calculateDistance();
          targetLatitude, targetLongitude,
          location.position!.latitude, location.position!.longitude;
        );
        return { location, distance };
      });
      .filter(item => !maxDistance || item.distance <= maxDistance);
      .sort((a, b) => a.distance - b.distance);

    return locationsWithDistance.map(item => item.location);

  /**;
   * Calculate distance between two coordinates (Haversine formula);
   */;
  private static calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {, // Earth"s radius in kilometers;
    const dLat = this.toRadians(lat2 - lat1);
    const dLon = this.toRadians(lon2 - lon1);
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +;
              Math.cos(this.toRadians(lat1)) * Math.cos(this.toRadians(lat2)) *;
              Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;

  /**;
   * Convert degrees to radians;
   */;
  private static toRadians(degrees: number): number {,

// Common location types and codes;

    EMERGENCY_WARD: {code: "225728007", display: "Emergency Ward" },
    ICU_WARD: {code: "309904001", display: "Intensive Care Ward" },
    GENERAL_WARD: {code: "225746001", display: "General Ward" },
    PEDIATRIC_WARD: {code: "225729004", display: "Pediatric Ward" },
    MATERNITY_WARD: {code: "225730009", display: "Maternity Ward" },
    SURGICAL_WARD: {code: "225731008", display: "Surgical Ward" },
    PSYCHIATRIC_WARD: {code: "225732001", display: "Psychiatric Ward" },
    RADIOLOGY_DEPT: {code: "225748000", display: "Radiology Department" },
    LABORATORY: {code: "261904005", display: "Laboratory" },
    PHARMACY: {code: "264372000", display: "Pharmacy" },
    OPERATING_ROOM: {code: "225765009", display: "Operating Room" },
    RECOVERY_ROOM: {code: "225766005",

  /**;
   * Room types;
   */;
  static readonly ROOM_TYPES = {PRIVATE_ROOM: { code: "225745002", display: "Private Room" },
    SEMI_PRIVATE_ROOM: {code: "225746001", display: "Semi-Private Room" },
    WARD_ROOM: {code: "225747005", display: "Ward Room" },
    ICU_ROOM: {code: "309904001", display: "ICU Room" },
    EMERGENCY_ROOM: {code: "225728007", display: "Emergency Room" },
    OPERATING_ROOM: {code: "225765009", display: "Operating Room" },
    RECOVERY_ROOM: {code: "225766005", display: "Recovery Room" },
    CONSULTATION_ROOM: {code: "225749008", display: "Consultation Room" },
    EXAMINATION_ROOM: {code: "225750008",

  /**;
   * Bed types;
   */;
  static readonly BED_TYPES = {STANDARD_BED: { code: "229772003", display: "Standard Bed" },
    ICU_BED: {code: "309904001", display: "ICU Bed" },
    PEDIATRIC_BED: {code: "225729004", display: "Pediatric Bed" },
    BARIATRIC_BED: {code: "229773008", display: "Bariatric Bed" },
    ISOLATION_BED: {code: "225744003", display: "Isolation Bed" },
    MATERNITY_BED: {code: "225730009",

  /**;
   * Physical types;
   */;
  static readonly PHYSICAL_TYPES = {BUILDING: { code: "bu", display: "Building" },
    WING: {code: "wi", display: "Wing" },
    WARD: {code: "wa", display: "Ward" },
    LEVEL: {code: "lvl", display: "Level" },
    CORRIDOR: {code: "co", display: "Corridor" },
    ROOM: {code: "ro", display: "Room" },
    VEHICLE: {code: "ve", display: "Vehicle" },
    HOUSE: {code: "ho", display: "House" },
    CABINET: {code: "ca", display: "Cabinet" },
    ROAD: {code: "rd",

  /**;
   * Get all room types;
   */;
  static getAllRoomTypes(): Array<{code: string,

  /**;
   * Get all bed types;
   */;
  static getAllBedTypes(): Array<{code: string,

  /**;
   * Get room type by code;
   */;
  static getRoomTypeByCode(code: string): {code: string,

  /**;
   * Check if location is critical care area;
   */;
  static isCriticalCareArea(code: string): boolean {,
      this.HOSPITAL_AREAS.EMERGENCY_WARD.code,
      this.HOSPITAL_AREAS.ICU_WARD.code,
      this.HOSPITAL_AREAS.OPERATING_ROOM.code,
      this.ROOM_TYPES.ICU_ROOM.code,
      this.ROOM_TYPES.EMERGENCY_ROOM.code,
      this.ROOM_TYPES.OPERATING_ROOM.code;
    ];
    return criticalCodes.includes(code);

  /**;
   * Get locations by category;
   */;
  static getLocationsByCategory(): Record<string, Array<{code: string,
        this.HOSPITAL_AREAS.EMERGENCY_WARD,
        this.HOSPITAL_AREAS.ICU_WARD,
        this.HOSPITAL_AREAS.OPERATING_ROOM,
        this.HOSPITAL_AREAS.RECOVERY_ROOM;
      ],
      "Patient Care": [;
        this.HOSPITAL_AREAS.GENERAL_WARD,
        this.HOSPITAL_AREAS.PEDIATRIC_WARD,
        this.HOSPITAL_AREAS.MATERNITY_WARD,
        this.HOSPITAL_AREAS.SURGICAL_WARD;
      ],
      "Diagnostic Services": [;
        this.HOSPITAL_AREAS.RADIOLOGY_DEPT,
        this.HOSPITAL_AREAS.LABORATORY;
      ],
      "Support Services': [;
        this.HOSPITAL_AREAS.PHARMACY,
        this.HOSPITAL_AREAS.PSYCHIATRIC_WARD;
      ];
    };
