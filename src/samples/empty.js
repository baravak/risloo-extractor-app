const { Profile } = require("../profile");

class empty extends Profile {
  // Number of pages
  static pages = 1;

  // Labels of the sample
  labels = {};

  profileSpec = {
    /* "sample" determines some important info about the sample and profile */
    /* Default prerequisites: 1. gender, 2. age, 3. education, 4. marital_status */
    /* "prerequisites" is synonym to "fields" in our program */
    sample: {
      name: "پرسشنامه خالی" /* Name of the sample */,
      multiProfile: false /* Whether the sample has multiple profiles or not */,
      answers: false /* Determines whether to get answers from inital dataset or not */,
      defaultFields: true /* Determines whether to have default prerequisites in the profile or not */,
      fields: [] /* In case you want to get some additional fields and show in the profile */,
    },
    /* "profile" determines the dimensions of the drawn profile (to be used in svg tag viewbox) */
    /* calculating its dimensions carefully is of great importance */
    profile: {
      dimensions: {} /* To be calculated in the class with the function provided */,
      calcDim: function (spec, n) {
        return {
          width: 500 + spec.profile.padding.x * 2,
          height: 500 + spec.profile.padding.y * 2,
        };
      },
      padding: {
        x: 0,
        y: 0,
      },
    },
    labels: Object.values(this.labels),
  };

  constructor(dataset, profileVariant, config = {}) {
    super();
    this._init(dataset, profileVariant, config);
  }

  _calcContext() {
    const {
      spec: { parameters: spec },
      dataset,
    } = this;

    // ّInit Spec
    spec.profile.dimensions = spec.profile.calcDim(spec, dataset.score.length);

    return [{}];
  }
}

module.exports = empty;
