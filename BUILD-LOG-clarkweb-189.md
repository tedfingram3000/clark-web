# BUILD-LOG-clarkweb-189: SCOUT-189 MIRROR leg (clark-web, data.700clark.com)

- Clone: `C:\Users\tedfi\AppData\Local\Temp\claude\C--Users-tedfi-OneDrive-BasesDataLLC-Claude\a74286d1-eb5c-4584-9e72-21bb2cd266e9\scratchpad\clarkweb189`
- Reference clone (700clark-pipeline, read-only, for diffing): `...\scratchpad\pipeline189ref`, `origin/main` @ `5ace5aa` (merge of PR #161)
- Branch: default branch, worked LOCALLY per Ted's 08-05 remediation precedent (`d9032cb`). Local commit only. **NO PUSH** -- supervisor pushes.
- Executor: PROCESS-8 supervised build, commit-grant scope = clark-web's own archived report mirrors (`YYYY-MM-DD.html`, `clark-YYYY-MM-DD-web.html`, `clark-YYYY-MM-DD-combined-web.html`, `email-YYYY-MM-DD.txt`) plus this file. No non-report site files (index.html, CNAME, QR images), no check-logic (clark-web carries no pytest/validator scripts to touch).

## Step 0: repo layout + mirror mapping (blocking)

clark-web is a **flat static site** (no `reports/` subdirectory, no `.md` files at all -- confirmed via full-repo glob, zero `.md` matches). Three file shapes carry daily-report prose:

- `YYYY-MM-DD.html` -- the standard web-page mirror for all dates from 2026-04-23 onward (the site's naming convention switched off the `clark-*-web.html` pattern after 2026-04-22).
- `clark-YYYY-MM-DD-web.html` -- early-era web pages, 2026-04-11 through 2026-04-22 only, plus two `clark-YYYY-MM-DD-combined-web.html` special pages (2026-05-01, 2026-05-23, multi-game combined editions).
- `email-YYYY-MM-DD.txt` -- the email mirror, present for most dates from 2026-04-24 onward.

No mirror exists for the pipeline's `deepscout-{date}.md` internal artifact (confirmed: 0 `.md` files anywhere in the repo). All markdown-only findings from the pipeline's 115 are therefore **not applicable** to this repo by construction, not by omission.

**Mapping to PR #161's 37 touched pipeline files** (36 `reports/clark-*-web.html` + `reports/clark-*-email.html`, the 35-web+2-email split below; the 35th web file, `clark-2026-07-30-web.html`, was the PR's rider commit `a3d5b84`, not the main 97a2314 commit):

| pipeline file | clark-web file | exists |
|---|---|---|
| `clark-YYYY-MM-DD-web.html` (35 dates, 2026-05-12 through 2026-08-04) | `YYYY-MM-DD.html` | all 35 verified present |
| `clark-2026-05-17-email.html`, `clark-2026-07-04-email.html` | `email-2026-05-17.txt`, `email-2026-07-04.txt` | both verified present |
| `deepscout-*.md` (35 of the 115 findings) | none -- markdown never published to the site | n/a |

The 2026-08-05 page/email pair is **excluded from this leg's scope** -- already corrected by the prior same-day remediation (`d9032cb` + `44585dd`), verified live at HEAD before this build started.

## Step 0: case-insensitive sweep (ground truth for this repo)

Regex sweep across the **entire repo** (213 `.html`/`.txt` files, no PHASE2_SLOT or file-shape gating -- broader than the pipeline check's own file-selection gates, per the ticket's instruction to establish this repo's own ground-truth target list):

1. **PRECISE** -- the pipeline's own exact `_BATTED_BALL_CAREER_LABEL_RE` regex (`career` within a 40-char gap of a `GB%|FB%|LD%|GB rate|FB rate|LD rate|ground-ball rate|fly-ball rate|line-drive rate` token, either order, case-insensitive; gap forbids stray sentence-ending periods but allows decimal points) run against every file with no PHASE2_SLOT/`.md`-only gating: **137 hits**.
2. **BROAD** -- the same shape widened to include `GB/FB/LD AVG`, `GB/FB/LD profile`, and bare `batted-ball` as additional stat tokens, 60-char window: **278 hits** (150 not already in PRECISE).
3. **HEADING** -- `(Career)` / `(Career, Retrosheet)` parenthetical, unscoped: **196 hits**.

**Classification methodology.** Rather than trust the broader regexes at face value, each additional shape was **verified against the pipeline's own actual PR #161 diff** (the merged, Ted-approved reference) for every overlapping date (2026-05-10 onward). This produced a decisive finding: **the pipeline's shipped check itself never touches `GB AVG`/`LD AVG`/`GB profile`/bare `batted-ball` UNLESS a genuine `%`/`rate` token also falls within the 40-char reach of the same "career" occurrence.** Confirmed by direct diff inspection on repeated real examples:

- `"Witt's career GB AVG of .342"` (2026-05-15) -- **left untouched** by the pipeline in both before/after, even though a sibling `"career GB%"` two sentences later in the SAME paragraph was fixed. Confirms `GB AVG` alone is out of the check's regex reach.
- `"Witt's career .342 GB AVG against May's 44.1% GB%"` -- **was fixed** (`career` -> `2025`), because `GB%` sits within the 40-char window after the `GB AVG` text, pulling the whole span into one match.
- `"McGreevy's career 49.2% GB profile meets..."` (2026-07-08) -- **left untouched**; the same paragraph's `"38.4% career GB rate"` a few sentences later **was fixed**.
- `"Iván Herrera (52.6% GB career)"` and `"Against Liberatore (39.1% GB career)"` (2026-08-02) -- **left untouched** (bare `GB` immediately before `career`, no `%`/`rate` suffix attached to `GB` itself does not satisfy the token); the same paragraphs' `"Vladimir Guerrero's 50.0% career GB rate"` / `"Scherzer... career 43.5% FB rate"` **were fixed**.

This is not incidental -- it is the check's designed, reviewed boundary (see `_BB_STAT_TOKEN`'s module comment in `deep_scout_validator.py`, which documents the false-positive history that produced this exact scope). Given clark-web is a byte-for-byte mirror of the same report generator's prose for every overlapping date, and the PRECISE regex reproduced the pipeline's real fix/no-fix boundary exactly on every spot-check performed, **PRECISE is adopted as this repo's target list**, matching "the same relabels... pipeline PR #161 is the reference" instruction. BROAD/HEADING hits outside PRECISE are classified as **out of scope** (see below), not silently dropped.

### PRECISE hit classification: mislabel vs genuine (all 137)

135 of 137 are the same defect class PR #161 fixed (a `career`-labeled GB%/FB%/LD%/rate/ground-ball-rate/fly-ball-rate/line-drive-rate figure that is actually season-2025-grained -- the underlying data-grain finding from the pipeline's build log, `rs_pitcher_batted_ball`/`rs_batter_batted_ball` bound to `HISTORICAL_SEASON=2025`, applies identically here since it is a database-level fact, not a per-report one). **2 of 137 are genuine, unrelated "career" references that the regex's wide bidirectional window pulled in incidentally:**

1. `2026-04-30.html` @24679 -- `"(no career data)"` for Wetherholt. Genuine: states a player has no career-level data on file; the neighboring `"Burleson (42.0% 2025 GB rate)"` is a *different* hitter's *already-correctly-labeled* figure that happened to fall in the same 40-char window. Left untouched.
2. `email-2026-04-27.txt` @5564 -- `"38 career SB at 88.4%"` for Oneil Cruz. Genuine: stolen-base counts are real cumulative career totals (unlike the rate stats), coincidentally near an already-correctly-labeled `"Cruz's 2025 GB%"` for a different metric. Left untouched.

## Build

### Edit mechanism

A Python script located every `career`/`Career` word (case preserved for detection, not for output) inside each of the 135 target PRECISE match spans by **absolute character offset**, computed directly from each file's own text (not copy-pasted from the pipeline diff, to avoid HTML-boilerplate drift between the two repos' otherwise-matching prose). Edits applied **per file, in descending-offset order**, with an **abort-on-drift check** immediately before each splice (byte span must read `career`/`Career` case-insensitively or the whole file is aborted unwritten). **136 word-level swaps across 62 files, zero aborts, zero drift.**

Default replacement: `career` -> `2025`. **One exception**, matching the pipeline's own single documented exception shape (`BUILD-LOG-scout-189.md` "Edit-shape derivation" #27): `2026-07-01.html` @25321, `"(49.2% GB% career, 52.6% GB% in 2026)"` -- a parallel two-clause construction where "career" trails the stat token immediately before a comma, mirroring the sibling clause's trailing `"in 2026"`. Swapped to `"in 2025"` for phrasing parity: `"(49.2% GB% in 2025, 52.6% GB% in 2026)"`, **verified identical to PR #161's own fix for this exact sentence** (2026-07-01 is a mirror-target date). Checked every other `"career...in 2026"` co-occurrence (2026-04-27, 2026-04-28, 2026-06-14 x2) for the same shape -- all four are the *leading*-adjective form (`"career GB%"`, not `"GB% career,"`), which the pipeline's own fix for 2026-06-14 (a mirror-target date) confirms takes the plain `2025` swap, not `in 2025`.

### Line-ending trap (caught before commit, not after)

First apply pass wrote files with default Python text-mode I/O, which silently rewrote every file's native `\n` line endings to `\r\n` on save (Windows `os.linesep` translation) -- **the exact "local re-run rewrites LF->CRLF" trap** from the durable-traps ledger. Symptom: `git diff --stat` on a single-word edit reported the *entire file* as changed (e.g., `2026-07-01.html`: 643 insertions / 643 deletions for one word swap). Caught via `git diff --stat` sanity check before staging, **not** trusted at face value. Root-caused via raw-byte inspection (`\r\n` count vs lone-`\n` count, before vs after). Fixed by: (1) `git checkout -- .` to discard the corrupted write, (2) detecting each file's **native** line-ending style from raw bytes up front (the repo is mixed: most files are LF-only, but `clark-2026-04-15-web.html` and `clark-2026-04-18-web.html` are natively CRLF), (3) re-deriving edits against universal-newline-normalized text (matching the sweep's own offset basis) and re-serializing each file in **its own original line-ending style** before write. Re-verified: `git diff --stat` now shows exactly 124 lines changed across 62 files (matching the 136 word-swaps minus 12 lines carrying 2+ swaps), zero incidental whitespace/EOL noise.

### Diff-stat reconciliation

136 word-swaps -> 124 changed lines (12 "saved" to lines carrying 2+ edits):

| file | word-swaps | lines changed | saved |
|---|---|---|---|
| 2026-04-27.html | 6 | 4 | 2 |
| 2026-05-06.html | 4 | 3 | 1 |
| 2026-05-15.html | 6 | 5 | 1 |
| 2026-06-14.html | 2 | 1 | 1 |
| 2026-06-21.html | 3 | 2 | 1 |
| 2026-07-02.html | 8 | 5 | 3 |
| 2026-07-09.html | 2 | 1 | 1 |
| 2026-07-12.html | 3 | 2 | 1 |
| clark-2026-05-01-combined-web.html | 4 | 3 | 1 |

136 - 12 = 124. Exact. `git diff --stat` confirms exactly 62 files touched, matching commit-grant scope precisely; no non-report file (`index.html`, `CNAME`, `Spain-daily-briefing.html`, `Margaret_QR_Code.PNG`, `Wilson_QR_Code.PNG`) shows in the diff.

### Spot-verification against PR #161

Cross-checked corrected sentences byte-for-byte against the pipeline's own post-merge text for every overlapping mirror date sampled (2026-07-01, 2026-07-02, 2026-07-09, 2026-05-15): **identical wording** in every case, including the one `in 2025` exception. Paragraph-level "still contains `career`" counts also matched exactly between the two repos post-fix (`2026-07-02.html`: 15 paragraphs retain a genuine `career` mention; `clark-2026-07-02-web.html`: same 15) -- confirms the residual genuine-reference population lines up 1:1, not just the fix count.

## Out-of-scope discoveries (NOT fixed -- documented for Ted / follow-up)

1. **`Batted Ball Profiles (Career)` table heading -- 87 instances across the repo's full date range**, all still reading `(Career)` instead of `(2025)`. This is the exact "capital-C heading class" the launch prompt named (`df53c3b` precedent). Investigated whether to bulk-fix using that precedent, and found: **the pipeline's own `reports/` archive carries the identical unfixed heading in 70 of its own historical files** (`grep -rl "Batted Ball Profiles (Career)" reports/` at pipeline HEAD). The only heading fix Ted has directed anywhere, on either repo, was the single **live** 2026-08-05 page (`44585dd` on clark-web, mirroring the pipeline's own 08-05-only rider) -- a deliberate narrow scope (today's page only), not a historical bulk correction. Since this ticket's grant is "the same relabels... pipeline PR #161 is the reference" and PR #161 did not touch this heading anywhere, bulk-fixing 87 clark-web instances would exceed what the pipeline itself did and constitute an unscoped historical-archive decision Ted has not made for this defect class. **Left untouched. Owner: Ted / follow-up ticket** (would need a decision on scope: today's-page-only vs. full-archive-backfill, on both repos, matching the SCOUT-182 heading question).
2. **Pre-pipeline-archive dates (2026-04-08 through 2026-05-09) and early `clark-*-web.html`/`*-combined-web.html` pages carry the same PRECISE-regex mislabel class with no pipeline reference to copy from** (pipeline's `reports/` archive starts 2026-05-10). These were fixed independently in this build using the same mechanical rule (validated exhaustively against the pipeline's confirmed fix/no-fix boundary on the overlapping date range) -- not copied text, but the same rule applied. Flagged here for visibility, not as an unresolved item: **24 of clark-web's 62 touched files fall in this pre-archive range** (04-24, 04-25, 04-26, 04-27, 04-28, 04-29, 04-30, 05-02 through 05-09, plus `clark-2026-04-12/15/18/19/20/22-web.html`).

## Escalations

1. **Heading defect class (`Batted Ball Profiles (Career)`, 87 instances)** -- see out-of-scope discovery #1 above. **Owner: Ted, next-check: whenever SCOUT-189/182's heading follow-up is scoped.**

## Close

Scoped `git add`: the 62 edited report-mirror files (`YYYY-MM-DD.html` / `clark-YYYY-MM-DD-web.html` / `clark-YYYY-MM-DD-combined-web.html` / `email-YYYY-MM-DD.txt`) + this file. One local commit. **NO PUSH.** See final report for commit SHA.
