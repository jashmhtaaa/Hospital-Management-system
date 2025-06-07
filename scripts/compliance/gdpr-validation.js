/**
 * GDPR Compliance Validation Script
 * 
 * This script validates that the Hospital Management System meets GDPR requirements.
 * It checks for:
 * - Data Protection by Design
 * - User Consent Mechanisms
 * - Right to Access
 * - Right to be Forgotten
 * - Right to Data Portability
 * - Data Processing Records
 * - Data Protection Impact Assessment
 * - Breach Notification
 * - Data Transfer Controls
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Configuration
const config = {
  consentRequired: true,
  rightToAccessRequired: true,
  rightToBeForgottenRequired: true,
  dataPortabilityRequired: true,
  dataProcessingRecordsRequired: true,
  dpiaRequired: true,
  breachNotificationRequired: true,
  dataTransferControlsRequired: true,
  privacyPolicyRequired: true,
  cookieConsentRequired: true,
  dataRetentionPolicyRequired: true,
  dataMinimizationRequired: true,
  purposeLimitationRequired: true,
  accessControlRequired: true,
  encryptionRequired: true,
  auditLoggingRequired: true,
};

// Results collection
const results = {
  totalChecks: 0,
  passedChecks: 0,
  failedChecks: [],
  warnings: [],
};

// Utility functions
function logCheck(name, passed, details) {
  results.totalChecks++;
  
  if (passed) {
    results.passedChecks++;
    console.log(`✅ PASSED: ${name}`);
    if (details) console.log(`   ${details}`);
  } else {
    results.failedChecks.push({ name, details });
    console.log(`❌ FAILED: ${name}`);
    if (details) console.log(`   ${details}`);
  }
  
  console.log(''); // Empty line for readability
}

function logWarning(name, details) {
  results.warnings.push({ name, details });
  console.log(`⚠️ WARNING: ${name}`);
  if (details) console.log(`   ${details}`);
  console.log(''); // Empty line for readability
}

function fileExists(filePath) {
  try {
    return fs.existsSync(filePath);
  } catch (err) {
    return false;
  }
}

function fileContains(filePath, searchString) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    return content.includes(searchString);
  } catch (err) {
    return false;
  }
}

function findFilesWithPattern(startPath, pattern) {
  let results = [];

  if (!fs.existsSync(startPath)) {
    return results;
  }

  const files = fs.readdirSync(startPath);
  for (let i = 0; i < files.length; i++) {
    const filename = path.join(startPath, files[i]);
    const stat = fs.lstatSync(filename);
    
    if (stat.isDirectory()) {
      results = results.concat(findFilesWithPattern(filename, pattern));
    } else if (pattern.test(filename)) {
      results.push(filename);
    }
  }
  
  return results;
}

// Start validation
console.log('====================================================');
console.log('GDPR COMPLIANCE VALIDATION');
console.log(`Started at: ${new Date().toISOString()}`);
console.log('====================================================');
console.log('');

// 1. Data Protection by Design
console.log('SECTION 1: DATA PROTECTION BY DESIGN');
console.log('----------------------------------------------------');

// 1.1 Check for data minimization
const dataMinimizationImplemented = findFilesWithPattern('./src', /data.*minimization/i).length > 0 ||
                                    findFilesWithPattern('./docs', /data.*minimization/i).length > 0;
logCheck(
  'Data Minimization', 
  dataMinimizationImplemented,
  'Data minimization principles are documented and implemented'
);

// 1.2 Check for purpose limitation
const purposeLimitationImplemented = findFilesWithPattern('./src', /purpose.*limitation/i).length > 0 ||
                                     findFilesWithPattern('./docs', /purpose.*limitation/i).length > 0;
logCheck(
  'Purpose Limitation', 
  purposeLimitationImplemented,
  'Purpose limitation principles are documented and implemented'
);

// 1.3 Check for encryption
const encryptionServiceImplemented = fileExists('./src/lib/security/encryption.service.ts') || 
                                    fileExists('./src/services/encryption_service.ts');
logCheck(
  'Encryption Implementation', 
  encryptionServiceImplemented,
  'Encryption service implemented for personal data'
);

// 2. User Consent
console.log('');
console.log('SECTION 2: USER CONSENT');
console.log('----------------------------------------------------');

// 2.1 Check for consent mechanism
const consentImplemented = findFilesWithPattern('./src', /consent/i).length > 0 ||
                          findFilesWithPattern('./src/components', /consent/i).length > 0;
logCheck(
  'Consent Mechanism', 
  consentImplemented,
  'User consent mechanism is implemented'
);

// 2.2 Check for privacy policy
const privacyPolicyImplemented = fileExists('./public/privacy-policy.html') ||
                                 fileExists('./src/app/privacy-policy/page.tsx');
logCheck(
  'Privacy Policy', 
  privacyPolicyImplemented,
  'Privacy policy is implemented and accessible'
);

// 2.3 Check for cookie consent
const cookieConsentImplemented = findFilesWithPattern('./src', /cookie.*consent/i).length > 0 ||
                                findFilesWithPattern('./src/components', /cookie/i).length > 0;
logCheck(
  'Cookie Consent', 
  cookieConsentImplemented,
  'Cookie consent mechanism is implemented'
);

// 3. Data Subject Rights
console.log('');
console.log('SECTION 3: DATA SUBJECT RIGHTS');
console.log('----------------------------------------------------');

// 3.1 Check for right to access
const rightToAccessImplemented = findFilesWithPattern('./src', /right.*access/i).length > 0 ||
                                findFilesWithPattern('./src/controllers', /export.*data/i).length > 0;
logCheck(
  'Right to Access', 
  rightToAccessImplemented,
  'Right to access personal data is implemented'
);

// 3.2 Check for right to be forgotten
const rightToBeForgottenImplemented = findFilesWithPattern('./src', /right.*forgotten/i).length > 0 ||
                                     findFilesWithPattern('./src', /right.*erasure/i).length > 0 ||
                                     findFilesWithPattern('./src/controllers', /delete.*account/i).length > 0;
logCheck(
  'Right to be Forgotten', 
  rightToBeForgottenImplemented,
  'Right to be forgotten is implemented'
);

// 3.3 Check for data portability
const dataPortabilityImplemented = findFilesWithPattern('./src', /data.*portability/i).length > 0 ||
                                  findFilesWithPattern('./src/controllers', /export.*data/i).length > 0;
logCheck(
  'Data Portability', 
  dataPortabilityImplemented,
  'Data portability is implemented'
);

// 4. Data Processing Records
console.log('');
console.log('SECTION 4: DATA PROCESSING RECORDS');
console.log('----------------------------------------------------');

// 4.1 Check for data processing records
const dataProcessingRecordsImplemented = findFilesWithPattern('./src', /data.*processing.*record/i).length > 0 ||
                                        findFilesWithPattern('./docs', /data.*processing.*record/i).length > 0 ||
                                        fileExists('./src/lib/audit.ts') || 
                                        fileExists('./src/services/audit_log_service.ts');
logCheck(
  'Data Processing Records', 
  dataProcessingRecordsImplemented,
  'Data processing records are implemented'
);

// 4.2 Check for data retention policy
const dataRetentionPolicyImplemented = findFilesWithPattern('./src', /data.*retention/i).length > 0 ||
                                      findFilesWithPattern('./docs', /data.*retention/i).length > 0;
logCheck(
  'Data Retention Policy', 
  dataRetentionPolicyImplemented,
  'Data retention policy is documented and implemented'
);

// 5. Data Protection Impact Assessment
console.log('');
console.log('SECTION 5: DATA PROTECTION IMPACT ASSESSMENT');
console.log('----------------------------------------------------');

// 5.1 Check for DPIA
const dpiaImplemented = findFilesWithPattern('./docs', /data.*protection.*impact.*assessment/i).length > 0 ||
                        findFilesWithPattern('./docs', /DPIA/i).length > 0;
logCheck(
  'Data Protection Impact Assessment', 
  dpiaImplemented,
  'DPIA is documented'
);

// 6. Breach Notification
console.log('');
console.log('SECTION 6: BREACH NOTIFICATION');
console.log('----------------------------------------------------');

// 6.1 Check for breach notification procedure
const breachNotificationImplemented = findFilesWithPattern('./src', /breach.*notification/i).length > 0 || 
                                     findFilesWithPattern('./docs', /breach.*notification/i).length > 0;
logCheck(
  'Breach Notification Procedure', 
  breachNotificationImplemented,
  'Breach notification procedure is documented and implemented'
);

// 7. Data Transfer Controls
console.log('');
console.log('SECTION 7: DATA TRANSFER CONTROLS');
console.log('----------------------------------------------------');

// 7.1 Check for data transfer controls
const dataTransferControlsImplemented = findFilesWithPattern('./src', /data.*transfer/i).length > 0 || 
                                       findFilesWithPattern('./docs', /data.*transfer/i).length > 0 ||
                                       fileExists('./docs/data-transfer-policy.md');
logCheck(
  'Data Transfer Controls', 
  dataTransferControlsImplemented,
  'Data transfer controls are documented and implemented'
);

// 7.2 Check for cross-border data transfer
const crossBorderTransferImplemented = findFilesWithPattern('./docs', /cross.*border/i).length > 0 || 
                                      findFilesWithPattern('./docs', /international.*transfer/i).length > 0;
logCheck(
  'Cross-Border Data Transfer', 
  crossBorderTransferImplemented,
  'Cross-border data transfer controls are documented'
);

// 8. Technical Measures
console.log('');
console.log('SECTION 8: TECHNICAL MEASURES');
console.log('----------------------------------------------------');

// 8.1 Check for access control
const accessControlImplemented = fileExists('./src/lib/rbac/rbac.service.ts') || 
                                fileExists('./src/lib/auth.ts');
logCheck(
  'Access Control', 
  accessControlImplemented,
  'Access control mechanisms are implemented'
);

// 8.2 Check for pseudonymization
const pseudonymizationImplemented = findFilesWithPattern('./src', /pseudonymization/i).length > 0 || 
                                   findFilesWithPattern('./src', /anonymization/i).length > 0;
logCheck(
  'Pseudonymization', 
  pseudonymizationImplemented,
  'Pseudonymization mechanisms are implemented'
);

// 8.3 Check for audit logging
const auditLoggingImplemented = fileExists('./src/lib/audit.ts') || 
                                fileExists('./src/services/audit_log_service.ts');
logCheck(
  'Audit Logging', 
  auditLoggingImplemented,
  'Audit logging is implemented'
);

// Final Results
console.log('');
console.log('====================================================');
console.log('GDPR COMPLIANCE VALIDATION RESULTS');
console.log('====================================================');
console.log(`Total Checks: ${results.totalChecks}`);
console.log(`Passed Checks: ${results.passedChecks}`);
console.log(`Failed Checks: ${results.totalChecks - results.passedChecks}`);
console.log(`Pass Rate: ${Math.round((results.passedChecks / results.totalChecks) * 100)}%`);
console.log('');

if (results.failedChecks.length > 0) {
  console.log('FAILED CHECKS:');
  results.failedChecks.forEach((failure, index) => {
    console.log(`${index + 1}. ${failure.name}`);
    if (failure.details) console.log(`   ${failure.details}`);
  });
  console.log('');
}

if (results.warnings.length > 0) {
  console.log('WARNINGS:');
  results.warnings.forEach((warning, index) => {
    console.log(`${index + 1}. ${warning.name}`);
    if (warning.details) console.log(`   ${warning.details}`);
  });
  console.log('');
}

// Compliance determination
const complianceThreshold = 1.0; // 100% compliance required for GDPR
const complianceRate = results.passedChecks / results.totalChecks;
const isCompliant = complianceRate >= complianceThreshold;

console.log('====================================================');
console.log(`COMPLIANCE STATUS: ${isCompliant ? 'COMPLIANT ✅' : 'NON-COMPLIANT ❌'}`);
console.log('====================================================');
console.log(`Completed at: ${new Date().toISOString()}`);
console.log('');

// Exit with appropriate code
process.exit(isCompliant ? 0 : 1);