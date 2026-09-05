# SPIKE-28 findings — structured assertions for 700 Clark's Phase 2

**Research only.** This document recommends; it changes nothing. Any change it implies is a separate child ticket with its own prefix and gate (§10). Companion: `spike-28-claim-corpus.md` (method, per-claim rows) and `spike-28-claim-corpus.csv` (all 1,995 sentences).

Run 2026-09-05 in clark-web (branch `claude/spike-28-laqdxx`). The pipeline repo was not reachable from this session (the `add_repo` call was denied by the session policy), so the validator inventory and payload paths below come from the ticket record (SCOUT-115 … SCOUT-350, SPIKE-25/27/39/50) and from the tables the published web annotations sit under. Where a number below is a measurement it is labelled FACT with its source; where it is an estimate it is labelled JUDGMENT.

---

## 0. The answer in one paragraph

The claim space is small enough to schematize: **11 claim types cover 81% of reader-facing sentences** (hand-adjudicated, n = 306; 85% projected over 1,995), every scope those claims use is a key the payload already files a table under, and the schema would have made **25 of the 30 Phase-2 editorial defects on record mechanically detectable**. But the second half of the ticket's hypothesis — *render prose from the assertions* — should not be built: 19% of sentences are the voice (prediction, framing, interpretation), and a further large share of factual sentences carry a voice leg; a renderer either drops that or templates it. The recommendation is **schematize a bounded subset as an assertion sidecar**: Phase 2 keeps writing prose and, in the same JSON turn it already returns, lists the assertions the prose makes; Phase 3 verifies the assertions against the payload by value and path, and verifies the prose against the assertions by coverage. This is the same "assert alongside, verify both directions" shape the pipeline has been converging on since the ticket was filed (the brief's `numbers[].belongs_to`, SCOUT-334.3; `derived.relations`, SCOUT-336; the writer's output contract, SCOUT-326) — the spike's contribution is the measurement that says the shape is worth completing, and the list of which special-case checks it lets us retire.

---

## 1. Premise divergences at HEAD (2026-09-05 vs the 2026-08-01 filing)

The ticket was written against the monolithic Phase 2 and a validator with "2 general mechanisms + 11 special-case checks". Both halves have moved; the spike's method still applies, but its framing has to be read against the live architecture:

| ticket premise (08-01) | state at HEAD (09-05) | effect on the spike |
|---|---|---|
| Phase 2 is one free-writing call over the whole edition | **Flipped 08-21 (SCOUT-270.4):** a planning **brief** (structured JSON: items with `players`, `numbers[].belongs_to`, `relations[]` citations) → 24 slot-scoped writer units → deterministic assembly. Each unit returns JSON (declarations; `omissions[]` since SCOUT-326). | "Phase 2 emits structured assertions" is no longer a rewrite; it is an extension of an output contract that already exists. The brief *is* a coarse assertion layer for the email's three Bottom Line items. |
| Verification = parse the prose | Still true for most checks — but **SCOUT-336.1/.2/.3 and 337.1–.3 (built, PR #412, PROVISIONAL pending SPIKE-50 ratification — ratified 09-03 per the Strategic Decision Log)** invert the direction for two claim kinds: Phase 1.5 *computes* the relation / league context as data with a ready sentence; the writer copies; the check compares prose to the table. | Two of the eleven claim types (SPLIT_DIRECTION, MAGNITUDE) already have a code-side producer. The schema's job for those is binding, not production. |
| 11 special-case checks | The count has grown: platoon-direction leg (299), cross-team attribution (313), wrong-first-name gate (145 + .1/.2/.3), in-slot heading (203.2), vocabulary leak (333/340), redundancy gate (156/225 + .4/.5), hedge-derivation net (144 + .1/.2), relations-vs-table (336.3), magnitude (337.3 + .3.1), platoon-token binding (336.3.1), sentence-boundary pairing (336.3.2), plus an **editor desk** (LLM reviewer; 321/322/342) gating publish on factual BLOCKERs. | The "whack-a-mole" count Ted objected to has roughly doubled in five weeks. That strengthens the case for a claim-level mechanism, and it also means the retirement list (§7) is longer than the ticket's eleven. |
| Defect record = SCOUT-115, 130, 121.1, 129, 133, 138 + three from 08-01 | **ARCHIVE-CORRECTIONS** now runs past row 11; SCOUT-341/343–347 added five direction inversions from June–August; 09-01 → 09-04 added a wrong-subject Threat on four consecutive days, hand labels, a wrong-player table, a mis-attributed rank. | Step 3 replays 30 defects, not 9. |
| SCOUT-144 (owner-bound number grounding) "cheap, do regardless" | Shipped; its hedge net was narrowed (144.2) after two live false positives. | The Guerrero/.835 class is now caught by the general mechanism; it stays in the replay as a control. |
| The 08-01 anecdote: 3-of-3 defects in free email slots, 0 in bound web slots | Across the full record the split is roughly even (§5.1). | The "defect rate tracks slot freedom" observation does **not** survive the widened corpus; what tracks slot type is the defect *kind*. |

**Pre-flight (ticket-pickup-preflight, run 2026-09-05):** prefix `SPIKE-` siblings open are unrelated infra spikes (29–34, 37); subsystem-keyword siblings are the SCOUT-336/337 cluster and SCOUT-334.x (all Testing), no file overlap (this ticket edits no code), no explicit dependency. **Verdict: 📋 PROCEED-WITH-CONTEXT** — the spike must be read against 336/337 as the live partial answer, which this document does. Status flipped To Do → In Progress at pickup; → Testing at hand-off.

---

## 2. The candidate schema

### 2.1 An assertion

```
{
  claim_type:   STAT_VALUE | SPLIT_DIRECTION | MAGNITUDE | TREND | GAME_EVENT
              | GAME_STATE | BVP_HISTORY | ROSTER_FACT | ABSENCE,      # 9 checkable kinds
  subject:      <payload player id | team code | "lineup:STL" | "bullpen:STL">,   # an id, never a spelled name
  stat:         <stat dictionary key>            # SPIKE-50's stat_dictionary.json (434 fields, polarity_by_role)
  value:        <canonical number | {a, b} for a direction | {rank, n} for a magnitude | null for ABSENCE>,
  scope:        <closed set, §2.2>,
  payload_path: <JSON pointer the value was read from>,
  label:        <"stronger"|"weaker"|"above"|"below"|... for SPLIT_DIRECTION / MAGNITUDE only>,
  sentence_ref: <slot, sentence index>           # which sentence carries it
}
```

PREDICTION and FRAMING_VOICE are the two remaining types and are **not** assertions; they are what the writer is for. They are named in the enum so the coverage check (§2.4) can say "this sentence carries no assertion by design" instead of flagging it.

### 2.2 The scope set is closed — FACT (corpus)

Every scope used by the 249 checkable hand rows is one of: `season:2026`, `season:2025`, `career`, `hand:vs_L`, `hand:vs_R`, `venue:home`, `venue:away`, `tto:1|2|3`, `window:<trend candidate id>`, `series`, `yesterday`, `today`, `last_N_seasons` (head-to-head), plus a `floor:<constant name>` qualifier for ABSENCE. Each of these is exactly how the payload keys a table (`season_2026`, `platoon_2026.vs_lhp`, `historical.platoon_*_vs_hand`, `splits_2026.home/away/tto`, `trend_watch[i]`, `series_score`, `yesterday.*`, `head_to_head`). No hand row needed a free-text scope. The two sentences with no payload path at all (park-factor prose, 08-01 web) are not a scope problem; they are a no-source problem, already covered by the writer's kind-scoping omission rule (SCOUT-326).

This answers Threat 2 directly: **scope can be drawn from a closed set derived from the payload, so a schema cannot encode "0-2 in this series" against a `series_score` of "TOR leads 1-0" without the mismatch being a one-line comparison.**

### 2.3 What Phase 3 does with an assertion

1. **Resolve the path.** Re-read `payload_path`; if it does not resolve → `UNVERIFIED` (the CC-8 "label it" posture, SPIKE-27), never trusted.
2. **Compare by value.** Canonical numbers (`.815` = `0.815`; `103rd of 106` = `{103,106}`), not spellings — the exact lesson of SCOUT-334.3's false drops on 09-03/09-04.
3. **Recompute labels.** For SPLIT_DIRECTION with both figures present, recompute `label` from `{a, b}` and the stat's polarity-by-role (SPIKE-50 dictionary); for MAGNITUDE, compare `{rank, n}` to `derived.league_context`. A bare-direction assertion (label without figures) is a schema violation, not a WARN — the assertion form makes the SCOUT-336 "58% bare" class un-emittable rather than detectable.
4. **Check the subject against the slot contract.** Threat/Edge/Watch and every framed unit (SCOUT-315) declare the allowed subject side; an assertion whose subject is on the wrong team fails (generalizes 313, 322, 323.1, 334.3).
5. **Dedupe.** `(subject, claim_type, stat, scope)` repeated across sections → redundancy finding by construction (225.5's "one fact, one owner").

### 2.4 The prose side — coverage, not rendering

Two bounded checks bind prose to assertions without a renderer:

- **Coverage:** every number token, direction word (the 336 vocabulary) and comparator adjective (the 337 vocabulary) in a slot must lie in a sentence that carries at least one assertion. Uncovered → `UNASSERTED` (the writer said something it did not declare).
- **Scope vocabulary:** an assertion's scope must be spelled in its sentence from a small fixed vocabulary (`hand:vs_L` ⇒ "left-hand…/LHP/lefties"; `season:2025` ⇒ "2025/last season"; `career` ⇒ "career"). Mismatch → the 09-01 Freeman/Tucker class ("vs-RHP figure labelled against left-handed pitching") and the SCOUT-189 class ("career" on 2025-grained rates, 135 swaps in this repo) become mechanical.

Both checks read a closed vocabulary, not English. That is the difference from today's parsers, which must recover *meaning* from an unbounded sentence; these only have to find *tokens* the assertion already predicts.

---

## 3. Coverage — FACT (from `spike-28-claim-corpus.md` §3)

| stratum | n | (a) | (b) | (c) | (a)+(b) |
|---|---|---|---|---|---|
| all hand rows | 306 | 69.9% | 11.4% | 18.6% | **81.4%** |
| 2026-08-01 email | 43 | 67.4% | 14.0% | 18.6% | 81.4% |
| 2026-08-01 web | 163 | 69.3% | 11.7% | 19.0% | 81.0% |
| cross-day random sample (10 days) | 100 | 72.0% | 10.0% | 18.0% | 82.0% |
| free-prose slots | 179 | 65.9% | 12.3% | 21.8% | 78.2% |
| table-bound annotation slots | 127 | 75.6% | 10.2% | 14.2% | 85.8% |
| post-flip editions (slotted writer; n small) | 40 | 87.5% | 5.0% | 7.5% | 92.5% |
| projection, all 1,995 sentences | 1,995 | 73.0% | 12.0% | 15.0% | 85.0% |

The kill criterion ((a)+(b) < 70%) is not met on any stratum. The (b) middle is 11% and is dominated by **bare directions and bare magnitudes (21 of 35)** — the class SCOUT-336/337 exist to close — plus unscoped figures in the free summary slots (Quick Reference, Watchlist, Bottom Line) and two genuine scope mismatches. The (c) share is the voice and is largest exactly where Ted's readers meet the product (email 23%).

The post-flip stratum is small (40 rows) but points the right way: the slotted writer with its kind-scoping clause emits fewer voice-only and fewer scope-ambiguous sentences. That is consistent with SPIKE-39's measured result and should be re-measured on a larger post-flip sample before it is leaned on (§9, child 7).

---

## 4. Threats to validity — results

**T1. The free-vs-structured correlation is confounded.** Confirmed — it does not survive the record. Tallying the Phase-2 editorial defects on record by the slot they lived in (§5.1): ~14 in free slots, ~13 in table-bound annotation slots, over a corpus where the two families contribute almost equal sentence counts (980 vs 1,015 in the sample). What differs by slot family is the *kind*: bound slots produce direction inversions and wrong-scope table reads (07-18, 07-20, 07-31, 08-16, 08-18, 08-25, 09-01, 09-04); free slots produce wrong-subject, wrong-scope-of-game-state, attribution and name defects (08-01 ×3, 08-28, 08-29, 09-01→09-04 Threat). The 08-01 3-of-3 was a single day's coincidence. The schema hypothesis does not rest on it: the argument is per claim type, not per slot.

**T2. A schema can encode a wrong scope as easily as prose.** Refuted for this payload — §2.2. Scope is an enum of table keys; a wrong scope is a wrong key, and a wrong key either fails to resolve or resolves to a value that does not match. The residual risk is a *true* value under the *right* key described with the *wrong words* in prose (09-01 Freeman/Tucker), which is why §2.4's scope-vocabulary check is part of the recommendation and not optional.

**T3. Assertion-then-render degrades voice into template output.** Not tested by generation (research only), but the corpus puts a number on what is at stake: 18.6% of sentences carry no checkable claim at all, and the hand notes mark a voice or prediction "leg" on a further ~40 of the 249 checkable rows ("the power is real", "attack for outs", "could find themselves rolling weak grounders"). A renderer that emits prose *from* assertions has nothing to emit for those and would have to template around the rest. **Recommendation against rendering, stated without hedging** (§8). SCOUT-336/337's "ready sentence" fields are the right size of rendering: one copied clause per relation, inside prose the writer still owns.

**T4. Self-reported provenance only closes the loop if Phase 3 re-reads the path.** Confirmed as the design constraint, and the pipeline has already run the experiment: SCOUT-334's sourcing backstop re-reads the brief's cited values and on 09-03 produced a no-edition day and on 09-04 dropped all three Bottom Line items because it compared **spellings** ("103 of 106" vs "103rd of 106"; leading zeros). The loop closes; the comparison must be by canonical value and the path must be a pointer, not a description. Assertions whose path does not resolve are labelled, never dropped and never trusted (334.2's WARN-and-keep posture).

**T5 (found, not in the ticket). The schema verifies against the payload, so it inherits the payload's errors.** 09-02's wrong-Max-Muncy rows (SCOUT-330) would have verified cleanly. Upstream data identity is outside this mechanism; the census in `deep_scout_validator` and the retro-id fix own it.

---

## 5. Step 3 — defect replay against the schema

Legend: **YES** = a one-line comparison on the assertion catches it; **YES\*** = caught with the §2.4 scope-vocabulary or coverage check; **PARTIAL**; **NO**; **N/A** = not a Phase-2 claim defect (validator-precision bug or structural), noted for the retirement list.

| # | defect (ticket / date) | slot family | claim_type | the assertion that would have been emitted | detectable? |
|---|---|---|---|---|---|
| 1 | SCOUT-115/130 — Bart "HR in 4 PA"; row is a double (07-12) | bound (BvP annotation) | BVP_HISTORY | `{Bart, hr, 1, career, bvp[Bart]}` vs payload `hr: 0` | **YES** (value ≠ path) |
| 2 | SCOUT-121.1 — 2C quoted 30 / 250 PA floors (real 60); asserted "2026 leads" (07-27/28) | bound | ABSENCE | floor is `floor:PLATOON_2026_VS_HAND_FLOOR_PA`, a constant reference; a literal 30 in prose is uncovered → `UNASSERTED`; "2026 leads" is a scope precedence claim ⇒ scope field | **YES** |
| 3 | SCOUT-129 — clause segmenter merges on `digit;` | — | — | validator bug in a parser the sidecar replaces | **N/A → retires** |
| 4 | SCOUT-133 — name grounding WARN on "At Busch Stadium" | — | — | validator false positive; subjects become ids | **N/A → retires** for asserted subjects |
| 5 | SCOUT-138 — "Michael" Wetherholt, "Roel" Gastelum (07-31); SCOUT-145 ×3 (08-01); "Closer Kyle Holmes" (08-14) | both | (subject field) | subject is a payload id; the rendered name must equal the payload's full-name string for that id (SCOUT-317's rule, mechanized) | **YES** |
| 6 | 08-01 — Guerrero cited with Walker's .835 OPS (SCOUT-144) | free (email) | STAT_VALUE | `{Guerrero, ops, .835, season:2026, season_2026[Guerrero].ops}` → payload ≠ .835 | **YES** (control: also caught today by 144's owner constraint) |
| 7 | 08-01 — "now 0-2 in this series" vs `TOR leads 1-0` (SCOUT-143, canceled) | free (email) | GAME_STATE | `{STL, series_record, "0-2", series, series_score}` → mismatch | **YES** — the defect the general mechanisms are blind to |
| 8 | 08-01 — "an unknown throwing hand" (he is a LHP; SCOUT-142 data leg aside) | free (email) | ABSENCE | `{Mathews, throws, null, today, probable_pitchers[Mathews].throws}` → path holds `L` | **YES** — absence claims are assertions too (24 of 306 hand rows; all (a)) |
| 9 | SCOUT-156/225/225.5 — same fact in 3–4 sections (chronic; 09-03 Skubal ×4) | free | any | ledger dedupe on `(subject, claim_type, stat, scope)` | **YES** (already solved in the brief for numbers; 225.5's fact-level leg falls out for free) |
| 10 | SCOUT-203 — headings injected inside slots | — | — | structural; deterministic assembly (270) already solved it | **N/A** |
| 11 | 08-18 Burleson/Abbott; 08-25 Bassitt ×2; 09-02 Yamamoto ".533 his weaker side"; 06-14, 07-18, 07-20, 07-31, 08-16 (SCOUT-299/328/343–347) — nine platoon-direction inversions | bound (pitcher/batter platoon annotation) ×7, free (KM, Bottom Line) ×2 | SPLIT_DIRECTION | `{pitcher, ops_allowed, {a:.533,b:.573}, hand pair, label:"weaker vs L"}` → recompute from figures + polarity ⇒ label wrong | **YES** — and a *bare* inversion (no figures) is un-emittable under the schema; with SCOUT-336 the assertion is compared to `derived.relations` instead |
| 12 | 08-27 — Key Matchups BvP overclaim (editor BLOCKER, row 7) | free (web KM) | BVP_HISTORY + MAGNITUDE | BvP assertion with `pa` under `floor:BVP_DANGER_MIN_PA` cannot carry a "danger" label | **YES** |
| 13 | 08-28 headline; 08-29 KM — a pitcher's own teammates named as the threat against him (SCOUT-313) | free | (subject vs frame) | assertion subject team == frame pitcher team ⇒ contract violation | **YES** |
| 14 | 08-29 — Watchlist pitch-count window labelled as a batter count | free | TREND / STAT_VALUE | scope `window:<id>` carries its unit; prose unit word must match | **YES\*** |
| 15 | 08-29 — fabricated walk in the Gonzales BvP line | free | BVP_HISTORY | value vs path | **YES** |
| 16 | 08-30 — inverted PIT-vs-Ashcraft Key Matchups entry (deleted on Ted's order) | free | SPLIT_DIRECTION | as #11 | **YES** |
| 17 | 09-01 — Freeman/Tucker vs-RHP figures labelled "against left-handed pitching" (SCOUT-314/324) | bound | STAT_VALUE | assertion `scope: hand:vs_R` is true and resolves; the prose says LHP ⇒ scope-vocabulary mismatch | **YES\*** (needs §2.4; the assertion alone passes) |
| 18 | 09-01 — Threat section was a Dodgers scouting report; 09-03 Threat = Mathews/Burleson (STL facts); 09-04 Threat named McCarthy with Pagés' CS% (SCOUT-322/323.1/334.3) | free (email Bottom Line) | (subject vs slot contract) | Threat assertions' subjects must be opponent players; 09-04: `{McCarthy, cs_pct, 30.9, …, path→Pagés}` fails the subject/path identity check | **YES** — four consecutive days of the live bleeding class |
| 19 | 09-01 — both batted-ball notes served the wrong pitcher | bound | STAT_VALUE | subject ≠ the unit's frame subject | **YES** |
| 20 | 09-02 — Ohtani/Fermin hand labels; LAD handedness counts | both | ROSTER_FACT | `{player, bats, L, today, roster[...].bats}`; `{lineup:LAD, handedness, {4,3,2}}` vs `derived.relations.lineup_handedness` | **YES** |
| 21 | 09-02 — wrong Max Muncy's 2025 rows in the table and prose (SCOUT-330) | both | STAT_VALUE | assertion resolves to the wrong player's rows and verifies | **NO** — upstream identity error |
| 22 | 09-04 — Feltner credited with Pallante's "103rd of 180" home-ERA rank (SCOUT-337.3.1) | bound (home/away annotation) | MAGNITUDE | `{Feltner, era_home, {103,180}, season:2026, league_context.era_home[Feltner]}` → payload rank 168 | **YES** |
| 23 | 09-04 — Walker "0.815 after 520 PA" from a non-winner Trend Watch entry (SCOUT-348) | free | TREND | `scope: window:<candidate id>` must be a visible candidate | **YES** |
| 24 | SCOUT-189 — "career" printed on 2025-grained batted-ball rates (135 swaps in clark-web) | bound | STAT_VALUE | `scope: season:2025` from the table; prose "career" ⇒ vocabulary mismatch | **YES\*** |
| 25 | 08-16 — "roughly one in four" flagged as a hedged derivation (SCOUT-144.1/.2 false positives) | free | STAT_VALUE | assertion carries the canonical value (25.8) and the sentence's paraphrase is covered by it; the hedge net has nothing to do | **N/A → retires** |
| 26 | Pipeline-vocabulary leaks (SCOUT-333/340) and angle repeats (SCOUT-318/132) | — | FRAMING_VOICE | not claims | **N/A** — stays with the voice checks and the editor desk |

**Tally (Phase-2 claim defects only, #1–2, 5–9, 11–24 = 30 incidents counting the nine inversions and four Threats separately): YES 25, YES\* 3, NO 1, PARTIAL 0.** Of the four N/A rows, three are validator-precision bugs that retire with the parsers they live in.

### 5.1 Free vs bound, from the same table

Rows living in bound annotation slots: #1, 2, 11 (×7), 17, 19, 22, 24 ≈ 13. Rows in free slots: #6, 7, 8, 11 (×2), 12, 13 (×2), 14, 15, 16, 18 (×4), 23 ≈ 15. Names (#5) and redundancy (#9) span both. The sample corpus is 49% free / 51% bound by sentence count. **Slot freedom does not predict defect rate; it predicts defect kind** (T1).

---

## 6. What Phase 2 would have to emit, and what it already emits — JUDGMENT with FACT anchors

The writer's per-unit JSON contract already carries `declarations` (Rule 14) and `omissions[]` (SCOUT-326). The brief already carries `items[].players`, `items[].numbers[].belongs_to`, and `relations[]` citations (SCOUT-334.3, 336.2). An `assertions[]` list per unit is the same shape one level down: per sentence instead of per item, with a scope enum and a path. The writer already receives the paths — the extracts (`rows_for_players`), frames (SCOUT-315) and `derived.relations`/`league_context` rows are handed to it *with* their locations — so "cite the path you read" is a copy, not an inference.

Costs (JUDGMENT; re-derive at build time):

| item | estimate | anchor |
|---|---|---|
| output tokens per unit | + ~300–800 (≈ 10–20 assertions × 30–40 tokens) on units that today return ~1–3k tokens of prose + JSON | SPIKE-49 cut writer output 82–86% by disabling thinking (SCOUT-270.7), so headroom exists; the run-meta tripwire (>100K output) is the guard |
| prompt delta | one rule line ("every figure, direction and comparator you write is also an entry in `assertions[]`, with the path you read it from") plus the enum in SHARED_VOICE | prompt lane; Ted diff; measured delta must be ≤ the POLARITY block SCOUT-336.3 retired (~1.4k chars of brief input) |
| writer compliance risk | the same class as declarations/omissions: a field the model may leave empty | telemetry-only first (SCOUT-326's pattern), gate later (SCOUT-321's pattern) |
| Phase 3 | one new module (`check_assertions`: resolve, compare, recompute, subject contract, dedupe) + two prose-binding checks (coverage, scope vocabulary) | replaces parsers, §7 |
| renderer | **none** | §4 T3 |

---

## 7. Step 4 — what the sidecar lets us retire (the payoff test)

The ticket's rule: a schema that retires none of the special-case checks is a second mechanism, not a replacement. Against the eleven named in the ticket plus the checks added since:

| check (ticket) | fate under the sidecar | why |
|---|---|---|
| `check_hr_claim_grounding` (115/130) | **retires** | BVP_HISTORY value-vs-path |
| `check_platoon_2c_floor_direction` (121.1) | **retires** | floors are constant references; scope precedence is a field |
| `check_comparison_direction` (129) + platoon-direction leg (299) + `check_relations_against_table` (336.3) + 336.3.1/.3.2 fixes | **collapse into one**: recompute label from the assertion's figures, or compare to `derived.relations` | the direction is data on both sides; no clause segmentation, no sentence-boundary pairing, no "-handed pitching" token binding |
| `_check_catcher_consistency` | **retires** | ROSTER_FACT vs lineups |
| `_check_trend_watch_parity` / `_numbers` / `_check_trend_watch` (137.15) | **collapse** into TREND assertions bound to `window:<candidate id>` | parity = set comparison on ids; numbers = value-vs-path |
| `_check_player_set_parity` | **retires as a parser**, survives as a set comparison on assertion subjects | |
| `_check_historical_season_staleness` | **retires** | scope field + §2.4 vocabulary |
| `compute_tto_overuse_check`, `compute_angle_repeat_observation` (132) | **stay** | editorial-angle checks, not claims |
| `check_magnitude_claims` (337.3) | **collapses** into MAGNITUDE `{rank, n}` vs `league_context` | |
| Name Grounding (138) + wrong-first-name gate (145/.1/.2/.3) | **retire for asserted subjects**; stay as a visibility check on unasserted mentions | subjects are ids |
| hedge-derivation net (144/.1/.2) | **retires** | canonical values in the assertion |
| cross-team attribution (313), section-subject alignment (322), Threat subject (323.1), brief sourcing backstop (334.x) | **collapse** into the subject/slot-contract check | |
| Number grounding (`build_number_universe` → `validate_number`), SCOUT-144 owner constraint | **stays as the backstop** for numbers outside any assertion (derived arithmetic, reference constants — SPIKE-27's falsifier class) | |
| redundancy gate (156/225/225.4/225.5) | **collapses** into the ledger dedupe; operator override stays | |
| vocabulary leak (333/340), in-slot heading (203.2), editor desk (321/322/342) | **stay** | voice and structure, not claims |

Net: roughly **seven of the ticket's eleven** retire or collapse, and most of the checks added since 08-01 collapse with them, leaving two angle checks, the number-grounding backstop, the voice checks and the editor desk. That is a replacement, not a thirteenth check.

### 7.1 Migration path — slot by slot, telemetry before gate

1. **`bottom_line_content` (email Edge / Threat / Watch)** first. The brief already assigns each item's players and numbers; the wrong-subject Threat shipped on four consecutive days (09-01 → 09-04) and is the live bleeding class; the slot contract (opponent subjects for Threat) is the cheapest check in the set. Emit `assertions[]` here; telemetry-only for one week (SCOUT-326's pattern); then WARN; then gate on subject/path identity (SCOUT-321's factual-class pattern).
2. **`key_matchups` / `key_matchups_prose` (both surfaces)** — the densest claim slot (326 of 1,995 sentences), the home of the overclaim and wrong-side defects (#12, #13, #16 and two of the #11 inversions), and where bare directions concentrate.
3. **The platoon / TTO / home-away annotation family** — the direction-inversion home; here the assertion is compared to `derived.relations` once SCOUT-336.3 merges, so this leg is mostly binding work.
4. **`watchlist(_prose)`, `quick_reference`** — the unscoped-figure slots ((b) rows).
5. Leave the recap, Trend Watch, injuries/starters context and the remaining annotation slots on their existing bound checks until (1)–(4) have soaked; their defect density is low and their scope is already table-closed.

Every step is reversible: the sidecar is an additional field; dropping it restores today's behavior byte-for-byte.

---

## 8. Step 5 — recommendation

**Schematize a bounded subset — as an assertion sidecar, never as a renderer.**

- **Do** extend the slotted writer's output contract with `assertions[]` (§2.1), scope from the closed set (§2.2), path as a pointer; Phase 3 verifies assertions against the payload (§2.3) and prose against assertions (§2.4); roll out per §7.1; retire per §7.
- **Do not** build a prose renderer from assertions. The voice is 19–23% of sentences plus a leg on many more; SCOUT-336/337's copied "ready sentence" clauses are the right amount of rendering.
- **Do not** file the sidecar as a replacement for SCOUT-336/337 — they are its producers for two of the nine checkable kinds. The sidecar is the binding layer that lets the *other seven kinds* stop being parsed.
- **Standing budget if this is not adopted:** the alternative is explicit — every new sentence shape gets its own parser, at the current rate of roughly one new check per game week (≈ 20 check tickets between 08-01 and 09-04), each with its own false-positive history (129, 133, 144.1/.2, 145.2, 336.3.1/.3.2). If Ted rules "don't", that rate is the budget to write down.

**Transferable to Bases.Chat (noted, not scoped):** the same sidecar shape is what SPIKE-27 concluded literal-value matching cannot substitute for on the NLQ side, and CANVAS-BUILD-5.14's "seventh claim kind" is the same enum problem; the closed-scope finding (scope = table key) transfers directly because `DataPayload.result_sets` is keyed the same way.

---

## 9. What NOT to change

- The number-grounding and owner-constraint mechanisms (SCOUT-144) stay as the backstop for unasserted numbers.
- The editor desk (321/322/342) stays; it reads for the wrong-subject *section* and voice classes the sidecar does not claim.
- SCOUT-336/337 proceed as built; the sidecar consumes their output.
- The monolithic SKILL and the writer's voice rules are untouched by anything above; the one prompt-lane line is Ted's diff.

---

## 10. Child tickets the recommendation implies — titles and one-line scopes only, NOT filed by this spike

1. **SCOUT-: Assertion sidecar in the slotted writer's output contract** — each unit returns `assertions[]` `{claim_type, subject_id, stat, value, scope, payload_path, label, sentence_ref}`; enum + scope set as in-code constants; telemetry-only (diagnostics section beside Slot Frames / Unsourceable Omissions); prompt lane: one rule line, Ted diff.
2. **SCOUT-: `check_assertions` in Phase 3** — resolve path, compare canonical values, recompute direction labels from figures + `stat_dictionary.json` polarity, compare magnitudes to `league_context`, `UNVERIFIED` on unresolvable path; WARN class; frozen fixtures = the 08-01 email, 09-04 Threat, 09-02 Yamamoto, 09-04 Feltner pages (never live archive paths).
3. **SCOUT-: Prose↔assertion binding** — coverage (`UNASSERTED` numbers/direction words/comparators) and scope-vocabulary match; fixtures = 09-01 Freeman/Tucker page and one SCOUT-189 pre-correction page.
4. **SCOUT-: Slot subject contracts as data** — Threat/Edge/Watch and every framed unit declare allowed subject side/role; assertion subject outside the contract is a factual-class BLOCKER via SCOUT-321's gate; supersedes the parser legs of 313/322/323.1/334.3.
5. **SCOUT-: Bottom Line pilot** — enable 1–4 on `bottom_line_content` only, one week telemetry, then gate; scoreboard = wrong-subject Threats caught / missed on the ledger.
6. **SCOUT-: Parser retirement wave** — one PR per retired check in §7 with archive replay reported raw, sequenced after each slot's sidecar soaks.
7. **SPIKE-: Re-measure the post-flip corpus** — repeat the hand adjudication on ≥ 200 post-08-21 sentences to confirm the 92.5% (a)+(b) / 7.5% voice reading on a real sample before the slot-by-slot order in §7.1 is finalized.
8. **(Bases.Chat, note only) ARCH-: assertion sidecar on the editorial channel** — the same contract on the isolated editorial pass SPIKE-27 recommended; not scoped here.

---

## Source evidence

- Corpus: `reports/spike-28-claim-corpus.md`, `reports/spike-28-claim-corpus.csv` (this repo, generated 2026-09-05 from the published mirrors).
- Ticket record read live 2026-09-05: SPIKE-28, SPIKE-25/27/16 (the read-before-starting set), SPIKE-50, SCOUT-115, 121.1, 129, 130, 133, 138, 143, 144(.1/.2), 145(.1–.3), 156, 203, 225(.4/.5), 270(.1–.7), 299, 313–350 (open pipeline query), SCOUT-336(.1–.3), SCOUT-337(.1–.3, .2.1).
- clark-web archive-correction commits 2026-08-25 → 2026-09-04 (`git log`), BUILD-LOG-clarkweb-189.md (the 135 "career"→2025 swaps).
- Not read (unreachable from this session): `scripts/deep_scout_validator.py`, `data/*.json`, `ARCHIVE-CORRECTIONS.md`, `700CLARK-relational-claims-census-2026-09-02.md`. Function names and payload paths above are as cited in the ticket bodies; the build that follows re-verifies them at HEAD (supervised-executor-build Step 0).
