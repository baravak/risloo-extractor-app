const { Profile } = require("../Profile");

// ---------------------------------------------------------------------------
// No Figma design: design from the approved brief
// (docs/profiles/SEST_profile_brief_fa.md), in the single-total bar language
// of SWBS93 (same geometry). Chart 644 × 20. One horizontal bar that starts at
// 0 and ends at the maximum, 100, filled by the stored percent; a total of 0 is
// a real score and leaves the bar empty. «نمره کل» on its left; beside its end,
// two fixed columns: the percent next to the bar and "raw از 55" after it. One
// fill colour and one track colour, exactly as the brief gives them; no levels,
// zones, boundary lines, axis numbers, part scores or score-dependent colour.
// ---------------------------------------------------------------------------
const BAR = { x: 48, length: 500, height: 20 }; // 100 % = 500 px; the bar is the whole chart height
const BASELINE = 14.06; // 13 px text baseline on the 20 px bar (IAT93, SWBS93)
const PCT_X = 558; // left edge of the percent column: 10 px after the track end (BAR-01)
const RAW_X = 601; // left edge of the raw column: 16 px after the widest percent, "٪ 100" (27 px)
// Brief palette (سطح‌بندی و رنگ): filled part, unfilled part. Never changes
// with the score.
const COLOR = { fill: "#5B4B8A", track: "#ECE9F3" };

class SEST93 extends Profile {
  static pages = 1;

  // SEST93 — مقیاس تفکر وجودی شرر. Eleven items, six options each, scored
  // option − 1 («نمی‌دانم» 0 … «همیشه» 5) and summed into one total (0..55).
  // No part scores. Keys from scoring/SEST93.py: `total_raw`, and
  // `total_percent` = raw ÷ 55 as a 3-decimal fraction. The percent drives
  // both the bar length and the "٪ NN" readout so the two never disagree.
  labels = {
    L1: { eng: "total_raw", title: "نمره کل", max: 55 },
    L2: { eng: "total_percent" },
  };

  profileSpec = {
    sample: {
      name: "مقیاس تفکر وجودی شرر",
      multiProfile: false,
      questions: false,
      defaultFields: true,
      fields: [],
    },
    profile: {
      get dimensions() {
        return {
          width: 644 + 2 * this.padding.x, // Chart 644 wide → 903
          height: 20 + 2 * this.padding.y, // Chart 20 tall → 714
        };
      },
      // Chart centred on the 943 × 754 design page, minus the 20 px the layout
      // already owns on every side, so the page resolves to 903 × 714.
      padding: {
        x: 129.5, // (943 − 644) / 2 − 20
        y: 347, // (754 − 20) / 2 − 20
      },
    },
    labels: Object.values(this.labels),
  };

  constructor(dataset, options, config = {}) {
    super();
    // `_extractData` turns a stored 0 into undefined (`score[key] || …`). An
    // all-«نمی‌دانم» sheet scores 0, so keep the scoring output itself and read
    // a stored 0 as a real score (empty bar, «0 از 55», «٪ 0»), not as a
    // missing one (SWBS93 / SISRI93 / BAI93).
    this.storedScore = (dataset && dataset.score) || {};
    this._init(dataset, options, config);
  }

  _calcContext() {
    const [raw, percent] = this.dataset.score;

    // A field that is absent, null or empty means no result was produced:
    // nothing is drawn, not even the name or the track, so no 0 stands in for a
    // missing score.
    const stored = (key) => this.storedScore[key];
    const present = (v) => v !== undefined && v !== null && v !== "";
    const hasScore = present(stored(raw.label.eng)) && present(stored(percent.label.eng));

    // The stored percent is a 3-decimal fraction. The bar is drawn from it; the
    // page shows it × 100 rounded to a whole number with halves up, in integer
    // arithmetic so 0.545 reads 55, not 54 (as SWBS93 / CAARS93 / SRQ93).
    const p = hasScore ? Math.min(Math.max(Number(stored(percent.label.eng)), 0), 1) : 0;
    const thousandths = Math.round(p * 1000);
    const pct = Math.floor((thousandths + 5) / 10);

    return [
      {
        hasScore,
        bar: BAR,
        baseline: BASELINE,
        title: raw.label.title,
        mark: hasScore ? Number(stored(raw.label.eng)) : 0,
        max: raw.label.max,
        pct,
        width: (BAR.length * thousandths) / 1000,
        color: COLOR,
        pctX: PCT_X,
        rawX: RAW_X,
      },
    ];
  }
}

module.exports = SEST93;
