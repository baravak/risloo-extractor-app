---
name: create-profile
description: Build a new psychological profile (نیم‌رخ) or a new page/chart of one — or edit an existing profile's chart — from a Figma design into a sample JS controller and Handlebars SVG template. Use when the user wants to create, extend, or edit a profile; provides Figma SVG, PNG, HTML, or handoff exports for a sample; or asks to wire a `score` dataset into a chart. Read AGENTS.md alongside this skill for project conventions, helper references, and reusable SVG guidance.
---

# Create / edit a profile (نیم‌رخ)

This project renders psychological-test results into SVG/PNG profiles. A profile = a JS controller (`src/samples/<NAME>.js`) + one or more Handlebars templates (`views/profiles/samples/<NAME>.hbs`, or `<NAME>_1.hbs`, `<NAME>_2.hbs`, … for multi-page). Follow this runbook. **Read `AGENTS.md` first** — this skill references its _Handlebars Helper Reference_, _Gotchas & Reusable Patterns_, and conventions instead of repeating them.

## Core principle — you produce the RAW chart only

You draw only the Figma **Chart** layer (the raw chart). The engine injects the header, sidebar and footer via the `{{#> layout}}` wrapper. **Never put header/sidebar/footer in the HBS.** The CLI emits a `raw` variant (chart only) and a full with-sidebar variant. (AGENTS.md › _What the HBS Draws_.)

## 1. Gather inputs and assign authority

Ask for the relevant inputs:

1. **Scoring source** — the engine that computes the `score` object. Its **language varies (PHP, Python, or Node.js)** and it usually lives in a sibling repo or service. Don't assume the language/path — ask. It tells you how each `score` key is computed and what flags mean.
2. **Scoring documentation** — the validity rules, thresholds, and level/norm descriptions (a file or pasted text).
3. **Profile SVG** — `x/<NAME>.svg`.
4. **Profile HTML**, when available and authorized — `x/<NAME>.html`.
5. **Profile JSON** — `src/publish/json/profiles/<NAME>.json` (input dataset; its `score` object drives everything).
6. **Reference PNG** — the designer's rendered export of the **Chart** layer (same variant as the CLI `raw` output, *not* the full sidebar page).

Then **ask for the designer's Figma comments** — thresholds, coefficients, conditional behavior, spacing rules, and other implementation notes. The Figma MCP / SVG / HTML do **not** contain comments, and these specs usually live only there. Don't start coding until you have them.

Do not select one design artifact and ignore the others. Establish an authority table for the current task:

- **PNG** — final visual acceptance target, including visible orientation, wrapping, cropping, alignment, and composition.
- **SVG** — exact vector geometry, coordinates, colors, gradients, filters, clipping, strokes, radii, and icon paths.
- **HTML** — optional text-content and semantic-order aid only when the user authorizes its use.
- **Designer notes** — conditional behavior, thresholds, spacing rules, exceptions, and presentation states.
- **Scoring source** — score keys, valid raw values, report states, thresholds, sorting, and correction logic.

If two authorized sources disagree, stop and surface the conflict. Do not silently choose one. Respect task-specific source restrictions; if the user excludes HTML or declares PNG authoritative for appearance, record and follow that decision.

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

Before writing controller or template code, freeze a per-page rendering contract:

| Field | Required value |
|---|---|
| Final Chart size | Exact width × height of the delivered raw chart |
| Logical design size | Upright working-space width × height |
| Orientation | Normal, 90° clockwise, 90° counter-clockwise, or 180° |
| Production transform | The single exact transform applied to the logical design |
| Layout-owned padding | Padding applied by the rendering layout |
| Chart-owned offset | An offset that visibly exists inside the Chart layer |
| Overflow policy | Content must fit, clip, or intentionally overflow |
| Axis mapping | Linear or piecewise score-to-position mapping |

Do not begin detailed drawing while any value in this contract is inferred or provisional. Treat every page independently; never assume that pages in one profile have the same dimensions, padding, orientation, or coordinate system.

## 4. Derive geometry from the SVG

- The Figma **Chart** layer = the SVG `viewBox` (e.g. `0 0 800 674`) and defines the HBS coordinate space.
- Measure padding independently for each page. `dimensions = Chart + 2·padding`, but padding is layout metadata; do not apply it again inside the HBS when the layout already owns it.
- Never introduce a conventional `translate(20,20)`, arbitrary centering transform, or scale. Add an inner transform only when it visibly belongs to the Chart layer and is measured from an authorized source.
- If most elements share one rotation, author the page in an upright logical coordinate system and rotate one outer `<g>` into the final Chart coordinate system. Keep ordinary text, bars, cards, icons, multiline labels, and alignment components unrotated inside that logical space. Use local rotation only for genuine exceptions.
- For a final `W × H` chart rendered by rotating an upright `H × W` design clockwise, use the exact equivalent of `<g transform="translate(W 0) rotate(90)">`. Never use scaling to make a rotated design fit.
- **Transcribe verbatim**, in the SVG's element order, the static parts: gridlines (`line`), tracks/boxes (`rect`), `linearGradient`, `filter`, icon `path`s. Draw order = z-order — keep it (e.g. a shadowed baseline drawn *after* the bars sits in front).
- **Reconstruct** every text run as a real `<text>` at the SVG's x/y — Figma exports text as outlined `<path>`, never `<text>` (AGENTS.md › Gotchas).
- Check the **axis**: if gridline positions look irregular, derive either the linear map or every piecewise segment from labeled score/position pairs. A score exactly on a breakpoint must land exactly on its gridline.
- **Alignment is the whole job.** This is pixel-precise infographic work — measure exact x/y from the SVG; never estimate. Determine whether each spacing specification refers to component bounds, a text layout box, glyph bounds, a baseline, or visible pixels. Get every label's horizontal alignment (`text-anchor`, RTL-aware) and vertical alignment (row mid-line, shared baseline) right. If the chart sits in an offset frame, transcribe its `translate` exactly. See AGENTS.md › _Alignment and text measurement_.

Before drawing repeated components, build a geometry and style ledger containing:

- bar origin, direction, width, height, and rounded corners;
- gridline and breakpoint coordinates;
- invisible text-box dimensions;
- code-box, dash, and title gaps;
- text alignment and writing direction;
- multiline block center;
- inside/outside score threshold and gap;
- exact palette tokens for every component state;
- font class for Persian text, English codes, and numeric values; and
- icon source path and dimensions.

Identify text alignment families before assigning individual coordinates. Record whether each text or number belongs to a shared row, column, baseline, or guide; which edge or center aligns to that guide; its layout-box dimensions; `text-anchor`; writing direction; and behavior after page rotation. Derive family members from the shared guide instead of nudging them independently. Verify the shortest, longest, and an intermediate member.

## 5. Wire the data

- In the controller, define `labels` so each entry's `eng` matches a `score` key; `Object.values(this.labels)` feeds `Dataset._extractData`, producing `dataset.score = [{ label, mark }]`.
- In `_calcContext()`, read **every** mark with `?? 0` (AGENTS.md › `?? 0` rule) — `_extractData` turns a `0` into `undefined`. Compute per-item geometry (bar width / percentage, text x + anchor) and any validity indicators.
- Confirm ambiguous encodings (validity flags `1`=valid vs invalid, reversed answer scales, norm-based levels) against the **scoring source** (PHP/Python/Node.js) — never guess.

## 6. Write the controller + template

- **Controller**: `labels`; `profileSpec` (`sample`, `profile.dimensions`/`padding`, `labels: Object.values(this.labels)`); `constructor` calling `this._init(...)`; `_calcContext()` returning one context object per page.
- **Template**: `{{#> layout}}` → `<defs>` (gradients/clips/filters) → optional measured global-orientation or Chart-owned transform → static structure + `{{#each items}}` rows + conditional boxes → `{{/layout}}`.
- Use the helpers from AGENTS.md › _Helper Reference_ (`bar`, `math`, `boolean`, `ternary`, `object`, `toRad`). Apply the gotcha checklist below.

When extracting a partial:

- define a small explicit input contract;
- pass semantic colors and geometry anchors;
- derive dependent coordinates from those anchors;
- keep scoring and profile-specific decisions in the controller;
- namespace or parameterize `<defs>` IDs; and
- render every existing consumer after changing the partial.

Do not create a partial solely because markup looks similar. Extract it only when the components share the same behavioral and geometric contract.

Implement through three visual gates:

1. **Frame gate** — render only the page frame, major groups, axes, baselines, and representative tracks. Confirm dimensions, origin, orientation, and the global transform.
2. **Component gate** — complete one representative bar, one label cluster, one card, one multiline label, and one conditional state. Compare them against the PNG and exact SVG coordinates.
3. **Repetition gate** — expand verified components through loops and partials.

Do not build the whole page before validating the frame and one representative instance of each component contract.

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
6. For every piecewise axis, test every breakpoint and the nearest valid value on both sides.
7. Cover minimum, maximum, missing, and clamped values where applicable.
8. Render both raw and full output when injected layout or title metadata is involved.
9. After changing a shared component, render all its consumers.

Build a coverage matrix, not an automatic Cartesian product. One fixture may cover several independent states. Use a full Cartesian matrix only when the states interact visually or geometrically; otherwise use focused or pairwise cases that still exercise every behavior. Name each fixture by the states it exercises, and use scoring-valid raw values from the scoring source. If a fixture is intentionally presentation-only and scoring-inconsistent, label it explicitly.

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

Passing one gate does not replace the others. Do not claim a visual issue is fixed from code inspection or a successful render command alone. Close by iterating render → open the actual PNG → compare → measure → fix until the raw output matches the reference, then inspect the full output for injected layout and title metadata. If local coordinate patches accumulate, stop and re-establish the coordinate model instead of continuing to nudge individual elements.

## Gotcha checklist (detail in AGENTS.md › Gotchas)

- [ ] Globally rotated pages authored upright and transformed by one exact outer group; no per-element rotation unless genuinely exceptional.
- [ ] No generic padding translation or scale inside the HBS.
- [ ] RTL/LTR `direction` and `text-anchor` derived together from the intended visual edge and growth direction.
- [ ] `?? 0` on every mark read in `_calcContext`.
- [ ] Text reconstructed as `<text>`, not transcribed glyph paths.
- [ ] English font class used only for semantic Latin identifiers; score and report numbers retain the intended numeric font.
- [ ] Mixed-direction tokens such as percentages visually rechecked after changing spacing or direction.
- [ ] Elements emitted in Figma-SVG order (draw order = z-order).
- [ ] Bars drawn on the same linear or piecewise scale as the axis labels, with exact breakpoint tests.
- [ ] Text families derived from shared rows, columns, baselines, or guides and tested with different content lengths.
- [ ] Shared-partial geometry derived from explicit anchors; semantic variant inputs passed from the controller.
- [ ] Conditional components follow the design's reserve/collapse/reflow behavior for every independent condition.
- [ ] `<defs>` geometry, filter bounds and primitives, clips, masks, borders, radii, shadows, and paint order verified exactly.
- [ ] Numeric rendering boundaries tested below, at, and above the boundary with valid domain values.
- [ ] Every page, presentation variant, and affected shared-partial consumer rendered.
- [ ] `titleAppend` verified in full output whenever page or variant metadata requires it.
- [ ] No header/sidebar/footer in the HBS — only the Chart layer.
- [ ] Closed with semantic, structural SVG, and visual checks against the reference using identical data.
