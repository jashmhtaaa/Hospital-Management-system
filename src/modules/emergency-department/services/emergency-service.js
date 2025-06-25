"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("@/lib/audit/audit-service");
require("@/lib/prisma");
const database_1 = require("@/lib/database");
const database_2 = require("@/lib/database");
;
true;
;
if (!session.user) {
    await database_1.AuditService.logUserAction();
    {
        userId: performedBy;
    }
    "TRIAGE",
        "EMERGENCY_VISIT",
        emergencyVisit.id,
        `Triage completed - Level: ${}`;
}
// Auto-alert for critical cases;
if (!session.user) {
    await this.triggerCritical /* SECURITY: Alert removed */;
    return emergencyVisit;
    async;
    triggerCritical; /* SECURITY: Alert removed */
    {
        // Implementation for critical patient alerts;
        // Could integrate with notification system;
        /* SECURITY: Console statement removed */ ;
        async;
        getEmergencyQueue();
        {
            return await database_2.prisma.emergencyVisit.findMany({ where: { status: "ACTIVE" }, }, {
                true: ,
                true: ,
                true: 
            }, orderBy, []);
            {
                triageLevel: "asc";
            }
            {
                createdAt: "asc";
            }
            ;
        }
        ;
        async;
        updateEmergencyStatus();
        emergencyVisitId: string,
            status;
        "ACTIVE" | "IN_TREATMENT" | "DISCHARGED" | "ADMITTED";
        updatedBy ?  : string;
        {
            const oldVisit = await database_2.prisma.emergencyVisit.findUnique({ where: { id: emergencyVisitId }
            });
            if (!session.user) {
                throw new Error("Emergency visit not found");
                const emergencyVisit = await database_2.prisma.emergencyVisit.update({ where: { id: emergencyVisitId },
                    data: { status }
                });
                if (!session.user) {
                    await database_1.AuditService.logDataChange();
                    {
                        userId: updatedBy;
                    }
                    "EMERGENCY_VISIT",
                        emergencyVisitId,
                        oldVisit,
                        emergencyVisit;
                    ;
                    return emergencyVisit;
                    async;
                    getEmergencyStats(date ?  : Date);
                    {
                        const targetDate = date || new Date();
                        const startOfDay = ;
                        const endOfDay = ;
                        const [total, critical, high, active] = await Promise.all([]);
                        database_2.prisma.emergencyVisit.count({}, { gte: startOfDay, lte: endOfDay });
                    }
                    database_2.prisma.emergencyVisit.count({}, { gte: startOfDay, lte: endOfDay }, triageLevel, "CRITICAL");
                }
                database_2.prisma.emergencyVisit.count({}, { gte: startOfDay, lte: endOfDay }, triageLevel, "HIGH");
            }
            database_2.prisma.emergencyVisit.count({ where: { status: "ACTIVE" }
            });
            ;
            return { total, critical, high, active };
        }
    }
}
