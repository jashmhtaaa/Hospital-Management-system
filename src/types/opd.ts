import { {  Patient  } from "./patient.ts"

}

// types/opd.ts;
// import { Doctor } from "./doctor.ts"; // FIX: Removed unused import,
import { } from "./billing.ts"
import "./inventory.ts";
import {  Appointment  } from "./appointment.ts"
import {  BillableItem  } from "@/lib/database"
import {  InventoryItem  } from "@/lib/database"

export enum OPDVisitStatus {
    Waiting = "Waiting",
    WithDoctor = "WithDoctor",
    Billing = "Billing",
    Pharmacy = "Pharmacy",
    Lab = "Lab",
    Completed = "Completed",
    Cancelled = "Cancelled",
export enum OPDVisitType {
    New = "New",
    FollowUp = "FollowUp",
    WalkIn = "WalkIn"}
    doctor?: {doctor_id:number, user?: { fullName?: string | null } };
    appointment?: Pick>;
}
    recorded_by_user?: {user_id:number, full_name?: string | null };

    doctor?: {doctor_id:number, user?: { fullName?: string | null } };
    opd_visit?: Pick>;
    prescriptions?: Prescription[];
    lab_orders?: LabOrder[];
    doctor?: {doctor_id:number, user?: { fullName?: string | null } ;

    sample_collected_by_user?: {user_id:number, full_name?: string | null };
    result_verified_by_user?: {user_id:number, full_name?: string | null };

// OPD (Outpatient Department) types for HMS
export interface OPDVisit {
  id?: number;
  visit_number: string,
  patient_id: number,
  doctor_id: number,
  visit_date: string,
  visit_time: string,
  visit_type: OPDVisitType,
  chief_complaint: string,
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled',
  notes?: string;
  
  // Relations
  patient?: { patient_id: number, name: string };
  doctor?: { doctor_id: number, user?: { fullName?: string | null } };
  appointment?: Pick<Appointment, 'id' | 'date' | 'time'>;
}

export enum OPDVisitType {
  CONSULTATION = 'consultation',
  FOLLOW_UP = 'follow_up',
  EMERGENCY = 'emergency',
  SCREENING = 'screening',
}

export interface OPDConsultation {
  id?: number;
  visit_id: number,
  consultation_date: string,
  chief_complaint: string,
  history_of_present_illness?: string;
  past_medical_history?: string;
  examination_findings?: string;
  diagnosis?: string;
  treatment_plan?: string;
  medications?: string;
  follow_up_instructions?: string;
  
  // Relations
  recorded_by_user?: { user_id: number, full_name?: string | null };
  visit?: OPDVisit;
  doctor?: { doctor_id: number, user?: { fullName?: string | null } };
  opd_visit?: Pick<OPDVisit, 'id' | 'visit_number'>;
  prescriptions?: Prescription[];
  lab_orders?: LabOrder[];
}

export interface LabOrder {
  id?: number;
  order_number: string,
  visit_id: number,
  doctor_id: number,
  test_type: string,
  status: 'pending' | 'collected' | 'processing' | 'completed',
  ordered_date: string,
  
  // Relations
  doctor?: { doctor_id: number, user?: { fullName?: string | null } };
  visit?: OPDVisit;
  sample_collected_by_user?: { user_id: number, full_name?: string | null };
  result_verified_by_user?: { user_id: number, full_name?: string | null };
}

export interface Prescription {
  id?: number;
  visit_id: number,
  medication_name: string,
  dosage: string,
  frequency: string,
  duration: string,
  instructions?: string;
}

export interface Appointment {
  id?: number;
  date: string;
  time: string,
  patient_id: number,
  doctor_id: number,
  status: 'scheduled' | 'completed' | 'cancelled',
}
