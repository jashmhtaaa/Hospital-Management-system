var __DEV__: boolean;
  interface Window {
    [key: string]: any
  }
  namespace NodeJS {
    interface Global {
      [key: string]: any
    }
  }
}

/**
 * Radiology Information System (RIS) Service;
 * Complete imaging workflow with PACS integration, structured reporting, and DICOM support;
 */

import { z } from 'zod';

// Radiology Schemas;
export const ImagingStudySchema = z.object({
  patient_id: z.string().min(1, 'Patient ID is required'),
  ordering_provider_id: z.string().min(1, 'Ordering provider is required'),
  study_type: z.enum(['x_ray', 'ct_scan', 'mri', 'ultrasound', 'mammography', 'nuclear_medicine', 'pet_scan', 'fluoroscopy']),
  exam_code: z.string().min(1, 'Exam code is required'),
  body_part: z.string().min(1, 'Body part is required'),
  clinical_indication: z.string().min(1, 'Clinical indication is required'),
  urgency: z.enum(['routine', 'urgent', 'stat', 'add_on']).default('routine'),
  contrast_used: z.boolean().default(false),
  contrast_type: z.string().optional(),
  contrast_volume: z.number().optional(),
  pregnancy_status: z.enum(['not_pregnant', 'pregnant', 'unknown', 'n_a']).default('unknown'),
  last_menstrual_period: z.string().optional(),
  allergies: z.array(z.string()).default([]),
  previous_reactions: z.array(z.string()).default([]),
  special_instructions: z.string().optional(),
  scheduled_date: z.string().refine((date) => !isNaN(Date.parse(date)), 'Invalid scheduled date'),
  scheduled_time: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format'),
  estimated_duration: z.number().min(5).max(240), // 5 minutes to 4 hours;
  room_preference: z.string().optional(),
  equipment_preference: z.string().optional(),
  radiologist_preference: z.string().optional(),
  transport_required: z.boolean().default(false),
  isolation_required: z.boolean().default(false),
  interpreter_needed: z.boolean().default(false),
  language: z.string().optional(),
});

export const ImagingReportSchema = z.object({
  study_id: z.string().min(1, 'Study ID is required'),
  radiologist_id: z.string().min(1, 'Radiologist ID is required'),
  report_type: z.enum(['preliminary', 'final', 'addendum', 'corrected']).default('preliminary'),
  clinical_history: z.string(),
  technique: z.string(),
  findings: z.string().min(1, 'Findings are required'),
  impression: z.string().min(1, 'Impression is required'),
  recommendations: z.string().optional(),
  comparison_studies: z.array(z.string()).default([]),
  critical_result: z.boolean().default(false),
  critical_result_communicated: z.boolean().default(false),
  critical_result_communication_time: z.string().optional(),
  critical_result_communicated_to: z.string().optional(),
  birads_score: z.enum(['0', '1', '2', '3', '4', '4A', '4B', '4C', '5', '6']).optional(), // For mammography;
  followup_required: z.boolean().default(false),
  followup_timeframe: z.string().optional(),
  dictation_time: z.string().optional(),
  transcription_time: z.string().optional(),
  voice_recognition_confidence: z.number().min(0).max(1).optional(),
  structured_data: z.record(z.any()).optional(),
  template_id: z.string().optional(),
});

export const DicomSeriesSchema = z.object({
  study_id: z.string().min(1, 'Study ID is required'),
  series_number: z.number().min(1),
  series_description: z.string(),
  modality: z.string(),
  body_part_examined: z.string(),
  view_position: z.string().optional(),
  image_count: z.number().min(1),
  series_date: z.string(),
  series_time: z.string(),
  protocol_name: z.string().optional(),
  slice_thickness: z.number().optional(),
  pixel_spacing: z.string().optional(),
  image_orientation: z.string().optional(),
  contrast_agent: z.string().optional(),
  radiation_dose: z.number().optional(),
  kvp: z.number().optional(), // X-ray tube voltage;
  mas: z.number().optional(), // Milliampere-seconds;
  exposure_time: z.number().optional(),
  manufacturer: z.string().optional(),
  model: z.string().optional(),
  software_version: z.string().optional(),
  pacs_location: z.string().optional(),
  archived: z.boolean().default(false),
  archive_location: z.string().optional(),
});

export const QualityAssuranceSchema = z.object({
  study_id: z.string().min(1, 'Study ID is required'),
  technologist_id: z.string().min(1, 'Technologist ID is required'),
  image_quality: z.enum(['excellent', 'good', 'acceptable', 'poor', 'non_diagnostic']),
  positioning: z.enum(['excellent', 'good', 'acceptable', 'poor']),
  exposure_factors: z.enum(['optimal', 'acceptable', 'suboptimal']),
  artifacts_present: z.boolean().default(false),
  artifact_types: z.array(z.string()).default([]),
  motion_artifact: z.boolean().default(false),
  contrast_adequacy: z.enum(['excellent', 'good', 'adequate', 'poor', 'n_a']).default('n_a'),
  repeat_required: z.boolean().default(false),
  repeat_reason: z.string().optional(),
  additional_views_needed: z.boolean().default(false),
  additional_views_reason: z.string().optional(),
  patient_preparation_adequate: z.boolean().default(true),
  equipment_functioning: z.boolean().default(true),
  equipment_issues: z.string().optional(),
  comments: z.string().optional(),
  review_date: z.string(),
  reviewed_by: z.string(),
});

export type ImagingStudy = z.infer<typeof ImagingStudySchema> & {
  id: string,
  accession_number: string;
  study_instance_uid: string,
  status: 'scheduled' | 'arrived' | 'in_progress' | 'completed' | 'cancelled' | 'no_show';
  arrival_time?: Date;
  start_time?: Date;
  completion_time?: Date;
  performing_technologist?: string;
  reading_radiologist?: string;
  room_assigned?: string;
  equipment_used?: string;
  total_images?: number;
  study_size_mb?: number;
  radiation_dose_total?: number;
  created_at: Date,
  updated_at: Date;
  patient_name?: string;
  patient_age?: number;
  patient_gender?: string;
  ordering_provider_name?: string;
};

export type ImagingReport = z.infer<typeof ImagingReportSchema> & {
  id: string,
  report_number: string;
  status: 'draft' | 'preliminary' | 'final' | 'amended';
  dictated_at?: Date;
  transcribed_at?: Date;
  signed_at?: Date;
  signed_by?: string;
  amended_at?: Date;
  amended_by?: string;
  amendment_reason?: string;
  read_time_minutes?: number;
  created_at: Date,
  updated_at: Date;
  radiologist_name?: string;
};

export type DicomSeries = z.infer<typeof DicomSeriesSchema> & {
  id: string,
  series_instance_uid: string;
  created_at: Date,
  updated_at: Date;
  transfer_syntax: string;
  compression_type?: string;
  file_size_mb: number,
  verification_status: 'pending' | 'verified' | 'failed';
  last_accessed?: Date;
  access_count: number
};

export type QualityAssurance = z.infer<typeof QualityAssuranceSchema> & {
  id: string,
  overall_score: number; // 1-100;
  created_at: Date,
  updated_at: Date
};

export interface RadiologyWorklistItem {
  study: ImagingStudy,
  priority_score: number;
  estimated_read_time: number,
  complexity_level: 'low' | 'medium' | 'high';
  subspecialty_required?: string;
  prior_studies_count: number,
  critical_finding_likelihood: number
}

export interface RadiologyMetrics {
  daily_volume: number,
  average_read_time: number;
  turnaround_time_stat: number; // minutes;
  turnaround_time_routine: number; // minutes;
  critical_results_percentage: number,
  repeat_rate: number;
  no_show_rate: number,
  equipment_utilization: number;
  radiologist_productivity: {
    radiologist_id: string,
    studies_read: number;
    average_read_time: number,
    critical_results: number;
    amendments: number
  }[];
  modality_distribution: {
    modality: string,
    count: number;
    percentage: number
  }[];
}

export interface PACSIntegration {
  study_id: string,
  pacs_server: string;
  transfer_status: 'pending' | 'in_progress' | 'completed' | 'failed';
  transfer_start_time?: Date;
  transfer_completion_time?: Date;
  error_message?: string;
  retry_count: number,
  file_count: number;
  total_size_mb: number;
  verification_hash?: string;
}

export class RadiologyInformationSystemService {
  private imagingStudies: Map<string, ImagingStudy> = new Map();
  private imagingReports: Map<string, ImagingReport> = new Map();
  private dicomSeries: Map<string, DicomSeries[]> = new Map();
  private qualityAssurance: Map<string, QualityAssurance> = new Map();
  private pacsIntegrations: Map<string, PACSIntegration> = new Map();
  private reportTemplates: Map<string, any> = new Map();
  private equipmentSchedule: Map<string, any[]> = new Map(),
  constructor() {
    this.initializeReportTemplates();
    this.initializeEquipmentSchedule();
  }

  /**
   * Initialize report templates;
   */
  private initializeReportTemplates(): void {
    const templates = [
      {
        id: 'chest-xray',
        name: 'Chest X-Ray Report',
        modality: 'x_ray',
        body_part: 'chest',
        template: {
          technique: 'PA and lateral chest radiographs were obtained.',
          findings_sections: [
            'Lungs and pleura',
            'Heart and mediastinum',
            'Bones and soft tissues';
          ],
          impression_guidelines: 'Provide clear, concise impression with actionable recommendations.',
        },
      },
      {
        id: 'ct-head',
        name: 'CT Head Report',
        modality: 'ct_scan',
        body_part: 'head',
        template: {
          technique: 'Axial CT images of the head were obtained without intravenous contrast.',
          findings_sections: [
            'Brain parenchyma',
            'Ventricular system',
            'Extra-axial spaces',
            'Skull and scalp';
          ],
          impression_guidelines: 'Comment on acute findings, mass effect, and need for follow-up.',
        },
      },
      {
        id: 'mri-brain',
        name: 'MRI Brain Report',
        modality: 'mri',
        body_part: 'brain',
        template: {
          technique: 'Multiplanar, multisequence MRI of the brain was performed.',
          findings_sections: [
            'Brain parenchyma',
            'White matter',
            'Ventricular system',
            'Posterior fossa',
            'Extra-axial spaces';
          ],
          impression_guidelines: 'Correlate with clinical presentation and prior imaging.',
        },
      },
    ];

    templates.forEach(template => {
      this.reportTemplates.set(template.id, template);
    });
  }

  /**
   * Initialize equipment schedule;
   */
  private initializeEquipmentSchedule(): void {
    const equipment = ['CT-1', 'CT-2', 'MRI-1', 'MRI-2', 'XRAY-1', 'XRAY-2', 'MAMMO-1', 'US-1', 'US-2'];
    equipment.forEach(equipmentId => {
      this.equipmentSchedule.set(equipmentId, []);
    });
  }

  /**
   * Schedule imaging study;
   */
  async scheduleImagingStudy(studyData: z.infer<typeof ImagingStudySchema>): Promise<ImagingStudy> {
    const validatedData = ImagingStudySchema.parse(studyData);
    
    const studyId = uuidv4();
    const accessionNumber = this.generateAccessionNumber();
    const studyInstanceUID = this.generateStudyInstanceUID();

    const study: ImagingStudy = {
      ...validatedData,
      id: studyId,
      accession_number: accessionNumber,
      study_instance_uid: studyInstanceUID,
      status: 'scheduled',
      created_at: new Date(),
      updated_at: new Date(),
    };

    this.imagingStudies.set(studyId, study);
    
    // Schedule equipment if possible;
    await this.scheduleEquipment(study);
    
    return study;
  }

  /**
   * Generate accession number;
   */
  private generateAccessionNumber(): string {
    const timestamp = Date.now().toString().slice(-8);
    const random = Math.floor(Math.random() * 100).toString().padStart(2, '0');
    return `${timestamp}${random}`;
  }

  /**
   * Generate study instance UID;
   */
  private generateStudyInstanceUID(): string {
    // Simplified UID generation - in real implementation, use proper DICOM UID;
    return `1.2.840.113619.2.1.${Date.now()}.${Math.floor(Math.random() * 1000000)}`;
  }

  /**
   * Schedule equipment for study;
   */
  private async scheduleEquipment(study: ImagingStudy): Promise<void> {
    // Find available equipment based on study type;
    const equipmentCandidates = this.getEquipmentCandidates(study.study_type);
    
    for (const equipmentId of equipmentCandidates) {
      const schedule = this.equipmentSchedule.get(equipmentId) || [];
      const scheduledDateTime = new Date(`${study.scheduled_date} ${study.scheduled_time}`);
      
      // Check if equipment is available;
      const isAvailable = !schedule.some(appointment => {
        const appointmentStart = new Date(appointment.start_time);
        const appointmentEnd = new Date(appointment.end_time);
        const studyEnd = new Date(scheduledDateTime.getTime() + study.estimated_duration * 60000);
        
        return (scheduledDateTime >= appointmentStart && scheduledDateTime < appointmentEnd) ||;
               (studyEnd > appointmentStart && studyEnd <= appointmentEnd);
      });
      
      if (isAvailable) {
        // Schedule the equipment;
        schedule.push({
          study_id: study.id,
          start_time: scheduledDateTime.toISOString(),
          end_time: new Date(scheduledDateTime.getTime() + study.estimated_duration * 60000).toISOString(),
          study_type: study.study_type,
          patient_id: study.patient_id,
        });
        
        this.equipmentSchedule.set(equipmentId, schedule);
        
        // Update study with assigned equipment;
        study.equipment_used = equipmentId;
        this.imagingStudies.set(study.id, study);
        break;
      }
    }
  }

  /**
   * Get equipment candidates for study type;
   */
  private getEquipmentCandidates(studyType: ImagingStudy['study_type']): string[] {
    const equipmentMap: Record<string, string[]> = {
      'x_ray': ['XRAY-1', 'XRAY-2'],
      'ct_scan': ['CT-1', 'CT-2'],
      'mri': ['MRI-1', 'MRI-2'],
      'ultrasound': ['US-1', 'US-2'],
      'mammography': ['MAMMO-1'],
      'nuclear_medicine': ['NM-1'],
      'pet_scan': ['PET-1'],
      'fluoroscopy': ['FLUORO-1'],
    };
    
    return equipmentMap[studyType] || [];
  }

  /**
   * Patient arrival for study;
   */
  async patientArrival(studyId: string): Promise<ImagingStudy> {
    const study = this.imagingStudies.get(studyId);
    if (!study) {
      throw new Error('Study not found');
    }

    if (study.status !== 'scheduled') {
      throw new Error('Study is not in scheduled status');
    }

    study.status = 'arrived';
    study.arrival_time = new Date();
    study.updated_at = new Date();

    this.imagingStudies.set(studyId, study);
    return study;
  }

  /**
   * Start imaging study;
   */
  async startImagingStudy(studyId: string, technologistId: string): Promise<ImagingStudy> {
    const study = this.imagingStudies.get(studyId);
    if (!study) {
      throw new Error('Study not found');
    }

    if (study.status !== 'arrived') {
      throw new Error('Patient must be arrived before starting study');
    }

    study.status = 'in_progress';
    study.start_time = new Date();
    study.performing_technologist = technologistId;
    study.updated_at = new Date();

    this.imagingStudies.set(studyId, study);
    return study;
  }

  /**
   * Complete imaging study;
   */
  async completeImagingStudy(
    studyId: string,
    completionData: {
      total_images: number,
      study_size_mb: number;
      radiation_dose_total?: number;
      notes?: string;
    }
  ): Promise<ImagingStudy> {
    const study = this.imagingStudies.get(studyId);
    if (!study) {
      throw new Error('Study not found');
    }

    if (study.status !== 'in_progress') {
      throw new Error('Study must be in progress to complete');
    }

    study.status = 'completed';
    study.completion_time = new Date();
    study.total_images = completionData.total_images;
    study.study_size_mb = completionData.study_size_mb;
    study.radiation_dose_total = completionData.radiation_dose_total;
    study.updated_at = new Date();

    this.imagingStudies.set(studyId, study);

    // Initiate PACS transfer;
    await this.initiatePACSTransfer(studyId);

    return study;
  }

  /**
   * Initiate PACS transfer;
   */
  private async initiatePACSTransfer(studyId: string): Promise<void> {
    const study = this.imagingStudies.get(studyId);
    if (!study) return;

    const pacsIntegration: PACSIntegration = {
      study_id: studyId,
      pacs_server: 'PACS-MAIN',
      transfer_status: 'pending',
      retry_count: 0,
      file_count: study.total_images || 0,
      total_size_mb: study.study_size_mb || 0,
    };

    this.pacsIntegrations.set(studyId, pacsIntegration);

    // Simulate PACS transfer (in real implementation, this would be actual DICOM transfer)
    setTimeout(async () => {
      await this.completePACSTransfer(studyId);
    }, 5000);
  }

  /**
   * Complete PACS transfer;
   */
  private async completePACSTransfer(studyId: string): Promise<void> {
    const pacsIntegration = this.pacsIntegrations.get(studyId);
    if (!pacsIntegration) return;

    pacsIntegration.transfer_status = 'completed';
    pacsIntegration.transfer_completion_time = new Date();
    pacsIntegration.verification_hash = this.generateVerificationHash();

    this.pacsIntegrations.set(studyId, pacsIntegration);
  }

  /**
   * Generate verification hash;
   */
  private generateVerificationHash(): string {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  }

  /**
   * Create imaging report;
   */
  async createImagingReport(reportData: z.infer<typeof ImagingReportSchema>): Promise<ImagingReport> {
    const validatedData = ImagingReportSchema.parse(reportData);
    
    const study = this.imagingStudies.get(validatedData.study_id);
    if (!study) {
      throw new Error('Study not found');
    }

    const reportId = uuidv4();
    const reportNumber = this.generateReportNumber();

    const report: ImagingReport = {
      ...validatedData,
      id: reportId,
      report_number: reportNumber,
      status: 'draft',
      created_at: new Date(),
      updated_at: new Date(),
    };

    this.imagingReports.set(reportId, report);

    // Update study with reading radiologist;
    study.reading_radiologist = validatedData.radiologist_id;
    study.updated_at = new Date();
    this.imagingStudies.set(study.id, study);

    return report;
  }

  /**
   * Generate report number;
   */
  private generateReportNumber(): string {
    const timestamp = Date.now().toString().slice(-6);
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `RPT${timestamp}${random}`;
  }

  /**
   * Sign imaging report;
   */
  async signImagingReport(reportId: string, radiologistId: string): Promise<ImagingReport> {
    const report = this.imagingReports.get(reportId);
    if (!report) {
      throw new Error('Report not found');
    }

    if (report.status === 'final') {
      throw new Error('Report is already signed');
    }

    const now = new Date();
    report.status = 'final';
    report.signed_at = now;
    report.signed_by = radiologistId;
    report.updated_at = now;

    // Calculate read time;
    if (report.dictated_at) {
      report.read_time_minutes = Math.round((now.getTime() - report.dictated_at.getTime()) / (1000 * 60));
    }

    this.imagingReports.set(reportId, report);

    // Handle critical results;
    if (report.critical_result && !report.critical_result_communicated) {
      await this.handleCriticalResult(report);
    }

    return report;
  }

  /**
   * Handle critical result communication;
   */
  private async handleCriticalResult(report: ImagingReport): Promise<void> {
    // In real implementation, this would trigger alerts and notifications;

      report_id: report.id,
      study_id: report.study_id,
      radiologist: report.radiologist_id,
      findings: report.findings,
      impression: report.impression,
    });

    // Mark as communicated (simplified)
    report.critical_result_communicated = true;
    report.critical_result_communication_time = new Date().toISOString();
    report.critical_result_communicated_to = 'Ordering Provider'; // Simplified;
    this.imagingReports.set(report.id, report);
  }

  /**
   * Add DICOM series;
   */
  async addDicomSeries(seriesData: z.infer<typeof DicomSeriesSchema>): Promise<DicomSeries> {
    const validatedData = DicomSeriesSchema.parse(seriesData);
    
    const seriesId = uuidv4();
    const seriesInstanceUID = this.generateSeriesInstanceUID();

    const series: DicomSeries = {
      ...validatedData,
      id: seriesId,
      series_instance_uid: seriesInstanceUID,
      created_at: new Date(),
      updated_at: new Date(),
      transfer_syntax: '1.2.840.10008.1.2.1', // Explicit VR Little Endian;
      file_size_mb: validatedData.image_count * 0.5, // Estimate 0.5MB per image;
      verification_status: 'pending',
      access_count: 0,
    };

    // Add to study's series list;
    const studySeries = this.dicomSeries.get(validatedData.study_id) || [];
    studySeries.push(series);
    this.dicomSeries.set(validatedData.study_id, studySeries);

    return series;
  }

  /**
   * Generate series instance UID;
   */
  private generateSeriesInstanceUID(): string {
    return `1.2.840.113619.2.1.${Date.now()}.${Math.floor(Math.random() * 1000000)}.1`;
  }

  /**
   * Perform quality assurance;
   */
  async performQualityAssurance(qaData: z.infer<typeof QualityAssuranceSchema>): Promise<QualityAssurance> {
    const validatedData = QualityAssuranceSchema.parse(qaData);
    
    const qaId = uuidv4();
    
    // Calculate overall score;
    const scores = {
      excellent: 100,
      good: 85,
      acceptable: 70,
      poor: 50,
      non_diagnostic: 0,
      optimal: 100,
      suboptimal: 60,
    };
    
    const imageQualityScore = scores[validatedData.image_quality as keyof typeof scores] || 0;
    const positioningScore = scores[validatedData.positioning as keyof typeof scores] || 0;
    const exposureScore = scores[validatedData.exposure_factors as keyof typeof scores] || 0;
    
    let overallScore = (imageQualityScore + positioningScore + exposureScore) / 3;
    
    // Apply penalties;
    if (validatedData.artifacts_present) overallScore -= 10;
    if (validatedData.motion_artifact) overallScore -= 15;
    if (validatedData.repeat_required) overallScore -= 20;
    if (!validatedData.patient_preparation_adequate) overallScore -= 10;
    if (!validatedData.equipment_functioning) overallScore -= 25;
    
    overallScore = Math.max(0, Math.min(100, overallScore));

    const qa: QualityAssurance = {
      ...validatedData,
      id: qaId,
      overall_score: Math.round(overallScore),
      created_at: new Date(),
      updated_at: new Date(),
    };

    this.qualityAssurance.set(qaId, qa);
    return qa;
  }

  /**
   * Get radiology worklist;
   */
  async getRadiologyWorklist(
    radiologistId?: string,
    subspecialty?: string,
    urgency?: ImagingStudy['urgency']
  ): Promise<RadiologyWorklistItem[]> {
    const completedStudies = Array.from(this.imagingStudies.values());
      .filter(study => study.status === 'completed');

    // Filter out studies that already have final reports;
    const studiesNeedingReads = completedStudies.filter(study => {
      const reports = Array.from(this.imagingReports.values());
        .filter(report => report.study_id === study.id);
      return !reports.some(report => report.status === 'final');
    });

    const worklistItems: RadiologyWorklistItem[] = studiesNeedingReads.map(study => {
      // Calculate priority score;
      let priorityScore = 50; // Base score;
      
      switch (study.urgency) {
        case 'stat': priorityScore += 50; break;
        case 'urgent': priorityScore += 30; break;
        case 'add_on': priorityScore += 20; break;
        case 'routine': break;
      }
      
      // Add time-based priority;
      const hoursWaiting = (new Date().getTime() - (study.completion_time?.getTime() || 0)) / (1000 * 60 * 60);
      priorityScore += Math.min(hoursWaiting * 2, 30);

      // Estimate read time based on study type;
      const readTimes: Record<string, number> = {
        'x_ray': 5,
        'ct_scan': 15,
        'mri': 25,
        'ultrasound': 10,
        'mammography': 8,
        'nuclear_medicine': 20,
        'pet_scan': 30,
        'fluoroscopy': 12,
      };
      
      const estimatedReadTime = readTimes[study.study_type] || 15;
      
      // Determine complexity;
      let complexityLevel: 'low' | 'medium' | 'high' = 'medium';
      if (study.study_type === 'x_ray' || study.study_type === 'ultrasound') {
        complexityLevel = 'low';
      } else if (study.study_type === 'mri' || study.study_type === 'pet_scan') {
        complexityLevel = 'high';
      }

      return {
        study,
        priority_score: priorityScore,
        estimated_read_time: estimatedReadTime,
        complexity_level: complexityLevel,
        prior_studies_count: 0, // Simplified;
        critical_finding_likelihood: Math.random() * 20, // Simplified percentage;
      };
    });

    // Sort by priority score (highest first)
    worklistItems.sort((a, b) => b.priority_score - a.priority_score);

    // Apply filters;
    let filteredItems = worklistItems;
    
    if (urgency) {
      filteredItems = filteredItems.filter(item => item.study.urgency === urgency);
    }
    
    if (subspecialty) {
      filteredItems = filteredItems.filter(item => item.subspecialty_required === subspecialty);
    }

    return filteredItems;
  }

  /**
   * Get radiology metrics;
   */
  async getRadiologyMetrics(dateFrom?: string, dateTo?: string): Promise<RadiologyMetrics> {
    const studies = Array.from(this.imagingStudies.values());
    const reports = Array.from(this.imagingReports.values());
    
    let filteredStudies = studies;
    let filteredReports = reports;
    
    if (dateFrom) {
      const fromDate = new Date(dateFrom);
      filteredStudies = filteredStudies.filter(study => study.created_at >= fromDate);
      filteredReports = filteredReports.filter(report => report.created_at >= fromDate);
    }
    
    if (dateTo) {
      const toDate = new Date(dateTo);
      filteredStudies = filteredStudies.filter(study => study.created_at <= toDate);
      filteredReports = filteredReports.filter(report => report.created_at <= toDate);
    }

    const dailyVolume = filteredStudies.length;
    
    // Calculate average read time;
    const reportsWithReadTime = filteredReports.filter(report => report.read_time_minutes);
    const averageReadTime = reportsWithReadTime.length > 0 ?;
      reportsWithReadTime.reduce((sum, report) => sum + (report.read_time_minutes ||
        0), 0) / reportsWithReadTime.length : 0;

    // Calculate turnaround times;
    const statStudies = filteredStudies.filter(study => study.urgency === 'stat' && study.completion_time);
    const routineStudies = filteredStudies.filter(study => study.urgency === 'routine' && study.completion_time);
    
    const turnaroundTimeStat = statStudies.length > 0 ?;
      statStudies.reduce((sum, study) => {
        if (study.completion_time && study.start_time) {
          return sum + (study.completion_time.getTime() - study.start_time.getTime()) / (1000 * 60);
        }
        return sum;
      }, 0) / statStudies.length : 0;

    const turnaroundTimeRoutine = routineStudies.length > 0 ?;
      routineStudies.reduce((sum, study) => {
        if (study.completion_time && study.start_time) {
          return sum + (study.completion_time.getTime() - study.start_time.getTime()) / (1000 * 60);
        }
        return sum;
      }, 0) / routineStudies.length : 0;

    // Calculate other metrics;
    const criticalReports = filteredReports.filter(report => report.critical_result);
    const criticalResultsPercentage = filteredReports.length > 0 ?;
      (criticalReports.length / filteredReports.length) * 100 : 0;

    const noShowStudies = filteredStudies.filter(study => study.status === 'no_show');
    const noShowRate = filteredStudies.length > 0 ?;
      (noShowStudies.length / filteredStudies.length) * 100 : 0;

    // Calculate repeat rate from QA data;
    const qaRecords = Array.from(this.qualityAssurance.values());
    const repeatsRequired = qaRecords.filter(qa => qa.repeat_required);
    const repeatRate = qaRecords.length > 0 ?;
      (repeatsRequired.length / qaRecords.length) * 100 : 0;

    // Equipment utilization (simplified)
    const equipmentUtilization = 75; // Simplified calculation;

    // Radiologist productivity;
    const radiologistStats = new Map<string, any>();
    filteredReports.forEach(report => {
      if (!report.radiologist_id) return;
      
      const current = radiologistStats.get(report.radiologist_id) || {
        radiologist_id: report.radiologist_id,
        studies_read: 0,
        total_read_time: 0,
        critical_results: 0,
        amendments: 0,
      };
      
      current.studies_read++;
      current.total_read_time += report.read_time_minutes || 0;
      if (report.critical_result) current.critical_results++;
      if (report.status === 'amended') current.amendments++;
      
      radiologistStats.set(report.radiologist_id, current);
    });

    const radiologistProductivity = Array.from(radiologistStats.values()).map(stats => ({
      radiologist_id: stats.radiologist_id,
      studies_read: stats.studies_read,
      average_read_time: stats.studies_read > 0 ? stats.total_read_time / stats.studies_read : 0,
      critical_results: stats.critical_results,
      amendments: stats.amendments,
    }));

    // Modality distribution;
    const modalityCount = new Map<string, number>();
    filteredStudies.forEach(study => {
      modalityCount.set(study.study_type, (modalityCount.get(study.study_type) || 0) + 1);
    });

    const modalityDistribution = Array.from(modalityCount.entries()).map(([modality, count]) => ({
      modality,
      count,
      percentage: (count / filteredStudies.length) * 100,
    }));

    return {
      daily_volume: dailyVolume,
      average_read_time: Math.round(averageReadTime * 100) / 100,
      turnaround_time_stat: Math.round(turnaroundTimeStat * 100) / 100,
      turnaround_time_routine: Math.round(turnaroundTimeRoutine * 100) / 100,
      critical_results_percentage: Math.round(criticalResultsPercentage * 100) / 100,
      repeat_rate: Math.round(repeatRate * 100) / 100,
      no_show_rate: Math.round(noShowRate * 100) / 100,
      equipment_utilization: equipmentUtilization,
      radiologist_productivity,
      modality_distribution: modalityDistribution.map(m => ({
        ...m,
        percentage: Math.round(m.percentage * 100) / 100,
      })),
    };
  }

  /**
   * Get studies with filters;
   */
  async getStudies(filters?: {
    patient_id?: string;
    status?: ImagingStudy['status'];
    study_type?: ImagingStudy['study_type'];
    urgency?: ImagingStudy['urgency'];
    date_from?: string;
    date_to?: string;
    page?: number;
    limit?: number;
  }): Promise<{ studies: ImagingStudy[]; total: number; totalPages: number }> {
    const { page = 1, limit = 10, ...searchFilters } = filters || {};
    
    let filteredStudies = Array.from(this.imagingStudies.values());

    // Apply filters;
    Object.entries(searchFilters).forEach(([key, value]) => {
      if (value) {
        filteredStudies = filteredStudies.filter(study => {
          const studyValue = (study as any)[key];
          if (key.includes('date')) {
            return new Date(studyValue) >= new Date(value as string);
          }
          return studyValue === value;
        });
      }
    });

    // Sort by scheduled date/time;
    filteredStudies.sort((a, b) => {
      const dateTimeA = new Date(`${a.scheduled_date} ${a.scheduled_time}`);
      const dateTimeB = new Date(`${b.scheduled_date} ${b.scheduled_time}`);
      return dateTimeB.getTime() - dateTimeA.getTime();
    });

    // Pagination;
    const total = filteredStudies.length;
    const totalPages = Math.ceil(total / limit);
    const startIndex = (page - 1) * limit;
    const studies = filteredStudies.slice(startIndex, startIndex + limit);

    return { studies, total, totalPages };
  }

  /**
   * Get report templates;
   */
  async getReportTemplates(modality?: string, bodyPart?: string): Promise<any[]> {
    let templates = Array.from(this.reportTemplates.values());
    
    if (modality) {
      templates = templates.filter(template => template.modality === modality);
    }
    
    if (bodyPart) {
      templates = templates.filter(template => template.body_part === bodyPart);
    }
    
    return templates;
  }

  /**
   * Get DICOM series for study;
   */
  async getDicomSeries(studyId: string): Promise<DicomSeries[]> {
    return this.dicomSeries.get(studyId) || []
  }

  /**
   * Get equipment schedule;
   */
  async getEquipmentSchedule(equipmentId: string, date: string): Promise<any[]> {
    const schedule = this.equipmentSchedule.get(equipmentId) || [];
    return schedule.filter(appointment => 
      appointment.start_time.startsWith(date);
    );
  }
}

// Export singleton instance;
export const radiologyInformationSystemService = new RadiologyInformationSystemService();
