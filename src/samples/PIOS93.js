const { Profile, FS } = require("../Profile");


class PIOS93 extends Profile {
  // Number of pages
  static pages = 1;

  // Labels of the sample
  labels = {
    L0: { eng: "total", fr: "نمره کل", max:76, color:"#475569", bg:"#F1F5F9"},
    L1: { eng: "total_percentage"},

    L2: { eng: "fear_of_sin", fr: "ترس از گناه", max:44, color:"#BE185D", bg:"#FDF2F8"},
    L3: { eng: "fear_of_sin_percentage"},

    L4: { eng: "fear_of_god", fr: "ترس از خدا", max:32, color:"#4338CA", bg:"#EEF2FF"},
    L5: { eng: "fear_of_god_percentage"},

  };

  profileSpec = {
    /* "sample" determines some important info about the sample and profile */
    /* Default prerequisites: 1. gender, 2. age, 3. education */
    /* "prerequisites" is synonym to "fields" in our program */
    sample: {
      name: "پرسشنامه وسواس مذهبی اخلاقی پن" /* Name of the sample */,
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
        total: this.circle({...dataset.score[0], percentage: dataset.score[1].mark}),
        sin: this.circle({...dataset.score[2], percentage: dataset.score[3].mark}),
        god: this.circle({...dataset.score[4], percentage: dataset.score[5].mark}),
    }];
  }
}



module.exports = PIOS93;
