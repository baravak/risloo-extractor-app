const { Profile, FS } = require("../Profile");

class MBTI9A extends Profile {
  // Number of pages
  static pages = 1;

  // Labels of the sample
  labels = {
    L1: { eng: "e", fr: "برون‌گرایی" },
    L2: { eng: "i", fr: "درون‌گرایی" },
    L3: { eng: "n", fr: "شهودی" },
    L4: { eng: "s", fr: "حسی" },
    L5: { eng: "t", fr: "تفکری" },
    L6: { eng: "f", fr: "احساسی" },
    L7: { eng: "j", fr: "داوری‌کننده" },
    L8: { eng: "p", fr: "ملاحظه‌کننده" },

    L9: { eng: "report", fr: "تیپ شخصیتی فرد" },
  };

  profileSpec = {
    /* "sample" determines some important info about the sample and profile */
    /* Default prerequisites: 1. gender, 2. age, 3. education */
    /* "prerequisites" is synonym to "fields" in our program */
    sample: {
      name: "شخصیت تیپ‌نمای مایرز – بریگز (MBTI)" /* Name of the sample */,
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
          width: 590 + 2 * this.padding.x,
          height: 621 + 2 * this.padding.y,
        }
      },
      padding: {
        x: 157,
        y: 47,
      },
    },

    labels: Object.values(this.labels)
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
    const items = []
    for(let i = 0; i < 8; i+=2) {
        const bold = (dataset.score[i].mark ?? 0) > (dataset.score[i + 1].mark ?? 0)
        const mark = dataset.score[i].mark ?? 0
        const a = {
            ...dataset.score[i],
            mark: mark,
            eng: dataset.score[i].label.eng.toUpperCase(),
            percentage: Math.round((mark) / 15 * 100),
            bold,
            blockItem: bold ? mark : 15 - mark
        }
        const b = {
            ...dataset.score[i + 1],
            eng: dataset.score[i + 1].label.eng.toUpperCase(),
            mark: 15 - mark,
            percentage: 100 - a.percentage,
            bold: !a.bold

        }
      items.push([a, b])
    }
    return [
      {
        items,
        report: dataset.score[8]
      },
    ];
  }
}

module.exports = MBTI9A;
