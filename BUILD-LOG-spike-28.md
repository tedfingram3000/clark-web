# BUILD-LOG-spike-28: SPIKE-28 research execution (clark-web)

- Session: Claude Code remote, 2026-09-05; branch `claude/spike-28-laqdxx` off `origin/main` @ `cc5e367`.
- Ticket: SPIKE-28 (Launch Tracker page `3af6bd7a-b9ee-8140-adbb-de207c1339ba`), Status To Do → In Progress at pickup → Testing at hand-off.
- Scope: research only. Deliverables = `reports/spike-28-claim-corpus.md`, `reports/spike-28-claim-corpus.csv`, `reports/spike-28-findings.md`, this log. No pipeline code, SKILL, validator or prompt change rides this branch.

## Pre-flight (ticket-pickup-preflight)

Searched open pipeline (To Do/Ready/Blocked/In Progress/Testing): prefix `SPIKE-` → 29, 30, 31, 32, 33, 34, 37 (unrelated infra spikes); keywords validator / Phase 2 / claim / editorial / schema → SCOUT-334.x, 336.x, 337.x, 316, 323, 326, 328, 340, 348, 349, 350 (all Testing/To Do). No shared file path (this ticket edits no code); no explicit dependency link; shared subsystem = Phase-2 claims / validator.
**VERDICT: 📋 PROCEED-WITH-CONTEXT** — SCOUT-336/337 + SPIKE-50 are a live partial implementation of the hypothesis; the findings are written against them (findings §1).

## Premise divergences (supervised-executor-build Step 0)

1. Phase 2 is no longer the monolith the ticket describes — slot-scoped writer flipped 08-21 (SCOUT-270.4) with a structured brief and per-unit JSON contract. Effect: the recommended change is a contract extension, not a rewrite.
2. Two claim kinds already have code-side producers (SCOUT-336 relations, SCOUT-337 league context; PR #412, ratified 09-03). Effect: the schema binds them, does not re-produce them.
3. The validator's special-case count roughly doubled since filing (findings §1 table). Effect: retirement list longer than eleven.
4. Defect record grew from 9 to 30 incidents. Effect: Step 3 replays 30.
5. The free-vs-structured 08-01 anecdote does not hold across the record (findings §4 T1).
6. Tooling: the pipeline repo could not be attached (session policy denied `add_repo`); validator function names and payload paths are cited from ticket bodies, flagged in the findings' Source Evidence for re-verification at build time.

## Method log

- Extracted every `PHASE2_SLOT` span from 119 web pages + 129 email files → `slots.json` (scratchpad); sample = 11 game days (07-08 … 09-04) → 1,995 sentences after splitter fixes (`vs.`, name suffixes, glued Key-Matchups sub-heads).
- Rule tagger (11 types) over all sentences; hand adjudication of 306 (all of 08-01 + seeded random 100 from the other ten days) with type / class / scope / payload family / note per row.
- Measured: (a)+(b) = 81.4% hand set; 85.0% projected; tagger type agreement 47%, claim-vs-non-claim agreement 88% (stated in the corpus doc). Kill criterion not met → Steps 3–5 executed.
- Defect replay: 30 Phase-2 claim incidents from the ticket record + clark-web correction commits; YES 25, YES* 3, NO 1 (findings §5).

## Self-check

- Every number in the findings is either computed by `measure.py`/`gen_corpus.py` from the labelled rows (FACT) or labelled JUDGMENT.
- Corpus doc and findings doc cross-checked for the same headline figures (81.4 / 85.0 / 18.6 / 11 types).
- Deliverables are `.md`/`.csv` under `reports/` — a new directory in this repo (it had none); no report mirror file touched.

## Decisions queued for Ted

1. Adopt the recommendation (sidecar, bounded subset, no renderer) or rule "don't" with the standing check budget named (findings §8).
2. Whether the Bottom Line pilot (child 5) files ahead of SCOUT-336/337's ledger PASS or after.
3. Whether child 7 (post-flip re-measure) is worth a second spike or folds into the pilot's telemetry week.
