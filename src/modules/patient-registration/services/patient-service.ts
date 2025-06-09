import { Prisma } from '@prisma/client';


import { AuditService } from '@/lib/audit/audit-service';
import { prisma } from '@/lib/prisma';
// src/modules/patient-registration/services/patient-service.ts
export interface CreatePatientData {
  firstName: string;
  lastName: string;
  dateOfBirth: Date;
  gender: string;
  phone?: string;
  email?: string;
  address?: string;
  emergencyContact: string;
  emergencyPhone: string;
  bloodGroup?: string;
  allergies?: string;
  insuranceProvider?: string;
  insuranceNumber?: string;
}

export interface UpdatePatientData extends Partial<CreatePatientData> {
  id: string;
}

export class PatientService {
  static async createPatient(data: CreatePatientData, createdBy?: string) {
    // Generate unique MRN
    const lastPatient = await prisma.patient.findFirst({
      orderBy: { createdAt: 'desc' },
      select: { mrn: true }
    });

    const nextMrnNumber = lastPatient ?
      parseInt(lastPatient.mrn.substring(3)) + 1 : 1001;
    const mrn = `MRN${nextMrnNumber.toString().padStart(6, '0')}`;

    const patient = await prisma.patient.create({
      data: {
        ...data,
        mrn
      }
    });

    // Audit log
    if (createdBy != null) {
      await AuditService.logUserAction(
        { userId: createdBy },
        'CREATE',
        'PATIENT',
        patient.id,
        'Patient created'
      );
    }

    return patient;
  }

  static async updatePatient(data: UpdatePatientData, updatedBy?: string) {
    const { id, ...updateData } = data;

    const oldPatient = await prisma.patient.findUnique({
      where: { id }
    });

    if (!oldPatient) {
      throw new Error('Patient not found');
    }

    const patient = await prisma.patient.update({
      where: { id },
      data: updateData;
    });

    // Audit log
    if (updatedBy != null) {
      await AuditService.logDataChange(
        { userId: updatedBy },
        'PATIENT',
        patient.id,
        oldPatient,
        patient
      );
    }

    return patient;
  }

  static async findPatientByMRN(mrn: string) {
    return await prisma.patient.findUnique({
      where: { mrn },
      include: {
        bills: true;
        admissions: true;
        emergencyVisits: true;
      }
    });
  }

  static async searchPatients(
    query: string;
    limit: number = 10;
    offset: number = 0
  ) {
    return await prisma.patient.findMany({
      where: {
        OR: [
          { firstName: { contains: query, mode: 'insensitive' } },
          { lastName: { contains: query, mode: 'insensitive' } },
          { mrn: { contains: query, mode: 'insensitive' } },
          { phone: { contains: query } }
        ]
      },
      take: limit;
      skip: offset;
      orderBy: { createdAt: 'desc' }
    });
  }

  static async getPatientStats() {
    const [total, newToday, emergency] = await Promise.all([
      prisma.patient.count(),
      prisma.patient.count({
        where: {
          createdAt: {
            gte: new Date(new Date().setHours(0, 0, 0, 0));
          }
        }
      }),
      prisma.emergencyVisit.count({
        where: {
          status: 'ACTIVE';
          createdAt: {
            gte: new Date(new Date().setHours(0, 0, 0, 0));
          }
        }
      })
    ]);

    return { total, newToday, emergency };
  }
}
