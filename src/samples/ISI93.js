const { Profile } = require("../Profile");

// ---------------------------------------------------------------------------
// ISI93 — شاخص شدت بی‌خوابی مورین. No Figma source: the chart was designed
// directly from the approved result specification of the science record
// (catalog/assessments/isi, «خروجی نتیجهٔ فردی»), whose rules this layout
// enforces rather than decorates:
//   - three scores, each drawn with its own range (total 0–28, nocturnal 0–16,
//     daytime 0–12) on one shared points scale, so unequal ranges stay visible
//     and the two components never read as comparable;
//   - the severity class is on the total only, coloured by class (allowed), and
//     never without its four fixed caveats — they are always drawn with it;
//   - components are one neutral hue: they take no class;
//   - no alert, no advice, no norm or comparison chart;
//   - all-or-nothing: unless scoring/ISI93.py returns status "valid", only the
//     no-result message is drawn — never a partial or zero score.
// Chart 863 × 674, centred on the 943 × 754 design page.
// ---------------------------------------------------------------------------
const CHART = { width: 863, height: 674 };

// One points scale for every bar: score s sits at AXIS.left + s * AXIS.unit.
const AXIS = { left: 20, unit: 22.5, max: 28 }; // 0 at x=20, 28 at x=650

// Severity bands over the total, split half-way between integer scores.
const BANDS = [
  { key: "none", from: 0, to: 7, fill: "#E0E7FF", lines: ["بی‌خوابیِ بالینیِ", "معنادار ندارد"] },
  { key: "subthreshold", from: 8, to: 14, fill: "#A5B4FC", lines: ["بی‌خوابی زیرآستانه"] },
  { key: "moderate", from: 15, to: 21, fill: "#6366F1", lines: ["بی‌خوابی بالینی،", "شدت متوسط"] },
  { key: "severe", from: 22, to: 28, fill: "#3730A3", lines: ["بی‌خوابی بالینی،", "شدید"] },
];

// Component rows, below the total section.
const ROW = { top: 290, pitch: 46, height: 18 };
const BASELINE = 13.2; // 14 px text on an 18 px row

class ISI93 extends Profile {
  static pages = 1;

  labels = {
    L1: { eng: "nocturnal", title: "شدت نشانه‌های شبانه", max: 16 },
    L2: { eng: "daytime", title: "اثرهای روزانهٔ بی‌خوابی", max: 12 },
    L3: { eng: "total", title: "نمرهٔ کل", max: 28 },
    L4: { eng: "status" }, // valid | incomplete | invalid
    L5: { eng: "severity" }, // none | subthreshold | moderate | severe
  };

  profileSpec = {
    sample: {
      name: "شاخص شدت بی‌خوابی مورین",
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
    const status = s[3].mark;
    const active = BANDS.findIndex((band) => band.key === s[4].mark);

    // Anything but an explicit "valid" with a known class is no result: a
    // missing status must not let `?? 0` zeros read as "no insomnia".
    if (status !== "valid" || active === -1) return [{ valid: false }];

    const x = (score) => AXIS.left + score * AXIS.unit;

    const bands = BANDS.map((band, i) => {
      const left = i === 0 ? x(0) : x(band.from - 0.5);
      const right = i === BANDS.length - 1 ? x(AXIS.max) : x(band.to + 0.5);
      return {
        left,
        width: right - left,
        center: (left + right) / 2,
        fill: band.fill,
        range: `${band.from} تا ${band.to}`,
        lines: band.lines.map((text, j) => ({ text, y: 184 + j * 17 })),
        active: i === active,
      };
    });

    const totalMark = s[2].mark ?? 0;

    const components = s.slice(0, 2).map((data, i) => {
      const mark = data.mark ?? 0;
      const top = ROW.top + i * ROW.pitch;
      const track = data.label.max * AXIS.unit;
      return {
        title: data.label.title,
        mark,
        max: data.label.max,
        top,
        track,
        width: mark * AXIS.unit,
        valueX: AXIS.left + track + 12,
        baseline: top + BASELINE,
      };
    });

    return [
      {
        valid: true,
        total: {
          mark: totalMark,
          max: AXIS.max,
          x: x(totalMark),
        },
        bands,
        severity: {
          title: BANDS[active].lines.join(" "),
          fill: BANDS[active].fill,
        },
        components,
      },
    ];
  }
}

module.exports = ISI93;
