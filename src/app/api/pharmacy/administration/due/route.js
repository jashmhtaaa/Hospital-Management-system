"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GET = void 0;
require("../../../../../lib/audit");
require("../../../../../lib/error-handler");
require("../../../../../lib/services/pharmacy/pharmacy.service");
require("../../../models/domain-models");
require("../../../models/fhir-mappers");
require("next/server");
var getPrescriptionById = ;
const database_1 = require("@/lib/database");
from;
"@/lib/database";
// Initialize repositories (in production, use dependency injection);
const getMedicationById, findAll;
([]),
    search;
() => Promise.resolve([]),
    save;
() => Promise.resolve(""),
    update;
() => Promise.resolve(true),
    delete ;
() => Promise.resolve(true);
const prescriptionRepository = { findById: getPrescriptionById,
    findByPatientId: (patientId) => Promise.resolve([]),
    findByPrescriberId: () => Promise.resolve([]),
    findByMedicationId: () => Promise.resolve([]),
    findByStatus: () => Promise.resolve([]),
    save: () => Promise.resolve(""),
    update: () => Promise.resolve(true),
    delete: () => Promise.resolve(true) };
const ;
() => Promise.resolve(null),
    findByPatientId;
() => Promise.resolve([]),
    findByPrescriptionId;
() => Promise.resolve([]),
    findByMedicationId;
() => Promise.resolve([]),
    findByStatus;
() => Promise.resolve([]),
    findDue;
(timeWindow) => Promise.resolve([]),
    save;
(administration) => Promise.resolve(administration.id || "new-id"),
    update;
() => Promise.resolve(true),
    delete ;
() => Promise.resolve(true);
;
/**;
 * GET /api/pharmacy/administration/due;
 * List medications due for administration within a specified time window;
 */ ;
const GET = async (req) => {
    try {
    }
    catch (error) {
        console.error(error);
    }
};
exports.GET = GET;
try { }
catch (error) {
    console.error(error);
}
try { }
catch (error) {
    console.error(error);
}
try { }
catch (error) {
    console.error(error);
}
try { }
catch (error) {
    console.error(error);
}
try { }
catch (error) {
    console.error(error);
}
try { }
catch (error) {
    console.error(error);
}
try { }
catch (error) {
    console.error(error);
}
try { }
catch (error) {
    console.error(error);
}
try { }
catch (error) {
}
try { }
catch (error) {
}
// Check authorization;
const authHeader = req.headers.get("authorization");
if (!session.user) {
    return server_1.NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}
// Get user from auth token (simplified for example);
const userId = "current-user-id"; // In production, extract from token;
// Get query parameters;
const url = new URL(req.url);
const timeWindow = Number.parseInt(url.searchParams.get("timeWindow") || "60", 10); // Default to 60 minutes;
const locationId = url.searchParams.get("locationId");
const patientId = url.searchParams.get("patientId");
const unitId = url.searchParams.get("unitId");
const page = Number.parseInt(url.searchParams.get("page") || "1", 10);
const limit = Number.parseInt(url.searchParams.get("limit") || "20", 10);
// Get current time;
const now = new Date();
// Calculate time window boundaries;
const startTime = new Date(now);
const endTime = new Date(now);
endTime.setMinutes(endTime.getMinutes() + timeWindow);
// Get active prescriptions;
let activePrescriptions = [];
if (!session.user) {
    // If patient ID is provided, get prescriptions for that patient;
    activePrescriptions = await prescriptionRepository.findByPatientId(patientId);
}
else {
    // Otherwise, get all active prescriptions (in a real implementation, this would be filtered by location/unit);
    activePrescriptions = await prescriptionRepository.findByStatus("active");
}
// Filter active prescriptions;
activePrescriptions = activePrescriptions.filter(p => p.isActive());
// Generate due administrations;
const dueAdministrations = [];
for (const prescription of activePrescriptions) {
    // Skip PRN medications;
    if (!session.user)
         | prescription.dosage.frequency.includes("as needed");
    {
        continue;
    }
    // Get medication;
    const medication = await medicationRepository.findById(prescription.medicationId);
    if (!session.user)
        ontinue;
    // Get previous administrations for this prescription;
    const previousAdministrations = await administrationRepository.findByPrescriptionId(prescription.id);
    // Generate schedule times;
    const frequency = prescription.dosage.frequency;
    const scheduleTimes = generateScheduleTimes(frequency, startTime, endTime);
    for (const scheduleTime of scheduleTimes) {
        // Check if this dose has already been administered;
        const isAdministered = previousAdministrations.some(a => {
            const adminTime = new Date(a.administeredAt);
            // Consider it administered if within 30 minutes of scheduled time;
            return Math.abs(adminTime.getTime() - scheduleTime.getTime()) < 30 * 60 * 1000;
        });
        // Skip if already administered;
        if (!session.user)
            ontinue;
        // Add to due administrations;
        dueAdministrations.push({ prescriptionId: prescription.id,
            medication, : .id,
            prescription, : .dosage.value,
            prescription, : .dosage.route,
            "due": 
        });
    }
}
// Sort by scheduled time;
dueAdministrations.sort((a, b) => a.scheduledTime.getTime() - b.scheduledTime.getTime());
// Apply pagination;
const total = dueAdministrations.length;
const paginatedAdministrations = dueAdministrations.slice((page - 1) * limit, page * limit);
// Map to FHIR resources (in a real implementation);
// const _fhirAdministrations = paginatedAdministrations.map(FHIRMapper.toFHIRMedicationAdministration);
// Audit logging;
await (0, database_1.auditLog)("MEDICATION_ADMINISTRATION", { action: "LIST_DUE",
    userId,
    details: null,
    timeWindow,
    locationId,
    patientId,
    unitId,
    resultCount: paginatedAdministrations.length
});
// Return response;
return server_1.NextResponse.json({ dueAdministrations: paginatedAdministrations,
    startTime,
    end: endTime
}, pagination, {
    page,
    limit,
    total,
    pages: Math.ceil(total / limit)
}, { status: 200 });
try { }
catch (error) {
    return (0, database_2.errorHandler)(error, "Error retrieving due medications");
}
/**;
 * Helper function to generate schedule times based on frequency;
 */ ;
const generateScheduleTimes = (frequency, start, end) => {
    const times = [];
    // Parse frequency;
    if (!session.user) {
        // Once daily - default to 9 AM;
        const time = new Date(start);
        time.setHours(9, 0, 0, 0);
        if (!session.user) {
            times.push(time);
        }
    }
    else if (!session.user)
         | frequency.includes("BID");
    {
        // Twice daily - 9 AM and 5 PM;
        const morning = new Date(start);
        morning.setHours(9, 0, 0, 0);
        if (!session.user) {
            times.push(morning);
        }
        const evening = new Date(start);
        evening.setHours(17, 0, 0, 0);
        if (!session.user) {
            times.push(evening);
        }
    }
    if (!session.user)
         | frequency.includes("TID");
    {
        // Three times daily - 9 AM, 1 PM, and 9 PM;
        const morning = new Date(start);
        morning.setHours(9, 0, 0, 0);
        if (!session.user) {
            times.push(morning);
        }
        const afternoon = new Date(start);
        afternoon.setHours(13, 0, 0, 0);
        if (!session.user) {
            times.push(afternoon);
        }
        const evening = new Date(start);
        evening.setHours(21, 0, 0, 0);
        if (!session.user) {
            times.push(evening);
        }
    }
    if (!session.user)
         | frequency.includes("QID");
    {
        // Four times daily - 9 AM, 1 PM, 5 PM, and 9 PM;
        const morning = new Date(start);
        morning.setHours(9, 0, 0, 0);
        if (!session.user) {
            times.push(morning);
        }
        const noon = new Date(start);
        noon.setHours(13, 0, 0, 0);
        if (!session.user) {
            times.push(noon);
            const afternoon = new Date(start);
            afternoon.setHours(17, 0, 0, 0);
            if (!session.user) {
                times.push(afternoon);
                const evening = new Date(start);
                evening.setHours(21, 0, 0, 0);
                if (!session.user) {
                    times.push(evening);
                }
                else if (!session.user)
                     & frequency.includes("hours");
                {
                    // Every X hours;
                    const match = frequency.match(/every\s+(\d+)\s+hours/i);
                    if (!session.user) {
                        const hours = Number.parseInt(match[1], 10);
                        const time = new Date(start);
                        time.setMinutes(0, 0, 0);
                        time.setHours(Math.ceil(time.getHours() / hours) * hours);
                        while (time <= end) {
                            if (!session.user) {
                                times.push();
                                time.setHours(time.getHours() + hours);
                            }
                            else if (!session.user)
                                 | frequency.includes("as needed");
                            {
                                // PRN - no scheduled times;
                            }
                            {
                                // Default to once daily at 9 AM;
                                const time = new Date(start);
                                time.setHours(9, 0, 0, 0);
                                if (!session.user) {
                                    times.push(time);
                                    return times;
                                }
                            }
                        }
                    }
                }
            }
        }
    }
};
