import { Skeleton } from "@/components/ui/skeleton";
import { ChevronDown, ChevronUp, Zap } from "lucide-react";
import { useState } from "react";
import { useScenarios } from "../hooks/useQueries";

export function Scenarios() {
  const { data: scenarios, isLoading } = useScenarios();
  const [expandedId, setExpandedId] = useState<string | null>(null);

  function outcomeColor(prob: number) {
    if (prob >= 0.6) return "oklch(0.58 0.22 25)";
    if (prob >= 0.3) return "oklch(0.75 0.18 70)";
    return "oklch(0.65 0.18 145)";
  }

  return (
    <div className="p-6 space-y-5">
      <div>
        <h1 className="text-xl font-semibold tracking-tight">SCENARIOS</h1>
        <p className="text-xs text-muted-foreground font-mono mt-0.5">
          AI SCENARIO SIMULATION ENGINE \u00b7 PREDICTIVE OUTCOMES
        </p>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-48" />
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {scenarios?.map((scenario, si) => {
            const isExpanded = expandedId === scenario.id;
            return (
              <div
                key={scenario.id}
                data-ocid={`scenarios.item.${si + 1}`}
                className="terminal-card rounded"
              >
                <button
                  type="button"
                  className="w-full px-4 py-3 flex items-center gap-3 text-left border-b border-border hover:bg-muted/10 transition-colors"
                  onClick={() => setExpandedId(isExpanded ? null : scenario.id)}
                >
                  <Zap className="w-4 h-4 text-amber-400 flex-shrink-0" />
                  <div className="flex-1">
                    <div className="font-semibold text-sm">
                      {scenario.title}
                    </div>
                    <div className="text-[10px] font-mono text-muted-foreground mt-0.5">
                      TRIGGER: {scenario.triggerEventId} \u00b7{" "}
                      {scenario.outcomes.length} OUTCOMES \u00b7{" "}
                      {new Date(
                        Number(scenario.createdAt) / 1_000_000,
                      ).toLocaleDateString()}
                    </div>
                  </div>
                  {isExpanded ? (
                    <ChevronUp className="w-4 h-4 text-muted-foreground" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-muted-foreground" />
                  )}
                </button>

                {isExpanded && (
                  <div className="p-4 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
                    {scenario.outcomes.map((outcome, oi) => {
                      const color = outcomeColor(outcome.probability);
                      const pct = Math.round(outcome.probability * 100);
                      return (
                        <div
                          key={`${scenario.id}-outcome-${oi}`}
                          className="rounded border p-3 space-y-2"
                          style={{
                            borderColor: color
                              .replace(")", " / 0.25)")
                              .replace("oklch(", "oklch("),
                            background: color
                              .replace(")", " / 0.05)")
                              .replace("oklch(", "oklch("),
                          }}
                        >
                          <div className="font-medium text-sm">
                            {outcome.title}
                          </div>
                          <p className="text-xs text-muted-foreground leading-relaxed">
                            {outcome.description}
                          </p>

                          <div className="space-y-1">
                            <div className="flex justify-between text-[10px] font-mono">
                              <span className="text-muted-foreground">
                                PROBABILITY
                              </span>
                              <span style={{ color }}>{pct}%</span>
                            </div>
                            <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                              <div
                                className="h-full rounded-full"
                                style={{ width: `${pct}%`, background: color }}
                              />
                            </div>
                          </div>

                          <div className="text-[10px] font-mono text-muted-foreground">
                            TIMELINE: {Number(outcome.timelineWeeks)}W
                          </div>

                          {outcome.sectorsImpacted.length > 0 && (
                            <div className="flex flex-wrap gap-1">
                              {outcome.sectorsImpacted.map((sector) => (
                                <span
                                  key={sector}
                                  className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-muted text-muted-foreground"
                                >
                                  {sector}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
          {(!scenarios || scenarios.length === 0) && (
            <div className="text-center py-16 text-muted-foreground text-sm">
              No scenarios available
            </div>
          )}
        </div>
      )}
    </div>
  );
}
