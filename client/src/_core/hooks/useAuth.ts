import { trpc } from "@/lib/trpc";
import { useCallback, useMemo } from "react";

type UseAuthOptions = {
  redirectOnUnauthenticated?: boolean;
  redirectPath?: string;
};

export function useAuth(options?: UseAuthOptions) {
  // Public website - no authentication required
  const utils = trpc.useUtils();

  // Mock auth functions for compatibility
  const signIn = useCallback(async (email: string, password: string) => {
    console.log('Auth disabled - website is public');
    return { user: null, error: null };
  }, []);

  const signUp = useCallback(async (email: string, password: string) => {
    console.log('Auth disabled - website is public');
    return { user: null, error: null };
  }, []);

  const logout = useCallback(async () => {
    console.log('Auth disabled - website is public');
  }, []);

  const resetPassword = useCallback(async (email: string) => {
    console.log('Auth disabled - website is public');
    return { error: null };
  }, []);

  const state = useMemo(() => {
    return {
      user: null, // Always null - public access
      loading: false,
      error: null,
      isAuthenticated: false, // Always false - no auth required
      supabaseUser: null,
      session: null,
    };
  }, []);

  return {
    ...state,
    refresh: () => Promise.resolve(),
    logout,
    signIn,
    signUp,
    resetPassword,
  };
}
