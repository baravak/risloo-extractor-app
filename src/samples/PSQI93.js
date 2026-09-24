const { Profile } = require("../Profile");

// ---------------------------------------------------------------------------
// PSQI93 — شاخص کیفیت خواب پیتزبورگ. No Figma source: the chart was designed
// directly from the approved result specification of the science record
// (catalog/assessments/psqi, «مشخصات نتیجه فردی»), whose rules this layout
// enforces rather than decorates:
//   - seven components on one shared 0–3 axis, raw only — no per-component
//     class, colour or label (no evidence for any);
//   - the total 0–21, drawn neutral: the screening result lives ONLY in the
//     approved interpretation text — no badge, no colour, no cut line;
//   - all-or-nothing: when scoring/PSQI93.py returns status "invalid" nothing
//     but the no-result message is drawn — never a partial or zero score.
// Chart 863 × 674, centred on the 943 × 754 design page.
// ---------------------------------------------------------------------------
const CHART = { width: 863, height: 674 };

// Component rows: bars grow left → right from the 0 guide; the total card sits
// to the right of the chart.
const ROW = { top: 84, pitch: 44, height: 18 };
const AXIS = { zero: 162, unit: 150, max: 3 }; // 0 at x=162, 3 at x=612
const BASELINE = 13.2; // 14 px text on an 18 px row

// Total card bar, also left → right: 0 at the card's left inset, 21 at its right.
const TOTAL = { left: 713, length: 130, max: 21, cutoff: 6 };

// Interpretation panel: one fixed line pitch; the conditional false-positive
// line collapses its space when the screen is negative.
const TEXT = { top: 494, pitch: 27 };

class PSQI93 extends Profile {
  static pages = 1;

  labels = {
    L1: { eng: "subjective_quality", title: "کیفیت ذهنی خواب" },
    L2: { eng: "latency", title: "تأخیر خواب" },
    L3: { eng: "duration", title: "مدت خواب" },
    L4: { eng: "efficiency", title: "کارایی معمول خواب" },
    L5: { eng: "disturbances", title: "اختلال‌های خواب" },
    L6: { eng: "medication", title: "مصرف داروی خواب" },
    L7: { eng: "daytime_dysfunction", title: "اختلال عملکرد روزانه" },
    L8: { eng: "total", title: "نمره کل", max: 21 },
    L9: { eng: "status" }, // valid | invalid
    L10: { eng: "screening" }, // positive | negative — read, never drawn as a label
  };

  profileSpec = {
    sample: {
      name: "شاخص کیفیت خواب پیتزبورگ",
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
    const status = s[8].mark;

    // Anything but an explicit "valid" is treated as no result: a missing
    // status must not let seven `?? 0` zeros read as "no sleep problem".
    if (status !== "valid") return [{ valid: false }];

    const items = s.slice(0, 7).map((data, i) => {
      const mark = data.mark ?? 0;
      const top = ROW.top + i * ROW.pitch;
      const width = mark * AXIS.unit;
      return {
        title: data.label.title,
        mark,
        top,
        width,
        x: AXIS.zero,
        baseline: top + BASELINE,
      };
    });

    const totalMark = s[7].mark ?? 0;
    const positive = totalMark >= TOTAL.cutoff;
    const totalWidth = (TOTAL.length * totalMark) / TOTAL.max;

    const line = (n) => TEXT.top + n * TEXT.pitch;
    const falsePositive = positive ? line(3) : null;
    const next = positive ? 4 : 3;

    return [
      {
        valid: true,
        items,
        ticks: [0, 1, 2, 3].map((v) => ({ v, x: AXIS.zero + v * AXIS.unit })),
        total: {
          mark: totalMark,
          max: TOTAL.max,
          width: totalWidth,
          x: TOTAL.left,
        },
        screen: {
          positive,
          text: positive ? "نیازمند بررسی بیشتر" : "نشانه‌ای از مشکل قابل‌توجه دیده نشد",
        },
        lines: {
          direction: line(0),
          screen: line(1),
          cutoff: line(2),
          falsePositive,
          limits1: line(next),
          limits2: line(next + 1),
        },
      },
    ];
  }
}

module.exports = PSQI93;
