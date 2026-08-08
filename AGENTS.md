# AGENTS.md

> Single source of truth for agent instructions in this repo (Codex, Claude Code, …).
> `CLAUDE.md` is only a pointer to this file — edit **this** file, never the pointer.

## Skills (runbooks)

| Skill | Path | Use for |
|---|---|---|
| `create-profile` | `.claude/skills/create-profile/SKILL.md` | Create / extend / edit a profile (نیم‌رخ) from a Figma design → JS controller + HBS template. `.agents/skills/create-profile/SKILL.md` is a vendor-neutral pointer to the same file (Codex scans `.agents/skills` from the cwd up to the repo root). |

## Project Overview

**@baravak/risloo-profile-cli** is a Node.js CLI tool that converts psychological test result JSON data into SVG and PNG profile/report images. It supports 81+ psychological questionnaires with Persian/Farsi labeling.

Published as npm package: `@baravak/risloo-profile-cli` (v4.46.2, MIT)

---

## Directory Structure

```
risloo-extractor-app/
├── bin/
│   └── risloo.js                # CLI entry point
├── src/
│   ├── cli.js                   # Commander.js command definitions
│   ├── cli-commands/
│   │   ├── Executor.js          # Base executor class
│   │   ├── ExtractExecutor.js   # Profile/report/sheet extraction logic
│   │   ├── GiftExecutor.js      # Gift card generation
│   │   └── utilities/           # BaseOps, Benchmarker, Response, Errors, Status codes
│   ├── Profile.js               # Base Profile class (math utilities)
│   ├── Gift.js                  # Gift card class
│   ├── samples/                 # JS controller files — one per profile
│   ├── handlebars/
│   │   ├── init.js              # Handlebars initialization
│   │   ├── helpers.js           # Entry point for all helpers
│   │   ├── helpers/             # 45+ geometry helper modules
│   │   ├── importPartials.js    # Partials loader
│   │   └── polygon.js           # Polygon drawing logic
│   ├── helpers/                 # Math helpers (angleABS, polarXY, gauge, polygonXY)
│   ├── qrcode/                  # QR code generation & rendering
│   └── publish/
│       ├── json/profiles/       # Template JSON per sample
│       ├── json/gift/           # Gift template data
│       └── test.js              # Auto-test all samples
├── views/
│   ├── profiles/samples/        # Handlebars SVG templates (.hbs)
│   └── gift.hbs
└── package.json
```

---

## Commands

```bash
# Test a single profile (generates SVG in ./temp)
./bin/risloo.js E <NAME> -d ./src/publish/json/profiles/<NAME>.json -a ./temp

# Watch mode
risloo extract <NAME> profile -i local -d ./src/publish/json/profiles/<NAME>.json -o local -a ./temp -w

# Generate gift card
risloo gift -i raw-json -d '{"code":"..."}' -o local -a ./output

# Test all samples
npm test   # → node ./src/publish/test.js
```

---

## Profile Development Workflow (Figma → Code)

### Design Sources and Authority

Each profile is designed in Figma. Per task, one or both of the following may be provided:

- **Figma design file** — connect via Figma MCP to read layer dimensions and structure. The relevant layer is named **Chart**.
- **Figma handoff file** — contains additional implementation notes and specs. It may state that this profile is similar to an existing one. In that case, inspect the referenced profile's JS + HBS files, identify the genuinely shared behavior, and apply only the described differences.

> **Important:** The Figma MCP reads text layers only — it does NOT read Figma comments. Designers often leave critical specs (thresholds, coefficients, pixel values) as Figma comments. Always ask the user to share designer comments before finalizing the plan.

Assign authority by source role instead of selecting one artifact and ignoring the others:

- **PNG** — final visual acceptance target, including visible orientation, wrapping, cropping, alignment, and composition.
- **SVG** — exact vector geometry, coordinates, colors, gradients, filters, clipping, strokes, radii, and icon paths.
- **HTML** — optional text-content and semantic-order aid only when the user authorizes its use.
- **Designer notes** — conditional behavior, thresholds, spacing rules, exceptions, and presentation states.
- **Scoring source** — score keys, valid raw values, report states, thresholds, sorting, and correction logic.

Respect task-specific source restrictions. If two authorized sources disagree, stop and surface the conflict instead of silently choosing one.

### What the HBS Draws

The HBS file draws **only the Chart layer** — i.e. the **raw** chart. The engine produces the final page by automatically injecting the header (test name, dates, client info), the sidebar (logo, room info, prerequisites) and the footer/closing info via the `{{#> layout}}` wrapper. Never include any of these in the HBS. (The CLI emits both a `raw` variant — chart only, e.g. `<NAME>.raw.svg/png` — and the full with-sidebar variant `<NAME>.svg/png`.)

### SVG Coordinate System

Since this is SVG, coordinate origin matters for correctness across **all** inputs:

- **x=0** = left edge, increases rightward
- **y=0** = top edge, increases downward
- Horizontal bars fill left → right: `{{bar (BAR_WIDTH * factor.p) height ...}}`
- Vertical total bar fills bottom → up via the transform trick: `translate(0, barHeight - barHeight * p)`
- All positions must remain stable for edge-case inputs: 0% score, 100% score, missing data

### Global Page Orientation

Global rotation is a coordinate-system decision. When most elements on a page share one rotation, author the page in an upright logical coordinate system and rotate one outer group into the final Chart space.

For a final `W × H` chart rendered by rotating an upright `H × W` design clockwise:

```svg
<g transform="translate(W 0) rotate(90)">
  <!-- author regular geometry here -->
</g>
```

The coordinate mapping is:

```text
finalX = W - logicalY
finalY = logicalX
```

and its inverse is:

```text
logicalX = finalY
logicalY = W - finalX
```

Use this conversion systematically when measurements come from an already rotated SVG. Do not mentally swap `x` and `y` for individual nodes. Keep ordinary text, bars, cards, icons, multiline labels, and alignment components unrotated inside the logical space; apply local rotation only to genuine exceptions. Never use scaling to make a rotated design fit.

### Bar Geometry and Inside/Outside Text

Use `{{bar ...}}` when only the terminal corners are rounded. Do not replace a partially rounded bar with `<rect rx="...">`, which rounds all four corners.

Treat the bar end as the center of a two-sided safe zone:

- **Inside label** — anchor at `barEnd - gap` and let the text grow opposite the fill direction.
- **Outside label** — anchor at `barEnd + gap` and let the text grow in the fill direction.

Choose `text-anchor` from the actual writing direction and coordinate system. Do not preserve an anchor after changing `direction` or moving a label between rotated and unrotated spaces.

Inside/outside thresholds are presentation rules and may differ between chart groups. Never reuse one global threshold unless the design explicitly defines one. Verify zero-width, narrow, threshold, maximum, and clamped bars.

### File Structure per Profile

Each profile (نیم‌رخ) consists of three files:

| File | Path | Role |
|---|---|---|
| JSON template | `src/publish/json/profiles/<NAME>.json` | Test data / input template |
| JS controller | `src/samples/<NAME>.js` | Data processing, geometry config |
| HBS template | `views/profiles/samples/<NAME>.hbs` | SVG rendering |

If a profile has **multiple pages**, the HBS files are named with suffixes:
- `<NAME>_1.hbs`, `<NAME>_2.hbs`, `<NAME>_3.hbs`, ...

Multi-page mechanics:
- Set `static pages = N` on the controller class. `ExtractExecutor.js` then loads `<NAME>_1.hbs … <NAME>_N.hbs` (a single-page profile uses the un-suffixed `<NAME>.hbs`). **A missing template file errors the whole run** — when a page isn't built yet, create a blank `{{#> layout}} … {{/layout}}` placeholder for it.
- `profile.dimensions` and `profile.padding` become **arrays**; `layout.hbs` picks index `page - 1` for each page. Each entry returned by `_calcContext()` is one page's context object and may carry a `titleAppend` string that is appended to the header title.

### Dimensions & Padding Convention

The HBS owns exactly the raw Chart coordinate space. Its origin is the Chart layer's `(0, 0)`, and all authored content must remain within the declared Chart width and height unless the design explicitly clips or overflows it.

There is no universal profile padding. Measure padding independently for every page.

The `dimensions` property in the JS controller adds padding back on both sides of the **Chart** layer dimensions:

```js
get dimensions() {
  return {
    width: 736 + 2 * this.padding.x,   // Chart layer width from Figma
    height: 254 + 2 * this.padding.y,  // Chart layer height from Figma
  };
},
```

Padding is layout metadata. Do not apply the same padding again inside the HBS when the layout already owns it.

Never introduce a conventional `translate(20,20)`, arbitrary centering transform, or scale. Add an inner translation only when that offset visibly belongs to the Chart layer and is measured from an authorized source.

Fix geometry at the layer that owns the error:

1. Chart dimensions
2. Global orientation transform
3. Major group anchor
4. Repeated component geometry
5. Individual text placement

Do not alter a lower layer to compensate for an error in a higher layer.

### Data / Labels Convention

All data needed for rendering goes in the `labels` property of the JS controller.

The data structure is typically derived from a Python script that outputs a JSON file — flattened with `_` separators — which maps source fields to their `labels` keys.

```js
get labels() {
  return {
    // flat_key: value
    score_total: ...,
    subscale_anxiety: ...,
  };
}
```

**Where the `score` values come from.** The JSON `score` object fed to a profile is produced by a separate **scoring engine** whose language **varies per test — it may be PHP, Python, or Node.js** — and which usually lives in a sibling repo or service. **Always ask the user for the actual scoring-source file** rather than assuming the language/path. When a score key's meaning is ambiguous — especially validity flags (is `1` valid or invalid?) — read that source to confirm the encoding instead of guessing; the scoring source also defines the level thresholds (norms) and per-item (reverse) scoring. Each `score` key is matched to a label via `label.eng`.

**The `?? 0` rule.** `Dataset._extractData` (in `src/Profile.js`) maps `mark: score[label.eng] || …`, so a score of `0` (or any falsy value) falls through to `undefined`. Always read marks with `?? 0` in `_calcContext` to avoid `NaN` widths/positions.

---

## Handlebars Helper Reference

Common helpers used in profile templates (defined under `src/handlebars/helpers/`):

| Helper | Signature | Notes |
|---|---|---|
| `bar` | `bar W H (object tl= bl= tr= br=) (toRad deg) ...attrs` | Rounded-rect `<path>` — the building block for every fill bar. For a horizontal bar use `tl=bl=0` and round `tr/br`. The hash accepts `fill`, `fill-opacity`, `stroke`, `clip-path`, `transform`. |
| `math` | `math a op b` | Arithmetic `+ - * / %` (op defaults to `+`). Nestable: `(math (math …) '*' …)`. |
| `boolean` | `boolean a op b` | Comparison/logical `=== !== == != < <= > >= && \|\|`. |
| `ternary` | `ternary cond a b` | Returns `a` if `cond` is truthy, else `b`. |
| `object` | `object k=v …` | Builds an inline object literal (used for the `bar` corner radii). |
| `toRad` | `toRad deg` | Degrees → radians. |

---

## Gotchas & Reusable Patterns

Hard-won knowledge that applies to **every** profile:

### Alignment and text measurement

- **Alignment is the whole job — measure, never estimate.** These are pixel-precise **infographics** built from SVG, so every element must line up with the design both horizontally and vertically. Pull exact coordinates from the SVG instead of eyeballing them. Decide per label whether it is left-, center-, or right-aligned, and center row text on the row mid-line with a shared baseline. If the chart lives inside an offset frame, transcribe that `translate` exactly.
- Identify what a design spacing measurement refers to before implementing it: component bounds, text layout box, glyph bounds, baseline, or visible painted pixels. These are not interchangeable.
- Measure the two relevant edges from the authoritative SVG. Do not compensate for a spacing error by moving unrelated elements.
- When several labels share a relationship with a chart origin, derive all their positions from that origin so alternate dimensions remain aligned automatically.

Before placing individual `<text>` nodes, identify alignment families: axis values, raw scores, codes, dashes, Persian titles, card values, section headings, and bar labels often share a row, column, baseline, or guide. For each family record:

| Field | Meaning |
|---|---|
| `axis` | Whether the guide lies on `x` or `y` |
| `coordinate` | Exact guide coordinate |
| `alignedPart` | Start edge, end edge, center, or baseline |
| `layoutBox` | Invisible text-box dimensions |
| `anchor` | `text-anchor` |
| `direction` | Actual writing direction |
| `baseline` | Shared baseline or vertical center |

Members of one family do not necessarily use `text-anchor="middle"`. Determine what the design aligns:

- If axis numbers end on a gridline, align the text end rather than its center.
- If codes occupy equal invisible boxes, align the boxes first and align text within each box.
- If titles begin after a dash, derive their start edge from the shared dash guide.
- For values of different lengths, align the specified edge or layout box rather than visible glyph centers.
- For texts in one row, share a baseline or vertical center instead of merely assigning similar `y` values.

Identify these families in the upright logical space for globally rotated pages. A logical column may appear as a final horizontal row after rotation. Verify each family with its shortest, longest, and an intermediate member.

When a design specifies an invisible code box, treat it as real geometry. Record its origin and dimensions, text alignment, chart-to-box gap, box-to-dash gap, dash-to-title gap, and shared row baseline. Measure gaps from component bounds, not visible glyph edges. Center a multiline label as one block, not as independently positioned lines. Extract a partial when this full contract repeats.

### RTL alignment

- The root SVG sets `direction="rtl"` in `views/profiles/layout.hbs`, which affects horizontal text flow and the advance direction of rotated labels.
- Under RTL, `text-anchor="start"` puts the right edge at `x` and grows text leftward; `text-anchor="end"` puts the left edge at `x` and grows text rightward. Derive `direction` and `text-anchor` together from the intended aligned edge and growth direction; do not reuse an anchor after changing direction.
- A `<text transform="rotate(-90,0,0) translate(tx,ty)">` advances downward on screen under the inherited RTL direction. Its baseline x is `<group-x> + ty`, and its top edge is `<group-y> − tx`. Measure the intended top and baseline from the SVG rather than assuming the text advances upward.

### Font and bidirectional numeric tokens

- Apply the English font class only to semantic Latin identifiers such as codes and abbreviations, including digits embedded in those identifiers.
- Do not apply the English font class to raw scores, BR values, percentages, axis values, or report numbers unless the design explicitly requests it. Those values should normally remain in the profile's Persian numeric font.
- Treat mixed-direction tokens such as numbers with percent signs as one visual component. Set `direction`, `unicode-bidi`, anchors, and spacing explicitly; do not rely on source-string order under inherited RTL.
- After adding whitespace to a mixed-direction token, re-render it. Bidi reordering can change both visual order and anchor behavior.

### Source fidelity and rendering rules

- **`?? 0` on every mark.** See _Data / Labels Convention_ — `_extractData` turns a `0` mark into `undefined`; always guard with `?? 0`.
- **Figma SVG = outlined paths, not text.** Do not transcribe glyph paths. Reconstruct text with real `<text>` elements and obtain content from an authorized semantic source such as designer notes, JSON/scoring labels, or HTML when its use is allowed.
- **Authority is field-specific.** Use the source-role contract above instead of treating one artifact as authoritative for every concern. Inspect every authorized source and surface conflicts.
- **Persian digits come from the font.** Emit Western digits in templates (`{{item.mark}}`, `از 192`, `50 ٪`); the `DanaFaNum` font shapes them to Persian. Never hand-convert.
- **Draw order = z-order.** Later elements paint on top. Preserve the Figma SVG's element order.

### Piecewise score axes

Never assume that one coefficient covers a score axis's full domain. Represent the axis as ordered breakpoints or segments. For a segment from score `a` at position `p0` to score `b` at position `p1`:

```js
position = p0 + ((score - a) * (p1 - p0)) / (b - a);
```

Select the segment containing the score and clamp only at the domain boundaries. A score exactly equal to a breakpoint must land exactly on that breakpoint's gridline. Verify every breakpoint and the nearest valid value on both sides.

### Exact palettes and source icons

- Create semantic palette tokens from exact SVG color values. Every related part of a stateful component—bar, track, label, card body, footer, divider, border, and icon—must derive from the selected theme unless an exception is documented.
- Do not substitute a visually similar hex value.
- Use the exact SVG path for design-specific arrows, alerts, and symbols. Do not replace them with Unicode characters, generic icon libraries, or hand-drawn approximations.

### Shared templates and partials

- Treat every partial as a parameterized visual component. Do not bake a specific profile's coordinates, palette, labels, thresholds, or variant rules into a shared partial.
- Express geometry relative to meaningful anchors such as `barX`, `barWidth`, row center, label edge, or component bounds. Avoid unrelated absolute coordinates when the component is shared.
- Pass visual differences through semantic properties such as `primary`, `accent`, `track`, `border`, `shadow`, and `labelOutside`; do not infer colors from profile names, row indexes, or variant labels.
- Before changing a shared partial, find every controller and template that consumes it. After the change, render all affected consumers, including at least one unchanged consumer as a regression check.
- A shared partial must have an explicit input contract: required values, defaults, coordinate system, conditional sections, and ownership of `<defs>` IDs.

### Conditional components

- For every conditional component, determine from the design whether hiding it preserves its reserved space, collapses its space, or causes another component to occupy its position.
- Do not assume independent conditions are mutually exclusive.
- For components containing a variable number of items, compute item positions and separators from the active items instead of maintaining fixed markup for anticipated combinations.
- Build validation cases from the component's actual independent conditions and supported item cardinalities. Create a coverage matrix rather than an automatic Cartesian product: one fixture may cover several independent states, and a full product is needed only when states interact visually or geometrically. Name each fixture by the states it exercises.

### SVG effects, clipping, borders, and shadows

- Treat `<defs>` as measurable design geometry, not approximate decoration. Reproduce and verify `filterUnits`; filter bounds (`x`, `y`, `width`, `height`); `dx` and `dy`; blur radius; flood color and opacity; primitive order and `in`/`result` wiring; clip/mask geometry; transform coordinate space; and final paint order.
- Verify both the direction and extent of every shadow against the reference PNG.
- When a rounded component contains fills or effects, use clipping where required and draw its final border after the clipped content. Confirm that radius, border thickness, corners, and shadow are visually independent.
- Use unique IDs for gradients, clips, masks, and filters when a partial can appear more than once in one document.

### Boundary-driven rendering tests

- Extract every rendering boundary from the design notes, scoring source, and controller logic.
- For each numeric boundary, render values immediately below, at, and immediately above it, using the nearest valid values for that domain.
- For every piecewise axis, test each breakpoint and the nearest valid value on both sides.
- Also cover the domain minimum, maximum, zero when valid, missing input, and out-of-range input if clamping is expected.
- Test the visual behavior, not only the computed value: bar width, clipping, label placement, anchor, contrast, and overflow.
- Test fixtures must be derived from the current profile's rules and use scoring-valid raw values. Fixed example values must not become global conventions. Label intentionally presentation-only, scoring-inconsistent fixtures explicitly.

### Visual verification before claiming a fix

Do not report a visual issue as fixed based only on code inspection or a successful render command.

For every affected page:

1. Render the raw PNG.
2. Open and inspect the actual PNG.
3. Compare it with the reference at the same orientation.
4. Use the PNG to locate the mismatch.
5. Return to the SVG or geometry ledger for the exact correction.
6. Re-render and inspect again.

Validate major geometry before typography:

1. Chart width and height
2. Origin and global transform
3. Major group extents
4. Bar and grid dimensions
5. Repeated alignment contracts
6. Text baselines and glyph-level adjustments

If several local coordinate patches accumulate, stop. Re-establish the coordinate model from the sources instead of continuing to nudge individual elements.

### Pages, variants, and title metadata

- Treat pages and presentation variants as independent output dimensions. Enumerate the supported combinations before implementation.
- Each page context must provide the title suffix required to distinguish that output. Build `titleAppend` from semantic page and variant metadata rather than from template filenames.
- Validate `titleAppend` in the full SVG/PNG, because it belongs to the injected page header and is not visible in the raw chart.
- A variant must not change scoring or geometry unless the specification explicitly says so.

### Concurrent-work hygiene

- Assume files may change while the task is in progress. Re-read shared files immediately before editing them.
- Inspect the diff before and after each shared-file modification.
- Stage explicit intended paths unless the user has expressly requested publishing all workspace changes.
- Do not overwrite or normalize concurrent changes merely to make the current diff cleaner.

---

## Tech Stack

| Area | Technology |
|---|---|
| Language | JavaScript (Node.js, no build step) |
| CLI | Commander.js |
| Templating | Handlebars (SVG generation) |
| Image output | Sharp (SVG → PNG) |
| Dates | Moment.js + moment-jalaali (Persian calendar) |
| QR codes | qrcode |
| File watching | Chokidar |
| Package manager | npm (`package-lock.json` is the lockfile) |
| Design source | Figma (via MCP) |

---

## Naming Conventions

- `items` — array of data elements to draw
- `raw` — total/aggregate element
- `ticks` — graduation marks on profiles
- `s` suffix — denotes arrays (not `Arr`)
- Sample names: uppercase acronym + version/year suffix (for example, `<ACRONYM><SUFFIX>`)
- Dataset score structure: `dataset.score = [{ label: { eng, ... }, mark }]`

---

## Publishing

Releases go through GitHub Actions via npm **trusted publishing** (OIDC) — there
is no npm token anywhere, local or in secrets. Tag the release and push it; the
`.github/workflows/publish.yml` job publishes it.

```bash
npm version <patch|minor|major>   # bumps package.json and creates the vX.Y.Z tag
git push --follow-tags            # pushing the tag triggers the release
# prepublishOnly: npm test — runs inside the job before the registry is touched
```

The job refuses to publish if the tag and `package.json` version disagree.
Publishing from a laptop with `npm publish` is not expected to work: npm
removed non-expiring tokens, and the package is configured to trust this
workflow instead.
