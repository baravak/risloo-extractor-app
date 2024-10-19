const { Profile, FS } = require("../Profile");


class NEO9A extends Profile {
  // Number of pages
  static pages = 1;

  // Labels of the sample
  labels = {
    L0: { eng: "n", fr: "روان‌آزده‌گرایی", startColor:"#F9A8D4", endColor: "#DB2777", textColor:"#BE185D", bgColor: "#FDF2F8", steps: [15, 20, 25, 31, 48]},
    L1: { eng: "n_raw"},

    L2: { eng: "e", fr: "برون‌گرایی", startColor:"#67E8F9", endColor: "#0891B2", textColor:"#0E7490", bgColor: "#ECFEFF", steps: [22, 26, 29, 32, 48]},
    L3: { eng: "e_raw"},

    L4: { eng: "o", fr: "گشودگی", startColor:"#7DD3FC", endColor: "#0284C7", textColor:"#0369A1", bgColor: "#F0F9FF", steps: [23, 27, 29, 32, 48]},
    L5: { eng: "o_raw"},

    L6: { eng: "a", fr: "موافق‌بودن", startColor:"#A5B4FC", endColor: "#4F46E5", textColor:"#4338CA", bgColor: "#EEF2FF", steps: [27, 31, 33, 37, 48]},
    L7: { eng: "a_raw"},

    L8: { eng: "c", fr: "با وجدان‌بودن", startColor:"#C4B5FD", endColor: "#7C3AED", textColor:"#6D28D9", bgColor: "#F5F3FF", steps: [27, 32, 35, 39, 48]},
    L9: { eng: "c_raw"},
  };

  profileSpec = {
    /* "sample" determines some important info about the sample and profile */
    /* Default prerequisites: 1. gender, 2. age, 3. education */
    /* "prerequisites" is synonym to "fields" in our program */
    sample: {
      name: "پرسشنامه شخصیت نئو ۶۰ سوالی (NEO-FFI-60)" /* Name of the sample */,
      multiProfile: false /* Whether the sample has multiple profiles or not */,
      questions: true /* Determines whether to get questions from inital dataset or not */,
      defaultFields: true /* Determines whether to have default prerequisites in the profile or not */,
      fields: [] /* In case you want to get some additional fields and show in the profile */,
    },
    /* "profile" determines the dimensions of the drawn profile (to be used in svg tag viewbox) */
    /* calculating its dimensions carefully is of great importance */
    profile: {
      get dimensions() {
        return {
          width: 866 + 2 * this.padding.x,
          height: 649 + 2 * this.padding.y,
        };
      },
      padding: {
        x: 18,
        y: 32,
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
    const factors = []
    for(let i = 0; i < 10; i+=2){
        const factor = {
            ...dataset.score[i],
            mark: dataset.score[i+1].mark,
            raw: dataset.score[i].mark - 1,
            label: {
                ...dataset.score[i].label,
                eng: dataset.score[i].label.eng.toUpperCase(),
                stepTitle: [],
                fill: `url(#bar-${dataset.score[i].label.eng.toUpperCase()})`
            }
        }
        for(let j = 0; j < factor.label.steps.length; j++){
            const start = j === 0 ? 0 : factor.label.steps[j-1]
            const step = factor.label.steps[j]
            const middle = (((step - start) * 14) / 2) + (start * 14)
            factor.label.stepTitle.push(middle)
        }
        factors.push(factor)
    }
    const steps = ['خیلی پایین', 'پایین', 'وسط', 'بالا', 'خیلی بالا']
    return [{factors, steps}];
  }
}



module.exports = NEO9A;
