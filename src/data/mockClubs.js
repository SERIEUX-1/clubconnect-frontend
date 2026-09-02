// Shape matches apps.clubs.serializers.ClubPublicSerializer exactly, so
// swapping this for `await api.clubs.list()` is a one-line change once the
// backend is running (see src/lib/api.js).
export const MOCK_CLUBS = [
  {
    id: "1",
    code: "014",
    name: "Robotics & AI Society",
    category: "Technology",
    status: "recognized",
    established_date: "2022-03-14",
    description:
      "Builds autonomous robots and runs weekly workshops on machine learning for beginners across every faculty.",
    logo_initial: "R",
  },
  {
    id: "2",
    code: "029",
    name: "Environmental Action Collective",
    category: "Sustainability",
    status: "recognized",
    established_date: "2019-09-02",
    description:
      "Runs campus composting, native tree-planting drives, and a termly sustainability audit published to the whole institution.",
    logo_initial: "E",
  },
  {
    id: "3",
    code: "007",
    name: "Debate & Rhetoric Union",
    category: "Academic",
    status: "recognized",
    established_date: "2015-01-20",
    description:
      "Competitive debate training, public speaking clinics, and the institution's delegation to the national inter-varsity circuit.",
    logo_initial: "D",
  },
  {
    id: "4",
    code: "041",
    name: "Filmmakers Guild",
    category: "Arts & Culture",
    status: "pending",
    established_date: "2026-06-01",
    description:
      "A newly forming collective for student filmmakers — short films, a termly screening night, and equipment-sharing.",
    logo_initial: "F",
  },
  {
    id: "5",
    code: "003",
    name: "Community Health Outreach",
    category: "Community Service",
    status: "recognized",
    established_date: "2017-05-11",
    description:
      "Free health-literacy workshops in surrounding communities, run in partnership with the Faculty of Medicine.",
    logo_initial: "H",
  },
  {
    id: "6",
    code: "022",
    name: "Chess & Strategy Circle",
    category: "Recreation",
    status: "recognized",
    established_date: "2020-11-30",
    description:
      "Weekly ladder tournaments, beginner coaching, and an annual campus-wide blitz championship.",
    logo_initial: "C",
  },
];

export const MOCK_PORTFOLIO = {
  ...MOCK_CLUBS[0],
  mission:
    "To make robotics and applied machine learning genuinely accessible to every student, regardless of prior coding experience.",
  verified_activities: [
    {
      title: "Beginner ML Bootcamp",
      objective:
        "Give first-year students a working machine-learning model in a single afternoon, removing the intimidation barrier around AI.",
      date_time: "2026-07-18T09:00:00Z",
      report_text:
        "42 students attended, up from 26 last term. 9 out of 10 post-session survey respondents said they'd attend a follow-up session.",
    },
    {
      title: "Autonomous Line-Follower Challenge",
      objective:
        "A friendly build-and-race competition to apply control-systems theory learned in the workshop series.",
      date_time: "2026-05-02T13:00:00Z",
      report_text:
        "14 teams competed. Partnered with the Engineering Faculty for judging and prize sponsorship.",
    },
  ],
  impact_projects: [
    {
      title: "STEM Outreach at Riverside Secondary",
      problem_statement:
        "Local secondary students had no hands-on exposure to robotics before choosing university subject streams.",
      objective: "Run a termly robotics taster day for Year 11 students.",
      beneficiaries_description: "120 secondary students across two visits.",
      outcomes:
        "Post-visit survey: 68% reported increased interest in a STEM degree pathway.",
      next_steps: "Formalize as an annual partnership with a dedicated budget line.",
    },
  ],
};

export const MOCK_HEALTH_SUMMARY = [
  { club: "Robotics & AI Society", status: "healthy", days_since_last_activity: 5, report_completion_rate: 1.0 },
  { club: "Environmental Action Collective", status: "healthy", days_since_last_activity: 12, report_completion_rate: 1.0 },
  { club: "Debate & Rhetoric Union", status: "needs_attention", days_since_last_activity: 34, report_completion_rate: 0.67 },
  { club: "Filmmakers Guild", status: "needs_attention", days_since_last_activity: 28, report_completion_rate: 0.5 },
  { club: "Community Health Outreach", status: "at_risk", days_since_last_activity: 71, report_completion_rate: 0.33 },
  { club: "Chess & Strategy Circle", status: "healthy", days_since_last_activity: 3, report_completion_rate: 1.0 },
];

export const MOCK_PENDING_REVIEWS = [
  { club: "Environmental Action Collective", item: "3 evidence items awaiting review", criterion: "Impact & Outcomes" },
  { club: "Robotics & AI Society", item: "Score recommendation ready for approval", criterion: "Activity & Consistency" },
  { club: "Debate & Rhetoric Union", item: "Monthly report submitted late", criterion: "Documentation & Accountability" },
];
