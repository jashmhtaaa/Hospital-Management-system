/**
 * Quality Management Service - Persistent Implementation
 * Comprehensive quality management system for NABH/JCI compliance
 * Replaces in-memory storage with persistent database operations
 */

import { PrismaClient } from '@prisma/client';
import { z } from 'zod';
import { getEncryptionService } from '../../services/encryption_service_secure';

// Quality Indicator Schema
export const QualityIndicatorSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
  category: z.enum(['clinical', 'patient_safety', 'operational', 'financial']),
  source: z.enum(['jcaho_core_measures', 'nabh', 'jci', 'internal']),
  dataSource: z.enum(['manual', 'automated', 'integrated']).default('manual'),
  numeratorDefinition: z.string().min(1, 'Numerator definition is required'),
  denominatorDefinition: z.string().min(1, 'Denominator definition is required'),
  targetValue: z.number().optional(),
  targetOperator: z.enum(['>=', '<=', '=', '>', '<']).optional(),
  frequency: z.enum(['daily', 'weekly', 'monthly', 'quarterly', 'annually']),
  reportingLevel: z.enum(['department', 'hospital', 'system']),
  status: z.enum(['active', 'inactive', 'retired']).default('active'),
  stratificationCriteria: z.record(z.any()).optional(),
  createdBy: z.string(),
});

// Quality Event Schema
export const QualityEventSchema = z.object({
  eventType: z.enum(['incident', 'near_miss', 'adverse_event', 'sentinel_event']),
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  severity: z.enum(['low', 'medium', 'high', 'critical']),
  status: z.enum(['open', 'investigating', 'resolved', 'closed']).default('open'),
  patientId: z.string().optional(),
  departmentId: z.string().optional(),
  locationId: z.string().optional(),
  eventDateTime: z.date(),
  reportedBy: z.string(),
  categoryCode: z.string().optional(),
  subcategoryCode: z.string().optional(),
  rootCause: z.string().optional(),
  contributingFactors: z.array(z.string()).optional(),
  investigationNotes: z.string().optional(),
  correctiveActions: z.array(z.string()).optional(),
  preventiveActions: z.array(z.string()).optional(),
  lessonsLearned: z.string().optional(),
  qualityIndicatorId: z.string().optional(),
});

// Quality Assessment Schema
export const QualityAssessmentSchema = z.object({
  type: z.enum(['nabh', 'jci', 'internal_audit', 'peer_review']),
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  scope: z.enum(['department', 'hospital', 'service_line']),
  standardVersion: z.string().optional(),
  assessmentDate: z.date(),
  dueDate: z.date().optional(),
  leadAssessor: z.string(),
  assessors: z.array(z.string()).default([]),
  overallScore: z.number().optional(),
  maxScore: z.number().optional(),
  overallCompliance: z.number().min(0).max(100).optional(),
  findings: z.array(z.record(z.any())).optional(),
  recommendations: z.array(z.record(z.any())).optional(),
  certificationBody: z.string().optional(),
  certificationStatus: z.enum(['pending', 'achieved', 'expired', 'suspended']).optional(),
  certificationDate: z.date().optional(),
  expiryDate: z.date().optional(),
  createdBy: z.string(),
});

// Compliance Report Schema
export const ComplianceReportSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  reportType: z.enum(['nabh', 'jci', 'regulatory', 'internal']),
  regulatoryBody: z.string().min(1, 'Regulatory body is required'),
  standard: z.string().min(1, 'Standard is required'),
  reportingPeriod: z.string().min(1, 'Reporting period is required'),
  overallCompliance: z.number().min(0).max(100),
  status: z.enum(['compliant', 'non_compliant', 'conditional']),
  requirements: z.array(z.record(z.any())).default([]),
  findings: z.array(z.record(z.any())).optional(),
  gaps: z.array(z.record(z.any())).optional(),
  assessmentId: z.string().optional(),
  actionPlanId: z.string().optional(),
  submissionDate: z.date().optional(),
  submittedBy: z.string().optional(),
  approvalStatus: z.enum(['draft', 'submitted', 'approved', 'rejected']).default('draft'),
  createdBy: z.string(),
});

// Action Plan Schema
export const ActionPlanSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  type: z.enum(['corrective', 'preventive', 'improvement']),
  priority: z.enum(['low', 'medium', 'high', 'critical']),
  status: z.enum(['planning', 'approved', 'in_progress', 'completed', 'cancelled']).default('planning'),
  departmentId: z.string().optional(),
  impactedAreas: z.array(z.string()).optional(),
  targetDate: z.date(),
  startDate: z.date().optional(),
  ownerId: z.string(),
  teamMembers: z.array(z.string()).optional(),
  estimatedCost: z.number().optional(),
  actualCost: z.number().optional(),
  budgetApproved: z.boolean().default(false),
  createdBy: z.string(),
});

// Action Item Schema
export const ActionItemSchema = z.object({
  actionPlanId: z.string(),
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  status: z.enum(['not_started', 'in_progress', 'completed', 'cancelled', 'on_hold']).default('not_started'),
  assignedTo: z.string(),
  estimatedHours: z.number().optional(),
  actualHours: z.number().optional(),
  dueDate: z.date(),
  dependencies: z.array(z.string()).optional(),
  blockers: z.array(z.string()).optional(),
  progressPercentage: z.number().min(0).max(100).default(0),
  notes: z.string().optional(),
});

// Type definitions
export type QualityIndicator = z.infer<typeof QualityIndicatorSchema> & { id?: string };
export type QualityEvent = z.infer<typeof QualityEventSchema> & { id?: string };
export type QualityAssessment = z.infer<typeof QualityAssessmentSchema> & { id?: string };
export type ComplianceReport = z.infer<typeof ComplianceReportSchema> & { id?: string };
export type ActionPlan = z.infer<typeof ActionPlanSchema> & { id?: string };
export type ActionItem = z.infer<typeof ActionItemSchema> & { id?: string };

export interface QualityMetrics {
  id?: string;
  indicatorId: string;
  measurementPeriod: Date;
  periodType: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'annually';
  numeratorValue: number;
  denominatorValue: number;
  rate?: number;
  targetValue?: number;
  varianceFromTarget?: number;
  stratificationData?: Record<string, any>;
  dataQualityScore?: number;
  dataCompletenessRate?: number;
  dataSource: 'manual' | 'automated' | 'integrated';
  verificationStatus: 'pending' | 'verified' | 'rejected';
  enteredBy: string;
  verifiedBy?: string;
}

/**
 * Persistent Quality Management Service
 * Replaces in-memory storage with database persistence
 */
export class PersistentQualityManagementService {
  private prisma: PrismaClient;
  private encryptionService = getEncryptionService();
  
  // Fields that should be encrypted for sensitive data
  private readonly encryptedFields = [
    'description', 'investigationNotes', 'rootCause', 'lessonsLearned',
    'notes', 'findings', 'recommendations', 'observations', 'nonCompliances'
  ];

  constructor(prismaClient?: PrismaClient) {
    this.prisma = prismaClient || new PrismaClient();
  }

  // Quality Indicators Operations
  async createQualityIndicator(data: QualityIndicator): Promise<QualityIndicator & { id: string }> {
    try {
      const validated = QualityIndicatorSchema.parse(data);
      const encryptedData = await this.encryptionService.encryptObject(validated, this.encryptedFields);
      
      const indicator = await this.prisma.qualityIndicator.create({
        data: {
          ...encryptedData,
          stratificationCriteria: validated.stratificationCriteria ? 
            JSON.stringify(validated.stratificationCriteria) : null,
        }
      });

      return {
        ...validated,
        id: indicator.id,
      };
    } catch (error) {
      throw new Error(`Failed to create quality indicator: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async getQualityIndicator(id: string): Promise<QualityIndicator | null> {
    try {
      const indicator = await this.prisma.qualityIndicator.findUnique({
        where: { id }
      });

      if (!indicator) return null;
      return this.deserializeQualityIndicator(indicator);
    } catch (error) {
      throw new Error(`Failed to get quality indicator: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async getQualityIndicators(filters?: {
    category?: string;
    source?: string;
    status?: string;
  }): Promise<QualityIndicator[]> {
    try {
      const where: any = {};
      if (filters?.category) where.category = filters.category;
      if (filters?.source) where.source = filters.source;
      if (filters?.status) where.status = filters.status;

      const indicators = await this.prisma.qualityIndicator.findMany({
        where,
        orderBy: { createdAt: 'desc' }
      });

      return Promise.all(indicators.map(indicator => this.deserializeQualityIndicator(indicator)));
    } catch (error) {
      throw new Error(`Failed to get quality indicators: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async updateQualityIndicator(id: string, updates: Partial<QualityIndicator>): Promise<QualityIndicator> {
    try {
      const encryptedUpdates = await this.encryptionService.encryptObject(updates, this.encryptedFields);
      
      const updated = await this.prisma.qualityIndicator.update({
        where: { id },
        data: {
          ...encryptedUpdates,
          stratificationCriteria: updates.stratificationCriteria ? 
            JSON.stringify(updates.stratificationCriteria) : undefined,
          updatedBy: updates.createdBy, // Use createdBy as updatedBy for now
        }
      });

      return this.deserializeQualityIndicator(updated);
    } catch (error) {
      throw new Error(`Failed to update quality indicator: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // Quality Events Operations
  async createQualityEvent(data: QualityEvent): Promise<QualityEvent & { id: string }> {
    try {
      const validated = QualityEventSchema.parse(data);
      const encryptedData = await this.encryptionService.encryptObject(validated, this.encryptedFields);
      
      const event = await this.prisma.qualityEvent.create({
        data: {
          ...encryptedData,
          contributingFactors: validated.contributingFactors ? 
            JSON.stringify(validated.contributingFactors) : null,
          correctiveActions: validated.correctiveActions ? 
            JSON.stringify(validated.correctiveActions) : null,
          preventiveActions: validated.preventiveActions ? 
            JSON.stringify(validated.preventiveActions) : null,
        }
      });

      return {
        ...validated,
        id: event.id,
      };
    } catch (error) {
      throw new Error(`Failed to create quality event: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async getQualityEvent(id: string): Promise<QualityEvent | null> {
    try {
      const event = await this.prisma.qualityEvent.findUnique({
        where: { id }
      });

      if (!event) return null;
      return this.deserializeQualityEvent(event);
    } catch (error) {
      throw new Error(`Failed to get quality event: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async getQualityEvents(filters?: {
    eventType?: string;
    severity?: string;
    status?: string;
    departmentId?: string;
    dateFrom?: Date;
    dateTo?: Date;
  }): Promise<QualityEvent[]> {
    try {
      const where: any = {};
      if (filters?.eventType) where.eventType = filters.eventType;
      if (filters?.severity) where.severity = filters.severity;
      if (filters?.status) where.status = filters.status;
      if (filters?.departmentId) where.departmentId = filters.departmentId;
      if (filters?.dateFrom || filters?.dateTo) {
        where.eventDateTime = {};
        if (filters.dateFrom) where.eventDateTime.gte = filters.dateFrom;
        if (filters.dateTo) where.eventDateTime.lte = filters.dateTo;
      }

      const events = await this.prisma.qualityEvent.findMany({
        where,
        orderBy: { eventDateTime: 'desc' }
      });

      return Promise.all(events.map(event => this.deserializeQualityEvent(event)));
    } catch (error) {
      throw new Error(`Failed to get quality events: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // Quality Assessment Operations
  async createQualityAssessment(data: QualityAssessment): Promise<QualityAssessment & { id: string }> {
    try {
      const validated = QualityAssessmentSchema.parse(data);
      const encryptedData = await this.encryptionService.encryptObject(validated, this.encryptedFields);
      
      const assessment = await this.prisma.qualityAssessment.create({
        data: {
          ...encryptedData,
          assessors: JSON.stringify(validated.assessors),
          findings: validated.findings ? JSON.stringify(validated.findings) : null,
          recommendations: validated.recommendations ? JSON.stringify(validated.recommendations) : null,
          status: 'planned',
        }
      });

      return {
        ...validated,
        id: assessment.id,
      };
    } catch (error) {
      throw new Error(`Failed to create quality assessment: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async getQualityAssessment(id: string): Promise<QualityAssessment | null> {
    try {
      const assessment = await this.prisma.qualityAssessment.findUnique({
        where: { id },
        include: {
          criteria: true,
          reports: true,
          actionPlans: true,
        }
      });

      if (!assessment) return null;
      return this.deserializeQualityAssessment(assessment);
    } catch (error) {
      throw new Error(`Failed to get quality assessment: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async getQualityAssessments(filters?: {
    type?: string;
    status?: string;
    certificationStatus?: string;
  }): Promise<QualityAssessment[]> {
    try {
      const where: any = {};
      if (filters?.type) where.type = filters.type;
      if (filters?.status) where.status = filters.status;
      if (filters?.certificationStatus) where.certificationStatus = filters.certificationStatus;

      const assessments = await this.prisma.qualityAssessment.findMany({
        where,
        include: {
          criteria: true,
          reports: true,
          actionPlans: true,
        },
        orderBy: { assessmentDate: 'desc' }
      });

      return Promise.all(assessments.map(assessment => this.deserializeQualityAssessment(assessment)));
    } catch (error) {
      throw new Error(`Failed to get quality assessments: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // Quality Metrics Operations
  async recordQualityMetrics(data: QualityMetrics): Promise<QualityMetrics & { id: string }> {
    try {
      // Calculate rate if not provided
      const rate = data.rate || (data.denominatorValue > 0 ? 
        (data.numeratorValue / data.denominatorValue) * 100 : 0);
      
      // Calculate variance from target if target is provided
      let varianceFromTarget: number | undefined;
      if (data.targetValue !== undefined) {
        varianceFromTarget = rate - data.targetValue;
      }

      const metrics = await this.prisma.qualityMetrics.create({
        data: {
          indicatorId: data.indicatorId,
          measurementPeriod: data.measurementPeriod,
          periodType: data.periodType,
          numeratorValue: data.numeratorValue,
          denominatorValue: data.denominatorValue,
          rate,
          targetValue: data.targetValue,
          varianceFromTarget,
          stratificationData: data.stratificationData ? 
            JSON.stringify(data.stratificationData) : null,
          dataQualityScore: data.dataQualityScore,
          dataCompletenessRate: data.dataCompletenessRate,
          dataSource: data.dataSource,
          verificationStatus: data.verificationStatus,
          enteredBy: data.enteredBy,
          verifiedBy: data.verifiedBy,
        }
      });

      return {
        ...data,
        id: metrics.id,
        rate,
        varianceFromTarget,
      };
    } catch (error) {
      throw new Error(`Failed to record quality metrics: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async getQualityMetrics(indicatorId: string, filters?: {
    periodType?: string;
    dateFrom?: Date;
    dateTo?: Date;
  }): Promise<QualityMetrics[]> {
    try {
      const where: any = { indicatorId };
      if (filters?.periodType) where.periodType = filters.periodType;
      if (filters?.dateFrom || filters?.dateTo) {
        where.measurementPeriod = {};
        if (filters.dateFrom) where.measurementPeriod.gte = filters.dateFrom;
        if (filters.dateTo) where.measurementPeriod.lte = filters.dateTo;
      }

      const metrics = await this.prisma.qualityMetrics.findMany({
        where,
        orderBy: { measurementPeriod: 'desc' }
      });

      return metrics.map(metric => ({
        id: metric.id,
        indicatorId: metric.indicatorId,
        measurementPeriod: metric.measurementPeriod,
        periodType: metric.periodType as any,
        numeratorValue: metric.numeratorValue,
        denominatorValue: metric.denominatorValue,
        rate: metric.rate || undefined,
        targetValue: metric.targetValue || undefined,
        varianceFromTarget: metric.varianceFromTarget || undefined,
        stratificationData: metric.stratificationData ? 
          JSON.parse(metric.stratificationData) : undefined,
        dataQualityScore: metric.dataQualityScore || undefined,
        dataCompletenessRate: metric.dataCompletenessRate || undefined,
        dataSource: metric.dataSource as any,
        verificationStatus: metric.verificationStatus as any,
        enteredBy: metric.enteredBy,
        verifiedBy: metric.verifiedBy || undefined,
      }));
    } catch (error) {
      throw new Error(`Failed to get quality metrics: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // Compliance Report Operations
  async createComplianceReport(data: ComplianceReport): Promise<ComplianceReport & { id: string }> {
    try {
      const validated = ComplianceReportSchema.parse(data);
      const encryptedData = await this.encryptionService.encryptObject(validated, this.encryptedFields);
      
      const report = await this.prisma.complianceReport.create({
        data: {
          ...encryptedData,
          requirements: JSON.stringify(validated.requirements),
          findings: validated.findings ? JSON.stringify(validated.findings) : null,
          gaps: validated.gaps ? JSON.stringify(validated.gaps) : null,
        }
      });

      return {
        ...validated,
        id: report.id,
      };
    } catch (error) {
      throw new Error(`Failed to create compliance report: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async getComplianceReport(id: string): Promise<ComplianceReport | null> {
    try {
      const report = await this.prisma.complianceReport.findUnique({
        where: { id }
      });

      if (!report) return null;
      return this.deserializeComplianceReport(report);
    } catch (error) {
      throw new Error(`Failed to get compliance report: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // Action Plan Operations
  async createActionPlan(data: ActionPlan): Promise<ActionPlan & { id: string }> {
    try {
      const validated = ActionPlanSchema.parse(data);
      const encryptedData = await this.encryptionService.encryptObject(validated, this.encryptedFields);
      
      const actionPlan = await this.prisma.actionPlan.create({
        data: {
          ...encryptedData,
          impactedAreas: validated.impactedAreas ? 
            JSON.stringify(validated.impactedAreas) : null,
          teamMembers: validated.teamMembers ? 
            JSON.stringify(validated.teamMembers) : null,
        }
      });

      return {
        ...validated,
        id: actionPlan.id,
      };
    } catch (error) {
      throw new Error(`Failed to create action plan: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async getActionPlan(id: string): Promise<ActionPlan | null> {
    try {
      const actionPlan = await this.prisma.actionPlan.findUnique({
        where: { id },
        include: {
          actionItems: true,
        }
      });

      if (!actionPlan) return null;
      return this.deserializeActionPlan(actionPlan);
    } catch (error) {
      throw new Error(`Failed to get action plan: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // Action Item Operations
  async createActionItem(data: ActionItem): Promise<ActionItem & { id: string }> {
    try {
      const validated = ActionItemSchema.parse(data);
      const encryptedData = await this.encryptionService.encryptObject(validated, this.encryptedFields);
      
      const actionItem = await this.prisma.actionItem.create({
        data: {
          ...encryptedData,
          dependencies: validated.dependencies ? 
            JSON.stringify(validated.dependencies) : null,
          blockers: validated.blockers ? 
            JSON.stringify(validated.blockers) : null,
        }
      });

      return {
        ...validated,
        id: actionItem.id,
      };
    } catch (error) {
      throw new Error(`Failed to create action item: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async updateActionItem(id: string, updates: Partial<ActionItem>): Promise<ActionItem> {
    try {
      const encryptedUpdates = await this.encryptionService.encryptObject(updates, this.encryptedFields);
      
      const updated = await this.prisma.actionItem.update({
        where: { id },
        data: {
          ...encryptedUpdates,
          dependencies: updates.dependencies ? 
            JSON.stringify(updates.dependencies) : undefined,
          blockers: updates.blockers ? 
            JSON.stringify(updates.blockers) : undefined,
          completedDate: updates.status === 'completed' ? new Date() : undefined,
        }
      });

      return this.deserializeActionItem(updated);
    } catch (error) {
      throw new Error(`Failed to update action item: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // Analytics and Reporting
  async getQualityDashboardData(indicatorIds: string[], dateRange: { from: Date; to: Date }) {
    try {
      const metrics = await this.prisma.qualityMetrics.findMany({
        where: {
          indicatorId: { in: indicatorIds },
          measurementPeriod: {
            gte: dateRange.from,
            lte: dateRange.to,
          }
        },
        include: {
          indicator: true,
        },
        orderBy: { measurementPeriod: 'asc' }
      });

      return metrics.map(metric => ({
        indicator: {
          id: metric.indicator.id,
          name: metric.indicator.name,
          category: metric.indicator.category,
          targetValue: metric.indicator.targetValue,
        },
        measurementPeriod: metric.measurementPeriod,
        rate: metric.rate,
        targetValue: metric.targetValue,
        varianceFromTarget: metric.varianceFromTarget,
      }));
    } catch (error) {
      throw new Error(`Failed to get dashboard data: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // Helper methods for deserialization
  private async deserializeQualityIndicator(indicator: any): Promise<QualityIndicator> {
    const decrypted = await this.encryptionService.decryptObject(indicator, this.encryptedFields);
    
    return {
      ...decrypted,
      stratificationCriteria: indicator.stratificationCriteria ? 
        JSON.parse(indicator.stratificationCriteria) : undefined,
    };
  }

  private async deserializeQualityEvent(event: any): Promise<QualityEvent> {
    const decrypted = await this.encryptionService.decryptObject(event, this.encryptedFields);
    
    return {
      ...decrypted,
      contributingFactors: event.contributingFactors ? 
        JSON.parse(event.contributingFactors) : undefined,
      correctiveActions: event.correctiveActions ? 
        JSON.parse(event.correctiveActions) : undefined,
      preventiveActions: event.preventiveActions ? 
        JSON.parse(event.preventiveActions) : undefined,
    };
  }

  private async deserializeQualityAssessment(assessment: any): Promise<QualityAssessment> {
    const decrypted = await this.encryptionService.decryptObject(assessment, this.encryptedFields);
    
    return {
      ...decrypted,
      assessors: JSON.parse(assessment.assessors),
      findings: assessment.findings ? JSON.parse(assessment.findings) : undefined,
      recommendations: assessment.recommendations ? JSON.parse(assessment.recommendations) : undefined,
    };
  }

  private async deserializeComplianceReport(report: any): Promise<ComplianceReport> {
    const decrypted = await this.encryptionService.decryptObject(report, this.encryptedFields);
    
    return {
      ...decrypted,
      requirements: JSON.parse(report.requirements),
      findings: report.findings ? JSON.parse(report.findings) : undefined,
      gaps: report.gaps ? JSON.parse(report.gaps) : undefined,
    };
  }

  private async deserializeActionPlan(actionPlan: any): Promise<ActionPlan> {
    const decrypted = await this.encryptionService.decryptObject(actionPlan, this.encryptedFields);
    
    return {
      ...decrypted,
      impactedAreas: actionPlan.impactedAreas ? 
        JSON.parse(actionPlan.impactedAreas) : undefined,
      teamMembers: actionPlan.teamMembers ? 
        JSON.parse(actionPlan.teamMembers) : undefined,
    };
  }

  private async deserializeActionItem(actionItem: any): Promise<ActionItem> {
    const decrypted = await this.encryptionService.decryptObject(actionItem, this.encryptedFields);
    
    return {
      ...decrypted,
      dependencies: actionItem.dependencies ? 
        JSON.parse(actionItem.dependencies) : undefined,
      blockers: actionItem.blockers ? 
        JSON.parse(actionItem.blockers) : undefined,
    };
  }

  // Cleanup
  async disconnect(): Promise<void> {
    await this.prisma.$disconnect();
  }
}

// Export singleton instance
let qualityServiceInstance: PersistentQualityManagementService | null = null;

export const getQualityManagementService = (prismaClient?: PrismaClient): PersistentQualityManagementService => {
  if (!qualityServiceInstance) {
    qualityServiceInstance = new PersistentQualityManagementService(prismaClient);
  }
  return qualityServiceInstance;
};

// For backward compatibility
export { PersistentQualityManagementService as QualityManagementService };
