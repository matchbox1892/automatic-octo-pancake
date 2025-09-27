'use client';

// Lightweight auth/session stub to mirror legacy behavior.
import { create } from "zustand";

type AuthState = {
  isAuthenticated: boolean;
  authName?: string;
  expiresAt?: number | null;
  login: (name?: string) => void;
  logout: () => void;
  startTimeout: (minutes?: number, onTimeout?: () => void) => void;
  resetTimeout: () => void;
};

export const useAuthStore = create<AuthState>((set, get) => ({
  isAuthenticated: false,
  authName: undefined,
  expiresAt: null,
  login: (name = "User") => set({ isAuthenticated: true, authName: name }),
  logout: () => set({ isAuthenticated: false, authName: undefined, expiresAt: null }),
  startTimeout: (minutes = 50, onTimeout) => {
    const ms = Math.max(0, Math.floor(minutes * 60 * 1000));
    const expires = Date.now() + ms;
    set({ expiresAt: expires });
    // simple timer, not persisted across reloads
    setTimeout(() => {
      // directly perform logout when timer fires; avoid relying on Date.now() checks
      get().logout();
      if (onTimeout) onTimeout();
    }, ms + 1000);
  },
  resetTimeout: () => set({ expiresAt: null })
}));

// useAutoTimeout hook moved to hooks.ts
