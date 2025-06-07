  var __DEV__: boolean;
  interface Window {
    [key: string]: any;
  }
  namespace NodeJS {
    interface Global {
      [key: string]: any;
    }
  }
}

// src/types/api.ts;

// Generic error response;
export interface ApiErrorResponse {
  error?: string;
  message?: string;
}

// Specific response for fetching administration records;
import { MedicationAdministrationRecord } from './pharmacy.ts';
export interface AdminRecordsApiResponse {
  records: MedicationAdministrationRecord[];
}

