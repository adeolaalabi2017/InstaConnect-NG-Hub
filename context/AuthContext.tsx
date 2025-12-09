
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';
import { MOCK_USER } from '../constants';

interface AuthContextType {
  user: User | null;
  login: (email: string, pass: string) => Promise<void>;
  register: (name: string, email: string, pass: string, role: 'consumer' | 'vendor') => Promise<void>;
  logout: () => void;
  updateCredits: (amount: number) => void;
  updateUser: (data: Partial<User>) => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check local storage for persistent auth (mocking)
    const storedUser = localStorage.getItem('insta_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, pass: string) => {
    // Mock login delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Check if user is banned via mock backend (localStorage)
    const bannedUsers = JSON.parse(localStorage.getItem('banned_users') || '[]');
    if (bannedUsers.includes(email)) {
        throw new Error("This account has been suspended. Please contact support.");
    }

    // Determine role based on email for demo purposes
    let role: 'consumer' | 'vendor' | 'admin' = 'consumer';
    const lowerEmail = email.toLowerCase();
    
    if (lowerEmail.includes('admin')) {
        role = 'admin';
    } else if (lowerEmail.includes('vendor')) {
        role = 'vendor';
    }

    // Create user with appropriate ID mapping
    // ID '1' owns the mock business, so we give it to vendors for testing dashboard
    const newUser: User = {
        ...MOCK_USER,
        id: role === 'vendor' ? '1' : (role === 'admin' ? 'admin-1' : Math.random().toString(36).substr(2, 9)),
        email: email,
        name: email.split('@')[0].charAt(0).toUpperCase() + email.split('@')[0].slice(1), // Use email handle as name
        role: role,
        image: `https://ui-avatars.com/api/?name=${encodeURIComponent(email.split('@')[0])}&background=random`,
        status: 'active'
    };

    // Keep original mock data if logging in as the default hardcoded user
    if (email === MOCK_USER.email) {
         newUser.id = MOCK_USER.id;
         newUser.name = MOCK_USER.name;
         newUser.image = MOCK_USER.image;
         newUser.role = MOCK_USER.role;
         newUser.notificationPreferences = MOCK_USER.notificationPreferences;
         newUser.status = MOCK_USER.status;
    }

    setUser(newUser);
    localStorage.setItem('insta_user', JSON.stringify(newUser));
  };

  const register = async (name: string, email: string, pass: string, role: 'consumer' | 'vendor') => {
    // Mock register delay
    await new Promise(resolve => setTimeout(resolve, 800));
    const newUser: User = {
      id: Math.random().toString(36).substr(2, 9),
      name,
      email,
      image: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random`,
      role: role,
      credits: 0,
      badges: [],
      reputationPoints: 0,
      referralCode: Math.random().toString(36).substr(2, 8).toUpperCase(),
      referralCount: 0,
      notificationPreferences: { email: true, inApp: true },
      status: 'active'
    };
    setUser(newUser);
    localStorage.setItem('insta_user', JSON.stringify(newUser));
  };

  const updateCredits = (amount: number) => {
    if (user) {
      const updatedUser = { ...user, credits: user.credits + amount };
      setUser(updatedUser);
      localStorage.setItem('insta_user', JSON.stringify(updatedUser));
    }
  };

  const updateUser = (data: Partial<User>) => {
      if (user) {
          const updatedUser = { ...user, ...data };
          setUser(updatedUser);
          localStorage.setItem('insta_user', JSON.stringify(updatedUser));
      }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('insta_user');
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, updateCredits, updateUser, isLoading }}>
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
