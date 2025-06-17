

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
  status: "active" | "inactive" | "entered-in-error" | "on-hold" | "unknown";
  type?: {
    string,
      code: string;
      display?: string;
    }>;
  };
  subject?: Array>;
  servicePeriod?: {
    start: string;
    end?: string;
  };
  coverage?: Array>;
  owner?: {
    reference: string;
  };
  description?: string;
  balance?: Array>;


// FHIR Claim resource interface (simplified);

  }>;
  status: "active" | "cancelled" | "draft" | "entered-in-error",
  Array<{
      system: string,
      code: string;
      display?: string;
    }>;
  };
  use: "claim" | "preauthorization" | "predetermination",
  string;
  };
  created: string,
  string;
  };
  Array<{
      system: string,
      code: string;
      display?: string;
    }>;
  };
  insurance: Array>;
  diagnosis?: Array<{
    sequence: number,
    Array<{
        system: string,
        code: string;
        display?: string;
      }>;
    };
  }>;
  item?: Array<{
    sequence: number,
    Array<{
        system: string,
        code: string;
        display?: string;
      }>;
    };
    servicedDate?: string;
    unitPrice?: {
      value: number,
      currency: string;
    };
    net?: {
      value: number,
      currency: string;
    };
  }>;
  total?: {
    value: number,
    currency: string;
  };


// FHIR Coverage resource interface (simplified);

  }>;
  status: "active" | "cancelled" | "draft" | "entered-in-error";
  type?: {
    string,
      code: string;
      display?: string;
    }>;
  };
  subscriber?: {
    reference: string;
  };
  string;
  };
  relationship?: {
    string,
      code: string;
      display?: string;
    }>;
  };
  period?: {
    start: string;
    end?: string;
  };
  payor: Array>;
  class?: Array<{
    Array<{
        system: string,
        code: string;
        display?: string;
      }>;
    };
    value: string;
    name?: string;
  }>;


// FHIR Invoice resource interface (simplified);

  }>;
  status: "draft" | "issued" | "balanced" | "cancelled" | "entered-in-error";
  subject?: {
    reference: string;
  };
  date: string;
  participant?: Array<{
    role?: {
      string,
        code: string;
        display?: string;
      }>;
    };
    string;
    };
  }>;
  issuer?: {
    reference: string;
  };
  account?: {
    reference: string;
  };
  lineItem?: Array>;
  }>;
  totalNet?: {
    value: number,
    currency: string;
  };
  totalGross?: {
    value: number,
    currency: string;
  };


// FHIR PaymentReconciliation resource interface (simplified);

  }>;
  status: "active" | "cancelled" | "draft" | "entered-in-error";
  period?: {
    start: string;
    end?: string;
  };
  created: string;
  paymentIssuer?: {
    reference: string;
  };
  request?: {
    reference: string;
  };
  outcome?: "complete" | "error" | "partial";
  disposition?: string;
  paymentDate: string,
  number,
    currency: string;
  };
  paymentIdentifier?: {
    system: string,
    value: string;
  };
  detail?: Array<{
    identifier?: {
      system: string,
      value: string;
    };
    type?: {
      string,
        code: string;
        display?: string;
      }>;
    };
    request?: {
      reference: string;
    };
    response?: {
      reference: string;
    };
    submitter?: {
      reference: string;
    };
    payee?: {
      reference: string;
    };
    date?: string;
    amount?: {
      value: number,
      currency: string;
    };
  }>;


// Utility function to convert internal invoice to FHIR Invoice;
export const _convertToFHIRInvoice = (invoice: unknown): FHIRInvoice {
  // Map internal invoice status to FHIR Invoice status;
  const statusMap: Record<string, "draft" | "issued" | "balanced" | "cancelled" | "entered-in-error"> = {
    draft: "draft",
    "issued",
    "issued",
    "balanced",
    "cancelled",
    refunded: "balanced";
  };

  return {
    resourceType: FHIRResourceType.INVOICE,
    [;
      {
        system: "https://hospital.example.org/identifiers/invoice",
        value: invoice.invoiceNumber;
      },
    ],
    status: statusMap[invoice.status] || "draft",
    `Patient/${invoice.patientId}`},
    date: invoice.invoiceDate,
    "Organization/hospital";
    },
    `Account/${invoice.accountId}`} : undefined,
    lineItem: invoice.items.map((item: unknown, index + 1,
      `ChargeItem/${item.id}`,,
      "base",
          item.unitPrice,
            currency: "USD",,
        ...(item.discount > 0 ? [;
          type: "discount",
          -item.discount,
            currency: "USD",] : []),
        ...(item.tax > 0 ? [;
          type: "tax",
          item.tax,
            currency: "USD",] : []),
      ]})),
    invoice.totalAmount - invoice.taxAmount,
      currency: "USD";
    },
    invoice.totalAmount,
      currency: "USD";
    },



// Utility function to convert internal claim to FHIR Claim;
export const _convertToFHIRClaim = (claim: unknown): FHIRClaim {
  // Map internal claim status to FHIR Claim status;
  const statusMap: Record<string, "active" | "cancelled" | "draft" | "entered-in-error"> = {
    draft: "draft",
    "active",
    "active",
    "active",
    "active",
    "cancelled";
  };

  return {
    resourceType: FHIRResourceType.CLAIM,
    [;
      {
        system: "https://hospital.example.org/identifiers/claim",
        value: claim.claimNumber;
      },
    ],
    status: statusMap[claim.status] || "draft",
    {
      coding: [;
        {
          system: "https://terminology.hl7.org/CodeSystem/claim-type",
          "Institutional";
        },
      ]},
    use: "claim",
    `Patient/${claim.patientId}`},
    created: claim.createdAt,
    `Organization/hospital`;
    },
    [;
        {
          system: "https://terminology.hl7.org/CodeSystem/processpriority",
          "Normal";
        },
      ]},
    insurance: [;
      {
        sequence: 1,
        `Coverage/${claim.insurancePolicyId}`},
    ],
    diagnosis: claim.diagnoses.map((diagnosis: unknown, index + 1,
      [;
          {
            system: "https://hl7.org/fhir/sid/icd-10",
            diagnosis.description;
          },
        ]})),
    item: claim.items.map((item: unknown, index + 1,
      [;
          {
            system: "https://www.ama-assn.org/go/cpt",
            item.serviceItem.name;
          },
        ],,
      servicedDate: item.serviceDate,
      item.unitPrice,
        currency: "USD",
      item.totalPrice,
        currency: "USD"})),
    claim.totalAmount,
      currency: "USD";
    },



// Utility function to convert internal coverage to FHIR Coverage;
export const _convertToFHIRCoverage = (coverage: unknown): FHIRCoverage {
  return {
    resourceType: FHIRResourceType.COVERAGE,
    [;
      {
        system: "https://hospital.example.org/identifiers/coverage",
        value: coverage.policyNumber;
      },
    ],
    status: coverage.status === "active" ? "active" : "cancelled",
      coding: [;
        {
          system: "https://terminology.hl7.org/CodeSystem/v3-ActCode",
          coverage.typeName;
        },
      ],,
    `Patient/${coverage.subscriberId}`,,
    `Patient/${coverage.patientId}`,,
    [;
        {
          system: "https://terminology.hl7.org/CodeSystem/subscriber-relationship",
          coverage.relationshipName;
        },
      ],,
    coverage.startDate,
      end: coverage.endDate,
    `Organization/${coverage.insuranceProviderId}`,,
    ],
    class: [;
      {
        [;
            {
              system: "https://terminology.hl7.org/CodeSystem/coverage-class",
              "Group";
            },
          ]},
        value: coverage.groupNumber,
        name: coverage.groupName;
      },
    ],



// Utility function to validate FHIR resources;
export const _validateFHIRResource = (resource: unknown): boolean {
  // This would typically use a FHIR validation library;
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
    default: return false;



// Helper validation functions;
const validateFHIRAccount = (account: unknown): boolean {
  return !!account.status;


const validateFHIRClaim = (claim: unknown): boolean {
  return !!claim?.status &&;
         !!claim?.type &&;
         !!claim?.use &&;
         !!claim?.patient &&;
         !!claim?.created &&;
         !!claim?.provider &&;
         !!claim?.priority &&;
         Array.isArray(claim.insurance) &&;
         claim.insurance.length > 0;


const validateFHIRCoverage = (coverage: unknown): boolean {
  return !!coverage?.status &&;
         !!coverage?.beneficiary &&;
         Array.isArray(coverage.payor) &&;
         coverage.payor.length > 0;


const validateFHIRInvoice = (invoice: unknown): boolean {
  return !!invoice?.status &&;
         !!invoice.date;


const validateFHIRPaymentReconciliation = (paymentReconciliation: unknown): boolean {
  return !!paymentReconciliation?.status &&;
         !!paymentReconciliation?.created &&;
         !!paymentReconciliation?.paymentDate &&;
         !!paymentReconciliation.paymentAmount;
