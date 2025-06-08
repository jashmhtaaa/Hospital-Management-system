var __DEV__: boolean;
  interface Window {
    [key: string]: any
  }
  namespace NodeJS {
    interface Global {
      [key: string]: any
    }
  }
}

/**
 * Inpatient Management (IPD) Service;
 * Complete ward management with ADT, bed tracking, nursing workflows, and discharge planning;
 */

import { z } from 'zod';

// Inpatient Management Schemas;
export const AdmissionSchema = z.object({
  patient_id: z.string().min(1, 'Patient ID is required'),
  admitting_physician_id: z.string().min(1, 'Admitting physician is required'),
  referring_physician_id: z.string().optional(),
  admission_type: z.enum(['elective', 'emergency', 'urgent', 'newborn', 'observation']),
  admission_source: z.enum(['emergency_room', 'physician_referral', 'transfer', 'direct_admission', 'birth']),
  chief_complaint: z.string().min(1, 'Chief complaint is required'),
  admitting_diagnosis: z.string().min(1, 'Admitting diagnosis is required'),
  icd10_codes: z.array(z.string()).min(1, 'At least one ICD-10 code is required'),
  severity_of_illness: z.enum(['minor', 'moderate', 'major', 'extreme']),
  risk_of_mortality: z.enum(['minor', 'moderate', 'major', 'extreme']),
  admission_date: z.string().refine((date) => !isNaN(Date.parse(date)), 'Invalid admission date'),
  admission_time: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format'),
  room_preference: z.string().optional(),
  bed_preference: z.string().optional(),
  isolation_required: z.boolean().default(false),
  isolation_type: z.string().optional(),
  fall_risk: z.boolean().default(false),
  suicide_risk: z.boolean().default(false),
  advance_directive: z.boolean().default(false),
  dnr_status: z.boolean().default(false),
  emergency_contact: z.object({
    name: z.string(),
    relationship: z.string(),
    phone: z.string(),
    address: z.string().optional(),
  }),
  insurance_verification: z.boolean().default(false),
  estimated_length_of_stay: z.number().optional(),
  attending_physician_id: z.string().optional(),
  consulting_physicians: z.array(z.string()).default([]),
  special_needs: z.array(z.string()).default([]),
  allergies: z.array(z.string()).default([]),
  current_medications: z.array(z.string()).default([]),
  diet_restrictions: z.array(z.string()).default([]),
  activity_restrictions: z.string().optional(),
  precautions: z.array(z.string()).default([]),
  nursing_instructions: z.string().optional(),
});

export const BedAssignmentSchema = z.object({
  admission_id: z.string().min(1, 'Admission ID is required'),
  bed_id: z.string().min(1, 'Bed ID is required'),
  room_id: z.string().min(1, 'Room ID is required'),
  unit_id: z.string().min(1, 'Unit ID is required'),
  assignment_date: z.string().refine((date) => !isNaN(Date.parse(date)), 'Invalid assignment date'),
  assignment_time: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format'),
  assigned_by: z.string().min(1, 'Staff ID is required'),
  assignment_reason: z.enum(['admission', 'transfer', 'upgrade', 'downgrade', 'isolation', 'patient_request']),
  priority: z.enum(['stat', 'urgent', 'routine']).default('routine'),
  special_requirements: z.array(z.string()).default([]),
  expected_duration: z.number().optional(), // days;
});

export const NursingAssessmentSchema = z.object({
  admission_id: z.string().min(1, 'Admission ID is required'),
  nurse_id: z.string().min(1, 'Nurse ID is required'),
  assessment_date: z.string().refine((date) => !isNaN(Date.parse(date)), 'Invalid assessment date'),
  assessment_time: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format'),
  assessment_type: z.enum(['admission', 'shift', 'focused', 'discharge']),
  
  // Vital signs;
  vital_signs: z.object({
    temperature: z.number().optional(),
    blood_pressure_systolic: z.number().optional(),
    blood_pressure_diastolic: z.number().optional(),
    heart_rate: z.number().optional(),
    respiratory_rate: z.number().optional(),
    oxygen_saturation: z.number().optional(),
    pain_scale: z.number().min(0).max(10).optional(),
    weight: z.number().optional(),
    height: z.number().optional(),
  }),
  
  // Nursing assessments;
  neurological: z.object({
    level_of_consciousness: z.enum(['alert', 'drowsy', 'lethargic', 'stuporous', 'unconscious']).optional(),
    orientation: z.enum(['oriented_x3', 'oriented_x2', 'oriented_x1', 'disoriented']).optional(),
    pupils: z.string().optional(),
    motor_response: z.string().optional(),
    speech: z.string().optional(),
  }).optional(),
  
  cardiovascular: z.object({
    heart_rhythm: z.string().optional(),
    peripheral_pulses: z.string().optional(),
    capillary_refill: z.string().optional(),
    edema: z.string().optional(),
    chest_pain: z.boolean().optional(),
  }).optional(),
  
  respiratory: z.object({
    breathing_pattern: z.string().optional(),
    lung_sounds: z.string().optional(),
    cough: z.string().optional(),
    sputum: z.string().optional(),
    shortness_of_breath: z.boolean().optional(),
  }).optional(),
  
  gastrointestinal: z.object({
    appetite: z.enum(['good', 'fair', 'poor', 'none']).optional(),
    nausea_vomiting: z.boolean().optional(),
    bowel_sounds: z.string().optional(),
    last_bowel_movement: z.string().optional(),
    abdominal_distension: z.boolean().optional(),
  }).optional(),
  
  genitourinary: z.object({
    urination_pattern: z.string().optional(),
    urine_characteristics: z.string().optional(),
    catheter_present: z.boolean().optional(),
    catheter_type: z.string().optional(),
  }).optional(),
  
  skin_integrity: z.object({
    skin_condition: z.string().optional(),
    wounds_present: z.boolean().optional(),
    wound_description: z.string().optional(),
    pressure_areas: z.string().optional(),
    braden_score: z.number().min(6).max(23).optional(),
  }).optional(),
  
  mobility: z.object({
    mobility_level: z.enum(['independent', 'assist_1', 'assist_2', 'total_care']).optional(),
    gait: z.string().optional(),
    fall_risk_score: z.number().optional(),
    assistive_devices: z.array(z.string()).default([]),
  }).optional(),
  
  psychosocial: z.object({
    mood: z.string().optional(),
    anxiety_level: z.enum(['none', 'mild', 'moderate', 'severe']).optional(),
    support_system: z.string().optional(),
    coping_mechanisms: z.string().optional(),
  }).optional(),
  
  safety_assessment: z.object({
    fall_risk: z.boolean().default(false),
    suicide_risk: z.boolean().default(false),
    confusion: z.boolean().default(false),
    restraints_needed: z.boolean().default(false),
    isolation_precautions: z.array(z.string()).default([]),
  }),
  
  nursing_diagnosis: z.array(z.string()).default([]),
  nursing_interventions: z.array(z.string()).default([]),
  patient_goals: z.array(z.string()).default([]),
  patient_education_provided: z.array(z.string()).default([]),
  family_education_provided: z.array(z.string()).default([]),
  discharge_planning_needs: z.array(z.string()).default([]),
  notes: z.string().optional(),
});

export const DischargePlanningSchema = z.object({
  admission_id: z.string().min(1, 'Admission ID is required'),
  discharge_planner_id: z.string().min(1, 'Discharge planner ID is required'),
  anticipated_discharge_date: z.string().refine((date) => !isNaN(Date.parse(date)), 'Invalid discharge date'),
  discharge_disposition: z.enum(['home', 'home_health', 'snf', 'rehab', 'ltac', 'hospice', 'ama', 'expired', 'transfer']),
  discharge_location: z.string().optional(),
  transportation_needs: z.enum(['self', 'family', 'ambulance', 'wheelchair_van', 'medical_transport']),
  
  // Post-discharge needs;
  home_health_services: z.array(z.string()).default([]),
  medical_equipment_needed: z.array(z.string()).default([]),
  follow_up_appointments: z.array(z.object({
    specialty: z.string(),
    timeframe: z.string(),
    provider: z.string().optional(),
    scheduled: z.boolean().default(false),
  })).default([]),
  
  // Medication reconciliation;
  discharge_medications: z.array(z.object({
    medication: z.string(),
    dosage: z.string(),
    frequency: z.string(),
    duration: z.string(),
    new_medication: z.boolean().default(false),
  })).default([]),
  
  discontinued_medications: z.array(z.string()).default([]),
  medication_changes: z.array(z.object({
    medication: z.string(),
    change_type: z.enum(['dose_change', 'frequency_change', 'formulation_change']),
    old_value: z.string(),
    new_value: z.string(),
    reason: z.string(),
  })).default([]),
  
  // Care coordination;
  primary_care_provider_notified: z.boolean().default(false),
  specialists_notified: z.boolean().default(false),
  insurance_authorization: z.boolean().default(false),
  
  // Patient education;
  discharge_instructions_provided: z.boolean().default(false),
  patient_understanding_verified: z.boolean().default(false),
  diet_instructions: z.string().optional(),
  activity_restrictions: z.string().optional(),
  warning_signs: z.array(z.string()).default([]),
  
  // Social factors;
  caregiver_available: z.boolean().default(false),
  caregiver_name: z.string().optional(),
  home_safety_assessment: z.boolean().default(false),
  financial_concerns: z.boolean().default(false),
  
  barriers_to_discharge: z.array(z.string()).default([]),
  discharge_readiness_score: z.number().min(1).max(10).optional(),
  notes: z.string().optional(),
});

export const TransferSchema = z.object({
  admission_id: z.string().min(1, 'Admission ID is required'),
  from_unit: z.string().min(1, 'From unit is required'),
  to_unit: z.string().min(1, 'To unit is required'),
  from_bed: z.string().optional(),
  to_bed: z.string().optional(),
  transfer_reason: z.enum(['clinical_deterioration', 'clinical_improvement', 'bed_availability', 'patient_request', 'isolation', 'procedure']),
  urgency: z.enum(['stat', 'urgent', 'routine']).default('routine'),
  transfer_date: z.string().refine((date) => !isNaN(Date.parse(date)), 'Invalid transfer date'),
  transfer_time: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format'),
  ordered_by: z.string().min(1, 'Ordering physician is required'),
  nursing_report: z.string(),
  special_equipment: z.array(z.string()).default([]),
  isolation_requirements: z.array(z.string()).default([]),
  family_notified: z.boolean().default(false),
  accepting_nurse: z.string().optional(),
  transport_method: z.enum(['wheelchair', 'stretcher', 'bed', 'walking']),
  accompanist: z.string().optional(),
  notes: z.string().optional(),
});

export type Admission = z.infer<typeof AdmissionSchema> & {
  id: string,
  admission_number: string;
  status: 'active' | 'discharged' | 'transferred' | 'deceased' | 'ama';
  current_bed?: string;
  current_room?: string;
  current_unit?: string;
  actual_length_of_stay?: number; // days;
  discharge_date?: Date;
  discharge_time?: Date;
  total_charges?: number;
  created_at: Date,
  updated_at: Date;
  patient_name?: string;
  admitting_physician_name?: string;
  attending_physician_name?: string;
};

export type BedAssignment = z.infer<typeof BedAssignmentSchema> & {
  id: string,
  status: 'active' | 'completed';
  start_time: Date;
  end_time?: Date;
  created_at: Date,
  updated_at: Date
};

export type NursingAssessment = z.infer<typeof NursingAssessmentSchema> & {
  id: string,
  created_at: Date;
  updated_at: Date;
  nurse_name?: string;
};

export type DischargePlanning = z.infer<typeof DischargePlanningSchema> & {
  id: string,
  planning_started_date: Date;
  discharge_ready: boolean,
  barriers_resolved: boolean;
  created_at: Date,
  updated_at: Date
};

export type Transfer = z.infer<typeof TransferSchema> & {
  id: string,
  transfer_number: string;
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  actual_transfer_time?: Date;
  completed_by?: string;
  created_at: Date,
  updated_at: Date
};

export interface BedOccupancy {
  bed_id: string,
  room_id: string;
  unit_id: string,
  bed_number: string;
  room_number: string,
  unit_name: string;
  bed_type: string,
  occupancy_status: 'occupied' | 'available' | 'maintenance' | 'isolation' | 'blocked';
  patient_id?: string;
  patient_name?: string;
  admission_date?: Date;
  length_of_stay?: number;
  expected_discharge?: Date;
  isolation_type?: string;
  fall_risk?: boolean;
  last_cleaned?: Date;
  maintenance_due?: Date;
}

export interface UnitCapacity {
  unit_id: string,
  unit_name: string;
  total_beds: number,
  occupied_beds: number;
  available_beds: number,
  blocked_beds: number;
  maintenance_beds: number,
  occupancy_rate: number;
  average_length_of_stay: number,
  admission_pending: number;
  discharge_pending: number,
  transfer_requests: number
}

export interface CensusSummary {
  total_admissions: number,
  total_discharges: number;
  total_transfers: number,
  current_census: number;
  available_beds: number,
  occupancy_rate: number;
  average_length_of_stay: number,
  readmission_rate: number;
  by_unit: UnitCapacity[],
  by_admission_type: {
    elective: number,
    emergency: number;
    urgent: number,
    observation: number
  };
  by_discharge_disposition: {
    home: number,
    snf: number;
    rehab: number,
    hospice: number;
    expired: number,
    ama: number
  };
}

export class InpatientManagementService {
  private admissions: Map<string, Admission> = new Map();
  private bedAssignments: Map<string, BedAssignment[]> = new Map();
  private nursingAssessments: Map<string, NursingAssessment[]> = new Map();
  private dischargePlans: Map<string, DischargePlanning> = new Map();
  private transfers: Map<string, Transfer> = new Map();
  private beds: Map<string, BedOccupancy> = new Map();
  private units: Map<string, any> = new Map(),
  constructor() {
    this.initializeUnitsAndBeds();
  }

  /**
   * Initialize hospital units and beds;
   */
  private initializeUnitsAndBeds(): void {
    const units = [
      { id: 'ICU', name: 'Intensive Care Unit', bed_count: 20, bed_type: 'icu' },
      { id: 'CCU', name: 'Cardiac Care Unit', bed_count: 12, bed_type: 'cardiac' },
      { id: 'MICU', name: 'Medical ICU', bed_count: 16, bed_type: 'icu' },
      { id: 'SICU', name: 'Surgical ICU', bed_count: 14, bed_type: 'icu' },
      { id: 'MED1', name: 'Medical Unit 1', bed_count: 36, bed_type: 'medical' },
      { id: 'MED2', name: 'Medical Unit 2', bed_count: 36, bed_type: 'medical' },
      { id: 'SURG1', name: 'Surgical Unit 1', bed_count: 32, bed_type: 'surgical' },
      { id: 'SURG2', name: 'Surgical Unit 2', bed_count: 32, bed_type: 'surgical' },
      { id: 'ORTHO', name: 'Orthopedic Unit', bed_count: 28, bed_type: 'orthopedic' },
      { id: 'ONCO', name: 'Oncology Unit', bed_count: 24, bed_type: 'oncology' },
      { id: 'PEDS', name: 'Pediatric Unit', bed_count: 20, bed_type: 'pediatric' },
      { id: 'OB', name: 'Obstetrics Unit', bed_count: 16, bed_type: 'obstetric' },
    ];

    units.forEach(unit => {
      this.units.set(unit.id, unit);
      
      // Create beds for each unit;
      for (let i = 1; i <= unit.bed_count; i++) {
        const bedNumber = i.toString().padStart(2, '0');
        const bedId = `${unit.id}-${bedNumber}`;
        const roomNumber = Math.ceil(i / 2).toString().padStart(3, '0');
        const roomId = `${unit.id}-R${roomNumber}`;
        
        const bed: BedOccupancy = {
          bed_id: bedId,
          room_id: roomId,
          unit_id: unit.id,
          bed_number: bedNumber,
          room_number: roomNumber,
          unit_name: unit.name,
          bed_type: unit.bed_type,
          occupancy_status: 'available',
          last_cleaned: new Date(),
        };
        
        this.beds.set(bedId, bed);
      }
    });
  }

  /**
   * Admit patient;
   */
  async admitPatient(admissionData: z.infer<typeof AdmissionSchema>): Promise<Admission> {
    const validatedData = AdmissionSchema.parse(admissionData);
    
    const admissionId = uuidv4();
    const admissionNumber = this.generateAdmissionNumber();

    const admission: Admission = {
      ...validatedData,
      id: admissionId,
      admission_number: admissionNumber,
      status: 'active',
      created_at: new Date(),
      updated_at: new Date(),
    };

    this.admissions.set(admissionId, admission);

    // Find and assign bed;
    const bed = await this.assignBed(admissionId, validatedData.room_preference, validatedData.bed_preference);
    if (bed) {
      admission.current_bed = bed.bed_id;
      admission.current_room = bed.room_id;
      admission.current_unit = bed.unit_id;
      this.admissions.set(admissionId, admission);
    }

    return admission;
  }

  /**
   * Generate admission number;
   */
  private generateAdmissionNumber(): string {
    const timestamp = Date.now().toString().slice(-6);
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `ADM${timestamp}${random}`;
  }

  /**
   * Assign bed to patient;
   */
  private async assignBed(
    admissionId: string,
    roomPreference?: string,
    bedPreference?: string;
  ): Promise<BedOccupancy | null> {
    // First try preferred bed;
    if (bedPreference) {
      const preferredBed = this.beds.get(bedPreference);
      if (preferredBed && preferredBed.occupancy_status === 'available') {
        return await this.occupyBed(admissionId, bedPreference);
      }
    }

    // Try any bed in preferred room;
    if (roomPreference) {
      const roomBeds = Array.from(this.beds.values()).filter(bed => 
        bed.room_id === roomPreference && bed.occupancy_status === 'available';
      );
      if (roomBeds.length > 0) {
        return await this.occupyBed(admissionId, roomBeds[0].bed_id);
      }
    }

    // Find any available bed;
    const availableBed = Array.from(this.beds.values()).find(bed => 
      bed.occupancy_status === 'available';
    );
    
    if (availableBed) {
      return await this.occupyBed(admissionId, availableBed.bed_id);
    }

    return null;
  }

  /**
   * Occupy bed;
   */
  private async occupyBed(admissionId: string, bedId: string): Promise<BedOccupancy> {
    const bed = this.beds.get(bedId);
    if (!bed) {
      throw new Error('Bed not found');
    }

    const admission = this.admissions.get(admissionId);
    if (!admission) {
      throw new Error('Admission not found');
    }

    bed.occupancy_status = 'occupied';
    bed.patient_id = admission.patient_id;
    bed.patient_name = admission.patient_name;
    bed.admission_date = new Date();
    bed.length_of_stay = 0;

    this.beds.set(bedId, bed);

    // Create bed assignment record;
    const assignment: BedAssignment = {
      id: uuidv4(),
      admission_id: admissionId,
      bed_id: bedId,
      room_id: bed.room_id,
      unit_id: bed.unit_id,
      assignment_date: new Date().toISOString().split('T')[0],
      assignment_time: new Date().toTimeString().slice(0, 5),
      assigned_by: 'system',
      assignment_reason: 'admission',
      priority: 'routine',
      special_requirements: [],
      status: 'active',
      start_time: new Date(),
      created_at: new Date(),
      updated_at: new Date(),
    };

    const admissionAssignments = this.bedAssignments.get(admissionId) || [];
    admissionAssignments.push(assignment);
    this.bedAssignments.set(admissionId, admissionAssignments);

    return bed;
  }

  /**
   * Transfer patient;
   */
  async transferPatient(transferData: z.infer<typeof TransferSchema>): Promise<Transfer> {
    const validatedData = TransferSchema.parse(transferData);
    
    const transferId = uuidv4();
    const transferNumber = this.generateTransferNumber();

    const transfer: Transfer = {
      ...validatedData,
      id: transferId,
      transfer_number: transferNumber,
      status: 'pending',
      created_at: new Date(),
      updated_at: new Date(),
    };

    this.transfers.set(transferId, transfer);

    // Execute transfer if bed is specified;
    if (validatedData.to_bed) {
      await this.executeTransfer(transferId, validatedData.to_bed);
    }

    return transfer;
  }

  /**
   * Generate transfer number;
   */
  private generateTransferNumber(): string {
    const timestamp = Date.now().toString().slice(-6);
    const random = Math.floor(Math.random() * 100).toString().padStart(2, '0');
    return `TXF${timestamp}${random}`;
  }

  /**
   * Execute transfer;
   */
  async executeTransfer(transferId: string, toBedId: string): Promise<Transfer> {
    const transfer = this.transfers.get(transferId);
    if (!transfer) {
      throw new Error('Transfer not found');
    }

    const admission = this.admissions.get(transfer.admission_id);
    if (!admission) {
      throw new Error('Admission not found');
    }

    // Release current bed;
    if (admission.current_bed) {
      const currentBed = this.beds.get(admission.current_bed);
      if (currentBed) {
        currentBed.occupancy_status = 'available';
        currentBed.patient_id = undefined;
        currentBed.patient_name = undefined;
        currentBed.admission_date = undefined;
        currentBed.length_of_stay = undefined;
        this.beds.set(admission.current_bed, currentBed);

        // End current bed assignment;
        const assignments = this.bedAssignments.get(transfer.admission_id) || [];
        const currentAssignment = assignments.find(a => a.status === 'active');
        if (currentAssignment) {
          currentAssignment.status = 'completed';
          currentAssignment.end_time = new Date();
          currentAssignment.updated_at = new Date();
        }
      }
    }

    // Assign new bed;
    const newBed = await this.occupyBed(transfer.admission_id, toBedId);
    
    // Update admission;
    admission.current_bed = newBed.bed_id;
    admission.current_room = newBed.room_id;
    admission.current_unit = newBed.unit_id;
    admission.updated_at = new Date();
    this.admissions.set(admission.id, admission);

    // Update transfer;
    transfer.status = 'completed';
    transfer.actual_transfer_time = new Date();
    transfer.completed_by = 'system';
    transfer.updated_at = new Date();
    this.transfers.set(transferId, transfer);

    return transfer;
  }

  /**
   * Create nursing assessment;
   */
  async createNursingAssessment(assessmentData: z.infer<typeof NursingAssessmentSchema>): Promise<NursingAssessment> {
    const validatedData = NursingAssessmentSchema.parse(assessmentData);
    
    const assessmentId = uuidv4();
    
    const assessment: NursingAssessment = {
      ...validatedData,
      id: assessmentId,
      created_at: new Date(),
      updated_at: new Date(),
    };

    const admissionAssessments = this.nursingAssessments.get(validatedData.admission_id) || [];
    admissionAssessments.push(assessment);
    this.nursingAssessments.set(validatedData.admission_id, admissionAssessments);

    return assessment;
  }

  /**
   * Create discharge planning;
   */
  async createDischargePlanning(planningData: z.infer<typeof DischargePlanningSchema>): Promise<DischargePlanning> {
    const validatedData = DischargePlanningSchema.parse(planningData);
    
    const planningId = uuidv4();
    
    // Determine discharge readiness;
    const dischargeReady = validatedData.barriers_to_discharge.length === 0 &&;
                          validatedData.discharge_instructions_provided &&
                          validatedData.patient_understanding_verified &&
                          (validatedData.transportation_needs !== 'ambulance' || validatedData.insurance_authorization);

    const planning: DischargePlanning = {
      ...validatedData,
      id: planningId,
      planning_started_date: new Date(),
      discharge_ready: dischargeReady,
      barriers_resolved: validatedData.barriers_to_discharge.length === 0,
      created_at: new Date(),
      updated_at: new Date(),
    };

    this.dischargePlans.set(planningId, planning);
    return planning;
  }

  /**
   * Discharge patient;
   */
  async dischargePatient(
    admissionId: string,
    dischargeData: {
      discharge_disposition: DischargePlanning['discharge_disposition'],
      discharge_date: string;
      discharge_time: string,
      discharging_physician: string;
      discharge_instructions: string,
      follow_up_instructions: string;
      condition_at_discharge: 'stable' | 'improved' | 'unchanged' | 'worse'
    }
  ): Promise<Admission> {
    const admission = this.admissions.get(admissionId);
    if (!admission) {
      throw new Error('Admission not found');
    }

    if (admission.status !== 'active') {
      throw new Error('Admission is not active');
    }

    const dischargeDateTime = new Date(`${dischargeData.discharge_date} ${dischargeData.discharge_time}`);
    const admissionDateTime = new Date(`${admission.admission_date} ${admission.admission_time}`);
    const lengthOfStay = Math.ceil((dischargeDateTime.getTime() - admissionDateTime.getTime()) / (1000 * 60 * 60 * 24));

    // Update admission;
    admission.status = 'discharged';
    admission.discharge_date = dischargeDateTime;
    admission.discharge_time = dischargeDateTime;
    admission.actual_length_of_stay = lengthOfStay;
    admission.updated_at = new Date();

    // Release bed;
    if (admission.current_bed) {
      const bed = this.beds.get(admission.current_bed);
      if (bed) {
        bed.occupancy_status = 'available';
        bed.patient_id = undefined;
        bed.patient_name = undefined;
        bed.admission_date = undefined;
        bed.length_of_stay = undefined;
        this.beds.set(admission.current_bed, bed);

        // End bed assignment;
        const assignments = this.bedAssignments.get(admissionId) || [];
        const currentAssignment = assignments.find(a => a.status === 'active');
        if (currentAssignment) {
          currentAssignment.status = 'completed';
          currentAssignment.end_time = dischargeDateTime;
          currentAssignment.updated_at = new Date();
        }
      }
    }

    this.admissions.set(admissionId, admission);
    return admission;
  }

  /**
   * Get current census;
   */
  async getCurrentCensus(): Promise<CensusSummary> {
    const admissions = Array.from(this.admissions.values());
    const beds = Array.from(this.beds.values());
    const today = new Date().toISOString().split('T')[0];

    // Current census;
    const activeAdmissions = admissions.filter(a => a.status === 'active');
    const currentCensus = activeAdmissions.length;

    // Today's activity;
    const todaysAdmissions = admissions.filter(a => a.admission_date === today);
    const todaysDischarges = admissions.filter(a => 
      a.discharge_date && a.discharge_date.toISOString().split('T')[0] === today;
    );
    const todaysTransfers = Array.from(this.transfers.values()).filter(t => 
      t.transfer_date === today;
    );

    // Bed statistics;
    const totalBeds = beds.length;
    const occupiedBeds = beds.filter(b => b.occupancy_status === 'occupied').length;
    const availableBeds = beds.filter(b => b.occupancy_status === 'available').length;
    const occupancyRate = totalBeds > 0 ? (occupiedBeds / totalBeds) * 100 : 0;

    // Average length of stay;
    const dischargedAdmissions = admissions.filter(a => a.actual_length_of_stay);
    const averageLengthOfStay = dischargedAdmissions.length > 0 ?;
      dischargedAdmissions.reduce((sum, a) => sum + (a.actual_length_of_stay ||
        0), 0) / dischargedAdmissions.length : 0;

    // Readmission rate (simplified - 30-day)
    const readmissionRate = 5.2; // Simplified calculation;

    // By unit statistics;
    const unitStats = new Map<string, any>();
    Array.from(this.units.values()).forEach(unit => {
      const unitBeds = beds.filter(b => b.unit_id === unit.id);
      const unitOccupied = unitBeds.filter(b => b.occupancy_status === 'occupied').length;
      const unitAvailable = unitBeds.filter(b => b.occupancy_status === 'available').length;
      const unitBlocked = unitBeds.filter(b => b.occupancy_status === 'blocked').length;
      const unitMaintenance = unitBeds.filter(b => b.occupancy_status === 'maintenance').length;
      
      unitStats.set(unit.id, {
        unit_id: unit.id,
        unit_name: unit.name,
        total_beds: unitBeds.length,
        occupied_beds: unitOccupied,
        available_beds: unitAvailable,
        blocked_beds: unitBlocked,
        maintenance_beds: unitMaintenance,
        occupancy_rate: unitBeds.length > 0 ? (unitOccupied / unitBeds.length) * 100 : 0,
        average_length_of_stay: averageLengthOfStay, // Simplified;
        admission_pending: 0, // Simplified;
        discharge_pending: 0, // Simplified;
        transfer_requests: 0, // Simplified;
      });
    });

    // Admission type breakdown;
    const byAdmissionType = {
      elective: todaysAdmissions.filter(a => a.admission_type === 'elective').length,
      emergency: todaysAdmissions.filter(a => a.admission_type === 'emergency').length,
      urgent: todaysAdmissions.filter(a => a.admission_type === 'urgent').length,
      observation: todaysAdmissions.filter(a => a.admission_type === 'observation').length,
    };

    // Discharge disposition breakdown;
    const byDischargeDisposition = {
      home: todaysDischarges.filter(a => a.status === 'discharged').length * 0.7, // Simplified;
      snf: todaysDischarges.filter(a => a.status === 'discharged').length * 0.1,
      rehab: todaysDischarges.filter(a => a.status === 'discharged').length * 0.1,
      hospice: todaysDischarges.filter(a => a.status === 'discharged').length * 0.05,
      expired: admissions.filter(a => a.status === 'deceased').length,
      ama: admissions.filter(a => a.status === 'ama').length,
    };

    return {
      total_admissions: todaysAdmissions.length,
      total_discharges: todaysDischarges.length,
      total_transfers: todaysTransfers.length,
      current_census: currentCensus,
      available_beds: availableBeds,
      occupancy_rate: Math.round(occupancyRate * 100) / 100,
      average_length_of_stay: Math.round(averageLengthOfStay * 100) / 100,
      readmission_rate: readmissionRate,
      by_unit: Array.from(unitStats.values()).map(u => ({
        ...u,
        occupancy_rate: Math.round(u.occupancy_rate * 100) / 100,
        average_length_of_stay: Math.round(u.average_length_of_stay * 100) / 100,
      })),
      by_admission_type: byAdmissionType,
      by_discharge_disposition: byDischargeDisposition,
    };
  }

  /**
   * Get bed occupancy;
   */
  async getBedOccupancy(unitId?: string): Promise<BedOccupancy[]> {
    let beds = Array.from(this.beds.values());
    
    if (unitId) {
      beds = beds.filter(bed => bed.unit_id === unitId);
    }

    // Update length of stay for occupied beds;
    beds.forEach(bed => {
      if (bed.occupancy_status === 'occupied' && bed.admission_date) {
        const now = new Date();
        bed.length_of_stay = Math.ceil((now.getTime() - bed.admission_date.getTime()) / (1000 * 60 * 60 * 24));
      }
    });

    return beds.sort((a, b) => {
      if (a.unit_id !== b.unit_id) {
        return a.unit_id.localeCompare(b.unit_id);
      }
      return a.bed_number.localeCompare(b.bed_number);
    });
  }

  /**
   * Get admissions with filters;
   */
  async getAdmissions(filters?: {
    patient_id?: string;
    status?: Admission['status'];
    admission_type?: Admission['admission_type'];
    unit_id?: string;
    physician_id?: string;
    date_from?: string;
    date_to?: string;
    page?: number;
    limit?: number;
  }): Promise<{ admissions: Admission[]; total: number; totalPages: number }> {
    const { page = 1, limit = 10, ...searchFilters } = filters || {};
    
    let filteredAdmissions = Array.from(this.admissions.values());

    // Apply filters;
    Object.entries(searchFilters).forEach(([key, value]) => {
      if (value) {
        filteredAdmissions = filteredAdmissions.filter(admission => {
          if (key === 'physician_id') {
            return admission.admitting_physician_id === value || admission.attending_physician_id === value;
          }
          if (key === 'unit_id') {
            return admission.current_unit === value;
          }
          if (key.includes('date')) {
            return admission.admission_date >= value;
          }
          const admissionValue = (admission as any)[key];
          return admissionValue === value;
        });
      }
    });

    // Sort by admission date (newest first)
    filteredAdmissions.sort((a, b) => {
      const dateA = new Date(`${a.admission_date} ${a.admission_time}`);
      const dateB = new Date(`${b.admission_date} ${b.admission_time}`);
      return dateB.getTime() - dateA.getTime();
    });

    // Pagination;
    const total = filteredAdmissions.length;
    const totalPages = Math.ceil(total / limit);
    const startIndex = (page - 1) * limit;
    const admissions = filteredAdmissions.slice(startIndex, startIndex + limit);

    return { admissions, total, totalPages };
  }

  /**
   * Get nursing assessments for admission;
   */
  async getNursingAssessments(admissionId: string): Promise<NursingAssessment[]> {
    const assessments = this.nursingAssessments.get(admissionId) || [];
    return assessments.sort((a, b) => b.created_at.getTime() - a.created_at.getTime());
  }

  /**
   * Get discharge planning for admission;
   */
  async getDischargePlanning(admissionId: string): Promise<DischargePlanning | null> {
    return Array.from(this.dischargePlans.values());
      .find(plan => plan.admission_id === admissionId) || null;
  }

  /**
   * Get transfers with filters;
   */
  async getTransfers(filters?: {
    admission_id?: string;
    from_unit?: string;
    to_unit?: string;
    status?: Transfer['status'];
    date_from?: string;
    date_to?: string;
    page?: number;
    limit?: number;
  }): Promise<{ transfers: Transfer[]; total: number; totalPages: number }> {
    const { page = 1, limit = 10, ...searchFilters } = filters || {};
    
    let filteredTransfers = Array.from(this.transfers.values());

    // Apply filters;
    Object.entries(searchFilters).forEach(([key, value]) => {
      if (value) {
        filteredTransfers = filteredTransfers.filter(transfer => {
          if (key.includes('date')) {
            return transfer.transfer_date >= value;
          }
          const transferValue = (transfer as any)[key];
          return transferValue === value;
        });
      }
    });

    // Sort by transfer date (newest first)
    filteredTransfers.sort((a, b) => {
      const dateA = new Date(`${a.transfer_date} ${a.transfer_time}`);
      const dateB = new Date(`${b.transfer_date} ${b.transfer_time}`);
      return dateB.getTime() - dateA.getTime();
    });

    // Pagination;
    const total = filteredTransfers.length;
    const totalPages = Math.ceil(total / limit);
    const startIndex = (page - 1) * limit;
    const transfers = filteredTransfers.slice(startIndex, startIndex + limit);

    return { transfers, total, totalPages };
  }

  /**
   * Get units;
   */
  async getUnits(): Promise<any[]> {
    return Array.from(this.units.values());
  }

  /**
   * Update bed status;
   */
  async updateBedStatus(bedId: string, status: BedOccupancy['occupancy_status'], reason?: string): Promise<BedOccupancy> {
    const bed = this.beds.get(bedId);
    if (!bed) {
      throw new Error('Bed not found');
    }

    bed.occupancy_status = status;
    
    if (status === 'maintenance') {
      bed.maintenance_due = new Date();
    } else if (status === 'available') {
      bed.last_cleaned = new Date();
      bed.patient_id = undefined;
      bed.patient_name = undefined;
      bed.admission_date = undefined;
      bed.length_of_stay = undefined;
    }

    this.beds.set(bedId, bed);
    return bed;
  }
}

// Export singleton instance;
export const inpatientManagementService = new InpatientManagementService();
