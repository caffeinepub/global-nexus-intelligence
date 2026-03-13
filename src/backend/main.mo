import Array "mo:core/Array";
import Map "mo:core/Map";
import Text "mo:core/Text";
import Time "mo:core/Time";
import Float "mo:core/Float";
import Order "mo:core/Order";
import Runtime "mo:core/Runtime";
import Principal "mo:core/Principal";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

actor {
  // Initialize the access control system
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // User Profile Type
  public type UserProfile = {
    name : Text;
    organization : Text;
    role : Text;
  };

  let userProfiles = Map.empty<Principal, UserProfile>();

  // User Profile Management
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // Type Definitions
  type GlobalEvent = {
    id : Text;
    title : Text;
    description : Text;
    category : {
      #geopolitics;
      #trade;
      #policy;
      #economic;
      #military;
      #technology;
      #climate;
    };
    region : Text;
    country : Text;
    lat : Float;
    lng : Float;
    severity : Nat;
    timestamp : Time.Time;
    tags : [Text];
  };

  type EventCorrelation = {
    id : Text;
    sourceEventId : Text;
    targetEventId : Text;
    relationshipType : Text;
    strength : Float;
    description : Text;
  };

  type CorrelationStep = {
    eventId : Text;
    stepLabel : Text; // changed to 'stepLabel' from 'label'
    description : Text;
  };

  type CorrelationChain = {
    id : Text;
    title : Text;
    steps : [CorrelationStep];
    createdAt : Time.Time;
  };

  type CountryRiskProfile = {
    country : Text;
    countryCode : Text;
    politicalStability : Float;
    economicScore : Float;
    militaryActivity : Float;
    tradeDependency : Float;
    sanctionsRisk : Float;
    socialUnrest : Float;
    overallRisk : Float;
    lastUpdated : Time.Time;
  };

  type ScenarioOutcome = {
    title : Text;
    description : Text;
    probability : Float;
    timelineWeeks : Nat;
    sectorsImpacted : [Text];
  };

  type Scenario = {
    id : Text;
    triggerEventId : Text;
    title : Text;
    outcomes : [ScenarioOutcome];
    createdAt : Time.Time;
  };

  type InfluenceEdge = {
    id : Text;
    sourceEntity : Text;
    targetEntity : Text;
    entityType : {
      #country;
      #corporation;
      #institution;
    };
    relationship : Text;
    strength : Float;
    description : Text;
  };

  type IndustryImpact = {
    industry : Text;
    direction : { #up; #down; #neutral };
    magnitude : Float;
    reason : Text;
  };

  type CommodityImpact = {
    commodity : Text;
    direction : { #up; #down; #neutral };
    magnitude : Float;
  };

  type MarketImpact = {
    id : Text;
    eventId : Text;
    eventTitle : Text;
    industryImpacts : [IndustryImpact];
    commodityImpacts : [CommodityImpact];
    createdAt : Time.Time;
  };

  type policyType = {
    #tariff;
    #sanction;
    #regulation;
    #monetary;
    #environmental;
    #export;
  };

  type PolicyEntry = {
    id : Text;
    title : Text;
    country : Text;
    policyType : policyType;
    description : Text;
    marketImpact : Text;
    effectiveDate : Time.Time;
    severity : Nat;
  };

  type SentimentRecord = {
    id : Text;
    region : Text;
    country : Text;
    sentimentScore : Float;
    narrativeTheme : Text;
    source : Text;
    recordedAt : Time.Time;
  };

  // Data Stores
  let globalEvents = Map.empty<Text, GlobalEvent>();
  let eventCorrelations = Map.empty<Text, EventCorrelation>();
  let correlationChains = Map.empty<Text, CorrelationChain>();
  let countryRiskProfiles = Map.empty<Text, CountryRiskProfile>();
  let scenarios = Map.empty<Text, Scenario>();
  let influenceEdges = Map.empty<Text, InfluenceEdge>();
  let marketImpacts = Map.empty<Text, MarketImpact>();
  let policyEntries = Map.empty<Text, PolicyEntry>();
  let sentimentRecords = Map.empty<Text, SentimentRecord>();

  module Float {
    public func compare(left : Float, right : Float) : Order.Order {
      if (left < right) {
        #less;
      } else if (left > right) {
        #greater;
      } else {
        #equal;
      };
    };
  };

  // Global Events API
  public query ({ caller }) func getAllGlobalEvents(category : ?{
    #geopolitics;
    #trade;
    #policy;
    #economic;
    #military;
    #technology;
    #climate;
  }) : async [GlobalEvent] {
    // Public read access - no authorization check needed
    globalEvents.values().toArray().filter(
      func(event) {
        switch (category) {
          case (null) { true };
          case (?cat) { event.category == cat };
        };
      }
    );
  };

  public query ({ caller }) func getEventById(id : Text) : async GlobalEvent {
    // Public read access - no authorization check needed
    switch (globalEvents.get(id)) {
      case (null) { Runtime.trap("Event not found") };
      case (?event) { event };
    };
  };

  public shared ({ caller }) func addGlobalEvent(event : GlobalEvent) : async () {
    // Requires user role to add events
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can add global events");
    };
    if (globalEvents.containsKey(event.id)) { Runtime.trap("Event already exists") };
    globalEvents.add(event.id, event);
  };

  // Correlation Chains API
  public query ({ caller }) func getAllCorrelationChains() : async [CorrelationChain] {
    // Public read access - no authorization check needed
    correlationChains.values().toArray();
  };

  public query ({ caller }) func getCorrelationsForEvent(eventId : Text) : async [EventCorrelation] {
    // Public read access - no authorization check needed
    eventCorrelations.values().toArray().filter(
      func(corr) { corr.sourceEventId == eventId or corr.targetEventId == eventId }
    );
  };

  // Country Risk Profiles API
  public query ({ caller }) func getAllCountryRiskProfiles() : async [CountryRiskProfile] {
    // Public read access - no authorization check needed
    countryRiskProfiles.values().toArray();
  };

  public query ({ caller }) func getCountryRiskByCode(code : Text) : async CountryRiskProfile {
    // Public read access - no authorization check needed
    switch (countryRiskProfiles.get(code)) {
      case (null) { Runtime.trap("Country risk profile not found") };
      case (?profile) { profile };
    };
  };

  public shared ({ caller }) func updateCountryRisk(profile : CountryRiskProfile) : async () {
    // Admin-only: Country risk profiles are critical data
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update country risk profiles");
    };
    countryRiskProfiles.add(profile.countryCode, profile);
  };

  // Scenarios API
  public query ({ caller }) func getScenarios(triggerEventId : ?Text) : async [Scenario] {
    // Public read access - no authorization check needed
    scenarios.values().toArray().filter(
      func(scenario) {
        switch (triggerEventId) {
          case (null) { true };
          case (?tid) { scenario.triggerEventId == tid };
        };
      }
    );
  };

  public query ({ caller }) func getScenarioById(id : Text) : async Scenario {
    // Public read access - no authorization check needed
    switch (scenarios.get(id)) {
      case (null) { Runtime.trap("Scenario not found") };
      case (?scenario) { scenario };
    };
  };

  public shared ({ caller }) func createScenario(scenario : Scenario) : async () {
    // Requires user role to create scenarios
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can create scenarios");
    };
    scenarios.add(scenario.id, scenario);
  };

  // Influence Graph API
  public query ({ caller }) func getAllInfluenceEdges() : async [InfluenceEdge] {
    // Public read access - no authorization check needed
    influenceEdges.values().toArray();
  };

  // Market Impacts API
  public query ({ caller }) func getMarketImpacts(eventId : ?Text) : async [MarketImpact] {
    // Public read access - no authorization check needed
    marketImpacts.values().toArray().filter(
      func(impact) {
        switch (eventId) {
          case (null) { true };
          case (?eid) { impact.eventId == eid };
        };
      }
    );
  };

  // Policy Entries API
  public query ({ caller }) func getAllPolicyEntries(policyType : ?policyType) : async [PolicyEntry] {
    // Public read access - no authorization check needed
    policyEntries.values().toArray().filter(
      func(entry) {
        switch (policyType) {
          case (null) { true };
          case (?ptype) { entry.policyType == ptype };
        };
      }
    );
  };

  // Sentiment Records API
  public query ({ caller }) func getSentimentRecords(region : ?Text) : async [SentimentRecord] {
    // Public read access - no authorization check needed
    sentimentRecords.values().toArray().filter(
      func(record) {
        switch (region) {
          case (null) { true };
          case (?reg) { record.region == reg };
        };
      }
    );
  };

  // Dashboard Summary
  public query ({ caller }) func getDashboardSummary() : async {
    totalEvents : Nat;
    highRiskCountries : [CountryRiskProfile];
    activeScenarios : Nat;
    avgGlobalRisk : Float;
  } {
    // Public read access - no authorization check needed
    let eventsCount = globalEvents.size();
    let activeScenariosCount = scenarios.size();

    let highRisk = countryRiskProfiles.values().toArray().filter(
      func(profile) { profile.overallRisk > 7.0 }
    );

    let allRiskProfiles = countryRiskProfiles.values().toArray();
    let avgRisk = if (allRiskProfiles.size() == 0) {
      0.0;
    } else {
      let total = allRiskProfiles.foldLeft(
        0.0,
        func(acc, profile) { acc + profile.overallRisk }
      );
      total / allRiskProfiles.size().toFloat();
    };

    {
      totalEvents = eventsCount;
      highRiskCountries = highRisk;
      activeScenarios = activeScenariosCount;
      avgGlobalRisk = avgRisk;
    };
  };
};
