"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

type User = {
  email: string;
  username: string;
  referralCode?: string | null;
  purchasedProducts?: string[];
};

type UserContextType = {
  user: User | null;
  loading: boolean;
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

  useEffect(() => {
    async function checkSession() {
      try {
        const res = await fetch("/api/auth/me");
        const data = await res.json();
        setUser(data.user);
      } catch (err) {
        console.error("Session check failed", err);
      } finally {
        setLoading(false);
      }
    }
    checkSession();
  }, []);

  const login = async (email: string, username: string) => {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, username }),
    });
    const data = await res.json();
    if (res.ok) {
      setUser(data.user);
      setShowAuthModal(false);
    } else {
      throw new Error(data.error || "Login failed");
    }
  };

  const logout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    setUser(null);
  };

  return (
    <UserContext.Provider value={{ user, loading, login, logout, showAuthModal, setShowAuthModal }}>
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
