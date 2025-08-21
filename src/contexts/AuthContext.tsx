import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '../lib/supabase';
import { getCurrentUserProfile } from '../services/auth';
import type { Profile } from '../lib/supabase';

interface User {
  id: string;
  name: string;
  email: string;
  profile?: Profile;
}

interface AuthContextType {
  user: User | null;
  isVisitor: boolean;
  loading: boolean;
  login: (user: User) => void;
  logout: () => Promise<void>;
  setVisitorMode: (isVisitor: boolean) => void;
  refreshUser: () => Promise<void>;
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
  const [loading, setLoading] = useState(true);

  const refreshUser = async () => {
    try {
      const { data: { user: authUser } } = await supabase.auth.getUser();
      
      if (authUser) {
        const profile = await getCurrentUserProfile();
        setUser({
          id: authUser.id,
          name: profile?.full_name || authUser.email || '',
          email: authUser.email || '',
          profile: profile || undefined
        });
        setIsVisitor(false);
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error('Error refreshing user:', error);
      setUser(null);
    }
  };

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user) {
          const profile = await getCurrentUserProfile();
          setUser({
            id: session.user.id,
            name: profile?.full_name || session.user.email || '',
            email: session.user.email || '',
            profile: profile || undefined
          });
        }
      } catch (error) {
        console.error('Error getting initial session:', error);
      } finally {
        setLoading(false);
      }
    };

    getInitialSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session?.user) {
          try {
            const profile = await getCurrentUserProfile();
            setUser({
              id: session.user.id,
              name: profile?.full_name || session.user.email || '',
              email: session.user.email || '',
              profile: profile || undefined
            });
            setIsVisitor(false);
          } catch (error) {
            console.error('Error getting user profile:', error);
          }
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
          setIsVisitor(false);
        }
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const login = (userData: User) => {
    setUser(userData);
    setIsVisitor(false);
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      setIsVisitor(false);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const setVisitorMode = (visitor: boolean) => {
    setIsVisitor(visitor);
    if (visitor) {
      setUser(null);
    }
  };

  const value = {
    user,
    isVisitor,
    loading,
    login,
    logout,
    setVisitorMode,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
