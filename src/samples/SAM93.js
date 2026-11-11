const { Profile } = require("../Profile");

// ---------------------------------------------------------------------------
// No Figma design: agent design from the approved brief
// (docs/profiles/SAM_profile_brief_fa.md), in the bar language of TMPS93 /
// PSOC93. Chart 700 × 212. The total sits on top; the four factors follow in the
// brief's fixed order. Researcher, 2026-11-11: the five-level strip under the
// total gave way to dashed boundary lines across the total bar, the five level
// names moved above the bar (the person's own level darker), and the level name
// beside the bar was dropped. Only the values the controller has to compute with
// live here; the static geometry is in the template.
// ---------------------------------------------------------------------------
const BAR = { x: 229, width: 400, gap: 4, outsideGap: 6 }; // 100 % = 400 px
const TOTAL = { top: 20, height: 20, levelBaseline: 10, cutOverhang: 5 };
const FACTORS = { top: 76, pitch: 40, height: 16 };
const BASELINE = 4.06; // 13 px text, below the bar's mid-line (JSS93 / TMPS93)
// The percentage moves outside the bar below 10 %, where "٪ NN" plus the 4 px
// tip gap would no longer fit (agent rule, as in TMPS93; the brief leaves
// placement open).
const INSIDE_MIN_PCT = 10;

// Brief: the total's five levels, their raw ranges and colours. Region edges sit
// half-way between two neighbouring whole scores (13.5, 25.5, 37.5, 49.5 of 76),
// i.e. 17.8 %, 33.6 %, 49.3 % and 65.1 % of the bar. `ink` is the percentage
// colour inside a fill of that level (agent choice for legibility).
const TOTAL_MAX = 76;
const LEVELS = [
  { key: "very_desirable", title: "بسیار مطلوب", from: 0, to: 13, color: "#C6DBEF", ink: "#334155" },
  { key: "desirable", title: "مطلوب", from: 14, to: 25, color: "#9ECAE1", ink: "#334155" },
  { key: "moderate", title: "متوسط", from: 26, to: 37, color: "#6BAED6", ink: "#334155" },
  { key: "undesirable", title: "نامطلوب", from: 38, to: 49, color: "#3182BD", ink: "#FFFFFF" },
  { key: "very_undesirable", title: "بسیار نامطلوب", from: 50, to: 76, color: "#08519C", ink: "#FFFFFF" },
];
const FACTOR_COLOR = "#5E6E82"; // brief: one colour for all four factors
// Researcher, 2026-11-11: every fill is a light → full gradient along its own
// length (as STAXI293 / MCHATR93), ending in the brief's colour at the tip. The
// total starts from the lightest level colour (lighter still for that level);
// the factors from a pale tint of their one colour.
const TOTAL_START = { default: "#C6DBEF", very_desirable: "#EAF2FA" };
const FACTOR_START = "#B9C3CF";
const TRACK = "#EEF1F4"; // brief: empty part of every bar

class SAM93 extends Profile {
  static pages = 1;

  // SAM93 — پرسشنامه دوسوگرایی نسبت به خود. Nineteen 0–4 answers; the total and
  // four factors, each as `<factor>_raw` / `<factor>_percent` (scoring/SAM93.py,
  // flattened by Risloo). `percent` is raw / max as a 3-decimal fraction. The
  // level is the scoring's own `interpretation_level`; nothing is recomputed here.
  labels = {
    L1_1: { eng: "total_raw", title: "نمرهٔ کل", max: 76 },
    L1_2: { eng: "total_percent" },

    L2_1: { eng: "conflicting_thoughts_of_self_raw", title: "افکار متعارض درباره خود", max: 28 },
    L2_2: { eng: "conflicting_thoughts_of_self_percent" },

    L3_1: { eng: "dichotomous_view_of_self_raw", title: "دیدگاه دو قطبی نسبت به خود", max: 16 },
    L3_2: { eng: "dichotomous_view_of_self_percent" },

    L4_1: { eng: "fear_of_others_judgment_raw", title: "نگرانی راجع به قضاوت دیگران", max: 16 },
    L4_2: { eng: "fear_of_others_judgment_percent" },

    L5_1: { eng: "preoccupation_with_self_worth_raw", title: "اشتغال ذهنی در مورد ارزش خود", max: 16 },
    L5_2: { eng: "preoccupation_with_self_worth_percent" },

    // very_desirable | desirable | moderate | undesirable | very_undesirable
    L6: { eng: "interpretation_level" },
    // `percentage_interpretation` is not read: the brief keeps it off the page.
  };

  profileSpec = {
    sample: {
      name: "پرسشنامه دوسوگرایی نسبت به خود",
      multiProfile: false,
      questions: false,
      defaultFields: true,
      fields: [],
    },
    profile: {
      get dimensions() {
        return {
          width: 700 + 2 * this.padding.x, // Chart 700 wide → 903
          height: 212 + 2 * this.padding.y, // Chart 212 tall → 714
        };
      },
      // Chart centred on the 943 × 754 design page, minus the 20 px the layout
      // already owns on every side, so the page resolves to 903 × 714.
      padding: {
        x: 101.5, // (943 − 700) / 2 − 20
        y: 251, // (754 − 212) / 2 − 20
      },
    },
    labels: Object.values(this.labels),
  };

  constructor(dataset, options, config = {}) {
    super();
    this._init(dataset, options, config);
  }

  _calcContext() {
    const s = this.dataset.score; // [raw, percent] × (total + 4 factors), then level

    const level = LEVELS.find((l) => l.key === s[10].mark);

    // Fixed order from `labels`; never sorted by score.
    const rows = [0, 1, 2, 3, 4].map((i) => {
      const { title, max } = s[2 * i].label;
      const mark = Number(s[2 * i].mark ?? 0);
      const p = Math.min(Math.max(Number(s[2 * i + 1].mark ?? 0), 0), 1);
      // Brief: stored fraction × 100, rounded to a whole number with halves up.
      // Integer arithmetic on thousandths, so 0.815 shows 82 (as in CAARS93).
      const pct = Math.floor((Math.round(p * 1000) + 5) / 10);
      const total = i === 0;
      const height = total ? TOTAL.height : FACTORS.height;
      const top = total ? TOTAL.top : FACTORS.top + (i - 1) * FACTORS.pitch;
      const width = BAR.width * p;
      const inside = pct >= INSIDE_MIN_PCT;
      const fill = total ? (level ? level.color : FACTOR_COLOR) : FACTOR_COLOR;
      const ink = total ? (level ? level.ink : "#FFFFFF") : "#FFFFFF";
      const outsideInk = total ? "#334155" : FACTOR_COLOR;

      return {
        title,
        mark,
        max,
        pct,
        width,
        top,
        height,
        fill,
        inside,
        ink: inside ? ink : outsideInk,
        labelX: inside ? BAR.x + width - BAR.gap : BAR.x + width + BAR.outsideGap,
        baseline: top + height / 2 + BASELINE,
      };
    });

    // Five regions of the total bar, edges half-way between two neighbouring
    // whole scores. Each level name is centred over its region; the person's
    // own level is written darker. The four inner edges are the dashed lines.
    const edge = (score) => (BAR.width * score) / TOTAL_MAX;
    const regions = LEVELS.map((l) => {
      const x0 = l.from === 0 ? 0 : edge(l.from - 0.5);
      const x1 = l.to === TOTAL_MAX ? BAR.width : edge(l.to + 0.5);
      const own = level !== undefined && l.key === level.key;
      return {
        title: l.title,
        center: BAR.x + (x0 + x1) / 2,
        fill: own ? "#1E293B" : "#94A3B8",
        weight: own ? 600 : 400,
      };
    });

    // A boundary line that would cross or touch the total's percent stops at
    // the bar's edges (as MCHATR93). «٪ NN» at 13 px: about 12.5 px for «٪ »
    // plus 7.5 px a digit, with 8 px to spare.
    const total = rows[0];
    const textWidth = 12.5 + 7.5 * String(total.pct).length;
    const span = total.inside
      ? [total.labelX - textWidth - 8, total.labelX + 8]
      : [total.labelX - 8, total.labelX + textWidth + 8];
    const barTop = TOTAL.top;
    const barBottom = TOTAL.top + TOTAL.height;
    // Inside the bar a line over a dark part of the gradient fill is drawn white
    // so it stays visible; over a light part, and above and below the bar, it
    // stays slate. The fill colour under the line is read off the gradient.
    const startColor = level && level.key === "very_desirable" ? TOTAL_START.very_desirable : TOTAL_START.default;
    const rgb = (hex) => [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16));
    const underLine = (x) => {
      const t = total.width > 0 ? Math.min(Math.max((x - BAR.x) / total.width, 0), 1) : 0;
      const [a, b] = [rgb(startColor), rgb(total.fill)];
      const [r, g, bl] = a.map((v, i) => v + (b[i] - v) * t);
      return (0.299 * r + 0.587 * g + 0.114 * bl) / 255; // perceived lightness 0..1
    };
    const cuts = LEVELS.slice(1).map((l) => {
      const x = BAR.x + edge(l.from - 0.5);
      return {
        x,
        y1: barTop - TOTAL.cutOverhang,
        y2: barBottom + TOTAL.cutOverhang,
        barTop,
        barBottom,
        through: x < span[0] || x > span[1],
        inner: x <= BAR.x + total.width && underLine(x) < 0.55 ? "#FFFFFF" : "#475569",
      };
    });

    return [
      {
        total,
        factors: rows.slice(1),
        regions,
        cuts,
        levelBaseline: TOTAL.levelBaseline,
        track: TRACK,
        gradient: {
          total: {
            start: startColor,
            end: total.fill,
          },
          factor: { start: FACTOR_START, end: FACTOR_COLOR },
        },
      },
    ];
  }
}

module.exports = SAM93;
