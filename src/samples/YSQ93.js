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
        for(let j = 0; j < 5; j++){
            const key = i + (j * 18);
            if(dataset.questions[key].user_answered == 5){
                if(!a5.length){
                    start+= 37
                }else{
                    start+= 26
                }
                a5.push({item: key+1, start:start})
            }
        }
        a5_line.push(start + 2)
        const a6_start = start ? start + 36 : 0;
        const a6_line = [a6_start + 32]
        for(let j = 0; j < 5; j++){
            const key = i + (j * 18);
            if(dataset.questions[key].user_answered == 6){
                if(!a6.length){
                    start = a6_start + 37
                }else{
                    start+= 26
                }
                a6.push({item: key+1, start:start})
            }
        }
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

module.exports = YSQ93;
