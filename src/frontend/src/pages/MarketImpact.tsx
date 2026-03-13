import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Minus, TrendingDown, TrendingUp } from "lucide-react";
import { useState } from "react";
import { Variant_up_down_neutral } from "../backend.d";
import { useGlobalEvents, useMarketImpacts } from "../hooks/useQueries";

function DirectionIcon({ dir }: { dir: Variant_up_down_neutral }) {
  if (dir === Variant_up_down_neutral.up)
    return <TrendingUp className="w-3.5 h-3.5 text-green-400" />;
  if (dir === Variant_up_down_neutral.down)
    return <TrendingDown className="w-3.5 h-3.5 text-red-400" />;
  return <Minus className="w-3.5 h-3.5 text-muted-foreground" />;
}

function directionColor(dir: Variant_up_down_neutral): string {
  if (dir === Variant_up_down_neutral.up) return "oklch(0.65 0.18 145)";
  if (dir === Variant_up_down_neutral.down) return "oklch(0.58 0.22 25)";
  return "oklch(0.55 0.008 240)";
}

function dirSign(dir: Variant_up_down_neutral): string {
  if (dir === Variant_up_down_neutral.up) return "+";
  if (dir === Variant_up_down_neutral.down) return "-";
  return "";
}

export function MarketImpact() {
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const { data: events } = useGlobalEvents();
  const { data: impacts, isLoading } = useMarketImpacts(selectedEventId);

  return (
    <div className="p-6 space-y-5">
      <div>
        <h1 className="text-xl font-semibold tracking-tight">MARKET IMPACT</h1>
        <p className="text-xs text-muted-foreground font-mono mt-0.5">
          AI-POWERED MARKET IMPACT ANALYZER
        </p>
      </div>

      <div className="flex items-center gap-3">
        <span className="text-[11px] font-mono text-muted-foreground tracking-widest flex-shrink-0">
          TRIGGER EVENT:
        </span>
        <Select
          value={selectedEventId ?? "all"}
          onValueChange={(v) => setSelectedEventId(v === "all" ? null : v)}
        >
          <SelectTrigger
            data-ocid="market.select"
            className="max-w-sm h-8 text-xs font-mono bg-muted/30 border-border"
          >
            <SelectValue placeholder="All Events" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all" className="text-xs font-mono">
              All Events
            </SelectItem>
            {events?.map((e) => (
              <SelectItem key={e.id} value={e.id} className="text-xs font-mono">
                {e.title.slice(0, 50)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Skeleton className="h-80" />
          <Skeleton className="h-80" />
        </div>
      ) : (
        <div className="space-y-4">
          {impacts?.map((impact) => (
            <div key={impact.id} className="space-y-4">
              <div className="terminal-card rounded px-4 py-2">
                <div className="text-[10px] font-mono text-muted-foreground tracking-widest">
                  ANALYZED EVENT
                </div>
                <div className="font-semibold mt-1">{impact.eventTitle}</div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="terminal-card rounded">
                  <div className="px-4 py-3 border-b border-border">
                    <span className="text-[11px] font-mono font-semibold tracking-widest text-cyan-400">
                      INDUSTRY IMPACTS
                    </span>
                  </div>
                  <div className="p-4 space-y-3">
                    {impact.industryImpacts.map((ii) => {
                      const color = directionColor(ii.direction);
                      const pct = Math.min(100, ii.magnitude * 10);
                      return (
                        <div key={ii.industry} className="space-y-1.5">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <DirectionIcon dir={ii.direction} />
                              <span className="text-xs font-medium">
                                {ii.industry}
                              </span>
                            </div>
                            <span
                              className="text-[11px] font-mono font-bold"
                              style={{ color }}
                            >
                              {dirSign(ii.direction)}
                              {ii.magnitude.toFixed(1)}%
                            </span>
                          </div>
                          <div className="h-1 bg-muted rounded-full overflow-hidden">
                            <div
                              className="h-full rounded-full"
                              style={{
                                width: `${pct}%`,
                                background: color,
                              }}
                            />
                          </div>
                          <div className="text-[10px] text-muted-foreground">
                            {ii.reason}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="terminal-card rounded">
                  <div className="px-4 py-3 border-b border-border">
                    <span className="text-[11px] font-mono font-semibold tracking-widest text-amber-400">
                      COMMODITY IMPACTS
                    </span>
                  </div>
                  <div className="p-4 space-y-3">
                    {impact.commodityImpacts.map((ci) => {
                      const color = directionColor(ci.direction);
                      const pct = Math.min(100, ci.magnitude * 10);
                      return (
                        <div key={ci.commodity} className="space-y-1.5">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <DirectionIcon dir={ci.direction} />
                              <span className="text-xs font-medium">
                                {ci.commodity}
                              </span>
                            </div>
                            <span
                              className="text-[11px] font-mono font-bold"
                              style={{ color }}
                            >
                              {dirSign(ci.direction)}
                              {ci.magnitude.toFixed(1)}%
                            </span>
                          </div>
                          <div className="h-1 bg-muted rounded-full overflow-hidden">
                            <div
                              className="h-full rounded-full"
                              style={{
                                width: `${pct}%`,
                                background: color,
                              }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          ))}
          {(!impacts || impacts.length === 0) && (
            <div className="text-center py-16 text-muted-foreground text-sm">
              No market impact data available. Select an event to filter.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
