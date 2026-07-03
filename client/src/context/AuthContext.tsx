"use client";

import { createContext, useContext, useEffect, useState } from "react";
import api, { TOKEN_KEY, getErrorMessage } from "@/lib/api";
import { User } from "@/lib/types";

// Key used to store the user object in localStorage (so a page refresh
// keeps the user logged in).
const USER_KEY = "psychometric_user";

// The shape of everything the context provides to the rest of the app.
interface AuthContextValue {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<User>;
  loginAdmin: (email: string, password: string) => Promise<User>;
  register: (name: string, email: string, password: string) => Promise<User>;
  logout: () => void;
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

  // Save the token + user after a successful login or register.
  const saveSession = (token: string, loggedInUser: User) => {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_KEY, JSON.stringify(loggedInUser));
    setUser(loggedInUser);
  };

  const login = async (email: string, password: string) => {
    try {
      const response = await api.post("/auth/login", { email, password });
      const { token, user: loggedInUser } = response.data.data;
      saveSession(token, loggedInUser);
      return loggedInUser as User;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  };

  // Separate admin login — hits the admin-only backend route.
  const loginAdmin = async (email: string, password: string) => {
    try {
      const response = await api.post("/auth/admin/login", { email, password });
      const { token, user: loggedInUser } = response.data.data;
      saveSession(token, loggedInUser);
      return loggedInUser as User;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  };

  const register = async (name: string, email: string, password: string) => {
    try {
      const response = await api.post("/auth/register", { name, email, password });
      const { token, user: newUser } = response.data.data;
      saveSession(token, newUser);
      return newUser as User;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  };

  const logout = () => {
    localStorage.removeItem(TOKEN_KEY);
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
