import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import {
  onAuthStateChanged,
  signInAnonymously,
  signInWithPopup,
  signOut
} from 'firebase/auth';
import {
  doc,
  getDoc,
  onSnapshot,
  serverTimestamp,
  setDoc
} from 'firebase/firestore';
import { auth, db, googleProvider } from '../utils/firebase.js';

const AuthContext = createContext(null);

const getDisplayName = (user) => {
  if (!user) return 'Guest';
  if (user.displayName) return user.displayName;
  if (user.isAnonymous) return `Guest-${user.uid.slice(0, 6)}`;
  return user.email || `Player-${user.uid.slice(0, 6)}`;
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [authReady, setAuthReady] = useState(false);
  const [profile, setProfile] = useState(null);
  const [profileReady, setProfileReady] = useState(false);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (nextUser) => {
      setUser(nextUser);
      setAuthReady(true);
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    let unsubscribe = null;
    let active = true;

    const setupProfile = async () => {
      if (!user) {
        setProfile(null);
        setProfileReady(false);
        return;
      }

      const profileRef = doc(db, 'users', user.uid);
      const baseProfile = {
        displayName: getDisplayName(user),
        rating: 1200,
        isAnonymous: user.isAnonymous,
        updatedAt: serverTimestamp()
      };

      const snap = await getDoc(profileRef);
      if (!snap.exists()) {
        await setDoc(profileRef, { ...baseProfile, createdAt: serverTimestamp() });
      } else {
        await setDoc(profileRef, baseProfile, { merge: true });
      }

      if (!active) return;
      unsubscribe = onSnapshot(profileRef, (docSnap) => {
        if (!docSnap.exists()) {
          setProfile(null);
          setProfileReady(true);
          return;
        }
        setProfile({ id: docSnap.id, ...docSnap.data() });
        setProfileReady(true);
      });
    };

    setupProfile();

    return () => {
      active = false;
      if (unsubscribe) unsubscribe();
    };
  }, [user]);

  const value = useMemo(() => {
    return {
      user,
      authReady,
      profile,
      profileReady,
      rating: profile?.rating ?? 1200,
      displayName: getDisplayName(user),
      signInWithGoogle: () => signInWithPopup(auth, googleProvider),
      signInAnonymously: () => signInAnonymously(auth),
      signOut: () => signOut(auth)
    };
  }, [user, authReady, profile, profileReady]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return ctx;
}
