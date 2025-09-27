'use client';

import { ReactNode } from 'react';
import { useAutoTimeout } from '@/lib/hooks';

export function AutoTimeoutWrapper({ children }: { children: ReactNode }) {
  useAutoTimeout(50, () => {
    // noop for now; logout handled in store timer
    console.log("session timed out");
  });

  return children;
}