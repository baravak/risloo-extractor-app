const { Profile, FS } = require("../Profile");


class JSGS93 extends Profile {
  // Number of pages
  static pages = 1;

  // Labels of the sample
  labels = {

    L1_1: { eng: "god_image_raw", fr: "خداپنداره", max:56, color:"#64748B"},
    L1_2: { eng: "god_image_percentage"},
    L2_1: { eng: "god_concept_raw", fr: "خداپنداشت", max:44, color:"#0284C7"},
    L2_2: { eng: "god_concept_percentage"},

    L3_1: { eng: "self_image_raw", fr: "خودپنداره", max:28, color:"#64748B"},
    L3_2: { eng: "self_image_percentage"},
    L4_1: { eng: "self_concept_raw", fr: "خودپنداشت", max:32, color:"#65A30D"},
    L4_2: { eng: "self_concept_percentage"},

  };

  profileSpec = {
    /* "sample" determines some important info about the sample and profile */
    /* Default prerequisites: 1. gender, 2. age, 3. education */
    /* "prerequisites" is synonym to "fields" in our program */
    sample: {
      name: "پرسشنامه خودپنداره - خداپنداره جان‌بزرگی" /* Name of the sample */,
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
          width: 401 + 2 * this.padding.x,
          height: 501 + 2 * this.padding.y,
        };
      },
      padding: {
        x: 251,
        y: 106.5,
      },
    },
    /* "labels" part which has to be provided for each profile */
    labels: Object.values(this.labels),
  };
  circle (data){
    data.mark = data.mark?? 0;
    data.percentage = data.percentage?? 0;
    const circleData = {
        R: 80 ,
        r: 80 * .7,
        angles: {
            start: FS.toRadians(-90),
            end: FS.toRadians(180),
        },
        direction: false,
        get totalAngle() {
            return this.direction
            ? 2 * Math.PI - (this.angles.end - this.angles.start)
            : this.angles.end - this.angles.start;
        },
    }
    return {
      circle: circleData,
      mark: data.mark,
      label: data.label.fr,
      bg: data.label.bg,
      color: data.label.color,
      max: data.label.max,
      percentage: Math.round(data.percentage * 100),
      zeta: (data.mark / data.label.max) * circleData.totalAngle + circleData.angles.start,
    };
  }
  constructor(dataset, options, config = {}) {
    super();
    this._init(dataset, options, config);
  }
  _calcContext() {
    const {
        dataset,
      } = this;
    
    return [{
        god_image: this.circle({...dataset.score[0], mark: dataset.score[0].mark ?? 0, percentage: dataset.score[1].mark ?? 0}),
        god_concept: this.circle({...dataset.score[2], mark: dataset.score[2].mark ?? 0, percentage: dataset.score[3].mark ?? 0}),
        self_image: this.circle({...dataset.score[4], mark: dataset.score[4].mark ?? 0, percentage: dataset.score[5].mark ?? 0}),
        self_concept: this.circle({...dataset.score[6], mark: dataset.score[6].mark ?? 0, percentage: dataset.score[7].mark ?? 0}),
    }];
  }
}



module.exports = JSGS93;
