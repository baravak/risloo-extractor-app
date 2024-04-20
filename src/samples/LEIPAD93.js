const { Profile, FS } = require("../Profile");

class LEIPAD93 extends Profile {
  // Number of pages
  static pages = 1;

  // Labels of the sample
  labels = {
    L1 : {eng: "physical_functioning", fr: "مشکل عملکرد فیزیکی", max: 15},
    L2 : {eng: "self_care", fr: "مشکل خودمراقبتی", max: 18},
    L3 : {eng: "depression_anxiety", fr: "مشکل افسردگی و اضطراب", max: 12},
    L4 : {eng: "cognitive_functioning", fr: "مشکل عملکرد شناختی", max: 15},
    L5 : {eng: "social_functioning", fr: "مشکل عملکرد اجتماعی", max: 9},
    L6 : {eng: "sexual_functioning", fr: "مشکل عملکرد جنسی", max: 6},
    L7 : {eng: "life_satisfaction", fr: "مشکل رضایت از زندگی", max: 18},
    L8 : {eng: "total_quality_of_life", fr: "نمره کل مشکل کیفیت زندگی", max: 93},
    L9 : {eng: "the_perceived_personality_disorder", fr: "اختلال شخصیت ادراک شده", max: 6},
    L10 : {eng: "the_anger", fr: "مشکل خشم", max: 4},
    L11 : {eng: "the_social_desirability", fr: "مشکل مطلوبیت اجتماعی", max: 3},
    L12 : {eng: "self_esteem", fr: "مشکل اعتماد به نفس", max: 3},
    L13 : {eng: "trust_in_god", fr: "مشکل اعتماد به خدا", max: 2},
  };

  profileSpec = {
    /* "sample" determines some important info about the sample and profile */
    /* Default prerequisites: 1. gender, 2. age, 3. education */
    /* "prerequisites" is synonym to "fields" in our program */
    sample: {
      name: "پرسشنامه کیفیت زندگی سالمندان" /* Name of the sample */,
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
          width: 737 + 2 * this.padding.x,
          height: 532 + 2 * this.padding.y,
        };
      },
      padding: {
        x: 83,
        y: 91,
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

    const g1 = dataset.score.slice(0, 7).map(i => ({...i, mark: i.mark ?? 0, markP: i.mark ? Math.round((i.mark/i.label.max) * 100) : 0}))
    const total = dataset.score[7]
    total.mark = total.mark ?? 0
    total.markP = total.mark ? Math.round((total.mark/total.label.max) * 100) : 0
    const g2 = dataset.score.slice(8, 13).map(i => ({...i, mark: i.mark ?? 0, markP: i.mark ? Math.round((i.mark/i.label.max) * 100) : 0}))
    return [{ g1, g2, total }];
  }
}

module.exports = LEIPAD93;
