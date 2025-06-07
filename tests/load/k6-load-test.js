import { check, group, sleep } from 'k6';
import http from 'k6/http';
import { Trend, Rate, Counter } from 'k6/metrics';
import { randomItem, randomIntBetween } from 'https://jslib.k6.io/k6-utils/1.2.0/index.js';
import { uuidv4 } from 'https://jslib.k6.io/k6-utils/1.4.0/index.js';
import encoding from 'k6/encoding';

// Custom metrics
const apiLatency = new Trend('api_latency', true);
const failRate = new Rate('failed_requests');
const successRate = new Rate('successful_requests');
const apiCalls = new Counter('api_calls');

// Test configuration
export const options = {
  scenarios: {
    // Sustained load test
    sustained_load: {
      executor: 'ramping-vus',
      startVUs: 50,
      stages: [
        { duration: '5m', target: 500 },    // Ramp up to 500 users over 5 minutes
        { duration: '15m', target: 500 },   // Stay at 500 users for 15 minutes
        { duration: '5m', target: 0 },      // Ramp down to 0 users over 5 minutes
      ],
      gracefulRampDown: '2m',
    },
    
    // Spike test
    spike_test: {
      executor: 'ramping-vus',
      startVUs: 0,
      stages: [
        { duration: '2m', target: 100 },    // Ramp up to 100 users
        { duration: '1m', target: 100 },    // Stay at 100 users
        { duration: '30s', target: 1000 },  // Spike to 1000 users
        { duration: '1m', target: 1000 },   // Stay at 1000 users
        { duration: '1m', target: 100 },    // Ramp down to 100 users
        { duration: '1m', target: 0 },      // Ramp down to 0 users
      ],
      gracefulRampDown: '1m',
    },
    
    // Stress test
    stress_test: {
      executor: 'ramping-arrival-rate',
      startRate: 10,                        // Starting arrival rate (requests per second)
      timeUnit: '1s',
      preAllocatedVUs: 500,
      maxVUs: 3000,
      stages: [
        { duration: '5m', target: 100 },    // Ramp up to 100 RPS
        { duration: '10m', target: 500 },   // Ramp up to 500 RPS
        { duration: '10m', target: 1000 },  // Ramp up to 1000 RPS
        { duration: '5m', target: 0 },      // Ramp down to 0 RPS
      ],
    },
    
    // Soak test
    soak_test: {
      executor: 'constant-vus',
      vus: 200,
      duration: '2h',
    },
  },
  thresholds: {
    http_req_duration: ['p95<500', 'p99<1000'],        // 95% of requests should be below 500ms, 99% below 1s
    http_req_failed: ['rate<0.01'],                    // Error rate should be below 1%
    'api_latency{endpoint:patients}': ['p95<300'],     // 95% of patient API requests should be below 300ms
    'api_latency{endpoint:appointments}': ['p95<400'], // 95% of appointment API requests should be below 400ms
    'api_latency{endpoint:billing}': ['p95<600'],      // 95% of billing API requests should be below 600ms
  },
  summaryTrendStats: ['min', 'med', 'avg', 'p(90)', 'p(95)', 'p(99)', 'max', 'count'],
};

// Load environment variables from file
const ENV = JSON.parse(open('./test-env.json'));

// Setup
const BASE_URL = ENV.BASE_URL || 'https://api.hms.health';
const AUTH_URL = ENV.AUTH_URL || 'https://auth.hms.health';
const CLIENT_ID = ENV.CLIENT_ID;
const CLIENT_SECRET = ENV.CLIENT_SECRET;

// Authentication function
function getAuthToken() {
  const credentials = `${CLIENT_ID}:${CLIENT_SECRET}`;
  const encodedCredentials = encoding.b64encode(credentials);
  
  const params = {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': `Basic ${encodedCredentials}`
    },
  };
  
  const data = {
    grant_type: 'client_credentials',
    scope: 'api.full_access'
  };
  
  const response = http.post(`${AUTH_URL}/oauth/token`, data, params);
  
  check(response, {
    'Auth token obtained': (r) => r.status === 200 && r.json('access_token') !== undefined,
  });
  
  if (response.status !== 200) {
    console.error(`Authentication failed: ${response.status} ${response.body}`);
    return null;
  }
  
  return response.json('access_token');
}

// Cached user data
const userCache = new Array(100);

// Setup function (executed once per VU)
export function setup() {
  const token = getAuthToken();
  
  if (!token) {
    throw new Error('Authentication failed in setup');
  }
  
  // Prefetch some patient data for faster tests
  const headers = {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  };
  
  const prefetchResponse = http.get(`${BASE_URL}/api/patients?limit=100`, { headers });
  
  if (prefetchResponse.status === 200) {
    const patients = prefetchResponse.json('data');
    if (patients && patients.length > 0) {
      for (let i = 0; i < Math.min(patients.length, 100); i++) {
        userCache[i] = patients[i];
      }
    }
  }
  
  return { token };
}

// Test lifecycle management
export default function(data) {
  const token = data.token;
  
  // Make sure we have a valid token
  if (!token) {
    console.error('No valid token available, skipping requests');
    failRate.add(1);
    return;
  }
  
  // Common headers
  const headers = {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
    'X-Request-ID': uuidv4(),
  };
  
  // Random user selection
  const randomUserIndex = randomIntBetween(0, userCache.length - 1);
  const randomUserId = userCache[randomUserIndex]?.id || uuidv4();
  
  // Random sleep between requests (simulating user behavior)
  sleep(randomIntBetween(1, 3));
  
  // Patients API Tests
  group('Patients API', function() {
    // List patients
    const listResponse = http.get(`${BASE_URL}/api/patients?limit=20&offset=0`, { headers });
    
    apiCalls.add(1);
    apiLatency.add(listResponse.timings.duration, { endpoint: 'patients' });
    
    check(listResponse, {
      'Patients list status is 200': (r) => r.status === 200,
      'Patients list has data': (r) => r.json('data') !== undefined && r.json('data').length > 0,
    }) ? successRate.add(1) : failRate.add(1);
    
    if (listResponse.status === 200) {
      // Get a specific patient
      const getResponse = http.get(`${BASE_URL}/api/patients/${randomUserId}`, { headers });
      
      apiCalls.add(1);
      apiLatency.add(getResponse.timings.duration, { endpoint: 'patients' });
      
      check(getResponse, {
        'Patient get status is 200': (r) => r.status === 200,
        'Patient data has id': (r) => r.json('id') !== undefined,
      }) ? successRate.add(1) : failRate.add(1);
      
      // Search patients
      const searchResponse = http.get(`${BASE_URL}/api/patients/search?query=john&limit=10`, { headers });
      
      apiCalls.add(1);
      apiLatency.add(searchResponse.timings.duration, { endpoint: 'patients' });
      
      check(searchResponse, {
        'Patient search status is 200': (r) => r.status === 200,
      }) ? successRate.add(1) : failRate.add(1);
    }
  });
  
  // Appointments API Tests
  group('Appointments API', function() {
    // List appointments
    const listResponse = http.get(`${BASE_URL}/api/appointments?limit=20&offset=0`, { headers });
    
    apiCalls.add(1);
    apiLatency.add(listResponse.timings.duration, { endpoint: 'appointments' });
    
    check(listResponse, {
      'Appointments list status is 200': (r) => r.status === 200,
    }) ? successRate.add(1) : failRate.add(1);
    
    // Create an appointment
    const appointmentData = {
      patientId: randomUserId,
      doctorId: `DOC-${randomIntBetween(1000, 9999)}`,
      startTime: new Date(Date.now() + 86400000).toISOString(), // tomorrow
      endTime: new Date(Date.now() + 86400000 + 1800000).toISOString(), // tomorrow + 30 minutes
      notes: 'Load test appointment',
      status: 'scheduled',
      type: 'consultation'
    };
    
    const createResponse = http.post(`${BASE_URL}/api/appointments`, JSON.stringify(appointmentData), { headers });
    
    apiCalls.add(1);
    apiLatency.add(createResponse.timings.duration, { endpoint: 'appointments' });
    
    check(createResponse, {
      'Appointment create status is 201': (r) => r.status === 201,
      'Appointment created with id': (r) => r.json('id') !== undefined,
    }) ? successRate.add(1) : failRate.add(1);
    
    if (createResponse.status === 201) {
      const appointmentId = createResponse.json('id');
      
      // Get the appointment
      const getResponse = http.get(`${BASE_URL}/api/appointments/${appointmentId}`, { headers });
      
      apiCalls.add(1);
      apiLatency.add(getResponse.timings.duration, { endpoint: 'appointments' });
      
      check(getResponse, {
        'Appointment get status is 200': (r) => r.status === 200,
        'Appointment has correct id': (r) => r.json('id') === appointmentId,
      }) ? successRate.add(1) : failRate.add(1);
      
      // Update the appointment
      const updateData = {
        notes: 'Updated load test appointment',
        status: 'confirmed'
      };
      
      const updateResponse = http.patch(`${BASE_URL}/api/appointments/${appointmentId}`, JSON.stringify(updateData), { headers });
      
      apiCalls.add(1);
      apiLatency.add(updateResponse.timings.duration, { endpoint: 'appointments' });
      
      check(updateResponse, {
        'Appointment update status is 200': (r) => r.status === 200,
      }) ? successRate.add(1) : failRate.add(1);
    }
  });
  
  // Billing API Tests
  group('Billing API', function() {
    // List invoices
    const listResponse = http.get(`${BASE_URL}/api/billing/invoices?limit=20&offset=0`, { headers });
    
    apiCalls.add(1);
    apiLatency.add(listResponse.timings.duration, { endpoint: 'billing' });
    
    check(listResponse, {
      'Invoices list status is 200': (r) => r.status === 200,
    }) ? successRate.add(1) : failRate.add(1);
    
    // Create an invoice
    const invoiceData = {
      patientId: randomUserId,
      items: [
        {
          description: 'Consultation',
          quantity: 1,
          unitPrice: 150.00,
          taxRate: 0
        },
        {
          description: 'Laboratory Tests',
          quantity: 2,
          unitPrice: 75.50,
          taxRate: 0
        }
      ],
      status: 'draft',
      dueDate: new Date(Date.now() + 2592000000).toISOString() // 30 days from now
    };
    
    const createResponse = http.post(`${BASE_URL}/api/billing/invoices`, JSON.stringify(invoiceData), { headers });
    
    apiCalls.add(1);
    apiLatency.add(createResponse.timings.duration, { endpoint: 'billing' });
    
    check(createResponse, {
      'Invoice create status is 201': (r) => r.status === 201,
      'Invoice created with id': (r) => r.json('id') !== undefined,
    }) ? successRate.add(1) : failRate.add(1);
    
    if (createResponse.status === 201) {
      const invoiceId = createResponse.json('id');
      
      // Get the invoice
      const getResponse = http.get(`${BASE_URL}/api/billing/invoices/${invoiceId}`, { headers });
      
      apiCalls.add(1);
      apiLatency.add(getResponse.timings.duration, { endpoint: 'billing' });
      
      check(getResponse, {
        'Invoice get status is 200': (r) => r.status === 200,
        'Invoice has correct id': (r) => r.json('id') === invoiceId,
      }) ? successRate.add(1) : failRate.add(1);
      
      // Generate PDF (heavier operation)
      const pdfResponse = http.get(`${BASE_URL}/api/billing/invoices/${invoiceId}/pdf`, { 
        headers: {
          ...headers,
          'Accept': 'application/pdf'
        } 
      });
      
      apiCalls.add(1);
      apiLatency.add(pdfResponse.timings.duration, { endpoint: 'billing' });
      
      check(pdfResponse, {
        'Invoice PDF status is 200': (r) => r.status === 200,
        'Invoice PDF content type is correct': (r) => r.headers['Content-Type'] === 'application/pdf',
      }) ? successRate.add(1) : failRate.add(1);
    }
  });
  
  // Add more API test groups as needed...
}

// Teardown function (executed once per VU)
export function teardown(data) {
  // Clean up resources if needed
}