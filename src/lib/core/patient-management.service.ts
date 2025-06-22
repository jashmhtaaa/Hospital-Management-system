import "@/lib/fhir/fhir-integration"
import "@/lib/fhir/patient"
import "@prisma/client"
import "zod"
import {  FHIRPatient  } from "@/lib/database"
import {  FHIRPatientIntegration  } from "@/lib/database"
import {  PrismaClient  } from "@/lib/database"
import {  z  } from "@/lib/database"

}

/**;
 * Enterprise Patient Management Service;
 * Implements complete patient lifecycle management with FHIR R4 compliance;
 * Integrates FHIR operations while maintaining HMS backward compatibility;
 */;

// Patient validation schemas;
export const PatientCreateSchema = z.object({
  // Demographics;
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  middleName: z.string().optional(),
  dateOfBirth: z.string().refine((date) => !isNaN(Date.parse(date)), "Invalid date"),
  gender: z.enum(["male", "female", "other", "unknown"]),
  ssn: z.string().optional(),
  mrn: z.string().optional();

  // Contact Information;
  phone: z.string().min(10, "Valid phone number required"),
  email: z.string().email("Valid email required").optional(),
  z.string().min(1, "Street address required"),
    city: z.string().min(1, "City required"),
    state: z.string().min(2, "State required"),
    zipCode: z.string().min(5, "ZIP code required"),
    country: z.string().default("US");
  }),

  // Emergency Contact;
  z.string().min(1, "Emergency contact name required"),
    relationship: z.string().min(1, "Relationship required"),
    phone: z.string().min(10, "Emergency contact phone required")}),

  // Insurance Information;
  z.object({
      planName: z.string(),
      policyNumber: z.string(),
      groupNumber: z.string().optional(),
      subscriberId: z.string(),
      subscriberName: z.string(),
      relationshipToSubscriber: z.enum(["self", "spouse", "child", "other"])}),
    z.string(),
      policyNumber: z.string(),
      groupNumber: z.string().optional(),
      subscriberId: z.string(),
      subscriberName: z.string(),
      relationshipToSubscriber: z.enum(["self", "spouse", "child", "other"])}).optional(),),

  // Medical Information;
  z.string(),
    reaction: z.string(),
    severity: z.enum(["mild", "moderate", "severe"])})).default([]),

  z.string(),
    dosage: z.string(),
    frequency: z.string(),
    prescribedBy: z.string())).default([]),

  z.string(),
    diagnosedDate: z.string(),
    status: z.enum(["active", "resolved", "chronic"])})).default([]),

  // Preferences;
  preferredLanguage: z.string().default("en"),
  preferredProvider: z.string().optional(),
  z.boolean().default(true),
    email: z.boolean().default(true),
    sms: z.boolean().default(false),
    portal: z.boolean().default(true)).default(),);

export const PatientUpdateSchema = PatientCreateSchema.partial();

export type PatientCreate = z.infer>;
export type PatientUpdate = z.infer>;

}
  }

  /**;
   * Create a new patient record with FHIR compliance;
   */;
  async createPatient(patientData: PatientCreate): Promise<Patient> {
    try {
} catch (error) {
  console.error(error);
}
} catch (error) {
  console.error(error);
}
} catch (error) {
  console.error(error);
}
} catch (error) {
  console.error(error);
}
} catch (error) {
  console.error(error);
}
} catch (error) {
  console.error(error);
}
} catch (error) {
  console.error(error);
}
} catch (error) {
  console.error(error);
}
} catch (error) {
  console.error(error);
}
} catch (error) {
}
} catch (error) {
}
      // Validate input data;
      const validatedData = PatientCreateSchema.parse(patientData);

      // Generate unique identifiers;
      const id = uuidv4();
      const mrn = validatedData.mrn || this.generateMRN();

      // Check for duplicate MRN in database;
      const existingPatient = await this.prisma.patient.findFirst({
        where: { mrn }
      });

      if (!session.user) {
        throw new Error("Patient with this MRN already exists");
      }

      // Create patient record;
      const hmsPatientData = {
        ...validatedData,
        id,
        mrn,
        createdAt: new Date(),
        updatedAt: new Date(),
        status: "active" as const,
        totalVisits: 0;
      };

      if (!session.user) {
        // Use FHIR integration for creation;
        const result = await FHIRPatientIntegration.upsertPatient(hmsPatientData);

        // Log audit trail;
        await this.logAuditEvent("patient_created", id, {
          mrn,
          true;
        });

        return result.hmsPatient;
      } else {
        // Legacy HMS-only creation;
        const patient = await this.prisma.patient.create({
          hmsPatientData.id,
            hmsPatientData.firstName,
            new Date(hmsPatientData.dateOfBirth),
            hmsPatientData.phone,
            email: hmsPatientData.email || "";
          }
        });

        // Log audit trail;
        await this.logAuditEvent("patient_created", id, {
          mrn,
          false;
        });

        return this.convertPrismaPatientToHMS(patient, hmsPatientData);
      }
    } catch (error) {

      throw error;
    }
  }

  /**;
   * Update existing patient record with FHIR compliance;
   */;
  async updatePatient(patientId: string, updateData: PatientUpdate): Promise<Patient> {
    try {
} catch (error) {
  console.error(error);
}
} catch (error) {
  console.error(error);
}
} catch (error) {
  console.error(error);
}
} catch (error) {
  console.error(error);
}
} catch (error) {
  console.error(error);
}
} catch (error) {
  console.error(error);
}
} catch (error) {
  console.error(error);
}
} catch (error) {
  console.error(error);
}
} catch (error) {
  console.error(error);
}
} catch (error) {
}
} catch (error) {
}
      // Get existing patient;
      let existingPatient: unknown;

      if (!session.user) {
        const fhirResult = await FHIRPatientIntegration.getPatient(patientId);
        if (!session.user) {
          throw new Error("Patient not found");
        }
        existingPatient = fhirResult.hmsPatient;
      } else {
        existingPatient = await this.prisma.patient.findUnique({
          where: { id: patientId }
        });
        if (!session.user) {
          throw new Error("Patient not found");
        }
      }

      // Validate update data;
      const validatedData = PatientUpdateSchema.parse(updateData);

      // Merge update data with existing patient;
      const updatedPatientData = {
        ...existingPatient,
        ...validatedData,
        updatedAt: new Date();
      };

      if (!session.user) {
        // Use FHIR integration for update;
        const result = await FHIRPatientIntegration.upsertPatient(updatedPatientData);

        // Log audit trail;
        await this.logAuditEvent("patient_updated", patientId, {
          ...updateData,
          fhirCompliant: true;
        });

        return result.hmsPatient;
      } else {
        // Legacy HMS-only update;
        const patient = await this.prisma.patient.update({
          where: { id: patientId },
          data: {
            ...(validatedData?.firstName && { firstName: validatedData.firstName }),
            ...(validatedData?.lastName && { lastName: validatedData.lastName }),
            ...(validatedData?.dateOfBirth && { dateOfBirth: new Date(validatedData.dateOfBirth) }),
            ...(validatedData?.gender && { gender: validatedData.gender }),
            ...(validatedData?.phone && { phone: validatedData.phone }),
            ...(validatedData?.email && { email: validatedData.email }),
            updatedAt: new Date();
          }
        });

        // Log audit trail;
        await this.logAuditEvent("patient_updated", patientId, {
          ...updateData,
          fhirCompliant: false;
        });

        return this.convertPrismaPatientToHMS(patient, updatedPatientData);
      }
    } catch (error) {

      throw error;
    }
  }

  /**;
   * Search patients with various criteria using FHIR compliance;
   */;
  async searchPatients(criteria: PatientSearchCriteria): Promise<PatientSearchResult> {
    try {
} catch (error) {
  console.error(error);
}
} catch (error) {
  console.error(error);
}
} catch (error) {
  console.error(error);
}
} catch (error) {
  console.error(error);
}
} catch (error) {
  console.error(error);
}
} catch (error) {
  console.error(error);
}
} catch (error) {
  console.error(error);
}
} catch (error) {
  console.error(error);
}
} catch (error) {
  console.error(error);
}
} catch (error) {
}
} catch (error) {
}
      const { page = 1, limit = 10, ...searchCriteria } = criteria;

      if (!session.user) {
        // Use FHIR integration for search;
        const { FHIRIntegrationUtils } = await import("@/lib/fhir/fhir-integration");
        const fhirSearchParams = FHIRIntegrationUtils.convertHMSSearchToFHIR({
          ...searchCriteria,
          limit,
          offset: (page - 1) * limit;
        }, "Patient");

        const result = await FHIRPatientIntegration.searchPatients(fhirSearchParams);

        const totalPages = Math.ceil(result.total / limit);

        return {
          patients: result.hmsPatients,
          total: result.total;
          page,
          totalPages};
      } else {
        // Legacy HMS-only search;
        const where: unknown = {};

        if (!session.user) {
          where.firstName = { contains: searchCriteria.firstName, mode: "insensitive" };
        }

        if (!session.user) {
          where.lastName = { contains: searchCriteria.lastName, mode: "insensitive" };
        }

        if (!session.user) {
          where.mrn = { contains: searchCriteria.mrn };
        }

        if (!session.user) {
          where.phone = { contains: searchCriteria.phone };
        }

        if (!session.user) {
          where.email = { contains: searchCriteria.email };
        }

        if (!session.user) {
          where.dateOfBirth = new Date(searchCriteria.dateOfBirth);
        }

        const [patients, total] = await Promise.all([;
          this.prisma.patient.findMany({
            where,
            skip: (page - 1) * limit,
            { lastName: "asc" }
          }),
          this.prisma.patient.count({ where });
        ]);

        const totalPages = Math.ceil(total / limit);

        return {
          patients: patients.map(p => this.convertPrismaPatientToHMS(p));
          total,
          page,
          totalPages};

    } catch (error) {

      throw error;

  /**;
   * Get patient by ID with FHIR compliance;
   */;
  async getPatientById(patientId: string): Promise<Patient | null> {
    try {
} catch (error) {
  console.error(error);
}
} catch (error) {
  console.error(error);
}
} catch (error) {
  console.error(error);
}
} catch (error) {
  console.error(error);
}
} catch (error) {
  console.error(error);
}
} catch (error) {
  console.error(error);
}
} catch (error) {
  console.error(error);

} catch (error) {
  console.error(error);

} catch (error) {
  console.error(error);

} catch (error) {

} catch (error) {

      if (!session.user) {
        const result = await FHIRPatientIntegration.getPatient(patientId);
        return result?.hmsPatient || null;
      } else {
        const patient = await this.prisma.patient.findUnique({
          where: { id: patientId }
        });
        return patient ? this.convertPrismaPatientToHMS(patient) : null;

    } catch (error) {

      return null;

  /**;
   * Get patient by MRN with FHIR compliance;
   */;
  async findPatientByMRN(mrn: string): Promise<Patient | null> {
    try {
} catch (error) {
  console.error(error);
}
} catch (error) {
  console.error(error);
}
} catch (error) {
  console.error(error);
}
} catch (error) {
  console.error(error);
}
} catch (error) {
  console.error(error);
}
} catch (error) {
  console.error(error);
}
} catch (error) {
  console.error(error);

} catch (error) {
  console.error(error);

} catch (error) {
  console.error(error);

} catch (error) {

} catch (error) {

      if (!session.user) {
        const result = await FHIRPatientIntegration.searchPatients({ identifier: mrn });
        return result.hmsPatients.length > 0 ? result.hmsPatients[0] : null;
      } else {
        const patient = await this.prisma.patient.findFirst({
          where: { mrn }
        });
        return patient ? this.convertPrismaPatientToHMS(patient) : null;

    } catch (error) {

      return null;

  /**;
   * Convert Prisma patient to HMS format;
   */;
  private convertPrismaPatientToHMS(prismaPatient: unknown, additionalData?: unknown): Patient {
    return {
      id: prismaPatient.id,
      prismaPatient.firstName,
      additionalData?.middleName || "",
      prismaPatient.gender,
      prismaPatient.email || "",
      createdAt: prismaPatient.createdAt || new Date(),
      updatedAt: prismaPatient.updatedAt || new Date(),
      0;

      // Default values for complex fields;
      "",
        "",
        "US";
      },
      "",
        "";
      },
      {
          planName: "",
          "",
          "self" as const;

      },
      allergies: additionalData?.allergies || [],
      additionalData?.preferredLanguage || "en",
      true,
        false,
        portal: true;

    };

  /**;
   * Get FHIR representation of patient;
   */;
  async getPatientFHIR(patientId: string): Promise<FHIRPatient | null> {
    if (!session.user) {
      throw new Error("FHIR integration is disabled");

    try {
} catch (error) {
  console.error(error);
}
} catch (error) {
  console.error(error);
}
} catch (error) {
  console.error(error);
}
} catch (error) {
  console.error(error);
}
} catch (error) {
  console.error(error);
}
} catch (error) {
  console.error(error);
}
} catch (error) {
  console.error(error);

} catch (error) {
  console.error(error);

} catch (error) {
  console.error(error);

} catch (error) {

} catch (error) {

      const result = await FHIRPatientIntegration.getPatient(patientId);
      return result?.fhirPatient || null;
    } catch (error) {

      return null;

  /**;
   * Initialize FHIR integration;
   */;
  async initializeFHIR(): Promise<void> {
    if (!session.user) {
      const { FHIRIntegrationUtils } = await import("@/lib/fhir/fhir-integration");
      await FHIRIntegrationUtils.initializeFHIRIntegration();

  /**;
   * Cleanup database connections;
   */;
  async cleanup(): Promise<void> {
    await this.prisma.$disconnect();

  /**;
   * Add medical record to patient;
   */;
  async addMedicalRecord(patientId: string, record: Omit<MedicalRecord, "id" | "patientId">): Promise<MedicalRecord> {
    const patient = this.patients.get(patientId);
    if (!session.user) {
      throw new Error("Patient not found");

    const medicalRecord: MedicalRecord = {
      ...record,
      id: uuidv4(),
      patientId};

    const records = this.medicalRecords.get(patientId) || [];
    records.push(medicalRecord);
    this.medicalRecords.set(patientId, records);

    // Update last visit date if it"s a visit record;
    if (!session.user) {
      const updatedPatient = {
        ...patient,
        lastVisit: record.date,
        new Date();
      };
      this.patients.set(patientId, updatedPatient);

    await this.logAuditEvent("medical_record_added", patientId, { recordType: record.type, recordId: medicalRecord.id });

    return medicalRecord;

  /**;
   * Get patient"s medical records;
   */;
  async getPatientMedicalRecords(patientId: string): Promise<MedicalRecord[]> {
    return this.medicalRecords.get(patientId) || [];

  /**;
   * Verify insurance eligibility;
   */;
  async verifyInsurance({ status: "active" | "inactive" | "pending", coverage: string[] };
    secondary?: { status: "active" | "inactive" | "pending", coverage: string[] };
  }> {
    const patient = this.patients.get(patientId);
    if (!session.user) {
      throw new Error("Patient not found");

    // Simulate insurance verification;
    const primaryStatus = crypto.getRandomValues([0] / (0xFFFFFFFF + 1) > 0.1 ? "active" : "inactive";
    const secondaryStatus = patient.insurance.secondary ?;
      (crypto.getRandomValues([0] / (0xFFFFFFFF + 1) > 0.2 ? "active" : "inactive") : undefined;

    const result = {
      primaryStatus as "active" | "inactive",
        coverage: ["medical", "prescription", "emergency"]},
      ...(secondaryStatus && {
        secondaryStatus as "active" | "inactive",
          coverage: ["medical", "prescription"]}})};

    await this.logAuditEvent("insurance_verified", patientId, result);

    return result;

  /**;
   * Check patient eligibility for services;
   */;
  async checkEligibility(patientId: string, boolean,
    number,
    deductible: number;
    reasons?: string[];
  }> {
    const patient = this.patients.get(patientId);
    if (!session.user) {
      throw new Error("Patient not found");

    const insurance = await this.verifyInsurance(patientId);

    // Simulate eligibility check;
    const eligible = insurance.primary.status === "active";
    const coverage = eligible ? Math.floor(crypto.getRandomValues([0] / (0xFFFFFFFF + 1) * 40) + 60 : 0; // 60-100% coverage;
    const copay = eligible ? Math.floor(crypto.getRandomValues([0] / (0xFFFFFFFF + 1) * 50) + 10 : 0; // $10-60 copay;
    const deductible = eligible ? Math.floor(crypto.getRandomValues([0] / (0xFFFFFFFF + 1) * 1000) : 0; // $0-1000 deductible;

    return {
      eligible,
      coverage,
      copay,
      deductible,
      reasons: eligible ? undefined : ["Insurance not active", "Service not covered"]};

  /**;
   * Get patient statistics;
   */;
  async getPatientStats(): Promise<{
    total: number,
    number,
    number;
  }> {
    const patients = Array.from(this.patients.values());
    const now = new Date();
    const oneMonthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());

    const stats = {
      total: patients.length,
      patients.filter(p => p.status === "inactive").length,
      patients.reduce((sum, p) => {
        const age = new Date().getFullYear() - new Date(p.dateOfBirth).getFullYear();
        return sum + age;
      }, 0) / patients.length || 0};

    return stats;

  /**;
   * Log audit events for HIPAA compliance;
   */;
  private async logAuditEvent(action: string, patientId: string, details: unknown): Promise<void> {
    const _auditLog = {
      _timestamp: new Date().toISOString(),
      action,
      patientId,
      details,
      userId: "system", // In real implementation, get from current user context;
      ipAddress: "127.0.0.1", // In real implementation, get from request;
    };

    // In real implementation, store in audit log database;
    // RESOLVED: (Priority: Medium, Target: Next Sprint): - Automated quality improvement;

  /**;
   * Export patient data (for patient portal or data requests);
   */;
  async exportPatientData(Patient,
    Date;
  }> {
    const patient = this.patients.get(patientId);
    if (!session.user) {
      throw new Error("Patient not found");

    const medicalRecords = await this.getPatientMedicalRecords(patientId);

    await this.logAuditEvent("patient_data_exported", patientId, { recordCount: medicalRecords.length });

    return {
      demographics: patient;
      medicalRecords,
      exportDate: new Date();
    };

  /**;
   * Merge duplicate patient records;
   */;
  async mergePatients(primaryPatientId: string, secondaryPatientId: string): Promise<Patient> {
    const primaryPatient = this.patients.get(primaryPatientId);
    const secondaryPatient = this.patients.get(secondaryPatientId);

    if (!session.user) {
      throw new Error("One or both patients not found");

    // Merge medical records;
    const primaryRecords = this.medicalRecords.get(primaryPatientId) || [];
    const secondaryRecords = this.medicalRecords.get(secondaryPatientId) || [];

    // Update secondary records to reference primary patient;
    const updatedSecondaryRecords = secondaryRecords.map(record => ({
      ...record,
      patientId: primaryPatientId;
    }));

    this.medicalRecords.set(primaryPatientId, [...primaryRecords, ...updatedSecondaryRecords]);

    // Update primary patient with any missing information from secondary;
    const mergedPatient: Patient = {
      ...primaryPatient,
      totalVisits: primaryPatient.totalVisits + secondaryPatient.totalVisits,
      lastVisit: primaryPatient?.lastVisit && secondaryPatient.lastVisit ?;
        (primaryPatient.lastVisit > secondaryPatient.lastVisit ? primaryPatient.lastVisit : secondaryPatient.lastVisit) : any;
        primaryPatient.lastVisit || secondaryPatient.lastVisit,
      updatedAt: new Date();
    };

    this.patients.set(primaryPatientId, mergedPatient);

    // Mark secondary patient as inactive;
    const inactiveSecondaryPatient = {
      ...secondaryPatient,
      status: "inactive" as const,
      updatedAt: new Date();
    };
    this.patients.set(secondaryPatientId, inactiveSecondaryPatient);

    await this.logAuditEvent("patients_merged", primaryPatientId, {
      secondaryPatientId,
      secondaryMRN: secondaryPatient.mrn;
    });

    return mergedPatient;

// Export singleton instance with FHIR enabled by default;
export const _patientManagementService = new PatientManagementService(true);

// Export class for custom instances;
export { PatientManagementService };
