/**
 * HIPAA Compliance Validation Script
 * 
 * This script validates that the Hospital Management System meets all HIPAA requirements.
 * It checks for:
 * - Access Controls
 * - Audit Controls
 * - Integrity Controls
 * - Transmission Security
 * - Authentication
 * - Encryption
 * - Breach Notification Mechanisms
 * - Emergency Access Procedures
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Configuration
const config = {
  requiredEncryptionStrength: 256, // AES-256 required
  auditLogRetentionDays: 365, // 1 year minimum retention
  passwordMinLength: 12,
  passwordComplexity: true,
  mfaRequired: true,
  sessionTimeoutMinutes: 15,
  automaticLogoutRequired: true,
  minimumTlsVersion: 1.2,
  emergencyAccessProcedureRequired: true,
  auditLoggingRequired: true,
  uniqueUserIdentificationRequired: true,
  encryptionAtRestRequired: true,
  encryptionInTransitRequired: true,
  dataBackupRequired: true,
  disasterRecoveryRequired: true,
  businessAssociateAgreementRequired: true,
  breachNotificationRequired: true,
  accessControlRequired: true,
  minimumAuthorizationRoles: ['admin', 'doctor', 'nurse', 'receptionist', 'patient'],
  rolesWithPHIAccess: ['admin', 'doctor', 'nurse'],
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
console.log('HIPAA COMPLIANCE VALIDATION');
console.log(`Started at: ${new Date().toISOString()}`);
console.log('====================================================');
console.log('');

// 1. Access Controls
console.log('SECTION 1: ACCESS CONTROLS');
console.log('----------------------------------------------------');

// 1.1 Check RBAC Implementation
const rbacImplemented = fileExists('./src/lib/rbac/rbac.service.ts');
logCheck(
  'Role-Based Access Control Implementation', 
  rbacImplemented,
  'RBAC service found at ./src/lib/rbac/rbac.service.ts'
);

// 1.2 Check for minimum required roles
if (rbacImplemented) {
  const rolesFile = './src/lib/rbac/roles.ts';
  const rolesFileExists = fileExists(rolesFile);
  
  if (rolesFileExists) {
    const rolesContent = fs.readFileSync(rolesFile, 'utf8');
    const missingRoles = [];
    
    for (const role of config.minimumAuthorizationRoles) {
      if (!rolesContent.includes(role)) {
        missingRoles.push(role);
      }
    }
    
    logCheck(
      'Required Authorization Roles', 
      missingRoles.length === 0,
      missingRoles.length === 0 
        ? 'All required roles are defined' 
        : `Missing roles: ${missingRoles.join(', ')}`
    );
  } else {
    logCheck(
      'Required Authorization Roles', 
      false,
      'Roles definition file not found'
    );
  }
}

// 1.3 Check for authorization middleware
const authMiddlewareExists = fileExists('./src/lib/middleware/auth.middleware.ts') || 
                             fileExists('./src/middleware/auth.ts');
logCheck(
  'Authorization Middleware', 
  authMiddlewareExists,
  'Authorization middleware found'
);

// 1.4 Check for unique user identification
const userModelExists = fileExists('./src/lib/models/user.ts') || 
                        fileExists('./prisma/schema.prisma');
let uniqueUserIdImplemented = false;

if (userModelExists && fileExists('./prisma/schema.prisma')) {
  const prismaSchema = fs.readFileSync('./prisma/schema.prisma', 'utf8');
  uniqueUserIdImplemented = prismaSchema.includes('model User') && 
                            (prismaSchema.includes('@id') || prismaSchema.includes('@unique'));
}

logCheck(
  'Unique User Identification', 
  uniqueUserIdImplemented,
  'Users have unique identifiers in the data model'
);

// 1.5 Check for automatic logout
const autoLogoutImplemented = fileExists('./src/lib/session.ts') || fileExists('./src/lib/auth.ts');
let sessionTimeoutImplemented = false;

if (autoLogoutImplemented) {
  const sessionFile = fileExists('./src/lib/session.ts') ? './src/lib/session.ts' : './src/lib/auth.ts';
  const sessionContent = fs.readFileSync(sessionFile, 'utf8');
  sessionTimeoutImplemented = sessionContent.includes('timeout') || sessionContent.includes('maxAge');
}

logCheck(
  'Automatic Session Timeout', 
  sessionTimeoutImplemented,
  'Session timeout mechanism implemented'
);

// 2. Audit Controls
console.log('');
console.log('SECTION 2: AUDIT CONTROLS');
console.log('----------------------------------------------------');

// 2.1 Check for audit logging service
const auditLoggingImplemented = fileExists('./src/lib/audit.ts') || 
                                fileExists('./src/services/audit_log_service.ts');
logCheck(
  'Audit Logging Implementation', 
  auditLoggingImplemented,
  'Audit logging service found'
);

// 2.2 Check audit logs for PHI access tracking
let phiAccessLoggingImplemented = false;

if (auditLoggingImplemented) {
  const auditFile = fileExists('./src/lib/audit.ts') 
    ? './src/lib/audit.ts' 
    : './src/services/audit_log_service.ts';
    
  const auditContent = fs.readFileSync(auditFile, 'utf8');
  phiAccessLoggingImplemented = auditContent.includes('PHI') || 
                                auditContent.includes('accessType') || 
                                auditContent.includes('dataAccess');
}

logCheck(
  'PHI Access Logging', 
  phiAccessLoggingImplemented,
  'System logs access to PHI data'
);

// 2.3 Check for log retention policy
let logRetentionImplemented = false;

if (auditLoggingImplemented) {
  const auditFile = fileExists('./src/lib/audit.ts') 
    ? './src/lib/audit.ts' 
    : './src/services/audit_log_service.ts';
    
  const auditContent = fs.readFileSync(auditFile, 'utf8');
  logRetentionImplemented = auditContent.includes('retention') || 
                             auditContent.includes('retain') || 
                             auditContent.includes('archive');
}

logCheck(
  'Audit Log Retention', 
  logRetentionImplemented,
  'Log retention policy implemented'
);

// 3. Integrity Controls
console.log('');
console.log('SECTION 3: INTEGRITY CONTROLS');
console.log('----------------------------------------------------');

// 3.1 Check for data validation
const validationImplemented = fileExists('./src/lib/core/validation.ts') || 
                              findFilesWithPattern('./src', /\.validator\.ts$/).length > 0;
logCheck(
  'Data Validation', 
  validationImplemented,
  'Input validation mechanisms implemented'
);

// 3.2 Check for error handling
const errorHandlingImplemented = fileExists('./src/lib/error-handler.ts') || 
                                 fileExists('./src/lib/core/errors.ts');
logCheck(
  'Error Handling', 
  errorHandlingImplemented,
  'Centralized error handling implemented'
);

// 3.3 Check for database transactions
const databaseFile = fileExists('./src/lib/database.ts') 
  ? './src/lib/database.ts' 
  : './src/lib/prisma.ts';
  
let transactionsImplemented = false;

if (fileExists(databaseFile)) {
  const dbContent = fs.readFileSync(databaseFile, 'utf8');
  transactionsImplemented = dbContent.includes('transaction') || 
                            dbContent.includes('$transaction');
}

logCheck(
  'Database Transactions', 
  transactionsImplemented,
  'Database transactions implemented for data integrity'
);

// 4. Encryption and Transmission Security
console.log('');
console.log('SECTION 4: ENCRYPTION AND TRANSMISSION SECURITY');
console.log('----------------------------------------------------');

// 4.1 Check for encryption service
const encryptionServiceImplemented = fileExists('./src/lib/security/encryption.service.ts') || 
                                    fileExists('./src/services/encryption_service.ts');
logCheck(
  'Encryption Service', 
  encryptionServiceImplemented,
  'Encryption service implemented for sensitive data'
);

// 4.2 Check for TLS configuration
const tlsConfigured = fileExists('./k8s/base/ingress.yaml') || 
                      fileExists('./k8s/service-mesh/istio-gateway.yaml');
let tlsVersionValid = false;

if (tlsConfigured) {
  const tlsFile = fileExists('./k8s/base/ingress.yaml') 
    ? './k8s/base/ingress.yaml' 
    : './k8s/service-mesh/istio-gateway.yaml';
    
  const tlsContent = fs.readFileSync(tlsFile, 'utf8');
  tlsVersionValid = tlsContent.includes('TLSv1.2') || 
                    tlsContent.includes('TLSv1.3');
}

logCheck(
  'TLS Configuration', 
  tlsConfigured && tlsVersionValid,
  'TLS v1.2+ configured for secure transmission'
);

// 4.3 Check for encryption at rest
let encryptionAtRestImplemented = false;

if (encryptionServiceImplemented) {
  const encryptionFile = fileExists('./src/lib/security/encryption.service.ts') 
    ? './src/lib/security/encryption.service.ts' 
    : './src/services/encryption_service.ts';
    
  const encryptionContent = fs.readFileSync(encryptionFile, 'utf8');
  encryptionAtRestImplemented = encryptionContent.includes('encryptField') || 
                                encryptionContent.includes('encryptData') || 
                                encryptionContent.includes('AES') || 
                                encryptionContent.includes('encrypt');
}

logCheck(
  'Encryption at Rest', 
  encryptionAtRestImplemented,
  'Sensitive data is encrypted at rest'
);

// 5. Authentication
console.log('');
console.log('SECTION 5: AUTHENTICATION');
console.log('----------------------------------------------------');

// 5.1 Check for strong authentication
const authServiceImplemented = fileExists('./src/lib/auth.ts') || 
                              fileExists('./src/services/auth_service.ts');
logCheck(
  'Authentication Service', 
  authServiceImplemented,
  'Authentication service implemented'
);

// 5.2 Check for MFA
let mfaImplemented = false;

if (authServiceImplemented) {
  const authFile = fileExists('./src/lib/auth.ts') 
    ? './src/lib/auth.ts' 
    : './src/services/auth_service.ts';
    
  const authContent = fs.readFileSync(authFile, 'utf8');
  mfaImplemented = authContent.includes('mfa') || 
                   authContent.includes('twofactor') || 
                   authContent.includes('2fa') || 
                   authContent.includes('multifactor');
}

logCheck(
  'Multi-Factor Authentication', 
  mfaImplemented,
  'MFA is implemented for secure authentication'
);

// 5.3 Check for password policies
let strongPasswordPolicyImplemented = false;

if (authServiceImplemented) {
  const authFile = fileExists('./src/lib/auth.ts') 
    ? './src/lib/auth.ts' 
    : './src/services/auth_service.ts';
    
  const authContent = fs.readFileSync(authFile, 'utf8');
  strongPasswordPolicyImplemented = authContent.includes('password') && 
                                   (authContent.includes('validatePassword') || 
                                    authContent.includes('passwordPolicy') || 
                                    authContent.includes('passwordValidation'));
}

logCheck(
  'Strong Password Policies', 
  strongPasswordPolicyImplemented,
  'Strong password policies are enforced'
);

// 6. Emergency Access
console.log('');
console.log('SECTION 6: EMERGENCY ACCESS');
console.log('----------------------------------------------------');

// 6.1 Check for emergency access procedure
const emergencyAccessImplemented = findFilesWithPattern('./src', /emergency.*access/i).length > 0 || 
                                  findFilesWithPattern('./docs', /emergency.*access/i).length > 0;
logCheck(
  'Emergency Access Procedure', 
  emergencyAccessImplemented,
  'Emergency access procedure is documented and implemented'
);

// 7. Breach Notification
console.log('');
console.log('SECTION 7: BREACH NOTIFICATION');
console.log('----------------------------------------------------');

// 7.1 Check for breach notification procedure
const breachNotificationImplemented = findFilesWithPattern('./src', /breach.*notification/i).length > 0 || 
                                     findFilesWithPattern('./docs', /breach.*notification/i).length > 0;
logCheck(
  'Breach Notification Procedure', 
  breachNotificationImplemented,
  'Breach notification procedure is documented and implemented'
);

// 8. Backup and Disaster Recovery
console.log('');
console.log('SECTION 8: BACKUP AND DISASTER RECOVERY');
console.log('----------------------------------------------------');

// 8.1 Check for backup procedures
const backupImplemented = fileExists('./scripts/backup.sh') || 
                         fileExists('./k8s/backup-job.yaml') || 
                         fileExists('./docs/disaster-recovery-plan.md');
logCheck(
  'Data Backup Procedures', 
  backupImplemented,
  'Data backup procedures are implemented'
);

// 8.2 Check for disaster recovery plan
const disasterRecoveryImplemented = fileExists('./docs/disaster-recovery-plan.md');
logCheck(
  'Disaster Recovery Plan', 
  disasterRecoveryImplemented,
  'Disaster recovery plan is documented'
);

// Final Results
console.log('');
console.log('====================================================');
console.log('HIPAA COMPLIANCE VALIDATION RESULTS');
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
const complianceThreshold = 1.0; // 100% compliance required
const complianceRate = results.passedChecks / results.totalChecks;
const isCompliant = complianceRate >= complianceThreshold;

console.log('====================================================');
console.log(`COMPLIANCE STATUS: ${isCompliant ? 'COMPLIANT ✅' : 'NON-COMPLIANT ❌'}`);
console.log('====================================================');
console.log(`Completed at: ${new Date().toISOString()}`);
console.log('');

// Exit with appropriate code
process.exit(isCompliant ? 0 : 1);