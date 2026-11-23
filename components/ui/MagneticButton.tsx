"use client";

import Link from "next/link";
import { useRef, type ReactNode } from "react";
import { motion, useMotionValue, useSpring, useReducedMotion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

type Variant = "gold" | "ink" | "outline" | "outline-light" | "ghost";
type Size = "sm" | "md" | "lg";

interface BaseProps {
  children: ReactNode;
  variant?: Variant;
  size?: Size;
  className?: string;
  icon?: boolean;
  strength?: number;
}

interface LinkProps extends BaseProps {
  href: string;
  external?: boolean;
  onClick?: never;
  type?: never;
}

interface ButtonProps extends BaseProps {
  href?: never;
  onClick?: () => void;
  type?: "button" | "submit";
  disabled?: boolean;
}

const variants: Record<Variant, string> = {
  gold: "bg-gold text-ink hover:bg-gold-soft border border-gold",
  ink: "bg-ink text-paper hover:bg-ink-700 border border-ink",
  outline: "bg-transparent text-ink border border-ink/25 hover:border-ink hover:bg-ink hover:text-paper",
  "outline-light":
    "bg-transparent text-paper border border-paper/25 hover:border-gold hover:bg-gold hover:text-ink",
  ghost: "bg-paper/5 text-paper border border-transparent hover:border-paper/20",
};

const sizes: Record<Size, string> = {
  sm: "h-9 px-4 text-[12.5px] tracking-[0.14em]",
  md: "h-12 px-6 text-[14px] tracking-[0.14em]",
  lg: "h-14 px-8 text-[15.5px] tracking-[0.16em]",
};

export function MagneticButton(props: LinkProps | ButtonProps) {
  const { children, variant = "gold", size = "md", className, icon = true, strength = 14 } = props;
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const x = useSpring(rawX, { stiffness: 220, damping: 18, mass: 0.4 });
  const y = useSpring(rawY, { stiffness: 220, damping: 18, mass: 0.4 });

  function handleMove(event: React.PointerEvent<HTMLDivElement>) {
    if (reduced || event.pointerType !== "mouse") return;
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const dx = (event.clientX - (rect.left + rect.width / 2)) / (rect.width / 2);
    const dy = (event.clientY - (rect.top + rect.height / 2)) / (rect.height / 2);
    rawX.set(dx * strength);
    rawY.set(dy * strength * 0.6);
  }

  function handleLeave() {
    rawX.set(0);
    rawY.set(0);
  }

  const inner = (
    <>
      <span className="relative z-10 flex items-center gap-2 whitespace-nowrap font-mono font-medium uppercase">
        {children}
        {icon && (
          <ArrowUpRight
            className="size-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            strokeWidth={2}
          />
        )}
      </span>
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 z-0 translate-y-full bg-current/10 transition-transform duration-500 ease-[cubic-bezier(.16,1,.3,1)] group-hover:translate-y-0"
      />
    </>
  );

  const classes = cn(
    "group relative inline-flex items-center justify-center overflow-hidden uppercase",
    "transition-colors duration-300 will-change-transform",
    variants[variant],
    sizes[size],
    className,
  );

  if ("href" in props && props.href) {
    const external = props.external;
    return (
      <motion.div
        ref={ref}
        onPointerMove={handleMove}
        onPointerLeave={handleLeave}
        style={{ x, y }}
        className="inline-flex"
      >
        {external ? (
          <a href={props.href} target="_blank" rel="noreferrer noopener" className={classes}>
            {inner}
          </a>
        ) : (
          <Link href={props.href} className={classes}>
            {inner}
          </Link>
        )}
      </motion.div>
    );
  }

  const { onClick, type = "button", disabled } = props as ButtonProps;
  return (
    <motion.div
      ref={ref}
      onPointerMove={handleMove}
      onPointerLeave={handleLeave}
      style={{ x, y }}
      className="inline-flex"
    >
      <button type={type} onClick={onClick} disabled={disabled} className={cn(classes, disabled && "opacity-50")}>
        {inner}
      </button>
    </motion.div>
  );
}
