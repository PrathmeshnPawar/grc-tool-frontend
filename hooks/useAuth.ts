// hooks/useAuth.ts
import { useState, useEffect } from 'react';
import { apiFetch } from '@/lib/api';

export interface User {
  email: string;
  name: string;
  picture: string;
  role: string;
}

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = async () => {
    try {
      const data = await apiFetch('/api/users/v1/auth/me');
      if (data) {
        setUser(data);
      } else {
        setUser(null);
      }
    } catch (error) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const login = () => {
    // Redirect to the Spring Boot Google Login endpoint
    window.location.href = 'http://localhost:8085/oauth2/authorization/google';
  };

  return { user, loading, login };
};