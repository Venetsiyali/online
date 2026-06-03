'use client';

import { useSession, signOut as nextAuthSignOut } from 'next-auth/react';
import { createContext, useContext } from 'react';

interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: string;
}

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  signOut: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();

  const user: AuthUser | null = session?.user
    ? {
        id: (session.user as { id?: string }).id || '',
        email: session.user.email || '',
        name: session.user.name || '',
        role: (session.user as { role?: string }).role || 'user',
      }
    : null;

  const loading = status === 'loading';

  const signOut = async () => {
    await nextAuthSignOut({ redirect: false });
  };

  return (
    <AuthContext.Provider value={{ user, loading, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
