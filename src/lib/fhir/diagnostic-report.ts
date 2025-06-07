/**
 * FHIR R4 DiagnosticReport Resource Implementation
 * Based on HL7 FHIR R4 DiagnosticReport Resource specification
 * Handles lab reports, imaging reports, pathology reports
 * Source: ZIP 6 - FHIR R4 data models for hospital management system microservices
 */

import {
  FHIRBase,
  FHIRIdentifier,
  FHIRCodeableConcept,
  FHIRReference,
  FHIRPeriod,
  FHIRAttachment
} from './types';

export interface FHIRDiagnosticReportMedia {
  comment?: string;
  link: FHIRReference; // Media
}

export interface FHIRDiagnosticReport extends FHIRBase {
  resourceType: 'DiagnosticReport';
  identifier?: FHIRIdentifier[];
  basedOn?: FHIRReference[];
  status: 'registered' | 'partial' | 'preliminary' | 'final' | 'amended' | 'corrected' | 'appended' | 'cancelled' | 'entered-in-error' | 'unknown';
  category?: FHIRCodeableConcept[];
  code: FHIRCodeableConcept;
  subject?: FHIRReference; // Patient | Group | Device | Location
  encounter?: FHIRReference;
  effective?: string | FHIRPeriod; // effectiveDateTime | effectivePeriod
  issued?: string; // instant
  performer?: FHIRReference[];
  resultsInterpreter?: FHIRReference[];
  specimen?: FHIRReference[];
  result?: FHIRReference[]; // Observation
  imagingStudy?: FHIRReference[];
  media?: FHIRDiagnosticReportMedia[];
  conclusion?: string;
  conclusionCode?: FHIRCodeableConcept[];
  presentedForm?: FHIRAttachment[];
}

// DiagnosticReport Search Parameters
export interface FHIRDiagnosticReportSearchParams {
  _id?: string;
  identifier?: string;
  patient?: string;
  subject?: string;
  encounter?: string;
  code?: string;
  category?: string;
  status?: string;
  date?: string;
  performer?: string;
  'results-interpreter'?: string;
  _count?: number;
  _offset?: number;
  _sort?: string;
}

// Helper functions for FHIR DiagnosticReport operations
export class FHIRDiagnosticReportUtils {
  /**
   * Create a basic lab report
   */
  static createLabReport(data: {
    patientId: string;
    practitionerId: string;
    encounterId?: string;
    reportCode: string;
    reportName: string;
    observations: string[]; // Observation IDs
    conclusion?: string;
    effectiveDateTime: string;
    status?: 'preliminary' | 'final';
    specimens?: string[];
  }): FHIRDiagnosticReport {
    return {
      resourceType: 'DiagnosticReport',
      status: data.status || 'final',
      category: [{
        coding: [{
          system: 'http://terminology.hl7.org/CodeSystem/v2-0074',
          code: 'LAB',
          display: 'Laboratory'
        }]
      }],
      code: {
        coding: [{
          system: 'http://loinc.org',
          code: data.reportCode,
          display: data.reportName
        }]
      },
      subject: {
        reference: `Patient/${data.patientId}`,
        type: 'Patient'
      },
      performer: [{
        reference: `Practitioner/${data.practitionerId}`,
        type: 'Practitioner'
      }],
      effective: data.effectiveDateTime,
      issued: new Date().toISOString(),
      result: data.observations.map(obsId => ({
        reference: `Observation/${obsId}`,
        type: 'Observation'
      })),
      ...(data.encounterId && {
        encounter: {
          reference: `Encounter/${data.encounterId}`,
          type: 'Encounter'
        }
      }),
      ...(data.specimens && {
        specimen: data.specimens.map(specId => ({
          reference: `Specimen/${specId}`,
          type: 'Specimen'
        }))
      }),
      ...(data.conclusion && { conclusion: data.conclusion })
    };
  }

  /**
   * Create an imaging report
   */
  static createImagingReport(data: {
    patientId: string;
    radiologistId: string;
    encounterId?: string;
    studyType: string;
    studyName: string;
    imagingStudyId?: string;
    findings: string;
    impression: string;
    effectiveDateTime: string;
    status?: 'preliminary' | 'final';
    images?: string[];
  }): FHIRDiagnosticReport {
    return {
      resourceType: 'DiagnosticReport',
      status: data.status || 'final',
      category: [{
        coding: [{
          system: 'http://terminology.hl7.org/CodeSystem/v2-0074',
          code: 'RAD',
          display: 'Radiology'
        }]
      }],
      code: {
        coding: [{
          system: 'http://loinc.org',
          code: data.studyType,
          display: data.studyName
        }]
      },
      subject: {
        reference: `Patient/${data.patientId}`,
        type: 'Patient'
      },
      resultsInterpreter: [{
        reference: `Practitioner/${data.radiologistId}`,
        type: 'Practitioner'
      }],
      effective: data.effectiveDateTime,
      issued: new Date().toISOString(),
      conclusion: `Findings: ${data.findings}\n\nImpression: ${data.impression}`,
      ...(data.encounterId && {
        encounter: {
          reference: `Encounter/${data.encounterId}`,
          type: 'Encounter'
        }
      }),
      ...(data.imagingStudyId && {
        imagingStudy: [{
          reference: `ImagingStudy/${data.imagingStudyId}`,
          type: 'ImagingStudy'
        }]
      }),
      ...(data.images && {
        media: data.images.map(imageId => ({
          link: {
            reference: `Media/${imageId}`,
            type: 'Media'
          }
        }))
      })
    };
  }

  /**
   * Create a pathology report
   */
  static createPathologyReport(data: {
    patientId: string;
    pathologistId: string;
    encounterId?: string;
    specimenId: string;
    diagnosis: string;
    grossDescription: string;
    microscopicDescription: string;
    conclusion: string;
    effectiveDateTime: string;
    status?: 'preliminary' | 'final';
  }): FHIRDiagnosticReport {
    return {
      resourceType: 'DiagnosticReport',
      status: data.status || 'final',
      category: [{
        coding: [{
          system: 'http://terminology.hl7.org/CodeSystem/v2-0074',
          code: 'PAT',
          display: 'Pathology'
        }]
      }],
      code: {
        coding: [{
          system: 'http://loinc.org',
          code: '60567-5',
          display: 'Pathology report'
        }]
      },
      subject: {
        reference: `Patient/${data.patientId}`,
        type: 'Patient'
      },
      resultsInterpreter: [{
        reference: `Practitioner/${data.pathologistId}`,
        type: 'Practitioner'
      }],
      effective: data.effectiveDateTime,
      issued: new Date().toISOString(),
      specimen: [{
        reference: `Specimen/${data.specimenId}`,
        type: 'Specimen'
      }],
      conclusion: [
        `Diagnosis: ${data.diagnosis}`,
        `Gross Description: ${data.grossDescription}`,
        `Microscopic Description: ${data.microscopicDescription}`,
        `Conclusion: ${data.conclusion}`
      ].join('\n\n'),
      ...(data.encounterId && {
        encounter: {
          reference: `Encounter/${data.encounterId}`,
          type: 'Encounter'
        }
      })
    };
  }

  /**
   * Create a cardiology report (ECG, Echo, etc.)
   */
  static createCardiologyReport(data: {
    patientId: string;
    cardiologistId: string;
    encounterId?: string;
    studyType: 'ECG' | 'ECHO' | 'STRESS_TEST' | 'HOLTER';
    findings: string;
    interpretation: string;
    recommendations?: string;
    effectiveDateTime: string;
    status?: 'preliminary' | 'final';
    measurements?: Array<{
      parameter: string;
      value: string;
      unit?: string;
      normalRange?: string;
    }>;
  }): FHIRDiagnosticReport {
    const studyMapping = {
      ECG: { code: '11524-6', display: 'EKG study' },
      ECHO: { code: '34552-0', display: 'Echocardiography study' },
      STRESS_TEST: { code: '18752-6', display: 'Exercise stress test study' },
      HOLTER: { code: '18745-0', display: 'Cardiac monitor study' }
    };

    const study = studyMapping[data.studyType];

    let conclusion = `Findings: ${data.findings}\n\nInterpretation: ${data.interpretation}`;
    
    if (data.measurements && data.measurements.length > 0) {
      conclusion += '\n\nMeasurements:\n';
      data.measurements.forEach(measurement => {
        conclusion += `- ${measurement.parameter}: ${measurement.value}`;
        if (measurement.unit) conclusion += ` ${measurement.unit}`;
        if (measurement.normalRange) conclusion += ` (Normal: ${measurement.normalRange})`;
        conclusion += '\n';
      });
    }

    if (data.recommendations) {
      conclusion += `\n\nRecommendations: ${data.recommendations}`;
    }

    return {
      resourceType: 'DiagnosticReport',
      status: data.status || 'final',
      category: [{
        coding: [{
          system: 'http://terminology.hl7.org/CodeSystem/v2-0074',
          code: 'CAR',
          display: 'Cardiology'
        }]
      }],
      code: {
        coding: [{
          system: 'http://loinc.org',
          code: study.code,
          display: study.display
        }]
      },
      subject: {
        reference: `Patient/${data.patientId}`,
        type: 'Patient'
      },
      resultsInterpreter: [{
        reference: `Practitioner/${data.cardiologistId}`,
        type: 'Practitioner'
      }],
      effective: data.effectiveDateTime,
      issued: new Date().toISOString(),
      conclusion,
      ...(data.encounterId && {
        encounter: {
          reference: `Encounter/${data.encounterId}`,
          type: 'Encounter'
        }
      })
    };
  }

  /**
   * Get report category display
   */
  static getCategoryDisplay(report: FHIRDiagnosticReport): string {
    const category = report.category?.[0];
    return category?.coding?.[0]?.display || category?.text || 'Unknown';
  }

  /**
   * Get report code display
   */
  static getCodeDisplay(report: FHIRDiagnosticReport): string {
    return report.code.coding?.[0]?.display || report.code.text || 'Unknown Report';
  }

  /**
   * Get patient ID from report
   */
  static getPatientId(report: FHIRDiagnosticReport): string | undefined {
    return report.subject?.reference?.replace('Patient/', '');
  }

  /**
   * Get performer/interpreter from report
   */
  static getPrimaryPerformer(report: FHIRDiagnosticReport): string | undefined {
    const performer = report.performer?.[0] || report.resultsInterpreter?.[0];
    return performer?.reference?.replace(/^[^/]+\//, '');
  }

  /**
   * Check if report is critical or urgent
   */
  static isCritical(report: FHIRDiagnosticReport): boolean {
    // Check for critical keywords in conclusion
    const criticalKeywords = [
      'critical', 'urgent', 'stat', 'emergency', 'acute',
      'severe', 'abnormal', 'suspicious', 'malignant'
    ];
    
    const conclusion = report.conclusion?.toLowerCase() || '';
    return criticalKeywords.some(keyword => conclusion.includes(keyword));
  }

  /**
   * Get report effective date
   */
  static getEffectiveDate(report: FHIRDiagnosticReport): Date | null {
    if (typeof report.effective === 'string') {
      return new Date(report.effective);
    }
    if (typeof report.effective === 'object' && report.effective.start) {
      return new Date(report.effective.start);
    }
    return null;
  }

  /**
   * Format report for display
   */
  static formatForDisplay(report: FHIRDiagnosticReport): {
    reportName: string;
    category: string;
    status: string;
    effectiveDate: string;
    performer: string;
    isCritical: boolean;
    hasResults: boolean;
    hasImages: boolean;
    conclusion?: string;
  } {
    const effectiveDate = this.getEffectiveDate(report);
    
    return {
      reportName: this.getCodeDisplay(report),
      category: this.getCategoryDisplay(report),
      status: report.status,
      effectiveDate: effectiveDate ? effectiveDate.toLocaleDateString() : 'Unknown',
      performer: this.getPrimaryPerformer(report) || 'Unknown',
      isCritical: this.isCritical(report),
      hasResults: (report.result?.length || 0) > 0,
      hasImages: (report.media?.length || 0) > 0,
      conclusion: report.conclusion
    };
  }

  /**
   * Validate FHIR DiagnosticReport resource
   */
  static validateDiagnosticReport(report: FHIRDiagnosticReport): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (report.resourceType !== 'DiagnosticReport') {
      errors.push('resourceType must be "DiagnosticReport"');
    }

    if (!report.status) {
      errors.push('status is required');
    }

    if (!report.code) {
      errors.push('code is required');
    }

    if (!report.subject) {
      errors.push('subject is required');
    }

    // Validate status values
    const validStatuses = [
      'registered', 'partial', 'preliminary', 'final', 'amended', 
      'corrected', 'appended', 'cancelled', 'entered-in-error', 'unknown'
    ];
    if (report.status && !validStatuses.includes(report.status)) {
      errors.push(`status must be one of: ${validStatuses.join(', ')}`);
    }

    // Validate that final reports have results or conclusion
    if (report.status === 'final' && !report.result && !report.conclusion && !report.presentedForm) {
      errors.push('Final reports must have results, conclusion, or presented form');
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }

  /**
   * Convert HMS lab report to FHIR DiagnosticReport
   */
  static fromHMSLabReport(hmsLabReport: any): FHIRDiagnosticReport {
    return this.createLabReport({
      patientId: hmsLabReport.patientId,
      practitionerId: hmsLabReport.practitionerId || hmsLabReport.orderedBy,
      encounterId: hmsLabReport.encounterId,
      reportCode: hmsLabReport.panelCode || hmsLabReport.code || '11502-2',
      reportName: hmsLabReport.panelName || hmsLabReport.name || 'Laboratory Report',
      observations: hmsLabReport.observations || hmsLabReport.results || [],
      conclusion: hmsLabReport.interpretation || hmsLabReport.summary,
      effectiveDateTime: hmsLabReport.collectedAt || hmsLabReport.reportedAt || hmsLabReport.createdAt,
      status: hmsLabReport.status === 'completed' ? 'final' : 'preliminary',
      specimens: hmsLabReport.specimens || []
    });
  }

  /**
   * Convert HMS imaging report to FHIR DiagnosticReport
   */
  static fromHMSImagingReport(hmsImagingReport: any): FHIRDiagnosticReport {
    return this.createImagingReport({
      patientId: hmsImagingReport.patientId,
      radiologistId: hmsImagingReport.radiologistId || hmsImagingReport.interpretedBy,
      encounterId: hmsImagingReport.encounterId,
      studyType: hmsImagingReport.modalityCode || hmsImagingReport.studyType,
      studyName: hmsImagingReport.studyName || hmsImagingReport.procedureName,
      imagingStudyId: hmsImagingReport.studyId,
      findings: hmsImagingReport.findings || hmsImagingReport.description,
      impression: hmsImagingReport.impression || hmsImagingReport.conclusion,
      effectiveDateTime: hmsImagingReport.studyDate || hmsImagingReport.performedAt || hmsImagingReport.createdAt,
      status: hmsImagingReport.status === 'final' ? 'final' : 'preliminary',
      images: hmsImagingReport.images || []
    });
  }

  /**
   * Get reports by category
   */
  static getReportsByCategory(reports: FHIRDiagnosticReport[]): Record<string, FHIRDiagnosticReport[]> {
    const categorized: Record<string, FHIRDiagnosticReport[]> = {
      Laboratory: [],
      Radiology: [],
      Pathology: [],
      Cardiology: [],
      Other: []
    };

    reports.forEach(report => {
      const category = this.getCategoryDisplay(report);
      const key = Object.keys(categorized).find(k => 
        k.toLowerCase() === category.toLowerCase()
      ) || 'Other';
      
      categorized[key].push(report);
    });

    return categorized;
  }

  /**
   * Get critical reports
   */
  static getCriticalReports(reports: FHIRDiagnosticReport[]): FHIRDiagnosticReport[] {
    return reports.filter(report => this.isCritical(report));
  }

  /**
   * Get recent reports
   */
  static getRecentReports(reports: FHIRDiagnosticReport[], days = 30): FHIRDiagnosticReport[] {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);

    return reports.filter(report => {
      const effectiveDate = this.getEffectiveDate(report);
      return effectiveDate && effectiveDate >= cutoffDate;
    });
  }
}

// Common diagnostic codes and categories
export class FHIRDiagnosticCodes {
  /**
   * Laboratory panel codes
   */
  static readonly LAB_PANELS = {
    COMPREHENSIVE_METABOLIC_PANEL: '24323-8',
    BASIC_METABOLIC_PANEL: '51990-0',
    COMPLETE_BLOOD_COUNT: '58410-2',
    LIPID_PANEL: '57698-3',
    LIVER_FUNCTION_PANEL: '24325-3',
    THYROID_FUNCTION_PANEL: '24108-3',
    COAGULATION_PANEL: '34714-6',
    URINALYSIS: '24356-8'
  };

  /**
   * Imaging study codes
   */
  static readonly IMAGING_STUDIES = {
    CHEST_XRAY: '36643-5',
    CT_HEAD: '24727-0',
    CT_CHEST: '24628-0',
    CT_ABDOMEN: '24629-8',
    MRI_BRAIN: '24553-0',
    ULTRASOUND_ABDOMEN: '24982-1',
    MAMMOGRAPHY: '24604-1',
    ECHOCARDIOGRAM: '34552-0',
    EKG: '11524-6'
  };

  /**
   * Pathology report codes
   */
  static readonly PATHOLOGY_REPORTS = {
    SURGICAL_PATHOLOGY: '60567-5',
    CYTOLOGY: '47527-7',
    AUTOPSY: '18743-5',
    BONE_MARROW: '33717-0'
  };

  /**
   * Get display name for code
   */
  static getDisplayName(code: string): string {
    const allCodes = {
      ...this.LAB_PANELS,
      ...this.IMAGING_STUDIES,
      ...this.PATHOLOGY_REPORTS
    };

    const codeKey = Object.entries(allCodes).find(([_, value]) => value === code)?.[0];
    return codeKey ? codeKey.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase()) : 'Unknown';
  }
}
