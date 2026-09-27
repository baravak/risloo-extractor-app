const { Profile } = require("../Profile");

// ---------------------------------------------------------------------------
// ISI93 — شاخص شدت بی‌خوابی مورین. Layout assembled from two existing Figma
// components (Assessments v3.0.0):
//   - the severity strip on top is the BDI "Total" piece (node 5069:129385):
//     one bar over the total with dashed band edges, the band's upper score
//     above each edge and the respondent's band highlighted in its colour;
//   - each component is a 270° ring gauge, the "P Total" piece (node
//     4729:125971): 0 at the top, filling clockwise to 100 % on the left,
//     percentage and "mark از max" in the centre, title underneath.
// Rules kept from the science record: the two components are drawn in one
// neutral hue and without a class, each against its own maximum (the "از max"
// readout keeps their unequal ranges visible); all-or-nothing — unless scoring
// returns status "valid", only the no-result message is drawn.
// Chart 545 × 289, centred on the 943 × 754 design page; the strip bar and the
// gauge pair are both centred on the Chart, so both sit mid-page.
// ---------------------------------------------------------------------------
const CHART = { width: 545, height: 289 };

// Severity strip: the piece sits at the Chart origin, its bar starts at x = 48
// and 28 points span its 449 px, so score s ends at s * STRIP.unit on the bar.
const STRIP = { width: 449, max: 28 };
STRIP.unit = STRIP.width / STRIP.max;
const INSIDE_MIN = 34; // narrowest bar that still holds a two-digit score inside

// Severity bands over the total; each edge sits on its band's upper score.
// Colours are the BDI severity palette [gradient start, gradient end / accent].
const BANDS = [
  { key: "none", to: 7, title: "ناچیز", colors: ["#CBD5E1", "#475569"] },
  { key: "subthreshold", to: 14, title: "زیرآستانه", colors: ["#FDE047", "#EAB308"] },
  { key: "moderate", to: 21, title: "متوسط", colors: ["#FDBA74", "#EA580C"] },
  { key: "severe", to: 28, title: "شدید", colors: ["#FDA4AF", "#E11D48"] },
];

// Component gauges: ring centres, symmetric about the strip bar's centre
// (x = 272.5, also the Chart's centre); in RTL order the first component is
// on the right.
const GAUGE = { centers: [372.5, 172.5], y: 195 };
const SWEEP = { start: -Math.PI / 2, end: Math.PI }; // clockwise 270°

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
          width: CHART.width + 2 * this.padding.x, // 545 → 903
          height: CHART.height + 2 * this.padding.y, // 289 → 714
        };
      },
      // Chart inset inside the 943 × 754 design page minus the 20 px the layout
      // owns on every side, so the with-sidebar page renders at scale 1.
      padding: {
        x: (943 - CHART.width) / 2 - 20, // 179
        y: (754 - CHART.height) / 2 - 20, // 212.5
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

    const bands = BANDS.map((band, i) => {
      const from = i === 0 ? 0 : BANDS[i - 1].to * STRIP.unit;
      const edge = band.to * STRIP.unit;
      return {
        to: band.to,
        edge,
        center: (from + edge) / 2,
        title: band.title,
        active: i === active,
      };
    });

    const mark = s[2].mark ?? 0;
    const max = s[2].label.max;
    const pct = Math.round((mark / max) * 100);
    const width = mark * STRIP.unit;
    const inside = width >= INSIDE_MIN;
    const colors = BANDS[active].colors;

    const components = s.slice(0, 2).map((data, i) => {
      const value = data.mark ?? 0;
      const p = Math.min(value / data.label.max, 1);
      return {
        title: data.label.title,
        mark: value,
        max: data.label.max,
        pct: Math.round(p * 100),
        zeta: SWEEP.start + p * (SWEEP.end - SWEEP.start),
        x: GAUGE.centers[i],
        y: GAUGE.y,
      };
    });

    return [
      {
        valid: true,
        bands,
        total: {
          mark,
          max,
          pct,
          width,
          colors,
          // Score inside the tip when it fits, otherwise just past it.
          labelX: inside ? width - 8 : width + 8,
          labelAnchor: inside ? "start" : "end",
          labelFill: inside ? "#FFFFFF" : colors[1],
        },
        components,
      },
    ];
  }
}

module.exports = ISI93;
