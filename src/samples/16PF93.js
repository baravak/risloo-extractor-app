const gauge = require("../helpers/gauge");
const { Profile } = require("../Profile");
const rowStyle = [
  ['#1D4ED8', 1],
  ['#1D4ED8', 0.9],
  ['#1D4ED8', 0.8],
  ['#1D4ED8', 0.7],

  ['#94A3B8', 1],
  ['#94A3B8', 1],

  ['#0E7490', 0.7],
  ['#0E7490', 0.8],
  ['#0E7490', 0.9],
  ['#0E7490', 1],
]
const alertStyle = {
  valid: {
    primary: '#059669',
    footerGradient: '#10B981',
    headerGradients: ['#D1FAE5', '#ECFDF5'],
    headerUrl: 'url(#valid_header)',
    footerUrl: 'url(#valid_footer)',
  },
  warning: {
    primary: '#CA8A04',
    footerGradient: '#EAB308',
    headerGradients: ['#FEF9C3', '#FEFCE8'],
    headerUrl: 'url(#warning_header)',
    footerUrl: 'url(#warning_footer)',
  },
  invalid: {
    primary: '#DC2626',
    footerGradient: '#EF4444',
    headerGradients: ['#FEE2E2', '#FEF2F2'],
    headerUrl: 'url(#invalid_header)',
    footerUrl: 'url(#invalid_footer)',
  }
}
class _16PF93 extends Profile {
  // Number of pages
  static pages = 1;

  // Labels of the sample
  labels = {
    L1_1: { eng: "a_value", down: "مردم‌گریزی", top: "مردم‌آمیزی" , max: 20},
    L1_2: {eng: "a_raw"},
    L2_1: { eng: "b_value", down: "استدلال عینی", top: "استدلال انتزاعی" , max: 13},
    L2_2: {eng: "b_raw"},
    L3_1: { eng: "c_value", down: "ناپایداری هیجانی", top: "پایداری هیجانی" , max: 26},
    L3_2: {eng: "c_raw"},
    L4_1: { eng: "e_value", down: "سلطه‌پذیری", top: "سلطه‌گری" , max: 26},
    L4_2: {eng: "e_raw"},
    L5_1: { eng: "f_value", down: "دل‌مردگی", top: "سرزندگی" , max: 26},
    L5_2: {eng: "f_raw"},
    L6_1: { eng: "g_value", down: "مصلحت‌گرا", top: "باوجدان" , max: 20},
    L6_2: {eng: "g_raw"},
    L7_1: { eng: "h_value", down: "ترسو", top: "جسور" , max: 26},
    L7_2: {eng: "h_raw"},
    L8_1: { eng: "i_value", down: "یکدنده", top: "حساس" , max: 20},
    L8_2: {eng: "i_raw"},
    L9_1: { eng: "l_value", down: "زودباور", top: "شکاک" , max: 20},
    L9_2: {eng: "l_raw"},
    L10_1: { eng: "m_value", down: "عمل‌گرا", top: "کولی‌باز" , max: 26},
    L10_2: {eng: "m_raw"},
    L11_1: { eng: "n_value", down: "بی‌ظرافت", top: "ظرافت" , max: 20},
    L11_2: {eng: "n_raw"},
    L12_1: { eng: "o_value", down: "اطمینان به خود", top: "مستعد احساس گناه" , max: 26},
    L12_2: {eng: "o_raw"},
    L13_1: { eng: "q1_value", down: "محافظه‌کار", top: "بنیادگرا" , max: 20},
    L13_2: {eng: "q1_raw"},
    L14_1: { eng: "q2_value", down: "متکی به دیگران", top: "مسلط بر خود" , max: 20},
    L14_2: {eng: "q2_raw"},
    L15_1: { eng: "q3_value", down: "اختلال‌مدار", top: "کمال‌گرا" , max: 20},
    L15_2: {eng: "q3_raw"},
    L16_1: { eng: "q4_value", down: "آرام", top: "اضطراب" , max: 26},
    L16_2: {eng: "q4_raw"},
    L17: { eng: "b_count"},
    L18: { eng: "status"},
    L19: { eng: "extraversion", fr: "برون‌گرایی" },
    L20: { eng: "anxiety", fr: "اضطراب" },
    L21: { eng: "flexibility", fr: "یک‌دندگی" },
    L22: { eng: "independence", fr: "استقلال" },
    L23: { eng: "selfcontrol", fr: "کنترل بالا" },
    L24: { eng: "adjustment", fr: "سازگاری" },
    L25: { eng: "leadership", fr: "قدرت رهبری" },
    L26: { eng: "creativity", fr: "خلاقیت" },
  };

  profileSpec = {
    /* "sample" determines some important info about the sample and profile */
    /* Default prerequisites: 1. gender, 2. age, 3. education */
    /* "prerequisites" is synonym to "fields" in our program */
    sample: {
      name: "پرسشنامه شخصیت کتل" /* Name of the sample */,
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
          width: 827 + 2 * this.padding.x,
          height: 694 + 2 * this.padding.y,
        };
      },
      padding: {
        x: 38,
        y: 30,
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

    const factors = []

    for(let i = 0; i < 32; i+= 2){
      const item = dataset.score[i]
      const fi = item.label.eng.split('_')[0]
      factors.push({
        mark: item.mark ?? 0,
        lable: {
          ...item.label,
          eng: fi.toUpperCase(),
          raw: dataset.score[i + 1].mark ?? 0,
          style: rowStyle[Math.max((item.mark ?? 1) - 1, 0)]
        }
      })
    }

    const finalQuestion = dataset.questions[dataset.questions.length - 1]
    const final = {
      mark: parseInt(finalQuestion.user_answered),
      text: finalQuestion.answer.options[parseInt(finalQuestion.user_answered) - 1],
      type: parseInt(finalQuestion.user_answered) === 1 ? 'valid' : 'invalid',
      textType: parseInt(finalQuestion.user_answered) === 1 ? 'معتبر' : 'نامعتبر'
    }
    final.style = alertStyle[final.type]
    const bCount = {
      mark: dataset.score[32].mark,
      type: 'valid',
      text: 'معتبر'
    }
    if(dataset.score[32].mark >= 59){
      bCount.text = 'نامعتبر'
      bCount.type = 'invalid'
    }else if(dataset.score[32].mark >= 30){
      bCount.text = 'تفسیر با احتیاط'
      bCount.type = 'warning'
    }
    bCount.style = alertStyle[bCount.type]
    const secondary = dataset.score.slice(34, 44).map((item, i) => {
      item.value = item.mark.toString().replace('.', ',')
      item.mark = Math.min(Math.max(item.mark, 0), 10)
      item.label.max = 10
      item.circle = gauge(item, -90, 270)
      const row = Math.floor(i / 2)
      const col = i % 2 === 0 ? 1 : 0
      item.position = [col, row]
      return item
    })
    // const pathX = generatePiePath(-90, 0, 36, 10.8);
    return [{ factors, final, bCount, alertStyle, secondary }];
  }
}
module.exports = _16PF93;
