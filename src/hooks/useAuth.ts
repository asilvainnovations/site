import { useState, useEffect, useCallback } from 'react';
import { User, AuthState } from '../types';

export const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    user: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const stored = localStorage.getItem('auth_user');
        if (stored) {
          setAuthState((prev) => ({
            ...prev,
            isAuthenticated: true,
            user: JSON.parse(stored),
            loading: false,
          }));
        } else {
          setAuthState((prev) => ({
            ...prev,
            loading: false,
          }));
        }
      } catch (error) {
        setAuthState((prev) => ({
          ...prev,
          error: 'Failed to restore session',
          loading: false,
        }));
      }
    };

    checkAuth();
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    setAuthState((prev) => ({ ...prev, loading: true }));
    try {
      const mockUser: User = {
        id: '1',
        email,
        name: email.split('@')[0],
        role: 'officer',
        organization: 'Sample Org',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      localStorage.setItem('auth_user', JSON.stringify(mockUser));
      setAuthState({
        isAuthenticated: true,
        user: mockUser,
        loading: false,
        error: null,
      });
    } catch (error) {
      setAuthState((prev) => ({
        ...prev,
        error: 'Login failed',
        loading: false,
      }));
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('auth_user');
    setAuthState({
      isAuthenticated: false,
      user: null,
      loading: false,
      error: null,
    });
  }, []);

  return { ...authState, login, logout };
};
