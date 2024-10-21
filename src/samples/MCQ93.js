const { Profile, FS } = require("../Profile");


class MCQ93 extends Profile {
  // Number of pages
  static pages = 1;

  // Labels of the sample
  labels = {
    L0: {eng: "cooperation_total", fr:"کاهش همکاری", max: 25},
    L1: {eng: "cooperation_percentage"},

    L2: {eng: "sexual_activity_total", fr:"کاهش روابط جنسی", max: 25},
    L3: {eng: "sexual_activity_percentage"},

    L4: {eng: "emotional_reactions_total", fr:"افزایش واکنش‌های هیجانی", max: 40},
    L5: {eng: "emotional_reactions_percentage"},

    L6: {eng: "child_support_total", fr:"افزایش جلب حمایت فرزندان", max: 25},
    L7: {eng: "child_support_percentage"},

    L8: {eng: "personal_relationships_total", fr:"افزایش رابطه با خویشاوندان خود", max: 30},
    L9: {eng: "personal_relationships_percentage"},

    L10: {eng: "relatives_relationships_total", fr:"کاهش رابطه با خویشاوندان همسر", max: 30},
    L11: {eng: "relatives_relationships_percentage"},

    L12: {eng: "finances_total", fr:"جدا کردن امور مالی از یکدیگر", max: 35},
    L13: {eng: "finances_percentage"},

    L14: {eng: "marital_conflict_total", fr:"نمره کل", max: 210},
    L15: {eng: "marital_conflict_percentage"},

  };

  profileSpec = {
    /* "sample" determines some important info about the sample and profile */
    /* Default prerequisites: 1. gender, 2. age, 3. education */
    /* "prerequisites" is synonym to "fields" in our program */
    sample: {
      name: "پرسشنامه تعارضات زناشويی ثنایی (MCQ)" /* Name of the sample */,
      multiProfile: false /* Whether the sample has multiple profiles or not */,
      questions: true /* Determines whether to get questions from inital dataset or not */,
      defaultFields: true /* Determines whether to have default prerequisites in the profile or not */,
      fields: [] /* In case you want to get some additional fields and show in the profile */,
    },
    /* "profile" determines the dimensions of the drawn profile (to be used in svg tag viewbox) */
    /* calculating its dimensions carefully is of great importance */
    profile: {
      get dimensions() {
        return {
          width: 786 + 2 * this.padding.x,
          height: 324 + 2 * this.padding.y,
        };
      },
      padding: {
        x: 58.5,
        y: 195,
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
        dataset,
      } = this;
    const factors = dataset.score.filter((d, i) => i % 2 === 0).map((d, i) => {
        return {
            ...d,
            percentage: Math.round(dataset.score[(i*2) + 1].mark * 100)
        }
    })
    const total = factors.splice(-1, 2)
    return [{factors, total: total[0]}];
  }
}



module.exports = MCQ93;
