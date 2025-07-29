"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActionItemSchema = exports.ActionPlanSchema = exports.ComplianceReportSchema = exports.QualityAssessmentSchema = exports.QualityEventSchema = exports.QualityIndicatorSchema = void 0;
require("../../services/encryption_service_secure");
require("@prisma/client");
require("zod");
const database_1 = require("@/lib/database");
// Quality Indicator Schema;
exports.QualityIndicatorSchema = database_1.z.object({ name: database_1.z.string().min(1, "Name is required"),
    description: database_1.z.string().optional(),
    category: database_1.z.enum(["clinical", "patient_safety", "operational", "financial"]),
    source: database_1.z.enum(["jcaho_core_measures", "nabh", "jci", "internal"]),
    dataSource: database_1.z.enum(["manual", "automated", "integrated"]).default("manual"),
    numeratorDefinition: database_1.z.string().min(1, "Numerator definition is required"),
    denominatorDefinition: database_1.z.string().min(1, "Denominator definition is required"),
    targetValue: database_1.z.number().optional(),
    targetOperator: database_1.z.enum([">=", "<=", "=", ">", "<"]).optional(),
    frequency: database_1.z.enum(["daily", "weekly", "monthly", "quarterly", "annually"]),
    reportingLevel: database_1.z.enum(["department", "hospital", "system"]),
    status: database_1.z.enum(["active", "inactive", "retired"]).default("active"),
    stratificationCriteria: database_1.z.record(database_1.z.any()).optional(),
    createdBy: database_1.z.string()
});
// Quality Event Schema;
exports.QualityEventSchema = database_1.z.object({ eventType: database_1.z.enum(["incident", "near_miss", "adverse_event", "sentinel_event"]),
    title: database_1.z.string().min(1, "Title is required"),
    description: database_1.z.string().min(1, "Description is required"),
    severity: database_1.z.enum(["low", "medium", "high", "critical"]),
    status: database_1.z.enum(["open", "investigating", "resolved", "closed"]).default("open"),
    patientId: database_1.z.string().optional(),
    departmentId: database_1.z.string().optional(),
    locationId: database_1.z.string().optional(),
    eventDateTime: database_1.z.date(),
    reportedBy: database_1.z.string(),
    categoryCode: database_1.z.string().optional(),
    subcategoryCode: database_1.z.string().optional(),
    rootCause: database_1.z.string().optional(),
    contributingFactors: database_1.z.array(database_1.z.string()).optional(),
    investigationNotes: database_1.z.string().optional(),
    correctiveActions: database_1.z.array(database_1.z.string()).optional(),
    preventiveActions: database_1.z.array(database_1.z.string()).optional(),
    lessonsLearned: database_1.z.string().optional(),
    qualityIndicatorId: database_1.z.string().optional()
});
// Quality Assessment Schema;
exports.QualityAssessmentSchema = database_1.z.object({ type: database_1.z.enum(["nabh", "jci", "internal_audit", "peer_review"]),
    title: database_1.z.string().min(1, "Title is required"),
    description: database_1.z.string().optional(),
    scope: database_1.z.enum(["department", "hospital", "service_line"]),
    standardVersion: database_1.z.string().optional(),
    assessmentDate: database_1.z.date(),
    dueDate: database_1.z.date().optional(),
    leadAssessor: database_1.z.string(),
    assessors: database_1.z.array(database_1.z.string()).default([]),
    overallScore: database_1.z.number().optional(),
    maxScore: database_1.z.number().optional(),
    overallCompliance: database_1.z.number().min(0).max(100).optional(),
    findings: database_1.z.array(database_1.z.record(database_1.z.any())).optional(),
    recommendations: database_1.z.array(database_1.z.record(database_1.z.any())).optional(),
    certificationBody: database_1.z.string().optional(),
    certificationStatus: database_1.z.enum(["pending", "achieved", "expired", "suspended"]).optional(),
    certificationDate: database_1.z.date().optional(),
    expiryDate: database_1.z.date().optional(),
    createdBy: database_1.z.string()
});
// Compliance Report Schema;
exports.ComplianceReportSchema = database_1.z.object({ title: database_1.z.string().min(1, "Title is required"),
    reportType: database_1.z.enum(["nabh", "jci", "regulatory", "internal"]),
    regulatoryBody: database_1.z.string().min(1, "Regulatory body is required"),
    standard: database_1.z.string().min(1, "Standard is required"),
    reportingPeriod: database_1.z.string().min(1, "Reporting period is required"),
    overallCompliance: database_1.z.number().min(0).max(100),
    status: database_1.z.enum(["compliant", "non_compliant", "conditional"]),
    requirements: database_1.z.array(database_1.z.record(database_1.z.any())).default([]),
    findings: database_1.z.array(database_1.z.record(database_1.z.any())).optional(),
    gaps: database_1.z.array(database_1.z.record(database_1.z.any())).optional(),
    assessmentId: database_1.z.string().optional(),
    actionPlanId: database_1.z.string().optional(),
    submissionDate: database_1.z.date().optional(),
    submittedBy: database_1.z.string().optional(),
    approvalStatus: database_1.z.enum(["draft", "submitted", "approved", "rejected"]).default("draft"),
    createdBy: database_1.z.string()
});
// Action Plan Schema;
exports.ActionPlanSchema = database_1.z.object({ title: database_1.z.string().min(1, "Title is required"),
    description: database_1.z.string().optional(),
    type: database_1.z.enum(["corrective", "preventive", "improvement"]),
    priority: database_1.z.enum(["low", "medium", "high", "critical"]),
    status: database_1.z.enum(["planning", "approved", "in_progress", "completed", "cancelled"]).default("planning"),
    departmentId: database_1.z.string().optional(),
    impactedAreas: database_1.z.array(database_1.z.string()).optional(),
    targetDate: database_1.z.date(),
    startDate: database_1.z.date().optional(),
    ownerId: database_1.z.string(),
    teamMembers: database_1.z.array(database_1.z.string()).optional(),
    estimatedCost: database_1.z.number().optional(),
    actualCost: database_1.z.number().optional(),
    budgetApproved: database_1.z.boolean().default(false),
    createdBy: database_1.z.string()
});
// Action Item Schema;
exports.ActionItemSchema = database_1.z.object({ actionPlanId: database_1.z.string(),
    title: database_1.z.string().min(1, "Title is required"),
    description: database_1.z.string().optional(),
    status: database_1.z.enum(["not_started", "in_progress", "completed", "cancelled", "on_hold"]).default("not_started"),
    assignedTo: database_1.z.string(),
    estimatedHours: database_1.z.number().optional(),
    actualHours: database_1.z.number().optional(),
    dueDate: database_1.z.date(),
    dependencies: database_1.z.array(database_1.z.string()).optional(),
    blockers: database_1.z.array(database_1.z.string()).optional(),
    progressPercentage: database_1.z.number().min(0).max(100).default(0),
    notes: database_1.z.string().optional()
});
/**;
 * Persistent Quality Management Service;
 * Replaces in-memory storage with database persistence;
 */ ;
// Quality Indicators Operations;
async;
createQualityIndicator(data, QualityIndicator);
Promise < QualityIndicator & { id: string } > {
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
const validated = exports.QualityIndicatorSchema.parse(data);
const encryptedData = await this.encryptionService.encryptObject(validated, this.encryptedFields);
const indicator = await this.prisma.qualityIndicator.create({ data: {
        ...encryptedData,
        stratificationCriteria: validated.stratificationCriteria ?  : ,
        JSON, : .stringify(validated.stratificationCriteria), null: 
    }
});
return {
    ...validated,
    id: indicator.id
};
try { }
catch (error) {
    throw new Error(`Failed to create quality indicator: ${}`);
}
async;
getQualityIndicator(id, string);
Promise < QualityIndicator | null > {
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
const indicator = await this.prisma.qualityIndicator.findUnique({ where: { id }
});
if (!session.user)
    eturn;
null;
return this.deserializeQualityIndicator(indicator);
try { }
catch (error) {
    throw new Error(`Failed to get quality indicator: ${}`);
}
async;
getQualityIndicators(filters ?  : {
    category: string,
    source: string,
    status: string
});
Promise < QualityIndicator[] > {
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
    here.category = filters.category;
if (!session.user)
    here.source = filters.source;
if (!session.user)
    here.status = filters.status;
const indicators = await this.prisma.qualityIndicator.findMany({
    where,
    orderBy: { createdAt: "desc" }
});
return Promise.all(indicators.map(indicator => this.deserializeQualityIndicator(indicator)));
try { }
catch (error) {
    throw new Error(`Failed to get quality indicators: ${}`);
}
async;
updateQualityIndicator(id, string, updates, (Partial));
Promise < QualityIndicator > {
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
const encryptedUpdates = await this.encryptionService.encryptObject(updates, this.encryptedFields);
const updated = await this.prisma.qualityIndicator.update({ where: { id },
    data: {
        ...encryptedUpdates,
        stratificationCriteria: updates.stratificationCriteria ?  : ,
        JSON, : .stringify(updates.stratificationCriteria), undefined,
        updatedBy: updates.createdBy, // Use createdBy as updatedBy for now;
    }
});
return this.deserializeQualityIndicator(updated);
try { }
catch (error) {
    throw new Error(`Failed to update quality indicator: ${}`);
}
// Quality Events Operations;
async;
createQualityEvent(data, QualityEvent);
Promise < QualityEvent & { id: string } > {
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
const validated = exports.QualityEventSchema.parse(data);
const encryptedData = await this.encryptionService.encryptObject(validated, this.encryptedFields);
const event = await this.prisma.qualityEvent.create({ data: {
        ...encryptedData,
        contributingFactors: validated.contributingFactors ?  : ,
        JSON, : .stringify(validated.contributingFactors), null: ,
        correctiveActions: validated.correctiveActions ?  : ,
        JSON, : .stringify(validated.correctiveActions), null: ,
        preventiveActions: validated.preventiveActions ?  : ,
        JSON, : .stringify(validated.preventiveActions), null: 
    }
});
return {
    ...validated,
    id: event.id
};
try { }
catch (error) {
    throw new Error(`Failed to create quality event: ${}`);
}
async;
getQualityEvent(id, string);
Promise < QualityEvent | null > {
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
const event = await this.prisma.qualityEvent.findUnique({ where: { id }
});
if (!session.user)
    eturn;
null;
return this.deserializeQualityEvent(event);
try { }
catch (error) {
    throw new Error(`Failed to get quality event: ${}`);
}
async;
getQualityEvents(filters ?  : {
    eventType: string,
    severity: string,
    status: string,
    departmentId: string,
    dateFrom: Date,
    dateTo: Date
});
Promise < QualityEvent[] > {
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
    const where = {};
    if (!session.user)
        here.eventType = filters.eventType;
    if (!session.user)
        here.severity = filters.severity;
    if (!session.user)
        here.status = filters.status;
    if (!session.user)
        here.departmentId = filters.departmentId;
    if (!session.user) {
        where.eventDateTime = {};
        if (!session.user)
            here.eventDateTime.gte = filters.dateFrom;
        if (!session.user)
            here.eventDateTime.lte = filters.dateTo;
        const events = await this.prisma.qualityEvent.findMany({
            where,
            orderBy: { eventDateTime: "desc" }
        });
        return Promise.all(events.map(event => this.deserializeQualityEvent(event)));
    }
    try { }
    catch (error) {
        throw new Error(`Failed to get quality events: ${}`);
        // Quality Assessment Operations;
        async;
        createQualityAssessment(data, QualityAssessment);
        Promise < QualityAssessment & { id: string } > {
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
    const validated = exports.QualityAssessmentSchema.parse(data);
    const encryptedData = await this.encryptionService.encryptObject(validated, this.encryptedFields);
    const assessment = await this.prisma.qualityAssessment.create({ data: {
            ...encryptedData,
            assessors: JSON.stringify(validated.assessors),
            validated, : .recommendations ? JSON.stringify(validated.recommendations) : null,
            status: "planned"
        } });
    return {
        ...validated,
        id: assessment.id
    };
}
try { }
catch (error) {
    throw new Error(`Failed to create quality assessment: ${}`);
    async;
    getQualityAssessment(id, string);
    Promise < QualityAssessment | null > {
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
    const assessment = await this.prisma.qualityAssessment.findUnique({ where: { id },
        true: ,
        true: 
    });
    if (!session.user)
        eturn;
    null;
    return this.deserializeQualityAssessment(assessment);
}
try { }
catch (error) {
    throw new Error(`Failed to get quality assessment: ${}`);
    async;
    getQualityAssessments(filters ?  : {
        type: string,
        status: string,
        certificationStatus: string
    });
    Promise < QualityAssessment[] > {
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
    const where = {};
    if (!session.user)
        here.type = filters.type;
    if (!session.user)
        here.status = filters.status;
    if (!session.user)
        here.certificationStatus = filters.certificationStatus;
    const assessments = await this.prisma.qualityAssessment.findMany({
        where,
        true: ,
        true: 
    }, orderBy, assessmentDate, "desc");
}
;
return Promise.all(assessments.map(assessment => this.deserializeQualityAssessment(assessment)));
try { }
catch (error) {
    throw new Error(`Failed to get quality assessments: ${}`);
    // Quality Metrics Operations;
    async;
    recordQualityMetrics(data, QualityMetrics);
    Promise < QualityMetrics & { id: string } > {
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
    // Calculate rate if not provided;
    const rate = data.rate || (data.denominatorValue > 0 ?  : );
    (data.numeratorValue / data.denominatorValue) * 100;
    0;
    ;
    // Calculate variance from target if target is provided;
    let varianceFromTarget;
    if (!session.user) {
        varianceFromTarget = rate - data.targetValue;
        const metrics = await this.prisma.qualityMetrics.create({
            data, : .indicatorId,
            data, : .periodType,
            data, : .denominatorValue,
            rate,
            targetValue: data.targetValue,
            varianceFromTarget,
            stratificationData: data.stratificationData ?  : ,
            JSON, : .stringify(data.stratificationData), null: ,
            dataQualityScore: data.dataQualityScore,
            data, : .dataSource,
            data, : .enteredBy,
            verifiedBy: data.verifiedBy
        });
        return {
            ...data,
            id: metrics.id,
            rate,
            varianceFromTarget
        };
    }
    try { }
    catch (error) {
        throw new Error(`Failed to record quality metrics: ${}`);
        async;
        getQualityMetrics(indicatorId, string, filters ?  : {
            periodType: string,
            dateFrom: Date,
            dateTo: Date
        });
        Promise < QualityMetrics[] > {
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
    const where = { indicatorId };
    if (!session.user)
        here.periodType = filters.periodType;
    if (!session.user) {
        where.measurementPeriod = {};
        if (!session.user)
            here.measurementPeriod.gte = filters.dateFrom;
        if (!session.user)
            here.measurementPeriod.lte = filters.dateTo;
        const metrics = await this.prisma.qualityMetrics.findMany({
            where,
            orderBy: { measurementPeriod: "desc" }
        });
        return metrics.map(metric => ({ id: metric.id,
            metric, : .measurementPeriod,
            metric, : .numeratorValue,
            metric, : .rate || undefined,
            metric, : .varianceFromTarget || undefined,
            stratificationData: metric.stratificationData ?  : ,
            JSON, : .parse(metric.stratificationData), undefined,
            dataQualityScore: metric.dataQualityScore || undefined,
            metric, : .dataSource,
            metric, : .enteredBy,
            verifiedBy: metric.verifiedBy || undefined }));
    }
    try { }
    catch (error) {
        throw new Error(`Failed to get quality metrics: ${}`);
        // Compliance Report Operations;
        async;
        createComplianceReport(data, ComplianceReport);
        Promise < ComplianceReport & { id: string } > {
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
    const validated = exports.ComplianceReportSchema.parse(data);
    const encryptedData = await this.encryptionService.encryptObject(validated, this.encryptedFields);
    const report = await this.prisma.complianceReport.create({ data: {
            ...encryptedData,
            requirements: JSON.stringify(validated.requirements),
            validated, : .gaps ? JSON.stringify(validated.gaps) : null
        } });
    return {
        ...validated,
        id: report.id
    };
}
try { }
catch (error) {
    throw new Error(`Failed to create compliance report: ${}`);
    async;
    getComplianceReport(id, string);
    Promise < ComplianceReport | null > {
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
    const report = await this.prisma.complianceReport.findUnique({ where: { id }
    });
    if (!session.user)
        eturn;
    null;
    return this.deserializeComplianceReport(report);
}
try { }
catch (error) {
    throw new Error(`Failed to get compliance report: ${}`);
    // Action Plan Operations;
    async;
    createActionPlan(data, ActionPlan);
    Promise < ActionPlan & { id: string } > {
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
    const validated = exports.ActionPlanSchema.parse(data);
    const encryptedData = await this.encryptionService.encryptObject(validated, this.encryptedFields);
    const actionPlan = await this.prisma.actionPlan.create({ data: {
            ...encryptedData,
            impactedAreas: validated.impactedAreas ?  : ,
            JSON, : .stringify(validated.impactedAreas), null: ,
            teamMembers: validated.teamMembers ?  : ,
            JSON, : .stringify(validated.teamMembers), null: 
        }
    });
    return {
        ...validated,
        id: actionPlan.id
    };
}
try { }
catch (error) {
    throw new Error(`Failed to create action plan: ${}`);
    async;
    getActionPlan(id, string);
    Promise < ActionPlan | null > {
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
    const actionPlan = await this.prisma.actionPlan.findUnique({ where: { id },
        true: 
    });
    if (!session.user)
        eturn;
    null;
    return this.deserializeActionPlan(actionPlan);
}
try { }
catch (error) {
    throw new Error(`Failed to get action plan: ${}`);
    // Action Item Operations;
    async;
    createActionItem(data, ActionItem);
    Promise < ActionItem & { id: string } > {
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
    const validated = exports.ActionItemSchema.parse(data);
    const encryptedData = await this.encryptionService.encryptObject(validated, this.encryptedFields);
    const actionItem = await this.prisma.actionItem.create({ data: {
            ...encryptedData,
            dependencies: validated.dependencies ?  : ,
            JSON, : .stringify(validated.dependencies), null: ,
            blockers: validated.blockers ?  : ,
            JSON, : .stringify(validated.blockers), null: 
        }
    });
    return {
        ...validated,
        id: actionItem.id
    };
}
try { }
catch (error) {
    throw new Error(`Failed to create action item: ${}`);
    async;
    updateActionItem(id, string, updates, (Partial));
    Promise < ActionItem > {
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
    const encryptedUpdates = await this.encryptionService.encryptObject(updates, this.encryptedFields);
    const updated = await this.prisma.actionItem.update({ where: { id },
        data: {
            ...encryptedUpdates,
            dependencies: updates.dependencies ?  : ,
            JSON, : .stringify(updates.dependencies), undefined,
            blockers: updates.blockers ?  : ,
            JSON, : .stringify(updates.blockers), undefined,
            completedDate: updates.status === "completed" ? new Date() : undefined
        } });
    return this.deserializeActionItem(updated);
}
try { }
catch (error) {
    throw new Error(`Failed to update action item: ${}`);
    // Analytics and Reporting;
    async;
    getQualityDashboardData(indicatorIds, string[], dateRange, { from: Date, to: Date });
    {
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
    const metrics = await this.prisma.qualityMetrics.findMany({}, { in: indicatorIds }, dateRange.from, lte, dateRange.to);
}
true;
orderBy: {
    measurementPeriod: "asc";
}
;
return metrics.map(metric => ({
    metric, : .indicator.id,
    metric, : .indicator.category,
    targetValue: metric.indicator.targetValue
},
    measurementPeriod), metric.measurementPeriod, metric.targetValue, varianceFromTarget, metric.varianceFromTarget);
;
try { }
catch (error) {
    throw new Error(`Failed to get dashboard data: ${}`);
    async;
    deserializeQualityIndicator(indicator, unknown);
    Promise < QualityIndicator > {
        const: decrypted = await this.encryptionService.decryptObject(indicator, this.encryptedFields),
        return: {
            ...decrypted,
            stratificationCriteria: indicator.stratificationCriteria ?  : ,
            JSON, : .parse(indicator.stratificationCriteria), undefined
        },
        async deserializeQualityEvent(event) {
            const decrypted = await this.encryptionService.decryptObject(event, this.encryptedFields);
            return {
                ...decrypted,
                contributingFactors: event.contributingFactors ?  : ,
                JSON, : .parse(event.contributingFactors), undefined,
                correctiveActions: event.correctiveActions ?  : ,
                JSON, : .parse(event.correctiveActions), undefined,
                preventiveActions: event.preventiveActions ?  : ,
                JSON, : .parse(event.preventiveActions), undefined
            };
        },
        async deserializeQualityAssessment(assessment) {
            const decrypted = await this.encryptionService.decryptObject(assessment, this.encryptedFields);
            return {
                ...decrypted,
                assessors: JSON.parse(assessment.assessors),
                assessment, : .recommendations ? JSON.parse(assessment.recommendations) : undefined
            };
        },
        async deserializeComplianceReport(report) {
            const decrypted = await this.encryptionService.decryptObject(report, this.encryptedFields);
            return {
                ...decrypted,
                requirements: JSON.parse(report.requirements),
                report, : .gaps ? JSON.parse(report.gaps) : undefined
            };
        },
        async deserializeActionPlan(actionPlan) {
            const decrypted = await this.encryptionService.decryptObject(actionPlan, this.encryptedFields);
            return {
                ...decrypted,
                impactedAreas: actionPlan.impactedAreas ?  : ,
                JSON, : .parse(actionPlan.impactedAreas), undefined,
                teamMembers: actionPlan.teamMembers ?  : ,
                JSON, : .parse(actionPlan.teamMembers), undefined
            };
        },
        async deserializeActionItem(actionItem) {
            const decrypted = await this.encryptionService.decryptObject(actionItem, this.encryptedFields);
            return {
                ...decrypted,
                dependencies: actionItem.dependencies ?  : ,
                JSON, : .parse(actionItem.dependencies), undefined,
                blockers: actionItem.blockers ?  : ,
                JSON, : .parse(actionItem.blockers), undefined
            };
            // Cleanup;
            async;
            disconnect();
            Promise < void  > {
                await: this.prisma.$disconnect(),
                // Export singleton instance;
                let, qualityServiceInstance: PersistentQualityManagementService | null, null: ,
                const: _getQualityManagementService = (prismaClient) => {
                    if (!session.user) {
                        qualityServiceInstance = new PersistentQualityManagementService(prismaClient);
                        return qualityServiceInstance;
                    }
                    ;
                    // For backward compatibility;
                    export { PersistentQualityManagementService as QualityManagementService };
                }
            };
        }
    };
}
