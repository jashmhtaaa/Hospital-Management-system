# Hospital Management System - API Documentation

## Overview
This document provides comprehensive API documentation for the Hospital Management System (HMS), covering all endpoints, request/response schemas, authentication, and integration guidelines.

## Table of Contents
1. [Authentication](#authentication)
2. [Core APIs](#core-apis)
3. [Patient Management](#patient-management)
4. [Electronic Health Records](#electronic-health-records)
5. [Quality Management](#quality-management)
6. [ICD Coding](#icd-coding)
7. [Notifications](#notifications)
8. [IPD Management](#ipd-management)
9. [Error Handling](#error-handling)
10. [Rate Limiting](#rate-limiting)

---

## Authentication

### JWT Token Authentication
All API endpoints require JWT authentication unless specified otherwise.

**Authentication Header:**
```
Authorization: Bearer <jwt_token>
```

**Login Endpoint:**
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@hospital.com",
  "password": "securepassword",
  "mfaCode": "123456" // Optional, required if MFA is enabled
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIs...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIs...",
    "user": {
      "id": "user123",
      "email": "user@hospital.com",
      "role": "doctor",
      "department": "cardiology"
    },
    "expiresIn": 3600
  }
}
```

### Refresh Token
```http
POST /api/auth/refresh
Content-Type: application/json

{
  "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
}
```

---

## Core APIs

### Health Check
```http
GET /api/health
```

**Response:**
```json
{
  "status": "healthy",
  "timestamp": "2025-01-15T10:30:00Z",
  "version": "1.0.0",
  "services": {
    "database": "connected",
    "redis": "connected",
    "external_apis": "operational"
  }
}
```

---

## Patient Management

### Create Patient
```http
POST /api/patients
Content-Type: application/json
Authorization: Bearer <token>

{
  "firstName": "John",
  "lastName": "Doe",
  "dateOfBirth": "1990-05-15",
  "gender": "male",
  "phone": "+1234567890",
  "email": "john.doe@email.com",
  "address": {
    "street": "123 Main St",
    "city": "Springfield",
    "state": "IL",
    "zipCode": "62701",
    "country": "USA"
  },
  "emergencyContact": {
    "name": "Jane Doe",
    "relationship": "spouse",
    "phone": "+1234567891"
  },
  "insurance": {
    "provider": "Blue Cross",
    "policyNumber": "BC123456789",
    "groupNumber": "GRP001"
  }
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "patient_123",
    "mrn": "MRN001234",
    "firstName": "John",
    "lastName": "Doe",
    "dateOfBirth": "1990-05-15",
    "gender": "male",
    "phone": "+1234567890",
    "email": "john.doe@email.com",
    "status": "active",
    "createdAt": "2025-01-15T10:30:00Z"
  }
}
```

### Get Patient
```http
GET /api/patients/{patientId}
Authorization: Bearer <token>
```

### Update Patient
```http
PUT /api/patients/{patientId}
Content-Type: application/json
Authorization: Bearer <token>

{
  "phone": "+1234567892",
  "email": "john.newemail@email.com"
}
```

### Search Patients
```http
GET /api/patients/search?q=john&limit=20&offset=0
Authorization: Bearer <token>
```

---

## Electronic Health Records

### Create Clinical Note
```http
POST /api/ehr/clinical-notes
Content-Type: application/json
Authorization: Bearer <token>

{
  "patientId": "patient_123",
  "encounterId": "encounter_456",
  "type": "progress_note",
  "title": "Daily Progress Note",
  "content": "Patient shows improvement in respiratory function...",
  "authorId": "doctor_789",
  "department": "pulmonology",
  "tags": ["respiratory", "improvement"],
  "icd10Codes": ["J44.1", "Z87.891"],
  "vitals": {
    "temperature": 98.6,
    "bloodPressure": "120/80",
    "heartRate": 72,
    "respiratoryRate": 16
  }
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "note_abc123",
    "version": 1,
    "patientId": "patient_123",
    "encounterId": "encounter_456",
    "type": "progress_note",
    "title": "Daily Progress Note",
    "status": "active",
    "createdAt": "2025-01-15T10:30:00Z",
    "authorId": "doctor_789"
  }
}
```

### Get Clinical Notes
```http
GET /api/ehr/clinical-notes?patientId=patient_123&limit=50&offset=0
Authorization: Bearer <token>
```

### Create Care Plan
```http
POST /api/ehr/care-plans
Content-Type: application/json
Authorization: Bearer <token>

{
  "patientId": "patient_123",
  "title": "Cardiac Rehabilitation Plan",
  "description": "Comprehensive cardiac rehabilitation...",
  "status": "active",
  "goals": [
    {
      "description": "Improve cardiovascular endurance",
      "targetDate": "2025-03-15",
      "status": "in_progress"
    }
  ],
  "interventions": [
    {
      "type": "exercise",
      "description": "30 minutes daily walking",
      "frequency": "daily"
    }
  ],
  "icd10Codes": ["I25.10"],
  "createdBy": "doctor_789"
}
```

---

## Quality Management

### Get Quality Indicators
```http
GET /api/quality/indicators?type=safety&department=emergency&limit=20
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "qi_001",
      "name": "Hand Hygiene Compliance",
      "type": "safety",
      "department": "emergency",
      "currentValue": 94.5,
      "target": 95.0,
      "unit": "percentage",
      "trend": "improving",
      "lastUpdated": "2025-01-15T09:00:00Z"
    }
  ],
  "pagination": {
    "total": 15,
    "limit": 20,
    "offset": 0
  }
}
```

### Create Quality Event
```http
POST /api/quality/events
Content-Type: application/json
Authorization: Bearer <token>

{
  "type": "medication_error",
  "severity": "moderate",
  "title": "Wrong medication dispensed",
  "description": "Patient received amoxicillin instead of prescribed azithromycin",
  "department": "pharmacy",
  "location": "Pharmacy Unit 1",
  "reportedBy": "pharmacist_123",
  "affectedPatients": ["patient_456"],
  "immediateActions": ["Medication corrected", "Patient monitored"],
  "rootCauses": ["Label confusion", "Staff fatigue"]
}
```

### Get Compliance Reports
```http
GET /api/quality/compliance-reports?regulatoryBody=NABH&status=active
Authorization: Bearer <token>
```

---

## ICD Coding

### Search ICD Codes
```http
GET /api/coding/icd/search?q=diabetes&version=ICD-10&billableOnly=true&limit=10
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "code": "E11.9",
      "version": "ICD-10",
      "description": "Type 2 diabetes mellitus without complications",
      "category": "Endocrine, nutritional and metabolic diseases",
      "billable": true,
      "isValid": true,
      "synonyms": ["DM Type 2", "NIDDM"],
      "includes": ["Adult-onset diabetes"]
    }
  ]
}
```

### Validate ICD Code
```http
GET /api/coding/icd/validate/{code}?version=ICD-10
Authorization: Bearer <token>
```

### Get Coding Suggestions
```http
POST /api/coding/icd/suggestions
Content-Type: application/json
Authorization: Bearer <token>

{
  "clinicalText": "Patient presents with chest pain and shortness of breath. ECG shows ST elevation in leads II, III, aVF.",
  "codeType": "diagnosis",
  "suggestionLimit": 5
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "suggestions": [
      {
        "code": "I21.11",
        "description": "ST elevation (STEMI) myocardial infarction involving right coronary artery",
        "confidence": 0.89,
        "reasoning": "ST elevation in inferior leads (II, III, aVF) indicates RCA involvement"
      }
    ],
    "confidence": 0.89
  }
}
```

---

## Notifications

### Send SMS Notification
```http
POST /api/notifications/sms
Content-Type: application/json
Authorization: Bearer <token>

{
  "recipient": {
    "phone": "+1234567890",
    "name": "John Doe"
  },
  "template": "appointment_reminder",
  "variables": {
    "patientName": "John Doe",
    "appointmentDate": "2025-01-20",
    "appointmentTime": "10:00 AM",
    "doctorName": "Dr. Smith"
  },
  "priority": "medium",
  "scheduledFor": "2025-01-19T18:00:00Z"
}
```

### Send Email Notification
```http
POST /api/notifications/email
Content-Type: application/json
Authorization: Bearer <token>

{
  "recipient": {
    "email": "patient@email.com",
    "name": "John Doe"
  },
  "template": "lab_result_ready",
  "variables": {
    "patientName": "John Doe",
    "testName": "Blood Chemistry Panel",
    "resultDate": "2025-01-15"
  },
  "priority": "high"
}
```

### Get Notification Status
```http
GET /api/notifications/{notificationId}/status
Authorization: Bearer <token>
```

---

## IPD Management

### Create Admission
```http
POST /api/ipd/admissions
Content-Type: application/json
Authorization: Bearer <token>

{
  "patientId": "patient_123",
  "attendingDoctorId": "doctor_456",
  "admissionDate": "2025-01-15T08:00:00Z",
  "admittingDiagnosis": "Acute myocardial infarction",
  "ward": "CCU",
  "room": "201",
  "bedNumber": "201A",
  "admissionType": "emergency",
  "insuranceProvider": "Blue Cross",
  "insurancePolicyNumber": "BC123456789",
  "emergencyContact": {
    "name": "Jane Doe",
    "relationship": "spouse",
    "phone": "+1234567891"
  }
}
```

### Get Admission
```http
GET /api/ipd/admissions/{admissionId}
Authorization: Bearer <token>
```

### Update Admission
```http
PUT /api/ipd/admissions/{admissionId}
Content-Type: application/json
Authorization: Bearer <token>

{
  "status": "discharged",
  "dischargeDate": "2025-01-20T14:00:00Z",
  "dischargeDiagnosis": "Acute myocardial infarction, recovered",
  "dischargeInstructions": "Follow up with cardiologist in 1 week"
}
```

### Assign Bed
```http
POST /api/ipd/bed-assignments
Content-Type: application/json
Authorization: Bearer <token>

{
  "admissionId": "admission_789",
  "ward": "ICU",
  "room": "301",
  "bedNumber": "301B",
  "assignedBy": "nurse_manager_123",
  "notes": "Patient requires isolation room"
}
```

---

## Error Handling

### Standard Error Response Format
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input data",
    "details": [
      {
        "field": "email",
        "message": "Invalid email format"
      }
    ],
    "timestamp": "2025-01-15T10:30:00Z",
    "requestId": "req_abc123"
  }
}
```

### Common Error Codes
- `VALIDATION_ERROR` (400) - Invalid input data
- `UNAUTHORIZED` (401) - Authentication required
- `FORBIDDEN` (403) - Insufficient permissions
- `NOT_FOUND` (404) - Resource not found
- `CONFLICT` (409) - Resource already exists
- `RATE_LIMITED` (429) - Too many requests
- `INTERNAL_ERROR` (500) - Server error
- `SERVICE_UNAVAILABLE` (503) - Service temporarily unavailable

---

## Rate Limiting

### Rate Limit Headers
```
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 999
X-RateLimit-Reset: 1642261200
```

### Rate Limits by Endpoint Category
- **Authentication**: 10 requests per minute
- **Patient Management**: 100 requests per minute
- **EHR Operations**: 200 requests per minute
- **Quality Management**: 50 requests per minute
- **Notifications**: 20 requests per minute
- **General APIs**: 1000 requests per hour

---

## Pagination

### Standard Pagination Parameters
- `limit` - Number of records to return (default: 20, max: 100)
- `offset` - Number of records to skip (default: 0)

### Pagination Response Format
```json
{
  "success": true,
  "data": [...],
  "pagination": {
    "total": 150,
    "limit": 20,
    "offset": 0,
    "hasNext": true,
    "hasPrevious": false
  }
}
```

---

## Webhooks

### Notification Webhooks
Configure webhook endpoints to receive real-time notifications:

**Webhook Payload:**
```json
{
  "event": "patient.created",
  "timestamp": "2025-01-15T10:30:00Z",
  "data": {
    "patientId": "patient_123",
    "mrn": "MRN001234"
  },
  "signature": "sha256=abc123..."
}
```

### Supported Events
- `patient.created`
- `patient.updated`
- `admission.created`
- `admission.discharged`
- `quality_event.created`
- `clinical_note.created`

---

## SDK and Code Examples

### JavaScript/TypeScript SDK
```typescript
import { HMSClient } from '@hospital/hms-sdk';

const client = new HMSClient({
  baseUrl: 'https://api.hospital.com',
  apiKey: 'your-api-key'
});

// Create patient
const patient = await client.patients.create({
  firstName: 'John',
  lastName: 'Doe',
  dateOfBirth: '1990-05-15'
});

// Get clinical notes
const notes = await client.ehr.getClinicalNotes({
  patientId: patient.id,
  limit: 10
});
```

### Python SDK
```python
from hms_client import HMSClient

client = HMSClient(
    base_url='https://api.hospital.com',
    api_key='your-api-key'
)

# Create patient
patient = client.patients.create({
    'firstName': 'John',
    'lastName': 'Doe',
    'dateOfBirth': '1990-05-15'
})

# Get clinical notes
notes = client.ehr.get_clinical_notes(
    patient_id=patient['id'],
    limit=10
)
```

---

## Testing

### API Testing Tools
- Use Postman collection: `hms-api.postman_collection.json`
- Swagger/OpenAPI documentation: `/api/docs`
- Test environment: `https://api-test.hospital.com`

### Authentication for Testing
```bash
# Get test token
curl -X POST https://api-test.hospital.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@hospital.com","password":"testpass"}'
```

---

## Support and Contact

- **API Documentation**: https://docs.hospital.com/api
- **Developer Portal**: https://developers.hospital.com
- **Support Email**: api-support@hospital.com
- **Status Page**: https://status.hospital.com

**Version**: 1.0.0  
**Last Updated**: January 15, 2025  
**Next Update**: February 15, 2025
