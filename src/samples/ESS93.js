const { Profile } = require("../Profile");

// ---------------------------------------------------------------------------
// ESS93 — مقیاس خواب‌آلودگی اپوورث (نسخهٔ ایرانی بزرگسالان، ESS-FA-IR2013-D1).
// No Figma source: the chart is designed from the approved individual-result
// specification of the science package, whose rules this layout enforces
// rather than decorates:
//   - one score only, the 0–24 total, always shown with that range, drawn on
//     the instrument's own line; no component, no norm, no comparison;
//   - no classification of any kind: one neutral hue that never changes with
//     the score, no zone, no cut-off (as text, line, tick or mark), no label,
//     no warning, no recommendation;
//   - uniform integer ticks only, so no single value on the line is singled out;
//   - text for the authorised specialist only, third person: the direction of
//     the score, the permitted reading (subjective sleepiness), the
//     decision-support principle, what the score is not, and the population
//     and administration limits;
//   - all-or-nothing: unless scoring/ESS93.py returns status "valid", only the
//     no-score message is drawn — never a partial or zero score.
// Chart 863 × 674, centred on the 943 × 754 design page.
// ---------------------------------------------------------------------------
const CHART = { width: 863, height: 674 };

// The total's own line: 0 at x=LINE.left, max at x=LINE.right.
const LINE = { left: 20, right: 640, y: 112 };

class ESS93 extends Profile {
  static pages = 1;

  labels = {
    L1: { eng: "total", title: "نمرهٔ کل", max: 24 },
    L2: { eng: "status" }, // valid | incomplete | invalid
  };

  profileSpec = {
    sample: {
      name: "مقیاس خواب‌آلودگی اپوورث",
      multiProfile: false,
      questions: false,
      defaultFields: true,
      fields: [],
    },
    profile: {
      get dimensions() {
        return {
          width: CHART.width + 2 * this.padding.x, // 863 → 903
          height: CHART.height + 2 * this.padding.y, // 674 → 714
        };
      },
      // Chart inset inside the 943 × 754 design page minus the 20 px the layout
      // owns on every side, so the with-sidebar page renders at scale 1.
      padding: {
        x: (943 - CHART.width) / 2 - 20, // 20
        y: (754 - CHART.height) / 2 - 20, // 20
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
    // must not let `?? 0` read as the lowest valid score.
    if (s[1].mark !== "valid") return [{ valid: false }];

    const mark = s[0].mark ?? 0;
    const max = s[0].label.max;
    const step = (LINE.right - LINE.left) / max;

    return [
      {
        valid: true,
        total: {
          mark,
          max,
          left: LINE.left,
          right: LINE.right,
          y: LINE.y,
          x: LINE.left + step * Math.min(Math.max(mark, 0), max),
          // One identical tick per integer value; none is emphasised.
          ticks: Array.from({ length: max + 1 }, (_, i) => LINE.left + step * i),
        },
      },
    ];
  }
}

module.exports = ESS93;
