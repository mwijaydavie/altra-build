/**
 * ALTRA COMMAND — in-memory operational repository.
 *
 * Mirrors `supabase/schema.sql` and serves the same read models the
 * Supabase-backed queries return, so the UI works without a live database
 * (demo mode) and swaps to SQL with `NEXT_PUBLIC_SUPABASE_URL` configured.
 */
import {
  alerts,
  audit,
  dailySiteLogs,
  documents,
  financials,
  inventory,
  invoices,
  phases,
  profileById,
  profiles,
  projects,
  requisitions,
  rfis,
  safetyChecklist,
  safetyIncidents,
  tasks,
} from "@/data/opsData";
import type {
  AuditEntry,
  DashboardSnapshot,
  DailySiteLog,
  InventoryItem,
  Invoice,
  Milestone,
  MonthlyFinancial,
  OpsSnapshot,
  Phase,
  PortfolioMetrics,
  Profile,
  Project,
  ProjectDetail,
  ProjectFinancials,
  ProjectStatus,
  ProjectSummary,
  Requisition,
  Rfi,
  SafetyChecklistItem,
  SafetyIncident,
  SiteAlert,
  Task,
} from "@/types/construction";

const TODAY = "2026-11-23";

/* ------------------------------------------------------------------ */
/* Derived metrics                                                     */
/* ------------------------------------------------------------------ */
const sum = (values: number[]): number => values.reduce((total, value) => total + value, 0);

const byProject = <T extends { projectId: string }>(rows: T[], projectId: string): T[] =>
  rows.filter((row) => row.projectId === projectId);

export const portfolioMetrics: PortfolioMetrics = (() => {
  const active = projects.filter((project) => project.status === "active");
  const totalBudget = sum(projects.map((project) => project.budgetTotal));
  const totalDeployed = sum(projects.map((project) => project.budgetSpent));
  const workforce = sum(active.map((project) => project.workforce));
  const safeManHours = sum(projects.map((project) => project.safeManHours));
  const delayed = projects.filter((project) => project.scheduleVarianceDays > 0);

  return {
    capitalDeployed: totalDeployed,
    capitalBudget: totalBudget,
    capitalUtilisation: totalDeployed / totalBudget,
    activeSites: active.length,
    totalSites: projects.length,
    liveWorkforce: workforce,
    safeManHours,
    ltiMonths: 26,
    trir: 0,
    delayedCritical: delayed.length,
    worstDelayDays: Math.max(...projects.map((project) => project.scheduleVarianceDays)),
    openRfis: sum(projects.map((project) => project.openRfis)),
    openIncidents: safetyIncidents.filter((incident) => incident.status !== "resolved").length,
    pendingApprovals:
      rfis.filter((rfi) => rfi.status === "pending-approval").length +
      requisitions.filter((requisition) => requisition.approvalStatus === "pending").length,
  };
})();

const trafficLight = (project: Project): "green" | "amber" | "red" => {
  if (project.status === "on-hold") return "red";
  if (project.status === "pre-con") return "amber";
  if (project.scheduleVarianceDays >= 10 || project.openIncidents >= 2) return "red";
  if (project.scheduleVarianceDays > 0 || project.openIncidents > 0) return "amber";
  return "green";
};

export const projectSummaries: ProjectSummary[] = projects.map((project) => {
  const projectPhases = byProject(phases, project.id);
  const completion = sum(projectPhases.map((phase) => phase.progress * phase.weight));
  const upcoming = projectPhases.find((phase) => phase.status === "in-progress") ?? projectPhases.find((phase) => phase.status === "not-started");
  return {
    ...project,
    completion: Math.round(completion),
    trafficLight: trafficLight(project as Project),
    manager: profileById(project.pmId)?.fullName ?? "Unassigned",
    openTasks: tasks.filter((task) => task.projectId === project.id && task.status !== "done").length,
    nextMilestone:
      upcoming?.name ?? (project.status === "pre-con" ? "Mobilisation" : "Close-out"),
    nextMilestoneDate: upcoming?.endDate ?? project.targetDate,
    phaseProgress: projectPhases.map((phase) => ({ name: phase.name, progress: phase.progress })),
  };
});

export const metricsForProjects = (rows: ProjectSummary[]): PortfolioMetrics => {
  const ids = new Set(rows.map((project) => project.id));
  const scopedIncidents = safetyIncidents.filter((incident) => ids.has(incident.projectId));
  const active = rows.filter((project) => project.status === "active");
  const delayed = rows.filter((project) => project.scheduleVarianceDays > 0);
  const capitalDeployed = sum(rows.map((project) => project.budgetSpent));
  const capitalBudget = sum(rows.map((project) => project.budgetTotal));

  return {
    capitalDeployed,
    capitalBudget,
    capitalUtilisation: capitalBudget === 0 ? 0 : capitalDeployed / capitalBudget,
    activeSites: active.length,
    totalSites: rows.length,
    liveWorkforce: sum(active.map((project) => project.workforce)),
    safeManHours: sum(rows.map((project) => project.safeManHours)),
    ltiMonths: 26,
    trir: 0,
    delayedCritical: delayed.length,
    worstDelayDays: rows.length ? Math.max(...rows.map((project) => project.scheduleVarianceDays)) : 0,
    openRfis: sum(rows.map((project) => project.openRfis)),
    openIncidents: scopedIncidents.filter((incident) => incident.status !== "resolved").length,
    pendingApprovals: rfis.filter((rfi) => ids.has(rfi.projectId) && rfi.status === "pending-approval").length,
  };
};

export const dashboardSnapshot: DashboardSnapshot = {
  metrics: portfolioMetrics,
  financials,
  projects: projectSummaries,
  alerts,
  recentLogs: dailySiteLogs.slice(0, 6).map((entry) => ({
    id: entry.id,
    projectId: entry.projectId,
    projectName: projects.find((project) => project.id === entry.projectId)?.name ?? "Unknown site",
    logDate: entry.logDate,
    manpowerTotal: entry.manpowerTotal,
    weather: entry.weather,
    author: profileById(entry.createdBy)?.fullName ?? "Field team",
  })),
  audit: audit.slice(0, 6),
  generatedAt: new Date().toISOString(),
};

/* ------------------------------------------------------------------ */
/* Project detail                                                      */
/* ------------------------------------------------------------------ */
export const milestonesFor = (projectId: string): Milestone[] => {
  const projectPhases = byProject(phases, projectId).filter(
    (phase) => phase.status === "in-progress" || phase.status === "blocked" || phase.status === "not-started",
  );
  return projectPhases.slice(0, 3).map((phase) => ({
    id: `ms-${phase.id}`,
    name: `${phase.name} completion`,
    dueDate: phase.endDate,
    status: phase.status === "blocked" ? "at-risk" : phase.progress > 0 ? "on-track" : "planned",
  }));
};

export const projectFinancials = (projectId: string): ProjectFinancials => {
  const project = projects.find((entry) => entry.id === projectId);
  const projectInvoices = byProject(invoices, projectId);
  const certified = sum(projectInvoices.filter((invoice) => invoice.status === "paid").map((invoice) => invoice.amount));
  const outstanding = sum(
    projectInvoices.filter((invoice) => invoice.status !== "paid").map((invoice) => invoice.amount),
  );
  return {
    budget: project?.budgetTotal ?? 0,
    spent: project?.budgetSpent ?? 0,
    certified,
    outstanding,
    invoices: projectInvoices,
    series: financials,
    costBreakdown: [
      { label: "Materials", value: 0.42 },
      { label: "Labour & subcontract", value: 0.31 },
      { label: "Plant & logistics", value: 0.16 },
      { label: "Preliminaries & risk", value: 0.11 },
    ],
  };
};

export const projectDetail = (projectId: string): ProjectDetail | null => {
  const summary = projectSummaries.find((project) => project.id === projectId);
  if (!summary) return null;
  return {
    project: summary,
    phases: byProject(phases, projectId),
    tasks: byProject(tasks, projectId),
    logs: byProject(dailySiteLogs, projectId),
    rfis: byProject(rfis, projectId),
    invoices: byProject(invoices, projectId),
    documents: byProject(documents, projectId),
    milestones: milestonesFor(projectId),
    team: profiles.filter((profile) => profile.projectIds.includes(projectId)),
  };
};

/* ------------------------------------------------------------------ */
/* Collection accessors used by the API routes                         */
/* ------------------------------------------------------------------ */
export const logFeed = (projectId?: string): DailySiteLog[] =>
  (projectId ? byProject(dailySiteLogs, projectId) : dailySiteLogs)
    .slice()
    .sort((a, b) => (a.logDate < b.logDate ? 1 : -1));

export const incidentFeed = (projectId?: string): SafetyIncident[] =>
  (projectId ? byProject(safetyIncidents, projectId) : safetyIncidents)
    .slice()
    .sort((a, b) => (a.occurredAt < b.occurredAt ? 1 : -1));

export const requisitionFeed = (projectId?: string): Requisition[] => {
  const rows = projectId ? byProject(requisitions, projectId) : requisitions;
  const rank: Record<Requisition["approvalStatus"], number> = {
    pending: 0,
    approved: 1,
    delivered: 2,
    rejected: 3,
  };
  return rows.slice().sort((a, b) => rank[a.approvalStatus] - rank[b.approvalStatus]);
};

export const rfiFeed = (projectId?: string): Rfi[] =>
  (projectId ? byProject(rfis, projectId) : rfis)
    .slice()
    .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));

export const taskFeed = (projectId?: string): Task[] =>
  projectId ? byProject(tasks, projectId) : tasks;

export const inventoryFeed = (): InventoryItem[] =>
  inventory
    .slice()
    .sort((a, b) => a.stockLevel / a.reorderPoint - b.stockLevel / b.reorderPoint);

export const checklistFeed = (): SafetyChecklistItem[] =>
  safetyChecklist.slice().sort((a, b) => a.clause.localeCompare(b.clause));

export const auditFeed = (): AuditEntry[] => audit.slice().sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));

/* ------------------------------------------------------------------ */
/* Mutations (demo mode — in-memory, audited)                          */
/* ------------------------------------------------------------------ */
let tick = 0;
const nextId = (prefix: string): string => {
  tick += 1;
  return `${prefix}-${Date.now().toString(36)}-${tick}`;
};

export const recordAudit = (input: {
  actorId: string;
  action: string;
  entity: string;
  entityId: string;
  detail: string;
}): AuditEntry => {
  const entry: AuditEntry = {
    id: nextId("au"),
    createdAt: new Date().toISOString(),
    ...input,
  };
  audit.unshift(entry);
  return entry;
};

export const createLog = (input: Omit<DailySiteLog, "id" | "createdAt" | "manpowerTotal" | "syncedFromField">): DailySiteLog => {
  const entry: DailySiteLog = {
    ...input,
    id: nextId("log"),
    createdAt: new Date().toISOString(),
    manpowerTotal: input.manpower.reduce((total, row) => total + row.count, 0),
    syncedFromField: true,
  };
  dailySiteLogs.unshift(entry);
  recordAudit({
    actorId: input.createdBy,
    action: "Submitted daily log",
    entity: "daily_site_logs",
    entityId: entry.id,
    detail: `${entry.manpowerTotal} workers · ${entry.weather.replace("-", " ")} ${entry.temperatureC}°C`,
  });
  return entry;
};

export const createIncident = (
  input: Omit<SafetyIncident, "id" | "status" | "signedOffAt" | "signedOffBy">,
): SafetyIncident => {
  const entry: SafetyIncident = { ...input, id: nextId("inc"), status: "open", signedOffAt: null, signedOffBy: null };
  safetyIncidents.unshift(entry);
  recordAudit({
    actorId: input.inspectorId,
    action: "Logged incident",
    entity: "safety_incidents",
    entityId: entry.id,
    detail: `${entry.title} (${entry.severity} severity)`,
  });
  return entry;
};

export const createRfi = (
  input: Omit<Rfi, "id" | "status" | "approvedAt" | "approvedBy" | "createdAt">,
): Rfi => {
  const entry: Rfi = {
    ...input,
    id: nextId("rfi"),
    status: "open",
    approvedAt: null,
    approvedBy: null,
    createdAt: new Date().toISOString(),
  };
  rfis.unshift(entry);
  recordAudit({
    actorId: input.raisedBy,
    action: "Raised RFI",
    entity: "rfis",
    entityId: entry.id,
    detail: `${entry.rfiNumber} — ${entry.title}`,
  });
  return entry;
};

export const approveChangeOrder = (rfiId: string, approverId: string): Rfi | null => {
  const entry = rfis.find((rfi) => rfi.id === rfiId);
  if (!entry || !entry.isChangeOrder) return null;
  entry.status = "closed";
  entry.approvedAt = new Date().toISOString();
  entry.approvedBy = approverId;
  recordAudit({
    actorId: approverId,
    action: "Approved change order",
    entity: "rfis",
    entityId: entry.id,
    detail: `${entry.rfiNumber} — TZS ${(entry.costImpact / 1_000_000).toFixed(1)}M, ${entry.scheduleImpactDays >= 0 ? "+" : ""}${entry.scheduleImpactDays}d`,
  });
  return entry;
};

export const decideRfi = (rfiId: string, decision: "approved" | "rejected", approverId: string): Rfi | null => {
  const entry = rfis.find((rfi) => rfi.id === rfiId);
  if (!entry) return null;
  if (decision === "approved") {
    entry.status = "answered";
    entry.architectResponse = entry.architectResponse ?? "Accepted by project director.";
  } else {
    entry.status = "closed";
    entry.architectResponse = "Declined — resubmit with consultant instruction.";
  }
  recordAudit({
    actorId: approverId,
    action: `${decision === "approved" ? "Approved" : "Declined"} RFI`,
    entity: "rfis",
    entityId: entry.id,
    detail: `${entry.rfiNumber} — ${entry.title}`,
  });
  return entry;
};

export const decideRequisition = (
  requisitionId: string,
  decision: "approved" | "rejected",
  approverId: string,
): Requisition | null => {
  const entry = requisitions.find((requisition) => requisition.id === requisitionId);
  if (!entry) return null;
  entry.approvalStatus = decision;
  recordAudit({
    actorId: approverId,
    action: `${decision === "approved" ? "Approved" : "Rejected"} requisition`,
    entity: "requisitions",
    entityId: entry.id,
    detail: `${entry.itemName} — ${entry.quantityRequested} ${entry.unit}`,
  });
  return entry;
};

export const moveTask = (taskId: string, status: Task["status"], actorId: string): Task | null => {
  const entry = tasks.find((task) => task.id === taskId);
  if (!entry) return null;
  entry.status = status;
  recordAudit({
    actorId,
    action: "Moved task",
    entity: "tasks",
    entityId: entry.id,
    detail: `${entry.title} → ${status}`,
  });
  return entry;
};

export const broadcastSos = (input: {
  projectId: string;
  actorId: string;
  reason: string;
  latitude: number | null;
  longitude: number | null;
}): SiteAlert => {
  const project = projects.find((entry) => entry.id === input.projectId);
  const alert: SiteAlert = {
    id: nextId("al"),
    projectId: input.projectId,
    severity: "critical",
    title: `SOS — safety stop at ${project?.name ?? "site"}`,
    detail: input.reason,
    createdAt: new Date().toISOString(),
    acknowledged: false,
    kind: "safety",
  };
  alerts.unshift(alert);
  recordAudit({
    actorId: input.actorId,
    action: "Broadcast SOS safety stop",
    entity: "site_alerts",
    entityId: alert.id,
    detail: `${alert.title}${input.latitude !== null ? ` @ ${input.latitude.toFixed(4)}, ${input.longitude?.toFixed(4)}` : ""}`,
  });
  return alert;
};

export const acknowledgeAlert = (alertId: string, actorId: string): SiteAlert | null => {
  const entry = alerts.find((alert) => alert.id === alertId);
  if (!entry) return null;
  entry.acknowledged = true;
  recordAudit({
    actorId,
    action: "Acknowledged alert",
    entity: "site_alerts",
    entityId: entry.id,
    detail: entry.title,
  });
  return entry;
};

/* ------------------------------------------------------------------ */
/* Scoping                                                             */
/* ------------------------------------------------------------------ */
export const projectsForRole = (role: Profile["role"], userId: string): ProjectSummary[] => {
  if (role === "executive") return projectSummaries;
  const profile = profileById(userId);
  if (!profile) return [];
  return projectSummaries.filter((project) => profile.projectIds.includes(project.id));
};

export const snapshotFor = (role: Profile["role"], userId: string): OpsSnapshot => {
  const visible = projectsForRole(role, userId);
  const visibleIds = new Set(visible.map((project) => project.id));
  const scoped = <T extends { projectId: string }>(rows: T[]): T[] =>
    rows.filter((row) => visibleIds.has(row.projectId));

  const viewer = profileById(userId) ?? profiles[0]!;
  const users = profiles.map((profile) => ({
    id: profile.id,
    fullName: profile.fullName,
    role: profile.role,
    title: profile.title,
  }));
  const clientVisible = visible.length ? visible : projectSummaries.slice(0, 1);
  const canAudit = role === "executive" || role === "pm";

  // Cash series are group-level; non-executives see the share allocated to
  // their own sites so portfolio treasury is not disclosed sideways.
  const totalSpent = sum(projectSummaries.map((project) => project.budgetSpent)) || 1;
  const visibleSpent = sum(visible.map((project) => project.budgetSpent));
  const share = role === "executive" ? 1 : visibleSpent / totalSpent;
  const financialScope = financials.map((row) => ({
    month: row.month,
    outflow: Math.round(row.outflow * share),
    billing: Math.round(row.billing * share),
    forecast: Math.round(row.forecast * share),
  }));

  if (role === "client") {
    return {
      role,
      viewer,
      metrics: metricsForProjects(clientVisible),
      projects: clientVisible,
      financials: financialScope,
      alerts: scoped(alerts),
      logs: scoped(logFeed()).slice(0, 8),
      incidents: scoped(incidentFeed()).filter((incident) => incident.status !== "open"),
      requisitions: [],
      inventory: [],
      rfis: scoped(rfiFeed()),
      invoices: scoped(invoiceFeed()),
      tasks: scoped(taskFeed()),
      phases: phases.filter((phase) => clientVisible.some((project) => project.id === phase.projectId)),
      documents: scoped(documents),
      checklist: [],
      audit: [],
      users,
      generatedAt: new Date().toISOString(),
    };
  }

  return {
    role,
    viewer,
    metrics: metricsForProjects(visible),
    projects: visible,
    financials: financialScope,
    alerts: scoped(alerts),
    logs: scoped(logFeed()),
    incidents: scoped(incidentFeed()),
    requisitions: scoped(requisitionFeed()),
    inventory: inventoryFeed(),
    rfis: scoped(rfiFeed()),
    invoices: scoped(invoiceFeed()),
    tasks: scoped(taskFeed()),
    phases: phases.filter((phase) => visibleIds.has(phase.projectId)),
    documents: scoped(documents),
    checklist: checklistFeed(),
    audit: canAudit ? auditFeed() : [],
    users,
    generatedAt: new Date().toISOString(),
  };
};

export const projectStatusLabel: Record<ProjectStatus, string> = {
  "pre-con": "Pre-construction",
  active: "Active",
  "on-hold": "On hold",
  handover: "Handover",
};

export const today = TODAY;
export const financialSeries = (): MonthlyFinancial[] => financials;
export const invoiceFeed = (projectId?: string): Invoice[] =>
  projectId ? byProject(invoices, projectId) : invoices;
