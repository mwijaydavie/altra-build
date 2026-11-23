"use client";

import { Camera, Loader2, MapPin, X } from "lucide-react";
import { useRef, useState } from "react";

import type { LogPhoto } from "@/types/construction";

const MAX_EDGE = 1280;
const JPEG_QUALITY = 0.72;

const stamp = (date: Date): string =>
  date.toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Africa/Dar_es_Salaam",
  });

async function getPosition(): Promise<{ lat: number; lng: number } | null> {
  if (typeof navigator === "undefined" || !navigator.geolocation) return null;
  return new Promise((resolve) => {
    const timer = window.setTimeout(() => resolve(null), 4000);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        window.clearTimeout(timer);
        resolve({ lat: position.coords.latitude, lng: position.coords.longitude });
      },
      () => {
        window.clearTimeout(timer);
        resolve(null);
      },
      { enableHighAccuracy: true, timeout: 3500, maximumAge: 30_000 },
    );
  });
}

async function watermark(file: File, siteName: string, coords: { lat: number; lng: number } | null): Promise<LogPhoto> {
  const capturedAt = new Date();
  const dataUrl = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error("Could not read photo"));
    reader.readAsDataURL(file);
  });

  const image = await new Promise<HTMLImageElement>((resolve, reject) => {
    const element = new Image();
    element.onload = () => resolve(element);
    element.onerror = () => reject(new Error("Could not decode photo"));
    element.src = dataUrl;
  });

  const scale = Math.min(1, MAX_EDGE / Math.max(image.width, image.height));
  const width = Math.round(image.width * scale);
  const height = Math.round(image.height * scale);

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext("2d");
  if (!context) throw new Error("Canvas unavailable");

  context.drawImage(image, 0, 0, width, height);

  const bandHeight = Math.max(58, Math.round(height * 0.14));
  const gradient = context.createLinearGradient(0, height - bandHeight, 0, height);
  gradient.addColorStop(0, "rgba(8,9,13,0)");
  gradient.addColorStop(0.35, "rgba(8,9,13,0.72)");
  gradient.addColorStop(1, "rgba(8,9,13,0.94)");
  context.fillStyle = gradient;
  context.fillRect(0, height - bandHeight, width, bandHeight);

  context.fillStyle = "#F7BC32";
  context.fillRect(0, height - 3, width, 3);

  const padding = Math.round(width * 0.028);
  const baseY = height - bandHeight + Math.round(bandHeight * 0.36);
  context.fillStyle = "#FFF3E7";
  context.font = `600 ${Math.max(13, Math.round(width * 0.024))}px "Space Grotesk", system-ui, sans-serif`;
  context.fillText(siteName.slice(0, 46).toUpperCase(), padding, baseY);

  context.fillStyle = "rgba(255,243,231,0.72)";
  context.font = `400 ${Math.max(10, Math.round(width * 0.017))}px "JetBrains Mono", monospace`;
  const watermark = `${stamp(capturedAt)} EAT${coords ? ` · ${coords.lat.toFixed(5)}, ${coords.lng.toFixed(5)}` : " · GPS pending"}`;
  context.fillText(watermark, padding, baseY + Math.round(bandHeight * 0.34));

  context.fillStyle = "rgba(247,188,32,0.95)";
  context.font = `500 ${Math.max(9, Math.round(width * 0.014))}px "JetBrains Mono", monospace`;
  context.fillText("ALTRA FIELD · GEOTAGGED", padding, baseY + Math.round(bandHeight * 0.62));

  const out = canvas.toDataURL("image/jpeg", JPEG_QUALITY);
  return {
    id: `photo-${capturedAt.getTime().toString(36)}-${Math.random().toString(36).slice(2, 6)}`,
    dataUrl: out,
    capturedAt: capturedAt.toISOString(),
    lat: coords?.lat ?? 0,
    lng: coords?.lng ?? 0,
    watermark,
  };
}

export function PhotoCaptureInput({
  photos,
  onChange,
  siteName,
  fallback,
}: {
  photos: LogPhoto[];
  onChange: (photos: LogPhoto[]) => void;
  siteName: string;
  fallback: { lat: number; lng: number };
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSelect = async (file: File | undefined) => {
    if (!file) return;
    setBusy(true);
    setError(null);
    try {
      const coords = (await getPosition()) ?? fallback;
      const photo = await watermark(file, siteName, coords);
      onChange([...photos, photo].slice(0, 6));
    } catch (captureError) {
      setError(captureError instanceof Error ? captureError.message : "Photo failed");
    } finally {
      setBusy(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between">
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-paper/40">Site photos</p>
        <span className="font-mono text-[9px] uppercase tracking-[0.12em] text-paper/25">
          {photos.length}/6 · auto watermark
        </span>
      </div>

      <div className="mt-2 grid grid-cols-3 gap-2">
        {photos.map((photo) => (
          <div key={photo.id} className="group relative aspect-square overflow-hidden border border-paper/15">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={photo.dataUrl} alt={photo.watermark} className="h-full w-full object-cover" />
            <button
              type="button"
              onClick={() => onChange(photos.filter((entry) => entry.id !== photo.id))}
              aria-label="Remove photo"
              className="absolute right-1 top-1 flex h-8 w-8 items-center justify-center bg-ink/80 text-paper/80"
            >
              <X className="h-4 w-4" />
            </button>
            <span className="absolute inset-x-0 bottom-0 flex items-center gap-1 bg-ink/80 px-1 py-0.5 font-mono text-[7px] uppercase tracking-[0.06em] text-gold">
              <MapPin className="h-2 w-2" />
              {photo.lat ? `${photo.lat.toFixed(3)},${photo.lng.toFixed(3)}` : "GPS pending"}
            </span>
          </div>
        ))}

        {photos.length < 6 ? (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={busy}
            className="flex aspect-square flex-col items-center justify-center gap-1.5 border border-dashed border-paper/25 bg-paper/[0.03] text-paper/55 transition-colors hover:border-gold/50 hover:text-gold disabled:opacity-50"
          >
            {busy ? <Loader2 className="h-5 w-5 animate-spin" /> : <Camera className="h-5 w-5" />}
            <span className="font-mono text-[9px] uppercase tracking-[0.12em]">
              {busy ? "Processing" : "Add photo"}
            </span>
          </button>
        ) : null}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="sr-only"
        onChange={(event) => void onSelect(event.target.files?.[0])}
      />
      {error ? (
        <p className="mt-1.5 font-mono text-[9px] uppercase tracking-[0.1em] text-[#F26D5B]">{error}</p>
      ) : (
        <p className="mt-1.5 font-mono text-[9px] uppercase leading-relaxed tracking-[0.08em] text-paper/25">
          Camera opens on device · timestamp, site and GPS burned into the image
        </p>
      )}
    </div>
  );
}
