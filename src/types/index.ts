export interface User {
  id: string;
  name: string;
  email: string;
  role: 'doctor' | 'receptionist' | 'admin';
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

export interface LoginFormValues {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface RecoveryFormValues {
  email: string;
}

export interface AlertProps {
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
}