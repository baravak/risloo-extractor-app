---
name: designer-checkup
description: "چکاپ دیزاینر آزمون تکمیل‌شده و دارای نیم‌رخ در risloo-extractor-app: SVG کامل حالت‌های نمایشی، مستند HTML با RTL و Dana، اصلاحات و پس از تأیید PNG منتخب، پاک‌سازی و پوش. با «چکاپ دیزاینر» یا ادامهٔ بازبینی فعال شود؛ ساخت اولیه با create-profile است."
---

# چکاپ دیزاینر نیم‌رخ

Manage the designer's review of an already completed assessment/profile. Creating or editing this skill does **not** start a review or authorize cleanup/push.

## Recognize the stage

| User wording | Action |
|---|---|
| «چکاپ دیزاینر OHQ» / «چکاپ OHQ رو شروع کن» | Prepare the review bundle; wait for designer feedback |
| «چکاپ OHQ رو ادامه بده» | Recover the existing review state and continue |
| Corrections / «این اصلاح‌ها رو اعمال کن» | Apply authorized assessment-scoped fixes, regenerate affected cases |
| «وضعیت چکاپ؟» | Report stage, covered cases, open corrections, remaining work |
| «اوکیه» / «تأییده» | Record approval of this revision; no cleanup or push yet |
| «اوکیه، پوش کن» / «چکاپ رو نهایی کن و پوش کن» | Produce final PNG, attach if supported, clean temporary files and push |

With one active review, the assessment need not be repeated in every message. With multiple active reviews, resolve an ambiguous target before destructive cleanup or push. A new correction after approval creates a new revision needing review. Reuse answers and decisions from the conversation/state; do not ask again.

## Scope and authority

- Find the relevant project checkout independently of the installed skill's cwd. Read its `AGENTS.md`. This skill lives in risloo-extractor-app; its repository reference is [AGENTS.md](../../../AGENTS.md). For chart edits follow [create-profile](../create-profile/SKILL.md); load the appropriate Figma skill before using Figma tools.
- Locate the controller, templates, fixture and approved profile brief. Apply the project's brief/source/conflict rules. Never edit the science team's Markdown brief.
- Discovering a scoring bug does not authorize changing formulas, thresholds, score keys or other tests. Scoring changes require explicit user authorization; obtain the actual scoring source from established context or ask if unknown. Do not expand the scope to unrelated assessments/shared components.
- The designer compares SVGs with their own Figma file. Missing Figma access is not a reason to withhold existing renders and documentation; do not claim Figma fidelity without comparison. Ask for designer comments once, preserving an existing answer that none exist.

## Persist review state

Use `temp/designer-checkup/<NAME>/<review-id>/review.json`. Update it after stage/file changes so another turn or chat can resume without starting over. Keep it small:

```json
{
  "assessment": "OHQ93",
  "phase": "reviewing",
  "approved": false,
  "coverage": [],
  "open_corrections": [],
  "temporary_files": [],
  "final_png": null,
  "trello_card": null,
  "attachment_status": "not_attempted",
  "repositories": [],
  "pushes": []
}
```

Phases: `preparing`, `reviewing`, `correcting`, `approved`, `finalizing`, `complete`. Record incomplete work truthfully. `coverage` maps meaningful fixture names/states to pages, variants and outputs. `repositories` records checkout, approved remote/branch and exact owned source paths.

`temporary_files` contains exact absolute paths and a `kind` (`svg`, `brief-html`, `preview-png`, `fixture`, `helper`). Include all review revisions, raw QA files, and outputs in older temp directories **only when history proves they belong to this same review**. Never register designer source/reference files or unrelated reviews. No broad `rm temp/*.svg` or whole-temp deletion.

## 1. Prepare the review bundle

1. Interpret «تمام احتمالات» as every distinct supported presentation state, not every possible numeric response permutation. Derive a coverage matrix from the brief, controller/templates, notes and actual scoring: every page/presentation variant; valid/incomplete/invalid states; independent alerts and interacting combinations; visibility/cardinality; min/max and boundaries for colors, label positions and piecewise axes. Follow AGENTS.md's boundary-driven coverage rules. Combine cases when one fixture covers multiple independent states; enumerate all interactions that affect layout. Do not call one ordinary sample complete coverage.
2. Prefer fixtures generated through scoring, with consistent raw/aggregate/percentage/level values. Label any deliberately inconsistent layout-only fixture `presentation-only`. Use synthetic data, including sidebar identity fields; never use real patient information for review/Trello.
3. Generate **full SVGs with sidebar**, named by state, under separate case directories, for all pages. For example:

   ```bash
   ./bin/risloo.js E <NAME> profile -p with-sidebar -d <fixture.json> -a <review-dir>/<case>
   ```

   CLI PNGs are temporary QA previews. Render raw when needed for comparison/fixes; the designer-facing primary files are full SVGs. Register every generated file, including prior revisions, in the manifest.
4. Convert the current brief Markdown into **temporary HTML**, `lang=fa`, `dir=rtl`, right-aligned, RTL tables, embedded **Dana** from `views/profiles/fonts.css`; no CDN. Preserve scientific text, status, tables and values. Use:

   ```bash
   node <skill-dir>/scripts/render-brief.cjs <brief.md> <review-dir>/brief.html --root <project-root> --marked <marked-module-path>
   ```

   Locate `marked` in existing dependencies or through `load_workspace_dependencies`; do not add project dependencies for a preview. Keep generated HTML out of `docs/profiles/`. Give the **HTML** reading link alongside SVG links; keep the original MD accessible.
5. Inspect actual PNGs and the rendered HTML/font. Open full SVGs and HTML in the app and provide absolute links plus a concise case/coverage index. Await the designer's corrections; no cleanup or push in this phase.

## 2. Apply corrections

Apply authorized fixes only to this assessment. Follow AGENTS.md for shared-component impact, visual verification and design-rule updates; rules belong in the design guide, never the scientific brief. Use the same fixtures to compare before/after, regenerate affected cases and inspect actual PNGs, including full-page header/sidebar. Record resolved/open corrections. HTML is regenerated from the MD, never a new source of scientific requirements.

## 3. On «اوکیه، پوش کن»

This instruction for the active review authorizes the following without another confirmation. Perform them only after this instruction:

1. **Choose and create one final PNG:** use the approved implementation and a scoring-valid case that displays the richest meaningful simultaneous states (themes, compatible alerts, long labels, label positions). Do not combine impossible conditions or select a global no-score alert that hides the whole chart merely to inflate coverage. For a multipage profile, choose one representative page for the single PNG and name it; all pages were delivered as SVGs during review. Do not invent a collage. Briefly identify uncovered states when no single PNG can show them all.
2. Produce a **full PNG with sidebar**, at the CLI's normal/default pixel dimensions; no 4× render, artificial upscale or lossy conversion. Open/inspect it, retain it at `<review-dir>/final/<NAME>.png`, and set `final_png`. This file is **not** disposable.
3. **Trello:** this workflow authorizes attaching this synthetic PNG to this assessment's card. Use a supplied/confirmed card; read-only search is allowed, but do not guess between ambiguous results. Upload only if the available connector actually supports local file attachments, and verify success. The current Trello connector may have no upload action; then deliver the local PNG and state the limitation. Do not attach a local path as a cloud URL or upload to a different public service. Do not create/move/close cards or post comments unless separately requested. An unavailable/failed attachment does not block the PNG fallback, cleanup or authorized push. Record attachment status and preserve the file.
4. **Cleanup:** after verifying the final PNG, delete **all registered SVGs** from this review (all states/pages/raw/prior revisions), the temporary brief HTML, and its generated preview PNGs/fixtures/helpers. Before each deletion verify ownership and that the resolved path is under the project's temp directory. Preserve the final PNG, original MD, designer inputs/references and unrelated work. Verify that registered disposable paths no longer exist; keep only the final PNG and small review manifest for this review. Do not leave embedded-font HTML or SVG copies in tracked docs.
5. **Commit and push:** inspect diffs and remote state, run checks appropriate to the actual changes, stage explicit owned source paths only, and push to the confirmed remote/branch. If no source changes were needed, skip the empty commit/push and report that outcome; still produce PNG and clean up. Extractor normally uses `origin/master`; scoring is a separate repo and may use `production`. Reuse confirmed destinations; if still unknown, ask only for the missing destination while completing independent work. Never equate main/master/production, create a substitute branch, merge production into main, force-push, tag/bump versions or publish npm releases under this instruction. A push failure leaves `phase=finalizing`; preserve PNG and commit metadata, then retry only unfinished work after resolving it.
6. Mark `complete` only after PNG, checks, cleanup and all requested pushes succeed. Trello fallback to a delivered local PNG is an allowed outcome, recorded separately. Report PNG link, attachment outcome and commit/branch for each repository; do not return links to deleted SVG/HTML files.

## Designer shorthand

- «چکاپ دیزاینر OHQ رو شروع کن؛ این هم لینک فیگما و کارت ترلو ...»
- «توی چکاپ OHQ، عنوان کل رو بولد کن.»
- «وضعیت چکاپ OHQ؟»
- «چکاپ OHQ اوکیه، نهایی کن و پوش کن؛ extractor روی master، scoring روی production.»

Save Figma/card references on first use; a missing card does not block review. Assessment and stage are sufficient to invoke the workflow without restating it.
