/**
 * ALTRA COMMAND — seeded operational dataset.
 *
 * Mirrors `supabase/schema.sql`. Used by the local repository (lib/ops/store.ts)
 * when no Supabase connection is configured, and as the fixture set for demos.
 * All figures are illustrative.
 */
import type {
  AuditEntry,
  DailySiteLog,
  DocumentItem,
  InventoryItem,
  Invoice,
  MonthlyFinancial,
  Phase,
  Profile,
  Project,
  Requisition,
  Rfi,
  SafetyChecklistItem,
  SafetyIncident,
  SiteAlert,
  Task,
} from "@/types/construction";

/* ------------------------------------------------------------------ */
/* People                                                              */
/* ------------------------------------------------------------------ */
const ALL_PROJECTS = ["p-msasani", "p-mtoni", "p-kariakoo", "p-dodoma", "p-mwanza", "p-kigamboni", "p-ubungo", "p-zanzibar", "p-arusha"];

export const profiles: Profile[] = [
  {
    id: "u-exec",
    fullName: "Neema Mwakalinga",
    email: "neema.mwakalinga@altrabuild.co.tz",
    role: "executive",
    phone: "+255 754 118 220",
    avatarUrl: null,
    title: "Chief Executive Officer",
    projectIds: ALL_PROJECTS,
    createdAt: "2019-02-11T08:00:00Z",
  },
  {
    id: "u-ops",
    fullName: "Joseph Mwansasu",
    email: "joseph.mwansasu@altrabuild.co.tz",
    role: "executive",
    phone: "+255 754 441 902",
    avatarUrl: null,
    title: "Director of Safety & Operations",
    projectIds: ALL_PROJECTS,
    createdAt: "2018-06-04T08:00:00Z",
  },
  {
    id: "u-pm1",
    fullName: "Baraka Mwakyusa",
    email: "baraka.mwakyusa@altrabuild.co.tz",
    role: "pm",
    phone: "+255 715 330 184",
    avatarUrl: null,
    title: "Project Director — Structures",
    projectIds: ["p-msasani", "p-kariakoo", "p-dodoma", "p-ubungo"],
    createdAt: "2020-01-20T08:00:00Z",
  },
  {
    id: "u-pm2",
    fullName: "Amani Kileo",
    email: "amani.kileo@altrabuild.co.tz",
    role: "pm",
    phone: "+255 767 209 511",
    avatarUrl: null,
    title: "Project Manager — Civil & Marine",
    projectIds: ["p-mtoni", "p-kigamboni", "p-mwanza", "p-zanzibar", "p-arusha"],
    createdAt: "2020-09-14T08:00:00Z",
  },
  {
    id: "u-eng1",
    fullName: "Halima Juma",
    email: "halima.juma@altrabuild.co.tz",
    role: "engineer",
    phone: "+255 762 887 043",
    avatarUrl: null,
    title: "Site Engineer — Msasani",
    projectIds: ["p-msasani", "p-dodoma"],
    createdAt: "2022-03-07T08:00:00Z",
  },
  {
    id: "u-eng2",
    fullName: "Yusuf Rashid",
    email: "yusuf.rashid@altrabuild.co.tz",
    role: "engineer",
    phone: "+255 786 114 627",
    avatarUrl: null,
    title: "Safety Officer — Lake Zone",
    projectIds: ["p-mwanza", "p-zanzibar"],
    createdAt: "2023-05-22T08:00:00Z",
  },
  {
    id: "u-client",
    fullName: "Zahara Kimaro",
    email: "zahara@tumaini-estates.co.tz",
    role: "client",
    phone: "+255 754 900 312",
    avatarUrl: null,
    title: "Development Director, Tumaini Estates",
    projectIds: ["p-msasani"],
    createdAt: "2023-08-01T08:00:00Z",
  },
  {
    id: "u-client2",
    fullName: "Capt. Salim Rashid",
    email: "salim.rashid@zawadiports.co.tz",
    role: "client",
    phone: "+255 713 550 881",
    avatarUrl: null,
    title: "Harbour Master, Zawadi Ports Authority",
    projectIds: ["p-mtoni", "p-kigamboni"],
    createdAt: "2021-10-12T08:00:00Z",
  },
  {
    id: "u-client3",
    fullName: "Mussa Hamisi",
    email: "mussa@kariakoo-traders.co.tz",
    role: "client",
    phone: "+255 784 220 119",
    avatarUrl: null,
    title: "Chairman, Kariakoo Traders Association",
    projectIds: ["p-kariakoo"],
    createdAt: "2022-01-09T08:00:00Z",
  },
  {
    id: "u-client4",
    fullName: "Grace Mushi",
    email: "grace.mushi@lakezone-infra.co.tz",
    role: "client",
    phone: "+255 755 640 208",
    avatarUrl: null,
    title: "Programme Lead, Lake Zone Infrastructure Agency",
    projectIds: ["p-mwanza", "p-dodoma", "p-ubungo", "p-zanzibar", "p-arusha"],
    createdAt: "2024-04-02T08:00:00Z",
  },
];

/** Role used when no session role is supplied (demo default). */
export const defaultRole = "executive" as const;

/* ------------------------------------------------------------------ */
/* Projects                                                            */
/* ------------------------------------------------------------------ */
type ProjectSeed = Omit<Project, "workforce" | "safeManHours"> & {
  workforce: number;
  safeManHours: number;
};

export const projects: ProjectSeed[] = [
  {
    id: "p-msasani",
    projectCode: "PRJ-2026-08",
    name: "Msasani Peninsula Tower",
    clientName: "Tumaini Estates",
    clientId: "u-client",
    division: "Commercial & High-Rise",
    status: "active",
    budgetTotal: 268_000_000_000,
    budgetSpent: 244_800_000_000,
    startDate: "2023-08-14",
    targetDate: "2027-01-16",
    pmId: "u-pm1",
    lat: -6.7451,
    lng: 39.2812,
    weatherLocation: "Dar es Salaam — Msasani",
    address: "Plot 1482, Msasani Peninsula, Dar es Salaam",
    workforce: 412,
    safeManHours: 1_240_000,
    scheduleVarianceDays: 3,
    openRfis: 2,
    openIncidents: 1,
    cover: "/images/division-commercial.jpg",
    summary: "38-storey mixed-use tower; façade complete, fit-out and commissioning in progress.",
  },
  {
    id: "p-mtoni",
    projectCode: "PRJ-2024-03",
    name: "Mtoni Delta Crossing",
    clientName: "Zawadi Ports Authority",
    clientId: "u-client2",
    division: "Heavy Civil & Infrastructure",
    status: "handover",
    budgetTotal: 214_000_000_000,
    budgetSpent: 209_700_000_000,
    startDate: "2021-11-02",
    targetDate: "2024-02-29",
    pmId: "u-pm2",
    lat: -6.8202,
    lng: 39.3011,
    weatherLocation: "Dar es Salaam — Kigamboni",
    address: "Mtoni estuary, Kigamboni, Dar es Salaam",
    workforce: 38,
    safeManHours: 612_000,
    scheduleVarianceDays: 0,
    openRfis: 0,
    openIncidents: 0,
    cover: "/images/division-civil.jpg",
    summary: "640 m cable-stayed crossing in defects liability; final account under review.",
  },
  {
    id: "p-kariakoo",
    projectCode: "PRJ-2024-11",
    name: "Kariakoo Heritage Quarter",
    clientName: "Kariakoo Traders Association",
    clientId: "u-client3",
    division: "Specialised Retrofit",
    status: "handover",
    budgetTotal: 62_000_000_000,
    budgetSpent: 61_100_000_000,
    startDate: "2022-01-17",
    targetDate: "2024-04-12",
    pmId: "u-pm1",
    lat: -6.8193,
    lng: 39.2746,
    weatherLocation: "Dar es Salaam — Kariakoo",
    address: "Swahili Street, Kariakoo, Dar es Salaam",
    workforce: 24,
    safeManHours: 384_000,
    scheduleVarianceDays: -11,
    openRfis: 0,
    openIncidents: 0,
    cover: "/images/division-retrofit.jpg",
    summary: "Structural strengthening of a 1974 market block, handed over ahead of programme.",
  },
  {
    id: "p-dodoma",
    projectCode: "PRJ-2025-14",
    name: "Dodoma Hyperscale Campus",
    clientName: "Serengeti Energy",
    clientId: "u-client4",
    division: "Industrial & Pre-Engineered",
    status: "active",
    budgetTotal: 186_000_000_000,
    budgetSpent: 184_300_000_000,
    startDate: "2024-02-05",
    targetDate: "2026-12-04",
    pmId: "u-pm1",
    lat: -6.1734,
    lng: 35.7441,
    weatherLocation: "Dodoma — Nzuguni",
    address: "Nzuguni Industrial Park, Dodoma",
    workforce: 86,
    safeManHours: 486_000,
    scheduleVarianceDays: 14,
    openRfis: 1,
    openIncidents: 2,
    cover: "/images/project-datacentre.jpg",
    summary: "22 MW data campus energised; defects liability and solar performance testing.",
  },
  {
    id: "p-mwanza",
    projectCode: "PRJ-2026-51",
    name: "Mwanza Bay Link",
    clientName: "Lake Zone Infrastructure Agency",
    clientId: "u-client4",
    division: "Heavy Civil & Infrastructure",
    status: "active",
    budgetTotal: 198_000_000_000,
    budgetSpent: 67_300_000_000,
    startDate: "2026-01-12",
    targetDate: "2028-06-30",
    pmId: "u-pm2",
    lat: -2.5234,
    lng: 32.8968,
    weatherLocation: "Mwanza — Lake Victoria",
    address: "Mwanza South, Lake Victoria shoreline",
    workforce: 268,
    safeManHours: 210_000,
    scheduleVarianceDays: 6,
    openRfis: 3,
    openIncidents: 1,
    cover: "/images/division-civil.jpg",
    summary: "1.1 km lake crossing; marine piling 64% complete, pier caps mobilising.",
  },
  {
    id: "p-kigamboni",
    projectCode: "PRJ-2023-02",
    name: "Kigamboni Deepwater Terminal",
    clientName: "Zawadi Ports Authority",
    clientId: "u-client2",
    division: "Heavy Civil & Infrastructure",
    status: "handover",
    budgetTotal: 342_000_000_000,
    budgetSpent: 338_400_000_000,
    startDate: "2020-04-06",
    targetDate: "2023-02-28",
    pmId: "u-pm2",
    lat: -6.8296,
    lng: 39.3195,
    weatherLocation: "Dar es Salaam — Kigamboni",
    address: "Kigamboni Deepwater Terminal, Dar es Salaam",
    workforce: 22,
    safeManHours: 1_820_000,
    scheduleVarianceDays: -2,
    openRfis: 0,
    openIncidents: 0,
    cover: "/images/project-port.jpg",
    summary: "480 m quay wall and 18 ha yard; closed out with 0 LTI across 1.82M man-hours.",
  },
  {
    id: "p-ubungo",
    projectCode: "PRJ-2023-07",
    name: "Ubungo Intermodal Depot",
    clientName: "Ubungo Freight Holdings",
    clientId: "u-client4",
    division: "Industrial & Pre-Engineered",
    status: "active",
    budgetTotal: 94_000_000_000,
    budgetSpent: 71_400_000_000,
    startDate: "2025-03-03",
    targetDate: "2026-12-18",
    pmId: "u-pm1",
    lat: -6.7842,
    lng: 39.2084,
    weatherLocation: "Dar es Salaam — Ubungo",
    address: "Nelson Mandela Road, Ubungo, Dar es Salaam",
    workforce: 142,
    safeManHours: 298_000,
    scheduleVarianceDays: 9,
    openRfis: 1,
    openIncidents: 1,
    cover: "/images/division-industrial.jpg",
    summary: "48 m clear-span warehousing and rail spur; cold-chain boxes in fit-out.",
  },
  {
    id: "p-zanzibar",
    projectCode: "PRJ-2026-19",
    name: "Zanzibar Stone Town Restoration",
    clientName: "Stone Town Conservation Trust",
    clientId: "u-client4",
    division: "Specialised Retrofit",
    status: "pre-con",
    budgetTotal: 48_000_000_000,
    budgetSpent: 3_200_000_000,
    startDate: "2026-11-02",
    targetDate: "2028-03-31",
    pmId: "u-pm2",
    lat: -6.1624,
    lng: 39.1921,
    weatherLocation: "Zanzibar — Stone Town",
    address: "Malindi Road, Stone Town, Zanzibar",
    workforce: 0,
    safeManHours: 0,
    scheduleVarianceDays: 0,
    openRfis: 1,
    openIncidents: 0,
    cover: "/images/division-retrofit.jpg",
    summary: "Heritage envelope restoration; LiDAR survey complete, mobilisation 12 Dec 2026.",
  },
  {
    id: "p-arusha",
    projectCode: "PRJ-2026-27",
    name: "Arusha Convention Centre",
    clientName: "Kilimanjaro Hospitality Group",
    clientId: "u-client4",
    division: "Commercial & High-Rise",
    status: "on-hold",
    budgetTotal: 120_000_000_000,
    budgetSpent: 12_400_000_000,
    startDate: "2026-05-18",
    targetDate: "2028-02-29",
    pmId: "u-pm2",
    lat: -3.3869,
    lng: 36.6828,
    weatherLocation: "Arusha — Njiro",
    address: "Njiro Road, Arusha",
    workforce: 12,
    safeManHours: 14_000,
    scheduleVarianceDays: 21,
    openRfis: 2,
    openIncidents: 0,
    cover: "/images/division-commercial.jpg",
    summary: "On hold pending client financing close; substructure complete and protected.",
  },
];

/* ------------------------------------------------------------------ */
/* Phases — derived deterministically so the Gantt stays coherent      */
/* ------------------------------------------------------------------ */
const PHASE_TEMPLATE: { name: Phase["name"]; weight: number; share: number }[] = [
  { name: "Foundation", weight: 0.14, share: 0.16 },
  { name: "Superstructure", weight: 0.3, share: 0.3 },
  { name: "MEP", weight: 0.2, share: 0.2 },
  { name: "Envelope", weight: 0.16, share: 0.16 },
  { name: "Fit-out", weight: 0.2, share: 0.18 },
];

const PHASE_PROGRESS: Record<string, number[]> = {
  "p-msasani": [100, 100, 100, 100, 74],
  "p-mtoni": [100, 100, 100, 100, 100],
  "p-kariakoo": [100, 100, 100, 100, 100],
  "p-dodoma": [100, 100, 100, 100, 88],
  "p-mwanza": [64, 22, 4, 0, 0],
  "p-kigamboni": [100, 100, 100, 100, 100],
  "p-ubungo": [100, 100, 72, 58, 34],
  "p-zanzibar": [0, 0, 0, 0, 0],
  "p-arusha": [100, 0, 0, 0, 0],
};

function addDays(iso: string, days: number): string {
  const date = new Date(`${iso}T00:00:00Z`);
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString().slice(0, 10);
}

const DAY_MS = 86_400_000;
const TODAY_MS = Date.UTC(2026, 10, 23);

/**
 * Phase windows are derived from progress so the Gantt stays honest:
 * completed phases march forward from the start date, active phases straddle
 * today in proportion to elapsed progress, and future phases queue after them.
 */
function buildPhases(project: ProjectSeed): Phase[] {
  const startT = new Date(`${project.startDate}T00:00:00Z`).getTime();
  const targetT = new Date(`${project.targetDate}T00:00:00Z`).getTime();
  const totalDays = Math.max(Math.round((targetT - startT) / DAY_MS), 180);
  const progress = PHASE_PROGRESS[project.id] ?? [0, 0, 0, 0, 0];
  let cursor = startT;

  return PHASE_TEMPLATE.map((template, index) => {
    const value = progress[index] ?? 0;
    const duration = Math.max(Math.round(totalDays * template.share * 0.95), 24) * DAY_MS;
    let phaseStart: number;
    let phaseEnd: number;

    if (value >= 100) {
      phaseStart = Math.max(cursor, startT);
      phaseEnd = Math.min(phaseStart + duration, TODAY_MS - DAY_MS);
      if (phaseEnd - phaseStart < 14 * DAY_MS) phaseEnd = phaseStart + 14 * DAY_MS;
    } else if (value > 0) {
      const remaining = Math.round(duration * (1 - value / 100));
      phaseStart = Math.max(cursor, TODAY_MS - duration + remaining);
      phaseEnd = Math.max(phaseStart + duration, TODAY_MS + Math.max(remaining, 14 * DAY_MS));
    } else {
      phaseStart = Math.max(cursor, TODAY_MS + 14 * DAY_MS);
      phaseEnd = phaseStart + duration;
    }

    cursor = Math.max(cursor, phaseEnd);

    const status: Phase["status"] =
      value >= 100
        ? "complete"
        : value > 0
          ? "in-progress"
          : project.status === "on-hold" && index === 1
            ? "blocked"
            : "not-started";

    return {
      id: `${project.id}-ph${index + 1}`,
      projectId: project.id,
      name: template.name,
      startDate: new Date(phaseStart).toISOString().slice(0, 10),
      endDate: new Date(phaseEnd).toISOString().slice(0, 10),
      progress: value,
      status,
      weight: template.weight,
    };
  });
}

export const phases: Phase[] = projects.flatMap(buildPhases);

/* ------------------------------------------------------------------ */
/* Tasks                                                               */
/* ------------------------------------------------------------------ */
export const tasks: Task[] = [
  { id: "t-01", projectId: "p-msasani", title: "Lift lobby stone install — L31–L38", phase: "Fit-out", status: "in-progress", priority: "high", assigneeId: "u-eng1", dueDate: "2026-12-04", trade: "Finishing" },
  { id: "t-02", projectId: "p-msasani", title: "Chiller acoustic enclosure sign-off", phase: "MEP", status: "review", priority: "critical", assigneeId: "u-pm1", dueDate: "2026-11-27", trade: "MEP" },
  { id: "t-03", projectId: "p-msasani", title: "Façade snag close-out — north elevation", phase: "Envelope", status: "in-progress", priority: "medium", assigneeId: "u-eng1", dueDate: "2026-12-11", trade: "Façade" },
  { id: "t-04", projectId: "p-msasani", title: "Commissioning method statement — Rev C", phase: "MEP", status: "done", priority: "medium", assigneeId: "u-pm1", dueDate: "2026-11-14", trade: "Commissioning" },
  { id: "t-05", projectId: "p-msasani", title: "Ground plane drainage as-built", phase: "Fit-out", status: "backlog", priority: "low", assigneeId: "u-eng1", dueDate: "2026-12-18", trade: "Civil" },
  { id: "t-06", projectId: "p-mwanza", title: "Pier 4 pile cap reinforcement", phase: "Foundation", status: "in-progress", priority: "critical", assigneeId: "u-eng2", dueDate: "2026-12-02", trade: "Marine" },
  { id: "t-07", projectId: "p-mwanza", title: "Barge mooring plan — high water", phase: "Foundation", status: "review", priority: "high", assigneeId: "u-pm2", dueDate: "2026-11-26", trade: "Marine" },
  { id: "t-08", projectId: "p-mwanza", title: "Pier 5 pile driving — mobilise rig", phase: "Foundation", status: "backlog", priority: "high", assigneeId: "u-pm2", dueDate: "2026-12-14", trade: "Marine" },
  { id: "t-09", projectId: "p-mwanza", title: "Abutment A blinding concrete", phase: "Foundation", status: "done", priority: "medium", assigneeId: "u-eng2", dueDate: "2026-11-18", trade: "Concrete" },
  { id: "t-10", projectId: "p-ubungo", title: "Cold room panel install — Block C", phase: "Fit-out", status: "in-progress", priority: "high", assigneeId: "u-eng1", dueDate: "2026-12-09", trade: "Cold chain" },
  { id: "t-11", projectId: "p-ubungo", title: "Rail spur tamping & certification", phase: "Superstructure", status: "review", priority: "critical", assigneeId: "u-pm1", dueDate: "2026-11-29", trade: "Rail" },
  { id: "t-12", projectId: "p-ubungo", title: "Dock leveller procurement", phase: "Fit-out", status: "backlog", priority: "medium", assigneeId: "u-pm1", dueDate: "2026-12-20", trade: "Procurement" },
  { id: "t-13", projectId: "p-dodoma", title: "Solar performance test — 30 day", phase: "MEP", status: "in-progress", priority: "high", assigneeId: "u-eng1", dueDate: "2026-12-12", trade: "Energy" },
  { id: "t-14", projectId: "p-dodoma", title: "Water treatment plant servicing", phase: "MEP", status: "review", priority: "medium", assigneeId: "u-pm1", dueDate: "2026-12-01", trade: "MEP" },
  { id: "t-15", projectId: "p-dodoma", title: "Defects register close-out", phase: "Fit-out", status: "backlog", priority: "low", assigneeId: "u-eng1", dueDate: "2027-01-15", trade: "Closeout" },
  { id: "t-16", projectId: "p-zanzibar", title: "LiDAR point cloud QA", phase: "Foundation", status: "review", priority: "high", assigneeId: "u-eng2", dueDate: "2026-12-06", trade: "Survey" },
  { id: "t-17", projectId: "p-zanzibar", title: "Heritage method statement approval", phase: "Foundation", status: "backlog", priority: "critical", assigneeId: "u-pm2", dueDate: "2026-12-02", trade: "Heritage" },
  { id: "t-18", projectId: "p-arusha", title: "Substructure protection & mothballing", phase: "Foundation", status: "done", priority: "medium", assigneeId: "u-pm2", dueDate: "2026-10-30", trade: "Civil" },
  { id: "t-19", projectId: "p-arusha", title: "Financing close documentation", phase: "Foundation", status: "backlog", priority: "high", assigneeId: "u-pm2", dueDate: "2027-01-20", trade: "Commercial" },
  { id: "t-20", projectId: "p-mtoni", title: "Final account reconciliation", phase: "Fit-out", status: "in-progress", priority: "medium", assigneeId: "u-pm2", dueDate: "2026-12-15", trade: "Commercial" },
];

/* ------------------------------------------------------------------ */
/* Daily site logs                                                     */
/* ------------------------------------------------------------------ */
const log = (
  id: string,
  projectId: string,
  createdBy: string,
  logDate: string,
  weather: DailySiteLog["weather"],
  temperatureC: number,
  manpower: { trade: string; count: number }[],
  workCompleted: string,
  delays: string,
  syncedFromField = true,
): DailySiteLog => ({
  id,
  projectId,
  createdBy,
  logDate,
  weather,
  temperatureC,
  manpower,
  manpowerTotal: manpower.reduce((sum, entry) => sum + entry.count, 0),
  workCompleted,
  delays,
  photos: [],
  createdAt: `${logDate}T15:40:00Z`,
  syncedFromField,
});

export const dailySiteLogs: DailySiteLog[] = [
  log("log-01", "p-msasani", "u-eng1", "2026-11-22", "cloudy", 31, [
    { trade: "Steel fixers", count: 34 },
    { trade: "Carpenters", count: 28 },
    { trade: "MEP", count: 46 },
    { trade: "Finishing", count: 88 },
    { trade: "General labour", count: 96 },
    { trade: "Subcontractors", count: 84 },
  ], "Level 33–34 stone install completed. Chiller enclosure second-fix finished; commissioning witness scheduled 26 Nov.", "Hoist 2 downtime 2.5h — brake sensor replaced."),
  log("log-02", "p-msasani", "u-eng1", "2026-11-21", "clear", 33, [
    { trade: "Steel fixers", count: 30 },
    { trade: "Carpenters", count: 26 },
    { trade: "MEP", count: 42 },
    { trade: "Finishing", count: 84 },
    { trade: "General labour", count: 92 },
    { trade: "Subcontractors", count: 80 },
  ], "North elevation snag list closed to 14 items. Lift lobby mock-up approved by architect.", "None."),
  log("log-03", "p-msasani", "u-eng1", "2026-11-20", "light-rain", 28, [
    { trade: "Steel fixers", count: 28 },
    { trade: "Carpenters", count: 24 },
    { trade: "MEP", count: 40 },
    { trade: "Finishing", count: 76 },
    { trade: "General labour", count: 80 },
    { trade: "Subcontractors", count: 74 },
  ], "Rain stop 2h. Internal works continued on L31–L33.", "Morning rain — external façade works suspended until 10:30."),
  log("log-04", "p-mwanza", "u-eng2", "2026-11-22", "windy", 27, [
    { trade: "Marine riggers", count: 46 },
    { trade: "Steel fixers", count: 38 },
    { trade: "Concrete", count: 32 },
    { trade: "General labour", count: 74 },
    { trade: "Subcontractors", count: 52 },
  ], "Pile P4-06 driven to 31 m; pier 4 pile cap shutter erected. Barge mooring reviewed for rising lake level.", "Wind gust 18 m/s at 13:00 — lifting window suspended 40 min."),
  log("log-05", "p-mwanza", "u-eng2", "2026-11-21", "clear", 29, [
    { trade: "Marine riggers", count: 44 },
    { trade: "Steel fixers", count: 36 },
    { trade: "Concrete", count: 30 },
    { trade: "General labour", count: 72 },
    { trade: "Subcontractors", count: 50 },
  ], "Piles P4-04 and P4-05 completed. Rebar delivery to pier 4 accepted after mill certificate check.", "None."),
  log("log-06", "p-ubungo", "u-eng1", "2026-11-22", "clear", 32, [
    { trade: "Steel erectors", count: 22 },
    { trade: "Roofers", count: 18 },
    { trade: "MEP", count: 24 },
    { trade: "General labour", count: 46 },
    { trade: "Subcontractors", count: 32 },
  ], "Block C cold-room panels 60% installed. Rail spur tamping complete to chainage 0+850.", "Dock levellers held at customs — ETA 28 Nov."),
  log("log-07", "p-dodoma", "u-eng2", "2026-11-22", "extreme-heat", 35, [
    { trade: "MEP", count: 22 },
    { trade: "Commissioning", count: 14 },
    { trade: "General labour", count: 28 },
    { trade: "Subcontractors", count: 22 },
  ], "Solar string 4–6 performance test running. Water treatment plant service completed.", "Heat stress protocol active — work-rest cycle enforced 12:00–15:00."),
  log("log-08", "p-kariakoo", "u-eng1", "2026-11-18", "cloudy", 30, [
    { trade: "Finishing", count: 8 },
    { trade: "General labour", count: 10 },
    { trade: "Subcontractors", count: 6 },
  ], "Final reinstatement snagging in trading hall. Handover pack issued to association.", "None."),
  log("log-09", "p-mtoni", "u-pm2", "2026-11-17", "clear", 31, [
    { trade: "Finishing", count: 10 },
    { trade: "General labour", count: 16 },
    { trade: "Subcontractors", count: 12 },
  ], "Final account measurement walk with client QS. Expansion joint inspection complete.", "None."),
  log("log-10", "p-arusha", "u-pm2", "2026-11-14", "light-rain", 24, [
    { trade: "General labour", count: 8 },
    { trade: "Security", count: 4 },
  ], "Substructure protected for the hold period; dewatering pumps maintained.", "Site on hold pending financing close."),
  log("log-11", "p-kigamboni", "u-pm2", "2026-11-12", "clear", 31, [
    { trade: "General labour", count: 10 },
    { trade: "Subcontractors", count: 12 },
  ], "Crane rail survey re-verified at client request. No defects recorded.", "None."),
  log("log-12", "p-msasani", "u-eng1", "2026-11-19", "clear", 34, [
    { trade: "Steel fixers", count: 32 },
    { trade: "Carpenters", count: 26 },
    { trade: "MEP", count: 44 },
    { trade: "Finishing", count: 82 },
    { trade: "General labour", count: 88 },
    { trade: "Subcontractors", count: 78 },
  ], "Lift lobby stone delivery accepted. Commissioning checklist Rev B issued.", "None."),
];

/* ------------------------------------------------------------------ */
/* Safety incidents & checklist                                        */
/* ------------------------------------------------------------------ */
export const safetyIncidents: SafetyIncident[] = [
  {
    id: "inc-01",
    projectId: "p-msasani",
    inspectorId: "u-eng1",
    type: "near-miss",
    severity: "medium",
    title: "Falling wrench from L22 hoist landing",
    description: "A wrench fell from the L22 hoist landing into a barricaded zone. No injury; tool lanyard policy not followed by one subcontractor.",
    correctiveAction: "Toolbox talk delivered to all hoist users; lanyard audit at every shift start for 14 days.",
    status: "under-review",
    occurredAt: "2026-11-21T10:12:00Z",
    signedOffAt: null,
    signedOffBy: null,
    photos: [],
  },
  {
    id: "inc-02",
    projectId: "p-mwanza",
    inspectorId: "u-eng2",
    type: "minor",
    severity: "medium",
    title: "Hand laceration during rebar handling",
    description: "Rebar handler sustained a superficial cut to the left hand. First aid administered on site; worker returned to duties.",
    correctiveAction: "Cut-resistant gloves re-issued; rebar bundles re-banded at delivery.",
    status: "resolved",
    occurredAt: "2026-11-16T08:50:00Z",
    signedOffAt: "2026-11-17T09:30:00Z",
    signedOffBy: "u-ops",
    photos: [],
  },
  {
    id: "inc-03",
    projectId: "p-dodoma",
    inspectorId: "u-eng2",
    type: "routine-check",
    severity: "low",
    title: "Heat-stress compliance audit",
    description: "Routine audit of work-rest cycles during extreme heat advisory. Two crews had not logged the afternoon rest period.",
    correctiveAction: "Supervisor coaching; rest period logging added to the daily field form.",
    status: "resolved",
    occurredAt: "2026-11-14T13:20:00Z",
    signedOffAt: "2026-11-15T07:45:00Z",
    signedOffBy: "u-ops",
    photos: [],
  },
  {
    id: "inc-04",
    projectId: "p-ubungo",
    inspectorId: "u-eng1",
    type: "severe",
    severity: "high",
    title: "Scaffold standard displaced by telehandler",
    description: "A telehandler clipped a scaffold standard at Block C, displacing the base plate by 40 mm. Scaffold tag suspended immediately.",
    correctiveAction: "Scaffold re-erected and re-tagged by competent person; telehandler exclusion zone widened and banksman re-briefed.",
    status: "open",
    occurredAt: "2026-11-20T15:05:00Z",
    signedOffAt: null,
    signedOffBy: null,
    photos: [],
  },
  {
    id: "inc-05",
    projectId: "p-msasani",
    inspectorId: "u-eng1",
    type: "routine-check",
    severity: "low",
    title: "Weekly lifting gear inspection",
    description: "All slings and shackles within inspection date. Two shackles removed for wear.",
    correctiveAction: "Defective shackles quarantined and replaced.",
    status: "resolved",
    occurredAt: "2026-11-18T09:00:00Z",
    signedOffAt: "2026-11-18T16:20:00Z",
    signedOffBy: "u-eng1",
    photos: [],
  },
  {
    id: "inc-06",
    projectId: "p-dodoma",
    inspectorId: "u-eng2",
    type: "near-miss",
    severity: "low",
    title: "Vehicle reversing near pedestrian route",
    description: "Delivery vehicle reversed without banksman near the west pedestrian route. No injury.",
    correctiveAction: "One-way traffic plan enforced; banksman stationed at gate 2 for all deliveries.",
    status: "resolved",
    occurredAt: "2026-11-11T11:35:00Z",
    signedOffAt: "2026-11-12T08:10:00Z",
    signedOffBy: "u-ops",
    photos: [],
  },
  {
    id: "inc-07",
    projectId: "p-mwanza",
    inspectorId: "u-eng2",
    type: "routine-check",
    severity: "low",
    title: "Barge life-jacket drill",
    description: "Monthly man-overboard drill executed with 22 marine staff. Drill completed within 4 minutes.",
    correctiveAction: "No action required; next drill 12 Dec 2026.",
    status: "resolved",
    occurredAt: "2026-11-09T07:30:00Z",
    signedOffAt: "2026-11-09T12:00:00Z",
    signedOffBy: "u-eng2",
    photos: [],
  },
  {
    id: "inc-08",
    projectId: "p-msasani",
    inspectorId: "u-eng1",
    type: "minor",
    severity: "low",
    title: "Dust exposure — dry cutting in lobby",
    description: "Dry cutting observed without water suppression on L31. Operative removed from task and re-briefed.",
    correctiveAction: "Wet-cutting enforced; local exhaust ventilation added to the lobby work area.",
    status: "open",
    occurredAt: "2026-11-22T11:10:00Z",
    signedOffAt: null,
    signedOffBy: null,
    photos: [],
  },
  {
    id: "inc-09",
    projectId: "p-ubungo",
    inspectorId: "u-eng1",
    type: "routine-check",
    severity: "low",
    title: "Rail spur exclusion audit",
    description: "Audit of rail spur working zone. Barriers compliant; one gate left unlocked.",
    correctiveAction: "Gate lock replaced; key control added to shift handover.",
    status: "under-review",
    occurredAt: "2026-11-19T10:45:00Z",
    signedOffAt: null,
    signedOffBy: null,
    photos: [],
  },
  {
    id: "inc-10",
    projectId: "p-kariakoo",
    inspectorId: "u-eng1",
    type: "routine-check",
    severity: "low",
    title: "Handover safety walk",
    description: "Final safety walk with the traders' association. Zero open observations.",
    correctiveAction: "Handover safety file issued.",
    status: "resolved",
    occurredAt: "2026-11-17T09:15:00Z",
    signedOffAt: "2026-11-17T15:00:00Z",
    signedOffBy: "u-ops",
    photos: [],
  },
];

export const safetyChecklist: SafetyChecklistItem[] = [
  { id: "ck-01", clause: "ISO 45001 §6.1.2", requirement: "Hazard identification & risk assessment current for all active work fronts", standard: "ISO 45001", status: "compliant", owner: "u-ops", lastAudited: "2026-11-18" },
  { id: "ck-02", clause: "ISO 45001 §7.2", requirement: "Competence records for lifting, scaffolding and confined-space operatives", standard: "ISO 45001", status: "compliant", owner: "u-pm1", lastAudited: "2026-11-14" },
  { id: "ck-03", clause: "ISO 45001 §9.1", requirement: "Monthly safety performance review minuted with directors", standard: "ISO 45001", status: "compliant", owner: "u-exec", lastAudited: "2026-11-05" },
  { id: "ck-04", clause: "OSHA TZ §62", requirement: "Statutory site registration and OSHA 2 returns filed", standard: "OSHA", status: "compliant", owner: "u-ops", lastAudited: "2026-10-30" },
  { id: "ck-05", clause: "OSHA TZ §88", requirement: "PPE issue register signed by every worker on site", standard: "OSHA", status: "action-required", owner: "u-eng2", lastAudited: "2026-11-21" },
  { id: "ck-06", clause: "Company §3.4", requirement: "Daily 12-point Kifaru verification completed before first shift", standard: "Company", status: "compliant", owner: "u-eng1", lastAudited: "2026-11-22" },
  { id: "ck-07", clause: "Company §3.9", requirement: "SOS drill executed at every active site each quarter", standard: "Company", status: "action-required", owner: "u-eng2", lastAudited: "2026-10-12" },
  { id: "ck-08", clause: "ISO 45001 §8.1.2", requirement: "Subcontractor safety passports renewed and verified", standard: "ISO 45001", status: "compliant", owner: "u-pm2", lastAudited: "2026-11-09" },
  { id: "ck-09", clause: "OSHA TZ §105", requirement: "Incident register complete and reported within 24 hours", standard: "OSHA", status: "overdue", owner: "u-eng1", lastAudited: "2026-11-22" },
  { id: "ck-10", clause: "Company §5.2", requirement: "Emergency contact board updated at site gate", standard: "Company", status: "compliant", owner: "u-pm1", lastAudited: "2026-11-16" },
];

/* ------------------------------------------------------------------ */
/* Procurement                                                         */
/* ------------------------------------------------------------------ */
export const requisitions: Requisition[] = [
  { id: "req-01", projectId: "p-msasani", requestedBy: "u-eng1", itemName: "Grade 60 Rebar 16 mm", category: "structural", quantityRequested: 42, unit: "tonnes", estimatedCost: 189_000_000, approvalStatus: "pending", deliveryTrackingCode: null, requiredBy: "2026-12-02", supplier: "Steel Centre Tanzania", createdAt: "2026-11-21T08:20:00Z" },
  { id: "req-02", projectId: "p-msasani", requestedBy: "u-eng1", itemName: "Portland Cement Type II", category: "structural", quantityRequested: 900, unit: "bags", estimatedCost: 21_600_000, approvalStatus: "approved", deliveryTrackingCode: "TZ-DAR-884213", requiredBy: "2026-11-28", supplier: "Tanga Cement", createdAt: "2026-11-18T09:10:00Z" },
  { id: "req-03", projectId: "p-mwanza", requestedBy: "u-eng2", itemName: "Marine-grade rebar 25 mm", category: "structural", quantityRequested: 68, unit: "tonnes", estimatedCost: 342_000_000, approvalStatus: "approved", deliveryTrackingCode: "TZ-MWZ-114092", requiredBy: "2026-12-08", supplier: "Steel Centre Tanzania", createdAt: "2026-11-19T07:45:00Z" },
  { id: "req-04", projectId: "p-mwanza", requestedBy: "u-eng2", itemName: "Barge mooring line 48 mm", category: "structural", quantityRequested: 8, unit: "reels", estimatedCost: 18_400_000, approvalStatus: "pending", deliveryTrackingCode: null, requiredBy: "2026-11-27", supplier: "Lake Marine Supplies", createdAt: "2026-11-22T06:30:00Z" },
  { id: "req-05", projectId: "p-ubungo", requestedBy: "u-pm1", itemName: "Cold room insulated panels 150 mm", category: "finishing", quantityRequested: 480, unit: "m²", estimatedCost: 96_000_000, approvalStatus: "delivered", deliveryTrackingCode: "TZ-DAR-771044", requiredBy: "2026-11-15", supplier: "ColdChain Systems", createdAt: "2026-11-02T10:15:00Z" },
  { id: "req-06", projectId: "p-ubungo", requestedBy: "u-eng1", itemName: "Dock leveller 6 t", category: "structural", quantityRequested: 4, unit: "units", estimatedCost: 44_800_000, approvalStatus: "pending", deliveryTrackingCode: null, requiredBy: "2026-12-12", supplier: "Port Equipment EA", createdAt: "2026-11-20T13:05:00Z" },
  { id: "req-07", projectId: "p-dodoma", requestedBy: "u-eng1", itemName: "UPS battery strings 12V", category: "electrical", quantityRequested: 96, unit: "units", estimatedCost: 78_400_000, approvalStatus: "approved", deliveryTrackingCode: "TZ-DOD-330118", requiredBy: "2026-12-05", supplier: "PowerCell Africa", createdAt: "2026-11-17T11:40:00Z" },
  { id: "req-08", projectId: "p-dodoma", requestedBy: "u-eng2", itemName: "Cooling tower water treatment", category: "plumbing", quantityRequested: 1, unit: "service", estimatedCost: 12_800_000, approvalStatus: "delivered", deliveryTrackingCode: "TZ-DOD-330090", requiredBy: "2026-11-10", supplier: "HydroServe", createdAt: "2026-10-28T08:00:00Z" },
  { id: "req-09", projectId: "p-zanzibar", requestedBy: "u-pm2", itemName: "Lime mortar — heritage mix", category: "finishing", quantityRequested: 24, unit: "tonnes", estimatedCost: 19_200_000, approvalStatus: "pending", deliveryTrackingCode: null, requiredBy: "2026-12-18", supplier: "Coral Lime Co.", createdAt: "2026-11-21T15:20:00Z" },
  { id: "req-10", projectId: "p-zanzibar", requestedBy: "u-eng2", itemName: "Scaffold — heritage compliant", category: "structural", quantityRequested: 1_200, unit: "m²", estimatedCost: 28_800_000, approvalStatus: "rejected", deliveryTrackingCode: null, requiredBy: "2026-12-10", supplier: "Island Scaffold", createdAt: "2026-11-15T09:35:00Z" },
  { id: "req-11", projectId: "p-msasani", requestedBy: "u-pm1", itemName: "Lift lobby travertine", category: "finishing", quantityRequested: 340, unit: "m²", estimatedCost: 54_400_000, approvalStatus: "delivered", deliveryTrackingCode: "TZ-DAR-882003", requiredBy: "2026-11-12", supplier: "Stone Gallery", createdAt: "2026-10-25T14:10:00Z" },
  { id: "req-12", projectId: "p-mwanza", requestedBy: "u-pm2", itemName: "Ready-mix C40/50", category: "structural", quantityRequested: 260, unit: "m³", estimatedCost: 62_400_000, approvalStatus: "approved", deliveryTrackingCode: "TZ-MWZ-114107", requiredBy: "2026-11-30", supplier: "Lake Concrete", createdAt: "2026-11-20T07:55:00Z" },
  { id: "req-13", projectId: "p-ubungo", requestedBy: "u-pm1", itemName: "Fire-rated roller shutters", category: "finishing", quantityRequested: 12, unit: "units", estimatedCost: 38_400_000, approvalStatus: "approved", deliveryTrackingCode: "TZ-DAR-772221", requiredBy: "2026-12-15", supplier: "SecureOpen", createdAt: "2026-11-19T16:25:00Z" },
  { id: "req-14", projectId: "p-arusha", requestedBy: "u-pm2", itemName: "Dewatering pump 15 kW", category: "plumbing", quantityRequested: 2, unit: "units", estimatedCost: 7_600_000, approvalStatus: "delivered", deliveryTrackingCode: "TZ-ARK-445120", requiredBy: "2026-11-05", supplier: "Pumpworks", createdAt: "2026-10-30T10:00:00Z" },
  { id: "req-15", projectId: "p-msasani", requestedBy: "u-eng1", itemName: "Firestop sealant", category: "electrical", quantityRequested: 180, unit: "tubes", estimatedCost: 5_760_000, approvalStatus: "pending", deliveryTrackingCode: null, requiredBy: "2026-12-06", supplier: "SafeSeal", createdAt: "2026-11-22T12:30:00Z" },
  { id: "req-16", projectId: "p-mwanza", requestedBy: "u-eng2", itemName: "Life jackets — marine crew", category: "finishing", quantityRequested: 60, unit: "units", estimatedCost: 4_800_000, approvalStatus: "approved", deliveryTrackingCode: "TZ-MWZ-114120", requiredBy: "2026-11-25", supplier: "Lake Marine Supplies", createdAt: "2026-11-21T09:00:00Z" },
];

export const inventory: InventoryItem[] = [
  { id: "inv-01", sku: "STL-RB16", itemName: "Grade 60 Rebar 16 mm", category: "structural", unit: "tonnes", stockLevel: 18, reorderPoint: 30, unitCost: 4_500_000, warehouse: "Ubungo yard", lastCountedAt: "2026-11-22" },
  { id: "inv-02", sku: "STL-RB25", itemName: "Marine-grade rebar 25 mm", category: "structural", unit: "tonnes", stockLevel: 46, reorderPoint: 40, unitCost: 5_030_000, warehouse: "Ubungo yard", lastCountedAt: "2026-11-22" },
  { id: "inv-03", sku: "CEM-T2", itemName: "Portland Cement Type II", category: "structural", unit: "bags", stockLevel: 1_240, reorderPoint: 1_000, unitCost: 24_000, warehouse: "Msasani site", lastCountedAt: "2026-11-21" },
  { id: "inv-04", sku: "AGG-20", itemName: "Aggregate 20 mm", category: "structural", unit: "m³", stockLevel: 210, reorderPoint: 250, unitCost: 78_000, warehouse: "Ubungo yard", lastCountedAt: "2026-11-20" },
  { id: "inv-05", sku: "RMC-C40", itemName: "Ready-mix C40/50", category: "structural", unit: "m³", stockLevel: 0, reorderPoint: 60, unitCost: 240_000, warehouse: "Mwanza batch plant", lastCountedAt: "2026-11-22" },
  { id: "inv-06", sku: "STL-SEC", itemName: "Structural steel sections", category: "structural", unit: "tonnes", stockLevel: 84, reorderPoint: 50, unitCost: 6_200_000, warehouse: "Ubungo yard", lastCountedAt: "2026-11-19" },
  { id: "inv-07", sku: "FRM-PLY", itemName: "Formwork ply 18 mm", category: "structural", unit: "sheets", stockLevel: 320, reorderPoint: 400, unitCost: 46_000, warehouse: "Msasani site", lastCountedAt: "2026-11-21" },
  { id: "inv-08", sku: "PPE-HV", itemName: "Hi-vis vest & helmet set", category: "finishing", unit: "sets", stockLevel: 148, reorderPoint: 120, unitCost: 32_000, warehouse: "Ubungo yard", lastCountedAt: "2026-11-22" },
];

/* ------------------------------------------------------------------ */
/* RFIs & change orders                                                */
/* ------------------------------------------------------------------ */
export const rfis: Rfi[] = [
  { id: "rfi-01", projectId: "p-msasani", rfiNumber: "RFI-417", title: "Chiller acoustic enclosure detail", description: "Acoustic enclosure clashes with the structural transfer beam at L14. Request confirmation of revised bracket detail.", raisedBy: "u-eng1", costImpact: 0, scheduleImpactDays: 0, architectResponse: "Bracket detail SK-114 Rev B issued; no cost impact.", status: "answered", isChangeOrder: false, createdAt: "2026-11-09T08:15:00Z", approvedAt: null, approvedBy: null },
  { id: "rfi-02", projectId: "p-msasani", rfiNumber: "RFI-419", title: "Lift lobby stone tolerance", description: "Stone thickness variance of 4 mm exceeds the specified 2 mm tolerance in the lift lobby.", raisedBy: "u-pm1", costImpact: 18_400_000, scheduleImpactDays: 3, architectResponse: "Approved to accept variance with a 4 mm bed adjustment.", status: "pending-approval", isChangeOrder: true, createdAt: "2026-11-16T10:05:00Z", approvedAt: null, approvedBy: null },
  { id: "rfi-03", projectId: "p-mwanza", rfiNumber: "RFI-512", title: "Barge mooring during high water", description: "Lake level has risen 0.8 m above the 2024 design assumption, affecting barge mooring during pier 4 works.", raisedBy: "u-eng2", costImpact: 42_000_000, scheduleImpactDays: 5, architectResponse: null, status: "open", isChangeOrder: true, createdAt: "2026-11-22T06:50:00Z", approvedAt: null, approvedBy: null },
  { id: "rfi-04", projectId: "p-mwanza", rfiNumber: "RFI-514", title: "Pile cut-off level discrepancy", description: "Measured pile cut-off at P4-02 is 220 mm below the survey sheet. Request confirmation before pile cap fixing.", raisedBy: "u-eng2", costImpact: 6_800_000, scheduleImpactDays: 1, architectResponse: null, status: "open", isChangeOrder: false, createdAt: "2026-11-21T11:30:00Z", approvedAt: null, approvedBy: null },
  { id: "rfi-05", projectId: "p-ubungo", rfiNumber: "RFI-221", title: "Dock leveller pit drainage", description: "Pit drainage falls away from the outlet; request approval for a revised sump detail.", raisedBy: "u-pm1", costImpact: 9_200_000, scheduleImpactDays: 2, architectResponse: "Revised detail under review by consultant.", status: "pending-approval", isChangeOrder: true, createdAt: "2026-11-19T14:10:00Z", approvedAt: null, approvedBy: null },
  { id: "rfi-06", projectId: "p-ubungo", rfiNumber: "RFI-218", title: "Cold-room panel fixing substrate", description: "Block wall tolerance exceeds panel manufacturer requirement; request permission for a levelling frame.", raisedBy: "u-eng1", costImpact: 4_600_000, scheduleImpactDays: 0, architectResponse: "Levelling frame approved as a variation.", status: "answered", isChangeOrder: false, createdAt: "2026-11-06T09:45:00Z", approvedAt: null, approvedBy: null },
  { id: "rfi-07", projectId: "p-dodoma", rfiNumber: "RFI-338", title: "Solar inverter clearance to boundary", description: "Clearance to the north boundary is 1.9 m; specification requires 2.5 m. Request variance or re-layout.", raisedBy: "u-eng1", costImpact: 0, scheduleImpactDays: 4, architectResponse: "Variance approved subject to fire consultant sign-off.", status: "answered", isChangeOrder: false, createdAt: "2026-11-03T12:20:00Z", approvedAt: null, approvedBy: null },
  { id: "rfi-08", projectId: "p-zanzibar", rfiNumber: "RFI-603", title: "Heritage render mix approval", description: "Proposed lime mortar mix requires conservation officer approval before mock-up.", raisedBy: "u-pm2", costImpact: 0, scheduleImpactDays: 0, architectResponse: null, status: "open", isChangeOrder: false, createdAt: "2026-11-20T09:00:00Z", approvedAt: null, approvedBy: null },
  { id: "rfi-09", projectId: "p-arusha", rfiNumber: "RFI-710", title: "Mothballing scope for held substructure", description: "Request client instruction on the extent of protection works needed during the financing hold.", raisedBy: "u-pm2", costImpact: 22_800_000, scheduleImpactDays: 0, architectResponse: null, status: "open", isChangeOrder: true, createdAt: "2026-11-12T10:40:00Z", approvedAt: null, approvedBy: null },
  { id: "rfi-10", projectId: "p-msasani", rfiNumber: "RFI-404", title: "Ground plane drainage invert", description: "Existing council invert is 150 mm higher than shown on the utilities survey.", raisedBy: "u-eng1", costImpact: 7_400_000, scheduleImpactDays: 2, architectResponse: "Approved — revise invert and re-sequence drainage.", status: "closed", isChangeOrder: true, createdAt: "2026-10-22T08:30:00Z", approvedAt: "2026-10-29T14:00:00Z", approvedBy: "u-exec" },
  { id: "rfi-11", projectId: "p-mwanza", rfiNumber: "RFI-508", title: "Temporary works — crane platform", description: "Request approval for an enlarged crane platform on the east abutment to suit the revised piling sequence.", raisedBy: "u-pm2", costImpact: 31_000_000, scheduleImpactDays: -2, architectResponse: "Temporary works approved by engineer.", status: "closed", isChangeOrder: true, createdAt: "2026-10-18T13:00:00Z", approvedAt: "2026-10-24T09:30:00Z", approvedBy: "u-exec" },
  { id: "rfi-12", projectId: "p-msasani", rfiNumber: "RFI-421", title: "Commissioning witness schedule", description: "Request client confirmation of witness dates for integrated systems testing.", raisedBy: "u-pm1", costImpact: 0, scheduleImpactDays: 0, architectResponse: null, status: "pending-approval", isChangeOrder: false, createdAt: "2026-11-22T08:00:00Z", approvedAt: null, approvedBy: null },
];

/* ------------------------------------------------------------------ */
/* Invoices                                                            */
/* ------------------------------------------------------------------ */
export const invoices: Invoice[] = [
  { id: "inv-ms-14", projectId: "p-msasani", invoiceNumber: "INV-2288", milestone: "Interim certificate 14 — fit-out", amount: 4_100_000_000, issuedAt: "2026-11-01", dueAt: "2026-11-30", status: "due", paidAt: null },
  { id: "inv-ms-13", projectId: "p-msasani", invoiceNumber: "INV-2261", milestone: "Interim certificate 13 — façade", amount: 6_400_000_000, issuedAt: "2026-10-01", dueAt: "2026-10-31", status: "submitted", paidAt: null },
  { id: "inv-ms-12", projectId: "p-msasani", invoiceNumber: "INV-2214", milestone: "Interim certificate 12 — MEP", amount: 8_200_000_000, issuedAt: "2026-09-01", dueAt: "2026-09-30", status: "paid", paidAt: "2026-09-26" },
  { id: "inv-mw-03", projectId: "p-mwanza", invoiceNumber: "INV-2340", milestone: "Marine piling — milestone 3", amount: 5_600_000_000, issuedAt: "2026-11-05", dueAt: "2026-12-05", status: "due", paidAt: null },
  { id: "inv-mw-02", projectId: "p-mwanza", invoiceNumber: "INV-2318", milestone: "Mobilisation & enabling", amount: 3_200_000_000, issuedAt: "2026-07-05", dueAt: "2026-08-05", status: "paid", paidAt: "2026-08-01" },
  { id: "inv-ub-08", projectId: "p-ubungo", invoiceNumber: "INV-2201", milestone: "Cold chain fit-out", amount: 2_800_000_000, issuedAt: "2026-10-12", dueAt: "2026-11-12", status: "overdue", paidAt: null },
  { id: "inv-ub-07", projectId: "p-ubungo", invoiceNumber: "INV-2179", milestone: "Rail spur commissioning", amount: 3_400_000_000, issuedAt: "2026-09-10", dueAt: "2026-10-10", status: "paid", paidAt: "2026-10-07" },
  { id: "inv-do-05", projectId: "p-dodoma", invoiceNumber: "INV-2140", milestone: "Solar performance retention", amount: 6_200_000_000, issuedAt: "2026-11-15", dueAt: "2026-12-15", status: "submitted", paidAt: null },
  { id: "inv-ki-11", projectId: "p-kigamboni", invoiceNumber: "INV-1980", milestone: "Final account — retention release", amount: 12_000_000_000, issuedAt: "2026-08-15", dueAt: "2026-09-15", status: "paid", paidAt: "2026-09-11" },
  { id: "inv-ka-09", projectId: "p-kariakoo", invoiceNumber: "INV-2031", milestone: "Handover & defects security", amount: 1_800_000_000, issuedAt: "2026-07-20", dueAt: "2026-08-19", status: "paid", paidAt: "2026-08-16" },
  { id: "inv-za-01", projectId: "p-zanzibar", invoiceNumber: "INV-2388", milestone: "Pre-construction mobilisation", amount: 1_200_000_000, issuedAt: "2026-11-10", dueAt: "2026-12-10", status: "submitted", paidAt: null },
  { id: "inv-ar-02", projectId: "p-arusha", invoiceNumber: "INV-2077", milestone: "Substructure protection", amount: 900_000_000, issuedAt: "2026-10-28", dueAt: "2026-11-27", status: "due", paidAt: null },
];

/* ------------------------------------------------------------------ */
/* Documents                                                           */
/* ------------------------------------------------------------------ */
export const documents: DocumentItem[] = [
  { id: "doc-01", projectId: "p-msasani", name: "Federated model — Rev 34 (IFC)", category: "drawing", revision: "34", fileSize: "412 MB", uploadedBy: "u-pm1", uploadedAt: "2026-11-18", status: "current" },
  { id: "doc-02", projectId: "p-msasani", name: "Façade test report", category: "report", revision: "C", fileSize: "8.2 MB", uploadedBy: "u-eng1", uploadedAt: "2026-11-14", status: "current" },
  { id: "doc-03", projectId: "p-msasani", name: "Commissioning plan", category: "specification", revision: "B", fileSize: "2.4 MB", uploadedBy: "u-pm1", uploadedAt: "2026-11-09", status: "for-review" },
  { id: "doc-04", projectId: "p-mwanza", name: "Marine method statement", category: "specification", revision: "D", fileSize: "6.1 MB", uploadedBy: "u-pm2", uploadedAt: "2026-11-18", status: "current" },
  { id: "doc-05", projectId: "p-mwanza", name: "Pile load test results", category: "report", revision: "A", fileSize: "3.8 MB", uploadedBy: "u-eng2", uploadedAt: "2026-11-11", status: "current" },
  { id: "doc-06", projectId: "p-ubungo", name: "Rail spur as-built", category: "drawing", revision: "2", fileSize: "22 MB", uploadedBy: "u-pm1", uploadedAt: "2026-11-16", status: "for-review" },
  { id: "doc-07", projectId: "p-dodoma", name: "IST close-out report", category: "report", revision: "A", fileSize: "14 MB", uploadedBy: "u-eng1", uploadedAt: "2026-10-18", status: "current" },
  { id: "doc-08", projectId: "p-dodoma", name: "O&M manuals — plant", category: "specification", revision: "1", fileSize: "88 MB", uploadedBy: "u-pm1", uploadedAt: "2026-10-10", status: "superseded" },
  { id: "doc-09", projectId: "p-zanzibar", name: "LiDAR point cloud", category: "report", revision: "A", fileSize: "640 MB", uploadedBy: "u-eng2", uploadedAt: "2026-11-20", status: "for-review" },
  { id: "doc-10", projectId: "p-kigamboni", name: "Defects certificate", category: "certificate", revision: "Final", fileSize: "1.2 MB", uploadedBy: "u-pm2", uploadedAt: "2024-02-26", status: "current" },
  { id: "doc-11", projectId: "p-kariakoo", name: "Heritage sign-off", category: "certificate", revision: "Final", fileSize: "900 KB", uploadedBy: "u-pm1", uploadedAt: "2024-04-08", status: "current" },
  { id: "doc-12", projectId: "p-arusha", name: "Mothballing plan", category: "specification", revision: "B", fileSize: "3.1 MB", uploadedBy: "u-pm2", uploadedAt: "2026-10-29", status: "current" },
];

/* ------------------------------------------------------------------ */
/* Finance, alerts, audit                                              */
/* ------------------------------------------------------------------ */
export const financials: MonthlyFinancial[] = [
  { month: "Jan", outflow: 18_400_000_000, billing: 14_200_000_000, forecast: 19_000_000_000 },
  { month: "Feb", outflow: 21_200_000_000, billing: 16_800_000_000, forecast: 22_000_000_000 },
  { month: "Mar", outflow: 24_600_000_000, billing: 19_400_000_000, forecast: 25_000_000_000 },
  { month: "Apr", outflow: 23_100_000_000, billing: 21_600_000_000, forecast: 24_000_000_000 },
  { month: "May", outflow: 27_800_000_000, billing: 24_100_000_000, forecast: 28_000_000_000 },
  { month: "Jun", outflow: 30_400_000_000, billing: 25_800_000_000, forecast: 31_000_000_000 },
  { month: "Jul", outflow: 26_900_000_000, billing: 24_900_000_000, forecast: 28_000_000_000 },
  { month: "Aug", outflow: 31_200_000_000, billing: 27_400_000_000, forecast: 32_000_000_000 },
  { month: "Sep", outflow: 34_600_000_000, billing: 29_600_000_000, forecast: 35_000_000_000 },
  { month: "Oct", outflow: 29_800_000_000, billing: 28_200_000_000, forecast: 31_000_000_000 },
  { month: "Nov", outflow: 33_400_000_000, billing: 30_800_000_000, forecast: 34_000_000_000 },
  { month: "Dec", outflow: 36_200_000_000, billing: 32_400_000_000, forecast: 37_000_000_000 },
];

export const alerts: SiteAlert[] = [
  { id: "al-01", projectId: "p-ubungo", severity: "critical", title: "Scaffold tag suspended — Block C", detail: "Telehandler strike on standard. Scaffold suspended pending re-tag by competent person.", createdAt: "2026-11-20T15:06:00Z", acknowledged: false, kind: "safety" },
  { id: "al-02", projectId: "p-mwanza", severity: "warning", title: "Ready-mix stock at zero", detail: "C40/50 inventory is below the 60 m³ reorder point. Requisition req-12 approved.", createdAt: "2026-11-22T07:10:00Z", acknowledged: false, kind: "procurement" },
  { id: "al-03", projectId: "p-dodoma", severity: "warning", title: "14-day schedule variance", detail: "Solar performance testing has pushed practical completion by 14 days against the baseline.", createdAt: "2026-11-21T09:30:00Z", acknowledged: true, kind: "schedule" },
  { id: "al-04", projectId: "p-msasani", severity: "warning", title: "Change order awaiting approval", detail: "RFI-419 (stone tolerance) carries TZS 18.4M cost and 3 days schedule impact.", createdAt: "2026-11-16T10:10:00Z", acknowledged: false, kind: "schedule" },
  { id: "al-05", projectId: "p-zanzibar", severity: "info", title: "Mobilisation plan issued", detail: "Heritage method statement and mobilisation sequence issued for client review.", createdAt: "2026-11-20T09:05:00Z", acknowledged: true, kind: "schedule" },
  { id: "al-06", projectId: "p-mwanza", severity: "critical", title: "SOS drill outstanding", detail: "Quarterly SOS drill is overdue for the Mwanza marine site.", createdAt: "2026-11-12T08:00:00Z", acknowledged: false, kind: "safety" },
];

export const audit: AuditEntry[] = [
  { id: "au-01", actorId: "u-eng1", action: "Submitted daily log", entity: "daily_site_logs", entityId: "log-01", createdAt: "2026-11-22T15:40:00Z", detail: "Msasani — 376 workers, cloudy 31°C" },
  { id: "au-02", actorId: "u-eng2", action: "Raised RFI", entity: "rfis", entityId: "rfi-03", createdAt: "2026-11-22T06:50:00Z", detail: "Mwanza — barge mooring during high water" },
  { id: "au-03", actorId: "u-pm2", action: "Approved requisition", entity: "requisitions", entityId: "req-12", createdAt: "2026-11-21T16:20:00Z", detail: "Ready-mix C40/50 — 260 m³" },
  { id: "au-04", actorId: "u-eng1", action: "Logged incident", entity: "safety_incidents", entityId: "inc-08", createdAt: "2026-11-22T11:10:00Z", detail: "Msasani — dust exposure near miss" },
  { id: "au-05", actorId: "u-pm1", action: "Uploaded document", entity: "documents", entityId: "doc-01", createdAt: "2026-11-18T13:00:00Z", detail: "Federated model Rev 34" },
  { id: "au-06", actorId: "u-exec", action: "Approved change order", entity: "rfis", entityId: "rfi-11", createdAt: "2026-10-24T09:30:00Z", detail: "Mwanza — crane platform, TZS 31M" },
  { id: "au-07", actorId: "u-ops", action: "Signed off incident", entity: "safety_incidents", entityId: "inc-02", createdAt: "2026-11-17T09:30:00Z", detail: "Mwanza — hand laceration resolved" },
  { id: "au-08", actorId: "u-pm2", action: "Updated programme", entity: "phases", entityId: "p-mwanza-ph1", createdAt: "2026-11-20T17:05:00Z", detail: "Marine piling re-sequenced, +5 days" },
];

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */
export const profileById = (id: string): Profile | undefined =>
  profiles.find((profile) => profile.id === id);

export const clientProfiles = profiles.filter((profile) => profile.role === "client");
export const staffProfiles = profiles.filter((profile) => profile.role !== "client");
