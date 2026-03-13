import { cn } from "@/lib/utils";
import { Link, useRouterState } from "@tanstack/react-router";
import {
  Beaker,
  ChevronRight,
  GitBranch,
  Globe,
  LayoutDashboard,
  MessageSquare,
  Network,
  Radio,
  ScrollText,
  ShieldAlert,
  TrendingUp,
} from "lucide-react";
import { LiveTicker } from "./LiveTicker";

const NAV_ITEMS = [
  { path: "/", label: "NEXUS OVERVIEW", icon: LayoutDashboard },
  { path: "/events", label: "GLOBAL EVENTS", icon: Globe },
  { path: "/correlations", label: "CORRELATIONS", icon: GitBranch },
  { path: "/risk", label: "RISK RADAR", icon: ShieldAlert },
  { path: "/scenarios", label: "SCENARIOS", icon: Beaker },
  { path: "/influence", label: "INFLUENCE MAP", icon: Network },
  { path: "/market", label: "MARKET IMPACT", icon: TrendingUp },
  { path: "/policy", label: "POLICY TRACKER", icon: ScrollText },
  { path: "/sentiment", label: "SENTIMENT", icon: MessageSquare },
];

export function Layout({ children }: { children: React.ReactNode }) {
  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background">
      {/* Sidebar */}
      <aside className="w-56 flex-shrink-0 flex flex-col border-r border-border bg-sidebar">
        {/* Logo */}
        <div className="p-4 border-b border-border flex-shrink-0">
          <div className="flex items-center gap-2">
            <div className="relative">
              <Radio className="w-5 h-5 text-[oklch(0.78_0.16_200)]" />
              <span className="live-pulse absolute -top-0.5 -right-0.5 w-1.5 h-1.5 rounded-full bg-[oklch(0.65_0.18_145)]" />
            </div>
            <div>
              <div className="text-[11px] font-mono font-semibold text-[oklch(0.78_0.16_200)] tracking-widest leading-none">
                GLOBAL NEXUS
              </div>
              <div className="text-[9px] font-mono text-muted-foreground tracking-widest">
                INTELLIGENCE
              </div>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto py-2">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive =
              item.path === "/"
                ? currentPath === "/"
                : currentPath.startsWith(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                data-ocid="nav.link"
                className={cn(
                  "flex items-center gap-3 px-4 py-2.5 text-[11px] font-mono font-medium tracking-widest transition-colors relative group",
                  isActive
                    ? "text-[oklch(0.78_0.16_200)] bg-[oklch(0.78_0.16_200/0.08)]"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/40",
                )}
              >
                {isActive && (
                  <span className="absolute left-0 top-0 bottom-0 w-0.5 bg-[oklch(0.78_0.16_200)]" />
                )}
                <Icon className="w-3.5 h-3.5 flex-shrink-0" />
                <span>{item.label}</span>
                {isActive && (
                  <ChevronRight className="w-3 h-3 ml-auto opacity-60" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-3 border-t border-border flex-shrink-0">
          <div className="text-[9px] font-mono text-muted-foreground/60 leading-relaxed">
            <div className="flex items-center gap-1 mb-1">
              <span className="live-pulse inline-block w-1.5 h-1.5 rounded-full bg-[oklch(0.65_0.18_145)]" />
              <span>SYSTEM ONLINE</span>
            </div>
            <a
              href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(typeof window !== "undefined" ? window.location.hostname : "")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-muted-foreground transition-colors"
            >
              Built with caffeine.ai
            </a>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <main className="flex-1 overflow-y-auto">{children}</main>
        <LiveTicker />
      </div>
    </div>
  );
}
