'use client';
import { createContext, useContext, useEffect, useState } from 'react';
import { User } from '@/lib/types';
import { fetcher } from '@/lib/api-client';

// 1. Update the interface to include the login function
interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: () => void; // Define the function signature
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetcher<User>('/api/users/v1/auth/me')
      .then(setUser)
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  // 2. Define the login logic (Redirects to your Spring Boot Backend)
  const login = () => {
    window.location.href = 'http://localhost:8085/oauth2/authorization/google';
  };

  return (
    // 3. Pass login into the value object
    <AuthContext.Provider value={{ user, loading, login }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useUser must be used within AuthProvider");
  return context;
};