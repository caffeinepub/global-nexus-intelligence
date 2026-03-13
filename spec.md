# Global Nexus Intelligence

## Current State
New project — no existing code.

## Requested Changes (Diff)

### Add
- Full intelligence dashboard with dark Bloomberg Terminal-style UI
- Global Event Monitoring Engine: events with category, timestamp, geo-tag, severity
- AI Event Correlation Engine: knowledge graph linking events across domains with chain visualizations
- Global Trade & Supply Chain Monitor: shipping routes, commodity tracking, disruption alerts
- Policy & Regulation Tracker: policy changes with market impact analysis
- Social Sentiment Intelligence: sentiment scores by region with heatmap
- AI Geopolitical Risk Radar: per-country risk scoring (political, economic, military, trade, social)
- Scenario Simulation Engine: multi-scenario prediction with probability, timeline, impacted sectors
- Global Influence Network Map: interactive D3 force graph of country/corp/institution relationships
- Market Impact Analyzer: event → industry/sector/commodity impact assessment
- AI Dot Connection Timeline: causal chain visualization from micro-events to macro shifts
- Live news ticker component
- Multi-panel dashboard layout with sidebar navigation
- HTTP outcalls to fetch simulated live data feeds

### Modify
- N/A

### Remove
- N/A

## Implementation Plan
1. Backend: Store events, correlations, risk scores, scenarios, sentiment data, policy changes, influence network edges in Motoko
2. Backend: CRUD for events (category, title, description, region, coords, severity, timestamp)
3. Backend: Correlation chains (event IDs linked with relationship labels)
4. Backend: Country risk profiles (composite score + factor breakdown)
5. Backend: Scenarios (trigger event, outcomes with probability/timeline/sectors)
6. Backend: Influence network edges (source, target, relationship, strength)
7. Backend: Market impact records (event → industry impacts)
8. Backend: Policy tracker entries
9. Backend: Social sentiment records by region
10. Frontend: Dark theme dashboard with sidebar nav
11. Frontend: Global event feed with category filters
12. Frontend: D3 force-directed influence network graph
13. Frontend: D3 correlation chain timeline
14. Frontend: Country risk radar/heatmap table
15. Frontend: Scenario simulation panel
16. Frontend: Market impact analyzer panel
17. Frontend: Trade route map (SVG world map with route overlays)
18. Frontend: Social sentiment regional heatmap
19. Frontend: Live news ticker
20. Frontend: Policy tracker list with impact badges
