import Image from "next/image";
import { cn } from "@/lib/utils";

interface LogoProps {
  variant?: "lockup" | "mark";
  tone?: "ink" | "inverse";
  height?: number;
  className?: string;
  priority?: boolean;
  alt?: string;
}

const LOCKUP_RATIO = 471 / 77;
const MARK_RATIO = 82 / 77;

/**
 * The only place the brand mark is rendered.
 * Tone "ink" is for light surfaces, "inverse" for obsidian surfaces.
 */
export function Logo({
  variant = "lockup",
  tone = "ink",
  height = 34,
  className,
  priority = false,
  alt = "Altra Build",
}: LogoProps) {
  const isMark = variant === "mark";
  const src = isMark
    ? tone === "inverse"
      ? "/brand/altra-mark-inverse.svg"
      : "/brand/altra-mark.svg"
    : tone === "inverse"
      ? "/brand/altra-logo-inverse.svg"
      : "/brand/altra-logo.svg";

  const ratio = isMark ? MARK_RATIO : LOCKUP_RATIO;
  const width = Math.round(height * ratio);

  return (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      priority={priority}
      unoptimized
      draggable={false}
      className={cn("h-auto w-auto select-none", className)}
      style={{ height, width }}
    />
  );
}
