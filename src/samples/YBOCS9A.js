const { Profile, FS } = require("../Profile");
const interprets = {
    sub_clinical: {
        title: "غیر بالینی",
        color: "#64748B",
        secondary: "#CBD5E1"
        
    },
    mild: {
        title: "خفیف",
        color: "#EAB308",
        secondary: "#FDE047"
        
    },
    moderate: {
        title: "متوسط",
        color: "#F97316",
        secondary: "#FDBA74"
    },
    severe: {
        title: "شدید",
        color: "#E11D48",
        secondary: "#FDA4AF"
    },
    extreme: {
        title: "خیلی شدید",
        color: "#9F1239",
        secondary: "#FDA4AF"
    },
  }
const questionAnswers = [
  '#CBD5E1', '#EAB308', '#EA580C', '#E11D48', '#BE123C'
]
const questionTitles = [
    'وقت صرف شده',
    'اثر روی کارکرد',
    'ایجاد پریشانی',
    'تلاش برای مقاومت',
    'توان کنترل',

    'وقت صرف شده',
    'اثر روی کارکرد',
    'ایجاد پریشانی',
    'تلاش برای مقاومت',
    'توان کنترل',

    '-',
    '-',

    'غمگینی',
    'افکار خودکشی',

]
class YBOCS9A extends Profile {
  // Number of pages
  static pages = 1;

  // Labels of the sample
  labels = {
    L1: { eng: "obsession_severity", fr: "شدت وسواس" },
    L2: { eng: "report", fr: "تفسیر" },
  };

  profileSpec = {
    /* "sample" determines some important info about the sample and profile */
    /* Default prerequisites: 1. gender, 2. age, 3. education */
    /* "prerequisites" is synonym to "fields" in our program */
    sample: {
      name: "پرسشنامه یل‌براون وسواس" /* Name of the sample */,
      multiProfile: true /* Whether the sample has multiple profiles or not */,
      questions: true /* Determines whether to get questions from inital dataset or not */,
      defaultFields: true /* Determines whether to have default prerequisites in the profile or not */,
      fields: [] /* In case you want to get some additional fields and show in the profile */,
    },
    /* "profile" determines the dimensions of the drawn profile (to be used in svg tag viewbox) */
    /* calculating its dimensions carefully is of great importance */
    profile: {
      get dimensions() {
        return {
            width: 863 + 2 * this.padding.x,
            height: 672 + 2 * this.padding.y,
          }
      },
      padding: {
        x: 20,
        y: 21,
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
    const questions = dataset.questions.map(q => ({
      ...q,
      user_answered: parseInt(q.user_answered) - 1,
      color: questionAnswers[q.user_answered - 1]
    }))
    const severity = {
        mark: dataset.score[0].mark ?? 0,
        label: dataset.score[1].mark,
        ...interprets[dataset.score[1].mark]
    }
    let alert = 0
    if(questions[0].user_answered === 0) alert += 1
    if(questions[5].user_answered === 0) alert += 2
    return [
      {severity, questions, alert, questionTitles, questionAnswers}
    ];
  }
}

module.exports = YBOCS9A;
