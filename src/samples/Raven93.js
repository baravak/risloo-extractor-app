const { Profile } = require("../Profile");
const answers = [4,5,1,2,6,3,6,2,1,3,4,5,2,6,1,2,1,3,5,6,4,3,4,5,8,2,3,8,7,4,5,1,7,6,1,2,3,4,3,7,8,6,5,4,1,2,5,6,7,6,8,2,1,5,1,6,3,2,4,5]
const setGroup = ['A', 'B', 'C', 'D', 'E']
const levels = {
    'Very superior' : {title: 'خیلی سرآمد', min: 149, color: ['#059669', '#10B981']},
    'Superior' : {title: 'سرآمد', min: 125, max: 148, color: ['#059669', '#10B981']},
    'High average' : {title: 'متوسط بالا', min: 113, max: 124, color: ['#059669', '#10B981']},
    'Average' : {title: 'متوسط (بهنجار)', min: 89, max: 112, color: ['#475569', '#64748B']},
    'Low average' : {title: 'متوسط پایین', min: 77, max: 88, color: ['#E11D48', '#F43F5E']},
    'Borderline' : {title: 'مرزی', min: 65, max: 76, color: ['#E11D48', '#F43F5E']},
    'Extremely low'   : {title: 'بسیار پایین', min: 0, max: 64, color: ['#E11D48', '#F43F5E']},
}

class Raven93 extends Profile {
  // Number of pages
  static pages = 1;

  // Labels of the sample
  labels = {
    L1: { eng: "raw"},
    L2: { eng: "iq"},
    L3: { eng: "percentile"},
    L9: { eng: "report"},
  };

  profileSpec = {
    /* "sample" determines some important info about the sample and profile */
    /* Default prerequisites: 1. gender, 2. age, 3. education */
    /* "prerequisites" is synonym to "fields" in our program */
    sample: {
      name: "آزمون ریون استاندارد" /* Name of the sample */,
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
          width: 815 + 2 * this.padding.x,
          height: 618 + 2 * this.padding.y,
        };
      },
      padding: {
        x: 44,
        y: 48,
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
    const report = dataset.score[3]
    const iq = dataset.score[1].mark?.toString().replace(/[<>]/, '')
    const iqText = dataset.score[1].mark ?? 0
    const raw = dataset.score[0].mark ?? 0
    const percentile = dataset.score[2].mark ?? 0
    levels[report.mark].selected = true
    const selected = levels[report.mark]
    const questions = []
    dataset.questions.forEach((item, index) => {
        const i = index + 1
        const set = Math.floor(index / 12)
        if(questions[set] === undefined){
            questions[set] = {
                key: setGroup[set],
                items: [],
                length: 0

            }
        }
        const isTrue = answers[index] === parseInt(item.user_answered)
        questions[set].length += isTrue ? 1 : 0
        questions[set].items.push({
            index: i, isTrue
        })
    });
    const indic = iq === 100 ? levels['Average'] : (
      iq > 100 ? levels['High average'] : levels['Low average']
    )
    
    return [{ levels, selected, questions, iq, raw, percentile, indic, iqText  }];
  }
}

module.exports = Raven93;
