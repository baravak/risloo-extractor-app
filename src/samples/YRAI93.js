const { Profile } = require("../Profile");

// ---------------------------------------------------------------------------
// No Figma design: agent design from the approved brief
// (docs/profiles/YRAI_profile_brief_fa.md), in the bar language of SWBS93,
// stacked like MWAS93 / CAQ93. Chart 677 × 536.
//
// Fourteen equal-length horizontal bars, one per component, in the order of the
// brief's table. Every bar runs from 0 to 100 and is filled by its own stored
// percent, so the lowest complete answer sheet (one point per item) fills a
// sixth of it. The component name sits on the left of its bar; beside the bar's
// end, two fixed columns: the percent next to the bar and "raw از max" after
// it. One fill colour and one track colour for every bar, exactly as the brief
// gives them; no total, levels, zones, boundary lines, axis numbers,
// score-dependent colour, sorting or highlighting.
// ---------------------------------------------------------------------------
const W = 677; // longest name (176 px) + 8 + bar 400 + 10 + percent column 43 + widest raw, "30 از 30" (39.4 px)
const H = 536;
const TITLE_RIGHT = 176; // right edge of every component name (RTL "start"); the longest (175.9 px) starts at x ≈ 0
const BAR = { x: 184, length: 400, height: 16 }; // 8 px after the names (SWBS93); 100 % = 400 px, ends at 584
const ROW = { top: 0, pitch: 40 }; // 14 rows: 13 × 40 + 16 = 536
const BASELINE = 12.06; // 13 px text baseline, measured from the row top (MWAS93 / CAQ93)
const PCT_X = 594; // left edge of the percent column: 10 px after the track end (SWBS93)
const RAW_X = 637; // left edge of the raw column: 43 px after PCT_X as in SWBS93; the widest percent, "٪ 100", is 29.6 px, leaving 13.4 px
// Brief palette (سطح‌بندی و رنگ): filled part, unfilled part. The same for all
// fourteen components; never changes with the score.
const COLOR = { fill: "#3E6E7E", track: "#E3ECEF" };

class YRAI93 extends Profile {
  static pages = 1;

  // YRAI93 — آزمون اجتناب یانگ و ریگ. 40 items scored 1–6 as chosen, summed
  // into fourteen components (items 9, 13 and 40 count twice); no total. Names,
  // order and maxima come from the approved brief; keys from scoring/YRAI93.py:
  // `<factor>_raw`, and `<factor>_percent` = raw ÷ the component's maximum as a
  // 3-decimal fraction. The percent drives both the bar length and the "٪ NN"
  // readout so the two never disagree.
  labels = {
    L1_1: { eng: "intentionally_not_thinking_about_upsetting_things_raw", title: "فکر نکردن عمدی به مسائل ناراحت‌کننده", max: 18 },
    L1_2: { eng: "intentionally_not_thinking_about_upsetting_things_percent" },

    L2_1: { eng: "substance_abuse_raw", title: "پناه بردن به مشروب، دارو و سیگار", max: 18 },
    L2_2: { eng: "substance_abuse_percent" },

    L3_1: { eng: "denial_of_unhappiness_raw", title: "انکار ناشادی", max: 24 },
    L3_2: { eng: "denial_of_unhappiness_percent" },

    L4_1: { eng: "excessive_rationality_and_control_raw", title: "عقل‌گرایی و مهار افراطی", max: 30 },
    L4_2: { eng: "excessive_rationality_and_control_percent" },

    L5_1: { eng: "suppression_of_anger_raw", title: "فرونشاندن خشم", max: 18 },
    L5_2: { eng: "suppression_of_anger_percent" },

    L6_1: { eng: "psychosomatic_symptoms_raw", title: "نشانه‌های جسمی", max: 24 },
    L6_2: { eng: "psychosomatic_symptoms_percent" },

    L7_1: { eng: "denial_of_memories_raw", title: "انکار خاطرات", max: 18 },
    L7_2: { eng: "denial_of_memories_percent" },

    L8_1: { eng: "withdrawal_from_people_raw", title: "کناره‌گیری از مردم", max: 18 },
    L8_2: { eng: "withdrawal_from_people_percent" },

    L9_1: { eng: "avoidance_through_sleep_and_lack_of_energy_raw", title: "اجتناب با خواب و بی‌حالی", max: 12 },
    L9_2: { eng: "avoidance_through_sleep_and_lack_of_energy_percent" },

    L10_1: { eng: "distraction_through_activity_raw", title: "سرگرم کردن خود با فعالیت", max: 18 },
    L10_2: { eng: "distraction_through_activity_percent" },

    L11_1: { eng: "self_soothing_like_eating_shopping_etc_raw", title: "آرام کردن خود با خوردن و خریدن", max: 18 },
    L11_2: { eng: "self_soothing_like_eating_shopping_etc_percent" },

    L12_1: { eng: "passive_blocking_of_upsetting_emotions_raw", title: "بستن راه احساس‌های ناخوشایند", max: 24 },
    L12_2: { eng: "passive_blocking_of_upsetting_emotions_percent" },

    L13_1: { eng: "passive_distraction_fantasy_daydreaming_television_raw", title: "سرگرمی با خیال‌پردازی و تلویزیون", max: 12 },
    L13_2: { eng: "passive_distraction_fantasy_daydreaming_television_percent" },

    L14_1: { eng: "avoidance_of_upsetting_situations_raw", title: "اجتناب از موقعیت‌های ناراحت‌کننده", max: 6 },
    L14_2: { eng: "avoidance_of_upsetting_situations_percent" },
  };

  profileSpec = {
    sample: {
      name: "آزمون اجتناب یانگ و ریگ (YRAI)",
      multiProfile: false,
      questions: false,
      defaultFields: true,
      fields: [],
    },
    profile: {
      get dimensions() {
        return {
          width: W + 2 * this.padding.x, // Chart 677 wide → 903
          height: H + 2 * this.padding.y, // Chart 536 tall → 714
        };
      },
      // Chart centred on the 943 × 754 design page, minus the 20 px the layout
      // already owns on every side, so the page resolves to 903 × 714.
      padding: {
        x: 113, // (943 − 677) / 2 − 20
        y: 89, // (754 − 536) / 2 − 20
      },
    },
    labels: Object.values(this.labels),
  };

  constructor(dataset, options, config = {}) {
    super();
    // `_extractData` turns a stored 0 into undefined (`score[key] || …`). Keep
    // the scoring output itself so a stored 0 is read as a real score (empty
    // bar, «0 از N», «٪ 0»), not as a missing one (SWBS93 / CAQ93).
    this.storedScore = (dataset && dataset.score) || {};
    this._init(dataset, options, config);
  }

  _stored(key) {
    const v = this.storedScore[key];
    if (v === undefined || v === null || v === "") return null;
    const n = Number(v);
    return Number.isFinite(n) ? n : null;
  }

  _calcContext() {
    const rows = Object.values(this.labels).filter((l) => l.title);

    const items = rows.map((label, i) => {
      const top = ROW.top + i * ROW.pitch;
      const baseline = top + BASELINE;
      const mark = this._stored(label.eng);
      const percent = this._stored(label.eng.replace(/_raw$/, "_percent"));

      // A raw or percent field that is absent, null or empty means the score was
      // not produced: the row keeps its name and empty track and shows no
      // number, so no 0 stands in for a missing score. Risloo scores only
      // complete sheets (raw ≥ number of items), so this does not occur on real
      // data.
      if (mark === null || percent === null) {
        return { title: label.title, top, baseline, produced: false };
      }

      // The stored percent is a 3-decimal fraction. The bar is drawn from it; the
      // page shows it × 100 rounded to a whole number with halves up, in integer
      // arithmetic so 0.375 reads 38 and 0.545 reads 55 (as SWBS93 / CAQ93).
      const p = Math.min(Math.max(percent, 0), 1);
      const thousandths = Math.round(p * 1000);
      const pct = Math.floor((thousandths + 5) / 10);

      return {
        title: label.title,
        top,
        baseline,
        produced: true,
        mark,
        max: label.max,
        pct,
        width: (BAR.length * thousandths) / 1000,
      };
    });

    return [
      {
        items,
        bar: BAR,
        titleRight: TITLE_RIGHT,
        pctX: PCT_X,
        rawX: RAW_X,
        color: COLOR,
      },
    ];
  }
}

module.exports = YRAI93;
