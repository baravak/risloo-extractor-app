const { Profile } = require("../Profile");

// ---------------------------------------------------------------------------
// AIS93 — مقیاس بی‌خوابی آتن (AIS-8 فارسی). No Figma source: the chart is
// designed from the approved individual-result specification of the science
// package (AIS-FA8-C2), whose rules this layout enforces rather than decorates:
//   - one score only, the 0–24 total, drawn as its position on one line with
//     that range; no night/day subscore, no component, no comparison;
//   - classification is off: one neutral hue, no coloured zone, no threshold,
//     no label, no warning, no percentile or norm;
//   - the only interpretation is the two approved sentences, verbatim;
//   - the reference cut-off (6) is text only, with its source, sample and year,
//     because the profile is read by the authorised specialist and never handed
//     to the respondent; the score is never compared with it;
//   - all-or-nothing: unless scoring/AIS93.py returns status "valid", only the
//     no-result message is drawn — never a partial or zero score.
// Chart 863 × 674, centred on the 943 × 754 design page.
// ---------------------------------------------------------------------------
const CHART = { width: 863, height: 674 };

// The total's own axis: 0 at x=LINE.left, 24 at x=LINE.right.
const LINE = { left: 20, right: 640, y: 112 };

class AIS93 extends Profile {
  static pages = 1;

  labels = {
    L1: { eng: "total", title: "نمرهٔ کل", max: 24 },
    L2: { eng: "status" }, // valid | incomplete | invalid
  };

  profileSpec = {
    sample: {
      name: "مقیاس بی‌خوابی آتن",
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

    // Anything but an explicit "valid" is no result: a missing status must not
    // let `?? 0` read as the lowest valid score.
    if (s[1].mark !== "valid") return [{ valid: false }];

    const mark = s[0].mark ?? 0;
    const max = s[0].label.max;

    return [
      {
        valid: true,
        total: {
          mark,
          max,
          left: LINE.left,
          right: LINE.right,
          y: LINE.y,
          x: LINE.left + ((LINE.right - LINE.left) * mark) / max,
        },
      },
    ];
  }
}

module.exports = AIS93;
