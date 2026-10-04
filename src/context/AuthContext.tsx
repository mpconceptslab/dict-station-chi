import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';
import { setTier as persistTier, type Tier } from '../utils/limits';

/** Personal details collected once on first use. */
export interface KidProfile {
  kidName: string;
  kidSchool: string;
  kidGrade: string;
}

interface User extends KidProfile {
  /** Identity used for per-user data isolation (derived from the kid's name). */
  username: string;
  createdAt: string;
  /** Subscription tier; defaults to 'free' on first run. */
  tier?: Tier;
}

interface AuthContextType {
  currentUser: User | null;
  /** Save the child's profile and log them in automatically. */
  setupProfile: (profile: KidProfile) => void;
  /** Clear the local session (returns to the profile setup page). */
  logout: () => void;
  /** Change the subscription tier (free <-> pro). */
  setTier: (tier: Tier) => void;
  getUserId: () => string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const SESSION_KEY = 'current_session';

// Read the saved profile synchronously so the very first render already
// knows whether this is a returning user (auto-login) or a first run.
function readSavedSession(): User | null {
  const session = localStorage.getItem(SESSION_KEY);
  if (!session) return null;
  try {
    const user = JSON.parse(session) as User;
    return user && user.username ? user : null;
  } catch {
    localStorage.removeItem(SESSION_KEY);
    return null;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(readSavedSession);

  function getUserId(): string {
    return currentUser ? `user_${currentUser.username}` : 'default';
  }

  function setupProfile(profile: KidProfile): void {
    let createdAt = new Date().toISOString();
    let tier: Tier = 'free';
    // The username is the per-user data namespace (IndexedDB, points, limits).
    // It is assigned ONCE on first run and then kept stable, so editing the
    // child's display name later never silently switches to an empty namespace
    // and "loses" their word lists / sessions / points.
    let username = profile.kidName.trim();
    const existing = localStorage.getItem(SESSION_KEY);
    if (existing) {
      try {
        const prev = JSON.parse(existing) as User;
        if (prev?.createdAt) createdAt = prev.createdAt;
        if (prev?.tier === 'pro') tier = 'pro';
        if (prev?.username) username = prev.username; // preserve the namespace
      } catch {
        /* ignore */
      }
    }
    const user: User = {
      username,
      kidName: profile.kidName.trim(),
      kidSchool: profile.kidSchool,
      kidGrade: profile.kidGrade,
      createdAt,
      tier,
    };
    setCurrentUser(user);
    localStorage.setItem(SESSION_KEY, JSON.stringify(user));
    // Keep the standalone settings keys in sync so the greeting / avatar match.
    localStorage.setItem('child_name', user.kidName);
  }

  function setTier(tier: Tier): void {
    persistTier(tier);
    setCurrentUser((prev) => (prev ? { ...prev, tier } : prev));
  }

  function logout(): void {
    setCurrentUser(null);
    localStorage.removeItem(SESSION_KEY);
  }

  return (
    <AuthContext.Provider value={{ currentUser, setupProfile, logout, setTier, getUserId }}>
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
