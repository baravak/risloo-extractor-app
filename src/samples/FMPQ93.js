const { Profile } = require("../Profile");

// ---------------------------------------------------------------------------
// No Figma design: design from the approved brief
// (docs/profiles/FMPQ_profile_brief_fa.md), in the bar language of IAT93 /
// SRQ93. Chart 644 × 20. One horizontal bar that starts at 0 and ends at the
// maximum, 52, filled by the stored percent, so even the lowest score (13) fills
// a quarter of it. «نمره کل» on its left; beside its end, two fixed columns: the
// percent next to the bar and "raw از 52" after it. One fill colour and one
// track colour, exactly as the brief gives them; no levels, zones, boundary
// lines, axis numbers or score-dependent colour.
// ---------------------------------------------------------------------------
const BAR = { x: 48, length: 500, height: 20 }; // 100 % = 500 px; the bar is the whole chart height
const BASELINE = 14.06; // 13 px text baseline on the 20 px bar (IAT93)
const PCT_X = 558; // left edge of the percent column: 10 px after the track end (BAR-01)
const RAW_X = 601; // left edge of the raw column: 16 px after the widest percent, "٪ 100" (27 px)
// Brief palette (سطح‌بندی و رنگ): filled part, unfilled part. Never changes with the score.
const COLOR = { fill: "#4A6FA5", track: "#E3E9F2" };

class FMPQ93 extends Profile {
  static pages = 1;

  // FMPQ93 — پرسشنامه خودکارآمدی اخلاقی. Thirteen 1–4 answers summed into one
  // total (13..52); no factors, no reversed items, no levels. Keys from
  // scoring/FMPQ93.py: `total_raw`, and `total_percent` = raw ÷ 52 as a
  // 3-decimal fraction. The percent drives both the bar length and the "٪ NN"
  // readout so the two never disagree.
  labels = {
    L1: { eng: "total_raw", title: "نمره کل", max: 52 },
    L2: { eng: "total_percent" },
  };

  profileSpec = {
    sample: {
      name: "پرسشنامه خودکارآمدی اخلاقی",
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
    this._init(dataset, options, config);
  }

  _calcContext() {
    const [raw, percent] = this.dataset.score;

    // Brief: never show 0 or an empty bar for a result that was not produced.
    // Risloo scores only complete sheets (raw ≥ 13), so a missing mark means no
    // result: nothing is drawn, not even the name or the track.
    const hasScore = raw.mark != null && percent.mark != null;

    // The stored percent is a 3-decimal fraction. The bar is drawn from it; the
    // page shows it × 100 rounded to a whole number with halves up, in integer
    // arithmetic so 0.385 reads 39, not 38 (as CAARS93 / SRQ93).
    const p = Math.min(Math.max(Number(percent.mark ?? 0), 0), 1);
    const thousandths = Math.round(p * 1000);
    const pct = Math.floor((thousandths + 5) / 10);

    return [
      {
        hasScore,
        bar: BAR,
        baseline: BASELINE,
        title: raw.label.title,
        mark: Number(raw.mark ?? 0),
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

module.exports = FMPQ93;
