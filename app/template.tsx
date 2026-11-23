"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

/**
 * Route transition: opacity only (no transforms) so ScrollTrigger pinning and
 * fixed elements keep their geometry.
 */
export default function Template({ children }: { children: ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}
