import { Skeleton } from "@/components/ui/skeleton";
import { Activity, AlertTriangle, Globe, Zap } from "lucide-react";
import {
  useCountryRiskProfiles,
  useDashboardSummary,
  useGlobalEvents,
} from "../hooks/useQueries";

function RiskGauge({ value }: { value: number }) {
  const pct = Math.min(100, Math.max(0, value * 100));
  const angle = -135 + pct * 2.7;
  const color =
    pct > 66
      ? "oklch(0.58 0.22 25)"
      : pct > 33
        ? "oklch(0.75 0.18 70)"
        : "oklch(0.65 0.18 145)";
  return (
    <div className="flex flex-col items-center gap-1">
      <svg
        viewBox="0 0 120 70"
        className="w-28"
        aria-label="Global Threat Gauge"
      >
        <title>Global Threat Index</title>
        <path
          d="M15 65 A50 50 0 1 1 105 65"
          fill="none"
          stroke="oklch(0.20 0.014 255)"
          strokeWidth="8"
          strokeLinecap="round"
        />
        <path
          d="M15 65 A50 50 0 1 1 105 65"
          fill="none"
          stroke={color}
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={`${(pct / 100) * 157} 157`}
        />
        <line
          x1="60"
          y1="65"
          x2={60 + 35 * Math.cos((angle * Math.PI) / 180)}
          y2={65 + 35 * Math.sin((angle * Math.PI) / 180)}
          stroke={color}
          strokeWidth="2"
          strokeLinecap="round"
        />
        <circle cx="60" cy="65" r="3" fill={color} />
      </svg>
      <span className="font-mono text-xs" style={{ color }}>
        {(pct / 10).toFixed(1)} / 10
      </span>
      <span className="text-[10px] text-muted-foreground tracking-widest">
        GLOBAL THREAT INDEX
      </span>
    </div>
  );
}

function SeverityBadge({ severity }: { severity: number }) {
  const cls =
    severity >= 7
      ? "bg-red-500/15 text-red-400 border-red-500/30"
      : severity >= 4
        ? "bg-amber-500/15 text-amber-400 border-amber-500/30"
        : "bg-green-500/15 text-green-400 border-green-500/30";
  return (
    <span
      className={`inline-flex items-center px-1.5 py-0.5 text-[10px] font-mono font-semibold rounded border ${cls}`}
    >
      SEV {severity}
    </span>
  );
}

const CAT_CLS: Record<string, string> = {
  geopolitics: "text-cyan-400 border-cyan-500/30 bg-cyan-500/10",
  trade: "text-amber-400 border-amber-500/30 bg-amber-500/10",
  military: "text-red-400 border-red-500/30 bg-red-500/10",
  economic: "text-green-400 border-green-500/30 bg-green-500/10",
  policy: "text-violet-400 border-violet-500/30 bg-violet-500/10",
  technology: "text-sky-400 border-sky-500/30 bg-sky-500/10",
  climate: "text-emerald-400 border-emerald-500/30 bg-emerald-500/10",
};

export function Overview() {
  const { data: summary, isLoading: summaryLoading } = useDashboardSummary();
  const { data: events, isLoading: eventsLoading } = useGlobalEvents();
  const { data: riskProfiles, isLoading: riskLoading } =
    useCountryRiskProfiles();

  const isLoading = summaryLoading || eventsLoading || riskLoading;

  const recentEvents = events
    ? [...events]
        .sort((a, b) => Number(b.timestamp) - Number(a.timestamp))
        .slice(0, 7)
    : [];

  const topRiskCountries = riskProfiles
    ? [...riskProfiles]
        .sort((a, b) => b.overallRisk - a.overallRisk)
        .slice(0, 8)
    : [];

  const stats = [
    {
      label: "ACTIVE EVENTS",
      value: summary ? Number(summary.totalEvents) : 0,
      icon: Globe,
      color: "oklch(0.78 0.16 200)",
      borderCls: "border-cyan-500/20",
    },
    {
      label: "HIGH-RISK NATIONS",
      value: summary ? summary.highRiskCountries.length : 0,
      icon: AlertTriangle,
      color: "oklch(0.58 0.22 25)",
      borderCls: "border-red-500/20",
    },
    {
      label: "ACTIVE SCENARIOS",
      value: summary ? Number(summary.activeScenarios) : 0,
      icon: Zap,
      color: "oklch(0.75 0.18 70)",
      borderCls: "border-amber-500/20",
    },
    {
      label: "AVG GLOBAL RISK",
      value: summary ? (summary.avgGlobalRisk * 10).toFixed(2) : "\u2014",
      icon: Activity,
      color: "oklch(0.72 0.14 280)",
      borderCls: "border-violet-500/20",
      suffix: "/10",
    },
  ];

  if (isLoading) {
    return (
      <div data-ocid="dashboard.loading_state" className="p-6 space-y-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-28" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <Skeleton className="h-96 lg:col-span-2" />
          <Skeleton className="h-96" />
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-foreground">
            NEXUS OVERVIEW
          </h1>
          <p className="text-xs text-muted-foreground font-mono mt-0.5">
            GLOBAL INTELLIGENCE DASHBOARD \u00b7 LIVE FEED
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="live-pulse inline-block w-2 h-2 rounded-full bg-green-400" />
          <span className="text-[10px] font-mono text-green-400 tracking-widest">
            SYSTEMS OPERATIONAL
          </span>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className={`terminal-card p-4 rounded ${stat.borderCls}`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="text-[10px] font-mono text-muted-foreground tracking-widest mb-2">
                    {stat.label}
                  </div>
                  <div
                    className="text-3xl font-mono font-bold"
                    style={{ color: stat.color }}
                  >
                    {stat.value}
                    {stat.suffix && (
                      <span className="text-sm text-muted-foreground ml-1">
                        {stat.suffix}
                      </span>
                    )}
                  </div>
                </div>
                <Icon
                  className="w-5 h-5 mt-0.5"
                  style={{ color: stat.color, opacity: 0.7 }}
                />
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Recent Events */}
        <div className="lg:col-span-2 terminal-card rounded">
          <div className="px-4 py-3 border-b border-border flex items-center justify-between">
            <span className="text-[11px] font-mono font-semibold tracking-widest text-cyan-400">
              RECENT INTELLIGENCE FEEDS
            </span>
            <span className="text-[10px] font-mono text-muted-foreground">
              LAST {recentEvents.length} EVENTS
            </span>
          </div>
          <div className="divide-y divide-border">
            {recentEvents.length === 0 && (
              <div className="p-8 text-center text-muted-foreground text-sm">
                No events to display
              </div>
            )}
            {recentEvents.map((event, i) => (
              <div
                key={event.id}
                className="px-4 py-3 flex items-start gap-3 hover:bg-muted/20 transition-colors"
              >
                <span className="text-[10px] font-mono text-muted-foreground/50 w-5 flex-shrink-0 mt-0.5">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span
                      className={`text-[9px] font-mono px-1.5 py-0.5 rounded border ${
                        CAT_CLS[event.category] ?? ""
                      }`}
                    >
                      {event.category.toUpperCase()}
                    </span>
                    <SeverityBadge severity={Number(event.severity)} />
                    <span className="text-[10px] font-mono text-muted-foreground ml-auto">
                      {new Date(
                        Number(event.timestamp) / 1_000_000,
                      ).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="text-sm font-medium text-foreground truncate">
                    {event.title}
                  </div>
                  <div className="text-xs text-muted-foreground truncate mt-0.5">
                    {event.region} \u00b7 {event.country}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Risk Overview */}
        <div className="flex flex-col gap-4">
          <div className="terminal-card rounded p-4 flex flex-col items-center">
            <RiskGauge value={summary?.avgGlobalRisk ?? 0} />
          </div>

          <div className="terminal-card rounded flex-1">
            <div className="px-4 py-3 border-b border-border">
              <span className="text-[11px] font-mono font-semibold tracking-widest text-red-400">
                HIGH-RISK NATIONS
              </span>
            </div>
            <div className="divide-y divide-border">
              {topRiskCountries.map((c) => {
                const risk = c.overallRisk;
                const riskColor =
                  risk > 0.66
                    ? "oklch(0.58 0.22 25)"
                    : risk > 0.33
                      ? "oklch(0.75 0.18 70)"
                      : "oklch(0.65 0.18 145)";
                return (
                  <div
                    key={c.countryCode}
                    className="px-4 py-2 flex items-center justify-between"
                  >
                    <div>
                      <div className="text-xs font-medium">{c.country}</div>
                      <div className="text-[10px] font-mono text-muted-foreground">
                        {c.countryCode}
                      </div>
                    </div>
                    <div
                      className="text-sm font-mono font-bold"
                      style={{ color: riskColor }}
                    >
                      {(risk * 10).toFixed(1)}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
