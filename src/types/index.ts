export interface Role {
  id: number;
  name: 'doctor' | 'receptionist' | 'admin' | 'user'; // sadece bu üç rol varsa
}

export interface User {
  id: number;
  name: string;
  email: string;
  roles: Role[]; // Dizi halinde geliyor
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

export interface Patient {
  id: number;
  name: string;
  species: string;
  breed?: string;
  birthDate?: string;
  ownerName: string;
  ownerEmail: string;
  ownerPhone: string;
  createdAt: string;
  updatedAt: string;
}

export interface Appointment {
  id: number;
  patientId: number;
  doctorId: number;
  date: string;
  time: string;
  type: string;
  status: 'scheduled' | 'confirmed' | 'checked-in' | 'in-progress' | 'completed' | 'cancelled';
  notes?: string;
  createdAt: string;
  updatedAt: string;
  patient?: Patient;
  doctor?: User;
}

export interface MedicalRecord {
  id: number;
  patientId: number;
  appointmentId?: number;
  doctorId: number;
  diagnosis?: string;
  treatment?: string;
  prescription?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  patient?: Patient;
  doctor?: User;
  appointment?: Appointment;
}
