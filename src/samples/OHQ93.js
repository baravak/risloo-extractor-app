const { Profile } = require("../Profile");

// OHQ93 designer revision, 2026-10-15: seven horizontal factors and a separate
// vertical total. Native percentages are stored as fractions (0..1); multiply
// only for display. Raw scores, percentage rounding and chart geometry stay fixed.
// Figma: raw header 3603:114849; percent labels 8071:184050;
// vertical total/readout 8071:184054. No status-dependent display or alerts.
const CHART = { width: 830, height: 318 };
const BAR = { x: 134, width: 400, height: 16, pitch: 40, top: 38 };
const RAW = { left: BAR.x + BAR.width + 10, width: 64 };
// Designer adaptation: shorter total, raised 8px above the factor guide bounds.
// Its 126px slot accommodates the longest OHQ raw/percent readouts.
const TOTAL = { x: RAW.left + RAW.width + 96, y: 8, top: 6, bottom: 294, height: 288 };
const TICKS = [0, 25, 50, 75, 100];
const pctWidth = p => Math.min(Math.max(p, 0), 100) * BAR.width / 100;

class OHQ93 extends Profile {
  static pages = 1;

  labels = {
    L1: { eng: "total", title: "نمره کل", min: 28, max: 168 },
    L2: { eng: "self_concept", title: "خودپنداره", min: 8, max: 48 },
    L3: { eng: "life_satisfaction", title: "رضایت از زندگی", min: 3, max: 18 },
    L4: { eng: "mental_fitness", title: "آمادگی روانی", min: 4, max: 24 },
    L5: { eng: "cheerfulness", title: "سرِ ذوق بودن", min: 2, max: 12 },
    L6: { eng: "aesthetic_sense", title: "احساس زیبایی‌شناختی", min: 5, max: 30 },
    L7: { eng: "self_efficacy", title: "خودکارآمدی", min: 4, max: 24 },
    L8: { eng: "hope", title: "امیدواری", min: 2, max: 12 },
    L9: { eng: "total_percent" },
    L10: { eng: "self_concept_percent" },
    L11: { eng: "life_satisfaction_percent" },
    L12: { eng: "mental_fitness_percent" },
    L13: { eng: "cheerfulness_percent" },
    L14: { eng: "aesthetic_sense_percent" },
    L15: { eng: "self_efficacy_percent" },
    L16: { eng: "hope_percent" },
  };

  profileSpec = {
    sample: {
      name: "پرسشنامهٔ شادکامی آکسفورد",
      multiProfile: false,
      questions: false,
      defaultFields: true,
      fields: [],
    },
    profile: {
      get dimensions() {
        return { width: CHART.width + 2 * this.padding.x, height: CHART.height + 2 * this.padding.y };
      },
      padding: { x: (943 - CHART.width) / 2 - 20, y: (754 - CHART.height) / 2 - 20 },
    },
    labels: Object.values(this.labels),
  };

  constructor(dataset, options, config = {}) {
    super();
    this._init(dataset, options, config);
  }

  _calcContext() {
    const s = this.dataset.score;
    const items = s.slice(1, 8).map((data, i) => {
      const percent = Math.round(Number(s[9 + i].mark ?? 0) * 100);
      const width = pctWidth(percent);
      const top = BAR.top + i * BAR.pitch;
      return { title: data.label.title, raw: Number(data.mark ?? 0), min: data.label.min,
        max: data.label.max, percent, width, radius: Math.min(2, width), top,
        titleBaseline: top + 11.505, scoreBaseline: top + 12.55,
        // BAT raw-score typography: bottom-aligned numerator, slash and maximum.
        rawBaseline: top + 13.36, slashShift: .66, maxShift: -.165,
        percentX: BAR.x + width - 4 };
    });
    const percent = Math.round(Number(s[8].mark ?? 0) * 100);
    const height = Math.min(Math.max(percent, 0), 100) * TOTAL.height / 100;
    const tip = TOTAL.bottom - height;
    return [{
      items,
      rawX: RAW.left,
      rawHeadingX: RAW.left + RAW.width / 2 - 26 - 6,
      total: { title: s[0].label.title, raw: Number(s[0].mark ?? 0), min: s[0].label.min,
        max: s[0].label.max, percent, height, tip, x: TOTAL.x, y: TOTAL.y,
        trackHeight: TOTAL.height, bottom: TOTAL.bottom, titleBottom: TOTAL.bottom + 1,
        shadowY: TOTAL.bottom - 6, percentBaseline: tip - .98, rawBaseline: tip + 13.06 },
      gridBottom: 310,
      guideShadowHeight: 297,
      baselineBottom: 309.5,
      ticks: TICKS.map(value => ({ value, x: BAR.x + pctWidth(value),
        // As in the source, the final token's right edge sits at the guide;
        // this leaves a clear gap before the adjacent raw heading.
        labelX: value === 100 ? BAR.x + BAR.width + 1 : BAR.x + pctWidth(value),
        anchor: value === 100 ? "end" : "middle", dashed: value > 0 })),
    }];
  }
}

module.exports = OHQ93;
