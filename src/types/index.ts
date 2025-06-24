
import { ReactNode } from "react";

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


export interface Pet {
  id: number;
  
  ownerId: number;
  name: string;
  species: string;
  breed?: string; 
  dateOfBirth?: string; 
  gender: 'male' | 'female' | 'other'; 
  weight?: number; 
  color?: string;
  microchipNumber?: string;
  createdAt: string;
  updatedAt: string;

  
  age?: number; 
  owner: { 
    id: number;
    name: string;
    email: string;
    
  };

  
  medicalRecords?: MedicalRecord[];
  appointments?: Appointment[];
}



export interface AddPetFormValues {
  name: string;
  species: string;
  breed: string; 
  birthDate?: string; 
  weight?: number; 
  gender: 'male' | 'female' | 'other' | ''; 
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
  
  vitalSigns?: Record<string, any>; 
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


export interface DoctorProfile {
  id: number;
  userId: number;
  specialization: string;
  licenseNumber?: string;
  workingHours?: Record<string, unknown>; 
  createdAt: string;
  updatedAt: string;

  user?: User;
}

export interface TimeSlot {
  time: string;
  time_range: string;
  available_count: number;
  total_doctors: number;
}

export interface CalendarDay {
  date: string;
  day_name: string;
  available_slots: TimeSlot[];
  total_available_slots: number;
}

export interface CalendarResponse {
  is_success: boolean;
  message: string;
  data: {
    calendar: CalendarDay[];
    date_range: {
      start: string;
      end: string;
    };
  };
}

export interface AvailableDoctor {
  id: number;
  name: string;
  specialization: string;
  email?: string;
  license_number?: string;
}

export interface AvailableDoctorsResponse {
  is_success: boolean;
  message: string;
  data: {
    doctors: AvailableDoctor[];
    date: string;
    time: string;
    time_range: string;
  };
}

export interface UpcomingAppointment {
  id: number;
  doctor_id: number;
  doctor_name: string;
  doctor_specialization: string;
  user_id: number;
  user_name: string;
  user_email: string;
  pet_id: number;
  pet_name: string;
  pet_species: string;
  pet_breed: string;
  start_datetime: string;
  end_datetime: string;
  appointment_type: string;
  duration: number;
  notes: string | null;
  status: string;
  created_at: string;
  updated_at: string;
}