import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  id: string;
  name: string;
  phone: string;
  email?: string;
  role: 'customer' | 'admin';
}

interface AuthContextType {
  user: User | null;
  login: (phone: string, otp: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
  isAuthenticated: boolean;
  isAdmin: boolean;
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
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for stored user session
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        localStorage.removeItem('user');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (phone: string, otp: string): Promise<boolean> => {
    setIsLoading(true);
    
    // Simulate OTP verification
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock user data - in real app, this would come from your backend
    let mockUser: User;
    
    if (phone === '9876543210' && otp === '1234') {
      // Admin user
      mockUser = {
        id: 'admin-1',
        name: 'Admin User',
        phone: '9876543210',
        email: 'admin@fixmyphone.com',
        role: 'admin'
      };
    } else if (otp === '1234') {
      // Regular customer
      mockUser = {
        id: `user-${Date.now()}`,
        name: 'Customer',
        phone: phone,
        role: 'customer'
      };
    } else {
      setIsLoading(false);
      return false;
    }

    setUser(mockUser);
    localStorage.setItem('user', JSON.stringify(mockUser));
    setIsLoading(false);
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  const value: AuthContextType = {
    user,
    login,
    logout,
    isLoading,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin'
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};