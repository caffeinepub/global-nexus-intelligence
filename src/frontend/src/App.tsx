import { Toaster } from "@/components/ui/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";
import { Layout } from "./components/Layout";
import { Correlations } from "./pages/Correlations";
import { GlobalEvents } from "./pages/GlobalEvents";
import { InfluenceMap } from "./pages/InfluenceMap";
import { MarketImpact } from "./pages/MarketImpact";
import { Overview } from "./pages/Overview";
import { PolicyTracker } from "./pages/PolicyTracker";
import { RiskRadar } from "./pages/RiskRadar";
import { Scenarios } from "./pages/Scenarios";
import { Sentiment } from "./pages/Sentiment";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { staleTime: 10000, retry: 1 },
  },
});

const rootRoute = createRootRoute({
  component: () => (
    <Layout>
      <Outlet />
    </Layout>
  ),
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: Overview,
});
const eventsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/events",
  component: GlobalEvents,
});
const correlationsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/correlations",
  component: Correlations,
});
const riskRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/risk",
  component: RiskRadar,
});
const scenariosRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/scenarios",
  component: Scenarios,
});
const influenceRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/influence",
  component: InfluenceMap,
});
const marketRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/market",
  component: MarketImpact,
});
const policyRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/policy",
  component: PolicyTracker,
});
const sentimentRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/sentiment",
  component: Sentiment,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  eventsRoute,
  correlationsRoute,
  riskRoute,
  scenariosRoute,
  influenceRoute,
  marketRoute,
  policyRoute,
  sentimentRoute,
]);

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
      <Toaster theme="dark" />
    </QueryClientProvider>
  );
}
