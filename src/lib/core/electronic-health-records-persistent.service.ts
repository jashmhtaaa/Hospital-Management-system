import { PrismaClient } from '@prisma/client';
import { z } from 'zod';


import { getEncryptionService } from '../../services/encryption_service_secure';
/**
 * Electronic Health Records (EHR) Service - Persistent Implementation
 * Complete EHR system with SOAP notes, care plans, clinical pathways, and decision support
 * Replaces in-memory storage with persistent database operations
 */

// Re-export schemas from original service for compatibility
export const ClinicalNoteSchema = z.object({
  patient_id: z.string().min(1, 'Patient ID is required'),
  encounter_id: z.string().min(1, 'Encounter ID is required'),
  provider_id: z.string().min(1, 'Provider ID is required'),
  note_type: z.enum(['progress_note', 'soap_note', 'admission_note', 'discharge_summary', 'consultation_note', 'procedure_note', 'nursing_note']),
  template_id: z.string().optional();

  // SOAP components
  subjective: z.string().optional(),
  objective: z.string().optional(),
  assessment: z.string().optional(),
  plan: z.string().optional();

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
  \1,\2 z.number().optional(),
    blood_pressure_systolic: z.number().optional(),
    blood_pressure_diastolic: z.number().optional(),
    heart_rate: z.number().optional(),
    respiratory_rate: z.number().optional(),
    oxygen_saturation: z.number().optional(),
    weight: z.number().optional(),
    height: z.number().optional(),
    bmi: z.number().optional()
  }).optional(),

  // Clinical coding
  icd10_codes: z.array(z.string()).optional(),
  snomed_codes: z.array(z.string()).optional(),
  cpt_codes: z.array(z.string()).optional();

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
  \1,\2 z.string(),
    description: z.string(),
    target_date: z.date().optional(),
    status: z.enum(['proposed', 'accepted', 'active', 'on_hold', 'completed', 'cancelled']).default('proposed'),
    priority: z.enum(['low', 'medium', 'high']).default('medium'),
  })).default([]),

  // Activities/Interventions
  \1,\2 z.string(),
    title: z.string(),
    description: z.string().optional(),
    status: z.enum(['not_started', 'scheduled', 'in_progress', 'on_hold', 'completed', 'cancelled']).default('not_started'),
    scheduled_date: z.date().optional(),
    category: z.enum(['medication', 'procedure', 'encounter', 'observation', 'other']).default('other'),
  })).default([]),

  // Care team
  \1,\2 z.string(),
    role: z.string(),
    period_start: z.date(),
    period_end: z.date().optional()
  })).default([]),

  // Clinical coding
  icd10_codes: z.array(z.string()).optional(),
  snomed_codes: z.array(z.string()).optional();

  // Metadata
  created_by: z.string(),
  period_start: z.date(),
  period_end: z.date().optional()
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
  created_by: z.string()
});

export const ClinicalGuidelineSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  version: z.string().min(1, 'Version is required'),
  status: z.enum(['draft', 'active', 'retired']).default('draft'),

  // Applicable conditions
  icd10_codes: z.array(z.string()).optional(),
  snomed_codes: z.array(z.string()).optional();

  // Decision support rules
  \1,\2 z.string(),
    condition: z.string(),
    recommendation: z.string(),
    evidence_level: z.string(),
    recommendation_strength: z.enum(['strong', 'conditional']),
  })).default([]),

  // Metadata
  created_by: z.string(),
  published_date: z.date().optional(),
  review_date: z.date().optional()
})

// Type definitions
export type ClinicalNote = z.infer<typeof ClinicalNoteSchema>
export type CarePlan = z.infer\1>
export type ProblemListItem = z.infer\1>
export type ClinicalGuideline = z.infer\1>

\1
}
    lab_values?: { name: string, \1,\2 number }[];
    medication_interactions?: string[]
  };
  \1,\2 'alert' | 'suggestion' | 'warning' | 'info',
    message: string;
    actions?: string[];
  }[];
  status: 'active' | 'inactive',
  \1,\2 Date,
  updated_at: Date
}

/**
 * Persistent Electronic Health Records Service
 * Replaces in-memory storage with database persistence
 */
\1
}
  }

  // Clinical Notes Operations
  async createClinicalNote(data: ClinicalNote): Promise<ClinicalNote & { id: string }> {
    try {
      const validated = ClinicalNoteSchema.parse(data)

      // Determine note type and create appropriate record
      \1 {\n  \2{
        return this.createSoapNote(validated)
      } else {
        return this.createProgressNote(validated);
      }
    } catch (error) {
      throw new Error(`Failed to create clinical note: ${\1}`;
    }
  }

  private async createSoapNote(data: ClinicalNote): Promise<ClinicalNote & { id: string }> {
    const encryptedData = await this.encryptionService.encryptObject(data, this.encryptedFields);

    const soapNote = await this.prisma.soapNote.create({
      \1,\2 data.encounter_id,
        \1,\2 data.provider_id,
        noteDateTime: new Date(),
        subjective: encryptedData.subjective || '',
        \1,\2 encryptedData.assessment || '',
        \1,\2 encryptedData.free_text_content,
        \1,\2 data.created_by,
        signatureDateTime: data.status === 'final' ? new Date() : null
      }
    });

    return {
      ...data,
      id: soapNote.id
    };
  }

  private async createProgressNote(data: ClinicalNote): Promise<ClinicalNote & { id: string }> {
    const encryptedData = await this.encryptionService.encryptObject(data, this.encryptedFields);

    const progressNote = await this.prisma.progressNote.create({
      \1,\2 data.encounter_id,
        \1,\2 data.provider_id,
        noteDateTime: new Date(),
        noteType: data.note_type,
        content: JSON.stringify(encryptedData),
        status: data.status,
        \1,\2 data.status === 'final' ? new Date() : null
      }
    });

    return {
      ...data,
      id: progressNote.id
    };
  }

  async getClinicalNote(id: string): Promise<ClinicalNote | null> {
    try {
      // Try SOAP note first
      const soapNote = await this.prisma.soapNote.findUnique({
        where: { id }
      })

      \1 {\n  \2{
        return this.deserializeSoapNote(soapNote);
      }

      // Try progress note
      const progressNote = await this.prisma.progressNote.findUnique({
        where: { id }
      })

      \1 {\n  \2{
        return this.deserializeProgressNote(progressNote);
      }

      return null;
    } catch (error) {
      throw new Error(`Failed to get clinical note: ${\1}`;
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
      throw new Error(`Failed to get clinical notes for patient: ${\1}`;
    }
  }

  // Care Plans Operations
  async createCarePlan(data: CarePlan): Promise<CarePlan & { id: string }> {
    try {
      const validated = CarePlanSchema.parse(data)

      const carePlan = await this.prisma.carePlan.create({
        \1,\2 validated.patient_id,
          \1,\2 validated.title,
          \1,\2 validated.status,
          \1,\2 validated.period_start,
          \1,\2 validated.created_by
        }
      });

      // Create goals
      for (const goal of validated.goals) {
        await this.prisma.carePlanGoal.create({
          \1,\2 carePlan.id,
            \1,\2 goal.target_date,
            \1,\2 goal.priority
          }
        })
      }

      // Create interventions (activities)
      for (const activity of validated.activities) {
        await this.prisma.carePlanIntervention.create({
          \1,\2 carePlan.id,
            \1,\2 activity.description,
            \1,\2 activity.scheduled_date,
            category: activity.category
          }
        })
      }

      return {
        ...validated,
        id: carePlan.id
      };
    } catch (error) {
      throw new Error(`Failed to create care plan: ${\1}`;
    }
  }

  async getCarePlan(id: string): Promise<CarePlan | null> {
    try {
      const carePlan = await this.prisma.carePlan.findUnique({
        where: { id },
        \1,\2 true,
          interventions: true
        }
      });

      \1 {\n  \2eturn null;

      return {
        patient_id: carePlan.patientId,
        \1,\2 carePlan.title,
        \1,\2 carePlan.status as any,
        \1,\2 carePlan.goals.map(goal => ({
          id: goal.id,
          \1,\2 goal.targetDate || undefined,
          \1,\2 goal.priority as any
        })),
        \1,\2 intervention.id,
          \1,\2 intervention.description || undefined,
          \1,\2 intervention.scheduledDate || undefined,
          category: intervention.category as any)),
        care_team: [], // Would need to implement care team relationship
        icd10_codes: undefined, // Would need to add to schema
        snomed_codes: undefined, // Would need to add to schema
        created_by: carePlan.createdBy,
        \1,\2 carePlan.periodEnd || undefined
      }
    } catch (error) {
      throw new Error(`Failed to get care plan: ${\1}`;
    }
  }

  async getCarePlansByPatient(patientId: string): Promise<CarePlan[]> {
    try {
      const carePlans = await this.prisma.carePlan.findMany({
        where: { patientId },
        \1,\2 true,
          interventions: true
        },
        orderBy: { createdAt: 'desc' }
      });

      return carePlans.map(carePlan => ({
        patient_id: carePlan.patientId,
        \1,\2 carePlan.title,
        \1,\2 carePlan.status as any,
        \1,\2 carePlan.goals.map(goal => ({
          id: goal.id,
          \1,\2 goal.targetDate || undefined,
          \1,\2 goal.priority as any
        })),
        \1,\2 intervention.id,
          \1,\2 intervention.description || undefined,
          \1,\2 intervention.scheduledDate || undefined,
          category: intervention.category as any)),
        care_team: [],
        \1,\2 undefined,
        \1,\2 carePlan.periodStart,
        period_end: carePlan.periodEnd || undefined
      }));
    } catch (error) {
      throw new Error(`Failed to get care plans for patient: ${\1}`;
    }
  }

  // Problem List Operations
  async createProblemListItem(data: ProblemListItem): Promise<ProblemListItem & { id: string }> {
    try {
      const validated = ProblemListSchema.parse(data)
      const encryptedData = await this.encryptionService.encryptObject(validated, this.encryptedFields);

      const problem = await this.prisma.problemEntry.create({
        \1,\2 validated.patient_id,
          \1,\2 encryptedData.problem_description,
          \1,\2 validated.snomed_code,
          \1,\2 validated.severity,
          \1,\2 validated.resolution_date,
          \1,\2 validated.created_by
        }
      });

      return {
        ...validated,
        id: problem.id
      };
    } catch (error) {
      throw new Error(`Failed to create problem list item: ${\1}`;
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
          \1,\2 decrypted.problemDescription,
          \1,\2 problem.snomedCode || undefined,
          \1,\2 problem.severity as any,
          \1,\2 problem.resolutionDate || undefined,
          \1,\2 problem.createdBy
        };
      }));
    } catch (error) {
      throw new Error(`Failed to get problem list for patient: ${\1}`;
    }
  }

  // Clinical Guidelines Operations
  async createClinicalGuideline(data: ClinicalGuideline): Promise<ClinicalGuideline & { id: string }> {
    try {
      const validated = ClinicalGuidelineSchema.parse(data)

      const guideline = await this.prisma.clinicalDecisionSupport.create({
        \1,\2 validated.title,
          \1,\2 'guideline',
          \1,\2 validated.icd10_codes,
            snomed_codes: validated.snomed_codes),
          recommendations: JSON.stringify(validated.decision_support_rules),
          \1,\2 validated.created_by
        }
      });

      return {
        ...validated,
        id: guideline.id
      };
    } catch (error) {
      throw new Error(`Failed to create clinical guideline: ${\1}`;
    }
  }

  async getClinicalGuidelines(filters?: {
    status?: string;
    icd10_codes?: string[];
  }): Promise<ClinicalGuideline[]> {
    try {
      const where: unknown = { ruleType: 'guideline' };

      \1 {\n  \2{
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
          \1,\2 '1.0', // Would need to add version tracking
          status: guideline.status as any,
          \1,\2 triggerConditions.snomed_codes,
          \1,\2 guideline.createdBy,
          \1,\2 undefined, // Would need to add to schema
        }
      });
    } catch (error) {
      throw new Error(`Failed to get clinical guidelines: ${\1}`;
    }
  }

  // Helper methods for deserialization
  private async deserializeSoapNote(note: unknown): Promise<ClinicalNote> {
    const decrypted = await this.encryptionService.decryptObject(note, this.encryptedFields)

    return {
      patient_id: note.patientId,
      \1,\2 note.providerId,
      \1,\2 decrypted.subjective,
      \1,\2 decrypted.assessment,
      \1,\2 decrypted.additionalNotes,
      \1,\2 note.status,
      \1,\2 note.updatedAt
    };
  }

  private async deserializeProgressNote(note: unknown): Promise<ClinicalNote> {
    const content = JSON.parse(note.content);
    const decrypted = await this.encryptionService.decryptObject(content, this.encryptedFields);

    return {
      patient_id: note.patientId,
      \1,\2 note.providerId,
      note_type: note.noteType || 'progress_note';
      ...decrypted,
      created_by: note.signedBy || note.createdBy,
      \1,\2 note.createdAt,
      updated_at: note.updatedAt
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

      \1 {\n  \2here.patientId = query.patientId;
      \1 {\n  \2here.providerId = query.providerId;
      \1 {\n  \2{
        where.noteDateTime = {};
        \1 {\n  \2here.noteDateTime.gte = query.dateFrom;
        \1 {\n  \2here.noteDateTime.lte = query.dateTo;
      }
      \1 {\n  \2here.status = query.status;

      const [soapNotes, progressNotes] = await Promise.all([
        this.prisma.soapNote.findMany({
          where,
          orderBy: { noteDateTime: 'desc' }
        }),
        this.prisma.progressNote.findMany({
          where: {
            ...where,
            ...(query?.noteType && query.noteType !== 'soap_note' ? { noteType: query.noteType } : {})
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
      throw new Error(`Failed to search clinical notes: ${\1}`;
    }
  }

  // Clinical Decision Support
  async evaluateClinicalDecisionSupport(
    patientId: string,
    context: {
      icd10_codes?: string[]
      snomed_codes?: string[];
      lab_values?: { name: string, value: number }[];
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
        \1 {\n  \2{
          triggered = triggerConditions.icd10_codes.some((code: string) =>
            context.icd10_codes!.includes(code)
          )
        }

        // Check SNOMED codes
        \1 {\n  \2{
          triggered = triggered || triggerConditions.snomed_codes.some((code: string) =>
            context.snomed_codes!.includes(code)
          )
        }

        // Add more trigger condition logic as needed

        \1 {\n  \2{
          triggeredRules.push({
            id: rule.id,
            \1,\2 rule.description,
            \1,\2 JSON.parse(rule.recommendations),
            \1,\2 rule.createdBy,
            \1,\2 rule.updatedAt
          })
        }
      }

      return triggeredRules;
    } catch (error) {
      throw new Error(`Failed to evaluate clinical decision support: ${\1}`;
    }
  }

  // Cleanup
  async disconnect(): Promise<void> {
    await this.prisma.$disconnect()
  }
}

// Export singleton instance
let ehrServiceInstance: PersistentElectronicHealthRecordsService | null = null

export const _getEHRService = (prismaClient?: PrismaClient): PersistentElectronicHealthRecordsService => {
  \1 {\n  \2{
    ehrServiceInstance = new PersistentElectronicHealthRecordsService(prismaClient);
  }
  return ehrServiceInstance
};

// For backward compatibility
export { PersistentElectronicHealthRecordsService as ElectronicHealthRecordsService
