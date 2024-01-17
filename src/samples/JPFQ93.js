const { Profile, FS } = require("../Profile");

class JPFQ93 extends Profile {
  // Number of pages
  static pages = 2;

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
      questions: true /* Determines whether to get questions from inital dataset or not */,
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
    const { dataset, questions } = this;
    let markSum = 0
    const clinicalScores = clinicalScoring(dataset.questions)
    const score2 = []
    dataset.score.forEach(score => {
        markSum += (score.mark ?? 0)
        const s2= {label: {...score.label}}
        s2.mark = clinicalScores[score.label.eng].total
        s2.label.percentage = clinicalScores[score.label.eng].percentage
        s2.label.width = clinicalScores[score.label.eng].width
        score2.push(s2)
    })
    this.dataset.score.forEach((f, i) => {
      this.dataset.score[i].label.percentage = Math.round((((this.dataset.score[i].mark ?? 0) * 100) / this.dataset.score[i].label.width))
    })
    let markSum1 = 0
    for(const cs in clinicalScores){
      markSum1 += clinicalScores[cs].total
    }
    return [{ markSum: markSum1, clinicalScores: score2, titleAppend:' - نیم‌رخ بالینی'  }, { markSum, titleAppend:' - نیم‌رخ پژوهشی'  }];
  }
}
function clinicalScoring(items){
  f1 = 'identity'
  f2 = 'self_direction'
  f3 = 'empathy'
  f4 = 'intimacy'
  f5 = 'psychoticism'
  f6 = 'detachment'
  f7 = 'disinhibition'
  f8 = 'negative_affectivity'
  f9 = 'antagonism'
  factors = {
      [`${f1}`] : [1,5,9,12,14,17,19,21,23,25,27,29,31,33,35,37,39,41,43,45,48,50,53],
      [`${f2}`] : [2,6,10,15,20,26,32,38,44,49],
      [`${f3}`] : [4,8,13,18,24,30,36,42,47,52,55],
      [`${f4}`] : [3,7,11,16,22,28,34,40,46,51,54],
      [`${f5}`] : [56,62,68,73,78,83,88,96,102,108,111],
      [`${f6}`] : [60,67,72,77,82,87,94,100,106],
      [`${f7}`] : [57,61,63,66,69,74,79,84,89,91,93,95,97,103,107,110,114,118,120,122,124,126],
      [`${f8}`] : [59,65,71,76,81,86,92,99,105,112,116,119,121,123,125],
      [`${f9}`] : [58,64,70,75,80,85,90,98,101,104,109,113,115,117]
  }
  reverse_scoring_numbers = [1,5,6,10,11,12,14,26,32,34,47,50,115]
  result = {}
  for(const f in factors){
      const fItems = factors[f]
      if(result[f] === undefined){
          result[f] = {total: 0, percentage: 0, width: fItems.length * 2}
      }
      fItems.forEach(index => {
          answer = parseInt(items[index -1].user_answered)
          let incScore = 0
          if(reverse_scoring_numbers.indexOf(index) === -1){
              incScore = Math.floor((answer - 1)/1.5)
          }else{
              incScore = Math.floor((4 - answer)/1.5)
          }
          result[f].total = result[f].total + incScore
      })
      totalScore = fItems.length * 2
      result[f].percentage = Math.round((result[f].total * 100) / totalScore)
  }
  return result
}
module.exports = JPFQ93;
