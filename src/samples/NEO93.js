const { Profile } = require("../Profile");

const DOMAIN_MAX = 192;
const FACET_MAX = 32;
const INSIDE_THRESHOLD = 25;

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

// Page 4 (profile sheet). The Chart layer is 885 × 649; every number below is
// measured from it, so the shared NEO_sheet partial stays free of profile logic.
const SHEET_GROUP_X = [54, 175, 317, 459, 601, 743];
const SHEET_COL_STEP = 21;
const SHEET_COL_HALF = 6.5;

// 0 % sits on the bottom gridline, 100 % on the top one, 500 px apart.
const SHEET_ZERO_Y = 632;
const SHEET_PX_PER_PERCENT = 5;

const SHEET_DOMAIN_STROKE = "#4338CA";
const SHEET_FACET_STROKE = "#334155";

function clamp(value, min, max) {
  const number = Number(value);
  if (!Number.isFinite(number)) return min;
  return Math.min(max, Math.max(min, number));
}

function sheetColumns() {
  const columns = DOMAINS.map(({ fa, letter }, index) => ({
    cx: SHEET_GROUP_X[0] + SHEET_COL_HALF + index * SHEET_COL_STEP,
    code: letter,
    fa,
    domain: true,
  }));

  DOMAINS.forEach(({ key, letter }, groupIndex) => {
    FACET_NAMES[key].forEach((fa, index) => {
      columns.push({
        cx: SHEET_GROUP_X[groupIndex + 1] + SHEET_COL_HALF + index * SHEET_COL_STEP,
        code: `${letter}${index + 1}`,
        fa,
        domain: false,
      });
    });
  });

  return columns;
}

// One dash per axis unit; every `accentEvery`-th one is the dark, readable tick.
function sheetDashes(top, pitch, count, accentEvery) {
  return Array.from({ length: count }, (unused, index) => ({
    y: top + index * pitch,
    dark: index % accentEvery === 0,
  }));
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
  static pages = 4;

  static partials = {
    NEO_main: "NEO_main.hbs",
    NEO_long_facets: "NEO_long_facets.hbs",
    NEO_sheet: "NEO_sheet.hbs",
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
        const [page1, page2, page3, page4] = this.padding;
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
          {
            width: 885 + 2 * page4.x,
            height: 649 + 2 * page4.y,
          },
        ];
      },
      // Padding is the Chart's inset inside the 943 × 754 design page *minus*
      // the 20 px the layout already owns on every side. Every page therefore
      // resolves to 903 × 714 — the exact with-sidebar drawing area — and
      // renders at scale 1 instead of being shrunk to fit.
      padding: [
        { x: 51.5, y: 20 },
        { x: 46, y: 26 },
        { x: 46, y: 128 },
        { x: 9, y: 32.5 },
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
    const versionTitle = isFemale ? "نسخه بانوان" : "نسخه آقایان";
    const titleAppend = (page) => ` - ${versionTitle} - صفحه ${page}`;
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

    const sheetCols = sheetColumns();
    const sheetY = (percentage) => SHEET_ZERO_Y - SHEET_PX_PER_PERCENT * clamp(percentage, 0, 100);
    const polyline = (cols, values) => values.map((value, index) => `${cols[index].cx},${sheetY(value)}`).join(" ");

    const series = [
      { stroke: SHEET_DOMAIN_STROKE, points: polyline(sheetCols.slice(0, 5), items.map((item) => item.percentage)) },
      ...blocks.map((block, groupIndex) => ({
        stroke: SHEET_FACET_STROKE,
        points: polyline(
          sheetCols.slice(5 + groupIndex * 6, 11 + groupIndex * 6),
          block.facets.map((facet) => facet.percentage)
        ),
      })),
    ];

    return [
      {
        ...sharedContext,
        page: 1,
        titleAppend: titleAppend(1),
        items,
        redErrors: layoutIndicators(redErrors),
        yellowErrors: layoutIndicators(yellowErrors),
        showRed: redErrors.length > 0,
        showYellow: yellowErrors.length > 0,
      },
      {
        ...sharedContext,
        page: 2,
        titleAppend: titleAppend(2),
        blocks: blocks.slice(0, 3),
        gridBottom: 658.5,
      },
      {
        ...sharedContext,
        page: 3,
        titleAppend: titleAppend(3),
        blocks: blocks.slice(3, 5),
        gridBottom: 454.5,
      },
      {
        ...sharedContext,
        page: 4,
        titleAppend: ' - کلاسیک',
        columns: sheetCols,
        series,
        sheet: {
          grid: {
            x: 31,
            w: 854,
            ys: [
              { y: 131, faint: false },
              { y: 231, faint: true },
              { y: 331, faint: true },
              { y: 431, faint: true },
              { y: 531, faint: true },
              { y: 631, faint: false },
            ],
          },
          plot: { top: 132, bottom: 632 },
          dot: { pitch: 5, accentPitch: 20, light: "#F1F5F9", accent: "#94A3B8" },
          tick: { top: 121, h: 10 },
          rail: {
            dashLeftX: 36,
            dashRightX: 873,
            w: 6,
            ruleLeftX: 45.5,
            ruleRightX: 868.5,
            ruleW: 1,
            ruleTop: 131,
            ruleH: 502,
            dark: "#64748B",
            light: "white",
          },
          dashes: sheetDashes(132, 5, 101, 4),
          numberX: 24,
          numbers: [
            { y: 132, text: "100 ٪" },
            { y: 232, text: "80 ٪" },
            { y: 332, text: "60 ٪" },
            { y: 432, text: "40 ٪" },
            { y: 532, text: "20 ٪" },
            { y: 632, text: "0" },
          ],
          levelX: 0,
          levels: [],
          titleBottomY: 115,
          codeY: 648,
        },
      },
    ];
  }
}

module.exports = NEO93;
