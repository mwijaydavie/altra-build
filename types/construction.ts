/**
 * ALTRA COMMAND — domain types.
 *
 * These interfaces mirror the Postgres tables in `supabase/schema.sql` one-to-one
 * (snake_case in SQL, camelCase here). The API boundary in `lib/ops/store.ts`
 * returns these shapes from either the seeded local repository or Supabase —
 * the UI never talks to the database directly.
 */

/* ------------------------------------------------------------------ */
/* Enums (mirrored as Postgres enum types)                             */
/* ------------------------------------------------------------------ */
export type Role = "executive" | "pm" | "engineer" | "client";

export type ProjectStatus = "pre-con" | "active" | "on-hold" | "handover";

export type PhaseStatus = "not-started" | "in-progress" | "complete" | "blocked";

export type TaskStatus = "backlog" | "in-progress" | "review" | "done";

export type TaskPriority = "low" | "medium" | "high" | "critical";

export type IncidentType = "near-miss" | "minor" | "severe" | "routine-check";

export type IncidentSeverity = "low" | "medium" | "high" | "critical";

export type IncidentStatus = "open" | "under-review" | "resolved";

export type RequisitionStatus = "pending" | "approved" | "rejected" | "delivered";

export type MaterialCategory = "structural" | "electrical" | "plumbing" | "finishing";

export type RfiStatus = "open" | "answered" | "pending-approval" | "closed";

export type InvoiceStatus = "draft" | "submitted" | "due" | "paid" | "overdue";

export type WeatherCondition =
  | "clear"
  | "cloudy"
  | "light-rain"
  | "heavy-rain"
  | "windy"
  | "extreme-heat";

export type AlertSeverity = "info" | "warning" | "critical";

export type SosStatus = "broadcast" | "acknowledged" | "resolved";

/* ------------------------------------------------------------------ */
/* Core entities                                                       */
/* ------------------------------------------------------------------ */
export interface Profile {
  id: string;
  fullName: string;
  email: string;
  role: Role;
  phone: string;
  avatarUrl: string | null;
  title: string;
  /** Projects the user is a member of (drives PM/engineer RLS). */
  projectIds: string[];
  createdAt: string;
}

export interface Project {
  id: string;
  projectCode: string;
  name: string;
  clientName: string;
  clientId: string;
  division: string;
  status: ProjectStatus;
  budgetTotal: number;
  budgetSpent: number;
  startDate: string;
  targetDate: string;
  /** Lead PM (profile id). */
  pmId: string;
  lat: number;
  lng: number;
  weatherLocation: string;
  address: string;
  workforce: number;
  safeManHours: number;
  scheduleVarianceDays: number;
  openRfis: number;
  openIncidents: number;
  cover: string;
  summary: string;
}

export interface Phase {
  id: string;
  projectId: string;
  name: "Foundation" | "Superstructure" | "MEP" | "Envelope" | "Fit-out";
  startDate: string;
  endDate: string;
  progress: number;
  status: PhaseStatus;
  weight: number;
}

export interface Task {
  id: string;
  projectId: string;
  title: string;
  phase: string;
  status: TaskStatus;
  priority: TaskPriority;
  assigneeId: string;
  dueDate: string;
  trade: string;
  blockedReason?: string;
}

export interface ManpowerEntry {
  trade: string;
  count: number;
}

export interface DailySiteLog {
  id: string;
  projectId: string;
  createdBy: string;
  logDate: string;
  weather: WeatherCondition;
  temperatureC: number;
  manpower: ManpowerEntry[];
  manpowerTotal: number;
  workCompleted: string;
  delays: string;
  photos: LogPhoto[];
  createdAt: string;
  syncedFromField: boolean;
}

export interface LogPhoto {
  id: string;
  dataUrl: string;
  capturedAt: string;
  lat: number;
  lng: number;
  watermark: string;
}

export interface SafetyIncident {
  id: string;
  projectId: string;
  inspectorId: string;
  type: IncidentType;
  severity: IncidentSeverity;
  title: string;
  description: string;
  correctiveAction: string;
  status: IncidentStatus;
  occurredAt: string;
  signedOffAt: string | null;
  signedOffBy: string | null;
  photos: string[];
}

export interface Requisition {
  id: string;
  projectId: string;
  requestedBy: string;
  itemName: string;
  category: MaterialCategory;
  quantityRequested: number;
  unit: string;
  estimatedCost: number;
  approvalStatus: RequisitionStatus;
  deliveryTrackingCode: string | null;
  requiredBy: string;
  supplier: string;
  createdAt: string;
}

export interface InventoryItem {
  id: string;
  sku: string;
  itemName: string;
  category: MaterialCategory;
  unit: string;
  stockLevel: number;
  reorderPoint: number;
  unitCost: number;
  warehouse: string;
  lastCountedAt: string;
}

export interface Rfi {
  id: string;
  projectId: string;
  rfiNumber: string;
  title: string;
  description: string;
  raisedBy: string;
  costImpact: number;
  scheduleImpactDays: number;
  architectResponse: string | null;
  status: RfiStatus;
  isChangeOrder: boolean;
  createdAt: string;
  approvedAt: string | null;
  approvedBy: string | null;
}

export interface Invoice {
  id: string;
  projectId: string;
  invoiceNumber: string;
  milestone: string;
  amount: number;
  issuedAt: string;
  dueAt: string;
  status: InvoiceStatus;
  paidAt: string | null;
}

export interface DocumentItem {
  id: string;
  projectId: string;
  name: string;
  category: "drawing" | "specification" | "certificate" | "report" | "contract";
  revision: string;
  fileSize: string;
  uploadedBy: string;
  uploadedAt: string;
  status: "current" | "superseded" | "for-review";
}

export interface MonthlyFinancial {
  month: string;
  outflow: number;
  billing: number;
  forecast: number;
}

export interface SiteAlert {
  id: string;
  projectId: string;
  severity: AlertSeverity;
  title: string;
  detail: string;
  createdAt: string;
  acknowledged: boolean;
  kind: "safety" | "procurement" | "schedule" | "sos";
}

export interface SafetyChecklistItem {
  id: string;
  clause: string;
  requirement: string;
  standard: "ISO 45001" | "OSHA" | "Company";
  status: "compliant" | "action-required" | "overdue";
  owner: string;
  lastAudited: string;
}

export interface AuditEntry {
  id: string;
  actorId: string;
  action: string;
  entity: string;
  entityId: string;
  createdAt: string;
  detail: string;
}

/* ------------------------------------------------------------------ */
/* API / derived shapes                                                */
/* ------------------------------------------------------------------ */
export type TrafficLight = "green" | "amber" | "red";

export interface PortfolioMetrics {
  /** Capital deployed against total portfolio budget (TZS). */
  capitalDeployed: number;
  capitalBudget: number;
  capitalUtilisation: number;
  activeSites: number;
  totalSites: number;
  liveWorkforce: number;
  safeManHours: number;
  ltiMonths: number;
  trir: number;
  /** Projects carrying a positive critical-path variance. */
  delayedCritical: number;
  worstDelayDays: number;
  openRfis: number;
  openIncidents: number;
  pendingApprovals: number;
}

export interface ProjectSummary extends Project {
  completion: number;
  trafficLight: TrafficLight;
  manager: string;
  openTasks: number;
  nextMilestone: string;
  nextMilestoneDate: string;
  phaseProgress: { name: string; progress: number }[];
}

export interface Milestone {
  id: string;
  name: string;
  dueDate: string;
  status: "planned" | "on-track" | "at-risk" | "complete";
}

export interface ProjectFinancials {
  budget: number;
  spent: number;
  certified: number;
  outstanding: number;
  invoices: Invoice[];
  series: MonthlyFinancial[];
  costBreakdown: { label: string; value: number }[];
}

export interface ProjectDetail {
  project: ProjectSummary;
  phases: Phase[];
  tasks: Task[];
  logs: DailySiteLog[];
  rfis: Rfi[];
  invoices: Invoice[];
  documents: DocumentItem[];
  milestones: Milestone[];
  team: Profile[];
}

export interface LogFeedRow {
  id: string;
  projectId: string;
  projectName: string;
  logDate: string;
  manpowerTotal: number;
  weather: WeatherCondition;
  author: string;
}

export interface DashboardSnapshot {
  metrics: PortfolioMetrics;
  financials: MonthlyFinancial[];
  projects: ProjectSummary[];
  alerts: SiteAlert[];
  recentLogs: LogFeedRow[];
  audit: AuditEntry[];
  generatedAt: string;
}

export interface OpsSnapshot {
  role: Role;
  viewer: Profile;
  metrics: PortfolioMetrics;
  projects: ProjectSummary[];
  financials: MonthlyFinancial[];
  alerts: SiteAlert[];
  logs: DailySiteLog[];
  incidents: SafetyIncident[];
  requisitions: Requisition[];
  inventory: InventoryItem[];
  rfis: Rfi[];
  invoices: Invoice[];
  documents: DocumentItem[];
  tasks: Task[];
  phases: Phase[];
  checklist: SafetyChecklistItem[];
  audit: AuditEntry[];
  users: Pick<Profile, "id" | "fullName" | "role" | "title">[];
  generatedAt: string;
}

export interface NewLogInput {
  projectId: string;
  weather: WeatherCondition;
  temperatureC: number;
  manpower: ManpowerEntry[];
  workCompleted: string;
  delays: string;
  photos: LogPhoto[];
  logDate: string;
  syncedFromField: boolean;
}

export interface NewIncidentInput {
  projectId: string;
  type: IncidentType;
  severity: IncidentSeverity;
  title: string;
  description: string;
  correctiveAction: string;
}

export interface NewRequisitionInput {
  projectId: string;
  itemName: string;
  category: MaterialCategory;
  quantityRequested: number;
  unit: string;
  estimatedCost: number;
  requiredBy: string;
  supplier: string;
}

export interface SosInput {
  projectId: string;
  message: string;
  lat: number;
  lng: number;
}

export interface RfiDecisionInput {
  id: string;
  decision: "approved" | "rejected";
  note?: string;
}

export interface TaskMoveInput {
  id: string;
  status: TaskStatus;
}

export interface IncidentUpdateInput {
  id: string;
  status: IncidentStatus;
  correctiveAction?: string;
}

export interface RequisitionUpdateInput {
  id: string;
  approvalStatus: RequisitionStatus;
}

export type ApiError = { error: string; detail?: string };
