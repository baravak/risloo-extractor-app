const { Profile } = require("../Profile");
const totalColors = {
    none: ['#CBD5E1', '#475569'],
    almost_none: ['#CBD5E1', '#475569'],
    minimal: ['#FDE047', '#EAB308'],
    mild: ['#FDE047', '#EAB308'],
    moderate_i: ['#FDBA74', '#EA580C'],
    moderate_ii: ['#FDBA74', '#EA580C'],
    severe: ['#FDA4AF', '#E11D48']
}
const gTotalColors = {
  minimal: ['#CBD5E1', '#475569'],
  mild: ['#FDE047', '#EAB308'],
  moderate: ['#FDBA74', '#EA580C'],
  severe: ['#FDA4AF', '#E11D48'],
}
const levelColors = ['#F8FAFC', '#FEFCE8BF', '#FFEDD580', '#FFF1F2']
class BDI9A extends Profile {
  static pages = 1;

  labels = {

    L1: { eng: "raw"},
    L2: { eng: "percentage"},
    L3: { eng: "report"},
    L4: { eng: "report_dadsetan"},
    L5: { eng: "suicide_alert"},

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
        return {
          width: 893 + 2 * this.padding.x,
          height: 664 + 2 * this.padding.y,
        }
      },
      padding: {
        x: 5,
        y: 25,
      }
    },

    labels: Object.values(this.labels),
  };

  constructor(dataset, options, config = {}) {
    super();
    this._init(dataset, options, config);
  }

  _calcContext() {
    const { dataset } = this;
    const questions = dataset.questions.map((q, i) => {
      let option = 4 - Number(q.user_answered)
      return {
        i: i +1,
        label: q.text,
        option,
        color: levelColors[option],
        alert: (i === 1 || i === 6) && option !== 0,
        user_answered: Number(q.user_answered),
        text: q.answer.options[Number(q.user_answered) - 1]
      }
    })
    const sorted = [...questions].sort((a, b) => b.option - a.option)

    const report = dataset.score[3].mark
    const gReport = dataset.score[2].mark
    dataset.score[0].mark = dataset.score[0] ?? 0
    dataset.score[1].mark = dataset.score[1].mark ?? 0
    dataset.score[1].mark = isNaN(dataset.score[1].mark) ? 0 : dataset.score[1].mark
    const total = {
        ...dataset.score[0],
        percentage: dataset.score[1].mark,
        percentageText: Math.round(dataset.score[1].mark * 100),
        w: calculateWidth(dataset.score[0].mark),
        colors: totalColors[report],
        gColors: gTotalColors[gReport],
        alert: dataset.score[4].mark
    }
    const alerts = []
    if(questions[1].option > 0){
      alerts.push(questions[1])
    }
    if(questions[6].option > 0){
      alerts.push(questions[6])
    }
    return [{total, report, gReport, alerts,sorted}];
  }
}
const levels = [
  [15, 6],
  [11, 27],
  [8, 34],
  [4, 20],
  [2, 40],
  [1, 80],
]
function calculateWidth(_score) {
  let score = _score
  let w = 0
  for(let i = 0; i < levels.length; i++){
    const [start, weigh] = levels[i]
    if(score >= start){
      const bt = score - (start - 1)
      w += bt * weigh
      score -= bt
    }
  }
  return w
}
module.exports = BDI9A;
