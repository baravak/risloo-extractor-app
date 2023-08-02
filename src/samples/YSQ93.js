const { Profile, FS, Mappings } = require("../Profile");

class YSQ93 extends Profile {
  // Number of pages
  static pages = 1;

  // Labels of the sample
  labels = {
    L1: { eng: "ed", fr: "محرومیت هیجانی" },
    L2: { eng: "ab", fr: "رهاشدگی / بی‌ثباتی" },
    L3: { eng: "ma", fr: "بی‌اعتمادی / بدرفتاری" },
    L4: { eng: "si", fr: "انزوای اجتماعی / بی‌گانگی" },
    L5: { eng: "ds", fr: "نقص / شرم" },
    L6: { eng: "fa", fr: "شکست" },
    L7: { eng: "ai", fr: "وابستگی / بی‌کفایتی" },
    L8: { eng: "vu", fr: "آسیب‌پذیری نسبت به ضرر یا بیماری" },
    L9: { eng: "eu", fr: "گرفتار / خویشتن تحول‌نیافته" },
    L10: { eng: "sb", fr: "اطاعت" },
    L11: { eng: "ss", fr: "ایثارگری" },
    L12: { eng: "ei", fr: "بازداری هیجانی" },
    L13: { eng: "us", fr: "معیارهای سخت‌گیرانه" },
    L14: { eng: "et", fr: "استحقاق / بزرگ‌منشی" },
    L15: { eng: "is", fr: "خویشتن‌داری / خودانضباطی ناکافی" },
    L16: { eng: "as", fr: "پذیرش‌جویی / جلب توجه" },
    L17: { eng: "np", fr: "منفی‌گرایی / بدبینی" },
    L18: { eng: "pu", fr: "تنبیه" },
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
          width: 815 + 2 * this.padding.x,
          height: 609 + 2 * this.padding.y,
        };
      },
      padding: {
        x: 44,
        y: 52.5,
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
        const is_critical = a5.length || a6.length ? true : false
        return Object.assign({}, s, {
            up:s.label.eng.toUpperCase(),
            a5:a5,
            a5_line:a5_line,
            a6_line:a6_line,
            a6:a6,
            a6_start:a6_start,
            is_critical : is_critical,
            fill:is_critical ? "url(#critical)" : "url(#normal)",
            warn: is_critical || s.mark >= 15 ? true : false,
            percentage: Math.round((s.mark * 100) / 30)
        })
    })
    return [{ items }];
  }
}

module.exports = YSQ93;
