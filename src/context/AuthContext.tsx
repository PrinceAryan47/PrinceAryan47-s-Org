/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { auth, db } from '../firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, getDoc, getDocFromServer } from 'firebase/firestore';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { handleFirestoreError, OperationType } from '../lib/firestoreUtils';

export type UserRole = 'buyer' | 'wholesaler';

interface UserProfile {
  uid: string;
  email: string | null;
  displayName: string | null;
  role: UserRole;
  businessName?: string;
  phoneNumber?: string;
  whatsappNumber?: string;
  shopNo?: string;
  block?: string;
  photoURL?: string;
}

interface AuthContextType {
  user: UserProfile | null;
  loading: boolean;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({ user: null, loading: true, logout: async () => {} });

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function testConnection() {
      try {
        await getDocFromServer(doc(db, 'test', 'connection'));
        console.log("Firestore connection successful.");
      } catch (error) {
        if(error instanceof Error && error.message.includes('the client is offline')) {
          console.warn("Firestore is operating in offline mode. This might be due to network restrictions or configuration.");
        } else {
          console.error("Firestore connection error:", error);
        }
      }
    }
    testConnection();

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
          if (userDoc.exists()) {
            setUser({
              uid: firebaseUser.uid,
              email: firebaseUser.email,
              displayName: firebaseUser.displayName,
              ...(userDoc.data() as any),
            });
          } else {
            // New user or profile not found
            setUser({
              uid: firebaseUser.uid,
              email: firebaseUser.email,
              displayName: firebaseUser.displayName,
              role: 'buyer', // Default role
            });
          }
        } catch (error) {
          // If offline, we might still want to set the user state based on auth only if we can't reach Firestore
          const isOffline = error instanceof Error && error.message.includes('offline');
          
          if (isOffline) {
             console.warn("Using offline auth state for:", firebaseUser.uid);
             setUser({
               uid: firebaseUser.uid,
               email: firebaseUser.email,
               displayName: firebaseUser.displayName,
               role: 'buyer', 
             });
          } else {
             handleFirestoreError(error, OperationType.GET, `users/${firebaseUser.uid}`);
          }
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
