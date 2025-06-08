// src/modules/emergency-department/services/emergency-service.ts
import { prisma } from '@/lib/prisma';
import { AuditService } from '@/lib/audit/audit-service';

export interface TriageData {
  patientId: string;
  triageLevel: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  complaint: string;
  vitalSigns?: {
    bloodPressure?: string;
    heartRate?: number;
    temperature?: number;
    respiratoryRate?: number;
    oxygenSaturation?: number;
  };
}

export class EmergencyService {
  static async performTriage(data: TriageData, performedBy?: string) {
    const emergencyVisit = await prisma.emergencyVisit.create({
      data: {
        patientId: data.patientId,
        triageLevel: data.triageLevel,
        complaint: data.complaint,
        status: 'ACTIVE'
      },
      include: {
        patient: true
      }
    });
    
    if (performedBy) {
      await AuditService.logUserAction(
        { userId: performedBy },
        'TRIAGE',
        'EMERGENCY_VISIT',
        emergencyVisit.id,
        `Triage completed - Level: ${data.triageLevel}`
      );
    }
    
    // Auto-alert for critical cases
    if (data.triageLevel === 'CRITICAL') {
      await this.triggerCriticalAlert(emergencyVisit.id);
    }
    
    return emergencyVisit;
  }
  
  static async triggerCriticalAlert(emergencyVisitId: string) {
    // Implementation for critical patient alerts
    // Could integrate with notification system
    console.log(`CRITICAL ALERT: Emergency visit ${emergencyVisitId} requires immediate attention`);
  }
  
  static async getEmergencyQueue() {
    return await prisma.emergencyVisit.findMany({
      where: { status: 'ACTIVE' },
      include: {
        patient: {
          select: {
            firstName: true,
            lastName: true,
            mrn: true,
            dateOfBirth: true,
            gender: true
          }
        }
      },
      orderBy: [
        { triageLevel: 'asc' },
        { createdAt: 'asc' }
      ]
    });
  }
  
  static async updateEmergencyStatus(
    emergencyVisitId: string,
    status: 'ACTIVE' | 'IN_TREATMENT' | 'DISCHARGED' | 'ADMITTED',
    updatedBy?: string
  ) {
    const oldVisit = await prisma.emergencyVisit.findUnique({
      where: { id: emergencyVisitId }
    });
    
    if (!oldVisit) {
      throw new Error('Emergency visit not found');
    }
    
    const emergencyVisit = await prisma.emergencyVisit.update({
      where: { id: emergencyVisitId },
      data: { status }
    });
    
    if (updatedBy) {
      await AuditService.logDataChange(
        { userId: updatedBy },
        'EMERGENCY_VISIT',
        emergencyVisitId,
        oldVisit,
        emergencyVisit
      );
    }
    
    return emergencyVisit;
  }
  
  static async getEmergencyStats(date?: Date) {
    const targetDate = date || new Date();
    const startOfDay = new Date(targetDate.setHours(0, 0, 0, 0));
    const endOfDay = new Date(targetDate.setHours(23, 59, 59, 999));
    
    const [total, critical, high, active] = await Promise.all([
      prisma.emergencyVisit.count({
        where: {
          createdAt: { gte: startOfDay, lte: endOfDay }
        }
      }),
      prisma.emergencyVisit.count({
        where: {
          createdAt: { gte: startOfDay, lte: endOfDay },
          triageLevel: 'CRITICAL'
        }
      }),
      prisma.emergencyVisit.count({
        where: {
          createdAt: { gte: startOfDay, lte: endOfDay },
          triageLevel: 'HIGH'
        }
      }),
      prisma.emergencyVisit.count({
        where: { status: 'ACTIVE' }
      })
    ]);
    
    return { total, critical, high, active };
  }
}
