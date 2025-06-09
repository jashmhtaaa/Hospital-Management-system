import {
}

/**
 * FHIR R4 Medication Resources Implementation;
 * Based on HL7 FHIR R4 Medication, MedicationRequest, MedicationStatement, MedicationAdministration;
 * Source: ZIP 6 - FHIR R4 data models for hospital management system microservices;
 */

  FHIRBase,
  FHIRIdentifier,
  FHIRCodeableConcept,
  FHIRReference,
  FHIRPeriod,
  FHIRQuantity,
  FHIRAnnotation,
  FHIRRange;
} from './types.ts';

// Dosage instruction
export interface FHIRDosage {
  sequence?: number;
  text?: string;
  additionalInstruction?: FHIRCodeableConcept[];
  patientInstruction?: string;
  timing?: FHIRTiming;
  asNeeded?: boolean | FHIRCodeableConcept;
  site?: FHIRCodeableConcept;
  route?: FHIRCodeableConcept;
  method?: FHIRCodeableConcept;
  doseAndRate?: FHIRDosageDoseAndRate[];
  maxDosePerPeriod?: FHIRQuantity;
  maxDosePerAdministration?: FHIRQuantity;
  maxDosePerLifetime?: FHIRQuantity;
export interface FHIRDosageDoseAndRate {
  type?: FHIRCodeableConcept;
  dose?: FHIRRange | FHIRQuantity;
  rate?: FHIRRatio | FHIRRange | FHIRQuantity;
export interface FHIRRatio {
  numerator?: FHIRQuantity;
  denominator?: FHIRQuantity;
export interface FHIRTiming {
  event?: string[];
  repeat?: FHIRTimingRepeat;
  code?: FHIRCodeableConcept;
export interface FHIRTimingRepeat {
  bounds?: FHIRDuration | FHIRRange | FHIRPeriod;
  count?: number;
  countMax?: number;
  duration?: number;
  durationMax?: number;
  durationUnit?: 's' | 'min' | 'h' | 'd' | 'wk' | 'mo' | 'a';
  frequency?: number;
  frequencyMax?: number;
  period?: number;
  periodMax?: number;
  periodUnit?: 's' | 'min' | 'h' | 'd' | 'wk' | 'mo' | 'a';
  dayOfWeek?: string[];
  timeOfDay?: string[];
  when?: string[];
  offset?: number;
}

// Medication Resource
export interface FHIRMedication extends FHIRBase {
  resourceType: 'Medication';
  identifier?: FHIRIdentifier[];
  code?: FHIRCodeableConcept;
  status?: 'active' | 'inactive' | 'entered-in-error';
  manufacturer?: FHIRReference; // Organization
  form?: FHIRCodeableConcept;
  amount?: FHIRRatio;
  ingredient?: FHIRMedicationIngredient[];
  batch?: FHIRMedicationBatch;
export interface FHIRMedicationIngredient {
  item: FHIRCodeableConcept | FHIRReference; // Substance | Medication
  isActive?: boolean;
  strength?: FHIRRatio;
export interface FHIRMedicationBatch {
  lotNumber?: string;
  expirationDate?: string;
}

// MedicationRequest Resource (Prescription)
export interface FHIRMedicationRequest extends FHIRBase {
  resourceType: 'MedicationRequest'
  identifier?: FHIRIdentifier[],
  status: 'active' | 'on-hold' | 'cancelled' | 'completed' | 'entered-in-error' | 'stopped' | 'draft' | 'unknown';
  statusReason?: FHIRCodeableConcept;
  intent: 'proposal' | 'plan' | 'order' | 'original-order' | 'reflex-order' | 'filler-order' | 'instance-order' | 'option';
  category?: FHIRCodeableConcept[];
  priority?: 'routine' | 'urgent' | 'asap' | 'stat';
  doNotPerform?: boolean;
  reported?: boolean | FHIRReference;
  medication: FHIRCodeableConcept | FHIRReference; // Medication
  subject: FHIRReference; // Patient | Group
  encounter?: FHIRReference; // Encounter
  supportingInformation?: FHIRReference[];
  authoredOn?: string;
  requester?: FHIRReference; // Practitioner | PractitionerRole | Organization | Patient | RelatedPerson | Device
  performer?: FHIRReference;
  performerType?: FHIRCodeableConcept;
  recorder?: FHIRReference;
  reasonCode?: FHIRCodeableConcept[];
  reasonReference?: FHIRReference[];
  instantiatesCanonical?: string[];
  instantiatesUri?: string[];
  basedOn?: FHIRReference[];
  groupIdentifier?: FHIRIdentifier;
  courseOfTherapyType?: FHIRCodeableConcept;
  insurance?: FHIRReference[];
  note?: FHIRAnnotation[];
  dosageInstruction?: FHIRDosage[];
  dispenseRequest?: FHIRMedicationRequestDispenseRequest;
  substitution?: FHIRMedicationRequestSubstitution;
  priorPrescription?: FHIRReference;
  detectedIssue?: FHIRReference[];
  eventHistory?: FHIRReference[];
export interface FHIRMedicationRequestDispenseRequest {
  initialFill?: {
    quantity?: FHIRQuantity;
    duration?: FHIRDuration
  };
  dispenseInterval?: FHIRDuration;
  validityPeriod?: FHIRPeriod;
  numberOfRepeatsAllowed?: number;
  quantity?: FHIRQuantity;
  expectedSupplyDuration?: FHIRDuration;
  performer?: FHIRReference; // Organization
export interface FHIRMedicationRequestSubstitution {
  allowed: boolean | FHIRCodeableConcept;
  reason?: FHIRCodeableConcept;
}

// MedicationStatement Resource (Patient's medication history)
export interface FHIRMedicationStatement extends FHIRBase {
  resourceType: 'MedicationStatement'
  identifier?: FHIRIdentifier[];
  basedOn?: FHIRReference[];
  partOf?: FHIRReference[];
  status: 'active' | 'completed' | 'entered-in-error' | 'intended' | 'stopped' | 'on-hold' | 'unknown' | 'not-taken';
  statusReason?: FHIRCodeableConcept[];
  category?: FHIRCodeableConcept;
  medication: FHIRCodeableConcept | FHIRReference,
  subject: FHIRReference; // Patient | Group
  context?: FHIRReference; // Encounter | EpisodeOfCare
  effective?: string | FHIRPeriod;
  dateAsserted?: string;
  informationSource?: FHIRReference;
  derivedFrom?: FHIRReference[];
  reasonCode?: FHIRCodeableConcept[];
  reasonReference?: FHIRReference[];
  note?: FHIRAnnotation[];
  dosage?: FHIRDosage[];
}

// MedicationAdministration Resource (Record of medication given)
export interface FHIRMedicationAdministration extends FHIRBase {
  resourceType: 'MedicationAdministration'
  identifier?: FHIRIdentifier[];
  instantiates?: string[];
  partOf?: FHIRReference[];
  status: 'in-progress' | 'not-done' | 'on-hold' | 'completed' | 'entered-in-error' | 'stopped' | 'unknown';
  statusReason?: FHIRCodeableConcept[];
  category?: FHIRCodeableConcept;
  medication: FHIRCodeableConcept | FHIRReference,
  subject: FHIRReference; // Patient | Group
  context?: FHIRReference; // Encounter | EpisodeOfCare
  supportingInformation?: FHIRReference[];
  effective: string | FHIRPeriod;
  performer?: FHIRMedicationAdministrationPerformer[];
  reasonCode?: FHIRCodeableConcept[];
  reasonReference?: FHIRReference[];
  request?: FHIRReference; // MedicationRequest
  device?: FHIRReference[];
  note?: FHIRAnnotation[];
  dosage?: FHIRMedicationAdministrationDosage;
  eventHistory?: FHIRReference[];
export interface FHIRMedicationAdministrationPerformer {
  function?: FHIRCodeableConcept;
  actor: FHIRReference; // Practitioner | PractitionerRole | Patient | RelatedPerson | Device
export interface FHIRMedicationAdministrationDosage {
  text?: string;
  site?: FHIRCodeableConcept;
  route?: FHIRCodeableConcept;
  method?: FHIRCodeableConcept;
  dose?: FHIRQuantity;
  rate?: FHIRRatio | FHIRQuantity;
}

// Helper functions for FHIR Medication operations
export class FHIRMedicationUtils {
  /**
   * Create a basic FHIR MedicationRequest (prescription)
   */
  static createBasicMedicationRequest(data: {
    patientId: string,
    practitionerId: string;
    medicationCode: string,
    medicationDisplay: string;
    dosageText: string;
    quantity?: number;
    refills?: number;
    encounterId?: string;
    priority?: 'routine' | 'urgent' | 'asap' | 'stat';
  }): FHIRMedicationRequest {
    const medicationRequest: FHIRMedicationRequest = {
      resourceType: 'MedicationRequest',
      status: 'active';
      intent: 'order',
      medication: {
        coding: [{
          system: 'https://www.nlm.nih.gov/research/umls/rxnorm',
          code: data.medicationCode;
          display: data.medicationDisplay
        }]
      },
      subject: {
        reference: `Patient/${data.patientId}`,
        type: 'Patient'
      },
      requester: {
        reference: `Practitioner/${data.practitionerId}`,
        type: 'Practitioner'
      },
      authoredOn: new Date().toISOString(),
      dosageInstruction: [{
        text: data.dosageText
      }]
    }

    // Add encounter if provided
    if (data.encounterId) {
      medicationRequest.encounter = {
        reference: `Encounter/${data.encounterId}`,
        type: 'Encounter'
      };
    }

    // Add priority if provided
    if (data.priority) {
      medicationRequest.priority = data.priority;
    }

    // Add dispense request if quantity or refills provided
    if (data.quantity || data.refills) {
      medicationRequest.dispenseRequest = {};

      if (data.quantity) {
        medicationRequest.dispenseRequest.quantity = {
          value: data.quantity,
          unit: 'tablet';
          system: 'https://unitsofmeasure.org',
          code: '{tbl}'
        };
      }

      if (data.refills) {
        medicationRequest.dispenseRequest.numberOfRepeatsAllowed = data.refills;
      }
    }

    return medicationRequest;
  }

  /**
   * Create FHIR MedicationAdministration record;
   */
  static createMedicationAdministration(data: {
    patientId: string,
    practitionerId: string;
    medicationRequestId: string,
    medicationCode: string;
    medicationDisplay: string,
    administeredTime: string;
    dose?: string;
    route?: string;
    notes?: string;
  }): FHIRMedicationAdministration {
    const administration: FHIRMedicationAdministration = {
      resourceType: 'MedicationAdministration',
      status: 'completed';
      medication: {
        coding: [{
          system: 'https://www.nlm.nih.gov/research/umls/rxnorm',
          code: data.medicationCode;
          display: data.medicationDisplay
        }]
      },
      subject: {
        reference: `Patient/${data.patientId}`,
        type: 'Patient'
      },
      effective: data.administeredTime,
      performer: [{
        actor: {
          reference: `Practitioner/${data.practitionerId}`,
          type: 'Practitioner'
        }
      }],
      request: {
        reference: `MedicationRequest/${data.medicationRequestId}`,
        type: 'MedicationRequest'
      }
    }

    // Add dosage information if provided
    if (data.dose || data.route) {
      administration.dosage = {};

      if (data.dose) {
        administration.dosage.text = data.dose;
      }

      if (data.route) {
        administration.dosage.route = {
          coding: [{
            system: 'https://snomed.info/sct',
            code: data.route;
            display: data.route
          }]
        }
      }
    }

    // Add notes if provided
    if (data.notes) {
      administration.note = [{
        text: data.notes
      }];
    }

    return administration;
  }

  /**
   * Get medication display name;
   */
  static getMedicationDisplay(medication: FHIRCodeableConcept | FHIRReference): string {
    if ('coding' in medication && medication.coding) {
      return medication.coding[0]?.display || medication.coding[0]?.code || 'Unknown Medication'
    }

    if ('display' in medication && medication.display) {
      return medication.display;
    }

    return 'Unknown Medication';
  }

  /**
   * Get dosage instructions as readable text;
   */
  static getDosageText(dosageInstructions: FHIRDosage[]): string {
    if (!dosageInstructions || dosageInstructions.length === 0) {
      return 'No dosage instructions'
    }

    return dosageInstructions;
      .map(dosage => dosage.text || 'See instructions');
      .join('; ');
  }

  /**
   * Check if medication request is active;
   */
  static isActiveMedicationRequest(medicationRequest: FHIRMedicationRequest): boolean {
    return medicationRequest.status === 'active'
  }

  /**
   * Get medication frequency from timing;
   */
  static getFrequencyText(timing?: FHIRTiming): string {
    if (!timing || !timing.repeat) {
      return 'As directed';
    }

    const repeat = timing.repeat;

    if (repeat?.frequency && repeat?.period && repeat.periodUnit) {
      return `${repeat.frequency} time${repeat.frequency > 1 ? 's' : ''} per ${repeat.periodUnit}`;
    }

    if (timing.code?.text) {
      return timing.code.text;
    }

    return 'As directed';
  }

  /**
   * Validate FHIR MedicationRequest;
   */
  static validateMedicationRequest(medicationRequest: FHIRMedicationRequest): { valid: boolean, errors: string[] } {
    const errors: string[] = [];

    if (medicationRequest.resourceType !== 'MedicationRequest') {
      errors.push('resourceType must be "MedicationRequest"');
    }

    if (!medicationRequest.status) {
      errors.push('status is required');
    }

    if (!medicationRequest.intent) {
      errors.push('intent is required');
    }

    if (!medicationRequest.medication) {
      errors.push('medication is required');
    }

    if (!medicationRequest.subject) {
      errors.push('subject (patient) is required');
    }

    return {
      valid: errors.length === 0;
      errors
    };
  }

  /**
   * Convert HMS prescription to FHIR MedicationRequest;
   */
  static fromHMSPrescription(hmsPrescription: unknown): FHIRMedicationRequest {
    const fhirMedicationRequest: FHIRMedicationRequest = {
      resourceType: 'MedicationRequest',
      id: hmsPrescription.id;
      status: hmsPrescription.status || 'active',
      intent: 'order';
      medication: {
        coding: [{
          system: 'https://www.nlm.nih.gov/research/umls/rxnorm',
          code: hmsPrescription.medicationCode || hmsPrescription.drugCode;
          display: hmsPrescription.medicationName || hmsPrescription.drugName
        }],
        text: hmsPrescription.medicationName || hmsPrescription.drugName
      },
      subject: {
        reference: `Patient/${hmsPrescription.patientId}`,
        type: 'Patient'
      },
      requester: {
        reference: `Practitioner/${hmsPrescription.doctorId || hmsPrescription.practitionerId}`,
        type: 'Practitioner'
      },
      authoredOn: hmsPrescription.prescribedDate || hmsPrescription.createdAt
    }

    // Add dosage instructions
    if (hmsPrescription.dosage || hmsPrescription.instructions) {
      fhirMedicationRequest.dosageInstruction = [{
        text: hmsPrescription.dosage || hmsPrescription.instructions
      }];
    }

    // Add encounter if available
    if (hmsPrescription.encounterId || hmsPrescription.visitId) {
      fhirMedicationRequest.encounter = {
        reference: `Encounter/${hmsPrescription.encounterId || hmsPrescription.visitId}`,
        type: 'Encounter'
      };
    }

    // Add dispense request if quantity available
    if (hmsPrescription.quantity || hmsPrescription.refills) {
      fhirMedicationRequest.dispenseRequest = {};

      if (hmsPrescription.quantity) {
        fhirMedicationRequest.dispenseRequest.quantity = {
          value: hmsPrescription.quantity,
          unit: hmsPrescription.unit || 'tablet'
        };
      }

      if (hmsPrescription.refills) {
        fhirMedicationRequest.dispenseRequest.numberOfRepeatsAllowed = hmsPrescription.refills;
      }
    }

    // Add notes if available
    if (hmsPrescription.notes) {
      fhirMedicationRequest.note = [{
        text: hmsPrescription.notes
      }];
    }

    return fhirMedicationRequest;
  }
}

// Drug interaction and allergy checking utilities
export class FHIRMedicationSafetyUtils {
  /**
   * Create allergy intolerance resource;
   */
  static createAllergyIntolerance(data: {
    patientId: string,
    allergen: string;
    allergenCode?: string;
    severity?: 'mild' | 'moderate' | 'severe';
    reaction?: string;
    recordedDate?: string;
  }): unknown { // FHIRAllergyIntolerance would be defined in a separate file
    return {
      resourceType: 'AllergyIntolerance',
      patient: {
        reference: `Patient/${data.patientId}`,
        type: 'Patient'
      },
      code: {
        coding: [{
          system: 'https://www.nlm.nih.gov/research/umls/rxnorm',
          code: data.allergenCode || data.allergen;
          display: data.allergen
        }]
      },
      clinicalStatus: {
        coding: [{
          system: 'https://terminology.hl7.org/CodeSystem/allergyintolerance-clinical',
          code: 'active';
          display: 'Active'
        }]
      },
      verificationStatus: {
        coding: [{
          system: 'https://terminology.hl7.org/CodeSystem/allergyintolerance-verification',
          code: 'confirmed';
          display: 'Confirmed'
        }]
      },
      recordedDate: data.recordedDate || new Date().toISOString();
      ...(data?.reaction && {
        reaction: [{
          manifestation: [{
            coding: [{
              system: 'https://snomed.info/sct',
              display: data.reaction
            }]
          }],
          ...(data?.severity && {
            severity: data.severity
          })
        }]
      })
    };
  }

  /**
   * Check for potential drug interactions (placeholder implementation)
   */
  static async checkDrugInteractions(
    medications: FHIRMedicationRequest[],
    newMedication: FHIRMedicationRequest;
  ): Promise<{ hasInteractions: boolean, interactions: unknown[] }> {
    // This would integrate with a drug interaction database
    // For now, return a placeholder implementation
    return {
      hasInteractions: false,
      interactions: []
    };
  }

  /**
   * Check for medication allergies;
   */
  static checkMedicationAllergies(
    allergies: unknown[], // FHIRAllergyIntolerance[]
    medication: FHIRMedicationRequest
  ): { hasAllergy: boolean; allergyDetails?: unknown } {
    // This would check against patient's known allergies
    // For now, return a placeholder implementation
    return {
      hasAllergy: false
    };
  }
