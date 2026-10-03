import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile } from '../types';
import { DEMO_USERS, INITIAL_USER_PROFILE } from '../data/mockData';

interface AuthContextType {
  user: UserProfile | null;
  isAuthenticated: boolean;
  loginAsDemo: (userKey: 'rahim' | 'sadia') => void;
  loginCustom: (mobile: string, pin: string) => boolean;
  logout: () => void;
  updateProfile: (updates: Partial<UserProfile>) => void;
  resetDemoUser: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(() => {
    try {
      const saved = localStorage.getItem('upay_savings_user');
      return saved ? JSON.parse(saved) : INITIAL_USER_PROFILE;
    } catch {
      return INITIAL_USER_PROFILE;
    }
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem('upay_savings_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('upay_savings_user');
    }
  }, [user]);

  const loginAsDemo = (userKey: 'rahim' | 'sadia') => {
    const selected = DEMO_USERS[userKey] || INITIAL_USER_PROFILE;
    setUser({ ...selected });
  };

  const loginCustom = (mobile: string, _pin: string) => {
    // In mock demo mode, any 4-digit PIN is accepted
    const cleanPhone = mobile.trim();
    const newUser: UserProfile = {
      ...INITIAL_USER_PROFILE,
      id: `usr_${Date.now()}`,
      name: 'upay Demo Saver',
      mobile: cleanPhone || '+880 1700-000000',
      autoDebitPaymentSource: `upay Wallet (Linked: ${cleanPhone || '01700-000000'})`
    };
    setUser(newUser);
    return true;
  };

  const logout = () => {
    setUser(null);
  };

  const updateProfile = (updates: Partial<UserProfile>) => {
    setUser(prev => (prev ? { ...prev, ...updates } : null));
  };

  const resetDemoUser = () => {
    setUser({ ...INITIAL_USER_PROFILE });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        loginAsDemo,
        loginCustom,
        logout,
        updateProfile,
        resetDemoUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
