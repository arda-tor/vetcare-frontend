import React, { createContext, useContext, useState, useEffect } from 'react';
import { AuthState, Credentials, RegisterData, User } from '../types';
import api from '../lib/axios';

interface AuthContextType extends AuthState {
  login: (credentials: Credentials) => Promise<User | null>;
  register: (data: RegisterData) => Promise<User | null>;
  logout: () => void;
  recoverPassword: (email: string) => Promise<boolean>;
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: true,
};

export const AuthContext = createContext<AuthContextType>({
  ...initialState,
  login: () => Promise.resolve(null),
  register: () => Promise.resolve(null),
  logout: () => {},
  recoverPassword: () => Promise.resolve(false),
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>(initialState);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const storedToken = localStorage.getItem('token');

    if (storedUser && storedToken) {
      api.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
      const user = JSON.parse(storedUser);
      setAuthState({ user, isAuthenticated: true, isLoading: false });
    } else {
      setAuthState({ ...initialState, isLoading: false });
    }
  }, []);

  const login = async (credentials: Credentials): Promise<User | null> => {
    try {
      const res = await api.post('/auth/login', credentials);
      const { token, user } = res.data.data;

      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));

      setAuthState({ user, isAuthenticated: true, isLoading: false });
      return user;
    } catch (error) {
      console.error('Login failed', error);
      setAuthState({ user: null, isAuthenticated: false, isLoading: false });
      return null;
    }
  };

  const register = async (data: RegisterData): Promise<User | null> => {
    try {
      const res = await api.post('/auth/register', data);
      const { token, user } = res.data.data;

      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));

      setAuthState({ user, isAuthenticated: true, isLoading: false });
      return user;
    } catch (error) {
      console.error('Register failed', error);
      setAuthState({ user: null, isAuthenticated: false, isLoading: false });
      return null;
    }
  };

  const logout = () => {
    try {
      api.post('/auth/logout');
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (e) {
      // silently fail
    }

    localStorage.removeItem('token');
    localStorage.removeItem('user');
    delete api.defaults.headers.common['Authorization'];

    setAuthState({ user: null, isAuthenticated: false, isLoading: false });
  };

  const recoverPassword = async (email: string): Promise<boolean> => {
    try {
      const res = await api.post('/auth/recover', { email });
      return res.status === 200;
    } catch (error) {
      console.error('Password recovery error:', error);
      return false;
    }
  };

  return (
    <AuthContext.Provider value={{ ...authState, login, register, logout, recoverPassword }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
