import { Skeleton } from "@/components/ui/skeleton";
import { Calendar, Globe } from "lucide-react";
import { useState } from "react";
import { policyType } from "../backend.d";
import { usePolicyEntries } from "../hooks/useQueries";

const POLICY_TYPES: Array<{ key: policyType | null; label: string }> = [
  { key: null, label: "ALL" },
  { key: policyType.tariff, label: "TARIFF" },
  { key: policyType.sanction, label: "SANCTION" },
  { key: policyType.regulation, label: "REGULATION" },
  { key: policyType.monetary, label: "MONETARY" },
  { key: policyType.environmental, label: "ENVIRONMENTAL" },
  { key: policyType.export_, label: "EXPORT" },
];

const POLICY_COLORS: Record<
  string,
  { text: string; bg: string; border: string }
> = {
  tariff: {
    text: "oklch(0.75 0.18 70)",
    bg: "oklch(0.75 0.18 70 / 0.08)",
    border: "oklch(0.75 0.18 70 / 0.3)",
  },
  sanction: {
    text: "oklch(0.58 0.22 25)",
    bg: "oklch(0.58 0.22 25 / 0.08)",
    border: "oklch(0.58 0.22 25 / 0.3)",
  },
  regulation: {
    text: "oklch(0.72 0.14 280)",
    bg: "oklch(0.72 0.14 280 / 0.08)",
    border: "oklch(0.72 0.14 280 / 0.3)",
  },
  monetary: {
    text: "oklch(0.78 0.16 200)",
    bg: "oklch(0.78 0.16 200 / 0.08)",
    border: "oklch(0.78 0.16 200 / 0.3)",
  },
  environmental: {
    text: "oklch(0.65 0.18 145)",
    bg: "oklch(0.65 0.18 145 / 0.08)",
    border: "oklch(0.65 0.18 145 / 0.3)",
  },
  export: {
    text: "oklch(0.78 0.10 220)",
    bg: "oklch(0.78 0.10 220 / 0.08)",
    border: "oklch(0.78 0.10 220 / 0.3)",
  },
};

function getPolicyKey(pt: policyType): string {
  if (pt === policyType.export_) return "export";
  return pt;
}

export function PolicyTracker() {
  const [activeType, setActiveType] = useState<policyType | null>(null);
  const { data: policies, isLoading } = usePolicyEntries(activeType);

  const sorted = policies
    ? [...policies].sort(
        (a, b) => Number(b.effectiveDate) - Number(a.effectiveDate),
      )
    : [];

  return (
    <div className="p-6 space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">
            POLICY TRACKER
          </h1>
          <p className="text-xs text-muted-foreground font-mono mt-0.5">
            REAL-TIME POLICY & REGULATION MONITOR
          </p>
        </div>
        {sorted.length > 0 && (
          <span className="text-[10px] font-mono text-muted-foreground border border-border px-2 py-1 rounded">
            {sorted.length} POLICIES
          </span>
        )}
      </div>

      <div className="flex flex-wrap gap-1.5">
        {POLICY_TYPES.map((pt) => {
          const isActive = activeType === pt.key;
          return (
            <button
              type="button"
              key={String(pt.key)}
              data-ocid="policy.tab"
              onClick={() => setActiveType(pt.key)}
              className={`px-3 py-1.5 text-[10px] font-mono font-semibold tracking-widest rounded border transition-all ${
                isActive
                  ? "bg-cyan-500/15 text-cyan-400 border-cyan-500/40"
                  : "bg-transparent text-muted-foreground border-border hover:text-foreground"
              }`}
            >
              {pt.label}
            </button>
          );
        })}
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-36" />
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {sorted.map((policy) => {
            const key = getPolicyKey(policy.policyType);
            const colors = POLICY_COLORS[key] ?? POLICY_COLORS.regulation;
            const sev = Number(policy.severity);
            return (
              <div
                key={policy.id}
                className="terminal-card rounded p-4 space-y-3"
                style={{ borderColor: colors.border }}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <span
                      className="text-[9px] font-mono font-bold px-2 py-1 rounded border flex-shrink-0"
                      style={{
                        color: colors.text,
                        borderColor: colors.border,
                        background: colors.bg,
                      }}
                    >
                      {key.toUpperCase()}
                    </span>
                    <div>
                      <div className="font-semibold text-sm">
                        {policy.title}
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <Globe className="w-3 h-3 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">
                          {policy.country}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1 flex-shrink-0">
                    <div
                      className="text-[10px] font-mono font-bold px-2 py-0.5 rounded"
                      style={{
                        color:
                          sev >= 7
                            ? "oklch(0.58 0.22 25)"
                            : sev >= 4
                              ? "oklch(0.75 0.18 70)"
                              : "oklch(0.65 0.18 145)",
                        background:
                          sev >= 7
                            ? "oklch(0.58 0.22 25 / 0.1)"
                            : sev >= 4
                              ? "oklch(0.75 0.18 70 / 0.1)"
                              : "oklch(0.65 0.18 145 / 0.1)",
                      }}
                    >
                      SEV {sev}
                    </div>
                    <div className="flex items-center gap-1 text-[10px] font-mono text-muted-foreground">
                      <Calendar className="w-3 h-3" />
                      {new Date(
                        Number(policy.effectiveDate) / 1_000_000,
                      ).toLocaleDateString()}
                    </div>
                  </div>
                </div>

                <p className="text-xs text-muted-foreground leading-relaxed">
                  {policy.description}
                </p>

                {policy.marketImpact && (
                  <div
                    className="text-xs px-3 py-2 rounded border"
                    style={{
                      borderColor: colors.border,
                      background: colors.bg,
                    }}
                  >
                    <span
                      className="text-[10px] font-mono font-bold tracking-widest"
                      style={{ color: colors.text }}
                    >
                      MARKET IMPACT:
                    </span>{" "}
                    <span className="text-muted-foreground">
                      {policy.marketImpact}
                    </span>
                  </div>
                )}
              </div>
            );
          })}
          {sorted.length === 0 && (
            <div className="text-center py-16 text-muted-foreground text-sm">
              No policy entries available
            </div>
          )}
        </div>
      )}
    </div>
  );
}
