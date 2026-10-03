import React, { createContext, useCallback, useContext, useEffect, useState } from "react";
import { api, clearAuthSession, getStoredUser, setAuthSession } from "../lib/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalTab, setAuthModalTab] = useState("login");
  const [licenceModalOpen, setLicenceModalOpen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("cc_access_token");
    if (token && String(token).startsWith("mock-token")) {
      clearAuthSession();
      setLoading(false);
      return;
    }
    const stored = getStoredUser();
    if (stored) setUser(stored);
    setLoading(false);
    if (token && !String(token).startsWith("mock-token")) {
      api.auth.me().then((fresh) => {
        if (fresh?.id) {
          setUser(fresh);
          setAuthSession(token, fresh);
        }
      }).catch(() => {});
    }
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
    const updatedUser = await api.auth.switchRole(role);
    setUser(updatedUser);
    setAuthModalOpen(false);
    return updatedUser;
  };

  const acceptSession = (res) => {
    if (res?.access && res?.user) {
      setAuthSession(res.access, res.user);
      setUser(res.user);
      setAuthModalOpen(false);
      return res.user;
    }
    return null;
  };

  const openAuthModal = useCallback((tab = "login") => {
    setAuthModalTab(tab);
    setAuthModalOpen(true);
  }, []);

  const closeAuthModal = () => {
    setAuthModalOpen(false);
  };

  const openLicenceModal = useCallback(() => {
    setLicenceModalOpen(true);
  }, []);

  const closeLicenceModal = () => {
    setLicenceModalOpen(false);
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
        acceptSession,
        authModalOpen,
        authModalTab,
        setAuthModalTab,
        openAuthModal,
        closeAuthModal,
        licenceModalOpen,
        openLicenceModal,
        closeLicenceModal,
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
