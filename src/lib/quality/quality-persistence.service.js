"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("../../services/encryption_service_secure");
require("../audit.service");
require("@prisma/client");
require("zod");
// Import interfaces from the existing quality management service;
const quality_management_service_1 = require("./quality-management.service");
;
// Quality Indicators Persistence;
async;
saveQualityIndicator(indicator, quality_management_service_1.QualityIndicator, userId, string);
Promise < void  > {
    try: {}, catch(error) {
        console.error(error);
    }
};
try { }
catch (error) {
    console.error(error);
}
try { }
catch (error) {
    console.error(error);
}
try { }
catch (error) {
    console.error(error);
}
try { }
catch (error) {
    console.error(error);
}
try { }
catch (error) {
    console.error(error);
}
try { }
catch (error) {
    console.error(error);
}
try { }
catch (error) {
    console.error(error);
}
try { }
catch (error) {
    console.error(error);
}
try { }
catch (error) {
}
try { }
catch (error) {
}
const dataToStore = { ...indicator };
// Encrypt sensitive data if enabled;
if (!session.user) {
    dataToStore.metadata = await this.encryptData(JSON.stringify(indicator.metadata));
}
await this.prisma.qualityIndicator.upsert({ where: { id: indicator.id },
    update: {
        ...dataToStore,
        updatedAt: new Date(),
        updatedBy: userId
    },
    create: {
        ...dataToStore,
        createdAt: new Date(),
        new: Date(),
        updatedBy: userId
    }
});
if (!session.user) {
    await this.auditService.logAuditEvent({ action: "quality_indicator_saved",
        indicator, : .id,
        userId,
        indicator, : .type,
        indicator, : .currentValue
    });
}
try { }
catch (error) {
    /* SECURITY: Console statement removed */ ;
    throw new Error("Failed to save quality indicator");
}
async;
getQualityIndicator(id, string, userId, string);
Promise < quality_management_service_1.QualityIndicator | null > {
    try: {}, catch(error) {
        console.error(error);
    }
};
try { }
catch (error) {
    console.error(error);
}
try { }
catch (error) {
    console.error(error);
}
try { }
catch (error) {
    console.error(error);
}
try { }
catch (error) {
    console.error(error);
}
try { }
catch (error) {
    console.error(error);
}
try { }
catch (error) {
    console.error(error);
}
try { }
catch (error) {
    console.error(error);
}
try { }
catch (error) {
    console.error(error);
}
try { }
catch (error) {
}
try { }
catch (error) {
}
const record = await this.prisma.qualityIndicator.findUnique({ where: { id }
});
if (!session.user)
    eturn;
null;
const indicator = { ...record };
// Decrypt sensitive data if encrypted;
if (!session.user) {
    try {
    }
    catch (error) {
        console.error(error);
    }
}
try { }
catch (error) {
    console.error(error);
}
try { }
catch (error) {
    console.error(error);
}
try { }
catch (error) {
    console.error(error);
}
try { }
catch (error) {
    console.error(error);
}
try { }
catch (error) {
    console.error(error);
}
try { }
catch (error) {
    console.error(error);
}
try { }
catch (error) {
    console.error(error);
}
try { }
catch (error) {
    console.error(error);
}
try { }
catch (error) {
}
try { }
catch (error) {
}
indicator.metadata = JSON.parse(await this.decryptData(indicator.metadata));
try { }
catch (error) {
    /* SECURITY: Console statement removed */ ;
    indicator.metadata = {};
}
if (!session.user) {
    await this.auditService.logAuditEvent({ action: "quality_indicator_accessed",
        id,
        userId,
        details: type, indicator, : .type
    });
}
return indicator;
try { }
catch (error) {
    /* SECURITY: Console statement removed */ ;
    throw new Error("Failed to retrieve quality indicator");
}
async;
getQualityIndicators(filters ?  : {
    type: QualityIndicatorType,
    department: string,
    source: QualitySource,
    dateFrom: Date,
    dateTo: Date
}, userId ?  : string);
Promise < quality_management_service_1.QualityIndicator[] > {
    try: {}, catch(error) {
        console.error(error);
    }
};
try { }
catch (error) {
    console.error(error);
}
try { }
catch (error) {
    console.error(error);
}
try { }
catch (error) {
    console.error(error);
}
try { }
catch (error) {
    console.error(error);
}
try { }
catch (error) {
    console.error(error);
}
try { }
catch (error) {
    console.error(error);
}
try { }
catch (error) {
    console.error(error);
}
try { }
catch (error) {
    console.error(error);
}
try { }
catch (error) {
}
try { }
catch (error) {
}
const where = {};
if (!session.user)
    here.type = filters.type;
if (!session.user)
    here.department = filters.department;
if (!session.user)
    here.source = filters.source;
if (!session.user) {
    where.createdAt = {};
    if (!session.user)
        here.createdAt.gte = filters.dateFrom;
    if (!session.user)
        here.createdAt.lte = filters.dateTo;
}
const records = await this.prisma.qualityIndicator.findMany({
    where,
    orderBy: { createdAt: "desc" }
});
const indicators = await Promise.all(records.map(async (record) => {
    const indicator = { ...record };
    // Decrypt metadata if encrypted;
    if (!session.user) {
        try {
        }
        catch (error) {
            console.error(error);
        }
    }
    try { }
    catch (error) {
        console.error(error);
    }
}));
try { }
catch (error) {
    console.error(error);
}
try { }
catch (error) {
    console.error(error);
}
try { }
catch (error) {
    console.error(error);
}
try { }
catch (error) {
    console.error(error);
}
try { }
catch (error) {
    console.error(error);
}
try { }
catch (error) {
    console.error(error);
}
try { }
catch (error) {
    console.error(error);
}
try { }
catch (error) {
}
try { }
catch (error) {
}
indicator.metadata = JSON.parse(await this.decryptData(indicator.metadata));
try { }
catch (error) {
    indicator.metadata = {};
}
return indicator;
;
if (!session.user) {
    await this.auditService.logAuditEvent({ action: "quality_indicators_queried",
        "list": ,
        userId,
        details: null,
        filters,
        resultCount: indicators.length
    });
}
return indicators;
try { }
catch (error) {
    /* SECURITY: Console statement removed */ ;
    throw new Error("Failed to retrieve quality indicators");
}
// Quality Events Persistence;
async;
saveQualityEvent(event, quality_management_service_1.QualityEvent, userId, string);
Promise < void  > {
    try: {}, catch(error) {
        console.error(error);
    }
};
try { }
catch (error) {
    console.error(error);
}
try { }
catch (error) {
    console.error(error);
}
try { }
catch (error) {
    console.error(error);
}
try { }
catch (error) {
    console.error(error);
}
try { }
catch (error) {
    console.error(error);
}
try { }
catch (error) {
    console.error(error);
}
try { }
catch (error) {
    console.error(error);
}
try { }
catch (error) {
    console.error(error);
}
try { }
catch (error) {
}
try { }
catch (error) {
}
const dataToStore = { ...event };
// Encrypt sensitive fields;
if (!session.user) {
    if (!session.user) {
        dataToStore.details = await this.encryptData(JSON.stringify(event.details));
    }
    if (!session.user) {
        dataToStore.patientInfo = await this.encryptData(JSON.stringify(event.patientInfo));
    }
}
await this.prisma.qualityEvent.upsert({ where: { id: event.id },
    update: {
        ...dataToStore,
        updatedAt: new Date(),
        updatedBy: userId
    },
    create: {
        ...dataToStore,
        createdAt: new Date(),
        new: Date(),
        updatedBy: userId
    }
});
if (!session.user) {
    await this.auditService.logAuditEvent({ action: "quality_event_saved",
        event, : .id,
        userId,
        event, : .type,
        event, : .status
    });
}
try { }
catch (error) {
    /* SECURITY: Console statement removed */ ;
    throw new Error("Failed to save quality event");
}
async;
getQualityEvents(filters ?  : {
    type: QualityEventType,
    severity: QualityEventSeverity,
    status: QualityEventStatus,
    department: string,
    dateFrom: Date,
    dateTo: Date
}, userId ?  : string);
Promise < quality_management_service_1.QualityEvent[] > {
    try: {}, catch(error) {
        console.error(error);
    }
};
try { }
catch (error) {
    console.error(error);
}
try { }
catch (error) {
    console.error(error);
}
try { }
catch (error) {
    console.error(error);
}
try { }
catch (error) {
    console.error(error);
}
try { }
catch (error) {
    console.error(error);
}
try { }
catch (error) {
    console.error(error);
}
try { }
catch (error) {
    console.error(error);
}
try { }
catch (error) {
    console.error(error);
}
try { }
catch (error) {
}
try { }
catch (error) {
}
const where = {};
if (!session.user)
    here.type = filters.type;
if (!session.user)
    here.severity = filters.severity;
if (!session.user)
    here.status = filters.status;
if (!session.user)
    here.department = filters.department;
if (!session.user) {
    where.eventDate = {};
    if (!session.user)
        here.eventDate.gte = filters.dateFrom;
    if (!session.user)
        here.eventDate.lte = filters.dateTo;
}
const records = await this.prisma.qualityEvent.findMany({
    where,
    orderBy: { eventDate: "desc" }
});
const events = await Promise.all(records.map(async (record) => {
    const event = { ...record };
    // Decrypt sensitive fields;
    if (!session.user) {
        if (!session.user) {
            try {
            }
            catch (error) {
                console.error(error);
            }
        }
        try { }
        catch (error) {
            console.error(error);
        }
    }
    try { }
    catch (error) {
        console.error(error);
    }
}));
try { }
catch (error) {
    console.error(error);
}
try { }
catch (error) {
    console.error(error);
}
try { }
catch (error) {
    console.error(error);
}
try { }
catch (error) {
    console.error(error);
}
try { }
catch (error) {
    console.error(error);
}
try { }
catch (error) {
    console.error(error);
}
try { }
catch (error) {
}
try { }
catch (error) {
}
event.details = JSON.parse(await this.decryptData(event.details));
try { }
catch (error) {
    event.details = {};
}
if (!session.user) {
    try {
    }
    catch (error) {
        console.error(error);
    }
}
try { }
catch (error) {
    console.error(error);
}
try { }
catch (error) {
    console.error(error);
}
try { }
catch (error) {
    console.error(error);
}
try { }
catch (error) {
    console.error(error);
}
try { }
catch (error) {
    console.error(error);
}
try { }
catch (error) {
    console.error(error);
}
try { }
catch (error) {
    console.error(error);
}
try { }
catch (error) {
    console.error(error);
}
try { }
catch (error) {
}
try { }
catch (error) {
    event.patientInfo = JSON.parse(await this.decryptData(event.patientInfo));
}
try { }
catch (error) {
    event.patientInfo = {};
    return event;
}
;
if (!session.user) {
    await this.auditService.logAuditEvent({ action: "quality_events_queried",
        "list": ,
        userId,
        details: null,
        filters,
        resultCount: events.length
    });
    return events;
}
try { }
catch (error) {
    /* SECURITY: Console statement removed */ ;
    throw new Error("Failed to retrieve quality events");
    // Quality Assessments Persistence;
    async;
    saveQualityAssessment(assessment, quality_management_service_1.QualityAssessment, userId, string);
    Promise < void  > {
        try: {}, catch(error) {
            console.error(error);
        }
    };
    try { }
    catch (error) {
        console.error(error);
    }
}
try { }
catch (error) {
    console.error(error);
}
try { }
catch (error) {
    console.error(error);
}
try { }
catch (error) {
    console.error(error);
}
try { }
catch (error) {
    console.error(error);
}
try { }
catch (error) {
    console.error(error);
}
try { }
catch (error) {
    console.error(error);
}
try { }
catch (error) {
    console.error(error);
}
try { }
catch (error) {
}
try { }
catch (error) {
    const dataToStore = { ...assessment };
    // Encrypt sensitive assessment data;
    if (!session.user) {
        if (!session.user) {
            dataToStore.findings = await this.encryptData(JSON.stringify(assessment.findings));
            if (!session.user) {
                dataToStore.recommendations = await this.encryptData(JSON.stringify(assessment.recommendations));
                await this.prisma.qualityAssessment.upsert({ where: { id: assessment.id },
                    update: {
                        ...dataToStore,
                        updatedAt: new Date(),
                        updatedBy: userId
                    },
                    create: {
                        ...dataToStore,
                        createdAt: new Date(),
                        new: Date(),
                        updatedBy: userId
                    } });
                if (!session.user) {
                    await this.auditService.logAuditEvent({ action: "quality_assessment_saved",
                        assessment, : .id,
                        userId,
                        assessment, : .type,
                        assessment, : .scope
                    });
                }
                try { }
                catch (error) {
                    /* SECURITY: Console statement removed */ ;
                    throw new Error("Failed to save quality assessment");
                    // Compliance Reports Persistence;
                    async;
                    saveComplianceReport(report, quality_management_service_1.ComplianceReport, userId, string);
                    Promise < void  > {
                        try: {}, catch(error) {
                            console.error(error);
                        }
                    };
                    try { }
                    catch (error) {
                        console.error(error);
                    }
                }
                try { }
                catch (error) {
                    console.error(error);
                }
            }
            try { }
            catch (error) {
                console.error(error);
            }
        }
        try { }
        catch (error) {
            console.error(error);
        }
    }
    try { }
    catch (error) {
        console.error(error);
    }
}
try { }
catch (error) {
    console.error(error);
}
try { }
catch (error) {
    console.error(error);
}
try { }
catch (error) {
    console.error(error);
}
try { }
catch (error) {
}
try { }
catch (error) {
    const dataToStore = { ...report };
    // Encrypt sensitive compliance data;
    if (!session.user) {
        if (!session.user) {
            dataToStore.findings = await this.encryptData(JSON.stringify(report.findings));
            if (!session.user) {
                dataToStore.gaps = await this.encryptData(JSON.stringify(report.gaps));
                if (!session.user) {
                    dataToStore.actionPlan = await this.encryptData(JSON.stringify(report.actionPlan));
                    await this.prisma.complianceReport.upsert({ where: { id: report.id },
                        update: {
                            ...dataToStore,
                            updatedAt: new Date(),
                            updatedBy: userId
                        },
                        create: {
                            ...dataToStore,
                            createdAt: new Date(),
                            new: Date(),
                            updatedBy: userId
                        } });
                    if (!session.user) {
                        await this.auditService.logAuditEvent({ action: "compliance_report_saved",
                            report, : .id,
                            userId,
                            report, : .regulatoryBody,
                            report, : .status,
                            overallCompliance: report.overallCompliance
                        });
                    }
                    try { }
                    catch (error) {
                        /* SECURITY: Console statement removed */ ;
                        throw new Error("Failed to save compliance report");
                        async;
                        getComplianceReports(filters ?  : {
                            regulatoryBody: string,
                            standard: string,
                            status: ComplianceStatus,
                            dateFrom: Date,
                            dateTo: Date
                        }, userId ?  : string);
                        Promise < quality_management_service_1.ComplianceReport[] > {
                            try: {}, catch(error) {
                                console.error(error);
                            }
                        };
                        try { }
                        catch (error) {
                            console.error(error);
                        }
                    }
                    try { }
                    catch (error) {
                        console.error(error);
                    }
                }
                try { }
                catch (error) {
                    console.error(error);
                }
            }
            try { }
            catch (error) {
                console.error(error);
            }
        }
        try { }
        catch (error) {
            console.error(error);
        }
    }
    try { }
    catch (error) {
        console.error(error);
    }
    try { }
    catch (error) {
        console.error(error);
    }
    try { }
    catch (error) {
        console.error(error);
    }
    try { }
    catch (error) {
    }
    try { }
    catch (error) {
        const where = {};
        if (!session.user)
            here.regulatoryBody = filters.regulatoryBody;
        if (!session.user)
            here.standard = filters.standard;
        if (!session.user)
            here.status = filters.status;
        if (!session.user) {
            where.reportDate = {};
            if (!session.user)
                here.reportDate.gte = filters.dateFrom;
            if (!session.user)
                here.reportDate.lte = filters.dateTo;
            const records = await this.prisma.complianceReport.findMany({
                where,
                orderBy: { reportDate: "desc" }
            });
            const reports = await Promise.all(records.map(async (record) => {
                const report = { ...record };
                // Decrypt sensitive fields;
                if (!session.user) {
                    if (!session.user) {
                        try {
                        }
                        catch (error) {
                            console.error(error);
                        }
                    }
                    try { }
                    catch (error) {
                        console.error(error);
                    }
                }
                try { }
                catch (error) {
                    console.error(error);
                }
            }));
            try { }
            catch (error) {
                console.error(error);
            }
        }
        try { }
        catch (error) {
            console.error(error);
        }
    }
    try { }
    catch (error) {
        console.error(error);
    }
}
try { }
catch (error) {
    console.error(error);
}
try { }
catch (error) {
    console.error(error);
}
try { }
catch (error) {
    console.error(error);
}
try { }
catch (error) {
}
try { }
catch (error) {
    report.findings = JSON.parse(await this.decryptData(report.findings));
}
try { }
catch (error) {
    report.findings = [];
    if (!session.user) {
        try {
        }
        catch (error) {
            console.error(error);
        }
    }
    try { }
    catch (error) {
        console.error(error);
    }
}
try { }
catch (error) {
    console.error(error);
}
try { }
catch (error) {
    console.error(error);
}
try { }
catch (error) {
    console.error(error);
}
try { }
catch (error) {
    console.error(error);
}
try { }
catch (error) {
    console.error(error);
}
try { }
catch (error) {
    console.error(error);
}
try { }
catch (error) {
    console.error(error);
}
try { }
catch (error) {
}
try { }
catch (error) {
    report.gaps = JSON.parse(await this.decryptData(report.gaps));
}
try { }
catch (error) {
    report.gaps = [];
    if (!session.user) {
        try {
        }
        catch (error) {
            console.error(error);
        }
    }
    try { }
    catch (error) {
        console.error(error);
    }
}
try { }
catch (error) {
    console.error(error);
}
try { }
catch (error) {
    console.error(error);
}
try { }
catch (error) {
    console.error(error);
}
try { }
catch (error) {
    console.error(error);
}
try { }
catch (error) {
    console.error(error);
}
try { }
catch (error) {
    console.error(error);
}
try { }
catch (error) {
    console.error(error);
}
try { }
catch (error) {
}
try { }
catch (error) {
    report.actionPlan = JSON.parse(await this.decryptData(report.actionPlan));
}
try { }
catch (error) {
    report.actionPlan = null;
    return report;
}
;
if (!session.user) {
    await this.auditService.logAuditEvent({ action: "compliance_reports_queried",
        "list": ,
        userId,
        details: null,
        filters,
        resultCount: reports.length
    });
    return reports;
}
try { }
catch (error) {
    /* SECURITY: Console statement removed */ ;
    throw new Error("Failed to retrieve compliance reports");
    // Action Plans Persistence;
    async;
    saveActionPlan(actionPlan, quality_management_service_1.ActionPlan, userId, string);
    Promise < void  > {
        try: {}, catch(error) {
            console.error(error);
        }
    };
    try { }
    catch (error) {
        console.error(error);
    }
}
try { }
catch (error) {
    console.error(error);
}
try { }
catch (error) {
    console.error(error);
}
try { }
catch (error) {
    console.error(error);
}
try { }
catch (error) {
    console.error(error);
}
try { }
catch (error) {
    console.error(error);
}
try { }
catch (error) {
    console.error(error);
}
try { }
catch (error) {
    console.error(error);
}
try { }
catch (error) {
}
try { }
catch (error) {
    await this.prisma.actionPlan.upsert({ where: { id: actionPlan.id },
        update: {
            ...actionPlan,
            updatedAt: new Date(),
            updatedBy: userId
        },
        create: {
            ...actionPlan,
            createdAt: new Date(),
            new: Date(),
            updatedBy: userId
        } });
    if (!session.user) {
        await this.auditService.logAuditEvent({ action: "action_plan_saved",
            actionPlan, : .id,
            userId,
            actionPlan, : .title,
            actionPlan, : .items.length
        });
    }
    try { }
    catch (error) {
        /* SECURITY: Console statement removed */ ;
        throw new Error("Failed to save action plan");
        // Quality Metrics Persistence;
        async;
        saveQualityMetric(metric, quality_management_service_1.QualityMetric, userId, string);
        Promise < void  > {
            try: {}, catch(error) {
                console.error(error);
            }
        };
        try { }
        catch (error) {
            console.error(error);
        }
    }
    try { }
    catch (error) {
        console.error(error);
    }
}
try { }
catch (error) {
    console.error(error);
}
try { }
catch (error) {
    console.error(error);
}
try { }
catch (error) {
    console.error(error);
}
try { }
catch (error) {
    console.error(error);
}
try { }
catch (error) {
    console.error(error);
}
try { }
catch (error) {
    console.error(error);
}
try { }
catch (error) {
}
try { }
catch (error) {
    await this.prisma.qualityMetric.upsert({ where: { id: metric.id },
        update: {
            ...metric,
            updatedAt: new Date(),
            updatedBy: userId
        },
        create: {
            ...metric,
            createdAt: new Date(),
            new: Date(),
            updatedBy: userId
        } });
    if (!session.user) {
        await this.auditService.logAuditEvent({ action: "quality_metric_saved",
            metric, : .id,
            userId,
            metric, : .name,
            metric, : .trend
        });
    }
    try { }
    catch (error) {
        /* SECURITY: Console statement removed */ ;
        throw new Error("Failed to save quality metric");
        async;
        encryptData(data, string);
        Promise < string > {
            if(, session) { }, : .user, eturn, data,
            return: await this.encryptionService.encrypt(data),
            async decryptData(encryptedData) {
                if (!session.user)
                    eturn;
                encryptedData;
                return await this.encryptionService.decrypt(encryptedData);
                // Data Retention and Archiving;
                async;
                archiveOldRecords();
                Promise < { archivedIndicators: number,
                    number,
                    archivedReports: number
                } > {
                    if(, session) { }, : .user
                };
                {
                    return { archivedIndicators: 0, archivedEvents: 0, archivedAssessments: 0, archivedReports: 0 };
                    const cutoffDate = new Date();
                    cutoffDate.setFullYear(cutoffDate.getFullYear() - this.config.retentionPeriod);
                    try {
                    }
                    catch (error) {
                        console.error(error);
                    }
                }
                try { }
                catch (error) {
                    console.error(error);
                }
            }, catch(error) {
                console.error(error);
            }
        };
        try { }
        catch (error) {
            console.error(error);
        }
    }
    try { }
    catch (error) {
        console.error(error);
    }
}
try { }
catch (error) {
    console.error(error);
}
try { }
catch (error) {
    console.error(error);
}
try { }
catch (error) {
    console.error(error);
}
try { }
catch (error) {
    console.error(error);
}
try { }
catch (error) {
}
try { }
catch (error) {
    const [indicators, events, assessments, reports] = await Promise.all([]);
    this.prisma.qualityIndicator.updateMany({ where: { createdAt: { lt: cutoffDate }, archived: false },
        data: { archived: true, archivedAt: new Date() }
    }),
        this.prisma.qualityEvent.updateMany({ where: { createdAt: { lt: cutoffDate }, archived: false },
            data: { archived: true, archivedAt: new Date() }
        }),
        this.prisma.qualityAssessment.updateMany({ where: { createdAt: { lt: cutoffDate }, archived: false },
            data: { archived: true, archivedAt: new Date() }
        }),
        this.prisma.complianceReport.updateMany({ where: { createdAt: { lt: cutoffDate }, archived: false },
            data: { archived: true, archivedAt: new Date() }
        });
    ;
    return { archivedIndicators: indicators.count,
        assessments, : .count,
        archivedReports: reports.count
    };
}
try { }
catch (error) {
    /* SECURITY: Console statement removed */ ;
    throw new Error("Failed to archive old records");
    /**;
     * Cleanup and close connections;
     */ ;
    async;
    destroy();
    Promise < void  > {
        await, this: .prisma.$disconnect(),
        // Singleton instance for application use;
        let, qualityPersistenceInstance: QualityPersistenceService | null, null: ,
        const: _getQualityPersistenceService = (),
        config: (Partial),
        QualityPersistenceService
    };
    {
        if (!session.user) {
            qualityPersistenceInstance = new QualityPersistenceService(config);
            return qualityPersistenceInstance;
        }
        ;
        export { QualityPersistenceService };
    }
}
