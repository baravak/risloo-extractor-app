const { Profile } = require("../Profile");

// ---------------------------------------------------------------------------
// No Figma design: design from the profile brief
// (docs/profiles/DASS-9A_profile_brief_fa.md), in the level-bar language of
// BAI93, laid out exactly like the short form (DASS93) so the two forms read
// alike and differ only in the maximum and the level borders. One page, Chart
// 840 × 336, three rows in the brief's order: افسردگی، اضطراب، استرس. Each row:
//
// - the score name at the right edge, and «شدت: <the person's level>» at the
//   bar's 42 end, on the same baseline;
// - one horizontal bar from 0 (left) to 42 (right), filled by the stored
//   percent in the colour of the person's level in that score, the rest the
//   light track; the raw «n از 42» and «٪ p» beside its 42 end;
// - directly under the bar a thin strip of the same length in five pale parts,
//   one per level of that score, split between two neighbouring scores, each
//   with its level name under it;
// - one quiet line with the two groups' mean and SD.
//
// Researcher, 2026-10-22: the page was too busy — no mean line on the bar; the
// group means stay as numbers only. They are constants of the profile, the
// same for everyone, not part of the stored score. The three scores are never
// combined.
// ---------------------------------------------------------------------------
const CHART = { width: 840, height: 336 };
const MAX = 42;
const BAR = { x: 0, length: 700, top: 26, height: 20 }; // 42 points = 700 px; top inside the row
const ROW_PITCH = 120; // three rows: 0, 120, 240; the last means line ends near 336
const TITLE_BASELINE = 15; // score name and «شدت», inside the row
const STRIP = { gap: 3, height: 6, split: 1 }; // under the bar; 1 px each side of a border
const BELOW_STRIP = { name: 16, means: 36 }; // baselines measured from the strip bottom
const NUMBERS = { raw: 14, percent: 80 }; // left edges, measured from the bar's 42 end
const TEXT_MID = 4.2; // 12–14 px Dana: baseline sits this far under the visual mid-line

// The five levels exactly as the brief names and colours them; indexed by the
// `intensity_<factor>` code of the scoring (0 normal … 4 extremely severe).
const LEVELS = [
  { title: "عادی", color: "#475569", pale: "#CBD5E1" },
  { title: "خفیف", color: "#EAB308", pale: "#FDE047" },
  { title: "متوسط", color: "#EA580C", pale: "#FDBA74" },
  { title: "شدید", color: "#E11D48", pale: "#FDA4AF" },
  { title: "بسیار شدید", color: "#7F1D1D", pale: "#F87171" },
];
const TRACK = "#F1F5F9";

// Per score: the brief's level ranges (inclusive, of 42) and its «میانگین
// گروه‌ها» table: mean and SD of the non-clinical and the clinical group.
const FACTORS = [
  {
    key: "depression",
    title: "افسردگی",
    ranges: [[0, 9], [10, 13], [14, 20], [21, 27], [28, 42]],
    nonClinical: { mean: 8.42, sd: 9.47 },
    clinical: { mean: 19.72, sd: 9.47 },
  },
  {
    key: "anxiety",
    title: "اضطراب",
    ranges: [[0, 7], [8, 9], [10, 14], [15, 19], [20, 42]],
    nonClinical: { mean: 5.41, sd: 6.42 },
    clinical: { mean: 13.43, sd: 7.04 },
  },
  {
    key: "stress",
    title: "استرس",
    ranges: [[0, 14], [15, 18], [19, 25], [26, 33], [34, 42]],
    nonClinical: { mean: 10.64, sd: 8.8 },
    clinical: { mean: 23.9, sd: 8.69 },
  },
];

// Two decimals at most, trailing zeros dropped (VIS-29: 8.80 → 8.8); «٬»
// (U+066C) is the Dana decimal-separator convention (RSSS93).
const decimal = (n) => n.toFixed(2).replace(/\.?0+$/, "").replace(".", "٬");

class DASS9A extends Profile {
  static pages = 1;

  // DASS9A — آزمون مقیاس افسردگی، اضطراب، استرس، فرم بلند. 42 items, four
  // options worth option − 1 (0..3); three scores of 14 items each (0..42), no
  // total. Keys from scoring/DASS9A.py, flattened by Risloo:
  // `<factor>_raw`, `<factor>_percent` (raw ÷ 42 as a 3-decimal fraction) and
  // `intensity_<factor>` (level code 0..4, bands of the long form).
  labels = {
    L1: { eng: "depression_raw", max: MAX },
    L2: { eng: "depression_percent" },
    L3: { eng: "intensity_depression" },
    L4: { eng: "anxiety_raw", max: MAX },
    L5: { eng: "anxiety_percent" },
    L6: { eng: "intensity_anxiety" },
    L7: { eng: "stress_raw", max: MAX },
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

    const rows = FACTORS.map((factor, i) => {
      const [raw, percent, intensity] = score.slice(3 * i, 3 * i + 3);

      // A stored 0 is a real score (empty bar, «0 از 42», «٪ 0», «عادی»). A
      // missing raw or level means no score was produced: track, strip and
      // means line stay, but no number, level or fill is drawn. A sheet with an
      // unanswered item is never scored, so this does not occur on real data.
      const level = LEVELS[Number(stored(intensity.label.eng))];
      const hasScore = present(stored(raw.label.eng)) && present(stored(intensity.label.eng)) && level !== undefined;

      // The stored percent is a 3-decimal fraction. The bar is drawn from it;
      // the page shows it × 100 rounded to a whole number with halves up, in
      // integer arithmetic (as BAI93 / SRQ93).
      const p = hasScore ? Math.min(Math.max(Number(percent.mark ?? 0), 0), 1) : 0;
      const thousandths = Math.round(p * 1000);
      const pct = Math.floor((thousandths + 5) / 10);

      // Level parts of the strip, split between two neighbouring scores.
      const edges = [0, ...factor.ranges.slice(1).map(([from]) => from - 0.5), MAX];
      const stripTop = BAR.top + BAR.height + STRIP.gap;
      const stripBottom = stripTop + STRIP.height;
      const parts = LEVELS.map((lv, k) => {
        const x0 = at(edges[k]) + (k > 0 ? STRIP.split : 0);
        const x1 = at(edges[k + 1]) - (k < LEVELS.length - 1 ? STRIP.split : 0);
        return { title: lv.title, pale: lv.pale, x: x0, width: x1 - x0, mid: (at(edges[k]) + at(edges[k + 1])) / 2 };
      });

      return {
        top: ROW_PITCH * i,
        title: factor.title,
        hasScore,
        fill: hasScore ? level.color : "none",
        levelTitle: hasScore ? level.title : "",
        width: (BAR.length * thousandths) / 1000,
        mark: Number(raw.mark ?? 0),
        max: raw.label.max,
        pct,
        stripTop,
        stripHeight: STRIP.height,
        nameBaseline: stripBottom + BELOW_STRIP.name,
        meansBaseline: stripBottom + BELOW_STRIP.means,
        parts,
        nonClinical: { mean: decimal(factor.nonClinical.mean), sd: decimal(factor.nonClinical.sd) },
        clinical: { mean: decimal(factor.clinical.mean), sd: decimal(factor.clinical.sd) },
      };
    });

    return [
      {
        // No titleAppend: Risloo already sends the form name in `scale.title`
        // (assessment title + " " + the form's title, «… (DASS) فرم بلند»).
        bar: BAR,
        track: TRACK,
        barBaseline: BAR.top + BAR.height / 2 + TEXT_MID,
        rawX: at(MAX) + NUMBERS.raw,
        pctX: at(MAX) + NUMBERS.percent,
        titleBaseline: TITLE_BASELINE,
        nameRight: CHART.width,
        levelRight: at(MAX),
        rows,
      },
    ];
  }
}

module.exports = DASS9A;
