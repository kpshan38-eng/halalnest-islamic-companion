import { useState, useEffect } from 'react';

interface User {
  uid: string;
  displayName: string | null;
  email: string | null;
  photoURL: string | null;
}

interface FirebaseAuth {
  currentUser: User | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
}

declare global {
  interface Window {
    firebaseAuth: any;
    GoogleAuthProvider: any;
    signInWithPopup: any;
    signOut: any;
    onAuthStateChanged: any;
  }
}

export const useFirebaseAuth = (): FirebaseAuth => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!window.firebaseAuth || !window.onAuthStateChanged) {
      setLoading(false);
      return;
    }

    const unsubscribe = window.onAuthStateChanged(window.firebaseAuth, (user: any) => {
      if (user) {
        setCurrentUser({
          uid: user.uid,
          displayName: user.displayName,
          email: user.email,
          photoURL: user.photoURL,
        });
      } else {
        setCurrentUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signInWithGoogle = async (): Promise<void> => {
    if (!window.firebaseAuth || !window.GoogleAuthProvider || !window.signInWithPopup) {
      throw new Error('Firebase Auth not initialized');
    }

    try {
      const provider = new window.GoogleAuthProvider();
      await window.signInWithPopup(window.firebaseAuth, provider);
    } catch (error: any) {
      console.error('Sign-in failed:', error);
      throw new Error(`Sign-in failed: ${error.code || error.message}`);
    }
  };

  const signOut = async (): Promise<void> => {
    if (!window.firebaseAuth || !window.signOut) {
      throw new Error('Firebase Auth not initialized');
    }

    try {
      await window.signOut(window.firebaseAuth);
    } catch (error: any) {
      console.error('Sign-out failed:', error);
      throw new Error(`Sign-out failed: ${error.message}`);
    }
  };

  return {
    currentUser,
    loading,
    signInWithGoogle,
    signOut,
  };
};