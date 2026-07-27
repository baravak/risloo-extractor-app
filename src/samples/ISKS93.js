const { Profile } = require("../Profile");

class ISKS93 extends Profile {
  static pages = 1;

  // Single semicircle gauge (0–100 %). `percentage` drives the fill sweep;
  // `raw` + max only feed the gray "X از Y" fraction in the centre.
  // max = 12 items × 5 = 60 (see scoring/ISKS93.py → round(raw / 60, 2)).
  labels = {
    L1: { eng: "raw", max: 60 },
    L2: { eng: "percentage" },
  };

  profileSpec = {
    sample: {
      name: "مقياس خودشناسی انسجامی",
      multiProfile: false,
      questions: false,
      defaultFields: true,
      fields: [],
    },
    profile: {
      get dimensions() {
        return {
          width: 250 + 2 * this.padding.x, // Chart layer 250 wide
          height: 187 + 2 * this.padding.y, // Chart layer 187 tall
        };
      },
      padding: {
        x: 346.5,
        y: 283.5,
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
    const s = dataset.score; // [ {label:{eng:'raw',max:60}, mark}, {label:{eng:'percentage'}, mark} ]

    const raw = s[0].mark ?? 0;
    const max = s[0].label.max; // 60
    // Clamp to [0,1] so a malformed/out-of-range percentage can never overflow the ring.
    const p = Math.min(Math.max(s[1].mark ?? 0, 0), 1);

    // Gauge: 0 % at the left base (180°), 100 % at the right base (0°), filling
    // clockwise over the top (sweep = 1, direction = false). The fill's end angle
    // sweeps from left (π) over the top to right (2π): zeta = π·(1 + p).
    const zeta = Math.PI * (1 + p);

    const total = { raw, max, p, pct: Math.round(p * 100), zeta };

    return [{ total }];
  }
}

module.exports = ISKS93;
