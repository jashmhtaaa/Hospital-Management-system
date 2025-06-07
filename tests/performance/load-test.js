/**
 * K6 Load Testing Suite for Hospital Management System
 * Comprehensive performance testing covering all critical endpoints
 */

import http from 'k6/http';
import { check, sleep, group } from 'k6';
import { Rate, Trend, Counter } from 'k6/metrics';

// Custom metrics
const errorRate = new Rate('errors');
const responseTimeTrend = new Trend('response_time');
const apiCallsCounter = new Counter('api_calls');

// Test configuration
export let options = {
  stages: [
    // Ramp up
    { duration: '2m', target: 10 },   // Ramp up to 10 users over 2 minutes
    { duration: '5m', target: 10 },   // Stay at 10 users for 5 minutes
    { duration: '2m', target: 20 },   // Ramp up to 20 users over 2 minutes
    { duration: '5m', target: 20 },   // Stay at 20 users for 5 minutes
    { duration: '2m', target: 50 },   // Ramp up to 50 users over 2 minutes
    { duration: '5m', target: 50 },   // Stay at 50 users for 5 minutes
    { duration: '5m', target: 0 },    // Ramp down to 0 users over 5 minutes
  ],
  thresholds: {
    // Performance thresholds
    http_req_duration: ['p(95)<2000'], // 95% of requests must complete within 2s
    http_req_failed: ['rate<0.05'],    // Error rate must be less than 5%
    errors: ['rate<0.05'],             // Custom error rate threshold
    response_time: ['p(95)<2000'],     // 95% response time under 2s
  },
};

// Base URL configuration
const BASE_URL = __ENV.BASE_URL || 'http://localhost:3000';

// Test data
const TEST_PATIENTS = [
  { mrn: 'MRN001', firstName: 'John', lastName: 'Doe' },
  { mrn: 'MRN002', firstName: 'Jane', lastName: 'Smith' },
  { mrn: 'MRN003', firstName: 'Bob', lastName: 'Johnson' },
];

const TEST_CREDENTIALS = {
  email: __ENV.TEST_EMAIL || 'test@hospital.com',
  password: __ENV.TEST_PASSWORD || 'testpassword123'
};

// Authentication token storage
let authToken = '';

export function setup() {
  // Debug logging removed
  
  // Authenticate and get token
  const loginResponse = http.post(`${BASE_URL}/api/auth/login`, 
    JSON.stringify(TEST_CREDENTIALS),
    {
      headers: { 'Content-Type': 'application/json' },
    }
  );
  
  if (loginResponse.status === 200) {
    const body = JSON.parse(loginResponse.body);
    authToken = body.tokens?.accessToken || '';
    // Debug logging removed
  } else {
    // Debug logging removed
  }
  
  return { authToken };
}

export default function(data) {
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${data.authToken || authToken}`,
  };

  group('Health Check Tests', function() {
    testHealthEndpoints();
  });

  group('Patient Management Tests', function() {
    testPatientEndpoints(headers);
  });

  group('Billing System Tests', function() {
    testBillingEndpoints(headers);
  });

  group('Appointment System Tests', function() {
    testAppointmentEndpoints(headers);
  });

  group('Lab Management Tests', function() {
    testLabEndpoints(headers);
  });

  group('IPD Management Tests', function() {
    testIPDEndpoints(headers);
  });

  // Random sleep between 1-3 seconds to simulate user behavior
  sleep(Math.random() * 2 + 1);
}

function testHealthEndpoints() {
  group('Health Endpoints', function() {
    // Main health check
    let response = http.get(`${BASE_URL}/api/health`);
    check(response, {
      'health check status is 200': (r) => r.status === 200,
      'health check response time < 500ms': (r) => r.timings.duration < 500,
      'health status is healthy': (r) => {
        try {
          const body = JSON.parse(r.body);
          return body.status === 'healthy';
        } catch (e) {
          return false;
        }
      },
    });
    recordMetrics(response, 'health_check');

    // Database health check
    response = http.get(`${BASE_URL}/api/health/db`);
    check(response, {
      'db health check status is 200': (r) => r.status === 200,
      'db health check response time < 1000ms': (r) => r.timings.duration < 1000,
    });
    recordMetrics(response, 'db_health_check');

    // Cache health check
    response = http.get(`${BASE_URL}/api/health/cache`);
    check(response, {
      'cache health check status is 200': (r) => r.status === 200,
      'cache health check response time < 500ms': (r) => r.timings.duration < 500,
    });
    recordMetrics(response, 'cache_health_check');
  });
}

function testPatientEndpoints(headers) {
  group('Patient Operations', function() {
    // Get patients list
    let response = http.get(`${BASE_URL}/api/patients?limit=20`, { headers });
    check(response, {
      'get patients status is 200': (r) => r.status === 200,
      'get patients response time < 1500ms': (r) => r.timings.duration < 1500,
      'patients list is not empty': (r) => {
        try {
          const body = JSON.parse(r.body);
          return Array.isArray(body) && body.length > 0;
        } catch (e) {
          return false;
        }
      },
    });
    recordMetrics(response, 'get_patients');

    // Search patients
    response = http.get(`${BASE_URL}/api/patients/search?q=John`, { headers });
    check(response, {
      'search patients status is 200': (r) => r.status === 200,
      'search patients response time < 1000ms': (r) => r.timings.duration < 1000,
    });
    recordMetrics(response, 'search_patients');

    // Get patient with details (simulating the optimized query)
    const patientId = 'patient-' + Math.floor(Math.random() * 100);
    response = http.get(`${BASE_URL}/api/patients/${patientId}?include=bills,appointments`, { headers });
    recordMetrics(response, 'get_patient_with_details');
  });
}

function testBillingEndpoints(headers) {
  group('Billing Operations', function() {
    // Get bills
    let response = http.get(`${BASE_URL}/api/bills?limit=50`, { headers });
    check(response, {
      'get bills status is 200': (r) => r.status === 200,
      'get bills response time < 2000ms': (r) => r.timings.duration < 2000,
    });
    recordMetrics(response, 'get_bills');

    // Get bills with items (optimized query test)
    response = http.get(`${BASE_URL}/api/bills?include=items,payments&limit=20`, { headers });
    check(response, {
      'get bills with items response time < 2500ms': (r) => r.timings.duration < 2500,
    });
    recordMetrics(response, 'get_bills_with_items');

    // Outstanding bills summary
    response = http.get(`${BASE_URL}/api/bills/outstanding-summary`, { headers });
    check(response, {
      'outstanding summary status is 200': (r) => r.status === 200,
      'outstanding summary response time < 1000ms': (r) => r.timings.duration < 1000,
    });
    recordMetrics(response, 'outstanding_bills_summary');

    // Create bill (POST test)
    const billData = {
      patientId: 'patient-' + Math.floor(Math.random() * 100),
      visitType: 'OPD',
      billType: 'Regular',
      items: [
        {
          serviceItemId: 'service-1',
          quantity: 1,
          unitPrice: 100.00
        }
      ]
    };
    
    response = http.post(`${BASE_URL}/api/bills`, JSON.stringify(billData), { headers });
    recordMetrics(response, 'create_bill');
  });
}

function testAppointmentEndpoints(headers) {
  group('Appointment Operations', function() {
    // Get appointments
    let response = http.get(`${BASE_URL}/api/appointments?limit=30`, { headers });
    check(response, {
      'get appointments status is 200': (r) => r.status === 200,
      'get appointments response time < 1500ms': (r) => r.timings.duration < 1500,
    });
    recordMetrics(response, 'get_appointments');

    // Doctor's schedule (optimized query)
    const doctorId = 'doctor-' + Math.floor(Math.random() * 10);
    const today = new Date().toISOString().split('T')[0];
    response = http.get(`${BASE_URL}/api/appointments/doctor/${doctorId}?date=${today}`, { headers });
    check(response, {
      'doctor schedule response time < 1000ms': (r) => r.timings.duration < 1000,
    });
    recordMetrics(response, 'doctor_schedule');

    // Available slots
    response = http.get(`${BASE_URL}/api/appointments/available-slots?doctorId=${doctorId}&date=${today}`, { headers });
    recordMetrics(response, 'available_slots');
  });
}

function testLabEndpoints(headers) {
  group('Laboratory Operations', function() {
    // Get lab orders
    let response = http.get(`${BASE_URL}/api/lab/orders?limit=30`, { headers });
    check(response, {
      'get lab orders status is 200': (r) => r.status === 200,
      'get lab orders response time < 1500ms': (r) => r.timings.duration < 1500,
    });
    recordMetrics(response, 'get_lab_orders');

    // Lab orders with results (optimized query test)
    response = http.get(`${BASE_URL}/api/lab/orders?include=results,tests&limit=20`, { headers });
    check(response, {
      'lab orders with results response time < 2000ms': (r) => r.timings.duration < 2000,
    });
    recordMetrics(response, 'lab_orders_with_results');

    // Critical results
    response = http.get(`${BASE_URL}/api/lab/critical-results`, { headers });
    check(response, {
      'critical results response time < 500ms': (r) => r.timings.duration < 500,
    });
    recordMetrics(response, 'critical_lab_results');
  });
}

function testIPDEndpoints(headers) {
  group('IPD Operations', function() {
    // Get admissions
    let response = http.get(`${BASE_URL}/api/ipd/admissions?limit=30`, { headers });
    check(response, {
      'get admissions status is 200': (r) => r.status === 200,
      'get admissions response time < 2000ms': (r) => r.timings.duration < 2000,
    });
    recordMetrics(response, 'get_admissions');

    // Admissions with details (optimized query test)
    response = http.get(`${BASE_URL}/api/ipd/admissions?include=vitals,medications&limit=15`, { headers });
    check(response, {
      'admissions with details response time < 2500ms': (r) => r.timings.duration < 2500,
    });
    recordMetrics(response, 'admissions_with_details');

    // Ward occupancy
    response = http.get(`${BASE_URL}/api/ipd/ward-occupancy`, { headers });
    check(response, {
      'ward occupancy response time < 1000ms': (r) => r.timings.duration < 1000,
    });
    recordMetrics(response, 'ward_occupancy');
  });
}

function recordMetrics(response, operation) {
  // Record custom metrics
  apiCallsCounter.add(1, { operation });
  responseTimeTrend.add(response.timings.duration, { operation });
  
  const isError = response.status >= 400;
  errorRate.add(isError, { operation });
  
  if (isError) {
    // Debug logging removed
  }
}

export function teardown(data) {
  // Debug logging removed
  // Debug logging removed
}

export function handleSummary(data) {
  return {
    'performance-results.json': JSON.stringify(data, null, 2),
    'performance-summary.html': generateHTMLReport(data),
  };
}

function generateHTMLReport(data) {
  const template = `
    <!DOCTYPE html>
    <html>
    <head>
        <title>HMS Performance Test Results</title>
        <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            .metric { margin: 10px 0; padding: 10px; border-left: 4px solid #007cba; }
            .pass { border-left-color: #28a745; }
            .fail { border-left-color: #dc3545; }
            table { border-collapse: collapse; width: 100%; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #f2f2f2; }
        </style>
    </head>
    <body>
        <h1>Hospital Management System - Performance Test Results</h1>
        <h2>Test Summary</h2>
        <p><strong>Test Duration:</strong> ${data.state?.testRunDurationMs || 0}ms</p>
        <p><strong>Virtual Users:</strong> ${data.options?.stages?.reduce((max, stage) => Math.max(max, stage.target), 0) ||
          0}</p>
        
        <h2>Key Metrics</h2>
        <div class="metric ${data.metrics?.http_req_duration?.values?.['p(95)'] < 2000 ? 'pass' : 'fail'}">
            <strong>95th Percentile Response Time:</strong> ${Math.round(data.metrics?.http_req_duration?.values?.['p(95)'] ||
              0)}ms
            (Threshold: < 2000ms)
        </div>
        
        <div class="metric ${data.metrics?.http_req_failed?.values?.rate < 0.05 ? 'pass' : 'fail'}">
            <strong>Error Rate:</strong> ${((data.metrics?.http_req_failed?.values?.rate || 0) * 100).toFixed(2)}%
            (Threshold: < 5%)
        </div>
        
        <div class="metric">
            <strong>Total Requests:</strong> ${data.metrics?.http_reqs?.values?.count || 0}
        </div>
        
        <div class="metric">
            <strong>Average Response Time:</strong> ${Math.round(data.metrics?.http_req_duration?.values?.avg || 0)}ms
        </div>
        
        <h2>Detailed Metrics</h2>
        <table>
            <tr>
                <th>Metric</th>
                <th>Value</th>
                <th>Threshold</th>
                <th>Status</th>
            </tr>
            <tr>
                <td>95th Percentile Response Time</td>
                <td>${Math.round(data.metrics?.http_req_duration?.values?.['p(95)'] || 0)}ms</td>
                <td>&lt; 2000ms</td>
                <td>${data.metrics?.http_req_duration?.values?.['p(95)'] < 2000 ? '✅ PASS' : '❌ FAIL'}</td>
            </tr>
            <tr>
                <td>Error Rate</td>
                <td>${((data.metrics?.http_req_failed?.values?.rate || 0) * 100).toFixed(2)}%</td>
                <td>&lt; 5%</td>
                <td>${data.metrics?.http_req_failed?.values?.rate < 0.05 ? '✅ PASS' : '❌ FAIL'}</td>
            </tr>
            <tr>
                <td>Requests per Second</td>
                <td>${Math.round(data.metrics?.http_reqs?.values?.rate || 0)}</td>
                <td>-</td>
                <td>-</td>
            </tr>
        </table>
        
        <h2>Recommendations</h2>
        <ul>
            ${data.metrics?.http_req_duration?.values?.['p(95)'] > 2000 ? 
              '<li>⚠️ Response times are above threshold. Consider database query optimization.</li>' : 
              '<li>✅ Response times are within acceptable limits.</li>'}
            ${data.metrics?.http_req_failed?.values?.rate > 0.05 ? 
              '<li>⚠️ Error rate is above threshold. Check application logs for issues.</li>' : 
              '<li>✅ Error rate is within acceptable limits.</li>'}
            ${data.metrics?.http_reqs?.values?.rate < 50 ? 
              '<li>💡 Consider optimizing for higher throughput if needed.</li>' : 
              '<li>✅ Good throughput performance.</li>'}
        </ul>
        
        <p><em>Generated on: ${new Date().toISOString()}</em></p>
    </body>
    </html>
  `;
  
  return template;
}
