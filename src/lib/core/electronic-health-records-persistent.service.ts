/**
 * Electronic Health Records (EHR) Service - Persistent Implementation
 * Complete EHR system with SOAP notes, care plans, clinical pathways, and decision support
 * Replaces in-memory storage with persistent database operations
 */

import { PrismaClient } from '@prisma/client';
import { z } from 'zod';
import { getEncryptionService } from '../../services/encryption_service_secure';

// Re-export schemas from original service for compatibility
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
  }).optional(),
  
  // Clinical coding
  icd10_codes: z.array(z.string()).optional(),
  snomed_codes: z.array(z.string()).optional(),
  cpt_codes: z.array(z.string()).optional(),
  
  // Metadata
  free_text_content: z.string().optional(),
  audio_recording_id: z.string().optional(),
  created_by: z.string(),
  status: z.enum(['draft', 'final', 'amended', 'corrected']).default('draft'),
})

export const CarePlanSchema = z.object({
  patient_id: z.string().min(1, 'Patient ID is required'),
  encounter_id: z.string().optional(),
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  status: z.enum(['draft', 'active', 'on_hold', 'completed', 'cancelled']).default('draft'),
  intent: z.enum(['proposal', 'plan', 'order', 'option']).default('plan'),
  
  // Goals and objectives
  goals: z.array(z.object({
    id: z.string(),
    description: z.string(),
    target_date: z.date().optional(),
    status: z.enum(['proposed', 'accepted', 'active', 'on_hold', 'completed', 'cancelled']).default('proposed'),
    priority: z.enum(['low', 'medium', 'high']).default('medium'),
  })).default([]),
  
  // Activities/Interventions
  activities: z.array(z.object({
    id: z.string(),
    title: z.string(),
    description: z.string().optional(),
    status: z.enum(['not_started', 'scheduled', 'in_progress', 'on_hold', 'completed', 'cancelled']).default('not_started'),
    scheduled_date: z.date().optional(),
    category: z.enum(['medication', 'procedure', 'encounter', 'observation', 'other']).default('other'),
  })).default([]),
  
  // Care team
  care_team: z.array(z.object({
    provider_id: z.string(),
    role: z.string(),
    period_start: z.date(),
    period_end: z.date().optional(),
  })).default([]),
  
  // Clinical coding
  icd10_codes: z.array(z.string()).optional(),
  snomed_codes: z.array(z.string()).optional(),
  
  // Metadata
  created_by: z.string(),
  period_start: z.date(),
  period_end: z.date().optional(),
})

export const ProblemListSchema = z.object({
  patient_id: z.string().min(1, 'Patient ID is required'),
  encounter_id: z.string().optional(),
  problem_description: z.string().min(1, 'Problem description is required'),
  icd10_code: z.string().optional(),
  snomed_code: z.string().optional(),
  status: z.enum(['active', 'inactive', 'resolved']).default('active'),
  severity: z.enum(['mild', 'moderate', 'severe']).default('moderate'),
  onset_date: z.date().optional(),
  resolution_date: z.date().optional(),
  notes: z.string().optional(),
  created_by: z.string(),
});

export const ClinicalGuidelineSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  version: z.string().min(1, 'Version is required'),
  status: z.enum(['draft', 'active', 'retired']).default('draft'),
  
  // Applicable conditions
  icd10_codes: z.array(z.string()).optional(),
  snomed_codes: z.array(z.string()).optional(),
  
  // Decision support rules
  decision_support_rules: z.array(z.object({
    id: z.string(),
    condition: z.string(),
    recommendation: z.string(),
    evidence_level: z.string(),
    recommendation_strength: z.enum(['strong', 'conditional']),
  })).default([]),
  
  // Metadata
  created_by: z.string(),
  published_date: z.date().optional(),
  review_date: z.date().optional(),
})

// Type definitions
export type ClinicalNote = z.infer<typeof ClinicalNoteSchema>
export type CarePlan = z.infer<typeof CarePlanSchema>;
export type ProblemListItem = z.infer<typeof ProblemListSchema>;
export type ClinicalGuideline = z.infer<typeof ClinicalGuidelineSchema>;

export interface ClinicalDecisionSupport {
  id: string,
  title: string,
  description: string,
  trigger_conditions: {
    icd10_codes?: string[];
    snomed_codes?: string[];
    lab_values?: { name: string; operator: string; value: number }[];
    medication_interactions?: string[];
  };
  recommendations: {
    type: 'alert' | 'suggestion' | 'warning' | 'info',
    message: string;
    actions?: string[];
  }[];
  status: 'active' | 'inactive',
  created_by: string,
  created_at: Date,
  updated_at: Date
}

/**
 * Persistent Electronic Health Records Service
 * Replaces in-memory storage with database persistence
 */
export class PersistentElectronicHealthRecordsService {
  private prisma: PrismaClient;
  private encryptionService = getEncryptionService();
  
  // Fields that should be encrypted for PHI protection
  private readonly encryptedFields = [
    'subjective', 'objective', 'assessment', 'plan',
    'chief_complaint', 'history_of_present_illness', 'review_of_systems',
    'past_medical_history', 'medications', 'allergies', 'social_history',
    'family_history', 'physical_examination', 'free_text_content',
    'problem_description', 'notes', 'description', 'additionalNotes'
  ]

  constructor(prismaClient?: PrismaClient) {
    this.prisma = prismaClient || new PrismaClient();
  }

  // Clinical Notes Operations
  async createClinicalNote(data: ClinicalNote): Promise<ClinicalNote & { id: string }> {
    try {
      const validated = ClinicalNoteSchema.parse(data)
      
      // Determine note type and create appropriate record
      if (validated.note_type === 'soap_note') {
        return this.createSoapNote(validated)
      } else {
        return this.createProgressNote(validated);
      }
    } catch (error) {
      throw new Error(`Failed to create clinical note: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  private async createSoapNote(data: ClinicalNote): Promise<ClinicalNote & { id: string }> {
    const encryptedData = await this.encryptionService.encryptObject(data, this.encryptedFields);
    
    const soapNote = await this.prisma.soapNote.create({
      data: {
        encounterId: data.encounter_id,
        patientId: data.patient_id,
        providerId: data.provider_id,
        noteDateTime: new Date(),
        subjective: encryptedData.subjective || '',
        objective: encryptedData.objective || '',
        assessment: encryptedData.assessment || '',
        plan: encryptedData.plan || '',
        additionalNotes: encryptedData.free_text_content,
        status: data.status,
        signedBy: data.created_by,
        signatureDateTime: data.status === 'final' ? new Date() : null,
      }
    });

    return {
      ...data,
      id: soapNote.id,
    };
  }

  private async createProgressNote(data: ClinicalNote): Promise<ClinicalNote & { id: string }> {
    const encryptedData = await this.encryptionService.encryptObject(data, this.encryptedFields);
    
    const progressNote = await this.prisma.progressNote.create({
      data: {
        encounterId: data.encounter_id,
        patientId: data.patient_id,
        providerId: data.provider_id,
        noteDateTime: new Date(),
        noteType: data.note_type,
        content: JSON.stringify(encryptedData),
        status: data.status,
        signedBy: data.created_by,
        signatureDateTime: data.status === 'final' ? new Date() : null,
      }
    });

    return {
      ...data,
      id: progressNote.id,
    };
  }

  async getClinicalNote(id: string): Promise<ClinicalNote | null> {
    try {
      // Try SOAP note first
      const soapNote = await this.prisma.soapNote.findUnique({
        where: { id }
      })

      if (soapNote) {
        return this.deserializeSoapNote(soapNote);
      }

      // Try progress note
      const progressNote = await this.prisma.progressNote.findUnique({
        where: { id }
      })

      if (progressNote) {
        return this.deserializeProgressNote(progressNote);
      }

      return null;
    } catch (error) {
      throw new Error(`Failed to get clinical note: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async getClinicalNotesByPatient(patientId: string): Promise<ClinicalNote[]> {
    try {
      const [soapNotes, progressNotes] = await Promise.all([
        this.prisma.soapNote.findMany({
          where: { patientId },
          orderBy: { noteDateTime: 'desc' }
        }),
        this.prisma.progressNote.findMany({
          where: { patientId },
          orderBy: { noteDateTime: 'desc' }
        })
      ]);

      const allNotes = [
        ...(await Promise.all(soapNotes.map(note => this.deserializeSoapNote(note)))),
        ...(await Promise.all(progressNotes.map(note => this.deserializeProgressNote(note))))
      ];

      return allNotes.sort((a, b) => 
        new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime()
      );
    } catch (error) {
      throw new Error(`Failed to get clinical notes for patient: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // Care Plans Operations
  async createCarePlan(data: CarePlan): Promise<CarePlan & { id: string }> {
    try {
      const validated = CarePlanSchema.parse(data)
      
      const carePlan = await this.prisma.carePlan.create({
        data: {
          patientId: validated.patient_id,
          encounterId: validated.encounter_id,
          title: validated.title,
          description: validated.description,
          status: validated.status,
          intent: validated.intent,
          periodStart: validated.period_start,
          periodEnd: validated.period_end,
          createdBy: validated.created_by,
        }
      });

      // Create goals
      for (const goal of validated.goals) {
        await this.prisma.carePlanGoal.create({
          data: {
            carePlanId: carePlan.id,
            description: goal.description,
            targetDate: goal.target_date,
            status: goal.status,
            priority: goal.priority,
          }
        })
      }

      // Create interventions (activities)
      for (const activity of validated.activities) {
        await this.prisma.carePlanIntervention.create({
          data: {
            carePlanId: carePlan.id,
            title: activity.title,
            description: activity.description,
            status: activity.status,
            scheduledDate: activity.scheduled_date,
            category: activity.category,
          }
        })
      }

      return {
        ...validated,
        id: carePlan.id,
      };
    } catch (error) {
      throw new Error(`Failed to create care plan: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async getCarePlan(id: string): Promise<CarePlan | null> {
    try {
      const carePlan = await this.prisma.carePlan.findUnique({
        where: { id },
        include: {
          goals: true,
          interventions: true,
        }
      });

      if (!carePlan) return null;

      return {
        patient_id: carePlan.patientId,
        encounter_id: carePlan.encounterId || undefined,
        title: carePlan.title,
        description: carePlan.description || undefined,
        status: carePlan.status as any,
        intent: carePlan.intent as any,
        goals: carePlan.goals.map(goal => ({
          id: goal.id,
          description: goal.description,
          target_date: goal.targetDate || undefined,
          status: goal.status as any,
          priority: goal.priority as any,
        })),
        activities: carePlan.interventions.map(intervention => ({
          id: intervention.id,
          title: intervention.title,
          description: intervention.description || undefined,
          status: intervention.status as any,
          scheduled_date: intervention.scheduledDate || undefined,
          category: intervention.category as any,
        })),
        care_team: [], // Would need to implement care team relationship
        icd10_codes: undefined, // Would need to add to schema
        snomed_codes: undefined, // Would need to add to schema
        created_by: carePlan.createdBy,
        period_start: carePlan.periodStart,
        period_end: carePlan.periodEnd || undefined,
      }
    } catch (error) {
      throw new Error(`Failed to get care plan: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async getCarePlansByPatient(patientId: string): Promise<CarePlan[]> {
    try {
      const carePlans = await this.prisma.carePlan.findMany({
        where: { patientId },
        include: {
          goals: true,
          interventions: true,
        },
        orderBy: { createdAt: 'desc' }
      });

      return carePlans.map(carePlan => ({
        patient_id: carePlan.patientId,
        encounter_id: carePlan.encounterId || undefined,
        title: carePlan.title,
        description: carePlan.description || undefined,
        status: carePlan.status as any,
        intent: carePlan.intent as any,
        goals: carePlan.goals.map(goal => ({
          id: goal.id,
          description: goal.description,
          target_date: goal.targetDate || undefined,
          status: goal.status as any,
          priority: goal.priority as any,
        })),
        activities: carePlan.interventions.map(intervention => ({
          id: intervention.id,
          title: intervention.title,
          description: intervention.description || undefined,
          status: intervention.status as any,
          scheduled_date: intervention.scheduledDate || undefined,
          category: intervention.category as any,
        })),
        care_team: [],
        icd10_codes: undefined,
        snomed_codes: undefined,
        created_by: carePlan.createdBy,
        period_start: carePlan.periodStart,
        period_end: carePlan.periodEnd || undefined,
      }));
    } catch (error) {
      throw new Error(`Failed to get care plans for patient: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // Problem List Operations
  async createProblemListItem(data: ProblemListItem): Promise<ProblemListItem & { id: string }> {
    try {
      const validated = ProblemListSchema.parse(data)
      const encryptedData = await this.encryptionService.encryptObject(validated, this.encryptedFields);
      
      const problem = await this.prisma.problemEntry.create({
        data: {
          patientId: validated.patient_id,
          encounterId: validated.encounter_id,
          problemDescription: encryptedData.problem_description,
          icd10Code: validated.icd10_code,
          snomedCode: validated.snomed_code,
          status: validated.status,
          severity: validated.severity,
          onsetDate: validated.onset_date,
          resolutionDate: validated.resolution_date,
          notes: encryptedData.notes,
          createdBy: validated.created_by,
        }
      });

      return {
        ...validated,
        id: problem.id,
      };
    } catch (error) {
      throw new Error(`Failed to create problem list item: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async getProblemListByPatient(patientId: string): Promise<ProblemListItem[]> {
    try {
      const problems = await this.prisma.problemEntry.findMany({
        where: { patientId },
        orderBy: { createdAt: 'desc' }
      });

      return Promise.all(problems.map(async (problem) => {
        const decrypted = await this.encryptionService.decryptObject(problem, this.encryptedFields);
        return {
          patient_id: problem.patientId,
          encounter_id: problem.encounterId || undefined,
          problem_description: decrypted.problemDescription,
          icd10_code: problem.icd10Code || undefined,
          snomed_code: problem.snomedCode || undefined,
          status: problem.status as any,
          severity: problem.severity as any,
          onset_date: problem.onsetDate || undefined,
          resolution_date: problem.resolutionDate || undefined,
          notes: decrypted.notes || undefined,
          created_by: problem.createdBy,
        };
      }));
    } catch (error) {
      throw new Error(`Failed to get problem list for patient: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // Clinical Guidelines Operations
  async createClinicalGuideline(data: ClinicalGuideline): Promise<ClinicalGuideline & { id: string }> {
    try {
      const validated = ClinicalGuidelineSchema.parse(data)
      
      const guideline = await this.prisma.clinicalDecisionSupport.create({
        data: {
          title: validated.title,
          description: validated.description || '',
          ruleType: 'guideline',
          triggerConditions: JSON.stringify({
            icd10_codes: validated.icd10_codes,
            snomed_codes: validated.snomed_codes,
          }),
          recommendations: JSON.stringify(validated.decision_support_rules),
          status: validated.status,
          createdBy: validated.created_by,
        }
      });

      return {
        ...validated,
        id: guideline.id,
      };
    } catch (error) {
      throw new Error(`Failed to create clinical guideline: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async getClinicalGuidelines(filters?: { 
    status?: string;
    icd10_codes?: string[];
  }): Promise<ClinicalGuideline[]> {
    try {
      const where: unknown = { ruleType: 'guideline' };
      
      if (filters?.status) {
        where.status = filters.status;
      }

      const guidelines = await this.prisma.clinicalDecisionSupport.findMany({
        where,
        orderBy: { createdAt: 'desc' }
      });

      return guidelines.map(guideline => {
        const triggerConditions = JSON.parse(guideline.triggerConditions);
        const recommendations = JSON.parse(guideline.recommendations);
        
        return {
          title: guideline.title,
          description: guideline.description || undefined,
          version: '1.0', // Would need to add version tracking
          status: guideline.status as any,
          icd10_codes: triggerConditions.icd10_codes,
          snomed_codes: triggerConditions.snomed_codes,
          decision_support_rules: recommendations,
          created_by: guideline.createdBy,
          published_date: guideline.createdAt,
          review_date: undefined, // Would need to add to schema
        }
      });
    } catch (error) {
      throw new Error(`Failed to get clinical guidelines: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // Helper methods for deserialization
  private async deserializeSoapNote(note: unknown): Promise<ClinicalNote> {
    const decrypted = await this.encryptionService.decryptObject(note, this.encryptedFields)
    
    return {
      patient_id: note.patientId,
      encounter_id: note.encounterId,
      provider_id: note.providerId,
      note_type: 'soap_note',
      subjective: decrypted.subjective,
      objective: decrypted.objective,
      assessment: decrypted.assessment,
      plan: decrypted.plan,
      free_text_content: decrypted.additionalNotes,
      created_by: note.signedBy || note.createdBy,
      status: note.status,
      created_at: note.createdAt,
      updated_at: note.updatedAt,
    };
  }

  private async deserializeProgressNote(note: unknown): Promise<ClinicalNote> {
    const content = JSON.parse(note.content);
    const decrypted = await this.encryptionService.decryptObject(content, this.encryptedFields);
    
    return {
      patient_id: note.patientId,
      encounter_id: note.encounterId,
      provider_id: note.providerId,
      note_type: note.noteType || 'progress_note',
      ...decrypted,
      created_by: note.signedBy || note.createdBy,
      status: note.status,
      created_at: note.createdAt,
      updated_at: note.updatedAt,
    };
  }

  // Search and Query Operations
  async searchClinicalNotes(query: {
    patientId?: string
    providerId?: string;
    dateFrom?: Date;
    dateTo?: Date;
    noteType?: string;
    status?: string;
  }): Promise<ClinicalNote[]> {
    try {
      const where: unknown = {};
      
      if (query.patientId) where.patientId = query.patientId;
      if (query.providerId) where.providerId = query.providerId;
      if (query.dateFrom || query.dateTo) {
        where.noteDateTime = {};
        if (query.dateFrom) where.noteDateTime.gte = query.dateFrom;
        if (query.dateTo) where.noteDateTime.lte = query.dateTo;
      }
      if (query.status) where.status = query.status;

      const [soapNotes, progressNotes] = await Promise.all([
        this.prisma.soapNote.findMany({
          where,
          orderBy: { noteDateTime: 'desc' }
        }),
        this.prisma.progressNote.findMany({
          where: {
            ...where,
            ...(query.noteType && query.noteType !== 'soap_note' ? { noteType: query.noteType } : {})
          },
          orderBy: { noteDateTime: 'desc' }
        })
      ]);

      const allNotes = [
        ...(await Promise.all(soapNotes.map(note => this.deserializeSoapNote(note)))),
        ...(await Promise.all(progressNotes.map(note => this.deserializeProgressNote(note))))
      ];

      return allNotes.sort((a, b) => 
        new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime()
      );
    } catch (error) {
      throw new Error(`Failed to search clinical notes: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // Clinical Decision Support
  async evaluateClinicalDecisionSupport(
    patientId: string,
    context: {
      icd10_codes?: string[]
      snomed_codes?: string[];
      lab_values?: { name: string; value: number }[];
      medications?: string[];
    }
  ): Promise<ClinicalDecisionSupport[]> {
    try {
      const rules = await this.prisma.clinicalDecisionSupport.findMany({
        where: { status: 'active' }
      });

      const triggeredRules: ClinicalDecisionSupport[] = [];

      for (const rule of rules) {
        const triggerConditions = JSON.parse(rule.triggerConditions);
        let triggered = false;

        // Check ICD-10 codes
        if (triggerConditions.icd10_codes && context.icd10_codes) {
          triggered = triggerConditions.icd10_codes.some((code: string) => 
            context.icd10_codes!.includes(code)
          )
        }

        // Check SNOMED codes
        if (triggerConditions.snomed_codes && context.snomed_codes) {
          triggered = triggered || triggerConditions.snomed_codes.some((code: string) => 
            context.snomed_codes!.includes(code)
          )
        }

        // Add more trigger condition logic as needed

        if (triggered) {
          triggeredRules.push({
            id: rule.id,
            title: rule.title,
            description: rule.description,
            trigger_conditions: triggerConditions,
            recommendations: JSON.parse(rule.recommendations),
            status: rule.status as 'active' | 'inactive',
            created_by: rule.createdBy,
            created_at: rule.createdAt,
            updated_at: rule.updatedAt,
          })
        }
      }

      return triggeredRules;
    } catch (error) {
      throw new Error(`Failed to evaluate clinical decision support: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // Cleanup
  async disconnect(): Promise<void> {
    await this.prisma.$disconnect()
  }
}

// Export singleton instance
let ehrServiceInstance: PersistentElectronicHealthRecordsService | null = null

export const getEHRService = (prismaClient?: PrismaClient): PersistentElectronicHealthRecordsService => {
  if (!ehrServiceInstance) {
    ehrServiceInstance = new PersistentElectronicHealthRecordsService(prismaClient);
  }
  return ehrServiceInstance;
};

// For backward compatibility
export { PersistentElectronicHealthRecordsService as ElectronicHealthRecordsService 
