const { Profile } = require("../Profile");

// ---------------------------------------------------------------------------
// PRPS93 — مقیاس حل مساله دینی (فرم فارسی ۳۶ گویه‌ای، PRPS-FA36-C1).
// No Figma source: the chart is designed from the approved individual-result
// specification of the science package, whose rules this layout enforces
// rather than decorates:
//   - three raw scores — همکاری, خودجهت‌دهی, تأخیری — always all three and
//     always in that fixed order, each on its own separate 12–60 line with
//     the score's position on it; never one shared axis, never a combined,
//     sorted or comparative chart;
//   - classification is off: one neutral hue for all three, no zone, no
//     threshold, no label, no warning, no "dominant style", nothing that
//     singles out or ranks the highest score; no total, percentile, standard
//     score, item mean or percent of maximum;
//   - no explanatory prose: researcher instruction, 2026-10-12, reflected in
//     the result specification; scientific limits remain in the documentation;
//   - all-or-nothing: unless scoring/PRPS93.py returns status "valid", only
//     the approved no-score sentence is drawn — never a partial or zero score.
// Visual redesign: docs/design/README.md VIS-02, 05–10, 12, 25–26.
// The scientific contract requires separate position lines, not filled bars.
// VIS-25: explanation text requires an explicit designer/researcher request.
// One upright 800 × 224 content envelope, centred on the 943 × 754 page.
// No chart-owned offset/rotation/scale; only the declared profile inset.
// Each ruler owns its endpoints; there is no shared grid or connecting path.
// Slate palette from tables-mixed-xy.md XY-02; no score-dependent colors.
// ---------------------------------------------------------------------------
const CHART = { width: 800, height: 224 };

// Each style owns its line: 12 at x=LINE.left, 60 at x=LINE.right.
// Keep equal visual margins after removing the former full-width divider.
const LINE = { left: 12.5, right: 642.5, top: 36, pitch: 80 };

class PRPS93 extends Profile {
  static pages = 1;

  labels = {
    L1: { eng: "collaborative", title: "همکاری", min: 12, max: 60 },
    L2: { eng: "self_directing", title: "خودجهت‌دهی", min: 12, max: 60 },
    L3: { eng: "deferring", title: "تأخیری", min: 12, max: 60 },
    L4: { eng: "status" }, // valid | incomplete | invalid
  };

  profileSpec = {
    sample: {
      name: "مقیاس حل مساله دینی",
      multiProfile: false,
      questions: false,
      defaultFields: true,
      fields: [],
    },
    profile: {
      get dimensions() {
        return {
          width: CHART.width + 2 * this.padding.x, // 800 → 903
          height: CHART.height + 2 * this.padding.y, // 224 → 714
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
    if (s[3].mark !== "valid") return [{ valid: false }];

    // Fixed order from `labels`; never sorted by score.
    const styles = s.slice(0, 3).map((data, i) => {
      const { title, min, max } = data.label;
      const mark = data.mark ?? 0;
      const clamped = Math.min(Math.max(mark, min), max);
      return {
        title,
        mark,
        min,
        max,
        left: LINE.left,
        right: LINE.right,
        y: LINE.top + i * LINE.pitch,
        x: LINE.left + ((LINE.right - LINE.left) * (clamped - min)) / (max - min),
      };
    });

    return [{ valid: true, styles }];
  }
}

module.exports = PRPS93;
