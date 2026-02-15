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
    ['#C7D2FE', '#4338CA', '#4F46E5', '#818CF8'], ['#DDD6FE', '#6D28D9', '#7C3AED', '#A78BFA'],
  ]
}

class FRHPT93 extends Profile {
  // Number of pages
  static pages = 4;

  // Labels of the sample
  labels = {
    L1_1: { eng: "factors_ex_raw", group: true, fa: "برون‌گرایی" },
    L1_2: { eng: "factors_ex_percentage" },
    L1_3: { eng: "factors_ex_level" },

    L2_1: { eng: "factors_ex1_raw", fa: "علاقه به ارتباط با دیگران"}, 
    L2_2: { eng: "factors_ex1_percentage" },
    L2_3: { eng: "factors_ex1_level" },

    L3_1: { eng: "factors_ex2_raw", fa: "توانایی ارتباط با دیگران"},
    L3_2: { eng: "factors_ex2_percentage" },
    L3_3: { eng: "factors_ex2_level" },

    L4_1: { eng: "factors_ex3_raw", fa: "نشاط و سرزندگی اجتماعی"},
    L4_2: { eng: "factors_ex3_percentage" },
    L4_3: { eng: "factors_ex3_level" },

    L5_1: { eng: "factors_ex4_raw", fa: "جسارت و قاطعیت"},
    L5_2: { eng: "factors_ex4_percentage" },
    L5_3: { eng: "factors_ex4_level" },

    L6_1: { eng: "factors_an_raw", group: true, fa: "رگه اضطراب" },
    L6_2: { eng: "factors_an_percentage" },
    L6_3: { eng: "factors_an_level" },

    L7_1: { eng: "factors_an1_raw", fa: "ترس و نگرانی"},
    L7_2: { eng: "factors_an1_percentage" },
    L7_3: { eng: "factors_an1_level" },

    L8_1: { eng: "factors_an2_raw", fa: "اضطراب در روابط اجتماعی"},
    L8_2: { eng: "factors_an2_percentage" },
    L8_3: { eng: "factors_an2_level" },

    L9_1: { eng: "factors_an3_raw", fa: "شک و تردید"},
    L9_2: { eng: "factors_an3_percentage" },
    L9_3: { eng: "factors_an3_level" },

    L10_1: { eng: "factors_an4_raw", fa: "تکانشگری و شتابزدگی"},
    L10_2: { eng: "factors_an4_percentage" },
    L10_3: { eng: "factors_an4_level" },

    L11_1: { eng: "factors_dp_raw", group: true, fa: "رگه افسردگی" },
    L11_2: { eng: "factors_dp_percentage" },
    L11_3: { eng: "factors_dp_level" },

    L12_1: { eng: "factors_dp1_raw", fa: "حزن و اندوه درونی"},
    L12_2: { eng: "factors_dp1_percentage" },
    L12_3: { eng: "factors_dp1_level" },

    L13_1: { eng: "factors_dp2_raw", fa: "افکار گذشته"},
    L13_2: { eng: "factors_dp2_percentage" },
    L13_3: { eng: "factors_dp2_level" },

    L14_1: { eng: "factors_dp3_raw", fa: "بی‌انگیزگی"},
    L14_2: { eng: "factors_dp3_percentage" },
    L14_3: { eng: "factors_dp3_level" },

    L15_1: { eng: "factors_dp4_raw", fa: "احساس بی‌ارزشی"},
    L15_2: { eng: "factors_dp4_percentage" },
    L15_3: { eng: "factors_dp4_level" },

    L16_1: { eng: "factors_ag_raw", group: true, fa: "خشم و پرخاشگری" },
    L16_2: { eng: "factors_ag_percentage" },
    L16_3: { eng: "factors_ag_level" },

    L17_1: { eng: "factors_ag1_raw", fa: "حساس و زودرنج" },
    L17_2: { eng: "factors_ag1_percentage" },
    L17_3: { eng: "factors_ag1_level" },

    L18_1: { eng: "factors_ag2_raw", fa: "کینه و خصومت" },
    L18_2: { eng: "factors_ag2_percentage" },
    L18_3: { eng: "factors_ag2_level" },

    L19_1: { eng: "factors_ag3_raw", fa: "پرخاشگری (کلامی و فیزیکی)" },
    L19_2: { eng: "factors_ag3_percentage" },
    L19_3: { eng: "factors_ag3_level" },

    L20_1: { eng: "factors_ag4_raw", fa: "آشفتگی خانواده مبدأ" },
    L20_2: { eng: "factors_ag4_percentage" },
    L20_3: { eng: "factors_ag4_level" },

    L21_1: { eng: "factors_op_raw", group: true, fa: "گشودگی به تجربه" },
    L21_2: { eng: "factors_op_percentage" },
    L21_3: { eng: "factors_op_level" },

    L22_1: { eng: "factors_op1_raw", fa: "ریسک‌پذیری" },
    L22_2: { eng: "factors_op1_percentage" },
    L22_3: { eng: "factors_op1_level" },

    L23_1: { eng: "factors_op2_raw", fa: "هیجان‌خواهی" },
    L23_2: { eng: "factors_op2_percentage" },
    L23_3: { eng: "factors_op2_level" },

    L24_1: { eng: "factors_op3_raw", fa: "تخیل" },
    L24_2: { eng: "factors_op3_percentage" },
    L24_3: { eng: "factors_op3_level" },

    L25_1: { eng: "factors_op4_raw", fa: "خلاقیت" },
    L25_2: { eng: "factors_op4_percentage" },
    L25_3: { eng: "factors_op4_level" },

    L26_1: { eng: "factors_af_raw", group: true, fa: "عاطفه" },
    L26_2: { eng: "factors_af_percentage" },
    L26_3: { eng: "factors_af_level" },

    L27_1: { eng: "factors_af1_raw", fa: "تجربه شدید احساسات" },
    L27_2: { eng: "factors_af1_percentage" },
    L27_3: { eng: "factors_af1_level" },

    L28_1: { eng: "factors_af2_raw", fa: "عاطفه درون‌سو" },
    L28_2: { eng: "factors_af2_percentage" },
    L28_3: { eng: "factors_af2_level" },

    L29_1: { eng: "factors_af3_raw", fa: "عاطفه برون‌سو" },
    L29_2: { eng: "factors_af3_percentage" },
    L29_3: { eng: "factors_af3_level" },

    L30_1: { eng: "factors_af4_raw", fa: "زیبا دوستی" },
    L30_2: { eng: "factors_af4_percentage" },
    L30_3: { eng: "factors_af4_level" },

    L31_1: { eng: "factors_co_raw", group: true, fa: "وظیفه‌شناسی" },
    L31_2: { eng: "factors_co_percentage" },
    L31_3: { eng: "factors_co_level" },

    L32_1: { eng: "factors_co1_raw", fa: "وظیفه‌شناسی در اهداف" },
    L32_2: { eng: "factors_co1_percentage" },
    L32_3: { eng: "factors_co1_level" },

    L33_1: { eng: "factors_co2_raw", fa: "مسئولیت‌پذیری و قانون‌مداری" },
    L33_2: { eng: "factors_co2_percentage" },
    L33_3: { eng: "factors_co2_level" },

    L34_1: { eng: "factors_co3_raw", fa: "توجه به نظم و جزئیات" },
    L34_2: { eng: "factors_co3_percentage" },
    L34_3: { eng: "factors_co3_level" },

    L35_1: { eng: "factors_co4_raw", fa: "تلاش و پشتکار اجرایی" },
    L35_2: { eng: "factors_co4_percentage" },
    L35_3: { eng: "factors_co4_level" },

    L36_1: { eng: "factors_fl_raw", group: true, fa: "انعطاف‌پذیری" },
    L36_2: { eng: "factors_fl_percentage" },
    L36_3: { eng: "factors_fl_level" },

    L37_1: { eng: "factors_fl1_raw", fa: "کنار آمدن با سختی‌ها" },
    L37_2: { eng: "factors_fl1_percentage" },
    L37_3: { eng: "factors_fl1_level" },

    L38_1: { eng: "factors_fl2_raw", fa: "سازگاری با اطرافیان" },
    L38_2: { eng: "factors_fl2_percentage" },
    L38_3: { eng: "factors_fl2_level" },

    L39_1: { eng: "factors_fl3_raw", fa: "انعطاف در روش‌ها" },
    L39_2: { eng: "factors_fl3_percentage" },
    L39_3: { eng: "factors_fl3_level" },

    L40_1: { eng: "factors_fl4_raw", fa: "انعطاف در دیدگاه" },
    L40_2: { eng: "factors_fl4_percentage" },
    L40_3: { eng: "factors_fl4_level" },

    L41_1: { eng: "factors_sp_raw", group: true, fa: "معنویت و دینداری" },
    L41_2: { eng: "factors_sp_percentage" },
    L41_3: { eng: "factors_sp_level" },

    L42_1: { eng: "factors_sp1_raw", fa: "دلبستگی به خدا" },
    L42_2: { eng: "factors_sp1_percentage" },
    L42_3: { eng: "factors_sp1_level" },

    L43_1: { eng: "factors_sp2_raw", fa: "نگرش‌های مثبت معنوی" },
    L43_2: { eng: "factors_sp2_percentage" },
    L43_3: { eng: "factors_sp2_level" },

    L44_1: { eng: "factors_sp3_raw", fa: "عملکرد مذهبی" },
    L44_2: { eng: "factors_sp3_percentage" },
    L44_3: { eng: "factors_sp3_level" },

    L45_1: { eng: "factors_un_raw", group: true, fa: "توانایی شناختی" },
    L45_2: { eng: "factors_un_percentage" },
    L45_3: { eng: "factors_un_level" },

    L46_1: { eng: "factors_un1_raw", fa: "هوش" },
    L46_2: { eng: "factors_un1_percentage" },
    L46_3: { eng: "factors_un1_level" },

    L47_1: { eng: "factors_un2_raw", fa: "قدرت تجزیه و تحلیل" },
    L47_2: { eng: "factors_un2_percentage" },
    L47_3: { eng: "factors_un2_level" },

    L48_1: { eng: "factors_un3_raw", fa: "تلاش و پشتکار علمی" },
    L48_2: { eng: "factors_un3_percentage" },
    L48_3: { eng: "factors_un3_level" },

    L49_1: { eng: "factors_un4_raw", fa: "افکار عجیب و غریب" },
    L49_2: { eng: "factors_un4_percentage" },
    L49_3: { eng: "factors_un4_level" },

    L50x_1: { eng: "factors_mo_raw", group: true, fa: "ابعاد انگیزه" },
    L50x_2: { eng: "factors_mo_percentage" },
    L50x_3: { eng: "factors_mo_level" },

    L50_1: { eng: "factors_mo1_raw", fa: "انگیزه خودشکوفایی" },
    L50_2: { eng: "factors_mo1_percentage" },
    L50_3: { eng: "factors_mo1_level" },

    L51_1: { eng: "factors_mo2_raw", fa: "نیاز به محبت و احترام" },
    L51_2: { eng: "factors_mo2_percentage" },
    L51_3: { eng: "factors_mo2_level" },

    L52_1: { eng: "factors_mo3_raw", fa: "نیاز به رفاه و رشد اقتصادی" },
    L52_2: { eng: "factors_mo3_percentage" },
    L52_3: { eng: "factors_mo3_level" },

    L53_1: { eng: "factors_mo4_raw", fa: "نیاز به قدرت و برتری" },
    L53_2: { eng: "factors_mo4_percentage" },
    L53_3: { eng: "factors_mo4_level" },

    L54_1: { eng: "indicators_vrin_value", fa: "دقت در پاسخ‌دهی"},
    L54_2: { eng: "indicators_vrin_level" },

    L55_1: { eng: "indicators_lie_scale_value", fa: "مطلوب‌نمایی گویه‌ای"},
    L55_2: { eng: "indicators_lie_scale_level" },

    L56_1: { eng: "indicators_defensiveness_scale_value", fa: "مطلوب‌نمایی مولفه‌ای"},
    L56_2: { eng: "indicators_defensiveness_scale_level" },

    L57_1: { eng: "indicators_midpoint_responses_value", fa: "احتیاط در پاسخ"},
    L57_2: { eng: "indicators_midpoint_responses_level" },

    L58_1: { eng: "indicators_validity_identical_value", fa: "بیش از ۱۶۵ پاسخ یکسان", length: 128},
    L58_2: { eng: "indicators_validity_identical_error" },

    L59_1: { eng: "indicators_validity_consecutive_value", fa: "بیش از ۳۹ پاسخ متوالی یکسان", length: 162},
    L59_2: { eng: "indicators_validity_consecutive_error" },

    L60_1: { eng: "indicators_validity_median_value", fa: "بیش از ۳۰ پاسخ میانه", length: 116},
    L60_2: { eng: "indicators_validity_median_error" },
  };

  profileSpec = {
    /* "sample" determines some important info about the sample and profile */
    /* Default prerequisites: 1. gender, 2. age, 3. education */
    /* "prerequisites" is synonym to "fields" in our program */
    sample: {
      name: "پرسشنامه شخصیت ۲۰۲۵ - فرم بلند" /* Name of the sample */,
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
          height: 657 + 2 * this.padding.y,
        };
      },
      padding: {
        x: 52,
        y: 29,
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
    const groups = new FG(dataset.score.slice(0, 162)).generate()
    const ind = dataset.score.slice(162, 170)
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
    const validityList = dataset.score.slice(170, 179)
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
      { page: 1, titleAppend:' - 1', groups: groupList, colors, indicators: indicators, validityErrors: validities  }, 
      { page: 2, titleAppend:' - 2', groups: groupList.slice(0, 4).map(rowMap), colors  },
      { page: 3, titleAppend:' - 3', groups: groupList.slice(4, 8).map(rowMap), colors  },
      { page: 4, titleAppend:' - 4', groups: groupList.slice(8, 12).map(rowMap), colors  },
    ];
  }
}
function rowMap(r, i){
  return {
    ...r,
    color: i % 2 === 0 ? colors.bars[0] : colors.bars[1],
    bg: `url(#${i % 2 === 0 ? 'bgbar1' : 'bgbar2'})`
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
    this._result[gKey].subs.push(common)
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

module.exports = FRHPT93;
