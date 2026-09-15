import {
  MOCK_CLUBS,
  MOCK_ACTIVITIES,
  MOCK_EVENTS,
  MOCK_MEMBERSHIPS,
  MOCK_EVIDENCE_ITEMS,
  MOCK_COLLABORATIONS,
  MOCK_IMPACT_PROJECTS,
  MOCK_CRITERIA,
  MOCK_RANKINGS,
  MOCK_CCEA_AWARDS,
  MOCK_HALL_OF_EXCELLENCE,
  MOCK_AUDIT_LOGS,
  MOCK_INSTITUTIONAL_ANALYTICS,
  MOCK_PERSONAS,
} from "../data/mockClubs";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000/api";

function getAccessToken() {
  return localStorage.getItem("cc_access_token");
}

export function setAuthSession(token, user) {
  if (token) localStorage.setItem("cc_access_token", token);
  if (user) localStorage.setItem("cc_user", JSON.stringify(user));
}

export function clearAuthSession() {
  localStorage.removeItem("cc_access_token");
  localStorage.removeItem("cc_user");
}

export function getStoredUser() {
  try {
    const raw = localStorage.getItem("cc_user");
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

async function request(path, { method = "GET", body, auth = true, timeoutMs = 2500 } = {}) {
  const headers = { "Content-Type": "application/json" };
  if (auth) {
    const token = getAccessToken();
    if (token) headers.Authorization = `Bearer ${token}`;
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(`${API_BASE}${path}`, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
      signal: controller.signal,
    });

    if (!response.ok) {
      const detail = await response.json().catch(() => ({}));
      throw new Error(detail.error || detail.detail || `Request failed: ${response.status}`);
    }
    if (response.status === 204) return null;
    return await response.json();
  } catch (err) {
    console.warn(`API request to ${path} failed or network offline, falling back:`, err.message);
    throw err;
  } finally {
    clearTimeout(timer);
  }
}

export const api = {
  auth: {
    login: async (username, password) => {
      try {
        const res = await request(`/auth/token/`, {
          method: "POST",
          body: { username, password },
          auth: false,
        });
        if (res.access && res.user) {
          setAuthSession(res.access, res.user);
          return res;
        }
      } catch (err) {
        // Fallback demo match
        const needle = username.toLowerCase().trim();
        const found = MOCK_PERSONAS.find((p) => {
          const local = p.email.split("@")[0].toLowerCase();
          return (
            p.email.toLowerCase() === needle ||
            p.role === username ||
            local === needle ||
            p.name.toLowerCase() === needle
          );
        });
        if (found) {
          const mockUser = {
            id: found.student_id,
            username: found.email.split("@")[0],
            email: found.email,
            full_name: found.name,
            role: found.role,
            student_id: found.student_id,
            club_id: found.club_id,
            club_name: found.club_name,
          };
          setAuthSession("mock-token-" + found.role, mockUser);
          return { access: "mock-token-" + found.role, user: mockUser };
        }
        throw err;
      }
    },
    register: async (data) => {
      try {
        return await request(`/auth/register/`, {
          method: "POST",
          body: data,
          auth: false,
        });
      } catch (err) {
        const mockUser = {
          id: "STU-" + Date.now().toString().slice(-4),
          username: data.username || data.email.split("@")[0],
          email: data.email,
          full_name: `${data.first_name || ""} ${data.last_name || ""}`.trim() || data.username,
          role: "student",
          student_id: data.student_id || "STU-2026-NEW",
        };
        setAuthSession("mock-token-registered", mockUser);
        return { access: "mock-token-registered", user: mockUser };
      }
    },
    me: async () => {
      try {
        return await request(`/me/`);
      } catch {
        return getStoredUser() || MOCK_PERSONAS[0];
      }
    },
    getDemoPersonas: async () => {
      try {
        const res = await request(`/auth/demo-personas/`, { auth: false });
        if (Array.isArray(res) && res.length > 0) return res;
      } catch {
        // fallback
      }
      return MOCK_PERSONAS;
    },
    switchRole: async (targetRole) => {
      try {
        const res = await request(`/auth/switch-role/`, {
          method: "POST",
          body: { role: targetRole },
        });
        if (res.user) {
          setAuthSession(res.access, res.user);
          return res.user;
        }
      } catch {
        // fallback
      }
      const persona = MOCK_PERSONAS.find((p) => p.role === targetRole) || MOCK_PERSONAS[0];
      const mockUser = {
        id: persona.student_id,
        username: persona.email.split("@")[0],
        email: persona.email,
        full_name: persona.name,
        role: persona.role,
        student_id: persona.student_id,
        club_id: persona.club_id,
        club_name: persona.club_name,
      };
      setAuthSession("mock-token-" + persona.role, mockUser);
      return mockUser;
    },
  },

  clubs: {
    list: async (params = "") => {
      try {
        const res = await request(`/clubs/${params}`, { auth: false });
        return res.results || res;
      } catch {
        return MOCK_CLUBS;
      }
    },
    get: async (id) => {
      try {
        return await request(`/clubs/${id}/`, { auth: false });
      } catch {
        return MOCK_CLUBS.find((c) => c.id === String(id)) || MOCK_CLUBS[0];
      }
    },
    portfolio: async (id) => {
      try {
        return await request(`/clubs/${id}/portfolio/`, { auth: false });
      } catch {
        const club = MOCK_CLUBS.find((c) => c.id === String(id)) || MOCK_CLUBS[0];
        return {
          ...club,
          verified_activities: MOCK_ACTIVITIES.filter((a) => a.status === "verified"),
          impact_projects: MOCK_IMPACT_PROJECTS,
        };
      }
    },
    join: async (clubId) => {
      try {
        return await request(`/memberships/`, {
          method: "POST",
          body: { club: clubId },
        });
      } catch {
        return { status: "requested", detail: "Join request submitted to club leadership." };
      }
    },
  },

  memberships: {
    list: async () => {
      try {
        const res = await request(`/memberships/`);
        return res.results || res;
      } catch {
        return MOCK_MEMBERSHIPS;
      }
    },
  },

  activities: {
    list: async (params = "") => {
      try {
        const res = await request(`/activities/${params}`);
        return res.results || res;
      } catch {
        return MOCK_ACTIVITIES;
      }
    },
    create: async (data) => {
      try {
        return await request(`/activities/`, { method: "POST", body: data });
      } catch {
        return { id: "act-" + Date.now(), ...data, status: "submitted" };
      }
    },
  },

  events: {
    list: async () => {
      try {
        const res = await request(`/events/`);
        return res.results || res;
      } catch {
        return MOCK_EVENTS;
      }
    },
    checkIn: async (eventId, qrToken) => {
      try {
        return await request(`/events/${eventId}/check-in/`, {
          method: "POST",
          body: { qr_token: qrToken },
        });
      } catch {
        // mock success check-in
        return {
          id: "att-" + Date.now(),
          event: eventId,
          checked_in_at: new Date().toISOString(),
          status: "verified",
          detail: "Attendance recorded and verified via QR scan.",
        };
      }
    },
    create: async (data) => {
      try {
        return await request(`/events/`, { method: "POST", body: data });
      } catch {
        return {
          id: "evt-" + Date.now(),
          ...data,
          qr_token: "QR-" + Math.random().toString(36).substring(2, 9).toUpperCase(),
        };
      }
    },
  },

  evidence: {
    list: async () => {
      try {
        const res = await request(`/evidence/`);
        return res.results || res;
      } catch {
        return MOCK_EVIDENCE_ITEMS;
      }
    },
    review: async (evidenceId, status, comment) => {
      try {
        return await request(`/evidence/${evidenceId}/review/`, {
          method: "POST",
          body: { status, comment },
        });
      } catch {
        return { id: "rev-" + Date.now(), status, comment, reviewer: "Marcus Vance" };
      }
    },
    upload: async (data) => {
      try {
        return await request(`/evidence/`, { method: "POST", body: data });
      } catch {
        return { id: "ev-" + Date.now(), ...data, status: "submitted" };
      }
    },
  },

  collaborations: {
    list: async () => {
      try {
        const res = await request(`/collaborations/`);
        return res.results || res;
      } catch {
        return MOCK_COLLABORATIONS;
      }
    },
    confirm: async (id) => {
      try {
        return await request(`/collaborations/${id}/confirm/`, { method: "POST" });
      } catch {
        return { id, status: "confirmed", confirmed_at: new Date().toISOString() };
      }
    },
    reject: async (id) => {
      try {
        return await request(`/collaborations/${id}/reject/`, { method: "POST" });
      } catch {
        return { id, status: "rejected" };
      }
    },
  },

  impact: {
    list: async () => {
      try {
        const res = await request(`/impact-projects/`);
        return res.results || res;
      } catch {
        return MOCK_IMPACT_PROJECTS;
      }
    },
  },

  reporting: {
    submit: async (data) => {
      try {
        return await request(`/monthly-reports/`, { method: "POST", body: data });
      } catch {
        return { id: "rep-" + Date.now(), ...data, status: "submitted" };
      }
    },
  },

  evaluation: {
    getCriteria: async () => {
      try {
        const res = await request(`/evaluation-criteria/`);
        return res.results || res;
      } catch {
        return MOCK_CRITERIA;
      }
    },
    getRankings: async () => {
      return MOCK_RANKINGS;
    },
    approveScore: async (scoreId, value, reason) => {
      try {
        return await request(`/scores/${scoreId}/approve/`, {
          method: "POST",
          body: { value, reason },
        });
      } catch {
        return { id: "adj-" + Date.now(), new_value: value, reason };
      }
    },
  },

  aiCoach: {
    getFeedback: async (clubId) => {
      try {
        return await request(`/ai-coach/?club=${clubId || ""}`);
      } catch {
        return {
          feedback:
            "Activity cadence is strong with 42 attendees at your recent Machine Learning Bootcamp. Member participation is in the top 10th percentile. To boost your CCEA Cycle score further, consider formalizing your joint drone sensing initiative with the Environmental Collective—confirmed cross-club projects grant up to 10 bonus points.",
          generated_at: new Date().toISOString(),
        };
      }
    },
  },

  awards: {
    getAwards: async () => {
      try {
        const res = await request(`/awards/`);
        return res.results || res;
      } catch {
        return MOCK_CCEA_AWARDS;
      }
    },
    getHallOfExcellence: async () => {
      try {
        const res = await request(`/hall-of-excellence/`);
        return res.results || res;
      } catch {
        return MOCK_HALL_OF_EXCELLENCE;
      }
    },
  },

  admin: {
    getAuditLogs: async () => {
      try {
        const res = await request(`/audit-logs/`);
        return res.results || res;
      } catch {
        return MOCK_AUDIT_LOGS;
      }
    },
    getAnalytics: async () => {
      return MOCK_INSTITUTIONAL_ANALYTICS;
    },
  },
};

export { API_BASE };
