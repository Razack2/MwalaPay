import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import type { User } from '../types';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (data: RegisterData) => Promise<boolean>;
  logout: () => void;
  updateUser: (updates: Partial<User>) => void;
  isAuthenticated: boolean;
}

interface RegisterData {
  email: string;
  password: string;
  fullName: string;
  phoneNumber: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('mwalapay_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    // Mock login - check stored users
    const users = JSON.parse(localStorage.getItem('mwalapay_users') || '{}');
    const userKey = Object.keys(users).find(key => users[key].email === email);

    if (userKey && users[userKey].password === password) {
      const userData = users[userKey];
      delete userData.password; // Don't store password in session
      setUser(userData);
      localStorage.setItem('mwalapay_user', JSON.stringify(userData));
      return true;
    }
    return false;
  };

  const register = async (data: RegisterData): Promise<boolean> => {
    const users = JSON.parse(localStorage.getItem('mwalapay_users') || '{}');

    // Check if email already exists
    const emailExists = Object.values(users).some((u: any) => u.email === data.email);
    if (emailExists) {
      return false;
    }

    const userId = `user_${Date.now()}`;
    const newUser: User = {
      id: userId,
      email: data.email,
      fullName: data.fullName,
      phoneNumber: data.phoneNumber,
      kycStatus: 'not_started',
      twoFactorEnabled: false,
      biometricEnabled: false,
      createdAt: new Date().toISOString(),
    };

    users[userId] = { ...newUser, password: data.password };
    localStorage.setItem('mwalapay_users', JSON.stringify(users));

    // Create default wallets
    const wallets = JSON.parse(localStorage.getItem('mwalapay_wallets') || '[]');
    wallets.push(
      {
        id: `wallet_${Date.now()}_1`,
        userId: userId,
        currency: 'MWK',
        balance: 0,
        accountNumber: `MW${Math.random().toString().slice(2, 14)}`,
        isDefault: true,
      },
      {
        id: `wallet_${Date.now()}_2`,
        userId: userId,
        currency: 'USD',
        balance: 0,
        accountNumber: `US${Math.random().toString().slice(2, 14)}`,
        isDefault: false,
      }
    );
    localStorage.setItem('mwalapay_wallets', JSON.stringify(wallets));

    setUser(newUser);
    localStorage.setItem('mwalapay_user', JSON.stringify(newUser));
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('mwalapay_user');
  };

  const updateUser = (updates: Partial<User>) => {
    if (!user) return;

    const updatedUser = { ...user, ...updates };
    setUser(updatedUser);
    localStorage.setItem('mwalapay_user', JSON.stringify(updatedUser));

    // Update in users store
    const users = JSON.parse(localStorage.getItem('mwalapay_users') || '{}');
    if (users[user.id]) {
      users[user.id] = { ...users[user.id], ...updates };
      localStorage.setItem('mwalapay_users', JSON.stringify(users));
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      login,
      register,
      logout,
      updateUser,
      isAuthenticated: !!user,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
