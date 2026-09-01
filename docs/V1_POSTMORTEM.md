# Loom AI v1 — Postmortem

v1 is preserved at tag `v1-final` and branch `archive/v1` — not deleted. It
remains deployable as a fallback and its ingestion/export code may be
salvageable even though its domain model was wrong. This document exists
so the seven failures below don't recur once someone new touches this
project.

## What v1 was

A textile analytics platform built against a **spinning-mill-shaped**
domain model (RingFrame/Vortex/Toyota machine types, "units" of
production) with genuinely good engineering underneath it: real Postgres
constraints, a real pytest suite with exact numeric assertions, and a
properly grounded LLM assistant that computed numbers deterministically
before ever calling an LLM. The engineering practices were not the
problem. The domain model was.

## The seven failures (F1–F7)

**F1 — Wrong domain.** Machines were named `RF-01…RF-12` (RingFrame),
`VTX-01…VTX-11` (Vortex), `TOY-01…` (Toyota) — these are **spinning**
machine types. ATM is a **weaving** operation
(Tsudakoma airjet 810/910 + Sulzer 340/280/TS/SZ). The breakdown reason
list ("Traveller change work", "Bobbin shortage", "Loom runout") was
spinning-floor vocabulary, not weaving. No amount of UI polish fixes a
system built for the wrong machines.

*Root cause:* the schema was designed generically ("machine", "unit" of
output) instead of grounded in the client's actual floor and actual report
formats from day one. **Lesson for v2: domain vocabulary comes from the
client's own sheets before a single table is drawn.**

**F2 — Uniform synthetic data.** Every loom in a class produced
near-identical numbers. This isn't a cosmetic bug — it destroys the
product's reason to exist: nothing to rank, no worst loom, no findable
action. **Lesson: demo/seed data generators need explicit per-entity
persistent random effects with a real tail (chronic-bad performers, not
just noise around a mean), and a test asserting that spread exists** — not
just a test that no two rows are byte-identical (which a uniform
distribution with float noise can still pass).

**F3 — Wrong unit of production.** v1 counted "units". Weaving is
measured in metres and kilo-picks, yarn in kg, despatch in rolls.
"57,810 units" means nothing to a weaving master. **Lesson: unit labels
are not a formatting detail, they're domain correctness — every number
needs its unit carried with it end-to-end, never inferred.**

**F4 — Misread the client's own list of questions as a chatbot menu.**
Every one of the 23 business questions ends "with suggestions" — they are
23 analytic modules with a required output contract (answer + evidence +
cause + action + ₹ impact + owner), not free-text queries for a search
box. **Lesson: read the client's own document as a spec, not as
inspiration.**

**F5 — Invalid comparisons presented as valid rankings.** Ranking a live
demo-data loom above a real prior-month MRM figure, in the same list, is
wrong even with an honest footnote — the ranking itself is the lie, and
the reader reads the ranking, not the footnote. **Lesson: cross-period and
cross-source comparisons must be structurally prevented (not just
labeled), by keeping them in genuinely separate UI blocks with their own
period stamps, or refusing the comparison outright.**

**F6 — Numbers that don't reconcile with each other on the same screen.**
Revenue, variance, and "revenue lost" didn't sum or relate correctly; MTD
figures and "vs yesterday" figures used inconsistent baselines. **Lesson:
reconciliation between every number on a screen is a testable invariant,
not a hope — write the test (`loss causes sum to headline`, etc.) and fail
the build on it.**

**F7 — Missing the actual operating reality.** No shift→loom→weaver
assignment, no style master (so efficiency comparisons across different
fabric constructions were meaningless), no stop-event lifecycle (so no
MTTR/MTBF — the single most persuasive thing a system like this can show a
mill that currently can't measure it at all), no roles, no offline
support, no Tamil. **Lesson: the operating model (who runs what, on what
schedule, reporting through what lifecycle) is not an enhancement to add
later — it's the substrate every other feature sits on, and it needs to
be right in the first schema.**

## What carries forward into v2

- The engineering discipline: real DB constraints, real tests with exact
  numeric assertions, deterministic-analytics-then-LLM-narrates pattern,
  provenance/source tagging on every row.
- Nothing else. The domain model, seed data, and page structure are
  rebuilt from the client's real weaving operation, not extended from a
  spinning-mill shape.

## Where v1 lives now

- Tag: `v1-final`
- Branch: `archive/v1` (pushed to `origin`)
- Still deployable as-is if v2 isn't ready before a mill visit.
