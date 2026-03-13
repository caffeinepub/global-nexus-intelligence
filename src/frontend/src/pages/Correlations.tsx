import { Skeleton } from "@/components/ui/skeleton";
import { GitBranch } from "lucide-react";
import { useCorrelationChains } from "../hooks/useQueries";

const STEP_COLORS = [
  "oklch(0.78 0.16 200)",
  "oklch(0.75 0.18 70)",
  "oklch(0.58 0.22 25)",
  "oklch(0.65 0.18 145)",
  "oklch(0.72 0.14 280)",
];

function withAlpha(color: string, alpha: string): string {
  return `${color.slice(0, -1)} / ${alpha})`;
}

export function Correlations() {
  const { data: chains, isLoading } = useCorrelationChains();

  return (
    <div className="p-6 space-y-5">
      <div>
        <h1 className="text-xl font-semibold tracking-tight">CORRELATIONS</h1>
        <p className="text-xs text-muted-foreground font-mono mt-0.5">
          AI EVENT CORRELATION ENGINE \u00b7 CAUSAL CHAIN ANALYSIS
        </p>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-64" />
          ))}
        </div>
      ) : (
        <div className="space-y-6">
          {chains?.map((chain) => (
            <div key={chain.id} className="terminal-card rounded">
              <div className="px-4 py-3 border-b border-border flex items-center gap-3">
                <GitBranch className="w-4 h-4 text-cyan-400" />
                <div>
                  <div className="font-semibold text-sm">{chain.title}</div>
                  <div className="text-[10px] font-mono text-muted-foreground mt-0.5">
                    {new Date(
                      Number(chain.createdAt) / 1_000_000,
                    ).toLocaleDateString()}{" "}
                    \u00b7 {chain.steps.length} STEPS
                  </div>
                </div>
              </div>
              <div className="p-4">
                {chain.steps.map((step, si) => {
                  const color = STEP_COLORS[si % STEP_COLORS.length];
                  const nextColor = STEP_COLORS[(si + 1) % STEP_COLORS.length];
                  const bgColor = withAlpha(color, "0.12");
                  const borderColor = withAlpha(color, "0.3");
                  const gradientBg = `linear-gradient(${color}, ${nextColor})`;
                  const leftBorderColor = withAlpha(color, "0.2");
                  return (
                    <div key={step.eventId} className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div
                          className="w-7 h-7 rounded flex items-center justify-center text-[10px] font-mono font-bold flex-shrink-0"
                          style={{
                            background: bgColor,
                            color,
                            border: `1px solid ${borderColor}`,
                          }}
                        >
                          {si + 1}
                        </div>
                        {si < chain.steps.length - 1 && (
                          <div
                            className="w-px flex-1 my-1"
                            style={{
                              background: gradientBg,
                              opacity: 0.4,
                              minHeight: "24px",
                            }}
                          />
                        )}
                      </div>

                      <div
                        className="flex-1 pb-4 pl-2 border-l mb-1"
                        style={{ borderColor: leftBorderColor }}
                      >
                        <div
                          className="text-[10px] font-mono font-bold tracking-widest mb-1"
                          style={{ color }}
                        >
                          {step.stepLabel}
                        </div>
                        <div className="text-sm text-foreground/80">
                          {step.description}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
          {(!chains || chains.length === 0) && (
            <div className="text-center py-16 text-muted-foreground text-sm">
              No correlation chains available
            </div>
          )}
        </div>
      )}
    </div>
  );
}
