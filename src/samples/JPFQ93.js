const { Profile, FS } = require("../Profile");

class JPFQ93 extends Profile {
  // Number of pages
  static pages = 1;

  // Labels of the sample
  labels = {
    L1: { eng: "identity", fr: "هویت", fill:"#8B5CF6 ", background:"#EDE9FE", fontColor:"#7C3AED", width: 69},
    L2: { eng: "intimacy", fr: "صمیمیت" , fill:"#8B5CF6 ", background:"#EDE9FE", fontColor:"#7C3AED", width: 33},
    L3: { eng: "empathy", fr: "همدلی" , fill:"#8B5CF6 ", background:"#EDE9FE", fontColor:"#7C3AED", width: 33},
    L4: { eng: "self_direction", fr: "خودراهبری" , fill:"#8B5CF6 ", background:"#EDE9FE", fontColor:"#7C3AED", width: 30},

    L5: { eng: "psychoticism", fr: "سایکوزگرایی", fill:"#EC4899 ", background:"#FCE7F3", fontColor:"#DB2777", width: 33},
    L6: { eng: "detachment", fr: "دل‌بریدگی", fill:"#EC4899 ", background:"#FCE7F3", fontColor:"#DB2777", width: 27},
    L7: { eng: "disinhibition", fr: "مهارگسیختگی", fill:"#EC4899 ", background:"#FCE7F3", fontColor:"#DB2777", width: 66},
    L8: { eng: "negative_affectivity", fr: "عاطفه‌پذیری منفی", fill:"#EC4899 ", background:"#FCE7F3", fontColor:"#DB2777", width: 45},
    L9: { eng: "antagonism", fr: "تضادورزی", fill:"#EC4899 ", background:"#FCE7F3", fontColor:"#DB2777", width: 42},
  };

  profileSpec = {
    /* "sample" determines some important info about the sample and profile */
    /* Default prerequisites: 1. gender, 2. age, 3. education */
    /* "prerequisites" is synonym to "fields" in our program */
    sample: {
      name: "کارکردهای شخصیت - جان‌بزرگی"      /* Name of the sample */,
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
          width: 735 + 2 * this.padding.x,
          height: 456 + 2 * this.padding.y,
        };
      },
      padding: {
        x: 84,
        y: 89,
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
    let markSum = 0
    dataset.score.forEach(score => {
        markSum += score.mark
    })
    // const items = dataset.score.map((data) => ({
    //   label: data.label,
    //   mark: data.mark,
    //   coordinates: {
    //     x: (data.mark.interaction - 6) * 25,
    //     y: (data.mark.structure - 6) * 25,
    //   },
    // }));
    // markSum = 378
    this.dataset.score.forEach((f, i) => {
      this.dataset.score[i].label.percentage = Math.round(((this.dataset.score[i].mark * 100) / this.dataset.score[i].label.width))
    })
    return [{ markSum  }];
  }
}

module.exports = JPFQ93;
