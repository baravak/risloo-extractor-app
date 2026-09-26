const { Profile } = require("../Profile");

// ---------------------------------------------------------------------------
// CAARS93 — مقیاس درجه‌بندی ADHD بزرگسالان کانرز، نسخهٔ غربالگری خودگزارشی.
// No Figma source: the chart is designed from the approved individual-result
// specification of the science package (CAARS-FA30-C1), whose rules this
// layout enforces rather than decorates:
//   - three raw scores, each on its own separate line with its own range
//     (0–27, 0–27, 0–36) and the score's position on it; never one shared
//     axis, never a combined or comparative chart;
//   - classification is off: one neutral hue, no coloured zone, no threshold,
//     no label, no warning, no T, percentile or norm;
//   - the only interpretation is the two approved sentences, verbatim;
//   - the reference cut-off is text only, with all its caveats, because the
//     profile is read by the authorised specialist and never handed to the
//     respondent; no score is ever compared with it;
//   - all-or-nothing: unless scoring/CAARS93.py returns status "valid", only
//     the no-result message is drawn — never a partial or zero score.
// Chart 863 × 674, centred on the 943 × 754 design page.
// ---------------------------------------------------------------------------
const CHART = { width: 863, height: 674 };

// Each scale owns its axis: 0 at x=LINE.left, its own maximum at x=LINE.right.
const LINE = { left: 20, right: 560, top: 92, pitch: 64 };

class CAARS93 extends Profile {
  static pages = 1;

  labels = {
    L1: { eng: "inattention", title: "کمبود توجه", max: 27 },
    L2: { eng: "hyperactivity", title: "پرتحرکی–کنترل تکانه", max: 27 },
    L3: { eng: "adhd_index", title: "شاخص ADHD", max: 36 },
    L4: { eng: "status" }, // valid | incomplete | invalid
  };

  profileSpec = {
    sample: {
      name: "مقیاس درجه‌بندی اختلال کمبود توجه/بیش‌فعالی بزرگسالان کانرز — نسخهٔ غربالگری خودگزارشی",
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
    // let `?? 0` zeros read as the lowest valid score.
    if (s[3].mark !== "valid") return [{ valid: false }];

    const scales = s.slice(0, 3).map((data, i) => {
      const mark = data.mark ?? 0;
      const max = data.label.max;
      const y = LINE.top + i * LINE.pitch;
      return {
        title: data.label.title,
        mark,
        max,
        left: LINE.left,
        right: LINE.right,
        valueX: LINE.right + 16,
        y,
        x: LINE.left + ((LINE.right - LINE.left) * mark) / max,
      };
    });

    return [{ valid: true, scales }];
  }
}

module.exports = CAARS93;
