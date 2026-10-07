export function dashboardPathForRole(role) {
  switch (role) {
    case "club_leader":
      return "/leader-dashboard";
    case "committee_head":
      return "/command-center";
    case "staff":
    case "dean_admin":
      return "/staff-dashboard";
    case "student_life":
      return "/student-life";
    case "system_admin":
      return "/admin-dashboard";
    default:
      return "/student-dashboard";
  }
}

export const ROUTE_ROLES = {
  "/student-dashboard": ["student"],
  "/leader-dashboard": ["club_leader"],
  "/committee-dashboard": ["committee_head"],
  "/command-center": ["committee_head"],
  "/ccea-reveal": ["committee_head"],
  "/membership-ledger": ["committee_head"],
  "/staff-dashboard": ["staff", "system_admin"],
  "/dean-dashboard": ["staff", "system_admin"],
  "/student-life": ["student_life"],
  "/admin-dashboard": ["system_admin"],
};

export function canAccessPath(role, path) {
  const allowed = ROUTE_ROLES[path];
  if (!allowed) return true;
  return allowed.includes(role);
}

export function personaToUser(persona) {
  return {
    id: persona.student_id,
    username: persona.email.split("@")[0],
    email: persona.email,
    full_name: persona.name,
    role: persona.role,
    student_id: persona.student_id,
    club_id: persona.club_id,
    club_name: persona.club_name,
    is_demo_account: true,
    institution: {
      id: "alche",
      name: "African Leadership College of Higher Education",
      short_name: "ALCHE",
      slug: "alche",
      kind: "university",
      awards_enabled: true,
      awards_program_name: "Campus Clubs Excellence Awards",
      logo_url: "/institutions/alche-logo.png",
      primary_color: "#D00D2D",
    },
  };
}
