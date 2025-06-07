# Patient Management Service

## Overview

The Patient Management Service is a comprehensive microservice responsible for managing patient demographics, registration, and related operations within the Hospital Management System. It provides a complete RESTful API for patient data management with enterprise-grade features including caching, validation, security, and monitoring.

## Features

### Core Functionality
- **Patient Registration**: Create new patient records with comprehensive demographic information
- **Patient Information Management**: Update and maintain patient data
- **Advanced Search**: Multiple search capabilities including full-text search, filtered search, and specialized queries
- **Medical Record Number (MRN) Management**: Automatic generation and validation of unique medical record numbers
- **Patient Status Management**: Activate, deactivate, and mark patients as deceased
- **Duplicate Detection**: Identify and merge potential duplicate patient records

### Enterprise Features
- **FHIR R4 Compliance**: Patient resource management aligned with FHIR standards
- **Caching**: Redis-based caching for improved performance
- **Security**: JWT-based authentication and role-based authorization
- **Validation**: Comprehensive input validation and business rule enforcement
- **Monitoring**: Health checks, metrics, and observability
- **Documentation**: OpenAPI/Swagger documentation
- **Error Handling**: Global exception handling with detailed error responses

## Architecture

### Layer Structure
```
┌─────────────────────┐
│   Controller Layer  │  ← REST API endpoints with OpenAPI documentation
├─────────────────────┤
│    Service Layer    │  ← Business logic and orchestration
├─────────────────────┤
│     DTO Layer       │  ← Data Transfer Objects for API communication
├─────────────────────┤
│    Mapper Layer     │  ← Entity to DTO conversion (MapStruct)
├─────────────────────┤
│  Repository Layer   │  ← Data access with Spring Data JPA
├─────────────────────┤
│    Entity Layer     │  ← JPA entities with validation
└─────────────────────┘
```

### Technology Stack
- **Framework**: Spring Boot 3.2.0
- **Data Access**: Spring Data JPA with Hibernate
- **Database**: PostgreSQL (production), H2 (development/testing)
- **Caching**: Redis with Spring Cache
- **Mapping**: MapStruct for DTO/Entity conversion
- **Validation**: Bean Validation (JSR-303) with custom business rules
- **Documentation**: OpenAPI 3.0 with Swagger UI
- **Security**: Spring Security with JWT
- **Monitoring**: Spring Boot Actuator with Micrometer
- **Service Discovery**: Netflix Eureka
- **Distributed Tracing**: Spring Cloud Sleuth with Zipkin

## API Endpoints

### Patient Operations
- `POST /api/v1/patients` - Create new patient
- `PUT /api/v1/patients/{id}` - Update patient information
- `GET /api/v1/patients/{id}` - Get patient by ID
- `GET /api/v1/patients/mrn/{mrn}` - Get patient by Medical Record Number
- `GET /api/v1/patients/identifier` - Get patient by external identifier

### Search Operations
- `GET /api/v1/patients/search` - Advanced patient search with multiple criteria
- `GET /api/v1/patients/search/fulltext` - Full-text search across patient data
- `GET /api/v1/patients/search/name` - Search by patient name
- `GET /api/v1/patients/search/age-range` - Search by age range
- `GET /api/v1/patients/search/minors` - Find minor patients
- `GET /api/v1/patients/search/gender/{gender}` - Search by gender
- `GET /api/v1/patients/search/allergies` - Search by allergies
- `GET /api/v1/patients/search/interpreter-required` - Find patients requiring interpreter
- `GET /api/v1/patients/search/duplicates` - Find potential duplicate patients
- `GET /api/v1/patients/search/missing-info` - Find patients with missing information

### Patient Status Management
- `PUT /api/v1/patients/{id}/deactivate` - Deactivate patient
- `PUT /api/v1/patients/{id}/reactivate` - Reactivate patient
- `PUT /api/v1/patients/{id}/deceased` - Mark patient as deceased

### Administrative Operations
- `GET /api/v1/patients/statistics` - Get patient statistics
- `GET /api/v1/patients/statistics/gender` - Get patient count by gender
- `GET /api/v1/patients/statistics/age-groups` - Get patient count by age groups
- `GET /api/v1/patients/generate-mrn` - Generate new Medical Record Number
- `GET /api/v1/patients/check-mrn/{mrn}` - Check if MRN exists
- `GET /api/v1/patients/check-email` - Check if email exists
- `POST /api/v1/patients/{primaryId}/merge/{duplicateId}` - Merge duplicate patients
- `POST /api/v1/patients/export` - Export patient data
- `PUT /api/v1/patients/bulk-update` - Bulk update patients

## Data Models

### Patient Entity
The core Patient entity includes:
- **Identity**: UUID, Medical Record Number, External Identifiers
- **Demographics**: Name components, Date of Birth, Gender, Marital Status
- **Contact Information**: Phone numbers, Email, Addresses
- **Emergency Contact**: Name, Phone, Relationship
- **Medical Information**: Blood Type, Allergies, Medical History, Current Medications
- **Insurance**: Multiple insurance records with coverage details
- **Communication**: Preferred Language, Communication Preferences, Interpreter Requirements
- **Status**: Active/Inactive, Deceased information, Multiple birth details
- **FHIR Compliance**: FHIR ID, Version ID, Last Updated
- **Audit**: Created/Modified dates and users

### DTOs
- **PatientCreateRequestDto**: For creating new patients
- **PatientUpdateRequestDto**: For updating existing patients
- **PatientResponseDto**: For API responses with calculated fields
- **PatientSearchCriteria**: For search operations
- **PatientAddressDto**: For address information
- **PatientInsuranceDto**: For insurance information

## Business Rules and Validation

### Required Fields
- Family Name (Last Name)
- Given Name (First Name)

### Validation Rules
- **Age Constraints**: Date of birth must be in the past, maximum age 150 years
- **Email Format**: RFC-compliant email validation
- **Phone Format**: International phone number format
- **Unique Constraints**: Medical Record Number, Email, External Identifiers
- **Emergency Contact**: Required for minor patients (under 18)
- **Deceased Logic**: Deceased date/time required when marking as deceased
- **Multiple Birth**: Birth order required for multiple birth patients

### Business Logic
- **Automatic MRN Generation**: Unique medical record numbers with configurable format
- **Age Calculation**: Real-time age calculation from date of birth
- **Minor Patient Detection**: Special handling for patients under 18
- **Duplicate Detection**: Algorithm to identify potential duplicate patients
- **Data Merging**: Logic to merge duplicate patient records

## Security

### Authentication
- JWT-based authentication with configurable token expiration
- Integration with external identity providers (Keycloak/OAuth2)

### Authorization (Role-Based Access Control)
- **ADMIN**: Full access to all operations
- **REGISTRATION_STAFF**: Patient creation, updates, and basic operations
- **DOCTOR**: Read access to patient information, mark as deceased
- **NURSE**: Read access and limited updates
- **PHARMACIST**: Read access for allergy information
- **PEDIATRICIAN**: Access to minor patients
- **ANALYTICS**: Access to statistics and reporting

### Data Protection
- Sensitive data encryption at rest
- Audit logging for all operations
- CORS configuration for web client access
- Rate limiting to prevent abuse

## Configuration

### Environment Variables
```bash
# Database
SPRING_DATASOURCE_URL=jdbc:postgresql://localhost:5432/patient_db
SPRING_DATASOURCE_USERNAME=postgres
SPRING_DATASOURCE_PASSWORD=password

# Redis Cache
REDIS_HOST=localhost
REDIS_PORT=6379

# Security
JWT_SECRET=your-secret-key
JWT_ISSUER_URI=http://localhost:8080/auth/realms/hms

# Service Discovery
EUREKA_CLIENT_SERVICE_URL_DEFAULTZONE=http://localhost:8761/eureka

# Observability
ZIPKIN_BASE_URL=http://localhost:9411
```

### Application Profiles
- **default**: Development configuration with H2 database
- **docker**: Docker deployment with PostgreSQL
- **test**: Testing configuration with in-memory database
- **production**: Production configuration with optimizations

## Performance and Scalability

### Caching Strategy
- **Patient Data**: 30-minute TTL for frequently accessed patient records
- **Search Results**: 5-minute TTL for search query results
- **Statistics**: 1-hour TTL for dashboard statistics
- **MRN Validation**: 24-hour TTL for existence checks

### Database Optimization
- **Indexes**: Optimized indexes for search performance
- **Connection Pooling**: HikariCP with configurable pool sizes
- **Pagination**: All list operations support pagination
- **Query Optimization**: Efficient JPA queries with Specifications

### Monitoring and Observability
- **Health Checks**: Database, Redis, and application health endpoints
- **Metrics**: Prometheus-compatible metrics for monitoring
- **Distributed Tracing**: Request tracing across microservices
- **Logging**: Structured logging with correlation IDs

## Development

### Prerequisites
- Java 17+
- Maven 3.6+
- PostgreSQL 12+ (for production profile)
- Redis 6+ (for caching)

### Running Locally
```bash
# Clone the repository
git clone <repository-url>
cd patient-management-service

# Run with default profile (H2 database)
mvn spring-boot:run

# Run with specific profile
mvn spring-boot:run -Dspring-boot.run.profiles=docker

# Run tests
mvn test

# Build for production
mvn clean package -P production
```

### Docker Deployment
```bash
# Build image
docker build -t patient-management-service .

# Run with Docker Compose
docker-compose up -d
```

### API Documentation
After starting the service, access the API documentation at:
- Swagger UI: http://localhost:8081/swagger-ui.html
- OpenAPI Spec: http://localhost:8081/v3/api-docs

## Testing

### Test Categories
- **Unit Tests**: Service layer logic testing with Mockito
- **Integration Tests**: Full application context testing with TestContainers
- **API Tests**: REST endpoint testing with MockMvc
- **Performance Tests**: Load testing with JMeter/K6

### Test Data
Test data includes comprehensive patient records covering various scenarios:
- Standard adult patients
- Minor patients with guardians
- International patients with interpreters
- Patients with multiple addresses and insurance
- Edge cases for validation testing

## Monitoring and Operations

### Health Checks
- **Database Connectivity**: PostgreSQL connection status
- **Cache Availability**: Redis connection and functionality
- **Service Dependencies**: Eureka registration status
- **Custom Health Indicators**: Business-specific health checks

### Metrics
- **Application Metrics**: Request rates, response times, error rates
- **Business Metrics**: Patient registration rates, search performance
- **System Metrics**: JVM metrics, database connection pool status
- **Custom Metrics**: Patient statistics, validation error rates

### Logging
- **Application Logs**: Business operations and error tracking
- **Audit Logs**: All patient data modifications
- **Performance Logs**: Slow query detection and optimization
- **Security Logs**: Authentication and authorization events

## Contributing

### Code Standards
- Java 17+ features and best practices
- Spring Boot coding conventions
- Comprehensive unit test coverage (>80%)
- Documentation for public APIs
- Security-first development approach

### Pull Request Process
1. Create feature branch from main
2. Implement changes with tests
3. Update documentation
4. Ensure all tests pass
5. Submit pull request with description

## License

This software is proprietary to the Hospital Management System project.
Unauthorized copying, modification, or distribution is prohibited.

## Support

For technical support and questions:
- Email: support@hospital.com
- Documentation: https://hospital.com/docs
- Issue Tracker: https://hospital.com/issues
