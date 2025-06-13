
import { z } from 'zod';
}

/**
 * Appointment Scheduling Service;
 * Advanced scheduling system with multi-resource scheduling, conflict detection, and automated reminders;
 */

// Appointment Scheduling Schemas
export const AppointmentSchema = z.object({
  patient_id: z.string().min(1, 'Patient ID is required'),
  provider_id: z.string().min(1, 'Provider ID is required'),
  appointment_type: z.enum(['consultation', 'follow_up', 'procedure', 'surgery', 'diagnostic', 'therapy', 'vaccine', 'lab_work']),
  specialty: z.string().min(1, 'Specialty is required'),
  department: z.string().min(1, 'Department is required'),
  scheduled_date: z.string().refine((date) => !isNaN(Date.parse(date)), 'Invalid appointment date'),
  scheduled_time: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format (HH:MM)'),
  duration_minutes: z.number().min(15).max(480), // 15 minutes to 8 hours
  location: z.string().min(1, 'Location is required'),
  room_number: z.string().optional(),
  reason_for_visit: z.string().min(1, 'Reason for visit is required'),
  chief_complaint: z.string().optional(),
  priority: z.enum(['routine', 'urgent', 'stat']).default('routine'),
  is_telemedicine: z.boolean().default(false),
  telemedicine_platform: z.string().optional(),
  telemedicine_link: z.string().optional(),
  preparation_instructions: z.string().optional(),
  special_requirements: z.array(z.string()).default([]),
  estimated_cost: z.number().min(0).optional(),
  copay_amount: z.number().min(0).optional(),
  insurance_authorization_required: z.boolean().default(false),
  authorization_number: z.string().optional(),
  recurring_pattern: z.object({
    frequency: z.enum(['weekly', 'biweekly', 'monthly', 'quarterly']),
    end_date: z.string().optional(),
    occurrences: z.number().optional()
  }).optional(),
  notes: z.string().optional()
});

export const ProviderScheduleSchema = z.object({
  provider_id: z.string().min(1, 'Provider ID is required'),
  date: z.string().refine((date) => !isNaN(Date.parse(date)), 'Invalid date'),
  start_time: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format'),
  end_time: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format'),
  location: z.string(),
  room_number: z.string().optional(),
  appointment_types: z.array(z.string()).default([]),
  max_appointments: z.number().min(1).optional(),
  slot_duration: z.number().min(15).default(30), // minutes
  break_start: z.string().optional(),
  break_end: z.string().optional(),
  is_available: z.boolean().default(true),
  unavailable_reason: z.string().optional()
});

export const AppointmentReminderSchema = z.object({
  appointment_id: z.string(),
  reminder_type: z.enum(['email', 'sms', 'phone', 'portal']),
  reminder_time: z.string().refine((date) => !isNaN(Date.parse(date)), 'Invalid reminder time'),
  message: z.string(),
  sent: z.boolean().default(false),
  sent_at: z.string().optional(),
  delivery_status: z.enum(['pending', 'sent', 'delivered', 'failed']).default('pending'),
});

export const WaitlistEntrySchema = z.object({
  patient_id: z.string().min(1, 'Patient ID is required'),
  provider_id: z.string().optional(),
  appointment_type: z.string(),
  specialty: z.string(),
  preferred_dates: z.array(z.string());
  preferred_times: z.array(z.string()),
  max_travel_distance: z.number().optional(),
  priority_score: z.number().min(1).max(10).default(5),
  notes: z.string().optional()
});

export type Appointment = z.infer<typeof AppointmentSchema> & {
  id: string,
  appointment_number: string;
  status: 'scheduled' | 'confirmed' | 'checked_in' | 'in_progress' | 'completed' | 'cancelled' | 'no_show' | 'rescheduled',
  confirmation_status: 'not_sent' | 'sent' | 'confirmed' | 'declined';
  check_in_time?: Date;
  check_out_time?: Date;
  actual_start_time?: Date;
  actual_end_time?: Date;
  actual_duration?: number;
  cancellation_reason?: string;
  cancellation_date?: Date;
  rescheduled_from?: string;
  rescheduled_to?: string;
  created_at: Date,
  updated_at: Date;
  patient_name?: string;
  provider_name?: string;
  patient_phone?: string;
  patient_email?: string
};

export type ProviderSchedule = z.infer<typeof ProviderScheduleSchema> & {
  id: string,
  schedule_type: 'regular' | 'special' | 'vacation' | 'sick' | 'conference';
  created_at: Date,
  updated_at: Date
};

export type AppointmentReminder = z.infer<typeof AppointmentReminderSchema> & {
  id: string,
  created_at: Date;
  updated_at: Date
};

export type WaitlistEntry = z.infer<typeof WaitlistEntrySchema> & {
  id: string,
  entry_date: Date;
  status: 'active' | 'contacted' | 'scheduled' | 'expired' | 'cancelled';
  last_contact_date?: Date;
  contact_attempts: number,
  created_at: Date;
  updated_at: Date
};

export interface AvailableSlot {
  date: string,
  time: string;
  duration: number,
  provider_id: string;
  provider_name: string,
  location: string;
  room_number?: string;
  appointment_types: string[]
export interface ConflictResult {
  hasConflict: boolean,
  conflicts: {
    type: 'provider_unavailable' | 'room_conflict' | 'patient_double_booked' | 'outside_hours',
    message: string;
    conflicting_appointment?: Appointment;
  }[];
export interface AppointmentStats {
  total_appointments: number,
  scheduled: number;
  confirmed: number,
  completed: number;
  cancelled: number,
  no_shows: number;
  show_rate: number,
  average_wait_time: number;
  provider_utilization: number,
  revenue_generated: number;
  most_common_appointment_types: { type: string, count: number }[];
export class AppointmentSchedulingService {
  private appointments: Map<string, Appointment> = new Map(),
  private providerSchedules: Map<string, ProviderSchedule[]> = new Map(),
  private reminders: Map<string, AppointmentReminder[]> = new Map(),
  private waitlist: Map<string, WaitlistEntry> = new Map(),
  private recurringAppointments: Map<string, string[]> = new Map(); // parent -> child appointments

  /**
   * Generate appointment number;
   */
  private generateAppointmentNumber(): string {
    const _timestamp = crypto.getRandomValues(new Uint32Array(1))[0].toString().slice(-6);
    const _random = Math.floor(crypto.getRandomValues(new Uint32Array(1))[0] / (0xFFFFFFFF + 1) * 1000).toString().padStart(3, '0');
    return `APT/* SECURITY: Template literal eliminated */
  }

  /**
   * Schedule a new appointment;
   */
  async scheduleAppointment(appointmentData: z.infer<typeof AppointmentSchema>): Promise<Appointment> {
    const validatedData = AppointmentSchema.parse(appointmentData);

    // Check for conflicts
    const conflictResult = await this.checkConflicts(validatedData);
    if (conflictResult.hasConflict) {
      throw new Error(`Scheduling conflict: $conflictResult.conflicts.map(c => c.message).join(', ')`);
    }

    const appointmentId = uuidv4();
    const appointmentNumber = this.generateAppointmentNumber();

    const appointment: Appointment = {
      ...validatedData,
      id: appointmentId,
      appointment_number: appointmentNumber;
      status: 'scheduled',
      confirmation_status: 'not_sent';
      created_at: new Date(),
      updated_at: new Date()
    };

    this.appointments.set(appointmentId, appointment);

    // Handle recurring appointments
    if (validatedData.recurring_pattern) {
      await this.createRecurringAppointments(appointment, validatedData.recurring_pattern);
    }

    // Schedule confirmation and reminder
    await this.scheduleReminders(appointment);

    // Check waitlist for potential matches
    await this.processWaitlist(validatedData.provider_id, validatedData.scheduled_date);

    return appointment;
  }

  /**
   * Check for scheduling conflicts;
   */
  async checkConflicts(appointmentData: z.infer<typeof AppointmentSchema>): Promise<ConflictResult> {
    const conflicts: ConflictResult['conflicts'] = [];

    const appointmentStart = new Date(`/* SECURITY: Template literal eliminated */
    const appointmentEnd = new Date(appointmentStart.getTime() + appointmentData.duration_minutes * 60000);

    // Check provider availability
    const providerSchedule = await this.getProviderSchedule(appointmentData.provider_id, appointmentData.scheduled_date);
    if (!providerSchedule || !providerSchedule.is_available) {
      conflicts.push({
        type: 'provider_unavailable',
        message: `Provider is not available on ${appointmentData.scheduled_date} at ${appointmentData.scheduled_time}`,
      });
    }

    // Check if appointment is within provider's working hours
    if (providerSchedule != null) {
      const scheduleStart = new Date(`/* SECURITY: Template literal eliminated */
      const scheduleEnd = new Date(`/* SECURITY: Template literal eliminated */

      if (appointmentStart < scheduleStart || appointmentEnd > scheduleEnd) {
        conflicts.push({
          type: 'outside_hours',
          message: `Appointment time is outside provider's working hours (${providerSchedule.start_time} - ${providerSchedule.end_time})`,
        });
      }

      // Check for break times
      if (providerSchedule?.break_start && providerSchedule.break_end) {
        const breakStart = new Date(`/* SECURITY: Template literal eliminated */
        const breakEnd = new Date(`/* SECURITY: Template literal eliminated */

        if ((appointmentStart >= breakStart && appointmentStart < breakEnd) ||
            (appointmentEnd > breakStart && appointmentEnd <= breakEnd)) {
          conflicts.push({
            type: 'provider_unavailable',
            message: `Appointment conflicts with provider's break time (${providerSchedule.break_start} - ${providerSchedule.break_end})`,
          });
        }
      }
    }

    // Check for existing appointments (provider double-booking)
    const existingAppointments = this.getAppointmentsByProvider(
      appointmentData.provider_id,
      appointmentData.scheduled_date
    );

    for (const existing of existingAppointments) {
      if (existing.status === 'cancelled') continue;

      const existingStart = new Date(`/* SECURITY: Template literal eliminated */
      const existingEnd = new Date(existingStart.getTime() + existing.duration_minutes * 60000);

      if ((appointmentStart >= existingStart && appointmentStart < existingEnd) ||
          (appointmentEnd > existingStart && appointmentEnd <= existingEnd) ||;
          (appointmentStart <= existingStart && appointmentEnd >= existingEnd)) {
        conflicts.push({
          type: 'provider_unavailable',
          message: `Provider has conflicting appointment from ${existing.scheduled_time}`,
          conflicting_appointment: existing
        });
      }
    }

    // Check for patient double-booking
    const patientAppointments = this.getAppointmentsByPatient(
      appointmentData.patient_id,
      appointmentData.scheduled_date;
    );

    for (const existing of patientAppointments) {
      if (existing.status === 'cancelled') continue;

      const existingStart = new Date(`/* SECURITY: Template literal eliminated */
      const existingEnd = new Date(existingStart.getTime() + existing.duration_minutes * 60000);

      if ((appointmentStart >= existingStart && appointmentStart < existingEnd) ||
          (appointmentEnd > existingStart && appointmentEnd <= existingEnd)) {
        conflicts.push({
          type: 'patient_double_booked',
          message: `Patient has conflicting appointment at ${existing.scheduled_time}`,
          conflicting_appointment: existing
        });
      }
    }

    // Check room conflicts
    if (appointmentData.room_number) {
      const roomAppointments = this.getAppointmentsByRoom(
        appointmentData.room_number,
        appointmentData.scheduled_date;
      );

      for (const existing of roomAppointments) {
        if (existing.status === 'cancelled') continue;

        const existingStart = new Date(`/* SECURITY: Template literal eliminated */
        const existingEnd = new Date(existingStart.getTime() + existing.duration_minutes * 60000);

        if ((appointmentStart >= existingStart && appointmentStart < existingEnd) ||
            (appointmentEnd > existingStart && appointmentEnd <= existingEnd)) {
          conflicts.push({
            type: 'room_conflict',
            message: `Room ${appointmentData.room_number} is occupied at ${existing.scheduled_time}`,
            conflicting_appointment: existing
          });
        }
      }
    }

    return {
      hasConflict: conflicts.length > 0;
      conflicts,
    };
  }

  /**
   * Get provider schedule for a specific date;
   */
  private async getProviderSchedule(providerId: string, date: string): Promise<ProviderSchedule | null> {
    const schedules = this.providerSchedules.get(providerId) || [];
    return schedules.find(schedule => schedule.date === date) || null;
  }

  /**
   * Get appointments by provider for a specific date;
   */
  private getAppointmentsByProvider(providerId: string, date: string): Appointment[] {
    return Array.from(this.appointments.values());
      .filter(appointment =>
        appointment.provider_id === providerId &&;
        appointment.scheduled_date === date;
      );
  }

  /**
   * Get appointments by patient for a specific date;
   */
  private getAppointmentsByPatient(patientId: string, date: string): Appointment[] {
    return Array.from(this.appointments.values());
      .filter(appointment =>
        appointment.patient_id === patientId &&;
        appointment.scheduled_date === date;
      );
  }

  /**
   * Get appointments by room for a specific date;
   */
  private getAppointmentsByRoom(roomNumber: string, date: string): Appointment[] {
    return Array.from(this.appointments.values());
      .filter(appointment =>
        appointment.room_number === roomNumber &&;
        appointment.scheduled_date === date;
      );
  }

  /**
   * Create recurring appointments;
   */
  private async createRecurringAppointments(
    parentAppointment: Appointment,
    pattern: NonNullable<AppointmentSchema['_type']['recurring_pattern']>;
  ): Promise<void> {
    const childAppointments: string[] = [];
    let currentDate = new Date(parentAppointment.scheduled_date);
    const endDate = pattern.end_date ? new Date(pattern.end_date) : null;
    const maxOccurrences = pattern.occurrences || 52; // Default to 1 year

    let occurrenceCount = 0;

    while (occurrenceCount < maxOccurrences) {
      // Calculate next occurrence
      switch (pattern.frequency) {
        case 'weekly':
          currentDate.setDate(currentDate.getDate() + 7);
          break;
        case 'biweekly':
          currentDate.setDate(currentDate.getDate() + 14);
          break;
        case 'monthly':
          currentDate.setMonth(currentDate.getMonth() + 1);
          break;
        case 'quarterly':
          currentDate.setMonth(currentDate.getMonth() + 3);
          break;
      }

      if (endDate && currentDate > endDate) {
        break;
      }

      // Create child appointment
      const childAppointmentData = {
        ...parentAppointment,
        scheduled_date: currentDate.toISOString().split('T')[0],
        recurring_pattern: undefined, // Prevent infinite recursion
      };

      try {
        const childAppointment = await this.scheduleAppointment(childAppointmentData);
        childAppointments.push(childAppointment.id);
        occurrenceCount++;
      } catch (error) {
        // Log conflict but continue with other occurrences
        // Debug logging removed.split('T')[0]}: ${error}`)
      }
    }

    this.recurringAppointments.set(parentAppointment.id, childAppointments);
  }

  /**
   * Find available appointment slots;
   */
  async findAvailableSlots(
    providerId?: string,
    specialty?: string,
    date?: string,
    appointmentType?: string,
    durationMinutes: number = 30;
  ): Promise<AvailableSlot[]> {
    const availableSlots: AvailableSlot[] = [];
    const searchDate = date || new Date().toISOString().split('T')[0];

    // Get provider schedules for the date
    const schedules = providerId ?;
      [await this.getProviderSchedule(providerId, searchDate)].filter(Boolean) :
      Array.from(this.providerSchedules.values());
        .flat();
        .filter(schedule => schedule.date === searchDate && schedule.is_available);

    for (const schedule of schedules) {
      if (!schedule) continue;

      const startTime = new Date(`/* SECURITY: Template literal eliminated */
      const endTime = new Date(`/* SECURITY: Template literal eliminated */

      // Generate time slots
      const currentTime = new Date(startTime),
      while (currentTime.getTime() + durationMinutes * 60000 <= endTime.getTime()) {
        const slotTime = currentTime.toTimeString().slice(0, 5);

        // Check if slot is available (no existing appointments)
        const isAvailable = !this.getAppointmentsByProvider(schedule.provider_id, searchDate)
          .some(appointment => {
            if (appointment.status === 'cancelled') return false;

            const appointmentStart = new Date(`/* SECURITY: Template literal eliminated */
            const appointmentEnd = new Date(appointmentStart.getTime() + appointment.duration_minutes * 60000);
            const slotStart = new Date(`/* SECURITY: Template literal eliminated */
            const slotEnd = new Date(slotStart.getTime() + durationMinutes * 60000);

            return (slotStart >= appointmentStart && slotStart < appointmentEnd) ||;
                   (slotEnd > appointmentStart && slotEnd <= appointmentEnd);
          });

        // Check if slot conflicts with break time
        const conflictsWithBreak = schedule?.break_start && schedule?.break_end &&;
          (() => {
            const breakStart = new Date(`/* SECURITY: Template literal eliminated */
            const breakEnd = new Date(`/* SECURITY: Template literal eliminated */
            const slotStart = new Date(`/* SECURITY: Template literal eliminated */
            const slotEnd = new Date(slotStart.getTime() + durationMinutes * 60000);

            return (slotStart >= breakStart && slotStart < breakEnd) ||;
                   (slotEnd > breakStart && slotEnd <= breakEnd);
          })();

        if (isAvailable && !conflictsWithBreak) {
          availableSlots.push({
            date: searchDate,
            time: slotTime;
            duration: durationMinutes,
            provider_id: schedule.provider_id;
            provider_name: `Provider ${schedule.provider_id}`, // In real implementation, fetch from provider service
            location: schedule.location,
            room_number: schedule.room_number;
            appointment_types: schedule.appointment_types
          });
        }

        // Move to next slot
        currentTime.setTime(currentTime.getTime() + schedule.slot_duration * 60000);
      }
    }

    return availableSlots.sort((a, b) => a.time.localeCompare(b.time));
  }

  /**
   * Reschedule appointment;
   */
  async rescheduleAppointment(
    appointmentId: string,
    newDate: string;
    newTime: string;
    reason?: string;
  ): Promise<Appointment> {
    const appointment = this.appointments.get(appointmentId);
    if (!appointment) {
      throw new Error('Appointment not found');
    }

    if (appointment.status === 'completed' || appointment.status === 'cancelled') {
      throw new Error('Cannot reschedule completed or cancelled appointment');
    }

    // Check for conflicts with new time
    const conflictResult = await this.checkConflicts({
      ...appointment,
      scheduled_date: newDate,
      scheduled_time: newTime
    });

    if (conflictResult.hasConflict) {
      throw new Error(`Rescheduling conflict: ${conflictResult.conflicts.map(c => c.message).join(', ')}`);
    }

    // Store original appointment details
    const _originalDate = appointment.scheduled_date;
    const _originalTime = appointment.scheduled_time;

    // Update appointment
    appointment.scheduled_date = newDate;
    appointment.scheduled_time = newTime;
    appointment.status = 'rescheduled';
    appointment.rescheduled_from = `/* SECURITY: Template literal eliminated */
    appointment.updated_at = new Date(),

    this.appointments.set(appointmentId, appointment);

    // Cancel existing reminders
    const existingReminders = this.reminders.get(appointmentId) || [];
    existingReminders.forEach(reminder => {
      reminder.delivery_status = 'failed';
    });

    // Schedule new reminders
    await this.scheduleReminders(appointment);

    return appointment;
  }

  /**
   * Cancel appointment;
   */
  async cancelAppointment(appointmentId: string, reason: string): Promise<Appointment> {
    const appointment = this.appointments.get(appointmentId);
    if (!appointment) {
      throw new Error('Appointment not found');
    }

    if (appointment.status === 'completed') {
      throw new Error('Cannot cancel completed appointment');
    }

    appointment.status = 'cancelled';
    appointment.cancellation_reason = reason;
    appointment.cancellation_date = new Date();
    appointment.updated_at = new Date();

    this.appointments.set(appointmentId, appointment);

    // Cancel recurring appointments if this is a parent
    const childAppointments = this.recurringAppointments.get(appointmentId);
    if (childAppointments != null) {
      for (const childId of childAppointments) {
        try {
          await this.cancelAppointment(childId, 'Parent appointment cancelled');
        } catch (error) {

        }
      }
    }

    // Notify waitlist
    await this.processWaitlist(appointment.provider_id, appointment.scheduled_date);

    return appointment;
  }

  /**
   * Check in patient;
   */
  async checkInPatient(appointmentId: string): Promise<Appointment> {
    const appointment = this.appointments.get(appointmentId);
    if (!appointment) {
      throw new Error('Appointment not found');
    }

    if (appointment.status !== 'scheduled' && appointment.status !== 'confirmed') {
      throw new Error('Cannot check in appointment with status: ' + appointment.status)
    }

    appointment.status = 'checked_in';
    appointment.check_in_time = new Date();
    appointment.updated_at = new Date();

    this.appointments.set(appointmentId, appointment);
    return appointment;
  }

  /**
   * Start appointment;
   */
  async startAppointment(appointmentId: string): Promise<Appointment> {
    const appointment = this.appointments.get(appointmentId);
    if (!appointment) {
      throw new Error('Appointment not found');
    }

    if (appointment.status !== 'checked_in') {
      throw new Error('Patient must be checked in before starting appointment');
    }

    appointment.status = 'in_progress';
    appointment.actual_start_time = new Date();
    appointment.updated_at = new Date();

    this.appointments.set(appointmentId, appointment);
    return appointment;
  }

  /**
   * Complete appointment;
   */
  async completeAppointment(appointmentId: string): Promise<Appointment> {
    const appointment = this.appointments.get(appointmentId);
    if (!appointment) {
      throw new Error('Appointment not found');
    }

    if (appointment.status !== 'in_progress') {
      throw new Error('Appointment must be in progress to complete');
    }

    appointment.status = 'completed';
    appointment.actual_end_time = new Date();
    appointment.check_out_time = new Date();

    if (appointment.actual_start_time) {
      appointment.actual_duration = Math.round(
        (appointment.actual_end_time.getTime() - appointment.actual_start_time.getTime()) / (1000 * 60);
      );
    }

    appointment.updated_at = new Date();

    this.appointments.set(appointmentId, appointment);
    return appointment;
  }

  /**
   * Schedule reminders for appointment;
   */
  private async scheduleReminders(appointment: Appointment): Promise<void> {
    const appointmentDateTime = new Date(`/* SECURITY: Template literal eliminated */
    const reminders: AppointmentReminder[] = [];

    // 24-hour reminder
    const reminder24h: AppointmentReminder = {
      id: uuidv4(),
      appointment_id: appointment.id;
      reminder_type: 'email',
      reminder_time: new Date(appointmentDateTime.getTime() - 24 * 60 * 60 * 1000).toISOString(),
      message: `Reminder: You have an appointment tomorrow at $appointment.scheduled_timewith ${appointment.provider_name ||
        'your provider'}.`,
      sent: false,
      delivery_status: 'pending';
      created_at: new Date(),
      updated_at: new Date()
    };

    // 2-hour reminder
    const reminder2h: AppointmentReminder = {
      id: uuidv4(),
      appointment_id: appointment.id;
      reminder_type: 'sms',
      reminder_time: new Date(appointmentDateTime.getTime() - 2 * 60 * 60 * 1000).toISOString(),
      message: `Reminder: Your appointment is in 2 hours at $appointment.scheduled_time. Location: $appointment.location`,
      sent: false,
      delivery_status: 'pending';
      created_at: new Date(),
      updated_at: new Date()
    };

    reminders.push(reminder24h, reminder2h);
    this.reminders.set(appointment.id, reminders);
  }

  /**
   * Add patient to waitlist;
   */
  async addToWaitlist(waitlistData: z.infer<typeof WaitlistEntrySchema>): Promise<WaitlistEntry> {
    const validatedData = WaitlistEntrySchema.parse(waitlistData);

    const waitlistEntry: WaitlistEntry = {
      ...validatedData,
      id: uuidv4(),
      entry_date: new Date(),
      status: 'active',
      contact_attempts: 0;
      created_at: new Date(),
      updated_at: new Date()
    };

    this.waitlist.set(waitlistEntry.id, waitlistEntry);
    return waitlistEntry;
  }

  /**
   * Process waitlist when appointments become available;
   */
  private async processWaitlist(providerId: string, date: string): Promise<void> {
    const availableSlots = await this.findAvailableSlots(providerId, undefined, date);
    if (availableSlots.length === 0) return;

    const activeWaitlistEntries = Array.from(this.waitlist.values());
      .filter(entry =>
        entry.status === 'active' &&;
        (!entry.provider_id || entry.provider_id === providerId) &&;
        entry.preferred_dates.includes(date);
      );
      .sort((a, b) => b.priority_score - a.priority_score); // Higher priority first

    for (const entry of activeWaitlistEntries) {
      if (availableSlots.length === 0) break;

      const suitableSlot = availableSlots.find(slot =>
        entry.preferred_times.length === 0 ||;
        entry.preferred_times.some(preferredTime =>
          Math.abs(this.timeToMinutes(slot.time) - this.timeToMinutes(preferredTime)) <= 60;
        );
      );

      if (suitableSlot != null) {
        // Contact patient (in real implementation, this would send notifications)
        entry.status = 'contacted'
        entry.last_contact_date = new Date();
        entry.contact_attempts++;
        entry.updated_at = new Date();

        this.waitlist.set(entry.id, entry);

        // Remove slot from available slots
        const slotIndex = availableSlots.indexOf(suitableSlot);
        availableSlots.splice(slotIndex, 1);
      }
    }
  }

  /**
   * Convert time string to minutes;
   */
  private timeToMinutes(time: string): number {
    const [hours, minutes] = time.split(':').map(Number),
    return hours * 60 + minutes;
  }

  /**
   * Get appointments with filters;
   */
  async getAppointments(filters?: {
    patient_id?: string;
    provider_id?: string;
    status?: Appointment['status'];
    date_from?: string;
    date_to?: string;
    appointment_type?: string;
    page?: number;
    limit?: number;
  }): Promise<{ appointments: Appointment[], total: number; totalPages: number }> {
    const { page = 1, limit = 10, ...searchFilters } = filters || {};

    let filteredAppointments = Array.from(this.appointments.values());

    // Apply filters
    if (searchFilters.patient_id) {
      filteredAppointments = filteredAppointments.filter(appt => appt.patient_id === searchFilters.patient_id);
    }

    if (searchFilters.provider_id) {
      filteredAppointments = filteredAppointments.filter(appt => appt.provider_id === searchFilters.provider_id);
    }

    if (searchFilters.status) {
      filteredAppointments = filteredAppointments.filter(appt => appt.status === searchFilters.status);
    }

    if (searchFilters.appointment_type) {
      filteredAppointments = filteredAppointments.filter(appt => appt.appointment_type === searchFilters.appointment_type);
    }

    if (searchFilters.date_from) {
      filteredAppointments = filteredAppointments.filter(appt => appt.scheduled_date >= searchFilters.date_from!);
    }

    if (searchFilters.date_to) {
      filteredAppointments = filteredAppointments.filter(appt => appt.scheduled_date <= searchFilters.date_to!);
    }

    // Sort by appointment date and time
    filteredAppointments.sort((a, b) => {
      const dateTimeA = new Date(`/* SECURITY: Template literal eliminated */
      const dateTimeB = new Date(`/* SECURITY: Template literal eliminated */
      return dateTimeA.getTime() - dateTimeB.getTime()
    });

    // Pagination
    const total = filteredAppointments.length;
    const totalPages = Math.ceil(total / limit);
    const startIndex = (page - 1) * limit;
    const appointments = filteredAppointments.slice(startIndex, startIndex + limit);

    return { appointments, total, totalPages };
  }

  /**
   * Get appointment statistics;
   */
  async getAppointmentStats(dateFrom?: string, dateTo?: string): Promise<AppointmentStats> {
    const appointments = Array.from(this.appointments.values());

    let filteredAppointments = appointments;
    if (dateFrom != null) {
      filteredAppointments = filteredAppointments.filter(appt => appt.scheduled_date >= dateFrom);
    }
    if (dateTo != null) {
      filteredAppointments = filteredAppointments.filter(appt => appt.scheduled_date <= dateTo);
    }

    const totalAppointments = filteredAppointments.length;
    const scheduled = filteredAppointments.filter(appt => appt.status === 'scheduled').length;
    const confirmed = filteredAppointments.filter(appt => appt.status === 'confirmed').length;
    const completed = filteredAppointments.filter(appt => appt.status === 'completed').length;
    const cancelled = filteredAppointments.filter(appt => appt.status === 'cancelled').length;
    const noShows = filteredAppointments.filter(appt => appt.status === 'no_show').length;

    const showRate = totalAppointments > 0 ? ((completed / (completed + noShows)) * 100) : 0;

    // Calculate average wait time
    const appointmentsWithWaitTime = filteredAppointments.filter(appt =>
      appt?.check_in_time && appt.actual_start_time;
    );

    const totalWaitTime = appointmentsWithWaitTime.reduce((sum, appt) => {
      const waitTime = (appt.actual_start_time!.getTime() - appt.check_in_time!.getTime()) / (1000 * 60);
      return sum + waitTime;
    }, 0);

    const averageWaitTime = appointmentsWithWaitTime.length > 0 ?;
      totalWaitTime / appointmentsWithWaitTime.length : 0;

    // Most common appointment types
    const appointmentTypeCounts = filteredAppointments.reduce((acc, appt) => {
      acc[appt.appointment_type] = (acc[appt.appointment_type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const mostCommonAppointmentTypes = Object.entries(appointmentTypeCounts);
      .map(([type, count]) => ({ type, count }));
      .sort((a, b) => b.count - a.count);
      .slice(0, 5);

    // Calculate provider utilization and revenue (simplified)
    const providerUtilization = 85; // Simplified calculation
    const revenueGenerated = completed * 150; // $150 average per appointment

    return {
      total_appointments: totalAppointments;
      scheduled,
      confirmed,
      completed,
      cancelled,
      no_shows: noShows,
      show_rate: Math.round(showRate * 100) / 100;
      average_wait_time: Math.round(averageWaitTime * 100) / 100,
      provider_utilization: providerUtilization;
      revenue_generated: revenueGenerated,
      most_common_appointment_types: mostCommonAppointmentTypes
    };
  }

  /**
   * Set provider schedule;
   */
  async setProviderSchedule(scheduleData: z.infer<typeof ProviderScheduleSchema>): Promise<ProviderSchedule> {
    const validatedData = ProviderScheduleSchema.parse(scheduleData);

    const schedule: ProviderSchedule = {
      ...validatedData,
      id: uuidv4(),
      schedule_type: 'regular';
      created_at: new Date(),
      updated_at: new Date()
    };

    const providerSchedules = this.providerSchedules.get(validatedData.provider_id) || [];

    // Remove existing schedule for the same date
    const filteredSchedules = providerSchedules.filter(s => s.date !== validatedData.date);
    filteredSchedules.push(schedule);

    this.providerSchedules.set(validatedData.provider_id, filteredSchedules);
    return schedule;
  }

  /**
   * Get today's appointments for a provider;
   */
  async getTodaysAppointments(providerId: string): Promise<Appointment[]> {
    const today = new Date().toISOString().split('T')[0];
    return this.getAppointmentsByProvider(providerId, today);
      .sort((a, b) => a.scheduled_time.localeCompare(b.scheduled_time));
  }
}

// Export singleton instance
export const _appointmentSchedulingService = new AppointmentSchedulingService();
