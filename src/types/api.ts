}

// src/types/api.ts

// Generic error response
export interface ApiErrorResponse {
  error?: string;
  message?: string;
}

// Specific response for fetching administration records
import { MedicationAdministrationRecord } from './pharmacy.ts';
export interface AdminRecordsApiResponse {
  records: MedicationAdministrationRecord[]
