const { Profile } = require("../Profile");

class RSI93 extends Profile {
  static pages = 1;

  // RSI93 — "تصور از خدا" (خسروی). Chart has two halves:
  //   • Left  : two mirrored donut-ring gauges (pink = negative image, green = positive image).
  //   • Right : two horizontal bars (god_in_life, god_cares) — the two sub-factors whose
  //             sum is the positive-image score (per the designer).
  // Maxes = items × 5 (scoring/RSI93.py → round(raw / (count·5), 2)):
  //   negative_image 6→30, positive_image 21→105, god_in_life 11→55, god_cares 10→50.
  // Each factor exposes _raw + _percentage; we read raw for the "X از Y" fraction and the
  // 0–1 percentage for the fill sweep + the "٪ NN" label (designer: "محاسبه با درصد").
  labels = {
    L1_1: { eng: "negative_image_raw", max: 30 },
    L1_2: { eng: "negative_image_percentage" },

    L2_1: { eng: "positive_image_raw", max: 105 },
    L2_2: { eng: "positive_image_percentage" },

    L3_1: { eng: "god_in_life_raw", max: 55, title: "حضور خدا در زندگی" },
    L3_2: { eng: "god_in_life_percentage" },

    L4_1: { eng: "god_cares_raw", max: 50, title: "مراقبت خداوند" },
    L4_2: { eng: "god_cares_percentage" },
  };

  profileSpec = {
    sample: {
      name: "پرسشنامه تصور از خدا (خسروی)",
      multiProfile: false,
      questions: false,
      defaultFields: true,
      fields: [],
    },
    profile: {
      get dimensions() {
        return {
          width: 740 + 2 * this.padding.x, // Chart layer 740 wide  → 943 page
          height: 318 + 2 * this.padding.y, // Chart layer 318 tall  → 754 page
        };
      },
      padding: {
        x: 101.5, // (943 − 740) / 2
        y: 218, //   (754 − 318) / 2
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
    const s = dataset.score;

    const neg = packItem(s[0], s[1]); // negative image → left ring (pink)
    const pos = packItem(s[2], s[3]); // positive image → right ring (green)

    // Ring fill sweep. Both rings: 0 % at the bottom base (90°), 100 % at the top.
    //   • Left ring  fills clockwise up the LEFT  (increasing θ): zeta = π/2 + p·π (direction false).
    //   • Right ring fills counter-cw up the RIGHT (decreasing θ): zeta = π/2 − p·π (direction true).
    neg.zeta = Math.PI / 2 + neg.p * Math.PI;
    pos.zeta = Math.PI / 2 - pos.p * Math.PI;

    const bars = [
      packItem(s[4], s[5]), // god_in_life
      packItem(s[6], s[7]), // god_cares
    ];

    return [{ neg, pos, bars }];
  }
}

// Merge a factor's _raw and _percentage score entries into one drawing item.
function packItem(raw, percentage) {
  return {
    label: raw.label,
    max: raw.label.max,
    mark: raw.mark ?? 0,
    percentage: Math.round((percentage.mark ?? 0) * 100),
    p: percentage.mark ?? 0,
  };
}

module.exports = RSI93;
