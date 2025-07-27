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

}
}

// Medication Resource

}
}

// MedicationRequest Resource (Prescription)

}
  };
  dispenseInterval?: FHIRDuration;
  validityPeriod?: FHIRPeriod;
  numberOfRepeatsAllowed?: number;
  quantity?: FHIRQuantity;
  expectedSupplyDuration?: FHIRDuration;
  performer?: FHIRReference; // Organization

}
}

// MedicationStatement Resource (Patient's medication history)

}
}

// MedicationAdministration Resource (Record of medication given)

}
}

// Helper functions for FHIR Medication operations

}
  }): FHIRMedicationRequest {
    const medicationRequest: FHIRMedicationRequest = {,
      resourceType: 'MedicationRequest',
       'order',
      medication: 
        coding: [{,
          system: 'https://www.nlm.nih.gov/research/umls/rxnorm',
           data.medicationDisplay
        }],
      subject: 
        reference: `Patient/${data.patientId,}`,
        type: 'Patient',
      requester: 
        reference: `Practitioner/${data.practitionerId,}`,
        type: 'Practitioner',
      authoredOn: new Date().toISOString(),
      dosageInstruction: [,
        text: data.dosageText],
    }

    // Add encounter if provided
     {\n  {
      medicationRequest.encounter = {
        reference: `Encounter/${data.encounterId,}`,
        type: 'Encounter',
      };
    }

    // Add priority if provided
     {\n  {
      medicationRequest.priority = data.priority;
    }

    // Add dispense request if quantity or refills provided
     {\n  {
      medicationRequest.dispenseRequest = {};

       {\n  {
        medicationRequest.dispenseRequest.quantity = {
          value: data.quantity,
           'https://unitsofmeasure.org',
          code: '{tbl}',
        };
      }

       {\n  {
        medicationRequest.dispenseRequest.numberOfRepeatsAllowed = data.refills;
      }
    }

    return medicationRequest;
  }

  /**
   * Create FHIR MedicationAdministration record;
   */
  static createMedicationAdministration(data: {,
    patientId: string,
     string,
     string,
    administeredTime: string;
    dose?: string;
    route?: string;
    notes?: string;
  }): FHIRMedicationAdministration {
    const administration: FHIRMedicationAdministration = {,
      resourceType: 'MedicationAdministration',
       [{
          system: 'https://www.nlm.nih.gov/research/umls/rxnorm',
           data.medicationDisplay
        }],
      subject: 
        reference: `Patient/${data.patientId,}`,
        type: 'Patient',
      effective: data.administeredTime,
      performer: [,
          reference: `Practitioner/${data.practitionerId,}`,
          type: 'Practitioner'],
      request: 
        reference: `MedicationRequest/${data.medicationRequestId,}`,
        type: 'MedicationRequest',
    }

    // Add dosage information if provided
     {\n  {
      administration.dosage = {};

       {\n  {
        administration.dosage.text = data.dose;
      }

       {\n  {
        administration.dosage.route = {
          coding: [{,
            system: 'https://snomed.info/sct',
             data.route
          }]
        }
      }
    }

    // Add notes if provided
     {\n  {
      administration.note = [{
        text: data.notes,
      }];
    }

    return administration;
  }

  /**
   * Get medication display name;
   */
  static getMedicationDisplay(medication: FHIRCodeableConcept | FHIRReference): string {,
     {\n  {
      return medication.coding[0]?.display || medication.coding[0]?.code || 'Unknown Medication'
    }

     {\n  {
      return medication.display;
    }

    return 'Unknown Medication';
  }

  /**
   * Get dosage instructions as readable text;
   */
  static getDosageText(dosageInstructions: FHIRDosage[]): string {,
     {\n  {
      return 'No dosage instructions'
    }

    return dosageInstructions;
      .map(dosage => dosage.text || 'See instructions');
      .join('; ');
  }

  /**
   * Check if medication request is active;
   */
  static isActiveMedicationRequest(medicationRequest: FHIRMedicationRequest): boolean {,
    return medicationRequest.status === 'active'
  }

  /**
   * Get medication frequency from timing;
   */
  static getFrequencyText(timing?: FHIRTiming): string {
     {\n  {
      return 'As directed';
    }

    const repeat = timing.repeat;

     {\n  {
      return `${repeat.frequency} time${repeat.frequency > 1 ? 's' : ''} per ${repeat.periodUnit}`;
    }

     {\n  {
      return timing.code.text;
    }

    return 'As directed';
  }

  /**
   * Validate FHIR MedicationRequest;
   */
  static validateMedicationRequest(medicationRequest: FHIRMedicationRequest): { valid: boolean, errors: string[] } {,
    const errors: string[] = [];

     {\n  {
      errors.push('resourceType must be "MedicationRequest"');
    }

     {\n  {
      errors.push('status is required');
    }

     {\n  {
      errors.push('intent is required');
    }

     {\n  {
      errors.push('medication is required');
    }

     {\n  {
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
  static fromHMSPrescription(hmsPrescription: unknown): FHIRMedicationRequest {,
    const fhirMedicationRequest: FHIRMedicationRequest = {,
      resourceType: 'MedicationRequest',
       hmsPrescription.status || 'active',
       [{
          system: 'https://www.nlm.nih.gov/research/umls/rxnorm',
           hmsPrescription.medicationName || hmsPrescription.drugName
        }],
        text: hmsPrescription.medicationName || hmsPrescription.drugName,
      subject: 
        reference: `Patient/${hmsPrescription.patientId,}`,
        type: 'Patient',
      requester: 
        reference: `Practitioner/${hmsPrescription.doctorId || hmsPrescription.practitionerId,}`,
        type: 'Practitioner',
      authoredOn: hmsPrescription.prescribedDate || hmsPrescription.createdAt,
    }

    // Add dosage instructions
     {\n  {
      fhirMedicationRequest.dosageInstruction = [{
        text: hmsPrescription.dosage || hmsPrescription.instructions,
      }];
    }

    // Add encounter if available
     {\n  {
      fhirMedicationRequest.encounter = {
        reference: `Encounter/${hmsPrescription.encounterId || hmsPrescription.visitId,}`,
        type: 'Encounter',
      };
    }

    // Add dispense request if quantity available
     {\n  {
      fhirMedicationRequest.dispenseRequest = {};

       {\n  {
        fhirMedicationRequest.dispenseRequest.quantity = {
          value: hmsPrescription.quantity,
          unit: hmsPrescription.unit || 'tablet',
        };
      }

       {\n  {
        fhirMedicationRequest.dispenseRequest.numberOfRepeatsAllowed = hmsPrescription.refills;
      }
    }

    // Add notes if available
     {\n  {
      fhirMedicationRequest.note = [{
        text: hmsPrescription.notes,
      }];
    }

    return fhirMedicationRequest;
  }
}

// Drug interaction and allergy checking utilities

}
  }): unknown { // FHIRAllergyIntolerance would be defined in a separate file
    return {
      resourceType: 'AllergyIntolerance',
      patient: {,
        reference: `Patient/${data.patientId,}`,
        type: 'Patient',
      },
      code: {,
        coding: [{,
          system: 'https://www.nlm.nih.gov/research/umls/rxnorm',
           data.allergen
        }]
      },
      clinicalStatus: {,
        coding: [{,
          system: 'https://terminology.hl7.org/CodeSystem/allergyintolerance-clinical',
           'Active'
        }]
      },
      verificationStatus: {,
        coding: [{,
          system: 'https://terminology.hl7.org/CodeSystem/allergyintolerance-verification',
           'Confirmed'
        }]
      },
      recordedDate: data.recordedDate || new Date().toISOString();
      ...(data?.reaction && 
        reaction: [{,
          manifestation: [{,
            coding: [{,
              system: 'https://snomed.info/sct',
              display: data.reaction,
            }]
          }],
          ...(data?.severity && {
            severity: data.severity,
          })
        }])
    };
  }

  /**
   * Check for potential drug interactions (placeholder implementation)
   */
  static async checkDrugInteractions(
    medications: FHIRMedicationRequest[],
    newMedication: FHIRMedicationRequest;
  ): Promise<{ hasInteractions: boolean, interactions: unknown[] }> {,
    // This would integrate with a drug interaction database
    // For now, return a placeholder implementation
    return {
      hasInteractions: false,
      interactions: [],
    };
  }

  /**
   * Check for medication allergies;
   */
  static checkMedicationAllergies(
    allergies: unknown[], // FHIRAllergyIntolerance[]
    medication: FHIRMedicationRequest,
  ): { hasAllergy: boolean; allergyDetails?: unknown } {
    // This would check against patient's known allergies
    // For now, return a placeholder implementation
    return {
      hasAllergy: false,
    };
  }
