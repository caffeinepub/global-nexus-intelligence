import { Skeleton } from "@/components/ui/skeleton";
import { useGlobalEvents } from "../hooks/useQueries";

export function LiveTicker() {
  const { data: events, isLoading } = useGlobalEvents();

  if (isLoading) {
    return (
      <div
        data-ocid="ticker.loading_state"
        className="h-8 flex items-center border-t border-border bg-card/60 px-4"
      >
        <Skeleton className="h-4 w-full" />
      </div>
    );
  }

  const titles = events?.map((e) => e.title) ?? [
    "MONITORING GLOBAL INTELLIGENCE FEEDS",
    "SYSTEM ACTIVE — NEXUS INTELLIGENCE ONLINE",
  ];

  const tickerText = titles.join("  ·  ");

  return (
    <div className="h-8 flex items-center border-t border-border bg-card/80 overflow-hidden flex-shrink-0">
      <div className="flex items-center gap-2 px-3 flex-shrink-0 border-r border-border h-full">
        <span className="live-pulse inline-block w-2 h-2 rounded-full bg-[oklch(0.65_0.18_145)]" />
        <span className="text-[10px] font-mono font-semibold text-[oklch(0.65_0.18_145)] tracking-widest">
          LIVE
        </span>
      </div>
      <div className="overflow-hidden flex-1 relative">
        <div
          className="ticker-scroll whitespace-nowrap inline-block text-xs font-mono text-muted-foreground tracking-wide"
          style={{
            animationDuration: `${Math.max(30, tickerText.length / 5)}s`,
          }}
        >
          {tickerText}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{tickerText}
        </div>
      </div>
    </div>
  );
}
