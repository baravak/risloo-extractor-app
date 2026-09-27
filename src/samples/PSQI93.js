const { Profile } = require("../Profile");

// ---------------------------------------------------------------------------
// PSQI93 — شاخص کیفیت خواب پیتزبورگ. Layout from the Figma "Chart" layer of
// the JSS93 design (Assessments v3.0.0, node 8071:183989), adapted to seven
// rows on a 0–3 axis with no raw-score column, and a vertical 0–21 total
// column. Rules kept from the approved result specification of the science
// record (catalog/assessments/psqi, «مشخصات نتیجه فردی»):
//   - seven components on one shared 0–3 axis, raw only — no per-component
//     class, colour or label (no evidence for any);
//   - the total 0–21 with the screening cut line at 6: 0–5 neutral, 6–21 red;
//   - all-or-nothing: when scoring/PSQI93.py returns status "invalid" nothing
//     but the no-result message is drawn — never a partial or zero score.
// Chart 789 × 334: the design's 789 × 414 less two of its 40 px rows, centred
// on the 943 × 754 design page.
// ---------------------------------------------------------------------------
const CHART = { width: 789, height: 334 };

// Component rows keep the design's 40 px pitch and row mid-line (top + 8); the
// bar is 22 px, 3 px taller than the design's 16 px on each side.
const ROW = { top: 54, pitch: 40, height: 22, inset: -3 };
const AXIS = { zero: 174, unit: 400 / 3, max: 3, gap: 6 }; // 0 at x=174, 3 at x=574; score 6 px inside the tip
const BASELINE = 12.06; // 13 px text on the row mid-line, from the row top

// Total column: vertical bar filling bottom → up, 0 at y=316, 21 at y=46.
const TOTAL = { bottom: 316, length: 270, max: 21, cutoff: 6 };

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
          width: CHART.width + 2 * this.padding.x, // 789 → 903
          height: CHART.height + 2 * this.padding.y, // 334 → 714
        };
      },
      // Chart inset inside the 943 × 754 design page minus the 20 px the layout
      // owns on every side, so the with-sidebar page renders at scale 1.
      padding: {
        x: (943 - CHART.width) / 2 - 20, // 57
        y: (754 - CHART.height) / 2 - 20, // 190
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
        barTop: top + ROW.inset,
        width,
        x: AXIS.zero,
        labelX: AXIS.zero + width - AXIS.gap,
        baseline: top + BASELINE,
      };
    });

    const totalMark = s[7].mark ?? 0;
    const positive = totalMark >= TOTAL.cutoff;
    const totalHeight = (TOTAL.length * totalMark) / TOTAL.max;
    const totalTip = TOTAL.bottom - totalHeight;

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
          height: totalHeight,
          tip: totalTip,
          // 18 px number centred on the tip of the bar, travelling with it.
          baseline: totalTip + 6.5,
          // Screening cut: a total of exactly 6 puts the tip on this line.
          cut: TOTAL.bottom - (TOTAL.length * TOTAL.cutoff) / TOTAL.max,
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
