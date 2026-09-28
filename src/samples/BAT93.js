const { Profile } = require("../Profile");

// ---------------------------------------------------------------------------
// Chart geometry, measured from the Figma "All" layer (830 × 437). Only what the
// controller has to compute with lives here; the static structure is transcribed
// in the template.
// ---------------------------------------------------------------------------

// The score axis is linear over the whole 1.00–5.00 domain: x = 134 at score 0 and
// 100 px per point, i.e. the designer's note "نمره ۵ مساوی است با ۵۰۰ پیکسل".
const AXIS = { x: 134, unit: 100 };
const BAR = { height: 16, gap: 4 }; // the score sits 4 px inside the tip of the bar

// Baselines inside a row, all relative to the top of the 16 px bar. They come from
// the Figma line boxes resolved against Dana's metrics (unitsPerEm 1000, ascender
// 1000, descender −430, capHeight 700): baseline = boxTop + (lineHeight − 1.43·F)/2 + F,
// except the score, whose box is trimmed to the cap height and centred in the bar.
const BASELINE = {
  title: 11.505, // 13 px / 1.2, box top on the row top
  score: 12.55, // 13 px, cap box (9.1) centred in the 16 px bar
  raw: 13.36, // 16 px / 0.9, box bottom on the row bottom
  slash: 14.02, // 12 px / 0.9, same bottom
  max: 13.855, // 13 px / 0.9, same bottom
  level: 11.42, // 12 px / 9 px, box centred in the 18 px level chip (2 px bottom padding)
};

// Exact palette of the three states. The bar gradient always runs light → dark from
// the foot of the bar to its tip.
const THEMES = {
  indigo: { light: "#C7D2FE", dark: "#4338CA" },
  orange: { light: "#FED7AA", dark: "#C2410C" },
  pink: { light: "#FBCFE8", dark: "#BE185D" },
};
const SLATE = { title: "#334155", muted: "#64748B" };

// Flemish clinical cut-off classes produced by scoring/BAT93.py. Designer note: in
// the «در معرض خطر» and «خطر بسیار بالا» states the bar, the title, the raw score and
// the class label all take the state colour; otherwise only the raw score is themed.
// Level 0 is the two secondary subscales, which have no published cut-off and always
// print a dash in slate.
const LEVELS = {
  0: { label: "-", theme: "indigo", themed: false },
  1: { label: "بدون خطر فرسودگی", theme: "indigo", themed: false },
  2: { label: "در معرض خطر", theme: "orange", themed: true },
  3: { label: "خطر بسیار بالا", theme: "pink", themed: true },
};

// The eight rows of the chart, in design order: the core group (five rows starting at
// y = 49) then the secondary group (three rows starting at y = 313), both on a 40 px
// pitch. `max` is the raw maximum of the scale, `weight` the title's font weight — the
// two group totals are the only ones the designer set to 500.
const SCALES = [
  { key: "total_core", title: "علائم اصلی (نمره کل)", max: 115, weight: 500, top: 49 },
  { key: "ex", title: "خستگی", max: 40, weight: 400, top: 89 },
  { key: "md", title: "فاصله ذهنی", max: 25, weight: 400, top: 129 },
  { key: "ci", title: "آسیب‌دیدگی شناختی", max: 25, weight: 400, top: 169 },
  { key: "ei", title: "آسیب‌دیدگی هیجانی", max: 25, weight: 400, top: 209 },
  { key: "secondary", title: "علائم ثانویه", max: 50, weight: 500, top: 313 },
  { key: "pd", title: "شکایات روان‌شناختی", max: 25, weight: 400, top: 353 },
  { key: "psc", title: "شکایات روان‌تنی", max: 25, weight: 400, top: 393 },
];

class BAT93 extends Profile {
  static pages = 1;

  // BAT93 — ابزار ارزیابی فرسودگی شغلی, the work-related BAT-23. Every scale is
  // reported three ways by scoring/BAT93.py: `raw` (the sum of its items), `score`
  // (the interpretive mean, 1.00–5.00 on two decimals) and `level` (the Flemish
  // clinical cut-off class). The mean drives both the bar length and the number
  // printed in it, so the two can never disagree.
  labels = Object.fromEntries(
    SCALES.flatMap(({ key, title, max }) => [
      [`${key}_raw`, { eng: `${key}_raw`, title, max }],
      [`${key}_score`, { eng: `${key}_score` }],
      [`${key}_level`, { eng: `${key}_level` }],
    ])
  );

  profileSpec = {
    sample: {
      name: "ابزار ارزیابی فرسودگی شغلی",
      multiProfile: false,
      questions: false,
      defaultFields: true,
      fields: [],
    },
    profile: {
      get dimensions() {
        return {
          width: 830 + 2 * this.padding.x, // Chart layer 830 wide → 903
          height: 437 + 2 * this.padding.y, // Chart layer 437 tall → 714
        };
      },
      // Padding is the Chart's inset inside the 943 × 754 design page *minus* the
      // 20 px the layout already owns on every side, so the page resolves to
      // 903 × 714 — the exact with-sidebar drawing area — and renders at scale 1
      // instead of being shrunk to fit.
      padding: {
        x: 36.5, // (943 − 830) / 2 − 20
        y: 138.5, // (754 − 437) / 2 − 20
      },
    },
    labels: Object.values(this.labels),
  };

  constructor(dataset, options, config = {}) {
    super();
    this._init(dataset, options, config);
  }

  _calcContext() {
    const { dataset } = this;
    const s = dataset.score; // [raw, score, level] × 8 scales, in SCALES order

    const items = SCALES.map((scale, i) => {
      const raw = s[3 * i];
      const mean = Number(s[3 * i + 1].mark ?? 0);
      const level = LEVELS[s[3 * i + 2].mark ?? 0] || LEVELS[0];
      const theme = THEMES[level.theme];

      // The reported mean is already rounded to two decimals, and it is that number
      // the design turns into pixels — 2.09 → 209 px. A score below 1.00 is
      // impossible (every item scores at least 1), so the bar always has room for
      // the value inside its tip.
      const width = AXIS.unit * mean;

      return {
        title: raw.label.title,
        weight: scale.weight,
        mark: raw.mark ?? 0,
        max: raw.label.max,
        // The decimal separator is «٬» (U+066C) by explicit designer instruction —
        // it is the one that reads well in Dana.
        score: mean.toFixed(2).replace(".", "٬"),
        width,
        top: scale.top,
        gradientFill: `url(#bat-${level.theme})`,
        valueFill: theme.dark,
        titleFill: level.themed ? theme.dark : SLATE.title,
        levelFill: level.themed ? theme.dark : SLATE.muted,
        levelLabel: level.label,
        scoreX: AXIS.x + width - BAR.gap,
        titleBaseline: scale.top + BASELINE.title,
        scoreBaseline: scale.top + BASELINE.score,
        rawBaseline: scale.top + BASELINE.raw,
        slashShift: BASELINE.slash - BASELINE.raw,
        maxShift: BASELINE.max - BASELINE.slash,
        levelBaseline: scale.top + BASELINE.level,
      };
    });

    return [{ items, themes: THEMES }];
  }
}

module.exports = BAT93;
