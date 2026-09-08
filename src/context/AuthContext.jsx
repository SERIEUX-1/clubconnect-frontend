import React, { createContext, useContext, useEffect, useState } from "react";
import { api, clearAuthSession, getStoredUser, setAuthSession } from "../lib/api";
import { MOCK_PERSONAS } from "../data/mockClubs";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalTab, setAuthModalTab] = useState("login");

  useEffect(() => {
    // Check localStorage or default to student for effortless discovery
    const stored = getStoredUser();
    if (stored) {
      setUser(stored);
    } else {
      // Default to Student persona so visitor can immediately explore authenticated features
      const defaultStudent = MOCK_PERSONAS[0];
      const initialUser = {
        id: defaultStudent.student_id,
        username: defaultStudent.email.split("@")[0],
        email: defaultStudent.email,
        full_name: defaultStudent.name,
        role: defaultStudent.role,
        student_id: defaultStudent.student_id,
      };
      setUser(initialUser);
      setAuthSession("initial-demo-token", initialUser);
    }
    setLoading(false);
  }, []);

  const login = async (username, password) => {
    try {
      const res = await api.auth.login(username, password);
      if (res && res.user) {
        setUser(res.user);
        setAuthModalOpen(false);
        return res.user;
      }
    } catch (err) {
      throw err;
    }
  };

  const register = async (data) => {
    try {
      const res = await api.auth.register(data);
      if (res && res.user) {
        setUser(res.user);
        setAuthModalOpen(false);
        return res.user;
      }
    } catch (err) {
      throw err;
    }
  };

  const logout = () => {
    clearAuthSession();
    setUser(null);
  };

  const switchPersona = async (role) => {
    try {
      const updatedUser = await api.auth.switchRole(role);
      setUser(updatedUser);
      setAuthModalOpen(false);
      return updatedUser;
    } catch (err) {
      const p = MOCK_PERSONAS.find((x) => x.role === role) || MOCK_PERSONAS[0];
      const fallbackUser = {
        id: p.student_id,
        username: p.email.split("@")[0],
        email: p.email,
        full_name: p.name,
        role: p.role,
        student_id: p.student_id,
        club_id: p.club_id,
      };
      setAuthSession("mock-token-" + p.role, fallbackUser);
      setUser(fallbackUser);
      setAuthModalOpen(false);
      return fallbackUser;
    }
  };

  const openAuthModal = (tab = "login") => {
    setAuthModalTab(tab);
    setAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setAuthModalOpen(false);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        loading,
        login,
        register,
        logout,
        switchPersona,
        authModalOpen,
        authModalTab,
        setAuthModalTab,
        openAuthModal,
        closeAuthModal,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
