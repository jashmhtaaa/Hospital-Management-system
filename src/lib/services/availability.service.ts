import { prisma } from '@/lib/prisma';

export interface TimeSlot {
  start: Date;
  end: Date;
}

export interface AvailabilityCheck {
  available: boolean;
  conflicts?: string[];
  suggestedSlots?: TimeSlot[];
}

/**
 * Check doctor availability for appointment booking
 */
export async function checkDoctorAvailability(
  doctorId: string,
  requestedSlot: TimeSlot,
  appointmentId?: string // For updates, exclude current appointment
): Promise<AvailabilityCheck> {
  try {
    // 1. Check existing appointments
    const conflictingAppointments = await prisma.appointment.findMany({
      where: {
        doctorId,
        id: appointmentId ? { not: appointmentId } : undefined,
        status: { in: ['SCHEDULED', 'IN_PROGRESS'] },
        OR: [
          {
            // Overlapping start time
            scheduledDateTime: {
              gte: requestedSlot.start,
              lt: requestedSlot.end
            }
          },
          {
            // Appointment that starts before and ends after requested start
            AND: [
              { scheduledDateTime: { lte: requestedSlot.start } },
              { 
                estimatedDuration: {
                  // Calculate end time overlap
                  gte: Math.floor((requestedSlot.start.getTime() - new Date().getTime()) / (1000 * 60))
                }
              }
            ]
          }
        ]
      },
      select: {
        id: true,
        scheduledDateTime: true,
        estimatedDuration: true,
        patient: { select: { firstName: true, lastName: true } }
      }
    });

    // 2. Check doctor's working hours
    const dayOfWeek = requestedSlot.start.getDay();
    const doctorSchedule = await prisma.doctorSchedule.findFirst({
      where: {
        doctorId,
        dayOfWeek,
        isActive: true
      }
    });

    const conflicts: string[] = [];

    // Check for appointment conflicts
    if (conflictingAppointments.length > 0) {
      conflictingAppointments.forEach(apt => {
        conflicts.push(`Conflicting appointment with ${apt.patient.firstName} ${apt.patient.lastName} at ${apt.scheduledDateTime.toLocaleTimeString()}`);
      });
    }

    // Check working hours
    if (doctorSchedule) {
      const requestedTime = requestedSlot.start.getHours() * 60 + requestedSlot.start.getMinutes();
      const startTime = parseInt(doctorSchedule.startTime.replace(':', '')) / 100 * 60;
      const endTime = parseInt(doctorSchedule.endTime.replace(':', '')) / 100 * 60;

      if (requestedTime < startTime || requestedTime >= endTime) {
        conflicts.push(`Requested time is outside doctor's working hours (${doctorSchedule.startTime} - ${doctorSchedule.endTime})`);
      }
    }

    // 3. Generate suggested slots if conflicts exist
    let suggestedSlots: TimeSlot[] = [];
    if (conflicts.length > 0) {
      suggestedSlots = await generateAlternativeSlots(doctorId, requestedSlot.start);
    }

    return {
      available: conflicts.length === 0,
      conflicts: conflicts.length > 0 ? conflicts : undefined,
      suggestedSlots: suggestedSlots.length > 0 ? suggestedSlots : undefined
    };

  } catch (error) {
    console.error('Error checking doctor availability:', error);
    throw new Error('Failed to check doctor availability');
  }
}

/**
 * Generate alternative available time slots
 */
async function generateAlternativeSlots(
  doctorId: string,
  preferredDate: Date
): Promise<TimeSlot[]> {
  const alternatives: TimeSlot[] = [];
  const dateToCheck = new Date(preferredDate);
  
  // Check next 7 days for available slots
  for (let i = 0; i < 7; i++) {
    const daySchedule = await prisma.doctorSchedule.findFirst({
      where: {
        doctorId,
        dayOfWeek: dateToCheck.getDay(),
        isActive: true
      }
    });

    if (daySchedule) {
      // Generate 30-minute slots during working hours
      const [startHour, startMin] = daySchedule.startTime.split(':').map(Number);
      const [endHour, endMin] = daySchedule.endTime.split(':').map(Number);
      
      for (let hour = startHour; hour < endHour; hour++) {
        for (let min = 0; min < 60; min += 30) {
          if (hour === endHour - 1 && min >= endMin) break;
          
          const slotStart = new Date(dateToCheck);
          slotStart.setHours(hour, min, 0, 0);
          
          const slotEnd = new Date(slotStart);
          slotEnd.setMinutes(slotEnd.getMinutes() + 30);
          
          // Check if this slot is available
          const availabilityCheck = await checkDoctorAvailability(doctorId, {
            start: slotStart,
            end: slotEnd
          });
          
          if (availabilityCheck.available) {
            alternatives.push({ start: slotStart, end: slotEnd });
            
            // Return first 5 alternatives
            if (alternatives.length >= 5) return alternatives;
          }
        }
      }
    }
    
    // Move to next day
    dateToCheck.setDate(dateToCheck.getDate() + 1);
  }
  
  return alternatives;
}

/**
 * Block time slot for doctor (for breaks, meetings, etc.)
 */
export async function blockTimeSlot(
  doctorId: string,
  timeSlot: TimeSlot,
  reason: string,
  userId: string
): Promise<void> {
  try {
    await prisma.doctorBlockedTime.create({
      data: {
        doctorId,
        startTime: timeSlot.start,
        endTime: timeSlot.end,
        reason,
        blockedBy: userId,
        isActive: true
      }
    });
  } catch (error) {
    console.error('Error blocking time slot:', error);
    throw new Error('Failed to block time slot');
  }
}

/**
 * Get doctor's schedule for a specific date range
 */
export async function getDoctorSchedule(
  doctorId: string,
  startDate: Date,
  endDate: Date
): Promise<any[]> {
  try {
    const appointments = await prisma.appointment.findMany({
      where: {
        doctorId,
        scheduledDateTime: {
          gte: startDate,
          lte: endDate
        },
        status: { in: ['SCHEDULED', 'IN_PROGRESS', 'COMPLETED'] }
      },
      include: {
        patient: {
          select: {
            firstName: true,
            lastName: true,
            contactNumber: true
          }
        }
      },
      orderBy: {
        scheduledDateTime: 'asc'
      }
    });

    const blockedTimes = await prisma.doctorBlockedTime.findMany({
      where: {
        doctorId,
        startTime: { gte: startDate },
        endTime: { lte: endDate },
        isActive: true
      }
    });

    return [
      ...appointments.map(apt => ({
        type: 'appointment',
        id: apt.id,
        start: apt.scheduledDateTime,
        duration: apt.estimatedDuration,
        patient: `${apt.patient.firstName} ${apt.patient.lastName}`,
        status: apt.status
      })),
      ...blockedTimes.map(block => ({
        type: 'blocked',
        id: block.id,
        start: block.startTime,
        end: block.endTime,
        reason: block.reason
      }))
    ];
  } catch (error) {
    console.error('Error getting doctor schedule:', error);
    throw new Error('Failed to get doctor schedule');
  }
}
