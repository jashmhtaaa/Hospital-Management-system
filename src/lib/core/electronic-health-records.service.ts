/**
 * Electronic Health Records (EHR) Service
 * Complete EHR system with SOAP notes, care plans, clinical pathways, and decision support
 */

import { z } from 'zod';
import { v4 as uuidv4 } from 'uuid';

// Clinical Note Schemas
export const ClinicalNoteSchema = z.object({
  patient_id: z.string().min(1, 'Patient ID is required'),
  encounter_id: z.string().min(1, 'Encounter ID is required'),
  provider_id: z.string().min(1, 'Provider ID is required'),
  note_type: z.enum(['progress_note', 'soap_note', 'admission_note', 'discharge_summary', 'consultation_note', 'procedure_note', 'nursing_note']),
  template_id: z.string().optional(),
  
  // SOAP components
  subjective: z.string().optional(),
  objective: z.string().optional(),
  assessment: z.string().optional(),
  plan: z.string().optional(),
  
  // Structured data
  chief_complaint: z.string().optional(),
  history_of_present_illness: z.string().optional(),
  review_of_systems: z.string().optional(),
  past_medical_history: z.string().optional(),
  medications: z.string().optional(),
  allergies: z.string().optional(),
  social_history: z.string().optional(),
  family_history: z.string().optional(),
  physical_examination: z.string().optional(),
  vital_signs: z.object({
    temperature: z.number().optional(),
    blood_pressure_systolic: z.number().optional(),
    blood_pressure_diastolic: z.number().optional(),
    heart_rate: z.number().optional(),
    respiratory_rate: z.number().optional(),
    oxygen_saturation: z.number().optional(),
    weight: z.number().optional(),
    height: z.number().optional(),
    bmi: z.number().optional(),
    pain_scale: z.number().min(0).max(10).optional(),
  }).optional(),
  
  // Diagnoses
  primary_diagnosis: z.string().optional(),
  secondary_diagnoses: z.array(z.string()).default([]),
  icd10_codes: z.array(z.string()).default([]),
  
  // Treatment plan
  orders: z.array(z.object({
    type: z.enum(['medication', 'lab', 'imaging', 'procedure', 'consultation', 'therapy']),
    description: z.string(),
    instructions: z.string().optional(),
    priority: z.enum(['routine', 'urgent', 'stat']).default('routine'),
  })).default([]),
  
  // Follow-up
  follow_up_instructions: z.string().optional(),
  return_visit_interval: z.string().optional(),
  discharge_disposition: z.string().optional(),
  
  // Clinical decision support
  alerts_triggered: z.array(z.string()).default([]),
  guidelines_referenced: z.array(z.string()).default([]),
  
  // Note metadata
  note_status: z.enum(['draft', 'preliminary', 'final', 'amended', 'corrected']).default('draft'),
  priority: z.enum(['routine', 'urgent', 'stat']).default('routine'),
  confidentiality_level: z.enum(['normal', 'restricted', 'very_restricted']).default('normal'),
  
  // Voice-to-text
  audio_recording_id: z.string().optional(),
  transcription_confidence: z.number().min(0).max(1).optional(),
  
  // Template and formatting
  free_text_content: z.string().optional(),
  structured_data: z.record(z.any()).optional(),
});

export const CarePlanSchema = z.object({
  patient_id: z.string().min(1, 'Patient ID is required'),
  provider_id: z.string().min(1, 'Provider ID is required'),
  care_plan_name: z.string().min(1, 'Care plan name is required'),
  diagnosis: z.string().min(1, 'Primary diagnosis is required'),
  icd10_code: z.string().optional(),
  
  goals: z.array(z.object({
    id: z.string(),
    description: z.string(),
    target_date: z.string().optional(),
    priority: z.enum(['high', 'medium', 'low']).default('medium'),
    status: z.enum(['active', 'completed', 'cancelled', 'on_hold']).default('active'),
    outcome_measure: z.string().optional(),
    target_value: z.string().optional(),
    current_value: z.string().optional(),
  })),
  
  interventions: z.array(z.object({
    id: z.string(),
    type: z.enum(['medication', 'therapy', 'lifestyle', 'monitoring', 'education', 'procedure']),
    description: z.string(),
    instructions: z.string().optional(),
    frequency: z.string().optional(),
    duration: z.string().optional(),
    responsible_provider: z.string().optional(),
    status: z.enum(['active', 'completed', 'discontinued', 'pending']).default('active'),
  })),
  
  care_team: z.array(z.object({
    provider_id: z.string(),
    role: z.string(),
    responsibilities: z.string().optional(),
    contact_information: z.string().optional(),
  })),
  
  patient_preferences: z.string().optional(),
  barriers_to_care: z.array(z.string()).default([]),
  social_determinants: z.array(z.string()).default([]),
  
  review_date: z.string().optional(),
  effective_date: z.string(),
  end_date: z.string().optional(),
  
  status: z.enum(['active', 'completed', 'cancelled', 'on_hold']).default('active'),
  notes: z.string().optional(),
});

export const ProblemListSchema = z.object({
  patient_id: z.string().min(1, 'Patient ID is required'),
  provider_id: z.string().min(1, 'Provider ID is required'),
  
  problem_name: z.string().min(1, 'Problem name is required'),
  icd10_code: z.string().optional(),
  snomed_code: z.string().optional(),
  
  problem_type: z.enum(['diagnosis', 'symptom', 'finding', 'concern']),
  severity: z.enum(['mild', 'moderate', 'severe', 'critical']).optional(),
  
  onset_date: z.string().optional(),
  resolution_date: z.string().optional(),
  
  status: z.enum(['active', 'resolved', 'inactive', 'chronic', 'recurrent']),
  verification_status: z.enum(['confirmed', 'provisional', 'differential', 'ruled_out']),
  
  priority: z.enum(['high', 'medium', 'low']).default('medium'),
  
  clinical_context: z.string().optional(),
  treatment_status: z.string().optional(),
  
  related_encounters: z.array(z.string()).default([]),
  related_problems: z.array(z.string()).default([]),
  
  notes: z.string().optional(),
});

export const ClinicalGuidelineSchema = z.object({
  guideline_id: z.string(),
  name: z.string(),
  organization: z.string(),
  version: z.string(),
  effective_date: z.string(),
  
  applicable_conditions: z.array(z.string()),
  icd10_codes: z.array(z.string()),
  
  recommendations: z.array(z.object({
    id: z.string(),
    recommendation_text: z.string(),
    strength: z.enum(['strong', 'weak', 'conditional']),
    quality_of_evidence: z.enum(['high', 'moderate', 'low', 'very_low']),
    patient_population: z.string().optional(),
    considerations: z.string().optional(),
  })),
  
  decision_support_rules: z.array(z.object({
    rule_id: z.string(),
    condition: z.string(),
    action: z.string(),
    alert_type: z.enum(['info', 'warning', 'critical']),
  })),
  
  evidence_links: z.array(z.string()).default([]),
  references: z.array(z.string()).default([]),
});

export type ClinicalNote = z.infer<typeof ClinicalNoteSchema> & {
  id: string;
  note_number: string;
  created_at: Date;
  updated_at: Date;
  signed_at?: Date;
  signed_by?: string;
  amendments: string[];
  version: number;
  provider_name?: string;
  patient_name?: string;
};

export type CarePlan = z.infer<typeof CarePlanSchema> & {
  id: string;
  care_plan_number: string;
  created_at: Date;
  updated_at: Date;
  version: number;
  last_reviewed_date?: Date;
  next_review_date?: Date;
};

export type ProblemListItem = z.infer<typeof ProblemListSchema> & {
  id: string;
  created_at: Date;
  updated_at: Date;
  last_updated_by: string;
};

export type ClinicalGuideline = z.infer<typeof ClinicalGuidelineSchema> & {
  id: string;
  created_at: Date;
  updated_at: Date;
  usage_count: number;
  last_used: Date;
};

export interface ClinicalDecisionSupport {
  patient_id: string;
  encounter_id: string;
  alerts: {
    id: string;
    type: 'drug_interaction' | 'allergy' | 'guideline_reminder' | 'preventive_care' | 'lab_result' | 'vital_sign';
    severity: 'info' | 'warning' | 'critical';
    message: string;
    recommendation: string;
    source: string;
    dismissed: boolean;
    dismissed_by?: string;
    dismissed_at?: Date;
    dismiss_reason?: string;
  }[];
  guidelines: {
    guideline_id: string;
    name: string;
    applicable_recommendations: string[];
    triggered_rules: string[];
  }[];
}

export interface QualityMeasure {
  id: string;
  name: string;
  description: string;
  numerator_criteria: string;
  denominator_criteria: string;
  patient_applicable: boolean;
  current_status: 'met' | 'not_met' | 'excluded';
  performance_rate: number;
  reporting_period: string;
  next_opportunity: string;
}

export interface ClinicalSummary {
  patient_id: string;
  generated_date: Date;
  summary_type: 'encounter' | 'episodic' | 'comprehensive';
  
  demographics: {
    name: string;
    age: number;
    gender: string;
    mrn: string;
  };
  
  active_problems: ProblemListItem[];
  current_medications: string[];
  allergies: string[];
  recent_vitals: any;
  recent_lab_results: any[];
  
  care_plans: CarePlan[];
  upcoming_appointments: any[];
  pending_orders: any[];
  
  quality_measures: QualityMeasure[];
  risk_factors: string[];
  
  provider_notes: string;
  last_encounter_date: Date;
}

export class ElectronicHealthRecordsService {
  private clinicalNotes: Map<string, ClinicalNote> = new Map();
  private carePlans: Map<string, CarePlan> = new Map();
  private problemLists: Map<string, ProblemListItem[]> = new Map();
  private clinicalGuidelines: Map<string, ClinicalGuideline> = new Map();
  private templates: Map<string, any> = new Map();
  private decisionSupport: Map<string, ClinicalDecisionSupport> = new Map();

  constructor() {
    this.initializeClinicalGuidelines();
    this.initializeNoteTemplates();
  }

  /**
   * Initialize clinical guidelines
   */
  private initializeClinicalGuidelines(): void {
    const guidelines: Omit<ClinicalGuideline, 'id' | 'created_at' | 'updated_at' | 'usage_count' | 'last_used'>[] = [
      {
        guideline_id: 'AHA-HTN-2024',
        name: 'Hypertension Management Guidelines',
        organization: 'American Heart Association',
        version: '2024.1',
        effective_date: '2024-01-01',
        applicable_conditions: ['Essential Hypertension', 'Secondary Hypertension'],
        icd10_codes: ['I10', 'I15.0', 'I15.1', 'I15.2'],
        recommendations: [
          {
            id: 'HTN-1',
            recommendation_text: 'Target blood pressure <130/80 mmHg for most adults',
            strength: 'strong',
            quality_of_evidence: 'high',
            patient_population: 'Adults with hypertension',
            considerations: 'Consider individual patient factors and comorbidities',
          },
          {
            id: 'HTN-2',
            recommendation_text: 'First-line therapy should include ACE inhibitor, ARB, calcium channel blocker, or thiazide diuretic',
            strength: 'strong',
            quality_of_evidence: 'high',
            patient_population: 'Adults initiating antihypertensive therapy',
          },
        ],
        decision_support_rules: [
          {
            rule_id: 'HTN-ALERT-1',
            condition: 'BP >= 180/110',
            action: 'Alert provider of hypertensive crisis',
            alert_type: 'critical',
          },
          {
            rule_id: 'HTN-ALERT-2',
            condition: 'BP >= 140/90 without medication',
            action: 'Suggest antihypertensive therapy',
            alert_type: 'warning',
          },
        ],
        evidence_links: ['https://doi.org/10.1161/HYP.0000000000000065'],
        references: ['2017 ACC/AHA/AAPA/ABC/ACPM/AGS/APhA/ASH/ASPC/NMA/PCNA Guideline for the Prevention, Detection, Evaluation, and Management of High Blood Pressure in Adults'],
      },
      {
        guideline_id: 'ADA-DM-2024',
        name: 'Standards of Medical Care in Diabetes',
        organization: 'American Diabetes Association',
        version: '2024.1',
        effective_date: '2024-01-01',
        applicable_conditions: ['Type 1 Diabetes', 'Type 2 Diabetes', 'Gestational Diabetes'],
        icd10_codes: ['E10', 'E11', 'O24'],
        recommendations: [
          {
            id: 'DM-1',
            recommendation_text: 'Target HbA1c <7% for most adults with diabetes',
            strength: 'strong',
            quality_of_evidence: 'high',
            patient_population: 'Adults with Type 1 or Type 2 diabetes',
          },
          {
            id: 'DM-2',
            recommendation_text: 'Metformin should be first-line therapy for Type 2 diabetes unless contraindicated',
            strength: 'strong',
            quality_of_evidence: 'high',
            patient_population: 'Adults with Type 2 diabetes',
          },
        ],
        decision_support_rules: [
          {
            rule_id: 'DM-ALERT-1',
            condition: 'HbA1c > 9%',
            action: 'Alert provider of poor glycemic control',
            alert_type: 'warning',
          },
          {
            rule_id: 'DM-ALERT-2',
            condition: 'No HbA1c in past 6 months',
            action: 'Recommend HbA1c testing',
            alert_type: 'info',
          },
        ],
        evidence_links: ['https://doi.org/10.2337/dc24-S001'],
        references: ['American Diabetes Association. Standards of Medical Care in Diabetes—2024. Diabetes Care 2024;47(Suppl. 1)'],
      },
    ];

    guidelines.forEach(guidelineData => {
      const guideline: ClinicalGuideline = {
        ...guidelineData,
        id: uuidv4(),
        created_at: new Date(),
        updated_at: new Date(),
        usage_count: 0,
        last_used: new Date(),
      };
      this.clinicalGuidelines.set(guideline.guideline_id, guideline);
    });
  }

  /**
   * Initialize note templates
   */
  private initializeNoteTemplates(): void {
    const templates = [
      {
        id: 'soap-general',
        name: 'General SOAP Note',
        type: 'soap_note',
        template: {
          subjective: 'Chief Complaint:\n\nHistory of Present Illness:\n\nReview of Systems:\n',
          objective: 'Vital Signs:\n\nPhysical Examination:\n\nLaboratory/Diagnostic Results:\n',
          assessment: 'Primary Diagnosis:\n\nSecondary Diagnoses:\n\nDifferential Diagnosis:\n',
          plan: 'Treatment Plan:\n\nOrders:\n\nFollow-up:\n\nPatient Education:\n',
        },
      },
      {
        id: 'progress-note',
        name: 'Progress Note',
        type: 'progress_note',
        template: {
          interval_history: 'Patient reports:\n',
          objective: 'Vital Signs:\nPhysical Examination:\n',
          assessment: 'Assessment and Plan:\n',
        },
      },
      {
        id: 'discharge-summary',
        name: 'Discharge Summary',
        type: 'discharge_summary',
        template: {
          admission_diagnosis: '',
          discharge_diagnosis: '',
          hospital_course: '',
          discharge_medications: '',
          follow_up_instructions: '',
          discharge_disposition: '',
        },
      },
    ];

    templates.forEach(template => {
      this.templates.set(template.id, template);
    });
  }

  /**
   * Create clinical note
   */
  async createClinicalNote(noteData: z.infer<typeof ClinicalNoteSchema>): Promise<ClinicalNote> {
    const validatedData = ClinicalNoteSchema.parse(noteData);
    
    const noteId = uuidv4();
    const noteNumber = this.generateNoteNumber();

    // Apply template if specified
    let templateData = {};
    if (validatedData.template_id) {
      const template = this.templates.get(validatedData.template_id);
      if (template) {
        templateData = template.template;
      }
    }

    const clinicalNote: ClinicalNote = {
      ...validatedData,
      ...templateData,
      id: noteId,
      note_number: noteNumber,
      created_at: new Date(),
      updated_at: new Date(),
      amendments: [],
      version: 1,
    };

    this.clinicalNotes.set(noteId, clinicalNote);

    // Trigger clinical decision support
    await this.triggerClinicalDecisionSupport(validatedData.patient_id, validatedData.encounter_id, clinicalNote);

    return clinicalNote;
  }

  /**
   * Generate note number
   */
  private generateNoteNumber(): string {
    const timestamp = Date.now().toString().slice(-6);
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `NOTE${timestamp}${random}`;
  }

  /**
   * Update clinical note
   */
  async updateClinicalNote(noteId: string, updateData: Partial<ClinicalNote>): Promise<ClinicalNote> {
    const existingNote = this.clinicalNotes.get(noteId);
    if (!existingNote) {
      throw new Error('Clinical note not found');
    }

    if (existingNote.note_status === 'final' && existingNote.signed_at) {
      throw new Error('Cannot modify signed note. Create an amendment instead.');
    }

    const updatedNote: ClinicalNote = {
      ...existingNote,
      ...updateData,
      updated_at: new Date(),
    };

    this.clinicalNotes.set(noteId, updatedNote);
    return updatedNote;
  }

  /**
   * Sign clinical note
   */
  async signClinicalNote(noteId: string, providerId: string): Promise<ClinicalNote> {
    const note = this.clinicalNotes.get(noteId);
    if (!note) {
      throw new Error('Clinical note not found');
    }

    if (note.note_status === 'final') {
      throw new Error('Note is already signed');
    }

    note.note_status = 'final';
    note.signed_at = new Date();
    note.signed_by = providerId;
    note.updated_at = new Date();

    this.clinicalNotes.set(noteId, note);
    return note;
  }

  /**
   * Create note amendment
   */
  async createNoteAmendment(originalNoteId: string, amendmentText: string, providerId: string): Promise<ClinicalNote> {
    const originalNote = this.clinicalNotes.get(originalNoteId);
    if (!originalNote) {
      throw new Error('Original note not found');
    }

    if (originalNote.note_status !== 'final') {
      throw new Error('Can only amend signed notes');
    }

    const amendmentId = uuidv4();
    const amendmentNumber = `${originalNote.note_number}-AMEND-${originalNote.amendments.length + 1}`;

    const amendment: ClinicalNote = {
      ...originalNote,
      id: amendmentId,
      note_number: amendmentNumber,
      note_status: 'amended',
      free_text_content: amendmentText,
      created_at: new Date(),
      updated_at: new Date(),
      signed_at: new Date(),
      signed_by: providerId,
      version: originalNote.version + 1,
      amendments: [],
    };

    // Update original note to reference amendment
    originalNote.amendments.push(amendmentId);
    originalNote.updated_at = new Date();

    this.clinicalNotes.set(amendmentId, amendment);
    this.clinicalNotes.set(originalNoteId, originalNote);

    return amendment;
  }

  /**
   * Create care plan
   */
  async createCarePlan(carePlanData: z.infer<typeof CarePlanSchema>): Promise<CarePlan> {
    const validatedData = CarePlanSchema.parse(carePlanData);
    
    const carePlanId = uuidv4();
    const carePlanNumber = this.generateCarePlanNumber();

    // Calculate next review date (default 30 days)
    const nextReviewDate = new Date();
    nextReviewDate.setDate(nextReviewDate.getDate() + 30);

    const carePlan: CarePlan = {
      ...validatedData,
      id: carePlanId,
      care_plan_number: carePlanNumber,
      created_at: new Date(),
      updated_at: new Date(),
      version: 1,
      next_review_date: nextReviewDate.toISOString().split('T')[0],
    };

    this.carePlans.set(carePlanId, carePlan);
    return carePlan;
  }

  /**
   * Generate care plan number
   */
  private generateCarePlanNumber(): string {
    const timestamp = Date.now().toString().slice(-6);
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `CP${timestamp}${random}`;
  }

  /**
   * Add problem to patient's problem list
   */
  async addProblem(problemData: z.infer<typeof ProblemListSchema>): Promise<ProblemListItem> {
    const validatedData = ProblemListSchema.parse(problemData);
    
    const problemId = uuidv4();
    
    const problem: ProblemListItem = {
      ...validatedData,
      id: problemId,
      created_at: new Date(),
      updated_at: new Date(),
      last_updated_by: validatedData.provider_id,
    };

    const patientProblems = this.problemLists.get(validatedData.patient_id) || [];
    patientProblems.push(problem);
    this.problemLists.set(validatedData.patient_id, patientProblems);

    return problem;
  }

  /**
   * Update problem status
   */
  async updateProblemStatus(
    patientId: string,
    problemId: string,
    status: ProblemListItem['status'],
    providerId: string,
    resolutionDate?: string
  ): Promise<ProblemListItem> {
    const patientProblems = this.problemLists.get(patientId) || [];
    const problem = patientProblems.find(p => p.id === problemId);
    
    if (!problem) {
      throw new Error('Problem not found');
    }

    problem.status = status;
    problem.last_updated_by = providerId;
    problem.updated_at = new Date();
    
    if (status === 'resolved' && resolutionDate) {
      problem.resolution_date = resolutionDate;
    }

    this.problemLists.set(patientId, patientProblems);
    return problem;
  }

  /**
   * Get patient's active problems
   */
  async getActiveProblems(patientId: string): Promise<ProblemListItem[]> {
    const patientProblems = this.problemLists.get(patientId) || [];
    return patientProblems.filter(problem => problem.status === 'active' || problem.status === 'chronic');
  }

  /**
   * Trigger clinical decision support
   */
  private async triggerClinicalDecisionSupport(
    patientId: string,
    encounterId: string,
    note: ClinicalNote
  ): Promise<void> {
    const alerts: ClinicalDecisionSupport['alerts'] = [];
    const guidelines: ClinicalDecisionSupport['guidelines'] = [];

    // Check vital signs for alerts
    if (note.vital_signs) {
      if (note.vital_signs.blood_pressure_systolic && note.vital_signs.blood_pressure_systolic >= 180) {
        alerts.push({
          id: uuidv4(),
          type: 'vital_sign',
          severity: 'critical',
          message: 'Hypertensive crisis detected',
          recommendation: 'Immediate evaluation and treatment required',
          source: 'Clinical Decision Support',
          dismissed: false,
        });
      }

      if (note.vital_signs.temperature && note.vital_signs.temperature >= 102) {
        alerts.push({
          id: uuidv4(),
          type: 'vital_sign',
          severity: 'warning',
          message: 'High fever detected',
          recommendation: 'Consider infectious workup and antipyretic therapy',
          source: 'Clinical Decision Support',
          dismissed: false,
        });
      }
    }

    // Check for applicable guidelines
    const applicableGuidelines = Array.from(this.clinicalGuidelines.values())
      .filter(guideline => {
        return note.icd10_codes.some(code => 
          guideline.icd10_codes.some(guidelineCode => 
            code.startsWith(guidelineCode)
          )
        );
      });

    for (const guideline of applicableGuidelines) {
      guideline.usage_count++;
      guideline.last_used = new Date();
      
      const applicableRecommendations = guideline.recommendations.map(rec => rec.recommendation_text);
      const triggeredRules = guideline.decision_support_rules
        .filter(rule => this.evaluateRule(rule, note))
        .map(rule => rule.rule_id);

      if (applicableRecommendations.length > 0 || triggeredRules.length > 0) {
        guidelines.push({
          guideline_id: guideline.guideline_id,
          name: guideline.name,
          applicable_recommendations: applicableRecommendations,
          triggered_rules: triggeredRules,
        });

        // Create alerts for triggered rules
        for (const rule of guideline.decision_support_rules) {
          if (triggeredRules.includes(rule.rule_id)) {
            alerts.push({
              id: uuidv4(),
              type: 'guideline_reminder',
              severity: rule.alert_type === 'critical' ? 'critical' : rule.alert_type === 'warning' ? 'warning' : 'info',
              message: rule.action,
              recommendation: `Based on ${guideline.name}`,
              source: guideline.organization,
              dismissed: false,
            });
          }
        }
      }
    }

    const cds: ClinicalDecisionSupport = {
      patient_id: patientId,
      encounter_id: encounterId,
      alerts,
      guidelines,
    };

    this.decisionSupport.set(encounterId, cds);
  }

  /**
   * Evaluate decision support rule
   */
  private evaluateRule(rule: any, note: ClinicalNote): boolean {
    // Simplified rule evaluation - in real implementation, this would be more sophisticated
    const condition = rule.condition.toLowerCase();
    
    if (condition.includes('bp') && note.vital_signs?.blood_pressure_systolic) {
      const match = condition.match(/bp >= (\d+)/);
      if (match) {
        return note.vital_signs.blood_pressure_systolic >= parseInt(match[1]);
      }
    }
    
    if (condition.includes('hba1c') && note.assessment?.toLowerCase().includes('hba1c')) {
      const match = condition.match(/hba1c > (\d+)%/);
      if (match) {
        // In real implementation, this would check actual lab values
        return Math.random() > 0.8; // Simulate 20% chance of high HbA1c
      }
    }
    
    return false;
  }

  /**
   * Get clinical decision support alerts
   */
  async getClinicalDecisionSupport(encounterId: string): Promise<ClinicalDecisionSupport | null> {
    return this.decisionSupport.get(encounterId) || null;
  }

  /**
   * Dismiss clinical alert
   */
  async dismissClinicalAlert(
    encounterId: string,
    alertId: string,
    providerId: string,
    reason: string
  ): Promise<void> {
    const cds = this.decisionSupport.get(encounterId);
    if (!cds) {
      throw new Error('Clinical decision support data not found');
    }

    const alert = cds.alerts.find(a => a.id === alertId);
    if (!alert) {
      throw new Error('Alert not found');
    }

    alert.dismissed = true;
    alert.dismissed_by = providerId;
    alert.dismissed_at = new Date();
    alert.dismiss_reason = reason;

    this.decisionSupport.set(encounterId, cds);
  }

  /**
   * Generate clinical summary
   */
  async generateClinicalSummary(
    patientId: string,
    summaryType: 'encounter' | 'episodic' | 'comprehensive' = 'comprehensive'
  ): Promise<ClinicalSummary> {
    // Get patient data
    const activeProblems = await this.getActiveProblems(patientId);
    const patientCarePlans = Array.from(this.carePlans.values())
      .filter(cp => cp.patient_id === patientId && cp.status === 'active');

    // Generate quality measures (simplified)
    const qualityMeasures: QualityMeasure[] = [
      {
        id: 'BP-Control',
        name: 'Blood Pressure Control',
        description: 'Percentage of patients with controlled blood pressure',
        numerator_criteria: 'BP < 140/90 mmHg',
        denominator_criteria: 'Patients with hypertension',
        patient_applicable: activeProblems.some(p => p.problem_name.toLowerCase().includes('hypertension')),
        current_status: Math.random() > 0.5 ? 'met' : 'not_met',
        performance_rate: 75,
        reporting_period: '2024',
        next_opportunity: 'Next visit',
      },
    ];

    const summary: ClinicalSummary = {
      patient_id: patientId,
      generated_date: new Date(),
      summary_type: summaryType,
      demographics: {
        name: 'Patient Name', // In real implementation, fetch from patient service
        age: 45,
        gender: 'Male',
        mrn: `MRN${patientId.slice(-6)}`,
      },
      active_problems: activeProblems,
      current_medications: ['Lisinopril 10mg daily', 'Metformin 500mg BID'], // Simplified
      allergies: ['NKDA'],
      recent_vitals: { bp: '130/80', hr: '72', temp: '98.6' },
      recent_lab_results: [],
      care_plans: patientCarePlans,
      upcoming_appointments: [],
      pending_orders: [],
      quality_measures: qualityMeasures,
      risk_factors: ['Hypertension', 'Diabetes'],
      provider_notes: 'Patient stable, continue current management',
      last_encounter_date: new Date(),
    };

    return summary;
  }

  /**
   * Search clinical notes
   */
  async searchClinicalNotes(criteria: {
    patient_id?: string;
    provider_id?: string;
    note_type?: ClinicalNote['note_type'];
    date_from?: string;
    date_to?: string;
    search_text?: string;
    status?: ClinicalNote['note_status'];
    page?: number;
    limit?: number;
  }): Promise<{ notes: ClinicalNote[]; total: number; totalPages: number }> {
    const { page = 1, limit = 10, search_text, ...filters } = criteria;
    
    let filteredNotes = Array.from(this.clinicalNotes.values());

    // Apply filters
    Object.entries(filters).forEach(([key, value]) => {
      if (value) {
        filteredNotes = filteredNotes.filter(note => {
          const noteValue = (note as any)[key];
          if (key.includes('date')) {
            return new Date(noteValue) >= new Date(value as string);
          }
          return noteValue === value;
        });
      }
    });

    // Text search
    if (search_text) {
      const searchLower = search_text.toLowerCase();
      filteredNotes = filteredNotes.filter(note =>
        note.subjective?.toLowerCase().includes(searchLower) ||
        note.objective?.toLowerCase().includes(searchLower) ||
        note.assessment?.toLowerCase().includes(searchLower) ||
        note.plan?.toLowerCase().includes(searchLower) ||
        note.chief_complaint?.toLowerCase().includes(searchLower)
      );
    }

    // Sort by creation date (newest first)
    filteredNotes.sort((a, b) => b.created_at.getTime() - a.created_at.getTime());

    // Pagination
    const total = filteredNotes.length;
    const totalPages = Math.ceil(total / limit);
    const startIndex = (page - 1) * limit;
    const notes = filteredNotes.slice(startIndex, startIndex + limit);

    return { notes, total, totalPages };
  }

  /**
   * Get note templates
   */
  async getNoteTemplates(noteType?: string): Promise<any[]> {
    const templates = Array.from(this.templates.values());
    
    if (noteType) {
      return templates.filter(template => template.type === noteType);
    }
    
    return templates;
  }

  /**
   * Get clinical guidelines
   */
  async getClinicalGuidelines(condition?: string): Promise<ClinicalGuideline[]> {
    const guidelines = Array.from(this.clinicalGuidelines.values());
    
    if (condition) {
      return guidelines.filter(guideline => 
        guideline.applicable_conditions.some(c => 
          c.toLowerCase().includes(condition.toLowerCase())
        )
      );
    }
    
    return guidelines;
  }

  /**
   * Auto-save note (for drafts)
   */
  async autoSaveNote(noteId: string, draftContent: Partial<ClinicalNote>): Promise<void> {
    const note = this.clinicalNotes.get(noteId);
    if (!note) {
      throw new Error('Note not found');
    }

    if (note.note_status !== 'draft') {
      throw new Error('Can only auto-save draft notes');
    }

    const updatedNote = {
      ...note,
      ...draftContent,
      updated_at: new Date(),
    };

    this.clinicalNotes.set(noteId, updatedNote);
  }
}

// Export singleton instance
export const electronicHealthRecordsService = new ElectronicHealthRecordsService();
