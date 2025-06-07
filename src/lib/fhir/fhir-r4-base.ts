  var __DEV__: boolean;
  interface Window {
    [key: string]: any;
  }
  namespace NodeJS {
    interface Global {
      [key: string]: any;
    }
  }
}

/**
 * FHIR R4 Base Implementation;
 * Comprehensive FHIR R4 compliance for healthcare interoperability;
 */


// FHIR R4 Base Resource Interface;
export interface FHIRResource {
  resourceType: string;
  id?: string;
  meta?: FHIRMeta;
  implicitRules?: string;
  language?: string;
  text?: FHIRNarrative;
  contained?: FHIRResource[];
  extension?: FHIRExtension[];
  modifierExtension?: FHIRExtension[];
}

// FHIR Meta Information;
export interface FHIRMeta {
  versionId?: string;
  lastUpdated?: string;
  source?: string;
  profile?: string[];
  security?: FHIRCoding[];
  tag?: FHIRCoding[];
}

// FHIR Narrative;
export interface FHIRNarrative {
  status: 'generated' | 'extensions' | 'additional' | 'empty';
  div: string;
}

// FHIR Extension;
export interface FHIRExtension {
  url: string;
  valueString?: string;
  valueInteger?: number;
  valueDecimal?: number;
  valueBoolean?: boolean;
  valueDateTime?: string;
  valueCode?: string;
  valueCoding?: FHIRCoding;
  valueCodeableConcept?: FHIRCodeableConcept;
  valueReference?: FHIRReference;
  extension?: FHIRExtension[];
}

// FHIR Coding;
export interface FHIRCoding {
  system?: string;
  version?: string;
  code?: string;
  display?: string;
  userSelected?: boolean;
}

// FHIR CodeableConcept;
export interface FHIRCodeableConcept {
  coding?: FHIRCoding[];
  text?: string;
}

// FHIR Reference;
export interface FHIRReference {
  reference?: string;
  type?: string;
  identifier?: FHIRIdentifier;
  display?: string;
}

// FHIR Identifier;
export interface FHIRIdentifier {
  use?: 'usual' | 'official' | 'temp' | 'secondary' | 'old';
  type?: FHIRCodeableConcept;
  system?: string;
  value?: string;
  period?: FHIRPeriod;
  assigner?: FHIRReference;
}

// FHIR Period;
export interface FHIRPeriod {
  start?: string;
  end?: string;
}

// FHIR Quantity;
export interface FHIRQuantity {
  value?: number;
  comparator?: '<' | '<=' | '>=' | '>';
  unit?: string;
  system?: string;
  code?: string;
}

// FHIR Range;
export interface FHIRRange {
  low?: FHIRQuantity;
  high?: FHIRQuantity;
}

// FHIR Address;
export interface FHIRAddress {
  use?: 'home' | 'work' | 'temp' | 'old' | 'billing';
  type?: 'postal' | 'physical' | 'both';
  text?: string;
  line?: string[];
  city?: string;
  district?: string;
  state?: string;
  postalCode?: string;
  country?: string;
  period?: FHIRPeriod;
}

// FHIR ContactPoint;
export interface FHIRContactPoint {
  system?: 'phone' | 'fax' | 'email' | 'pager' | 'url' | 'sms' | 'other';
  value?: string;
  use?: 'home' | 'work' | 'temp' | 'old' | 'mobile';
  rank?: number;
  period?: FHIRPeriod;
}

// FHIR HumanName;
export interface FHIRHumanName {
  use?: 'usual' | 'official' | 'temp' | 'nickname' | 'anonymous' | 'old' | 'maiden';
  text?: string;
  family?: string;
  given?: string[];
  prefix?: string[];
  suffix?: string[];
  period?: FHIRPeriod;
}

// Patient Resource (FHIR R4)
export interface FHIRPatient extends FHIRResource {
  resourceType: 'Patient';
  identifier?: FHIRIdentifier[];
  active?: boolean;
  name?: FHIRHumanName[];
  telecom?: FHIRContactPoint[];
  gender?: 'male' | 'female' | 'other' | 'unknown';
  birthDate?: string;
  deceasedBoolean?: boolean;
  deceasedDateTime?: string;
  address?: FHIRAddress[];
  maritalStatus?: FHIRCodeableConcept;
  multipleBirthBoolean?: boolean;
  multipleBirthInteger?: number;
  photo?: FHIRAttachment[];
  contact?: FHIRPatientContact[];
  communication?: FHIRPatientCommunication[];
  generalPractitioner?: FHIRReference[];
  managingOrganization?: FHIRReference;
  link?: FHIRPatientLink[];
}

export interface FHIRPatientContact {
  relationship?: FHIRCodeableConcept[];
  name?: FHIRHumanName;
  telecom?: FHIRContactPoint[];
  address?: FHIRAddress;
  gender?: 'male' | 'female' | 'other' | 'unknown';
  organization?: FHIRReference;
  period?: FHIRPeriod;
}

export interface FHIRPatientCommunication {
  language: FHIRCodeableConcept;
  preferred?: boolean;
}

export interface FHIRPatientLink {
  other: FHIRReference;
  type: 'replaced-by' | 'replaces' | 'refer' | 'seealso';
}

export interface FHIRAttachment {
  contentType?: string;
  language?: string;
  data?: string;
  url?: string;
  size?: number;
  hash?: string;
  title?: string;
  creation?: string;
}

// Observation Resource (Lab Results)
export interface FHIRObservation extends FHIRResource {
  resourceType: 'Observation';
  identifier?: FHIRIdentifier[];
  basedOn?: FHIRReference[];
  partOf?: FHIRReference[];
  status: 'registered' | 'preliminary' | 'final' | 'amended' | 'corrected' | 'cancelled' | 'entered-in-error' | 'unknown';
  category?: FHIRCodeableConcept[];
  code: FHIRCodeableConcept;
  subject?: FHIRReference;
  focus?: FHIRReference[];
  encounter?: FHIRReference;
  effectiveDateTime?: string;
  effectivePeriod?: FHIRPeriod;
  issued?: string;
  performer?: FHIRReference[];
  valueQuantity?: FHIRQuantity;
  valueCodeableConcept?: FHIRCodeableConcept;
  valueString?: string;
  valueBoolean?: boolean;
  valueInteger?: number;
  valueRange?: FHIRRange;
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

export interface FHIRObservationReferenceRange {
  low?: FHIRQuantity;
  high?: FHIRQuantity;
  type?: FHIRCodeableConcept;
  appliesTo?: FHIRCodeableConcept[];
  age?: FHIRRange;
  text?: string;
}

export interface FHIRObservationComponent {
  code: FHIRCodeableConcept;
  valueQuantity?: FHIRQuantity;
  valueCodeableConcept?: FHIRCodeableConcept;
  valueString?: string;
  valueBoolean?: boolean;
  valueInteger?: number;
  valueRange?: FHIRRange;
  dataAbsentReason?: FHIRCodeableConcept;
  interpretation?: FHIRCodeableConcept[];
  referenceRange?: FHIRObservationReferenceRange[];
}

export interface FHIRAnnotation {
  authorReference?: FHIRReference;
  authorString?: string;
  time?: string;
  text: string;
}

// ServiceRequest Resource (Lab Orders)
export interface FHIRServiceRequest extends FHIRResource {
  resourceType: 'ServiceRequest';
  identifier?: FHIRIdentifier[];
  instantiatesCanonical?: string[];
  instantiatesUri?: string[];
  basedOn?: FHIRReference[];
  replaces?: FHIRReference[];
  requisition?: FHIRIdentifier;
  status: 'draft' | 'active' | 'on-hold' | 'revoked' | 'completed' | 'entered-in-error' | 'unknown';
  intent: 'proposal' | 'plan' | 'directive' | 'order' | 'original-order' | 'reflex-order' | 'filler-order' | 'instance-order' | 'option';
  category?: FHIRCodeableConcept[];
  priority?: 'routine' | 'urgent' | 'asap' | 'stat';
  doNotPerform?: boolean;
  code?: FHIRCodeableConcept;
  orderDetail?: FHIRCodeableConcept[];
  quantityQuantity?: FHIRQuantity;
  quantityRatio?: FHIRRatio;
  quantityRange?: FHIRRange;
  subject: FHIRReference;
  encounter?: FHIRReference;
  occurrenceDateTime?: string;
  occurrencePeriod?: FHIRPeriod;
  asNeededBoolean?: boolean;
  asNeededCodeableConcept?: FHIRCodeableConcept;
  authoredOn?: string;
  requester?: FHIRReference;
  performerType?: FHIRCodeableConcept;
  performer?: FHIRReference[];
  locationCode?: FHIRCodeableConcept[];
  locationReference?: FHIRReference[];
  reasonCode?: FHIRCodeableConcept[];
  reasonReference?: FHIRReference[];
  insurance?: FHIRReference[];
  supportingInfo?: FHIRReference[];
  specimen?: FHIRReference[];
  bodySite?: FHIRCodeableConcept[];
  note?: FHIRAnnotation[];
  patientInstruction?: string;
  relevantHistory?: FHIRReference[];
}

export interface FHIRRatio {
  numerator?: FHIRQuantity;
  denominator?: FHIRQuantity;
}

// MedicationRequest Resource (Prescriptions)
export interface FHIRMedicationRequest extends FHIRResource {
  resourceType: 'MedicationRequest';
  identifier?: FHIRIdentifier[];
  status: 'active' | 'on-hold' | 'cancelled' | 'completed' | 'entered-in-error' | 'stopped' | 'draft' | 'unknown';
  statusReason?: FHIRCodeableConcept;
  intent: 'proposal' | 'plan' | 'order' | 'original-order' | 'reflex-order' | 'filler-order' | 'instance-order' | 'option';
  category?: FHIRCodeableConcept[];
  priority?: 'routine' | 'urgent' | 'asap' | 'stat';
  doNotPerform?: boolean;
  reportedBoolean?: boolean;
  reportedReference?: FHIRReference;
  medicationCodeableConcept?: FHIRCodeableConcept;
  medicationReference?: FHIRReference;
  subject: FHIRReference;
  encounter?: FHIRReference;
  supportingInformation?: FHIRReference[];
  authoredOn?: string;
  requester?: FHIRReference;
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
}

export interface FHIRDosage {
  sequence?: number;
  text?: string;
  additionalInstruction?: FHIRCodeableConcept[];
  patientInstruction?: string;
  timing?: FHIRTiming;
  asNeededBoolean?: boolean;
  asNeededCodeableConcept?: FHIRCodeableConcept;
  site?: FHIRCodeableConcept;
  route?: FHIRCodeableConcept;
  method?: FHIRCodeableConcept;
  doseAndRate?: FHIRDosageDoseAndRate[];
  maxDosePerPeriod?: FHIRRatio;
  maxDosePerAdministration?: FHIRQuantity;
  maxDosePerLifetime?: FHIRQuantity;
}

export interface FHIRTiming {
  event?: string[];
  repeat?: FHIRTimingRepeat;
  code?: FHIRCodeableConcept;
}

export interface FHIRTimingRepeat {
  boundsDuration?: FHIRDuration;
  boundsRange?: FHIRRange;
  boundsPeriod?: FHIRPeriod;
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
  dayOfWeek?: ('mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat' | 'sun')[];
  timeOfDay?: string[];
  when?: ('MORN' | 'MORN.early' | 'MORN.late' | 'NOON' | 'AFT' | 'AFT.early' | 'AFT.late' | 'EVE' | 'EVE.early' | 'EVE.late' | 'NIGHT' | 'PHS' | 'HS' | 'WAKE' | 'C' | 'CM' | 'CD' | 'CV' | 'AC' | 'ACM' | 'ACD' | 'ACV' | 'PC' | 'PCM' | 'PCD' | 'PCV')[];
  offset?: number;
}

export interface FHIRDuration {
  value?: number;
  comparator?: '<' | '<=' | '>=' | '>';
  unit?: string;
  system?: string;
  code?: string;
}

export interface FHIRDosageDoseAndRate {
  type?: FHIRCodeableConcept;
  doseRange?: FHIRRange;
  doseQuantity?: FHIRQuantity;
  rateRatio?: FHIRRatio;
  rateRange?: FHIRRange;
  rateQuantity?: FHIRQuantity;
}

export interface FHIRMedicationRequestDispenseRequest {
  initialFill?: FHIRMedicationRequestDispenseRequestInitialFill;
  dispenseInterval?: FHIRDuration;
  validityPeriod?: FHIRPeriod;
  numberOfRepeatsAllowed?: number;
  quantity?: FHIRQuantity;
  expectedSupplyDuration?: FHIRDuration;
  performer?: FHIRReference;
}

export interface FHIRMedicationRequestDispenseRequestInitialFill {
  quantity?: FHIRQuantity;
  duration?: FHIRDuration;
}

export interface FHIRMedicationRequestSubstitution {
  allowedBoolean?: boolean;
  allowedCodeableConcept?: FHIRCodeableConcept;
  reason?: FHIRCodeableConcept;
}

// Base FHIR Manager Class;
export abstract class FHIRResourceManager<T extends FHIRResource> {
  protected resourceType: string;

  constructor(resourceType: string) {
    this.resourceType = resourceType;
  }

  // Generate FHIR-compliant ID;
  generateId(): string {
    return uuidv4();
  }

  // Create basic meta information;
  createMeta(source?: string): FHIRMeta {
    return {
      versionId: '1',
      lastUpdated: new Date().toISOString(),
      source: source || 'HMS',
    };
  }

  // Create narrative;
  createNarrative(content: string, status: FHIRNarrative['status'] = 'generated'): FHIRNarrative {
    return {
      status,
      div: `<div xmlns="http://www.w3.org/1999/xhtml">${content}</div>`,
    };
  }

  // Create coding;
  createCoding(system: string, code: string, display?: string): FHIRCoding {
    return {
      system,
      code,
      display,
    };
  }

  // Create CodeableConcept;
  createCodeableConcept(codings: FHIRCoding[], text?: string): FHIRCodeableConcept {
    return {
      coding: codings,
      text,
    };
  }

  // Create identifier;
  createIdentifier(system: string, value: string, use?: FHIRIdentifier['use']): FHIRIdentifier {
    return {
      use: use || 'usual',
      system,
      value,
    };
  }

  // Create reference;
  createReference(resourceType: string, id: string, display?: string): FHIRReference {
    return {
      reference: `${resourceType}/${id}`,
      display,
    };
  }

  // Validate resource structure;
  abstract validate(resource: T): boolean;

  // Convert to/from internal format;
  abstract toFHIR(internalData: unknown): T;
  abstract fromFHIR(fhirResource: T): unknown;
}

// FHIR Bundle for transaction operations;
export interface FHIRBundle extends FHIRResource {
  resourceType: 'Bundle';
  identifier?: FHIRIdentifier;
  type: 'document' | 'message' | 'transaction' | 'transaction-response' | 'batch' | 'batch-response' | 'history' | 'searchset' | 'collection';
  timestamp?: string;
  total?: number;
  link?: FHIRBundleLink[];
  entry?: FHIRBundleEntry[];
  signature?: FHIRSignature;
}

export interface FHIRBundleLink {
  relation: string;
  url: string;
}

export interface FHIRBundleEntry {
  link?: FHIRBundleLink[];
  fullUrl?: string;
  resource?: FHIRResource;
  search?: FHIRBundleEntrySearch;
  request?: FHIRBundleEntryRequest;
  response?: FHIRBundleEntryResponse;
}

export interface FHIRBundleEntrySearch {
  mode?: 'match' | 'include' | 'outcome';
  score?: number;
}

export interface FHIRBundleEntryRequest {
  method: 'GET' | 'HEAD' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  url: string;
  ifNoneMatch?: string;
  ifModifiedSince?: string;
  ifMatch?: string;
  ifNoneExist?: string;
}

export interface FHIRBundleEntryResponse {
  status: string;
  location?: string;
  etag?: string;
  lastModified?: string;
  outcome?: FHIRResource;
}

export interface FHIRSignature {
  type: FHIRCoding[];
  when: string;
  who: FHIRReference;
  onBehalfOf?: FHIRReference;
  targetFormat?: string;
  sigFormat?: string;
  data?: string;
}

// Common terminology systems;
export const FHIR_SYSTEMS = {
  // Patient identifiers;
  MRN: 'http://hospital.local/patient-mrn',
  SSN: 'http://hl7.org/fhir/sid/us-ssn',
  
  // Lab codes;
  LOINC: 'http://loinc.org',
  SNOMED_CT: 'http://snomed.info/sct',
  
  // Medication codes;
  RXNORM: 'http://www.nlm.nih.gov/research/umls/rxnorm',
  NDC: 'http://hl7.org/fhir/sid/ndc',
  
  // Units;
  UCUM: 'http://unitsofmeasure.org',
  
  // Administrative;
  V2_0203: 'http://terminology.hl7.org/CodeSystem/v2-0203',
  V3_ROLE_CODE: 'http://terminology.hl7.org/CodeSystem/v3-RoleCode',
  
  // Observation categories;
  OBSERVATION_CATEGORY: 'http://terminology.hl7.org/CodeSystem/observation-category',
  
  // Request priorities;
  REQUEST_PRIORITY: 'http://hl7.org/fhir/request-priority',
  
  // Medication request categories;
  MEDICATIONREQUEST_CATEGORY: 'http://terminology.hl7.org/CodeSystem/medicationrequest-category',
} as const;

// FHIR Validation utilities;
export class FHIRValidator {
  static isValidResourceType(resourceType: string): boolean {
    const validTypes = [
      'Patient', 'Observation', 'ServiceRequest', 'MedicationRequest',
      'Practitioner', 'Organization', 'Encounter', 'DiagnosticReport',
      'Specimen', 'Device', 'Location', 'Bundle';
    ];
    return validTypes.includes(resourceType);
  }

  static isValidDateTime(dateTime: string): boolean {
    const regex = /^(\d{4})(-\d{2})?(-\d{2})?(T\d{2}:\d{2}(:\d{2})?(\.\d{3})?(Z|[+-]\d{2}:\d{2})?)?$/;
    return regex.test(dateTime);
  }

  static isValidId(id: string): boolean {
    const regex = /^[A-Za-z0-9\-\.]{1,64}$/;
    return regex.test(id);
  }

  static isValidCode(code: string): boolean {
    // Basic code validation - should not be empty and follow FHIR code pattern;
    const regex = /^[^\s]+(\s[^\s]+)*$/;
    return code && code.length > 0 && regex.test(code);
  }

  static validateRequired(value: unknown, fieldName: string): void {
    if (value === undefined || value === null) {
      throw new Error(`Required field '${fieldName}' is missing`);
    }
  }
}

export default FHIRResourceManager;
