const { Profile, FS } = require("../Profile");
const totalColors = {
    minimal: ['#CBD5E1', '#475569'],
    mild: ['#FDE047', '#EAB308'],
    moderate: ['#FDBA74', '#EA580C'],
    severe: ['#FDA4AF', '#E11D48'],
}
const levelColors = ['#F8FAFC', '#FEFCE8BF', '#FFEDD580', '#FFF1F2']
class BDI93 extends Profile {
  static pages = 2;

  labels = {
    L1_1: { eng: "affective_raw", short: 'A', fr: "عاطفی", max: 24 },
    L1_2: { eng: "affective_percentage"},

    L2_1: { eng: "cognitive_raw", short: 'C', fr: "شناختی", max: 24 },
    L2_2: { eng: "cognitive_percentage"},

    L3_1: { eng: "somatic_raw", short: 'P', fr: "جسمانی", max: 15 },
    L3_2: { eng: "somatic_percentage"},

    L4_1: { eng: "raw"},
    L4_2: { eng: "percentage"},

    L5: { eng: "report"},
    L6: { eng: "suicide_alert"},
  };

  profileSpec = {
    sample: {
      name: "آزمون افسردگی بک",
      multiProfile: false,
      questions: true,
      defaultFields: true,
      fields: [],
    },
    profile: {
      get dimensions() {
        return [
          {
            width: 555 + 2 * this.padding.x,
            height: 588 + 2 * this.padding.y,
          },
          {
            width: 893 + 2 * this.padding.x,
            height: 683 + 2 * this.padding.y,
          },
        ];
      },
      padding: [
        {
          x: 194,
          y: 63,
        },
        {
          x: 5,
          y: 15,
        },
      ],
    },

    labels: Object.values(this.labels),
  };

  constructor(dataset, options, config = {}) {
    super();
    this._init(dataset, options, config);
  }

  _calcContext() {
    const { dataset } = this;
    const factors = []
    const questions = dataset.questions.map((q, i) => {
      let option = Number(q.user_answered)
      if(q.answer.options.length === 4){
        option = option - 1
      }else{
        option = Math.floor(option / 2)

      }
      return {
        i: i +1,
        label: q.text,
        option,
        color: levelColors[option],
        alert: (i === 1 || i === 8) && option !== 0,
        user_answered: Number(q.user_answered),
        text: q.answer.options[Number(q.user_answered) - 1]
      }
    })
    const sorted = [...questions].sort((a, b) => b.option - a.option)
    for(let i = 0; i < 6; i+=2){
        factors.push({
            ...dataset.score[i],
            percentage: dataset.score[i+1].mark,
            percentageText: Math.round(dataset.score[i+1].mark * 100),
            bg:`url(#bg${dataset.score[i].label.eng})`
        })
    }

    const report = dataset.score[8].mark
    const total = {
        ...dataset.score[6],
        percentage: dataset.score[7].mark,
        percentageText: Math.round(dataset.score[7].mark * 100),
        w: calculateWidth(dataset.score[6].mark),
        colors: totalColors[report],
        alert: dataset.score[9].mark
    }
    const alerts = []
    if(questions[1].option > 0){
      alerts.push(questions[1])
    }
    if(questions[8].option > 0){
      alerts.push(questions[8])
    }
    return [{factors, total, report, alerts},{sorted}
    ];
  }
}
function calculateWidth(score) {
    let w = 0;
  
    if (score <= 13) {
      w = score * 10;
    } else if (score <= 19) {
      w = (13 * 10) + (score - 13) * 12;
    } else if (score <= 28) {
      w = (13 * 10) + (6 * 12) + (score - 19) * 8;
    } else {
      w = (13 * 10) + (6 * 12) + (9 * 8) + (score - 28) * 5;
    }
  
    return w;
  }
  
module.exports = BDI93;
