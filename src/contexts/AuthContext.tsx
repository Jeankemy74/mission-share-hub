
import React, { createContext, useContext, useState, useEffect } from 'react';

// Define user types based on the application logic
export type UserRole = 'admin' | 'mission_chief' | 'member' | 'external';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatar?: string;
}

// Mock users for simulation
const MOCK_USERS: User[] = [
  {
    id: '1',
    email: 'admin@igfshare.fr',
    name: 'Admin IGF',
    role: 'admin',
    avatar: 'https://i.pravatar.cc/150?u=admin'
  },
  {
    id: '2',
    email: 'chef@igfshare.fr',
    name: 'Thomas Bernard',
    role: 'mission_chief',
    avatar: 'https://i.pravatar.cc/150?u=chef'
  },
  {
    id: '3',
    email: 'membre@igfshare.fr',
    name: 'Marie Laurent',
    role: 'member',
    avatar: 'https://i.pravatar.cc/150?u=membre'
  },
  {
    id: '4',
    email: 'externe@igfshare.fr',
    name: 'Alexandre Martin',
    role: 'external',
    avatar: 'https://i.pravatar.cc/150?u=externe'
  }
];

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<User>;
  register: (email: string, name: string, password: string) => Promise<User>;
  logout: () => void;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check if user is stored in localStorage on component mount
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<User> => {
    setLoading(true);
    setError(null);
    
    try {
      // Simulate API request delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Find user by email (simplified auth for mock purposes)
      const foundUser = MOCK_USERS.find(u => u.email.toLowerCase() === email.toLowerCase());
      
      if (!foundUser) {
        throw new Error('Identifiants invalides');
      }
      
      // For demonstration, we consider any non-empty password as valid
      if (!password) {
        throw new Error('Mot de passe requis');
      }

      // Store user in localStorage
      localStorage.setItem('user', JSON.stringify(foundUser));
      setUser(foundUser);
      return foundUser;
    } catch (error) {
      setError((error as Error).message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (email: string, name: string, password: string): Promise<User> => {
    setLoading(true);
    setError(null);
    
    try {
      // Simulate API request delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Check if user already exists
      if (MOCK_USERS.some(u => u.email.toLowerCase() === email.toLowerCase())) {
        throw new Error('Cet email est déjà utilisé');
      }
      
      // For demonstration, we consider any non-empty password as valid
      if (!password) {
        throw new Error('Mot de passe requis');
      }

      // Create new user (in a real app, this would be stored in a database)
      const newUser: User = {
        id: `${MOCK_USERS.length + 1}`,
        email,
        name,
        role: 'member', // Default role for new users
        avatar: `https://i.pravatar.cc/150?u=${email}`
      };

      // Store user in localStorage
      localStorage.setItem('user', JSON.stringify(newUser));
      setUser(newUser);
      return newUser;
    } catch (error) {
      setError((error as Error).message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        error
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
