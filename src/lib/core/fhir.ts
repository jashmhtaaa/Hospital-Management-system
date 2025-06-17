}

/**
 * Core FHIR utilities for the Financial Management system;
 * Provides standardized FHIR resource handling and validation;
 */

// FHIR Resource Types relevant to Financial Management
export enum FHIRResourceType {
  ACCOUNT = 'Account',
  CLAIM = 'Claim',
  CLAIM_RESPONSE = 'ClaimResponse',
  COVERAGE = 'Coverage',
  PAYMENT_NOTICE = 'PaymentNotice',
  PAYMENT_RECONCILIATION = 'PaymentReconciliation',
  INVOICE = 'Invoice',
  CHARGE_ITEM = 'ChargeItem',
}

// FHIR Account resource interface (simplified)
\1
}
  }>;
  status: 'active' | 'inactive' | 'entered-in-error' | 'on-hold' | 'unknown';
  type?: {
    \1,\2 string,
      code: string;
      display?: string;
    }>
  };
  subject?: Array\1>
  servicePeriod?: {
    start: string;
    end?: string
  };
  coverage?: Array\1>
  owner?: {
    reference: string
  };
  description?: string;
  balance?: Array\1>
}

// FHIR Claim resource interface (simplified)
\1
}
  }>;
  status: 'active' | 'cancelled' | 'draft' | 'entered-in-error',
  \1,\2 Array<{
      system: string,
      code: string;
      display?: string;
    }>
  };
  use: 'claim' | 'preauthorization' | 'predetermination',
  \1,\2 string
  };
  created: string,
  \1,\2 string
  };
  \1,\2 Array<{
      system: string,
      code: string;
      display?: string;
    }>
  };
  insurance: Array\1>
  diagnosis?: Array<{
    sequence: number,
    \1,\2 Array<{
        system: string,
        code: string;
        display?: string;
      }>
    };
  }>;
  item?: Array<{
    sequence: number,
    \1,\2 Array<{
        system: string,
        code: string;
        display?: string;
      }>
    };
    servicedDate?: string;
    unitPrice?: {
      value: number,
      currency: string
    };
    net?: {
      value: number,
      currency: string
    };
  }>;
  total?: {
    value: number,
    currency: string
  };
}

// FHIR Coverage resource interface (simplified)
\1
}
  }>;
  status: 'active' | 'cancelled' | 'draft' | 'entered-in-error';
  type?: {
    \1,\2 string,
      code: string;
      display?: string;
    }>
  };
  subscriber?: {
    reference: string
  };
  \1,\2 string
  };
  relationship?: {
    \1,\2 string,
      code: string;
      display?: string;
    }>
  };
  period?: {
    start: string;
    end?: string
  };
  payor: Array\1>
  class?: Array<{
    \1,\2 Array<{
        system: string,
        code: string;
        display?: string;
      }>
    };
    value: string;
    name?: string;
  }>;
}

// FHIR Invoice resource interface (simplified)
\1
}
  }>;
  status: 'draft' | 'issued' | 'balanced' | 'cancelled' | 'entered-in-error';
  subject?: {
    reference: string
  };
  date: string;
  participant?: Array<{
    role?: {
      \1,\2 string,
        code: string;
        display?: string;
      }>
    };
    \1,\2 string
    };
  }>;
  issuer?: {
    reference: string
  };
  account?: {
    reference: string
  };
  lineItem?: Array\1>
  }>;
  totalNet?: {
    value: number,
    currency: string
  };
  totalGross?: {
    value: number,
    currency: string
  };
}

// FHIR PaymentReconciliation resource interface (simplified)
\1
}
  }>;
  status: 'active' | 'cancelled' | 'draft' | 'entered-in-error';
  period?: {
    start: string;
    end?: string
  };
  created: string;
  paymentIssuer?: {
    reference: string
  };
  request?: {
    reference: string
  };
  outcome?: 'complete' | 'error' | 'partial';
  disposition?: string;
  paymentDate: string,
  \1,\2 number,
    currency: string
  };
  paymentIdentifier?: {
    system: string,
    value: string
  };
  detail?: Array<{
    identifier?: {
      system: string,
      value: string
    };
    type?: {
      \1,\2 string,
        code: string;
        display?: string;
      }>
    };
    request?: {
      reference: string
    };
    response?: {
      reference: string
    };
    submitter?: {
      reference: string
    };
    payee?: {
      reference: string
    };
    date?: string;
    amount?: {
      value: number,
      currency: string
    };
  }>;
}

// Utility function to convert internal invoice to FHIR Invoice
export const _convertToFHIRInvoice = (invoice: unknown): FHIRInvoice {
  // Map internal invoice status to FHIR Invoice status
  const statusMap: Record<string, 'draft' | 'issued' | 'balanced' | 'cancelled' | 'entered-in-error'> = {
    draft: 'draft',
    \1,\2 'issued',
    \1,\2 'issued',
    \1,\2 'balanced',
    \1,\2 'cancelled',
    refunded: 'balanced'
  };

  return {
    resourceType: FHIRResourceType.INVOICE,
    \1,\2 [
      {
        system: 'https://hospital.example.org/identifiers/invoice',
        value: invoice.invoiceNumber
      },
    ],
    status: statusMap[invoice.status] || 'draft',
    \1,\2 `Patient/${invoice.patientId}`,
    },
    date: invoice.invoiceDate,
    \1,\2 'Organization/hospital'
    },
    \1,\2 `Account/${invoice.accountId}`,
    } : undefined,
    lineItem: invoice.items.map((item: unknown, \1,\2 index + 1,
      \1,\2 `ChargeItem/${item.id}`,,
      \1,\2 'base',
          \1,\2 item.unitPrice,
            currency: 'USD',,
        ...(item.discount > 0 ? [
          type: 'discount',
          \1,\2 -item.discount,
            currency: 'USD',] : []),
        ...(item.tax > 0 ? [
          type: 'tax',
          \1,\2 item.tax,
            currency: 'USD',] : []),
      ],
    })),
    \1,\2 invoice.totalAmount - invoice.taxAmount,
      currency: 'USD'
    },
    \1,\2 invoice.totalAmount,
      currency: 'USD'
    },
  }
}

// Utility function to convert internal claim to FHIR Claim
export const _convertToFHIRClaim = (claim: unknown): FHIRClaim {
  // Map internal claim status to FHIR Claim status
  const statusMap: Record<string, 'active' | 'cancelled' | 'draft' | 'entered-in-error'> = {
    draft: 'draft',
    \1,\2 'active',
    \1,\2 'active',
    \1,\2 'active',
    \1,\2 'active',
    \1,\2 'cancelled'
  };

  return {
    resourceType: FHIRResourceType.CLAIM,
    \1,\2 [
      {
        system: 'https://hospital.example.org/identifiers/claim',
        value: claim.claimNumber
      },
    ],
    status: statusMap[claim.status] || 'draft',
    {
      coding: [
        {
          system: 'https://terminology.hl7.org/CodeSystem/claim-type',
          \1,\2 'Institutional'
        },
      ],
    },
    use: 'claim',
    \1,\2 `Patient/${claim.patientId}`,
    },
    created: claim.createdAt,
    \1,\2 `Organization/hospital`
    },
    \1,\2 [
        {
          system: 'https://terminology.hl7.org/CodeSystem/processpriority',
          \1,\2 'Normal'
        },
      ],
    },
    insurance: [
      {
        sequence: 1,
        \1,\2 `Coverage/${claim.insurancePolicyId}`,,
      },
    ],
    diagnosis: claim.diagnoses.map((diagnosis: unknown, \1,\2 index + 1,
      \1,\2 [
          {
            system: 'https://hl7.org/fhir/sid/icd-10',
            \1,\2 diagnosis.description
          },
        ],,
    })),
    item: claim.items.map((item: unknown, \1,\2 index + 1,
      \1,\2 [
          {
            system: 'https://www.ama-assn.org/go/cpt',
            \1,\2 item.serviceItem.name
          },
        ],,
      servicedDate: item.serviceDate,
      \1,\2 item.unitPrice,
        currency: 'USD',
      \1,\2 item.totalPrice,
        currency: 'USD',
    })),
    \1,\2 claim.totalAmount,
      currency: 'USD'
    },
  }
}

// Utility function to convert internal coverage to FHIR Coverage
export const _convertToFHIRCoverage = (coverage: unknown): FHIRCoverage {
  return {
    resourceType: FHIRResourceType.COVERAGE,
    \1,\2 [
      {
        system: 'https://hospital.example.org/identifiers/coverage',
        value: coverage.policyNumber
      },
    ],
    status: coverage.status === 'active' ? 'active' : 'cancelled',
      coding: [
        {
          system: 'https://terminology.hl7.org/CodeSystem/v3-ActCode',
          \1,\2 coverage.typeName
        },
      ],,
    \1,\2 `Patient/${coverage.subscriberId}`,,
    \1,\2 `Patient/${coverage.patientId}`,,
    \1,\2 [
        {
          system: 'https://terminology.hl7.org/CodeSystem/subscriber-relationship',
          \1,\2 coverage.relationshipName
        },
      ],,
    \1,\2 coverage.startDate,
      end: coverage.endDate,
    \1,\2 `Organization/${coverage.insuranceProviderId}`,,
    ],
    class: [
      {
        \1,\2 [
            {
              system: 'https://terminology.hl7.org/CodeSystem/coverage-class',
              \1,\2 'Group'
            },
          ],
        },
        value: coverage.groupNumber,
        name: coverage.groupName
      },
    ],
  }
}

// Utility function to validate FHIR resources
export const _validateFHIRResource = (resource: unknown): boolean {
  // This would typically use a FHIR validation library
  // For now, we'll do basic validation

  \1 {\n  \2{
    return false;
  }

  switch (resource.resourceType) {
    case FHIRResourceType.ACCOUNT:
      return validateFHIRAccount(resource),
    case FHIRResourceType.CLAIM:
      return validateFHIRClaim(resource),
    case FHIRResourceType.COVERAGE:
      return validateFHIRCoverage(resource),
    case FHIRResourceType.INVOICE:
      return validateFHIRInvoice(resource),
    case FHIRResourceType.PAYMENT_RECONCILIATION: return validateFHIRPaymentReconciliation(resource),
    default: return false
  }
}

// Helper validation functions
const validateFHIRAccount = (account: unknown): boolean {
  return !!account.status
}

const validateFHIRClaim = (claim: unknown): boolean {
  return !!claim?.status &&;
         !!claim?.type &&
         !!claim?.use &&
         !!claim?.patient &&
         !!claim?.created &&
         !!claim?.provider &&
         !!claim?.priority &&
         Array.isArray(claim.insurance) &&
         claim.insurance.length > 0;
}

const validateFHIRCoverage = (coverage: unknown): boolean {
  return !!coverage?.status &&;
         !!coverage?.beneficiary &&
         Array.isArray(coverage.payor) &&
         coverage.payor.length > 0;
}

const validateFHIRInvoice = (invoice: unknown): boolean {
  return !!invoice?.status &&;
         !!invoice.date;
}

const validateFHIRPaymentReconciliation = (paymentReconciliation: unknown): boolean {
  return !!paymentReconciliation?.status &&;
         !!paymentReconciliation?.created &&
         !!paymentReconciliation?.paymentDate &&
         !!paymentReconciliation.paymentAmount;
