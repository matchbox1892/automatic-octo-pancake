'use client';

import { useState } from 'react';

export function useAuth() {
  const [authenticated, setAuthenticated] = useState(false);

  const login = async () => {
    // Placeholder for future SSO or passwordless integration.
    setAuthenticated(true);
  };

  const logout = async () => {
    setAuthenticated(false);
  };

  return {
    authenticated,
    login,
    logout,
    user: authenticated ? { name: 'Demo User' } : null
  };
}
