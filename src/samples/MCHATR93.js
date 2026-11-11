const { Profile } = require("../Profile");

// ---------------------------------------------------------------------------
// MCHATR93 — چک‌لیست بازنگری‌شده غربال اوتیسم نوپایان (M-CHAT-R).
// Built from the approved profile brief (2026-11-07). No Figma design exists:
// this is an agent layout for the designer to review. Restyled at the
// researcher's request on 2026-11-11 so it shares the theme of the other
// Risloo bar profiles: it is one row in STAXI293's bar language.
//
// One column, Chart 714 × 150, top to bottom:
//   1. The axis labels 0 / ٪ 25 / ٪ 50 / ٪ 75 / ٪ 100 above the bar, with
//      dashed gridlines through the bar row (STAXI293 / OHQ93).
//   2. «نمرهٔ کل» left of the bar, the bar on a 0..100 % axis (0 left) filled
//      from 0 by total ÷ 20 × 100 with a light → dark gradient in the level's
//      colour, its percent inside the bar in white (outside, dark, when the bar
//      is too short), and «خام / 20» right of the bar. Two boundary lines cross
//      the bar at 12.5 % and 37.5 % (between scores 2|3 and 7|8).
//   3. The level label, exactly one of the brief's three, centred under the
//      bar in the level's dark colour.
//   4. Only when the level is low and the formula set `rescreen`: the alert
//      «پس از ۲۴ ماهگی دوباره غربال شود» under the label. Without it the column
//      is re-centred; no empty space is kept for it.
// Level colours: slate for the lowest level, the sky family of STAXI293 for
// the two higher ones, darker with the level. No warning colour, no red/green
// pair, no purple or indigo. No explanatory text, norm, percentile rank,
// comparison or other label.
// Unless status is exactly "valid" with a total and a known level, the page
// shows only «نمره تولید نشد» — no number, percent, label, bar or alert.
// ---------------------------------------------------------------------------
const MAX = 20;
const TITLE_RIGHT = 70; // «نمرهٔ کل» (about 60 px at 15 px) ends here
const BAR = { x: TITLE_RIGHT + 10, width: 560, top: 36, height: 20 }; // 80 → 640; 1 point = 5 % = 28 px
const RAW = { left: BAR.x + BAR.width + 10, width: 64 }; // 650 → 714
const CHART = { width: RAW.left + RAW.width, height: 150 };
const GRID = { top: 22, bottom: 70 }; // gridlines and the zero line, 14 px past the bar
const TICKS = [0, 25, 50, 75, 100];
const CUTS = [12.5, 37.5]; // percent; between two neighbouring scores: 2|3 and 7|8
const CUT_OVERHANG = 6; // boundary lines reach this far above and below the bar
const LABEL = { baseline: 104 }; // level label
const ALERT = { top: 124, height: 20, icon: 7 }; // icon radius
const NO_ALERT_SHIFT = 18; // re-centre the column when there is no alert
// A bar's percent stays inside it (white, 6 px before the end) when the bar is
// at least this wide, otherwise 6 px after the end in the dark colour.
const INSIDE_MIN = 44;

// The three levels exactly as the brief names and bounds them; keyed by the
// formula's `risk` code (scoring/MCHATR93.py: 0..2 low, 3..7 moderate, 8..20 high).
const LEVELS = {
  low: { title: "خطر کم", light: "#E2E8F0", dark: "#64748B" },
  moderate: { title: "خطر متوسط: نیاز به مصاحبهٔ پیگیری", light: "#BAE6FD", dark: "#0284C7" },
  high: { title: "خطر زیاد: نیاز به ارزیابی تشخیصی", light: "#7DD3FC", dark: "#075985" },
};
const TRACK = "#E2E8F0"; // STAXI293's track, at half opacity in the template

class MCHATR93 extends Profile {
  static pages = 1;

  // Keys from scoring/MCHATR93.py: `status` (valid | incomplete | invalid),
  // `total` (int 0..20 or None), `risk` (low | moderate | high or None) and
  // `rescreen` (1 / 0 or None; 1 only for low risk under 24 months). The
  // percent is not stored: total × 5 is exact, so the profile derives it.
  labels = {
    L1: { eng: "total", title: "نمرهٔ کل", max: MAX },
    L2: { eng: "risk" },
    L3: { eng: "rescreen" },
    L4: { eng: "status" },
  };

  profileSpec = {
    sample: {
      name: "چک‌لیست بازنگری‌شده غربال اوتیسم نوپایان",
      multiProfile: false,
      questions: false,
      defaultFields: true,
      // The child's prerequisites in the sidebar, as CPRS93 (same three keys in
      // the Risloo form); the child's age is what the rescreen alert depends on.
      fields: ["relationship", "child_gender", "child_age"],
    },
    profile: {
      get dimensions() {
        return {
          width: CHART.width + 2 * this.padding.x, // 714 → 903
          height: CHART.height + 2 * this.padding.y, // 150 → 714
        };
      },
      // Chart centred on the 943 × 754 design page, minus the 20 px the layout
      // already owns on every side, so the page resolves to 903 × 714.
      padding: {
        x: (943 - CHART.width) / 2 - 20, // 94.5
        y: (754 - CHART.height) / 2 - 20, // 282
      },
    },
    labels: Object.values(this.labels),
  };

  constructor(dataset, options, config = {}) {
    super();
    // `_extractData` turns a stored 0 or false into undefined (`score[key] || …`).
    // A total of 0 is a real score (low risk, empty bar); keep the scoring
    // output itself so only an absent or null field counts as "not produced".
    this.storedScore = (dataset && dataset.score) || {};
    this._init(dataset, options, config);
  }

  _calcContext() {
    const s = this.storedScore;

    // All-or-nothing: the status is read first, so a missing total of an
    // incomplete or invalid sheet can never be drawn as a 0.
    const total = s.total === null || s.total === undefined || s.total === "" ? NaN : Number(s.total);
    const level = LEVELS[s.risk];
    const valid = s.status === "valid" && Number.isInteger(total) && total >= 0 && total <= MAX && level !== undefined;
    if (!valid) return [{ valid: false, box: { x: 903 / 2 - 250, y: 714 / 2 - 99.5 } }];

    // The alert belongs to low risk only; `rescreen` on any other level is
    // ignored rather than shown.
    const rescreen = s.risk === "low" && (s.rescreen === true || s.rescreen === 1 || s.rescreen === "1");
    // Percent of the maximum, total ÷ 20 × 100: always a whole number.
    const pct = (total * 100) / MAX;
    const at = (percent) => BAR.x + (BAR.width * percent) / 100;
    const width = at(pct) - BAR.x;
    const inside = width >= INSIDE_MIN;
    const centre = BAR.x + BAR.width / 2;
    // Horizontal extent of «٪ NN» (13 px: about 12.5 px for «٪ » plus 7.5 px a
    // digit) with 8 px to spare. A boundary line that would cross or touch it
    // stops at the bar's edges instead of running through the percent.
    const textWidth = 12.5 + 7.5 * String(pct).length;
    const percentX = inside ? BAR.x + width - 6 : BAR.x + width + 6;
    const textSpan = inside ? [percentX - textWidth - 8, percentX + 8] : [percentX - 8, percentX + textWidth + 8];

    return [
      {
        valid: true,
        shift: rescreen ? 0 : NO_ALERT_SHIFT,
        level,
        track: TRACK,
        title: this.labels.L1.title,
        titleRight: TITLE_RIGHT,
        titleBaseline: BAR.top + 15,
        bar: BAR,
        width,
        radius: Math.min(3, width),
        total,
        max: MAX,
        pct,
        percentX,
        percentAnchor: inside ? "end" : "start",
        percentFill: inside ? "white" : level.dark,
        percentBaseline: BAR.top + 14.5,
        rawX: RAW.left,
        rawBaseline: BAR.top + 16,
        grid: { top: GRID.top, bottom: GRID.bottom, height: GRID.bottom - GRID.top },
        baselineX: BAR.x - 0.5,
        ticks: TICKS.map((value) => ({
          value,
          x: at(value),
          labelX: value === 100 ? at(100) + 1 : at(value),
          anchor: value === 100 ? "end" : "middle",
          dashed: value > 0,
        })),
        cuts: CUTS.map((c) => {
          const x = at(c);
          return {
            x,
            y1: BAR.top - CUT_OVERHANG,
            y2: BAR.top + BAR.height + CUT_OVERHANG,
            barTop: BAR.top,
            barBottom: BAR.top + BAR.height,
            through: x < textSpan[0] || x > textSpan[1],
          };
        }),
        label: { x: centre, baseline: LABEL.baseline, title: level.title },
        rescreen,
        alert: {
          // Icon and text centred as one line under the label.
          iconX: centre + 112,
          iconY: ALERT.top + ALERT.height / 2,
          iconR: ALERT.icon,
          textX: centre + 100,
          baseline: ALERT.top + ALERT.height / 2 + 4.5,
        },
      },
    ];
  }
}

module.exports = MCHATR93;
