const { Profile } = require("../Profile");

const INSIDE_THRESHOLD = 25;
const MAIN_INSIDE_SCORE_GAP = 2;
const FACET_INSIDE_SCORE_GAP = 6;
const OUTSIDE_SCORE_GAP = 6;

const PERSONALITY = [
  { key: "1", code: "1", fa: "اسکیزوئید" },
  { key: "2a", code: "2A", fa: "اجتنابی" },
  { key: "2b", code: "2B", fa: "افسرده" },
  { key: "3", code: "3", fa: "وابسته" },
  { key: "4a", code: "4A", fa: "نمایشی" },
  { key: "4b", code: "4B", fa: "آشفته" },
  { key: "5", code: "5", fa: "خودشیفته" },
  { key: "6a", code: "6A", fa: "ضداجتماعی" },
  { key: "6b", code: "6B", fa: "دیگرآزار" },
  { key: "7", code: "7", fa: "جبری" },
  { key: "8a", code: "8A", fa: "منفی‌گرا" },
  { key: "8b", code: "8B", fa: "خودآزار" },
  { key: "s", code: "S", fa: "اسکیزوتایپال" },
  { key: "c", code: "C", fa: "مرزی" },
  { key: "p", code: "P", fa: "پارانوئید" },
];

const CLINICAL = [
  { key: "a", code: "A", fa: "اضطراب تعمیم‌یافته" },
  { key: "h", code: "H", fa: "علائم جسمانی" },
  { key: "n", code: "N", fa: "طیف دوقطبی" },
  { key: "d", code: "D", fa: "افسردگی مداوم" },
  { key: "b", code: "B", fa: "مصرف الکل" },
  { key: "t", code: "T", fa: "مصرف مواد" },
  { key: "r", code: "R", fa: "استرس پس از ضربه" },
  { key: "ss", code: "SS", fa: "طیف اسکیزوفرنیا" },
  { key: "cc", code: "CC", fa: "افسردگی اساسی" },
  { key: "pp", code: "PP", fa: "اختلال هذیانی" },
];

const MODIFYING = [
  { key: "x", code: "X", fa: "افشا" },
  { key: "y", code: "Y", fa: "مطلوبیت" },
  { key: "z", code: "Z", fa: "منفی‌نمایی" },
];

const FACET_NAMES = {
  1: ["غیرتعاملی", "از نظر درونی کم‌مایه", "از نظر خلق و خوی بی‌احساس"],
  "2a": ["رویگردان از روابط بین‌فردی", "خودپنداره احساس عدم تعلق", "از نظر درونی آزرده"],
  "2b": ["از نظر شناختی جبرگرا", "خود بی‌ارزش پنداری", "از نظر خلق ماتم‌زده"],
  3: ["نمودهای نابالغانه رفتاری", "از نظر بین‌فردی مطیع", "بی‌عرضه‌پنداری خود"],
  "4a": ["به‌طور چشم‌گیری نمایشی", "از نظر بین‌فردی در جست‌وجوی توجه", "از نظر خلق ناپایدار"],
  "4b": ["به وضوح تند و شتابزده", "از نظر بین‌فردی بی‌پروا", "خودبزرگ‌پنداری"],
  5: ["از نظر بین‌فردی استثمارگر", "از نظر ذهنی مهار نشده", "تصویری ستودنی از خود"],
  "6a": ["مسئولیت‌ناپذیر در روابط اجتماعی", "خودمختار پنداری", "برون‌ریزی شدید"],
  "6b": ["بیان تند و آزارنده", "کینه‌توز در روابط بین‌فردی", "منش انفجاری"],
  7: ["شدیداً منضبط", "از نظر شناختی خشک و ریزبین", "مطمئن به خود"],
  "8a": ["بسیار تلخ و گزنده", "ناراضی از خود", "از نظر خلقی تحریک‌پذیر"],
  "8b": ["خود نالایق‌پنداری", "منش متضاد (در تجربه لذت و درد)", "از نظر خلقی ملول"],
  s: ["از نظر شناختی غیرعادی", "خودپنداره عجیب‌غریب", "از نظر درونی درهم"],
  c: ["خودپنداره ناپایدار", "از نظر ساختار روانی دونیمه", "خلق بی‌ثبات"],
  p: ["داشتن حالت تدافعی", "از نظر شناختی بی‌اعتماد", "فرافکنی مداوم"],
};

const NOTEWORTHY = [
  { key: "ad", code: "AD", fa: "اختلال نقص‌توجه بیش‌فعالی بزرگسالان" },
  { key: "as", code: "AS", fa: "طیف اتیسم" },
  { key: "ca", code: "CA", fa: "سوءاستفاده کودکی" },
  { key: "ea", code: "EA", fa: "اختلالات خوردن" },
  { key: "em", code: "EM", fa: "عدم کنترل هیجانی" },
  { key: "ex", code: "EX", fa: "خشم انفجاری" },
  { key: "hp", code: "HP", fa: "دل‌مشغولی سلامتی" },
  { key: "ia", code: "IA", fa: "بیگانگی با دیگران" },
  { key: "pd", code: "PD", fa: "سوءمصرف داروهای تجویزی" },
  { key: "sp", code: "SP", fa: "پتانسیل خود تخریبی" },
  { key: "sb", code: "SB", fa: "رفتارها / تمایلات خودآسیبی" },
  { key: "tb", code: "TB", fa: "آسیب تروماتیک مغز" },
  { key: "vp", code: "VP", fa: "تمایل به انتقام جویی" },
];

const THEMES = {
  blue: {
    gradient: "mcmBlue",
    track: "#EFF6FF",
    light: "#93C5FD",
    dark: "#2563EB",
    text: "#1E40AF",
    cardText: "#1E40AF",
    card: "#EFF6FF",
    stroke: "#BFDBFE",
    divider: "#DBEAFE",
  },
  gray: {
    gradient: "mcmGray",
    track: "#F8FAFC",
    light: "#E2E8F0",
    dark: "#475569",
    text: "#475569",
    cardText: "#475569",
    card: "#F8FAFC",
    stroke: "#E2E8F0",
    divider: "#F1F5F9",
  },
  zinc: {
    gradient: "mcmZinc",
    track: "#FAFAFA",
    dark: "#475569",
    text: "#475569",
  },
  yellow: {
    gradient: "mcmYellow",
    track: "#FEFCE8",
    light: "#FEF08A",
    dark: "#EAB308",
    text: "#EAB308",
    cardText: "#EAB308",
    card: "#FEFCE8",
    stroke: "#FEF08A",
    divider: "#FEF9C3",
  },
  orange: {
    gradient: "mcmOrange",
    track: "#FFF7ED",
    light: "#FDBA74",
    dark: "#EA580C",
    text: "#EA580C",
    cardText: "#EA580C",
    card: "#FFF7ED",
    stroke: "#FED7AA",
    divider: "#FFEDD5",
  },
  rose: {
    gradient: "mcmRose",
    track: "#FFF1F2",
    light: "#FDA4AF",
    dark: "#E11D48",
    text: "#E11D48",
    cardText: "#BE123C",
    card: "#FFF1F2",
    stroke: "#FECDD3",
    divider: "#FEE2E2",
  },
};

const REPORTS = {
  valid: {
    text: "معتبر",
    background: "#ECFDF5",
    color: "#059669",
    rawY: 54.2,
    equalsY: 71,
    reportY: 96.8,
  },
  questionable: {
    text: "تفسیر با احتیاط",
    background: "#FEFCE8",
    color: "#CA8A04",
    rawY: 27.1,
    equalsY: 49.5,
    reportY: 102,
  },
  invalid: {
    text: "نامعتبر",
    background: "#FEF2F2",
    color: "#DC2626",
    rawY: 50.9,
    equalsY: 70,
    reportY: 99.8,
  },
};

const CORRECTIONS = {
  none: {
    text: "خیر",
    background: "#FEF2F2",
    color: "#DC2626",
    bodyHeight: 68,
    valid: false,
  },
  x: {
    text: "شاخص افشا (X)",
    background: "#ECFDF5",
    color: "#059669",
    bodyHeight: 131,
    valid: true,
  },
  acc: {
    text: "شاخص اضطراب/افسردگی (A/CC)",
    background: "#ECFDF5",
    color: "#059669",
    bodyHeight: 211,
    valid: true,
  },
  x_acc: {
    text: "شاخص X و A/CC",
    background: "#ECFDF5",
    color: "#059669",
    bodyHeight: 137,
    valid: true,
  },
};

const PROFILE_LABELS = {};
const addLabel = (eng) => {
  PROFILE_LABELS[eng] = { eng };
};

for (const { key } of [...PERSONALITY, ...CLINICAL]) {
  for (const suffix of ["raw", "br", "level"]) addLabel(`${key}_${suffix}`);
}
for (const key of Object.keys(FACET_NAMES)) {
  for (let index = 1; index <= 3; index += 1) {
    for (const suffix of ["raw", "br", "level"]) addLabel(`${key}_${index}_${suffix}`);
  }
}
for (const { key } of MODIFYING) {
  for (const suffix of ["raw", "br", "report", "level"]) addLabel(`${key}_${suffix}`);
}
for (const key of ["v", "w"]) {
  addLabel(`${key}_raw`);
  addLabel(`${key}_report`);
}
for (const eng of [
  "high_point",
  "validity_alert",
  "validity_reason",
  "correction_alert",
  "correction_x_1",
  "correction_x_2",
  "correction_acc_value",
  "correction_acc_1",
  "correction_acc_2",
]) {
  addLabel(eng);
}
for (const { key } of NOTEWORTHY) {
  addLabel(`noteworthy_${key}_raw`);
  addLabel(`noteworthy_${key}_percentage`);
}

function clamp(value, min, max) {
  const number = Number(value);
  if (!Number.isFinite(number)) return min;
  return Math.min(max, Math.max(min, number));
}

function brHeight(value) {
  const br = clamp(value, 0, 115);
  if (br <= 60) return br * 1.5;
  if (br <= 75) return 90 + (br - 60) * 7;
  if (br <= 85) return 195 + (br - 75) * 10;
  return 295 + (br - 85) * 3.5;
}

function personalityTheme(value) {
  const br = clamp(value, 0, 115);
  if (br < 60) return THEMES.gray;
  if (br < 75) return THEMES.yellow;
  if (br < 85) return THEMES.orange;
  return THEMES.rose;
}

function clinicalTheme(value) {
  const br = clamp(value, 0, 115);
  if (br < 75) return THEMES.gray;
  if (br < 85) return THEMES.orange;
  return THEMES.rose;
}

class MCMI9A extends Profile {
  static pages = 4;

  static partials = {
    MCMI9A_main: "MCMI9A_main_partial.hbs",
    MCMI9A_facets: "MCMI9A_facets_partial.hbs",
    MCMI9A_noteworthy: "MCMI9A_noteworthy_partial.hbs",
    MCMI9A_vertical_label: "MCMI9A_vertical_label_partial.hbs",
  };

  labels = PROFILE_LABELS;

  profileSpec = {
    sample: {
      name: "آزمون شخصیت میلون IV",
      multiProfile: false,
      questions: false,
      defaultFields: true,
      fields: [],
    },
    profile: {
      get dimensions() {
        const [page1, page2, page3, page4] = this.padding;
        return [
          {
            width: 888 + 2 * page1.x,
            height: 706 + 2 * page1.y,
          },
          {
            width: 858 + 2 * page2.x,
            height: 699 + 2 * page2.y,
          },
          {
            width: 858 + 2 * page3.x,
            height: 699 + 2 * page3.y,
          },
          {
            width: 737 + 2 * page4.x,
            height: 558 + 2 * page4.y,
          },
        ];
      },
      padding: [
        { x: 7.5, y: 4 },
        { x: 22.5, y: 7.5 },
        { x: 22.5, y: 7.5 },
        { x: 83, y: 78 },
      ],
    },
    labels: Object.values(this.labels),
  };

  constructor(dataset, options, config = {}) {
    super();
    this._init(dataset, options, config);
  }

  _calcContext() {
    const scoreByKey = new Map(this.dataset.score.map((item) => [item.label.eng, item]));
    const mark = (eng) => scoreByKey.get(eng)?.mark ?? 0;
    const number = (eng) => {
      const value = Number(mark(eng));
      return Number.isFinite(value) ? value : 0;
    };
    const titleAppend = (page) => ` - صفحه ${page}`;

    const modifying = MODIFYING.map((item, index) => {
      const br = clamp(number(`${item.key}_br`), 0, 100);
      const barHeight = br * 4;
      const inside = br >= INSIDE_THRESHOLD;
      const barTop = 464 - barHeight;
      return {
        ...item,
        x: 144 + index * 20,
        center: 150 + index * 20,
        raw: number(`${item.key}_raw`),
        br,
        barHeight,
        barTop,
        scoreY: inside ? barTop + MAIN_INSIDE_SCORE_GAP : barTop - OUTSIDE_SCORE_GAP,
        scoreAnchor: inside ? "end" : "start",
        inside,
        theme: THEMES.blue,
      };
    });

    const personality = PERSONALITY.map((item, index) => {
      const br = clamp(number(`${item.key}_br`), 0, 115);
      const barHeight = brHeight(br);
      const x = index < 12 ? 276 + index * 20 : 532 + (index - 12) * 20;
      const inside = br >= 60;
      const barTop = 464 - barHeight;
      return {
        ...item,
        x,
        center: x + 6,
        raw: number(`${item.key}_raw`),
        br,
        level: mark(`${item.key}_level`),
        barHeight,
        barTop,
        scoreY: inside ? barTop + MAIN_INSIDE_SCORE_GAP : barTop - OUTSIDE_SCORE_GAP,
        scoreAnchor: inside ? "end" : "start",
        inside,
        theme: personalityTheme(br),
      };
    });

    const clinical = CLINICAL.map((item, index) => {
      const br = clamp(number(`${item.key}_br`), 0, 115);
      const barHeight = brHeight(br);
      const x = index < 7 ? 672 + index * 20 : 828 + (index - 7) * 20;
      const inside = br >= 75;
      const barTop = 464 - barHeight;
      return {
        ...item,
        x,
        center: x + 6,
        raw: number(`${item.key}_raw`),
        br,
        level: mark(`${item.key}_level`),
        barHeight,
        barTop,
        scoreY: inside ? barTop + MAIN_INSIDE_SCORE_GAP : barTop - OUTSIDE_SCORE_GAP,
        scoreAnchor: inside ? "end" : "start",
        inside,
        theme: clinicalTheme(br),
      };
    });

    const facetGroups = (order, forcedGrayKeys) =>
      order.map((key, groupIndex) => {
        const parent = PERSONALITY.find((item) => item.key === key);
        const br = clamp(number(`${key}_br`), 0, 115);
        const forcedGray = forcedGrayKeys.has(key);
        const theme = forcedGray ? THEMES.gray : personalityTheme(br);
        const baseX = 42 + groupIndex * 104;
        const facets = FACET_NAMES[key].map((fa, facetIndex) => {
          const facetKey = `${key}_${facetIndex + 1}`;
          const facetBr = clamp(number(`${facetKey}_br`), 0, 100);
          const barHeight = facetBr * 3;
          const inside = facetBr >= 75;
          const facetTheme = forcedGray
            ? THEMES.gray
            : inside
              ? theme
              : THEMES.zinc;
          const barTop = 361 - barHeight;
          return {
            key: facetKey,
            code: `${parent.code}-${facetIndex + 1}`,
            fa,
            x: baseX + facetIndex * 28,
            center: baseX + facetIndex * 28 + 8,
            raw: number(`${facetKey}_raw`),
            br: facetBr,
            level: mark(`${facetKey}_level`),
            barHeight,
            barTop,
            scoreY: inside ? barTop + FACET_INSIDE_SCORE_GAP : barTop - OUTSIDE_SCORE_GAP,
            scoreAnchor: inside ? "end" : "start",
            inside,
            theme: facetTheme,
          };
        });

        return {
          ...parent,
          cardLines: key === "6b" ? ["دیگرآزار", "(سادیستیک)"] : [parent.fa],
          baseX,
          cardX: baseX - 3.5,
          raw: number(`${key}_raw`),
          br,
          level: mark(`${key}_level`),
          theme,
          facets,
        };
      });

    const sortedFacetKeys = PERSONALITY.map((item, index) => ({
      key: item.key,
      index,
      br: clamp(number(`${item.key}_br`), 0, 115),
    }))
      .sort((first, second) => second.br - first.br || first.index - second.index)
      .map((item) => item.key);
    const forcedGrayKeys = new Set(sortedFacetKeys.slice(-4));

    const noteworthy = NOTEWORTHY.map((item, index) => {
      const raw = number(`noteworthy_${item.key}_raw`);
      const ratio = clamp(number(`noteworthy_${item.key}_percentage`), 0, 1);
      const percentage = Math.round(ratio * 100);
      const barWidth = percentage * 4;
      return {
        ...item,
        index,
        rowY: 30 + index * 40,
        barY: 42 + index * 40,
        centerY: 50 + index * 40,
        raw,
        ratio,
        percentage,
        barWidth,
        inside: percentage >= INSIDE_THRESHOLD,
        scoreX: 273 + barWidth + (percentage >= INSIDE_THRESHOLD ? -6 : 6),
      };
    });

    const correctionKey = String(mark("correction_alert") || "none");
    const correction = CORRECTIONS[correctionKey] ?? CORRECTIONS.none;
    const validity = (key) => {
      const reportKey = String(mark(`${key}_report`) || "valid");
      return {
        raw: number(`${key}_raw`),
        ...(REPORTS[reportKey] ?? REPORTS.valid),
      };
    };
    const highPoints = [...personality, ...clinical]
      .map((item, index) => ({ ...item, highPointOrder: index }))
      .filter((item) => item.br >= 75)
      .sort(
        (first, second) =>
          second.br - first.br || first.highPointOrder - second.highPointOrder,
      )
      .map((item) => item.code)
      .slice(0, 5);
    const disclosureRaw = number("x_raw");
    const showDisclosureAlert =
      disclosureRaw <= 6 || (disclosureRaw >= 115 && disclosureRaw <= 121);

    return [
      {
        page: 1,
        titleAppend: titleAppend(1),
        highPoints,
        showDisclosureAlert,
        correction,
        validityV: validity("v"),
        validityW: validity("w"),
        modifying,
        personality,
        clinical,
      },
      {
        page: 2,
        titleAppend: titleAppend(2) + ' - گراسمن ۱',
        groups: facetGroups(sortedFacetKeys.slice(0, 8), forcedGrayKeys),
      },
      {
        page: 3,
        titleAppend: titleAppend(3)+ ' - گراسمن ۲',
        groups: facetGroups(sortedFacetKeys.slice(8), forcedGrayKeys),
      },
      {
        page: 4,
        titleAppend: titleAppend(4) + ' - شاخص‌های هشداردهنده',
        items: noteworthy,
      },
    ];
  }
}

module.exports = MCMI9A;
