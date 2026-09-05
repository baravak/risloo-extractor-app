const { Profile } = require("../Profile");

// ---------------------------------------------------------------------------
// Chart geometry, measured from the Figma "Chart" layer (789 × 414). Only the
// values the controller has to compute with live here; the static geometry is
// transcribed in the template.
// ---------------------------------------------------------------------------
const ROW = { top: 54, pitch: 40 }; // first bar row, row-to-row pitch
const BAR = { x: 174, coefficient: 4, gap: 4 }; // 100 % = 400 px (designer note); label 4 px inside the tip
const BASELINE = 12.06; // 13 px text baseline, measured from the row top

// Total column: vertical bar filling bottom → up, 100 % = 350 px (designer note).
const TOTAL = { bottom: 396, coefficient: 3.5 };

class JSS93 extends Profile {
  static pages = 1;

  // JSS93 — پرسشنامه رضایت شغلی اسپکتور. Nine 4-item factors (raw 4–20) plus the
  // total (raw 36–180). `percentage` is the share of the possible maximum, the
  // definition the design uses (scoring/JSS93.py → round(raw / max, 3)); it drives
  // both the bar length and the "٪ NN" readout so the two can never disagree.
  labels = {
    L1_1: { eng: "pay_raw", title: "رضایت از پرداخت‌ها", max: 20 },
    L1_2: { eng: "pay_percentage" },

    L2_1: { eng: "operating_procedures_raw", title: "فرآیندهای اجرایی کار (شرایط کار)", max: 20 },
    L2_2: { eng: "operating_procedures_percentage" },

    L3_1: { eng: "coworkers_raw", title: "همکاران", max: 20 },
    L3_2: { eng: "coworkers_percentage" },

    L4_1: { eng: "promotion_raw", title: "ارتقای شغلی", max: 20 },
    L4_2: { eng: "promotion_percentage" },

    L5_1: { eng: "supervision_raw", title: "نظارت", max: 20 },
    L5_2: { eng: "supervision_percentage" },

    L6_1: { eng: "fringe_benefits_raw", title: "مزایای جانبی شغل", max: 20 },
    L6_2: { eng: "fringe_benefits_percentage" },

    L7_1: { eng: "contingent_rewards_raw", title: "پاداش‌های احتمالی", max: 20 },
    L7_2: { eng: "contingent_rewards_percentage" },

    L8_1: { eng: "nature_of_work_raw", title: "ماهیت شغل", max: 20 },
    L8_2: { eng: "nature_of_work_percentage" },

    L9_1: { eng: "communication_raw", title: "ارتباطات و اطلاع‌رسانی", max: 20 },
    L9_2: { eng: "communication_percentage" },

    L10_1: { eng: "total_raw", title: "نمره کل رضایت شغلی", max: 180 },
    L10_2: { eng: "total_percentage" },
  };

  profileSpec = {
    sample: {
      name: "پرسشنامه رضایت شغلی اسپکتور",
      multiProfile: false,
      questions: false,
      defaultFields: true,
      fields: [],
    },
    profile: {
      get dimensions() {
        return {
          width: 789 + 2 * this.padding.x, // Chart layer 789 wide → 903
          height: 414 + 2 * this.padding.y, // Chart layer 414 tall → 714
        };
      },
      // Padding is the Chart's inset inside the 943 × 754 design page *minus* the
      // 20 px the layout already owns on every side, so the page resolves to
      // 903 × 714 — the exact with-sidebar drawing area — and renders at scale 1
      // instead of being shrunk to fit.
      padding: {
        x: 57, // (943 − 789) / 2 − 20
        y: 150, // (754 − 414) / 2 − 20
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
    const s = dataset.score; // [raw, percentage] × 9 factors, then the total

    const items = [];
    for (let i = 0; i < 9; i++) {
      const raw = s[2 * i];
      const top = ROW.top + i * ROW.pitch;
      // The design rounds the percentage before drawing, so the tip of the bar
      // always lands exactly on the number printed inside it.
      const pct = Math.round((s[2 * i + 1].mark ?? 0) * 100);
      const width = BAR.coefficient * pct;

      items.push({
        title: raw.label.title,
        mark: raw.mark ?? 0,
        pct,
        width,
        top,
        // Designer note: the percentage never leaves the bar — this test cannot
        // score below 20 %, so there is always room for the label inside it.
        labelX: BAR.x + width - BAR.gap,
        baseline: top + BASELINE,
      });
    }

    const totalRaw = s[18];
    const totalPct = Math.round((s[19].mark ?? 0) * 100);
    const height = TOTAL.coefficient * totalPct;
    const tip = TOTAL.bottom - height;

    const total = {
      mark: totalRaw.mark ?? 0,
      max: totalRaw.label.max,
      pct: totalPct,
      height,
      tip,
      // Designer note: the readout travels with the bar, centred on its tip.
      pctBaseline: tip - 0.98,
      fractionBaseline: tip + 13.06,
    };

    return [{ items, total }];
  }
}

module.exports = JSS93;
