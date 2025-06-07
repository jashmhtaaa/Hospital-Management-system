/**
 * Advanced ICD Coding Service
 * 
 * Provides comprehensive ICD-10 and ICD-11 coding support with:
 * - Code lookup and validation
 * - Hierarchical browsing
 * - Clinical decision support
 * - Integration with EHR workflows
 * - Audit trail for coding activities
 */

import { PrismaClient } from '@prisma/client';
import { z } from 'zod';
import { AuditService } from '../audit.service';

// ICD Code Schema
export const ICDCodeSchema = z.object({
  code: z.string().min(3, 'ICD code must be at least 3 characters'),
  version: z.enum(['ICD-10', 'ICD-11']).default('ICD-10'),
  description: z.string().min(1, 'Description is required'),
  longDescription: z.string().optional(),
  category: z.string().optional(),
  subcategory: z.string().optional(),
  parentCode: z.string().optional(),
  isLeaf: z.boolean().default(true),
  isValid: z.boolean().default(true),
  effectiveDate: z.date().optional(),
  expirationDate: z.date().optional(),
  notes: z.string().optional(),
  synonyms: z.array(z.string()).default([]),
  excludes: z.array(z.string()).default([]),
  includes: z.array(z.string()).default([]),
  seeAlso: z.array(z.string()).default([]),
  modifiers: z.array(z.string()).default([]),
  billable: z.boolean().default(true),
  sex: z.enum(['male', 'female', 'both']).default('both'),
  ageRange: z.object({
    min: z.number().optional(),
    max: z.number().optional(),
    units: z.enum(['days', 'months', 'years']).default('years')
  }).optional()
});

export const CodingRequestSchema = z.object({
  patientId: z.string().min(1, 'Patient ID is required'),
  encounterId: z.string().min(1, 'Encounter ID is required'),
  clinicalText: z.string().min(1, 'Clinical text is required'),
  codeType: z.enum(['diagnosis', 'procedure', 'symptom']),
  priority: z.enum(['routine', 'urgent', 'stat']).default('routine'),
  coderId: z.string().min(1, 'Coder ID is required'),
  requestDate: z.date().default(() => new Date()),
  dueDate: z.date().optional(),
  status: z.enum(['pending', 'in_progress', 'completed', 'rejected']).default('pending'),
  specialInstructions: z.string().optional()
});

export const CodingResultSchema = z.object({
  requestId: z.string(),
  primaryCodes: z.array(z.string()),
  secondaryCodes: z.array(z.string()).default([]),
  coderId: z.string(),
  codingDate: z.date(),
  confidence: z.number().min(0).max(1).default(1),
  methodology: z.enum(['manual', 'assisted', 'automated']),
  reviewRequired: z.boolean().default(false),
  notes: z.string().optional(),
  validationStatus: z.enum(['pending', 'validated', 'rejected']).default('pending'),
  validatedBy: z.string().optional(),
  validationDate: z.date().optional()
});

export type ICDCode = z.infer<typeof ICDCodeSchema>;
export type CodingRequest = z.infer<typeof CodingRequestSchema>;
export type CodingResult = z.infer<typeof CodingResultSchema>;

export interface ICDSearchOptions {
  query: string;
  version?: 'ICD-10' | 'ICD-11';
  category?: string;
  billableOnly?: boolean;
  validOnly?: boolean;
  limit?: number;
  offset?: number;
  includeHierarchy?: boolean;
}

export interface CodingAssistanceOptions {
  enableAI?: boolean;
  suggestionLimit?: number;
  confidenceThreshold?: number;
  includeReferences?: boolean;
}

export class ICDCodingService {
  private prisma: PrismaClient;
  private auditService: AuditService;

  constructor() {
    this.prisma = new PrismaClient();
    this.auditService = new AuditService();
  }

  /**
   * Search ICD codes with advanced filtering
   */
  async searchCodes(options: ICDSearchOptions): Promise<ICDCode[]> {
    try {
      const { query, version = 'ICD-10', category, billableOnly, validOnly, limit = 50, offset = 0 } = options;

      // In production, this would query the actual ICD database
      // For now, providing mock results with realistic data
      const mockResults: ICDCode[] = [
        {
          code: 'I25.10',
          version: 'ICD-10',
          description: 'Atherosclerotic heart disease of native coronary artery without angina pectoris',
          longDescription: 'Atherosclerotic heart disease of native coronary artery without angina pectoris',
          category: 'Diseases of the circulatory system',
          subcategory: 'Ischemic heart diseases',
          parentCode: 'I25.1',
          isLeaf: true,
          isValid: true,
          billable: true,
          sex: 'both',
          synonyms: ['Coronary atherosclerosis', 'CAD'],
          excludes: ['I25.11'],
          includes: ['Atherosclerotic cardiovascular disease'],
          seeAlso: ['I25.11', 'I25.700']
        },
        {
          code: 'E11.9',
          version: 'ICD-10',
          description: 'Type 2 diabetes mellitus without complications',
          longDescription: 'Type 2 diabetes mellitus without complications',
          category: 'Endocrine, nutritional and metabolic diseases',
          subcategory: 'Diabetes mellitus',
          parentCode: 'E11',
          isLeaf: true,
          isValid: true,
          billable: true,
          sex: 'both',
          synonyms: ['DM Type 2', 'NIDDM'],
          excludes: ['E11.0', 'E11.1'],
          includes: ['Adult-onset diabetes']
        }
      ];

      // Filter results based on search criteria
      let filteredResults = mockResults.filter(code => {
        if (version && code.version !== version) return false;
        if (category && code.category !== category) return false;
        if (billableOnly && !code.billable) return false;
        if (validOnly && !code.isValid) return false;
        
        // Text search in code or description
        const searchText = query.toLowerCase();
        return code.code.toLowerCase().includes(searchText) ||
               code.description.toLowerCase().includes(searchText) ||
               code.synonyms.some(syn => syn.toLowerCase().includes(searchText));
      });

      // Apply pagination
      filteredResults = filteredResults.slice(offset, offset + limit);

      // Log search activity
      await this.auditService.logAuditEvent({
        action: 'icd_code_search',
        resourceType: 'icd_coding',
        resourceId: query,
        userId: 'system',
        details: { query, version, resultsCount: filteredResults.length }
      });

      return filteredResults;
    } catch (error) {
      console.error('[ICD Coding] Search error:', error);
      throw new Error('Failed to search ICD codes');
    }
  }

  /**
   * Get ICD code hierarchy (parent/child relationships)
   */
  async getCodeHierarchy(code: string, version: 'ICD-10' | 'ICD-11' = 'ICD-10'): Promise<{
    parents: ICDCode[];
    children: ICDCode[];
    siblings: ICDCode[];
  }> {
    try {
      // Mock hierarchy data
      const mockHierarchy = {
        parents: [{
          code: 'I25',
          version: 'ICD-10' as const,
          description: 'Chronic ischemic heart disease',
          category: 'Diseases of the circulatory system',
          isLeaf: false,
          isValid: true,
          billable: false,
          sex: 'both' as const
        }],
        children: [],
        siblings: [{
          code: 'I25.11',
          version: 'ICD-10' as const,
          description: 'Atherosclerotic heart disease of native coronary artery with angina pectoris with documented spasm',
          category: 'Diseases of the circulatory system',
          isLeaf: true,
          isValid: true,
          billable: true,
          sex: 'both' as const
        }]
      };

      await this.auditService.logAuditEvent({
        action: 'icd_hierarchy_lookup',
        resourceType: 'icd_coding',
        resourceId: code,
        userId: 'system',
        details: { code, version }
      });

      return mockHierarchy;
    } catch (error) {
      console.error('[ICD Coding] Hierarchy lookup error:', error);
      throw new Error('Failed to get code hierarchy');
    }
  }

  /**
   * Validate ICD code
   */
  async validateCode(code: string, version: 'ICD-10' | 'ICD-11' = 'ICD-10'): Promise<{
    isValid: boolean;
    code: ICDCode | null;
    validationErrors: string[];
    suggestions: string[];
  }> {
    try {
      const searchResults = await this.searchCodes({ query: code, version, limit: 1 });
      const foundCode = searchResults.find(c => c.code === code);

      const result = {
        isValid: !!foundCode && foundCode.isValid,
        code: foundCode || null,
        validationErrors: [] as string[],
        suggestions: [] as string[]
      };

      if (!foundCode) {
        result.validationErrors.push('Code not found in database');
        // Suggest similar codes
        const similarCodes = await this.searchCodes({ query: code.substring(0, 3), version, limit: 5 });
        result.suggestions = similarCodes.map(c => c.code);
      } else if (!foundCode.isValid) {
        result.validationErrors.push('Code is no longer valid');
        if (foundCode.seeAlso.length > 0) {
          result.suggestions = foundCode.seeAlso;
        }
      }

      await this.auditService.logAuditEvent({
        action: 'icd_code_validation',
        resourceType: 'icd_coding',
        resourceId: code,
        userId: 'system',
        details: { code, version, isValid: result.isValid }
      });

      return result;
    } catch (error) {
      console.error('[ICD Coding] Validation error:', error);
      throw new Error('Failed to validate ICD code');
    }
  }

  /**
   * Submit coding request
   */
  async submitCodingRequest(request: CodingRequest): Promise<string> {
    try {
      const validatedRequest = CodingRequestSchema.parse(request);
      const requestId = `cr_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

      // In production, store in database
      console.log(`[ICD Coding] Coding request submitted: ${requestId}`);

      await this.auditService.logAuditEvent({
        action: 'coding_request_submitted',
        resourceType: 'coding_request',
        resourceId: requestId,
        userId: validatedRequest.coderId,
        details: { 
          patientId: validatedRequest.patientId,
          encounterId: validatedRequest.encounterId,
          codeType: validatedRequest.codeType
        }
      });

      return requestId;
    } catch (error) {
      console.error('[ICD Coding] Request submission error:', error);
      throw new Error('Failed to submit coding request');
    }
  }

  /**
   * Complete coding request with results
   */
  async completeCodingRequest(requestId: string, result: Omit<CodingResult, 'requestId'>): Promise<void> {
    try {
      const validatedResult = CodingResultSchema.parse({ ...result, requestId });

      // In production, update database record
      console.log(`[ICD Coding] Coding request completed: ${requestId}`);

      await this.auditService.logAuditEvent({
        action: 'coding_request_completed',
        resourceType: 'coding_request',
        resourceId: requestId,
        userId: validatedResult.coderId,
        details: {
          primaryCodes: validatedResult.primaryCodes,
          secondaryCodes: validatedResult.secondaryCodes,
          methodology: validatedResult.methodology,
          confidence: validatedResult.confidence
        }
      });
    } catch (error) {
      console.error('[ICD Coding] Request completion error:', error);
      throw new Error('Failed to complete coding request');
    }
  }

  /**
   * Get coding assistance suggestions
   */
  async getCodingSuggestions(
    clinicalText: string, 
    codeType: 'diagnosis' | 'procedure' | 'symptom',
    options: CodingAssistanceOptions = {}
  ): Promise<{
    suggestions: Array<{
      code: string;
      description: string;
      confidence: number;
      reasoning: string;
    }>;
    confidence: number;
  }> {
    try {
      const { suggestionLimit = 5, confidenceThreshold = 0.7 } = options;

      // Mock AI-powered coding suggestions
      const mockSuggestions = [
        {
          code: 'I25.10',
          description: 'Atherosclerotic heart disease of native coronary artery without angina pectoris',
          confidence: 0.85,
          reasoning: 'Keywords: "coronary", "atherosclerotic", "without angina" found in clinical text'
        },
        {
          code: 'I25.700',
          description: 'Atherosclerosis of coronary artery bypass graft(s), unspecified, with unstable angina pectoris',
          confidence: 0.72,
          reasoning: 'Keywords: "coronary", "atherosclerosis" found, but confidence lower due to "unstable angina" not mentioned'
        }
      ];

      const filteredSuggestions = mockSuggestions
        .filter(s => s.confidence >= confidenceThreshold)
        .slice(0, suggestionLimit);

      const overallConfidence = filteredSuggestions.length > 0 
        ? filteredSuggestions.reduce((sum, s) => sum + s.confidence, 0) / filteredSuggestions.length
        : 0;

      await this.auditService.logAuditEvent({
        action: 'coding_assistance_requested',
        resourceType: 'icd_coding',
        resourceId: 'suggestion_request',
        userId: 'system',
        details: { 
          codeType, 
          textLength: clinicalText.length,
          suggestionCount: filteredSuggestions.length,
          confidence: overallConfidence
        }
      });

      return {
        suggestions: filteredSuggestions,
        confidence: overallConfidence
      };
    } catch (error) {
      console.error('[ICD Coding] Suggestion error:', error);
      throw new Error('Failed to get coding suggestions');
    }
  }

  /**
   * Get coding statistics and metrics
   */
  async getCodingMetrics(dateRange: { from: Date; to: Date }): Promise<{
    totalRequests: number;
    completedRequests: number;
    averageCompletionTime: number;
    topCodes: Array<{ code: string; count: number; description: string }>;
    coderPerformance: Array<{ coderId: string; requestsCompleted: number; averageConfidence: number }>;
    qualityMetrics: {
      validationRate: number;
      rejectionRate: number;
      averageConfidence: number;
    };
  }> {
    try {
      // Mock metrics data
      const mockMetrics = {
        totalRequests: 245,
        completedRequests: 232,
        averageCompletionTime: 2.5, // hours
        topCodes: [
          { code: 'I25.10', count: 15, description: 'Atherosclerotic heart disease of native coronary artery without angina pectoris' },
          { code: 'E11.9', count: 12, description: 'Type 2 diabetes mellitus without complications' },
          { code: 'J44.1', count: 10, description: 'Chronic obstructive pulmonary disease with acute exacerbation' }
        ],
        coderPerformance: [
          { coderId: 'coder001', requestsCompleted: 45, averageConfidence: 0.87 },
          { coderId: 'coder002', requestsCompleted: 38, averageConfidence: 0.82 },
          { coderId: 'coder003', requestsCompleted: 35, averageConfidence: 0.89 }
        ],
        qualityMetrics: {
          validationRate: 0.94,
          rejectionRate: 0.03,
          averageConfidence: 0.85
        }
      };

      await this.auditService.logAuditEvent({
        action: 'coding_metrics_accessed',
        resourceType: 'icd_coding',
        resourceId: 'metrics',
        userId: 'system',
        details: { dateRange }
      });

      return mockMetrics;
    } catch (error) {
      console.error('[ICD Coding] Metrics error:', error);
      throw new Error('Failed to get coding metrics');
    }
  }

  /**
   * Cleanup and close connections
   */
  async destroy(): Promise<void> {
    await this.prisma.$disconnect();
  }
}

// Singleton instance for application use
let icdCodingServiceInstance: ICDCodingService | null = null;

export const getICDCodingService = (): ICDCodingService => {
  if (!icdCodingServiceInstance) {
    icdCodingServiceInstance = new ICDCodingService();
  }
  return icdCodingServiceInstance;
};

export { ICDCodingService };
