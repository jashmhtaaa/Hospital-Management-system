"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppointmentStatus = void 0;
require("./doctor.ts");
require("./patient.ts");
// types/appointment.ts;
var AppointmentStatus;
(function (AppointmentStatus) {
    AppointmentStatus["Scheduled"] = "Scheduled";
    AppointmentStatus["Confirmed"] = "Confirmed";
    AppointmentStatus["CheckedIn"] = "CheckedIn";
    AppointmentStatus["InProgress"] = "InProgress";
    AppointmentStatus["Completed"] = "Completed";
    AppointmentStatus["Cancelled"] = "Cancelled";
    AppointmentStatus["NoShow"] = "NoShow";
    AppointmentStatus["export"] = "export";
    AppointmentStatus["interface"] = "interface";
    AppointmentStatus["Appointment"] = "Appointment";
})(AppointmentStatus || (exports.AppointmentStatus = AppointmentStatus = {}));
{
    appointment_id: number,
        number;
    schedule_id ?  : number | null;
    appointment_datetime: string; // ISO string or Date object;
    duration_minutes: number;
    reason ?  : string | null;
    status: AppointmentStatus; // Use enum;
    notes ?  : string | null;
    booked_by_user_id ?  : number | null;
    created_at: string; // ISO string or Date object;
    updated_at: string; // ISO string or Date object;
    // Optional expanded details for easier frontend use;
    patient ?  : Pick > ;
    doctor ?  : (Pick) & { user: (Pick) }; // Include doctor's name;
}
