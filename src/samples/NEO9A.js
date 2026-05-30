const { Profile } = require("../Profile");

/* حداکثر نمرهٔ خام هر مولفهٔ اصلی در فرم ۶۰ سؤالی: ۱۲ گویه × ۴ = ۴۸ */
const DOMAIN_MAX = 48;

/* نگاشت سطح (۱..۵) به متن توصیفی (طبق $norm در ScoreNEO9A.php) */
const LEVELS = ["", "خیلی پایین", "پایین", "متوسط", "بالا", "خیلی بالا"];

/* ۵ مولفهٔ اصلی + نام فارسی/حرف انگلیسی */
const DOMAINS = [
  { d: "n", fa: "روان‌آزرده‌گرایی", letter: "N" },
  { d: "e", fa: "برون‌گرایی", letter: "E" },
  { d: "o", fa: "گشودگی", letter: "O" },
  { d: "a", fa: "موافق بودن", letter: "A" },
  { d: "c", fa: "با وجدان بودن", letter: "C" },
];

class NEO9A extends Profile {
  // Number of pages
  static pages = 1;

  // Labels of the sample — هر کلید با label.eng به score[eng] نگاشت می‌شود
  labels = {
    // ---- ۵ مولفهٔ اصلی (نمرهٔ خام + سطح) ----
    N_raw: { eng: "n_raw", fa: "روان‌آزرده‌گرایی", letter: "N", max: DOMAIN_MAX },
    N_lvl: { eng: "n" },
    E_raw: { eng: "e_raw", fa: "برون‌گرایی", letter: "E", max: DOMAIN_MAX },
    E_lvl: { eng: "e" },
    O_raw: { eng: "o_raw", fa: "گشودگی", letter: "O", max: DOMAIN_MAX },
    O_lvl: { eng: "o" },
    A_raw: { eng: "a_raw", fa: "موافق بودن", letter: "A", max: DOMAIN_MAX },
    A_lvl: { eng: "a" },
    C_raw: { eng: "c_raw", fa: "با وجدان بودن", letter: "C", max: DOMAIN_MAX },
    C_lvl: { eng: "c" },

    // ---- اعتبار: فقط سؤالات اعتبار (۶۱/۶۲/۶۳) ----
    VQ1: { eng: "vq_1" },
    VQ2: { eng: "vq_2" },
    VQ3: { eng: "vq_3" },
  };

  profileSpec = {
    /* "sample" determines some important info about the sample and profile */
    sample: {
      name: "پرسشنامه شخصیت نئو ۶۰ سوالی (NEO-FFI-60)" /* Name of the sample */,
      multiProfile: false /* Whether the sample has multiple profiles or not */,
      questions: true /* Determines whether to get questions from inital dataset or not */,
      defaultFields: true /* Determines whether to have default prerequisites in the profile or not */,
      fields: [] /* In case you want to get some additional fields and show in the profile */,
    },
    /* لایهٔ Chart ۸۰۰×۶۷۴ (نمودار در فریم آفست ۳۲،۱۲۸ + کادر اعتبار) → Main ۹۴۳×۷۵۴ */
    profile: {
      get dimensions() {
        return {
          width: 800 + 2 * this.padding.x,
          height: 674 + 2 * this.padding.y,
        };
      },
      padding: {
        x: 71.5,
        y: 40,
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
    const { dataset } = this;
    /* _extractData از score[eng] || ... استفاده می‌کند، پس مقدار ۰ به undefined می‌افتد → همه‌جا ?? 0 */
    const get = (eng) => dataset.score.find((s) => s.label.eng === eng);
    const num = (eng) => get(eng)?.mark ?? 0;

    const items = DOMAINS.map(({ d }) => {
      const { fa, letter, max } = get(`${d}_raw`).label;
      const raw = num(`${d}_raw`);
      const level = num(d);
      const p = raw / max;
      return {
        fa,
        letter,
        mark: raw,
        barW: 500 * p /* محور استاندارد ۰..۱۰۰٪ روی ۵۰۰px */,
        percentage: Math.round(p * 100),
        levelText: LEVELS[level] ?? "-",
      };
    });

    /* ---- اعتبار: فقط بر اساس پاسخ سؤالات اعتبار (۶۱/۶۲/۶۳) ----
       س۶۱ «صادقانه پاسخ دادم» (گزینه‌ها معکوس نیست): مخالفم(۲)/کاملاًمخالفم(۱) → نامعتبر
       س۶۲ «به همه پاسخ دادی؟» و س۶۳ «درست علامت زدی؟»: خیر(۲) → نامعتبر */
    const vq1 = num("vq_1");
    const showRed =
      vq1 === 1 || vq1 === 2 || num("vq_2") === 2 || num("vq_3") === 2;

    return [{ items, showRed }];
  }
}

module.exports = NEO9A;
