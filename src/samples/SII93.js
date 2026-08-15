const { Profile } = require("../Profile");

const BAR_WIDTH_COEFFICIENT = 125;

const FACTOR_SPECS = [
  {
    key: "realistic",
    title: "واقع‌گرا",
    maxAbs: 114,
    section: "realistic",
    level: "general",
  },
  {
    key: "mechanics_construction",
    title: "مکانیک و ساخت‌وساز",
    maxAbs: 18,
    section: "realistic",
  },
  {
    key: "computer_hardware_electronics",
    title: "سخت‌افزار کامپیوتر و الکترونیک",
    maxAbs: 12,
    section: "realistic",
  },
  { key: "military", title: "امور نظامی", maxAbs: 12, section: "realistic" },
  {
    key: "protective_services",
    title: "خدمات حفاظتی و ایمنی",
    maxAbs: 10,
    section: "realistic",
  },
  {
    key: "nature_agriculture",
    title: "طبیعت و کشاورزی",
    maxAbs: 20,
    section: "realistic",
  },
  {
    key: "athletics",
    title: "فعالیت‌های ورزشی",
    maxAbs: 18,
    section: "realistic",
  },

  {
    key: "investigative",
    title: "جستجوگر",
    maxAbs: 82,
    section: "investigative",
    level: "general",
  },
  { key: "science", title: "علوم", maxAbs: 20, section: "investigative" },
  { key: "research", title: "پژوهش", maxAbs: 20, section: "investigative" },
  {
    key: "medical_science",
    title: "علوم پزشکی",
    maxAbs: 14,
    section: "investigative",
  },
  { key: "mathematics", title: "ریاضیات", maxAbs: 12, section: "investigative" },

  {
    key: "artistic",
    title: "هنری",
    maxAbs: 86,
    section: "artistic",
    level: "general",
  },
  {
    key: "visual_arts_design",
    title: "هنرهای تجسمی و طراحی",
    maxAbs: 16,
    section: "artistic",
  },
  {
    key: "performing_arts",
    title: "هنرهای نمایشی",
    maxAbs: 20,
    section: "artistic",
  },
  {
    key: "writing_mass_communication",
    title: "نویسندگی و ارتباطات جمعی",
    maxAbs: 20,
    section: "artistic",
  },
  {
    key: "culinary_arts",
    title: "هنرهای آشپزی",
    maxAbs: 10,
    section: "artistic",
  },

  {
    key: "social",
    title: "اجتماعی",
    maxAbs: 100,
    section: "social",
    level: "general",
  },
  {
    key: "counseling_helping",
    title: "مشاوره و کمک‌رسانی",
    maxAbs: 22,
    section: "social",
  },
  {
    key: "teaching_education",
    title: "آموزش و تعلیم",
    maxAbs: 18,
    section: "social",
  },
  {
    key: "human_resources_training",
    title: "منابع انسانی و آموزش",
    maxAbs: 8,
    section: "social",
  },
  {
    key: "social_sciences",
    title: "علوم اجتماعی",
    maxAbs: 8,
    section: "social",
  },
  {
    key: "religion_spirituality",
    title: "دین و معنویت",
    maxAbs: 14,
    section: "social",
  },
  {
    key: "healthcare_services",
    title: "خدمات مراقبت سلامت",
    maxAbs: 8,
    section: "social",
  },

  {
    key: "enterprising",
    title: "پیشرو",
    maxAbs: 138,
    section: "enterprising",
    level: "general",
  },
  {
    key: "marketing_advertising",
    title: "بازاریابی و تبلیغات",
    maxAbs: 10,
    section: "enterprising",
  },
  { key: "sales", title: "فروش", maxAbs: 16, section: "enterprising" },
  { key: "management", title: "مدیریت", maxAbs: 12, section: "enterprising" },
  {
    key: "entrepreneurship",
    title: "کارآفرینی",
    maxAbs: 10,
    section: "enterprising",
  },
  {
    key: "politics_public_speaking",
    title: "سیاست و سخنرانی عمومی",
    maxAbs: 18,
    section: "enterprising",
  },
  { key: "law", title: "حقوق", maxAbs: 14, section: "enterprising" },

  {
    key: "conventional",
    title: "قراردادی",
    maxAbs: 60,
    section: "conventional",
    level: "general",
  },
  {
    key: "office_management",
    title: "مدیریت امور اداری",
    maxAbs: 8,
    section: "conventional",
  },
  {
    key: "taxes_accounting",
    title: "مالیات و حسابداری",
    maxAbs: 10,
    section: "conventional",
  },
  {
    key: "programming_information_systems",
    title: "برنامه‌نویسی و سیستم‌های اطلاعاتی",
    maxAbs: 8,
    section: "conventional",
  },
  {
    key: "finance_investing",
    title: "امور مالی و سرمایه‌گذاری",
    maxAbs: 8,
    section: "conventional",
  },

  {
    key: "work_style",
    title: "سبک کاری",
    maxAbs: 56,
    section: "personal_style",
    descriptionLeft:
      "ترجیح کار مستقل؛ علاقه بیشتر به کار با داده‌ها، ایده‌ها یا اشیا؛ معمولاً محتاط‌تر و کم‌تعامل‌تر در محیط کار.",
    descriptionRight:
      "ترجیح کار با افراد؛ علاقه به کمک‌کردن، تعامل و ارتباط؛ معمولاً اجتماعی‌تر و برون‌گراتر در محیط کار.",
  },
  {
    key: "learning_environment",
    title: "محیط یادگیری",
    maxAbs: 90,
    section: "personal_style",
    descriptionLeft:
      "ترجیح یادگیری عملی و تجربی؛ یادگیری از راه انجام‌دادن؛ علاقه بیشتر به آموزش‌های کوتاه‌مدت و مهارت‌محور.",
    descriptionRight:
      "ترجیح محیط دانشگاهی و نظری؛ یادگیری از طریق کتاب، سخنرانی و مطالعه؛ آمادگی برای تحصیل طولانی‌تر و کسب دانش به‌خاطر خود دانش.",
  },
  {
    key: "leadership_style",
    title: "سبک رهبری",
    maxAbs: 32,
    section: "personal_style",
    descriptionLeft:
      "ترجیح انجام شخصی کار؛ عدم تمایل به فرماندهی و هدایت مستقیم؛ ممکن است بیشتر از راه الگو بودن رهبری کند.",
    descriptionRight:
      "راحت در پذیرفتن مسئولیت و هدایت دیگران؛ علاقه به ایجاد انگیزه، آغاز اقدام، بیان نظر و هماهنگ‌کردن فعالیت‌ها.",
  },
  // Figma swaps the next two description cards; keep them with their scoring keys.
  {
    key: "team_orientation",
    title: "گرایش به کار تیمی",
    maxAbs: 20,
    section: "personal_style",
    descriptionLeft: "ترجیح انجام مستقل وظایف؛ علاقه به نقش مشارکت‌کنندهٔ مستقل و حل مسئله به‌تنهایی.",
    descriptionRight: "ترجیح کار تیمی؛ علاقه به همکاری، اهداف مشترک، تبادل نظر و حل مسئله همراه دیگران.",
  },
  {
    key: "risk_taking",
    title: "ریسک‌پذیری",
    maxAbs: 22,
    section: "personal_style",
    descriptionLeft:
      "ترجیح اطمینان، ثبات و تصمیم‌گیری محتاطانه؛ علاقه کمتر به موقعیت‌های نامطمئن و فعالیت‌های هیجان‌انگیز.",
    descriptionRight:
      "علاقه بیشتر به تجربه‌های تازه، ایده‌های بدیع، هیجان و پذیرش فرصت‌های نامطمئن؛ گرایش به تصمیم‌گیری سریع‌تر.",
  },
];

const GENERAL_FACTOR_KEYS = ["realistic", "investigative", "artistic", "social", "enterprising", "conventional"];

const BASIC_INTEREST_PAGE_2 = ["realistic", "investigative", "artistic"];
const BASIC_INTEREST_PAGE_3 = ["social", "enterprising", "conventional"];

const DESCRIPTION_LINES = {
  work_style: {
    left: [
      "ترجیح کار مستقل؛ علاقه بیشتر به کار با داده‌ها،",
      "ایده‌ها یا اشیا؛ معمولاً محتاط‌تر و کم‌تعامل‌تر در",
      "محیط کار.",
    ],
    right: ["ترجیح کار با افراد؛ علاقه به کمک‌کردن، تعامل و", "ارتباط؛ معمولاً اجتماعی‌تر و برون‌گراتر در محیط کار."],
  },
  learning_environment: {
    left: [
      "ترجیح یادگیری عملی و تجربی؛ یادگیری از راه",
      "انجام‌دادن؛ علاقه بیشتر به آموزش‌های کوتاه‌مدت",
      "و مهارت‌محور.",
    ],
    right: [
      "ترجیح محیط دانشگاهی و نظری؛ یادگیری از طریق",
      "کتاب، سخنرانی و مطالعه؛ آمادگی برای تحصیل",
      "طولانی‌تر و کسب دانش به‌خاطر خود دانش.",
    ],
  },
  leadership_style: {
    left: [
      "ترجیح انجام شخصی کار؛ عدم تمایل به فرماندهی",
      "و هدایت مستقیم؛ ممکن است بیشتر از راه الگو",
      "بودن رهبری کند.",
    ],
    right: [
      "راحت در پذیرفتن مسئولیت و هدایت دیگران؛",
      "علاقه به ایجاد انگیزه، آغاز اقدام، بیان نظر و",
      "هماهنگ‌کردن فعالیت‌ها.",
    ],
  },
  team_orientation: {
    left: ["ترجیح انجام مستقل وظایف؛ علاقه به نقش", "مشارکت‌کنندهٔ مستقل و حل مسئله به‌تنهایی."],
    right: ["ترجیح کار تیمی؛ علاقه به همکاری، اهداف مشترک،", "تبادل نظر و حل مسئله همراه دیگران."],
  },
  risk_taking: {
    left: [
      "ترجیح اطمینان، ثبات و تصمیم‌گیری محتاطانه؛",
      "علاقه کمتر به موقعیت‌های نامطمئن و",
      "فعالیت‌های هیجان‌انگیز.",
    ],
    right: [
      "علاقه بیشتر به تجربه‌های تازه، ایده‌های بدیع،",
      "هیجان و پذیرش فرصت‌های نامطمئن؛ گرایش به",
      "تصمیم‌گیری سریع‌تر.",
    ],
  },
};

class SII93 extends Profile {
  static pages = 4;

  static partials = {
    SII93_bipolar_rows: "SII93_bipolar_rows.hbs",
    SII93_summary_card: "SII93_summary_card.hbs",
  };

  labels = Object.fromEntries(
    FACTOR_SPECS.flatMap(({ key }) => [
      [`${key}_raw`, { eng: `${key}_raw` }],
      [`${key}_percentage`, { eng: `${key}_percentage` }],
    ])
  );

  profileSpec = {
    sample: {
      name: "پرسشنامه رغبت‌سنج استرانگ",
      multiProfile: false,
      questions: false,
      defaultFields: true,
      fields: [],
    },
    profile: {
      get dimensions() {
        const [page1, page2, page3, page4] = this.padding;
        return [
          { width: 812 + 2 * page1.x, height: 364 + 2 * page1.y },
          { width: 895 + 2 * page2.x, height: 664 + 2 * page2.y },
          { width: 895 + 2 * page3.x, height: 664 + 2 * page3.y },
          { width: 799 + 2 * page4.x, height: 668 + 2 * page4.y },
        ];
      },
      padding: [
        { x: 45.5, y: 175 },
        { x: 4, y: 25 },
        { x: 4, y: 25 },
        { x: 52, y: 23 },
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
    const scoresByKey = new Map(dataset.score.map((item) => [item.label.eng, item]));
    const rowsByKey = Object.fromEntries(FACTOR_SPECS.map((factor) => [factor.key, buildRow(factor, scoresByKey)]));

    return [
      {
        pageKey: "general-occupational-themes",
        titleAppend: " - ۱",
        items: GENERAL_FACTOR_KEYS.map((key) => rowsByKey[key]),
      },
      {
        pageKey: "basic-interest-scales-ria",
        titleAppend: " - ۲",
        groups: buildGroups(BASIC_INTEREST_PAGE_2, rowsByKey),
      },
      {
        pageKey: "basic-interest-scales-sec",
        titleAppend: " - ۳",
        groups: buildGroups(BASIC_INTEREST_PAGE_3, rowsByKey),
      },
      {
        pageKey: "personal-style-scales",
        titleAppend: " - ۴ - مقیاس‌های سبک شخصی",
        items: FACTOR_SPECS.filter(({ section }) => section === "personal_style").map(({ key }) => rowsByKey[key]),
      },
    ];
  }
}

function buildGroups(groupKeys, rowsByKey) {
  return groupKeys.map((key) => ({
    key,
    title: rowsByKey[key].title,
    summary: rowsByKey[key],
    items: FACTOR_SPECS.filter(({ section, level }) => section === key && level !== "general").map(
      (factor) => rowsByKey[factor.key]
    ),
  }));
}

function buildRow(factor, scoresByKey) {
  const raw = getMark(scoresByKey, `${factor.key}_raw`);
  const percentage = getMark(scoresByKey, `${factor.key}_percentage`);
  const scoreNorm = clamp((2 * raw) / factor.maxAbs, -2, 2);
  const score = roundToOne(scoreNorm);
  const zero = raw === 0;
  const isPositive = raw > 0;
  const isNegative = raw < 0;
  const state = zero ? "zero" : isPositive ? "positive" : "negative";
  const rawDisplay = buildRawDisplay(raw, factor.maxAbs, state);
  const descriptionLines = DESCRIPTION_LINES[factor.key] || { left: [], right: [] };

  return {
    key: factor.key,
    title: factor.title,
    raw,
    percentage,
    maxAbs: factor.maxAbs,
    scoreNorm,
    score,
    scoreText: formatScore(score),
    barW: zero ? 0 : Math.abs(scoreNorm) * BAR_WIDTH_COEFFICIENT,
    barRadius: Math.min(4, (Math.abs(scoreNorm) * BAR_WIDTH_COEFFICIENT) / 2),
    inside: !zero && Math.abs(score) >= 1,
    zero,
    isPositive,
    isNegative,
    state,
    negativeRawText: rawDisplay.negative.text,
    positiveRawText: rawDisplay.positive.text,
    summaryRawText:
      state === "positive"
        ? `${raw} / ${factor.maxAbs}`
        : state === "negative"
        ? `- ${Math.abs(raw)} / - ${factor.maxAbs}`
        : "0",
    rawDisplay,
    descriptionLeft: factor.descriptionLeft || "",
    descriptionRight: factor.descriptionRight || "",
    descriptionLeftLines: descriptionLines.left,
    descriptionRightLines: descriptionLines.right,
  };
}

function getMark(scoresByKey, key) {
  const mark = scoresByKey.get(key)?.mark ?? 0;
  const number = Number(mark);
  return Number.isFinite(number) ? number : 0;
}

function buildRawDisplay(raw, maxAbs, state) {
  const negativeBoundText = `- ${maxAbs}`;
  const positiveBoundText = `${maxAbs}`;
  const resultText = raw < 0 ? `- ${Math.abs(raw)}` : `${raw}`;
  const negativeShowsResult = state !== "positive";
  const positiveShowsResult = state !== "negative";

  return {
    negative: {
      bound: -maxAbs,
      boundText: negativeBoundText,
      result: negativeShowsResult ? raw : null,
      resultText: negativeShowsResult ? resultText : "",
      showResult: negativeShowsResult,
      showSlash: negativeShowsResult,
      active: state === "negative",
      text: negativeShowsResult ? `${negativeBoundText} / ${resultText}` : negativeBoundText,
    },
    positive: {
      bound: maxAbs,
      boundText: positiveBoundText,
      result: positiveShowsResult ? raw : null,
      resultText: positiveShowsResult ? resultText : "",
      showResult: positiveShowsResult,
      showSlash: positiveShowsResult,
      active: state === "positive",
      text: positiveShowsResult ? `${resultText} / ${positiveBoundText}` : positiveBoundText,
    },
  };
}

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function roundToOne(value) {
  const rounded = (Math.sign(value) * Math.round((Math.abs(value) + Number.EPSILON) * 10)) / 10;
  return Object.is(rounded, -0) ? 0 : rounded;
}

function formatScore(value) {
  const absolute = `${Math.abs(value)}`.replace(".", "٬");
  return value < 0 ? `- ${absolute}` : absolute;
}

module.exports = SII93;
