# CLAUDE.md

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
│   ├── samples/                 # JS controller files — one per profile (e.g. BSCT93.js)
│   ├── handlebars/
│   │   ├── init.js              # Handlebars initialization
│   │   ├── helpers.js           # Entry point for all helpers
│   │   ├── helpers/             # 45+ geometry helper modules
│   │   ├── importPartials.js    # Partials loader
│   │   └── polygon.js           # Polygon drawing logic
│   ├── helpers/                 # Math helpers (angleABS, polarXY, gauge, polygonXY)
│   ├── qrcode/                  # QR code generation & rendering
│   └── publish/
│       ├── json/profiles/       # Template JSON per sample (e.g. BSCT93.json)
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
- **Figma handoff file** — contains additional implementation notes and specs. May state that this profile is similar to an existing one (e.g. "similar to BSCT93 with these changes"). In that case: find the referenced profile's JS + HBS files, use them as the base, and apply only the described differences.

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

**Where the `score` values come from.** The JSON `score` object fed to a profile is produced by a separate **scoring engine** whose language **varies per test — it may be PHP, Python, or Node.js** — and which usually lives in a sibling repo (e.g. for NEO: `../risloo-docker/services/risloo/app/ScoreNEO93.php` plus a shared `ScoreNEO` trait). **Always ask the user for the actual scoring-source file** rather than assuming the language/path. When a score key's meaning is ambiguous — especially validity flags (is `1` valid or invalid?) — read that source to confirm the encoding instead of guessing; the scoring source also defines the level thresholds (norms) and per-item (reverse) scoring. Each `score` key is matched to a label via `label.eng`.

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

- **Alignment is the whole job — measure, never estimate.** These are pixel-precise **infographics** built from SVG, so every element must line up with the design **both horizontally and vertically**. Pull exact coordinates from the SVG (element `x`/`y`; for text-as-paths, the glyph bounding box / the `M…` start) instead of eyeballing. **Horizontal:** decide per label whether it is left-, center-, or right-aligned and set `text-anchor` to match (RTL flips `start`/`end`) — e.g. the right-most axis label's *right edge* sits on the gridline (right-aligned), not centered over it; domain names are right-aligned to a fixed edge with the dash/letter at fixed x's after them. **Vertical:** center row text on the row mid-line with `y=<center> dy=".3em"`, and keep every column of a row on the same baseline. If the chart lives inside an offset frame (NEO93 page 1 = `translate(32, 128)` inside the 800×674 content), transcribe that `translate` exactly, and remember a `filterUnits="userSpaceOnUse"` region is in that same (post-translate) local space. Re-render and eyeball after **every** change.
- **RTL text-anchor.** The root SVG sets `direction="rtl"` (`views/profiles/layout.hbs`). Under RTL, `text-anchor="start"` puts the **right** edge at `x` (text grows left); `text-anchor="end"` puts the **left** edge at `x` (grows right). So right-align Persian labels with `start`. For an inside-bar `%` label use `start`; for an outside (narrow-bar) label use `end` — mirror `FRHPT93_2.hbs`. If a run of Latin/numbers mis-orders, add `direction="ltr"` on that `<text>`.
- **`?? 0` on every mark.** See _Data / Labels Convention_ — `_extractData` turns a `0` mark into `undefined`; always guard with `?? 0`.
- **Figma SVG = outlined paths, not text.** A Figma SVG export renders every text run as an outlined `<path>`, never `<text>`. Do **not** transcribe glyph paths. Reconstruct text with real `<text>` elements at the SVG's x/y, and take the actual content/colors from the **HTML** export. Transcribe verbatim only: `rect`, `line`, `linearGradient`, `filter`, and icon `<path>`s.
- **The SVG is the source of truth; the HTML export is only a helper.** Trust the **SVG** for everything authoritative: which elements exist, exact coordinates, and styling — e.g. a divider that looks like a plain solid line in the HTML is actually `stroke-dasharray` *dashed* in the SVG. Use the **HTML** only because (a) SVG text is outlined paths so you can't read it there — the HTML tells you the text content and **where each label goes (and where it doesn't)**, and (b) it's easier to read colors/gradients/structure. If the HTML shows an element the SVG lacks, it's a *disabled Figma layer* (the HTML export still draws disabled layers, with color) — **drop it**. (NEO93 level chips were exactly this: present in HTML, absent in SVG → removed; the level *text* stays, the chip box doesn't.)
- **Persian digits come from the font.** Emit Western digits in templates (`{{item.mark}}`, `از 192`, `50 ٪`); the `DanaFaNum` font shapes them to Persian. Never hand-convert.
- **Draw order = z-order.** Later elements paint on top. Transcribe in the same order as the Figma SVG (e.g. a shadowed baseline drawn **after** the bars sits in front of them).
- **Custom / zoomed axis.** Gridlines are not always 0–100%. If their positions look "irregular", check for a zoomed range (e.g. NEO93 = 20–80%). Derive the linear map `x = a·pct + b` from two known `(label, x)` pairs and draw the bars on **that** scale, so a bar's end lands exactly on its labeled gridline.
- **Validity / alert-box pattern.** Lay indicators right-to-left: text at `x = ANCHOR − (start + length/2)`, separator dot at `ANCHOR − (start + length + 26)` guarded by `{{#unless last}}`; hide the whole box unless ≥1 indicator is active. Drive it from JS with per-item `{ start, length, last }` (see `FRHPT93.js` / `NEO93.js`).

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
- Sample names: uppercase acronym + year (e.g. `BSCT93`, `BEQI93`, `16PF93`)
- Dataset score structure: `dataset.score = [{ label: { eng, ... }, mark }]`

---

## Publishing

```bash
npm version <patch|minor|major>
npm publish
# prepublishOnly: npm test
# postpublish: npm run bot
```
