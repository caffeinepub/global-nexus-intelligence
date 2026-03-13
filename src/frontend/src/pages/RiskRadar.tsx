import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ArrowUpDown, Search } from "lucide-react";
import { useState } from "react";
import { useCountryRiskProfiles } from "../hooks/useQueries";

function riskColor(val: number): string {
  if (val > 0.66) return "oklch(0.58 0.22 25)";
  if (val > 0.33) return "oklch(0.75 0.18 70)";
  return "oklch(0.65 0.18 145)";
}

function RiskBadge({ value }: { value: number }) {
  const color = riskColor(value);
  const label = value > 0.66 ? "HIGH" : value > 0.33 ? "MEDIUM" : "LOW";
  return (
    <span
      className="inline-flex items-center px-2 py-0.5 text-[10px] font-mono font-bold rounded border"
      style={{
        color,
        borderColor: color.replace(")", " / 0.3)"),
        background: color.replace(")", " / 0.1)"),
      }}
    >
      {label} {(value * 10).toFixed(1)}
    </span>
  );
}

function ScoreCell({ value }: { value: number }) {
  const color = riskColor(value);
  return (
    <div className="flex items-center gap-1.5">
      <div className="h-1 w-12 bg-muted rounded-full overflow-hidden">
        <div
          className="h-full rounded-full"
          style={{ width: `${value * 100}%`, background: color }}
        />
      </div>
      <span className="text-[10px] font-mono w-6 text-right" style={{ color }}>
        {(value * 10).toFixed(0)}
      </span>
    </div>
  );
}

export function RiskRadar() {
  const { data: profiles, isLoading } = useCountryRiskProfiles();
  const [search, setSearch] = useState("");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");

  const filtered = profiles
    ? [...profiles]
        .filter(
          (p) =>
            p.country.toLowerCase().includes(search.toLowerCase()) ||
            p.countryCode.toLowerCase().includes(search.toLowerCase()),
        )
        .sort((a, b) =>
          sortDir === "desc"
            ? b.overallRisk - a.overallRisk
            : a.overallRisk - b.overallRisk,
        )
    : [];

  return (
    <div className="p-6 space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">RISK RADAR</h1>
          <p className="text-xs text-muted-foreground font-mono mt-0.5">
            GEOPOLITICAL RISK SCORING \u00b7 COUNTRY-LEVEL ANALYSIS
          </p>
        </div>
        {profiles && (
          <span className="text-[10px] font-mono text-muted-foreground border border-border px-2 py-1 rounded">
            {profiles.length} NATIONS MONITORED
          </span>
        )}
      </div>

      <div className="relative max-w-xs">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
        <Input
          data-ocid="risk.search_input"
          placeholder="Search country..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9 h-8 text-xs font-mono bg-muted/30 border-border"
        />
      </div>

      {isLoading ? (
        <Skeleton className="h-96" />
      ) : (
        <div
          data-ocid="risk.table"
          className="terminal-card rounded overflow-hidden"
        >
          <Table>
            <TableHeader>
              <TableRow className="border-border hover:bg-transparent">
                <TableHead className="text-[10px] font-mono tracking-widest text-muted-foreground w-8">
                  #
                </TableHead>
                <TableHead className="text-[10px] font-mono tracking-widest text-muted-foreground">
                  COUNTRY
                </TableHead>
                <TableHead className="text-[10px] font-mono tracking-widest text-muted-foreground">
                  POL.STAB
                </TableHead>
                <TableHead className="text-[10px] font-mono tracking-widest text-muted-foreground">
                  ECONOMIC
                </TableHead>
                <TableHead className="text-[10px] font-mono tracking-widest text-muted-foreground">
                  MILITARY
                </TableHead>
                <TableHead className="text-[10px] font-mono tracking-widest text-muted-foreground">
                  TRADE DEP
                </TableHead>
                <TableHead className="text-[10px] font-mono tracking-widest text-muted-foreground">
                  SANCTIONS
                </TableHead>
                <TableHead className="text-[10px] font-mono tracking-widest text-muted-foreground">
                  SOC.UNREST
                </TableHead>
                <TableHead>
                  <button
                    type="button"
                    className="text-[10px] font-mono tracking-widest text-muted-foreground flex items-center gap-1 hover:text-foreground transition-colors"
                    onClick={() =>
                      setSortDir(sortDir === "desc" ? "asc" : "desc")
                    }
                  >
                    OVERALL RISK
                    <ArrowUpDown className="w-3 h-3" />
                  </button>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((p, idx) => (
                <TableRow
                  key={p.countryCode}
                  className="border-border hover:bg-muted/10 transition-colors"
                >
                  <TableCell className="text-[10px] font-mono text-muted-foreground/50">
                    {idx + 1}
                  </TableCell>
                  <TableCell>
                    <div className="font-medium text-sm">{p.country}</div>
                    <div className="text-[10px] font-mono text-muted-foreground">
                      {p.countryCode}
                    </div>
                  </TableCell>
                  <TableCell>
                    <ScoreCell value={p.politicalStability} />
                  </TableCell>
                  <TableCell>
                    <ScoreCell value={p.economicScore} />
                  </TableCell>
                  <TableCell>
                    <ScoreCell value={p.militaryActivity} />
                  </TableCell>
                  <TableCell>
                    <ScoreCell value={p.tradeDependency} />
                  </TableCell>
                  <TableCell>
                    <ScoreCell value={p.sanctionsRisk} />
                  </TableCell>
                  <TableCell>
                    <ScoreCell value={p.socialUnrest} />
                  </TableCell>
                  <TableCell>
                    <RiskBadge value={p.overallRisk} />
                  </TableCell>
                </TableRow>
              ))}
              {filtered.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={9}
                    className="text-center text-muted-foreground text-sm py-12"
                  >
                    No countries found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
