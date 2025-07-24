const gauge = require("../helpers/gauge");
const { Profile } = require("../Profile");

class JMIB93 extends Profile {
  // Number of pages
  static pages = 1;

  // Labels of the sample
  labels = {
    L1_1: { eng: "unrealistic_expectations_raw", max: 76, title: 'توقعات نامعقول'},
    L1_2: { eng: "unrealistic_expectations_percentage"},

    L2_1: { eng: "negative_thinking_raw", max: 32, title: 'منفی‌بافی'},
    L2_2: { eng: "negative_thinking_percentage"},

    L3_1: { eng: "excessive_optimism_raw", max: 52, title: 'خوش‌بینی افراطی'},
    L3_2: { eng: "excessive_optimism_percentage"},

    L4_1: { eng: "perfectionism_raw", max: 36, title: 'کامل‌خواهی'},
    L4_2: { eng: "perfectionism_percentage"},

    L5_1: { eng: "negative_self_belief_raw", max: 20, title: 'خودباوری منفی'},
    L5_2: { eng: "negative_self_belief_percentage"},

    L6_1: { eng: "total_raw", max: 216, title: 'نمره کل'},
    L6_2: { eng: "total_percentage"},
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
          width: 706 + 2 * this.padding.x,
          height: 245 + 2 * this.padding.y,
        };
      },
      padding: {
        x: 99,
        y: 235,
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
    // dataset.score[0].mark = 7
    // dataset.score[1].mark = dataset.score[0].mark / dataset.score[0].label.max

    // dataset.score[2].mark = 32
    // dataset.score[3].mark = dataset.score[2].mark / dataset.score[2].label.max

    const factors = [
        packItem(dataset.score[0], dataset.score[1]),
        packItem(dataset.score[2], dataset.score[3]),
        packItem(dataset.score[4], dataset.score[5]),
        packItem(dataset.score[6], dataset.score[7]),
        packItem(dataset.score[8], dataset.score[9]),
    ]
    const total = packItem(dataset.score[10], dataset.score[11])
    total.transform = `translate(0, ${217 - total.p * 217})`
    return [{ factors, total }];
  }
}

function packItem(raw, percentage){
  return {
    ...raw,
    label: {
      ...raw.label,
      eng: raw.label.eng.replace('_raw', '')
    },
    mark: raw.mark ?? 0,
    percentage: Math.round((percentage.mark ?? 0)  * 100),
    p: percentage.mark ?? 0
  }
}

module.exports = JMIB93;
