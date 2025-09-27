"use client";

import React from "react";
import { useAuthStore } from "@/lib/auth";

export default function Header() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const login = useAuthStore((s) => s.login);
  const logout = useAuthStore((s) => s.logout);

  return (
    <header className="w-full bg-white shadow-sm fixed top-0 left-0 z-20">
      <div className="max-w-4xl mx-auto px-4 py-2 flex items-center justify-between">
        <div className="text-lg font-semibold">MatchCloud Narrative Studio</div>
        <div>
          {isAuthenticated ? (
            <button onClick={() => logout()} className="text-sm text-slate-700">
              Logout
            </button>
          ) : (
            <button onClick={() => login("dev-user")} className="text-sm text-slate-700">
              Login
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
