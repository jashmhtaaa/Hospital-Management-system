export interface Patient {
  id: string;
  mrn: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string; // ISO date;
  phone?: string;
  email?: string;
}