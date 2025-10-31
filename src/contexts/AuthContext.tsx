import React, { createContext, useContext, useState, ReactNode } from "react";
import { authService, AuthService } from "../services/authService";
import { useToast } from "./ToastContext";

interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  profileImage?: string;
  gender?: string;
  birthDate?: string;
  phoneNumber?: string;
  emailVerified?: boolean;
  isVerifiedSeller?: boolean;
  provider?: string;
  lastLoginAt?: string;
  createdAt?: string;
  updatedAt?: string;
}

interface AuthContextType {
  user: User | null;
  isVisitor: boolean;
  login: (user: User, accessToken?: string, refreshToken?: string) => void;
  logout: () => Promise<void>;
  setVisitorMode: (isVisitor: boolean) => void;
  updateUserProfile: (profileData: Partial<User>) => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    try {
      const stored = localStorage.getItem("user");
      return stored && stored !== "undefined" ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const [isVisitor, setIsVisitor] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { addToast } = useToast();

  const login = (
    userData: User,
    accessToken?: string,
    refreshToken?: string
  ) => {
    setUser(userData);
    setIsVisitor(false);
    localStorage.setItem("user", JSON.stringify(userData));

    if (accessToken) {
      localStorage.setItem("accessToken", accessToken);
    }
    if (refreshToken) {
      localStorage.setItem("refreshToken", refreshToken);
    }
  };

  const logout = async (): Promise<void> => {
    try {
      setIsLoading(true);

      localStorage.removeItem("user");
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("rememberedEmail");
      localStorage.removeItem("currentConversation");
      localStorage.removeItem("activeConversationId");

      sessionStorage.clear();
      setUser(null);
      setIsVisitor(false);

      try {
        await authService.logout();
      } catch (error) {}

      addToast({
        type: "success",
        title: "Logged out",
        message: "You have been successfully logged out.",
        duration: 3000,
      });

      window.location.href = '/login';
      
    } catch (error: any) {
      // clear frontend even when there is an error
      setUser(null);
      setIsVisitor(false);
      localStorage.clear();
      sessionStorage.clear();
      window.location.href = '/login';

      addToast({
        type: "success",
        title: "Logged out",
        message: "You have been logged out from this device.",
        duration: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const setVisitorMode = (visitor: boolean) => {
    setIsVisitor(visitor);
    if (visitor) {
      setUser(null); // Clear user data when in visitor mode
    }
  };

  const updateUserProfile = (profileData: Partial<User>) => {
    setUser((prevUser) => {
      if (!prevUser) return prevUser;

      const updatedUser = { ...prevUser, ...profileData };
      localStorage.setItem("user", JSON.stringify(updatedUser));
      return updatedUser;
    });
  };

  const value: AuthContextType = {
    user,
    isVisitor,
    login,
    logout,
    setVisitorMode,
    updateUserProfile,
    isLoading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
