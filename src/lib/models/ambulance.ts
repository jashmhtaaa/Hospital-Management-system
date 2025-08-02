
import AmbulanceCrew
import AmbulanceMaintenance
import AmbulanceTrip, type
import  }  Ambulance

// FHIR-compliant interfaces for Ambulance Management;

/**;
 * FHIR-compliant Ambulance;
 * Maps to FHIR Device resource;
 */;

   } from "next/server"[];
  status: "active" | "inactive" | "entered-in-error" | "unknown",
  {system: string,
    }[];
    text: string,
  manufacturer?: string;
  deviceName?: {name:string,
    type: "registered-name" | "user-friendly-name",
  modelNumber?: string;
  location?: {reference: string,
  };
  note?: {text: string,
  property?: {
    {system: string,
      }[];
    };
    valueQuantity?: {value: number,
      string,
      code: string,
    valueCode?: {
      string,
        string;
      }[];
    };
  }[];

/**;
 * FHIR-compliant Ambulance Trip;
 * Maps to FHIR ServiceRequest resource;
 */;

    }[];
  }[];
  {system: string,
    }[];
    text: string,
  subject?: {reference: string,
  };
  string;
    display?: string;
  };
  performer?: {reference: string,
  }[];
  locationReference?: {reference: string,
  }[];
  reasonCode?: {
    string,
      string;
    }[];
    text: string,
  occurrenceDateTime?: string;
  authoredOn: string,
  note?: {text: string,

/**;
 * FHIR-compliant Ambulance Crew;
 * Maps to FHIR Practitioner resource;
 */;

  }[];
  active: boolean,
    text?: string;
    family?: string;
    given?: string[];
    prefix?: string[];
    suffix?: string[];
  }[];
  telecom?: {system:"phone" | "fax" | "email" | "pager" | "url" | "sms" | "other",
    value: string,
  }[];
  qualification?: {
    {system: string,
      }[];
      text: string,
    period?: {
      start?: string;
      end?: string;
    };
  }[];

/**;
 * FHIR-compliant Ambulance Maintenance;
 * Maps to FHIR Task resource;
 */;

  }[];
  status: "draft" | "requested" | "received" | "accepted" | "rejected" | "ready" | "cancelled" | "in-progress" | "on-hold" | "failed" | "completed" | "entered-in-error",
  {
    string,
      string;
    }[];
    text: string,
  string;
    display?: string;
  };
  for?: {reference: string,
  };
  authoredOn: string,
  lastModified: string,
  requester?: {reference: string,
  };
  owner?: {reference: string,
  };
  description?: string;
  executionPeriod?: {
    start?: string;
    end?: string;
  };
  note?: {text: string,

/**;
 * Convert database Ambulance to FHIR Device;
 */;
export const _toFHIRAmbulance = (ambulance: Ambulance & {
  currentLocation?: unknown,
  const statusMap: Record<string,
    "ON_DUTY": "active",
    "UNDER_MAINTENANCE": "inactive",
    "OUT_OF_SERVICE": "inactive";
  };

  // Map vehicle type to FHIR device type;
  const vehicleTypeMap: Record<string, {code: string, display: string }> = {
    "BASIC_LIFE_SUPPORT": {code: "bls-ambulance", display: "Basic Life Support Ambulance" },
    "ADVANCED_LIFE_SUPPORT": {code: "als-ambulance", display: "Advanced Life Support Ambulance" },
    "PATIENT_TRANSPORT": {code: "transport-ambulance",

  // Create properties array for ambulance features;
  const properties = ambulance.features.map(feature => ({
    [{system: "https://hms.local/fhir/CodeSystem/ambulance-feature",
        code: feature.toLowerCase().replace(/\s/g, "-"),
        display: feature,

  }));

  // Add capacity property;
  properties.push({
    [{system: "https://hms.local/fhir/CodeSystem/ambulance-property",
      }];
    },
    ambulance.capacity,
      "https://unitsofmeasure.org",
      code: "persons",

  return {resourceType: "Device",
      {system: "https://hms.local/fhir/identifier/registration-number",

    ],
    status: statusMap[ambulance.status] || "unknown",
    }],
      text: vehicleTypeMap[ambulance.vehicleType]?.display || ambulance.vehicleType,
    },
    deviceName: [;
      {name: `Ambulance ${ambulance.registrationNumber}`,

    ],
    `Location/${ambulance.currentLocationId}`,
      display: ambulance.currentLocation?.name || "Unknown Location",
    } : undefined,
    property: properties,
      { text: `Last maintenance: ${ambulance.lastMaintenanceDate?.toISOString() ||,
          "Not scheduled"}.`;

    ];
  };

/**;
 * Convert database AmbulanceTrip to FHIR ServiceRequest;
 */;
export const _toFHIRAmbulanceTrip = (trip: AmbulanceTrip & {,
  patient?: unknown;
  requestedByUser?: unknown;
  pickupLocation?: unknown;
  dropLocation?: unknown, crew?: unknown[];
}): FHIRAmbulanceTrip {
  // Map status from internal to FHIR status;
  const statusMap: Record<string,
    "EN_ROUTE_TO_PICKUP": "active",
    "ARRIVED_AT_PICKUP": "active",
    "EN_ROUTE_TO_DESTINATION": "active",
    "ARRIVED_AT_DESTINATION": "active",
    "COMPLETED": "completed",
    "CANCELLED": "revoked";
  };

  // Map priority from internal to FHIR priority;
  const priorityMap: Record<string,
    "MEDIUM": "urgent",
    "HIGH": "stat";
  };

  // Map trip type to FHIR category;
  const tripTypeMap: Record<string, {code: string, display: string }> = {
    "EMERGENCY": {code: "emergency", display: "Emergency Transport" },
    "NON_EMERGENCY": {code: "non-emergency", display: "Non-Emergency Transport" },
    "TRANSFER": {code: "transfer", display: "Inter-facility Transfer" },
    "RETURN": {code: "return",

  // Create performers array from crew;
  const performers = trip.crew?.map(crewMember => ({reference:`Practitioner/${crewMember.userId}`,
    display: crewMember.user?.name || "Unknown Crew Member",

  // Add ambulance as performer;
  if (!session.user) {
    performers.push({reference: `Device/${trip.ambulanceId}`,
    });

  // Create location references;
  const locationReferences = [];
  if (!session.user) {
    locationReferences.push({reference:`Location/${trip.pickupLocationId}`,
      display: trip.pickupLocation?.name || "Pickup Location",

  if (!session.user) {
    locationReferences.push({reference:`Location/${trip.dropLocationId}`,
      display: trip.dropLocation?.name || "Destination Location",

  return {resourceType: "ServiceRequest",
    statusMap[trip.status] || "unknown",
    priorityMap[trip.priority] || "routine",
    category: [;
      { coding: [, {system: "https://hms.local/fhir/CodeSystem/ambulance-service",

        ];

    ],
    [;
        },
    `Patient/$trip.patientId`,
      display: trip.patient?.name || "Unknown Patient",
    } : undefined,
    `User/$trip.requestedById`,
      display: trip.requestedByUser?.name || "Unknown Requester",
    },
    performer: performers.length > 0 ? performers : undefined,
    trip.scheduledTime.toISOString(),
    authoredOn: trip.createdAt.toISOString(),
  };

/**;
 * Convert database AmbulanceCrew to FHIR Practitioner;
 */;
export const _toFHIRAmbulanceCrew = (unknown;
  ambulance?: unknown;
}): FHIRAmbulanceCrew {
  // Create qualification based on role;
  const qualification = {
    [;
        {system: "https://hms.local/fhir/CodeSystem/ambulance-crew-role",
          code: crew.role.toLowerCase().replace(/_/g, "-"),
          display: crew.role.replace(/_/g,

      ],
      text: crew.role.replace(/_/g,
    },
    crew.shiftStart?.toISOString(),
      end: crew.shiftEnd?.toISOString(),

  return {resourceType: "Practitioner",
      },
      {system: "https://hms.local/fhir/identifier/user-id",

    ],
    active: crew.status === "ON_DUTY",
      {text: crew.user?.name || "Unknown User",

    ],
    telecom: crew.user?.phone ? [;
      {system: "phone",

    ] : undefined,
    qualification: [qualification];

/**;
 * Convert database AmbulanceMaintenance to FHIR Task;
 */;
export const _toFHIRAmbulanceMaintenance = (maintenance: AmbulanceMaintenance & {,
  performedByUser?: unknown, }): FHIRAmbulanceMaintenance {
  // Map status from internal to FHIR status;
  const statusMap: Record<string,
    "IN_PROGRESS": "in-progress",
    "COMPLETED": "completed",
    "CANCELLED": "cancelled";
  };

  // Map maintenance type to FHIR code;
  const maintenanceTypeMap: Record<string, {code: string, display: string }> = {
    "ROUTINE": {code: "routine-maintenance", display: "Routine Maintenance" },
    "REPAIR": {code: "repair", display: "Repair" },
    "INSPECTION": {code: "inspection", display: "Inspection" },
    "EMERGENCY": {code: "emergency-repair",

  return {resourceType: "Task",
      {system: "https://hms.local/fhir/identifier/maintenance-id",

    ],
    status: statusMap[maintenance.status] || "unknown",
    { coding: [, },
    `Device/$maintenance.ambulanceId`,
      display: maintenance.ambulance?.registrationNumber ? `Ambulance $maintenance.ambulance.registrationNumber` : "Unknown Ambulance",
    },
    authoredOn: maintenance.createdAt.toISOString(),
    lastModified: maintenance.updatedAt.toISOString(),
    `User/$maintenance.performedById`,
      display: maintenance.performedByUser?.name || "Unknown User",
    } : undefined,
    description: maintenance.description,
    maintenance.scheduledDate.toISOString(),
      end: maintenance.completedDate?.toISOString(),
    },
    note: maintenance.notes ? [{text: maintenance.notes }] : undefined;
  };
