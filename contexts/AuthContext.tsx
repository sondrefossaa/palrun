import React, { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Session, User } from "@supabase/supabase-js";
import {
  GoogleSignin,
  statusCodes,
} from "@react-native-google-signin/google-signin";
import { router } from "expo-router";

interface AuthContextType {
  isLoggedIn: boolean;
  isLoading: boolean;
  user: User | null;
  session: Session | null;
  signInWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    // Configure Google Sign-In
    GoogleSignin.configure({
      webClientId:
        "268276151273-rmbvs8baldua94l1hc4sffs9cqnciik8.apps.googleusercontent.com",
    });

    // Check active session on mount
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setIsLoggedIn(!!session);
      setIsLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setIsLoggedIn(!!session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const response = await GoogleSignin.signIn({
        loginHint: "",
      });

      console.log("Google response:", response);

      if (response.type === "success") {
        const { data, error } = await supabase.auth.signInWithIdToken({
          provider: "google",
          token: response.data.idToken,
        });

        if (error) {
          console.error("Supabase error:", error);
          throw error;
        }

        console.log("Supabase data:", data);

        // Manually update state immediately after successful login
        if (data.session && data.user) {
          setSession(data.session);
          setUser(data.user);
          setIsLoggedIn(true);
        }
        router.push("/(tabs)");
      }
    } catch (error: any) {
      if (error.code === statusCodes.IN_PROGRESS) {
        console.log("Sign in is in progress");
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        console.log("Play services not available");
      } else {
        console.error("Sign in error:", error);
        throw error;
      }
    }
  };

  const logout = async () => {
    try {
      await GoogleSignin.signOut();
      await supabase.auth.signOut();
      // Auth state will be updated automatically by onAuthStateChange
    } catch (error) {
      console.error("Logout error:", error);
      throw error;
    }
  };

  const value: AuthContextType = {
    isLoggedIn,
    isLoading,
    user,
    session,
    signInWithGoogle,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
}
