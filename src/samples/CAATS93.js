const { Profile, Mappings } = require("../Profile");
const GMIT93 = require("./GMIT93");
const RIASEC93 = require("./RIASEC93");
const _16PF = require("./16PF93");

class CAATS93 extends Profile {
  // Number of pages
  static pages = 1;

  // Labels of the sample
  labels = {
    L1: { eng: "mbti_I", fr: "I" },
    L2: { eng: "mbti_S", fr: "S" },
    L3: { eng: "mbti_F", fr: "F" },
    L4: { eng: "mbti_P", fr: "P" },
    L5: { eng: "mbti_E", fr: "E" },
    L6: { eng: "mbti_N", fr: "N" },
    L7: { eng: "mbti_T", fr: "T" },
    L8: { eng: "mbti_J", fr: "J" },
    L9: { eng: "mbti_report", fr: "گزارش نهایی" },
    L10: { eng: "raven_iq", fr: "نمره ریون" },
    L11: { eng: "raven_level", fr: "سطح ریون" },
    L12: { eng: "gmit_linguistic", fr: "زبانی - کلامی" },
    L13: { eng: "gmit_logical_mathematical", fr: "منطقی - ریاضی" },
    L14: { eng: "gmit_visual_spatial", fr: "دیداری - فضایی" },
    L15: { eng: "gmit_bodily_kinesthetic", fr: "بدنی - جنبشی" },
    L16: { eng: "gmit_interpersonal", fr: "میان‌فردی" },
    L17: { eng: "gmit_intrapersonal", fr: "درون‌فردی" },
    L18: { eng: "gmit_musical", fr: "موسیقیایی" },
    L19: { eng: "gmit_naturalist", fr: "طبیعت‌گرا" },
    L20: { eng: "riasec_realistic", fr: "واقع‌گرا (و)" },
    L21: { eng: "riasec_investigative", fr: "جستجوگر (ج)" },
    L22: { eng: "riasec_artistic", fr: "هنری (ه)" },
    L23: { eng: "riasec_social", fr: "اجتماعی (الف)" },
    L24: { eng: "riasec_enterprising", fr: "متهور (م)" },
    L25: { eng: "riasec_conventional", fr: "قراردادی (ق)" },
    L26: { eng: "16pf_a", fr: "A", right: "مردم‌گریزی", left: "مردم‌آمیزی" },
    L27: { eng: "16pf_b", fr: "B", right: "استدلال عینی", left: "استدلال انتزاعی" },
    L28: { eng: "16pf_c", fr: "C", right: "ناپایداری هیجانی", left: "پایداری هیجانی" },
    L29: { eng: "16pf_e", fr: "E", right: "سلطه‌پذیری", left: "سلطه‌گری" },
    L30: { eng: "16pf_f", fr: "F", right: "دل‌مردگی", left: "سرزندگی" },
    L31: { eng: "16pf_g", fr: "G", right: "مصلحت‌گرا", left: "باوجدان" },
    L32: { eng: "16pf_h", fr: "H", right: "ترسو", left: "جسور" },
    L33: { eng: "16pf_i", fr: "I", right: "یکدنده", left: "حساس" },
    L34: { eng: "16pf_l", fr: "L", right: "زودباور", left: "شکاک" },
    L35: { eng: "16pf_m", fr: "M", right: "عمل‌گرا", left: "کولی‌باز" },
    L36: { eng: "16pf_n", fr: "N", right: "بی‌ظرافت", left: "ظرافت" },
    L37: { eng: "16pf_o", fr: "O", right: "اطمینان به خود", left: "مستعد احساس گناه" },
    L38: { eng: "16pf_q1", fr: "Q1", right: "باز بودن نسبت به تغییر", left: "بنیادگرا" },
    L39: { eng: "16pf_q2", fr: "Q2", right: "متکی بر خود", left: "مسلط به دیگران" },
    L40: { eng: "16pf_q3", fr: "Q3", right: "اختلال‌مدار", left: "کمال‌گرا" },
    L41: { eng: "16pf_q4", fr: "Q4", right: "آرام", left: "اضطراب" },
    L42: { eng: "16pf_extraversion", fr: "برون‌گرایی" },
    L43: { eng: "16pf_anxiety", fr: "اضطراب" },
    L44: { eng: "16pf_flexibility", fr: "یک‌دندگی" },
    L45: { eng: "16pf_independence", fr: "استقلال" },
    L46: { eng: "16pf_selfcontrol", fr: "کنترل بالا" },
    L47: { eng: "16pf_adjustment", fr: "سازگاری" },
    L48: { eng: "16pf_leadership", fr: "قدرت رهبری" },
    L49: { eng: "16pf_creativity", fr: "خلاقیت" },
    L50: { eng: "16pf_status", fr: "وضعیت" },
  };

  profileSpec = {
    /* "sample" determines some important info about the sample and profile */
    /* Default prerequisites: 1. gender, 2. age, 3. education */
    /* "prerequisites" is synonym to "fields" in our program */
    sample: {
      name: "پرسشنامه تجمیعی اعتبار سنجی" /* Name of the sample */,
      multiProfile: false /* Whether the sample has multiple profiles or not */,
      questions: true /* Determines whether to get questions from inital dataset or not */,
      defaultFields: true /* Determines whether to have default prerequisites in the profile or not */,
      fields: ["marital_status"] /* In case you want to get some additional fields and show in the profile */,
    },
    /* "profile" determines the dimensions of the drawn profile (to be used in svg tag viewbox) */
    /* calculating its dimensions carefully is of great importance */
    profile: {
      get dimensions() {
        return {
          width: 902 + 2 * this.padding.x,
          height: 714 + 2 * this.padding.y,
        };
      },
      padding: {
        x: 0,
        y: 0,
      },
    },
    ravenItem: {
      stops: [0, 65, 77, 89, 113, 125, 149],
      interprets: [
        { level: 0, title: "عقب‌مانده" },
        { level: 1, title: "عقب‌مانده\nمرزی" },
        { level: 2, title: "کودن" },
        { level: 3, title: "متوسط" },
        { level: 4, title: "ممتاز" },
        { level: 5, title: "بسیار ممتاز" },
        { level: 6, title: "حدود نابغه" },
      ],
      widthCoeff: 2.5,
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
      spec: { parameters: spec },
      dataset,
    } = this;

    const { ravenItem: ravenItemSpec } = spec;

    const [GMIT_Context] = new GMIT93(
      { score: Object.fromEntries(dataset.score.slice(11, 19).map((s) => [s.label.eng, s.mark])) },
      {},
      {
        items: {
          offsetY: 7,
          offsetX: 55,
          ticks: {
            heightOffset: 10,
            numberOffset: { x: 3, y: 0 },
          },
          rect: { height: 10 },
          widthCoeff: 7,
          label: { offsetX: 5 },
        },
        labelsPrefix: "gmit",
      }
    ).getTemplateEngineParams();

    const [RIASEC_Context] = new RIASEC93(
      {
        items: dataset.questions.slice(558),
        score: Object.fromEntries(dataset.score.slice(19, 25).map((s) => [s.label.eng, s.mark])),
      },
      {},
      {
        items: {
          offsetY: 19,
          rect: {
            base: {
              height: 2,
            },
            body: {
              height: 4,
            },
            widthCoeff: 3.5,
          },
        },
        labelsPrefix: "riasec",
      }
    ).getTemplateEngineParams();

    const MBTI_Context = {
      items: dataset.score.slice(0, 8).map((data) => ({
        label: data.label,
        mark: data.mark,
        height: data.mark * 10,
        active: data.mark >= 8,
      })),
      report: dataset.score[8].mark,
    };

    const RAVEN_Context = {
      item: {
        mark: dataset.score[9].mark,
        width:
          dataset.score[9].mark >= ravenItemSpec.stops[1]
            ? 45 + (dataset.score[9].mark - ravenItemSpec.stops[1]) * ravenItemSpec.widthCoeff
            : dataset.score[9].mark * 0.69,
        level: dataset.score[10].mark,
        stops: ravenItemSpec.stops.map((stop) => ({
          mark: stop,
          width:
            stop >= ravenItemSpec.stops[1]
              ? 45 + (stop - ravenItemSpec.stops[1]) * ravenItemSpec.widthCoeff
              : stop * 0.69,
        })),
      },
    };

    const [_16PF_Context] = new _16PF(
      {
        score: Object.fromEntries(dataset.score.slice(25).map((s) => [s.label.eng, s.mark])),
        fields: dataset.info.fields,
      },
      {},
      {
        items: {
          offsetY: 19,
          widthCoeff: 9,
          label: {
            offsetX: 9,
          },
        },
        gaugeItems: {
          offsetX: 46,
          circle: {
            R: 16.5,
            r: 12,
          },
        },
        labelsPrefix: "16pf",
      }
    ).getTemplateEngineParams();

    return [{ GMIT_Context, RIASEC_Context, MBTI_Context, _16PF_Context, RAVEN_Context }];
  }
}

module.exports = CAATS93;
