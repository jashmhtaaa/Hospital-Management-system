# Hospital Management System REST API Reference

## Introduction

This document provides a comprehensive reference for the Hospital Management System REST API. The API follows RESTful principles and provides access to various resources within the system.

## Base URL

The base URL for all API endpoints is:

```
https://api.hms.health/v1
```

## Authentication

All API requests require authentication. The API uses JWT (JSON Web Token) for authentication.

### Authentication Endpoints

#### Get Access Token

```
POST /auth/token
```

Request Body:

```json
{
  "username": "user@example.com",
  "password": "your_password"
}
```

Response:

```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expires_in": 3600,
  "token_type": "Bearer"
}
```

#### Refresh Token

```
POST /auth/refresh
```

Request Body:

```json
{
  "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

Response:

```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expires_in": 3600,
  "token_type": "Bearer"
}
```

### Using Authentication

Include the access token in the Authorization header of all API requests:

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## Rate Limiting

The API implements rate limiting to prevent abuse. The following headers are included in all API responses:

- `X-RateLimit-Limit`: The maximum number of requests allowed per hour
- `X-RateLimit-Remaining`: The number of requests remaining in the current time window
- `X-RateLimit-Reset`: The time at which the current rate limit window resets, in UTC epoch seconds

If you exceed the rate limit, you will receive a `429 Too Many Requests` response.

## Common Response Codes

- `200 OK`: Request successful
- `201 Created`: Resource created successfully
- `400 Bad Request`: Invalid request parameters
- `401 Unauthorized`: Authentication required or failed
- `403 Forbidden`: Insufficient permissions
- `404 Not Found`: Resource not found
- `409 Conflict`: Resource conflict
- `422 Unprocessable Entity`: Validation error
- `429 Too Many Requests`: Rate limit exceeded
- `500 Internal Server Error`: Server error

## Error Responses

All error responses follow this format:

```json
{
  "error": {
    "code": "RESOURCE_NOT_FOUND",
    "message": "The requested resource was not found",
    "details": {
      "resource": "Patient",
      "id": "123456"
    },
    "traceId": "abc123def456"
  }
}
```

## Pagination

List endpoints support pagination using the following query parameters:

- `page`: The page number (1-based)
- `per_page`: The number of items per page (default: 20, max: 100)

Pagination metadata is included in the response:

```json
{
  "data": [...],
  "pagination": {
    "total_items": 1253,
    "total_pages": 63,
    "current_page": 1,
    "per_page": 20,
    "next_page": 2,
    "prev_page": null
  }
}
```

## Filtering

List endpoints support filtering using query parameters. The specific parameters depend on the resource.

## Sorting

List endpoints support sorting using the `sort` query parameter. The value should be a comma-separated list of fields. Prefix a field with `-` to sort in descending order.

Example:

```
GET /patients?sort=lastName,-dateOfBirth
```

## Versioning

API versioning is handled using the URL path. The current version is `v1`.

## Resources

### Patients

#### List Patients

```
GET /patients
```

Query Parameters:

- `search`: Search term for patient name, ID, or phone number
- `status`: Filter by patient status (`active`, `inactive`, `deceased`)
- `gender`: Filter by gender (`male`, `female`, `other`)
- `min_age`: Filter by minimum age
- `max_age`: Filter by maximum age
- `insurance_provider`: Filter by insurance provider ID
- `created_after`: Filter by creation date (ISO 8601 format)
- `created_before`: Filter by creation date (ISO 8601 format)
- `page`: Page number
- `per_page`: Items per page
- `sort`: Sort fields

Response:

```json
{
  "data": [
    {
      "id": "pat_123456",
      "mrn": "MRN123456",
      "firstName": "John",
      "lastName": "Doe",
      "dateOfBirth": "1980-01-01",
      "gender": "male",
      "contact": {
        "email": "john.doe@example.com",
        "phone": "+1234567890",
        "address": {
          "line1": "123 Main St",
          "line2": "Apt 4B",
          "city": "New York",
          "state": "NY",
          "postalCode": "10001",
          "country": "USA"
        }
      },
      "status": "active",
      "insuranceProvider": {
        "id": "ins_987654",
        "name": "Blue Cross Blue Shield"
      },
      "primaryCareProvider": {
        "id": "doc_123456",
        "name": "Dr. Jane Smith"
      },
      "createdAt": "2023-01-01T12:00:00Z",
      "updatedAt": "2023-01-15T14:30:00Z"
    },
    ...
  ],
  "pagination": {
    "total_items": 1253,
    "total_pages": 63,
    "current_page": 1,
    "per_page": 20,
    "next_page": 2,
    "prev_page": null
  }
}
```

#### Get Patient

```
GET /patients/{id}
```

Response:

```json
{
  "id": "pat_123456",
  "mrn": "MRN123456",
  "firstName": "John",
  "lastName": "Doe",
  "dateOfBirth": "1980-01-01",
  "gender": "male",
  "contact": {
    "email": "john.doe@example.com",
    "phone": "+1234567890",
    "address": {
      "line1": "123 Main St",
      "line2": "Apt 4B",
      "city": "New York",
      "state": "NY",
      "postalCode": "10001",
      "country": "USA"
    }
  },
  "status": "active",
  "insuranceProvider": {
    "id": "ins_987654",
    "name": "Blue Cross Blue Shield"
  },
  "primaryCareProvider": {
    "id": "doc_123456",
    "name": "Dr. Jane Smith"
  },
  "allergies": [
    {
      "id": "alg_123",
      "substance": "Penicillin",
      "reaction": "Rash",
      "severity": "moderate",
      "status": "active"
    }
  ],
  "medications": [
    {
      "id": "med_456",
      "name": "Lisinopril",
      "dosage": "10mg",
      "frequency": "once daily",
      "startDate": "2022-10-15",
      "endDate": null,
      "status": "active"
    }
  ],
  "createdAt": "2023-01-01T12:00:00Z",
  "updatedAt": "2023-01-15T14:30:00Z"
}
```

#### Create Patient

```
POST /patients
```

Request Body:

```json
{
  "firstName": "John",
  "lastName": "Doe",
  "dateOfBirth": "1980-01-01",
  "gender": "male",
  "contact": {
    "email": "john.doe@example.com",
    "phone": "+1234567890",
    "address": {
      "line1": "123 Main St",
      "line2": "Apt 4B",
      "city": "New York",
      "state": "NY",
      "postalCode": "10001",
      "country": "USA"
    }
  },
  "insuranceProviderId": "ins_987654",
  "primaryCareProviderId": "doc_123456"
}
```

Response:

```json
{
  "id": "pat_123456",
  "mrn": "MRN123456",
  "firstName": "John",
  "lastName": "Doe",
  "dateOfBirth": "1980-01-01",
  "gender": "male",
  "contact": {
    "email": "john.doe@example.com",
    "phone": "+1234567890",
    "address": {
      "line1": "123 Main St",
      "line2": "Apt 4B",
      "city": "New York",
      "state": "NY",
      "postalCode": "10001",
      "country": "USA"
    }
  },
  "status": "active",
  "insuranceProvider": {
    "id": "ins_987654",
    "name": "Blue Cross Blue Shield"
  },
  "primaryCareProvider": {
    "id": "doc_123456",
    "name": "Dr. Jane Smith"
  },
  "createdAt": "2023-01-01T12:00:00Z",
  "updatedAt": "2023-01-01T12:00:00Z"
}
```

#### Update Patient

```
PUT /patients/{id}
```

Request Body:

```json
{
  "firstName": "John",
  "lastName": "Doe",
  "dateOfBirth": "1980-01-01",
  "gender": "male",
  "contact": {
    "email": "updated.email@example.com",
    "phone": "+1234567890",
    "address": {
      "line1": "456 New St",
      "line2": "Apt 7C",
      "city": "New York",
      "state": "NY",
      "postalCode": "10002",
      "country": "USA"
    }
  },
  "status": "active",
  "insuranceProviderId": "ins_987654",
  "primaryCareProviderId": "doc_789012"
}
```

Response:

```json
{
  "id": "pat_123456",
  "mrn": "MRN123456",
  "firstName": "John",
  "lastName": "Doe",
  "dateOfBirth": "1980-01-01",
  "gender": "male",
  "contact": {
    "email": "updated.email@example.com",
    "phone": "+1234567890",
    "address": {
      "line1": "456 New St",
      "line2": "Apt 7C",
      "city": "New York",
      "state": "NY",
      "postalCode": "10002",
      "country": "USA"
    }
  },
  "status": "active",
  "insuranceProvider": {
    "id": "ins_987654",
    "name": "Blue Cross Blue Shield"
  },
  "primaryCareProvider": {
    "id": "doc_789012",
    "name": "Dr. Robert Johnson"
  },
  "createdAt": "2023-01-01T12:00:00Z",
  "updatedAt": "2023-01-15T14:30:00Z"
}
```

#### Delete Patient

```
DELETE /patients/{id}
```

Response:

```json
{
  "id": "pat_123456",
  "status": "deleted",
  "deletedAt": "2023-01-20T10:15:00Z"
}
```

### Appointments

#### List Appointments

```
GET /appointments
```

Query Parameters:

- `patient_id`: Filter by patient ID
- `doctor_id`: Filter by doctor ID
- `status`: Filter by appointment status (`scheduled`, `confirmed`, `cancelled`, `completed`)
- `start_date`: Filter by start date (ISO 8601 format)
- `end_date`: Filter by end date (ISO 8601 format)
- `page`: Page number
- `per_page`: Items per page
- `sort`: Sort fields

Response:

```json
{
  "data": [
    {
      "id": "apt_123456",
      "patient": {
        "id": "pat_123456",
        "name": "John Doe"
      },
      "doctor": {
        "id": "doc_123456",
        "name": "Dr. Jane Smith"
      },
      "startTime": "2023-02-15T10:00:00Z",
      "endTime": "2023-02-15T10:30:00Z",
      "status": "confirmed",
      "type": "follow-up",
      "notes": "Follow-up for hypertension",
      "location": {
        "id": "loc_123",
        "name": "Main Clinic"
      },
      "createdAt": "2023-01-20T15:45:00Z",
      "updatedAt": "2023-01-21T09:30:00Z"
    },
    ...
  ],
  "pagination": {
    "total_items": 248,
    "total_pages": 13,
    "current_page": 1,
    "per_page": 20,
    "next_page": 2,
    "prev_page": null
  }
}
```

#### Get Appointment

```
GET /appointments/{id}
```

Response:

```json
{
  "id": "apt_123456",
  "patient": {
    "id": "pat_123456",
    "name": "John Doe"
  },
  "doctor": {
    "id": "doc_123456",
    "name": "Dr. Jane Smith"
  },
  "startTime": "2023-02-15T10:00:00Z",
  "endTime": "2023-02-15T10:30:00Z",
  "status": "confirmed",
  "type": "follow-up",
  "notes": "Follow-up for hypertension",
  "location": {
    "id": "loc_123",
    "name": "Main Clinic"
  },
  "createdBy": {
    "id": "user_789",
    "name": "Front Desk Staff"
  },
  "createdAt": "2023-01-20T15:45:00Z",
  "updatedAt": "2023-01-21T09:30:00Z"
}
```

#### Create Appointment

```
POST /appointments
```

Request Body:

```json
{
  "patientId": "pat_123456",
  "doctorId": "doc_123456",
  "startTime": "2023-02-15T10:00:00Z",
  "endTime": "2023-02-15T10:30:00Z",
  "type": "follow-up",
  "notes": "Follow-up for hypertension",
  "locationId": "loc_123"
}
```

Response:

```json
{
  "id": "apt_123456",
  "patient": {
    "id": "pat_123456",
    "name": "John Doe"
  },
  "doctor": {
    "id": "doc_123456",
    "name": "Dr. Jane Smith"
  },
  "startTime": "2023-02-15T10:00:00Z",
  "endTime": "2023-02-15T10:30:00Z",
  "status": "scheduled",
  "type": "follow-up",
  "notes": "Follow-up for hypertension",
  "location": {
    "id": "loc_123",
    "name": "Main Clinic"
  },
  "createdAt": "2023-01-20T15:45:00Z",
  "updatedAt": "2023-01-20T15:45:00Z"
}
```

#### Update Appointment

```
PUT /appointments/{id}
```

Request Body:

```json
{
  "startTime": "2023-02-16T14:00:00Z",
  "endTime": "2023-02-16T14:30:00Z",
  "status": "confirmed",
  "notes": "Rescheduled follow-up for hypertension"
}
```

Response:

```json
{
  "id": "apt_123456",
  "patient": {
    "id": "pat_123456",
    "name": "John Doe"
  },
  "doctor": {
    "id": "doc_123456",
    "name": "Dr. Jane Smith"
  },
  "startTime": "2023-02-16T14:00:00Z",
  "endTime": "2023-02-16T14:30:00Z",
  "status": "confirmed",
  "type": "follow-up",
  "notes": "Rescheduled follow-up for hypertension",
  "location": {
    "id": "loc_123",
    "name": "Main Clinic"
  },
  "createdAt": "2023-01-20T15:45:00Z",
  "updatedAt": "2023-01-21T09:30:00Z"
}
```

#### Cancel Appointment

```
POST /appointments/{id}/cancel
```

Request Body:

```json
{
  "cancellationReason": "Patient requested rescheduling"
}
```

Response:

```json
{
  "id": "apt_123456",
  "patient": {
    "id": "pat_123456",
    "name": "John Doe"
  },
  "doctor": {
    "id": "doc_123456",
    "name": "Dr. Jane Smith"
  },
  "startTime": "2023-02-16T14:00:00Z",
  "endTime": "2023-02-16T14:30:00Z",
  "status": "cancelled",
  "type": "follow-up",
  "notes": "Rescheduled follow-up for hypertension",
  "cancellationReason": "Patient requested rescheduling",
  "cancelledAt": "2023-01-30T11:20:00Z",
  "location": {
    "id": "loc_123",
    "name": "Main Clinic"
  },
  "createdAt": "2023-01-20T15:45:00Z",
  "updatedAt": "2023-01-30T11:20:00Z"
}
```

### Additional Resources

For the complete API reference, including all available endpoints and parameters, please refer to the [OpenAPI Specification](./openapi.yaml).

## API Versioning Policy

The HMS API follows semantic versioning. Breaking changes will only be introduced in major version updates. Minor version updates may include new endpoints or fields, but will maintain backward compatibility.

## Support

For API support, please contact:

- Email: api-support@hms.health
- API Status: https://status.hms.health