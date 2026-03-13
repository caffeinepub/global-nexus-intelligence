import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface GlobalEvent {
    id: string;
    lat: number;
    lng: number;
    region: string;
    title: string;
    country: string;
    tags: Array<string>;
    description: string;
    timestamp: Time;
    category: Variant_climate_trade_geopolitics_military_technology_economic_policy;
    severity: bigint;
}
export type Time = bigint;
export interface ScenarioOutcome {
    probability: number;
    title: string;
    timelineWeeks: bigint;
    description: string;
    sectorsImpacted: Array<string>;
}
export interface PolicyEntry {
    id: string;
    title: string;
    country: string;
    policyType: policyType;
    marketImpact: string;
    description: string;
    severity: bigint;
    effectiveDate: Time;
}
export interface SentimentRecord {
    id: string;
    region: string;
    country: string;
    sentimentScore: number;
    source: string;
    recordedAt: Time;
    narrativeTheme: string;
}
export interface MarketImpact {
    id: string;
    eventId: string;
    industryImpacts: Array<IndustryImpact>;
    createdAt: Time;
    eventTitle: string;
    commodityImpacts: Array<CommodityImpact>;
}
export interface CountryRiskProfile {
    country: string;
    socialUnrest: number;
    politicalStability: number;
    lastUpdated: Time;
    militaryActivity: number;
    countryCode: string;
    sanctionsRisk: number;
    overallRisk: number;
    tradeDependency: number;
    economicScore: number;
}
export interface CommodityImpact {
    direction: Variant_up_down_neutral;
    commodity: string;
    magnitude: number;
}
export interface InfluenceEdge {
    id: string;
    relationship: string;
    description: string;
    strength: number;
    entityType: Variant_country_institution_corporation;
    targetEntity: string;
    sourceEntity: string;
}
export interface IndustryImpact {
    direction: Variant_up_down_neutral;
    magnitude: number;
    industry: string;
    reason: string;
}
export interface Scenario {
    id: string;
    title: string;
    createdAt: Time;
    outcomes: Array<ScenarioOutcome>;
    triggerEventId: string;
}
export interface CorrelationStep {
    eventId: string;
    description: string;
    stepLabel: string;
}
export interface EventCorrelation {
    id: string;
    targetEventId: string;
    sourceEventId: string;
    description: string;
    strength: number;
    relationshipType: string;
}
export interface UserProfile {
    name: string;
    role: string;
    organization: string;
}
export interface CorrelationChain {
    id: string;
    title: string;
    createdAt: Time;
    steps: Array<CorrelationStep>;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export enum Variant_climate_trade_geopolitics_military_technology_economic_policy {
    climate = "climate",
    trade = "trade",
    geopolitics = "geopolitics",
    military = "military",
    technology = "technology",
    economic = "economic",
    policy = "policy"
}
export enum Variant_country_institution_corporation {
    country = "country",
    institution = "institution",
    corporation = "corporation"
}
export enum Variant_up_down_neutral {
    up = "up",
    down = "down",
    neutral = "neutral"
}
export enum policyType {
    regulation = "regulation",
    tariff = "tariff",
    environmental = "environmental",
    sanction = "sanction",
    export_ = "export",
    monetary = "monetary"
}
export interface backendInterface {
    addGlobalEvent(event: GlobalEvent): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    createScenario(scenario: Scenario): Promise<void>;
    getAllCorrelationChains(): Promise<Array<CorrelationChain>>;
    getAllCountryRiskProfiles(): Promise<Array<CountryRiskProfile>>;
    getAllGlobalEvents(category: Variant_climate_trade_geopolitics_military_technology_economic_policy | null): Promise<Array<GlobalEvent>>;
    getAllInfluenceEdges(): Promise<Array<InfluenceEdge>>;
    getAllPolicyEntries(policyType: policyType | null): Promise<Array<PolicyEntry>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getCorrelationsForEvent(eventId: string): Promise<Array<EventCorrelation>>;
    getCountryRiskByCode(code: string): Promise<CountryRiskProfile>;
    getDashboardSummary(): Promise<{
        totalEvents: bigint;
        highRiskCountries: Array<CountryRiskProfile>;
        activeScenarios: bigint;
        avgGlobalRisk: number;
    }>;
    getEventById(id: string): Promise<GlobalEvent>;
    getMarketImpacts(eventId: string | null): Promise<Array<MarketImpact>>;
    getScenarioById(id: string): Promise<Scenario>;
    getScenarios(triggerEventId: string | null): Promise<Array<Scenario>>;
    getSentimentRecords(region: string | null): Promise<Array<SentimentRecord>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    updateCountryRisk(profile: CountryRiskProfile): Promise<void>;
}
