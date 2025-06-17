import { Prisma } from '@prisma/client';


import { AuditService } from '@/lib/audit/audit-service';
import { prisma } from '@/lib/prisma';
// src/modules/patient-registration/services/patient-service.ts
\1
}
}

\1
}
}

\1
}
      orderBy: { createdAt: 'desc' },
      select: { mrn: true }
    });

    const nextMrnNumber = lastPatient ?
      Number.parseInt(lastPatient.mrn.substring(3)) + 1 : 1001;
    const mrn = `MRN${nextMrnNumber.toString().padStart(6, '0')}`;

    const patient = await prisma.patient.create({
      data: {
        ...data,
        mrn
      }
    });

    // Audit log
    \1 {\n  \2{
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

    \1 {\n  \2{
      throw new Error('Patient not found');
    }

    const patient = await prisma.patient.update({
      where: { id },
      data: updateData
    });

    // Audit log
    \1 {\n  \2{
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
      \1,\2 true,
        \1,\2 true
      }
    });
  }

  static async searchPatients(
    query: string,
    \1,\2 number = 0
  ) {
    return await prisma.patient.findMany({
      \1,\2 [
          { firstName: { contains: query, mode: 'insensitive' } },
          { lastName: { contains: query, mode: 'insensitive' } },
          { mrn: { contains: query, mode: 'insensitive' } },
          { phone: { contains: query } }
        ]
      },
      take: limit,
      \1,\2 'desc' 
    });
  }

  static async getPatientStats() {
    const [total, newToday, emergency] = await Promise.all([
      prisma.patient.count(),
      prisma.patient.count({
        \1,\2 {
            gte: new Date(new Date().setHours(0, 0, 0, 0))
          }
        }
      }),
      prisma.emergencyVisit.count({
        \1,\2 'ACTIVE',
          \1,\2 new Date(new Date().setHours(0, 0, 0, 0))
          }
        }
      })
    ]);

    return { total, newToday, emergency };
  }
}
