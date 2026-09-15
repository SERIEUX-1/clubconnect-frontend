export function dashboardPathForRole(role) {
  switch (role) {
    case "club_leader":
      return "/leader-dashboard";
    case "committee_member":
      return "/committee-dashboard";
    case "committee_head":
      return "/command-center";
    case "dean_admin":
      return "/dean-dashboard";
    case "system_admin":
      return "/admin-dashboard";
    default:
      return "/student-dashboard";
  }
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
  };
}
