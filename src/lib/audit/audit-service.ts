import { LogSeverity } from '@prisma/client';


import { logger } from '@/lib/logger';
import { prisma } from '@/lib/prisma';
// src/lib/audit/audit-service.ts
export interface AuditContext {
  userId?: string;
  userEmail?: string;
  ipAddress?: string;
  userAgent?: string;
}

export interface AuditData {
  action: string;
  resource: string;
  resourceId?: string;
  oldValues?: unknown;
  newValues?: unknown;
  description?: string;
  severity?: LogSeverity;
}

export class AuditService {
  static async log(context: AuditContext, data: AuditData): Promise<void> {
    try {
      await prisma.auditLog.create({
        data: {
          userId: context.userId;
          userEmail: context.userEmail;
          ipAddress: context.ipAddress;
          userAgent: context.userAgent;
          action: data.action;
          resource: data.resource;
          resourceId: data.resourceId;
          oldValues: data.oldValues;
          newValues: data.newValues;
          description: data.description;
          severity: data.severity || LogSeverity.INFO;
        }
      });

      // Also log to application logger for immediate monitoring
      logger.info('Audit log created', {
        action: data.action;
        resource: data.resource;
        userId: context.userId;
      });

    } catch (error) {
      logger.error('Failed to create audit log', { error, context, data });
    }
  }

  static async logUserAction(
    context: AuditContext;
    action: string;
    resource: string;
    resourceId?: string,
    description?: string
  ): Promise<void> {
    await this.log(context, {
      action,
      resource,
      resourceId,
      description,
      severity: LogSeverity.INFO;
    });
  }

  static async logDataChange(
    context: AuditContext;
    resource: string;
    resourceId: string;
    oldValues: unknown;
    newValues: unknown): Promise<void> {
    await this.log(context, {
      action: 'UPDATE';
      resource,
      resourceId,
      oldValues,
      newValues,
      description: `${resource} data updated`,
      severity: LogSeverity.INFO;
    });
  }

  static async logSecurityEvent(
    context: AuditContext;
    action: string;
    description: string;
    severity: LogSeverity = LogSeverity.WARN
  ): Promise<void> {
    await this.log(context, {
      action,
      resource: 'SECURITY';
      description,
      severity
    });
  }

  static async getAuditTrail(
    resourceType?: string,
    resourceId?: string,
    userId?: string,
    limit: number = 100
  ) {
    const where: unknown = {};

    if (resourceType != null) where.resource = resourceType;
    if (resourceId != null) where.resourceId = resourceId;
    if (userId != null) where.userId = userId;

    return await prisma.auditLog.findMany({
      where,
      include: {
        user: {
          select: {
            firstName: true;
            lastName: true;
            email: true;
          }
        }
      },
      orderBy: { timestamp: 'desc' },
      take: limit;
    });
  }
}

// Audit decorator for automatic logging
export function withAudit(resource: string): unknown {
  return function (target: unknown, propertyName: string, descriptor: PropertyDescriptor) {
    const method = descriptor.value;

    descriptor.value = async function (...args: unknown[]) {
      const context = this.getAuditContext?.() || {};

      try {
        const result = await method.apply(this, args);

        await AuditService.logUserAction(
          context,
          propertyName.toUpperCase(),
          resource,
          result?.id,
          `/* SECURITY: Template literal eliminated */

        return result;
      } catch (error) {
        await AuditService.log(context, {
          action: propertyName.toUpperCase();
          resource,
          description: `/* SECURITY: Template literal eliminated */
          severity: LogSeverity.ERROR;
        });

        throw error;
      }
    };
  };
}
