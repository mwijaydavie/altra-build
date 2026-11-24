"use client";

import { Check, ShieldAlert, WifiOff } from "lucide-react";
import { useState } from "react";

import { enqueue, newClientUuid, type QueueItem } from "@/lib/field/queue";
import { useCreateIncident } from "@/lib/ops/hooks";
import { cn } from "@/lib/utils";

const TYPES = [
  { id: "near-miss", label: "Near miss" },
  { id: "minor", label: "Minor injury" },
  { id: "severe", label: "Severe" },
  { id: "routine-check", label: "Inspection" },
] as const;

const SEVERITIES = [
  { id: "low", label: "Low" },
  { id: "medium", label: "Medium" },
  { id: "high", label: "High" },
  { id: "critical", label: "Critical" },
] as const;

export function QuickIncidentForm({
  projectId,
  projectName,
  online,
  onQueued,
}: {
  projectId: string;
  projectName: string;
  online: boolean;
  onQueued: (items: QueueItem[]) => void;
}) {
  const createIncident = useCreateIncident();
  const [type, setType] = useState<(typeof TYPES)[number]["id"]>("near-miss");
  const [severity, setSeverity] = useState<(typeof SEVERITIES)[number]["id"]>("medium");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [action, setAction] = useState("");
  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const submit = async () => {
    setError(null);
    setStatus(null);
    if (title.trim().length < 6) {
      setError("Give the finding a short title (at least 6 characters).");
      return;
    }
    if (description.trim().length < 12) {
      setError("Describe what happened so the HSE team can act on it.");
      return;
    }

    setSubmitting(true);
    const clientUuid = newClientUuid();
    const payload = {
      projectId,
      type,
      severity,
      title: title.trim(),
      description: description.trim(),
      correctiveAction: action.trim(),
      occurredAt: new Date().toISOString(),
    };

    const queueIt = async () => {
      const items = await enqueue({
        kind: "incident",
        queueId: clientUuid,
        queuedAt: new Date().toISOString(),
        payload: { ...payload, clientUuid },
      });
      onQueued(items);
      setStatus("Saved offline — HSE will receive it on the next sync.");
      setTitle("");
      setDescription("");
      setAction("");
      setSubmitting(false);
    };

    if (!online) {
      await queueIt();
      return;
    }

    createIncident.mutate(
      { ...payload, type: payload.type, severity: payload.severity },
      {
        onSuccess: () => {
          setStatus(`Recorded for ${projectName}. The HSE lead has been notified.`);
          setTitle("");
          setDescription("");
          setAction("");
          setSubmitting(false);
        },
        onError: () => void queueIt(),
      },
    );
  };

  return (
    <div className="space-y-4">
      {status ? (
        <p className="flex items-start gap-2 border border-[#6FD3A6]/40 bg-[#6FD3A6]/10 px-3 py-2 text-[12.5px] leading-snug text-[#6FD3A6]" role="status">
          <Check className="mt-0.5 h-4 w-4 shrink-0" /> {status}
        </p>
      ) : null}
      {error ? (
        <p className="border border-[#F26D5B]/40 bg-[#F26D5B]/10 px-3 py-2 text-[12.5px] leading-snug text-[#F26D5B]" role="alert">
          {error}
        </p>
      ) : null}

      <section className="border border-paper/12 bg-[var(--ops-panel-2)] p-3">
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-gold">Observation type</p>
        <div className="mt-2 grid grid-cols-2 gap-2">
          {TYPES.map((option) => (
            <button
              key={option.id}
              type="button"
              onClick={() => setType(option.id)}
              aria-pressed={type === option.id}
              className={cn(
                "min-h-12 border px-2 text-[12px] transition-colors",
                type === option.id
                  ? "border-gold bg-gold/15 text-gold"
                  : "border-paper/15 text-paper/60 active:bg-paper/10",
              )}
            >
              {option.label}
            </button>
          ))}
        </div>

        <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.2em] text-gold">Severity</p>
        <div className="mt-2 grid grid-cols-4 gap-1.5">
          {SEVERITIES.map((option) => (
            <button
              key={option.id}
              type="button"
              onClick={() => setSeverity(option.id)}
              aria-pressed={severity === option.id}
              className={cn(
                "min-h-11 border font-mono text-[9.5px] uppercase tracking-[0.06em] transition-colors",
                severity === option.id
                  ? option.id === "critical" || option.id === "high"
                    ? "border-[#F26D5B]/60 bg-[#F26D5B]/15 text-[#F26D5B]"
                    : "border-gold bg-gold/15 text-gold"
                  : "border-paper/15 text-paper/55 active:bg-paper/10",
              )}
            >
              {option.label}
            </button>
          ))}
        </div>
      </section>

      <section className="border border-paper/12 bg-[var(--ops-panel-2)] p-3">
        <label className="font-mono text-[10px] uppercase tracking-[0.2em] text-gold" htmlFor="incident-title">
          What did you find?
        </label>
        <input
          id="incident-title"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          placeholder="e.g. Scaffold tag missing at Block C"
          className="mt-2 h-12 w-full border border-paper/15 bg-[var(--ops-field)] px-3 text-[13px] text-paper placeholder:text-paper/55 focus:border-gold/60 focus:outline-none"
        />
        <textarea
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          rows={3}
          placeholder="Describe the hazard, who is exposed and the immediate control applied…"
          className="mt-2 w-full resize-y border border-paper/15 bg-[var(--ops-field)] px-3 py-2.5 text-[13px] leading-relaxed text-paper placeholder:text-paper/55 focus:border-gold/60 focus:outline-none"
        />
        <input
          value={action}
          onChange={(event) => setAction(event.target.value)}
          placeholder="Corrective action (optional)"
          className="mt-2 h-12 w-full border border-paper/12 bg-[var(--ops-field)] px-3 text-[12.5px] text-paper placeholder:text-paper/55 focus:border-gold/60 focus:outline-none"
        />
      </section>

      <button
        type="button"
        onClick={() => void submit()}
        disabled={submitting}
        className="flex min-h-14 w-full items-center justify-center gap-2 border border-gold bg-gold px-4 font-mono text-[12px] font-semibold uppercase tracking-[0.16em] text-ink active:bg-gold-soft disabled:opacity-60"
      >
        {submitting ? "Recording…" : online ? (
          <>
            <ShieldAlert className="h-4 w-4" /> Record observation
          </>
        ) : (
          <>
            <WifiOff className="h-4 w-4" /> Save offline
          </>
        )}
      </button>
      <p className="text-center font-mono text-[10px] uppercase leading-relaxed tracking-[0.1em] text-paper/55">
        Severe incidents page the safety director immediately
      </p>
    </div>
  );
}
