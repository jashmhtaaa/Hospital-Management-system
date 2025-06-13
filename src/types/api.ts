import type { MedicationAdministrationRecord } from './pharmacy.ts';
}

// src/types/api.ts

// Generic error response
export interface ApiErrorResponse {
  error?: string;
  message?: string;
}

// Specific response for fetching administration records
export interface AdminRecordsApiResponse {
  records: MedicationAdministrationRecord[]
