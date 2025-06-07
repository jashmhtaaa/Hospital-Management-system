/**
 * K6 Stress Testing Suite for Hospital Management System
 * Tests system behavior under extreme load conditions
 */

import http from 'k6/http';
import { check, sleep, group } from 'k6';
import { Rate, Trend, Counter, Gauge } from 'k6/metrics';

// Custom metrics for stress testing
const errorRate = new Rate('stress_errors');
const responseTimeTrend = new Trend('stress_response_time');
const apiCallsCounter = new Counter('stress_api_calls');
const activeUsersGauge = new Gauge('active_users');

// Stress test configuration - progressively increasing load
export let options = {
  stages: [
    // Warm up
    { duration: '1m', target: 10 },     // Warm up with 10 users
    { duration: '2m', target: 50 },     // Ramp up to 50 users
    { duration: '3m', target: 100 },    // Increase to 100 users
    { duration: '5m', target: 200 },    // Stress level: 200 users
    { duration: '5m', target: 500 },    // High stress: 500 users
    { duration: '3m', target: 1000 },   // Extreme stress: 1000 users
    { duration: '2m', target: 1500 },   // Breaking point: 1500 users
    { duration: '5m', target: 1000 },   // Stabilize at 1000
    { duration: '5m', target: 500 },    // Recovery: 500 users
    { duration: '3m', target: 100 },    // Cool down: 100 users
    { duration: '2m', target: 0 },      // Ramp down to 0
  ],
  thresholds: {
    // Stress test thresholds - more lenient than load tests
    http_req_duration: ['p(99)<10000'], // 99% of requests under 10s
    http_req_failed: ['rate<0.20'],     // Error rate under 20%
    stress_errors: ['rate<0.20'],       // Custom error rate under 20%
    stress_response_time: ['p(95)<5000'], // 95% response time under 5s
  },
};

const BASE_URL = __ENV.BASE_URL || 'http://localhost:3000';
let authToken = '';

// Critical endpoints for stress testing
const CRITICAL_ENDPOINTS = [
  '/api/health',
  '/api/patients',
  '/api/bills',
  '/api/appointments',
  '/api/ipd/admissions',
  '/api/lab/orders',
];

export function setup() {
  // Debug logging removed
  
  // Authenticate
  const loginResponse = http.post(`${BASE_URL}/api/auth/login`, 
    JSON.stringify({
      email: __ENV.TEST_EMAIL || 'test@hospital.com',
      password: __ENV.TEST_PASSWORD || 'testpassword123'
    }),
    { headers: { 'Content-Type': 'application/json' } }
  );
  
  if (loginResponse.status === 200) {
    const body = JSON.parse(loginResponse.body);
    authToken = body.tokens?.accessToken || '';
    // Debug logging removed
  }
  
  return { authToken };
}

export default function(data) {
  activeUsersGauge.add(1);
  
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${data.authToken || authToken}`,
  };

  // Random selection of test scenarios to simulate real-world usage
  const scenario = Math.floor(Math.random() * 6);
  
  switch (scenario) {
    case 0:
      stressTestHealthChecks();
      break;
    case 1:
      stressTestPatientOperations(headers);
      break;
    case 2:
      stressTestBillingOperations(headers);
      break;
    case 3:
      stressTestAppointmentOperations(headers);
      break;
    case 4:
      stressTestLabOperations(headers);
      break;
    case 5:
      stressTestIPDOperations(headers);
      break;
  }

  // Simulate user think time (shorter for stress testing)
  sleep(Math.random() * 1 + 0.5); // 0.5-1.5 seconds
  
  activeUsersGauge.add(-1);
}

function stressTestHealthChecks() {
  group('Stress: Health Checks', function() {
    CRITICAL_ENDPOINTS.forEach(endpoint => {
      const response = http.get(`${BASE_URL}${endpoint}`);
      
      check(response, {
        [`${endpoint} stress response`]: (r) => r.status < 500,
        [`${endpoint} stress time under 10s`]: (r) => r.timings.duration < 10000,
      });
      
      recordStressMetrics(response, `health_${endpoint.replace(/\//g, '_')}`);
    });
  });
}

function stressTestPatientOperations(headers) {
  group('Stress: Patient Operations', function() {
    // Simulate multiple concurrent patient lookups
    const patientRequests = [
      http.get(`${BASE_URL}/api/patients?limit=20`, { headers }),
      http.get(`${BASE_URL}/api/patients/search?q=stress`, { headers }),
      http.get(`${BASE_URL}/api/patients?page=2&limit=15`, { headers }),
    ];
    
    patientRequests.forEach((response, index) => {
      check(response, {
        [`patient operation ${index} status`]: (r) => r.status < 500,
        [`patient operation ${index} under 8s`]: (r) => r.timings.duration < 8000,
      });
      recordStressMetrics(response, `patient_op_${index}`);
    });
  });
}

function stressTestBillingOperations(headers) {
  group('Stress: Billing Operations', function() {
    // High-frequency billing operations
    const responses = [
      http.get(`${BASE_URL}/api/bills?limit=50`, { headers }),
      http.get(`${BASE_URL}/api/bills/outstanding-summary`, { headers }),
      http.get(`${BASE_URL}/api/bills?status=PENDING&limit=30`, { headers }),
    ];
    
    responses.forEach((response, index) => {
      check(response, {
        [`billing stress ${index} responsive`]: (r) => r.status < 500,
        [`billing stress ${index} under 6s`]: (r) => r.timings.duration < 6000,
      });
      recordStressMetrics(response, `billing_stress_${index}`);
    });
    
    // Simulate creating bills under stress
    if (Math.random() < 0.3) { // 30% chance to create a bill
      const billData = {
        patientId: `stress-patient-${Math.floor(Math.random() * 1000)}`,
        visitType: 'OPD',
        billType: 'Regular',
        items: [{
          serviceItemId: 'stress-service-1',
          quantity: 1,
          unitPrice: Math.floor(Math.random() * 500) + 50
        }]
      };
      
      const createResponse = http.post(
        `${BASE_URL}/api/bills`,
        JSON.stringify(billData),
        { headers }
      );
      recordStressMetrics(createResponse, 'billing_create_stress');
    }
  });
}

function stressTestAppointmentOperations(headers) {
  group('Stress: Appointment Operations', function() {
    const today = new Date().toISOString().split('T')[0];
    const doctorId = `stress-doctor-${Math.floor(Math.random() * 20)}`;
    
    const responses = [
      http.get(`${BASE_URL}/api/appointments?limit=40`, { headers }),
      http.get(`${BASE_URL}/api/appointments/doctor/${doctorId}?date=${today}`, { headers }),
      http.get(`${BASE_URL}/api/appointments?status=SCHEDULED&limit=25`, { headers }),
    ];
    
    responses.forEach((response, index) => {
      check(response, {
        [`appointment stress ${index} available`]: (r) => r.status < 500,
        [`appointment stress ${index} responsive`]: (r) => r.timings.duration < 7000,
      });
      recordStressMetrics(response, `appointment_stress_${index}`);
    });
  });
}

function stressTestLabOperations(headers) {
  group('Stress: Lab Operations', function() {
    const responses = [
      http.get(`${BASE_URL}/api/lab/orders?limit=35`, { headers }),
      http.get(`${BASE_URL}/api/lab/critical-results`, { headers }),
      http.get(`${BASE_URL}/api/lab/orders?status=PENDING&limit=20`, { headers }),
    ];
    
    responses.forEach((response, index) => {
      check(response, {
        [`lab stress ${index} functioning`]: (r) => r.status < 500,
        [`lab stress ${index} timely`]: (r) => r.timings.duration < 8000,
      });
      recordStressMetrics(response, `lab_stress_${index}`);
    });
  });
}

function stressTestIPDOperations(headers) {
  group('Stress: IPD Operations', function() {
    const responses = [
      http.get(`${BASE_URL}/api/ipd/admissions?limit=30`, { headers }),
      http.get(`${BASE_URL}/api/ipd/ward-occupancy`, { headers }),
      http.get(`${BASE_URL}/api/ipd/admissions?status=ACTIVE&limit=25`, { headers }),
    ];
    
    responses.forEach((response, index) => {
      check(response, {
        [`ipd stress ${index} operational`]: (r) => r.status < 500,
        [`ipd stress ${index} responsive`]: (r) => r.timings.duration < 9000,
      });
      recordStressMetrics(response, `ipd_stress_${index}`);
    });
  });
}

function recordStressMetrics(response, operation) {
  apiCallsCounter.add(1, { operation });
  responseTimeTrend.add(response.timings.duration, { operation });
  
  const isError = response.status >= 500; // Only 5xx errors count as failures in stress tests
  errorRate.add(isError, { operation });
  
  if (isError) {
    // Debug logging removed
  }
  
  // Log critical performance degradation
  if (response.timings.duration > 5000) {
    // Debug logging removed
  }
}

export function teardown(data) {
  // Debug logging removed
  // Debug logging removed
}

export function handleSummary(data) {
  const report = generateStressTestReport(data);
  
  return {
    'stress-test-results.json': JSON.stringify(data, null, 2),
    'stress-test-report.html': report,
    stdout: `
🔥 STRESS TEST SUMMARY
======================
Max Users: ${data.options?.stages?.reduce((max, stage) => Math.max(max, stage.target), 0) || 0}
Total Requests: ${data.metrics?.http_reqs?.values?.count || 0}
Error Rate: ${((data.metrics?.http_req_failed?.values?.rate || 0) * 100).toFixed(2)}%
99th Percentile: ${Math.round(data.metrics?.http_req_duration?.values?.['p(99)'] || 0)}ms
RPS Peak: ${Math.round(data.metrics?.http_reqs?.values?.rate || 0)}

${data.metrics?.http_req_failed?.values?.rate > 0.20 ? '❌ SYSTEM BREAKING POINT REACHED' : '✅ SYSTEM STABLE UNDER STRESS'}
    `,
  };
}

function generateStressTestReport(data) {
  const maxUsers = data.options?.stages?.reduce((max, stage) => Math.max(max, stage.target), 0) || 0;
  const errorRate = (data.metrics?.http_req_failed?.values?.rate || 0) * 100;
  const p99ResponseTime = Math.round(data.metrics?.http_req_duration?.values?.['p(99)'] || 0);
  
  return `
    <!DOCTYPE html>
    <html>
    <head>
        <title>HMS Stress Test Results</title>
        <style>
            body { font-family: Arial, sans-serif; margin: 20px; background: #f5f5f5; }
            .container { max-width: 1200px; margin: 0 auto; background: white; padding: 20px; border-radius: 8px; }
            .header { text-align: center; color: #d73527; margin-bottom: 30px; }
            .metric { margin: 15px 0; padding: 15px; border-radius: 5px; }
            .critical { background: #fff5f5; border-left: 4px solid #dc3545; }
            .warning { background: #fff8e1; border-left: 4px solid #ffc107; }
            .good { background: #f8fff8; border-left: 4px solid #28a745; }
            .chart-placeholder { height: 200px; background: #f8f9fa; border: 1px dashed #dee2e6; margin: 20px 0; display: flex; align-items: center; justify-content: center; color: #6c757d; }
            table { width: 100%; border-collapse: collapse; margin: 20px 0; }
            th, td { padding: 12px; text-align: left; border-bottom: 1px solid #dee2e6; }
            th { background: #f8f9fa; font-weight: 600; }
            .status-indicator { padding: 4px 8px; border-radius: 4px; font-size: 12px; font-weight: bold; }
            .status-pass { background: #d4edda; color: #155724; }
            .status-fail { background: #f8d7da; color: #721c24; }
            .recommendations { background: #e3f2fd; padding: 20px; border-radius: 5px; margin: 20px 0; }
            .rec-list { margin: 10px 0; padding-left: 20px; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>🔥 Hospital Management System - Stress Test Results</h1>
                <p>System Breaking Point Analysis</p>
            </div>

            <div class="metric ${errorRate > 20 ? 'critical' : errorRate > 10 ? 'warning' : 'good'}">
                <h3>🎯 Test Summary</h3>
                <p><strong>Maximum Concurrent Users:</strong> ${maxUsers}</p>
                <p><strong>Total Requests:</strong> ${data.metrics?.http_reqs?.values?.count || 0}</p>
                <p><strong>Test Duration:</strong> ${Math.round((data.state?.testRunDurationMs || 0) / 1000)}s</p>
                <p><strong>Peak RPS:</strong> ${Math.round(data.metrics?.http_reqs?.values?.rate || 0)}</p>
            </div>

            <div class="metric ${errorRate > 20 ? 'critical' : errorRate > 10 ? 'warning' : 'good'}">
                <h3>⚡ Performance Under Stress</h3>
                <p><strong>Error Rate:</strong> ${errorRate.toFixed(2)}% ${errorRate > 20 ? '❌ CRITICAL' : errorRate > 10 ? '⚠️ WARNING' : '✅ GOOD'}</p>
                <p><strong>99th Percentile Response Time:</strong> ${p99ResponseTime}ms</p>
                <p><strong>Average Response Time:</strong> ${Math.round(data.metrics?.http_req_duration?.values?.avg ||
                  0)}ms</p>
                <p><strong>System Status:</strong> ${errorRate > 20 ? '🔥 BREAKING POINT REACHED' : '✅ STABLE UNDER STRESS'}</p>
            </div>

            <div class="chart-placeholder">
                📊 Performance Charts Would Be Generated Here<br/>
                (Response Time vs. User Load, Error Rate Timeline, Throughput Analysis)
            </div>

            <h3>📊 Detailed Metrics</h3>
            <table>
                <tr>
                    <th>Metric</th>
                    <th>Value</th>
                    <th>Threshold</th>
                    <th>Status</th>
                </tr>
                <tr>
                    <td>Error Rate</td>
                    <td>${errorRate.toFixed(2)}%</td>
                    <td>&lt; 20%</td>
                    <td><span class="status-indicator ${errorRate < 20 ? 'status-pass' : 'status-fail'}">${errorRate < 20 ? 'PASS' : 'FAIL'}</span></td>
                </tr>
                <tr>
                    <td>99th Percentile Response</td>
                    <td>${p99ResponseTime}ms</td>
                    <td>&lt; 10,000ms</td>
                    <td><span class="status-indicator ${p99ResponseTime < 10000 ? 'status-pass' : 'status-fail'}">${p99ResponseTime < 10000 ? 'PASS' : 'FAIL'}</span></td>
                </tr>
                <tr>
                    <td>Peak Throughput</td>
                    <td>${Math.round(data.metrics?.http_reqs?.values?.rate || 0)} RPS</td>
                    <td>Monitor</td>
                    <td><span class="status-indicator status-pass">INFO</span></td>
                </tr>
            </table>

            <div class="recommendations">
                <h3>🎯 Recommendations & Action Items</h3>
                <div class="rec-list">
                    ${errorRate > 20 ? 
                      '<li>🚨 <strong>CRITICAL:</strong> System reached breaking point. Immediate capacity planning required.</li>' : 
                      '<li>✅ System handled stress well. Consider this as baseline capacity.</li>'}
                    ${p99ResponseTime > 5000 ? 
                      '<li>⚠️ Response times degraded significantly under load. Database optimization recommended.</li>' : 
                      '<li>✅ Response times remained acceptable under stress.</li>'}
                    ${data.metrics?.http_reqs?.values?.rate < 100 ? 
                      '<li>💡 Throughput could be improved. Consider connection pooling and caching optimizations.</li>' : 
                      '<li>✅ Good throughput performance under stress.</li>'}
                    <li>📊 Use these results for capacity planning and scaling decisions.</li>
                    <li>🔄 Run stress tests regularly as system usage grows.</li>
                    <li>⚖️ Consider implementing circuit breakers and rate limiting based on these findings.</li>
                </div>
            </div>

            <div class="metric">
                <h3>🎯 Next Steps</h3>
                <p>1. <strong>Capacity Planning:</strong> Use max user count (${maxUsers}) as baseline for infrastructure scaling</p>
                <p>2. <strong>Performance Tuning:</strong> Focus on endpoints that showed degradation first</p>
                <p>3. <strong>Monitoring:</strong> Set up alerts based on these thresholds in production</p>
                <p>4. <strong>Regular Testing:</strong> Run monthly stress tests to track performance trends</p>
            </div>

            <p style="text-align: center; color: #6c757d; margin-top: 40px;">
                <em>Generated on: ${new Date().toISOString()}</em><br/>
                <em>Hospital Management System - Enterprise Stress Testing</em>
            </p>
        </div>
    </body>
    </html>
  `;
}
