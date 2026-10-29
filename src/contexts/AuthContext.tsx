'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export type UserRole = 'passenger' | 'driver';

export interface UserProfile {
  name: string;
  phone: string;
  role: UserRole;
  vehicleType?: 'AJALA' | 'CAR' | 'BUS';
}

interface AuthContextType {
  user: UserProfile | null;
  loading: boolean;
  login: (profile: UserProfile) => void;
  logout: () => void;
  switchRole: (newRole: UserRole) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const STORAGE_KEY = 'mmshwar_user_session';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        setUser(parsed);
        // Sync cookie for server API role detection
        document.cookie = `qa_user_role=${parsed.role === 'driver' ? 'driver' : 'rider'}; path=/; max-age=2592000`;
      }
    } catch (e) {
      console.error('Error restoring session:', e);
    } finally {
      setLoading(false);
    }
  }, []);

  const login = (profile: UserProfile) => {
    setUser(profile);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
    document.cookie = `qa_user_role=${profile.role === 'driver' ? 'driver' : 'rider'}; path=/; max-age=2592000`;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(STORAGE_KEY);
    document.cookie = `qa_user_role=; path=/; max-age=0`;
  };

  const switchRole = (newRole: UserRole) => {
    if (!user) return;
    const updated = { ...user, role: newRole };
    setUser(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    document.cookie = `qa_user_role=${newRole === 'driver' ? 'driver' : 'rider'}; path=/; max-age=2592000`;
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, switchRole }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
