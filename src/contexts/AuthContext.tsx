import React, { createContext, useContext, useState, ReactNode } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  isVisitor: boolean;
  login: (user: User) => void;
  logout: () => void;
  setVisitorMode: (isVisitor: boolean) => void;
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
    setIsVisitor(false);
  };

  const setVisitorMode = (visitor: boolean) => {
    setIsVisitor(visitor);
    if (visitor) {
      setUser(null); // Clear user data when in visitor mode
    }
  };

  const value = {
    user,
    isVisitor,
    login,
    logout,
    setVisitorMode,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
