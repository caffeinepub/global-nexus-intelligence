import { Skeleton } from "@/components/ui/skeleton";
import { MessageSquare } from "lucide-react";
import { useSentimentRecords } from "../hooks/useQueries";

function SentimentBar({ score }: { score: number }) {
  const color =
    score > 0.2
      ? "oklch(0.65 0.18 145)"
      : score < -0.2
        ? "oklch(0.58 0.22 25)"
        : "oklch(0.75 0.18 70)";
  return (
    <div className="space-y-1">
      <div className="h-1.5 bg-muted rounded-full overflow-hidden relative">
        <div
          className="absolute top-0 bottom-0 w-px bg-border"
          style={{ left: "50%" }}
        />
        <div
          className="h-full rounded-full absolute top-0"
          style={{
            left: score >= 0 ? "50%" : `${((score + 1) / 2) * 100}%`,
            width: `${Math.abs(score) * 50}%`,
            background: color,
          }}
        />
      </div>
    </div>
  );
}

export function Sentiment() {
  const { data: records, isLoading } = useSentimentRecords();

  const grouped = new Map<string, typeof records>();
  for (const r of records ?? []) {
    const existing = grouped.get(r.region) ?? [];
    existing.push(r);
    grouped.set(r.region, existing);
  }

  const regions = Array.from(grouped.entries()).map(([region, recs]) => ({
    region,
    records: recs!,
    avgScore: recs!.reduce((s, r) => s + r.sentimentScore, 0) / recs!.length,
  }));

  function scoreColor(score: number) {
    if (score > 0.2) return "oklch(0.65 0.18 145)";
    if (score < -0.2) return "oklch(0.58 0.22 25)";
    return "oklch(0.75 0.18 70)";
  }

  function scoreLabel(score: number) {
    if (score > 0.4) return "POSITIVE";
    if (score > 0.1) return "SLIGHTLY POSITIVE";
    if (score < -0.4) return "NEGATIVE";
    if (score < -0.1) return "SLIGHTLY NEGATIVE";
    return "NEUTRAL";
  }

  return (
    <div className="p-6 space-y-5">
      <div>
        <h1 className="text-xl font-semibold tracking-tight">
          SENTIMENT INTELLIGENCE
        </h1>
        <p className="text-xs text-muted-foreground font-mono mt-0.5">
          SOCIAL SENTIMENT ANALYSIS \u00b7 REGIONAL HEAT MAP
        </p>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Skeleton key={i} className="h-48" />
          ))}
        </div>
      ) : (
        <div className="space-y-8">
          {regions.map(({ region, records: recs, avgScore }) => (
            <div key={region} className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <MessageSquare
                    className="w-4 h-4"
                    style={{ color: scoreColor(avgScore) }}
                  />
                  <span className="font-semibold text-sm tracking-wide">
                    {region.toUpperCase()}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span
                    className="text-[10px] font-mono tracking-widest"
                    style={{ color: scoreColor(avgScore) }}
                  >
                    {scoreLabel(avgScore)}
                  </span>
                  <span
                    className="text-xl font-mono font-bold"
                    style={{ color: scoreColor(avgScore) }}
                  >
                    {avgScore >= 0 ? "+" : ""}
                    {avgScore.toFixed(2)}
                  </span>
                </div>
              </div>

              <div className="h-2 bg-muted rounded-full overflow-hidden relative">
                <div
                  className="absolute top-0 bottom-0 w-0.5 bg-border/50"
                  style={{ left: "50%" }}
                />
                <div
                  className="h-full rounded-full absolute top-0"
                  style={{
                    left:
                      avgScore >= 0 ? "50%" : `${((avgScore + 1) / 2) * 100}%`,
                    width: `${Math.abs(avgScore) * 50}%`,
                    background: scoreColor(avgScore),
                    opacity: 0.8,
                  }}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                {recs.map((rec, idx) => (
                  <div
                    key={rec.id}
                    data-ocid={`sentiment.card.${idx + 1}`}
                    className="terminal-card rounded p-3 space-y-2"
                    style={{
                      borderColor: scoreColor(rec.sentimentScore)
                        .replace(")", " / 0.2)")
                        .replace("oklch(", "oklch("),
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <div className="font-medium text-xs">{rec.country}</div>
                      <span
                        className="text-sm font-mono font-bold"
                        style={{ color: scoreColor(rec.sentimentScore) }}
                      >
                        {rec.sentimentScore >= 0 ? "+" : ""}
                        {rec.sentimentScore.toFixed(2)}
                      </span>
                    </div>
                    <SentimentBar score={rec.sentimentScore} />
                    <div className="text-[10px] text-muted-foreground leading-relaxed">
                      {rec.narrativeTheme}
                    </div>
                    <div className="flex items-center justify-between text-[10px] font-mono text-muted-foreground/60">
                      <span>{rec.source}</span>
                      <span>
                        {new Date(
                          Number(rec.recordedAt) / 1_000_000,
                        ).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
          {regions.length === 0 && (
            <div className="text-center py-16 text-muted-foreground text-sm">
              No sentiment data available
            </div>
          )}
        </div>
      )}
    </div>
  );
}
