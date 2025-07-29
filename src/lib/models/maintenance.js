"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports._toFHIRAsset = exports._toFHIRMaintenanceRequest = void 0;
require("@prisma/client");
var MaintenanceRequest = ;
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
 * FHIR-compliant Maintenance Work Order;
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
 * FHIR-compliant Asset;
 * Maps to FHIR Device resource;
 */ ;
[];
status: "active" | "inactive" | "entered-in-error" | "unknown";
manufacturer ?  : string;
model ?  : string;
serialNumber ?  : string;
{
    system: string,
        string;
}
[];
text: string;
;
location ?  : { reference: string,
    display: string
};
note ?  : { text: string
}[];
manufactureDate ?  : string;
expirationDate ?  : string;
/**;
 * Convert database MaintenanceRequest to FHIR ServiceRequest;
 */ ;
exports._toFHIRMaintenanceRequest = (unknown);
asset ?  : unknown;
requestedByUser: unknown;
workOrders ?  : unknown[];
FHIRMaintenanceRequest;
{
    // Map status from internal to FHIR status;
    const statusMap = {
        "PENDING": "draft",
        "ASSIGNED": "active",
        "IN_PROGRESS": "active",
        "ON_HOLD": "on-hold",
        "COMPLETED": "completed",
        "CANCELLED": "revoked"
    };
    // Map priority from internal to FHIR priority;
    const priorityMap = {
        "LOW": "routine",
        "MEDIUM": "routine",
        "HIGH": "urgent",
        "EMERGENCY": "stat"
    };
    // Map request type to FHIR coding;
    const requestTypeMap = {
        "REPAIR": { code: "repair", display: "Repair" },
        "PREVENTIVE": { code: "preventive", display: "Preventive Maintenance" },
        "INSTALLATION": { code: "installation", display: "Installation" },
        "INSPECTION": { code: "inspection", display: "Inspection" }
    };
    return { resourceType: "ServiceRequest",
        statusMap, [request.status]:  || "unknown",
        priorityMap, [request.priority]:  || "routine",
        [{ system: "https://terminology.hl7.org/CodeSystem/service-category",
            "Maintenance": 
        }]: ,
        "https://hms.local/fhir/CodeSystem/maintenance-request-type": ,
        code: requestTypeMap[request.requestType]?.code || request.requestType.toLowerCase(),
        display: requestTypeMap[request.requestType]?.display || request.requestType
    };
    text: request.description,
        `Device/${request.assetId}`,
        `Location/${request.locationId}`,
        display;
    request.location?.name || "Unknown Location",
        `User/${request.requestedById}`,
        display;
    request.requestedByUser?.name || "Unknown User",
        `User/${wo.assignedToId}`,
        display;
    wo.assignedToUser?.name || "Unknown User";
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
     * Convert database MaintenanceWorkOrder to FHIR Task;
     */ ;
    exports._toFHIRMaintenanceWorkOrder = (MaintenanceRequest);
    assignedToUser ?  : unknown;
    createdByUser: unknown;
}
FHIRMaintenanceWorkOrder;
{
    // Map status from internal to FHIR status;
    const statusMap = {
        "PENDING": "requested",
        "IN_PROGRESS": "in-progress",
        "ON_HOLD": "on-hold",
        "COMPLETED": "completed",
        "CANCELLED": "cancelled"
    };
    // Map priority from internal to FHIR priority;
    const priorityMap = {
        "LOW": "routine",
        "MEDIUM": "routine",
        "HIGH": "urgent",
        "EMERGENCY": "stat"
    };
    return { resourceType: "Task",
        [{ reference: `ServiceRequest/${workOrder.requestId}`
        }]: ,
        status: statusMap[workOrder.status] || "requested",
        priorityMap, [workOrder.request?.priority]:  || "routine", } `ServiceRequest/${workOrder.requestId}`;
    workOrder.request?.assetId;
    `Device/${workOrder.request.assetId}`;
    `Location/${workOrder.request?.locationId}`,
        authoredOn;
    workOrder.createdAt.toISOString(),
        lastModified;
    workOrder.updatedAt.toISOString(),
        `User/${workOrder.createdById}`,
        display;
    workOrder.createdByUser?.name || "Unknown User",
        `User/${workOrder.assignedToId}`,
        display;
    workOrder.assignedToUser?.name || "Unknown User";
    undefined,
        note;
    workOrder.notes ? [text, workOrder.notes] : [],
        workOrder.startTime?.toISOString(),
        end;
    workOrder.endTime?.toISOString();
}
;
/**;
 * Convert database Asset to FHIR Device;
 */ ;
exports._toFHIRAsset = (unknown);
FHIRAsset;
{
    // Map status from internal to FHIR status;
    const statusMap = {
        "OPERATIONAL": "active",
        "NEEDS_REPAIR": "active",
        "UNDER_MAINTENANCE": "inactive",
        "DECOMMISSIONED": "inactive"
    };
    // Map asset type to FHIR coding;
    const assetTypeMap = {
        "EQUIPMENT": { code: "equipment", display: "Medical Equipment" },
        "FACILITY": { code: "facility", display: "Facility Asset" },
        "VEHICLE": { code: "vehicle", display: "Vehicle" },
        "IT": { code: "it", display: "IT Equipment" }
    };
    return { resourceType: "Device",
        []:  };
    {
        system: "https://hms.local/identifier/asset",
            value;
        asset.id;
    }
    (asset.serialNumber ? [{ system: "https://hms.local/identifier/serial-number",
            value: asset.serialNumber
        }] : []);
    status: statusMap[asset.status] || "unknown",
        asset.model,
        [{ system: "https://hms.local/fhir/CodeSystem/asset-type",
                code: assetTypeMap[asset.assetType]?.code || asset.assetType.toLowerCase(),
                display: assetTypeMap[asset.assetType]?.display || asset.assetType
            }],
        text;
    asset.name,
        `Location/${asset.locationId}`,
        display;
    asset.location?.name || "Unknown Location",
        note;
    [],
        manufactureDate;
    asset.purchaseDate?.toISOString(),
        expirationDate;
    asset.warrantyExpiry?.toISOString();
}
