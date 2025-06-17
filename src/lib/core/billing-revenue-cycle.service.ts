
import { z } from 'zod';
}

/**
 * Billing & Revenue Cycle Management Service;
 * Complete financial management with charge capture, insurance processing, and claims management;
 */

// Billing Schemas
export const ServiceCatalogSchema = z.object({
  service_code: z.string().min(1, 'Service code is required'),
  cpt_code: z.string().optional(),
  hcpcs_code: z.string().optional(),
  service_name: z.string().min(1, 'Service name is required'),
  description: z.string().optional(),
  department: z.string().min(1, 'Department is required'),
  category: z.enum(['consultation', 'procedure', 'diagnostic', 'therapy', 'surgery', 'lab', 'imaging', 'emergency']),
  base_price: z.number().min(0, 'Price must be non-negative'),
  medicare_rate: z.number().min(0).optional(),
  medicaid_rate: z.number().min(0).optional(),
  commercial_rate: z.number().min(0).optional(),
  cash_rate: z.number().min(0).optional(),
  relative_value_units: z.number().min(0).optional(),
  billable: z.boolean().default(true),
  requires_authorization: z.boolean().default(false),
  bundled_services: z.array(z.string()).default([]),
  modifiers: z.array(z.string()).default([]),
  is_active: z.boolean().default(true)
});

export const ChargeSchema = z.object({
  patient_id: z.string().min(1, 'Patient ID is required'),
  encounter_id: z.string().min(1, 'Encounter ID is required'),
  provider_id: z.string().min(1, 'Provider ID is required'),
  service_code: z.string().min(1, 'Service code is required'),
  service_date: z.string().refine((date) => !isNaN(Date.parse(date)), 'Invalid service date'),
  quantity: z.number().min(1, 'Quantity must be at least 1').default(1),
  unit_price: z.number().min(0, 'Unit price must be non-negative'),
  total_charge: z.number().min(0, 'Total charge must be non-negative'),
  diagnosis_codes: z.array(z.string()).min(1, 'At least one diagnosis code is required'),
  modifiers: z.array(z.string()).default([]),
  place_of_service: z.string().optional(),
  referring_provider_id: z.string().optional(),
  authorization_number: z.string().optional(),
  charge_status: z.enum(['pending', 'submitted', 'paid', 'denied', 'appealed', 'written_off']).default('pending'),
  notes: z.string().optional()
});

export const InsuranceClaimSchema = z.object({
  patient_id: z.string().min(1, 'Patient ID is required'),
  encounter_id: z.string().min(1, 'Encounter ID is required'),
  insurance_plan_id: z.string().min(1, 'Insurance plan ID is required'),
  claim_type: z.enum(['primary', 'secondary', 'tertiary']).default('primary'),
  charges: z.array(z.string()).min(1, 'At least one charge is required'),
  total_amount: z.number().min(0, 'Total amount must be non-negative'),
  diagnosis_codes: z.array(z.string()).min(1, 'At least one diagnosis code is required'),
  procedure_codes: z.array(z.string()).min(1, 'At least one procedure code is required'),
  place_of_service: z.string(),
  accident_related: z.boolean().default(false),
  emergency_related: z.boolean().default(false),
  referring_provider_npi: z.string().optional(),
  facility_npi: z.string().optional(),
  submission_method: z.enum(['electronic', 'paper']).default('electronic'),
  priority: z.enum(['normal', 'urgent']).default('normal'),
});

export const PaymentSchema = z.object({
  patient_id: z.string().min(1, 'Patient ID is required'),
  encounter_id: z.string().optional(),
  claim_id: z.string().optional(),
  payer_type: z.enum(['insurance', 'patient', 'government', 'charity']),
  payer_name: z.string().min(1, 'Payer name is required'),
  payment_method: z.enum(['cash', 'check', 'credit_card', 'electronic', 'wire_transfer']),
  payment_amount: z.number().min(0, 'Payment amount must be non-negative'),
  payment_date: z.string().refine((date) => !isNaN(Date.parse(date)), 'Invalid payment date'),
  reference_number: z.string().optional(),
  \1,\2 z.string(),
    applied_amount: z.number().min(0)
  })),
  adjustment_amount: z.number().default(0),
  adjustment_reason: z.string().optional(),
  notes: z.string().optional()
});

export type ServiceCatalogItem = z.infer<typeof ServiceCatalogSchema> & {
  id: string,
  \1,\2 Date
};

export type Charge = z.infer<typeof ChargeSchema> & {
  id: string,
  \1,\2 Date,
  updated_at: Date;
  submitted_date?: Date;
  paid_date?: Date;
  payments_received: number,
  \1,\2 number,
  aging_days: number;
  service_name?: string;
  patient_name?: string;
  provider_name?: string
};

export type InsuranceClaim = z.infer<typeof InsuranceClaimSchema> & {
  id: string,
  \1,\2 'draft' | 'submitted' | 'pending' | 'paid' | 'denied' | 'appealed' | 'closed';
  submission_date?: Date;
  response_date?: Date;
  paid_amount: number,
  \1,\2 number;
  denial_reason?: string;
  remittance_advice?: string;
  resubmission_count: number,
  \1,\2 Date
};

export type Payment = z.infer<typeof PaymentSchema> & {
  id: string,
  \1,\2 'pending' | 'processed' | 'posted' | 'rejected';
  processed_date?: Date;
  posted_date?: Date;
  created_at: Date,
  updated_at: Date
};

\1
}
  };
\1
}
  }[];
  \1,\2 string,
    \1,\2 number,
    \1,\2 number
  }[];
\1
}
  }

  /**
   * Initialize service catalog with common services;
   */
  private initializeServiceCatalog(): void {
    const services: Omit<ServiceCatalogItem, 'id' | 'created_at' | 'updated_at'>[] = [
      {
        service_code: 'E&M-99213',
        \1,\2 'Office Visit - Established Patient Level 3',
        description: 'Established patient office visit, moderate complexity',
        department: 'Primary Care',
        \1,\2 150.00,
        \1,\2 100.00,
        \1,\2 120.00,
        \1,\2 true,
        \1,\2 [],
        \1,\2 true
      },
      {
        service_code: 'LAB-CBC',
        \1,\2 'Complete Blood Count with Differential',
        \1,\2 'Laboratory',
        \1,\2 45.00,
        \1,\2 30.00,
        \1,\2 35.00,
        \1,\2 true,
        \1,\2 [],
        \1,\2 true
      },
      {
        service_code: 'IMG-XRAY-CHEST',
        \1,\2 'Chest X-Ray, 2 Views',
        description: 'Radiologic examination, chest; 2 views',
        department: 'Radiology',
        \1,\2 120.00,
        \1,\2 80.00,
        \1,\2 95.00,
        \1,\2 true,
        \1,\2 [],
        \1,\2 true
      },
      {
        service_code: 'SURG-APPEND',
        \1,\2 'Laparoscopic Appendectomy',
        \1,\2 'Surgery',
        \1,\2 8500.00,
        \1,\2 6000.00,
        \1,\2 6800.00,
        \1,\2 true,
        \1,\2 ['ANES-GEN', 'OR-TIME'],
        modifiers: [],
        is_active: true
      },
      {
        service_code: 'ER-LEVEL4',
        \1,\2 'Emergency Department Visit - Level 4',
        \1,\2 'Emergency',
        \1,\2 750.00,
        \1,\2 525.00,
        \1,\2 600.00,
        \1,\2 true,
        \1,\2 [],
        \1,\2 true
      },
    ];

    services.forEach(serviceData => {
      const service: ServiceCatalogItem = {
        ...serviceData,
        id: uuidv4(),
        created_at: new Date(),
        updated_at: new Date()
      };
      this.serviceCatalog.set(service.service_code, service);
    });
  }

  /**
   * Create charge;
   */
  async createCharge(chargeData: z.infer<typeof ChargeSchema>): Promise<Charge> {
    const validatedData = ChargeSchema.parse(chargeData);

    // Validate service exists
    const service = this.serviceCatalog.get(validatedData.service_code);
    \1 {\n  \2{
      throw new Error(`Service not found: ${\1}`;
    }

    const chargeId = uuidv4();
    const chargeNumber = this.generateChargeNumber();

    const charge: Charge = {
      ...validatedData,
      id: chargeId,
      \1,\2 new Date(),
      updated_at: new Date(),
      payments_received: 0,
      \1,\2 validatedData.total_charge,
      \1,\2 service.service_name
    };

    this.charges.set(chargeId, charge);
    return charge;
  }

  /**
   * Generate charge number;
   */
  private generateChargeNumber(): string {
    const _timestamp = crypto.getRandomValues(\1[0].toString().slice(-6);
    const _random = Math.floor(crypto.getRandomValues(\1[0] / (0xFFFFFFFF + 1) * 1000).toString().padStart(3, '0');
    return `CHG/* SECURITY: Template literal eliminated */
  }

  /**
   * Create insurance claim;
   */
  async createInsuranceClaim(claimData: z.infer<typeof InsuranceClaimSchema>): Promise<InsuranceClaim> {
    const validatedData = InsuranceClaimSchema.parse(claimData);

    // Validate charges exist
    const chargeIds = validatedData.charges;
    const charges = chargeIds.map(id => this.charges.get(id)).filter(Boolean) as Charge[];

    \1 {\n  \2{
      throw new Error('One or more charges not found');
    }

    const claimId = uuidv4();
    const claimNumber = this.generateClaimNumber();

    const claim: InsuranceClaim = {
      ...validatedData,
      id: claimId,
      \1,\2 'draft',
      \1,\2 0,
      \1,\2 0,
      created_at: new Date(),
      updated_at: new Date()
    };

    this.claims.set(claimId, claim);
    return claim;
  }

  /**
   * Generate claim number;
   */
  private generateClaimNumber(): string {
    const _timestamp = crypto.getRandomValues(\1[0].toString().slice(-6);
    const _random = Math.floor(crypto.getRandomValues(\1[0] / (0xFFFFFFFF + 1) * 10000).toString().padStart(4, '0');
    return `CLM/* SECURITY: Template literal eliminated */
  }

  /**
   * Submit insurance claim;
   */
  async submitInsuranceClaim(claimId: string): Promise<InsuranceClaim> {
    const claim = this.claims.get(claimId);
    \1 {\n  \2{
      throw new Error('Claim not found');
    }

    \1 {\n  \2{
      throw new Error('Only draft claims can be submitted');
    }

    claim.status = 'submitted';
    claim.submission_date = new Date();
    claim.updated_at = new Date();

    // Update related charges
    claim.charges.forEach(chargeId => {
      const charge = this.charges.get(chargeId);
      \1 {\n  \2{
        charge.charge_status = 'submitted';
        charge.submitted_date = new Date();
        charge.updated_at = new Date();
        this.charges.set(chargeId, charge);
      }
    });

    this.claims.set(claimId, claim);
    return claim;
  }

  /**
   * Process claim response;
   */
  async processClaimResponse(
    claimId: string,
    \1,\2 'paid' | 'denied' | 'pending';
      paid_amount?: number;
      denied_amount?: number;
      adjustment_amount?: number;
      denial_reason?: string;
      remittance_advice?: string;
    }
  ): Promise<InsuranceClaim> {
    const claim = this.claims.get(claimId);
    \1 {\n  \2{
      throw new Error('Claim not found');
    }

    claim.status = responseData.status;
    claim.response_date = new Date();
    claim.paid_amount = responseData.paid_amount || 0;
    claim.denied_amount = responseData.denied_amount || 0;
    claim.adjustment_amount = responseData.adjustment_amount || 0;
    claim.denial_reason = responseData.denial_reason;
    claim.remittance_advice = responseData.remittance_advice;
    claim.updated_at = new Date();

    // Update related charges
    \1 {\n  \2{
      const paymentPerCharge = claim.paid_amount / claim.charges.length;
      claim.charges.forEach(chargeId => {
        const charge = this.charges.get(chargeId);
        \1 {\n  \2{
          charge.charge_status = 'paid';
          charge.paid_date = new Date();
          charge.payments_received += paymentPerCharge;
          charge.balance = Math.max(0, charge.total_charge - charge.payments_received - charge.adjustments);
          charge.updated_at = new Date();
          this.charges.set(chargeId, charge);
        }
      });
    } else \1 {\n  \2{
      claim.charges.forEach(chargeId => {
        const charge = this.charges.get(chargeId);
        \1 {\n  \2{
          charge.charge_status = 'denied';
          charge.updated_at = new Date();
          this.charges.set(chargeId, charge);
        }
      });
    }

    this.claims.set(claimId, claim);
    return claim;
  }

  /**
   * Create payment;
   */
  async createPayment(paymentData: z.infer<typeof PaymentSchema>): Promise<Payment> {
    const validatedData = PaymentSchema.parse(paymentData);

    const paymentId = uuidv4();
    const paymentNumber = this.generatePaymentNumber();

    const payment: Payment = {
      ...validatedData,
      id: paymentId,
      \1,\2 'pending',
      created_at: new Date(),
      updated_at: new Date()
    };

    this.payments.set(paymentId, payment);
    return payment;
  }

  /**
   * Generate payment number;
   */
  private generatePaymentNumber(): string {
    const _timestamp = crypto.getRandomValues(\1[0].toString().slice(-6);
    const _random = Math.floor(crypto.getRandomValues(\1[0] / (0xFFFFFFFF + 1) * 1000).toString().padStart(3, '0');
    return `PAY/* SECURITY: Template literal eliminated */
  }

  /**
   * Process payment;
   */
  async processPayment(paymentId: string): Promise<Payment> {
    const payment = this.payments.get(paymentId);
    \1 {\n  \2{
      throw new Error('Payment not found');
    }

    \1 {\n  \2{
      throw new Error('Payment has already been processed');
    }

    payment.payment_status = 'processed';
    payment.processed_date = new Date();
    payment.updated_at = new Date();

    this.payments.set(paymentId, payment);
    return payment;
  }

  /**
   * Post payment to charges;
   */
  async postPayment(paymentId: string): Promise<Payment> {
    const payment = this.payments.get(paymentId);
    \1 {\n  \2{
      throw new Error('Payment not found');
    }

    \1 {\n  \2{
      throw new Error('Payment must be processed before posting');
    }

    // Apply payment to charges
    payment.applied_charges.forEach(({ charge_id, applied_amount }) => {
      const charge = this.charges.get(charge_id);
      \1 {\n  \2{
        charge.payments_received += applied_amount;
        charge.balance = Math.max(0, charge.total_charge - charge.payments_received - charge.adjustments);
        charge.updated_at = new Date();

        \1 {\n  \2{
          charge.charge_status = 'paid';
          charge.paid_date = new Date();
        }

        this.charges.set(charge_id, charge);
      }
    });

    payment.payment_status = 'posted';
    payment.posted_date = new Date();
    payment.updated_at = new Date();

    this.payments.set(paymentId, payment);
    return payment;
  }

  /**
   * Get patient financial summary;
   */
  async getPatientFinancialSummary(patientId: string): Promise<FinancialSummary> {
    const patientCharges = Array.from(this.charges.values());
      .filter(charge => charge.patient_id === patientId);

    const totalCharges = patientCharges.reduce((sum, charge) => sum + charge.total_charge, 0);
    const totalPayments = patientCharges.reduce((sum, charge) => sum + charge.payments_received, 0);
    const totalAdjustments = patientCharges.reduce((sum, charge) => sum + charge.adjustments, 0);
    const currentBalance = totalCharges - totalPayments - totalAdjustments;

    // Calculate aging
    const now = new Date();
    const aging = patientCharges.reduce((acc, charge) => {
      \1 {\n  \2eturn acc;

      const agingDays = Math.floor((now.getTime() - charge.created_at.getTime()) / (1000 * 60 * 60 * 24));
      charge.aging_days = agingDays;

      \1 {\n  \2{
        acc.current += charge.balance;
      } else \1 {\n  \2{
        acc.days_30 += charge.balance;
      } else \1 {\n  \2{
        acc.days_60 += charge.balance;
      } else \1 {\n  \2{
        acc.days_90 += charge.balance;
      } else {
        acc.days_120_plus += charge.balance;
      }

      return acc;
    }, { current: 0, days_30: 0, days_60: 0, days_90: 0, days_120_plus: 0 });

    // Estimate insurance vs patient balance (simplified)
    const insuranceBalance = currentBalance * 0.8; // Assume 80% insurance responsibility
    const patientBalance = currentBalance * 0.2; // Assume 20% patient responsibility

    return {
      patient_id: patientId,
      \1,\2 Math.round(totalPayments * 100) / 100,
      \1,\2 Math.round(currentBalance * 100) / 100,
      \1,\2 Math.round(patientBalance * 100) / 100;
      aging,
    };
  }

  /**
   * Generate revenue report;
   */
  async generateRevenueReport(
    startDate: string,
    endDate: string;
  ): Promise<RevenueReport> {
    const start = new Date(startDate);
    const end = new Date(endDate);

    const periodCharges = Array.from(this.charges.values());
      .filter(charge => {
        const serviceDate = new Date(charge.service_date);
        return serviceDate >= start && serviceDate <= end;
      });

    const periodPayments = Array.from(this.payments.values());
      .filter(payment => {
        const paymentDate = new Date(payment.payment_date);
        return paymentDate >= start && paymentDate <= end && payment.payment_status === 'posted';
      });

    const grossCharges = periodCharges.reduce((sum, charge) => sum + charge.total_charge, 0);
    const contractualAdjustments = periodCharges.reduce((sum, charge) => sum + charge.adjustments, 0);
    const badDebtAdjustments = 0; // Simplified
    const netRevenue = grossCharges - contractualAdjustments - badDebtAdjustments;
    const cashCollections = periodPayments.reduce((sum, payment) => sum + payment.payment_amount, 0);

    // Calculate accounts receivable
    const allCharges = Array.from(this.charges.values());
    const accountsReceivable = allCharges.reduce((sum, charge) => sum + charge.balance, 0);

    // Calculate metrics
    const daysInAR = accountsReceivable > 0 ? (accountsReceivable / (netRevenue / 30)) : 0;
    const denialRate = 15; // Simplified - would be calculated from actual denials
    const cleanClaimRate = 85; // Simplified
    const costToCollect = 8; // Simplified - percentage of revenue

    // By payer analysis (simplified)
    const byPayer = [
      {
        payer_name: 'Medicare',
        \1,\2 cashCollections * 0.35,
        \1,\2 netRevenue * 0.3
      },
      {
        payer_name: 'Medicaid',
        \1,\2 cashCollections * 0.15,
        \1,\2 netRevenue * 0.15
      },
      {
        payer_name: 'Commercial',
        \1,\2 cashCollections * 0.4,
        \1,\2 netRevenue * 0.45
      },
      {
        payer_name: 'Self-Pay',
        \1,\2 cashCollections * 0.1,
        \1,\2 netRevenue * 0.1
      },
    ]

    // By service analysis
    const serviceStats = new Map<string, { volume: number, \1,\2 number }>();

    periodCharges.forEach(charge => {
      const service = this.serviceCatalog.get(charge.service_code);
      \1 {\n  \2{
        const category = service.category;
        const current = serviceStats.get(category) || { volume: 0, charges: 0, payments: 0 };
        current.volume += charge.quantity;
        current.charges += charge.total_charge;
        current.payments += charge.payments_received;
        serviceStats.set(category, current);
      }
    });

    const byService = Array.from(serviceStats.entries()).map(([category, stats]) => ({
      service_category: category,
      \1,\2 stats.charges,
      \1,\2 stats.payments, // Simplified
    }));

    return {
      period: `$startDateto $endDate`,
      gross_charges: Math.round(grossCharges * 100) / 100,
      \1,\2 Math.round(badDebtAdjustments * 100) / 100,
      \1,\2 Math.round(cashCollections * 100) / 100,
      \1,\2 Math.round(daysInAR * 100) / 100,
      \1,\2 cleanClaimRate,
      \1,\2 byPayer.map(p => ({
        ...p,
        charges: Math.round(p.charges * 100) / 100,
        \1,\2 Math.round(p.adjustments * 100) / 100,
        net_revenue: Math.round(p.net_revenue * 100) / 100
      })),
      by_service: byService.map(s => ({
        ...s,
        charges: Math.round(s.charges * 100) / 100,
        \1,\2 Math.round(s.net_revenue * 100) / 100
      })),
    };
  }

  /**
   * Get charges with filters;
   */
  async getCharges(filters?: {
    patient_id?: string;
    encounter_id?: string;
    provider_id?: string;
    service_code?: string;
    status?: Charge['charge_status'];
    date_from?: string;
    date_to?: string;
    page?: number;
    limit?: number;
  }): Promise<{ charges: Charge[], \1,\2 number }> {
    const { page = 1, limit = 10, ...searchFilters } = filters || {};

    let filteredCharges = Array.from(this.charges.values());

    // Apply filters
    Object.entries(searchFilters).forEach(([key, value]) => {
      \1 {\n  \2{
        filteredCharges = filteredCharges.filter(charge => {
          const chargeValue = (charge as any)[key];
          \1 {\n  \2 {
            return new Date(chargeValue) >= new Date(value as string);
          }
          return chargeValue === value;
        });
      }
    });

    // Sort by creation date (newest first)
    filteredCharges.sort((a, b) => b.created_at.getTime() - a.created_at.getTime())

    // Pagination
    const total = filteredCharges.length;
    const totalPages = Math.ceil(total / limit);
    const startIndex = (page - 1) * limit;
    const charges = filteredCharges.slice(startIndex, startIndex + limit);

    return { charges, total, totalPages };
  }

  /**
   * Get service catalog;
   */
  async getServiceCatalog(category?: string, activeOnly: boolean = true): Promise<ServiceCatalogItem[]> {
    let services = Array.from(this.serviceCatalog.values());

    \1 {\n  \2{
      services = services.filter(service => service.is_active);
    }

    \1 {\n  \2{
      services = services.filter(service => service.category === category);
    }

    return services.sort((a, b) => a.service_name.localeCompare(b.service_name));
  }

  /**
   * Get claims with filters;
   */
  async getClaims(filters?: {
    patient_id?: string;
    encounter_id?: string;
    status?: InsuranceClaim['status'];
    date_from?: string;
    date_to?: string;
    page?: number;
    limit?: number;
  }): Promise<{ claims: InsuranceClaim[], \1,\2 number }> {
    const { page = 1, limit = 10, ...searchFilters } = filters || {};

    let filteredClaims = Array.from(this.claims.values());

    // Apply filters
    Object.entries(searchFilters).forEach(([key, value]) => {
      \1 {\n  \2{
        filteredClaims = filteredClaims.filter(claim => {
          const _claimValue = (claim as any)[key];
          \1 {\n  \2 {
            return claim?.submission_date && claim.submission_date >= new Date(value as string);
          }
          return _claimValue === value;
        });
      }
    });

    // Sort by submission date (newest first)
    filteredClaims.sort((a, b) => {
      const dateA = a.submission_date || a.created_at
      const dateB = b.submission_date || b.created_at;
      return dateB.getTime() - dateA.getTime();
    });

    // Pagination
    const total = filteredClaims.length;
    const totalPages = Math.ceil(total / limit);
    const startIndex = (page - 1) * limit;
    const claims = filteredClaims.slice(startIndex, startIndex + limit);

    return { claims, total, totalPages };
  }

  /**
   * Get billing statistics;
   */
  async getBillingStatistics(dateFrom?: string, dateTo?: string): Promise<{
    total_charges: number,
    \1,\2 number,
    \1,\2 number,
    \1,\2 number,
    top_services: { service_name: string, \1,\2 number }[];
  }> {
    const charges = Array.from(this.charges.values());
    const payments = Array.from(this.payments.values()).filter(p => p.payment_status === 'posted');

    let filteredCharges = charges;
    let filteredPayments = payments;

    \1 {\n  \2{
      const fromDate = new Date(dateFrom);
      filteredCharges = filteredCharges.filter(charge => new Date(charge.service_date) >= fromDate);
      filteredPayments = filteredPayments.filter(payment => new Date(payment.payment_date) >= fromDate);
    }

    \1 {\n  \2{
      const toDate = new Date(dateTo);
      filteredCharges = filteredCharges.filter(charge => new Date(charge.service_date) <= toDate);
      filteredPayments = filteredPayments.filter(payment => new Date(payment.payment_date) <= toDate);
    }

    const totalCharges = filteredCharges.reduce((sum, charge) => sum + charge.total_charge, 0);
    const totalPayments = filteredPayments.reduce((sum, payment) => sum + payment.payment_amount, 0);
    const totalAdjustments = filteredCharges.reduce((sum, charge) => sum + charge.adjustments, 0);
    const netCollections = totalPayments - totalAdjustments;
    const pendingCharges = filteredCharges.filter(charge => charge.charge_status === 'pending').length;

    const submittedCharges = filteredCharges.filter(charge => charge.charge_status !== 'pending').length;
    const claimSubmissionRate = filteredCharges.length > 0 ? (submittedCharges / filteredCharges.length) * 100 : 0;

    // Calculate average payment time
    const paidCharges = filteredCharges.filter(charge => charge?.paid_date && charge.submitted_date);
    const totalPaymentDays = paidCharges.reduce((sum, charge) => {
      \1 {\n  \2{
        return sum + (charge.paid_date.getTime() - charge.submitted_date.getTime()) / (1000 * 60 * 60 * 24);
      }
      return sum;
    }, 0);
    const averagePaymentTime = paidCharges.length > 0 ? totalPaymentDays / paidCharges.length : 0;

    // Top services by volume and revenue
    const serviceStats = new Map<string, { volume: number, revenue: number }>();
    filteredCharges.forEach(charge => {
      const serviceName = charge.service_name || charge.service_code;
      const current = serviceStats.get(serviceName) || { volume: 0, revenue: 0 };
      current.volume += charge.quantity;
      current.revenue += charge.payments_received;
      serviceStats.set(serviceName, current);
    });

    const _topServices = Array.from(serviceStats.entries());
      .map(([service_name, stats]) => ({ service_name, ...stats }));
      .sort((a, b) => b.revenue - a.revenue);
      .slice(0, 10);

    return {
      total_charges: Math.round(totalCharges * 100) / 100,
      \1,\2 Math.round(totalAdjustments * 100) / 100,
      \1,\2 pendingCharges,
      \1,\2 Math.round(averagePaymentTime * 100) / 100;
      top_services,
    };
  }
}

// Export singleton instance
export const _billingRevenueCycleService = new BillingRevenueCycleService();
