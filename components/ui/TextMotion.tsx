"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ElementType } from "react";
import { cn } from "@/lib/utils";

interface TextMotionProps {
  /** Plain text. Splitting happens client-side; the DOM keeps the real sentence. */
  text: string;
  as?: ElementType;
  className?: string;
  delay?: number;
  stagger?: number;
  once?: boolean;
}

/**
 * Word-by-word masked rise, in the spirit of Framer's TextMotion module.
 * Built natively on framer-motion so it inherits the brand easing and respects
 * reduced-motion without loading an external runtime.
 */
export function TextMotion({
  text,
  as: Tag = "h2",
  className,
  delay = 0,
  stagger = 0.045,
  once = true,
}: TextMotionProps) {
  const reduced = useReducedMotion();
  const words = text.split(" ");

  return (
    <Tag className={cn(className)} aria-label={text}>
      {words.map((word, index) => (
        <span
          key={`${word}-${index}`}
          aria-hidden
          className="inline-block overflow-hidden pb-[0.1em] align-bottom"
        >
          <motion.span
            className="inline-block will-change-transform"
            initial={reduced ? false : { y: "108%", opacity: 0.35 }}
            whileInView={{ y: "0%", opacity: 1 }}
            viewport={{ once, margin: "-10% 0px -10% 0px" }}
            transition={{
              duration: 0.9,
              delay: reduced ? 0 : delay + index * stagger,
              ease: [0.16, 1, 0.3, 1],
            }}
          >
            {word}
            {index < words.length - 1 ? "\u00A0" : ""}
          </motion.span>
        </span>
      ))}
    </Tag>
  );
}
