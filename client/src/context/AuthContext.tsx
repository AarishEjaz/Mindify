"use client";

import { createContext, useContext, useEffect, useState } from "react";
import api, { getErrorMessage } from "@/lib/api";
import { User } from "@/lib/types";

// Key used to store the user object in localStorage (so a page refresh
// keeps the user logged in). NOTE: this is only the non-sensitive public
// user profile — the auth token lives in an httpOnly cookie, never here.
const USER_KEY = "psychometric_user";

// The shape of everything the context provides to the rest of the app.
interface AuthContextValue {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<User>;
  loginAdmin: (email: string, password: string) => Promise<User>;
  register: (name: string, email: string, password: string) => Promise<User>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  // "loading" is true until we have checked localStorage on first load.
  const [loading, setLoading] = useState(true);

  // On first load, restore the user from localStorage if present.
  useEffect(() => {
    const savedUser = localStorage.getItem(USER_KEY);
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  // Save the user after a successful login or register. The token itself is
  // set by the server as an httpOnly cookie, so there's nothing token-related
  // to store here.
  const saveSession = (loggedInUser: User) => {
    localStorage.setItem(USER_KEY, JSON.stringify(loggedInUser));
    setUser(loggedInUser);
  };

  const login = async (email: string, password: string) => {
    try {
      const response = await api.post("/auth/login", { email, password });
      const { user: loggedInUser } = response.data.data;
      saveSession(loggedInUser);
      return loggedInUser as User;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  };

  // Separate admin login — hits the admin-only backend route.
  const loginAdmin = async (email: string, password: string) => {
    try {
      const response = await api.post("/auth/admin/login", { email, password });
      const { user: loggedInUser } = response.data.data;
      saveSession(loggedInUser);
      return loggedInUser as User;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  };

  const register = async (name: string, email: string, password: string) => {
    try {
      const response = await api.post("/auth/register", { name, email, password });
      const { user: newUser } = response.data.data;
      saveSession(newUser);
      return newUser as User;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  };

  const logout = async () => {
    // Ask the server to expire the httpOnly cookie — the client can't delete
    // it directly. Clear local state regardless of the request's outcome.
    try {
      await api.post("/auth/logout");
    } catch {
      // Ignore network/errors here; we still log the user out locally.
    }
    localStorage.removeItem(USER_KEY);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ user, loading, login, loginAdmin, register, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// Small hook so pages can call useAuth() instead of useContext(...).
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used inside an AuthProvider");
  }
  return context;
}
