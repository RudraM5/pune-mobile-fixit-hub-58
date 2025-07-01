
import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  id: string;
  email: string;
  display_name?: string;
  role?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<{ error?: { message: string } }>;
  signUp: (email: string, password: string, displayName: string) => Promise<{ error?: { message: string } }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const signIn = async (email: string, password: string) => {
    setIsLoading(true);
    
    // Mock authentication - simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Check for demo admin credentials
    if (email === 'admin@mobilerepairwala.com' && password === 'admin123') {
      const mockUser = {
        id: '1',
        email: email,
        display_name: 'Admin User',
        role: 'admin'
      };
      setUser(mockUser);
      setIsLoading(false);
      console.log('Login successful:', mockUser);
      return { error: undefined };
    }
    
    // Check for demo user credentials
    if (email === 'user@example.com' && password === 'user123') {
      const mockUser = {
        id: '2',
        email: email,
        display_name: 'Demo User',
        role: 'user'
      };
      setUser(mockUser);
      setIsLoading(false);
      console.log('Login successful:', mockUser);
      return { error: undefined };
    }
    
    setIsLoading(false);
    return { error: { message: 'Invalid credentials. Use admin@mobilerepairwala.com / admin123 or user@example.com / user123' } };
  };

  const signUp = async (email: string, password: string, displayName: string) => {
    setIsLoading(true);
    
    // Mock sign up - simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const mockUser = {
      id: Date.now().toString(),
      email: email,
      display_name: displayName,
      role: 'user'
    };
    
    setUser(mockUser);
    setIsLoading(false);
    console.log('Sign up successful:', mockUser);
    return { error: undefined };
  };

  const signOut = async () => {
    setUser(null);
    console.log('User signed out');
  };

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated: !!user,
      isLoading,
      signIn,
      signUp,
      signOut
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
