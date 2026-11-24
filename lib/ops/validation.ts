import { z } from "zod";

// Our CSP forbids eval; disable Zod's JIT probe so it never trips a
// `securitypolicyviolation` (the probe is caught, but Chrome still reports it).
z.config({ jitless: true });

const weather = z.enum(["clear", "cloudy", "light-rain", "heavy-rain", "windy", "extreme-heat"]);
const category = z.enum(["structural", "electrical", "plumbing", "finishing"]);
const severity = z.enum(["low", "medium", "high", "critical"]);
const incidentType = z.enum(["near-miss", "minor", "severe", "routine-check"]);

export const logPhotoSchema = z.object({
  id: z.string().min(1),
  dataUrl: z.string().min(1).max(4_000_000),
  capturedAt: z.string().min(1),
  lat: z.number(),
  lng: z.number(),
  watermark: z.string().min(1),
});

export const newLogSchema = z.object({
  projectId: z.string().min(1),
  logDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  weather,
  temperatureC: z.number().min(-10).max(60),
  manpower: z
    .array(z.object({ trade: z.string().min(1).max(60), count: z.number().int().min(0).max(5000) }))
    .min(1)
    .max(24),
  workCompleted: z.string().min(8).max(4000),
  delays: z.string().max(4000).default(""),
  photos: z.array(logPhotoSchema).max(8).default([]),
  syncedFromField: z.boolean().default(true),
  clientUuid: z.string().min(1).max(80).optional(),
});

export const newIncidentSchema = z.object({
  projectId: z.string().min(1),
  type: incidentType,
  severity,
  title: z.string().min(6).max(160),
  description: z.string().min(12).max(4000),
  correctiveAction: z.string().max(4000).default(""),
  occurredAt: z.string().min(1).optional(),
  photos: z.array(z.string()).max(8).default([]),
  clientUuid: z.string().min(1).max(80).optional(),
});

export const incidentUpdateSchema = z.object({
  id: z.string().min(1),
  status: z.enum(["open", "under-review", "resolved"]),
  correctiveAction: z.string().max(4000).optional(),
});

export const newRequisitionSchema = z.object({
  projectId: z.string().min(1),
  itemName: z.string().min(3).max(160),
  category,
  quantityRequested: z.number().positive().max(1_000_000),
  unit: z.string().min(1).max(24),
  estimatedCost: z.number().min(0).max(1_000_000_000_000),
  requiredBy: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  supplier: z.string().min(2).max(160),
});

export const requisitionDecisionSchema = z.object({
  id: z.string().min(1),
  approvalStatus: z.enum(["approved", "rejected", "delivered"]),
});

export const newRfiSchema = z.object({
  projectId: z.string().min(1),
  title: z.string().min(6).max(160),
  description: z.string().min(12).max(4000),
  isChangeOrder: z.boolean().default(false),
  costImpact: z.number().min(0).max(1_000_000_000_000).default(0),
  scheduleImpactDays: z.number().int().min(-90).max(365).default(0),
});

export const rfiDecisionSchema = z.object({
  decision: z.enum(["approved", "rejected"]),
  note: z.string().max(2000).optional(),
});

export const taskMoveSchema = z.object({
  id: z.string().min(1),
  status: z.enum(["backlog", "in-progress", "review", "done"]),
});

export const sosSchema = z.object({
  projectId: z.string().min(1),
  message: z.string().min(4).max(500),
  lat: z.number().min(-90).max(90).nullable().optional(),
  lng: z.number().min(-180).max(180).nullable().optional(),
});

export const sessionSchema = z.object({
  role: z.enum(["executive", "pm", "engineer", "client"]).optional(),
  userId: z.string().min(1).optional(),
});

export const syncBatchSchema = z.object({
  logs: z.array(newLogSchema).max(50).default([]),
  incidents: z.array(newIncidentSchema).max(50).default([]),
});

export type NewLogPayload = z.infer<typeof newLogSchema>;
export type NewIncidentPayload = z.infer<typeof newIncidentSchema>;
export type NewRequisitionPayload = z.infer<typeof newRequisitionSchema>;
export type NewRfiPayload = z.infer<typeof newRfiSchema>;
