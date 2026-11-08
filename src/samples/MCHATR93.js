const { Profile } = require("../Profile");

// ---------------------------------------------------------------------------
// MCHATR93 — چک‌لیست بازنگری‌شده غربال اوتیسم نوپایان (M-CHAT-R).
// Built from the profile brief revised at the researcher's request on
// 2026-11-07 (science catalog copy, «در انتظار تأیید»; the researcher asked
// for the build to proceed). No Figma design exists: this is an agent layout
// for the designer to review, in the single-total percent-bar language of
// SEST93 (bar, track, «٪ NN») with STAXI293's axis-end labels (0 / ٪ 100).
//
// One column, Chart 500 × 180, top to bottom:
//   1. «نمرهٔ کل», the raw total (0..20) and beside it its percent of the
//      maximum, total ÷ 20 × 100 — always a whole number, so no rounding.
//   2. One horizontal bar on a 0..100 % axis (0 left), filled from 0 by that
//      percent in the level colour, with two boundary lines at 12.5 % and
//      37.5 % (between scores 2|3 and 7|8) and only 0 / ٪ 100 at its ends.
//   3. The level label, exactly one of the brief's three, on a band in the
//      pale tint of the level colour with a marker in its strong colour.
//   4. Only when the level is low and the formula set `rescreen`: the alert
//      «پس از ۲۴ ماهگی دوباره غربال شود» under the label. Without it the column
//      is re-centred; no empty space is kept for it.
// Level colours come from the palette of other Risloo profiles: BAI93's slate
// for the lowest level, STAXI293's sky family for the two higher ones, light
// → dark with the level. No warning colour, no red/green pair, no purple or
// indigo. No explanatory text, norm, percentile rank, comparison or other label.
// Unless status is exactly "valid" with a total and a known level, the page
// shows only «نمره تولید نشد» — no number, percent, label, bar or alert.
// ---------------------------------------------------------------------------
const CHART = { width: 500, height: 180 };
const MAX = 20;
const BAR = { x: 0, length: 500, top: 40, height: 20 }; // 100 % = 500 px (1 point = 5 % = 25 px)
const CUTS = [12.5, 37.5]; // percent; between two neighbouring scores: 2|3 and 7|8
const CUT_OVERHANG = 6; // boundary lines reach this far above and below the bar
const ROW = { baseline: 24 }; // «نمرهٔ کل», the total and its percent
const AXIS = { baseline: 80 }; // 0 and ٪ 100 under the bar ends
const BAND = { top: 100, height: 48, radius: 8, marker: { right: 12, width: 4, height: 24 }, textGap: 10 };
const ALERT = { top: 160, height: 20, icon: 7 }; // icon radius
const NO_ALERT_SHIFT = (ALERT.top + ALERT.height - (BAND.top + BAND.height)) / 2; // 16: re-centre without the alert

// The three levels exactly as the brief names and bounds them; keyed by the
// formula's `risk` code (scoring/MCHATR93.py: 0..2 low, 3..7 moderate, 8..20 high).
const LEVELS = {
  // low: BAI93's slate (its lowest level); moderate / high: STAXI293's sky
  // family (#7DD3FC accent → #0369A1 dark), with its light #BAE6FD as a tint.
  low: { title: "خطر کم", strong: "#94A3B8", tint: "#F1F5F9" },
  moderate: { title: "خطر متوسط: نیاز به مصاحبهٔ پیگیری", strong: "#38BDF8", tint: "#E0F2FE" },
  high: { title: "خطر زیاد: نیاز به ارزیابی تشخیصی", strong: "#0369A1", tint: "#BAE6FD" },
};
const TRACK = "#F1F5F9";

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
          width: CHART.width + 2 * this.padding.x, // 500 → 903
          height: CHART.height + 2 * this.padding.y, // 180 → 714
        };
      },
      // Chart centred on the 943 × 754 design page, minus the 20 px the layout
      // already owns on every side, so the page resolves to 903 × 714.
      padding: {
        x: (943 - CHART.width) / 2 - 20, // 201.5
        y: (754 - CHART.height) / 2 - 20, // 267
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
    const at = (percent) => BAR.x + (BAR.length * percent) / 100;
    const width = at(pct) - BAR.x;
    const bandMid = BAND.top + BAND.height / 2;

    return [
      {
        valid: true,
        shift: rescreen ? 0 : NO_ALERT_SHIFT,
        right: CHART.width,
        rowBaseline: ROW.baseline,
        title: this.labels.L1.title,
        total,
        pct,
        bar: BAR,
        track: TRACK,
        width,
        radius: Math.min(2, width),
        fill: level.strong,
        cuts: CUTS.map((c) => ({ x: at(c), y1: BAR.top - CUT_OVERHANG, y2: BAR.top + BAR.height + CUT_OVERHANG })),
        axis: { baseline: AXIS.baseline, minX: at(0), maxX: at(100) },
        band: {
          top: BAND.top,
          height: BAND.height,
          radius: BAND.radius,
          tint: level.tint,
          markerX: CHART.width - BAND.marker.right - BAND.marker.width,
          markerY: bandMid - BAND.marker.height / 2,
          markerWidth: BAND.marker.width,
          markerHeight: BAND.marker.height,
          marker: level.strong,
          textX: CHART.width - BAND.marker.right - BAND.marker.width - BAND.textGap,
          baseline: bandMid + 6,
          title: level.title,
        },
        rescreen,
        alert: {
          // Icon centred on the band marker's axis; text on the label's right edge.
          iconX: CHART.width - BAND.marker.right - BAND.marker.width / 2,
          iconY: ALERT.top + ALERT.height / 2,
          iconR: ALERT.icon,
          textX: CHART.width - BAND.marker.right - BAND.marker.width - BAND.textGap,
          baseline: ALERT.top + ALERT.height / 2 + 4.5,
        },
      },
    ];
  }
}

module.exports = MCHATR93;
