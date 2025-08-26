import React, { createContext, useContext, useState, ReactNode } from 'react';

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
  login: (user: User) => void;
  logout: () => void;
  setVisitorMode: (isVisitor: boolean) => void;
  updateUserProfile: (profileData: Partial<User>) => void;
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

  const login = (userData: User) => {
    setUser(userData);
    setIsVisitor(false);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    // Clear remembered email on explicit logout
    localStorage.removeItem('rememberedEmail');
  };

  const setVisitorMode = (visitor: boolean) => {
    setIsVisitor(visitor);
    if (visitor) {
      setUser(null); // Clear user data when in visitor mode
    }
  };

  const updateUserProfile = (profileData: Partial<User>) => {
    if (user) {
      setUser({ ...user, ...profileData });
    }
  };

  const value = {
    user,
    isVisitor,
    login,
    logout,
    setVisitorMode,
    updateUserProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
