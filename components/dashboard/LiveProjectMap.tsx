"use client";

import Link from "next/link";
import { useState } from "react";

import { tzs } from "@/lib/ops/format";
import { cn } from "@/lib/utils";
import type { ProjectSummary } from "@/types/construction";

/**
 * Offline-safe tactical map. The site is embedded in an isolated preview with
 * no third-party tile requests allowed, so the geography is an inline vector
 * projection of Tanzania rather than a Leaflet/Mapbox raster basemap. The same
 * component accepts a Mapbox GL layer swap in production.
 */
const OUTLINE: [number, number][] = [
  [29.6, -1.4], [30.5, -1.05], [31.8, -1.0], [33.0, -0.99], [34.0, -1.05],
  [34.6, -1.4], [35.2, -1.6], [36.0, -2.0], [37.0, -2.5], [37.7, -3.0],
  [38.5, -3.4], [39.2, -4.0], [39.4, -4.7], [39.0, -5.2], [39.5, -6.0],
  [39.2, -6.8], [39.6, -7.6], [39.5, -8.4], [39.4, -9.5], [39.8, -10.4],
  [40.4, -10.7], [39.9, -11.2], [38.9, -11.4], [37.6, -11.5], [36.5, -11.7],
  [35.6, -11.6], [34.9, -11.6], [34.6, -10.8], [34.6, -9.9], [33.9, -9.5],
  [32.9, -9.5], [32.0, -9.4], [31.2, -8.9], [30.8, -8.4], [30.2, -7.9],
  [29.6, -7.3], [29.6, -6.3], [29.9, -5.5], [29.6, -4.5], [29.7, -3.7],
  [30.2, -3.1], [30.6, -2.6], [30.5, -2.0], [30.0, -1.6],
];

const VICTORIA: [number, number][] = [
  [31.8, -2.4], [32.6, -2.1], [33.4, -2.2], [34.0, -2.4], [33.7, -2.9],
  [32.9, -3.1], [32.1, -2.9],
];

const NYASA: [number, number][] = [
  [34.0, -9.6], [34.7, -9.7], [34.8, -10.6], [34.5, -11.5], [34.0, -11.3], [33.9, -10.3],
];

const BOUNDS = { minLng: 29.0, maxLng: 41.0, minLat: -12.2, maxLat: -0.8 };
const WIDTH = 640;
const HEIGHT = 460;
const PAD = 26;

const project = ([lng, lat]: [number, number]) => {
  const x = ((lng - BOUNDS.minLng) / (BOUNDS.maxLng - BOUNDS.minLng)) * (WIDTH - PAD * 2) + PAD;
  const y = ((BOUNDS.maxLat - lat) / (BOUNDS.maxLat - BOUNDS.minLat)) * (HEIGHT - PAD * 2) + PAD;
  return { x, y };
};

const polygon = (points: [number, number][]) =>
  points.map((point) => {
    const { x, y } = project(point);
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  }).join(" ");

const STATUS_COLOR: Record<string, string> = {
  green: "#6FD3A6",
  amber: "#F7BC32",
  red: "#F26D5B",
};

export function LiveProjectMap({ projects }: { projects: ProjectSummary[] }) {
  const [hovered, setHovered] = useState<ProjectSummary | null>(null);
  const active = projects.filter((entry) => entry.status === "active").length;
  const dar = projects.filter(
    (entry) => Math.abs(entry.lng - 39.28) < 0.16 && Math.abs(entry.lat + 6.8) < 0.16,
  );

  return (
    <div className="flex flex-col">
      <div className="flex flex-wrap items-start justify-between gap-3 px-4 pt-4 sm:px-5">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-gold">Site telemetry</p>
          <h2 className="mt-1 text-[15px] font-semibold tracking-tight text-paper">Live project map</h2>
          <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.14em] text-paper/40">
            {active} active {active === 1 ? "site" : "sites"} · {projects.length} on register · Tanzania
          </p>
        </div>
        <span className="inline-flex items-center gap-1.5 border border-paper/15 px-2 py-1 font-mono text-[9px] uppercase tracking-[0.16em] text-paper/45">
          <span className="h-1.5 w-1.5 rounded-full bg-[#6FD3A6] live-dot" /> Telemetry live
        </span>
      </div>

      <div className="ops-dark-inset relative mt-2 px-2 pb-2 sm:px-3">
        <svg
          viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
          className="h-auto w-full"
          role="img"
          aria-label="Map of Tanzania with ALTRA COMMAND project sites coloured by delivery status"
        >
          <defs>
            <radialGradient id="ocean" cx="70%" cy="55%" r="80%">
              <stop offset="0%" stopColor="#0E1A24" />
              <stop offset="100%" stopColor="#0A0D14" />
            </radialGradient>
            <pattern id="mapGrid" width="34" height="34" patternUnits="userSpaceOnUse">
              <path d="M 34 0 L 0 0 0 34" fill="none" stroke="rgba(247,242,231,0.05)" strokeWidth="1" />
            </pattern>
            <filter id="markerGlow" x="-200%" y="-200%" width="400%" height="400%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          <rect width={WIDTH} height={HEIGHT} fill="url(#ocean)" />
          <rect width={WIDTH} height={HEIGHT} fill="url(#mapGrid)" />

          <text x={WIDTH - 26} y={HEIGHT - 30} textAnchor="end" className="fill-paper/20" style={{ font: "500 9px var(--font-mono)", letterSpacing: "0.3em" }}>
            INDIAN OCEAN
          </text>

          <polygon points={polygon(OUTLINE)} fill="#161A24" stroke="rgba(247,188,50,0.35)" strokeWidth="1.2" />
          <polygon points={polygon(VICTORIA)} fill="#0C1620" stroke="rgba(247,242,231,0.18)" strokeWidth="1" />
          <polygon points={polygon(NYASA)} fill="#0C1620" stroke="rgba(247,242,231,0.18)" strokeWidth="1" />
          {[
            { name: "Lake Victoria", lng: 32.7, lat: -2.55 },
            { name: "Lake Tanganyika", lng: 29.9, lat: -5.8 },
            { name: "Lake Nyasa", lng: 34.35, lat: -10.6 },
          ].map((lake) => {
            const { x, y } = project([lake.lng, lake.lat]);
            return (
              <text key={lake.name} x={x} y={y} textAnchor="middle" className="fill-paper/25" style={{ font: "400 7px var(--font-mono)", letterSpacing: "0.12em" }}>
                {lake.name.toUpperCase()}
              </text>
            );
          })}

          {[-2, -4, -6, -8, -10].map((lat) => {
            const { y } = project([BOUNDS.minLng, lat]);
            return (
              <g key={lat}>
                <line x1={PAD} y1={y} x2={WIDTH - PAD} y2={y} stroke="rgba(247,242,231,0.07)" strokeDasharray="2 6" />
                <text x={PAD - 6} y={y + 3} textAnchor="end" className="fill-paper/25" style={{ font: "400 7px var(--font-mono)" }}>
                  {lat}°
                </text>
              </g>
            );
          })}

          {[30, 32, 34, 36, 38, 40].map((lng) => {
            const { x } = project([lng, BOUNDS.minLat]);
            return (
              <g key={lng}>
                <line x1={x} y1={PAD} x2={x} y2={HEIGHT - PAD} stroke="rgba(247,242,231,0.06)" strokeDasharray="2 6" />
                <text x={x} y={HEIGHT - 12} textAnchor="middle" className="fill-paper/25" style={{ font: "400 7px var(--font-mono)" }}>
                  {lng}°E
                </text>
              </g>
            );
          })}

          {dar.length > 2 ? (
            <g pointerEvents="none">
              <circle
                cx={project([39.28, -6.8]).x}
                cy={project([39.28, -6.8]).y}
                r={26}
                fill="none"
                stroke="rgba(247,188,50,0.28)"
                strokeDasharray="3 4"
              />
              <text
                x={project([39.28, -6.8]).x + 12}
                y={project([39.28, -6.8]).y + 36}
                className="fill-gold/70"
                style={{ font: "500 8px var(--font-mono)", letterSpacing: "0.14em" }}
              >
                DAR · {dar.length} SITES
              </text>
            </g>
          ) : null}

          {projects.map((entry) => {
            const { x, y } = project([entry.lng, entry.lat]);
            const color = STATUS_COLOR[entry.trafficLight] ?? "#F7BC32";
            const isHovered = hovered?.id === entry.id;
            const flipLabel = x > WIDTH - 180;
            return (
              <Link key={entry.id} href={`/dashboard/projects/${entry.id}`} aria-label={`${entry.name} — ${entry.trafficLight}`}>
                <g
                  onMouseEnter={() => setHovered(entry)}
                  onMouseLeave={() => setHovered(null)}
                  onFocus={() => setHovered(entry)}
                  onBlur={() => setHovered(null)}
                  tabIndex={0}
                  className="cursor-pointer outline-none"
                >
                  {entry.trafficLight !== "green" ? (
                    <circle cx={x} cy={y} r={12} fill={color} opacity={0.12}>
                      <animate attributeName="r" values="8;18;8" dur="3s" repeatCount="indefinite" />
                      <animate attributeName="opacity" values="0.25;0;0.25" dur="3s" repeatCount="indefinite" />
                    </circle>
                  ) : null}
                  <circle cx={x} cy={y} r={isHovered ? 7 : 5} fill={color} filter="url(#markerGlow)" />
                  <circle cx={x} cy={y} r={isHovered ? 11 : 9} fill="none" stroke={color} strokeOpacity={isHovered ? 0.85 : 0.35} />
                  {isHovered || ["p-mwanza", "p-dodoma", "p-arusha"].includes(entry.id) ? (
                    <text
                      x={flipLabel ? x - 13 : x + 13}
                      y={y + 3}
                      textAnchor={flipLabel ? "end" : "start"}
                      className="fill-paper/85"
                      style={{ font: "500 9px var(--font-mono)", letterSpacing: "0.08em" }}
                    >
                      {entry.name.replace(" Campus", "").replace(" Peninsula Tower", " Tower")}
                    </text>
                  ) : null}
                </g>
              </Link>
            );
          })}

          <g transform={`translate(${WIDTH - 78}, ${HEIGHT - 66})`}>
            <line x1="0" y1="0" x2="0" y2="-34" stroke="rgba(247,242,231,0.4)" />
            <polygon points="0,-40 -4,-30 4,-30" fill="rgba(247,242,231,0.5)" />
            <text x="0" y="10" textAnchor="middle" className="fill-paper/40" style={{ font: "400 8px var(--font-mono)" }}>N</text>
          </g>
        </svg>

        {hovered ? (
          <div className="pointer-events-none absolute bottom-4 left-4 right-4 border border-gold/30 bg-[#0B0D13]/95 p-3 shadow-2xl sm:right-auto sm:w-[280px]">
            <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-gold">{hovered.projectCode}</p>
            <p className="mt-1 text-[13px] font-semibold text-paper">{hovered.name}</p>
            <p className="mt-0.5 font-mono text-[9px] uppercase tracking-[0.12em] text-paper/45">
              {hovered.manager} · {hovered.workforce} on site
            </p>
            <div className="mt-2 flex items-center justify-between gap-3 border-t border-paper/10 pt-2 font-mono text-[10px] text-paper/60">
              <span>{hovered.completion}% complete</span>
              <span>{tzs(hovered.budgetSpent)}</span>
            </div>
          </div>
        ) : null}
      </div>

      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-paper/10 px-4 py-3 sm:px-5">
        {[
          { label: "On track", color: STATUS_COLOR.green },
          { label: "Watch", color: STATUS_COLOR.amber },
          { label: "Intervene", color: STATUS_COLOR.red },
        ].map((item) => (
          <span key={item.label} className="flex items-center gap-2 font-mono text-[9px] uppercase tracking-[0.16em] text-paper/45">
            <span className="h-1.5 w-1.5 rounded-full" style={{ background: item.color }} />
            {item.label}
          </span>
        ))}
        <span className="ml-auto hidden font-mono text-[9px] uppercase tracking-[0.14em] text-paper/30 sm:block">
          Tap a marker to open the site
        </span>
      </div>
      <span className="sr-only">
        {projects.map((entry) => `${entry.name}: ${entry.status}, ${entry.completion}% complete.`).join(" ")}
      </span>
    </div>
  );
}
