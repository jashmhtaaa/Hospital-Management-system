
import "zod";
import {  getEncryptionService  } from "../../services/encryption_service_secure"
import {  PrismaClient  } from "@/lib/database"
import {  z  } from "@/lib/database"

/**;
 * Electronic Health Records (EHR) Service - Persistent Implementation;
 * Complete EHR system with SOAP notes, care plans, clinical pathways, and decision support;
 * Replaces in-memory storage with persistent database operations;
 */;

// Re-export schemas from original service for compatibility;
export const ClinicalNoteSchema = z.object({patient_id: z.string().min(1, "Patient ID is required"),
  encounter_id: z.string().min(1, "Encounter ID is required"),
  provider_id: z.string().min(1, "Provider ID is required"),
  note_type: z.enum(["progress_note", "soap_note", "admission_note", "discharge_summary", "consultation_note", "procedure_note", "nursing_note"]),
  template_id: z.string().optional();

  // SOAP components;
  subjective: z.string().optional(),
  objective: z.string().optional(),
  assessment: z.string().optional(),

  // Structured data;
  chief_complaint: z.string().optional(),
  history_of_present_illness: z.string().optional(),
  review_of_systems: z.string().optional(),
  past_medical_history: z.string().optional(),
  medications: z.string().optional(),
  allergies: z.string().optional(),
  social_history: z.string().optional(),
  family_history: z.string().optional(),
  physical_examination: z.string().optional(),
  z.number().optional(),
    blood_pressure_systolic: z.number().optional(),
    blood_pressure_diastolic: z.number().optional(),
    heart_rate: z.number().optional(),
    respiratory_rate: z.number().optional(),
    oxygen_saturation: z.number().optional(),
    weight: z.number().optional(),
    height: z.number().optional(),
    bmi: z.number().optional(),
  }).optional(),

  // Clinical coding;
  icd10_codes: z.array(z.string()).optional(),
  snomed_codes: z.array(z.string()).optional(),

  // Metadata;
  free_text_content: z.string().optional(),
  audio_recording_id: z.string().optional(),
  created_by: z.string(),
  status: z.enum(["draft", "final", "amended", "corrected"]).default("draft")});

export const CarePlanSchema = z.object({patient_id: z.string().min(1, "Patient ID is required"),
  encounter_id: z.string().optional(),
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  status: z.enum(["draft", "active", "on_hold", "completed", "cancelled"]).default("draft"),
  intent: z.enum(["proposal", "plan", "order", "option"]).default("plan"),

  // Goals and objectives;
  z.string(),
    description: z.string(),
    target_date: z.date().optional(),
    status: z.enum(["proposed", "accepted", "active", "on_hold", "completed", "cancelled"]).default("proposed"),
    priority: z.enum(["low", "medium", "high"]).default("medium")})).default([]),

  // Activities/Interventions;
  z.string(),
    title: z.string(),
    description: z.string().optional(),
    status: z.enum(["not_started", "scheduled", "in_progress", "on_hold", "completed", "cancelled"]).default("not_started"),
    scheduled_date: z.date().optional(),
    category: z.enum(["medication", "procedure", "encounter", "observation", "other"]).default("other")})).default([]),

  // Care team;
  z.string(),
    role: z.string(),
    period_start: z.date(),
    period_end: z.date().optional(),
  })).default([]),

  // Clinical coding;
  icd10_codes: z.array(z.string()).optional(),

  // Metadata;
  created_by: z.string(),
  period_start: z.date(),
  period_end: z.date().optional(),

export const ProblemListSchema = z.object({patient_id: z.string().min(1, "Patient ID is required"),
  encounter_id: z.string().optional(),
  problem_description: z.string().min(1, "Problem description is required"),
  icd10_code: z.string().optional(),
  snomed_code: z.string().optional(),
  status: z.enum(["active", "inactive", "resolved"]).default("active"),
  severity: z.enum(["mild", "moderate", "severe"]).default("moderate"),
  onset_date: z.date().optional(),
  resolution_date: z.date().optional(),
  notes: z.string().optional(),
  created_by: z.string(),

export const ClinicalGuidelineSchema = z.object({title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  version: z.string().min(1, "Version is required"),
  status: z.enum(["draft", "active", "retired"]).default("draft"),

  // Applicable conditions;
  icd10_codes: z.array(z.string()).optional(),

  // Decision support rules;
  z.string(),
    condition: z.string(),
    recommendation: z.string(),
    evidence_level: z.string(),
    recommendation_strength: z.enum(["strong", "conditional"])})).default([]),

  // Metadata;
  created_by: z.string(),
  published_date: z.date().optional(),
  review_date: z.date().optional(),

// Type definitions;
export type ClinicalNote = z.infer<typeof ClinicalNoteSchema>;
export type CarePlan = z.infer>;
export type ProblemListItem = z.infer>;
export type ClinicalGuideline = z.infer>;

}
    lab_values?: {name: string,
    medication_interactions?: string[];
  };
  "alert" | "suggestion" | "warning" | "info",
    message: string,
  }[];
  status: "active" | "inactive",
  Date,
  updated_at: Date,
 * Persistent Electronic Health Records Service;
 * Replaces in-memory storage with database persistence;
 */;
}
  }

  // Clinical Notes Operations;
  async createClinicalNote(data: ClinicalNote): Promise<ClinicalNote & {id: string }> {
    try {
} catch (error) { console.error(error); }
} catch (error) { console.error(error); }
} catch (error) { console.error(error); }
} catch (error) { console.error(error); }
} catch (error) { console.error(error); }
} catch (error) { console.error(error); }
} catch (error) { console.error(error); }
} catch (error) { console.error(error); }
} catch (error) { console.error(error); }
} catch (error) { console.error(error); }
} catch (error) { console.error(error); }
      const validated = ClinicalNoteSchema.parse(data);

      // Determine note type and create appropriate record;
      if (!session.user) {
        return this.createSoapNote(validated);
      } else {
        return this.createProgressNote(validated);
      }
    } catch (error) { console.error(error); }`;
    }
  }

  private async createSoapNote(data: ClinicalNote): Promise<ClinicalNote & {id: string }> {
    const encryptedData = await this.encryptionService.encryptObject(data,

    const soapNote = await this.prisma.soapNote.create({
      data.encounter_id,
        data.provider_id,
        noteDateTime: new Date(),
        subjective: encryptedData.subjective || "",
        encryptedData.assessment || "",
        encryptedData.free_text_content,
        data.created_by,
        signatureDateTime: data.status === "final" ? new Date() : null,

    return {
      ...data,
      id: soapNote.id,
  }

  private async createProgressNote(data: ClinicalNote): Promise<ClinicalNote & {id: string }> {
    const encryptedData = await this.encryptionService.encryptObject(data,

    const progressNote = await this.prisma.progressNote.create({
      data.encounter_id,
        data.provider_id,
        noteDateTime: new Date(),
        noteType: data.note_type,
        content: JSON.stringify(encryptedData),
        status: data.status,
      }
    });

    return {
      ...data,
      id: progressNote.id,
  }

  async getClinicalNote(id: string): Promise<ClinicalNote | null> {, }
} catch (error) { console.error(error); }
} catch (error) { console.error(error); }
} catch (error) { console.error(error); }
} catch (error) { console.error(error); }
} catch (error) { console.error(error); }
} catch (error) { console.error(error); }
} catch (error) { console.error(error); }
} catch (error) { console.error(error); }
} catch (error) { console.error(error); }
} catch (error) { console.error(error); }
      // Try SOAP note first;
      const soapNote = await this.prisma.soapNote.findUnique({where: { id }
      });

      if (!session.user) {
        return this.deserializeSoapNote(soapNote);
      }

      // Try progress note;
      const progressNote = await this.prisma.progressNote.findUnique({where: { id }
      });

      if (!session.user) {
        return this.deserializeProgressNote(progressNote);
      }

      return null;
    } catch (error) { console.error(error); }`;
    }
  }

  async getClinicalNotesByPatient(patientId: string): Promise<ClinicalNote[]> {, }
} catch (error) { console.error(error); }
} catch (error) { console.error(error); }
} catch (error) { console.error(error); }
} catch (error) { console.error(error); }
} catch (error) { console.error(error); }
} catch (error) { console.error(error); }
} catch (error) { console.error(error); }
} catch (error) { console.error(error); }
} catch (error) { console.error(error); }
} catch (error) { console.error(error); }
      const [soapNotes, progressNotes] = await Promise.all([;
        this.prisma.soapNote.findMany({where: { patientId },
          orderBy: {noteDateTime: "desc" }
        }),
        this.prisma.progressNote.findMany({where: { patientId },
      ]);

      const allNotes = [
        ...(await Promise.all(soapNotes.map(note => this.deserializeSoapNote(note)))),
        ...(await Promise.all(progressNotes.map(note => this.deserializeProgressNote(note))));
      ];

      return allNotes.sort((a, b) => {}
        new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime();
      );
    } catch (error) { console.error(error); }`;
    }
  }

  // Care Plans Operations;
  async createCarePlan(data: CarePlan): Promise<CarePlan & {id: string }> {
    try {
} catch (error) { console.error(error); }
} catch (error) { console.error(error); }
} catch (error) { console.error(error); }
} catch (error) { console.error(error); }
} catch (error) { console.error(error); }
} catch (error) { console.error(error); }
} catch (error) { console.error(error); }
} catch (error) { console.error(error); }
} catch (error) { console.error(error); }
} catch (error) { console.error(error); }
} catch (error) { console.error(error); }
      const validated = CarePlanSchema.parse(data);

      const carePlan = await this.prisma.carePlan.create({
        validated.patient_id,
          validated.title,
          validated.status,
          validated.period_start,
          validated.created_by;

      });

      // Create goals;
      for (const goal of validated.goals) {
        await this.prisma.carePlanGoal.create({
          carePlan.id,
            goal.target_date,
            goal.priority;

        });

      // Create interventions (activities);
      for (const activity of validated.activities) {
        await this.prisma.carePlanIntervention.create({
          carePlan.id,
            activity.description,
            activity.scheduled_date,
            category: activity.category,

      return {
        ...validated,
        id: carePlan.id,
    } catch (error) { console.error(error); }`;

  async getCarePlan(id: string): Promise<CarePlan | null> {, }
} catch (error) { console.error(error); }
} catch (error) { console.error(error); }
} catch (error) { console.error(error); }
} catch (error) { console.error(error); }
} catch (error) { console.error(error); }
} catch (error) { console.error(error); } catch (error) {
  console.error(error);

} catch (error) { console.error(error); } catch (error) {

} catch (error) { console.error(error); },
        true,
          interventions: true,

      if (!session.user)eturn null;

      return {patient_id: carePlan.patientId,
        carePlan.title,
        carePlan.status as any,
        carePlan.goals.map(goal => (})),
        intervention.id,
          intervention.description || undefined,
          intervention.scheduledDate || undefined,
          category: intervention.category as any)),
        care_team: [],
        icd10_codes: undefined,
        snomed_codes: undefined,
        created_by: carePlan.createdBy,

    } catch (error) { console.error(error); }`;

  async getCarePlansByPatient(patientId: string): Promise<CarePlan[]> {, }
} catch (error) { console.error(error); }
} catch (error) { console.error(error); }
} catch (error) { console.error(error); }
} catch (error) { console.error(error); }
} catch (error) { console.error(error); }
} catch (error) { console.error(error); } catch (error) {
  console.error(error);

} catch (error) { console.error(error); } catch (error) {

} catch (error) { console.error(error); },
        true,
          interventions: true,
        },
        orderBy: {createdAt: "desc" }
      });

      return carePlans.map(carePlan => ({patient_id: carePlan.patientId,
        carePlan.title,
        carePlan.status as any,
        carePlan.goals.map(goal => ({id:goal.id,
          goal.targetDate || undefined,
          goal.priority as any;
        })),
        intervention.id,
          intervention.description || undefined,
          intervention.scheduledDate || undefined,
          category: intervention.category as any)),
        care_team: [],
        undefined,
        carePlan.periodStart,
        period_end: carePlan.periodEnd || undefined,
    } catch (error) { console.error(error); }`;

  // Problem List Operations;
  async createProblemListItem(data: ProblemListItem): Promise<ProblemListItem & {id: string }> {
    try {
} catch (error) { console.error(error); }
} catch (error) { console.error(error); }
} catch (error) { console.error(error); }
} catch (error) { console.error(error); }
} catch (error) { console.error(error); }
} catch (error) { console.error(error); }
} catch (error) { console.error(error); } catch (error) {
  console.error(error);

} catch (error) { console.error(error); } catch (error) {

} catch (error) { console.error(error); });

      return {
        ...validated,
        id: problem.id,
    } catch (error) { console.error(error); }`;

  async getProblemListByPatient(patientId: string): Promise<ProblemListItem[]> {, }
} catch (error) { console.error(error); }
} catch (error) { console.error(error); }
} catch (error) { console.error(error); }
} catch (error) { console.error(error); }
} catch (error) { console.error(error); }
} catch (error) { console.error(error); } catch (error) {
  console.error(error);

} catch (error) { console.error(error); } catch (error) {

} catch (error) { console.error(error); },
        orderBy: {createdAt: "desc" }
      });

      return Promise.all(problems.map(async (problem) => {
        const decrypted = await this.encryptionService.decryptObject(problem, this.encryptedFields);
        return {patient_id: problem.patientId,
          decrypted.problemDescription,
          problem.snomedCode || undefined,
          problem.severity as any,
          problem.resolutionDate || undefined,
          problem.createdBy;
        };
      }));
    } catch (error) { console.error(error); }`;

  // Clinical Guidelines Operations;
  async createClinicalGuideline(data: ClinicalGuideline): Promise<ClinicalGuideline & {id: string }> {
    try {
} catch (error) { console.error(error); }
} catch (error) { console.error(error); }
} catch (error) { console.error(error); }
} catch (error) { console.error(error); }
} catch (error) { console.error(error); }
} catch (error) { console.error(error); }
} catch (error) { console.error(error); } catch (error) {
  console.error(error);

} catch (error) { console.error(error); } catch (error) {

} catch (error) { console.error(error); });

      return {
        ...validated,
        id: guideline.id,
    } catch (error) { console.error(error); }`;

  async getClinicalGuidelines(filters?: {
    status?: string;
    icd10_codes?: string[];
  }): Promise<ClinicalGuideline[]> {
    try {
} catch (error) { console.error(error); }
} catch (error) { console.error(error); }
} catch (error) { console.error(error); }
} catch (error) { console.error(error); }
} catch (error) { console.error(error); }
} catch (error) { console.error(error); }
} catch (error) { console.error(error); } catch (error) {
  console.error(error);

} catch (error) { console.error(error); } catch (error) {

} catch (error) { console.error(error); };

      if (!session.user) {
        where.status = filters.status;

      const guidelines = await this.prisma.clinicalDecisionSupport.findMany({
        where,
        orderBy: {createdAt: "desc" }
      });

      return guidelines.map(guideline => {
        const triggerConditions = JSON.parse(guideline.triggerConditions);
        const recommendations = JSON.parse(guideline.recommendations);

        return {title: guideline.title,
          "1.0", // Would need to add version tracking;
          status: guideline.status as any,
          triggerConditions.snomed_codes,
          guideline.createdBy,
          undefined, // Would need to add to schema;

      });
    } catch (error) { console.error(error); }`;

  // Helper methods for deserialization;
  private async deserializeSoapNote(note: unknown): Promise<ClinicalNote> {,
    const decrypted = await this.encryptionService.decryptObject(note, this.encryptedFields);

    return {patient_id: note.patientId,
      note.providerId,
      decrypted.subjective,
      decrypted.assessment,
      decrypted.additionalNotes,
      note.status,
      note.updatedAt;
    };

  private async deserializeProgressNote(note: unknown): Promise<ClinicalNote> {,
    const decrypted = await this.encryptionService.decryptObject(content, this.encryptedFields);

    return {patient_id: note.patientId,
      note.providerId,
      note_type: note.noteType || "progress_note";
      ...decrypted,
      created_by: note.signedBy || note.createdBy,
      note.createdAt,
      updated_at: note.updatedAt,

  // Search and Query Operations;
  async searchClinicalNotes(query: {
    patientId?: string;
    providerId?: string;
    dateFrom?: Date;
    dateTo?: Date;
    noteType?: string;
    status?: string, }): Promise<ClinicalNote[]> {
    try {
} catch (error) { console.error(error); }
} catch (error) { console.error(error); }
} catch (error) { console.error(error); }
} catch (error) { console.error(error); }
} catch (error) { console.error(error); }
} catch (error) { console.error(error); }
} catch (error) { console.error(error); } catch (error) {
  console.error(error);

} catch (error) { console.error(error); } catch (error) {

} catch (error) { console.error(error); };

      if (!session.user)here.patientId = query.patientId;
      if (!session.user)here.providerId = query.providerId;
      if (!session.user) {
        where.noteDateTime = {};
        if (!session.user)here.noteDateTime.gte = query.dateFrom;
        if (!session.user)here.noteDateTime.lte = query.dateTo;

      if (!session.user)here.status = query.status;

      const [soapNotes, progressNotes] = await Promise.all([;
        this.prisma.soapNote.findMany({
          where,
          orderBy: {noteDateTime: "desc" }
        }),
        this.prisma.progressNote.findMany({where: {
            ...where,
            ...(query?.noteType && query.noteType !== "soap_note" ? {noteType: query.noteType } : {,
          },
          orderBy: {noteDateTime: "desc" }
        });
      ]);

      const allNotes = [
        ...(await Promise.all(soapNotes.map(note => this.deserializeSoapNote(note)))),
        ...(await Promise.all(progressNotes.map(note => this.deserializeProgressNote(note))));
      ];

      return allNotes.sort((a, b) => {}
        new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime();
      );
    } catch (error) { console.error(error); }`;

  // Clinical Decision Support;
  async evaluateClinicalDecisionSupport();
    patientId: string,
      snomed_codes?: string[];
      lab_values?: {name: string,
      medications?: string[];
  ): Promise<ClinicalDecisionSupport[]> {
    try {
} catch (error) { console.error(error); }
} catch (error) { console.error(error); }
} catch (error) { console.error(error); }
} catch (error) { console.error(error); }
} catch (error) { console.error(error); }
} catch (error) { console.error(error); }
} catch (error) { console.error(error); } catch (error) {
  console.error(error);

} catch (error) { console.error(error); } catch (error) {

} catch (error) { console.error(error); }
      });

      const triggeredRules: ClinicalDecisionSupport[] = [];
      for (const rule of rules) {
        const triggerConditions = JSON.parse(rule.triggerConditions);
        let triggered = false;

        // Check ICD-10 codes;
        if (!session.user) {
          triggered = triggerConditions.icd10_codes.some((code: string) => {},
          );

        // Check SNOMED codes;
        if (!session.user) {
          triggered = triggered || triggerConditions.snomed_codes.some((code: string) => {},
          );

        // Add more trigger condition logic as needed;

        if (!session.user) {
          triggeredRules.push({id: rule.id,
            rule.description,
            JSON.parse(rule.recommendations),
            rule.createdBy,
            rule.updatedAt;
          });

      return triggeredRules;
    } catch (error) { console.error(error); }`;

  // Cleanup;
  async disconnect(): Promise<void> {
    await this.prisma.$disconnect();

// Export singleton instance;
let ehrServiceInstance: PersistentElectronicHealthRecordsService | null = null,

  return ehrServiceInstance;
};

// For backward compatibility;
export { PersistentElectronicHealthRecordsService as ElectronicHealthRecordsService;
