"use client";

import React, { createContext, useCallback, useContext, useEffect, useState } from "react";

type User = {
  email: string;
  username: string;
  referralCode?: string | null;
  purchasedProducts?: string[];
};

type UserContextType = {
  user: User | null;
  loading: boolean;
  refreshUser: () => Promise<User | null>;
  login: (email: string, username: string) => Promise<void>;
  logout: () => Promise<void>;
  showAuthModal: boolean;
  setShowAuthModal: (show: boolean) => void;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [showAuthModal, setShowAuthModal] = useState(false);

  const refreshUser = useCallback(async () => {
    const response = await fetch("/api/auth/me", { cache: "no-store" });
    const data: { user?: User | null; error?: string } = await response.json();
    if (!response.ok || !("user" in data)) {
      throw new Error(data.error || "Could not load your account.");
    }
    setUser(data.user ?? null);
    return data.user ?? null;
  }, []);

  useEffect(() => {
    let isMounted = true;

    async function checkSession() {
      try {
        await refreshUser();
      } catch (err) {
        console.error("Session check failed", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    function syncSession() {
      void refreshUser().catch((err: unknown) => {
        console.error("Session refresh failed", err);
      });
    }

    void checkSession();
    window.addEventListener("focus", syncSession);
    return () => {
      isMounted = false;
      window.removeEventListener("focus", syncSession);
    };
  }, [refreshUser]);

  const login = async (email: string, username: string) => {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, username }),
      cache: "no-store",
    });
    const data: { user?: User; error?: string } = await res.json();
    if (res.ok && data.user) {
      setUser(data.user);
      setShowAuthModal(false);
    } else {
      throw new Error(data.error || "Login failed");
    }
  };

  const logout = async () => {
    const response = await fetch("/api/auth/logout", { method: "POST", cache: "no-store" });
    if (!response.ok) throw new Error("Logout failed. Please try again.");
    setUser(null);
  };

  return (
    <UserContext.Provider value={{ user, loading, refreshUser, login, logout, showAuthModal, setShowAuthModal }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
}
