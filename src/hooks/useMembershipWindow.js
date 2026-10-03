import { useCallback, useEffect, useState } from "react";
import { api } from "../lib/api";
import { useAuth } from "../context/AuthContext";

/** Live campus membership window — not the cached login profile. */
export function useMembershipWindow() {
  const { user } = useAuth();
  const [pack, setPack] = useState(null);
  const [loading, setLoading] = useState(true);

  const reload = useCallback(() => {
    if (!user) {
      setPack(null);
      setLoading(false);
      return Promise.resolve(null);
    }
    return api.memberships
      .window()
      .then((row) => {
        setPack(row);
        return row;
      })
      .catch(() => {
        setPack({ open: false });
        return { open: false };
      })
      .finally(() => setLoading(false));
  }, [user?.id, user?.email, user?.role]);

  useEffect(() => {
    setLoading(true);
    reload();
    const onFocus = () => reload();
    const onVis = () => {
      if (document.visibilityState === "visible") reload();
    };
    window.addEventListener("focus", onFocus);
    document.addEventListener("visibilitychange", onVis);
    return () => {
      window.removeEventListener("focus", onFocus);
      document.removeEventListener("visibilitychange", onVis);
    };
  }, [reload]);

  return {
    open: !!pack?.open,
    pack,
    loading,
    reload,
  };
}
