const { Profile } = require("../Profile");

// ---------------------------------------------------------------------------
// No Figma design: design from the profile brief
// (docs/profiles/DASS-93_profile_brief_fa.md), in the bar language of BAI93,
// laid out exactly like the long form (DASS9A). One page, Chart 840 × 336,
// three rows in the brief's order — افسردگی، اضطراب، استرس. Each row:
//
// - the component name at the right edge, and «شدت: <level>» aligned with the
//   bar's 21 end;
// - one horizontal bar from 0 (left) to 21 (right), filled by the stored percent
//   in the colour of the person's level in that component, the rest the light
//   track; the raw score of 21 and the percent beside it;
// - directly under the bar a thin strip of the same length in five pale parts,
//   one per level of that component, split between two neighbouring scores,
//   each with its level name under it;
// - one quiet line with the two groups' mean and SD.
//
// Researcher, 2026-10-22: the page was too busy — no mean line on the bar; the
// group means stay as numbers only. The group means are constants of the
// profile, the same for everyone, not part of the stored score.
// ---------------------------------------------------------------------------
const CHART = { width: 840, height: 336 };
const MAX = 21;
const BAR = { x: 0, length: 700, top: 26, height: 20 }; // 21 points = 700 px; top within a row
const ROW_PITCH = 120; // rows at 0, 120, 240; the last means line ends near 336
const STRIP = { gap: 3, height: 6, split: 1 }; // under the bar; 1 px each side of a border
const BELOW_STRIP = { name: 16, means: 36 }; // baselines measured from the strip bottom
const NUMBERS = { raw: 14, percent: 80 }; // left edges, measured from the bar's 21 end
const TITLE_BASELINE = 15;
const TEXT_MID = 4.2; // 12–13 px Dana: baseline sits this far under the visual mid-line

// The five levels exactly as the brief names and colours them; indexed by the
// `intensity_<factor>` code of the scoring (0 normal … 4 extremely severe).
const LEVEL_TITLES = ["عادی", "خفیف", "متوسط", "شدید", "بسیار شدید"];
const LEVEL_COLORS = ["#475569", "#EAB308", "#EA580C", "#E11D48", "#7F1D1D"];
const LEVEL_PALES = ["#CBD5E1", "#FDE047", "#FDBA74", "#FDA4AF", "#F87171"];
const TRACK = "#F1F5F9";

// Per component, in the brief's order: its level ranges in this form's raw score
// (the borders sit between two neighbouring scores) and the brief's «میانگین
// گروه‌ها» table — mean and SD of the non-clinical and the clinical group.
const COMPONENTS = [
  {
    key: "depression",
    title: "افسردگی",
    ranges: [[0, 4], [5, 6], [7, 10], [11, 13], [14, 21]],
    nonClinical: { mean: "4.21", sd: "4.74" },
    clinical: { mean: "9.86", sd: "4.74" },
  },
  {
    key: "anxiety",
    title: "اضطراب",
    ranges: [[0, 3], [4, 4], [5, 7], [8, 9], [10, 21]],
    nonClinical: { mean: "2.71", sd: "3.21" },
    clinical: { mean: "6.72", sd: "3.52" },
  },
  {
    key: "stress",
    title: "استرس",
    ranges: [[0, 7], [8, 9], [10, 12], [13, 16], [17, 21]],
    nonClinical: { mean: "5.32", sd: "4.40" },
    clinical: { mean: "11.95", sd: "4.35" },
  },
];

// VIS-29: no trailing decimal zeroes; «٬» (U+066C) is the Dana decimal separator
// by designer instruction (BAT93, RSSS93).
const decimal = (text) => (text.includes(".") ? text.replace(/\.?0+$/, "") : text).replace(".", "٬");

class DASS93 extends Profile {
  static pages = 1;

  // DASS93 — آزمون مقیاس افسردگی، اضطراب، استرس، فرم کوتاه. 21 items, four options
  // each, worth option − 1 (0..3); three scores of 7 items each (0..21), no total.
  // Keys from scoring/DASS93.py as Risloo flattens them: `<factor>_raw`,
  // `<factor>_percent` (raw ÷ 21 as a 3-decimal fraction) and `intensity_<factor>`
  // (level code 0..4, from twice the raw).
  labels = {
    L1: { eng: "depression_raw", title: "افسردگی", max: MAX },
    L2: { eng: "depression_percent" },
    L3: { eng: "intensity_depression" },
    L4: { eng: "anxiety_raw", title: "اضطراب", max: MAX },
    L5: { eng: "anxiety_percent" },
    L6: { eng: "intensity_anxiety" },
    L7: { eng: "stress_raw", title: "استرس", max: MAX },
    L8: { eng: "stress_percent" },
    L9: { eng: "intensity_stress" },
  };

  profileSpec = {
    sample: {
      name: "آزمون مقیاس افسردگی، اضطراب، استرس (DASS)",
      multiProfile: false,
      questions: false,
      defaultFields: true,
      fields: [],
    },
    profile: {
      get dimensions() {
        return {
          width: CHART.width + 2 * this.padding.x, // → 903
          height: CHART.height + 2 * this.padding.y, // → 714
        };
      },
      // Chart centred on the 943 × 754 design page, minus the 20 px the layout
      // already owns on every side, so the page resolves to 903 × 714.
      padding: {
        x: 31.5, // (943 − 840) / 2 − 20
        y: 189, // (754 − 336) / 2 − 20
      },
    },
    labels: Object.values(this.labels),
  };

  constructor(dataset, options, config = {}) {
    super();
    // `_extractData` turns a stored 0 into undefined (`score[key] || …`), but 0
    // is a valid raw score, percent and level code here. Keep the scoring output
    // itself so only an absent or empty field counts as "not produced" (BAI93).
    this.storedScore = (dataset && dataset.score) || {};
    this._init(dataset, options, config);
  }

  _calcContext() {
    const { score } = this.dataset;
    const stored = (key) => this.storedScore[key];
    const present = (v) => v !== undefined && v !== null && v !== "";
    const at = (s) => BAR.x + (BAR.length * s) / MAX;

    const rows = COMPONENTS.map((component, r) => {
      const [raw, percent, intensity] = score.slice(3 * r, 3 * r + 3);
      const top = r * ROW_PITCH;

      // A stored 0 is a real score (empty bar, «0 از 21», «٪ 0», «عادی»). A
      // missing raw score or level means no score was produced for this
      // component: its track, strip and means line stay, but no number, level
      // or fill is drawn. A sheet with an unanswered item is never scored, so
      // this does not occur on real data.
      const code = Number(stored(intensity.label.eng));
      const hasLevel = present(stored(intensity.label.eng)) && Number.isInteger(code) && code >= 0 && code <= 4;
      const hasScore = present(stored(raw.label.eng)) && hasLevel;
      const mark = Number(raw.mark ?? 0);

      // The stored percent is a 3-decimal fraction. The bar is drawn from it; the
      // page shows it × 100 rounded to a whole number with halves up, in integer
      // arithmetic (as BAI93, SRQ93).
      const p = hasScore ? Math.min(Math.max(Number(percent.mark ?? 0), 0), 1) : 0;
      const thousandths = Math.round(p * 1000);
      const pct = Math.floor((thousandths + 5) / 10);
      const width = (BAR.length * thousandths) / 1000;

      // The five level parts of the strip, split between two neighbouring scores.
      const edges = [0, ...component.ranges.slice(1).map(([from]) => from - 0.5), MAX];
      const barTop = top + BAR.top;
      const stripTop = barTop + BAR.height + STRIP.gap;
      const stripBottom = stripTop + STRIP.height;
      const parts = component.ranges.map((range, i) => {
        const x0 = at(edges[i]) + (i > 0 ? STRIP.split : 0);
        const x1 = at(edges[i + 1]) - (i < component.ranges.length - 1 ? STRIP.split : 0);
        return {
          title: LEVEL_TITLES[i],
          pale: LEVEL_PALES[i],
          x: x0,
          width: x1 - x0,
          mid: (at(edges[i]) + at(edges[i + 1])) / 2,
        };
      });

      return {
        title: component.title,
        titleBaseline: top + TITLE_BASELINE,
        hasScore,
        levelTitle: hasScore ? LEVEL_TITLES[code] : "",
        fill: hasScore ? LEVEL_COLORS[code] : "none",
        barTop,
        width,
        barBaseline: barTop + BAR.height / 2 + TEXT_MID,
        mark,
        max: raw.label.max,
        pct,
        stripTop,
        nameBaseline: stripBottom + BELOW_STRIP.name,
        meansBaseline: stripBottom + BELOW_STRIP.means,
        parts,
        nonClinical: { mean: decimal(component.nonClinical.mean), sd: decimal(component.nonClinical.sd) },
        clinical: { mean: decimal(component.clinical.mean), sd: decimal(component.clinical.sd) },
      };
    });

    return [
      {
        bar: BAR,
        track: TRACK,
        stripHeight: STRIP.height,
        nameRight: CHART.width,
        levelRight: at(MAX),
        rawX: at(MAX) + NUMBERS.raw,
        pctX: at(MAX) + NUMBERS.percent,
        rows,
        // No titleAppend: Risloo already sends the form name in `scale.title`
        // (assessment title + " " + the form's title, «… (DASS) فرم کوتاه»).
      },
    ];
  }
}

module.exports = DASS93;
