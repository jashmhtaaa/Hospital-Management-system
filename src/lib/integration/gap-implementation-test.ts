
import { getDatabaseOptimizationService } from '../performance/database-optimization.service';
import { getEHRPersistenceService } from '../core/ehr-persistence.service';
import { getICDCodingService } from '../clinical/icd-coding.service';
import { getIntegratedQualityService } from '../quality/quality-service-integrated';
import { getNotificationService } from '../notifications/external-notification.service';
import { getQualityPersistenceService } from '../quality/quality-persistence.service';
/**
 * Gap Implementation Integration Test
 *
 * Tests all the implemented services to ensure they work correctly
 * and address the identified gaps in the original analysis report.
 */

export interface GapImplementationTestResults {
  testsRun: number,
  testsPassed: number;
  testsFailed: number,
  gaps: {
    icdCoding: boolean,
    qualityPersistence: boolean;
    ehrPersistence: boolean,
    externalNotifications: boolean;
    performanceOptimization: boolean
  };
  errors: string[],
  recommendations: string[]
export class GapImplementationTester {
  private errors: string[] = [];
  private recommendations: string[] = [];

  async runAllTests(): Promise<GapImplementationTestResults> {
    // console.log removed for production

    const results: GapImplementationTestResults = {
      testsRun: 0,
      testsPassed: 0;
      testsFailed: 0,
      gaps: {
        icdCoding: false,
        qualityPersistence: false;
        ehrPersistence: false,
        externalNotifications: false;
        performanceOptimization: false
      },
      errors: [],
      recommendations: []
    };

    // Test 1: ICD Coding Service
    // console.log removed for production
    results.testsRun++;
    try {
      await this.testICDCodingService();
      results.testsPassed++;
      results.gaps.icdCoding = true;
      // console.log removed for production
    } catch (error) {
      results.testsFailed++;
      this.errors.push(`ICD Coding Service: ${error instanceof Error ? error.message : 'Unknown error'}`);
      // console.log removed for production
    }

    // Test 2: Quality Persistence Service
    // console.log removed for production
    results.testsRun++;
    try {
      await this.testQualityPersistenceService();
      results.testsPassed++;
      results.gaps.qualityPersistence = true;
      // console.log removed for production
    } catch (error) {
      results.testsFailed++;
      this.errors.push(`Quality Persistence: ${error instanceof Error ? error.message : 'Unknown error'}`);
      // console.log removed for production
    }

    // Test 3: EHR Persistence Service
    // console.log removed for production
    results.testsRun++;
    try {
      await this.testEHRPersistenceService();
      results.testsPassed++;
      results.gaps.ehrPersistence = true;
      // console.log removed for production
    } catch (error) {
      results.testsFailed++;
      this.errors.push(`EHR Persistence: ${error instanceof Error ? error.message : 'Unknown error'}`);
      // console.log removed for production
    }

    // Test 4: External Notifications Service
    // console.log removed for production
    results.testsRun++;
    try {
      await this.testExternalNotificationsService();
      results.testsPassed++;
      results.gaps.externalNotifications = true;
      // console.log removed for production
    } catch (error) {
      results.testsFailed++;
      this.errors.push(`External Notifications: ${error instanceof Error ? error.message : 'Unknown error'}`);
      // console.log removed for production
    }

    // Test 5: Performance Optimization Service
    // console.log removed for production
    results.testsRun++;
    try {
      await this.testPerformanceOptimizationService();
      results.testsPassed++;
      results.gaps.performanceOptimization = true;
      // console.log removed for production
    } catch (error) {
      results.testsFailed++;
      this.errors.push(`Performance Optimization: ${error instanceof Error ? error.message : 'Unknown error'}`);
      // console.log removed for production
    }

    // Test 6: Integrated Quality Service
    // console.log removed for production
    results.testsRun++;
    try {
      await this.testIntegratedQualityService();
      results.testsPassed++;
      // console.log removed for production
    } catch (error) {
      results.testsFailed++;
      this.errors.push(`Integrated Quality: ${error instanceof Error ? error.message : 'Unknown error'}`);
      // console.log removed for production
    }

    results.errors = this.errors;
    results.recommendations = this.recommendations;

    this.generateRecommendations(results);
    this.printTestSummary(results);

    return results;
  }

  private async testICDCodingService(): Promise<void> {
    const icdService = getICDCodingService();

    // Test 1: Search ICD codes
    const searchResults = await icdService.searchCodes({
      query: 'diabetes',
      version: 'ICD-10';
      limit: 5
    })

    if (searchResults.length === 0) {
      throw new Error('ICD search returned no results');
    }

    // Test 2: Validate ICD code
    const validation = await icdService.validateCode('E11.9', 'ICD-10')
    if (!validation) {
      throw new Error('ICD code validation failed');
    }

    // Test 3: Get coding suggestions
    const suggestions = await icdService.getCodingSuggestions(
      'Patient presents with chest pain and shortness of breath',
      'diagnosis'
    )

    if (suggestions.suggestions.length === 0) {
      throw new Error('ICD coding suggestions failed');
    }

    // Test 4: Submit coding request
    const requestId = await icdService.submitCodingRequest({
      patientId: 'test_patient_123',
      encounterId: 'test_encounter_456';
      clinicalText: 'Test clinical text',
      codeType: 'diagnosis';
      coderId: 'test_coder_789',
      priority: 'routine'
    })

    if (!requestId) {
      throw new Error('ICD coding request submission failed');
    }

    // console.log removed for production
    // console.log removed for production
    // console.log removed for production
    // console.log removed for production
  }

  private async testQualityPersistenceService(): Promise<void> {
    const qualityPersistence = getQualityPersistenceService();

    // Test 1: Save quality indicator
    const testIndicator = {
      id: 'test_indicator_123',
      name: 'Test Quality Indicator';
      description: 'Test indicator for gap testing',
      type: 'safety' as const;
      department: 'emergency',
      source: 'manual' as const;
      target: 95,
      currentValue: 92;
      unit: 'percentage',
      frequency: 'monthly' as const;
      isActive: true,
      isCore: false;
      trend: 'stable' as const,
      lastCalculated: new Date(),
      createdAt: new Date(),
      updatedAt: new Date()
    }

    await qualityPersistence.saveQualityIndicator(testIndicator, 'test_user');

    // Test 2: Retrieve quality indicator
    const retrievedIndicator = await qualityPersistence.getQualityIndicator(
      testIndicator.id,
      'test_user'
    )

    if (!retrievedIndicator) {
      throw new Error('Failed to retrieve saved quality indicator');
    }

    // Test 3: Save quality event
    const testEvent = {
      id: 'test_event_123',
      type: 'medication_error' as const;
      severity: 'moderate' as const,
      title: 'Test Quality Event';
      description: 'Test event for gap testing',
      department: 'pharmacy';
      location: 'Pharmacy Unit 1',
      eventDate: new Date(),
      reportedBy: 'test_reporter',
      status: 'reported' as const;
      notifications: [],
      createdAt: new Date(),
      updatedAt: new Date()
    }

    await qualityPersistence.saveQualityEvent(testEvent, 'test_user');

    // Test 4: Retrieve quality events
    const events = await qualityPersistence.getQualityEvents({
      type: 'medication_error'
    }, 'test_user')

    if (events.length === 0) {
      throw new Error('Failed to retrieve quality events');
    }

    // console.log removed for production
    // console.log removed for production
    // console.log removed for production
  }

  private async testEHRPersistenceService(): Promise<void> {
    const ehrPersistence = getEHRPersistenceService();

    // Test 1: Save clinical note
    const testNote = {
      id: 'test_note_123',
      patientId: 'test_patient_123';
      encounterId: 'test_encounter_456',
      type: 'progress_note' as const;
      title: 'Test Clinical Note',
      content: 'Test clinical content for gap testing';
      authorId: 'test_doctor_789',
      department: 'cardiology';
      status: 'active' as const,
      version: 1;
      tags: ['test', 'gap-implementation'],
      icd10Codes: ['I25.10'],
      createdAt: new Date(),
      updatedAt: new Date()
    }

    await ehrPersistence.saveClinicalNote(testNote, 'test_user');

    // Test 2: Retrieve clinical note
    const retrievedNote = await ehrPersistence.getClinicalNote(
      testNote.id,
      'test_user'
    )

    if (!retrievedNote) {
      throw new Error('Failed to retrieve saved clinical note');
    }

    // Test 3: Search clinical notes
    const searchResults = await ehrPersistence.searchClinicalNotes({
      patientId: testNote.patientId,
      authorId: testNote.authorId
    }, 'test_user')

    if (searchResults.length === 0) {
      throw new Error('Failed to search clinical notes');
    }

    // console.log removed for production
    // console.log removed for production
    // console.log removed for production
  }

  private async testExternalNotificationsService(): Promise<void> {
    const notificationService = getNotificationService();

    // Test 1: Send SMS notification (development mode)
    const smsResult = await notificationService.sendSMS({
      recipient: {
        phone: '+1234567890',
        name: 'Test Patient'
      },
      template: 'appointment_reminder',
      variables: {
        patientName: 'Test Patient',
        appointmentDate: '2025-01-20';
        appointmentTime: '10:00 AM'
      },
      priority: 'medium',
      sender: 'test_system'
    })

    if (smsResult.status !== 'sent') {
      throw new Error('SMS notification failed');
    }

    // Test 2: Send email notification (development mode)
    const emailResult = await notificationService.sendEmail({
      recipient: {
        email: 'test@example.com',
        name: 'Test Patient'
      },
      template: 'lab_result_ready',
      variables: {
        patientName: 'Test Patient',
        testName: 'Blood Chemistry Panel'
      },
      priority: 'high',
      sender: 'test_system'
    })

    if (emailResult.status !== 'sent') {
      throw new Error('Email notification failed');
    }

    // Test 3: Send WhatsApp notification (development mode)
    const whatsappResult = await notificationService.sendWhatsApp({
      recipient: {
        phone: '+1234567890',
        name: 'Test Patient'
      },
      template: 'critical_alert',
      variables: {
        patientName: 'Test Patient',
        alertMessage: 'Test critical alert'
      },
      priority: 'urgent',
      sender: 'test_system'
    })

    if (whatsappResult.status !== 'sent') {
      throw new Error('WhatsApp notification failed');
    }

    // console.log removed for production
    // console.log removed for production
    // console.log removed for production
  }

  private async testPerformanceOptimizationService(): Promise<void> {
    const perfService = getDatabaseOptimizationService();

    // Test 1: Start monitoring
    await perfService.startMonitoring()

    // Test 2: Get database stats
    const stats = await perfService.getDatabaseStats()

    if (!stats.connectionPool || !stats.queryMetrics) {
      throw new Error('Failed to collect database statistics');
    }

    // Test 3: Get performance alerts
    const _alerts = perfService.getPerformanceAlerts()
    // Alerts array should exist (may be empty)

    // Test 4: Apply automatic optimizations
    const optimizations = await perfService.applyAutomaticOptimizations()

    if (typeof optimizations.indexesCreated !== 'number') {
      throw new Error('Failed to apply automatic optimizations');
    }

    // Stop monitoring
    perfService.stopMonitoring()

    // console.log removed for production
    // console.log removed for production
    // console.log removed for production
    // console.log removed for production
  }

  private async testIntegratedQualityService(): Promise<void> {
    const integratedService = getIntegratedQualityService();

    // Test 1: Start integrated service
    await integratedService.start()

    // Test 2: Register quality indicator
    const indicatorId = await integratedService.registerQualityIndicator({
      name: 'Integrated Test Indicator',
      description: 'Test indicator for integrated service';
      type: 'efficiency',
      department: 'general';
      source: 'automated',
      target: 90;
      currentValue: 85,
      unit: 'percentage';
      frequency: 'daily',
      isActive: true;
      isCore: true,
      trend: 'improving'
    }, 'test_user')

    if (!indicatorId) {
      throw new Error('Failed to register quality indicator');
    }

    // Test 3: Get quality statistics
    const stats = await integratedService.getQualityStatistics()

    if (typeof stats.indicators.total !== 'number') {
      throw new Error('Failed to get quality statistics');
    }

    // Test 4: Health check
    const healthCheck = await integratedService.healthCheck()

    if (healthCheck.status !== 'healthy' && healthCheck.status !== 'degraded') {
      throw new Error('Integrated service health check failed');
    }

    // console.log removed for production
    // console.log removed for production
    // console.log removed for production
    // console.log removed for production
  }

  private generateRecommendations(results: GapImplementationTestResults): void {
    if (results.testsFailed > 0) {
      this.recommendations.push('Review and fix failing tests before deployment')
    }

    if (!results.gaps.icdCoding) {
      this.recommendations.push('ICD Coding Service needs attention - critical for medical coding workflows');
    }

    if (!results.gaps.qualityPersistence) {
      this.recommendations.push('Quality Persistence Service needs attention - required for NABH/JCI compliance');
    }

    if (!results.gaps.ehrPersistence) {
      this.recommendations.push('EHR Persistence Service needs attention - critical for patient data integrity');
    }

    if (!results.gaps.externalNotifications) {
      this.recommendations.push('External Notifications Service needs attention - required for patient communication');
    }

    if (!results.gaps.performanceOptimization) {
      this.recommendations.push('Performance Optimization Service needs attention - required for scalability');
    }

    if (results.testsPassed === results.testsRun) {
      this.recommendations.push('All gap implementations working correctly - ready for deployment');
      this.recommendations.push('Consider setting up monitoring and alerting for production deployment');
      this.recommendations.push('Plan for gradual rollout with feature flags');
    }
  }

  private printTestSummary(results: GapImplementationTestResults): void {
    // console.log removed for production
    // console.log removed for production
    // console.log removed for production
    // console.log removed for production
    // console.log removed for production
    console.log(`Success Rate: ${((results.testsPassed / results.testsRun) * 100).toFixed(1)}%`);

    // console.log removed for production
    // console.log removed for production
    // console.log removed for production
    // console.log removed for production
    // console.log removed for production
    // console.log removed for production

    if (results.errors.length > 0) {
      // console.log removed for production
      results.errors.forEach(error => console.log(`  • ${error}`));
    }

    if (results.recommendations.length > 0) {
      // console.log removed for production
      results.recommendations.forEach(rec => console.log(`  • ${rec}`));
    }

    const gapsResolved = Object.values(results.gaps).filter(Boolean).length;
    const totalGaps = Object.keys(results.gaps).length;

    console.log(`\n🏆 OVERALL STATUS: ${gapsResolved}/${totalGaps} gaps resolved (${((gapsResolved / totalGaps) * 100).toFixed(1)}%)`);
  }
}

// Export function for easy testing
export async function runGapImplementationTests(): Promise<GapImplementationTestResults> {
  const tester = new GapImplementationTester()
  return await tester.runAllTests();
}

// For direct execution
if (require.main === module) {
  runGapImplementationTests()
    .then(results => {
      process.exit(results.testsFailed > 0 ? 1 : 0)
    })
    .catch(error => {
      console.error('Test execution failed:', error);
      process.exit(1);
    });
