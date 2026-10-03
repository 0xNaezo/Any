---
client: Orbital
headline: Real-time dispatch for 3,000 vehicles
summary: A logistics company outgrew its dispatch system. We designed a streaming platform that tracks every vehicle live and plans routes in milliseconds.
sector: Logistics
year: 2023
duration: 9 months
role: [Architecture, Backend, Web app, Infrastructure]
stack: [Go, Kafka, ClickHouse, Kubernetes, React]
results:
  - value: p95 < 120 ms
    label: Route planning latency
  - value: 2.4M
    label: Events processed daily
  - value: −17%
    label: Empty miles driven
cover: orbit
order: 4
---

## The challenge

Orbital's dispatchers watched vehicle positions refresh every two minutes and planned routes from experience. As the fleet passed 3,000 vehicles, the old system started to stall at peak hours.

## What we did

We replaced polling with a streaming pipeline: GPS events flow through Kafka into Go services that keep a live view of the fleet, with ClickHouse for analytics. A route-planning service answers in under 120 ms at the 95th percentile, and a React dashboard shows dispatchers the whole map live.

Everything runs on Kubernetes with autoscaling, dashboards and alerting the client's team can operate on their own.

## The outcome

The platform processes 2.4 million events a day, and smarter assignment cut empty miles by 17% in the first quarter.
