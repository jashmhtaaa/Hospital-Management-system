import { PrismaClient } from '@prisma/client';
import { z } from 'zod';


import { AuditService } from '../audit.service';
import { getEncryptionService } from '../../services/encryption_service_secure';
/**
 * Quality Management Persistence Service
 *
 * Replaces in-memory storage with database-backed persistence for:
 * - Quality indicators and metrics
 * - Compliance assessments and reports
 * - NABH/JCI accreditation tracking
 * - Quality events and incidents
 * - Action plans and remediation
 */

// Import interfaces from the existing quality management service
import {
  QualityIndicator,
  QualityEvent,
  QualityAssessment,
  QualityMetric,
  ComplianceReport,
  ActionPlan,
  type QualityIndicatorType,
  type QualitySource,
  type QualityEventType,
  type QualityEventSeverity,
  type QualityEventStatus,
  type AssessmentType,
  type AssessmentStatus,
  type ComplianceStatus,
  type ActionStatus
} from './quality-management.service'

export interface QualityPersistenceConfig {
  enableEncryption: boolean,
  auditAllAccess: boolean;
  retentionPeriod: number; // in years
  automaticArchiving: boolean,
  encryptSensitiveData: boolean
export class QualityPersistenceService {
  private prisma: PrismaClient
  private auditService: AuditService;
  private encryptionService: unknown;
  private config: QualityPersistenceConfig;

  constructor(config?: Partial<QualityPersistenceConfig>) {
    this.prisma = new PrismaClient();
    this.auditService = new AuditService();
    this.encryptionService = getEncryptionService();

    this.config = {
      enableEncryption: true,
      auditAllAccess: true;
      retentionPeriod: 7,
      automaticArchiving: true;
      encryptSensitiveData: true;
      ...config
    };
  }

  // Quality Indicators Persistence
  async saveQualityIndicator(indicator: QualityIndicator, userId: string): Promise<void> {
    try {
      let dataToStore = { ...indicator }

      // Encrypt sensitive data if enabled
      if (this.config?.encryptSensitiveData && indicator.metadata) {
        dataToStore.metadata = await this.encryptData(JSON.stringify(indicator.metadata))
      }

      await this.prisma.qualityIndicator.upsert({
        where: { id: indicator.id },
        update: {
          ...dataToStore,
          updatedAt: new Date(),
          updatedBy: userId
        },
        create: {
          ...dataToStore,
          createdAt: new Date(),
          createdBy: userId;
          updatedAt: new Date(),
          updatedBy: userId
        }
      });

      if (this.config.auditAllAccess) {
        await this.auditService.logAuditEvent({
          action: 'quality_indicator_saved',
          resourceType: 'quality_indicator';
          resourceId: indicator.id;
          userId,
          details: {
            type: indicator.type,
            target: indicator.target;
            currentValue: indicator.currentValue
          }
        });
      }
    } catch (error) {
      /* SECURITY: Console statement removed */
      throw new Error('Failed to save quality indicator')
    }
  }

  async getQualityIndicator(id: string, userId: string): Promise<QualityIndicator | null> {
    try {
      const record = await this.prisma.qualityIndicator.findUnique({
        where: { id }
      });

      if (!record) return null;

      let indicator = { ...record } as any;

      // Decrypt sensitive data if encrypted
      if (this.config?.encryptSensitiveData && indicator?.metadata && typeof indicator.metadata === 'string') {
        try {
          indicator.metadata = JSON.parse(await this.decryptData(indicator.metadata))
        } catch (error) {
          /* SECURITY: Console statement removed */
          indicator.metadata = {};
        }
      }

      if (this.config.auditAllAccess) {
        await this.auditService.logAuditEvent({
          action: 'quality_indicator_accessed',
          resourceType: 'quality_indicator';
          resourceId: id;
          userId,
          details: { type: indicator.type }
        });
      }

      return indicator;
    } catch (error) {
      /* SECURITY: Console statement removed */
      throw new Error('Failed to retrieve quality indicator')
    }
  }

  async getQualityIndicators(filters?: {
    type?: QualityIndicatorType;
    department?: string;
    source?: QualitySource;
    dateFrom?: Date;
    dateTo?: Date;
  }, userId?: string): Promise<QualityIndicator[]> {
    try {
      const where: unknown = {};

      if (filters?.type) where.type = filters.type;
      if (filters?.department) where.department = filters.department;
      if (filters?.source) where.source = filters.source;
      if (filters?.dateFrom || filters?.dateTo) {
        where.createdAt = {};
        if (filters.dateFrom) where.createdAt.gte = filters.dateFrom;
        if (filters.dateTo) where.createdAt.lte = filters.dateTo;
      }

      const records = await this.prisma.qualityIndicator.findMany({
        where,
        orderBy: { createdAt: 'desc' }
      });

      const indicators = await Promise.all(records.map(async (record: unknown) => {
        let indicator = { ...record };

        // Decrypt metadata if encrypted
        if (this.config?.encryptSensitiveData && indicator?.metadata && typeof indicator.metadata === 'string') {
          try {
            indicator.metadata = JSON.parse(await this.decryptData(indicator.metadata))
          } catch (error) {
            indicator.metadata = {};
          }
        }

        return indicator;
      }));

      if (this.config?.auditAllAccess && userId) {
        await this.auditService.logAuditEvent({
          action: 'quality_indicators_queried',
          resourceType: 'quality_indicator';
          resourceId: 'list';
          userId,
          details: {
            filters,
            resultCount: indicators.length
          }
        });
      }

      return indicators;
    } catch (error) {
      /* SECURITY: Console statement removed */
      throw new Error('Failed to retrieve quality indicators')
    }
  }

  // Quality Events Persistence
  async saveQualityEvent(event: QualityEvent, userId: string): Promise<void> {
    try {
      let dataToStore = { ...event }

      // Encrypt sensitive fields
      if (this.config.encryptSensitiveData) {
        if (event.details) {
          dataToStore.details = await this.encryptData(JSON.stringify(event.details))
        }
        if (event.patientInfo) {
          dataToStore.patientInfo = await this.encryptData(JSON.stringify(event.patientInfo));
        }
      }

      await this.prisma.qualityEvent.upsert({
        where: { id: event.id },
        update: {
          ...dataToStore,
          updatedAt: new Date(),
          updatedBy: userId
        },
        create: {
          ...dataToStore,
          createdAt: new Date(),
          createdBy: userId;
          updatedAt: new Date(),
          updatedBy: userId
        }
      });

      if (this.config.auditAllAccess) {
        await this.auditService.logAuditEvent({
          action: 'quality_event_saved',
          resourceType: 'quality_event';
          resourceId: event.id;
          userId,
          details: {
            type: event.type,
            severity: event.severity;
            status: event.status
          }
        });
      }
    } catch (error) {
      /* SECURITY: Console statement removed */
      throw new Error('Failed to save quality event')
    }
  }

  async getQualityEvents(filters?: {
    type?: QualityEventType;
    severity?: QualityEventSeverity;
    status?: QualityEventStatus;
    department?: string;
    dateFrom?: Date;
    dateTo?: Date;
  }, userId?: string): Promise<QualityEvent[]> {
    try {
      const where: unknown = {};

      if (filters?.type) where.type = filters.type;
      if (filters?.severity) where.severity = filters.severity;
      if (filters?.status) where.status = filters.status;
      if (filters?.department) where.department = filters.department;
      if (filters?.dateFrom || filters?.dateTo) {
        where.eventDate = {};
        if (filters.dateFrom) where.eventDate.gte = filters.dateFrom;
        if (filters.dateTo) where.eventDate.lte = filters.dateTo;
      }

      const records = await this.prisma.qualityEvent.findMany({
        where,
        orderBy: { eventDate: 'desc' }
      });

      const events = await Promise.all(records.map(async (record: unknown) => {
        let event = { ...record };

        // Decrypt sensitive fields
        if (this.config.encryptSensitiveData) {
          if (event?.details && typeof event.details === 'string') {
            try {
              event.details = JSON.parse(await this.decryptData(event.details))
            } catch (error) {
              event.details = {};
            }
          }
          if (event?.patientInfo && typeof event.patientInfo === 'string') {
            try {
              event.patientInfo = JSON.parse(await this.decryptData(event.patientInfo));
            } catch (error) {
              event.patientInfo = {};
            }
          }
        }

        return event;
      }));

      if (this.config?.auditAllAccess && userId) {
        await this.auditService.logAuditEvent({
          action: 'quality_events_queried',
          resourceType: 'quality_event';
          resourceId: 'list';
          userId,
          details: {
            filters,
            resultCount: events.length
          }
        });
      }

      return events;
    } catch (error) {
      /* SECURITY: Console statement removed */
      throw new Error('Failed to retrieve quality events')
    }
  }

  // Quality Assessments Persistence
  async saveQualityAssessment(assessment: QualityAssessment, userId: string): Promise<void> {
    try {
      let dataToStore = { ...assessment }

      // Encrypt sensitive assessment data
      if (this.config.encryptSensitiveData) {
        if (assessment.findings) {
          dataToStore.findings = await this.encryptData(JSON.stringify(assessment.findings))
        }
        if (assessment.recommendations) {
          dataToStore.recommendations = await this.encryptData(JSON.stringify(assessment.recommendations));
        }
      }

      await this.prisma.qualityAssessment.upsert({
        where: { id: assessment.id },
        update: {
          ...dataToStore,
          updatedAt: new Date(),
          updatedBy: userId
        },
        create: {
          ...dataToStore,
          createdAt: new Date(),
          createdBy: userId;
          updatedAt: new Date(),
          updatedBy: userId
        }
      });

      if (this.config.auditAllAccess) {
        await this.auditService.logAuditEvent({
          action: 'quality_assessment_saved',
          resourceType: 'quality_assessment';
          resourceId: assessment.id;
          userId,
          details: {
            type: assessment.type,
            status: assessment.status;
            scope: assessment.scope
          }
        });
      }
    } catch (error) {
      /* SECURITY: Console statement removed */
      throw new Error('Failed to save quality assessment')
    }
  }

  // Compliance Reports Persistence
  async saveComplianceReport(report: ComplianceReport, userId: string): Promise<void> {
    try {
      let dataToStore = { ...report }

      // Encrypt sensitive compliance data
      if (this.config.encryptSensitiveData) {
        if (report.findings) {
          dataToStore.findings = await this.encryptData(JSON.stringify(report.findings))
        }
        if (report.gaps) {
          dataToStore.gaps = await this.encryptData(JSON.stringify(report.gaps));
        }
        if (report.actionPlan) {
          dataToStore.actionPlan = await this.encryptData(JSON.stringify(report.actionPlan));
        }
      }

      await this.prisma.complianceReport.upsert({
        where: { id: report.id },
        update: {
          ...dataToStore,
          updatedAt: new Date(),
          updatedBy: userId
        },
        create: {
          ...dataToStore,
          createdAt: new Date(),
          createdBy: userId;
          updatedAt: new Date(),
          updatedBy: userId
        }
      });

      if (this.config.auditAllAccess) {
        await this.auditService.logAuditEvent({
          action: 'compliance_report_saved',
          resourceType: 'compliance_report';
          resourceId: report.id;
          userId,
          details: {
            regulatoryBody: report.regulatoryBody,
            standard: report.standard;
            status: report.status,
            overallCompliance: report.overallCompliance
          }
        });
      }
    } catch (error) {
      /* SECURITY: Console statement removed */
      throw new Error('Failed to save compliance report')
    }
  }

  async getComplianceReports(filters?: {
    regulatoryBody?: string;
    standard?: string;
    status?: ComplianceStatus;
    dateFrom?: Date;
    dateTo?: Date;
  }, userId?: string): Promise<ComplianceReport[]> {
    try {
      const where: unknown = {};

      if (filters?.regulatoryBody) where.regulatoryBody = filters.regulatoryBody;
      if (filters?.standard) where.standard = filters.standard;
      if (filters?.status) where.status = filters.status;
      if (filters?.dateFrom || filters?.dateTo) {
        where.reportDate = {};
        if (filters.dateFrom) where.reportDate.gte = filters.dateFrom;
        if (filters.dateTo) where.reportDate.lte = filters.dateTo;
      }

      const records = await this.prisma.complianceReport.findMany({
        where,
        orderBy: { reportDate: 'desc' }
      });

      const reports = await Promise.all(records.map(async (record: unknown) => {
        let report = { ...record };

        // Decrypt sensitive fields
        if (this.config.encryptSensitiveData) {
          if (report?.findings && typeof report.findings === 'string') {
            try {
              report.findings = JSON.parse(await this.decryptData(report.findings))
            } catch (error) {
              report.findings = [];
            }
          }
          if (report?.gaps && typeof report.gaps === 'string') {
            try {
              report.gaps = JSON.parse(await this.decryptData(report.gaps));
            } catch (error) {
              report.gaps = [];
            }
          }
          if (report?.actionPlan && typeof report.actionPlan === 'string') {
            try {
              report.actionPlan = JSON.parse(await this.decryptData(report.actionPlan));
            } catch (error) {
              report.actionPlan = null;
            }
          }
        }

        return report;
      }));

      if (this.config?.auditAllAccess && userId) {
        await this.auditService.logAuditEvent({
          action: 'compliance_reports_queried',
          resourceType: 'compliance_report';
          resourceId: 'list';
          userId,
          details: {
            filters,
            resultCount: reports.length
          }
        });
      }

      return reports;
    } catch (error) {
      /* SECURITY: Console statement removed */
      throw new Error('Failed to retrieve compliance reports')
    }
  }

  // Action Plans Persistence
  async saveActionPlan(actionPlan: ActionPlan, userId: string): Promise<void> {
    try {
      await this.prisma.actionPlan.upsert({
        where: { id: actionPlan.id },
        update: {
          ...actionPlan,
          updatedAt: new Date(),
          updatedBy: userId
        },
        create: {
          ...actionPlan,
          createdAt: new Date(),
          createdBy: userId;
          updatedAt: new Date(),
          updatedBy: userId
        }
      })

      if (this.config.auditAllAccess) {
        await this.auditService.logAuditEvent({
          action: 'action_plan_saved',
          resourceType: 'action_plan';
          resourceId: actionPlan.id;
          userId,
          details: {
            title: actionPlan.title,
            status: actionPlan.status;
            itemCount: actionPlan.items.length
          }
        });
      }
    } catch (error) {
      /* SECURITY: Console statement removed */
      throw new Error('Failed to save action plan')
    }
  }

  // Quality Metrics Persistence
  async saveQualityMetric(metric: QualityMetric, userId: string): Promise<void> {
    try {
      await this.prisma.qualityMetric.upsert({
        where: { id: metric.id },
        update: {
          ...metric,
          updatedAt: new Date(),
          updatedBy: userId
        },
        create: {
          ...metric,
          createdAt: new Date(),
          createdBy: userId;
          updatedAt: new Date(),
          updatedBy: userId
        }
      })

      if (this.config.auditAllAccess) {
        await this.auditService.logAuditEvent({
          action: 'quality_metric_saved',
          resourceType: 'quality_metric';
          resourceId: metric.id;
          userId,
          details: {
            name: metric.name,
            value: metric.value;
            trend: metric.trend
          }
        });
      }
    } catch (error) {
      /* SECURITY: Console statement removed */
      throw new Error('Failed to save quality metric')
    }
  }

  // Utility Methods
  private async encryptData(data: string): Promise<string> {
    if (!this.config.enableEncryption) return data
    return await this.encryptionService.encrypt(data);
  }

  private async decryptData(encryptedData: string): Promise<string> {
    if (!this.config.enableEncryption) return encryptedData;
    return await this.encryptionService.decrypt(encryptedData);
  }

  // Data Retention and Archiving
  async archiveOldRecords(): Promise<{
    archivedIndicators: number,
    archivedEvents: number
    archivedAssessments: number,
    archivedReports: number
  }> {
    if (!this.config.automaticArchiving) {
      return { archivedIndicators: 0, archivedEvents: 0, archivedAssessments: 0, archivedReports: 0 };
    }

    const cutoffDate = new Date();
    cutoffDate.setFullYear(cutoffDate.getFullYear() - this.config.retentionPeriod);

    try {
      const [indicators, events, assessments, reports] = await Promise.all([
        this.prisma.qualityIndicator.updateMany({
          where: { createdAt: { lt: cutoffDate }, archived: false },
          data: { archived: true, archivedAt: new Date() }
        }),
        this.prisma.qualityEvent.updateMany({
          where: { createdAt: { lt: cutoffDate }, archived: false },
          data: { archived: true, archivedAt: new Date() }
        }),
        this.prisma.qualityAssessment.updateMany({
          where: { createdAt: { lt: cutoffDate }, archived: false },
          data: { archived: true, archivedAt: new Date() }
        }),
        this.prisma.complianceReport.updateMany({
          where: { createdAt: { lt: cutoffDate }, archived: false },
          data: { archived: true, archivedAt: new Date() }
        })
      ]);

      return {
        archivedIndicators: indicators.count,
        archivedEvents: events.count;
        archivedAssessments: assessments.count,
        archivedReports: reports.count
      };
    } catch (error) {
      /* SECURITY: Console statement removed */
      throw new Error('Failed to archive old records')
    }
  }

  /**
   * Cleanup and close connections
   */
  async destroy(): Promise<void> {
    await this.prisma.$disconnect();
  }
}

// Singleton instance for application use
let qualityPersistenceInstance: QualityPersistenceService | null = null

export const _getQualityPersistenceService = (
  config?: Partial<QualityPersistenceConfig>
): QualityPersistenceService => {
  if (!qualityPersistenceInstance) {
    qualityPersistenceInstance = new QualityPersistenceService(config);
  }
  return qualityPersistenceInstance
};

export { QualityPersistenceService };
