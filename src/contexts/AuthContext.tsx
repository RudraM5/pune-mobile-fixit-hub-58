
import React, { createContext, useContext, useState, useEffect } from 'react';

interface Profile {
  id: string;
  display_name: string | null;
  phone: string | null;
  avatar_url: string | null;
  role: 'customer' | 'admin' | 'technician';
}

interface AuthUser {
  id: string;
  email: string;
  profile?: Profile;
}

interface AuthContextType {
  user: AuthUser | null;
  profile: Profile | null;
  signUp: (email: string, password: string, metadata?: any) => Promise<{ error: any }>;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  isLoading: boolean;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isTechnician: boolean;
  updateProfile: (updates: Partial<Profile>) => Promise<{ error: any }>;
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
  const [user, setUser] = useState<AuthUser | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Mock authentication - replace with your preferred auth solution
  const signUp = async (email: string, password: string, metadata = {}) => {
    try {
      // TODO: Replace with actual authentication service
      console.log('Sign up:', { email, password, metadata });
      return { error: new Error('Authentication service not connected') };
    } catch (error) {
      return { error };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      // TODO: Replace with actual authentication service
      console.log('Sign in:', { email, password });
      return { error: new Error('Authentication service not connected') };
    } catch (error) {
      return { error };
    }
  };

  const signOut = async () => {
    setUser(null);
    setProfile(null);
  };

  const updateProfile = async (updates: Partial<Profile>) => {
    if (!user) return { error: new Error('No user logged in') };
    
    // TODO: Replace with actual profile update service
    const updatedProfile = { ...profile, ...updates } as Profile;
    setProfile(updatedProfile);
    return { error: null };
  };

  // Mock admin check - update based on your requirements
  const isAdmin = profile?.role === 'admin' || user?.email === 'admin@example.com';

  const value: AuthContextType = {
    user,
    profile,
    signUp,
    signIn,
    signOut,
    isLoading,
    isAuthenticated: !!user,
    isAdmin,
    isTechnician: profile?.role === 'technician',
    updateProfile
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
