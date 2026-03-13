import { useQuery } from "@tanstack/react-query";
import {
  type CorrelationChain,
  type CountryRiskProfile,
  type GlobalEvent,
  type InfluenceEdge,
  type MarketImpact,
  type PolicyEntry,
  type Scenario,
  type SentimentRecord,
  Variant_climate_trade_geopolitics_military_technology_economic_policy,
  policyType,
} from "../backend.d";
import { useActor } from "./useActor";

export type EventCategory =
  Variant_climate_trade_geopolitics_military_technology_economic_policy;
export {
  Variant_climate_trade_geopolitics_military_technology_economic_policy as EventCategoryEnum,
};
export { policyType as PolicyTypeEnum };

export function useDashboardSummary() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["dashboardSummary"],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getDashboardSummary();
    },
    enabled: !!actor && !isFetching,
    refetchInterval: 30000,
  });
}

export function useGlobalEvents(category: EventCategory | null = null) {
  const { actor, isFetching } = useActor();
  return useQuery<GlobalEvent[]>({
    queryKey: ["globalEvents", category],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllGlobalEvents(category);
    },
    enabled: !!actor && !isFetching,
    refetchInterval: 30000,
  });
}

export function useCorrelationChains() {
  const { actor, isFetching } = useActor();
  return useQuery<CorrelationChain[]>({
    queryKey: ["correlationChains"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllCorrelationChains();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useCountryRiskProfiles() {
  const { actor, isFetching } = useActor();
  return useQuery<CountryRiskProfile[]>({
    queryKey: ["countryRisk"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllCountryRiskProfiles();
    },
    enabled: !!actor && !isFetching,
    refetchInterval: 60000,
  });
}

export function useScenarios(triggerEventId: string | null = null) {
  const { actor, isFetching } = useActor();
  return useQuery<Scenario[]>({
    queryKey: ["scenarios", triggerEventId],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getScenarios(triggerEventId);
    },
    enabled: !!actor && !isFetching,
  });
}

export function useInfluenceEdges() {
  const { actor, isFetching } = useActor();
  return useQuery<InfluenceEdge[]>({
    queryKey: ["influenceEdges"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllInfluenceEdges();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useMarketImpacts(eventId: string | null = null) {
  const { actor, isFetching } = useActor();
  return useQuery<MarketImpact[]>({
    queryKey: ["marketImpacts", eventId],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getMarketImpacts(eventId);
    },
    enabled: !!actor && !isFetching,
  });
}

export function usePolicyEntries(policyTypeFilter: policyType | null = null) {
  const { actor, isFetching } = useActor();
  return useQuery<PolicyEntry[]>({
    queryKey: ["policyEntries", policyTypeFilter],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllPolicyEntries(policyTypeFilter);
    },
    enabled: !!actor && !isFetching,
  });
}

export function useSentimentRecords(region: string | null = null) {
  const { actor, isFetching } = useActor();
  return useQuery<SentimentRecord[]>({
    queryKey: ["sentimentRecords", region],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getSentimentRecords(region);
    },
    enabled: !!actor && !isFetching,
  });
}

export function useCorrelationsForEvent(eventId: string) {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["eventCorrelations", eventId],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getCorrelationsForEvent(eventId);
    },
    enabled: !!actor && !isFetching && !!eventId,
  });
}
