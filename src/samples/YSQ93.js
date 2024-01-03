const { Profile, FS, Mappings } = require("../Profile");
class YSQ93 extends Profile {
  // Number of pages
  static pages = 1;

  // Labels of the sample
  labels = {
    L1: { eng: "ab", fr: "رهاشدگی (بی‌ثباتی)" , append_rows:0},
    L2: { eng: "ma", fr: "بی‌اعتمادی (سوءاستفاده)" , append_rows:0},
    L3: { eng: "ed", fr: "محرومیت عاطفی" , append_rows:0},
    L4: { eng: "ds", fr: "نقص (شرم)" , append_rows:0},
    L5: { eng: "si", fr: "انزوای اجتماعی (احساس بیگانگی)", append_rows:0},

    L6: { eng: "ai", fr: "وابستگی (بی‌کفایتی)" , append_rows:38 * 1},
    L7: { eng: "vu", fr: "آسیب‌پذیری در برابر خطر" , append_rows:38 * 1},
    L8: { eng: "eu", fr: "گرفتارشدگی (خودتحول‌نایافتگی)" , append_rows:38 * 1},
    L9: { eng: "fa", fr: "شکست" , append_rows:38 * 1},

    L10: { eng: "et", fr: "محق‌بودن (خودبزرگ‌بینی)" , append_rows:38 * 2},
    L11: { eng: "is", fr: "خودمهارگری ناکافی" , append_rows:38 * 2},
    
    L12: { eng: "sb", fr: "انقیاد (اطاعت)" , append_rows:38 * 3},
    L13: { eng: "ss", fr: "از خودگذشتگی" , append_rows:38 * 3},
    L14: { eng: "as", fr: "تأییدخواهی یا تصدیق‌خواهی" , append_rows:38 * 3},
    
    L15: { eng: "np", fr: "منفی‌خوانی یا بدبینی" , append_rows:38 * 4},
    L16: { eng: "ei", fr: "بیش‌مهارگری (بازداری هیجانی)" , append_rows:38 * 4},
    L17: { eng: "us", fr: "استانداردهای سخت‌گیرانه" , append_rows:38 * 4},
    L18: { eng: "pu", fr: "تنبیه‌گری" , append_rows:38 * 4},
  };

  profileSpec = {
    /* "sample" determines some important info about the sample and profile */
    /* Default prerequisites: 1. gender, 2. age, 3. education */
    /* "prerequisites" is synonym to "fields" in our program */
    sample: {
      name: "آزمون روان‌بنه‌های یانگ - 90 سؤالی" /* Name of the sample */,
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
          width: 887 + 2 * this.padding.x,
          height: 666 + 2 * this.padding.y,
        };
      },
      padding: {
        x: 8,
        y: 24,
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
    const items = dataset.score.map((s, i) =>{
        const a5 = [];
        const a6 = [];
        let start = 0;
        const a5_line = [32]
        factors_key[s.label.eng].forEach((e, ei) => {
          e = parseInt(e)
          if(dataset.questions[e - 1].user_answered == 5){
            if(!a5.length){
                start+= 37
            }else{
                start+= 26
            }
            a5.push({item: e, start:start})
          }
        });
        a5_line.push(start + 2)
        const a6_start = start ? start + 36 : 0;
        const a6_line = [a6_start + 32]
        factors_key[s.label.eng].forEach((e, ei) => {
          e = parseInt(e)
          if(dataset.questions[e -1].user_answered == 6){
            if(!a6.length){
                start = a6_start + 37
            }else{
                start+= 26
            }
            a6.push({item: e, start:start})
        }
        })
        a6_line.push(start + 2)
        const is_critical = a5.length + a6.length >= 3 ? true : false
        return Object.assign({}, s, {
            up:s.label.eng.toUpperCase(),
            a5:a5,
            a5_line:a5_line,
            a6_line:a6_line,
            a6:a6,
            a6_start:a6_start,
            is_critical : is_critical,
            warn: is_critical || s.mark >= 15 ? true : false,
            mean:s.mark >= 15 ? true : false,
            fill:is_critical ? "url(#critical)" : "url(#normal)",
            percentage: Math.round((s.mark * 100) / 30)
        })
    })
    return [{ items }];
  }
}
const f1= 'ed'
const f2 = 'ab'
const f3 = 'ma'
const f4 = 'si'
const f5 = 'ds'
const f6 = 'fa'
const f7 = 'ai'
const f8 = 'vu'
const f9 = 'eu'
const f10 = 'sb'
const f11 = 'ss'
const f12 = 'ei'
const f13 = 'us'
const f14 = 'et'
const f15 = 'is'
const f16 = 'as'
const f17 = 'np'
const f18 = 'pu'

const factors_item = {
    1: f1,  2: f2,   3: f3,   4: f4,   5: f5,    6: f6,   7: f7,   8: f8,   9: f9,   10: f10, 11: f11, 12: f12, 13: f13, 14: f14, 15: f15, 16: f16, 17: f17, 18: f18,
    19: f1, 20: f2, 21: f3, 22: f4, 23: f5, 24: f6, 25: f7, 26: f8, 27: f9, 28: f10, 29: f11, 30: f12, 31: f13, 32: f14, 33: f15, 34: f16, 35: f17, 36: f18,
    37: f1, 38: f2, 39: f3, 40: f4, 41: f5, 42: f6, 43: f7, 44: f8, 45: f9, 46: f10, 47: f11, 48: f12, 49: f13, 50: f14, 51: f15, 52: f16, 53: f17, 54: f18,
    55: f1, 56: f2, 57: f3, 58: f4, 59: f5, 60: f6, 61: f7, 62: f8, 63: f9, 64: f10, 65: f11, 66: f12, 67: f13, 68: f14, 69: f15, 70: f16, 71: f17, 72: f18,
    73: f1, 74: f2, 75: f3, 76: f4, 77: f5, 78: f6, 79: f7, 80: f8, 81: f9, 82: f10, 83: f11, 84: f12, 85: f13, 86: f14, 87: f15, 88: f16, 89: f17, 90: f18
}
const factors_key = {}
for(const fi in factors_item){
  const fk = factors_item[fi]
  if(factors_key[fk] === undefined){
    factors_key[fk] = [fi]
  }else{
    factors_key[fk].push(fi)
  }
}
module.exports = YSQ93;
