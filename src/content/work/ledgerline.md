---
client: Ledgerline
headline: Reconciliation that runs itself
summary: A payments provider was closing its books by hand. We rebuilt the reconciliation pipeline behind 2M+ daily transactions — without a minute of downtime.
sector: Fintech
year: 2025
duration: 7 months
role: [Discovery, Backend, Infrastructure, Web app]
stack: [Go, PostgreSQL, Kafka, React, AWS]
results:
  - value: 3 days → 40 min
    label: Month-end close
  - value: 99.98%
    label: Uptime over 18 months
  - value: −62%
    label: Infrastructure cost
cover: ledger
quote:
  text: They rebuilt our reconciliation engine without a single minute of downtime — and they were the first vendor who told us what not to build.
  name: Daniel Weiss
  role: CTO, Ledgerline
order: 1
---

## The challenge

Ledgerline processes card and bank payments for about 1,400 merchants. Every month its finance team spent three days matching bank statements against internal ledgers in spreadsheets, and every quarter a mismatch slipped through to an audit.

The existing system was a nightly batch job written in 2016. It could not be paused, could not be re-run safely, and nobody on the current team had written it.

## What we did

We started with two weeks of discovery: shadowing the finance team, mapping every data source and replaying a year of historical data to find where the numbers drifted.

The new pipeline is event-driven. Transactions stream through Kafka into an append-only ledger in PostgreSQL; a matching engine written in Go reconciles them continuously and flags only the genuine exceptions. A small React app gives the finance team a review queue instead of a spreadsheet.

We ran old and new systems side by side for six weeks, compared every output, and switched over on a Tuesday morning. Nobody noticed — which was the point.

## The outcome

Month-end close went from three days to forty minutes. The pipeline has run at 99.98% uptime for eighteen months, and moving off oversized batch servers cut infrastructure cost by almost two thirds. Ledgerline's own engineers now own and extend the system.
