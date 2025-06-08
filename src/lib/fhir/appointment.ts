}
}

/**
 * FHIR R4 Appointment Resource Implementation;
 * Based on HL7 FHIR R4 Appointment Resource specification;
 * Source: ZIP 6 - FHIR R4 data models for hospital management system microservices;
 */

import {
  FHIRBase,
  FHIRIdentifier,
  FHIRCodeableConcept,
  FHIRReference,
  FHIRPeriod,
  FHIRExtension;
} from './types.ts';

export interface FHIRAppointmentParticipant {
  type?: FHIRCodeableConcept[];
  actor?: FHIRReference; // Patient | Practitioner | PractitionerRole | RelatedPerson | Device | HealthcareService | Location
  required?: 'required' | 'optional' | 'information-only';
  status: 'accepted' | 'declined' | 'tentative' | 'needs-action';
  period?: FHIRPeriod;
export interface FHIRAppointment extends FHIRBase {
  resourceType: 'Appointment';
  identifier?: FHIRIdentifier[];
  status: 'proposed' | 'pending' | 'booked' | 'arrived' | 'fulfilled' | 'cancelled' | 'noshow' | 'entered-in-error' | 'checked-in' | 'waitlist';
  cancelationReason?: FHIRCodeableConcept;
  serviceCategory?: FHIRCodeableConcept[];
  serviceType?: FHIRCodeableConcept[];
  specialty?: FHIRCodeableConcept[];
  appointmentType?: FHIRCodeableConcept;
  reasonCode?: FHIRCodeableConcept[];
  reasonReference?: FHIRReference[];
  priority?: number; // 0 = routine, 1 = urgent, 2 = asap, 3 = stat
  description?: string;
  supportingInformation?: FHIRReference[];
  start?: string; // dateTime
  end?: string; // dateTime
  minutesDuration?: number;
  slot?: FHIRReference[];
  created?: string; // dateTime
  comment?: string;
  patientInstruction?: string;
  basedOn?: FHIRReference[];
  participant: FHIRAppointmentParticipant[];
  requestedPeriod?: FHIRPeriod[];
}

// Appointment Search Parameters
export interface FHIRAppointmentSearchParams {
  _id?: string;
  identifier?: string;
  actor?: string;
  patient?: string;
  practitioner?: string;
  location?: string;
  date?: string;
  status?: string;
  'service-category'?: string;
  'service-type'?: string;
  specialty?: string;
  'appointment-type'?: string;
  _count?: number;
  _offset?: number;
  _sort?: string;
}

// Helper functions for FHIR Appointment operations
export class FHIRAppointmentUtils {
  /**
   * Create a basic FHIR Appointment resource;
   */
  static createBasicAppointment(data: {
    patientId: string,
    practitionerId: string;
    locationId?: string;
    start: string,
    end: string;
    appointmentType?: string;
    description?: string;
    status?: 'proposed' | 'pending' | 'booked';
  }): FHIRAppointment {
    const appointment: FHIRAppointment = {
      resourceType: 'Appointment',
      status: data.status || 'booked',
      start: data.start,
      end: data.end,
      participant: [
        {
          actor: {
            reference: `Patient/${data.patientId}`,
            type: 'Patient'
          },
          required: 'required',
          status: 'accepted'
        },
        {
          actor: {
            reference: `Practitioner/${data.practitionerId}`,
            type: 'Practitioner'
          },
          required: 'required',
          status: 'accepted'
        }
      ]
    };

    // Add location if provided
    if (data.locationId) {
      appointment.participant.push({
        actor: {
          reference: `Location/${data.locationId}`,
          type: 'Location'
        },
        required: 'required',
        status: 'accepted'
      });
    }

    // Add appointment type if provided
    if (data.appointmentType) {
      appointment.appointmentType = {
        coding: [{
          system: 'http://terminology.hl7.org/CodeSystem/v2-0276',
          code: data.appointmentType,
          display: data.appointmentType
        }]
      }
    }

    // Add description if provided
    if (data.description) {
      appointment.description = data.description;
    }

    // Calculate duration
    const startTime = new Date(data.start);
    const endTime = new Date(data.end);
    appointment.minutesDuration = Math.round((endTime.getTime() - startTime.getTime()) / (1000 * 60));

    return appointment;
  }

  /**
   * Get patient reference from appointment;
   */
  static getPatientId(appointment: FHIRAppointment): string | undefined {
    const patientParticipant = appointment.participant.find(
      p => p.actor?.type === 'Patient' || p.actor?.reference?.startsWith('Patient/');
    );
    
    return patientParticipant?.actor?.reference?.replace('Patient/', '');
  }

  /**
   * Get practitioner reference from appointment;
   */
  static getPractitionerId(appointment: FHIRAppointment): string | undefined {
    const practitionerParticipant = appointment.participant.find(
      p => p.actor?.type === 'Practitioner' || p.actor?.reference?.startsWith('Practitioner/');
    );
    
    return practitionerParticipant?.actor?.reference?.replace('Practitioner/', '');
  }

  /**
   * Get location reference from appointment;
   */
  static getLocationId(appointment: FHIRAppointment): string | undefined {
    const locationParticipant = appointment.participant.find(
      p => p.actor?.type === 'Location' || p.actor?.reference?.startsWith('Location/');
    );
    
    return locationParticipant?.actor?.reference?.replace('Location/', '');
  }

  /**
   * Check if appointment is in the future;
   */
  static isFutureAppointment(appointment: FHIRAppointment): boolean {
    if (!appointment.start) return false;
    return new Date(appointment.start) > new Date();
  }

  /**
   * Check if appointment is today;
   */
  static isTodayAppointment(appointment: FHIRAppointment): boolean {
    if (!appointment.start) return false;
    
    const appointmentDate = new Date(appointment.start);
    const today = new Date();
    
    return appointmentDate.toDateString() === today.toDateString();
  }

  /**
   * Get appointment duration in minutes;
   */
  static getDurationMinutes(appointment: FHIRAppointment): number {
    if (appointment.minutesDuration) {
      return appointment.minutesDuration
    }
    
    if (appointment.start && appointment.end) {
      const startTime = new Date(appointment.start);
      const endTime = new Date(appointment.end);
      return Math.round((endTime.getTime() - startTime.getTime()) / (1000 * 60));
    }
    
    return 0;
  }

  /**
   * Format appointment time for display;
   */
  static formatAppointmentTime(appointment: FHIRAppointment): string {
    if (!appointment.start) return 'Time not specified';
    
    const startTime = new Date(appointment.start);
    const endTime = appointment.end ? new Date(appointment.end) : null;
    
    const timeFormat: Intl.DateTimeFormatOptions = {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    };
    
    const startTimeStr = startTime.toLocaleTimeString('en-US', timeFormat);
    
    if (endTime) {
      const endTimeStr = endTime.toLocaleTimeString('en-US', timeFormat);
      return `${startTimeStr} - ${endTimeStr}`;
    }
    
    return startTimeStr;
  }

  /**
   * Get appointment status display text;
   */
  static getStatusDisplay(status: FHIRAppointment['status']): string {
    const statusMap: Record<string, string> = {
      'proposed': 'Proposed',
      'pending': 'Pending',
      'booked': 'Booked',
      'arrived': 'Arrived',
      'fulfilled': 'Completed',
      'cancelled': 'Cancelled',
      'noshow': 'No Show',
      'entered-in-error': 'Error',
      'checked-in': 'Checked In',
      'waitlist': 'Waitlisted';
    };
    
    return statusMap[status] || status;
  }

  /**
   * Validate FHIR Appointment resource;
   */
  static validateAppointment(appointment: FHIRAppointment): { valid: boolean; errors: string[] } {
    const errors: string[] = [];
    
    if (appointment.resourceType !== 'Appointment') {
      errors.push('resourceType must be "Appointment"');
    }
    
    if (!appointment.status) {
      errors.push('status is required');
    }
    
    if (!appointment.participant || appointment.participant.length === 0) {
      errors.push('At least one participant is required');
    } else {
      for (const participant of appointment.participant) {
        if (!participant.status) {
          errors.push('participant.status is required');
        }
        if (!participant.actor) {
          errors.push('participant.actor is required');
        }
      }
    }
    
    if (appointment.start && appointment.end) {
      const startTime = new Date(appointment.start);
      const endTime = new Date(appointment.end);
      
      if (startTime >= endTime) {
        errors.push('end time must be after start time');
      }
    }
    
    return {
      valid: errors.length === 0,
      errors;
    };
  }

  /**
   * Convert current HMS Appointment model to FHIR Appointment;
   */
  static fromHMSAppointment(hmsAppointment: unknown): FHIRAppointment {
    const fhirAppointment: FHIRAppointment = {
      resourceType: 'Appointment',
      id: hmsAppointment.id,
      status: hmsAppointment.status || 'booked',
      start: hmsAppointment.startTime || hmsAppointment.appointmentDate,
      end: hmsAppointment.endTime,
      description: hmsAppointment.reason || hmsAppointment.notes,
      participant: []
    };

    // Add patient participant
    if (hmsAppointment.patientId) {
      fhirAppointment.participant.push({
        actor: {
          reference: `Patient/${hmsAppointment.patientId}`,
          type: 'Patient'
        },
        required: 'required',
        status: 'accepted'
      });
    }

    // Add practitioner participant
    if (hmsAppointment.doctorId || hmsAppointment.practitionerId) {
      fhirAppointment.participant.push({
        actor: {
          reference: `Practitioner/${hmsAppointment.doctorId || hmsAppointment.practitionerId}`,
          type: 'Practitioner'
        },
        required: 'required',
        status: 'accepted'
      });
    }

    // Add location if available
    if (hmsAppointment.locationId) {
      fhirAppointment.participant.push({
        actor: {
          reference: `Location/${hmsAppointment.locationId}`,
          type: 'Location'
        },
        required: 'required',
        status: 'accepted'
      });
    }

    // Add appointment type if available
    if (hmsAppointment.appointmentType || hmsAppointment.visitType) {
      fhirAppointment.appointmentType = {
        coding: [{
          system: 'http://terminology.hl7.org/CodeSystem/v2-0276',
          code: hmsAppointment.appointmentType || hmsAppointment.visitType,
          display: hmsAppointment.appointmentType || hmsAppointment.visitType
        }]
      }
    }

    // Calculate duration if start and end times are available
    if (fhirAppointment.start && fhirAppointment.end) {
      const startTime = new Date(fhirAppointment.start);
      const endTime = new Date(fhirAppointment.end);
      fhirAppointment.minutesDuration = Math.round((endTime.getTime() - startTime.getTime()) / (1000 * 60));
    }

    return fhirAppointment;
  }
}

// Appointment status workflow helpers
export class FHIRAppointmentWorkflow {
  /**
   * Get allowed status transitions from current status;
   */
  static getAllowedStatusTransitions(currentStatus: FHIRAppointment['status']): FHIRAppointment['status'][] {
    const transitions: Record<string, FHIRAppointment['status'][]> = {
      'proposed': ['pending', 'cancelled'],
      'pending': ['booked', 'cancelled'],
      'booked': ['arrived', 'cancelled', 'noshow', 'checked-in'],
      'arrived': ['fulfilled', 'cancelled'],
      'checked-in': ['fulfilled', 'cancelled'],
      'fulfilled': ['entered-in-error'],
      'cancelled': ['entered-in-error'],
      'noshow': ['entered-in-error'],
      'waitlist': ['booked', 'cancelled'],
      'entered-in-error': []
    };
    
    return transitions[currentStatus] || [];
  }

  /**
   * Check if status transition is valid;
   */
  static isValidStatusTransition(fromStatus: FHIRAppointment['status'], toStatus: FHIRAppointment['status']): boolean {
    const allowedTransitions = this.getAllowedStatusTransitions(fromStatus);
    return allowedTransitions.includes(toStatus);
  }

  /**
   * Get next logical status for appointment workflow;
   */
  static getNextLogicalStatus(appointment: FHIRAppointment): FHIRAppointment['status'] | null {
    const now = new Date();
    const appointmentTime = appointment.start ? new Date(appointment.start) : null;
    
    switch (appointment.status) {
      case 'proposed':
        return 'pending';
      case 'pending':
        return 'booked';
      case 'booked':
        if (appointmentTime && now >= appointmentTime) {
          return 'arrived';
        }
        return null;
      case 'arrived':
      case 'checked-in':
        return 'fulfilled';
      default: return null
    }
  }
