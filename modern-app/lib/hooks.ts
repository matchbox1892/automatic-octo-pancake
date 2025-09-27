'use client';

import { useEffect } from 'react';
import { useAuthStore } from './auth';

/**
 * Hook to automatically timeout user session based on activity
 */
export function useAutoTimeout(minutes = 50, onTimeout?: () => void) {
  useEffect(() => {
    useAuthStore.getState().startTimeout(minutes, onTimeout);
    const onActivity = () => useAuthStore.getState().startTimeout(minutes, onTimeout);
    window.addEventListener("click", onActivity);
    window.addEventListener("keydown", onActivity);
    return () => {
      window.removeEventListener("click", onActivity);
      window.removeEventListener("keydown", onActivity);
    };
  }, [minutes, onTimeout]);
}