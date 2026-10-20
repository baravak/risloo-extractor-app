const { Profile } = require("../Profile");

// ---------------------------------------------------------------------------
// No Figma design: agent design from the approved brief
// (docs/profiles/IAT_profile_brief_fa.md), in the bar language of TMPS93 /
// PSOC93. Chart 840 × 72. One horizontal bar from 0 to 100, filled by the stored
// percent; the filled part takes the colour of the person's level, the rest is
// the light grey track; two thin border lines at 50 and 80 with the three level
// names under their own parts. Only the values the controller has to compute
// with live here; the static geometry is in the template.
// ---------------------------------------------------------------------------
const BAR = { x: 72, width: 500, top: 24, height: 20 }; // 100 % = 500 px
const BASELINE = 14.06; // 13 px text baseline, measured from the bar top

// The three levels exactly as the brief names and colours them; keyed by the
// `report` code from scoring/IAT93.py (< 50, 50–79, ≥ 80).
const LEVELS = {
  average_user: { title: "عدم اعتیاد به اینترنت", color: "#5FA88A" },
  moderate_addiction: { title: "در معرض اعتیاد به اینترنت", color: "#E0A030" },
  severe_addiction: { title: "اعتیاد به اینترنت", color: "#C8553D" },
};

class IAT93 extends Profile {
  static pages = 1;

  // IAT93 — پرسشنامه اعتیاد به اینترنت کیمبرلی یانگ. One total score of twenty
  // 1–5 answers (20..100). Keys from scoring/IAT93.py: `total_percent` is the
  // share of the maximum (raw ÷ 100) as a 3-decimal fraction and drives the bar
  // length; `report` is the level code. The percent itself is never printed.
  labels = {
    L1: { eng: "total_raw", title: "نمره کل", max: 100 },
    L2: { eng: "total_percent" },
    L3: { eng: "report" },
  };

  profileSpec = {
    sample: {
      name: "پرسشنامه اعتیاد به اینترنت کیمبرلی یانگ",
      multiProfile: false,
      questions: false,
      defaultFields: true,
      fields: [],
    },
    profile: {
      get dimensions() {
        return {
          width: 840 + 2 * this.padding.x, // Chart 840 wide → 903
          height: 72 + 2 * this.padding.y, // Chart 72 tall → 714
        };
      },
      // Chart centred on the 943 × 754 design page, minus the 20 px the layout
      // already owns on every side, so the page resolves to 903 × 714.
      padding: {
        x: 31.5, // (943 − 840) / 2 − 20
        y: 321, // (754 − 72) / 2 − 20
      },
    },
    labels: Object.values(this.labels),
  };

  constructor(dataset, options, config = {}) {
    super();
    this._init(dataset, options, config);
  }

  _calcContext() {
    const [raw, percent, report] = this.dataset.score;
    const level = LEVELS[report.mark];

    // Brief: never show 0 or an empty bar for a result that was not produced.
    // Scoring yields no result at all for an incomplete sheet, so this only
    // guards against a missing or unknown score: nothing is drawn.
    const hasScore = raw.mark != null && percent.mark != null && level !== undefined;

    // Bar length = percent of the maximum (raw ÷ 100). The stored fraction has
    // two significant decimals here, so × 100 is rounded to undo float error.
    const pct = Math.round((percent.mark ?? 0) * 100);

    // Level parts on the 0–100 axis: names sit under their own part; nothing
    // is drawn before 20, the lowest possible score.
    const at = (p) => BAR.x + (BAR.width * p) / 100;
    const parts = [
      { from: 20, to: 50, code: "average_user" },
      { from: 50, to: 80, code: "moderate_addiction" },
      { from: 80, to: 100, code: "severe_addiction" },
    ].map(({ from, to, code }) => ({ title: LEVELS[code].title, x: (at(from) + at(to)) / 2 }));

    return [
      {
        hasScore,
        bar: BAR,
        baseline: BAR.top + BASELINE,
        mark: raw.mark ?? 0,
        max: raw.label.max,
        title: raw.label.title,
        width: (BAR.width * pct) / 100,
        fill: hasScore ? level.color : "none",
        levelTitle: hasScore ? level.title : "",
        borders: [at(50), at(80)],
        parts,
        end: BAR.x + BAR.width,
      },
    ];
  }
}

module.exports = IAT93;
