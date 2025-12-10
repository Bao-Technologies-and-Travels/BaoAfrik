import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { authService, AuthService } from "../services/authService";
import { useToast } from "./ToastContext";
import { TokenManager } from "../utils/tokenManager";

interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  profileImage?: string;
  gender?: string;
  birthDate?: string;
  phoneNumber?: string;
  location?: string;
  bio?: string;
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
  login: (user: User, accessToken: string, refreshToken?: string) => void;
  logout: () => Promise<void>;
  setVisitorMode: (isVisitor: boolean) => void;
  updateUserProfile: (profileData: Partial<User>) => void;
  isLoading: boolean;
  refreshTokens: () => Promise<void>;
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

  const [isVisitor, setIsVisitor] = useState(() => {
    return localStorage.getItem('isVisitor') === 'true';
  });
  const [isLoading, setIsLoading] = useState(false);
  const { addToast } = useToast();

  // Initialize token refresh on app start
  useEffect(() => {
    if (TokenManager.isAuthenticated()) {
      TokenManager.scheduleTokenRefresh();
    }
  }, []);

  const login = (
    userData: User,
    accessToken: string,
    refreshToken?: string
  ) => {
    setUser(userData);
    setIsVisitor(false);
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.removeItem("isVisitor");

    // if refreshToken is provided
    if (refreshToken) {
      TokenManager.setTokens(accessToken, refreshToken);
    } else {
      // Just set access token if no refresh token
      localStorage.setItem("accessToken", accessToken);
    }
  };

  const logout = async (): Promise<void> => {
    try {
      setIsLoading(true);
      TokenManager.clearTokens();

      localStorage.removeItem("user");
      localStorage.removeItem("rememberedEmail");
      localStorage.removeItem("currentConversation");
      localStorage.removeItem("activeConversationId");
      localStorage.removeItem("isVisitor");

      sessionStorage.clear();
      setUser(null);
      setIsVisitor(false);

      try {
        await authService.logout();
      } catch (error) { }

      addToast({
        type: "success",
        title: 'Logged out',
        message: "You have been successfully logged out.",
        duration: 2500,
      });

      window.location.href = '/login';

    } catch (error: any) {
      // clear frontend even when there is an error
      setUser(null);
      setIsVisitor(false);
      TokenManager.clearTokens();
      localStorage.clear();
      sessionStorage.clear();

      addToast({
        type: "success",
        title: 'Logged out',
        message: "You have been logged out from this device.",
        duration: 2500,
      });

      window.location.href = '/login';
    } finally {
      setIsLoading(false);
    }
  };

  const refreshTokens = async () => {
    try {
      const newAccessToken = await TokenManager.refreshToken();
    } catch (error) {
      await logout();
      throw error;
    }
  };

  const setVisitorMode = (visitor: boolean) => {
    setIsVisitor(visitor);
    if (visitor) {
      setUser(null); // Clear user data when in visitor mode
      TokenManager.clearTokens();
      localStorage.setItem('isVisitor', 'true');
    } else {
      localStorage.removeItem('isVisitor');
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
    refreshTokens,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
