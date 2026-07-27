const { Profile } = require("../Profile");

const DOMAIN_MAX = 192;
const FACET_MAX = 32;
const INSIDE_THRESHOLD = 24;

const LEVELS = ["", "خیلی پایین", "پایین", "متوسط", "بالا", "خیلی بالا"];

const DOMAINS = [
  { key: "n", fa: "روان‌آزرده‌گرایی", letter: "N" },
  { key: "e", fa: "برون‌گرایی", letter: "E" },
  { key: "o", fa: "گشودگی", letter: "O" },
  { key: "a", fa: "موافق بودن", letter: "A" },
  { key: "c", fa: "با وجدان بودن", letter: "C" },
];

const FACET_NAMES = {
  n: ["اضطراب", "خصومت", "افسردگی", "کم‌رویی", "تکانش‌گری", "آسیب‌پذیری"],
  e: ["گرم", "معاشرتی", "ابراز وجود", "فعال", "هیجان‌خواهی", "هیجان‌ مثبت"],
  o: ["تخیل", "زیبایی‌شناسی", "احساسات", "کنش‌ها", "دیدگاه‌ها", "ارزش‌ها"],
  a: ["اعتماد", "رک‌گویی", "نوع‌دوستی", "همراهی", "تواضع", "دل‌رحم"],
  c: ["شایستگی", "نظم و ترتیب", "وظیفه‌شناسی", "تلاش برای موفقیت", "خویشتن‌داری", "محتاط"],
};

const COLOR_THEMES = {
  female: {
    light: "#E9D5FF",
    dark: "#7E22CE",
    accent: "#9333EA",
    stroke: "#C084FC",
  },
  male: {
    light: "#BFDBFE",
    dark: "#1D4ED8",
    accent: "#2563EB",
    stroke: "#60A5FA",
  },
};

const FACTOR_LABELS = {};
for (const { key } of DOMAINS) {
  for (const suffix of ["raw", "score", "level"]) {
    FACTOR_LABELS[`${key}_${suffix}`] = { eng: `${key}_${suffix}` };
  }

  for (let index = 1; index <= 6; index += 1) {
    for (const suffix of ["raw", "score", "level"]) {
      FACTOR_LABELS[`${key}${index}_${suffix}`] = {
        eng: `${key}${index}_${suffix}`,
      };
    }
  }
}

function clamp(value, min, max) {
  const number = Number(value);
  if (!Number.isFinite(number)) return min;
  return Math.min(max, Math.max(min, number));
}

function layoutIndicators(indicators) {
  let start = 0;

  return indicators.map((indicator, index) => {
    const positioned = {
      ...indicator,
      start,
      last: index === indicators.length - 1,
    };
    start += indicator.length + 54;
    return positioned;
  });
}

class NEO93 extends Profile {
  static pages = 3;

  static partials = {
    NEO_main: "NEO_main.hbs",
    NEO_long_facets: "NEO_long_facets.hbs",
  };

  labels = {
    ...FACTOR_LABELS,
    validity: { eng: "validity" },
    options_3_count: { eng: "options_3_count" },
    acquiescence: { eng: "acquiescence" },
    nay_saying: { eng: "nay_saying" },
    random_responding: { eng: "random_responding" },
  };

  profileSpec = {
    sample: {
      name: "پرسشنامه شخصیت نئو فرم بلند (گروسی)",
      multiProfile: false,
      questions: false,
      defaultFields: true,
      fields: [],
    },
    profile: {
      get dimensions() {
        const [page1, page2, page3] = this.padding;
        return [
          {
            width: 800 + 2 * page1.x,
            height: 674 + 2 * page1.y,
          },
          {
            width: 811 + 2 * page2.x,
            height: 662 + 2 * page2.y,
          },
          {
            width: 811 + 2 * page3.x,
            height: 458 + 2 * page3.y,
          },
        ];
      },
      padding: [
        { x: 71.5, y: 40 },
        { x: 66, y: 46 },
        { x: 66, y: 148 },
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
    const scoreByKey = new Map(dataset.score.map((item) => [item.label.eng, item]));

    // Dataset._extractData drops a numeric zero, so every read deliberately
    // restores it with ?? 0 before converting it to a drawing value.
    const mark = (eng) => scoreByKey.get(eng)?.mark ?? 0;
    const number = (eng) => {
      const value = Number(mark(eng));
      return Number.isFinite(value) ? value : 0;
    };
    const ratio = (eng) => clamp(number(eng), 0, 1);

    const genderField = (dataset.info.fields ?? []).find((field) => field?.eng === "gender");
    const isFemale = Number(genderField?.user_answered) === 1;
    const gender = isFemale ? "female" : "male";
    const colors = COLOR_THEMES[gender];
    const sharedContext = {
      gender,
      isFemale,
      theme: gender,
      colors,
    };

    const items = DOMAINS.map(({ key, fa, letter }) => {
      const raw = number(`${key}_raw`);
      const score = ratio(`${key}_score`);
      const level = number(`${key}_level`);
      const percentage = Math.round(score * 100);

      return {
        key,
        fa,
        letter,
        raw,
        mark: raw,
        max: DOMAIN_MAX,
        score,
        p: score,
        percentage,
        barW: (500 * percentage) / 100,
        inside: percentage >= INSIDE_THRESHOLD,
        level,
        levelText: LEVELS[level] ?? "-",
      };
    });

    const redErrors = [];
    if (number("validity") === 0) {
      redErrors.push({ text: "پاسخ سؤالات اعتبار", length: 108 });
    }
    if (number("options_3_count") >= 41) {
      redErrors.push({ text: "تعداد پاسخ‌های «نظری ندارم»", length: 170 });
    }

    const yellowErrors = [];
    if (number("acquiescence") === 1) {
      yellowErrors.push({ text: "احتمال تمایل به پاسخ مثبت", length: 155 });
    }
    if (number("nay_saying") === 1) {
      yellowErrors.push({ text: "احتمال تمایل به پاسخ منفی", length: 143 });
    }
    if (number("random_responding") === 1) {
      yellowErrors.push({ text: "احتمال پاسخ تصادفی", length: 105 });
    }

    const blocks = DOMAINS.map(({ key, fa, letter }, domainIndex) => {
      const raw = number(`${key}_raw`);
      const score = ratio(`${key}_score`);
      const level = number(`${key}_level`);
      const percentage = Math.round(score * 100);

      const facets = FACET_NAMES[key].map((facetName, facetIndex) => {
        const factorKey = `${key}${facetIndex + 1}`;
        const facetRaw = number(`${factorKey}_raw`);
        const facetScore = ratio(`${factorKey}_score`);
        const facetLevel = number(`${factorKey}_level`);
        const facetPercentage = Math.round(facetScore * 100);

        return {
          key: factorKey,
          fa: facetName,
          raw: facetRaw,
          mark: facetRaw,
          max: FACET_MAX,
          score: facetScore,
          p: facetScore,
          percentage: facetPercentage,
          barW: (300 * facetPercentage) / 100,
          inside: facetPercentage >= INSIDE_THRESHOLD,
          level: facetLevel,
          levelText: LEVELS[facetLevel] ?? "-",
        };
      });

      return {
        key,
        fa,
        letter,
        raw,
        mark: raw,
        max: DOMAIN_MAX,
        score,
        p: score,
        percentage,
        barW: (500 * percentage) / 100,
        inside: percentage >= INSIDE_THRESHOLD,
        level,
        levelText: LEVELS[level] ?? "-",
        isPrimary: domainIndex % 2 === 0,
        isBlue: domainIndex % 2 === 0,
        facetOffsetY: 0,
        facets,
      };
    });

    return [
      {
        ...sharedContext,
        page: 1,
        titleAppend: "",
        items,
        redErrors: layoutIndicators(redErrors),
        yellowErrors: layoutIndicators(yellowErrors),
        showRed: redErrors.length > 0,
        showYellow: yellowErrors.length > 0,
      },
      {
        ...sharedContext,
        page: 2,
        titleAppend: " - 2",
        blocks: blocks.slice(0, 3),
        gridBottom: 658.5,
      },
      {
        ...sharedContext,
        page: 3,
        titleAppend: " - 3",
        blocks: blocks.slice(3, 5),
        gridBottom: 454.5,
      },
    ];
  }
}

module.exports = NEO93;
