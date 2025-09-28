import { useState, useEffect } from 'react';
import { toast } from '@/hooks/use-toast';
import { playDoorbell } from '@/utils/audioUtils';

// Firebase auth interface
interface FirebaseUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
}

declare global {
  interface Window {
    firebase?: {
      auth: () => {
        currentUser: FirebaseUser | null;
        signInWithPopup: (provider: any) => Promise<{ user: FirebaseUser }>;
        signOut: () => Promise<void>;
        onAuthStateChanged: (callback: (user: FirebaseUser | null) => void) => () => void;
        GoogleAuthProvider: new () => any;
      };
    };
  }
}

export const useFirebaseAuth = () => {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [firebaseReady, setFirebaseReady] = useState(false);

  useEffect(() => {
    // Check if Firebase is loaded
    const checkFirebase = () => {
      if (window.firebase) {
        setFirebaseReady(true);
        
        // Set up auth state listener
        const unsubscribe = window.firebase.auth().onAuthStateChanged((user) => {
          setUser(user);
          setLoading(false);
          
          // Play doorbell on sign in
          if (user) {
            setTimeout(() => playDoorbell(), 100);
            toast({
              title: "Welcome!",
              description: `Signed in as ${user.displayName || user.email}`,
            });
          }
        });
        
        return unsubscribe;
      } else {
        // Firebase not ready yet, check again
        setTimeout(checkFirebase, 100);
      }
    };
    
    const unsubscribe = checkFirebase();
    return () => {
      if (typeof unsubscribe === 'function') {
        unsubscribe();
      }
    };
  }, []);

  const signInWithGoogle = async () => {
    if (!firebaseReady || !window.firebase) {
      toast({
        title: "Error",
        description: "Firebase is not ready yet. Please try again.",
        variant: "destructive",
      });
      return;
    }

    try {
      const auth = window.firebase.auth();
      const provider = new auth.GoogleAuthProvider();
      await auth.signInWithPopup(provider);
    } catch (error: any) {
      console.error('Google sign-in error:', error);
      toast({
        title: "Sign-in failed",
        description: error.message || "Failed to sign in with Google",
        variant: "destructive",
      });
    }
  };

  const signOut = async () => {
    if (!firebaseReady || !window.firebase) return;
    
    try {
      await window.firebase.auth().signOut();
      toast({
        title: "Signed out",
        description: "You have been signed out successfully",
      });
    } catch (error: any) {
      console.error('Sign out error:', error);
      toast({
        title: "Error",
        description: "Failed to sign out",
        variant: "destructive",
      });
    }
  };

  return {
    user,
    loading,
    firebaseReady,
    signInWithGoogle,
    signOut
  };
};