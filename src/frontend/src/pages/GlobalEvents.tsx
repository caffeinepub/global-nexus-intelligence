import { Skeleton } from "@/components/ui/skeleton";
import { ChevronDown, ChevronUp, MapPin, Tag } from "lucide-react";
import { useState } from "react";
import {
  type EventCategory,
  EventCategoryEnum,
  useGlobalEvents,
} from "../hooks/useQueries";

const CATEGORIES = [
  { key: null, label: "ALL" },
  { key: EventCategoryEnum.geopolitics, label: "GEOPOLITICS" },
  { key: EventCategoryEnum.trade, label: "TRADE" },
  { key: EventCategoryEnum.policy, label: "POLICY" },
  { key: EventCategoryEnum.economic, label: "ECONOMIC" },
  { key: EventCategoryEnum.military, label: "MILITARY" },
  { key: EventCategoryEnum.technology, label: "TECHNOLOGY" },
  { key: EventCategoryEnum.climate, label: "CLIMATE" },
];

const CAT_COLORS: Record<string, { text: string; bg: string; border: string }> =
  {
    geopolitics: {
      text: "oklch(0.78 0.16 200)",
      bg: "oklch(0.78 0.16 200 / 0.08)",
      border: "oklch(0.78 0.16 200 / 0.3)",
    },
    trade: {
      text: "oklch(0.75 0.18 70)",
      bg: "oklch(0.75 0.18 70 / 0.08)",
      border: "oklch(0.75 0.18 70 / 0.3)",
    },
    military: {
      text: "oklch(0.58 0.22 25)",
      bg: "oklch(0.58 0.22 25 / 0.08)",
      border: "oklch(0.58 0.22 25 / 0.3)",
    },
    economic: {
      text: "oklch(0.65 0.18 145)",
      bg: "oklch(0.65 0.18 145 / 0.08)",
      border: "oklch(0.65 0.18 145 / 0.3)",
    },
    policy: {
      text: "oklch(0.72 0.14 280)",
      bg: "oklch(0.72 0.14 280 / 0.08)",
      border: "oklch(0.72 0.14 280 / 0.3)",
    },
    technology: {
      text: "oklch(0.78 0.10 220)",
      bg: "oklch(0.78 0.10 220 / 0.08)",
      border: "oklch(0.78 0.10 220 / 0.3)",
    },
    climate: {
      text: "oklch(0.65 0.18 145)",
      bg: "oklch(0.65 0.18 145 / 0.08)",
      border: "oklch(0.65 0.18 145 / 0.3)",
    },
  };

function getSeverityColor(sev: number) {
  if (sev >= 7) return "oklch(0.58 0.22 25)";
  if (sev >= 4) return "oklch(0.75 0.18 70)";
  return "oklch(0.65 0.18 145)";
}

export function GlobalEvents() {
  const [activeCategory, setActiveCategory] = useState<EventCategory | null>(
    null,
  );
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const { data: events, isLoading } = useGlobalEvents(activeCategory);

  return (
    <div className="p-6 space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">
            GLOBAL EVENTS
          </h1>
          <p className="text-xs text-muted-foreground font-mono mt-0.5">
            REAL-TIME EVENT MONITORING ENGINE
          </p>
        </div>
        {events && (
          <span className="text-[10px] font-mono text-muted-foreground border border-border px-2 py-1 rounded">
            {events.length} EVENTS
          </span>
        )}
      </div>

      {/* Category Tabs */}
      <div className="flex flex-wrap gap-1.5">
        {CATEGORIES.map((cat) => {
          const isActive = activeCategory === cat.key;
          return (
            <button
              type="button"
              key={String(cat.key)}
              data-ocid="events.tab"
              onClick={() => setActiveCategory(cat.key as EventCategory | null)}
              className={`px-3 py-1.5 text-[10px] font-mono font-semibold tracking-widest rounded border transition-all ${
                isActive
                  ? "bg-cyan-500/15 text-cyan-400 border-cyan-500/40"
                  : "bg-transparent text-muted-foreground border-border hover:text-foreground hover:border-muted-foreground/40"
              }`}
            >
              {cat.label}
            </button>
          );
        })}
      </div>

      {/* Events Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Skeleton key={i} className="h-48" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {events?.map((event, idx) => {
            const sev = Number(event.severity);
            const catColor = CAT_COLORS[event.category];
            const sevColor = getSeverityColor(sev);
            const isExpanded = expandedId === event.id;

            return (
              <article
                key={event.id}
                data-ocid={`events.card.${idx + 1}`}
                className="terminal-card rounded overflow-hidden"
                style={{ borderColor: catColor?.border }}
              >
                <button
                  type="button"
                  className="w-full px-3 py-2 flex items-center justify-between"
                  style={{ background: catColor?.bg }}
                  onClick={() => setExpandedId(isExpanded ? null : event.id)}
                  aria-expanded={isExpanded}
                >
                  <span
                    className="text-[10px] font-mono font-bold tracking-widest"
                    style={{ color: catColor?.text }}
                  >
                    {event.category.toUpperCase()}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono text-muted-foreground">
                      {new Date(
                        Number(event.timestamp) / 1_000_000,
                      ).toLocaleDateString()}
                    </span>
                    {isExpanded ? (
                      <ChevronUp className="w-3 h-3 text-muted-foreground" />
                    ) : (
                      <ChevronDown className="w-3 h-3 text-muted-foreground" />
                    )}
                  </div>
                </button>

                <div className="p-3 space-y-2">
                  <h3 className="text-sm font-semibold leading-tight">
                    {event.title}
                  </h3>

                  <div className="flex items-center gap-1.5 text-[10px] font-mono text-muted-foreground">
                    <MapPin className="w-3 h-3" />
                    <span>
                      {event.region} \u00b7 {event.country}
                    </span>
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between text-[10px] font-mono">
                      <span className="text-muted-foreground">SEVERITY</span>
                      <span style={{ color: sevColor }}>{sev}/10</span>
                    </div>
                    <div className="h-1 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all"
                        style={{ width: `${sev * 10}%`, background: sevColor }}
                      />
                    </div>
                  </div>

                  {isExpanded && (
                    <div className="pt-2 space-y-2 border-t border-border">
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        {event.description}
                      </p>
                      {event.tags.length > 0 && (
                        <div className="flex items-center gap-1 flex-wrap">
                          <Tag className="w-3 h-3 text-muted-foreground" />
                          {event.tags.map((tag) => (
                            <span
                              key={tag}
                              className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-muted text-muted-foreground"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </article>
            );
          })}
          {events?.length === 0 && (
            <div className="col-span-3 text-center py-16 text-muted-foreground text-sm">
              No events found for the selected category
            </div>
          )}
        </div>
      )}
    </div>
  );
}
