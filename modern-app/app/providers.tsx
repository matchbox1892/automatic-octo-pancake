'use client';

import { PropsWithChildren } from 'react';
import { useAuthStore } from '../lib/auth';

export function Providers({ children }: PropsWithChildren) {
  return (
    <>
      {children}
    </>
  );
}