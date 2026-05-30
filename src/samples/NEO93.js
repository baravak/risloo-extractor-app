const { Profile } = require("../Profile");

/* حداکثر نمرهٔ خام هر مولفهٔ اصلی: ۴۸ گویه × ۴ = ۱۹۲ */
const DOMAIN_MAX = 192;

/* نگاشت سطح (۱..۵) به متن توصیفی */
const LEVELS = ["", "خیلی پایین", "پایین", "متوسط", "بالا", "خیلی بالا"];

/* حداکثر نمرهٔ خام هر خرده‌مقیاس: ۸ گویه × ۴ = ۳۲ */
const FACET_MAX = 32;

/* ۵ مولفهٔ اصلی + نام/حرف (صفحات ۲/۳: فهرست مقیاس‌ها با خرده‌مقیاس‌هاشان) */
const DOMAINS = [
  { d: "n", fa: "روان‌آزرده‌گرایی", letter: "N" },
  { d: "e", fa: "برون‌گرایی", letter: "E" },
  { d: "o", fa: "گشودگی", letter: "O" },
  { d: "a", fa: "موافق بودن", letter: "A" },
  { d: "c", fa: "با وجدان بودن", letter: "C" },
];

/* نام ۶ خرده‌مقیاس هر مولفه (به ترتیب n1..n6 و ...) */
const FACET_NAMES = {
  n: ["اضطراب", "خصومت", "افسردگی", "کم‌رویی", "تکانش‌گری", "آسیب‌پذیری"],
  e: ["گرم", "معاشرتی", "ابراز وجود", "فعال", "هیجان‌خواهی", "هیجان‌ مثبت"],
  o: ["تخیل", "زیبایی‌شناسی", "احساسات", "کنش‌ها", "دیدگاه‌ها", "ارزش‌ها"],
  a: ["اعتماد", "رک‌گویی", "نوع‌دوستی", "همراهی", "تواضع", "دل‌رحم"],
  c: ["شایستگی", "نظم و ترتیب", "وظیفه‌شناسی", "تلاش برای موفقیت", "خویشتن‌داری", "محتاط"],
};

/* لیبل‌های خرده‌مقیاس‌ها: n1_raw/n1 ... c6_raw/c6 */
const FACET_LABELS = {};
for (const { d } of DOMAINS) {
  for (let i = 1; i <= 6; i++) {
    FACET_LABELS[`${d}${i}_raw`] = { eng: `${d}${i}_raw` };
    FACET_LABELS[`${d}${i}`] = { eng: `${d}${i}` };
  }
}

class NEO93 extends Profile {
  // Number of pages
  static pages = 3;

  // Labels of the sample — هر کلید با label.eng به score[eng] نگاشت می‌شود
  labels = {
    // ---- ۵ مولفهٔ اصلی (صفحه ۱) ----
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

    // ---- اعتبار (کادرهای پایین صفحه ۱) ----
    VQ1: { eng: "vq_1" },
    VQ2: { eng: "vq_2" },
    VQ3: { eng: "vq_3" },
    CO1: { eng: "count_option_1" },
    CO2: { eng: "count_option_2" },
    CO3: { eng: "count_option_3" },
    CO4: { eng: "count_option_4" },
    CO5: { eng: "count_option_5" },
    VO1: { eng: "voption_1" },
    VO2: { eng: "voption_2" },
    VO3: { eng: "voption_3" },
    VO4: { eng: "voption_4" },
    VO5: { eng: "voption_5" },

    // ---- ۳۰ خرده‌مقیاس (صفحات ۲/۳) ----
    ...FACET_LABELS,
  };

  profileSpec = {
    sample: {
      name: "پرسشنامه نئوی ۲۴۰ سؤالی",
      multiProfile: false,
      questions: false,
      defaultFields: true,
      fields: ["marital_status"],
    },
    /* لایهٔ Chart هر صفحه: ۱) ۸۰۰×۶۷۴ (نمودار در فریم آفست ۳۲،۱۲۸ + کادرهای اعتبار)، ۲) ۸۱۱×۶۶۲ (۳ بلوک)، ۳) ۸۱۱×۴۵۵ (۲ بلوک) — همه → Main ۹۴۳×۷۵۴ */
    profile: {
      get dimensions() {
        const [p1, p2, p3] = this.padding;
        return [
          { width: 800 + 2 * p1.x, height: 674 + 2 * p1.y },
          { width: 811 + 2 * p2.x, height: 662 + 2 * p2.y },
          { width: 811 + 2 * p3.x, height: 455 + 2 * p3.y },
        ];
      },
      padding: [
        { x: 71.5, y: 40 },
        { x: 66, y: 46 },
        { x: 66, y: 149.5 },
      ],
    },
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

    const items = ["n", "e", "o", "a", "c"].map((d) => {
      const { fa, letter, max } = get(`${d}_raw`).label;
      const raw = num(`${d}_raw`);
      const level = num(d);
      const p = raw / max;
      const barW = 500 * p; /* محور استاندارد ۰..۱۰۰٪ روی ۵۰۰px */
      return {
        fa,
        letter,
        mark: raw,
        p,
        barW,
        percentage: Math.round(p * 100),
        levelText: LEVELS[level] ?? "-",
      };
    });

    /* ---- اعتبار (طبق مستندات سینا) ----
       انکودینگ: voption_i = ۱ معتبر / ۰ دنبالهٔ تصادفی؛ vq_i = مقدار خام پاسخ سؤال اعتبار */
    const c45 = num("count_option_4") + num("count_option_5");
    const invalidVq =
      num("vq_1") >= 4 /* س۲۴۱ مخالفم(۴)/کاملاًمخالفم(۵) - گزینه‌ها معکوس */ ||
      num("vq_2") === 2 /* س۲۴۲ خیر */ ||
      num("vq_3") === 2; /* س۲۴۳ خیر */
    const invalidMid = num("count_option_3") >= 41; /* «نظری ندارم» */
    const cautionPos = c45 > 150; /* تمایل به پاسخ مثبت */
    const cautionNeg = c45 < 50; /* تمایل به پاسخ منفی */
    const cautionRand = [1, 2, 3, 4, 5].some((i) => num(`voption_${i}`) === 0); /* پاسخ تصادفی */

    const redErrors = [];
    if (invalidVq) redErrors.push({ text: "پاسخ سؤالات اعتبار", length: 105 });
    if (invalidMid) redErrors.push({ text: "تعداد پاسخ‌های «نظری ندارم»", length: 170 });

    const yellowErrors = [];
    if (cautionPos) yellowErrors.push({ text: "احتمال تمایل به پاسخ مثبت", length: 155 });
    if (cautionNeg) yellowErrors.push({ text: "احتمال تمایل به پاسخ منفی", length: 155 });
    if (cautionRand) yellowErrors.push({ text: "احتمال پاسخ تصادفی", length: 105 });

    /* چیدمان افقی شاخص‌ها راست‌به‌چپ + پرچم last برای نقطهٔ جداکننده (الگوی FRHPT93) */
    const layout = (arr) => {
      let start = 0;
      return arr.map((v, i) => {
        const r = { ...v, start, last: i === arr.length - 1 };
        start += v.length + 54;
        return r;
      });
    };

    /* ---- بلوک‌های مقیاس + خرده‌مقیاس (صفحات ۲/۳) ----
       رنگ/پس‌زمینه بر اساس ایندکس سراسری حوزه: زوج = آبی + پس‌زمینهٔ خاکستری، فرد = نیلی + سفید */
    const blocks = DOMAINS.map((dom, gi) => {
      const facets = FACET_NAMES[dom.d].map((fa, fi) => {
        const fraw = num(`${dom.d}${fi + 1}_raw`);
        const fp = fraw / FACET_MAX;
        return {
          fa,
          mark: fraw,
          p: fp,
          barW: fp * 300, // میلهٔ خرده‌مقیاس ۰..۱۰۰٪ روی ۳۰۰px
          percentage: Math.round(fp * 100),
          levelText: LEVELS[num(`${dom.d}${fi + 1}`)] ?? "-",
        };
      });
      const raw = num(`${dom.d}_raw`);
      return {
        letter: dom.letter,
        fa: dom.fa,
        mark: raw,
        percentage: Math.round((raw / 192) * 100),
        isBlue: gi % 2 === 0,
        facets,
      };
    });

    return [
      {
        page: 1,
        titleAppend: "",
        items,
        redErrors: layout(redErrors),
        yellowErrors: layout(yellowErrors),
        showRed: redErrors.length > 0,
        showYellow: yellowErrors.length > 0,
      },
      { page: 2, titleAppend: " - ۲", blocks: blocks.slice(0, 3), gridBottom: 658.5 },
      { page: 3, titleAppend: " - ۳", blocks: blocks.slice(3, 5), gridBottom: 454.5 },
    ];
  }
}

module.exports = NEO93;
