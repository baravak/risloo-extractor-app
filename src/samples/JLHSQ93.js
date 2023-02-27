const { Profile, FS } = require("../Profile");

class JLHSQ93 extends Profile {
  // Number of pages
  static pages = 1;

  // Labels of the sample
  labels = {
    L1: { eng: "raw", fr: "نمره خام", max:240},
    L2: { eng: "nutrition", fr: "تغذیه" , max:70},
    L3: { eng: "sleep", fr: "خواب" , max:62},
    L4: { eng: "sport", fr: "ورزش" , max:16},
    L5: { eng: "awareness", fr: "هشیاری" , max:22},
    L6: { eng: "conflict_stress", fr: "تعارض/ استرس" , max:16},
    L7: { eng: "affection_management", fr: "مدیریت عاطفی" , max:16},
    L8: { eng: "security", fr: "امنیت" , max:14},
    L9: { eng: "disease_prevention", fr: "پیشگیری از بیماری" , max:10},
    L10: { eng: "god_relation", fr: "رابطه با خدا" , max:14},

  };

  profileSpec = {
    /* "sample" determines some important info about the sample and profile */
    /* Default prerequisites: 1. gender, 2. age, 3. education */
    /* "prerequisites" is synonym to "fields" in our program */
    sample: {
      name: "پرسشنامه بررسی سبک زندگی و سلامت"      /* Name of the sample */,
      multiProfile: false /* Whether the sample has multiple profiles or not */,
      questions: false /* Determines whether to get questions from inital dataset or not */,
      defaultFields: true /* Determines whether to have default prerequisites in the profile or not */,
      fields: [] /* In case you want to get some additional fields and show in the profile */,
    },
    /* "profile" determines the dimensions of the drawn profile (to be used in svg tag viewbox) */
    /* calculating its dimensions carefully is of great importance */
    profile: {
      get dimensions() {
        return {
          width: 702 + 2 * this.padding.x,
          height: 518 + 2 * this.padding.y,
        };
      },
      padding: {
        x: 100.5,
        y: 58,
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
    const { dataset } = this
    const raw = dataset.score[0]
    const factors = dataset.score.slice(1)
    return [{  raw,  factors}];
  }
}

module.exports = JLHSQ93;
