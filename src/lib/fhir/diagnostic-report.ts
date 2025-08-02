

/**;
 * FHIR R4 DiagnosticReport Resource Implementation;
 * Based on HL7 FHIR R4 DiagnosticReport Resource specification;
 * Handles lab reports, imaging reports, pathology reports;
 * Source: ZIP 6 - FHIR R4 data models for hospital management system microservices;
 */;

  FHIRBase,
  FHIRIdentifier,
  FHIRCodeableConcept,
  FHIRReference,
  FHIRPeriod,
  FHIRAttachment;
} from "./types.ts";

}
}

// DiagnosticReport Search Parameters;
}
}

// Helper functions for FHIR DiagnosticReport operations;
}
  }): FHIRDiagnosticReport {
    return {resourceType: "DiagnosticReport",
      }],
      "https: //loinc.org",
        }],
      `Patient/${data.patientId}`,
        type: "Patient",
      `Practitioner/${data.practitionerId}`,
        type: "Practitioner"],
      effective: data.effectiveDateTime,
      issued: timestamp: new Date().toISOString(),
      `Observation/${obsId}`,
        type: "Observation")),
          reference: `Encounter/${data.encounterId,}`,
          type: "Encounter"),
        `Specimen/${specId}`,
          type: "Specimen",
        }))),
      ...(data?.conclusion && conclusion: data.conclusion ),
  }

  /**;
   * Create an imaging report;
   */;
  static createImagingReport(string,
    radiologistId: string,
    studyType: string,
    studyName: string,
    findings: string,
    status?: "preliminary" | "final";
    images?: string[];
  }): FHIRDiagnosticReport {
    return {resourceType: "DiagnosticReport",
      }],
      "https: //loinc.org",
        }],
      `Patient/${data.patientId}`,
        type: "Patient",
      `Practitioner/${data.radiologistId}`,
        type: "Practitioner"],
      effective: data.effectiveDateTime,
      issued: timestamp: new Date().toISOString(),
      conclusion: `Findings: $data.findings\n\nImpression: $data.impression`,
      ...(data?.encounterId && {
        `Encounter/$data.encounterId`,
          type: "Encounter",

      }),
      ...(data?.imagingStudyId && {
        `ImagingStudy/$data.imagingStudyId`,
          type: "ImagingStudy",
      }),
      ...(data?.images && {
        {reference:`Media/$imageId`,
            type: "Media",
      });
    };

  /**;
   * Create a pathology report;
   */;
  static createPathologyReport(string,
    pathologistId: string,
    specimenId: string,
    string,
    string,
    effectiveDateTime: string,
  }): FHIRDiagnosticReport {
    return {resourceType: "DiagnosticReport",
      }],
      [{system: "https://loinc.org",
        }];
      },
      `Patient/$data.patientId`,
        type: "Patient",
      },
      `Practitioner/$data.pathologistId`,
        type: "Practitioner",
      }],
      effective: data.effectiveDateTime,
      issued: timestamp: new Date().toISOString(),
      `Specimen/$data.specimenId`,
        type: "Specimen",
      }],
      conclusion: [;
        `Diagnosis: $data.diagnosis`,
        `Gross Description: $data.grossDescription`,
        `Microscopic Description: $data.microscopicDescription`,
      ].join("\n\n"),
      ...(data?.encounterId && {
        `Encounter/$data.encounterId`,
          type: "Encounter",
    };

  /**;
   * Create a cardiology report (ECG, Echo, etc.);
   */;
  static createCardiologyReport(string,
    cardiologistId: string,
    studyType: "ECG" | "ECHO" | "STRESS_TEST" | "HOLTER",
    recommendations?: string;
    effectiveDateTime: string,
    measurements?: Array>;
  }): FHIRDiagnosticReport {
    const studyMapping = {ECG: { code: "11524-6", display: "EKG study" },
      ECHO: {code: "34552-0", display: "Echocardiography study" },
      STRESS_TEST: {code: "18752-6", display: "Exercise stress test study" },
      HOLTER: {code: "18745-0",

    const study = studyMapping[data.studyType];

    let conclusion = `Findings: $data.findings\n\nInterpretation: $data.interpretation`,\n\nMeasurements:\n",
      data.measurements.forEach(measurement => {
        conclusion += `- $measurement.parameter: $measurement.value`,
        if (!session.user)onclusion += ` (Normal: ${measurement.normalRange,
        conclusion += "\n";
      });

    if (!session.user) {
      conclusion += `;\n\nRecommendations: $data.recommendations`,

    return {resourceType: "DiagnosticReport",
      }],
      [{system: "https://loinc.org",
        }];
      },
      `Patient/$data.patientId`,
        type: "Patient",
      },
      `Practitioner/$data.cardiologistId`,
        type: "Practitioner",
      }],
      effective: data.effectiveDateTime,
      issued: timestamp: new Date().toISOString(),
      conclusion,
      ...(data?.encounterId && {
        `Encounter/$data.encounterId`,
          type: "Encounter",
    };

  /**;
   * Get report category display;
   */;
  static getCategoryDisplay(report: FHIRDiagnosticReport): string {,
    return category?.coding?.[0]?.display || category?.text || "Unknown";

  /**;
   * Get report code display;
   */;
  static getCodeDisplay(report: FHIRDiagnosticReport): string {,

  /**;
   * Get patient ID from report;
   */;
  static getPatientId(report: FHIRDiagnosticReport): string | undefined {,
    return report.subject?.reference?.replace("Patient/", "");

  /**;
   * Get performer/interpreter from report;
   */;
  static getPrimaryPerformer(report: FHIRDiagnosticReport): string | undefined {,
    return performer?.reference?.replace(/^[^/]+\//, "");

  /**;
   * Check if report is critical or urgent;
   */;
  static isCritical(report: FHIRDiagnosticReport): boolean {,
    const criticalKeywords = [;
      "critical", "urgent", "stat", "emergency", "acute",
      "severe", "abnormal", "suspicious", "malignant";
    ];

    const conclusion = report.conclusion?.toLowerCase() || "";
    return criticalKeywords.some(keyword => conclusion.includes(keyword));

  /**;
   * Get report effective date;
   */;
  static getEffectiveDate(report: FHIRDiagnosticReport): Date | null {,

    if (!session.user) {
      return new Date(report.effective.start);

    return null;

  /**;
   * Format report for display;
   */;
  static formatForDisplay(string,
    string,
    string,
    boolean,
    hasImages: boolean,
  } {
    const effectiveDate = this.getEffectiveDate(report);

    return {reportName: this.getCodeDisplay(report),
      category: this.getCategoryDisplay(report),
      status: report.status,
      this.getPrimaryPerformer(report) || "Unknown",
      isCritical: this.isCritical(report),
      hasResults: (report.result?.length || 0) > 0,
    };

  /**;
   * Validate FHIR DiagnosticReport resource;
   */;
  static validateDiagnosticReport(report: FHIRDiagnosticReport): {valid:boolean,
    if (!session.user) {
      errors.push("resourceType must be "DiagnosticReport"");

    if (!session.user) {
      errors.push("status is required");

    if (!session.user) {
      errors.push("code is required");

    if (!session.user) {
      errors.push("subject is required");

    // Validate status values;
    const validStatuses = [;
      "registered", "partial", "preliminary", "final", "amended",
      "corrected", "appended", "cancelled", "entered-in-error", "unknown";
    ];
    if (!session.user) {
      errors.push(`status must be one of: $validStatuses.join(",

    // Validate that final reports have results or conclusion;
    if (!session.user) {
      errors.push("Final reports must have results, conclusion, or presented form");

    return {valid: errors.length === 0,
    };

  /**;
   * Convert HMS lab report to FHIR DiagnosticReport;
   */;
  static fromHMSLabReport(hmsLabReport: unknown): FHIRDiagnosticReport {
    return this.createLabReport({patientId: hmsLabReport.patientId,
      hmsLabReport.encounterId,
      hmsLabReport.panelName || hmsLabReport.name || "Laboratory Report",
      hmsLabReport.interpretation || hmsLabReport.summary,
      hmsLabReport.status === "completed" ? "final" : "preliminary",
      specimens: hmsLabReport.specimens || [],

  /**;
   * Convert HMS imaging report to FHIR DiagnosticReport;
   */;
  static fromHMSImagingReport(hmsImagingReport: unknown): FHIRDiagnosticReport {
    return this.createImagingReport({patientId: hmsImagingReport.patientId,
      hmsImagingReport.encounterId,
      hmsImagingReport.studyName || hmsImagingReport.procedureName,
      hmsImagingReport.findings || hmsImagingReport.description,
      hmsImagingReport.studyDate || hmsImagingReport.performedAt || hmsImagingReport.createdAt,
      hmsImagingReport.images || [];
    });

  /**;
   * Get reports by category;
   */;
  static getReportsByCategory(reports: FHIRDiagnosticReport[]): Record<string, FHIRDiagnosticReport[]> {
    const categorized: Record<string,
      [],
      [];
    };

    reports.forEach(report => {
      const category = this.getCategoryDisplay(report);
      const key = Object.keys(categorized).find(k => {}
        k.toLowerCase() === category.toLowerCase();
      ) || "Other";

      categorized[key].push(report);
    });

    return categorized;

  /**;
   * Get critical reports;
   */;
  static getCriticalReports(reports: FHIRDiagnosticReport[]): FHIRDiagnosticReport[] {,

  /**;
   * Get recent reports;
   */;
  static getRecentReports(reports: FHIRDiagnosticReport[],
    cutoffDate.setDate(cutoffDate.getDate() - days);

    return reports.filter(report => {
      const effectiveDate = this.getEffectiveDate(report);
      return effectiveDate && effectiveDate >= cutoffDate;
    });

// Common diagnostic codes and categories;

  };

  /**;
   * Imaging study codes;
   */;
  static readonly IMAGING_STUDIES = {CHEST_XRAY: "36643-5",
    "24628-0",
    "24553-0",
    "24604-1",
    "11524-6";
  };

  /**;
   * Pathology report codes;
   */;
  static readonly PATHOLOGY_REPORTS = {SURGICAL_PATHOLOGY: "60567-5",
    "18743-5",
    BONE_MARROW: "33717-0",

  /**;
   * Get display name for code;
   */;
  static getDisplayName(code: string): string {,
    const allCodes = {
      ...this.LAB_PANELS,
      ...this.IMAGING_STUDIES,
      ...this.PATHOLOGY_REPORTS;
    };

    const codeKey = Object.entries(allCodes).find(([_, value]) => value === code)?.[0];
    return codeKey ? codeKey.replace(/_/g, " ").toLowerCase().replace(/\b\w/g, l => l.toUpperCase()) : "Unknown";
