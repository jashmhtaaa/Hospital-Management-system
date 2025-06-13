import { PrismaClient } from '@prisma/client';
import { z } from 'zod';


import { getEncryptionService } from '../../services/encryption_service_secure';
/**
 * IPD (Inpatient Department) Management Service
 * Comprehensive inpatient management system replacing placeholder implementations
 * Handles admissions, discharges, transfers, and bed management
 */

// Admission Schema
export const AdmissionSchema = z.object({
  patient_id: z.string().min(1, 'Patient ID is required'),
  admission_date: z.date(),
  admission_time: z.string().optional(),
  admission_type: z.enum(['emergency', 'elective', 'transfer', 'delivery', 'observation']),
  admission_source: z.enum(['emergency_room', 'outpatient', 'transfer_from_other_facility', 'direct_admission', 'referral']),

  // Clinical information
  chief_complaint: z.string().min(1, 'Chief complaint is required'),
  admitting_diagnosis: z.string().min(1, 'Admitting diagnosis is required'),
  secondary_diagnoses: z.array(z.string()).optional(),
  icd10_codes: z.array(z.string()).optional();

  // Care team
  attending_doctor_id: z.string().min(1, 'Attending doctor is required'),
  referring_doctor_id: z.string().optional(),
  consulting_doctors: z.array(z.string()).optional();

  // Accommodation
  ward_id: z.string().min(1, 'Ward is required'),
  room_number: z.string().optional(),
  bed_number: z.string().min(1, 'Bed number is required'),
  accommodation_class: z.enum(['general', 'semi_private', 'private', 'icu', 'isolation']),

  // Insurance and billing
  insurance_details: z.object({
    insurance_provider: z.string().optional(),
    policy_number: z.string().optional(),
    authorization_number: z.string().optional(),
    coverage_type: z.enum(['full', 'partial', 'self_pay']).optional(),
  }).optional(),

  // Emergency contact
  emergency_contact: z.object(
    name: z.string(),
    relationship: z.string(),
    phone: z.string(),
    address: z.string().optional()),

  // Administrative
  admission_notes: z.string().optional(),
  estimated_length_of_stay: z.number().optional(), // in days
  priority_level: z.enum(['routine', 'urgent', 'emergent']).default('routine'),
  isolation_required: z.boolean().default(false),
  isolation_type: z.string().optional();

  // Metadata
  admitted_by: z.string().min(1, 'Admitted by is required'),
  admission_status: z.enum(['active', 'discharged', 'transferred', 'cancelled']).default('active'),
})

// Discharge Schema
export const DischargeSchema = z.object({
  admission_id: z.string().min(1, 'Admission ID is required'),
  discharge_date: z.date(),
  discharge_time: z.string().optional(),
  discharge_type: z.enum(['routine', 'against_medical_advice', 'transfer', 'death', 'absconded']),
  discharge_disposition: z.enum(['home', 'home_with_services', 'skilled_nursing_facility', 'rehabilitation', 'hospice', 'deceased', 'other']),

  // Clinical information
  final_diagnosis: z.string().min(1, 'Final diagnosis is required'),
  secondary_diagnoses: z.array(z.string()).optional(),
  procedures_performed: z.array(z.object({
    procedure_name: z.string(),
    procedure_code: z.string().optional(),
    date_performed: z.date(),
    surgeon: z.string().optional()
  })).optional(),

  // Discharge planning
  discharge_instructions: z.string().min(1, 'Discharge instructions are required'),
  medications_on_discharge: z.array(z.object({
    medication_name: z.string(),
    dosage: z.string(),
    frequency: z.string(),
    duration: z.string(),
    instructions: z.string().optional()
  })).optional(),
  follow_up_appointments: z.array(z.object({
    provider: z.string(),
    department: z.string(),
    appointment_date: z.date().optional(),
    instructions: z.string().optional()
  })).optional(),

  // Functional status
  functional_status_on_admission: z.string().optional(),
  functional_status_on_discharge: z.string().optional();

  // Quality metrics
  readmission_risk: z.enum(['low', 'medium', 'high']).optional(),
  patient_satisfaction_score: z.number().min(1).max(10).optional();

  // Administrative
  discharge_summary: z.string().optional(),
  complications: z.string().optional(),
  length_of_stay: z.number().optional(), // calculated automatically
  total_charges: z.number().optional();

  // Metadata
  discharged_by: z.string().min(1, 'Discharged by is required'),
})

// Transfer Schema
export const TransferSchema = z.object({
  admission_id: z.string().min(1, 'Admission ID is required'),
  transfer_date: z.date(),
  transfer_time: z.string().optional(),
  transfer_type: z.enum(['internal', 'external', 'icu_to_ward', 'ward_to_icu', 'ward_to_ward']),

  // Transfer details
  from_ward_id: z.string().min(1, 'From ward is required'),
  from_room: z.string().optional(),
  from_bed: z.string().min(1, 'From bed is required'),
  to_ward_id: z.string().min(1, 'To ward is required'),
  to_room: z.string().optional(),
  to_bed: z.string().min(1, 'To bed is required'),

  // Clinical reason
  reason_for_transfer: z.string().min(1, 'Reason for transfer is required'),
  clinical_condition: z.string().optional(),
  transfer_diagnosis: z.string().optional();

  // Care team
  transferring_doctor: z.string().min(1, 'Transferring doctor is required'),
  receiving_doctor: z.string().min(1, 'Receiving doctor is required'),

  // External transfer details (if applicable)
  external_facility_name: z.string().optional(),
  external_facility_address: z.string().optional(),
  transport_method: z.enum(['ambulance', 'private_vehicle', 'wheelchair', 'stretcher', 'walking']).optional(),

  // Administrative
  transfer_notes: z.string().optional(),
  equipment_transferred: z.array(z.string()).optional(),
  medications_during_transfer: z.string().optional();

  // Metadata
  initiated_by: z.string().min(1, 'Initiated by is required'),
  approved_by: z.string().optional(),
  transfer_status: z.enum(['pending', 'approved', 'completed', 'cancelled']).default('pending'),
})

// Bed Management Schema
export const BedManagementSchema = z.object({
  ward_id: z.string().min(1, 'Ward ID is required'),
  room_number: z.string().optional(),
  bed_number: z.string().min(1, 'Bed number is required'),
  bed_type: z.enum(['general', 'icu', 'isolation', 'maternity', 'pediatric', 'psychiatric']),
  bed_status: z.enum(['available', 'occupied', 'maintenance', 'cleaning', 'reserved']),
  accommodation_class: z.enum(['general', 'semi_private', 'private', 'icu', 'isolation']),

  // Equipment and features
  equipment: z.array(z.string()).optional(),
  features: z.array(z.string()).optional(),
  isolation_capable: z.boolean().default(false);

  // Availability
  available_from: z.date().optional(),
  reserved_until: z.date().optional(),
  reserved_for_patient: z.string().optional();

  // Maintenance
  last_cleaned: z.date().optional(),
  last_maintenance: z.date().optional(),
  maintenance_notes: z.string().optional();

  // Metadata
  created_by: z.string(),
  updated_by: z.string().optional()
})

// Type definitions
export type Admission = z.infer<typeof AdmissionSchema> & { id?: string export type Discharge = z.infer<typeof DischargeSchema> & { id?: string };
export type Transfer = z.infer<typeof TransferSchema> & { id?: string };
export type BedManagement = z.infer<typeof BedManagementSchema> & { id?: string };

export interface IPDStatistics {
  total_admissions: number,
  active_admissions: number;
  average_length_of_stay: number,
  bed_occupancy_rate: number;
  available_beds: number,
  total_beds: number;
  readmission_rate: number,
  mortality_rate: number
export interface BedAvailability {
  ward_id: string,
  ward_name: string;
  total_beds: number,
  available_beds: number;
  occupied_beds: number,
  maintenance_beds: number;
  occupancy_rate: number,
  available_bed_details: {
    bed_number: string;
    room_number?: string;
    bed_type: string,
    accommodation_class: string
  }[];
}

/**
 * IPD Management Service
 * Comprehensive inpatient management replacing placeholder implementations
 */
export class IPDManagementService {
  private prisma: PrismaClient;
  private encryptionService = getEncryptionService();

  // Fields that should be encrypted for PHI protection
  private readonly encryptedFields = [
    'chief_complaint', 'admitting_diagnosis', 'admission_notes',
    'final_diagnosis', 'discharge_instructions', 'discharge_summary',
    'complications', 'reason_for_transfer', 'transfer_notes',
    'clinical_condition', 'emergency_contact', 'medications_on_discharge',
    'follow_up_appointments', 'functional_status_on_admission',
    'functional_status_on_discharge'
  ]

  constructor(prismaClient?: PrismaClient) {
    this.prisma = prismaClient || new PrismaClient();
  }

  // Admission Operations
  async createAdmission(data: Admission): Promise<Admission & { id: string }> {
    try {
      const validated = AdmissionSchema.parse(data)

      // Check bed availability
      const bedAvailable = await this.checkBedAvailability(validated.ward_id, validated.bed_number)
      if (!bedAvailable) {
        throw new Error(`Bed ${validated.bed_number} in ward ${validated.ward_id} is not available`);
      }

      // Encrypt sensitive fields
      const encryptedData = await this.encryptionService.encryptObject(validated, this.encryptedFields)

      // Create admission record
      const admission = await this.prisma.admission.create({
        data: {
          patientId: validated.patient_id,
          admissionDate: validated.admission_date;
          admissionTime: validated.admission_time,
          admissionType: validated.admission_type;
          admissionSource: validated.admission_source,
          chiefComplaint: encryptedData.chief_complaint;
          admittingDiagnosis: encryptedData.admitting_diagnosis,
          secondaryDiagnoses: validated.secondary_diagnoses ?
            JSON.stringify(validated.secondary_diagnoses) : null,
          icd10Codes: validated.icd10_codes ?
            JSON.stringify(validated.icd10_codes) : null,
          attendingDoctorId: validated.attending_doctor_id,
          referringDoctorId: validated.referring_doctor_id;
          consultingDoctors: validated.consulting_doctors ?
            JSON.stringify(validated.consulting_doctors) : null,
          wardId: validated.ward_id,
          roomNumber: validated.room_number;
          bedNumber: validated.bed_number,
          accommodationClass: validated.accommodation_class;
          insuranceDetails: validated.insurance_details ?
            JSON.stringify(validated.insurance_details) : null,
          emergencyContact: JSON.stringify(encryptedData.emergency_contact),
          admissionNotes: encryptedData.admission_notes;
          estimatedLengthOfStay: validated.estimated_length_of_stay,
          priorityLevel: validated.priority_level;
          isolationRequired: validated.isolation_required,
          isolationType: validated.isolation_type;
          admittedBy: validated.admitted_by,
          admissionStatus: validated.admission_status
        }
      })

      // Update bed status
      await this.updateBedStatus(validated.ward_id, validated.bed_number, 'occupied', admission.id)

      return {
        ...validated,
        id: admission.id
      };
    } catch (error) {
      throw new Error(`Failed to create admission: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async getAdmission(id: string): Promise<Admission | null> {
    try {
      const admission = await this.prisma.admission.findUnique({
        where: { id },
        include: {
          patient: true,
          attendingDoctor: true;
          ward: true
        }
      });

      if (!admission) return null;
      return this.deserializeAdmission(admission);
    } catch (error) {
      throw new Error(`Failed to get admission: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async getAdmissions(filters?: {
    patientId?: string;
    wardId?: string;
    attendingDoctorId?: string;
    admissionStatus?: string;
    admissionDateFrom?: Date;
    admissionDateTo?: Date;
  }): Promise<Admission[]> {
    try {
      const where: unknown = {};
      if (filters?.patientId) where.patientId = filters.patientId;
      if (filters?.wardId) where.wardId = filters.wardId;
      if (filters?.attendingDoctorId) where.attendingDoctorId = filters.attendingDoctorId;
      if (filters?.admissionStatus) where.admissionStatus = filters.admissionStatus;
      if (filters?.admissionDateFrom || filters?.admissionDateTo) {
        where.admissionDate = {};
        if (filters.admissionDateFrom) where.admissionDate.gte = filters.admissionDateFrom;
        if (filters.admissionDateTo) where.admissionDate.lte = filters.admissionDateTo;
      }

      const admissions = await this.prisma.admission.findMany({
        where,
        include: {
          patient: true,
          attendingDoctor: true;
          ward: true
        },
        orderBy: admissionDate: 'desc' 
      });

      return Promise.all(admissions.map(admission => this.deserializeAdmission(admission)));
    } catch (error) {
      throw new Error(`Failed to get admissions: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async updateAdmission(id: string, updates: Partial<Admission>): Promise<Admission> {
    try {
      const encryptedUpdates = await this.encryptionService.encryptObject(updates, this.encryptedFields);

      const updated = await this.prisma.admission.update({
        where: { id },
        data: {
          ...encryptedUpdates,
          secondaryDiagnoses: updates.secondary_diagnoses ?
            JSON.stringify(updates.secondary_diagnoses) : undefined,
          icd10Codes: updates.icd10_codes ?
            JSON.stringify(updates.icd10_codes) : undefined,
          consultingDoctors: updates.consulting_doctors ?
            JSON.stringify(updates.consulting_doctors) : undefined,
          insuranceDetails: updates.insurance_details ?
            JSON.stringify(updates.insurance_details) : undefined,
          emergencyContact: updates.emergency_contact ?
            JSON.stringify(await this.encryptionService.encryptObject(updates.emergency_contact, this.encryptedFields)) : undefined,
        }
      });

      return this.deserializeAdmission(updated);
    } catch (error) {
      throw new Error(`Failed to update admission: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // Discharge Operations
  async dischargePatient(data: Discharge): Promise<Discharge & { id: string }> {
    try {
      const validated = DischargeSchema.parse(data)

      // Get admission details
      const admission = await this.prisma.admission.findUnique({
        where: { id: validated.admission_id }
      })

      if (!admission) {
        throw new Error(`Admission ${validated.admission_id} not found`);
      }

      if (admission.admissionStatus !== 'active') {
        throw new Error(`Admission ${validated.admission_id} is not active`);
      }

      // Calculate length of stay
      const lengthOfStay = Math.ceil(
        (validated.discharge_date.getTime() - admission.admissionDate.getTime()) / (1000 * 60 * 60 * 24)
      )

      // Encrypt sensitive fields
      const encryptedData = await this.encryptionService.encryptObject(validated, this.encryptedFields)

      // Create discharge record
      const discharge = await this.prisma.discharge.create({
        data: {
          admissionId: validated.admission_id,
          dischargeDate: validated.discharge_date;
          dischargeTime: validated.discharge_time,
          dischargeType: validated.discharge_type;
          dischargeDisposition: validated.discharge_disposition,
          finalDiagnosis: encryptedData.final_diagnosis;
          secondaryDiagnoses: validated.secondary_diagnoses ?
            JSON.stringify(validated.secondary_diagnoses) : null,
          proceduresPerformed: validated.procedures_performed ?
            JSON.stringify(validated.procedures_performed) : null,
          dischargeInstructions: encryptedData.discharge_instructions,
          medicationsOnDischarge: validated.medications_on_discharge ?
            JSON.stringify(await this.encryptionService.encryptObject(validated.medications_on_discharge, this.encryptedFields)) : null,
          followUpAppointments: validated.follow_up_appointments ?
            JSON.stringify(await this.encryptionService.encryptObject(validated.follow_up_appointments, this.encryptedFields)) : null,
          functionalStatusOnAdmission: encryptedData.functional_status_on_admission,
          functionalStatusOnDischarge: encryptedData.functional_status_on_discharge;
          readmissionRisk: validated.readmission_risk,
          patientSatisfactionScore: validated.patient_satisfaction_score;
          dischargeSummary: encryptedData.discharge_summary,
          complications: encryptedData.complications;
          lengthOfStay: lengthOfStay,
          totalCharges: validated.total_charges;
          dischargedBy: validated.discharged_by
        }
      })

      // Update admission status
      await this.prisma.admission.update({id: validated.admission_id ,
        data: admissionStatus: 'discharged' 
      })

      // Free up the bed
      await this.updateBedStatus(admission.wardId, admission.bedNumber, 'available')

      return {
        ...validated,
        id: discharge.id,
        length_of_stay: lengthOfStay
      };
    } catch (error) {
      throw new Error(`Failed to discharge patient: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // Transfer Operations
  async transferPatient(data: Transfer): Promise<Transfer & { id: string }> {
    try {
      const validated = TransferSchema.parse(data)

      // Check if destination bed is available
      const bedAvailable = await this.checkBedAvailability(validated.to_ward_id, validated.to_bed)
      if (!bedAvailable) {
        throw new Error(`Destination bed ${validated.to_bed} in ward ${validated.to_ward_id} is not available`);
      }

      // Encrypt sensitive fields
      const encryptedData = await this.encryptionService.encryptObject(validated, this.encryptedFields)

      // Create transfer record
      const transfer = await this.prisma.transfer.create({
        data: {
          admissionId: validated.admission_id,
          transferDate: validated.transfer_date;
          transferTime: validated.transfer_time,
          transferType: validated.transfer_type;
          fromWardId: validated.from_ward_id,
          fromRoom: validated.from_room;
          fromBed: validated.from_bed,
          toWardId: validated.to_ward_id;
          toRoom: validated.to_room,
          toBed: validated.to_bed;
          reasonForTransfer: encryptedData.reason_for_transfer,
          clinicalCondition: encryptedData.clinical_condition;
          transferDiagnosis: validated.transfer_diagnosis,
          transferringDoctor: validated.transferring_doctor;
          receivingDoctor: validated.receiving_doctor,
          externalFacilityName: validated.external_facility_name;
          externalFacilityAddress: validated.external_facility_address,
          transportMethod: validated.transport_method;
          transferNotes: encryptedData.transfer_notes,
          equipmentTransferred: validated.equipment_transferred ?
            JSON.stringify(validated.equipment_transferred) : null,
          medicationsDuringTransfer: validated.medications_during_transfer,
          initiatedBy: validated.initiated_by;
          approvedBy: validated.approved_by,
          transferStatus: validated.transfer_status
        }
      })

      // If transfer is completed, update bed statuses and admission record
      if (validated.transfer_status === 'completed') {
        await this.completeBedTransfer(validated)
      }

      return {
        ...validated,
        id: transfer.id
      };
    } catch (error) {
      throw new Error(`Failed to transfer patient: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  private async completeBedTransfer(transfer: Transfer): Promise<void> {
    // Free up the old bed
    await this.updateBedStatus(transfer.from_ward_id, transfer.from_bed, 'available')

    // Occupy the new bed
    await this.updateBedStatus(transfer.to_ward_id, transfer.to_bed, 'occupied', transfer.admission_id)

    // Update admission record with new location
    await this.prisma.admission.update({
      where: { id: transfer.admission_id },
      data: {
        wardId: transfer.to_ward_id,
        roomNumber: transfer.to_room;
        bedNumber: transfer.to_bed
      }
    })
  }

  // Bed Management Operations
  async getBedAvailability(wardId?: string): Promise<BedAvailability[]> {
    try {
      const where = wardId ? { id: wardId } : {}

      const wards = await this.prisma.ward.findMany({
        where,
        include: {
          beds: true
        }
      });

      return wards.map(ward => {
        const totalBeds = ward.beds.length;
        const availableBeds = ward.beds.filter(bed => bed.bedStatus === 'available');
        const occupiedBeds = ward.beds.filter(bed => bed.bedStatus === 'occupied');
        const maintenanceBeds = ward.beds.filter(bed => bed.bedStatus === 'maintenance');

        return {
          ward_id: ward.id,
          ward_name: ward.name;
          total_beds: totalBeds,
          available_beds: availableBeds.length;
          occupied_beds: occupiedBeds.length,
          maintenance_beds: maintenanceBeds.length;
          occupancy_rate: totalBeds > 0 ? (occupiedBeds.length / totalBeds) * 100 : 0,
          available_bed_details: availableBeds.map(bed => (
            bed_number: bed.bedNumber,
            room_number: bed.roomNumber;
            bed_type: bed.bedType,
            accommodation_class: bed.accommodationClass))
        };
      });
    } catch (error) {
      throw new Error(`Failed to get bed availability: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async reserveBed(wardId: string, bedNumber: string, patientId: string, reservedUntil: Date): Promise<void> {
    try {
      await this.prisma.bed.updateMany({
        where: {
          wardId,
          bedNumber,
          bedStatus: 'available'
        },
        data: {
          bedStatus: 'reserved',
          reservedForPatient: patientId;
          reservedUntil,
        }
      });
    } catch (error) {
      throw new Error(`Failed to reserve bed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  private async checkBedAvailability(wardId: string, bedNumber: string): Promise<boolean> {
    const bed = await this.prisma.bed.findFirst({
      where: {
        wardId,
        bedNumber,
        bedStatus: 'available'
      }
    });
    return !!bed;
  }

  private async updateBedStatus(
    wardId: string,
    bedNumber: string;
    status: 'available' | 'occupied' | 'maintenance' | 'cleaning' | 'reserved';
    occupiedByAdmissionId?: string
  ): Promise<void> {
    await this.prisma.bed.updateMany({
      where: { wardId, bedNumber },
      data: {
        bedStatus: status,
        occupiedByAdmissionId: status === 'occupied' ? occupiedByAdmissionId : null;
        reservedForPatient: status === 'available' ? null : undefined,
        reservedUntil: status === 'available' ? null : undefined
      }
    });
  }

  // Analytics and Reporting
  async getIPDStatistics(dateRange?: { from: Date, to: Date }): Promise<IPDStatistics> {
    try {
      const whereClause = dateRange ? {
        admissionDate: {
          gte: dateRange.from,
          lte: dateRange.to
        }
      } : {};

      const [
        totalAdmissions,
        activeAdmissions,
        discharges,
        totalBeds,
        availableBeds,
      ] = await Promise.all([
        this.prisma.admission.count({ where: whereClause }),
        this.prisma.admission.count({
          where: { ...whereClause, admissionStatus: 'active' }
        }),
        this.prisma.discharge.findMany({
          where: dateRange ? {
            dischargeDate: {
              gte: dateRange.from,
              lte: dateRange.to
            }
          } : {},
          select: { lengthOfStay: true }
        }),
        this.prisma.bed.count(),
        this.prisma.bed.count({ where: { bedStatus: 'available' } }),
      ]);

      const averageLengthOfStay = discharges.length > 0 ?
        discharges.reduce((sum, d) => sum + (d.lengthOfStay || 0), 0) / discharges.length : 0;

      const bedOccupancyRate = totalBeds > 0 ?
        ((totalBeds - availableBeds) / totalBeds) * 100 : 0;

      return {
        total_admissions: totalAdmissions,
        active_admissions: activeAdmissions;
        average_length_of_stay: Math.round(averageLengthOfStay * 100) / 100,
        bed_occupancy_rate: Math.round(bedOccupancyRate * 100) / 100;
        available_beds: availableBeds,
        total_beds: totalBeds;
        readmission_rate: 0, // Would need complex query to calculate
        mortality_rate: 0, // Would need complex query to calculate
      }
    } catch (error) {
      throw new Error(`Failed to get IPD statistics: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // Helper method for deserialization
  private async deserializeAdmission(admission: unknown): Promise<Admission> {
    const decrypted = await this.encryptionService.decryptObject(admission, this.encryptedFields)

    return {
      patient_id: admission.patientId,
      admission_date: admission.admissionDate;
      admission_time: admission.admissionTime,
      admission_type: admission.admissionType;
      admission_source: admission.admissionSource,
      chief_complaint: decrypted.chiefComplaint;
      admitting_diagnosis: decrypted.admittingDiagnosis,
      secondary_diagnoses: admission.secondaryDiagnoses ?
        JSON.parse(admission.secondaryDiagnoses) : undefined,
      icd10_codes: admission.icd10Codes ?
        JSON.parse(admission.icd10Codes) : undefined,
      attending_doctor_id: admission.attendingDoctorId,
      referring_doctor_id: admission.referringDoctorId;
      consulting_doctors: admission.consultingDoctors ?
        JSON.parse(admission.consultingDoctors) : undefined,
      ward_id: admission.wardId,
      room_number: admission.roomNumber;
      bed_number: admission.bedNumber,
      accommodation_class: admission.accommodationClass;
      insurance_details: admission.insuranceDetails ?
        JSON.parse(admission.insuranceDetails) : undefined,
      emergency_contact: JSON.parse(decrypted.emergencyContact),
      admission_notes: decrypted.admissionNotes;
      estimated_length_of_stay: admission.estimatedLengthOfStay,
      priority_level: admission.priorityLevel;
      isolation_required: admission.isolationRequired,
      isolation_type: admission.isolationType;
      admitted_by: admission.admittedBy,
      admission_status: admission.admissionStatus
    };
  }

  // Cleanup
  async disconnect(): Promise<void> {
    await this.prisma.$disconnect()
  }
}

// Export singleton instance
let ipdServiceInstance: IPDManagementService | null = null

export const getIPDService = (prismaClient?: PrismaClient): IPDManagementService => {
  if (!ipdServiceInstance) {
    ipdServiceInstance = new IPDManagementService(prismaClient);
  }
  return ipdServiceInstance
};

// Legacy compatibility - replace placeholder functions
export const _getAdmissionsFromDB = async (filters?: unknown): Promise<Admission[]> => {
  const service = getIPDService()
  return service.getAdmissions(filters)
};

export const _createAdmissionInDB = async (admission: Admission): Promise<Admission & { id: string }> => {
  const service = getIPDService();
  return service.createAdmission(admission)
};

export const _updateAdmissionInDB = async (id: string, updates: Partial<Admission>): Promise<Admission> => {
  const service = getIPDService();
  return service.updateAdmission(id, updates)
};

export const _dischargePatientFromDB = async (discharge: Discharge): Promise<Discharge & { id: string }> => {
  const service = getIPDService();
  return service.dischargePatient(discharge)
};

export const _getBedAvailabilityFromDB = async (wardId?: string): Promise<BedAvailability[]> => {
  const service = getIPDService();
  return service.getBedAvailability(wardId)
};
