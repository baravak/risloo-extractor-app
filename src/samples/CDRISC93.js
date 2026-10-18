const { Profile } = require("../Profile");

// ---------------------------------------------------------------------------
// No Figma design: agent design from the approved brief
// (docs/profiles/CD-RISC_profile_brief_fa.md), in the visual language of JSS93
// (BAR-01…BAR-12). Chart 700 × 254. Only the values the controller has to
// compute with live here; the static geometry is in the template.
// ---------------------------------------------------------------------------
const ROW = { top: 54, pitch: 40 }; // first bar row, row-to-row pitch (JSS93)
const BAR = { x: 229, coefficient: 4, gap: 4, outsideGap: 6 }; // 100 % = 400 px
const BASELINE = 12.06; // 13 px text baseline, measured from the row top (JSS93)
// The percentage moves outside the bar below 10 %, where "٪ NN" plus the 4 px
// tip gap would no longer fit (agent rule; the brief leaves placement open).
const INSIDE_MIN_PCT = 10;

class CDRISC93 extends Profile {
  static pages = 1;

  // CDRISC93 — پرسشنامه تاب‌آوری کونور و دیویدسون. Five factors, raw sums of
  // 0–4 answers; the test has no total score, so none is drawn. Names, order and
  // maxima come from the approved brief; keys from scoring/CDRISC93.py.
  // `percent` is the share of the factor's maximum as a 3-decimal fraction; it
  // drives both the bar length and the "٪ NN" readout so the two never disagree.
  labels = {
    L1_1: { eng: "personal_competence_raw", title: "تصور از شایستگی فردی", max: 32 },
    L1_2: { eng: "personal_competence_percent" },

    L2_1: {
      eng: "trust_in_ones_instincts_and_tolerance_of_negative_affect_raw",
      title: "اعتماد به غرایز فردی و تحمل عاطفه منفی",
      max: 28,
    },
    L2_2: { eng: "trust_in_ones_instincts_and_tolerance_of_negative_affect_percent" },

    L3_1: {
      eng: "positive_acceptance_of_change_and_secure_relationship_raw",
      title: "پذیرش مثبت تغییر و روابط ایمن",
      max: 20,
    },
    L3_2: { eng: "positive_acceptance_of_change_and_secure_relationship_percent" },

    L4_1: { eng: "control_raw", title: "کنترل", max: 12 },
    L4_2: { eng: "control_percent" },

    L5_1: { eng: "spiritual_influences_raw", title: "تأثیرات معنوی", max: 8 },
    L5_2: { eng: "spiritual_influences_percent" },
  };

  profileSpec = {
    sample: {
      name: "پرسشنامه تاب‌آوری کونور و دیویدسون",
      multiProfile: false,
      questions: false,
      defaultFields: true,
      fields: [],
    },
    profile: {
      get dimensions() {
        return {
          width: 700 + 2 * this.padding.x, // Chart 700 wide → 903
          height: 254 + 2 * this.padding.y, // Chart 254 tall → 714
        };
      },
      // Chart centred on the 943 × 754 design page, minus the 20 px the layout
      // already owns on every side, so the page resolves to 903 × 714.
      padding: {
        x: 101.5, // (943 − 700) / 2 − 20
        y: 230, // (754 − 254) / 2 − 20
      },
    },
    labels: Object.values(this.labels),
  };

  constructor(dataset, options, config = {}) {
    super();
    this._init(dataset, options, config);
  }

  _calcContext() {
    const s = this.dataset.score; // [raw, percent] × 5 factors

    const items = [];
    for (let i = 0; i < 5; i++) {
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

module.exports = CDRISC93;
