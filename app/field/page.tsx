import { FieldApp } from "@/components/field/FieldApp";
import { ThemeProvider } from "@/components/theme/ThemeProvider";

export const dynamic = "force-dynamic";

export default function FieldPage() {
  return (
    <ThemeProvider>
      <div className="ops-root min-h-dvh bg-[var(--ops-stage)]">
        <FieldApp />
      </div>
    </ThemeProvider>
  );
}
