// apps/hms-web/src/app/api/opd-management/appointments/route.ts
import { NextRequest } from 'next/server';
import { ApiResponseBuilder, PaginationBuilder } from '@/utils/api-response';
import { validateRequest, createAppointmentSchema } from '@/lib/validation/schemas';
import { prisma } from '@/lib/prisma';
import { AuditService } from '@/lib/audit/audit-service';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = validateRequest(createAppointmentSchema)(body);
    
    // Check for scheduling conflicts
    const conflictingAppointment = await prisma.appointment.findFirst({
      where: {
        doctorId: validatedData.doctorId,
        appointmentDate: validatedData.appointmentDate,
        appointmentTime: validatedData.appointmentTime,
        status: { not: 'CANCELLED' }
      }
    });
    
    if (conflictingAppointment) {
      return ApiResponseBuilder.error('Doctor is not available at this time', 409);
    }
    
    const appointment = await prisma.appointment.create({
      data: validatedData,
      include: {
        patient: true,
        doctor: {
          select: {
            firstName: true,
            lastName: true,
            specialization: true
          }
        },
        department: true
      }
    });
    
    await AuditService.logUserAction(
      {
        userId: request.headers.get('x-user-id') || undefined,
        ipAddress: request.ip
      },
      'CREATE',
      'APPOINTMENT',
      appointment.id,
      'OPD appointment scheduled'
    );
    
    return ApiResponseBuilder.success(appointment, 'Appointment scheduled successfully');
    
  } catch (error) {
    return ApiResponseBuilder.internalError(error.message);
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const doctorId = searchParams.get('doctorId');
    const date = searchParams.get('date');
    const status = searchParams.get('status');
    
    const { skip, take, orderBy } = PaginationBuilder.buildPrismaArgs({ page, limit });
    
    const where: any = {};
    if (doctorId) where.doctorId = doctorId;
    if (date) where.appointmentDate = new Date(date);
    if (status) where.status = status;
    
    const [appointments, total] = await Promise.all([
      prisma.appointment.findMany({
        where,
        skip,
        take,
        orderBy,
        include: {
          patient: {
            select: {
              firstName: true,
              lastName: true,
              mrn: true,
              phone: true
            }
          },
          doctor: {
            select: {
              firstName: true,
              lastName: true,
              specialization: true
            }
          },
          department: {
            select: {
              name: true
            }
          }
        }
      }),
      prisma.appointment.count({ where })
    ]);
    
    const meta = PaginationBuilder.buildMeta(total, page, limit);
    
    return ApiResponseBuilder.success(appointments, 'Appointments retrieved successfully', meta);
    
  } catch (error) {
    return ApiResponseBuilder.internalError(error.message);
  }
}
