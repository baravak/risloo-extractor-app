const { Profile } = require("../Profile");

// ---------------------------------------------------------------------------
// RSSS93 — مقیاس کشمکش‌های مذهبی و معنوی (فرم فارسی ۲۶ گویه‌ای، RSSS-FA26-J1).
// Designer revision 2026-10-11 (docs/design VIS-25…30): use the newer BAT bar
// language, omit optional explanations and redundant headings, centre the chart,
// label the aggregate «نمره کل», and trim insignificant decimal zeroes.
// The six domain means and total keep their input keys, order, valid range 1–5
// and all-or-nothing validity. A zero-origin display axis makes bar length
// proportional to the mean; zero is an axis origin, not a newly valid score.
// Display values below 1 at their exact 0–5 axis position with an outside label;
// this presentation rule also makes synthetic boundary previews truthful.
// Indigo domains and the JSS neutral total palette are decorative, never a
// clinical class or score threshold; the JSS zero baseline casts rightward.
// No raw sum, percentage, percentile, norm or new scoring calculation is added.
// ---------------------------------------------------------------------------
const CHART = { width: 650, height: 334 };
// BAT: 500×16px bars, 40px row pitch, 2px terminal corners, 8px title gap.
const BAR = { x: 134, width: 500, height: 16, top: 42, pitch: 40, totalGap: 64 };
// Bounds measured from the rendered 13px Dana titles and 12px axis labels.
// Centre the visible chart, including the longest title, rather than the tracks alone.
const CONTENT = { left: 62.703125, right: 638.015625, top: -1.78, bottom: 334 };
const OFFSET_X = (CHART.width - (CONTENT.right - CONTENT.left)) / 2 - CONTENT.left;
const OFFSET_Y = (CHART.height - (CONTENT.bottom - CONTENT.top)) / 2 - CONTENT.top;
const MAX = 5;
const INSIDE_LABEL_MIN = 1;

// Preserve the existing two-decimal precision; only remove display padding.
// «٬» (U+066C) keeps the existing Dana decimal-separator convention.
const decimal = (n) => n.toFixed(2).replace(/\.?0+$/, "").replace(".", "٬");

class RSSS93 extends Profile {
  static pages = 1;

  labels = {
    L1: { eng: "divine", title: "الهی" },
    L2: { eng: "demonic", title: "اهریمنی" },
    L3: { eng: "interpersonal", title: "بین‌فردی" },
    L4: { eng: "moral", title: "اخلاقی" },
    L5: { eng: "ultimate_meaning", title: "معنای غایی" },
    L6: { eng: "doubt", title: "شک و تردید" },
    L7: { eng: "total", title: "نمره کل" },
    L8: { eng: "status" }, // valid | incomplete | invalid
  };

  profileSpec = {
    sample: {
      name: "مقیاس کشمکش‌های مذهبی و معنوی",
      multiProfile: false,
      questions: false,
      defaultFields: true,
      fields: [],
    },
    profile: {
      get dimensions() {
        return {
          width: CHART.width + 2 * this.padding.x, // 650 → 903
          height: CHART.height + 2 * this.padding.y, // 334 → 714
        };
      },
      // Chart inset inside the 943 × 754 design page minus the 20 px the layout
      // owns on every side, so the with-sidebar page renders at scale 1.
      padding: {
        x: (943 - CHART.width) / 2 - 20,
        y: (754 - CHART.height) / 2 - 20,
      },
    },
    labels: Object.values(this.labels),
  };

  constructor(dataset, options, config = {}) {
    super();
    this._init(dataset, options, config);
  }

  _calcContext() {
    const s = this.dataset.score;

    // Anything but an explicit "valid" is no score: a missing or unknown status
    // must not let `?? 0` read as a score.
    if (s[7].mark !== "valid") return [{ valid: false }];

    // Fixed order from `labels`; never sorted by score.
    const items = s.slice(0, 7).map((data, i) => {
      const mark = Number(data.mark ?? 0);
      const clamped = Math.min(Math.max(mark, 0), MAX);
      const width = BAR.width * clamped / MAX;
      const labelOutside = mark < INSIDE_LABEL_MIN;
      const top = BAR.top + i * BAR.pitch + (i === 6 ? BAR.totalGap - BAR.pitch : 0);
      return {
        title: data.label.title,
        isTotal: data.label.eng === "total",
        mark: decimal(mark),
        width,
        radius: Math.min(2, width),
        labelOutside,
        top,
        titleBaseline: top + 11.505,
        scoreBaseline: top + 12.55,
        scoreX: BAR.x + width + (labelOutside ? 6 : -4),
      };
    });

    return [
      {
        valid: true,
        items,
        offsetX: OFFSET_X,
        offsetY: OFFSET_Y,
        ticks: Array.from({ length: MAX + 1 }, (_, value) => ({
          value,
          x: BAR.x + BAR.width * value / MAX,
        })),
      },
    ];
  }
}

module.exports = RSSS93;
