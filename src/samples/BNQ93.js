const { Profile, FS } = require("../Profile");
const polygonXY = require("../helpers/polygonXY");
const polygonDefaultStart = require("../helpers/polygonDefaultStart");
const round = require("../handlebars/helpers/round");

class BNQ93 extends Profile {
  // Number of pages
  static pages = 1;

  // Labels of the sample
  labels = {
    L1_1: {eng: 'survival_raw', fa: 'نیاز به بقاء'},
    L1_2: {eng: 'survival_percentage'},
    L2_1: {eng: 'love_belonging_raw', fa: 'نیاز به عشق و تعلق'},
    L2_2: {eng: 'love_belonging_percentage'},
    L3_1: {eng: 'power_raw', fa: 'نیاز به قدرت'},
    L3_2: {eng: 'power_percentage'},
    L4_1: {eng: 'freedom_raw', fa: 'نیاز به آزادی'},
    L4_2: {eng: 'freedom_percentage'},
    L5_1: {eng: 'fun_raw', fa: 'نیاز به تفریح'},
    L5_2: {eng: 'fun_percentage'},
  };

  profileSpec = {
    /* "sample" determines some important info about the sample and profile */
    /* Default prerequisites: 1. gender, 2. age, 3. education */
    /* "prerequisites" is synonym to "fields" in our program */
    sample: {
      name: "پرسشنامه نیازهای اساسی گلاسر (BNQ)" /* Name of the sample */,
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
          width: 468 + 2 * this.padding.x,
          height: 391 + 2 * this.padding.y,
        }
      },
      padding: {
        x: 218,
        y: 162,
      },
    },
    /* "raw" is the general term used for total data element in the profile */
    /* "labels" part which has to be provided for each profile */
    labels: Object.values(this.labels),
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
    const startAngle = polygonDefaultStart(5)
    const rs = [
        {r: 157.5, points: polygonXY(0, 0, Array(5).fill(157.5), startAngle)},
        {r: 112.5, points: polygonXY(0, 0, Array(5).fill(112.5), startAngle)},
        {r: 67.5, points: polygonXY(0, 0, Array(5).fill(67.5), startAngle)},
    ]
    const points = []
    const scores = {}
    dataset.score.forEach((score, index) => {
        if(index % 2 !== 0) return
        points.push(157.5 * score.mark / 35)
        scores[score.label.eng.replace('_raw', '')] = {mark: score.mark, label: score.label.fa, percentage: Math.round(dataset.score[index + 1].mark * 100)}
    })
    const polygonDots = polygonXY(0,0, points, startAngle)
    const polygonArea = polygonDots.map(points => `${round(points[0], 6)},${round(points[1], 6)}`).join(' ')
    return [{ rs, polygonDots, polygonArea, scores }];
  }
}

module.exports = BNQ93;
