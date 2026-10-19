const { Profile } = require("../Profile");

// ---------------------------------------------------------------------------
// No Figma design: agent design from the approved brief
// (docs/profiles/PSOC_profile_brief_fa.md), in the visual language of JSS93
// (BAR-01…BAR-12), as CDRISC93 with two rows. Chart 700 × 134. Only the values
// the controller has to compute with live here; the static geometry is in the
// template.
// ---------------------------------------------------------------------------
const ROW = { top: 54, pitch: 40 }; // first bar row, row-to-row pitch (JSS93)
const BAR = { x: 229, coefficient: 4, gap: 4, outsideGap: 6 }; // 100 % = 400 px
const BASELINE = 12.06; // 13 px text baseline, measured from the row top (JSS93)
// The percentage moves outside the bar below 10 %, where "٪ NN" plus the 4 px
// tip gap would no longer fit (agent rule; the brief leaves placement open).
// Neither factor can score below 17 %, so in practice it always sits inside.
const INSIDE_MIN_PCT = 10;

class PSOC93 extends Profile {
  static pages = 1;

  // PSOC93 — پرسشنامه صلاحیت والدینی. Two factors, raw sums of 1–6 answers
  // (efficacy items reversed); the test has no total score, so none is drawn.
  // Names, order and maxima come from the approved brief; keys from
  // scoring/PSOC93.py. `percent` is the share of the factor's maximum as a
  // 2-decimal fraction; it drives both the bar length and the "٪ NN" readout so
  // the two never disagree.
  labels = {
    L1_1: { eng: "satisfaction_raw", title: "رضایت", max: 54 },
    L1_2: { eng: "satisfaction_percent" },

    L2_1: { eng: "efficacy_raw", title: "کارآمدی", max: 42 },
    L2_2: { eng: "efficacy_percent" },
  };

  profileSpec = {
    sample: {
      name: "پرسشنامه صلاحیت والدینی گیباد والستون و وندرسمن",
      multiProfile: false,
      questions: false,
      defaultFields: true,
      fields: [],
    },
    profile: {
      get dimensions() {
        return {
          width: 700 + 2 * this.padding.x, // Chart 700 wide → 903
          height: 134 + 2 * this.padding.y, // Chart 134 tall → 714
        };
      },
      // Chart centred on the 943 × 754 design page, minus the 20 px the layout
      // already owns on every side, so the page resolves to 903 × 714.
      padding: {
        x: 101.5, // (943 − 700) / 2 − 20
        y: 290, // (754 − 134) / 2 − 20
      },
    },
    labels: Object.values(this.labels),
  };

  constructor(dataset, options, config = {}) {
    super();
    this._init(dataset, options, config);
  }

  _calcContext() {
    const s = this.dataset.score; // [raw, percent] × 2 factors

    const items = [];
    for (let i = 0; i < 2; i++) {
      const raw = s[2 * i];
      const mark = raw.mark ?? 0;
      const { max, title } = raw.label;
      const top = ROW.top + i * ROW.pitch;
      // Brief: percent of the factor's own maximum, rounded to the nearest whole
      // number with halves up; the bar is drawn from the rounded value so its tip
      // always matches the printed number.
      const pct = Math.round((s[2 * i + 1].mark ?? 0) * 100);
      const width = BAR.coefficient * pct;
      const inside = pct >= INSIDE_MIN_PCT;
      const tip = BAR.x + width;

      items.push({
        title,
        mark,
        max,
        pct,
        width,
        top,
        inside,
        labelX: inside ? tip - BAR.gap : tip + BAR.outsideGap,
        baseline: top + BASELINE,
      });
    }

    return [{ items }];
  }
}

module.exports = PSOC93;
