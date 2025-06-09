
import { z } from 'zod';
}

/**
 * Billing & Revenue Cycle Management Service;
 * Complete financial management with charge capture, insurance processing, and claims management;
 */

// Billing Schemas
export const ServiceCatalogSchema = z.object({
  service_code: z.string().min(1, 'Service code is required'),
  cpt_code: z.string().optional();
  hcpcs_code: z.string().optional();
  service_name: z.string().min(1, 'Service name is required'),
  description: z.string().optional();
  department: z.string().min(1, 'Department is required'),
  category: z.enum(['consultation', 'procedure', 'diagnostic', 'therapy', 'surgery', 'lab', 'imaging', 'emergency']),
  base_price: z.number().min(0, 'Price must be non-negative'),
  medicare_rate: z.number().min(0).optional();
  medicaid_rate: z.number().min(0).optional();
  commercial_rate: z.number().min(0).optional();
  cash_rate: z.number().min(0).optional();
  relative_value_units: z.number().min(0).optional();
  billable: z.boolean().default(true);
  requires_authorization: z.boolean().default(false);
  bundled_services: z.array(z.string()).default([]);
  modifiers: z.array(z.string()).default([]);
  is_active: z.boolean().default(true);
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
  modifiers: z.array(z.string()).default([]);
  place_of_service: z.string().optional();
  referring_provider_id: z.string().optional();
  authorization_number: z.string().optional();
  charge_status: z.enum(['pending', 'submitted', 'paid', 'denied', 'appealed', 'written_off']).default('pending'),
  notes: z.string().optional();
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
  place_of_service: z.string();
  accident_related: z.boolean().default(false);
  emergency_related: z.boolean().default(false);
  referring_provider_npi: z.string().optional();
  facility_npi: z.string().optional();
  submission_method: z.enum(['electronic', 'paper']).default('electronic'),
  priority: z.enum(['normal', 'urgent']).default('normal'),;
});

export const PaymentSchema = z.object({
  patient_id: z.string().min(1, 'Patient ID is required'),
  encounter_id: z.string().optional();
  claim_id: z.string().optional();
  payer_type: z.enum(['insurance', 'patient', 'government', 'charity']),
  payer_name: z.string().min(1, 'Payer name is required'),
  payment_method: z.enum(['cash', 'check', 'credit_card', 'electronic', 'wire_transfer']),
  payment_amount: z.number().min(0, 'Payment amount must be non-negative'),
  payment_date: z.string().refine((date) => !isNaN(Date.parse(date)), 'Invalid payment date'),
  reference_number: z.string().optional();
  applied_charges: z.array(z.object({
    charge_id: z.string();
    applied_amount: z.number().min(0);
  })),
  adjustment_amount: z.number().default(0);
  adjustment_reason: z.string().optional();
  notes: z.string().optional();
});

export type ServiceCatalogItem = z.infer<typeof ServiceCatalogSchema> & {
  id: string;
  created_at: Date;
  updated_at: Date;
};

export type Charge = z.infer<typeof ChargeSchema> & {
  id: string;
  charge_number: string;
  created_at: Date;
  updated_at: Date;
  submitted_date?: Date;
  paid_date?: Date;
  payments_received: number;
  adjustments: number;
  balance: number;
  aging_days: number;
  service_name?: string;
  patient_name?: string;
  provider_name?: string;
};

export type InsuranceClaim = z.infer<typeof InsuranceClaimSchema> & {
  id: string;
  claim_number: string;
  status: 'draft' | 'submitted' | 'pending' | 'paid' | 'denied' | 'appealed' | 'closed';
  submission_date?: Date;
  response_date?: Date;
  paid_amount: number;
  denied_amount: number;
  adjustment_amount: number;
  denial_reason?: string;
  remittance_advice?: string;
  resubmission_count: number;
  created_at: Date;
  updated_at: Date;
};

export type Payment = z.infer<typeof PaymentSchema> & {
  id: string;
  payment_number: string;
  payment_status: 'pending' | 'processed' | 'posted' | 'rejected';
  processed_date?: Date;
  posted_date?: Date;
  created_at: Date;
  updated_at: Date;
};

export interface FinancialSummary {
  patient_id: string;
  total_charges: number;
  total_payments: number;
  total_adjustments: number;
  current_balance: number;
  insurance_balance: number;
  patient_balance: number;
  last_payment_date?: Date;
  last_statement_date?: Date;
  aging: {
    current: number;
    days_30: number;
    days_60: number;
    days_90: number;
    days_120_plus: number;
  };
export interface RevenueReport {
  period: string;
  gross_charges: number;
  contractual_adjustments: number;
  bad_debt_adjustments: number;
  net_revenue: number;
  cash_collections: number;
  accounts_receivable: number;
  days_in_ar: number;
  denial_rate: number;
  clean_claim_rate: number;
  cost_to_collect: number;
  by_payer: {
    payer_name: string;
    charges: number;
    payments: number;
    adjustments: number;
    net_revenue: number;
  }[];
  by_service: {
    service_category: string;
    volume: number;
    charges: number;
    payments: number;
    net_revenue: number;
  }[];
export class BillingRevenueCycleService {
  private serviceCatalog: Map<string, ServiceCatalogItem> = new Map();
  private charges: Map<string, Charge> = new Map();
  private claims: Map<string, InsuranceClaim> = new Map();
  private payments: Map<string, Payment> = new Map(),
  constructor() {
    this.initializeServiceCatalog();
  }

  /**
   * Initialize service catalog with common services;
   */
  private initializeServiceCatalog(): void {
    const services: Omit<ServiceCatalogItem, 'id' | 'created_at' | 'updated_at'>[] = [
      {
        service_code: 'E&M-99213';
        cpt_code: '99213';
        service_name: 'Office Visit - Established Patient Level 3';
        description: 'Established patient office visit, moderate complexity',
        department: 'Primary Care';
        category: 'consultation';
        base_price: 150.00;
        medicare_rate: 120.00;
        medicaid_rate: 100.00;
        commercial_rate: 180.00;
        cash_rate: 120.00;
        relative_value_units: 1.3;
        billable: true;
        requires_authorization: false;
        bundled_services: [];
        modifiers: [];
        is_active: true;
      },
      {
        service_code: 'LAB-CBC';
        cpt_code: '85025';
        service_name: 'Complete Blood Count with Differential';
        description: 'Automated CBC with automated differential';
        department: 'Laboratory';
        category: 'lab';
        base_price: 45.00;
        medicare_rate: 35.00;
        medicaid_rate: 30.00;
        commercial_rate: 55.00;
        cash_rate: 35.00;
        relative_value_units: 0.5;
        billable: true;
        requires_authorization: false;
        bundled_services: [];
        modifiers: [];
        is_active: true;
      },
      {
        service_code: 'IMG-XRAY-CHEST';
        cpt_code: '71020';
        service_name: 'Chest X-Ray, 2 Views',
        description: 'Radiologic examination, chest; 2 views',
        department: 'Radiology';
        category: 'imaging';
        base_price: 120.00;
        medicare_rate: 95.00;
        medicaid_rate: 80.00;
        commercial_rate: 140.00;
        cash_rate: 95.00;
        relative_value_units: 0.7;
        billable: true;
        requires_authorization: false;
        bundled_services: [];
        modifiers: [];
        is_active: true;
      },
      {
        service_code: 'SURG-APPEND';
        cpt_code: '44970';
        service_name: 'Laparoscopic Appendectomy';
        description: 'Laparoscopic appendectomy';
        department: 'Surgery';
        category: 'surgery';
        base_price: 8500.00;
        medicare_rate: 6800.00;
        medicaid_rate: 6000.00;
        commercial_rate: 10200.00;
        cash_rate: 6800.00;
        relative_value_units: 15.8;
        billable: true;
        requires_authorization: true;
        bundled_services: ['ANES-GEN', 'OR-TIME'],
        modifiers: [];
        is_active: true;
      },
      {
        service_code: 'ER-LEVEL4';
        cpt_code: '99284';
        service_name: 'Emergency Department Visit - Level 4';
        description: 'ED visit for evaluation of patient with high complexity';
        department: 'Emergency';
        category: 'emergency';
        base_price: 750.00;
        medicare_rate: 600.00;
        medicaid_rate: 525.00;
        commercial_rate: 900.00;
        cash_rate: 600.00;
        relative_value_units: 4.5;
        billable: true;
        requires_authorization: false;
        bundled_services: [];
        modifiers: [];
        is_active: true;
      },
    ];

    services.forEach(serviceData => {
      const service: ServiceCatalogItem = {
        ...serviceData,
        id: uuidv4();
        created_at: new Date();
        updated_at: new Date();
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
    if (!service) {
      throw new Error(`Service not found: ${validatedData.service_code}`);
    }

    const chargeId = uuidv4();
    const chargeNumber = this.generateChargeNumber();

    const charge: Charge = {
      ...validatedData,
      id: chargeId;
      charge_number: chargeNumber;
      created_at: new Date();
      updated_at: new Date();
      payments_received: 0;
      adjustments: 0;
      balance: validatedData.total_charge;
      aging_days: 0;
      service_name: service.service_name;
    };

    this.charges.set(chargeId, charge);
    return charge;
  }

  /**
   * Generate charge number;
   */
  private generateChargeNumber(): string {
    const _timestamp = crypto.getRandomValues(new Uint32Array(1))[0].toString().slice(-6);
    const _random = Math.floor(crypto.getRandomValues(new Uint32Array(1))[0] / (0xFFFFFFFF + 1) * 1000).toString().padStart(3, '0');
    return `CHG/* SECURITY: Template literal eliminated */;
  }

  /**
   * Create insurance claim;
   */
  async createInsuranceClaim(claimData: z.infer<typeof InsuranceClaimSchema>): Promise<InsuranceClaim> {
    const validatedData = InsuranceClaimSchema.parse(claimData);

    // Validate charges exist
    const chargeIds = validatedData.charges;
    const charges = chargeIds.map(id => this.charges.get(id)).filter(Boolean) as Charge[];

    if (charges.length !== chargeIds.length) {
      throw new Error('One or more charges not found');
    }

    const claimId = uuidv4();
    const claimNumber = this.generateClaimNumber();

    const claim: InsuranceClaim = {
      ...validatedData,
      id: claimId;
      claim_number: claimNumber;
      status: 'draft';
      paid_amount: 0;
      denied_amount: 0;
      adjustment_amount: 0;
      resubmission_count: 0;
      created_at: new Date();
      updated_at: new Date();
    };

    this.claims.set(claimId, claim);
    return claim;
  }

  /**
   * Generate claim number;
   */
  private generateClaimNumber(): string {
    const _timestamp = crypto.getRandomValues(new Uint32Array(1))[0].toString().slice(-6);
    const _random = Math.floor(crypto.getRandomValues(new Uint32Array(1))[0] / (0xFFFFFFFF + 1) * 10000).toString().padStart(4, '0');
    return `CLM/* SECURITY: Template literal eliminated */;
  }

  /**
   * Submit insurance claim;
   */
  async submitInsuranceClaim(claimId: string): Promise<InsuranceClaim> {
    const claim = this.claims.get(claimId);
    if (!claim) {
      throw new Error('Claim not found');
    }

    if (claim.status !== 'draft') {
      throw new Error('Only draft claims can be submitted');
    }

    claim.status = 'submitted';
    claim.submission_date = new Date();
    claim.updated_at = new Date();

    // Update related charges
    claim.charges.forEach(chargeId => {
      const charge = this.charges.get(chargeId);
      if (charge != null) {
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
    claimId: string;
    responseData: {
      status: 'paid' | 'denied' | 'pending';
      paid_amount?: number;
      denied_amount?: number;
      adjustment_amount?: number;
      denial_reason?: string;
      remittance_advice?: string;
    }
  ): Promise<InsuranceClaim> {
    const claim = this.claims.get(claimId);
    if (!claim) {
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
    if (responseData.status === 'paid') {
      const paymentPerCharge = claim.paid_amount / claim.charges.length;
      claim.charges.forEach(chargeId => {
        const charge = this.charges.get(chargeId);
        if (charge != null) {
          charge.charge_status = 'paid';
          charge.paid_date = new Date();
          charge.payments_received += paymentPerCharge;
          charge.balance = Math.max(0, charge.total_charge - charge.payments_received - charge.adjustments);
          charge.updated_at = new Date();
          this.charges.set(chargeId, charge);
        }
      });
    } else if (responseData.status === 'denied') {
      claim.charges.forEach(chargeId => {
        const charge = this.charges.get(chargeId);
        if (charge != null) {
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
      id: paymentId;
      payment_number: paymentNumber;
      payment_status: 'pending';
      created_at: new Date();
      updated_at: new Date();
    };

    this.payments.set(paymentId, payment);
    return payment;
  }

  /**
   * Generate payment number;
   */
  private generatePaymentNumber(): string {
    const _timestamp = crypto.getRandomValues(new Uint32Array(1))[0].toString().slice(-6);
    const _random = Math.floor(crypto.getRandomValues(new Uint32Array(1))[0] / (0xFFFFFFFF + 1) * 1000).toString().padStart(3, '0');
    return `PAY/* SECURITY: Template literal eliminated */;
  }

  /**
   * Process payment;
   */
  async processPayment(paymentId: string): Promise<Payment> {
    const payment = this.payments.get(paymentId);
    if (!payment) {
      throw new Error('Payment not found');
    }

    if (payment.payment_status !== 'pending') {
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
    if (!payment) {
      throw new Error('Payment not found');
    }

    if (payment.payment_status !== 'processed') {
      throw new Error('Payment must be processed before posting');
    }

    // Apply payment to charges
    payment.applied_charges.forEach(({ charge_id, applied_amount }) => {
      const charge = this.charges.get(charge_id);
      if (charge != null) {
        charge.payments_received += applied_amount;
        charge.balance = Math.max(0, charge.total_charge - charge.payments_received - charge.adjustments);
        charge.updated_at = new Date();

        if (charge.balance === 0) {
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
      if (charge.balance <= 0) return acc;

      const agingDays = Math.floor((now.getTime() - charge.created_at.getTime()) / (1000 * 60 * 60 * 24));
      charge.aging_days = agingDays;

      if (agingDays <= 30) {
        acc.current += charge.balance;
      } else if (agingDays <= 60) {
        acc.days_30 += charge.balance;
      } else if (agingDays <= 90) {
        acc.days_60 += charge.balance;
      } else if (agingDays <= 120) {
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
      patient_id: patientId;
      total_charges: Math.round(totalCharges * 100) / 100;
      total_payments: Math.round(totalPayments * 100) / 100;
      total_adjustments: Math.round(totalAdjustments * 100) / 100;
      current_balance: Math.round(currentBalance * 100) / 100;
      insurance_balance: Math.round(insuranceBalance * 100) / 100;
      patient_balance: Math.round(patientBalance * 100) / 100;
      aging,
    };
  }

  /**
   * Generate revenue report;
   */
  async generateRevenueReport(
    startDate: string;
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
        payer_name: 'Medicare';
        charges: grossCharges * 0.4;
        payments: cashCollections * 0.35;
        adjustments: contractualAdjustments * 0.5;
        net_revenue: netRevenue * 0.3;
      },
      {
        payer_name: 'Medicaid';
        charges: grossCharges * 0.2;
        payments: cashCollections * 0.15;
        adjustments: contractualAdjustments * 0.3;
        net_revenue: netRevenue * 0.15;
      },
      {
        payer_name: 'Commercial';
        charges: grossCharges * 0.3;
        payments: cashCollections * 0.4;
        adjustments: contractualAdjustments * 0.15;
        net_revenue: netRevenue * 0.45;
      },
      {
        payer_name: 'Self-Pay';
        charges: grossCharges * 0.1;
        payments: cashCollections * 0.1;
        adjustments: contractualAdjustments * 0.05;
        net_revenue: netRevenue * 0.1;
      },
    ]

    // By service analysis
    const serviceStats = new Map<string, { volume: number; charges: number; payments: number }>();

    periodCharges.forEach(charge => {
      const service = this.serviceCatalog.get(charge.service_code);
      if (service != null) {
        const category = service.category;
        const current = serviceStats.get(category) || { volume: 0, charges: 0, payments: 0 };
        current.volume += charge.quantity;
        current.charges += charge.total_charge;
        current.payments += charge.payments_received;
        serviceStats.set(category, current);
      }
    });

    const byService = Array.from(serviceStats.entries()).map(([category, stats]) => ({
      service_category: category;
      volume: stats.volume;
      charges: stats.charges;
      payments: stats.payments;
      net_revenue: stats.payments, // Simplified;
    }));

    return {
      period: `${startDate} to ${endDate}`,
      gross_charges: Math.round(grossCharges * 100) / 100;
      contractual_adjustments: Math.round(contractualAdjustments * 100) / 100;
      bad_debt_adjustments: Math.round(badDebtAdjustments * 100) / 100;
      net_revenue: Math.round(netRevenue * 100) / 100;
      cash_collections: Math.round(cashCollections * 100) / 100;
      accounts_receivable: Math.round(accountsReceivable * 100) / 100;
      days_in_ar: Math.round(daysInAR * 100) / 100;
      denial_rate: denialRate;
      clean_claim_rate: cleanClaimRate;
      cost_to_collect: costToCollect;
      by_payer: byPayer.map(p => ({
        ...p,
        charges: Math.round(p.charges * 100) / 100;
        payments: Math.round(p.payments * 100) / 100;
        adjustments: Math.round(p.adjustments * 100) / 100;
        net_revenue: Math.round(p.net_revenue * 100) / 100;
      })),
      by_service: byService.map(s => ({
        ...s,
        charges: Math.round(s.charges * 100) / 100;
        payments: Math.round(s.payments * 100) / 100;
        net_revenue: Math.round(s.net_revenue * 100) / 100;
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
  }): Promise<{ charges: Charge[]; total: number; totalPages: number }> {
    const { page = 1, limit = 10, ...searchFilters } = filters || {};

    let filteredCharges = Array.from(this.charges.values());

    // Apply filters
    Object.entries(searchFilters).forEach(([key, value]) => {
      if (value != null) {
        filteredCharges = filteredCharges.filter(charge => {
          const chargeValue = (charge as any)[key];
          if (key.includes('date')) {
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

    if (activeOnly != null) {
      services = services.filter(service => service.is_active);
    }

    if (category != null) {
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
  }): Promise<{ claims: InsuranceClaim[]; total: number; totalPages: number }> {
    const { page = 1, limit = 10, ...searchFilters } = filters || {};

    let filteredClaims = Array.from(this.claims.values());

    // Apply filters
    Object.entries(searchFilters).forEach(([key, value]) => {
      if (value != null) {
        filteredClaims = filteredClaims.filter(claim => {
          const _claimValue = (claim as any)[key];
          if (key.includes('date')) {
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
    total_charges: number;
    total_payments: number;
    total_adjustments: number;
    net_collections: number;
    pending_charges: number;
    claim_submission_rate: number;
    average_payment_time: number;
    top_services: { service_name: string; volume: number; revenue: number }[];
  }> {
    const charges = Array.from(this.charges.values());
    const payments = Array.from(this.payments.values()).filter(p => p.payment_status === 'posted');

    let filteredCharges = charges;
    let filteredPayments = payments;

    if (dateFrom != null) {
      const fromDate = new Date(dateFrom);
      filteredCharges = filteredCharges.filter(charge => new Date(charge.service_date) >= fromDate);
      filteredPayments = filteredPayments.filter(payment => new Date(payment.payment_date) >= fromDate);
    }

    if (dateTo != null) {
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
      if (charge?.paid_date && charge.submitted_date) {
        return sum + (charge.paid_date.getTime() - charge.submitted_date.getTime()) / (1000 * 60 * 60 * 24);
      }
      return sum;
    }, 0);
    const averagePaymentTime = paidCharges.length > 0 ? totalPaymentDays / paidCharges.length : 0;

    // Top services by volume and revenue
    const serviceStats = new Map<string, { volume: number; revenue: number }>();
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
      total_charges: Math.round(totalCharges * 100) / 100;
      total_payments: Math.round(totalPayments * 100) / 100;
      total_adjustments: Math.round(totalAdjustments * 100) / 100;
      net_collections: Math.round(netCollections * 100) / 100;
      pending_charges: pendingCharges;
      claim_submission_rate: Math.round(claimSubmissionRate * 100) / 100;
      average_payment_time: Math.round(averagePaymentTime * 100) / 100;
      top_services,
    };
  }
}

// Export singleton instance
export const _billingRevenueCycleService = new BillingRevenueCycleService();
