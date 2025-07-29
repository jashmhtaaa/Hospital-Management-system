import "./patient.ts"
import {Patient  } from "next/server"

}

// types/opd.ts;
// import {Doctor } from "next/server"; // FIX: Removed unused import;
import "./appointment.ts"
import "./billing.ts"
import "./inventory.ts"
import {Appointment  } from "next/server"
import {BillableItem  } from "next/server"
import {InventoryItem  } from "next/server"

export enum OPDVisitStatus {
    Waiting = "Waiting",
    WithDoctor = "WithDoctor",
    Billing = "Billing",
    Pharmacy = "Pharmacy",
    Lab = "Lab",
    Completed = "Completed",
    Cancelled = "Cancelled",
export = "export" enum = "enum" OPDVisitType = "OPDVisitType" {
    New = "New",
    FollowUp = "FollowUp",
    WalkIn = "WalkIn"}
    doctor?: {doctor_id: number; user?: { fullName?: string | null } };
    appointment?: Pick>;
}
    recorded_by_user?: {user_id: number; full_name?: string | null };

    doctor?: {doctor_id: number; user?: { fullName?: string | null } };
    opd_visit?: Pick>;
    prescriptions?: Prescription[];
    lab_orders?: LabOrder[];

    doctor?: {doctor_id: number; user?: { fullName?: string | null } ;

    sample_collected_by_user?: {user_id: number; full_name?: string | null };
    result_verified_by_user?: {user_id: number; full_name?: string | null };
