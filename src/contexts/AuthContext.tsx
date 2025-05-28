import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, AuthState, Credentials } from '../types';
import { mockAuthenticate, mockSendPasswordRecovery } from '../utils/mockData';

interface AuthContextType extends AuthState {
  login: (credentials: Credentials) => Promise<User | null>;
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
  logout: () => {},
  recoverPassword: () => Promise.resolve(false),
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>(initialState);

  useEffect(() => {
    // Check for existing session in localStorage
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        setAuthState({
          user,
          isAuthenticated: true,
          isLoading: false,
        });
      } catch (error) {
        console.error('Failed to parse stored user', error);
        localStorage.removeItem('user');
        setAuthState({ ...initialState, isLoading: false });
      }
    } else {
      setAuthState({ ...initialState, isLoading: false });
    }
  }, []);

  const login = async (credentials: Credentials): Promise<User | null> => {
    setAuthState((prev) => ({ ...prev, isLoading: true }));
    try {
      const user = await mockAuthenticate(credentials.email, credentials.password);
      if (user) {
        localStorage.setItem('user', JSON.stringify(user));
        setAuthState({
          user,
          isAuthenticated: true,
          isLoading: false,
        });
        return user;
      }
      setAuthState((prev) => ({ ...prev, isLoading: false }));
      return null;
    } catch (error) {
      console.error('Login error:', error);
      setAuthState((prev) => ({ ...prev, isLoading: false }));
      return null;
    }
  };

  const logout = () => {
    localStorage.removeItem('user');
    setAuthState({
      user: null,
      isAuthenticated: false,
      isLoading: false,
    });
  };

  const recoverPassword = async (email: string): Promise<boolean> => {
    setAuthState((prev) => ({ ...prev, isLoading: true }));
    try {
      const success = await mockSendPasswordRecovery(email);
      setAuthState((prev) => ({ ...prev, isLoading: false }));
      return success;
    } catch (error) {
      console.error('Password recovery error:', error);
      setAuthState((prev) => ({ ...prev, isLoading: false }));
      return false;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        ...authState,
        login,
        logout,
        recoverPassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);