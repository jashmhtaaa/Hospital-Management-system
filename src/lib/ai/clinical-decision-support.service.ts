/**
 * Clinical Decision Support System (CDSS)
 * AI-powered clinical recommendations and alerts for healthcare providers
 * Implements evidence-based medicine and clinical guidelines
 */

import { EventEmitter } from 'events';
import { PrismaClient } from '@prisma/client';

export interface CDSSRecommendation {
  id: string;
  type: CDSSRecommendationType;
  priority: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  description: string;
  recommendation: string;
  evidence: EvidenceBase;
  clinicalContext: ClinicalContext;
  patientSpecific: boolean;
  confidence: number; // 0-100
  riskScore?: number;
  timeframe: 'immediate' | 'within_hours' | 'within_days' | 'routine';
  alerts: CDSSAlert[];
  references: ClinicalReference[];
  createdAt: Date;
  expiresAt?: Date;
  acknowledgedBy?: string;
  acknowledgedAt?: Date;
  dismissed?: boolean;
  actionTaken?: string;
}

export type CDSSRecommendationType = 
  | 'drug_interaction'
  | 'dosage_adjustment' 
  | 'allergy_alert'
  | 'duplicate_therapy'
  | 'contraindication'
  | 'lab_monitoring'
  | 'diagnostic_suggestion'
  | 'treatment_protocol'
  | 'preventive_care'
  | 'quality_measure'
  | 'cost_optimization'
  | 'clinical_pathway'
  | 'risk_assessment'
  | 'discharge_planning';

export interface EvidenceBase {
  level: 'A' | 'B' | 'C' | 'D'; // Evidence levels
  source: 'randomized_trial' | 'observational' | 'expert_opinion' | 'guideline';
  guideline?: string;
  studies?: StudyReference[];
  lastUpdated: Date;
  strength: 'strong' | 'moderate' | 'weak';
}

export interface ClinicalContext {
  patientId: string;
  encounterId?: string;
  department: string;
  provider: string;
  conditions: string[];
  medications: MedicationContext[];
  allergies: AllergyContext[];
  vitals?: VitalSigns;
  labResults?: LabResult[];
  age: number;
  gender: 'male' | 'female' | 'other';
  weight?: number;
  height?: number;
  kidneyFunction?: number; // eGFR
  liverFunction?: 'normal' | 'mild' | 'moderate' | 'severe';
}

export interface MedicationContext {
  name: string;
  dose: string;
  frequency: string;
  route: string;
  startDate: Date;
  endDate?: Date;
  prescriber: string;
  indication?: string;
}

export interface AllergyContext {
  allergen: string;
  reaction: string;
  severity: 'mild' | 'moderate' | 'severe' | 'life_threatening';
  verified: boolean;
}

export interface VitalSigns {
  temperature?: number;
  heartRate?: number;
  bloodPressure?: {
    systolic: number;
    diastolic: number;
  };
  respiratoryRate?: number;
  oxygenSaturation?: number;
  pain?: number; // 0-10 scale
  timestamp: Date;
}

export interface LabResult {
  test: string;
  value: number;
  unit: string;
  referenceRange: string;
  abnormal: boolean;
  critical: boolean;
  timestamp: Date;
}

export interface CDSSAlert {
  severity: 'info' | 'warning' | 'critical';
  message: string;
  actionRequired: boolean;
  category: 'safety' | 'efficacy' | 'cost' | 'quality';
}

export interface ClinicalReference {
  title: string;
  authors: string[];
  journal?: string;
  year: number;
  pmid?: string;
  doi?: string;
  url?: string;
  type: 'study' | 'guideline' | 'review' | 'meta_analysis';
}

export interface StudyReference {
  title: string;
  sampleSize: number;
  outcome: string;
  significance: number; // p-value
  effectSize?: number;
}

export interface DrugInteractionCheck {
  drug1: string;
  drug2: string;
  severity: 'minor' | 'moderate' | 'major' | 'contraindicated';
  mechanism: string;
  effect: string;
  management: string;
  references: ClinicalReference[];
}

export interface DosageAdjustment {
  medication: string;
  currentDose: string;
  recommendedDose: string;
  reason: string;
  factor: 'age' | 'weight' | 'kidney' | 'liver' | 'drug_interaction';
  calculation?: string;
}

export interface DiagnosticSuggestion {
  condition: string;
  probability: number;
  supportingFactors: string[];
  recommendedTests: string[];
  differentialDiagnoses: string[];
  urgency: 'routine' | 'urgent' | 'emergent';
}

export interface TreatmentProtocol {
  condition: string;
  protocol: string;
  steps: ProtocolStep[];
  duration: string;
  monitoring: string[];
  alternatives: string[];
}

export interface ProtocolStep {
  order: number;
  action: string;
  timing: string;
  criteria?: string;
  alternatives?: string[];
}

export interface RiskAssessment {
  riskFactor: string;
  score: number;
  category: 'low' | 'moderate' | 'high' | 'very_high';
  interventions: string[];
  timeline: string;
  reevaluate: string;
}

export interface QualityMeasure {
  measure: string;
  category: 'process' | 'outcome' | 'structure';
  compliance: boolean;
  gap?: string;
  action: string;
  deadline?: Date;
}

export interface PreventiveCare {
  service: string;
  indication: string;
  lastPerformed?: Date;
  nextDue: Date;
  overdue: boolean;
  priority: 'high' | 'medium' | 'low';
}

class ClinicalDecisionSupportService extends EventEmitter {
  private prisma: PrismaClient;
  private recommendations: Map<string, CDSSRecommendation> = new Map();
  private drugDatabase: Map<string, any> = new Map();
  private guidelineDatabase: Map<string, any> = new Map();
  private interactionDatabase: DrugInteractionCheck[] = [];
  private isInitialized = false;

  constructor() {
    super();
    this.prisma = new PrismaClient();
    this.initializeKnowledgeBase();
  }

  /**
   * Initialize clinical knowledge base
   */
  private async initializeKnowledgeBase(): Promise<void> {
    try {
      // Initialize drug database
      await this.loadDrugDatabase();
      
      // Initialize clinical guidelines
      await this.loadClinicalGuidelines();
      
      // Initialize interaction database
      await this.loadInteractionDatabase();
      
      this.isInitialized = true;
      this.emit('initialized');
      
      console.log('Clinical Decision Support System initialized');
    } catch (error) {
      console.error('Failed to initialize CDSS:', error);
      throw error;
    }
  }

  /**
   * Process clinical data and generate recommendations
   */
  async processPatientData(context: ClinicalContext): Promise<CDSSRecommendation[]> {
    if (!this.isInitialized) {
      throw new Error('CDSS not initialized');
    }

    const recommendations: CDSSRecommendation[] = [];

    try {
      // Drug interaction checks
      const drugInteractions = await this.checkDrugInteractions(context);
      recommendations.push(...drugInteractions);

      // Allergy alerts
      const allergyAlerts = await this.checkAllergies(context);
      recommendations.push(...allergyAlerts);

      // Dosage adjustments
      const dosageAdjustments = await this.checkDosageAdjustments(context);
      recommendations.push(...dosageAdjustments);

      // Lab monitoring recommendations
      const labMonitoring = await this.checkLabMonitoring(context);
      recommendations.push(...labMonitoring);

      // Diagnostic suggestions
      const diagnosticSuggestions = await this.generateDiagnosticSuggestions(context);
      recommendations.push(...diagnosticSuggestions);

      // Treatment protocols
      const treatmentProtocols = await this.recommendTreatmentProtocols(context);
      recommendations.push(...treatmentProtocols);

      // Preventive care reminders
      const preventiveCare = await this.checkPreventiveCare(context);
      recommendations.push(...preventiveCare);

      // Quality measures
      const qualityMeasures = await this.checkQualityMeasures(context);
      recommendations.push(...qualityMeasures);

      // Risk assessments
      const riskAssessments = await this.performRiskAssessments(context);
      recommendations.push(...riskAssessments);

      // Store recommendations
      recommendations.forEach(rec => {
        this.recommendations.set(rec.id, rec);
      });

      // Emit events for critical recommendations
      const criticalRecs = recommendations.filter(r => r.priority === 'critical');
      if (criticalRecs.length > 0) {
        this.emit('critical_recommendations', {
          patientId: context.patientId,
          count: criticalRecs.length,
          recommendations: criticalRecs
        });
      }

      return recommendations.sort((a, b) => this.getPriorityWeight(b.priority) - this.getPriorityWeight(a.priority));

    } catch (error) {
      console.error('Error processing patient data:', error);
      throw error;
    }
  }

  /**
   * Check for drug interactions
   */
  private async checkDrugInteractions(context: ClinicalContext): Promise<CDSSRecommendation[]> {
    const recommendations: CDSSRecommendation[] = [];
    const medications = context.medications;

    for (let i = 0; i < medications.length; i++) {
      for (let j = i + 1; j < medications.length; j++) {
        const interaction = this.findDrugInteraction(medications[i].name, medications[j].name);
        
        if (interaction) {
          const rec: CDSSRecommendation = {
            id: `drug_interaction_${Date.now()}_${i}_${j}`,
            type: 'drug_interaction',
            priority: this.mapSeverityToPriority(interaction.severity),
            title: `Drug Interaction: ${interaction.drug1} + ${interaction.drug2}`,
            description: `${interaction.severity.toUpperCase()} interaction detected between ${interaction.drug1} and ${interaction.drug2}`,
            recommendation: interaction.management,
            evidence: {
              level: 'B',
              source: 'guideline',
              guideline: 'Drug Interaction Database',
              lastUpdated: new Date(),
              strength: 'strong'
            },
            clinicalContext: context,
            patientSpecific: true,
            confidence: 95,
            timeframe: interaction.severity === 'contraindicated' ? 'immediate' : 'within_hours',
            alerts: [{
              severity: interaction.severity === 'contraindicated' ? 'critical' : 'warning',
              message: interaction.effect,
              actionRequired: true,
              category: 'safety'
            }],
            references: interaction.references,
            createdAt: new Date()
          };

          recommendations.push(rec);
        }
      }
    }

    return recommendations;
  }

  /**
   * Check for medication allergies
   */
  private async checkAllergies(context: ClinicalContext): Promise<CDSSRecommendation[]> {
    const recommendations: CDSSRecommendation[] = [];
    
    for (const medication of context.medications) {
      for (const allergy of context.allergies) {
        if (this.checkAllergyMatch(medication.name, allergy.allergen)) {
          const rec: CDSSRecommendation = {
            id: `allergy_alert_${Date.now()}_${medication.name}`,
            type: 'allergy_alert',
            priority: allergy.severity === 'life_threatening' ? 'critical' : 'high',
            title: `Allergy Alert: ${medication.name}`,
            description: `Patient has documented ${allergy.severity} allergy to ${allergy.allergen}`,
            recommendation: `STOP ${medication.name} immediately. Consider alternative therapy.`,
            evidence: {
              level: 'A',
              source: 'expert_opinion',
              lastUpdated: new Date(),
              strength: 'strong'
            },
            clinicalContext: context,
            patientSpecific: true,
            confidence: 100,
            timeframe: 'immediate',
            alerts: [{
              severity: 'critical',
              message: `ALLERGY ALERT: ${allergy.reaction}`,
              actionRequired: true,
              category: 'safety'
            }],
            references: [],
            createdAt: new Date()
          };

          recommendations.push(rec);
        }
      }
    }

    return recommendations;
  }

  /**
   * Check for required dosage adjustments
   */
  private async checkDosageAdjustments(context: ClinicalContext): Promise<CDSSRecommendation[]> {
    const recommendations: CDSSRecommendation[] = [];
    
    for (const medication of context.medications) {
      const adjustment = this.calculateDosageAdjustment(medication, context);
      
      if (adjustment) {
        const rec: CDSSRecommendation = {
          id: `dosage_adjustment_${Date.now()}_${medication.name}`,
          type: 'dosage_adjustment',
          priority: 'medium',
          title: `Dosage Adjustment: ${medication.name}`,
          description: `Current dose may need adjustment based on ${adjustment.reason}`,
          recommendation: `Consider adjusting dose from ${adjustment.currentDose} to ${adjustment.recommendedDose}. ${adjustment.calculation || ''}`,
          evidence: {
            level: 'B',
            source: 'guideline',
            guideline: 'Dosing Guidelines',
            lastUpdated: new Date(),
            strength: 'moderate'
          },
          clinicalContext: context,
          patientSpecific: true,
          confidence: 85,
          timeframe: 'within_days',
          alerts: [{
            severity: 'warning',
            message: `Dosage adjustment recommended for ${medication.name}`,
            actionRequired: false,
            category: 'efficacy'
          }],
          references: [],
          createdAt: new Date()
        };

        recommendations.push(rec);
      }
    }

    return recommendations;
  }

  /**
   * Generate lab monitoring recommendations
   */
  private async checkLabMonitoring(context: ClinicalContext): Promise<CDSSRecommendation[]> {
    const recommendations: CDSSRecommendation[] = [];
    
    for (const medication of context.medications) {
      const monitoring = this.getLabMonitoringRequirements(medication.name);
      
      if (monitoring.length > 0) {
        const overdueLabs = monitoring.filter(lab => 
          !context.labResults?.some(result => 
            result.test === lab.test && 
            this.isRecentEnough(result.timestamp, lab.frequency)
          )
        );

        if (overdueLabs.length > 0) {
          const rec: CDSSRecommendation = {
            id: `lab_monitoring_${Date.now()}_${medication.name}`,
            type: 'lab_monitoring',
            priority: 'medium',
            title: `Lab Monitoring: ${medication.name}`,
            description: `Laboratory monitoring required for ${medication.name}`,
            recommendation: `Order the following labs: ${overdueLabs.map(lab => lab.test).join(', ')}`,
            evidence: {
              level: 'B',
              source: 'guideline',
              guideline: 'Drug Monitoring Guidelines',
              lastUpdated: new Date(),
              strength: 'strong'
            },
            clinicalContext: context,
            patientSpecific: true,
            confidence: 90,
            timeframe: 'within_days',
            alerts: [{
              severity: 'info',
              message: `Lab monitoring due for ${medication.name}`,
              actionRequired: false,
              category: 'safety'
            }],
            references: [],
            createdAt: new Date()
          };

          recommendations.push(rec);
        }
      }
    }

    return recommendations;
  }

  /**
   * Generate diagnostic suggestions based on symptoms and context
   */
  private async generateDiagnosticSuggestions(context: ClinicalContext): Promise<CDSSRecommendation[]> {
    const recommendations: CDSSRecommendation[] = [];
    
    // AI-powered diagnostic suggestions would go here
    // This is a simplified example
    
    return recommendations;
  }

  /**
   * Recommend treatment protocols
   */
  private async recommendTreatmentProtocols(context: ClinicalContext): Promise<CDSSRecommendation[]> {
    const recommendations: CDSSRecommendation[] = [];
    
    for (const condition of context.conditions) {
      const protocol = this.getTreatmentProtocol(condition);
      
      if (protocol) {
        const rec: CDSSRecommendation = {
          id: `treatment_protocol_${Date.now()}_${condition}`,
          type: 'treatment_protocol',
          priority: 'medium',
          title: `Treatment Protocol: ${condition}`,
          description: `Evidence-based treatment protocol available for ${condition}`,
          recommendation: `Consider following ${protocol.protocol} protocol for ${condition}`,
          evidence: {
            level: 'A',
            source: 'guideline',
            guideline: protocol.protocol,
            lastUpdated: new Date(),
            strength: 'strong'
          },
          clinicalContext: context,
          patientSpecific: true,
          confidence: 90,
          timeframe: 'routine',
          alerts: [{
            severity: 'info',
            message: `Treatment protocol available for ${condition}`,
            actionRequired: false,
            category: 'quality'
          }],
          references: [],
          createdAt: new Date()
        };

        recommendations.push(rec);
      }
    }

    return recommendations;
  }

  /**
   * Check preventive care requirements
   */
  private async checkPreventiveCare(context: ClinicalContext): Promise<CDSSRecommendation[]> {
    const recommendations: CDSSRecommendation[] = [];
    
    const preventiveServices = this.getPreventiveServices(context.age, context.gender);
    
    for (const service of preventiveServices) {
      if (service.overdue) {
        const rec: CDSSRecommendation = {
          id: `preventive_care_${Date.now()}_${service.service}`,
          type: 'preventive_care',
          priority: service.priority === 'high' ? 'medium' : 'low',
          title: `Preventive Care: ${service.service}`,
          description: `${service.service} is overdue for this patient`,
          recommendation: `Schedule ${service.service}. ${service.indication}`,
          evidence: {
            level: 'A',
            source: 'guideline',
            guideline: 'USPSTF Guidelines',
            lastUpdated: new Date(),
            strength: 'strong'
          },
          clinicalContext: context,
          patientSpecific: true,
          confidence: 95,
          timeframe: 'routine',
          alerts: [{
            severity: 'info',
            message: `${service.service} overdue`,
            actionRequired: false,
            category: 'quality'
          }],
          references: [],
          createdAt: new Date()
        };

        recommendations.push(rec);
      }
    }

    return recommendations;
  }

  /**
   * Check quality measures compliance
   */
  private async checkQualityMeasures(context: ClinicalContext): Promise<CDSSRecommendation[]> {
    const recommendations: CDSSRecommendation[] = [];
    
    // Quality measures logic would go here
    
    return recommendations;
  }

  /**
   * Perform risk assessments
   */
  private async performRiskAssessments(context: ClinicalContext): Promise<CDSSRecommendation[]> {
    const recommendations: CDSSRecommendation[] = [];
    
    // Risk assessment logic would go here
    
    return recommendations;
  }

  /**
   * Get recommendation by ID
   */
  getRecommendation(id: string): CDSSRecommendation | undefined {
    return this.recommendations.get(id);
  }

  /**
   * Get all recommendations for a patient
   */
  getPatientRecommendations(patientId: string): CDSSRecommendation[] {
    return Array.from(this.recommendations.values())
      .filter(rec => rec.clinicalContext.patientId === patientId)
      .filter(rec => !rec.dismissed && (!rec.expiresAt || rec.expiresAt > new Date()));
  }

  /**
   * Acknowledge a recommendation
   */
  async acknowledgeRecommendation(id: string, providerId: string, action?: string): Promise<boolean> {
    const recommendation = this.recommendations.get(id);
    
    if (!recommendation) {
      return false;
    }

    recommendation.acknowledgedBy = providerId;
    recommendation.acknowledgedAt = new Date();
    recommendation.actionTaken = action;

    // Store in database
    try {
      // In production, update database
      console.log(`Recommendation ${id} acknowledged by ${providerId}`);
      
      this.emit('recommendation_acknowledged', {
        recommendationId: id,
        providerId,
        action
      });

      return true;
    } catch (error) {
      console.error('Failed to acknowledge recommendation:', error);
      return false;
    }
  }

  /**
   * Dismiss a recommendation
   */
  async dismissRecommendation(id: string, providerId: string, reason?: string): Promise<boolean> {
    const recommendation = this.recommendations.get(id);
    
    if (!recommendation) {
      return false;
    }

    recommendation.dismissed = true;
    recommendation.acknowledgedBy = providerId;
    recommendation.acknowledgedAt = new Date();
    recommendation.actionTaken = `Dismissed: ${reason || 'No reason provided'}`;

    try {
      // In production, update database
      console.log(`Recommendation ${id} dismissed by ${providerId}`);
      
      this.emit('recommendation_dismissed', {
        recommendationId: id,
        providerId,
        reason
      });

      return true;
    } catch (error) {
      console.error('Failed to dismiss recommendation:', error);
      return false;
    }
  }

  /**
   * Get CDSS statistics
   */
  getStatistics(): {
    totalRecommendations: number;
    activeRecommendations: number;
    criticalRecommendations: number;
    acknowledgedRecommendations: number;
    dismissedRecommendations: number;
    byType: Record<CDSSRecommendationType, number>;
  } {
    const all = Array.from(this.recommendations.values());
    const active = all.filter(r => !r.dismissed && (!r.expiresAt || r.expiresAt > new Date()));
    const critical = active.filter(r => r.priority === 'critical');
    const acknowledged = all.filter(r => r.acknowledgedBy && !r.dismissed);
    const dismissed = all.filter(r => r.dismissed);

    const byType: Record<CDSSRecommendationType, number> = {} as any;
    all.forEach(rec => {
      byType[rec.type] = (byType[rec.type] || 0) + 1;
    });

    return {
      totalRecommendations: all.length,
      activeRecommendations: active.length,
      criticalRecommendations: critical.length,
      acknowledgedRecommendations: acknowledged.length,
      dismissedRecommendations: dismissed.length,
      byType
    };
  }

  // Private helper methods

  private async loadDrugDatabase(): Promise<void> {
    // Load drug database from external source or file
    // This would typically integrate with a drug database like First DataBank or Lexicomp
    console.log('Loading drug database...');
  }

  private async loadClinicalGuidelines(): Promise<void> {
    // Load clinical guidelines from medical societies
    console.log('Loading clinical guidelines...');
  }

  private async loadInteractionDatabase(): Promise<void> {
    // Sample drug interactions
    this.interactionDatabase = [
      {
        drug1: 'warfarin',
        drug2: 'aspirin',
        severity: 'major',
        mechanism: 'Additive anticoagulant effect',
        effect: 'Increased bleeding risk',
        management: 'Monitor INR closely. Consider alternative antiplatelet if needed.',
        references: []
      },
      {
        drug1: 'simvastatin',
        drug2: 'clarithromycin',
        severity: 'contraindicated',
        mechanism: 'CYP3A4 inhibition',
        effect: 'Increased statin levels, rhabdomyolysis risk',
        management: 'Avoid combination. Use alternative antibiotic or suspend statin.',
        references: []
      }
    ];
  }

  private findDrugInteraction(drug1: string, drug2: string): DrugInteractionCheck | undefined {
    return this.interactionDatabase.find(interaction =>
      (interaction.drug1.toLowerCase() === drug1.toLowerCase() && 
       interaction.drug2.toLowerCase() === drug2.toLowerCase()) ||
      (interaction.drug1.toLowerCase() === drug2.toLowerCase() && 
       interaction.drug2.toLowerCase() === drug1.toLowerCase())
    );
  }

  private checkAllergyMatch(medication: string, allergen: string): boolean {
    // Simplified allergy matching - in production, this would use drug class mappings
    return medication.toLowerCase().includes(allergen.toLowerCase()) ||
           allergen.toLowerCase().includes(medication.toLowerCase());
  }

  private calculateDosageAdjustment(medication: MedicationContext, context: ClinicalContext): DosageAdjustment | null {
    // Simplified dosage calculation - in production, this would use comprehensive dosing algorithms
    if (context.kidneyFunction && context.kidneyFunction < 60) {
      return {
        medication: medication.name,
        currentDose: medication.dose,
        recommendedDose: '50% of current dose',
        reason: 'reduced kidney function',
        factor: 'kidney',
        calculation: `eGFR ${context.kidneyFunction} mL/min/1.73m²`
      };
    }
    
    return null;
  }

  private getLabMonitoringRequirements(medication: string): Array<{test: string; frequency: string}> {
    // Sample monitoring requirements
    const monitoringMap: Record<string, Array<{test: string; frequency: string}>> = {
      'warfarin': [{ test: 'INR', frequency: 'weekly' }],
      'lithium': [{ test: 'lithium level', frequency: 'monthly' }],
      'digoxin': [{ test: 'digoxin level', frequency: 'monthly' }]
    };
    
    return monitoringMap[medication.toLowerCase()] || [];
  }

  private isRecentEnough(timestamp: Date, frequency: string): boolean {
    const now = new Date();
    const daysDiff = (now.getTime() - timestamp.getTime()) / (1000 * 60 * 60 * 24);
    
    switch (frequency) {
      case 'daily': return daysDiff < 1;
      case 'weekly': return daysDiff < 7;
      case 'monthly': return daysDiff < 30;
      default: return false;
    }
  }

  private getTreatmentProtocol(condition: string): TreatmentProtocol | null {
    // Sample treatment protocols
    const protocols: Record<string, TreatmentProtocol> = {
      'pneumonia': {
        condition: 'Community-Acquired Pneumonia',
        protocol: 'CAP Treatment Protocol',
        steps: [
          { order: 1, action: 'Assess severity (CURB-65)', timing: 'Initial assessment' },
          { order: 2, action: 'Start empiric antibiotics', timing: 'Within 4 hours' },
          { order: 3, action: 'Monitor clinical response', timing: '48-72 hours' }
        ],
        duration: '5-7 days',
        monitoring: ['Temperature', 'White blood count', 'Chest X-ray'],
        alternatives: ['Outpatient management for low-risk patients']
      }
    };
    
    return protocols[condition.toLowerCase()] || null;
  }

  private getPreventiveServices(age: number, gender: string): PreventiveCare[] {
    const services: PreventiveCare[] = [];
    
    // Sample preventive care recommendations
    if (age >= 50) {
      services.push({
        service: 'Colonoscopy',
        indication: 'Colorectal cancer screening',
        nextDue: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
        overdue: true,
        priority: 'high'
      });
    }
    
    if (gender === 'female' && age >= 40) {
      services.push({
        service: 'Mammography',
        indication: 'Breast cancer screening',
        nextDue: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
        overdue: true,
        priority: 'high'
      });
    }
    
    return services;
  }

  private mapSeverityToPriority(severity: string): 'low' | 'medium' | 'high' | 'critical' {
    switch (severity) {
      case 'contraindicated': return 'critical';
      case 'major': return 'high';
      case 'moderate': return 'medium';
      case 'minor': return 'low';
      default: return 'low';
    }
  }

  private getPriorityWeight(priority: string): number {
    switch (priority) {
      case 'critical': return 4;
      case 'high': return 3;
      case 'medium': return 2;
      case 'low': return 1;
      default: return 0;
    }
  }

  /**
   * Shutdown the service
   */
  async shutdown(): Promise<void> {
    this.recommendations.clear();
    this.drugDatabase.clear();
    this.guidelineDatabase.clear();
    this.interactionDatabase = [];
    
    await this.prisma.$disconnect();
    
    this.emit('shutdown');
  }
}

// Export singleton instance
export const clinicalDecisionSupport = new ClinicalDecisionSupportService();
