const { Profile } = require("../Profile");

const DOMAIN_MAX = 48;
const MAIN_BAR_WIDTH = 500;
const DETAIL_BAR_WIDTH = 300;
const INSIDE_THRESHOLD = 25;
const COLORS = {
  light: "#BAE6FD",
  dark: "#0369A1",
  accent: "#0284C7",
  stroke: "#60A5FA",
};
const percentageFromRatio = (ratio) => Math.round(Number(ratio) * 100);

const DOMAINS = [
  {
    d: "n",
    fa: "بی‌ثباتی هیجانی",
    letter: "N",
    facets: [
      { d: "n1", fa: "عاطفه منفی", max: 20 },
      { d: "n2", fa: "سرزنش خویش", max: 28 },
    ],
  },
  {
    d: "e",
    fa: "برون‌گرایی",
    letter: "E",
    facets: [
      { d: "e1", fa: "عاطفه مثبت", max: 16 },
      { d: "e2", fa: "جامعه‌پذیری", max: 16 },
      { d: "e3", fa: "فعالیت", max: 16 },
    ],
  },
  {
    d: "o",
    fa: "باز بودن به تجربه",
    letter: "O",
    facets: [
      { d: "o1", fa: "علایق زیبایی‌شناختی", max: 12 },
      { d: "o2", fa: "علایق ذهنی", max: 12 },
      { d: "o3", fa: "غیرسنتی", max: 16 },
    ],
  },
  {
    d: "a",
    fa: "توافق با دیگران",
    letter: "A",
    facets: [
      { d: "a1", fa: "گرایش موافق (نامتضاد)", max: 32 },
      { d: "a2", fa: "گرایش عام‌المنفعه", max: 16 },
    ],
  },
  {
    d: "c",
    fa: "وجدانی بودن",
    letter: "C",
    facets: [
      { d: "c1", fa: "نظم‌پذیری", max: 20 },
      { d: "c2", fa: "تلاش هدفمند", max: 12 },
      { d: "c3", fa: "قابل اتکا بودن", max: 16 },
    ],
  },
];

const SCORE_LABELS = {};
for (const domain of DOMAINS) {
  SCORE_LABELS[`${domain.d}_raw`] = {
    eng: `${domain.d}_raw`,
    fa: domain.fa,
    letter: domain.letter,
    max: DOMAIN_MAX,
  };
  SCORE_LABELS[`${domain.d}_score`] = { eng: `${domain.d}_score` };

  for (const facet of domain.facets) {
    SCORE_LABELS[`${facet.d}_raw`] = {
      eng: `${facet.d}_raw`,
      fa: facet.fa,
      max: facet.max,
    };
    SCORE_LABELS[`${facet.d}_score`] = { eng: `${facet.d}_score` };
  }
}

const layoutErrors = (errors) => {
  let start = 0;
  return errors.map((error, index) => {
    const item = {
      ...error,
      start,
      last: index === errors.length - 1,
    };
    start += error.length + 54;
    return item;
  });
};

class NEO9V extends Profile {
  static pages = 2;

  static partials = {
    NEO_main: "NEO_main.hbs",
    NEO_short_facets: "NEO_short_facets.hbs",
  };

  labels = {
    ...SCORE_LABELS,
    validity: { eng: "validity" },
    options_3_count: { eng: "options_3_count" },
  };

  profileSpec = {
    sample: {
      name: "آزمون شخصیت نئو فرم کوتاه (PI-R)",
      multiProfile: false,
      questions: false,
      defaultFields: true,
      fields: [],
    },
    profile: {
      get dimensions() {
        const [page1, page2] = this.padding;
        return [
          {
            width: 801 + 2 * page1.x,
            height: 674 + 2 * page1.y,
          },
          {
            width: 760 + 2 * page2.x,
            height: 662 + 2 * page2.y,
          },
        ];
      },
      padding: [
        { x: 71, y: 40 },
        { x: 91.5, y: 46 },
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
    const mark = (eng) => dataset.score.find((item) => item.label.eng === eng)?.mark ?? 0;

    const blocks = DOMAINS.map((domain, index) => {
      const raw = mark(`${domain.d}_raw`);
      const p = Number(mark(`${domain.d}_score`));
      const percentage = percentageFromRatio(p);
      const facets = domain.facets.map((facet) => {
        const facetRaw = mark(`${facet.d}_raw`);
        const facetP = Number(mark(`${facet.d}_score`));
        const facetPercentage = percentageFromRatio(facetP);
        return {
          fa: facet.fa,
          max: facet.max,
          raw: facetRaw,
          mark: facetRaw,
          p: facetP,
          barW: (DETAIL_BAR_WIDTH * facetPercentage) / 100,
          percentage: facetPercentage,
          inside: facetPercentage >= INSIDE_THRESHOLD,
        };
      });

      return {
        fa: domain.fa,
        letter: domain.letter,
        max: DOMAIN_MAX,
        raw,
        mark: raw,
        p,
        barW: (MAIN_BAR_WIDTH * percentage) / 100,
        percentage,
        inside: percentage >= INSIDE_THRESHOLD,
        isBlue: index % 2 === 0,
        facets,
      };
    });

    const invalidErrors = [];
    if (mark("validity") === 0) {
      invalidErrors.push({ text: "پاسخ سؤالات اعتبار", length: 108 });
    }
    if (Number(mark("options_3_count")) >= 10) {
      invalidErrors.push({ text: "تعداد پاسخ‌های «نظری ندارم»", length: 170 });
    }
    const redErrors = layoutErrors(invalidErrors);

    return [
      {
        page: 1,
        titleAppend: " - صفحه 1",
        theme: "blue",
        colors: COLORS,
        items: blocks.map(({ facets, isBlue, ...item }) => item),
        redErrors,
        showRed: redErrors.length > 0,
      },
      {
        page: 2,
        titleAppend: " - صفحه 2",
        theme: "blue",
        colors: COLORS,
        blocks,
        gridBottom: 658.5,
      },
    ];
  }
}

module.exports = NEO9V;
