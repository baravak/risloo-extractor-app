const gauge = require("../helpers/gauge");
const { Profile } = require("../Profile");

const labels = {
  extremely_high: "فوق بالا",
  very_high: "خیلی بالا",
  high: "بالا",
  average: "متوسط",
  low: "پایین",
  very_low: "خیلی پایین",
  extremely_low: "فوق پایین",
};

const colors = {
  bars: [
    ['#EDE9FE', '#5B21B6', '#7C3AED', '#A78BFA'],
  ]
}

class FRHPT9A extends Profile {
  // Number of pages
  static pages = 1;

  // Labels of the sample
  labels = {
    L1_1: { eng: "factors_ex_raw", group: true, fa: "برون‌گرایی" },
    L1_2: { eng: "factors_ex_percentage" },
    L1_3: { eng: "factors_ex_level" },


    L6_1: { eng: "factors_an_raw", group: true, fa: "رگه اضطراب" },
    L6_2: { eng: "factors_an_percentage" },
    L6_3: { eng: "factors_an_level" },


    L11_1: { eng: "factors_dp_raw", group: true, fa: "رگه افسردگی" },
    L11_2: { eng: "factors_dp_percentage" },
    L11_3: { eng: "factors_dp_level" },


    L16_1: { eng: "factors_ag_raw", group: true, fa: "خشم و پرخاشگری" },
    L16_2: { eng: "factors_ag_percentage" },
    L16_3: { eng: "factors_ag_level" },


    L21_1: { eng: "factors_op_raw", group: true, fa: "گشودگی به تجربه" },
    L21_2: { eng: "factors_op_percentage" },
    L21_3: { eng: "factors_op_level" },


    L26_1: { eng: "factors_af_raw", group: true, fa: "عاطفه" },
    L26_2: { eng: "factors_af_percentage" },
    L26_3: { eng: "factors_af_level" },


    L31_1: { eng: "factors_co_raw", group: true, fa: "وظیفه‌شناسی" },
    L31_2: { eng: "factors_co_percentage" },
    L31_3: { eng: "factors_co_level" },


    L36_1: { eng: "factors_fl_raw", group: true, fa: "انعطاف‌پذیری" },
    L36_2: { eng: "factors_fl_percentage" },
    L36_3: { eng: "factors_fl_level" },

    L54_1: { eng: "indicators_vrin_value", fa: "دقت در پاسخ‌دهی"},
    L54_2: { eng: "indicators_vrin_level" },

    L55_1: { eng: "indicators_lie_scale_value", fa: "مطلوب‌نمایی گویه‌ای"},
    L55_2: { eng: "indicators_lie_scale_level" },

    L56_1: { eng: "indicators_defensiveness_scale_value", fa: "مطلوب‌نمایی مولفه‌ای"},
    L56_2: { eng: "indicators_defensiveness_scale_level" },

    L57_1: { eng: "indicators_midpoint_responses_value", fa: "احتیاط در پاسخ"},
    L57_2: { eng: "indicators_midpoint_responses_level" },

    L60_1: { eng: "indicators_validity_median_value", fa: "بیش از ۲۰ پاسخ میانه", length: 116},
    L60_2: { eng: "indicators_validity_median_error" },
  };

  profileSpec = {
    /* "sample" determines some important info about the sample and profile */
    /* Default prerequisites: 1. gender, 2. age, 3. education */
    /* "prerequisites" is synonym to "fields" in our program */
    sample: {
      name: "پرسشنامه شخصیت ۲۰۲۵ - فرم کوتاه" /* Name of the sample */,
      multiProfile: false /* Whether the sample has multiple profiles or not */,
      questions: false /* Determines whether to get questions from inital dataset or not */,
      defaultFields: true /* Determines whether to have default prerequisites in the profile or not */,
      fields: [] /* In case you want to get some additional fields and show in the profile */,
    },
    /* "profile" determines the dimensions of the drawn profile (to be used in svg tag viewbox) */
    /* calculating its dimensions carefully is of great importance */
    profile: {
      get dimensions() {
        return {
          width: 800 + 2 * this.padding.x,
          height: 529 + 2 * this.padding.y,
        };
      },
      padding: {
        x: 52,
        y: 93,
      },
    },
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
    const groups = new FG(dataset.score.slice(0, 24)).generate()
    const ind = dataset.score.slice(24, 32)
    const indicators = []
    for(let i = 0; i < ind.length; i += 2){
      const indicator = ind[i]
      const level = ind[i + 1]
      indicators.push({
        ...indicator,
        mark : indicator.mark ?? 0,
        level: level.mark,
        levelText: labels[level.mark]
      })
    }
    indicators.reverse()
    const validityList = dataset.score.slice(32, 34)
    let validities = []
    for(let i = 0; i < validityList.length; i += 2){
      const validity = validityList[i]
      const error = validityList[i + 1]
      if(error.mark === undefined || error.mark === null) continue
      validities.push({
        error: validity.label.fa,
        length: validity.label.length
      })
    }
    let start = 0
    validities = validities.map((v,i) => {
      const result ={
        ...v,
        start,
        last: validities.length - 1 === i
      }
      start += v.length + 54
      return result
    })
    const groupList = Object.values(groups).map(r => ({...r, length: r.subs.length}))
    return [
      { page: 1, titleAppend: '', groups: groupList, colors, indicators: indicators, validityErrors: validities  }
    ];
  }
}
class FG {
  factors = {};
  _result = {};
  _current = "";
  _index = -1;
  constructor(factors) {
    this.factors = factors;
  }

  generate() {
    let common = {};
    let sKey = "";
    let gKey = ''
    for (const factor of this.factors) {
      const parse = this.parse(factor);
      const [key, sub, group, isGroup] = parse;
      if (key !== sKey) {
        this.current(group);
        if(gKey !== ''){
          if(this._result[gKey] === undefined ){
            this._result[gKey] = common;
          }else{
            this._result[gKey].subs.push(common)
          }
        }
        sKey = key;
        gKey = group
        common = { ...this.raw(factor), key: key.toUpperCase()};
        if(isGroup){
          common.subs = []
        }
      } else {
        if (sub === "percentage") {
          const [p, t] = this.percentage(factor);
          common.percentage = p;
          common.percentageText = t;
        } else {
          const [l, t] = this.label(factor);
          common.level = l;
          common.levelText = t;
        }
      }
    }
    if(this._result[gKey] === undefined){
      this._result[gKey] = common
    }else{
      this._result[gKey].subs.push(common)
    }
    return this._result
  }

  raw(factor) {
    return {
      ...factor,
      mark: factor.mark ?? 0,
    };
  }

  percentage(factor) {
    const mark = factor.mark ?? 0;
    return [mark, Math.round(mark * 100)];
  }

  label(factor) {
    return [factor.mark, labels[factor.mark]];
  }

  parse(factor) {
    const [key, sub] = factor?.label?.eng?.replace(/^factors_/, "").split("_");
    const isGroup = !/\d$/.test(key);
    const group = key.replace(/\d$/, "");
    return [key, sub, group, isGroup];
  }
  current(group) {
    if (this._current !== group) {
      this._current = group;
      this._index++;
    }
  }
}

module.exports = FRHPT9A;
