// src/types.ts

import { ReactNode } from "react";

/** ────────────────────────────────────────────────────────────────
 * Roles & Auth
 * ────────────────────────────────────────────────────────────────
 */
export interface Role {
  id: number;
  name: 'doctor' | 'receptionist' | 'admin' | 'user';
}

export interface User {
  id: number;
  name: string;
  email: string;
  emailVerifiedAt?: string | null;
  roles: Role[];
  createdAt: string;
  updatedAt: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface Credentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
}

export interface LoginFormValues {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface RegisterFormValues {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface RecoveryFormValues {
  email: string;
}

export interface AlertProps {
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
}


/** ────────────────────────────────────────────────────────────────
 * Medical Domain: Pet, Appointment, Medical Record
 * ────────────────────────────────────────────────────────────────
 */

export interface Pet {
  lastVisit: ReactNode;
  id: number;
  // ownerId is frontend's camelCase. The backend sends owner_id.
  // We will map this when receiving from backend.
  ownerId: number;
  name: string;
  species: string;
  breed?: string; // API doc has this as required, but sometimes DB schema allows null. Made optional based on your type.
  dateOfBirth?: string; // Frontend uses camelCase, API sends date_of_birth.
  gender: 'male' | 'female' | 'other'; // Corrected to 'other' as per API doc enum, not 'unknown'
  weight?: number; // As per API doc, is numeric.
  color?: string;
  microchipNumber?: string;
  createdAt: string;
  updatedAt: string;

  // Added/Adjusted based on API documentation's example response for GET /api/pets
  age?: number; // From API doc example response
  owner: { // This object is crucial and directly from API doc
    id: number;
    name: string;
    email: string;
    // No phone or other fields here based on the API doc for GET /api/pets
  };

  // Optional populated relations (as per your original types.ts)
  medicalRecords?: MedicalRecord[];
  appointments?: Appointment[];
}

// AddPetFormValues should reflect what the USER'S POST /api/pets endpoint expects
// The API doc does NOT show ownerId, color, microchipNumber for user pet creation.
export interface AddPetFormValues {
  name: string;
  species: string;
  breed: string; // API validation states breed is required for POST
  birthDate?: string; // Frontend form field, will be mapped to date_of_birth for API
  weight?: number; // Matches API request body validation: optional, numeric
  gender: 'male' | 'female' | 'other' | ''; // Matches API request body validation: optional, enum. Added '' for initial select state.
}

export interface Appointment {
  id: number;
  doctorId: number;
  petId: number;
  appointmentDate: string;
  appointmentTime: string;
  duration: number;
  appointmentType: 'regular' | 'emergency' | 'follow_up' | 'surgery';
  status: 'scheduled' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled' | 'no_show';
  notes?: string;
  createdAt: string;
  updatedAt: string;

  pet?: Pet;
  doctor?: DoctorProfile;
}

export interface MedicalRecord {
  id: number;
  appointmentId?: number | null;
  petId: number;
  doctorId: number;
  visitDate: string;
  visitType:
    | 'routine_checkup'
    | 'emergency'
    | 'follow_up'
    | 'surgery'
    | 'vaccination'
    | 'dental'
    | 'other';
  chiefComplaint?: string;
  physicalExamination?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  vitalSigns?: Record<string, any>; // JSON
  assessment?: string;
  plan?: string;
  notes?: string;
  status: 'draft' | 'completed' | 'reviewed';
  createdAt: string;
  updatedAt: string;

  pet?: Pet;
  doctor?: DoctorProfile;
  appointment?: Appointment;
  diagnoses?: Diagnosis[];
  treatments?: Treatment[];
}

export interface Diagnosis {
  id: number;
  medicalRecordId: number;
  petId: number;
  diagnosisCode?: string;
  diagnosisName: string;
  description?: string;
  severity: 'mild' | 'moderate' | 'severe' | 'critical';
  status: 'active' | 'resolved' | 'chronic' | 'under_observation';
  diagnosedDate: string;
  resolvedDate?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Treatment {
  id: number;
  medicalRecordId: number;
  petId: number;
  diagnosisId?: number;
  type:
    | 'medication'
    | 'procedure'
    | 'surgery'
    | 'therapy'
    | 'vaccination'
    | 'diagnostic_test'
    | 'other';
  name: string;
  description?: string;
  medicationName?: string;
  dosage?: string;
  frequency?: string;
  route?: string;
  durationDays?: number;
  procedureCode?: string;
  procedureNotes?: string;
  anesthesiaType?: 'none' | 'local' | 'general' | 'sedation';
  startDate: string;
  endDate?: string;
  administeredAt?: string;
  status: 'prescribed' | 'in_progress' | 'completed' | 'discontinued' | 'on_hold';
  instructions?: string;
  sideEffects?: string;
  responseNotes?: string;
  cost?: number;
  billingCode?: string;
  createdAt: string;
  updatedAt: string;
}


/** ────────────────────────────────────────────────────────────────
 * Optional Doctor Profile (For joins)
 * ────────────────────────────────────────────────────────────────
 */

export interface DoctorProfile {
  id: number;
  userId: number;
  specialization: string;
  licenseNumber?: string;
  workingHours?: Record<string, unknown>; // JSON: { monday: [...], tuesday: [...], ... }
  createdAt: string;
  updatedAt: string;

  user?: User;
}