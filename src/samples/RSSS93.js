const { Profile } = require("../Profile");

// ---------------------------------------------------------------------------
// RSSS93 — مقیاس کشمکش‌های مذهبی و معنوی (فرم فارسی ۲۶ گویه‌ای، RSSS-FA26-J1).
// No Figma source: the chart is designed from the approved individual-result
// specification of the science package, whose rules this layout enforces
// rather than decorates:
//   - six domain means — الهی, اهریمنی, بین‌فردی, اخلاقی, معنای غایی,
//     شک و تردید — each on its own separate 1–5 line, then, after a clear
//     gap, the total on a seventh separate line; always all seven, always in
//     that fixed order, never one shared axis, never a sorted, combined or
//     comparative chart;
//   - every value on two decimals, as scoring/RSSS93.py already rounds it
//     (half up), so the printed number and the marker can never disagree;
//   - classification is off: one neutral hue, no zone, no threshold, no
//     label, no warning, no "dominant domain", nothing that singles out or
//     ranks the highest score; no raw sum, percent, percentile or norm;
//   - the only interpretation is the two approved sentences, verbatim, and the
//     four approved uncertainty lines; the profile is read by the authorised
//     specialist only, so all of its text is third person;
//   - all-or-nothing: unless the formula returns status "valid", only the
//     approved no-score sentence is drawn — never a partial or zero score.
// Chart 863 × 674, centred on the 943 × 754 design page.
// ---------------------------------------------------------------------------
const CHART = { width: 863, height: 674 };

// Each score owns its line: 1 at x=LINE.left, 5 at x=LINE.right. The six
// domains are LINE.pitch apart; the total sits LINE.totalGap below the last.
const LINE = { left: 20, right: 600, top: 88, pitch: 48, totalGap: 64 };
const MIN = 1;
const MAX = 5;

// Two decimals; «٬» (U+066C) is the decimal separator that reads well in Dana,
// as in BAT93.
const decimal = (n) => n.toFixed(2).replace(".", "٬");

class RSSS93 extends Profile {
  static pages = 1;

  labels = {
    L1: { eng: "divine", title: "الهی" },
    L2: { eng: "demonic", title: "اهریمنی" },
    L3: { eng: "interpersonal", title: "بین‌فردی" },
    L4: { eng: "moral", title: "اخلاقی" },
    L5: { eng: "ultimate_meaning", title: "معنای غایی" },
    L6: { eng: "doubt", title: "شک و تردید" },
    L7: { eng: "total", title: "کل مقیاس" },
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
    // must not let `?? 0` read as a score.
    if (s[7].mark !== "valid") return [{ valid: false }];

    // Fixed order from `labels`; never sorted by score.
    const lines = s.slice(0, 7).map((data, i) => {
      const mark = Number(data.mark ?? 0);
      const clamped = Math.min(Math.max(mark, MIN), MAX);
      return {
        title: data.label.title,
        mark: decimal(mark),
        min: MIN,
        max: MAX,
        left: LINE.left,
        right: LINE.right,
        y: LINE.top + i * LINE.pitch + (i === 6 ? LINE.totalGap - LINE.pitch : 0),
        x: LINE.left + ((LINE.right - LINE.left) * (clamped - MIN)) / (MAX - MIN),
      };
    });

    return [
      {
        valid: true,
        domains: lines.slice(0, 6),
        total: lines[6],
        dividerY: (lines[5].y + lines[6].y) / 2,
      },
    ];
  }
}

module.exports = RSSS93;
