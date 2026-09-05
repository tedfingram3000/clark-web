# SPIKE-28 claim corpus — reader-facing claims in 700 Clark's Phase-2 slots, classified

Research artifact for SPIKE-28 (research only; no pipeline change rides this file). Companion: `spike-28-findings.md` (schema, defect replay, costs, recommendation). Full per-sentence rows for all 1,995 sentences: `spike-28-claim-corpus.csv`.

## 1. Method

- **Source.** clark-web's own published mirrors (`YYYY-MM-DD.html` web pages and `email-YYYY-MM-DD.txt` email blocks). Every `<!-- PHASE2_SLOT: name --> … <!-- /PHASE2_SLOT -->` span was extracted, HTML-stripped and sentence-split (script in the session scratchpad; splitter protects decimals, `vs.`, and name suffixes). The pipeline repo (`700clark-pipeline`, `data/*.json`, the validator source) was not reachable from this session; payload paths below are named from the payload families documented in the ticket record (SCOUT-314/336/337, SPIKE-50) and from the tables the web annotations sit under.
- **Sample.** Eleven game days chosen systematically (every sixth game day plus 2026-08-01, the ticket's anchor): 07-08, 07-18, 07-24, 07-31, 08-01, 08-08, 08-15, 08-21, 08-27, 09-02, 09-04 — an 8.5-week span, both surfaces, straddling the 2026-08-21 flip from the monolithic Phase 2 to the slot-scoped writer (SCOUT-270.4). Total: **1,995 sentences** (980 in free-prose slots, 1,015 in table-bound annotation slots).
- **Unit.** One sentence ≈ one claim. Compound sentences are classified by their primary claim; secondary legs are noted. Key-Matchups sub-headings that the splitter glued to a sentence are left in place; four standalone heading fragments in the random sample are labelled voice (c).
- **Two passes.** (1) A rule-based tagger assigned every sentence a candidate claim type (numbers, stat tokens, direction words, magnitude words, event/state/roster/absence/prediction cues). (2) **Hand adjudication of 306 sentences**: all 206 sentences of 2026-08-01 (43 email, 163 web) plus a seeded random sample of 100 sentences from the other ten days. Each hand row records type, subject/value/scope, the payload family that would substantiate it, and the (a)/(b)/(c) class. The hand set is the measurement; the tagger is used only to project the hand rates onto the full corpus.
- **Classes (from the ticket).** (a) fully schematizable — type, subject, value, scope and payload path all expressible; (b) schematizable but scope-ambiguous — the sentence's value is real but its scope is unstated, inherited from a prior sentence, garbled, or its comparator is not in the payload; (c) not schematizable — prediction, framing, transitions, rhetorical questions, interpretation. **Scope rule used:** in a table-bound annotation slot the table's season/split header closes the scope, so an unscoped figure there is (a); in a free slot (Bottom Line, Key Matchups, Watchlist, recap, Quick Reference, Trend Watch) the scope must be in the sentence or it is (b).
- **Kill criterion (stated in the ticket):** recommend against if (a)+(b) < 70% under ≤ 12 claim types.

## 2. The candidate claim-type enum (11 types)

| # | claim_type | what it asserts | scope set it draws from | payload family |
|---|---|---|---|---|
| 1 | STAT_VALUE | a player/team stat value with a sample | season:2026 · season:2025 · career · hand:vs_L/vs_R · venue:home/away · tto:1/2/3 | season_2026, platoon_2026, historical.* split tables, kbb, batted_ball, defense, baserunning, battery, inherited_runners |
| 2 | SPLIT_DIRECTION | a direction between two figures of one subject (platoon side, home/away, season change, TTO trend, lineup-vs-lineup) | pair of the scopes above | derived.relations (SCOUT-336) — both figures |
| 3 | MAGNITUDE | a subject's position against a comparator population (elite, below league average, best in the lineup, team-leading) | population + season | league_benchmarks today; derived.league_context (SCOUT-337); rank within the slot's own table |
| 4 | TREND | a window-vs-baseline change or a pace/milestone | window:<detector id> | trend_watch candidates (P1/P6/P8/P9/P18 …) |
| 5 | GAME_EVENT | what happened in yesterday's game (line, play, inning, final) | yesterday | yesterday.box_score, linescore, plays |
| 6 | GAME_STATE | series score, streak, record, venue side, batting order, head-to-head | series · today · last N seasons | series_score, streak, standings, lineups, head_to_head |
| 7 | BVP_HISTORY | batter-vs-pitcher career line | career (bvp) | bvp rows |
| 8 | ROSTER_FACT | hand, position, experience, injury/transaction, lineup composition | today | roster.*.bats/throws, lineups, injuries, transactions |
| 9 | ABSENCE | a fact about missing data or a sample under a floor | any + floor constant | the empty row + the pipeline's floor constants |
| 10 | PREDICTION | a forward-looking judgment (class c) | — | — |
| 11 | FRAMING_VOICE | transition, headline, interpretation, rhetorical question (class c) | — | — |

Every scope value above is a key the payload already uses to file a table; no scope in the hand set needed a free-text field except the two unsourced park-factor sentences (see §4.4).

## 3. Results — hand-adjudicated set (n = 306)

| stratum | n | (a) fully schematizable | (b) scope-ambiguous | (c) not schematizable | (a)+(b) |
|---|---|---|---|---|---|
| All hand rows | 306 | 214 (69.9%) | 35 (11.4%) | 57 (18.6%) | **81.4%** |
| 2026-08-01, email (43 rows, all) | 43 | 29 (67.4%) | 6 (14.0%) | 8 (18.6%) | **81.4%** |
| 2026-08-01, web (163 rows, all) | 163 | 113 (69.3%) | 19 (11.7%) | 31 (19.0%) | **81.0%** |
| Cross-day random sample (100 rows, 10 days) | 100 | 72 (72.0%) | 10 (10.0%) | 18 (18.0%) | **82.0%** |
| Email surface, all rows | 65 | 42 (64.6%) | 8 (12.3%) | 15 (23.1%) | **76.9%** |
| Web surface, all rows | 241 | 172 (71.4%) | 27 (11.2%) | 42 (17.4%) | **82.6%** |
| Free-prose slots | 179 | 118 (65.9%) | 22 (12.3%) | 39 (21.8%) | **78.2%** |
| Table-bound annotation slots | 127 | 96 (75.6%) | 13 (10.2%) | 18 (14.2%) | **85.8%** |
| Pre-flip editions (< 08-21, monolith) | 266 | 179 (67.3%) | 33 (12.4%) | 54 (20.3%) | **79.7%** |
| Post-flip editions (≥ 08-21, slotted writer; small n) | 40 | 35 (87.5%) | 2 (5.0%) | 3 (7.5%) | **92.5%** |

**Headline: (a)+(b) = 81.4% of reader-facing sentences under an 11-type enum. The kill criterion (< 70%) is not met.** The (c) share — the voice — is 18.6% overall, 23.1% in the email, 21.8% in free slots, 14.2% in bound slots.

### 3.1 By claim type (hand set)

| claim_type | n | share | (a) | (b) | (c) | note |
|---|---|---|---|---|---|---|
| STAT_VALUE | 97 | 31.7% | 88 | 9 | 0 | the (b) rows are unscoped figures in free slots (Quick Reference, Watchlist, Bottom Line) and one vs-LHP figure offered as vs-RHP evidence |
| FRAMING_VOICE | 29 | 9.5% | 0 | 0 | 29 | class c; includes four heading fragments and four Quick-Reference question headers |
| ROSTER_FACT | 26 | 8.5% | 26 | 0 | 0 |  |
| PREDICTION | 25 | 8.2% | 0 | 0 | 25 | class c by definition |
| GAME_EVENT | 24 | 7.8% | 20 | 4 | 0 | (b) = derived readings of the game ('went quiet after the fifth', 'extended the run') |
| ABSENCE | 24 | 7.8% | 24 | 0 | 0 | every absence claim in the set is schematizable: an empty row plus the floor constant |
| SPLIT_DIRECTION | 22 | 7.2% | 11 | 11 | 0 | exactly half are BARE — a direction stated with fewer than two figures in the sentence (the SCOUT-336 class) |
| MAGNITUDE | 19 | 6.2% | 7 | 10 | 2 | (b) = adjective with no comparator in the payload (break-even rates, 'elite', 'among the best at the position'); (c) = park-factor claims with no payload path at all |
| GAME_STATE | 16 | 5.2% | 15 | 0 | 1 | the one (c) is an unsourced venue description |
| TREND | 14 | 4.6% | 14 | 0 | 0 | all trace to a Trend Watch candidate; the pace arithmetic checks out |
| BVP_HISTORY | 10 | 3.3% | 9 | 1 | 0 | the one (b) is an unscoped BvP line in the email Bottom Line |

### 3.2 What makes a claim (b) — all 35 rows

| id | surface | slot | type | reason |
|---|---|---|---|---|
| A005 | email | retrospective_commentary | GAME_EVENT | "went quiet beyond the fifth" = derived (0 runs after 5th); scope implicit |
| A013 | email | bottom_line_content | SPLIT_DIRECTION | BARE direction: no figure in sentence; scope inherited from earlier sentence |
| A020 | email | key_matchups_prose | SPLIT_DIRECTION | "notably weaker" vs RHB .664; other side in A015; scope word absent in sentence |
| A023 | email | key_matchups_prose | STAT_VALUE | SB counts + success%: scope stated once, not for the other two |
| A026 | email | watchlist_prose | STAT_VALUE | 15 HR 71 RBI; no scope word |
| A031 | email | watchlist_prose | MAGNITUDE | "primary power threat" bare comparator; "won two straight" = streak (a) |
| A047 | web | web_yesterday_recap | GAME_EVENT | derived "only production from those two" |
| A050 | web | web_yesterday_recap | GAME_EVENT | "no other run-scoring opportunities" undefined measure |
| A073 | web | platoon_cardinals_annotation | MAGNITUDE | "best matchup advantage" bare comparator |
| A075 | web | platoon_cardinals_annotation | STAT_VALUE | SCOPE MISMATCH: vs-LHP figure offered as evidence for vs-RHP |
| A077 | web | platoon_cardinals_annotation | SPLIT_DIRECTION | garbled scope parenthetical |
| A087 | web | pitcher_platoon_annotation | SPLIT_DIRECTION | BARE direction, no figures |
| A094 | web | tto_splits_annotation | SPLIT_DIRECTION | "unlike some starters" comparator unsourced; restated direction |
| A114 | web | baserunning_content | MAGNITUDE | "negative-value" needs break-even constant not in payload |
| A137 | web | batter_kbb_annotation | SPLIT_DIRECTION | lineup-vs-lineup, no figures |
| A146 | web | pitcher_kbb_annotation | MAGNITUDE | "elite" adjective without rank band |
| A154 | web | key_matchups | SPLIT_DIRECTION | BARE direction |
| A155 | web | key_matchups | MAGNITUDE | "most credible threat" bare |
| A160 | web | key_matchups | SPLIT_DIRECTION | 2026 figure absent in sentence |
| A163 | web | key_matchups | STAT_VALUE | Church clause vague |
| A165 | web | key_matchups | STAT_VALUE | free slot, scope word absent |
| A169 | web | key_matchups | MAGNITUDE | "tough to strike out" no figures |
| A183 | web | key_matchups | GAME_EVENT | "extended the run" derived |
| A191 | web | quick_reference | STAT_VALUE | summary slot, no season word |
| A194 | web | quick_reference | STAT_VALUE |  |
| S012 | web | quick_reference | STAT_VALUE | quick_reference free slot, no scope word |
| S019 | web | baserunning_content | MAGNITUDE | "~70% break-even" constant not in payload |
| S029 | web | batter_kbb_annotation | MAGNITUDE | "elite walk rates" no BB% figure |
| S038 | web | key_matchups | SPLIT_DIRECTION | BARE direction, no figures |
| S061 | email | bottom_line_content | BVP_HISTORY | email free slot, scope word absent; arithmetic consistent |
| S066 | email | bottom_line_content | SPLIT_DIRECTION | BARE "strongest platoon advantage" |
| S067 | web | key_matchups | STAT_VALUE | subject/stat elided ("Muncy's reads"); 09-02 wrong-Muncy day |
| S073 | web | tto_splits_annotation | SPLIT_DIRECTION | "highest-percentage window" derived, no figures |
| S077 | web | baserunning_content | MAGNITUDE | "risk threshold" undefined |
| S081 | web | defense_annotation | MAGNITUDE | "among the best at the position" — no league SS comparator in payload |

Of the 35 (b) rows, **21 are bare directions or bare magnitudes** (a direction/adjective with no figure or comparator in the sentence), **9 are unscoped figures in free slots**, **3 are derived game readings**, **2 are scope mismatches/garbles** (A075: a vs-LHP figure cited as vs-RHP evidence; A077). The bare-direction/magnitude class is the one SCOUT-336/337 are built to close by producing the relation or comparator as data.

### 3.3 Corpus-wide projection (n = 1,995)

Applying each tagger type's hand-measured (a)/(b)/(c) rates to all 1,995 sentences: **(a) 73.0% · (b) 12.0% · (c) 15.0% · (a)+(b) 85.0%**. Tagger quality, stated plainly: type agreement with the hand labels is 47% (it over-assigns SPLIT_DIRECTION to any sentence with a comparative word, and STAT_VALUE to game recaps), but claim-vs-non-claim agreement is 88%, which is what the projection depends on. The hand set is the number to quote; the projection says the hand set is not an outlier.

### 3.4 Full-corpus sentence counts by slot (tagger types)

| slot | family | n | STAT | DIR | MAG | TREND | EVENT | STATE | BVP | ROSTER | ABSENCE | PRED | VOICE |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| key_matchups | free | 211 | 39 | 67 | 9 | 16 | 4 | 14 | 13 | 12 | 6 | 15 | 16 |
| key_matchups_prose | free | 115 | 16 | 52 | 1 | 2 | 1 | 7 | 11 | 9 | 4 | 5 | 7 |
| quick_reference | free | 113 | 64 | 12 | 3 | 6 | 2 | 15 | 0 | 3 | 3 | 2 | 3 |
| watchlist_prose | free | 101 | 34 | 17 | 5 | 8 | 2 | 6 | 1 | 2 | 4 | 11 | 11 |
| baserunning_content | bound | 91 | 62 | 2 | 5 | 0 | 7 | 2 | 0 | 2 | 2 | 4 | 5 |
| platoon_opponent_annotation | bound | 88 | 16 | 48 | 4 | 1 | 0 | 2 | 5 | 8 | 1 | 0 | 3 |
| bottom_line_content | free | 86 | 17 | 25 | 5 | 8 | 1 | 7 | 2 | 8 | 0 | 9 | 4 |
| platoon_cardinals_annotation | bound | 79 | 12 | 32 | 9 | 1 | 0 | 5 | 5 | 9 | 4 | 0 | 2 |
| tto_splits_annotation | bound | 79 | 38 | 12 | 3 | 5 | 0 | 5 | 2 | 0 | 1 | 7 | 6 |
| season_context_starters | free | 71 | 42 | 8 | 7 | 1 | 0 | 3 | 2 | 4 | 2 | 0 | 2 |
| defense_annotation | bound | 71 | 24 | 2 | 3 | 1 | 20 | 11 | 0 | 8 | 2 | 0 | 0 |
| inherited_runners_annotation | bound | 63 | 33 | 2 | 18 | 1 | 1 | 1 | 1 | 0 | 2 | 2 | 2 |
| batted_ball_annotation | bound | 61 | 26 | 15 | 4 | 0 | 1 | 7 | 1 | 0 | 2 | 2 | 3 |
| batter_kbb_annotation | bound | 59 | 32 | 7 | 14 | 0 | 0 | 3 | 0 | 2 | 0 | 0 | 1 |
| pitcher_platoon_annotation | bound | 56 | 2 | 36 | 3 | 0 | 0 | 1 | 5 | 9 | 0 | 0 | 0 |
| bvp_cardinals_vs_starter_annotation | bound | 51 | 15 | 2 | 1 | 1 | 2 | 3 | 3 | 1 | 15 | 0 | 8 |
| battery_annotation | bound | 51 | 17 | 1 | 2 | 2 | 0 | 6 | 0 | 8 | 6 | 5 | 4 |
| season_context_injuries | free | 49 | 2 | 1 | 0 | 7 | 2 | 9 | 0 | 18 | 7 | 0 | 3 |
| batter_kbb_stl_note | bound | 48 | 22 | 5 | 12 | 1 | 0 | 7 | 0 | 0 | 1 | 0 | 0 |
| pitcher_home_away_annotation | bound | 47 | 11 | 20 | 2 | 0 | 0 | 7 | 0 | 0 | 0 | 3 | 4 |
| batter_batted_ball_profile_annotation | bound | 47 | 30 | 9 | 1 | 1 | 0 | 2 | 0 | 0 | 3 | 1 | 0 |
| trend_watch_prose | free | 47 | 8 | 5 | 2 | 18 | 1 | 2 | 0 | 0 | 0 | 4 | 7 |
| batter_batted_ball_profile_stl_note | bound | 45 | 23 | 9 | 1 | 1 | 0 | 3 | 0 | 0 | 6 | 0 | 2 |
| bvp_opponent_vs_starter_annotation | bound | 40 | 16 | 2 | 0 | 1 | 3 | 3 | 1 | 0 | 9 | 1 | 4 |
| pitcher_kbb_annotation | bound | 39 | 14 | 4 | 11 | 1 | 1 | 2 | 0 | 3 | 1 | 1 | 1 |
| head_to_head_content | free | 38 | 2 | 1 | 1 | 4 | 5 | 11 | 6 | 2 | 0 | 0 | 6 |
| report_card_recap | free | 37 | 18 | 0 | 2 | 2 | 7 | 2 | 0 | 0 | 0 | 0 | 6 |
| watchlist | free | 35 | 9 | 6 | 3 | 3 | 2 | 3 | 0 | 2 | 0 | 4 | 3 |
| web_yesterday_recap | free | 33 | 15 | 0 | 2 | 3 | 4 | 3 | 0 | 1 | 0 | 0 | 5 |
| prediction_grades_commentary | free | 26 | 18 | 0 | 0 | 0 | 7 | 0 | 0 | 0 | 0 | 0 | 1 |
| retrospective_commentary | free | 18 | 12 | 1 | 0 | 1 | 1 | 1 | 0 | 0 | 0 | 1 | 1 |

### 3.5 Bare-direction share, full corpus

Sentences the tagger reads as relational or magnitude: 536; with fewer than two numbers in the sentence: 88 (16.4%). The hand set puts the true bare share of SPLIT_DIRECTION at 11 of 22 (50%), consistent with the pipeline's own 09-02 census (58% of relational sentences bare across 99 editions, SCOUT-336). The tagger under-counts bareness because it counts any number in the sentence, not the two figures the direction needs.

## 4. Per-claim rows — the hand-adjudicated set (306)

Columns: id · date · surface · slot · type · class · scope · payload family · sentence · note. `A` rows are 2026-08-01 (A000–A042 email, A043–A205 web); `S` rows are the cross-day random sample.

| id | date | surf | slot | type | cls | scope | payload | sentence | note |
|---|---|---|---|---|---|---|---|---|---|
| A000 | 08-01 | email | report_card_recap | GAME_EVENT | a | yesterday | box_score/plays | Kyle Leahy gave the Cardinals every chance -- six innings, one earned run -- but the offense managed just one run on Walker's fifth-inning RBI single. | compound: Leahy 6 IP 1 ER + Walker RBI single 5th; "every chance" is voice |
| A001 | 08-01 | email | report_card_recap | GAME_EVENT | a | yesterday | linescore/plays | Toronto broke it open in the eighth on a pair of runs off Strzelecki, completing the series opener 3-1. | 2 runs 8th off Strzelecki; final 3-1; opener |
| A002 | 08-01 | email | retrospective_commentary | GAME_EVENT | a | yesterday | box_score | WHAT WORKED: Leahy was sharp -- 6.0 IP, 6 H, 1 ER, 1 BB, 3 K. | pitching line |
| A003 | 08-01 | email | retrospective_commentary | GAME_EVENT | a | yesterday | box_score | Church went 2-for-4 with a stolen base, providing the only consistent offensive threat. | 2-for-4 + SB; "only consistent threat" is voice |
| A004 | 08-01 | email | retrospective_commentary | GAME_EVENT | a | yesterday | plays | Walker's RBI single in the fifth was the lone Cardinals run. | lone run |
| A005 | 08-01 | email | retrospective_commentary | GAME_EVENT | b | yesterday | linescore | WHAT DIDN'T: The lineup went quiet beyond the fifth inning. | "went quiet beyond the fifth" = derived (0 runs after 5th); scope implicit |
| A006 | 08-01 | email | retrospective_commentary | GAME_EVENT | a | yesterday | box_score/linescore | Strzelecki allowed 2 ER on 2 BB in 1.0 IP in the eighth, turning a 1-1 tie into a two-run deficit. | 2 ER 2 BB 1.0 IP 8th; 1-1 -> deficit |
| A007 | 08-01 | email | retrospective_commentary | GAME_STATE | a | series/streak | series_score,streak | The Cardinals have lost two straight and trail this series 1-0. | L2 + trail 1-0 (correct here; the defect sentence lived in the pre-correction copy) |
| A008 | 08-01 | email | bottom_line_content | ROSTER_FACT | a | today | probable_pitchers | Quinn Mathews makes his major-league debut this afternoon. | MLB debut |
| A009 | 08-01 | email | bottom_line_content | GAME_STATE | a | last two seasons H2H | head_to_head | The left-hander faces a team the Cardinals have lost six straight to over the last two seasons. | six straight losses to TOR |
| A010 | 08-01 | email | bottom_line_content | STAT_VALUE | a | 2025 | pitcher_platoon 2025 | Kevin Gausman held left-handed batters to a .193 average and .586 OPS in 370 plate appearances in 2025, and the Cardinals are projected to line up six left-handed bats today. | compound: Gausman vs LHB .193/.586/370 PA + lineup six LHB (roster bats) |
| A011 | 08-01 | email | bottom_line_content | STAT_VALUE | a | 2026 season | season_2026,platoon_2026 | Burleson (.803 OPS this season, .942 vs RHP) and Walker (.835 OPS, 22 HR) are the most credible threats to change the equation. | Burleson .803/.942 vs RHP; Walker .835/22 HR; "most credible" is voice |
| A012 | 08-01 | email | bottom_line_content | STAT_VALUE | a | 2025 home | pitcher_home_away 2025 | WATCH: Gausman's home ERA at Rogers Centre was 3.76 in 2025 -- the Cardinals are the road team today. | 3.76 home ERA; road team = game_state |
| A013 | 08-01 | email | bottom_line_content | SPLIT_DIRECTION | b | implicit (Gausman 2025 splits) | pitcher_platoon 2025 | The three-bat right-handed portion of the lineup (Herrera, Walker, Winn) carries the platoon edge. | BARE direction: no figure in sentence; scope inherited from earlier sentence |
| A014 | 08-01 | email | bottom_line_content | PREDICTION | c | - | - | If the offense is going to find footing this afternoon, it runs through those three. | conditional judgment |
| A015 | 08-01 | email | key_matchups_prose | STAT_VALUE | a | 2025 | pitcher_platoon 2025 | Gausman held LHBs to .193/.247/.339 (.586 OPS) in 370 PA in 2025 -- a pronounced split against the majority of today's Cardinals order. | value (a); "pronounced split" relation has one side only -> relation leg is bare |
| A016 | 08-01 | email | key_matchups_prose | ROSTER_FACT | a | today | roster.bats/lineups | Wetherholt, Burleson, Nootbaar, Crooks, Gorman, and Church all bat left. | six named LHB |
| A017 | 08-01 | email | key_matchups_prose | BVP_HISTORY | a | career + 2026 | bvp,platoon_2026 | Burleson has a 7-PA career sample against Gausman (.286 AVG) and carries a .942 OPS vs right-handed pitching this season. | 7 PA .286 career vs Gausman; .942 vs RHP this season |
| A018 | 08-01 | email | key_matchups_prose | BVP_HISTORY | a | career | bvp | Nootbaar is 2-for-4 (.500) against Gausman in limited career looks. | 2-for-4 |
| A019 | 08-01 | email | key_matchups_prose | ABSENCE | a | career BvP vs threshold | bvp + constant | No Cardinals hitter clears the PA threshold for a full danger-bat designation. | danger-bat threshold (pipeline vocab leak, but schematizable) |
| A020 | 08-01 | email | key_matchups_prose | SPLIT_DIRECTION | b | implicit 2025 | pitcher_platoon 2025 | Gausman's splits versus right-handers were notably weaker -- .238/.290/.374 (.664 OPS, 405 PA). | "notably weaker" vs RHB .664; other side in A015; scope word absent in sentence |
| A021 | 08-01 | email | key_matchups_prose | BVP_HISTORY | a | career; 2026 | bvp,platoon_2026,roster | Walker (3-for-9 career vs Gausman), Herrera (.823 OPS vs LHP this season), and Winn are the three RHBs in the projected order. | Walker 3-for-9; Herrera .823 vs LHP (true but irrelevant vs RHP); RHB trio |
| A022 | 08-01 | email | key_matchups_prose | STAT_VALUE | a | 2026 season | season_2026,team table | Walker's 22 HR and team-leading 79 RBI make him the primary power threat among this group. | 22 HR / 79 RBI team-leading (rank within team derivable) |
| A023 | 08-01 | email | key_matchups_prose | STAT_VALUE | b | career (Springer) / unstated | baserunning | Springer (18 SB, 94.7% career success), Straw (12 SB, 92.3%), and Gimenez (12 SB, 85.7%) represent an active running game. | SB counts + success%: scope stated once, not for the other two |
| A024 | 08-01 | email | key_matchups_prose | ROSTER_FACT | a | career | roster/season games | Jimmy Crooks starts behind the plate with 14 games of MLB experience -- an untested combination against a Blue Jays team that has used the basepaths aggressively. | 14 games MLB experience; "aggressively" is bare magnitude (team SB rank) |
| A025 | 08-01 | email | watchlist_prose | STAT_VALUE | a | 2026 season | platoon_2026,season_2026 | Alec Burleson vs Gausman -- Burleson carries a .942 OPS vs right-handed pitching this season (.803 overall), making him the left-handed bat most likely to buck Gausman's LHB suppression. | .942 vs RHP / .803 |
| A026 | 08-01 | email | watchlist_prose | STAT_VALUE | b | implicit season | season_2026 | His 15 HR and 71 RBI show the power is real. | 15 HR 71 RBI; no scope word |
| A027 | 08-01 | email | watchlist_prose | ABSENCE | a | career | season/history rows empty | Quinn Mathews' command -- The debut cuts both ways -- no book on him for Toronto, but no big-league track record to lean on either. | debut = no MLB record |
| A028 | 08-01 | email | watchlist_prose | PREDICTION | c | - | - | His walk rate and ability to get through the Blue Jays' right-handed-heavy lineup will define the Cardinals' run prevention. |  |
| A029 | 08-01 | email | watchlist_prose | STAT_VALUE | a | career vs LHP | vs_hand career | Guerrero Jr vs Mathews -- Vladimir Guerrero Jr has hit .326/.428/.519 in 159 career plate appearances against left-handed pitching -- exactly what Mathews brings. | .326/.428/.519 in 159 PA |
| A030 | 08-01 | email | watchlist_prose | ABSENCE | a | career BvP | bvp rows empty | No one in this lineup has faced him before. | no one has faced him |
| A031 | 08-01 | email | watchlist_prose | MAGNITUDE | b | team | season_2026 team table | He is the Blue Jays' primary power threat in a lineup that has won two straight. | "primary power threat" bare comparator; "won two straight" = streak (a) |
| A032 | 08-01 | email | trend_watch_prose | FRAMING_VOICE | c | - | - | Riley O'Brien -- the surface holds, the indicators don't. |  |
| A033 | 08-01 | email | trend_watch_prose | TREND | a | last 19 outings vs season | trend_watch P9 | O'Brien's ERA over his last 19 outings (86 BF) sits at 3.93 vs a 3.50 season mark -- not alarming on its own. | window stated |
| A034 | 08-01 | email | trend_watch_prose | TREND | a | window | trend_watch P9 | But his strikeout rate has slipped from 24.5% to 22.1% in that window, while his walk rate has climbed from 9.6% to 16.3%. | K% BB% window vs season |
| A035 | 08-01 | email | trend_watch_prose | FRAMING_VOICE | c | - | - | The results are masking increasing contact and command vulnerability. | interpretation |
| A036 | 08-01 | email | trend_watch_prose | PREDICTION | c | - | - | Worth watching before the ERA catches up. |  |
| A037 | 08-01 | email | trend_watch_prose | FRAMING_VOICE | c | - | - | Matthew Liberatore -- the ERA tells the story. |  |
| A038 | 08-01 | email | trend_watch_prose | TREND | a | last 8 starts vs prior 13 | trend_watch P1 | Liberatore has posted an 8.55 ERA over his last 8 starts (since June 13) after a 4.92 ERA across his prior 13. |  |
| A039 | 08-01 | email | trend_watch_prose | FRAMING_VOICE | c | - | - | That's a significant and sustained deterioration over a meaningful sample. | "significant" without comparator |
| A040 | 08-01 | email | trend_watch_prose | FRAMING_VOICE | c | - | - | Kyle Leahy -- sharper in the second half. | headline |
| A041 | 08-01 | email | trend_watch_prose | TREND | a | since June 23 | trend_watch P1 + box_score | Leahy put together another quality start Friday (6.0 IP, 1 ER), consistent with his run since June 23: a 1.11 ERA over his last 7 starts vs a 4.69 ERA in the 14 before. |  |
| A042 | 08-01 | email | trend_watch_prose | TREND | a | season | trend_watch P6 | Friday also pushed his strikeout total to a new personal season best. | personal season best |
| A043 | 08-01 | web | web_yesterday_recap | GAME_EVENT | a | yesterday | box_score | Kyle Leahy gave the Cardinals six innings of one-run ball — 6.0 IP, 6 H, 1 ER, 1 BB, 3 K — but Toronto held the offense to a single run. |  |
| A044 | 08-01 | web | web_yesterday_recap | GAME_EVENT | a | yesterday | plays | Jordan Walker's RBI single in the fifth scored Nathan Church, who had reached on a hit and swiped second. |  |
| A045 | 08-01 | web | web_yesterday_recap | GAME_EVENT | a | yesterday | plays/box_score | The Blue Jays evened it in the sixth on a Kazuma Okamoto double that scored Vladimir Guerrero Jr., then put the game away in the eighth when a Luis Urías single scored George Springer and Daulton Varsho off Peter Strzelecki (1.0 IP, 2 ER, 2 BB). |  |
| A046 | 08-01 | web | web_yesterday_recap | GAME_EVENT | a | yesterday | box_score | Church finished 2-for-4 with a stolen base; Walker went 1-for-4 with the Cardinals' lone RBI. |  |
| A047 | 08-01 | web | web_yesterday_recap | GAME_EVENT | b | yesterday | box_score | STL's only offensive production came from those two bats. | derived "only production from those two" |
| A048 | 08-01 | web | web_yesterday_recap | TREND | a | last 7 starts | trend_watch P1 / game logs | WHAT WORKED: Leahy logged his seventh straight quality start, his ERA over that stretch now 1.11. | QS streak |
| A049 | 08-01 | web | web_yesterday_recap | FRAMING_VOICE | c | - | - | Church continued to provide a spark at the top of the order. |  |
| A050 | 08-01 | web | web_yesterday_recap | GAME_EVENT | b | yesterday | - | WHAT DIDN'T: The Cardinals managed no other run-scoring opportunities. | "no other run-scoring opportunities" undefined measure |
| A051 | 08-01 | web | web_yesterday_recap | GAME_EVENT | a | yesterday | box_score | Strzelecki's eighth-inning collapse converted a tied game into a 3-1 deficit in 1.0 IP. |  |
| A052 | 08-01 | web | web_yesterday_recap | GAME_STATE | a | series/streak | series_score,streak | STL falls to L2 and trails the series 1-0 heading into Saturday. |  |
| A053 | 08-01 | web | season_context_starters | ROSTER_FACT | a | today | probable_pitchers | Quinn Mathews (STL, LHP): Making his major-league debut. | debut |
| A054 | 08-01 | web | season_context_starters | ABSENCE | a | career | season rows/retro_id | He has no MLB career line, which is why no season stats and no BvP history (null retro_id) appear in the dataset — the absence is his debut, not a gap. | pipeline vocab leak but schematizable |
| A055 | 08-01 | web | season_context_starters | ROSTER_FACT | a | - | probable_pitchers.throws | Throwing hand confirmed left-handed via StatsAPI; the platoon splits below are matched correctly. |  |
| A056 | 08-01 | web | season_context_starters | STAT_VALUE | a | 2026 (slot-bound) | season_2026 pitching | Kevin Gausman (TOR, R, ERA 4.51): 121.2 IP, 123 K, 35 BB, WHIP 1.27, GB% 44.7, K% 23.9, BB% 6.8. | scope inherited from slot binding |
| A057 | 08-01 | web | season_context_starters | GAME_STATE | a | today | venue/home_away | Gausman is pitching at home today (Cardinals are visiting Rogers Centre). |  |
| A058 | 08-01 | web | season_context_starters | STAT_VALUE | a | 2025 home | pitcher_home_away | His 2025 home ERA was 3.76 in 95.2 IP. |  |
| A059 | 08-01 | web | season_context_starters | STAT_VALUE | a | 2025 | pitcher_platoon + lineup bats | He held left-handed batters to a .193/.247/.339 line (.586 OPS) in 370 PA last season — the defining matchup context for today's game given the Cardinals' 6-LHB projected order. |  |
| A060 | 08-01 | web | season_context_injuries | ROSTER_FACT | a | last 14 days | transactions/injuries | Cardinals (STL): No IL moves in the last 14 days. |  |
| A061 | 08-01 | web | season_context_injuries | ABSENCE | a | today | injuries | No active injury context to report for today's game. |  |
| A062 | 08-01 | web | season_context_injuries | ROSTER_FACT | a | - | injuries | Blue Jays (TOR): Jonatan Clase (10-day IL, LF, plantar fasciitis, effective 7/21). |  |
| A063 | 08-01 | web | season_context_injuries | ROSTER_FACT | a | - | injuries | Addison Barger (60-day IL, RF, right elbow, effective 7/23). |  |
| A064 | 08-01 | web | season_context_injuries | ROSTER_FACT | a | - | injuries | Patrick Corbin (15-day IL, LHP, left teres major, effective 7/22). |  |
| A065 | 08-01 | web | season_context_injuries | ROSTER_FACT | a | - | transactions | Recent activations: Max Scherzer (activated 7/27), Jesús Sánchez (activated 7/31). |  |
| A066 | 08-01 | web | bvp_cardinals_vs_starter_annotation | BVP_HISTORY | a | career | bvp | Four Cardinals have career data against Gausman: Burleson (7 PA, .286), Winn (4 PA, .500), Nootbaar (5 PA, .500), Walker (3 PA, .333). |  |
| A067 | 08-01 | web | bvp_cardinals_vs_starter_annotation | ABSENCE | a | career | bvp + floor constant | All four show positive surface results, but no hitter clears the 10-PA floor required for danger-bat designation. | quoted floor (10 PA) = SCOUT-121.1 class; schematizable as constant |
| A068 | 08-01 | web | bvp_cardinals_vs_starter_annotation | ABSENCE | a | career | bvp | JJ Wetherholt, Iván Herrera, Jimmy Crooks, Gorman, and Nathan Church have no career data against Gausman. |  |
| A069 | 08-01 | web | bvp_cardinals_vs_starter_annotation | FRAMING_VOICE | c | - | - | These numbers provide directional context only — treat with appropriate caution. | caution boilerplate |
| A070 | 08-01 | web | bvp_opponent_vs_starter_annotation | ABSENCE | a | career | bvp | Quinn Mathews has no MLB career entering today — this is his debut — so no batter-vs-pitcher history exists for any Blue Jays hitter. |  |
| A071 | 08-01 | web | bvp_opponent_vs_starter_annotation | FRAMING_VOICE | c | - | - | Both sides are approaching this matchup without historical context. |  |
| A072 | 08-01 | web | platoon_cardinals_annotation | STAT_VALUE | a | career + 2026 vs RHP | platoon tables | Alec Burleson is the clearest bright spot: a .296/.353/.478 career line vs RHP (419 PA) and a .942 OPS against right-handers in 2026. |  |
| A073 | 08-01 | web | platoon_cardinals_annotation | MAGNITUDE | b | team | - | He is the Cardinals' best matchup advantage today. | "best matchup advantage" bare comparator |
| A074 | 08-01 | web | platoon_cardinals_annotation | STAT_VALUE | a | 2025 vs RHP | platoon 2025 | Lars Nootbaar's 2025 line vs RHP is respectable (.249/.340/.394), though his 2026 numbers reflect a recent slump (see Trend Watch). |  |
| A075 | 08-01 | web | platoon_cardinals_annotation | STAT_VALUE | b | career vs RHP; 2026 vs LHP | platoon tables | Iván Herrera's career vs RHP (.268/.343/.399) is solid, backed by a .823 OPS vs LHP in 2026 that suggests he handles non-LHB pitching well. | SCOPE MISMATCH: vs-LHP figure offered as evidence for vs-RHP |
| A076 | 08-01 | web | platoon_cardinals_annotation | SPLIT_DIRECTION | a | career vs 2026 vs RHP | platoon tables | Jordan Walker's career vs RHP is notably weak (.200/.263/.291, 94 K in 289 PA), though his 2026 vs-RHP data (.277/.—/.811) paints a more favorable picture. | season_change, both figures |
| A077 | 08-01 | web | platoon_cardinals_annotation | SPLIT_DIRECTION | b | career vs hand | platoon tables | The bottom of the order carries real risk: Church and Crooks both show sub-.200 career averages vs the hand matching Gausman (right for RHBs / left for LHBs per their respective splits shown). | garbled scope parenthetical |
| A078 | 08-01 | web | platoon_opponent_annotation | ROSTER_FACT | a | - | probable_pitchers.throws | Note: Mathews' throwing hand is confirmed left-handed; the platoon query matched on L. |  |
| A079 | 08-01 | web | platoon_opponent_annotation | GAME_STATE | a | table scope | platoon_opponent table | These splits reflect TOR batters vs LHP. | caption-style scope declaration |
| A080 | 08-01 | web | platoon_opponent_annotation | STAT_VALUE | a | 2025 (slot-bound) | platoon_opponent vs LHP | Ernie Clement (.326/.351/.549, 187 PA) and Vladimir Guerrero Jr (.326/.428/.519, 159 PA) both show strong production vs left-handed pitching and represent the Blue Jays' clearest threat spots in the order. | "strong production" magnitude leg is bare |
| A081 | 08-01 | web | platoon_opponent_annotation | STAT_VALUE | a | 2025 (slot-bound) | platoon_opponent vs LHP | Andrés Giménez (.175, 86 PA) and Luis Urías (.183, 68 PA) trend unfavorably in this split but sample sizes limit conclusions. |  |
| A082 | 08-01 | web | platoon_opponent_annotation | ABSENCE | a | 2026 | platoon_2026 + 60-PA floor | The 2026 companion column is SSS for all Toronto batters vs LHP — insufficient plate appearances against confirmed left-handed pitching in the current season to cross the 60-PA floor. |  |
| A083 | 08-01 | web | pitcher_platoon_annotation | FRAMING_VOICE | c | - | - | This is the defining split for today's game. |  |
| A084 | 08-01 | web | pitcher_platoon_annotation | STAT_VALUE | a | 2025 | pitcher_platoon | Gausman held left-handed batters to a .193/.247/.339 (.586 OPS) line in 370 PA in 2025 — a significant suppression of the left side of the plate. |  |
| A085 | 08-01 | web | pitcher_platoon_annotation | SPLIT_DIRECTION | a | 2025 (slot-bound) | pitcher_platoon | Against right-handed batters (.238/.290/.374, .664 OPS, 405 PA), he was meaningfully more hittable. | both sides across adjacent sentences |
| A086 | 08-01 | web | pitcher_platoon_annotation | ROSTER_FACT | a | today | lineups + bats | The Cardinals project to start 6 LHBs (Wetherholt, Burleson, Nootbaar, Crooks, Gorman, Church) and 3 RHBs (Herrera, Walker, Winn). |  |
| A087 | 08-01 | web | pitcher_platoon_annotation | SPLIT_DIRECTION | b | implicit | pitcher_platoon | The RHB trio represents the Cardinals' primary path to offensive production against Gausman; the left-handed half of the lineup faces a demonstrable structural disadvantage. | BARE direction, no figures |
| A088 | 08-01 | web | pitcher_home_away_annotation | GAME_STATE | a | today | venue | Gausman is pitching at home today — the Cardinals are visiting Rogers Centre. |  |
| A089 | 08-01 | web | pitcher_home_away_annotation | STAT_VALUE | a | 2025 home | pitcher_home_away | The relevant split for this game is his Home row: 3.76 ERA in 95.2 IP in 2025. |  |
| A090 | 08-01 | web | pitcher_home_away_annotation | SPLIT_DIRECTION | a | 2025 home vs away | pitcher_home_away | His home ERA was worse than his away ERA (3.14 in 97.1 IP), partly driven by a higher home HR rate (14 HR at home vs 7 away). | both figures + HR 14 vs 7 |
| A091 | 08-01 | web | pitcher_home_away_annotation | MAGNITUDE | c | - | NONE | Notably, Rogers Centre plays as a moderate hitter's park. | UNSOURCED park-factor claim (no payload path) |
| A092 | 08-01 | web | pitcher_home_away_annotation | PREDICTION | c | - | - | The 3.76 ERA is still a strong baseline; the Cardinals should not expect Gausman to be unusually vulnerable simply because of venue. | "strong baseline" bare magnitude |
| A093 | 08-01 | web | tto_splits_annotation | STAT_VALUE | a | 2025 (slot-bound) | tto table | Gausman's times-through-order profile is remarkably consistent — his OPS allowed rises from .608 on the first pass to .636 on the second pass to .642 on the third pass, but the gradient is shallow. |  |
| A094 | 08-01 | web | tto_splits_annotation | SPLIT_DIRECTION | b | - | tto table | Unlike some starters who fall apart late, Gausman shows only a modest decline as hitters see him more. | "unlike some starters" comparator unsourced; restated direction |
| A095 | 08-01 | web | tto_splits_annotation | PREDICTION | c | - | - | The Cardinals should not expect a dramatic breakout simply by surviving into the third pass; Gausman remains effective throughout. |  |
| A096 | 08-01 | web | tto_splits_annotation | SPLIT_DIRECTION | a | 2025 (slot-bound) | tto table SLG | The modest uptick in SLG (.348 → .354 → .376) across all three TTO rows suggests hitters do make marginal contact-quality gains over time. |  |
| A097 | 08-01 | web | inherited_runners_annotation | ROSTER_FACT | a | 2026 | role/IR table | Note: Kyle Leahy's inherited runner data reflects his time as a reliever; he is currently functioning as a starter (6-start rotation role per 2026 context). |  |
| A098 | 08-01 | web | inherited_runners_annotation | FRAMING_VOICE | c | - | - | His IR data is retained here for completeness but is not the primary frame for today's game. | meta |
| A099 | 08-01 | web | inherited_runners_annotation | STAT_VALUE | a | 2026 | inherited_runners | Among current relievers likely to see work today, Matt Svanson (50.0% strand rate, 26 IR) is the most concerning IR option — he allows nearly half of inherited runners to score. | rank within table derivable |
| A100 | 08-01 | web | inherited_runners_annotation | MAGNITUDE | a | 2026 | inherited_runners + league_benchmarks.avg_ir_strand | Graceffo (54.5%, 11 IR) is similarly below league average. | comparator exists |
| A101 | 08-01 | web | inherited_runners_annotation | STAT_VALUE | a | 2026 | inherited_runners | Riley O'Brien (70.0%, 10 IR) is the best strand-rate option available, though his recent Trend Watch indicators (K% declining, BB% rising) add a caveat. |  |
| A102 | 08-01 | web | inherited_runners_annotation | ABSENCE | a | 2026 | inherited_runners | McGreevy's 100.0% strand rate comes from only 3 inherited runners and carries little predictive weight. | small-sample caveat |
| A103 | 08-01 | web | inherited_runners_annotation | ABSENCE | a | 2026 | IR table + 20-IP floor | Strzelecki did not clear the 20-IP 2026 floor (3.0 IP) and is excluded from this table. |  |
| A104 | 08-01 | web | batted_ball_annotation | MAGNITUDE | a | 2025 | batted_ball + league_benchmarks.avg_gb_pct | Gausman's 2025 batted ball profile (38.0% GB, 34.3% FB, 26.7% LD) shows a moderate ground ball tendency — he generates grounders at an above-average clip but is not a true ground ball specialist. | LIKELY INVERTED: 38.0% GB called "above-average" vs 47.0 league avg |
| A105 | 08-01 | web | batted_ball_annotation | SPLIT_DIRECTION | a | 2025 vs 2026 | batted_ball | His 2026 season GB% is 44.7%, suggesting he has leaned more heavily into ground ball outcomes this year. | season_change both figures |
| A106 | 08-01 | web | batted_ball_annotation | STAT_VALUE | a | slot-bound | batter batted_ball | Cardinals hitters who make a lot of ground balls (Church 67.6%, Herrera 52.6%, Walker 48.9%) could find themselves rolling weak grounders against Gausman's movement. | "could find themselves" prediction leg |
| A107 | 08-01 | web | batted_ball_annotation | STAT_VALUE | a | slot-bound | batter batted_ball | On the Toronto side, line drive averages dominate for most Blue Jays hitters (Guerrero Jr .672 LD AVG, Schneider .762 LD AVG, Springer .694 LD AVG), while fly ball averages are low across the board — a profile that should limit extra-base damage if Mathews induces contact in the air. | "low across the board" bare magnitude leg |
| A108 | 08-01 | web | battery_annotation | ROSTER_FACT | a | 2026 | lineups/catcher | Today's starting catcher is Jimmy Crooks (batting order 7, bats L, 14 G in 2026, .559 OPS). |  |
| A109 | 08-01 | web | battery_annotation | ABSENCE | a | career | battery | Mathews is making his major-league debut, so no historical battery pairing data exists. |  |
| A110 | 08-01 | web | battery_annotation | FRAMING_VOICE | c | - | - | This is a fresh combination with no retrievable track record. | restates A109 |
| A111 | 08-01 | web | battery_annotation | ROSTER_FACT | a | 2026 | catcher games | Crooks' 14 games of MLB catching experience makes him a limited reference point against a Toronto lineup that will test him on the bases (see Section 2I). | prediction leg |
| A112 | 08-01 | web | baserunning_content | STAT_VALUE | a | career | baserunning table | Toronto Speed Threats (Career) PlayerCareer SBCareer ATTSuccess%2026 Context George Springer181994.7%Active Myles Straw121392.3%Active Andrés Giménez121485.7%Active Vladimir Guerrero6966.7%Active Ernie Clement61154.5%Active Toronto has three active high-efficiency base stealers: Springer (94.7%), Straw (92.3%), and Giménez (85.7%). | table text glued into slot |
| A113 | 08-01 | web | baserunning_content | PREDICTION | c | - | - | All three can be expected to run when the opportunity presents. |  |
| A114 | 08-01 | web | baserunning_content | MAGNITUDE | b | career | baserunning | Guerrero (66.7%) and Clement (54.5%) are negative-value runners who should not steal freely. | "negative-value" needs break-even constant not in payload |
| A115 | 08-01 | web | baserunning_content | PREDICTION | c | - | - | Jimmy Crooks' 14 games of catching experience makes the Cardinals' battery combination potentially vulnerable to an aggressive Toronto running game. |  |
| A116 | 08-01 | web | baserunning_content | PREDICTION | c | - | - | Mathews' delivery time and Crooks' throw-down proficiency are the key variables to monitor from the first inning. |  |
| A117 | 08-01 | web | defense_annotation | STAT_VALUE | a | 2026 | defense + trend_watch P18 | Masyn Winn at shortstop (129 G, 64 DP, .994 Fld%) anchors what has been an elite defensive unit — the Cardinals are pacing near the franchise best fielding percentage mark this season. | "elite" backed by franchise-pace comparator |
| A118 | 08-01 | web | defense_annotation | STAT_VALUE | a | 2026 | defense | Lars Nootbaar (LF, 107 G, 1.000 Fld%) and Nathan Church (CF, 18 G, 1.000 Fld%) are both clean in the outfield corners and center field respectively. |  |
| A119 | 08-01 | web | defense_annotation | STAT_VALUE | a | 2026 | defense | Walker in RF (108 G, .981 Fld%) has four errors but remains a solid presence. |  |
| A120 | 08-01 | web | defense_annotation | STAT_VALUE | a | 2026 | defense | Crooks at catcher (14 G, 1.000 Fld%) has made no errors in his limited experience, though the sample is small. |  |
| A121 | 08-01 | web | defense_annotation | STAT_VALUE | a | 2026 | defense | Church's RF secondary role (7 G, .833 Fld%, 1 error) is a caution flag if defensive alignment shifts. |  |
| A122 | 08-01 | web | head_to_head_content | GAME_STATE | c | - | NONE | Rogers Centre — Toronto, Ontario Rogers Centre is a domed stadium with artificial turf. | UNSOURCED park facts (dome, turf) |
| A123 | 08-01 | web | head_to_head_content | MAGNITUDE | c | - | NONE | The playing surface and park dimensions tend to favor contact hitters and support base running. | UNSOURCED park characterization |
| A124 | 08-01 | web | head_to_head_content | FRAMING_VOICE | c | - | NONE | The ball carries reasonably well in the climate-controlled environment. | UNSOURCED |
| A125 | 08-01 | web | head_to_head_content | GAME_STATE | a | today | venue | The Cardinals are playing as the road team today. |  |
| A126 | 08-01 | web | head_to_head_content | GAME_STATE | a | 2024-2025 | head_to_head table | Cardinals vs Blue Jays — Recent Head-to-Head SeasonSTL WTOR WSTL-TORNote 2025030-3Swept 2024030-3Swept 2023212-1-- 2022222-2-- The Cardinals have gone 0-6 against Toronto over the last two seasons (0-3 in 2025, 0-3 in 2024). |  |
| A127 | 08-01 | web | head_to_head_content | GAME_STATE | a | 2024-2026 | head_to_head + yesterday | Friday's loss extended that run to 0-7 over the combined 2024–2026 period against the Blue Jays. |  |
| A128 | 08-01 | web | head_to_head_content | GAME_STATE | a | - | head_to_head table | The last time the Cardinals beat Toronto was 2023. |  |
| A129 | 08-01 | web | head_to_head_content | FRAMING_VOICE | c | - | - | Breaking this streak in the context of this three-game series is one of the narrative frames for today's afternoon game. |  |
| A130 | 08-01 | web | batter_kbb_stl_note | STAT_VALUE | a | 2025 | pitcher_kbb | Against a pitcher with Gausman's strikeout profile (24.4% K in 2025), the Cardinals' high-strikeout hitters face compounding risk. | prediction leg |
| A131 | 08-01 | web | batter_kbb_stl_note | STAT_VALUE | a | career + 2026 | batter_kbb | Jimmy Crooks carries a 37.0% career K rate (31.6% in 2026); Jordan Walker's career K% is 31.8% (25.2% in 2026); Nathan Church is at 27.7% career. |  |
| A132 | 08-01 | web | batter_kbb_stl_note | PREDICTION | c | - | - | The bottom third of the Cardinals order could accumulate significant strikeout totals against Gausman's arsenal. |  |
| A133 | 08-01 | web | batter_kbb_stl_note | STAT_VALUE | a | career + 2026 | batter_kbb | Burleson (14.5% career K, 15.8% in 2026) is the best contact bat in the projected order and offers the clearest contrast to this vulnerability. | rank within order derivable |
| A134 | 08-01 | web | batter_kbb_stl_note | STAT_VALUE | a | career + 2026 | batter_kbb | Nootbaar's walk rate (11.0% career, 13.8% in 2026) gives her the highest on-base floor against Gausman's 6.5% BB rate. | pronoun error "her" (voice defect) |
| A135 | 08-01 | web | batter_kbb_annotation | STAT_VALUE | a | slot-bound | batter_kbb | The Blue Jays' hardest contact bats to strike out are Guerrero Jr (13.8% K, 680 PA), Clement (10.4% K, 588 PA), and Kirk (11.7% K, 506 PA) — all consistent contact hitters who rarely give away at-bats. |  |
| A136 | 08-01 | web | batter_kbb_annotation | STAT_VALUE | a | career + 2026 | batter_kbb | Varsho (28.4% K) and Schneider (26.4% K career, 33.1% in 2026) are the Blue Jays' most strikeout-prone hitters and could be exploited if Mathews can locate. |  |
| A137 | 08-01 | web | batter_kbb_annotation | SPLIT_DIRECTION | b | - | batter_kbb | The Toronto lineup is more balanced in terms of strikeout risk than the Cardinals — the Blue Jays' top of the order is difficult to put away. | lineup-vs-lineup, no figures |
| A138 | 08-01 | web | batter_batted_ball_profile_stl_note | STAT_VALUE | a | slot-bound + 2026 | batted_ball | Nathan Church is an extreme ground ball hitter (67.6% GB, 37 BIP) — against Gausman's 44.7% ground ball rate in 2026, Church could generate a lot of weak contact. |  |
| A139 | 08-01 | web | batter_batted_ball_profile_stl_note | STAT_VALUE | a | slot-bound | batted_ball | Iván Herrera (52.6% GB) and Jordan Walker (48.9% GB) also skew toward ground balls. |  |
| A140 | 08-01 | web | batter_batted_ball_profile_stl_note | STAT_VALUE | a | slot-bound | batted_ball | Nootbaar (35.4% FB) and Burleson (33.4% FB) have more elevated fly ball profiles and the power to do damage when they connect. |  |
| A141 | 08-01 | web | batter_batted_ball_profile_stl_note | STAT_VALUE | a | slot-bound | batted_ball | Crooks' 44.4% fly ball rate (27 BIP) is notable but the sample is extremely small. |  |
| A142 | 08-01 | web | batter_batted_ball_profile_annotation | STAT_VALUE | a | slot-bound | batted_ball | Vladimir Guerrero Jr is a heavy ground ball hitter (50.0% GB, 472 BIP) — a profile that matches up well against ground ball pitchers but limits his power to gaps and pulled balls. |  |
| A143 | 08-01 | web | batter_batted_ball_profile_annotation | STAT_VALUE | a | slot-bound | batted_ball | Daulton Varsho (46.3% FB) and Davis Schneider (48.7% FB) are significant fly ball hitters who can be beaten by keeping the ball down. |  |
| A144 | 08-01 | web | batter_batted_ball_profile_annotation | MAGNITUDE | a | slot-bound | batted_ball | Clement (28.7% LD) and Springer (27.6% LD) have the best line drive rates in the lineup — both are hard to get out cleanly when they're locked in. | rank within lineup derivable |
| A145 | 08-01 | web | batter_batted_ball_profile_annotation | PREDICTION | c | - | - | If Mathews can generate weak ground ball contact, Toronto's profile could work in his favor. |  |
| A146 | 08-01 | web | pitcher_kbb_annotation | MAGNITUDE | b | 2025 | pitcher_kbb + league_benchmarks | Gausman's 2025 command profile is elite: 24.4% strikeout rate, 6.5% walk rate, 3.78 K/BB ratio across 193.0 IP. | "elite" adjective without rank band |
| A147 | 08-01 | web | pitcher_kbb_annotation | PREDICTION | c | - | - | He misses bats without giving away free passes — the Cardinals should not expect to work deep counts for many walks. |  |
| A148 | 08-01 | web | pitcher_kbb_annotation | STAT_VALUE | a | career | batter_kbb | For a Cardinals lineup with three hitters carrying career K rates above 27%, this is a challenging profile to attack. | count derivable |
| A149 | 08-01 | web | pitcher_kbb_annotation | STAT_VALUE | a | career | batter_kbb | Burleson's low K rate (14.5%) and Nootbaar's walk rate (11.0%) are the best tools for wearing Gausman down. |  |
| A150 | 08-01 | web | pitcher_kbb_annotation | ABSENCE | a | - | pitcher_kbb | Quinn Mathews' K%/BB% data does not exist yet — today is his major-league debut. |  |
| A151 | 08-01 | web | key_matchups | FRAMING_VOICE | c | - | - | PRIMARY: Gausman's platoon edge vs a 6-LHB Cardinals order This is the structural story of today's game. |  |
| A152 | 08-01 | web | key_matchups | STAT_VALUE | a | 2025 | pitcher_platoon | Gausman held left-handed batters to a .193 AVG and .586 OPS in 370 plate appearances in 2025 — a pronounced suppression against the majority of the Cardinals' projected lineup. |  |
| A153 | 08-01 | web | key_matchups | ROSTER_FACT | a | today | lineups + bats | Wetherholt, Burleson, Nootbaar, Crooks, Gorman, and Church all bat left. |  |
| A154 | 08-01 | web | key_matchups | SPLIT_DIRECTION | b | implicit | pitcher_platoon | The three right-handed bats (Iván Herrera, Jordan Walker, Masyn Winn) carry the platoon advantage and represent the Cardinals' primary path to runs. | BARE direction |
| A155 | 08-01 | web | key_matchups | MAGNITUDE | b | team | - | Alec Burleson is the most credible threat against Gausman among the left-handed hitters. | "most credible threat" bare |
| A156 | 08-01 | web | key_matchups | STAT_VALUE | a | 2026 + career | platoon tables | His 2026 OPS vs right-handed pitching is .942, and his career vs-RHP line (.296/.353/.478) gives him a legitimate track record. |  |
| A157 | 08-01 | web | key_matchups | BVP_HISTORY | a | career | bvp | His 7-PA career sample vs Gausman (.286 AVG) is small but directionally positive. |  |
| A158 | 08-01 | web | key_matchups | STAT_VALUE | a | career/2025 | batter_kbb + pitcher_kbb | He's also the best contact bat in the order (14.5% career K rate) — a meaningful edge against Gausman's 24.4% K rate. |  |
| A159 | 08-01 | web | key_matchups | STAT_VALUE | a | 2026 | season_2026 | Jordan Walker (.835 OPS, 22 HR, 79 RBI in 2026) is the team's primary power source. |  |
| A160 | 08-01 | web | key_matchups | SPLIT_DIRECTION | b | career vs 2026 | platoon tables | His career vs-RHP line is weak (.200/.263/.291), but his 2026 numbers show he's outperforming that baseline. | 2026 figure absent in sentence |
| A161 | 08-01 | web | key_matchups | GAME_EVENT | a | yesterday | plays | He drove in Friday's only Cardinals run with an RBI single. |  |
| A162 | 08-01 | web | key_matchups | PREDICTION | c | - | - | The bottom of the order (Crooks, Gorman, Church) faces a steep challenge. |  |
| A163 | 08-01 | web | key_matchups | STAT_VALUE | b | 2026 | batter_kbb | Crooks has a 31.6% K rate in 2026; Church goes 2-for-4 one night and then struggles in other matchups. | Church clause vague |
| A164 | 08-01 | web | key_matchups | FRAMING_VOICE | c | - | - | Gausman's ability to suppress the six left-handed bats in this order is the central variable. |  |
| A165 | 08-01 | web | key_matchups | STAT_VALUE | b | unstated (career) | baserunning | SECONDARY: Toronto's running game vs Crooks and Mathews Springer (18 SB, 94.7%), Straw (12 SB, 92.3%), and Giménez (12 SB, 85.7%) are active base stealers. | free slot, scope word absent |
| A166 | 08-01 | web | key_matchups | ROSTER_FACT | a | 2026 | catcher games | Jimmy Crooks is behind the plate with 14 games of MLB experience. |  |
| A167 | 08-01 | web | key_matchups | PREDICTION | c | - | - | This matchup will be tested early — if Toronto establishes that Crooks and Mathews are exploitable, the Blue Jays will run freely all afternoon. |  |
| A168 | 08-01 | web | key_matchups | STAT_VALUE | a | 2026 + career | platoon_2026 + bvp | Alec Burleson vs Gausman — Best LHB matchup for STL; .942 OPS vs RHP in 2026, 7-PA sample against Gausman. |  |
| A169 | 08-01 | web | key_matchups | MAGNITUDE | b | - | batter_kbb | Quinn Mathews' first-pass command — Guerrero Jr and Clement are both tough to strike out. | "tough to strike out" no figures |
| A170 | 08-01 | web | key_matchups | PREDICTION | c | - | - | Early command issues compound against a lineup with active base runners. |  |
| A171 | 08-01 | web | key_matchups | TREND | a | last 86 BF | trend_watch P9 | Riley O'Brien in high-leverage relief — His surface ERA (3.50) masks a deteriorating K/BB profile (BB% 9.6% → 16.3% over last 86 BF). |  |
| A172 | 08-01 | web | key_matchups | PREDICTION | c | - | - | Worth monitoring if he enters with runners on. |  |
| A173 | 08-01 | web | key_matchups | SPLIT_DIRECTION | a | 2025 | pitcher_home_away HR | Gausman's home HR rate — 14 HR allowed at Rogers Centre in 2025 vs 7 on the road. |  |
| A174 | 08-01 | web | key_matchups | PREDICTION | c | - | - | The dome can carry fly balls; Walker's power could find a gap. | dome claim unsourced |
| A175 | 08-01 | web | key_matchups | FRAMING_VOICE | c | - | - | Riley O'Brien — hidden decline. | headline |
| A176 | 08-01 | web | key_matchups | TREND | a | last 19 outings | trend_watch P9 | Over his last 19 outings (86 BF), O'Brien's ERA sits at 3.93 vs his season mark of 3.50 — the gap is modest on the surface. |  |
| A177 | 08-01 | web | key_matchups | TREND | a | window | trend_watch P9 | But his strikeout rate has dropped from 24.5% to 22.1%, while his walk rate has climbed from 9.6% to 16.3%. |  |
| A178 | 08-01 | web | key_matchups | FRAMING_VOICE | c | - | - | The underlying indicators are diverging from the results. |  |
| A179 | 08-01 | web | key_matchups | PREDICTION | c | - | - | If he enters today with inherited runners, those walk numbers matter. |  |
| A180 | 08-01 | web | key_matchups | TREND | a | last 8 starts | trend_watch P1 | Matthew Liberatore — sustained collapse. 8.55 ERA over his last 8 starts (since June 13) vs a 4.92 ERA in the 13 before. |  |
| A181 | 08-01 | web | key_matchups | FRAMING_VOICE | c | - | - | A meaningful sample, a significant gap. |  |
| A182 | 08-01 | web | key_matchups | TREND | a | last 7 starts | trend_watch P1 | Kyle Leahy — best run of the year. 1.11 ERA over his last 7 starts (since June 23) vs 4.69 ERA in the 14 before. |  |
| A183 | 08-01 | web | key_matchups | GAME_EVENT | b | yesterday | game log | Friday extended the run. | "extended the run" derived |
| A184 | 08-01 | web | key_matchups | TREND | a | season vs 2025 | trend_watch P6 | He also reached a new personal season best in strikeouts (91, surpassing his 80 from 2025). |  |
| A185 | 08-01 | web | quick_reference | STAT_VALUE | a | 2025 | pitcher_platoon | Gausman vs LHBs (2025): .193/.247/.339, .586 OPS (370 PA). |  |
| A186 | 08-01 | web | quick_reference | ROSTER_FACT | a | today | lineups | Today's Cardinals LHBs: Wetherholt, Burleson, Nootbaar, Crooks, Gorman, Church. 2. |  |
| A187 | 08-01 | web | quick_reference | STAT_VALUE | a | 2025 | pitcher_platoon | Gausman vs RHBs (2025): .238/.290/.374, .664 OPS (405 PA). |  |
| A188 | 08-01 | web | quick_reference | ROSTER_FACT | a | today | lineups | Today's Cardinals RHBs: Herrera, Walker, Winn. 3. |  |
| A189 | 08-01 | web | quick_reference | STAT_VALUE | a | 2025 | pitcher_home_away | Gausman home ERA (2025): 3.76 (95.2 IP, 14 HR). |  |
| A190 | 08-01 | web | quick_reference | GAME_STATE | a | today | venue | Cardinals are the road team today. 4. |  |
| A191 | 08-01 | web | quick_reference | STAT_VALUE | b | unstated | tto table | Gausman TTO splits: TTO1 .608 OPS, TTO2 .636 OPS, TTO3 .642 OPS — shallow gradient, effective through the order. 5. | summary slot, no season word |
| A192 | 08-01 | web | quick_reference | BVP_HISTORY | a | career | bvp | Cardinals BvP vs Gausman: Burleson 7 PA (.286), Winn 4 PA (.500), Nootbaar 5 PA (.500), Walker 3 PA (.333). |  |
| A193 | 08-01 | web | quick_reference | ABSENCE | a | career | bvp + floor | All small sample, no danger bat. 6. |  |
| A194 | 08-01 | web | quick_reference | STAT_VALUE | b | unstated (career) | baserunning | TOR speed threats: Springer 94.7% SB success, Straw 92.3%, Giménez 85.7%. |  |
| A195 | 08-01 | web | quick_reference | ROSTER_FACT | a | 2026 | catcher | Crooks starts at C (14 G experience). 7. |  |
| A196 | 08-01 | web | quick_reference | ROSTER_FACT | a | 2026 | lineups/catcher | Cardinals starting catcher: Jimmy Crooks (order 7, bats L, .559 OPS, 95 PA in 2026). 8. |  |
| A197 | 08-01 | web | quick_reference | STAT_VALUE | a | 2025 | pitcher_kbb | Gausman K%/BB% (2025): 24.4% K, 6.5% BB, 3.78 K/BB. |  |
| A198 | 08-01 | web | quick_reference | STAT_VALUE | a | 2026 | batter_kbb | Cardinals K risks: Crooks 31.6%, Walker 25.2%, Church 20.7% (all 2026). 9. |  |
| A199 | 08-01 | web | quick_reference | GAME_STATE | a | 2024-2025 | head_to_head | Cardinals record vs TOR last 2 seasons: 0-6 (0-3 in 2025, 0-3 in 2024). |  |
| A200 | 08-01 | web | quick_reference | GAME_STATE | a | series | series_score | Series currently TOR leads 1-0. 10. |  |
| A201 | 08-01 | web | quick_reference | ABSENCE | a | - | pitcher rows | Mathews data: Making his MLB debut — no ERA or BvP data exists yet. |  |
| A202 | 08-01 | web | quick_reference | ROSTER_FACT | a | - | throws | Throws left (confirmed via StatsAPI). 11. |  |
| A203 | 08-01 | web | quick_reference | TREND | a | last 86 BF | trend_watch P9 | Trend Watch — O'Brien (hidden decline): BB% 9.6% → 16.3% over last 86 BF. |  |
| A204 | 08-01 | web | quick_reference | PREDICTION | c | - | - | Use with caution in inherited-runner spots. 12. |  |
| A205 | 08-01 | web | quick_reference | MAGNITUDE | a | 2026 | inherited_runners + league avg | Svanson IR strand rate: 50.0% (26 IR) — below league average; avoid in high-leverage inherited-runner situations. | prediction leg |
| S000 | 07-18 | web | pitcher_platoon_annotation | STAT_VALUE | a | career vs LHB | pitcher_platoon + lineup bats | May's career .852 OPS vs LHB (.495 SLG, 15 HR in 334 PA) is his split to worry about, and Arizona's lineup projects with Carroll and Kepler from the left plus four switch-hitters batting left vs May. | "split to worry about" one-sided relation leg |
| S001 | 09-02 | web | defense_annotation | ABSENCE | a | 2025 | defense table | Joshua Báez (LF) and Leo Bernal (C) do not appear in the 2025 fielding table. |  |
| S002 | 07-18 | web | baserunning_content | STAT_VALUE | a | 2025 | batter_kbb | Combined with a 13.1% BB% (2025), his OBP profile makes him a late-innings running threat. | prediction leg |
| S003 | 08-21 | web | inherited_runners_annotation | STAT_VALUE | a | 2026 | inherited_runners | Gordon Graceffo has stranded 54.5% of 11 inherited runners, the lowest mark among Cardinals relievers with a meaningful sample, and warrants attention in high-leverage situations with baserunners already aboard. | rank within table |
| S004 | 08-27 | email | key_matchups_prose | ABSENCE | a | career | bvp floor | At 3 trips, that history is a note of record, not a tendency -- far too small a sample to project. |  |
| S005 | 09-02 | web | platoon_opponent_annotation | STAT_VALUE | a | 2026 absent / 2025 | platoon tables | Shohei Ohtani carries no qualifying 2026 vs-LHP sample; his 2025 baseline against lefties reads .279/.344/.554 across 244 PA, with 15 home runs in that sample -- the power ceiling in the lineup. | "power ceiling" bare magnitude leg |
| S006 | 07-24 | email | watchlist_prose | PREDICTION | c | - | - | Watch for early pitch-selection calibration and pop-time sequencing in the first pass through the order.  -- Reds baserunning vs Crooks. | + heading fragment |
| S007 | 07-24 | web | baserunning_content | STAT_VALUE | a | slot-bound career | baserunning | Noelvi Marte has 10 SB (76.9% success rate). |  |
| S008 | 07-18 | web | defense_annotation | STAT_VALUE | a | 2026 | defense + batted_ball | Winn at SS anchors the infield (.994 fld%, 64 DP in 129 G) -- with May working the ground and both starters near 44% GB, Winn will see volume. | prediction leg |
| S009 | 08-27 | web | batted_ball_annotation | STAT_VALUE | a | slot-bound | batted_ball GB AVG | On grounders -- his primary output -- results split: Beavers (.381 GB AVG) and Henderson (.255) can capitalize, while Basallo (.077) and Encarnacion-Strand (.179) are among the most suppressed in the group. | rank within table |
| S010 | 08-15 | web | tto_splits_annotation | SPLIT_DIRECTION | a | 2025 | tto table | In 2025, each pass was better than the last: TTO1 .792 OPS (154 PA), TTO2 .715 OPS (152 PA), TTO3 .677 OPS (94 PA). | all three figures; "better" from pitcher's view |
| S011 | 09-02 | web | key_matchups | STAT_VALUE | a | 2026 vs RHP | platoon_2026 | Freeman's 2026 line vs right-handers reads .317/.393/.494 over 389 PA. |  |
| S012 | 08-08 | web | quick_reference | STAT_VALUE | b | unstated | baserunning | Jordan Beck (19 SB, 70.4%) and Tyler Freeman (18 SB, 66.7%) are the high-volume stealers. | quick_reference free slot, no scope word |
| S013 | 07-24 | web | tto_splits_annotation | STAT_VALUE | a | slot-bound | tto table | In the third pass through the order (TTO3), the line holds near the TTO2 level: .263 AVG, .882 OPS in 137 PA (7 HR). | TTO2 figure absent for the "holds near" leg |
| S014 | 07-24 | web | inherited_runners_annotation | MAGNITUDE | a | 2026 | inherited_runners + league avg | Riley O'Brien leads at 70.0% (10 IR) -- above the league-average range of ~68-72%. | "~68-72% range" is an invented band around a real benchmark |
| S015 | 07-18 | web | key_matchups | BVP_HISTORY | a | career | bvp | Masyn Winn vs Brandon Pfaadt. 11 PA career, 3-for-9 with 1 HR, 2 BB, 3 K -- .333/.455/.667. | arithmetic consistent (9 AB + 2 BB = 11 PA) |
| S016 | 08-08 | web | batter_kbb_stl_note | SPLIT_DIRECTION | a | 2025 vs 2026 | batter_kbb | Jordan Walker's 2026 strikeout rate (24.8%, 479 PA) shows meaningful improvement over his 2025 baseline (31.8%), a positive trend through 116 team games. | season_change both figures |
| S017 | 07-24 | email | prediction_grades_commentary | GAME_EVENT | a | yesterday | box_score | Reaches: 1 H + 0 BB = 1. | prediction-grade arithmetic |
| S018 | 09-04 | web | baserunning_content | STAT_VALUE | a | 2026 | catcher baserunning | Leo Bernal has allowed 1 stolen base with 0 caught in 1 attempt across 12.1 innings -- a sample too small for a rate. | small-sample caveat |
| S019 | 07-18 | web | baserunning_content | MAGNITUDE | b | career | baserunning | Gurriel (71.4%) and Marte (66.7%) are the secondary threats -- Marte's rate is below the ~70% break-even and Gurriel's is right at it. | "~70% break-even" constant not in payload |
| S020 | 08-27 | web | web_yesterday_recap | GAME_EVENT | a | yesterday | box_score | Ivan Herrera went 3-for-4 and Bryan Torres was 3-for-3 to pace the St Louis offense. |  |
| S021 | 07-24 | web | season_context_injuries | ABSENCE | a | today | injuries | No additional injury or roster-move data is available for today's Cardinals-Reds game beyond the roster status noted above. |  |
| S022 | 07-24 | web | platoon_opponent_annotation | STAT_VALUE | a | slot-bound 2025 | platoon_opponent | On the RHB side, Eugenio Suárez leads the power profile: .252 AVG, .552 SLG, 36 HR vs RHP in 473 PA (29.8% K%). | rank within table |
| S023 | 07-08 | web | platoon_cardinals_annotation | STAT_VALUE | a | slot-bound | platoon_cardinals | Herrera (.330/.455/.660 with 9 HR in 124 PA) is the game-changing RHB in this matchup -- an extreme platoon edge. | "extreme platoon edge" bare magnitude leg |
| S024 | 08-08 | web | key_matchups | STAT_VALUE | a | 2026 | batter_kbb | Batters who can extend the count early -- Herrera (10.4% walk rate in 2026), Masyn Winn (9.3%) -- create conditions for damage before Freeland finds his second-pass rhythm. | prediction leg |
| S025 | 07-24 | web | batter_kbb_stl_note | ABSENCE | a | 2025 | batter_kbb | JJ Wetherholt and Nolan Gorman have no 2025 K%/BB% data on file. |  |
| S026 | 07-08 | web | quick_reference | FRAMING_VOICE | c | - | - | How has Iván Herrera performed against Kyle Harrison in their career? 2. | quick_reference question header |
| S027 | 07-18 | web | season_context_starters | STAT_VALUE | a | 2026 | season_2026 pitching | Dustin May (R) -- STL 2026 to date: 5-6, 4.55 ERA, 93.0 IP, 1.26 WHIP, 89 K / 28 BB, 7 HR allowed. |  |
| S028 | 08-08 | web | quick_reference | GAME_STATE | a | today | streak | The team is on a two-game winning streak entering tonight. |  |
| S029 | 07-31 | web | batter_kbb_annotation | MAGNITUDE | b | - | batter_kbb | Springer (19.2% K%) offers volume contact with elite walk rates. | "elite walk rates" no BB% figure |
| S030 | 09-02 | web | season_context_injuries | ROSTER_FACT | a | today | injuries | Everson Pereira's left hand contusion keeps him off the outfield card as well. |  |
| S031 | 09-04 | web | tto_splits_annotation | STAT_VALUE | a | 2026 | tto table | His 2026 per-pass OPS reads .698 across 216 BF in the first pass, .627 across 216 BF in the second, and .684 across 132 BF in the third. |  |
| S032 | 07-18 | web | baserunning_content | STAT_VALUE | a | slot-bound career | baserunning | Perdomo -- 27 SB, 6 CS, 81.8% success rate. | arithmetic consistent |
| S033 | 07-24 | email | watchlist_prose | FRAMING_VOICE | c | - | - | -- Crooks-May fresh battery. | heading fragment |
| S034 | 08-21 | email | bottom_line_content | ROSTER_FACT | a | tonight | lineups + bats | With five left-handed bats likely in tonight's lineup -- Wetherholt, Burleson, Church, Torres, and Crooks -- the four right-handed options carry the offensive weight: Ivan Herrera, Jordan Walker, Joshua Baez, and Blaze Jordan. |  |
| S035 | 08-21 | email | trend_watch_prose | STAT_VALUE | a | this season | pitcher_platoon | Tonight he faces a left-hander who has held left-handed hitters to a .392 OPS this season -- the most structurally difficult matchup in the projected order. | Trend Watch slot writing matchup content; "most difficult" bare leg |
| S036 | 09-02 | web | web_yesterday_recap | GAME_EVENT | a | yesterday | box_score | The Cardinals took the series opener last night at Dodger Stadium, 13-8, behind a big offensive effort led by Thomas Saggese (2-for-3, two home runs, 3 RBI) and Jordan Walker (3-for-5, one home run, 2 RBI), while Mookie Betts drove in 4 runs for Los Angeles with a pair of doubles. |  |
| S037 | 09-02 | web | inherited_runners_annotation | MAGNITUDE | a | 2026 / 2025 league | inherited_runners + league_benchmarks | Michael McGreevy has inherited just 3 runners and stranded all three (100.0%), a clean mark on a thin sample. 2025's league average strand rate was 68.8%. |  |
| S038 | 08-27 | web | key_matchups | SPLIT_DIRECTION | b | 2026 | pitcher_platoon | His case today is structural: he bats right-handed, the side Rogers has been more hittable against in 2026. | BARE direction, no figures |
| S039 | 09-04 | web | bvp_cardinals_vs_starter_annotation | ABSENCE | a | career | bvp | No significant bench BvP history. |  |
| S040 | 07-31 | email | bottom_line_content | PREDICTION | c | - | - | If St Louis can survive the early innings, the fourth through sixth become the primary window. |  |
| S041 | 08-27 | web | bvp_cardinals_vs_starter_annotation | ABSENCE | a | career / 2026 | bvp + lineup bats | None of these micro-samples approach the volume needed to flag a meaningful danger, and the roster's six left-handed starters -- facing a left-hander in Rogers -- are better gauged through his 2026 platoon work against same-side hitters. |  |
| S042 | 07-24 | web | defense_annotation | STAT_VALUE | a | 2026 | defense | Nathan Church at CF -- tonight's starter at center per the projected lineup -- is clean in 18 CF games (1.000 fld%), though his 0.833 fld% in 7 RF games with 1 error is a small-sample concern at a different position. |  |
| S043 | 09-02 | email | key_matchups_prose | STAT_VALUE | a | 2026 vs RHP | platoon_2026 | Nathan Church, batting ninth, shows a 2026 line of .245/.285/.379 over 305 PA vs right-handers. |  |
| S044 | 08-15 | web | season_context_starters | SPLIT_DIRECTION | a | 2026 (slot) | tto table | His second-time-through-the-order split (.806 OPS, 125 BF) is the game's most exploitable window; his first pass (.610 OPS, 126 BF) is his sharpest. | both figures; the 08-15 hedge false-positive sentence |
| S045 | 07-18 | web | baserunning_content | PREDICTION | c | - | - | They will run selectively, not aggressively. |  |
| S046 | 07-24 | web | platoon_opponent_annotation | STAT_VALUE | a | 2025 | platoon_opponent + kbb | TJ Friedl (.268 AVG, .378 OBP, .394 SLG vs RHP in 487 PA) is the most established LHB in the pool with a 11.8% BB rate in 2025. | rank within pool |
| S047 | 07-08 | email | key_matchups_prose | FRAMING_VOICE | c | - | - | This is the game's biggest platoon collision, and Yelich enters hot from Tuesday. | "enters hot" bare recent-form leg |
| S048 | 09-02 | web | quick_reference | FRAMING_VOICE | c | - | - | How has Freddie Freeman performed against the Cardinals starter in their career? 3. | question header |
| S049 | 07-31 | web | web_yesterday_recap | GAME_EVENT | a | yesterday | plays | A Nootbaar throwing error in the fourth inning had gifted Chicago a run to flip the lead after Torres's second-inning RBI single put St Louis ahead 1-0. |  |
| S050 | 08-27 | web | inherited_runners_annotation | MAGNITUDE | a | 2025 | inherited_runners + league avg | His 2025 strand rate of 54.5% across 11 inherited runners was well short of the league band -- the second-lowest mark on this table. | rank in table |
| S051 | 09-02 | email | bottom_line_content | PREDICTION | c | - | - | Pitching a full bullpen game against a Dodgers lineup that loads up on left-handed bats is the wrong assignment at the wrong moment in the season. | judgment; bullpen-game fact is roster |
| S052 | 07-24 | web | key_matchups | ABSENCE | a | career | battery + roster | None of the catchers in May's battery history data are on the Cardinals' active roster -- his prior pairings reflect his Los Angeles years. |  |
| S053 | 07-18 | email | prediction_grades_commentary | GAME_EVENT | a | yesterday | box_score | Threshold was 8+. 5 < 8. | grading arithmetic |
| S054 | 08-21 | email | trend_watch_prose | TREND | a | season pace | trend_watch P8 | Riley O'Brien's save pace: O'Brien has 33 saves through 129 team games, on pace for 41 on the season. | 33/129*162 = 41.4 |
| S055 | 08-21 | web | platoon_cardinals_annotation | ABSENCE | a | 2026 | platoon_2026 floor | Nathan Church (14 PA) and Jimmy Crooks (8 PA) are too small to treat as reliable standalone references. |  |
| S056 | 07-31 | email | watchlist_prose | PREDICTION | c | - | - | Worth watching how the duo establishes a game plan in a road environment. |  |
| S057 | 09-02 | web | batted_ball_annotation | STAT_VALUE | a | slot-bound | batted_ball AVG | The spread is stark: Will Smith hit .686 on line drives and .374 on grounders versus .084 on flies; Freddie Freeman posted .679 LD / .289 GB / .122 FB; Shohei Ohtani .655 / .290 / .097. |  |
| S058 | 07-18 | web | inherited_runners_annotation | PREDICTION | c | - | - | The Cardinals want O'Brien or Leahy in the leverage spots. |  |
| S059 | 08-21 | web | watchlist | GAME_STATE | a | tonight | lineups | Iván Herrera's at-bats: Batting second, Herrera sees Luzardo in the heart of each pass. |  |
| S060 | 08-08 | web | quick_reference | FRAMING_VOICE | c | - | - | Q: Who are Colorado's main baserunning threats? | question header |
| S061 | 07-24 | email | bottom_line_content | BVP_HISTORY | b | unstated (career vs May) | bvp | Nathaniel Lowe is 2-for-6 (.333 AVG, .833 SLG, 1 HR). | email free slot, scope word absent; arithmetic consistent |
| S062 | 07-24 | web | platoon_opponent_annotation | STAT_VALUE | a | slot-bound | platoon_opponent | Noelvi Marte (.275 AVG, .516 SLG, 13 HR in 256 PA) is a dangerous contact-power combination despite a 4.4% BB rate. | "dangerous" bare leg |
| S063 | 08-08 | web | pitcher_platoon_annotation | SPLIT_DIRECTION | a | 2025 | pitcher_platoon | His 2025 baseline mirrors this: .758 vs LHB (133 PA) vs .730 vs RHB (515 PA). | both figures |
| S064 | 07-08 | web | key_matchups | FRAMING_VOICE | c | - | - | Whichever arm inherits runners tonight bends the middle innings. |  |
| S065 | 07-08 | web | pitcher_platoon_annotation | PREDICTION | c | - | - | The Cardinals' 3 RHB (Herrera, Walker, Winn) will look to work counts; the 6 LHB need to keep the ball off the barrel. | lineup counts leg (a) |
| S066 | 08-15 | email | bottom_line_content | SPLIT_DIRECTION | b | implicit | pitcher_platoon | The lineup construction means Boyd faces his strongest platoon advantage through the first pass; the Cardinals' path to scoring runs almost entirely through right-handed bats or the middle-inning window. | BARE "strongest platoon advantage" |
| S067 | 09-02 | web | key_matchups | STAT_VALUE | b | unstated | platoon tables | Muncy's reads .252/.352/.494 over 369 PA. | subject/stat elided ("Muncy's reads"); 09-02 wrong-Muncy day |
| S068 | 09-04 | web | battery_annotation | STAT_VALUE | a | 2025 | battery | Pedro Pagés also appears in tonight's lineup and carries the deepest 2025 pairing record: 15 games and 76.1 innings with Pallante, during which opponents posted a 4.60 ERA and .257 average. | rank within table |
| S069 | 09-04 | web | platoon_opponent_annotation | SPLIT_DIRECTION | a | 2026 | pitcher_platoon | Andre Pallante holds a clear 2026 platoon advantage against right-handed bats: .618 OPS allowed across 259 batters faced, compared with .709 OPS allowed against left-handed batters across 305 BF. | both figures + BF; direction correct |
| S070 | 08-15 | web | batter_batted_ball_profile_annotation | STAT_VALUE | a | slot-bound | batted_ball | Crow-Armstrong (40.7% FB, 398 BIP) and Suzuki (38.4% FB, 375 BIP) are the most fly-ball-oriented Cubs bats — the greatest risk if McGreevy mislocates pitches. | rank; prediction leg |
| S071 | 08-08 | web | tto_splits_annotation | STAT_VALUE | a | 2025 (slot) | tto table + 60-BF floor | Third pass: 1.089 OPS (85 BF) -- above the 60-BF analytical floor. | quoted floor |
| S072 | 07-24 | email | report_card_recap | GAME_EVENT | a | yesterday | plays | A 5-run Arizona 8th against Svanson and Graceffo (Locklear, Arenado, Moreno RBI singles; Carroll sac fly) put it out of reach. |  |
| S073 | 08-08 | web | tto_splits_annotation | SPLIT_DIRECTION | b | - | tto table | The Cardinals' highest-percentage window against Freeland is innings 1-3. | "highest-percentage window" derived, no figures |
| S074 | 09-04 | web | bvp_cardinals_vs_starter_annotation | FRAMING_VOICE | c | - | - | With career history essentially absent for this group, his 2026 platoon work against right-handed batters is the relevant lens for tonight's matchup. | pipeline-voice meta ("relevant lens") |
| S075 | 07-24 | web | key_matchups | FRAMING_VOICE | c | - | - | May's TTO2 window. | heading fragment |
| S076 | 09-04 | web | battery_annotation | STAT_VALUE | a | 2025 | battery + transactions | Pozo's eight-game stretch (37.2 IP) produced a 6.93 ERA and .303 average, the weakest results in the table, but he is no longer on the roster and does not factor in tonight. |  |
| S077 | 08-08 | web | baserunning_content | MAGNITUDE | b | - | baserunning | Both are above the risk threshold where an aggressive Cardinals battery needs to be deliberate. | "risk threshold" undefined |
| S078 | 08-21 | email | report_card_recap | GAME_EVENT | a | yesterday | plays + season HR totals | Jordan Walker's three-run home run (26) in the third inning gave St Louis a 4-0 lead, but Cincinnati erased it with five in the sixth -- Matt McLain's grand slam (12) was the blow. |  |
| S079 | 09-02 | email | report_card_recap | GAME_EVENT | a | yesterday | linescore | The Cardinals scored 13 runs last night in the series opener at Dodger Stadium, beating the Dodgers 13-8. |  |
| S080 | 07-24 | email | key_matchups_prose | BVP_HISTORY | a | career | bvp | Suarez is 3-for-6 (.500 AVG, 1.000 SLG, 1 HR) career against May. | arithmetic consistent |
| S081 | 07-24 | web | defense_annotation | MAGNITUDE | b | 2026 | defense | Masyn Winn anchors the infield at SS with a .994 fielding percentage in 129 games -- minimal errors and 64 double plays in his primary sample, among the best at the position. | "among the best at the position" — no league SS comparator in payload |
| S082 | 07-24 | email | key_matchups_prose | FRAMING_VOICE | c | - | - | Nathaniel Lowe vs May. | heading fragment |
| S083 | 07-31 | web | defense_annotation | STAT_VALUE | a | 2026 | defense | Winn anchors the Cardinals' defensive profile at shortstop: 129 games, 64 double plays, 3 errors, .994 fielding percentage. |  |
| S084 | 09-02 | web | watchlist | STAT_VALUE | a | 2026 | game logs (starts with 3rd pass) | Yamamoto has pitched into a third pass in 24 of 24 starts, so his third-pass exposure is all but certain tonight. | the "N of N starts" shape |
| S085 | 08-21 | web | quick_reference | STAT_VALUE | a | 2025 | baserunning | PHI baserunning threats (2025): Turner — 36 SB, 7 CS, 83.7%. | arithmetic consistent |
| S086 | 07-24 | web | bvp_cardinals_vs_starter_annotation | ABSENCE | a | career | bvp | These 2-PA samples carry no statistical weight. |  |
| S087 | 09-02 | web | batter_kbb_annotation | STAT_VALUE | a | 2025 / 2026 | batter_kbb | Freeland's 2025 K% was 36.1% across 97 PA, and his 2026 figure across 227 PA stands at 30.0%. | subject plausibility flag (Freeland in a LAD batter slot) |
| S088 | 09-02 | email | watchlist_prose | STAT_VALUE | a | 2026 | catcher baserunning | If Cardinals runners reach base, Will Smith's arm is the trigger: 5 caught stealings on 30 attempts in 2026 -- a 16.7% CS rate -- is the weakest mark on the Dodgers catching staff. | 5/30 = 16.7% ✓; catcher polarity read correctly |
| S089 | 08-21 | web | platoon_opponent_annotation | STAT_VALUE | a | 2025 + 2026 | platoon_opponent + platoon_2026 | Kyle Schwarber (.252/.366/.598, 276 PA) is the left-handed bat with the deepest LHP sample; his 2026 follow-through (.268 AVG, .916 OPS, 200 PA) shows continued production from the same-hand disadvantage position. |  |
| S090 | 08-08 | web | quick_reference | FRAMING_VOICE | c | - | - | Q: What is the Cardinals' bullpen inherited-runner situation? | question header |
| S091 | 07-08 | web | platoon_opponent_annotation | STAT_VALUE | a | slot-bound | platoon_opponent | Ortiz (.203/.261/.272) and Mitchell (.208/.278/.333) are the discount matchups -- attack for outs. | "attack for outs" voice |
| S092 | 07-24 | web | battery_annotation | ROSTER_FACT | a | tonight | lineups | Tonight's scheduled catcher is Jimmy Crooks (batting 7th per the projected lineup, confirmed at position C in today's lineup data). |  |
| S093 | 07-24 | web | platoon_cardinals_annotation | STAT_VALUE | a | slot-bound | platoon_cardinals | Jordan Walker is the concern: .200 AVG and .263 OBP vs RHP in 289 PA. | same 289-PA line labelled "career" on 08-01 (A076) — label ambiguity class |
| S094 | 07-08 | web | key_matchups | FRAMING_VOICE | c | - | - | McGreevy vs Yelich. | heading fragment |
| S095 | 07-31 | web | key_matchups | STAT_VALUE | a | 2025 / this season | batter_kbb + pitcher_kbb | His 2025 K% vs right-handed pitching stood at 31.8%; Cease's 36.5% strikeout rate this season creates one of the night's most defining at-bat-level tensions. |  |
| S096 | 08-08 | web | bvp_opponent_vs_starter_annotation | BVP_HISTORY | a | slot-bound career | bvp | Willi Castro is 1-for-3 (.333) with a walk. |  |
| S097 | 09-02 | email | bottom_line_content | STAT_VALUE | a | 2026 | team pitching + roster | Threat: The Cardinals bullpen has already logged 519.0 innings in 139 games and is now being asked to carry a full game. |  |
| S098 | 09-02 | web | season_context_starters | ROSTER_FACT | a | tonight | probable_pitchers | Yoshinobu Yamamoto (RHP), Los Angeles Dodgers. |  |
| S099 | 09-02 | web | key_matchups | STAT_VALUE | a | 2026 vs RHP | platoon_2026 | Jordan Walker, batting third, has posted a .286/.332/.490 line vs right-handed pitching over 419 PA in 2026. |  |

## 5. Notable specimens found while classifying (not defects filed by this spike)

- **A104 (08-01 web, batted_ball_annotation):** "38.0% GB … he generates grounders at an above-average clip" — the payload's league GB% benchmark is 47.0 (SCOUT-337 body), so this reads inverted. A MAGNITUDE assertion `{subject: Gausman, stat: gb_pct, value: 38.0, comparator: league_avg 47.0, label: above}` fails mechanically.
- **A075 (08-01 web, platoon_cardinals_annotation):** Herrera's .823 OPS **vs LHP** cited as evidence he "handles non-LHB pitching well" against a right-handed starter — a true value bound to the wrong scope, the 08-01 series-error shape in a bound slot.
- **S067 (09-02 web, key_matchups):** "Muncy's reads .252/.352/.494 over 369 PA" — subject and stat elided, on the day the payload carried the wrong Max Muncy's 2025 rows (SCOUT-330).
- **A134 (08-01 web):** "gives her the highest on-base floor" — a voice defect no claim schema touches.
- **A122–A124 (08-01 web, head_to_head_content):** three park-description sentences with no payload path (dome, turf, ball carries) — prior-sourced content, the SPIKE-25 "unguardable 27%" class in miniature.
- **Quick Reference** carries question headers ("How has Iván Herrera performed against Kyle Harrison in their career? 2.") that the splitter surfaces as sentences; they are structure, not claims.
