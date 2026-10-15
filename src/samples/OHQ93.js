const { Profile } = require("../Profile");

// ---------------------------------------------------------------------------
// OHQ93 — پرسشنامهٔ شادکامی آکسفورد (ترجمهٔ هادی‌نژاد و زارعی، OHQ-FA-HZ1388-D1).
// Built from the approved brief docs/profiles/OHQ_profile_brief_fa.md, without a
// Figma design: agent design in the RSSS93 / BAT bar language (VIS-27), for the
// team designer to review. One horizontal bar per score, total first and then
// F1–F7 in the brief's fixed order; never sorted by score. Every bar has the
// same 500px track and fills to the score's percent of its own maximum, which
// the scoring source computes (`<key>_percent`, whole number, half up); the
// minimum score is 17%, not an empty bar. The percent sits 4px inside the bar
// end; the raw score and its range sit in fixed columns after the track.
// Palette as RSSS93: one indigo gradient for the seven components and the
// neutral gradient for the total, independent of the score. No band, label,
// norm, percentile, comparison or explanatory text. Anything but an explicit
// "valid" status shows only «نمره تولید نشد».
// ---------------------------------------------------------------------------
const CHART = { width: 760, height: 374 };
// BAT: 500×16px bars, 40px row pitch, 2px terminal corners, 8px title gap.
const BAR = { x: 134, width: 500, height: 16, pitch: 40, top: 38, totalGap: 64 };
// Raw score 10px after the track (BAT raw column); range in its own column.
const RAW_X = BAR.x + BAR.width + 10;
const RANGE_X = RAW_X + 36;
// Visible bounds measured from a 4× render: the longest 13px title on the left,
// the range column on the right, the 12px axis labels on top. Centre on these.
const CONTENT = { left: 17.43, right: 733.24, top: 1.44, bottom: CHART.height };
const OFFSET_X = (CHART.width - (CONTENT.right - CONTENT.left)) / 2 - CONTENT.left;
const OFFSET_Y = (CHART.height - (CONTENT.bottom - CONTENT.top)) / 2 - CONTENT.top;
const TICKS = [0, 20, 40, 60, 80, 100];

const pctWidth = (p) => (Math.min(Math.max(p, 0), 100) * BAR.width) / 100;

class OHQ93 extends Profile {
  static pages = 1;

  labels = {
    L1: { eng: "total", title: "نمرهٔ کل شادکامی", min: 28, max: 168 },
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
    L17: { eng: "status" }, // valid | incomplete | invalid
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
        return {
          width: CHART.width + 2 * this.padding.x, // 760 → 903
          height: CHART.height + 2 * this.padding.y, // 374 → 714
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
    if (s[16].mark !== "valid") return [{ valid: false }];

    // Fixed order from `labels`; never sorted by score.
    const items = s.slice(0, 8).map((data, i) => {
      const isTotal = i === 0;
      const percent = Number(s[8 + i].mark ?? 0);
      const width = pctWidth(percent);
      const top = isTotal ? BAR.top : BAR.top + BAR.totalGap + (i - 1) * BAR.pitch;
      return {
        title: data.label.title,
        isTotal,
        raw: Number(data.mark ?? 0),
        min: data.label.min,
        max: data.label.max,
        percent,
        width,
        radius: Math.min(2, width),
        top,
        titleBaseline: top + 11.505,
        scoreBaseline: top + 12.55,
        percentX: BAR.x + width - 4,
      };
    });

    return [
      {
        valid: true,
        items,
        rawX: RAW_X,
        rangeX: RANGE_X,
        gridBottom: CHART.height,
        baselineBottom: CHART.height - 0.5,
        shadowHeight: CHART.height - 16,
        offsetX: OFFSET_X,
        offsetY: OFFSET_Y,
        // The zero guide is the solid baseline; only its value is labelled.
        ticks: TICKS.map((value) => ({ value, x: BAR.x + pctWidth(value), dashed: value > 0 })),
      },
    ];
  }
}

module.exports = OHQ93;
