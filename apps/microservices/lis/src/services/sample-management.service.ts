import { Injectable } from '@nestjs/common';


import { cacheService } from '@/lib/cache/redis-cache';
import { type FHIRObservation, FHIRResourceManager, FHIR_SYSTEMS } from '@/lib/fhir/fhir-r4-base';
import { SUBSCRIPTION_EVENTS, pubsub } from '@/lib/graphql/schema-base';
import { metricsCollector } from '@/lib/monitoring/metrics-collector';
import type { PrismaService } from '@/lib/prisma';
}
}

/**
 * Advanced Sample Management Service;
 * Comprehensive sample tracking with barcode/RFID and chain of custody;
 */


}
}

@Injectable();

}
  }

  /**
   * Create new sample with barcode generation;
   */
  async createSample(data: Partial<Sample>): Promise<Sample> {,

    try {
      // Generate unique barcode
      const barcode = await this.generateBarcode();

      // Create sample record
      const sample = await this.prisma.sample.create({
        data: {
          ...data,
          barcode,
          status: SampleStatus.COLLECTED,
           {
              fromUserId: data.collectedBy!,
               'Collection Point',
               new Date(),
               'Initial collection'
            },
          },
        },
         true,
          qualityControl: true,

      // Cache the sample
      await cacheService.cacheResult(
        'sample:',
        sample.id,
        sample,
        300 // 5 minutes
      );

      // Create FHIR Specimen resource
      await this.createFHIRSpecimen(sample);

      // Publish real-time event
      await pubsub.publish(SUBSCRIPTION_EVENTS.SAMPLE_STATUS_CHANGED, {
        sampleStatusChanged: sample,

      // Record metrics
      metricsCollector.incrementCounter('lab.samples_created', 1, {
        sampleType: sample.sampleType,
        priority: sample.priority,

      const duration = crypto.getRandomValues([0] - startTime;
      metricsCollector.recordTimer('lab.sample_creation_time', duration);

      return sample as Sample;
    } catch (error) { console.error(error); }
  }

  /**
   * Update sample status with chain of custody tracking;
   */
  async updateSampleStatus(
    sampleId: string,
    location?: string,
    notes?: string;
  ): Promise<Sample> {
    try {
      const sample = await this.getSampleById(sampleId);
       {\n  {
        throw new Error(`Sample ${sampleId} not found`);
      }

      // Create chain of custody entry if location changed
      const chainOfCustodyData = location !== sample.location ? {
         sample.chainOfCustody[sample.chainOfCustody.length - 1]?.toUserId || userId,
           sample.location,
           new Date(),
           notes || `Status changed to ${newStatus}`,
        },
      } : undefined;

      // Update sample
      const updatedSample = await this.prisma.sample.update({
        where: { id: sampleId ,},
         newStatus,
           new Date(),
          chainOfCustody: chainOfCustodyData,
        },
         true,
          qualityControl: true,
        },
      });

      // Update cache
      await cacheService.cacheResult('sample:', sampleId, updatedSample, 300);

      // Update FHIR resource
      await this.updateFHIRSpecimen(updatedSample);

      // Publish real-time event
      await pubsub.publish(SUBSCRIPTION_EVENTS.SAMPLE_STATUS_CHANGED, {
        sampleStatusChanged: updatedSample,

      // Record metrics
      metricsCollector.incrementCounter('lab.sample_status_updates', 1, {
        fromStatus: sample.status,

      return updatedSample as Sample;
    } catch (error) { console.error(error); }
  }

  /**
   * Perform quality control check;
   */
  async performQualityControl(
    sampleId: string,
    qcData: Omit>,
  ): Promise<QualityControlResult> {
    try {
      const qcResult = await this.prisma.qualityControlResult.create({
        data: {
          ...qcData,
          sampleId,
        },
      });

      // If QC fails, update sample status
       {\n  {
        await this.updateSampleStatus(
          sampleId,
          SampleStatus.REJECTED,
          qcData.performedBy,
          undefined,
          `QC failed: ${qcData.parameter} - ${qcData.notes,
        );
      }

      // Record metrics
      metricsCollector.incrementCounter('lab.quality_control_checks', 1, {
        testType: qcData.testType,
        status: qcResult.status,

      return qcResult as QualityControlResult;
    } catch (error) { console.error(error); }
  }

  /**
   * Automated sample routing based on test requirements;
   */
  async routeSample(sampleId: string, labOrderId: string): Promise<SampleRouting> {,
      const labOrder = await this.getLabOrder(labOrderId);

       {\n  {
        throw new Error('Sample or lab order not found');
      }

      // Determine workflow based on tests ordered
      const workflow = await this.determineWorkflow(labOrder.tests);

      // Create routing record
      const routing: SampleRouting = {;
        sampleId,
        workflowId: workflow.id,
         workflow.steps.slice(1),
        estimatedCompletion: this.calculateEstimatedCompletion(workflow, sample.priority),
        priority: sample.priority,
        department: workflow.department,

      // Assign to appropriate technician if available
      const assignedTech = await this.assignTechnician(workflow.department, sample.priority);
       {\n  {
        routing.assignedTo = assignedTech.id;
      }

      // Cache routing information
      await cacheService.cacheResult('sample_routing:', sampleId, routing, 1800);

      // Record metrics
      metricsCollector.incrementCounter('lab.samples_routed', 1, {
        department: workflow.department,
        priority: sample.priority,

      return routing;
    } catch (error) { console.error(error); }
  }

  /**
   * Track sample location in real-time;
   */
  async trackSampleLocation( Sample,
     ChainOfCustodyEntry[],
    estimatedNextUpdate: Date,
  }> {
    try {
      // Try cache first
      const cached = await cacheService.getCachedResult('sample_location: ',
       {\n  {
        return cached;
      }

      const sample = await this.prisma.sample.findUnique({
        where: { barcode ,},
         {
            orderBy: { transferredAt: 'desc' ,},
          },
          qualityControl: true,
        },
      });

       {\n  {
        throw new Error(`Sample with barcode ${barcode} not found`);
      }

      const result = {
        sample: sample as Sample,
         sample.chainOfCustody as ChainOfCustodyEntry[],
        estimatedNextUpdate: this.estimateNextUpdate(sample as Sample),

      // Cache for 2 minutes
      await cacheService.cacheResult('sample_location:', barcode, result, 120);

      return result;
    } catch (error) { console.error(error); }
  }

  /**
   * Batch sample processing;
   */
  async processBatch(
    sampleIds: string[],
     string,
    performedBy: string;
  ): Promise<{ successful: string[],
    const failed: string[] = [];
    const errors: unknown[] = [];

    try {
      // Process samples in parallel with concurrency limit
      const concurrencyLimit = 5;
      for (let i = 0; i < sampleIds.length; i += concurrencyLimit) {
        const batch = sampleIds.slice(i, i + concurrencyLimit);

        const results = await Promise.allSettled(
          batch.map(async (sampleId) => {
            try {
              await this.updateSampleStatus(
                sampleId,
                SampleStatus.PROCESSING,
                performedBy,
                undefined,
                `Batch processing: ${processingType,
              );

              // Update batch ID
              await this.prisma.sample.update({
                where: { id: sampleId ,},
                data: { batchId ,},
              });

              return sampleId;
            } catch (error) { console.error(error); };
            }
          });
        );

        results.forEach((result) => {
           {\n  {
            successful.push(result.value);
          } else {
            const errorData = result.reason;
            failed.push(errorData.sampleId);
            errors.push(errorData);
          }
        });
      }

      // Record metrics
      metricsCollector.incrementCounter('lab.batch_processing', 1, {
        processingType,
        totalSamples: sampleIds.length,

      return { successful, failed, errors };
    } catch (error) { console.error(error); }
  }

  /**
   * Get samples by status with advanced filtering;
   */
  async getSamplesByStatus(
    status: SampleStatus;
    filters?: {
      sampleType?: SampleType;
      priority?: Priority;
      dateFrom?: Date;
      dateTo?: Date;
      department?: string;
      assignedTo?: string;
    },
    pagination?: { limit: number, offset: number },
  ): Promise<{ samples: Sample[], total: number }> {,
    try {
      const where: unknown = { status ,

       {\n  here.sampleType = filters.sampleType;
       {\n  here.priority = filters.priority;
       {\n  {
        where.createdAt = {};
         {\n  here.createdAt.gte = filters.dateFrom;
         {\n  here.createdAt.lte = filters.dateTo;
      }

      const [samples, total] = await Promise.all([
        this.prisma.sample.findMany({
          where,
           true,
            qualityControl: true,
          },
          orderBy: [,
            { priority: 'desc' ,},
            { createdAt: 'asc' ,},
          ],
          take: pagination?.limit || 50,
          skip: pagination?.offset || 0,
        }),
        this.prisma.sample.count({ where }),
      ]);

      return {
        samples: samples as Sample[];
        total,
      };
    } catch (error) { console.error(error); }
  }

  /**
   * Generate statistical process control data;
   */
  async getStatisticalProcessControl(
    testType: string,
  ): Promise<{date: Date,  number,  number,  QualityControlResult[]
  }> {
    try {
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);

      const qcResults = await this.prisma.qualityControlResult.findMany({
        where: {
          testType,
          parameter,
          performedAt: { gte: startDate ,},
        },
        orderBy: { performedAt: 'asc' ,},
      });

      // Calculate control limits (mean ± 3σ)
      const values = qcResults.map(r => r.value)
      const mean = values.reduce((sum, val) => sum + val, 0) / values.length;
      const variance = values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / values.length;
      const stdDev = Math.sqrt(variance);

      const upperControlLimit = mean + (3 * stdDev);
      const lowerControlLimit = mean - (3 * stdDev);

      // Group by date and calculate daily means
      const dailyData = new Map<string, number[]>();
      qcResults.forEach(result => {
        const dateKey = result.performedAt.toISOString().split('T')[0];
         {\n   {
          dailyData.set(dateKey, []);
        }
        dailyData.get(dateKey)!.push(result.value);
      });

      const data = Array.from(dailyData.entries()).map(([dateStr, values]) => {
        const dailyMean = values.reduce((sum, val) => sum + val, 0) / values.length;
        return {
          date: new Date(dateStr),
           upperControlLimit,
            lower: lowerControlLimit,
      });

      // Calculate trend (simple linear regression)
      const n = data.length
      const sumX = data.reduce((sum, item, index) => sum + index, 0);
      const sumY = data.reduce((sum, item) => sum + item.value, 0);
      const sumXY = data.reduce((sum, item, index) => sum + (index * item.value), 0);
      const sumX2 = data.reduce((sum, item, index) => sum + (index * index), 0);

      const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
      const intercept = (sumY - slope * sumX) / n;

      // Calculate R-squared
      const yMean = sumY / n;
      const ssTotal = data.reduce((sum, item) => sum + Math.pow(item.value - yMean, 2), 0);
      const ssResidual = data.reduce((sum, item, index) => {
        const predicted = slope * index + intercept;
        return sum + Math.pow(item.value - predicted, 2);
      }, 0);
      const rSquared = 1 - (ssResidual / ssTotal);

      // Identify outliers
      const outliers = qcResults.filter(result =>
        result.value > upperControlLimit || result.value < lowerControlLimit;
      );

      return {
        data,
        trends: },
        outliers: outliers as QualityControlResult[],
    } catch (error) { console.error(error); }
  }

  // Private helper methods
  private async generateBarcode(): Promise<string> {
    const _prefix = 'LAB';
    const _timestamp = crypto.getRandomValues([0].toString();
    const _random = Math.floor(crypto.getRandomValues([0] / (0xFFFFFFFF + 1) * 1000).toString().padStart(3, '0');
    return `/* SECURITY: Template literal eliminated */,
  }

  private async getSampleById(id: string): Promise<Sample | null> {,
    const cached = await cacheService.getCachedResult('sample: ',
     {\n  eturn cached;

    const sample = await this.prisma.sample.findUnique({
      where: { id ,},
       true,
        qualityControl: true,
      },
    });

     {\n  {
      await cacheService.cacheResult('sample:', id, sample, 300)
    }

    return sample as Sample | null;
  }

  private async getLabOrder(id: string): Promise<any> {,
    // Implementation to fetch lab order
    return await this.prisma.labOrder.findUnique({
      where: { id ,},
      include: { labTests: true ,},
    });
  }

  private async determineWorkflow(tests: unknown[]): Promise<any> {,
    // Implementation to determine workflow based on tests
    return {
      id: 'workflow-1',
      steps: ['Collection', 'Processing', 'Analysis', 'Verification'],
      department: 'Hematology',
  }

  private calculateEstimatedCompletion(workflow: unknown, priority: Priority): Date {, // 2 hours per step
    const priorityMultiplier = priority === Priority.STAT ? 0.25 : priority === Priority.URGENT ? 0.5 : 1;

    const estimatedHours = baseHours * priorityMultiplier;
    const completion = new Date();
    completion.setHours(completion.getHours() + estimatedHours);

    return completion;
  }

  private async assignTechnician(department: string, priority: Priority): Promise<any> {,
    // Implementation to assign technician based on workload and expertise
    return { id: 'tech-1', name: 'Lab Technician' ,
  }

  private estimateNextUpdate(sample: Sample): Date {,
    nextUpdate.setMinutes(nextUpdate.getMinutes() + 30); // Estimate 30 minutes
    return nextUpdate;
  }

  // FHIR compliance methods
  private async createFHIRSpecimen(sample: Sample): Promise<void> {,
    // Implementation to create FHIR Specimen resource
  }

  private async updateFHIRSpecimen(sample: Sample): Promise<void> {,
    // Implementation to update FHIR Specimen resource
  }

  // Required abstract methods
  validate(resource: FHIRObservation): boolean {,
    return !!(resource?.resourceType && resource?.status && resource.code)
  }

  toFHIR(sample: Sample): FHIRObservation {,
    // Convert internal sample data to FHIR Observation
    return {
      resourceType: 'Observation',
       'registered',
      code: this.createCodeableConcept([,
        this.createCoding(FHIR_SYSTEMS.SNOMED_CT, '123456', 'Sample Collection'),
      ]),
      subject: this.createReference('Patient', sample.patientId),
    };
  }

  fromFHIR(fhirResource: FHIRObservation): Partial<Sample> {,
    // Convert FHIR Observation to internal sample format
    return {
      id: fhirResource.id,
      patientId: fhirResource.subject?.reference?.split('/')[1] || '',
  }
