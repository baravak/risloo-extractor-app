const { Profile } = require("../Profile");

// ---------------------------------------------------------------------------
// AIS93 — مقیاس بی‌خوابی آتن (AIS-8 فارسی). Chart drawn from the Figma
// half-ring gauge (Assessments v3.0.0, node 5405:146150): the total (0–24) as
// a 180° gauge filling clockwise from 0 on the left to 100 % on the right,
// percentage and "mark از max" in the centre, title above.
// The interpretation panel and the reference cut-off text were dropped on
// request to match that design.
// All-or-nothing: unless scoring/AIS93.py returns status "valid", only the
// no-result message is drawn — never a partial or zero score.
// The gauge piece sits at (346, 284) on the 943 × 754 design page, one pixel
// off-centre on each axis (insets 346 / 347 and 284 / 283), so the Chart is
// the page minus the measured left/top insets: 251 × 186. The piece is 250
// wide; its bottom labels paint down to y ≈ 186.
// ---------------------------------------------------------------------------
const CHART = { width: 251, height: 186 };
const INSET = { x: 346, y: 284 }; // measured on the design page

// Gauge centre on the Chart; R 125 / r 87.5, so the ring's top sits at y = 42.
const GAUGE = { x: 125, y: 167 };
const SWEEP = { start: Math.PI, end: 2 * Math.PI }; // left → top → right, clockwise

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
          width: CHART.width + 2 * this.padding.x, // 251 → 903
          height: CHART.height + 2 * this.padding.y, // 186 → 714
        };
      },
      // Measured Chart inset on the 943 × 754 design page minus the 20 px the
      // layout owns on every side, so the with-sidebar page renders at scale 1.
      padding: {
        x: INSET.x - 20, // 326
        y: INSET.y - 20, // 264
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
    const p = Math.min(Math.max(mark / max, 0), 1);

    return [
      {
        valid: true,
        total: {
          title: "بی‌خوابی آتن",
          mark,
          max,
          pct: Math.round(p * 100),
          zeta: SWEEP.start + p * (SWEEP.end - SWEEP.start),
          x: GAUGE.x,
          y: GAUGE.y,
        },
      },
    ];
  }
}

module.exports = AIS93;
