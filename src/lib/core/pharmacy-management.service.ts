}

/**
 * Pharmacy Management Service;
 * Complete medication management with drug interactions, inventory, and clinical decision support;
 */

import { z } from 'zod';

// Drug Database Schemas
export const DrugSchema = z.object({
  ndc: z.string().min(1, 'NDC number is required'),
  generic_name: z.string().min(1, 'Generic name is required'),
  brand_name: z.string().optional(),
  drug_class: z.string(),
  therapeutic_class: z.string(),
  controlled_substance_schedule: z.enum(['I', 'II', 'III', 'IV', 'V', 'none']).default('none'),
  dosage_forms: z.array(z.string()),
  strengths: z.array(z.string()),
  route_of_administration: z.array(z.string()),
  manufacturer: z.string(),
  dea_schedule: z.string().optional(),
  pregnancy_category: z.enum(['A', 'B', 'C', 'D', 'X', 'unknown']).default('unknown'),
  black_box_warning: z.boolean().default(false),
  formulary_status: z.enum(['preferred', 'non-preferred', 'restricted', 'excluded']).default('preferred'),
  cost_per_unit: z.number().min(0),
  is_active: z.boolean().default(true),
});

export const PrescriptionSchema = z.object({
  patient_id: z.string().min(1, 'Patient ID is required'),
  prescriber_id: z.string().min(1, 'Prescriber ID is required'),
  drug_ndc: z.string().min(1, 'Drug NDC is required'),
  drug_name: z.string().min(1, 'Drug name is required'),
  strength: z.string().min(1, 'Strength is required'),
  dosage_form: z.string().min(1, 'Dosage form is required'),
  route: z.string().min(1, 'Route is required'),
  directions: z.string().min(1, 'Directions for use are required'),
  quantity: z.number().min(1, 'Quantity must be greater than 0'),
  days_supply: z.number().min(1, 'Days supply must be greater than 0'),
  refills: z.number().min(0).max(11, 'Refills cannot exceed 11'),
  daw: z.boolean().default(false), // Dispense as written
  priority: z.enum(['routine', 'urgent', 'stat']).default('routine'),
  indication: z.string().optional(),
  diagnosis_code: z.string().optional(),
  prescriber_dea: z.string().optional(),
  prescriber_npi: z.string().optional(),
  written_date: z.string().refine((date) => !isNaN(Date.parse(date)), 'Invalid written date'),
  effective_date: z.string().optional(),
  discontinue_date: z.string().optional(),
  special_instructions: z.string().optional(),
});

export const InventorySchema = z.object({
  drug_ndc: z.string().min(1, 'Drug NDC is required'),
  lot_number: z.string().min(1, 'Lot number is required'),
  expiration_date: z.string().refine((date) => !isNaN(Date.parse(date)), 'Invalid expiration date'),
  quantity_on_hand: z.number().min(0),
  unit_cost: z.number().min(0),
  wholesale_cost: z.number().min(0),
  reorder_level: z.number().min(0),
  max_level: z.number().min(0),
  vendor_id: z.string(),
  storage_location: z.string(),
  storage_requirements: z.string().optional(),
  received_date: z.string().refine((date) => !isNaN(Date.parse(date)), 'Invalid received date'),
  received_by: z.string(),
});

export const DispensingSchema = z.object({
  prescription_id: z.string().min(1, 'Prescription ID is required'),
  patient_id: z.string(),
  drug_ndc: z.string(),
  quantity_dispensed: z.number().min(1, 'Quantity dispensed must be greater than 0'),
  lot_numbers: z.array(z.string()),
  pharmacist_id: z.string().min(1, 'Pharmacist ID is required'),
  technician_id: z.string().optional(),
  dispensing_date: z.string().refine((date) => !isNaN(Date.parse(date)), 'Invalid dispensing date'),
  pickup_date: z.string().optional(),
  counseling_provided: z.boolean().default(false),
  counseling_notes: z.string().optional(),
  patient_questions: z.string().optional(),
  adherence_score: z.number().min(0).max(100).optional(),
});

export const AllergySchema = z.object({
  patient_id: z.string(),
  allergen: z.string(),
  allergen_type: z.enum(['drug', 'food', 'environmental']),
  reaction: z.string(),
  severity: z.enum(['mild', 'moderate', 'severe', 'life-threatening']),
  onset_date: z.string().optional(),
  verified_date: z.string().optional(),
  verified_by: z.string().optional(),
  status: z.enum(['active', 'inactive', 'resolved']).default('active'),
  notes: z.string().optional(),
});

export type Drug = z.infer<typeof DrugSchema> & {
  id: string,
  created_at: Date,
  updated_at: Date
};

export type Prescription = z.infer<typeof PrescriptionSchema> & {
  id: string,
  prescription_number: string,
  status: 'pending' | 'verified' | 'dispensed' | 'picked_up' | 'cancelled' | 'expired';
  verification_date?: Date;
  dispensing_date?: Date;
  pickup_date?: Date;
  created_at: Date,
  updated_at: Date;
  patient_name?: string;
  prescriber_name?: string;
};

export type InventoryItem = z.infer<typeof InventorySchema> & {
  id: string;
  drug_name?: string;
  drug_strength?: string;
  created_at: Date,
  updated_at: Date
};

export type DispensingRecord = z.infer<typeof DispensingSchema> & {
  id: string,
  refill_number: number,
  total_cost: number,
  copay_amount: number,
  insurance_amount: number,
  created_at: Date,
  updated_at: Date
};

export type PatientAllergy = z.infer<typeof AllergySchema> & {
  id: string,
  created_at: Date,
  updated_at: Date
};

export interface DrugInteraction {
  drug1_ndc: string,
  drug1_name: string,
  drug2_ndc: string,
  drug2_name: string,
  severity: 'minor' | 'moderate' | 'major' | 'contraindicated',
  mechanism: string,
  clinical_effect: string,
  management: string,
  documentation_level: 'poor' | 'fair' | 'good' | 'excellent'
export interface ClinicalAlert {
  id: string,
  patient_id: string,
  prescription_id: string,
  alert_type: 'drug_allergy' | 'drug_interaction' | 'duplicate_therapy' | 'dosing_concern' | 'contraindication',
  severity: 'low' | 'medium' | 'high' | 'critical',
  message: string,
  recommendation: string;
  override_reason?: string;
  overridden_by?: string;
  override_date?: Date;
  acknowledged: boolean;
  acknowledged_by?: string;
  acknowledged_date?: Date;
  created_at: Date
export class PharmacyManagementService {
  private drugs: Map<string, Drug> = new Map();
  private prescriptions: Map<string, Prescription> = new Map();
  private inventory: Map<string, InventoryItem> = new Map();
  private dispensingRecords: Map<string, DispensingRecord[]> = new Map();
  private allergies: Map<string, PatientAllergy[]> = new Map();
  private drugInteractions: DrugInteraction[] = [];
  private clinicalAlerts: Map<string, ClinicalAlert[]> = new Map(),
  constructor() {
    this.initializeDrugDatabase();
    this.initializeDrugInteractions();
  }

  /**
   * Initialize common drugs;
   */
  private initializeDrugDatabase(): void {
    const commonDrugs: Omit<Drug, 'id' | 'created_at' | 'updated_at'>[] = [
      {
        ndc: '0781-1506-01',
        generic_name: 'Lisinopril',
        brand_name: 'Prinivil',
        drug_class: 'ACE Inhibitor',
        therapeutic_class: 'Cardiovascular',
        controlled_substance_schedule: 'none',
        dosage_forms: ['tablet'],
        strengths: ['5mg', '10mg', '20mg'],
        route_of_administration: ['oral'],
        manufacturer: 'Sandoz',
        pregnancy_category: 'C',
        black_box_warning: false,
        formulary_status: 'preferred',
        cost_per_unit: 0.15,
        is_active: true,
      },
      {
        ndc: '0071-0222-23',
        generic_name: 'Atorvastatin',
        brand_name: 'Lipitor',
        drug_class: 'HMG-CoA Reductase Inhibitor',
        therapeutic_class: 'Cardiovascular',
        controlled_substance_schedule: 'none',
        dosage_forms: ['tablet'],
        strengths: ['10mg', '20mg', '40mg', '80mg'],
        route_of_administration: ['oral'],
        manufacturer: 'Pfizer',
        pregnancy_category: 'X',
        black_box_warning: false,
        formulary_status: 'preferred',
        cost_per_unit: 0.25,
        is_active: true,
      },
      {
        ndc: '0093-7267-56',
        generic_name: 'Metformin',
        brand_name: 'Glucophage',
        drug_class: 'Biguanide',
        therapeutic_class: 'Antidiabetic',
        controlled_substance_schedule: 'none',
        dosage_forms: ['tablet', 'extended-release tablet'],
        strengths: ['500mg', '850mg', '1000mg'],
        route_of_administration: ['oral'],
        manufacturer: 'Teva',
        pregnancy_category: 'B',
        black_box_warning: true,
        formulary_status: 'preferred',
        cost_per_unit: 0.12,
        is_active: true,
      },
      {
        ndc: '0172-4368-70',
        generic_name: 'Oxycodone',
        brand_name: 'OxyContin',
        drug_class: 'Opioid Analgesic',
        therapeutic_class: 'Pain Management',
        controlled_substance_schedule: 'II',
        dosage_forms: ['tablet', 'extended-release tablet'],
        strengths: ['5mg', '10mg', '15mg', '20mg', '30mg'],
        route_of_administration: ['oral'],
        manufacturer: 'Purdue Pharma',
        dea_schedule: 'II',
        pregnancy_category: 'C',
        black_box_warning: true,
        formulary_status: 'restricted',
        cost_per_unit: 2.50,
        is_active: true,
      },
    ];

    commonDrugs.forEach(drugData => {
      const drug: Drug = {
        ...drugData,
        id: uuidv4(),
        created_at: new Date(),
        updated_at: new Date(),
      };
      this.drugs.set(drug.ndc, drug);
    });
  }

  /**
   * Initialize common drug interactions;
   */
  private initializeDrugInteractions(): void {
    this.drugInteractions = [
      {
        drug1_ndc: '0781-1506-01', // Lisinopril
        drug1_name: 'Lisinopril',
        drug2_ndc: '0093-7267-56', // Metformin
        drug2_name: 'Metformin',
        severity: 'moderate',
        mechanism: 'Additive hypotensive effects',
        clinical_effect: 'May cause excessive blood pressure lowering',
        management: 'Monitor blood pressure closely when initiating therapy',
        documentation_level: 'good',
      },
      {
        drug1_ndc: '0071-0222-23', // Atorvastatin
        drug2_ndc: '0172-4368-70', // Oxycodone
        drug1_name: 'Atorvastatin',
        drug2_name: 'Oxycodone',
        severity: 'minor',
        mechanism: 'CYP3A4 competition',
        clinical_effect: 'Possible increased statin levels',
        management: 'Monitor for muscle pain or weakness',
        documentation_level: 'fair',
      },
    ];
  }

  /**
   * Add new drug to database;
   */
  async addDrug(drugData: z.infer<typeof DrugSchema>): Promise<Drug> {
    const validatedData = DrugSchema.parse(drugData);
    
    if (this.drugs.has(validatedData.ndc)) {
      throw new Error(`Drug with NDC ${validatedData.ndc} already exists`);
    }

    const drug: Drug = {
      ...validatedData,
      id: uuidv4(),
      created_at: new Date(),
      updated_at: new Date(),
    };

    this.drugs.set(drug.ndc, drug);
    return drug;
  }

  /**
   * Search drugs;
   */
  async searchDrugs(query: string, activeOnly: boolean = true): Promise<Drug[]> {
    const drugs = Array.from(this.drugs.values());
    const searchQuery = query.toLowerCase();

    return drugs.filter(drug => {
      if (activeOnly && !drug.is_active) return false;
      
      return (
        drug.generic_name.toLowerCase().includes(searchQuery) ||
        drug.brand_name?.toLowerCase().includes(searchQuery) ||
        drug.ndc.includes(searchQuery) ||
        drug.drug_class.toLowerCase().includes(searchQuery);
      );
    });
  }

  /**
   * Create prescription;
   */
  async createPrescription(prescriptionData: z.infer<typeof PrescriptionSchema>): Promise<Prescription> {
    const validatedData = PrescriptionSchema.parse(prescriptionData);
    
    // Validate drug exists
    const drug = this.drugs.get(validatedData.drug_ndc);
    if (!drug) {
      throw new Error(`Drug with NDC ${validatedData.drug_ndc} not found`);
    }

    const prescriptionId = uuidv4();
    const prescriptionNumber = this.generatePrescriptionNumber();

    const prescription: Prescription = {
      ...validatedData,
      id: prescriptionId,
      prescription_number: prescriptionNumber,
      status: 'pending',
      created_at: new Date(),
      updated_at: new Date(),
    };

    this.prescriptions.set(prescriptionId, prescription);

    // Check for clinical alerts
    await this.checkClinicalAlerts(prescription);

    return prescription;
  }

  /**
   * Generate prescription number;
   */
  private generatePrescriptionNumber(): string {
    const timestamp = crypto.getRandomValues(new Uint32Array(1))[0].toString().slice(-6);
    const random = Math.floor(crypto.getRandomValues(new Uint32Array(1))[0] / (0xFFFFFFFF + 1) * 10000).toString().padStart(4, '0');
    return `RX/* SECURITY: Template literal eliminated */
  }

  /**
   * Check for clinical alerts;
   */
  private async checkClinicalAlerts(prescription: Prescription): Promise<void> {
    const alerts: ClinicalAlert[] = [];

    // Check for drug allergies
    const patientAllergies = this.allergies.get(prescription.patient_id) || [];
    const drugAllergyAlert = this.checkDrugAllergy(prescription, patientAllergies);
    if (drugAllergyAlert) {
      alerts.push(drugAllergyAlert);
    }

    // Check for drug interactions
    const patientPrescriptions = Array.from(this.prescriptions.values());
      .filter(p => p.patient_id === prescription.patient_id && p.status !== 'cancelled');
    
    const interactionAlerts = this.checkDrugInteractions(prescription, patientPrescriptions);
    alerts.push(...interactionAlerts);

    // Check for duplicate therapy
    const duplicateAlert = this.checkDuplicateTherapy(prescription, patientPrescriptions);
    if (duplicateAlert) {
      alerts.push(duplicateAlert);
    }

    // Store alerts
    if (alerts.length > 0) {
      this.clinicalAlerts.set(prescription.id, alerts);
    }
  }

  /**
   * Check for drug allergy;
   */
  private checkDrugAllergy(prescription: Prescription, allergies: PatientAllergy[]): ClinicalAlert | null {
    const drug = this.drugs.get(prescription.drug_ndc);
    if (!drug) return null;

    const drugAllergy = allergies.find(allergy => 
      allergy.allergen_type === 'drug' &&;
      allergy.status === 'active' &&;
      (allergy.allergen.toLowerCase() === drug.generic_name.toLowerCase() ||;
       allergy.allergen.toLowerCase() === drug.brand_name?.toLowerCase() ||;
       allergy.allergen.toLowerCase() === drug.drug_class.toLowerCase());
    );

    if (drugAllergy) {
      return {
        id: uuidv4(),
        patient_id: prescription.patient_id,
        prescription_id: prescription.id,
        alert_type: 'drug_allergy',
        severity: drugAllergy.severity === 'life-threatening' ? 'critical' : 'high',
        message: `Patient has documented allergy to ${drugAllergy.allergen} - ${drugAllergy.reaction}`,
        recommendation: 'Consider alternative medication. Review allergy history with patient.',
        acknowledged: false,
        created_at: new Date(),
      };
    }

    return null;
  }

  /**
   * Check for drug interactions;
   */
  private checkDrugInteractions(prescription: Prescription, existingPrescriptions: Prescription[]): ClinicalAlert[] {
    const alerts: ClinicalAlert[] = [];

    for (const existingRx of existingPrescriptions) {
      if (existingRx.id === prescription.id) continue;

      const interaction = this.drugInteractions.find(di =>
        (di.drug1_ndc === prescription.drug_ndc && di.drug2_ndc === existingRx.drug_ndc) ||;
        (di.drug2_ndc === prescription.drug_ndc && di.drug1_ndc === existingRx.drug_ndc);
      );

      if (interaction) {
        const severity = interaction.severity === 'contraindicated' ? 'critical' :
                        interaction.severity === 'major' ? 'high' :
                        interaction.severity === 'moderate' ? 'medium' : 'low';

        alerts.push({
          id: uuidv4(),
          patient_id: prescription.patient_id,
          prescription_id: prescription.id,
          alert_type: 'drug_interaction',
          severity,
          message: `Drug interaction: ${interaction.drug1_name} and ${interaction.drug2_name} - ${interaction.clinical_effect}`,
          recommendation: interaction.management,
          acknowledged: false,
          created_at: new Date(),
        });
      }
    }

    return alerts;
  }

  /**
   * Check for duplicate therapy;
   */
  private checkDuplicateTherapy(prescription: Prescription, existingPrescriptions: Prescription[]): ClinicalAlert | null {
    const newDrug = this.drugs.get(prescription.drug_ndc);
    if (!newDrug) return null;

    const duplicateTherapy = existingPrescriptions.find(existingRx => {
      const existingDrug = this.drugs.get(existingRx.drug_ndc);
      return existingDrug &&;
             existingDrug.therapeutic_class === newDrug.therapeutic_class &&;
             existingDrug.drug_class === newDrug.drug_class &&;
             existingRx.status !== 'cancelled';
    });

    if (duplicateTherapy) {
      return {
        id: uuidv4(),
        patient_id: prescription.patient_id,
        prescription_id: prescription.id,
        alert_type: 'duplicate_therapy',
        severity: 'medium',
        message: `Potential duplicate therapy: ${newDrug.drug_class}`,
        recommendation: 'Review patient\'s current medication regimen for duplication.',
        acknowledged: false,
        created_at: new Date(),
      };
    }

    return null;
  }

  /**
   * Get prescriptions with filters;
   */
  async getPrescriptions(filters?: {
    patient_id?: string;
    prescriber_id?: string;
    status?: Prescription['status'];
    date_from?: string;
    date_to?: string;
    page?: number;
    limit?: number;
  }): Promise<{ prescriptions: Prescription[]; total: number; totalPages: number }> {
    const { page = 1, limit = 10, ...searchFilters } = filters || {};
    
    let filteredPrescriptions = Array.from(this.prescriptions.values());

    // Apply filters
    if (searchFilters.patient_id) {
      filteredPrescriptions = filteredPrescriptions.filter(rx => rx.patient_id === searchFilters.patient_id);
    }

    if (searchFilters.prescriber_id) {
      filteredPrescriptions = filteredPrescriptions.filter(rx => rx.prescriber_id === searchFilters.prescriber_id);
    }

    if (searchFilters.status) {
      filteredPrescriptions = filteredPrescriptions.filter(rx => rx.status === searchFilters.status);
    }

    if (searchFilters.date_from) {
      const fromDate = new Date(searchFilters.date_from);
      filteredPrescriptions = filteredPrescriptions.filter(rx => rx.created_at >= fromDate);
    }

    if (searchFilters.date_to) {
      const toDate = new Date(searchFilters.date_to);
      filteredPrescriptions = filteredPrescriptions.filter(rx => rx.created_at <= toDate);
    }

    // Sort by creation date (newest first)
    filteredPrescriptions.sort((a, b) => b.created_at.getTime() - a.created_at.getTime())

    // Pagination
    const total = filteredPrescriptions.length;
    const totalPages = Math.ceil(total / limit);
    const startIndex = (page - 1) * limit;
    const prescriptions = filteredPrescriptions.slice(startIndex, startIndex + limit);

    return { prescriptions, total, totalPages };
  }

  /**
   * Verify prescription;
   */
  async verifyPrescription(prescriptionId: string, pharmacistId: string): Promise<Prescription> {
    const prescription = this.prescriptions.get(prescriptionId);
    if (!prescription) {
      throw new Error('Prescription not found');
    }

    if (prescription.status !== 'pending') {
      throw new Error('Prescription is not in pending status');
    }

    // Check for unacknowledged critical alerts
    const alerts = this.clinicalAlerts.get(prescriptionId) || [];
    const criticalAlerts = alerts.filter(alert => alert.severity === 'critical' && !alert.acknowledged);
    
    if (criticalAlerts.length > 0) {
      throw new Error('Cannot verify prescription with unacknowledged critical alerts');
    }

    prescription.status = 'verified';
    prescription.verification_date = new Date();
    prescription.updated_at = new Date();

    this.prescriptions.set(prescriptionId, prescription);
    return prescription;
  }

  /**
   * Dispense medication;
   */
  async dispenseMedication(dispensingData: z.infer<typeof DispensingSchema>): Promise<DispensingRecord> {
    const validatedData = DispensingSchema.parse(dispensingData);
    
    const prescription = this.prescriptions.get(validatedData.prescription_id);
    if (!prescription) {
      throw new Error('Prescription not found');
    }

    if (prescription.status !== 'verified') {
      throw new Error('Prescription must be verified before dispensing');
    }

    // Check inventory availability
    const inventoryItem = this.checkInventoryAvailability(prescription.drug_ndc, validatedData.quantity_dispensed);
    if (!inventoryItem) {
      throw new Error('Insufficient inventory to dispense medication');
    }

    // Calculate refill number
    const existingDispensings = this.dispensingRecords.get(validatedData.prescription_id) || [];
    const refillNumber = existingDispensings.length;

    // Calculate costs (simplified)
    const drug = this.drugs.get(prescription.drug_ndc)
    const totalCost = drug ? drug.cost_per_unit * validatedData.quantity_dispensed : 0;
    const copayAmount = totalCost * 0.2; // 20% copay
    const insuranceAmount = totalCost - copayAmount;

    const dispensingRecord: DispensingRecord = {
      ...validatedData,
      id: uuidv4(),
      refill_number: refillNumber,
      total_cost: totalCost,
      copay_amount: copayAmount,
      insurance_amount: insuranceAmount,
      created_at: new Date(),
      updated_at: new Date(),
    };

    // Update prescription status
    prescription.status = 'dispensed';
    prescription.dispensing_date = new Date(validatedData.dispensing_date);
    prescription.updated_at = new Date();
    this.prescriptions.set(prescription.id, prescription);

    // Update inventory
    this.updateInventory(prescription.drug_ndc, validatedData.quantity_dispensed);

    // Store dispensing record
    existingDispensings.push(dispensingRecord);
    this.dispensingRecords.set(validatedData.prescription_id, existingDispensings);

    return dispensingRecord;
  }

  /**
   * Check inventory availability;
   */
  private checkInventoryAvailability(drugNdc: string, quantityNeeded: number): InventoryItem | null {
    const inventoryItems = Array.from(this.inventory.values());
      .filter(item => item.drug_ndc === drugNdc && item.quantity_on_hand >= quantityNeeded);
    
    return inventoryItems.length > 0 ? inventoryItems[0] : null;
  }

  /**
   * Update inventory after dispensing;
   */
  private updateInventory(drugNdc: string, quantityDispensed: number): void {
    const inventoryItems = Array.from(this.inventory.values());
      .filter(item => item.drug_ndc === drugNdc);
      .sort((a, b) => new Date(a.expiration_date).getTime() - new Date(b.expiration_date).getTime()); // FIFO

    let remainingQuantity = quantityDispensed;
    
    for (const item of inventoryItems) {
      if (remainingQuantity <= 0) break;
      
      const quantityFromThisLot = Math.min(item.quantity_on_hand, remainingQuantity);
      item.quantity_on_hand -= quantityFromThisLot;
      item.updated_at = new Date();
      
      this.inventory.set(item.id, item);
      remainingQuantity -= quantityFromThisLot;
    }
  }

  /**
   * Add patient allergy;
   */
  async addPatientAllergy(allergyData: z.infer<typeof AllergySchema>): Promise<PatientAllergy> {
    const validatedData = AllergySchema.parse(allergyData);
    
    const allergy: PatientAllergy = {
      ...validatedData,
      id: uuidv4(),
      created_at: new Date(),
      updated_at: new Date(),
    };

    const patientAllergies = this.allergies.get(validatedData.patient_id) || [];
    patientAllergies.push(allergy);
    this.allergies.set(validatedData.patient_id, patientAllergies);

    return allergy;
  }

  /**
   * Get patient allergies;
   */
  async getPatientAllergies(patientId: string): Promise<PatientAllergy[]> {
    return this.allergies.get(patientId) || []
  }

  /**
   * Get clinical alerts for prescription;
   */
  async getClinicalAlerts(prescriptionId: string): Promise<ClinicalAlert[]> {
    return this.clinicalAlerts.get(prescriptionId) || []
  }

  /**
   * Acknowledge clinical alert;
   */
  async acknowledgeClinical/* SECURITY: Alert removed */: Promise<void> {
    // Find alert across all prescriptions
    for (const [prescriptionId, alerts] of this.clinicalAlerts.entries()) {
      const alert = alerts.find(a => a.id === alertId);
      if (alert) {
        alert.acknowledged = true;
        alert.acknowledged_by = pharmacistId;
        alert.acknowledged_date = new Date();
        if (reason) {
          alert.override_reason = reason;
        }
        this.clinicalAlerts.set(prescriptionId, alerts);
        return;
      }
    }
    
    throw new Error('Alert not found');
  }

  /**
   * Get pharmacy statistics;
   */
  async getPharmacyStatistics(dateFrom?: string, dateTo?: string): Promise<{
    totalPrescriptions: number,
    dispensedPrescriptions: number,
    pendingPrescriptions: number,
    totalClinicalAlerts: number,
    criticalAlerts: number,
    averageProcessingTime: number,
    totalRevenue: number
  }> {
    const prescriptions = Array.from(this.prescriptions.values());
    
    let filteredPrescriptions = prescriptions;
    if (dateFrom) {
      const fromDate = new Date(dateFrom);
      filteredPrescriptions = filteredPrescriptions.filter(rx => rx.created_at >= fromDate);
    }
    if (dateTo) {
      const toDate = new Date(dateTo);
      filteredPrescriptions = filteredPrescriptions.filter(rx => rx.created_at <= toDate);
    }

    const totalPrescriptions = filteredPrescriptions.length;
    const dispensedPrescriptions = filteredPrescriptions.filter(rx => rx.status === 'dispensed').length;
    const pendingPrescriptions = filteredPrescriptions.filter(rx => rx.status === 'pending').length;

    // Count alerts
    let totalClinicalAlerts = 0;
    let criticalAlerts = 0;
    Array.from(this.clinicalAlerts.values()).forEach(alerts => {
      totalClinicalAlerts += alerts.length;
      criticalAlerts += alerts.filter(alert => alert.severity === 'critical').length;
    });

    // Calculate average processing time
    let totalProcessingHours = 0;
    let processedCount = 0;
    filteredPrescriptions.forEach(rx => {
      if (rx.dispensing_date && rx.verification_date) {
        const hours = (rx.dispensing_date.getTime() - rx.verification_date.getTime()) / (1000 * 60 * 60);
        totalProcessingHours += hours;
        processedCount++;
      }
    });
    const averageProcessingTime = processedCount > 0 ? totalProcessingHours / processedCount : 0;

    // Calculate total revenue
    let totalRevenue = 0;
    Array.from(this.dispensingRecords.values()).forEach(records => {
      totalRevenue += records.reduce((sum, record) => sum + record.total_cost, 0);
    });

    return {
      totalPrescriptions,
      dispensedPrescriptions,
      pendingPrescriptions,
      totalClinicalAlerts,
      criticalAlerts,
      averageProcessingTime: Math.round(averageProcessingTime * 100) / 100,
      totalRevenue: Math.round(totalRevenue * 100) / 100,
    };
  }

  /**
   * Get low inventory alerts;
   */
  async getLowInventoryAlerts(): Promise<InventoryItem[]> {
    return Array.from(this.inventory.values());
      .filter(item => item.quantity_on_hand <= item.reorder_level);
  }

  /**
   * Get expiring medications;
   */
  async getExpiringMedications(daysAhead: number = 30): Promise<InventoryItem[]> {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() + daysAhead);
    
    return Array.from(this.inventory.values());
      .filter(item => new Date(item.expiration_date) <= cutoffDate);
      .sort((a, b) => new Date(a.expiration_date).getTime() - new Date(b.expiration_date).getTime());
  }
}

// Export singleton instance
export const pharmacyManagementService = new PharmacyManagementService();
