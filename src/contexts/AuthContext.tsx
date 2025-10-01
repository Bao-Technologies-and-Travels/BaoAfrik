import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authService } from '../services/authService';
import * as Sentry from '@sentry/react';

interface User {
  id: string;
  name: string;
  email: string;
  profileImage?: string;
  provider?: string;
}

interface AuthContextType {
  user: User | null;
  isVisitor: boolean;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (user: User) => void;
  logout: () => Promise<void>;
  setVisitorMode: (isVisitor: boolean) => void;
  updateUserProfile: (profileData: Partial<User>) => void;
  refreshAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isVisitor, setIsVisitor] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const isAuthenticated = !!user && !isVisitor;

  // Check for existing authentication on mount
  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem('accessToken');
      const storedUser = localStorage.getItem('user');

      // Seed from localStorage quickly to avoid UI flicker
      if (token && storedUser) {
        try {
          const parsedUser = JSON.parse(storedUser);
          setUser(parsedUser);
          // Set Sentry user context from stored user
          Sentry.setUser({ id: parsedUser.id, email: parsedUser.email, username: parsedUser.name });
        } catch (error) {
          console.error('Error parsing stored user:', error);
          localStorage.removeItem('user');
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
        }
      }

      // Always try to refresh from server if we have a token
      if (token) {
        try {
          const resp = await authService.getCurrentUser();
          if (resp.success && resp.data) {
            setUser(resp.data);
            localStorage.setItem('user', JSON.stringify(resp.data));
            Sentry.setUser({ id: resp.data.id, email: resp.data.email, username: resp.data.name });
          }
        } catch (e) {
          console.warn('Initial auth refresh failed (non-blocking):', e);
        }
      }

      setIsLoading(false);
    };

    initializeAuth();
  }, []);

  const login = (userData: User) => {
    setUser(userData);
    setIsVisitor(false);
    localStorage.setItem('user', JSON.stringify(userData));
    // Set Sentry user context on login
    Sentry.setUser({ id: userData.id, email: userData.email, username: userData.name });
  };

  const logout = async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
      setIsVisitor(false);
      localStorage.removeItem('user');
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('rememberedEmail');
      // Clear Sentry user context on logout
      Sentry.setUser(null);
    }
  };

  const setVisitorMode = (visitor: boolean) => {
    setIsVisitor(visitor);
    if (visitor) {
      setUser(null);
    }
  };

  const updateUserProfile = (profileData: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...profileData };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
    }
  };

  const refreshAuth = async () => {
    try {
      const response = await authService.getCurrentUser();
      if (response.success && response.data) {
        setUser(response.data);
        localStorage.setItem('user', JSON.stringify(response.data));
        Sentry.setUser({ id: response.data.id, email: response.data.email, username: response.data.name });
      }
    } catch (error) {
      console.error('Auth refresh error:', error);
      await logout();
    }
  };

  const value = {
    user,
    isVisitor,
    isLoading,
    isAuthenticated,
    login,
    logout,
    setVisitorMode,
    updateUserProfile,
    refreshAuth,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
