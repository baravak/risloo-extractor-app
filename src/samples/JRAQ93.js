const gauge = require("../helpers/gauge");
const { Profile } = require("../Profile");
const colors = [
  ["#4F46E5", "#A5B4FC"],
  ["#7C3AED", "#C4B5FD"],
]
class JRAQ93 extends Profile {
  // Number of pages
  static pages = 1;

  // Labels of the sample
  labels = {
    L1: { eng: "research_total_raw", fr: "نمره کل پژوهشی", max: 260 },
    L1_P: { eng: "research_total_percentage"},
    
    L2: { eng: "research_adherence_raw", fr: "پایبندی", max: 88 },
    L2_P: { eng: "research_adherence_percentage"},

    L3: { eng: "research_ambivalence_raw", fr: "دوسوگرایی", max: 84 },
    L3_P: { eng: "research_ambivalence_percentage"},

    L4: { eng: "research_disobedience_raw", fr: "ناپایبندی", max: 68 },
    L4_P: { eng: "research_disobedience_percentage"},

    L5: { eng: "clinical_total_raw", fr: "نمره کل بالینی", max: 60 },
    L5_P: { eng: "clinical_total_percentage"},
    
    L6: { eng: "clinical_adherence_raw", fr: "پایبندی", max: 22 },
    L6_P: { eng: "clinical_adherence_percentage"},

    L7: { eng: "clinical_ambivalence__raw", fr: "دوسوگرایی", max: 21 },
    L7_P: { eng: "clinical_ambivalence__percentage"},

    L8: { eng: "clinical_disobedience_raw", fr: "ناپایبندی", max: 17 },
    L8_P: { eng: "clinical_disobedience_percentage"},
  };

  profileSpec = {
    /* "sample" determines some important info about the sample and profile */
    /* Default prerequisites: 1. gender, 2. age, 3. education */
    /* "prerequisites" is synonym to "fields" in our program */
    sample: {
      name: "پرسشنامه پایبندی مذهبی" /* Name of the sample */,
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
          width: 776 + 2 * this.padding.x,
          height: 654 + 2 * this.padding.y,
        }
      },
      padding: {
        x: 64,
        y: 30,
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
    const groups = []
    for(let i = 0; i < 2; i++){
      const index = i * 8
      const group = {
        total: {
          ...dataset.score[index],
          mark: dataset.score[index].mark ?? 0,
          percentage: dataset.score[index + 1].mark ?? 0,
          percentageText: Math.round((dataset.score[index + 1].mark ?? 0) * 100),
        },
        circle : gauge(dataset.score[index], -90, 180),
        items: [],
        colors: [...colors[i], `url(#h-${i})`, `url(#c-${i})`]
      }
      for(let j = 0; j < 6; j+= 2){
        const itemIndex = index + j + 2
        group.items.push({
          ...dataset.score[itemIndex],
          mark: dataset.score[itemIndex].mark ?? 0,
          percentage: dataset.score[itemIndex + 1].mark ?? 0,
          percentageText: Math.round((dataset.score[itemIndex + 1].mark ?? 0) * 100),
        })
      }
      groups.push(group)
    }
    return [{ groups, colors }];
  }
}

module.exports = JRAQ93;
