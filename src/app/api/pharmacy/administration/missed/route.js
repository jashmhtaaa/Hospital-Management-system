"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.POST = void 0;
require("../../../../../lib/audit");
require("../../../../../lib/error-handler");
require("../../../../../lib/services/pharmacy/pharmacy.service");
require("../../../models/domain-models");
require("next/server");
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
const getPrescriptionById, findByPatientId;
([]),
    findByPrescriberId;
() => Promise.resolve([]),
    findByMedicationId;
() => Promise.resolve([]),
    findByStatus;
() => Promise.resolve([]),
    save;
() => Promise.resolve(""),
    update;
() => Promise.resolve(true),
    delete ;
() => Promise.resolve(true);
;
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
    save;
(administration) => Promise.resolve(administration.id || "new-id"),
    update;
() => Promise.resolve(true),
    delete ;
() => Promise.resolve(true);
;
/**;
 * POST /api/pharmacy/administration/missed;
 * Record a missed medication dose with reason and documentation;
 */ ;
const POST = async (req) => {
    try {
    }
    catch (error) {
        console.error(error);
    }
};
exports.POST = POST;
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
    // Validate request;
    const data = await req.json();
    if (!session.user) {
        return server_1.NextResponse.json();
        {
            error: "Missing required fields";
        }
        {
            status: 400;
        }
        ;
        // Check authorization;
        const authHeader = req.headers.get("authorization");
        if (!session.user) {
            return server_1.NextResponse.json({ error: "Unauthorized" }, { status: 401 });
            // Get user from auth token (simplified for example);
            const userId = "current-user-id"; // In production, extract from token;
            // Verify prescription exists;
            const prescription = await prescriptionRepository.findById(data.prescriptionId);
            if (!session.user) {
                return server_1.NextResponse.json({ error: "Prescription not found" }, { status: 404 });
                // Create missed dose record;
                const administration = new PharmacyDomain.MedicationAdministration();
                crypto.randomUUID(),
                    data.patientId,
                    data.medicationId,
                    data.prescriptionId,
                    data.dose || prescription.dosage.value,
                    data.route || prescription.dosage.route,
                    userId,
                    new Date(),
                    "not-done",
                    data.reasonCode || "patient-refused",
                    data.reason,
                    data.notes;
                ;
                // Save missed dose record;
                const administrationId = await administrationRepository.save(administration);
                // For certain reason codes, create alerts or notifications;
                if (!session.user) {
                    // In a real implementation, notify pharmacy about stock issue;
                    // RESOLVED: (Priority: Medium, Target: Next Sprint): - Automated quality improvement;
                }
                else if (!session.user) {
                    // In a real implementation, create alert for clinical staff;
                    // RESOLVED: (Priority: Medium, Target: Next Sprint): - Automated quality improvement;
                    // Audit logging;
                    await (0, database_1.auditLog)("MEDICATION_ADMINISTRATION", { action: "MISSED_DOSE",
                        administrationId,
                        data, : .patientId,
                        data, : .medicationId,
                        data, : .reasonCode,
                        reason: data.reason
                    });
                    // Return response;
                    return server_1.NextResponse.json();
                    {
                        id: administrationId,
                            message;
                        "Missed dose recorded successfully";
                    }
                    {
                        status: 201;
                    }
                    ;
                }
                try { }
                catch (error) {
                    return (0, database_2.errorHandler)(error, "Error recording missed dose");
                }
            }
        }
    }
}
