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
│       ├── test.js              # Auto-test all samples
│       └── bot.js               # Post-publish automation
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

### Design Source

Each profile is designed in Figma. Per task, one or both of the following may be provided:

- **Figma design file** — connect via Figma MCP to read layer dimensions and structure. The relevant layer is named **Chart**.
- **Figma handoff file** — contains additional implementation notes and specs. It may state that this profile is similar to an existing one. In that case, inspect the referenced profile's JS + HBS files, identify the genuinely shared behavior, and apply only the described differences.

> **Important:** The Figma MCP reads text layers only — it does NOT read Figma comments. Designers often leave critical specs (thresholds, coefficients, pixel values) as Figma comments. Always ask the user to share designer comments before finalizing the plan.

### What the HBS Draws

The HBS file draws **only the Chart layer** — i.e. the **raw** chart. The engine produces the final page by automatically injecting the header (test name, dates, client info), the sidebar (logo, room info, prerequisites) and the footer/closing info via the `{{#> layout}}` wrapper. Never include any of these in the HBS. (The CLI emits both a `raw` variant — chart only, e.g. `<NAME>.raw.svg/png` — and the full with-sidebar variant `<NAME>.svg/png`.)

### SVG Coordinate System

Since this is SVG, coordinate origin matters for correctness across **all** inputs:

- **x=0** = left edge, increases rightward
- **y=0** = top edge, increases downward
- Horizontal bars fill left → right: `{{bar (BAR_WIDTH * factor.p) height ...}}`
- Vertical total bar fills bottom → up via the transform trick: `translate(0, barHeight - barHeight * p)`
- All positions must remain stable for edge-case inputs: 0% score, 100% score, missing data

### Inside/Outside Bar Text

When rendering percentage text on a bar, check if the bar is wide enough to contain the text. The threshold is specified by the designer per profile (in Figma comments):

```hbs
{{#if (boolean factor.percentage '<=' THRESHOLD)}}
  <text x="{{math (math BAR_WIDTH '*' factor.p) '+' 6}}" ...>{{factor.percentage}} ٪</text>
{{else}}
  <text x="{{math (math BAR_WIDTH '*' factor.p) '-' 4}}" ...>{{factor.percentage}} ٪</text>
{{/if}}
```

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

The chart drawing must fit within the **Main** layer in Figma.

- Read the **Main** layer dimensions from Figma
- `profile.padding` = 20 units per side
- The `x` and `y` values (drawing area) = Main dimensions minus one padding unit each:
  - e.g. Main = 104×255 → `{ x: 84, y: 235 }`

The `dimensions` property in the JS controller adds padding back on both sides of the **Chart** layer dimensions:

```js
get dimensions() {
  return {
    width: 736 + 2 * this.padding.x,   // Chart layer width from Figma
    height: 254 + 2 * this.padding.y,  // Chart layer height from Figma
  };
},
```

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

### RTL alignment

- The root SVG sets `direction="rtl"` in `views/profiles/layout.hbs`, which affects horizontal text flow and the advance direction of rotated labels.
- Under RTL, `text-anchor="start"` puts the right edge at `x` and grows text leftward; `text-anchor="end"` puts the left edge at `x` and grows text rightward. Right-align Persian labels with `start`. Use `start` for an inside-bar percentage label and `end` for an outside label that must grow away from the bar. Add `direction="ltr"` when a run of Latin characters or numbers is otherwise reordered.
- A `<text transform="rotate(-90,0,0) translate(tx,ty)">` advances downward on screen under the inherited RTL direction. Its baseline x is `<group-x> + ty`, and its top edge is `<group-y> − tx`. Measure the intended top and baseline from the SVG rather than assuming the text advances upward.

### Source fidelity and rendering rules

- **`?? 0` on every mark.** See _Data / Labels Convention_ — `_extractData` turns a `0` mark into `undefined`; always guard with `?? 0`.
- **Figma SVG = outlined paths, not text.** Do not transcribe glyph paths. Reconstruct text with real `<text>` elements at the SVG's coordinates, and take the actual content and readable style information from the HTML export.
- **The SVG is the source of truth; the HTML export is only a helper.** Trust the SVG for element presence, coordinates, and styling. Use the HTML to recover text content and clarify structure. If the HTML shows an element that the SVG lacks, treat it as a disabled design layer and omit it unless the user explicitly says otherwise.
- **Persian digits come from the font.** Emit Western digits in templates (`{{item.mark}}`, `از 192`, `50 ٪`); the `DanaFaNum` font shapes them to Persian. Never hand-convert.
- **Draw order = z-order.** Later elements paint on top. Preserve the Figma SVG's element order.
- **Custom / zoomed axis.** Gridlines are not always 0–100%. If their positions look irregular, derive the linear map `x = a·value + b` from at least two known `(value, x)` pairs and draw the bars on that same scale.
- **Close with a PNG visual match — your eye finds where, the SVG gives what.** Compare the rendered raw PNG with the designer's Chart-layer PNG using identical data. Use the images to locate structural, color, placement, and RTL discrepancies; then use exact SVG measurements to correct them. Iterate render → view → measure → fix until aligned.

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
- Build validation cases from the component's actual independent conditions and supported item cardinalities. Do not prescribe one fixed state matrix for every profile.

### SVG effects, clipping, borders, and shadows

- Treat `<defs>` as measurable design geometry, not approximate decoration. Reproduce and verify `filterUnits`; filter bounds (`x`, `y`, `width`, `height`); `dx` and `dy`; blur radius; flood color and opacity; primitive order and `in`/`result` wiring; clip/mask geometry; transform coordinate space; and final paint order.
- Verify both the direction and extent of every shadow against the reference PNG.
- When a rounded component contains fills or effects, use clipping where required and draw its final border after the clipped content. Confirm that radius, border thickness, corners, and shadow are visually independent.
- Use unique IDs for gradients, clips, masks, and filters when a partial can appear more than once in one document.

### Boundary-driven rendering tests

- Extract every rendering boundary from the design notes, scoring source, and controller logic.
- For each numeric boundary, render values immediately below, at, and immediately above it, using the nearest valid values for that domain.
- Also cover the domain minimum, maximum, zero when valid, missing input, and out-of-range input if clamping is expected.
- Test the visual behavior, not only the computed value: bar width, clipping, label placement, anchor, contrast, and overflow.
- Test fixtures must be derived from the current profile's rules; fixed example values must not become global conventions.

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
| Package manager | Yarn |
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

```bash
npm version <patch|minor|major>
npm publish
# prepublishOnly: npm test
# postpublish: npm run bot
```
