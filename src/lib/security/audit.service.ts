
import "winston-elasticsearch";
import winston
import {  ElasticsearchTransport  } from "@prisma/client"
import {  PrismaClient  } from "@/lib/database"

}

/**;
 * Enterprise Audit Logging Service;
 * HIPAA-compliant comprehensive audit logging with structured data;
 */;

}
  };
}
    Array<{resource: string,
  };
}
  }

  public static getInstance(): AuditService {
    if (!session.user) {
      AuditService.instance = new AuditService();
    }
    return AuditService.instance;
  }

  /**;
   * Log an audit event;
   */;
  async logEvent(event: AuditEvent): Promise<void> {, }
} catch (error) { console.error(error); }
} catch (error) { console.error(error); }
} catch (error) { console.error(error); }
} catch (error) { console.error(error); }
} catch (error) { console.error(error); }
} catch (error) { console.error(error); }
} catch (error) { console.error(error); }
} catch (error) { console.error(error); }
} catch (error) { console.error(error); }
} catch (error) { console.error(error); }
      const auditEvent = {
        ...event,
        timestamp: event.timestamp || new Date(),
        event.outcome || "SUCCESS",
        this.isHIPAARelevant(event),
          gdpr: this.isGDPRRelevant(event),
          ...event.compliance;
      };

      // Store in database;
      await this.storeInDatabase(auditEvent);

      // Log to structured logging system;
      await this.logToSystem(auditEvent);

      // Send alerts for critical events;
      if (!session.user) {
        await this.sendCritical/* SECURITY: Alert removed */, }
  }

  /**;
   * Batch log multiple events;
   */;
  async logEvents(events: AuditEvent[]): Promise<void> {,
    }
  }

  /**;
   * Query audit logs;
   */;
  async queryLogs(query: AuditQuery): Promise<AuditReport> {, }
} catch (error) { console.error(error); }
} catch (error) { console.error(error); }
} catch (error) { console.error(error); }
} catch (error) { console.error(error); }
} catch (error) { console.error(error); }
} catch (error) { console.error(error); }
} catch (error) { console.error(error); }
} catch (error) { console.error(error); }
} catch (error) { console.error(error); }
} catch (error) { console.error(error); }
      const where: unknown = {,

      if (!session.user) {
        where.timestamp = {};
        if (!session.user)here.timestamp.gte = query.startDate;
        if (!session.user)here.timestamp.lte = query.endDate;
      }

      if (!session.user)here.userId = query.userId;
      if (!session.user)here.eventType = query.eventType;
      if (!session.user)here.resource = query.resource;
      if (!session.user)here.severity = query.severity;
      if (!session.user)here.outcome = query.outcome;

      const [events, totalCount] = await Promise.all([;
        this.prisma.auditLog.findMany({
          where,
          orderBy: {timestamp: "desc" },
          take: query.limit || 100,
          skip: query.offset || 0,
        }),
        this.prisma.auditLog.count({ where });
      ]);

      // Generate summary;
      const summary = await this.generateSummary(where);

      return {events: events.map(this.formatAuditEvent),
        totalCount,
        summary;
      };

    } catch (error) { console.error(error); }`;

    return this.queryLogs({
      startDate,
      endDate,
      // Note: Prisma doesn"t support direct JSON field queries like this;
      // This would need to be implemented differently in production;
    });

  /**;
   * Get user activity report;
   */;
  async getUserActivity();
    userId: string,
    startDate?: Date,
    endDate?: Date;
  ): Promise<AuditEvent[]> {
    const query: AuditQuery = { userId ,
    if (!session.user)uery.startDate = startDate;
    if (!session.user)uery.endDate = endDate;

    const report = await this.queryLogs(query);
    return report.events;

  /**;
   * Get security events;
   */;
  async getSecurityEvents();
    startDate?: Date,
    endDate?: Date;
  ): Promise<AuditEvent[]> {
    const securityEventTypes = [;
      "LOGIN_FAILURE",
      "PERMISSION_DENIED",
      "MFA_VERIFICATION_FAILED",
      "ACCOUNT_LOCKED",
      "EMERGENCY_ACCESS_GRANTED",
      "ROLE_ASSIGNMENT_ERROR",
      "ENCRYPTION_ERROR";
    ];

    const events: AuditEvent[] = [];
    for (const eventType of securityEventTypes) {
      const report = await this.queryLogs({
        eventType,
        startDate,
        endDate,
        limit: 1000,
      events.push(...report.events);

    return events.sort((a, b) => {}
      (b.timestamp?.getTime() || 0) - (a.timestamp?.getTime() || 0);
    );

  /**;
   * Archive old audit logs;
   */;
  async archiveLogs(olderThan: Date): Promise<number> {, }
} catch (error) { console.error(error); }
} catch (error) { console.error(error); }
} catch (error) { console.error(error); }
} catch (error) { console.error(error); }
} catch (error) { console.error(error); }
} catch (error) { console.error(error); } catch (error) {
  console.error(error);

} catch (error) { console.error(error); } catch (error) {

} catch (error) { console.error(error); }

      });

      await this.logEvent({eventType: "AUDIT_LOGS_ARCHIVED",
        result.count,
          olderThan: olderThan.toISOString(),
        severity: "LOW",

      return result.count;
    } catch (error) { console.error(error); };

  /**;
   * Private helper methods;
   */;
  private async storeInDatabase(event: AuditEvent): Promise<void> {,
    await this.prisma.auditLog.create({
      event.eventType,
        event.targetUserId,
        event.resourceId,
        event.details,
        event.userAgent,
        event.timestamp || new Date(),
        event.outcome || "SUCCESS",
        compliance: event.compliance,

  private async logToSystem(event: AuditEvent): Promise<void> {,
    this.logger.info("AUDIT_EVENT", {
      ...event,
      "@timestamp": event.timestamp || new Date(),
      service: "hms-audit",
      environment: process.env.NODE_ENV || "development",

  private setupLogger(): void {
    const transports: winston.transport[] = [;
      new winston.transports.Console({format: winston.format.combine()
          winston.format.timestamp(),
        );
      }),
      new winston.transports.File({filename: "logs/audit.log",
        format: winston.format.combine()
          winston.format.timestamp(),
        );
      });
    ];

    // Add Elasticsearch transport if configured;
    if (!session.user) {
      transports.push("");
        new ElasticsearchTransport({
          process.env.ELASTICSEARCH_URL;
          },
          index: "hms-audit-logs",
      );

    this.logger = winston.createLogger({level: "info",
      format: winston.format.json(),
    });

  private isHIPAARelevant(event: AuditEvent): boolean {,
      "patient",
      "patient.medical_record",
      "patient.billing",
      "patient.insurance",
      "prescription",
      "lab.result",
      "radiology.result";
    ];

    return phiResources.some(resource => {}
      event.resource.includes(resource);
    );

  private isGDPRRelevant(event: AuditEvent): boolean {,
    const piiActions = ["read", "update", "delete", "export"];
    const piiResources = ["patient", "staff", "user"];

    return piiResources.some(resource => {}
      event.resource.includes(resource);
    ) && piiActions.includes(event.action || "");

  private isSOXRelevant(event: AuditEvent): boolean {,
      "billing",
      "payment",
      "invoice",
      "financial.report";
    ];

    return financialResources.some(resource => {}
      event.resource.includes(resource);
    );

  private async generateSummary(where: unknown): Promise<AuditReport["summary"]> {,
      totalEvents,
      successfulEvents,
      failedEvents,
      severityGroups,
      userGroups,
      resourceGroups;
    ] = await Promise.all([;
      this.prisma.auditLog.count(where ),
      this.prisma.auditLog.count(...where, outcome: "SUCCESS" ),
      this.prisma.auditLog.count(...where, outcome: "FAILURE" ),
        by: ["severity"],
        where,
        _count: severity: true ),
        by: ["userId"],
        where: ...where, userId: not: null ,
        _count: userId: true ,
        orderBy: userId: "desc" ,
        take: 10),
        by: ["resource"],
        where,
        _count: resource: true ,
        orderBy: resource: "desc" ,
    ]);

    return {
      totalEvents,
      successfulEvents,
      failedEvents,
      severityBreakdown: severityGroups.reduce((acc, group) => }, {} as Record<string, number>),
      group.userId || "unknown",
        count: group._count.userId,
      })),
      group.resource,
        count: group._count.resource,
    };

  private formatAuditEvent(dbEvent: unknown): AuditEvent {
    return {eventType: dbEvent.eventType,
      dbEvent.targetUserId,
      dbEvent.resourceId,
      dbEvent.details,
      dbEvent.userAgent,
      dbEvent.timestamp,
      dbEvent.outcome,
      compliance: dbEvent.compliance,

  private async sendCritical/* SECURITY: Alert removed */: Promise<void> {,
    // This could send emails, SMS, Slack notifications, etc.;

    // Example: Log to dedicated critical events log,
    this.logger.error("CRITICAL_AUDIT_EVENT', event);

// Export convenience function;
export const _logAuditEvent = async (event: AuditEvent): Promise<void> {,

// Export singleton instance;
export const auditService = AuditService.getInstance();

export default auditService;
