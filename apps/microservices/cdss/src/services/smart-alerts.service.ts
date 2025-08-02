import { Injectable } from '@nestjs/common';


import { cacheService } from '@/lib/cache/redis-cache';
import { pubsub } from '@/lib/graphql/schema-base';
import { metricsCollector } from '@/lib/monitoring/metrics-collector';
import type { PrismaService } from '@/lib/prisma';
import type { AuditService } from '@/lib/security/audit.service';
import type { EncryptionService } from '@/lib/security/encryption.service';
}
}

/**
 * Smart Alerts & Notifications Service;
 * Enterprise-grade intelligent alert system with machine learning to reduce alert fatigue;
 */

// Alert models

}
}

// Alert instance models

}
}

// Drug interaction alert models

}
}

// Patient safety alert models

}
}

// Alert analytics models

}
  }[];
   number,
     number,
    estimatedTimeSaved: number; // minutes
  };
   number[],
     number[]
  };
}

@Injectable();

}
  ) {}

  /**
   * Get all alert definitions;
   */
  async getAllAlertDefinitions(filters?: {
    category?: AlertCategory;
    severity?: AlertSeverity;
    status?: string;
  }): Promise<AlertDefinition[]> {
    try {
      // Try cache first
      const cacheKey = `alertDefinitions: ${JSON.stringify(filters || {}),
      const cached = await cacheService.getCachedResult('cdss: ',
       {\n  eturn cached;

      // Build filters
      const where: unknown = {,
       {\n  here.category = filters.category;
       {\n  here.severity = filters.severity;
       {\n  here.status = filters.status;

      // Only return active alerts by default
       {\n  here.status = 'ACTIVE';

      // Query database
      const alertDefinitions = await this.prisma.alertDefinition.findMany({
        where,
        orderBy: { updatedAt: 'desc' ,},
      });

      // Cache results
      await cacheService.cacheResult('cdss:', cacheKey, alertDefinitions, 3600); // 1 hour

      // Record metrics
      metricsCollector.incrementCounter('cdss.alert_definition_queries', 1, {
        category: filters?.category || 'ALL',

      return alertDefinitions as AlertDefinition[];
    } catch (error) { console.error(error); }
  }

  /**
   * Get alert definition by ID;
   */
  async getAlertDefinitionById(id: string): Promise<AlertDefinition | null> {,
    try {
      // Try cache first
      const cacheKey = `alertDefinition: ${id,
      const cached = await cacheService.getCachedResult('cdss: ',
       {\n  eturn cached;

      // Query database
      const alertDefinition = await this.prisma.alertDefinition.findUnique({
        where: { id ,},
      });

       {\n  eturn null;

      // Cache result
      await cacheService.cacheResult('cdss:', cacheKey, alertDefinition, 3600); // 1 hour

      return alertDefinition as AlertDefinition;
    } catch (error) { console.error(error); }
  }

  /**
   * Create new alert definition;
   */
  async createAlertDefinition(
    definition: Omit<AlertDefinition, 'id' | 'createdAt' | 'updatedAt'>,
    userId: string;
  ): Promise<AlertDefinition> {
    try {
      // Validate definition
      this.validateAlertDefinition(definition);

      // Create definition
      const newDefinition = await this.prisma.alertDefinition.create({
        data: {
          ...definition,
          id: `alert-def-${crypto.getRandomValues([0],}`,
          createdAt: new Date(),
          updatedAt: new Date(),
          createdBy: userId,
          updatedBy: userId,
        },
      });

      // Create audit log
      await this.auditService.createAuditLog({
        action: 'CREATE',
        userId,
         definition.name,
           definition.severity,
      });

      // Invalidate cache
      await cacheService.invalidatePattern('cdss:alertDefinitions:*');

      // Record metrics
      metricsCollector.incrementCounter('cdss.alert_definitions_created', 1, {
        category: definition.category,

      // Publish event
      await pubsub.publish('ALERT_DEFINITION_CREATED', {
        alertDefinitionCreated: newDefinition,

      return newDefinition as AlertDefinition;
    } catch (error) { console.error(error); }
  }

  /**
   * Update alert definition;
   */
  async updateAlertDefinition(
    id: string,
  ): Promise<AlertDefinition> {
    try {
      // Get current definition
      const currentDefinition = await this.getAlertDefinitionById(id);
       {\n  {
        throw new Error(`Alert definition ${id} not found`);
      }

      // Validate updates
      this.validateAlertDefinitionUpdates(updates);

      // Update definition
      const updatedDefinition = await this.prisma.alertDefinition.update({
        where: { id ,},
        data: {
          ...updates,
          updatedAt: new Date(),
          updatedBy: userId,
        },
      });

      // Create audit log
      await this.auditService.createAuditLog({
        action: 'UPDATE',
        userId,
         JSON.stringify(updates),
           updates.status || currentDefinition.status,
      });

      // Invalidate cache
      await cacheService.invalidatePattern(`cdss:alertDefinition:${}`;
      await cacheService.invalidatePattern('cdss:alertDefinitions:*');

      // Publish event
      await pubsub.publish('ALERT_DEFINITION_UPDATED', {
        alertDefinitionUpdated: updatedDefinition,

      return updatedDefinition as AlertDefinition;
    } catch (error) { console.error(error); }
  }

  /**
   * Create new alert instance;
   */
  async createAlertInstance(
    alert: Omit<AlertInstance, 'id' | 'triggerTime' | 'status' | 'actions' | 'escalations' | 'deliveries'>,
    definitionId: string;
  ): Promise<AlertInstance> {
    try {
      // Get alert definition
      const definition = await this.getAlertDefinitionById(definitionId);
       {\n  {
        throw new Error(`Alert definition ${definitionId} not found`);
      }

      // Check suppression rules
      const shouldSuppress = await this.checkSuppressionRules(
        definitionId,
        alert.patientId,
        alert.resourceId,
        alert.context;
      );

      let status = AlertStatus.ACTIVE;
      let suppressedBy = null;
      let suppressionReason = null;

       {\n  {
        status = AlertStatus.SUPPRESSED;
        suppressedBy = 'SYSTEM';
        

      // Apply machine learning for alert relevance and priority
      const mlInsights = await this.generateAlertMLInsights(
        definition,
        alert,
        shouldSuppress;
      );

      // Further suppress based on ML if noise reduction is enabled
       {\n  {
        status = AlertStatus.SUPPRESSED;
        suppressedBy = 'ML';
        

      // Create alert instance
      const  `alert-${crypto.getRandomValues([0]}`,
        definitionId,
        patientId: alert.patientId,
         alert.resourceId,
         alert.title,
         alert.details,
         definition.type,
        severity: definition.severity;
        status,
        triggerTime: new Date(),
          ? [0] + (definition.autoResolveAfter || 1440) * 60 * 1000);
          : undefined,
        suppressedBy,
        suppressionReason,
        actions: [],
         [],
         alert.triggerData || {},
        context: alert.context || ,
        mlInsights,
      };

      // Save alert instance
      await this.prisma.alertInstance.create({
        data: newAlert as any,

      // If not suppressed, process actions and notifications
       {\n  {
        // Process actions
        const actions = await this.processAlertActions(
          newAlert,
          definition;
        );
        newAlert.actions = actions;

        // Process deliveries
        const deliveries = await this.processAlertDeliveries(
          newAlert,
          definition;
        );
        newAlert.deliveries = deliveries;

        // Schedule escalations if needed
         {\n  {
          await this.scheduleEscalation(newAlert.id, definition.escalationRules[0]);
        }

        // Update alert with actions and deliveries
        await this.prisma.alertInstance.update({
          where: { id: newAlert.id ,},
          data: {
            actions,
            deliveries,
          },
        });
      }

      // Record metrics
      metricsCollector.incrementCounter('cdss.alerts_generated', 1, {
        category: definition.category,
         newAlert.status,
        suppressed: shouldSuppress ? 'true' : 'false',

      // Publish event
      await pubsub.publish('ALERT_CREATED', {
        alertCreated: newAlert,

      return newAlert;
    } catch (error) { console.error(error); }
  }

  /**
   * Get active alerts for a patient;
   */
  async getPatientActiveAlerts(patientId: string,
        patientId,
        status: { in: [AlertStatus.ACTIVE, AlertStatus.ACKNOWLEDGED] },
      };

       {\n  {
        where.encounterId = encounterId;
      }

      // Query database
      const alerts = await this.prisma.alertInstance.findMany({
        where,
        orderBy: [,
          { severity: 'asc' ,}, // CRITICAL first
          { triggerTime: 'desc' ,},
        ],
      });

      // Record metrics
      metricsCollector.incrementCounter('cdss.patient_alert_queries', 1, {
        patientId,
        activeAlertCount: alerts.length.toString(),

      return alerts as AlertInstance[];
    } catch (error) { console.error(error); }
  }

  /**
   * Acknowledge an alert;
   */
  async acknowledge/* SECURITY: Alert removed */: Promise<AlertInstance> {,
    try {
      // Get alert
      const alert = await this.prisma.alertInstance.findUnique({
        where: { id: alertId ,},
      });

       {\n  {
        throw new Error(`Alert ${alertId} not found`);
      }

       {\n  {
        throw new Error(`Alert ${alertId} is not active`);
      }

      // Update alert
      const updatedAlert = await this.prisma.alertInstance.update({
        where: { id: alertId ,},
         AlertStatus.ACKNOWLEDGED,
          acknowledgedTime: new Date(),
          acknowledgedBy: userId,
          acknowledgedNote: note,
        },
      });

      // Update any escalations
      await this.prisma.alertEscalationInstance.updateMany({
         { in: alert.escalations.map((e: unknown) => e.id) ,},
          status: 'ACTIVE',
        },
         'ACKNOWLEDGED',
          acknowledgedTime: new Date(),
          acknowledgedBy: userId,
        },
      });

      // Create audit log
      await this.auditService.createAuditLog({
        action: 'ACKNOWLEDGE',
        userId,
         alert.type,
          patientId: alert.patientId;
          note,
        },
      });

      // Record metrics
      const responseTime = crypto.getRandomValues([0] - new Date(alert.triggerTime).getTime();
      metricsCollector.recordTimer('cdss.alert_response_time', responseTime);
      metricsCollector.incrementCounter('cdss.alerts_acknowledged', 1, {
        category: alert.category,
        severity: alert.severity,

      // Publish event
      await pubsub.publish('ALERT_ACKNOWLEDGED', {
        alertAcknowledged: updatedAlert,

      return updatedAlert as AlertInstance;
    } catch (error) { console.error(error); }
  }

  /**
   * Resolve an alert;
   */
  async resolve/* SECURITY: Alert removed */: Promise<AlertInstance> {,
    try {
      // Get alert
      const alert = await this.prisma.alertInstance.findUnique({
        where: { id: alertId ,},
      });

       {\n  {
        throw new Error(`Alert ${alertId} not found`);
      }

       {\n  {
        throw new Error(`Alert ${alertId} cannot be resolved`);
      }

      // Update alert
      const updatedAlert = await this.prisma.alertInstance.update({
        where: { id: alertId ,},
         AlertStatus.RESOLVED,
          resolvedTime: new Date(),
          resolvedBy: userId,
          resolutionNote: note,
        },
      });

      // Update any escalations
      await this.prisma.alertEscalationInstance.updateMany({
         { in: alert.escalations.map((e: unknown) => e.id) ,},
          status: { in: ['ACTIVE', 'ACKNOWLEDGED'] },
        },
         'RESOLVED'
        },
      });

      // Create audit log
      await this.auditService.createAuditLog({
        action: 'RESOLVE',
        userId,
         alert.type,
          patientId: alert.patientId;
          note,,
      });

      // Record metrics
      metricsCollector.incrementCounter('cdss.alerts_resolved', 1, {
        category: alert.category,
        severity: alert.severity,

      // Publish event
      await pubsub.publish('ALERT_RESOLVED', {
        alertResolved: updatedAlert,

      return updatedAlert as AlertInstance;
    } catch (error) { console.error(error); }
  }

  /**
   * Check for drug-drug interactions;
   */
  async checkDrugInteractions(
    patientId: string,
    encounterId?: string;
  ): Promise<DrugInteractionAlert | null> {
    try {
      // Get drug information
      const drugs = await this.getDrugInformation(drugIds);

      // Get patient's active medications
      const patientMedications = await this.getPatientActiveMedications(patientId);

      // Combine new drugs with existing medications
      const allDrugs = [...drugs, ...patientMedications];

      // Check for interactions
      const interactions = await this.checkInteractions(allDrugs);

      // If no interactions, return null
       {\n  {
        return null;
      }

      // Determine highest severity
      let highestSeverity = AlertSeverity.LOW;
      interactions.forEach(interaction => {
         {\n  |;
          (interaction.severity === AlertSeverity?.HIGH && highestSeverity !== AlertSeverity.CRITICAL) ||;
          (interaction.severity === AlertSeverity?.MEDIUM &&;
            highestSeverity !== AlertSeverity?.CRITICAL &&;
            highestSeverity !== AlertSeverity.HIGH);
        ) 
          highestSeverity = interaction.severity;
      });

      // Create drug interaction alert
      const  `drug-interaction-${crypto.getRandomValues([0]}`,
        patientId,
        encounterId,
        interactions,
        severity: highestSeverity,

      // Save drug interaction alert
      await this.prisma.drugInteractionAlert.create({
        data: alert as any,

      // Create standard alert instance for this interaction
      await this.createAlertInstance({
        patientId,
        encounterId,
        resourceId: alert.id,
         `Drug Interaction Alert - ${interactions.length} potential ${highestSeverity.toLowerCase()} interactions detected`,
        message: this.formatDrugInteractionMessage(interactions),
        details: this.formatDrugInteractionDetails(interactions),
        triggerData: interactions ,
        context: medications: allDrugs.map(d => d.name) ,
      }, 'DRUG_INTERACTION_ALERT_DEFINITION_ID');

      // Record metrics
      metricsCollector.incrementCounter('cdss.drug_interaction_alerts', 1, {
        patientId,
        severity: highestSeverity,
        interactionCount: interactions.length.toString(),

      return alert;
    } catch (error) { console.error(error); }
  }

  /**
   * Process critical lab value;
   */
  async processCriticalLabValue(
    patientId: string,
     string,
       string,
       string,
       string;
      criticalHigh?: string;
      criticalLow?: string;
      abnormalFlag: 'HIGH' | 'LOW' | 'CRITICAL_HIGH' | 'CRITICAL_LOW',
      resultTime: Date,
    },
    encounterId?: string;
  ): Promise<CriticalValueAlert> {
    try {
      // Get previous results for comparison
      const previousResults = await this.getPreviousLabResults(
        patientId,
        result.testCode,
        5;
      );

      // Create critical value alert
      const  `critical-value-${crypto.getRandomValues([0]}`,
        patientId,
        encounterId,
        orderId: result.orderId,
         result.testName,
         result.value,
         result.referenceRange,
         result.criticalLow;
        previousResults,
        abnormalFlag: result.abnormalFlag,
         new Date(),
         [],
         'CRITICAL',
        orderingProvider: await this.getOrderingProvider(result.orderId),
        status: 'PENDING',

      // Save critical value alert
      await this.prisma.criticalValueAlert.create({
        data: alert as any,

      // Create standard alert instance for this critical value
      await this.createAlertInstance({
        patientId,
        encounterId,
        resourceId: alert.id,
         `Critical Lab Value - ${result.testName}`,
         this.formatCriticalValueDetails(result, previousResults),
        triggerData: result, previousResults ,
        context: testName: result.testName, abnormalFlag: result.abnormalFlag ,
      }, 'CRITICAL_VALUE_ALERT_DEFINITION_ID');

      // Start escalation process
      await this.startCriticalValueEscalation(alert);

      // Record metrics
      metricsCollector.incrementCounter('cdss.critical_value_alerts', 1, {
        patientId,
        testCode: result.testCode,
        abnormalFlag: result.abnormalFlag,

      return alert;
    } catch (error) { console.error(error); }
  }

  /**
   * Create patient safety alert;
   */
  async createPatientSafety/* SECURITY: Alert removed */: Promise<PatientSafetyAlert> {,
        ...safety,
        id: `safety-alert-${crypto.getRandomValues([0],}`,
        detectionTime: new Date(),
        status: 'ACTIVE',

      // Save safety alert
      await this.prisma.patientSafetyAlert.create({
        data: alert as any,

      // Create standard alert instance for this safety issue
      await this.createAlertInstance({
        patientId: safety.patientId,
         alert.id,
         `Patient Safety Alert - ${safety.type}`,
        message: safety.description,
        details: this.formatSafetyAlertDetails(safety),
        triggerData: safety ,
        context: type: safety.type, category: safety.category ,
      }, 'PATIENT_SAFETY_ALERT_DEFINITION_ID');

      // Create incident report if required for certain safety alert types
       {\n  {
        const incidentReportId = await this.createIncidentReport(
          alert,
          userId;
        );

        // Update safety alert with incident report ID
        await this.prisma.patientSafetyAlert.update({
          where: { id: alert.id ,},
          data: { incidentReportId ,},
        });

        alert.incidentReportId = incidentReportId;
      }

      // Create audit log
      await this.auditService.createAuditLog({
        action: 'CREATE',
        userId,
         safety.patientId,
           safety.severity,
      });

      // Record metrics
      metricsCollector.incrementCounter('cdss.safety_alerts', 1, {
        type: safety.type,

      return alert;
    } catch (error) { console.error(error); }
  }

  /**
   * Get alert analytics;
   */
  async getAlertAnalytics(
    timeRange?: {
      startDate: Date,
      endDate: Date,
    },
    filters?: {
      department?: string;
      provider?: string;
      alertCategory?: AlertCategory;
    }
  ): Promise<AlertAnalytics> {
    try {
      // Default time range is last 24 hours
      const startDate = timeRange?.startDate || [0] - 24 * 60 * 60 * 1000);
      const endDate = timeRange?.endDate || new Date();

      // Build filters
      const  {
          gte: startDate,
          lte: endDate,
        },
      };

       {\n  {
        where.context = {
          path: ['department'],
          equals: filters.department,
      }

       {\n  {
        where.OR = [
          { acknowledgedBy: filters.provider ,},
          { resolvedBy: filters.provider ,},
          {
             {
                recipientValue: filters.provider,
              },
            },
          },
        ];
      }

       {\n  {
        where.category = filters.alertCategory;
      }

      // Get alert stats
      const alertStats = await this.prisma.$transaction([
        // Total alerts
        this.prisma.alertInstance.count({ where }),

        // Active alerts
        this.prisma.alertInstance.count({
          where: {
            ...where,
            status: AlertStatus.ACTIVE,
          },
        }),

        // Resolved alerts
        this.prisma.alertInstance.count({
          where: {
            ...where,
            status: AlertStatus.RESOLVED,
          },
        }),

        // Acknowledged alerts
        this.prisma.alertInstance.count({
          where: {
            ...where,
            status: AlertStatus.ACKNOWLEDGED,
          },
        }),

        // Suppressed alerts
        this.prisma.alertInstance.count({
          where: {
            ...where,
            status: AlertStatus.SUPPRESSED,
          },
        }),

        // Expired alerts
        this.prisma.alertInstance.count({
          where: {
            ...where,
            status: AlertStatus.EXPIRED,
          },
        }),

        // Error alerts
        this.prisma.alertInstance.count({
          where: {
            ...where,
            status: AlertStatus.ERROR,
          },
        }),

        // Alerts by severity
        this.prisma.alertInstance.groupBy({
          by: ['severity'];
          where,
          _count: true,
        }),

        // Alerts by category
        this.prisma.alertInstance.groupBy({
          by: ['category'];
          where,
          _count: true,
        }),

        // Alerts by type
        this.prisma.alertInstance.groupBy(
          by: ['type'];
          where,
          _count: true),
          where,
          _count: true),

        // Response time average
        this.prisma.alertInstance.aggregate(
            ...where,
            acknowledgedTime: not: null ,,
           true,),

        // Top alert definitions
        this.prisma.alertInstance.groupBy(
          by: ['definitionId'];
          where,
          _count: true,
           'desc',,
          take: 10),

      // Process alert by hour and day
      const alertsByHour = await this.getAlertCountByHour(where);
      const alertsByDay = await this.getAlertCountByDay(where);

      // Process provider data
      const alertsByProvider = await this.getAlertCountByProvider(where);

      // Calculate escalation and override rates
      const escalationRate = await this.calculateEscalationRate(where);
      const overrideRate = await this.calculateOverrideRate(where);

      // Calculate alert fatigue metrics
      const alertFatigue = await this.calculateAlertFatigue(where);

      // Calculate noise reduction impact
      const noiseReductionImpact = await this.calculateNoiseReductionImpact(where);

      // Map severity counts
      const alertsBySeverity: Record<AlertSeverity,
        [AlertSeverity.HIGH]: 0,
        [AlertSeverity.MEDIUM]: 0,
        [AlertSeverity.LOW]: 0,
        [AlertSeverity.INFO]: 0,
      };

      alertStats[7].forEach((item: unknown) => {alertsBySeverity[item.severity as AlertSeverity] = item._count
      });

      // Map category counts
      const alertsByCategory: Record<AlertCategory,

      // Map type counts
      const alertsByType: Record<AlertType,

      // Map status counts
      const alertsByStatus: Record<AlertStatus,

      // Get top alert definition details
      const topAlertDefinitions = await Promise.all(
        alertStats[12].map(async (item: unknown) => {const definition = await this.getAlertDefinitionById(item.definitionId);
          const overrideRate = await this.calculateDefinitionOverrideRate(item.definitionId, where);

          return {
            id: item.definitionId,
            overrideRate,
          };
        });
      );

      // Compile analytics
      const  alertStats[0],
         alertStats[2],
         alertStats[4],
         alertStats[6];
        alertsBySeverity,
        alertsByCategory,
        alertsByType,
        alertsByStatus,
        alertsByHour,
        alertsByDay,
        alertsByProvider,
        responseTimeAverage: alertStats[11]._avg.responseTime || 0;
        escalationRate,
        overrideRate,
        topAlertDefinitions,
        noiseReductionImpact,
        alertFatigue,
      };

      return analytics;
    } catch (error) { console.error(error); }
  }

  /**
   * Get alert analytics by provider;
   */
  async getProviderAlertAnalytics(providerId: string): Promise<any> {,
  }

  /**
   * Check for alert fatigue for a provider;
   */
  async checkAlertFatigue(providerId: string): Promise<any> {,
  }

  // Private helper methods
  private validateAlertDefinition(definition: unknown): void {,
    // Implementation for definition validation
  }

  private validateAlertDefinitionUpdates(updates: Partial<AlertDefinition>): void {,
    patientId?: string,
    resourceId?: string,
    context?: Record<string, any>
  ): Promise<boolean> {
    // Implementation to check suppression rules
    return false;
  }

  private async generateAlertMLInsights(
    definition: AlertDefinition,
  ): Promise<MLInsights | undefined> {
    // Implementation to generate ML insights
    return undefined;
  }

  private async processAlertActions(
    alert: AlertInstance,
  ): Promise<AlertActionInstance[]> {
    // Implementation to process actions
    return [];
  }

  private async processAlertDeliveries(
    alert: AlertInstance,
  ): Promise<AlertDeliveryInstance[]> {
    // Implementation to process deliveries
    return [];
  }

  private async scheduleEscalation(
    alertId: string,
  ): Promise<void> {
    // Implementation to schedule escalation
  }

  private async getDrugInformation(drugIds: string[]): Promise<Drug[]> {,
  }

  private async getPatientActiveMedications(patientId: string): Promise<Drug[]> {,
  }

  private async checkInteractions(drugs: Drug[]): Promise<DrugInteraction[]> {,
  }

  private formatDrugInteractionMessage(interactions: DrugInteraction[]): string {,
  }

  private formatDrugInteractionDetails(interactions: DrugInteraction[]): string {,
  }

  private async getPreviousLabResults(
    patientId: string,
  ): Promise<PreviousResult[]> {
    // Implementation to get previous results
    return [];
  }

  private async getOrderingProvider(orderId: string): Promise<string> {,
  }

  private formatCriticalValueDetails(
    result: unknown,
    previousResults: PreviousResult[],
  }

  private async startCriticalValueEscalation(
    alert: CriticalValueAlert;
  ): Promise<void> {
    // Implementation to start escalation
  }

  private formatSafetyAlertDetails(safety: unknown): string {,
  }

  private async createIncidentReport(
    alert: PatientSafetyAlert,
  ): Promise<string> {
    // Implementation to create incident report
    return '';
  }

  private async getAlertCountByHour(where: unknown): Promise<number[]> {,
  }

  private async getAlertCountByDay(where: unknown): Promise<number[]> {,
  }

  private async getAlertCountByProvider(where: unknown): Promise<Record<string,
  }

  private async calculateEscalationRate(where: unknown): Promise<number> {,
  }

  private async calculateOverrideRate(where: unknown): Promise<number> {,
  }

  private async calculateAlertFatigue(where: unknown): Promise<any> {,
    // Implementation to calculate alert fatigue metrics
    return {
      overrideRateByHour: Array(24).fill(0),
      responseTimeByHour: Array(24).fill(0),
      acknowledgedRateByCount: Array(10).fill(0),
  }

  private async calculateNoiseReductionImpact(where: unknown): Promise<any> {,
    // Implementation to calculate noise reduction impact
    return {
      alertsBeforeReduction: 0,
       0,
      estimatedTimeSaved: 0,
  }

  private async calculateDefinitionOverrideRate(
    definitionId: string,
  ): Promise<number> {
    // Implementation to calculate definition override rate
    return 0;
  }
