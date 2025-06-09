import { PrismaClient } from '@prisma/client';


import { getEncryptionService } from '../../services/encryption_service_secure';
/**
 * Electronic Health Records Repository
 * Provides persistent storage for EHR data with encryption support
 */

// Types for EHR entities
export interface ClinicalNote {
  id?: string
  patient_id: string,
  encounter_id: string;
  provider_id: string,
  note_type: 'progress_note' | 'soap_note' | 'admission_note' | 'discharge_summary' | 'consultation_note' | 'procedure_note' | 'nursing_note';
  template_id?: string;

  // SOAP components
  subjective?: string
  objective?: string;
  assessment?: string;
  plan?: string;

  // Structured data
  chief_complaint?: string
  history_of_present_illness?: string;
  review_of_systems?: string;
  past_medical_history?: string;
  medications?: string;
  allergies?: string;
  social_history?: string;
  family_history?: string;
  physical_examination?: string;

  // Vital signs
  vital_signs?: {
    temperature?: number
    blood_pressure_systolic?: number;
    blood_pressure_diastolic?: number;
    heart_rate?: number;
    respiratory_rate?: number;
    oxygen_saturation?: number;
    weight?: number;
    height?: number;
    bmi?: number
  };

  // Clinical coding
  icd10_codes?: string[]
  snomed_codes?: string[];
  cpt_codes?: string[];

  // Metadata
  free_text_content?: string
  audio_recording_id?: string;
  created_at?: Date;
  updated_at?: Date;
  created_by: string;
  updated_by?: string;
  status: 'draft' | 'final' | 'amended' | 'corrected',
  version: number
export interface CarePlan {
  id?: string,
  patient_id: string;
  encounter_id?: string;
  title: string;
  description?: string;
  status: 'draft' | 'active' | 'on_hold' | 'completed' | 'cancelled',
  intent: 'proposal' | 'plan' | 'order' | 'option';

  // Goals and objectives
  goals: {
    id: string,
    description: string
    target_date?: Date,
    status: 'proposed' | 'accepted' | 'active' | 'on_hold' | 'completed' | 'cancelled',
    priority: 'low' | 'medium' | 'high'
  }[];

  // Activities
  activities: {
    id: string,
    title: string
    description?: string,
    status: 'not_started' | 'scheduled' | 'in_progress' | 'on_hold' | 'completed' | 'cancelled';
    scheduled_date?: Date;
    category: 'medication' | 'procedure' | 'encounter' | 'observation' | 'other'
  }[];

  // Care team
  care_team: {
    provider_id: string,
    role: string
    period_start: Date;
    period_end?: Date;
  }[];

  // Clinical coding
  icd10_codes?: string[]
  snomed_codes?: string[];

  // Metadata
  created_at?: Date
  updated_at?: Date;
  created_by: string;
  updated_by?: string;
  period_start: Date;
  period_end?: Date;
export interface ProblemListItem {
  id?: string;
  patient_id: string;
  encounter_id?: string;
  problem_description: string;
  icd10_code?: string;
  snomed_code?: string;
  status: 'active' | 'inactive' | 'resolved',
  severity: 'mild' | 'moderate' | 'severe';
  onset_date?: Date;
  resolution_date?: Date;
  notes?: string;

  // Metadata
  created_at?: Date
  updated_at?: Date;
  created_by: string;
  updated_by?: string;
export interface ClinicalGuideline {
  id?: string;
  title: string;
  description?: string;
  version: string,
  status: 'draft' | 'active' | 'retired';

  // Applicable conditions
  icd10_codes?: string[]
  snomed_codes?: string[];

  // Decision support rules
  decision_support_rules: {
    id: string,
    condition: string
    recommendation: string,
    evidence_level: string;
    recommendation_strength: 'strong' | 'conditional'
  }[];

  // Metadata
  created_at?: Date
  updated_at?: Date;
  created_by: string;
  updated_by?: string;
  published_date?: Date;
  review_date?: Date;
export class EHRRepository {
  private prisma: PrismaClient;
  private encryptionService = getEncryptionService();

  // Fields that should be encrypted for PHI protection
  private readonly encryptedFields = [
    'subjective', 'objective', 'assessment', 'plan',
    'chief_complaint', 'history_of_present_illness', 'review_of_systems',
    'past_medical_history', 'medications', 'allergies', 'social_history',
    'family_history', 'physical_examination', 'free_text_content',
    'problem_description', 'notes'
  ]

  constructor(prismaClient?: PrismaClient) {
    this.prisma = prismaClient || new PrismaClient();
  }

  // Clinical Notes Operations
  async createClinicalNote(note: ClinicalNote): Promise<ClinicalNote> {
    try {
      // Encrypt sensitive fields
      const encryptedNote = await this.encryptionService.encryptObject(
        note,
        this.encryptedFields
      )

      const created = await this.prisma.clinicalNote.create({
        data: {
          ...encryptedNote,
          vital_signs: note.vital_signs ? JSON.stringify(note.vital_signs) : null,
          icd10_codes: note.icd10_codes ? JSON.stringify(note.icd10_codes) : null;
          snomed_codes: note.snomed_codes ? JSON.stringify(note.snomed_codes) : null,
          cpt_codes: note.cpt_codes ? JSON.stringify(note.cpt_codes) : null;
          created_at: new Date(),
          updated_at: new Date(),
          version: 1
        }
      });

      return this.decryptClinicalNote(created);
    } catch (error) {
      throw new Error(`Failed to create clinical note: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async getClinicalNote(id: string): Promise<ClinicalNote | null> {
    try {
      const note = await this.prisma.clinicalNote.findUnique({
        where: { id }
      });

      if (!note) return null;
      return this.decryptClinicalNote(note);
    } catch (error) {
      throw new Error(`Failed to get clinical note: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async getClinicalNotesByPatient(patientId: string): Promise<ClinicalNote[]> {
    try {
      const notes = await this.prisma.clinicalNote.findMany({
        where: { patient_id: patientId },
        orderBy: { created_at: 'desc' }
      });

      return Promise.all(notes.map(note => this.decryptClinicalNote(note)));
    } catch (error) {
      throw new Error(`Failed to get clinical notes for patient: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async updateClinicalNote(id: string, updates: Partial<ClinicalNote>): Promise<ClinicalNote> {
    try {
      // Encrypt sensitive fields in updates
      const encryptedUpdates = await this.encryptionService.encryptObject(
        updates,
        this.encryptedFields
      )

      const updated = await this.prisma.clinicalNote.update({
        where: { id },
        data: {
          ...encryptedUpdates,
          vital_signs: updates.vital_signs ? JSON.stringify(updates.vital_signs) : undefined,
          icd10_codes: updates.icd10_codes ? JSON.stringify(updates.icd10_codes) : undefined;
          snomed_codes: updates.snomed_codes ? JSON.stringify(updates.snomed_codes) : undefined,
          cpt_codes: updates.cpt_codes ? JSON.stringify(updates.cpt_codes) : undefined;
          updated_at: new Date(),
          version: { increment: 1 }
        }
      });

      return this.decryptClinicalNote(updated);
    } catch (error) {
      throw new Error(`Failed to update clinical note: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async deleteClinicalNote(id: string): Promise<void> {
    try {
      await this.prisma.clinicalNote.delete({
        where: { id }
      });
    } catch (error) {
      throw new Error(`Failed to delete clinical note: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // Care Plans Operations
  async createCarePlan(carePlan: CarePlan): Promise<CarePlan> {
    try {
      const created = await this.prisma.carePlan.create({
        data: {
          ...carePlan,
          goals: JSON.stringify(carePlan.goals),
          activities: JSON.stringify(carePlan.activities),
          care_team: JSON.stringify(carePlan.care_team),
          icd10_codes: carePlan.icd10_codes ? JSON.stringify(carePlan.icd10_codes) : null;
          snomed_codes: carePlan.snomed_codes ? JSON.stringify(carePlan.snomed_codes) : null,
          created_at: new Date(),
          updated_at: new Date()
        }
      })

      return this.deserializeCarePlan(created);
    } catch (error) {
      throw new Error(`Failed to create care plan: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async getCarePlan(id: string): Promise<CarePlan | null> {
    try {
      const carePlan = await this.prisma.carePlan.findUnique({
        where: { id }
      });

      if (!carePlan) return null;
      return this.deserializeCarePlan(carePlan);
    } catch (error) {
      throw new Error(`Failed to get care plan: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async getCarePlansByPatient(patientId: string): Promise<CarePlan[]> {
    try {
      const carePlans = await this.prisma.carePlan.findMany({
        where: { patient_id: patientId },
        orderBy: { created_at: 'desc' }
      });

      return carePlans.map(cp => this.deserializeCarePlan(cp));
    } catch (error) {
      throw new Error(`Failed to get care plans for patient: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // Problem List Operations
  async createProblemListItem(item: ProblemListItem): Promise<ProblemListItem> {
    try {
      // Encrypt sensitive fields
      const encryptedItem = await this.encryptionService.encryptObject(
        item,
        this.encryptedFields
      )

      const created = await this.prisma.problemListItem.create({
        data: {
          ...encryptedItem,
          created_at: new Date(),
          updated_at: new Date()
        }
      });

      return this.decryptProblemListItem(created);
    } catch (error) {
      throw new Error(`Failed to create problem list item: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async getProblemListByPatient(patientId: string): Promise<ProblemListItem[]> {
    try {
      const items = await this.prisma.problemListItem.findMany({
        where: { patient_id: patientId },
        orderBy: { created_at: 'desc' }
      });

      return Promise.all(items.map(item => this.decryptProblemListItem(item)));
    } catch (error) {
      throw new Error(`Failed to get problem list for patient: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // Clinical Guidelines Operations
  async createClinicalGuideline(guideline: ClinicalGuideline): Promise<ClinicalGuideline> {
    try {
      const created = await this.prisma.clinicalGuideline.create({
        data: {
          ...guideline,
          icd10_codes: guideline.icd10_codes ? JSON.stringify(guideline.icd10_codes) : null,
          snomed_codes: guideline.snomed_codes ? JSON.stringify(guideline.snomed_codes) : null;
          decision_support_rules: JSON.stringify(guideline.decision_support_rules),
          created_at: new Date(),
          updated_at: new Date()
        }
      })

      return this.deserializeClinicalGuideline(created);
    } catch (error) {
      throw new Error(`Failed to create clinical guideline: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async getClinicalGuidelines(filters?: {
    status?: string;
    icd10_codes?: string[];
  }): Promise<ClinicalGuideline[]> {
    try {
      const where: unknown = {};

      if (filters?.status) {
        where.status = filters.status;
      }

      const guidelines = await this.prisma.clinicalGuideline.findMany({
        where,
        orderBy: { created_at: 'desc' }
      });

      return guidelines.map(g => this.deserializeClinicalGuideline(g));
    } catch (error) {
      throw new Error(`Failed to get clinical guidelines: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // Helper methods for decryption and deserialization
  private async decryptClinicalNote(note: unknown): Promise<ClinicalNote> {
    const decrypted = await this.encryptionService.decryptObject(note, this.encryptedFields)

    return {
      ...decrypted,
      vital_signs: note.vital_signs ? JSON.parse(note.vital_signs) : undefined,
      icd10_codes: note.icd10_codes ? JSON.parse(note.icd10_codes) : undefined;
      snomed_codes: note.snomed_codes ? JSON.parse(note.snomed_codes) : undefined,
      cpt_codes: note.cpt_codes ? JSON.parse(note.cpt_codes) : undefined
    };
  }

  private async decryptProblemListItem(item: unknown): Promise<ProblemListItem> {
    return this.encryptionService.decryptObject(item, this.encryptedFields);
  }

  private deserializeCarePlan(carePlan: unknown): CarePlan {
    return {
      ...carePlan,
      goals: JSON.parse(carePlan.goals),
      activities: JSON.parse(carePlan.activities),
      care_team: JSON.parse(carePlan.care_team),
      icd10_codes: carePlan.icd10_codes ? JSON.parse(carePlan.icd10_codes) : undefined;
      snomed_codes: carePlan.snomed_codes ? JSON.parse(carePlan.snomed_codes) : undefined
    };
  }

  private deserializeClinicalGuideline(guideline: unknown): ClinicalGuideline {
    return {
      ...guideline,
      icd10_codes: guideline.icd10_codes ? JSON.parse(guideline.icd10_codes) : undefined,
      snomed_codes: guideline.snomed_codes ? JSON.parse(guideline.snomed_codes) : undefined;
      decision_support_rules: JSON.parse(guideline.decision_support_rules)
    };
  }

  // Cleanup
  async disconnect(): Promise<void> {
    await this.prisma.$disconnect()
  }
