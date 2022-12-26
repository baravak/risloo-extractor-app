const { Profile, FS } = require("../Profile");

class _16PF extends Profile {
  // Number of pages
  static pages = 1;

  // Labels of the sample
  labels = {
    L1: { eng: "a", fr: "A", right: "مردم‌گریزی", left: "مردم‌آمیزی" },
    L2: { eng: "b", fr: "B", right: "استدلال عینی", left: "استدلال انتزاعی" },
    L3: { eng: "c", fr: "C", right: "ناپایداری هیجانی", left: "پایداری هیجانی" },
    L4: { eng: "e", fr: "E", right: "سلطه‌پذیری", left: "سلطه‌گری" },
    L5: { eng: "f", fr: "F", right: "دل‌مردگی", left: "سرزندگی" },
    L6: { eng: "g", fr: "G", right: "مصلحت‌گرا", left: "باوجدان" },
    L7: { eng: "h", fr: "H", right: "ترسو", left: "جسور" },
    L8: { eng: "i", fr: "I", right: "یکدنده", left: "حساس" },
    L9: { eng: "l", fr: "L", right: "زودباور", left: "شکاک" },
    L10: { eng: "m", fr: "M", right: "عمل‌گرا", left: "کولی‌باز" },
    L11: { eng: "n", fr: "N", right: "بی‌ظرافت", left: "ظرافت" },
    L12: { eng: "o", fr: "O", right: "اطمینان به خود", left: "مستعد احساس گناه" },
    L13: { eng: "q1", fr: "Q1", right: "باز بودن نسبت به تغییر", left: "بنیادگرا" },
    L14: { eng: "q2", fr: "Q2", right: "متکی بر خود", left: "مسلط به دیگران" },
    L15: { eng: "q3", fr: "Q3", right: "اختلال‌مدار", left: "کمال‌گرا" },
    L16: { eng: "q4", fr: "Q4", right: "آرام", left: "اضطراب" },
    L17: { eng: "extraversion", fr: "برون‌گرایی" },
    L18: { eng: "anxiety", fr: "اضطراب" },
    L19: { eng: "flexibility", fr: "یک‌دندگی" },
    L20: { eng: "independence", fr: "استقلال" },
    L21: { eng: "selfcontrol", fr: "کنترل بالا" },
    L22: { eng: "adjustment", fr: "سازگاری" },
    L23: { eng: "leadership", fr: "قدرت رهبری" },
    L24: { eng: "creativity", fr: "خلاقیت" },
    L25: { eng: "status", fr: "وضعیت" },
  };

  profileSpec = {
    /* "sample" determines some important info about the sample and profile */
    /* Default prerequisites: 1. gender, 2. age, 3. education */
    /* "prerequisites" is synonym to "fields" in our program */
    sample: {
      name: "پرسشنامه شخصیت کتل" /* Name of the sample */,
      multiProfile: false /* Whether the sample has multiple profiles or not */,
      questions: false /* Determines whether to get questions from inital dataset or not */,
      defaultFields: true /* Determines whether to have default prerequisites in the profile or not */,
      fields: ["marital_status"] /* In case you want to get some additional fields and show in the profile */,
    },
    /* "profile" determines the dimensions of the drawn profile (to be used in svg tag viewbox) */
    /* calculating its dimensions carefully is of great importance */
    profile: {
      get dimensions() {
        return {
          width: 610 + 2 * this.padding.x,
          height: 682 + 2 * this.padding.y,
        };
      },
      padding: {
        x: 0,
        y: 16.8,
      },
    },
    items: {
      minValue: 1,
      maxValue: 10,
      offsetY: 33.8,
      widthCoeff: 16.2,
      fillAndOpacity: {
        1: { fill: "#1D4ED8", opacity: 1 },
        2: { fill: "#1D4ED8", opacity: 0.9 },
        3: { fill: "#1D4ED8", opacity: 0.8 },
        4: { fill: "#1D4ED8", opacity: 0.7 },
        5: { fill: "#9CA3AF", opacity: 1 },
        6: { fill: "#9CA3AF", opacity: 1 },
        7: { fill: "#0E7490", opacity: 0.7 },
        8: { fill: "#0E7490", opacity: 0.8 },
        9: { fill: "#0E7490", opacity: 0.9 },
        10: { fill: "#0E7490", opacity: 1 },
      },
      label: {
        offsetX: 16.2,
      },
    },
    gaugeItems: {
      maxValues: {
        [this.labels.L17.eng]: 12.3,
        [this.labels.L18.eng]: 8.9,
        [this.labels.L19.eng]: { مرد: 7.2, زن: 8.6 },
        [this.labels.L20.eng]: { مرد: 13.2, زن: 12.7 },
        [this.labels.L21.eng]: 10.9,
        [this.labels.L22.eng]: 14.3,
        [this.labels.L23.eng]: 13.2,
        [this.labels.L24.eng]: 16.8,
      },
      offsetX: 83.25,
      circle: {
        R: 29.7,
        r: 20,
        brs: {
          tl: 0,
          bl: 0,
          tr: 0,
          br: 0,
        },
        angles: {
          start: FS.toRadians(-90),
          end: FS.toRadians(269.9),
        },
        direction: false /* Clockwise direction for the items gauge element */,
        get totalAngle() {
          return this.direction
            ? 2 * Math.PI - (this.angles.end - this.angles.start)
            : this.angles.end - this.angles.start;
        },
      },
    },
    /* "labels" part which has to be provided for each profile */
    labels: Object.values(this.labels),
  };

  constructor(dataset, options, config = {}) {
    super();
    this._init(dataset, options, config);
  }

  _calcContext() {
    const {
      spec: { parameters: spec },
      dataset,
    } = this;

    const { items: itemsSpec, gaugeItems: gaugeItemsSpec } = spec;

    const status = dataset.score.pop().mark;

    const genderValue = dataset.info.fields.find((f) => f["eng"] === "gender").value;

    const items = dataset.score.slice(0, 16).map((data) => ({
      label: data.label,
      mark: data.mark,
      offset: (data.mark - 1) * 16.2,
      ...itemsSpec.fillAndOpacity[data.mark],
    }));

    const gaugeItems = dataset.score.slice(16).map((data) => {
      let maxValue = gaugeItemsSpec.maxValues[data.label.eng];
      maxValue = typeof maxValue === "object" ? maxValue[genderValue] : maxValue;

      return {
        label: data.label,
        mark: data.mark,
        zeta: (data.mark / maxValue) * gaugeItemsSpec.circle.totalAngle + gaugeItemsSpec.circle.angles.start,
      };
    });

    return [{ items, status, gaugeItems }];
  }
}

module.exports = _16PF;
