const { Profile } = require("../Profile");
const rowStyle = [
  ['#1D4ED8', 1],
  ['#1D4ED8', 0.9],
  ['#1D4ED8', 0.8],
  ['#1D4ED8', 0.7],

  ['#94A3B8', 0.8],
  ['#D1D5DB', 1],
  ['#94A3B8', 0.8],

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
class _16PF9A extends Profile {
  // Number of pages
  static pages = 1;

  // Labels of the sample
  labels = {
    L1_1: { eng: "a_value", down: "سردبرخورد - قاطع - بی‌تفاوت", top: "گرم‌برخورد - اهل معاشرت - اجتماعی" , title: "گرم‌برخوردی", max: 20},
    L1_2: {eng: "a_raw"},
    L2_1: { eng: "b_value", down: "عینی - سرعت یادگیری پایین", top: "انتزاعی - سرعت یادگیری بالا" , title: "هوش کلی", max: 13},
    L2_2: {eng: "b_raw"},
    L3_1: { eng: "c_value", down: "ثبات هیجانی پایین - بی‌توجه", top: "ثبات هیجانی بالا - پخته - واقع‌نگر" , title: "پایداری هیجانی", max: 26},
    L3_2: {eng: "c_raw"},
    L4_1: { eng: "e_value", down: "سلطه‌پذیر - وابسته - ملایم", top: "سلطه‌گر - روحیه‌ی مستقل - خشن" , title: "سلطه", max: 26},
    L4_2: {eng: "e_raw"},
    L5_1: { eng: "f_value", down: "جدی - دل‌مرده - محتاط", top: "سرزنده - پرشور - پرحرف" , title: "سرزندگی", max: 26},
    L5_2: {eng: "f_raw"},
    L6_1: { eng: "g_value", down: "پایبندی پایین - ناپایدار", top: "قانون‌مدار - وظیفه‌شناس" , title: "پایبندی به قوانین", max: 20},
    L6_2: {eng: "g_raw"},
    L7_1: { eng: "h_value", down: "کم‌رو", top: "اهل ریسک - باجسارت" , title: "ریسک اجتماعی", max: 26},
    L7_2: {eng: "h_raw"},
    L8_1: { eng: "i_value", down: "خودکفا - متواضع - واقع‌نگر", top: "بی‌صبر - متوقع - خیال‌باف" , title: "حساسیت هیجانی", max: 20},
    L8_2: {eng: "i_raw"},
    L9_1: { eng: "l_value", down: "اعتمادبرانگیز", top: "بی‌اعتماد - بدبین" , title: "اعتماد اجتماعی", max: 20},
    L9_2: {eng: "l_raw"},
    L10_1: { eng: "m_value", down: "اهل عمل", top: "غرق در افکار - کم‌اطمینان" , title: "عملگرایی", max: 26},
    L10_2: {eng: "m_raw"},
    L11_1: { eng: "n_value", down: "زمخت", top: "زیرک - هشیاری اجتماعی" , title: "ظرافت", max: 20},
    L11_2: {eng: "n_raw"},
    L12_1: { eng: "o_value", down: "آرام - اطمینان به خود", top: "بیمناک - اضطراب ناشی از احساس گناه" , title: "احساس گناه", max: 26},
    L12_2: {eng: "o_raw"},
    L13_1: { eng: "q1_value", down: "محافظه‌کار", top: "رادیکال" , title: "گشودگی به تغییر", max: 20},
    L13_2: {eng: "q1_raw"},
    L14_1: { eng: "q2_value", down: "گروه‌مدار - تابع آداب", top: "خودکفا - مصمم - خوش‌فکر" , title: "متکی به خود", max: 20},
    L14_2: {eng: "q2_raw"},
    L15_1: { eng: "q3_value", down: "فاقد تصویر روشن از خود", top: "هشیار نسبت به خود" , title: "سازگاری", max: 20},
    L15_2: {eng: "q3_raw"},
    L16_1: { eng: "q4_value", down: "آرام - خوددار", top: "انرژی بالا - تنش عصبی" , title: "تنش", max: 26},
    L16_2: {eng: "q4_raw"},
    L17: { eng: "b_count"},
    L18: { eng: "status"},
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
          width: 826 + 2 * this.padding.x,
          height: 694 + 2 * this.padding.y,
        };
      },
      padding: {
        x: 39,
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
          style: rowStyle[item.mark ?? 0]
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
    return [{ factors, final, bCount, alertStyle }];
  }
}

module.exports = _16PF9A;
