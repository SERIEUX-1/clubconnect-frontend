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


async function requestForm(path, formData, timeoutMs = 90000) {
  const headers = {};
  const token = getAccessToken();
  if (token && !String(token).startsWith("mock-token")) {
    headers.Authorization = `Bearer ${token}`;
  }
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(`${API_BASE}${path}`, {
      method: "POST",
      headers,
      body: formData,
      signal: controller.signal,
    });
    if (!response.ok) {
      const detail = await response.json().catch(() => ({}));
      const message =
        detail.error ||
        (typeof detail.detail === "string" ? detail.detail : null) ||
        `Request failed: ${response.status}`;
      throw new Error(typeof message === "string" ? message : `Request failed: ${response.status}`);
    }
    return await response.json();
  } finally {
    clearTimeout(timer);
  }
}

async function request(path, { method = "GET", body, auth = true, timeoutMs = 12000 } = {}) {
  const headers = { "Content-Type": "application/json" };
  if (auth) {
    const token = getAccessToken();
    if (token && !String(token).startsWith("mock-token")) {
      headers.Authorization = `Bearer ${token}`;
    }
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
      const message =
        detail.error ||
        (typeof detail.detail === "string" ? detail.detail : null) ||
        (Array.isArray(detail.detail) ? detail.detail[0] : null) ||
        detail.detail?.non_field_errors?.[0] ||
        `Request failed: ${response.status}`;
      throw new Error(typeof message === "string" ? message : `Request failed: ${response.status}`);
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
      const res = await request(`/auth/token/`, {
        method: "POST",
        body: { username, password },
        auth: false,
        timeoutMs: 15000,
      });
      if (!res?.access || !res?.user) {
        throw new Error("Sign-in did not return a session. Check email and password.");
      }
      setAuthSession(res.access, res.user);
      return res;
    },
    register: async (data) => {
      const res = await request(`/auth/register/`, {
        method: "POST",
        body: data,
        auth: false,
        timeoutMs: 15000,
      });
      if (res?.access && res?.user) setAuthSession(res.access, res.user);
      return res;
    },
    me: async () => {
      return await request(`/me/`);
    },
    setLanguage: async (preferred_language) => {
      return await request(`/me/`, {
        method: "PATCH",
        body: { preferred_language },
      });
    },
    ssoStatus: async () => {
      return await request(`/auth/sso-status/`, { auth: false });
    },
    ssoGoogle: async (payload) => {
      const res = await request(`/auth/sso/google/`, {
        method: "POST",
        body: payload,
        auth: false,
        timeoutMs: 20000,
      });
      if (res?.access && res?.user) setAuthSession(res.access, res.user);
      return res;
    },
    transcript: async () => {
      return await request(`/me/transcript/`);
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
      const personas = await api.auth.getDemoPersonas();
      const persona = personas.find((p) => p.role === targetRole);
      if (persona?.email && persona?.password) {
        const res = await request(`/auth/token/`, {
          method: "POST",
          body: { username: persona.email, password: persona.password },
          auth: false,
          timeoutMs: 15000,
        });
        if (res?.access && res?.user) {
          setAuthSession(res.access, res.user);
          return res.user;
        }
      }
      throw new Error("Could not switch to that demo account. Is the API running?");
    },
  },

    clubs: {
    list: async (params = "") => {
      try {
        const res = await request(`/clubs/${params || "?page_size=100"}`);
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
    publishWatch: async (clubId, data) => {
      const form = new FormData();
      form.append("caption", data.caption || "");
      form.append("evidence_type", data.evidence_type || "video");
      if (data.external_link) form.append("external_link", data.external_link);
      if (data.activity) form.append("activity", data.activity);
      if (data.file) form.append("file", data.file);
      return await requestForm(`/clubs/${clubId}/publish-watch/`, form);
    },
    portfolio: async (id) => {
      try {
        return await request(`/clubs/${id}/portfolio/`);
      } catch {
        const club = MOCK_CLUBS.find((c) => c.id === String(id)) || MOCK_CLUBS[0];
        return {
          ...club,
          verified_activities: MOCK_ACTIVITIES.filter((a) => a.status === "verified" && a.club_id === club.id),
          impact_projects: MOCK_IMPACT_PROJECTS.filter((p) => p.club_id === club.id),
          published_media: [],
        };
      }
    },
    join: async (clubId) => {
      return await request(`/club-memberships/`, {
        method: "POST",
        body: { club: clubId },
      });
    },
    requestCharter: async (data) => {
      try {
        return await request(`/clubs/request-charter/`, { method: "POST", body: data });
      } catch (err) {
        throw err;
      }
    },
    recognize: async (clubId) => {
      return await request(`/clubs/${clubId}/recognize/`, { method: "POST" });
    },
    rejectCharter: async (clubId) => {
      return await request(`/clubs/${clubId}/reject-charter/`, { method: "POST" });
    },
    pause: async (clubId, reason) => {
      return await request(`/clubs/${clubId}/pause/`, { method: "POST", body: { reason } });
    },
    restore: async (clubId, reason) => {
      return await request(`/clubs/${clubId}/restore/`, { method: "POST", body: { reason } });
    },
    listHandovers: async () => {
      const res = await request(`/leadership-handovers/`);
      return res.results || res;
    },
    currentCommittee: async (clubId) => {
      return await request(`/leadership-handovers/current-committee/?club=${clubId}`);
    },
    nominateHandover: async (payload) => {
      return await request(`/leadership-handovers/`, { method: "POST", body: payload });
    },
    acceptHandover: async (id) => {
      return await request(`/leadership-handovers/${id}/accept/`, { method: "POST" });
    },
    declineHandover: async (id) => {
      return await request(`/leadership-handovers/${id}/decline/`, { method: "POST" });
    },
    confirmHandover: async (id) => {
      return await request(`/leadership-handovers/${id}/confirm/`, { method: "POST" });
    },
    listManaged: async (params = "") => {
      const res = await request(`/clubs/${params}`);
      return res.results || res;
    },
  },

  memberships: {
    list: async () => {
      try {
        const res = await request(`/club-memberships/`);
        return res.results || res;
      } catch {
        return MOCK_MEMBERSHIPS;
      }
    },
    approve: async (id) => {
      return await request(`/club-memberships/${id}/approve/`, { method: "POST" });
    },
    reject: async (id) => {
      return await request(`/club-memberships/${id}/reject/`, { method: "POST" });
    },
    window: async () => {
      return await request(`/membership-census/window/`);
    },
    setWindow: async (payload) => {
      return await request(`/membership-census/window/`, { method: "PATCH", body: payload });
    },
    declare: async (clubIds) => {
      return await request(`/membership-census/declare/`, { method: "POST", body: { club_ids: clubIds } });
    },
    confirmMany: async (ids) => {
      return await request(`/membership-census/confirm/`, { method: "POST", body: { ids } });
    },
    ledger: async () => {
      return await request(`/membership-ledger/`);
    },
    myBudget: async () => {
      return await request(`/membership-ledger/mine/`);
    },
    submitConceptNote: async (payload) => {
      return await request(`/club-concept-notes/`, { method: "POST", body: payload });
    },
    approveConceptNote: async (id, committee_comment = "") => {
      return await request(`/club-concept-notes/${id}/approve/`, { method: "POST", body: { committee_comment } });
    },
    declineConceptNote: async (id, committee_comment = "") => {
      return await request(`/club-concept-notes/${id}/decline/`, { method: "POST", body: { committee_comment } });
    },
    recordSpend: async (payload) => {
      return await request(`/club-budget-spends/`, { method: "POST", body: payload });
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
        const rows = res.results || res;
        if (Array.isArray(rows) && rows.length) {
          return rows.map((c) => ({
            ...c,
            weight: Number(c.weight ?? c.weight_percent ?? 0),
          }));
        }
      } catch {
        return [];
      }
      return MOCK_CRITERIA;
    },
    getRankings: async () => {
      try {
        const res = await request(`/monthly-evaluations/`);
        const clubs = res.clubs || [];
        if (clubs.length) {
          return [...clubs]
            .sort((a, b) => (b.score ?? 0) - (a.score ?? 0))
            .map((c, i) => ({
              rank: i + 1,
              club: c.club_name,
              club_id: c.club_id,
              category: c.category || "General",
              score: c.score,
              band: c.band,
              health: c.band,
              trend:
                c.band === "healthy" ? "+" : c.band === "at_risk" ? "-" : "New",
              signals: c.signals,
              lackings: c.lackings,
              strengths: c.strengths,
            }));
        }
      } catch {
        return [];
      }
      return [];
    },
    monthly: async (params = "") => {
      const res = await request(`/monthly-evaluations/${params}`, { timeoutMs: 8000 });
      return res;
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

  copilot: {
    chat: async (message, context = {}) => {
      return await request(`/copilot/chat/`, {
        method: "POST",
        body: { message, role: context.role, context },
        auth: true,
        timeoutMs: 25000,
      });
    },
    brief: async (clubId) => {
      try {
        return await request(`/copilot/brief/?club=${clubId || ""}`, { timeoutMs: 8000 });
      } catch {
        return {
          feedback:
            "Copilot evaluates clubs from monthly reports, QR attendance, confirmed collaborations, and evidence. Pending partnerships do not count until the partner club confirms.",
          engine: "clubconnect-copilot-v1",
          generated_at: new Date().toISOString(),
        };
      }
    },
    healthScan: async (params = "") => {
      return await request(`/copilot/health-scan/${params}`, { timeoutMs: 8000 });
    },
    committeeBriefing: async (since) => {
      const q = since ? `?since=${encodeURIComponent(since)}` : "";
      return await request(`/copilot/committee-briefing/${q}`, { timeoutMs: 8000 });
    },
  },

  awards: {
    getAwards: async () => {
      try {
        const res = await request(`/awards/`);
        const rows = res.results || res;
        if (!Array.isArray(rows)) return MOCK_CCEA_AWARDS;
        return rows.map((a) => ({
          ...a,
          category: a.category || a.category_name || "Award",
          winner: a.winner || "",
          citation: a.citation || a.description || "",
          finalists: Array.isArray(a.finalists) ? a.finalists : a.winner ? [a.winner] : [],
        }));
      } catch {
        return [];
      }
    },
    reveal: async (id, year) => {
      return await request(`/awards/${id}/reveal/`, {
        method: "POST",
        body: year ? { year } : {},
      });
    },
    publishCeremony: async (year) => {
      return await request(`/awards/publish-ceremony/`, {
        method: "POST",
        body: { year: year || new Date().getFullYear() },
      });
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

  institutions: {
    list: async () => {
      try {
        return await request(`/institutions/`, { auth: false });
      } catch {
        return [
          {
            name: "African Leadership College of Higher Education",
            short_name: "ALCHE",
            slug: "alche",
            allowed_email_domains: ["alustudent.com", "alueducation.com"],
            student_email_domains: ["alustudent.com"],
            staff_email_domains: ["alueducation.com"],
            awards_program_name: "Campus Clubs Excellence Awards",
          },
        ];
      }
    },
  },

  studentLife: {
    desk: async () => request(`/student-life/desk/`),
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
      try {
        return await request(`/campus-analytics/`);
      } catch {
        return MOCK_INSTITUTIONAL_ANALYTICS;
      }
    },
    getCampusBrief: async () => {
      return await request(`/campus-brief/`);
    },
    getOnboarding: async () => {
      return await request(`/campus-onboarding/`);
    },
    broadcastNotice: async (payload) => {
      return await request(`/notices/broadcast/`, {
        method: "POST",
        body: payload,
      });
    },
    listCampusUsers: async () => {
      const res = await request(`/campus-users/`);
      return Array.isArray(res) ? res : res.results || [];
    },
    updateCampusUser: async (id, payload) => {
      return await request(`/campus-users/${id}/`, { method: "PATCH", body: payload });
    },
    createCampusUser: async (payload) => {
      return await request(`/campus-users/`, { method: "POST", body: payload });
    },
    getCampusInstitution: async () => {
      return await request(`/campus-institution/`);
    },
    updateCampusInstitution: async (payload) => {
      return await request(`/campus-institution/`, { method: "PATCH", body: payload });
    },
    listLicenceInquiries: async () => {
      try {
        const res = await request(`/admin/licence-inquiries/`);
        return Array.isArray(res) ? res : res.results || [];
      } catch {
        return [];
      }
    },
    updateLicenceInquiry: async (id, payload) => {
      return await request(`/admin/licence-inquiries/${id}/`, {
        method: "PATCH",
        body: payload,
      });
    },
    listCampusHandovers: async () => {
      const res = await request(`/campus-committee-handovers/`);
      return Array.isArray(res) ? res : res.results || [];
    },
    currentCampusCommittee: async () => {
      return await request(`/campus-committee-handovers/current/`);
    },
    submitCampusHandover: async (payload) => {
      return await request(`/campus-committee-handovers/`, { method: "POST", body: payload });
    },
    confirmCampusHandover: async (id) => {
      return await request(`/campus-committee-handovers/${id}/confirm/`, { method: "POST" });
    },
    declineCampusHandover: async (id) => {
      return await request(`/campus-committee-handovers/${id}/decline/`, { method: "POST" });
    },
  },

  licence: {
    request: async (payload) => {
      return await request(`/licence-inquiries/`, {
        method: "POST",
        body: payload,
        auth: false,
      });
    },
  },

  help: {
    createTicket: async (payload) => {
      return await request(`/help/tickets/`, {
        method: "POST",
        body: payload,
        auth: true,
      });
    },
    myTickets: async () => {
      return await request(`/help/tickets/`);
    },
    staffTickets: async () => {
      const res = await request(`/admin/help-tickets/`);
      return Array.isArray(res) ? res : res.results || [];
    },
  },
};

export { API_BASE };
