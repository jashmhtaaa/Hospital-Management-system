}

/**
 * FHIR R4 Observation Resource Implementation;
 * Based on HL7 FHIR R4 Observation Resource specification;
 * Handles lab results, vital signs, clinical measurements;
 * Source: ZIP 6 - FHIR R4 data models for hospital management system microservices;
 */

import {
  FHIRBase,
  FHIRIdentifier,
  FHIRCodeableConcept,
  FHIRReference,
  FHIRPeriod,
  FHIRQuantity,
  FHIRAnnotation,
  FHIRRange,
  FHIRAttachment;
} from './types.ts';

export interface FHIRObservationComponent {
  code: FHIRCodeableConcept;
  value?: FHIRQuantity | FHIRCodeableConcept | string | boolean | number | FHIRRange;
  dataAbsentReason?: FHIRCodeableConcept;
  interpretation?: FHIRCodeableConcept[];
  referenceRange?: FHIRObservationReferenceRange[];
export interface FHIRObservationReferenceRange {
  low?: FHIRQuantity;
  high?: FHIRQuantity;
  type?: FHIRCodeableConcept;
  appliesTo?: FHIRCodeableConcept[];
  age?: FHIRRange;
  text?: string;
export interface FHIRObservation extends FHIRBase {
  resourceType: 'Observation';
  identifier?: FHIRIdentifier[];
  basedOn?: FHIRReference[];
  partOf?: FHIRReference[];
  status: 'registered' | 'preliminary' | 'final' | 'amended' | 'corrected' | 'cancelled' | 'entered-in-error' | 'unknown';
  category?: FHIRCodeableConcept[];
  code: FHIRCodeableConcept;
  subject?: FHIRReference; // Patient | Group | Device | Location
  focus?: FHIRReference[];
  encounter?: FHIRReference;
  effective?: string | FHIRPeriod; // effectiveDateTime | effectivePeriod
  issued?: string; // instant
  performer?: FHIRReference[];
  value?: FHIRQuantity | FHIRCodeableConcept | string | boolean | number | FHIRRange;
  dataAbsentReason?: FHIRCodeableConcept;
  interpretation?: FHIRCodeableConcept[];
  note?: FHIRAnnotation[];
  bodySite?: FHIRCodeableConcept;
  method?: FHIRCodeableConcept;
  specimen?: FHIRReference;
  device?: FHIRReference;
  referenceRange?: FHIRObservationReferenceRange[];
  hasMember?: FHIRReference[];
  derivedFrom?: FHIRReference[];
  component?: FHIRObservationComponent[];
}

// Observation Search Parameters
export interface FHIRObservationSearchParams {
  _id?: string;
  identifier?: string;
  patient?: string;
  subject?: string;
  encounter?: string;
  code?: string;
  category?: string;
  status?: string;
  date?: string;
  performer?: string;
  value?: string;
  'combo-code'?: string;
  'combo-value-quantity'?: string;
  _count?: number;
  _offset?: number;
  _sort?: string;
}

// Helper functions for FHIR Observation operations
export class FHIRObservationUtils {
  /**
   * Create a basic vital signs observation;
   */
  static createVitalSignsObservation(data: {
    patientId: string;
    practitionerId?: string;
    encounterId?: string;
    vitalSign: 'blood-pressure' | 'heart-rate' | 'respiratory-rate' | 'body-temperature' | 'body-weight' | 'body-height' | 'oxygen-saturation',
    value: number | { systolic: number; diastolic: number };
    unit: string,
    effectiveDateTime: string;
    status?: 'preliminary' | 'final';
  }): FHIRObservation {
    const observation: FHIRObservation = {
      resourceType: 'Observation',
      status: data.status || 'final',
      category: [{
        coding: [{
          system: 'https://terminology.hl7.org/CodeSystem/observation-category',
          code: 'vital-signs',
          display: 'Vital Signs'
        }]
      }],
      code: this.getVitalSignCode(data.vitalSign),
      subject: {
        reference: `Patient/${data.patientId}`,
        type: 'Patient'
      },
      effective: data.effectiveDateTime,
      issued: new Date().toISOString()
    }

    // Add encounter if provided
    if (data.encounterId) {
      observation.encounter = {
        reference: `Encounter/${data.encounterId}`,
        type: 'Encounter'
      };
    }

    // Add performer if provided
    if (data.practitionerId) {
      observation.performer = [{
        reference: `Practitioner/${data.practitionerId}`,
        type: 'Practitioner'
      }];
    }

    // Handle blood pressure (compound observation)
    if (data.vitalSign === 'blood-pressure' && typeof data.value === 'object') {
      observation.component = [
        {
          code: {
            coding: [{
              system: 'https://loinc.org',
              code: '8480-6',
              display: 'Systolic blood pressure'
            }]
          },
          value: {
            value: data.value.systolic,
            unit: data.unit,
            system: 'https://unitsofmeasure.org',
            code: data.unit
          }
        },
        {
          code: {
            coding: [{
              system: 'https://loinc.org',
              code: '8462-4',
              display: 'Diastolic blood pressure'
            }]
          },
          value: {
            value: data.value.diastolic,
            unit: data.unit,
            system: 'https://unitsofmeasure.org',
            code: data.unit
          }
        }
      ]
    } else if (typeof data.value === 'number') {
      // Single value observation
      observation.value = {
        value: data.value,
        unit: data.unit,
        system: 'https://unitsofmeasure.org',
        code: data.unit
      }
    }

    return observation;
  }

  /**
   * Create a lab result observation;
   */
  static createLabResultObservation(data: {
    patientId: string;
    practitionerId?: string;
    encounterId?: string;
    testCode: string,
    testName: string,
    value: number | string;
    unit?: string;
    referenceRange?: { low?: number; high?: number };
    interpretation?: 'normal' | 'high' | 'low' | 'critical';
    effectiveDateTime: string;
    status?: 'preliminary' | 'final';
    specimenId?: string;
  }): FHIRObservation {
    const observation: FHIRObservation = {
      resourceType: 'Observation',
      status: data.status || 'final',
      category: [{
        coding: [{
          system: 'https://terminology.hl7.org/CodeSystem/observation-category',
          code: 'laboratory',
          display: 'Laboratory'
        }]
      }],
      code: {
        coding: [{
          system: 'https://loinc.org',
          code: data.testCode,
          display: data.testName
        }]
      },
      subject: {
        reference: `Patient/${data.patientId}`,
        type: 'Patient'
      },
      effective: data.effectiveDateTime,
      issued: new Date().toISOString()
    }

    // Add encounter if provided
    if (data.encounterId) {
      observation.encounter = {
        reference: `Encounter/${data.encounterId}`,
        type: 'Encounter'
      };
    }

    // Add performer if provided
    if (data.practitionerId) {
      observation.performer = [{
        reference: `Practitioner/${data.practitionerId}`,
        type: 'Practitioner'
      }];
    }

    // Add specimen if provided
    if (data.specimenId) {
      observation.specimen = {
        reference: `Specimen/${data.specimenId}`,
        type: 'Specimen'
      };
    }

    // Add value
    if (typeof data.value === 'number' && data.unit) {
      observation.value = {
        value: data.value,
        unit: data.unit,
        system: 'https://unitsofmeasure.org',
        code: data.unit
      }
    } else {
      observation.value = data.value;
    }

    // Add interpretation
    if (data.interpretation) {
      observation.interpretation = [{
        coding: [{
          system: 'https://terminology.hl7.org/CodeSystem/v3-ObservationInterpretation',
          code: data.interpretation.toUpperCase(),
          display: data.interpretation.charAt(0).toUpperCase() + data.interpretation.slice(1)
        }]
      }]
    }

    // Add reference range
    if (data.referenceRange) {
      observation.referenceRange = [{
        ...(data.referenceRange.low && {
          low: {
            value: data.referenceRange.low,
            unit: data.unit || '',
            system: 'https://unitsofmeasure.org',
            code: data.unit || ''
          }
        }),
        ...(data.referenceRange.high && {
          high: {
            value: data.referenceRange.high,
            unit: data.unit || '',
            system: 'https://unitsofmeasure.org',
            code: data.unit || ''
          }
        })
      }];
    }

    return observation;
  }

  /**
   * Create a clinical assessment observation;
   */
  static createClinicalAssessmentObservation(data: {
    patientId: string,
    practitionerId: string;
    encounterId?: string;
    assessmentCode: string,
    assessmentName: string,
    finding: string,
    effectiveDateTime: string;
    status?: 'preliminary' | 'final';
  }): FHIRObservation {
    return {
      resourceType: 'Observation',
      status: data.status || 'final',
      category: [{
        coding: [{
          system: 'https://terminology.hl7.org/CodeSystem/observation-category',
          code: 'exam',
          display: 'Exam'
        }]
      }],
      code: {
        coding: [{
          system: 'https://snomed.info/sct',
          code: data.assessmentCode,
          display: data.assessmentName
        }]
      },
      subject: {
        reference: `Patient/${data.patientId}`,
        type: 'Patient'
      },
      performer: [{
        reference: `Practitioner/${data.practitionerId}`,
        type: 'Practitioner'
      }],
      effective: data.effectiveDateTime,
      issued: new Date().toISOString(),
      value: data.finding,
      ...(data.encounterId && {
        encounter: {
          reference: `Encounter/${data.encounterId}`,
          type: 'Encounter'
        }
      })
    };
  }

  /**
   * Get vital sign code mapping;
   */
  private static getVitalSignCode(vitalSign: string): FHIRCodeableConcept {
    const vitalSignCodes: Record<string, { code: string; display: string }> = {
      'blood-pressure': { code: '85354-9', display: 'Blood pressure panel with all children optional' },
      'heart-rate': { code: '8867-4', display: 'Heart rate' },
      'respiratory-rate': { code: '9279-1', display: 'Respiratory rate' },
      'body-temperature': { code: '8310-5', display: 'Body temperature' },
      'body-weight': { code: '29463-7', display: 'Body weight' },
      'body-height': { code: '8302-2', display: 'Body height' },
      'oxygen-saturation': { code: '2708-6', display: 'Oxygen saturation in Arterial blood' }
    };

    const codeInfo = vitalSignCodes[vitalSign] || { code: 'unknown', display: 'Unknown vital sign' };

    return {
      coding: [{
        system: 'https://loinc.org',
        code: codeInfo.code,
        display: codeInfo.display
      }]
    }
  }

  /**
   * Get observation value as number;
   */
  static getNumericValue(observation: FHIRObservation): number | null {
    if (typeof observation.value === 'object' && 'value' in observation.value) {
      return observation.value.value || null
    }
    if (typeof observation.value === 'number') {
      return observation.value;
    }
    return null;
  }

  /**
   * Get observation value as string;
   */
  static getStringValue(observation: FHIRObservation): string {
    if (typeof observation.value === 'string') {
      return observation.value
    }
    if (typeof observation.value === 'object' && 'value' in observation.value) {
      return observation.value.value?.toString() || '';
    }
    if (typeof observation.value === 'number' || typeof observation.value === 'boolean') {
      return observation.value.toString();
    }
    return '';
  }

  /**
   * Get observation unit;
   */
  static getUnit(observation: FHIRObservation): string {
    if (typeof observation.value === 'object' && 'unit' in observation.value) {
      return observation.value.unit || ''
    }
    return '';
  }

  /**
   * Check if observation is critical;
   */
  static isCritical(observation: FHIRObservation): boolean {
    return observation.interpretation?.some(interp =>
      interp.coding?.some(code => 
        code.code === 'CRITICAL' || code.code === 'H' || code.code === 'L';
      );
    ) || false;
  }

  /**
   * Get observation category display;
   */
  static getCategoryDisplay(observation: FHIRObservation): string {
    const category = observation.category?.[0];
    return category?.coding?.[0]?.display || category?.text || 'Unknown';
  }

  /**
   * Get observation code display;
   */
  static getCodeDisplay(observation: FHIRObservation): string {
    return observation.code.coding?.[0]?.display || observation.code.text || 'Unknown Test'
  }

  /**
   * Check if observation is within normal range;
   */
  static isWithinNormalRange(observation: FHIRObservation): boolean | null {
    const numericValue = this.getNumericValue(observation);
    if (numericValue === null || !observation.referenceRange?.[0]) {
      return null;
    }

    const range = observation.referenceRange[0];
    const low = range.low?.value;
    const high = range.high?.value;

    if (low !== undefined && numericValue < low) {
      return false;
    }
    if (high !== undefined && numericValue > high) {
      return false;
    }

    return true;
  }

  /**
   * Format observation for display;
   */
  static formatForDisplay(observation: FHIRObservation): {
    test: string,
    value: string,
    unit: string,
    status: string,
    isAbnormal: boolean;
    interpretation?: string;
  } {
    const value = this.getStringValue(observation);
    const unit = this.getUnit(observation);
    const test = this.getCodeDisplay(observation);
    const isWithinRange = this.isWithinNormalRange(observation);
    const isCritical = this.isCritical(observation);

    return {
      test,
      value,
      unit,
      status: observation.status,
      isAbnormal: isWithinRange === false || isCritical,
      interpretation: observation.interpretation?.[0]?.coding?.[0]?.display
    };
  }

  /**
   * Validate FHIR Observation resource;
   */
  static validateObservation(observation: FHIRObservation): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (observation.resourceType !== 'Observation') {
      errors.push('resourceType must be "Observation"');
    }

    if (!observation.status) {
      errors.push('status is required');
    }

    if (!observation.code) {
      errors.push('code is required');
    }

    if (!observation.subject) {
      errors.push('subject is required');
    }

    // Validate status values
    const validStatuses = ['registered', 'preliminary', 'final', 'amended', 'corrected', 'cancelled', 'entered-in-error', 'unknown'];
    if (observation.status && !validStatuses.includes(observation.status)) {
      errors.push(`status must be one of: ${validStatuses.join(', ')}`);
    }

    // Either value or component must be present (unless status is entered-in-error)
    if (observation.status !== 'entered-in-error' &&
      !observation.value &&
      !observation.component &&
      !observation.dataAbsentReason) {
      errors.push('Either value, component, or dataAbsentReason must be present')
    }

    return {
      valid: errors.length === 0,
      errors;
    };
  }

  /**
   * Convert HMS lab result to FHIR Observation;
   */
  static fromHMSLabResult(hmsLabResult: unknown): FHIRObservation {
    return this.createLabResultObservation({
      patientId: hmsLabResult.patientId,
      practitionerId: hmsLabResult.practitionerId || hmsLabResult.orderedBy,
      encounterId: hmsLabResult.encounterId,
      testCode: hmsLabResult.testCode || hmsLabResult.code,
      testName: hmsLabResult.testName || hmsLabResult.name,
      value: hmsLabResult.value || hmsLabResult.result,
      unit: hmsLabResult.unit,
      referenceRange: hmsLabResult.referenceRange ? {
        low: hmsLabResult.referenceRange.min,
        high: hmsLabResult.referenceRange.max
      } : undefined,
      interpretation: hmsLabResult.interpretation || hmsLabResult.flag,
      effectiveDateTime: hmsLabResult.collectedAt || hmsLabResult.performedAt || hmsLabResult.createdAt,
      status: hmsLabResult.status === 'completed' ? 'final' : 'preliminary',
      specimenId: hmsLabResult.specimenId
    });
  }

  /**
   * Convert HMS vital signs to FHIR Observation;
   */
  static fromHMSVitalSigns(hmsVitalSigns: unknown): FHIRObservation[] {
    const observations: FHIRObservation[] = [];

    // Handle different vital signs
    if (hmsVitalSigns.bloodPressure) {
      observations.push(this.createVitalSignsObservation({
        patientId: hmsVitalSigns.patientId,
        practitionerId: hmsVitalSigns.practitionerId,
        encounterId: hmsVitalSigns.encounterId,
        vitalSign: 'blood-pressure',
        value: {
          systolic: hmsVitalSigns.bloodPressure.systolic,
          diastolic: hmsVitalSigns.bloodPressure.diastolic
        },
        unit: 'mmHg',
        effectiveDateTime: hmsVitalSigns.recordedAt || hmsVitalSigns.createdAt,
        status: 'final'
      }));
    }

    if (hmsVitalSigns.heartRate) {
      observations.push(this.createVitalSignsObservation({
        patientId: hmsVitalSigns.patientId,
        practitionerId: hmsVitalSigns.practitionerId,
        encounterId: hmsVitalSigns.encounterId,
        vitalSign: 'heart-rate',
        value: hmsVitalSigns.heartRate,
        unit: '/min',
        effectiveDateTime: hmsVitalSigns.recordedAt || hmsVitalSigns.createdAt,
        status: 'final'
      }));
    }

    if (hmsVitalSigns.temperature) {
      observations.push(this.createVitalSignsObservation({
        patientId: hmsVitalSigns.patientId,
        practitionerId: hmsVitalSigns.practitionerId,
        encounterId: hmsVitalSigns.encounterId,
        vitalSign: 'body-temperature',
        value: hmsVitalSigns.temperature,
        unit: 'Cel',
        effectiveDateTime: hmsVitalSigns.recordedAt || hmsVitalSigns.createdAt,
        status: 'final'
      }));
    }

    if (hmsVitalSigns.respiratoryRate) {
      observations.push(this.createVitalSignsObservation({
        patientId: hmsVitalSigns.patientId,
        practitionerId: hmsVitalSigns.practitionerId,
        encounterId: hmsVitalSigns.encounterId,
        vitalSign: 'respiratory-rate',
        value: hmsVitalSigns.respiratoryRate,
        unit: '/min',
        effectiveDateTime: hmsVitalSigns.recordedAt || hmsVitalSigns.createdAt,
        status: 'final'
      }));
    }

    if (hmsVitalSigns.oxygenSaturation) {
      observations.push(this.createVitalSignsObservation({
        patientId: hmsVitalSigns.patientId,
        practitionerId: hmsVitalSigns.practitionerId,
        encounterId: hmsVitalSigns.encounterId,
        vitalSign: 'oxygen-saturation',
        value: hmsVitalSigns.oxygenSaturation,
        unit: '%',
        effectiveDateTime: hmsVitalSigns.recordedAt || hmsVitalSigns.createdAt,
        status: 'final'
      }));
    }

    return observations;
  }
}

// Lab result categories and common test codes
export class FHIRLabUtils {
  /**
   * Common lab test codes;
   */
  static readonly COMMON_LAB_CODES = {
    // Complete Blood Count
    CBC: '58410-2',
    WBC: '6690-2',
    RBC: '789-8',
    HEMOGLOBIN: '718-7',
    HEMATOCRIT: '4544-3',
    PLATELETS: '777-3',

    // Basic Metabolic Panel
    GLUCOSE: '2345-7',
    SODIUM: '2947-0',
    POTASSIUM: '2823-3',
    CHLORIDE: '2075-0',
    BUN: '3094-0',
    CREATININE: '2160-0',

    // Liver Function
    ALT: '1742-6',
    AST: '1920-8',
    BILIRUBIN_TOTAL: '1975-2',
    ALBUMIN: '1751-7',

    // Lipid Panel
    CHOLESTEROL_TOTAL: '2093-3',
    HDL: '2085-9',
    LDL: '18262-6',
    TRIGLYCERIDES: '2571-8',

    // Cardiac Markers
    TROPONIN: '6598-7',
    CK_MB: '13969-1',
    BNP: '30934-4'
  };

  /**
   * Get reference ranges for common tests;
   */
  static getReferenceRange(testCode: string): { low?: number; high?: number; unit?: string } | null {
    const ranges: Record<string, { low?: number; high?: number; unit?: string }> = {
      [this.COMMON_LAB_CODES.GLUCOSE]: { low: 70, high: 100, unit: 'mg/dL' },
      [this.COMMON_LAB_CODES.HEMOGLOBIN]: { low: 12.0, high: 16.0, unit: 'g/dL' },
      [this.COMMON_LAB_CODES.WBC]: { low: 4.0, high: 11.0, unit: '10*3/uL' },
      [this.COMMON_LAB_CODES.CREATININE]: { low: 0.6, high: 1.2, unit: 'mg/dL' },
      [this.COMMON_LAB_CODES.CHOLESTEROL_TOTAL]: { high: 200, unit: 'mg/dL' }
    };

    return ranges[testCode] || null;
  }
