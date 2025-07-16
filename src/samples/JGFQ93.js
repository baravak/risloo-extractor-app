const gauge = require("../helpers/gauge");
const { Profile } = require("../Profile");

class JGFQ93 extends Profile {
  // Number of pages
  static pages = 1;

  // Labels of the sample
  labels = {
    L1_1: { eng: "forgivness_raw", max:52, title: 'رهاسازی', color: '#4338CA', secondary: '#818CF8'},
    L1_2: { eng: "forgivness_percentage"},
    L1_3: { eng: "forgivness_report"},

    L2_1: { eng: "gratitude_raw", max:60, title: 'آشکارسازی', color: "#7E22CE", secondary: '#C084FC'},
    L2_2: { eng: "gratitude_percentage"},
    L2_3: { eng: "gratitude_report"},

    L3_1: { eng: "total_raw", max:112},
    L3_2: { eng: "total_percentage"},
  };

  profileSpec = {
    /* "sample" determines some important info about the sample and profile */
    /* Default prerequisites: 1. gender, 2. age, 3. education */
    /* "prerequisites" is synonym to "fields" in our program */
    sample: {
      name: "پرسشنامه رها - آشکارسازی" /* Name of the sample */,
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
          width: 836 + 2 * this.padding.x,
          height: 427 + 2 * this.padding.y,
        };
      },
      padding: {
        x: 34,
        y: 144,
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
    const forgivness = gauge(packItem(...dataset.score.slice(0, 3)), 90, 234);
    const gratitude = gauge(packItem(...dataset.score.slice(3, 6)), 90, 234);
    const total = packItem(...dataset.score.slice(6, 8));
    total.p = dataset.score[7].mark ?? 0
    return [{ forgivness, gratitude, total }];
  }
}

function packItem(raw, percentage, report){
  return {
    ...raw,
    label: {
      ...raw.label,
      eng: raw.label.eng.replace('_raw', '')
    },
    mark: raw.mark ?? 0,
    percentage: Math.round((percentage.mark ?? 0)  * 100),
    report: report?.mark
  }
}

module.exports = JGFQ93;
