import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import type { Profile } from '@/types';

interface AuthContextValue {
  user: Profile | null;
  profile: Profile | null;
  session: { access_token: string } | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: string | null; legacy?: boolean }>;
  signUp: (email: string, password: string, fullName: string, role: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<Profile | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [session, setSession] = useState<{ access_token: string } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (token) {
      setSession({ access_token: token });
      loadProfile(token);
    } else {
      setLoading(false);
    }
  }, []);

  async function loadProfile(token: string) {
    try {
      const response = await fetch('/api/auth/me.php', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
        setProfile(data.user);
      } else {
        localStorage.removeItem('access_token');
        setSession(null);
        setUser(null);
        setProfile(null);
      }
    } catch (err) {
      console.error('Failed to load profile', err);
    } finally {
      setLoading(false);
    }
  }

  async function refreshProfile() {
    if (session?.access_token) {
      await loadProfile(session.access_token);
    }
  }

  async function signIn(email: string, password: string) {
    try {
      const response = await fetch('/api/auth/login.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await response.json();
      if (!response.ok) {
        return { error: data.error || 'Login failed', legacy: data.legacy };
      }
      
      localStorage.setItem('access_token', data.token);
      setSession({ access_token: data.token });
      setUser(data.user);
      setProfile(data.user);
      return { error: null };
    } catch (err) {
      return { error: 'Network error occurred' };
    }
  }

  async function signUp(email: string, password: string, fullName: string, role: string) {
    try {
      const response = await fetch('/api/auth/register.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, full_name: fullName, role })
      });
      const data = await response.json();
      if (!response.ok) {
        return { error: data.error || 'Registration failed' };
      }
      
      localStorage.setItem('access_token', data.token);
      setSession({ access_token: data.token });
      setUser(data.user);
      setProfile(data.user);
      return { error: null };
    } catch (err) {
      return { error: 'Network error occurred' };
    }
  }

  async function signOut() {
    localStorage.removeItem('access_token');
    setSession(null);
    setUser(null);
    setProfile(null);
  }

  return (
    <AuthContext.Provider value={{ user, profile, session, loading, signIn, signUp, signOut, refreshProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
