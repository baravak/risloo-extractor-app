const { Profile, FS, Mappings } = require("../Profile");

const colorLevel = [
    '#65A30D',
    '#EAB308',
    '#EA580C',
    '#E11D48',
]

const colorSubLevel = [
    '#BEF264',
    '#FEF08A',
    '#FDBA74',
    '#FDA4AF',
]

class GHQ2893 extends Profile {
  // Number of pages
  static pages = 1;

  // Labels of the sample
  labels = {
    L1: { eng: "a", fr: ['نشانه‌های', 'جسمانی']},
    L2: { eng: "b", fr: ['اضطراب و', 'بی‌خوابی']},
    L3: { eng: "c", fr: ['نارساکنش‌وری', 'اجتماعی']},
    L4: { eng: "d", fr: ['افسردگی']},

    L5: { eng: "raw", fr: "وسواسی - اجباری"},
    L6: { eng: "range", fr: "وسواسی - اجباری"},

    L7: { eng: "a_range"},
    L8: { eng: "b_range"},
    L9: { eng: "c_range"},
    L10: { eng: "d_range"},
  };

  profileSpec = {
    /* "sample" determines some important info about the sample and profile */
    /* Default prerequisites: 1. gender, 2. age, 3. education */
    /* "prerequisites" is synonym to "fields" in our program */
    sample: {
      name: "پرسشنامه سلامت عمومی" /* Name of the sample */,
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
          width: 477 + 2 * this.padding.x,
          height: 522 + 2 * this.padding.y,
        };
      },
      padding: {
        x: 213,
        y: 96,
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
      const items = dataset.score.slice(0, 4).map((item, i) => {
        return {...item, range: `url(#gradiant-${dataset.score[6 + i].mark ?? 0}-y)`, mark: item.mark ?? 0, eng: item.label.eng.toUpperCase()}
      })

      const total = {...dataset.score[4], mark: dataset.score[4].mark ?? 0, range: `url(#gradiant-${dataset.score[5].mark ?? 0}-x)`, ranger:dataset.score[5].mark ?? 0};
    return [{ items, total }];
  }
}

module.exports = GHQ2893;
