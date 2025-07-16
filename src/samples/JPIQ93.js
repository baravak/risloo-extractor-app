const gauge = require("../helpers/gauge");
const { Profile } = require("../Profile");

class JPIQ93 extends Profile {
  // Number of pages
  static pages = 1;

  // Labels of the sample
  labels = {
    L1_1: { eng: "penetrability_raw", max:56},
    L2_1: { eng: "penetrability_percentage"},
  };

  profileSpec = {
    /* "sample" determines some important info about the sample and profile */
    /* Default prerequisites: 1. gender, 2. age, 3. education */
    /* "prerequisites" is synonym to "fields" in our program */
    sample: {
      name: "پرسشنامه انعطاف-نفوذناپذیری" /* Name of the sample */,
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
          width: 250 + 2 * this.padding.x,
          height: 187 + 2 * this.padding.y,
        };
      },
      padding: {
        x: 326,
        y: 264,
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
    const _raw = dataset.score[0]
    _raw.mark = _raw.mark ?? 0
    const raw = {
        ...gauge(_raw, 180, 360),
        percentage: Math.round((dataset.score[1].mark ?? 0) * 100),
    }
    return [{ raw }];
  }
}

module.exports = JPIQ93;
