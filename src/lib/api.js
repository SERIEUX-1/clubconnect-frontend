const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api";

function getAccessToken() {
  return localStorage.getItem("cc_access_token");
}

/**
 * Thin fetch wrapper. Deliberately not a heavyweight client library —
 * the backend's DRF routers are predictable REST, so this stays simple
 * and every call site can see exactly what request is being made.
 */
async function request(path, { method = "GET", body, auth = true } = {}) {
  const headers = { "Content-Type": "application/json" };
  if (auth) {
    const token = getAccessToken();
    if (token) headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!response.ok) {
    const detail = await response.json().catch(() => ({}));
    throw new Error(detail.error || detail.detail || `Request failed: ${response.status}`);
  }
  if (response.status === 204) return null;
  return response.json();
}

export const api = {
  clubs: {
    list: (params = "") => request(`/clubs/${params}`),
    portfolio: (id) => request(`/clubs/${id}/portfolio/`),
  },
  clubHealth: {
    list: (clubId) => request(`/club-health/?club=${clubId}`),
  },
  scores: {
    list: (params = "") => request(`/scores/${params}`),
    monthBreakdown: (id) => request(`/scores/${id}/month_breakdown/`),
    approve: (id, value, reason) =>
      request(`/scores/${id}/approve/`, { method: "POST", body: { value, reason } }),
  },
  activities: {
    list: (params = "") => request(`/activities/${params}`),
  },
  auth: {
    login: (username, password) =>
      request(`/auth/token/`, { method: "POST", body: { username, password }, auth: false }),
    me: () => request(`/me/`),
  },
};

export { API_BASE };
