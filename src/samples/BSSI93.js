const { Profile, FS } = require("../Profile");

class BSSI93 extends Profile {
  static pages = 1;

  // Bar height / percentage comes STRAIGHT from the scoring's *_percentage field
  // (single source of truth). *_raw + max only drive the "نمره خام" fraction row.
  // max = items × 2 (desire 5→10, preparation 5→10, intent 7→14, total 19→38).
  labels = {
    L0_1: { eng: "total_raw", max: 38 },
    L0_2: { eng: "total_percentage" },

    L1_1: { eng: "desire_raw", max: 10 },
    L1_2: { eng: "desire_percentage" },

    L2_1: { eng: "preparation_raw", max: 10 },
    L2_2: { eng: "preparation_percentage" },

    L3_1: { eng: "intent_raw", max: 14 },
    L3_2: { eng: "intent_percentage" },
  };

  profileSpec = {
    sample: {
      name: "پرسشنامه افکار خودکشی بک",
      multiProfile: false,
      questions: false,
      defaultFields: true,
      fields: [],
    },
    profile: {
      get dimensions() {
        return {
          width: 412 + 2 * this.padding.x,
          height: 607 + 2 * this.padding.y,
        };
      },
      padding: {
        x: 265.5,
        y: 73.5,
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
    const s = dataset.score; // [total_raw, total_%, desire_raw, desire_%, prep_raw, prep_%, intent_raw, intent_%]

    // --- Total (ring gauge) ---
    const total = packItem(s[0], s[1]);
    const start = FS.toRadians(-90); // 0% at top (12 o'clock)
    const end = FS.toRadians(180); //   100% at left (9 o'clock)
    total.zeta = total.p * (end - start) + start; // clockwise 270° sweep

    // --- Factors (visual order, left → right) ---
    // The scientific score keys stay unchanged. The design places the intent
    // score in the middle slot and the preparation score in the right slot.
    const factorSpecs = [
      {
        raw: s[2],
        percentage: s[3],
        cx: 120,
        trackLeft: 106,
        scoreX: 120.5,
        lines: [{ text: "تمایل به مرگ", x: 120, y: 351.5 }],
      },
      {
        raw: s[6],
        percentage: s[7],
        cx: 220,
        trackLeft: 206,
        scoreX: 221.5,
        lines: [
          { text: "آمادگی برای", x: 219.5, y: 351.5 },
          { text: "خودکشی", x: 219, y: 368 },
        ],
      },
      {
        raw: s[4],
        percentage: s[5],
        cx: 320,
        trackLeft: 306,
        scoreX: 322,
        lines: [
          { text: "تمایل به", x: 322, y: 352.5 },
          { text: "خودکشی واقعی", x: 322, y: 368 },
        ],
      },
    ];
    const factors = factorSpecs.map(({ raw, percentage, ...geometry }) => ({
      ...packItem(raw, percentage),
      ...geometry,
    }));

    return [{ total, factors }];
  }
}

// raw:        { label: { max }, mark }   → the "X از Y" fraction
// percentage: { label, mark: 0..1 }      → the bar height + % label
function packItem(raw, percentage) {
  const mark = raw.mark ?? 0;
  const max = raw.label.max;
  // Clamp to [0,1] so a malformed/out-of-range percentage can never overflow
  // the track or the ring gauge — the chart degrades gracefully.
  const p = Math.min(Math.max(percentage.mark ?? 0, 0), 1);
  return {
    mark,
    max,
    p,
    pct: Math.round(p * 100),
    barH: FS.roundTo2(300 * p), // 300px full track
    topY: FS.roundTo2(327 - 300 * p), // bars grow up from the y=327 baseline
  };
}

module.exports = BSSI93;
