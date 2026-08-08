const { Profile } = require("../Profile");

const DOMAIN_MAX = 192;
const FACET_MAX = 32;
const INSIDE_THRESHOLD = 25;

const LEVELS = ["", "بسیار پایین", "پایین", "طبیعی", "بالا", "بسیار بالا"];

const DOMAINS = [
  { key: "n", fa: "بی‌ثباتی هیجانی", letter: "N" },
  { key: "e", fa: "برون‌گرایی", letter: "E" },
  { key: "o", fa: "باز بودن به تجربه", letter: "O" },
  { key: "a", fa: "توافق با دیگران", letter: "A" },
  { key: "c", fa: "وجدانی بودن", letter: "C" },
];

const FACET_NAMES = {
  n: ["اضطراب", "خشم و کینه‌ورزی", "افسردگی", "شرم", "تکانش‌وری", "آسیب‌پذیری از استرس"],
  e: ["صمیمیت", "جمع‌گرایی", "قاطعیت", "جنب‌وجوش", "هیجان‌خواهی", "هیجان‌‌های مثبت"],
  o: ["تخیل", "زیبایی شناسی", "عواطف", "کنش‌ها", "دیدگاه‌ها", "ارزش‌ها"],
  a: ["اعتماد", "سادگی", "نوع‌دوستی", "تبعیت", "تواضع", "نرمش در برابر دیگران"],
  c: ["شایستگی", "نظم", "وظیفه‌شناسی", "تلاش برای موفقیت", "نظم درونی", "انعطاف‌ناپذیری"],
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

// Page 4 (profile sheet). The Chart layer is 878 × 704; every number below is
// measured from it, so the shared NEO_sheet partial stays free of profile logic.
const SHEET_GROUP_X = [47, 168, 310, 452, 594, 736];
const SHEET_COL_STEP = 21;
const SHEET_COL_HALF = 6.5;

// The T axis runs 20…80 at a flat 9 px per point: T 20 on the bottom gridline,
// T 80 on the top one. `_lookup` floors at 20 and the norm tables top out at 80,
// but the clamp also keeps a missing key (which `?? 0` turns into 0) on the sheet.
const SHEET_MIN_T = 20;
const SHEET_MAX_T = 80;
const SHEET_MIN_T_Y = 687;
const SHEET_PX_PER_T = 9;

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

// One dash per T point; every `accentEvery`-th one is dark — on this form that
// marks the even T values, which are the only ones the norm tables can produce.
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

class NEO9Q extends Profile {
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
      name: "پرسشنامه شخصیت نئو فرم بلند (حق‌شناس)",
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
            width: 878 + 2 * page1.x,
            height: 704 + 2 * page1.y,
          },
          {
            width: 800 + 2 * page2.x,
            height: 674 + 2 * page2.y,
          },
          {
            width: 811 + 2 * page3.x,
            height: 668 + 2 * page3.y,
          },
          {
            width: 811 + 2 * page4.x,
            height: 464 + 2 * page4.y,
          },
        ];
      },
      // Padding is the Chart's inset inside the 943 × 754 design page *minus*
      // the 20 px the layout already owns on every side. Every page therefore
      // resolves to 903 × 714 — the exact with-sidebar drawing area — and
      // renders at scale 1 instead of being shrunk to fit.
      padding: [
        { x: 12.5, y: 5 },
        { x: 51.5, y: 20 },
        { x: 46, y: 23 },
        { x: 46, y: 125 },
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
      const score = number(`${key}_score`);
      const level = number(`${key}_level`);
      const barW = clamp(8 * score - 140, 0, 500);

      return {
        key,
        fa,
        letter,
        raw,
        mark: raw,
        max: DOMAIN_MAX,
        score,
        tScore: score,
        percentage: score,
        barW,
        p: barW / 500,
        inside: score >= INSIDE_THRESHOLD,
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
      const score = number(`${key}_score`);
      const level = number(`${key}_level`);
      const barW = clamp(8 * score - 140, 0, 500);

      const facets = FACET_NAMES[key].map((facetName, facetIndex) => {
        const factorKey = `${key}${facetIndex + 1}`;
        const facetRaw = number(`${factorKey}_raw`);
        const facetScore = number(`${factorKey}_score`);
        const facetLevel = number(`${factorKey}_level`);
        const facetBarW = clamp(6 * facetScore - 100, 0, 380);

        return {
          key: factorKey,
          fa: facetName,
          raw: facetRaw,
          mark: facetRaw,
          max: FACET_MAX,
          score: facetScore,
          tScore: facetScore,
          percentage: facetScore,
          barW: facetBarW,
          p: facetBarW / 380,
          inside: facetScore >= INSIDE_THRESHOLD,
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
        tScore: score,
        percentage: score,
        barW,
        p: barW / 500,
        inside: score >= INSIDE_THRESHOLD,
        level,
        levelText: LEVELS[level] ?? "-",
        isPrimary: domainIndex % 2 === 0,
        isBlue: domainIndex % 2 === 0,
        facetOffsetY: key === "c" ? -1 : 0,
        facets,
      };
    });

    const sheetCols = sheetColumns();
    const sheetY = (t) => SHEET_MIN_T_Y - SHEET_PX_PER_T * (clamp(t, SHEET_MIN_T, SHEET_MAX_T) - SHEET_MIN_T);
    const polyline = (cols, values) => values.map((value, index) => `${cols[index].cx},${sheetY(value)}`).join(" ");

    const series = [
      { stroke: SHEET_DOMAIN_STROKE, points: polyline(sheetCols.slice(0, 5), items.map((item) => item.tScore)) },
      ...blocks.map((block, groupIndex) => ({
        stroke: SHEET_FACET_STROKE,
        points: polyline(
          sheetCols.slice(5 + groupIndex * 6, 11 + groupIndex * 6),
          block.facets.map((facet) => facet.tScore)
        ),
      })),
    ];

    // The profile sheet opens the report; the bar pages follow it.
    return [
      {
        ...sharedContext,
        page: 1,
        titleAppend: " - کلاسیک",
        columns: sheetCols,
        series,
        sheet: {
          grid: {
            x: 24,
            w: 854,
            ys: [
              { y: 146, faint: false },
              { y: 281, faint: true },
              { y: 371, faint: true },
              { y: 461, faint: true },
              { y: 551, faint: true },
              { y: 686, faint: false },
            ],
          },
          plot: { top: 147, bottom: 687 },
          dot: { pitch: 9, accentPitch: 18, light: "#F1F5F9", accent: "#94A3B8" },
          tick: { top: 136, h: 10 },
          rail: {
            dashLeftX: 29,
            dashRightX: 866,
            w: 6,
            ruleLeftX: 38,
            ruleRightX: 861,
            ruleW: 2,
            ruleTop: 146,
            ruleH: 542,
            dark: "#64748B",
            light: "#CBD5E1",
          },
          dashes: sheetDashes(147, 9, 61, 2),
          numberX: 17,
          numbers: [
            { y: 147, text: "80" },
            { y: 282, text: "65" },
            { y: 372, text: "55" },
            { y: 462, text: "45" },
            { y: 552, text: "35" },
            { y: 687, text: "20" },
          ],
          levelX: 9.9,
          // Each band label sits midway between the two gridlines that bound it.
          levels: [
            { y: 214.5, text: LEVELS[5] },
            { y: 327, text: LEVELS[4] },
            { y: 417, text: LEVELS[3] },
            { y: 507, text: LEVELS[2] },
            { y: 619.5, text: LEVELS[1] },
          ],
          titleBottomY: 130,
          codeY: 703,
        },
      },
      {
        ...sharedContext,
        page: 2,
        titleAppend: titleAppend(2),
        items,
        redErrors: layoutIndicators(redErrors),
        yellowErrors: layoutIndicators(yellowErrors),
        showRed: redErrors.length > 0,
        showYellow: yellowErrors.length > 0,
      },
      {
        ...sharedContext,
        page: 3,
        titleAppend: titleAppend(3),
        blocks: blocks.slice(0, 3),
        gridBottom: 664.5,
      },
      {
        ...sharedContext,
        page: 4,
        titleAppend: titleAppend(4),
        blocks: blocks.slice(3, 5),
        gridBottom: 460.5,
      },
    ];
  }
}

module.exports = NEO9Q;
