const { Profile } = require("../Profile");

// ---------------------------------------------------------------------------
// No Figma design: agent design from the approved brief
// (docs/profiles/TMPS_profile_brief_fa.md), in the visual language of CDRISC93 /
// JSS93 (BAR-01…BAR-12). Chart 700 × 234. Only the values the controller has to
// compute with live here; the static geometry is in the template.
// ---------------------------------------------------------------------------
const ROW = { top: 54, pitch: 40, totalGap: 20 }; // first bar row, row pitch, extra gap before the total
const BAR = { x: 229, coefficient: 4, gap: 4, outsideGap: 6 }; // 100 % = 400 px
const BASELINE = 12.06; // 13 px text baseline, measured from the row top (JSS93)
// The percentage moves outside the bar below 10 %, where "٪ NN" plus the 4 px
// tip gap would no longer fit (agent rule; the brief leaves placement open).
// The lowest TMPS score is 20 %, so the rule never fires on valid data.
const INSIDE_MIN_PCT = 10;

class TMPS93 extends Profile {
  static pages = 1;

  // TMPS93 — مقیاس کمال‌گرایی چندبعدی تهران (فرم بلند). Three factors of ten
  // 1–5 answers and their total. Names, order and maxima come from the approved
  // brief; keys from scoring/TMPS93.py. `percent` is the share of the score's
  // maximum as a 3-decimal fraction; it drives both the bar length and the
  // "٪ NN" readout so the two never disagree.
  labels = {
    L1_1: { eng: "self_oriented_raw", title: "کمال‌گرایی خودمحور", max: 50 },
    L1_2: { eng: "self_oriented_percent" },

    L2_1: { eng: "other_oriented_raw", title: "کمال‌گرایی دیگرمحور", max: 50 },
    L2_2: { eng: "other_oriented_percent" },

    L3_1: { eng: "socially_prescribed_raw", title: "کمال‌گرایی جامعه‌محور", max: 50 },
    L3_2: { eng: "socially_prescribed_percent" },

    // The total is drawn last, set apart from the three factors by ROW.totalGap.
    L4_1: { eng: "total_raw", title: "نمره کل", max: 150 },
    L4_2: { eng: "total_percent" },
  };

  profileSpec = {
    sample: {
      name: "مقیاس کمال‌گرایی چندبعدی تهران (فرم بلند)",
      multiProfile: false,
      questions: false,
      defaultFields: true,
      fields: [],
    },
    profile: {
      get dimensions() {
        return {
          width: 700 + 2 * this.padding.x, // Chart 700 wide → 903
          height: 234 + 2 * this.padding.y, // Chart 234 tall → 714
        };
      },
      // Chart centred on the 943 × 754 design page, minus the 20 px the layout
      // already owns on every side, so the page resolves to 903 × 714.
      padding: {
        x: 101.5, // (943 − 700) / 2 − 20
        y: 240, // (754 − 234) / 2 − 20
      },
    },
    labels: Object.values(this.labels),
  };

  constructor(dataset, options, config = {}) {
    super();
    this._init(dataset, options, config);
  }

  _calcContext() {
    const s = this.dataset.score; // [raw, percent] × (3 factors + total)

    const items = [];
    for (let i = 0; i < 4; i++) {
      const raw = s[2 * i];
      const mark = raw.mark ?? 0;
      const { max, title } = raw.label;
      const top = ROW.top + i * ROW.pitch + (i === 3 ? ROW.totalGap : 0);
      // Brief: percent of the score's own maximum, rounded to the nearest whole
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

module.exports = TMPS93;
