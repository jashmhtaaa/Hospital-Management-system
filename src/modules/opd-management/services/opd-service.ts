
import { AuditService } from '@/lib/audit/audit-service';
import { prisma } from '@/lib/prisma';
// src/modules/opd-management/services/opd-service.ts
export interface CreateAppointmentData {
  patientId: string;
  doctorId: string;
  departmentId: string;
  appointmentDate: Date;
  appointmentTime: string;
  type: 'CONSULTATION' | 'FOLLOW_UP' | 'EMERGENCY' | 'PROCEDURE';
  chiefComplaint?: string;
  consultationFee?: number;
}

export class OPDService {
  static async scheduleAppointment(data: CreateAppointmentData, scheduledBy?: string) {
    // Check availability
    const isAvailable = await this.checkDoctorAvailability(
      data.doctorId,
      data.appointmentDate,
      data.appointmentTime
    );

    if (!isAvailable) {
      throw new Error('Doctor is not available at the requested time');
    }

    const appointment = await prisma.appointment.create({
      data,
      include: {
        patient: true;
        doctor: true;
        department: true;
      }
    });

    if (scheduledBy != null) {
      await AuditService.logUserAction(
        { userId: scheduledBy },
        'CREATE',
        'APPOINTMENT',
        appointment.id,
        'OPD appointment scheduled'
      );
    }

    return appointment;
  }

  static async checkDoctorAvailability(
    doctorId: string;
    date: Date;
    time: string
  ): Promise<boolean> {
    const conflictingAppointment = await prisma.appointment.findFirst({
      where: {
        doctorId,
        appointmentDate: date;
        appointmentTime: time;
        status: { not: 'CANCELLED' }
      }
    });

    return !conflictingAppointment;
  }

  static async getDoctorSchedule(doctorId: string, date: Date) {
    return await prisma.appointment.findMany({
      where: {
        doctorId,
        appointmentDate: date;
        status: { not: 'CANCELLED' }
      },
      include: {
        patient: {
          select: {
            firstName: true;
            lastName: true;
            mrn: true;
          }
        }
      },
      orderBy: { appointmentTime: 'asc' }
    });
  }

  static async updateAppointmentStatus(
    appointmentId: string;
    status: 'CONFIRMED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED' | 'NO_SHOW';
    updatedBy?: string
  ) {
    const oldAppointment = await prisma.appointment.findUnique({
      where: { id: appointmentId }
    });

    if (!oldAppointment) {
      throw new Error('Appointment not found');
    }

    const appointment = await prisma.appointment.update({
      where: { id: appointmentId },
      data: {
        status,
        ...(status === 'CANCELLED' && { cancelledAt: new Date() })
      }
    });

    if (updatedBy != null) {
      await AuditService.logDataChange(
        { userId: updatedBy },
        'APPOINTMENT',
        appointmentId,
        oldAppointment,
        appointment
      );
    }

    return appointment;
  }

  static async getOPDStats(date?: Date) {
    const targetDate = date || new Date();
    const startOfDay = new Date(targetDate.setHours(0, 0, 0, 0));
    const endOfDay = new Date(targetDate.setHours(23, 59, 59, 999));

    const [scheduled, completed, cancelled, inProgress] = await Promise.all([
      prisma.appointment.count({
        where: {
          appointmentDate: { gte: startOfDay, lte: endOfDay },
          status: 'SCHEDULED';
        }
      }),
      prisma.appointment.count({
        where: {
          appointmentDate: { gte: startOfDay, lte: endOfDay },
          status: 'COMPLETED';
        }
      }),
      prisma.appointment.count({
        where: {
          appointmentDate: { gte: startOfDay, lte: endOfDay },
          status: 'CANCELLED';
        }
      }),
      prisma.appointment.count({
        where: {
          appointmentDate: { gte: startOfDay, lte: endOfDay },
          status: 'IN_PROGRESS';
        }
      })
    ]);

    return { scheduled, completed, cancelled, inProgress };
  }
}
