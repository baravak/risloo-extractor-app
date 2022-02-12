const { Profile, FS } = require("../Profile");

class SAFE93 extends Profile {
  // Number of pages
  static pages = 1;

  // Labels of the sample
  labels = {
    L1: { eng: "me_and_my_partner", fr: "رابطه با شریک جنسی / همسر" },
    L2: { eng: "me_and_my_children", fr: "رابطه با فرزندان" },
    L3: { eng: "me_and_my_parents", fr: "رابطه با والدین" },
  };

  profileSpec = {
    /* "sample" determines some important info about the sample and profile */
    /* Default prerequisites: 1. gender, 2. age, 3. education */
    /* "prerequisites" is synonym to "fields" in our program */
    sample: {
      name: "پرسشنامه SAFE" /* Name of the sample */,
      multiProfile: false /* Whether the sample has multiple profiles or not */,
      questions: false /* Determines whether to get questions from inital dataset or not */,
      defaultFields: true /* Determines whether to have default prerequisites in the profile or not */,
      fields: ["family_role"] /* In case you want to get some additional fields and show in the profile */,
    },
    /* "profile" determines the dimensions of the drawn profile (to be used in svg tag viewbox) */
    /* calculating its dimensions carefully is of great importance */
    profile: {
      get dimensions() {
        return {
          width: 851 + 2 * this.padding.x,
          height: 691 + 2 * this.padding.y,
        };
      },
      padding: {
        x: 70,
        y: 0,
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
    const { dataset } = this;

    const items = dataset.score.map((data) => ({
      label: data.label,
      mark: data.mark,
      coordinates: {
        x: (data.mark.interaction - 6) * 25,
        y: (data.mark.structure - 6) * 25,
      },
    }));

    return [{ items }];
  }
}

module.exports = SAFE93;
