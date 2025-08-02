/**;
 * Core FHIR utilities for the Financial Management system;
 * Provides standardized FHIR resource handling and validation;
 */;

// FHIR Resource Types relevant to Financial Management;
export enum FHIRResourceType {
  ACCOUNT = "Account",
  CLAIM = "Claim",
  CLAIM_RESPONSE = "ClaimResponse",
  COVERAGE = "Coverage",
  PAYMENT_NOTICE = "PaymentNotice",
  PAYMENT_RECONCILIATION = "PaymentReconciliation",
  INVOICE = "Invoice",
  CHARGE_ITEM = "ChargeItem",

// FHIR Account resource interface (simplified);

  }>;
  status: "active" | "inactive" | "entered-in-error" | "on-hold" | "unknown",
  type?: {
    string,
      code: string,
    }>;
  };
  subject?: Array>;
  servicePeriod?: {start: string,
  };
  coverage?: Array>;
  owner?: {reference: string,
  description?: string;
  balance?: Array>;

// FHIR Claim resource interface (simplified);

  }>;
  status: "active" | "cancelled" | "draft" | "entered-in-error",
  Array<{system:string,
      code: string,
    }>;
  };
  use: "claim" | "preauthorization" | "predetermination",
  };
  created: string,
  };
  Array<{system:string,
      code: string,
    }>;
  };
  insurance: Array>,
  diagnosis?: Array<{sequence:number,
    Array<{system:string,
        code: string,
      }>;
    };
  }>;
  item?: Array<{sequence: number,
    Array<{system:string,
        code: string,
      }>;
    };
    servicedDate?: string;
    unitPrice?: {value:number,
      currency: string,
    net?: {value:number,
      currency: string,
  }>;
  total?: {value:number,
    currency: string,

// FHIR Coverage resource interface (simplified);

  }>;
  status: "active" | "cancelled" | "draft" | "entered-in-error",
  type?: {
    string,
      code: string,
    }>;
  };
  subscriber?: {reference: string,
  string;
  };
  relationship?: {
    string,
      code: string,
    }>;
  };
  period?: {start: string,
  };
  payor: Array>,
  class?: Array<{
    Array<{system:string,
        code: string,
      }>;
    };
    value: string,
  }>;

// FHIR Invoice resource interface (simplified);

  }>;
  status: "draft" | "issued" | "balanced" | "cancelled" | "entered-in-error",
  subject?: {reference: string,
  date: string,
  participant?: Array<{
    role?: {
      string,
        code: string,
      }>;
    };
    string;
    };
  }>;
  issuer?: {reference: string,
  account?: {reference: string,
  lineItem?: Array>;
  }>;
  totalNet?: {value:number,
    currency: string,
  totalGross?: {value:number,
    currency: string,

// FHIR PaymentReconciliation resource interface (simplified);

  }>;
  status: "active" | "cancelled" | "draft" | "entered-in-error",
  period?: {start: string,
  };
  created: string,
  paymentIssuer?: {reference: string,
  request?: {reference: string,
  outcome?: "complete" | "error" | "partial";
  disposition?: string;
  paymentDate: string,
  number,
    currency: string,
  paymentIdentifier?: {system:string,
    value: string,
  detail?: Array<{
    identifier?: {system:string,
      value: string,
    type?: {
      string,
        code: string,
      }>;
    };
    request?: {reference: string,
    response?: {reference: string,
    submitter?: {reference: string,
    payee?: {reference: string,
    date?: string;
    amount?: {value:number,
      currency: string,
  }>;

// Utility function to convert internal invoice to FHIR Invoice;
export const _convertToFHIRInvoice = (invoice: unknown): FHIRInvoice {,
  const statusMap: Record<string,
    "issued",
    "issued",
    "balanced",
    "cancelled",
    refunded: "balanced",

  return {resourceType: FHIRResourceType.INVOICE,
      }],
    status: statusMap[invoice.status] || "draft",
    `Patient/${invoice.patientId}`},
    date: invoice.invoiceDate,
    },
    `Account/${invoice.accountId}`} : undefined,
    lineItem: invoice.items.map((item: unknown, index + 1,
      `ChargeItem/${item.id}`,
      "base",
          item.unitPrice,
            currency: "USD",
        ...(item.discount > 0 ? [, type: "discount",
          -item.discount,
            currency: "USD"] : []),
          type: "tax",
          item.tax,
            currency: "USD"] : [])],})),
    invoice.totalAmount - invoice.taxAmount,
      currency: "USD",
    },
    invoice.totalAmount,
      currency: "USD",
    },

// Utility function to convert internal claim to FHIR Claim;
export const _convertToFHIRClaim = (claim: unknown): FHIRClaim {,
  const statusMap: Record<string,
    "active",
    "active",
    "active",
    "active",
    "cancelled";
  };

  return {resourceType: FHIRResourceType.CLAIM,
      }],
    status: statusMap[claim.status] || "draft",
    { coding: [, {system: "https://terminology.hl7.org/CodeSystem/claim-type",
         }]},
    use: "claim",
    `Patient/${claim.patientId}`},
    created: claim.createdAt,
    },
    [;
        {system: "https://terminology.hl7.org/CodeSystem/processpriority",
        }]},
    insurance: [;
      {sequence: 1,
        `Coverage/${claim.insurancePolicyId}`}],
    diagnosis: claim.diagnoses.map((diagnosis: unknown, index + 1,
      [;
          {system:"https://hl7.org/fhir/sid/icd-10",
            diagnosis.description, }]})),
    item: claim.items.map((item: unknown, index + 1,
      [;
          {system:"https://www.ama-assn.org/go/cpt",
            item.serviceItem.name, }],
      servicedDate: item.serviceDate,
      item.unitPrice,
        currency: "USD",
      item.totalPrice,
        currency: "USD",})),
    claim.totalAmount,
      currency: "USD",
    },

// Utility function to convert internal coverage to FHIR Coverage;
export const _convertToFHIRCoverage = (coverage: unknown): FHIRCoverage {
  return {resourceType: FHIRResourceType.COVERAGE,
      }],
    status: coverage.status === "active" ? "active" : "cancelled",
        {system: "https://terminology.hl7.org/CodeSystem/v3-ActCode",
        }],
    `Patient/${coverage.subscriberId}`,
    `Patient/${coverage.patientId}`,
    [;
        {system: "https://terminology.hl7.org/CodeSystem/subscriber-relationship",
        }],
    coverage.startDate,
      end: coverage.endDate,
    `Organization/${coverage.insuranceProviderId}`],
    class: [;
      {
        [;
            {system: "https://terminology.hl7.org/CodeSystem/coverage-class",
            }]},
        value: coverage.groupNumber,
        name: coverage.groupName,
      }],

// Utility function to validate FHIR resources;
export const _validateFHIRResource = (resource: unknown): boolean {,
  // For now, we'll do basic validation;

  if (!session.user) {
    return false;

  switch (resource.resourceType) {
    case FHIRResourceType.ACCOUNT: null,
      return validateFHIRAccount(resource),
    case FHIRResourceType.CLAIM: null,
      return validateFHIRClaim(resource),
    case FHIRResourceType.COVERAGE: null,
      return validateFHIRCoverage(resource),
    case FHIRResourceType.INVOICE: null,
      return validateFHIRInvoice(resource),
    case FHIRResourceType.PAYMENT_RECONCILIATION: return validateFHIRPaymentReconciliation(resource),

// Helper validation functions;
const validateFHIRAccount = (account: unknown): boolean {,

const validateFHIRClaim = (claim: unknown): boolean {,
         !!claim?.type &&;
         !!claim?.use &&;
         !!claim?.patient &&;
         !!claim?.created &&;
         !!claim?.provider &&;
         !!claim?.priority &&;
         Array.isArray(claim.insurance) &&;
         claim.insurance.length > 0;

const validateFHIRCoverage = (coverage: unknown): boolean {,
         !!coverage?.beneficiary &&;
         Array.isArray(coverage.payor) &&;
         coverage.payor.length > 0;

const validateFHIRInvoice = (invoice: unknown): boolean {,
         !!invoice.date;

const validateFHIRPaymentReconciliation = (paymentReconciliation: unknown): boolean {,
         !!paymentReconciliation?.created &&;
         !!paymentReconciliation?.paymentDate &&;
         !!paymentReconciliation.paymentAmount;
