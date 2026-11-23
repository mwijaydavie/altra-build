"use client";

import { AlertTriangle, Loader2, MapPin, PhoneCall, ShieldAlert } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { useSos } from "@/lib/ops/hooks";
import { cn } from "@/lib/utils";

const REASONS = [
  "Structural concern",
  "Fire / smoke",
  "Medical emergency",
  "Crane / lifting",
  "Electrical",
  "Unauthorised access",
];

const HOLD_MS = 1400;

export function SosPanel({
  projectId,
  projectName,
  online,
  fallbackCoords,
}: {
  projectId: string;
  projectName: string;
  online: boolean;
  fallbackCoords: { lat: number; lng: number };
}) {
  const sos = useSos();
  const [reason, setReason] = useState<string | null>(null);
  const [note, setNote] = useState("");
  const [holding, setHolding] = useState(false);
  const [progress, setProgress] = useState(0);
  const [geo, setGeo] = useState<{ lat: number; lng: number } | null>(null);
  const [result, setResult] = useState<{ recipients: number; channels: string[] } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const timer = useRef<number | null>(null);
  const startedAt = useRef<number>(0);

  useEffect(() => {
    if (typeof navigator === "undefined" || !navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      (position) => setGeo({ lat: position.coords.latitude, lng: position.coords.longitude }),
      () => setGeo(fallbackCoords),
      { enableHighAccuracy: true, timeout: 4000, maximumAge: 60_000 },
    );
  }, [fallbackCoords]);

  useEffect(
    () => () => {
      if (timer.current) window.clearInterval(timer.current);
    },
    [],
  );

  const fire = () => {
    setError(null);
    setResult(null);
    if (!reason) {
      setError("Choose what is happening before broadcasting.");
      return;
    }
    if (!online) {
      setError("No data signal. Call site control now on the number below — the SMS fallback is armed on this device.");
      return;
    }
    const coords = geo ?? fallbackCoords;
    sos.mutate(
      { projectId, message: `${reason}${note.trim() ? ` — ${note.trim()}` : ""}`, lat: coords.lat, lng: coords.lng },
      {
        onSuccess: (data) => setResult(data.broadcast),
        onError: (mutationError: Error) => setError(mutationError.message),
      },
    );
  };

  const beginHold = () => {
    if (holding) return;
    setHolding(true);
    startedAt.current = Date.now();
    timer.current = window.setInterval(() => {
      const elapsed = Date.now() - startedAt.current;
      const ratio = Math.min(elapsed / HOLD_MS, 1);
      setProgress(ratio * 100);
      if (ratio >= 1) {
        if (timer.current) window.clearInterval(timer.current);
        timer.current = null;
        setHolding(false);
        setProgress(0);
        fire();
      }
    }, 40);
  };

  const endHold = () => {
    if (timer.current) window.clearInterval(timer.current);
    timer.current = null;
    setHolding(false);
    setProgress(0);
  };

  return (
    <div className="space-y-4">
      <div className="border border-[#F26D5B]/30 bg-[#F26D5B]/[0.06] p-3">
        <div className="flex items-start gap-2">
          <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0 text-[#F26D5B]" />
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#F26D5B]">Safety stop</p>
            <p className="mt-1 text-[12px] leading-relaxed text-paper/60">
              Broadcast halts work at {projectName}. Site control, the safety director and the project manager are paged
              immediately. Use only for a genuine stop-work condition.
            </p>
          </div>
        </div>
      </div>

      <section className="border border-paper/12 bg-[#14161E] p-3">
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-paper/40">What is happening?</p>
        <div className="mt-2 grid grid-cols-2 gap-2">
          {REASONS.map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => setReason(option)}
              aria-pressed={reason === option}
              className={cn(
                "min-h-12 border px-2 text-[12px] transition-colors",
                reason === option
                  ? "border-[#F26D5B]/70 bg-[#F26D5B]/15 text-[#F26D5B]"
                  : "border-paper/15 text-paper/60 active:bg-paper/10",
              )}
            >
              {option}
            </button>
          ))}
        </div>
        <input
          value={note}
          onChange={(event) => setNote(event.target.value)}
          placeholder="Add detail (optional)"
          className="mt-2 h-11 w-full border border-paper/12 bg-[#0F1117] px-3 text-[12.5px] text-paper placeholder:text-paper/25 focus:border-[#F26D5B]/60 focus:outline-none"
        />
        <p className="mt-2 flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.1em] text-paper/35">
          <MapPin className="h-3 w-3" />
          {geo ? `${geo.lat.toFixed(5)}, ${geo.lng.toFixed(5)}` : "Acquiring GPS fix…"}
        </p>
      </section>

      <div className="relative">
        <span className="pointer-events-none absolute inset-0 flex items-center justify-center" aria-hidden="true">
          <span className={cn("h-32 w-32 rounded-full border border-[#F26D5B]/40", holding && "radar-ring")} />
        </span>
        <button
          type="button"
          onPointerDown={beginHold}
          onPointerUp={endHold}
          onPointerLeave={endHold}
          onKeyDown={(event) => {
            if (event.key === " " || event.key === "Enter") {
              event.preventDefault();
              beginHold();
            }
          }}
          onKeyUp={(event) => {
            if (event.key === " " || event.key === "Enter") {
              event.preventDefault();
              endHold();
            }
          }}
          disabled={sos.isPending}
          className="relative flex min-h-[168px] w-full flex-col items-center justify-center gap-2 overflow-hidden border-2 border-[#F26D5B] bg-[#F26D5B]/15 text-[#F26D5B] transition-colors active:bg-[#F26D5B]/25 disabled:opacity-60"
          aria-label="Press and hold to broadcast a safety stop"
        >
          <span
            className="absolute inset-0 origin-left bg-[#F26D5B]/25 transition-[width] duration-75"
            style={{ width: `${progress}%` }}
            aria-hidden="true"
          />
          {sos.isPending ? (
            <Loader2 className="h-8 w-8 animate-spin" />
          ) : (
            <AlertTriangle className="h-9 w-9" strokeWidth={1.6} />
          )}
          <span className="font-display text-[17px] font-semibold uppercase tracking-[0.08em]">
            {holding ? "Keep holding…" : "Hold to broadcast SOS"}
          </span>
          <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-paper/40">
            {HOLD_MS / 1000}s hold · all sites notified
          </span>
        </button>
      </div>

      {error ? (
        <p className="border border-[#F26D5B]/40 bg-[#F26D5B]/10 px-3 py-2 text-[12px] leading-snug text-[#F26D5B]" role="alert">
          {error}
        </p>
      ) : null}

      {result ? (
        <div className="border border-[#6FD3A6]/40 bg-[#6FD3A6]/10 px-3 py-3">
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#6FD3A6]">Broadcast live</p>
          <p className="mt-1 text-[12.5px] text-paper/70">
            {result.recipients} recipients paged via {result.channels.join(" · ")}. Site control acknowledged the stop in
            the command centre. Do not resume work until the all-clear is issued.
          </p>
        </div>
      ) : null}

      <section className="border border-paper/12 bg-[#14161E] p-3">
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-paper/40">Call directly</p>
        <div className="mt-2 space-y-1.5">
          {[
            { label: "Site control", number: "+255222550148" },
            { label: "Safety director", number: "+255754441902" },
          ].map((contact) => (
            <a
              key={contact.label}
              href={`tel:${contact.number}`}
              className="flex min-h-12 items-center justify-between border border-paper/15 px-3 text-paper/70 active:bg-paper/10"
            >
              <span className="text-[12.5px]">{contact.label}</span>
              <span className="flex items-center gap-2 font-mono text-[10px] tracking-[0.06em] text-gold">
                <PhoneCall className="h-3.5 w-3.5" /> {contact.number.replace(/(\+\d{3})(\d{3})(\d{3})(\d{3})/, "$1 $2 $3 $4")}
              </span>
            </a>
          ))}
        </div>
      </section>
    </div>
  );
}
