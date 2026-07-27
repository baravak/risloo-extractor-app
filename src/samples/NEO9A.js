const { Profile } = require("../Profile");

const DOMAIN_MAX = 48;
const BAR_WIDTH = 500;
const INSIDE_THRESHOLD = 25;
const LEVELS = {
  1: "خیلی پایین",
  2: "پایین",
  3: "متوسط",
  4: "بالا",
  5: "خیلی بالا",
};
const COLORS = {
  light: "#BAE6FD",
  dark: "#0369A1",
  accent: "#0284C7",
  stroke: "#0284C7",
};
const percentageFromRatio = (ratio) => Math.round(Number(ratio) * 100);
const DOMAINS = [
  { d: "n", fa: "روان‌آزرده‌گرایی", letter: "N" },
  { d: "e", fa: "برون‌گرایی", letter: "E" },
  { d: "o", fa: "گشودگی", letter: "O" },
  { d: "a", fa: "موافق بودن", letter: "A" },
  { d: "c", fa: "با وجدان بودن", letter: "C" },
];

class NEO9A extends Profile {
  static pages = 1;

  static partials = {
    NEO_main: "NEO_main.hbs",
  };

  labels = {
    N_raw: { eng: "n_raw", fa: "روان‌آزرده‌گرایی", letter: "N", max: DOMAIN_MAX },
    N_score: { eng: "n_score" },
    N_lvl: { eng: "n_level" },
    E_raw: { eng: "e_raw", fa: "برون‌گرایی", letter: "E", max: DOMAIN_MAX },
    E_score: { eng: "e_score" },
    E_lvl: { eng: "e_level" },
    O_raw: { eng: "o_raw", fa: "گشودگی", letter: "O", max: DOMAIN_MAX },
    O_score: { eng: "o_score" },
    O_lvl: { eng: "o_level" },
    A_raw: { eng: "a_raw", fa: "موافق بودن", letter: "A", max: DOMAIN_MAX },
    A_score: { eng: "a_score" },
    A_lvl: { eng: "a_level" },
    C_raw: { eng: "c_raw", fa: "با وجدان بودن", letter: "C", max: DOMAIN_MAX },
    C_score: { eng: "c_score" },
    C_lvl: { eng: "c_level" },
    validity: { eng: "validity" },
  };

  profileSpec = {
    sample: {
      name: "پرسشنامه شخصیت نئو ۶۰ سوالی (NEO-FFI-60)",
      multiProfile: false,
      questions: true,
      defaultFields: true,
      fields: [],
    },
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
    labels: Object.values(this.labels),
  };

  constructor(dataset, options, config = {}) {
    super();
    this._init(dataset, options, config);
  }

  _calcContext() {
    const { dataset } = this;
    const mark = (eng) => dataset.score.find((item) => item.label.eng === eng)?.mark ?? 0;

    const items = DOMAINS.map(({ d, fa, letter }) => {
      const raw = mark(`${d}_raw`);
      const p = Number(mark(`${d}_score`));
      const level = mark(`${d}_level`);
      const percentage = percentageFromRatio(p);
      return {
        fa,
        letter,
        max: DOMAIN_MAX,
        raw,
        mark: raw,
        p,
        barW: (BAR_WIDTH * percentage) / 100,
        percentage,
        inside: percentage >= INSIDE_THRESHOLD,
        levelText: LEVELS[level] ?? "-",
      };
    });

    const invalidValidity = mark("validity") === 0;
    const redErrors = invalidValidity
      ? [{ text: "پاسخ سؤالات اعتبار", length: 105, start: 0, last: true }]
      : [];

    return [
      {
        page: 1,
        titleAppend: " - صفحه 1",
        theme: "sky",
        colors: COLORS,
        items,
        redErrors,
        showRed: redErrors.length > 0,
      },
    ];
  }
}

module.exports = NEO9A;
