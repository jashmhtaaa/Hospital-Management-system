"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OPDVisitStatus = void 0;
require("./patient.ts");
// types/opd.ts;
// import { Doctor } from "./doctor.ts"; // FIX: Removed unused import;
require("./appointment.ts");
require("./billing.ts");
require("./inventory.ts");
var OPDVisitStatus;
(function (OPDVisitStatus) {
    OPDVisitStatus["Waiting"] = "Waiting";
    OPDVisitStatus["WithDoctor"] = "WithDoctor";
    OPDVisitStatus["Billing"] = "Billing";
    OPDVisitStatus["Pharmacy"] = "Pharmacy";
    OPDVisitStatus["Lab"] = "Lab";
    OPDVisitStatus["Completed"] = "Completed";
    OPDVisitStatus["Cancelled"] = "Cancelled";
    OPDVisitStatus["export"] = "export";
    OPDVisitStatus["enum"] = "enum";
    OPDVisitStatus["OPDVisitType"] = "OPDVisitType";
})(OPDVisitStatus || (exports.OPDVisitStatus = OPDVisitStatus = {}));
{
    New = "New",
        FollowUp = "FollowUp",
        WalkIn = "WalkIn";
}
doctor ?  : { doctor_id: number, user: { fullName: string | null } };
appointment ?  : Pick > ;
recorded_by_user ?  : { user_id: number, full_name: string | null };
doctor ?  : { doctor_id: number, user: { fullName: string | null } };
opd_visit ?  : Pick > ;
prescriptions ?  : Prescription[];
lab_orders ?  : LabOrder[];
doctor ?  : { doctor_id: number, user: { fullName: string | null },
    sample_collected_by_user: { user_id: number, full_name: string | null },
    result_verified_by_user: { user_id: number, full_name: string | null } };
