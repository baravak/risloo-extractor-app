const { Profile } = require("../Profile");
const gauge = require("../helpers/gauge");

class AAI93 extends Profile {
  // Number of pages
  static pages = 1;

  // Labels of the sample
  labels = {
    L1_1: {eng: 'secure_raw', fa: 'دلبستگی ایمن', primary: '#65A30D', secondary: '#A3E635', max: 25},
    L1_2: {eng: 'secure_percentage'},
    L2_1: {eng: 'ambivalence_raw', fa: 'دلبستگی دوسوگرا', primary: '#EA580C', secondary: '#FB923C', max: 25},
    L2_2: {eng: 'ambivalence_percentage'},
    L3_1: {eng: 'avoidant_raw', fa: 'دلبستگی اجتنابی', primary: '#E11D48', secondary: '#FB7185', max: 25},
    L3_2: {eng: 'avoidant_percentage'},
  };

  profileSpec = {
    /* "sample" determines some important info about the sample and profile */
    /* Default prerequisites: 1. gender, 2. age, 3. education */
    /* "prerequisites" is synonym to "fields" in our program */
    sample: {
      name: "پرسشنامه سبک‌های دلبستگی بزرگسالان هازن و شیور" /* Name of the sample */,
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
          width: 599 + 2 * this.padding.x,
          height: 179 + 2 * this.padding.y,
        }
      },
      padding: {
        x: 152,
        y: 267.5,
      },
    },
    /* "raw" is the general term used for total data element in the profile */
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

    const scores = dataset.score.filter(score => score.label.eng.includes('_raw')).map((score, index) => ({
        ...gauge(score),
        fill: `url(#${score.label.eng}_gradient)`,
        percentage: Math.round(dataset.score[(index * 2) + 1].mark * 100),
    }))
    return [{ scores }];
  }
}
module.exports = AAI93;
