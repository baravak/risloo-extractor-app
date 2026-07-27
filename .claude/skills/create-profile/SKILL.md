---
name: create-profile
description: Build a new psychological profile (نیم‌رخ) or a new page/chart of one — or edit an existing profile's chart — from a Figma design into a JS controller (src/samples/<NAME>.js) + Handlebars SVG template (views/profiles/samples/<NAME>*.hbs). Use when the user wants to create/extend/edit a profile, references Figma SVG/HTML exports (x/<NAME>.svg, x/<NAME>.html) for a <NAME>, or asks to wire a `score` dataset into a chart. Read AGENTS.md alongside this skill — it holds the conventions, helper reference, and the Gotchas this skill points to.
---

# Create / edit a profile (نیم‌رخ)

This project renders psychological-test results into SVG/PNG profiles. A profile = a JS controller (`src/samples/<NAME>.js`) + one or more Handlebars templates (`views/profiles/samples/<NAME>.hbs`, or `<NAME>_1.hbs`, `<NAME>_2.hbs`, … for multi-page). Follow this runbook. **Read `AGENTS.md` first** — this skill references its _Handlebars Helper Reference_, _Gotchas & Reusable Patterns_, and conventions instead of repeating them.

## Core principle — you produce the RAW chart only

You draw only the Figma **Chart** layer (the raw chart). The engine injects the header, sidebar and footer via the `{{#> layout}}` wrapper. **Never put header/sidebar/footer in the HBS.** The CLI emits a `raw` variant (chart only) and a full with-sidebar variant. (AGENTS.md › _What the HBS Draws_.)

## 1. Gather inputs — ask the user for these 6 files (as prompts)

1. **Scoring source** — the engine that computes the `score` object. Its **language varies (PHP, Python, or Node.js)** and it usually lives in a sibling repo (e.g. for NEO: `../risloo-docker/services/risloo/app/Score<NAME>.php` + trait). Don't assume the language/path — ask. It tells you how each `score` key is computed and what flags mean.
2. **Scoring documentation** — the validity rules, thresholds, and level/norm descriptions (a file or pasted text).
3. **Profile SVG** — `x/<NAME>.svg`. The **source of truth**: which elements exist, exact coordinates, and styling (e.g. a line that looks solid in HTML is `stroke-dasharray` dashed here).
4. **Profile HTML** — `x/<NAME>.html`. A **helper** only: SVG text is outlined paths, so use the HTML to read the text content and learn **where each label goes (and where it doesn't)**, plus colors/gradients. If the HTML has an element the SVG lacks, it's a disabled Figma layer — drop it (AGENTS.md › Gotchas).
5. **Profile JSON** — `src/publish/json/profiles/<NAME>.json` (input dataset; its `score` object drives everything).
6. **Reference PNG** — the designer's rendered export of the **Chart** layer (same variant as the CLI `raw` output, *not* the full sidebar page). This is the validation target for step 7: at the end you render your own `raw` PNG and visually match it against this one. Note which demo data it was rendered with (usually the values in the HTML) so the JSON reproduces the same bar positions.

Then **ask for the designer's Figma comments** — thresholds, coefficients, the inside/outside text threshold, validity logic. The Figma MCP / SVG / HTML do **not** contain comments, and these specs usually live only there. Don't start coding until you have them.

If the SVG and HTML disagree (an element present in one, absent in the other, or a different layout), surface it and ask which is authoritative before building.

## 2. Pick a base profile

Find the closest existing profile and copy its idioms rather than writing from scratch:
- Horizontal bars + validity boxes → `src/samples/FRHPT93.js` + `views/profiles/samples/FRHPT93_2.hbs`.
- A simple 5-row bar chart → `src/samples/BSCT93.js`.
- The most recent full example built with this skill → `src/samples/NEO93.js` + `views/profiles/samples/NEO93_1.hbs`.

Read its JS + HBS end to end.

## 3. Geometry (from the SVG)

- The Figma **Chart** layer = the SVG `viewBox` (e.g. `0 0 800 674`).
- `dimensions = Chart + 2·padding`; derive `padding` from `(Main − Chart)/2` using the HTML offset (e.g. content at `left:72 top:40` inside a `943×754` frame → `{x:71.5, y:40}`).
- Draw all content inside `<g transform="translate(padding.x, padding.y)">`.
- **Transcribe verbatim**, in the SVG's element order, the static parts: gridlines (`line`), tracks/boxes (`rect`), `linearGradient`, `filter`, icon `path`s. Draw order = z-order — keep it (e.g. a shadowed baseline drawn *after* the bars sits in front).
- **Reconstruct** every text run as a real `<text>` at the SVG's x/y — Figma exports text as outlined `<path>`, never `<text>` (AGENTS.md › Gotchas).
- Check the **axis**: if gridline positions look "irregular", they may be a zoomed range. Derive the linear map `x = a·pct + b` from two `(label, x)` pairs and draw the bars on that scale (AGENTS.md › Gotchas › Custom/zoomed axis).
- **Alignment is the whole job.** This is pixel-precise infographic work — measure exact x/y (and text glyph bounds) from the SVG; never estimate. Get every label's horizontal alignment (left/center/right via `text-anchor`, RTL-aware) and vertical alignment (row mid-line, shared baseline) right. If the chart sits in an offset frame, transcribe its `translate` exactly. See AGENTS.md › Gotchas › _Alignment is the whole job_.

## 4. Wire the data

- In the controller, define `labels` so each entry's `eng` matches a `score` key; `Object.values(this.labels)` feeds `Dataset._extractData`, producing `dataset.score = [{ label, mark }]`.
- In `_calcContext()`, read **every** mark with `?? 0` (AGENTS.md › `?? 0` rule) — `_extractData` turns a `0` into `undefined`. Compute per-item geometry (bar width / percentage, text x + anchor) and any validity indicators.
- Confirm ambiguous encodings (validity flags `1`=valid vs invalid, reversed answer scales, norm-based levels) against the **scoring source** (PHP/Python/Node.js) — never guess.

## 5. Write the controller + template

- **Controller**: `labels`; `profileSpec` (`sample`, `profile.dimensions`/`padding`, `labels: Object.values(this.labels)`); `constructor` calling `this._init(...)`; `_calcContext()` returning one context object per page.
- **Template**: `{{#> layout}}` → `<defs>` (gradients/clips/filters) → `<g transform="translate(padding.x, padding.y)">` → static structure + `{{#each items}}` rows + conditional boxes → `{{/layout}}`.
- Use the helpers from AGENTS.md › _Helper Reference_ (`bar`, `math`, `boolean`, `ternary`, `object`, `toRad`). Apply the gotcha checklist below.

## 6. Multi-page

- Set `static pages = N`; build `<NAME>_1.hbs … <NAME>_N.hbs`. Create blank `{{#> layout}} … {{/layout}}` placeholders for pages not built yet — **a missing template file errors the whole run**.
- Make `profile.dimensions` / `profile.padding` arrays (indexed `page-1` by `layout.hbs`); give each page a `titleAppend`.

## 7. Verify

- Render: `./bin/risloo.js E <NAME> -d ./src/publish/json/profiles/<NAME>.json -a ./temp`
- Open `temp/<NAME>.raw.png` (chart only) and `temp/<NAME>.png` (with sidebar); eyeball against `x/<NAME>.svg` / `x/<NAME>.html`.
- Test edge & validity states with **scratch JSONs** that modify the `score` object (flip a `voption_*`/validity flag, push a value to 0% or 100%) and render with `-d <scratch>.json`. Clean up scratch files afterward.
- **Close with a PNG visual match (the final gate).** Render with the **same data the reference PNG used** (the demo values from the HTML) so bars land in the same place, then **view both** `temp/<NAME>.raw.png` and the reference PNG (Read them) and compare region by region. Your eyes catch structural/color/placement/RTL errors but are **not a pixel ruler** — when your eye flags a spot, pull the exact coordinate from the **SVG** and fix from that number, then re-render. Iterate render → view → fix until the two match. (AGENTS.md › Gotchas › _Close with a PNG visual match_.)

## Gotcha checklist (detail in AGENTS.md › Gotchas)

- [ ] RTL `text-anchor`: right-align Persian with `start`; inside-bar `%` `start`, outside `end`.
- [ ] `?? 0` on every mark read in `_calcContext`.
- [ ] Text reconstructed as `<text>`, not transcribed glyph paths.
- [ ] Western digits in templates (the `DanaFaNum` font shapes them to Persian).
- [ ] Elements emitted in Figma-SVG order (draw order = z-order).
- [ ] Bars drawn on the same scale as the (possibly zoomed) axis labels.
- [ ] Validity/alert boxes hidden unless ≥1 indicator; separator dots via `{{#unless last}}`.
- [ ] No header/sidebar/footer in the HBS — only the Chart layer.
- [ ] Closed with a PNG visual match against the reference (raw-vs-raw, same data): viewed both images, iterated render → view → fix until aligned.
