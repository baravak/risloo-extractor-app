---
name: create-profile
description: Build a new psychological profile (نیم‌رخ) or a new page/chart of one — or edit an existing profile's chart — from a Figma design into a sample JS controller and Handlebars SVG template. Use when the user wants to create, extend, or edit a profile; provides Figma SVG/HTML exports for a sample; or asks to wire a `score` dataset into a chart. Read AGENTS.md alongside this skill for project conventions, helper references, and reusable SVG guidance.
---

# Create / edit a profile (نیم‌رخ)

This project renders psychological-test results into SVG/PNG profiles. A profile = a JS controller (`src/samples/<NAME>.js`) + one or more Handlebars templates (`views/profiles/samples/<NAME>.hbs`, or `<NAME>_1.hbs`, `<NAME>_2.hbs`, … for multi-page). Follow this runbook. **Read `AGENTS.md` first** — this skill references its _Handlebars Helper Reference_, _Gotchas & Reusable Patterns_, and conventions instead of repeating them.

## Core principle — you produce the RAW chart only

You draw only the Figma **Chart** layer (the raw chart). The engine injects the header, sidebar and footer via the `{{#> layout}}` wrapper. **Never put header/sidebar/footer in the HBS.** The CLI emits a `raw` variant (chart only) and a full with-sidebar variant. (AGENTS.md › _What the HBS Draws_.)

## 1. Gather inputs — ask the user for these 6 files (as prompts)

1. **Scoring source** — the engine that computes the `score` object. Its **language varies (PHP, Python, or Node.js)** and it usually lives in a sibling repo or service. Don't assume the language/path — ask. It tells you how each `score` key is computed and what flags mean.
2. **Scoring documentation** — the validity rules, thresholds, and level/norm descriptions (a file or pasted text).
3. **Profile SVG** — `x/<NAME>.svg`. The **source of truth**: which elements exist, exact coordinates, and styling (e.g. a line that looks solid in HTML is `stroke-dasharray` dashed here).
4. **Profile HTML** — `x/<NAME>.html`. A **helper** only: SVG text is outlined paths, so use the HTML to read the text content and learn **where each label goes (and where it doesn't)**, plus colors/gradients. If the HTML has an element the SVG lacks, it's a disabled Figma layer — drop it (AGENTS.md › Gotchas).
5. **Profile JSON** — `src/publish/json/profiles/<NAME>.json` (input dataset; its `score` object drives everything).
6. **Reference PNG** — the designer's rendered export of the **Chart** layer (same variant as the CLI `raw` output, *not* the full sidebar page). This is the validation target for step 8: at the end you render your own `raw` PNG and visually match it against this one. Note which demo data it was rendered with (usually the values in the HTML) so the JSON reproduces the same bar positions.

Then **ask for the designer's Figma comments** — thresholds, coefficients, conditional behavior, spacing rules, and other implementation notes. The Figma MCP / SVG / HTML do **not** contain comments, and these specs usually live only there. Don't start coding until you have them.

If the SVG and HTML disagree (an element present in one, absent in the other, or a different layout), surface it and ask which is authoritative before building.

## 2. Select reusable patterns

Search the repository for existing implementations that match the required chart structure, such as bar orientation, axis mapping, repeated rows, conditional panels, pagination, or RTL label layout.

Choose reusable patterns by structural similarity, not by a permanently designated reference profile. More than one existing implementation may be relevant.

Before reusing code:

1. Identify which behavior is genuinely shared.
2. List the design-specific differences.
3. Decide whether reuse belongs in a partial, controller utility, configuration object, or remains profile-local.
4. Keep profile-specific formulas, text, thresholds, dimensions, and palettes outside shared components.

Read every selected controller and template end to end before copying or extracting a pattern.

## 3. Inventory the design and variations

Before implementation, create an inventory of:

- pages;
- presentation variants;
- data or scoring variants;
- repeated component types;
- optional components;
- variable-length content;
- numeric rendering thresholds; and
- every existing consumer of a partial that will be changed.

For each variation, record whether it changes data, geometry, text, palette, visibility, or only title metadata.

Use this inventory to define the controller context and the validation matrix. Do not encode assumptions from another profile.

## 4. Derive geometry from the SVG

- The Figma **Chart** layer = the SVG `viewBox` (e.g. `0 0 800 674`).
- `dimensions = Chart + 2·padding`; derive `padding` from `(Main − Chart)/2` using the HTML offset (e.g. content at `left:72 top:40` inside a `943×754` frame → `{x:71.5, y:40}`).
- Draw all content inside `<g transform="translate(padding.x, padding.y)">`.
- **Transcribe verbatim**, in the SVG's element order, the static parts: gridlines (`line`), tracks/boxes (`rect`), `linearGradient`, `filter`, icon `path`s. Draw order = z-order — keep it (e.g. a shadowed baseline drawn *after* the bars sits in front).
- **Reconstruct** every text run as a real `<text>` at the SVG's x/y — Figma exports text as outlined `<path>`, never `<text>` (AGENTS.md › Gotchas).
- Check the **axis**: if gridline positions look "irregular", they may be a zoomed range. Derive the linear map `x = a·pct + b` from two `(label, x)` pairs and draw the bars on that scale (AGENTS.md › Gotchas › Custom/zoomed axis).
- **Alignment is the whole job.** This is pixel-precise infographic work — measure exact x/y from the SVG; never estimate. Determine whether each spacing specification refers to component bounds, a text layout box, glyph bounds, a baseline, or visible pixels. Get every label's horizontal alignment (`text-anchor`, RTL-aware) and vertical alignment (row mid-line, shared baseline) right. If the chart sits in an offset frame, transcribe its `translate` exactly. See AGENTS.md › _Alignment and text measurement_.

## 5. Wire the data

- In the controller, define `labels` so each entry's `eng` matches a `score` key; `Object.values(this.labels)` feeds `Dataset._extractData`, producing `dataset.score = [{ label, mark }]`.
- In `_calcContext()`, read **every** mark with `?? 0` (AGENTS.md › `?? 0` rule) — `_extractData` turns a `0` into `undefined`. Compute per-item geometry (bar width / percentage, text x + anchor) and any validity indicators.
- Confirm ambiguous encodings (validity flags `1`=valid vs invalid, reversed answer scales, norm-based levels) against the **scoring source** (PHP/Python/Node.js) — never guess.

## 6. Write the controller + template

- **Controller**: `labels`; `profileSpec` (`sample`, `profile.dimensions`/`padding`, `labels: Object.values(this.labels)`); `constructor` calling `this._init(...)`; `_calcContext()` returning one context object per page.
- **Template**: `{{#> layout}}` → `<defs>` (gradients/clips/filters) → `<g transform="translate(padding.x, padding.y)">` → static structure + `{{#each items}}` rows + conditional boxes → `{{/layout}}`.
- Use the helpers from AGENTS.md › _Helper Reference_ (`bar`, `math`, `boolean`, `ternary`, `object`, `toRad`). Apply the gotcha checklist below.

When extracting a partial:

- define a small explicit input contract;
- pass semantic colors and geometry anchors;
- derive dependent coordinates from those anchors;
- keep scoring and profile-specific decisions in the controller;
- namespace or parameterize `<defs>` IDs; and
- render every existing consumer after changing the partial.

Do not create a partial solely because markup looks similar. Extract it only when the components share the same behavioral and geometric contract.

## 7. Multi-page and variants

- Set `static pages = N`; build `<NAME>_1.hbs … <NAME>_N.hbs`. Create blank `{{#> layout}} … {{/layout}}` placeholders for pages not built yet — **a missing template file errors the whole run**.
- Make `profile.dimensions` / `profile.padding` arrays (indexed `page-1` by `layout.hbs`).
- Treat pages and presentation variants as independent output dimensions. Enumerate the supported combinations before implementation.
- Give each page context the required `titleAppend`. Build it from semantic page and variant metadata rather than template filenames.
- Keep scoring and geometry identical across presentation variants unless the specification explicitly requires a difference.

## 8. Verify

- Render: `./bin/risloo.js E <NAME> -d ./src/publish/json/profiles/<NAME>.json -a ./temp`
- Build scratch JSONs for the verification matrix, render them with `-d <scratch>.json`, and clean them up afterward.

Derive the verification matrix from the profile's own variability axes:

1. Render every page.
2. Render every supported presentation variant.
3. Exercise each independent conditional component in visible and hidden states.
4. Exercise supported content cardinalities where layout depends on item count.
5. For every rendering threshold, test the nearest valid values below, at, and above it.
6. Cover minimum, maximum, missing, and clamped values where applicable.
7. Render both raw and full output when injected layout or title metadata is involved.
8. After changing a shared component, render all its consumers.

Use a full Cartesian matrix only when the dimensions interact visually. Otherwise use focused or pairwise cases that still exercise every behavior.

Verification has three separate gates:

1. **Semantic validation**
   - Confirm expected texts and title suffixes exist.
   - Confirm no `undefined`, `NaN`, invalid dimensions, or broken references exist.
   - Confirm referenced gradients, clips, masks, and filters resolve.
2. **Structural SVG validation**
   - Confirm coordinates, transforms, clipping, filter bounds, radii, strokes, and paint order match the authoritative SVG.
3. **Visual validation**
   - Compare raw output with the raw design reference using identical data.
   - Inspect every page and variant.
   - Use the PNG to locate discrepancies, then use SVG measurements to determine the correction.

Passing one gate does not replace the others. Close by iterating render → view → measure → fix until the raw output matches the reference, then inspect the full output for injected layout and title metadata.

## Gotcha checklist (detail in AGENTS.md › Gotchas)

- [ ] RTL `text-anchor`: right-align Persian with `start`; inside-bar `%` `start`, outside `end`.
- [ ] `?? 0` on every mark read in `_calcContext`.
- [ ] Text reconstructed as `<text>`, not transcribed glyph paths.
- [ ] Western digits in templates (the `DanaFaNum` font shapes them to Persian).
- [ ] Elements emitted in Figma-SVG order (draw order = z-order).
- [ ] Bars drawn on the same scale as the (possibly zoomed) axis labels.
- [ ] Shared-partial geometry derived from explicit anchors; semantic variant inputs passed from the controller.
- [ ] Conditional components follow the design's reserve/collapse/reflow behavior for every independent condition.
- [ ] `<defs>` geometry, filter bounds and primitives, clips, masks, borders, radii, shadows, and paint order verified exactly.
- [ ] Numeric rendering boundaries tested below, at, and above the boundary with valid domain values.
- [ ] Every page, presentation variant, and affected shared-partial consumer rendered.
- [ ] `titleAppend` verified in full output whenever page or variant metadata requires it.
- [ ] No header/sidebar/footer in the HBS — only the Chart layer.
- [ ] Closed with semantic, structural SVG, and visual checks against the reference using identical data.
