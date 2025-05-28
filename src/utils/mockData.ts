import { User } from '../types';

export const MOCK_USERS: User[] = [
  {
    id: '1',
    name: 'Dr. Sarah Johnson',
    email: 'doctor@example.com',
    role: 'doctor',
  },
  {
    id: '2',
    name: 'Emily Davis',
    email: 'receptionist@example.com',
    role: 'receptionist',
  },
  {
    id: '3',
    name: 'Michael Clark',
    email: 'admin@example.com',
    role: 'admin',
  },
];

// For MVP, we're using a simple mock authentication system
export const mockAuthenticate = (email: string, password: string): Promise<User | null> => {
  return new Promise((resolve) => {
    // Simulate API call delay
    setTimeout(() => {
      // In a real app, we'd check password hashes
      // For demo purposes, any password will work with the mock emails
      const user = MOCK_USERS.find((u) => u.email === email);
      resolve(user || null);
    }, 800);
  });
};

export const mockSendPasswordRecovery = (email: string): Promise<boolean> => {
  return new Promise((resolve) => {
    // Simulate API call delay
    setTimeout(() => {
      // Check if the email is in our mock users
      const userExists = MOCK_USERS.some((u) => u.email === email);
      resolve(userExists);
    }, 800);
  });
};