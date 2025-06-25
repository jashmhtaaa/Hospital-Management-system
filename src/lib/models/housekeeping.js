"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports._toFHIRHousekeepingInspection = exports.unknown = exports._toFHIRHousekeepingRequest = void 0;
require("@prisma/client");
var HousekeepingRequest = ;
[];
[];
{
    system: string,
        string;
}
[];
text: string;
;
string;
display ?  : string;
;
string;
display ?  : string;
;
performer ?  : { reference: string,
    display: string
}[];
string;
display ?  : string;
[];
occurrenceDateTime ?  : string;
authoredOn: string;
note ?  : { text: string
}[];
/**;
 * FHIR-compliant Housekeeping Task;
 * Maps to FHIR Task resource;
 */ ;
[];
status: "draft" | "requested" | "received" | "accepted" | "rejected" | "ready" | "cancelled" | "in-progress" | "on-hold" | "failed" | "completed" | "entered-in-error",
    "routine" | "urgent" | "asap" | "stat",
    { reference: string
    };
string;
;
authoredOn: string,
    { reference: string,
        display: string
    };
owner ?  : { reference: string,
    display: string
};
note ?  : { text: string
}[];
executionPeriod ?  : {
    start: string,
    end: string
};
/**;
 * FHIR-compliant Housekeeping Location;
 * Maps to FHIR Location resource;
 */ ;
[];
[];
physicalType ?  : {
    string,
    string
}[];
;
managingOrganization ?  : { reference: string
};
partOf ?  : { reference: string
};
/**;
 * FHIR-compliant Housekeeping Inspection;
 * Maps to FHIR Observation resource;
 */ ;
[];
[];
{
    system: string,
        string;
}
[];
text: string;
;
subject ?  : { reference: string
};
effectiveDateTime: string,
    string;
display ?  : string;
[];
valueQuantity ?  : { value: number,
    string,
    code: string
};
component ?  : {};
{
    system: string,
        string;
}
[];
text: string;
;
valueString ?  : string;
valueQuantity ?  : { value: number,
    string,
    code: string
};
[];
/**;
 * Convert database HousekeepingRequest to FHIR ServiceRequest;
 */ ;
exports._toFHIRHousekeepingRequest = (exports.unknown,
    requestedByUser);
tasks ?  : exports.unknown[];
FHIRHousekeepingRequest;
{
    // Map status from internal to FHIR status;
    const statusMap = {
        "PENDING": "draft",
        "ASSIGNED": "active",
        "IN_PROGRESS": "active",
        "COMPLETED": "completed",
        "CANCELLED": "revoked"
    };
    // Map priority from internal to FHIR priority;
    const priorityMap = {
        "LOW": "routine",
        "MEDIUM": "routine",
        "HIGH": "urgent",
        "URGENT": "stat"
    };
    // Map request type to FHIR coding;
    const requestTypeMap = {
        "REGULAR_CLEANING": { code: "regular-cleaning", display: "Regular Cleaning" },
        "DEEP_CLEANING": { code: "deep-cleaning", display: "Deep Cleaning" },
        "SPILL_CLEANUP": { code: "spill-cleanup", display: "Spill Cleanup" },
        "TERMINAL_CLEANING": { code: "terminal-cleaning", display: "Terminal Cleaning" }
    };
    return { resourceType: "ServiceRequest",
        statusMap, [request.status]:  || "unknown",
        priorityMap, [request.priority]:  || "routine",
        [{ system: "https://terminology.hl7.org/CodeSystem/service-category",
            "Housekeeping": 
        }]: ,
        "https://hms.local/fhir/CodeSystem/housekeeping-request-type": ,
        code: requestTypeMap[request.requestType]?.code || request.requestType.toLowerCase(),
        display: requestTypeMap[request.requestType]?.display || request.requestType
    };
    text: request.description,
        `Location/${request.locationId}`,
        display;
    request.location?.name || "Unknown Location",
        `User/${request.requestedById}`,
        display;
    request.requestedByUser?.name || "Unknown User",
        `User/${task.assignedToId}`,
        display;
    task.assignedToUser?.name || "Unknown User";
     || [],
        `Location/${request.locationId}`,
        display;
    request.location?.name || "Unknown Location";
    occurrenceDateTime: request.scheduledDate?.toISOString(),
        authoredOn;
    request.createdAt.toISOString(),
        note;
    request.notes ? [text, request.notes] : [];
    /**;
     * Convert database HousekeepingTask to FHIR Task;
     */ ;
    exports._toFHIRHousekeepingTask = (HousekeepingRequest);
    assignedToUser ?  : exports.unknown;
    createdByUser: exports.unknown;
}
FHIRHousekeepingTask;
{
    // Map status from internal to FHIR status;
    const statusMap = {
        "PENDING": "requested",
        "IN_PROGRESS": "in-progress",
        "COMPLETED": "completed",
        "CANCELLED": "cancelled"
    };
    return { resourceType: "Task",
        [{ reference: `ServiceRequest/${task.requestId}`
        }]: ,
        status: statusMap[task.status] || "requested",
        priorityMap, [task.request?.priority]:  || "routine", } `ServiceRequest/${task.requestId}`;
    `Location/${task.request?.locationId}`,
        authoredOn;
    task.createdAt.toISOString(),
        lastModified;
    task.updatedAt.toISOString(),
        `User/${task.createdById}`,
        display;
    task.createdByUser?.name || "Unknown User",
        `User/${task.assignedToId}`,
        display;
    task.assignedToUser?.name || "Unknown User";
    undefined,
        note;
    task.notes ? [text, task.notes] : [],
        task.startTime?.toISOString(),
        end;
    task.endTime?.toISOString();
}
;
/**;
 * Convert database HousekeepingInspection to FHIR Observation;
 */ ;
exports._toFHIRHousekeepingInspection = (exports.unknown,
    inspector);
FHIRHousekeepingInspection;
{
    // Map status from internal to FHIR status;
    const statusMap = {
        "SCHEDULED": "registered",
        "COMPLETED": "final",
        "FAILED": "final"
    };
    return { resourceType: "Observation",
        statusMap, [inspection.status]:  || "unknown",
        [{ system: "https://terminology.hl7.org/CodeSystem/observation-category",
            "Survey": 
        }]: ,
        "https://hms.local/fhir/CodeSystem/housekeeping-inspection-type": ,
        code: inspection.inspectionType.toLowerCase(),
        display: inspection.inspectionType
    };
    text: `Housekeeping Inspection - $inspection.inspectionType`;
}
`Location/$inspection.locationId`;
effectiveDateTime: inspection.inspectionDate.toISOString(),
    `User/$inspection.inspectorId`,
    display;
inspection.inspector?.name || "Unknown Inspector";
inspection.score,
    "https://unitsofmeasure.org",
    code;
"score";
undefined,
    component;
[
    ...(inspection.findings ? [{
            [{ system: "https://hms.local/fhir/CodeSystem/housekeeping-inspection",
                "Findings": 
            }]: ,
            text: "Findings"
        },
        valueString, inspection.findings
    ] : []),
    ...(inspection.recommendations ? [{
            [{ system: "https://hms.local/fhir/CodeSystem/housekeeping-inspection",
                "Recommendations": 
            }]: ,
            text: "Recommendations"
        },
        valueString, inspection.recommendations
    ] : [])
];
;
// Helper function to map priority;
const priorityMap = (priority) => {
    const map = {
        "LOW": "routine",
        "MEDIUM": "routine",
        "HIGH": "urgent",
        "URGENT": "stat"
    };
    return map[priority] || "routine";
};
