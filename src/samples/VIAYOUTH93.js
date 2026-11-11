const { Profile } = require("../Profile");

// ---------------------------------------------------------------------------
// VIAYOUTH93 — قوت‌های منش نوجوانان (VIA-Youth-96)، فرم ۹۶ گویه‌ای.
// Built from the approved brief VIA-Youth-96_profile_brief_fa.md (via-youth-fa-r4,
// 2026-11-11) and section 6 of the execution package. No Figma design exists:
// this is an agent layout for the designer to review, in the existing language of
//   - RSSS93: neutral vertical cards (Figma 387:79429) holding each group's title
//     beside its member bars, bars on one continuous axis;
//   - STAXI293 / OHQ93: 400 px bar on a fixed 0..100 % axis, the percent inside
//     the bar 4 px before its end, dashed guides and the white zero line;
//   - SEST93 / CPRS93: «mean از max» column after the bar, two decimals.
//
// 24 strengths under six virtue titles, in the brief's fixed order; the order
// never changes with the scores. Each bar fills from 0 by the strength's stored
// percent (mean ÷ 5, a 3-decimal fraction); the valid minimum 1.00 is a 20 %
// bar, never an empty one. Beside it: the mean with two decimals «از 5» and the
// whole percent (× 100, halves up). Titles carry no score, bar, axis or sign.
// One neutral colour family for every bar; no total, rank, level, band,
// boundary line, score-dependent colour or explanatory text.
// Two pages (researcher, 2026-11-11), three groups each, 12 strengths per page:
//   page 1 — خرد و دانش، شجاعت، انسانیت; page 2 — عدالت، اعتدال، تعالی.
// Both pages share the axis, bar style, numbers and geometry (5+4+3 and 3+4+5 rows).
// Unless status is exactly "valid", both pages show only «نمره تولید نشد», never
// the alert. On a valid sheet the brief's one alert, «عدم اعتبار», is drawn above
// the chart on both pages when the formula sets `age_alert` to 1 (age empty or
// outside 10..17); scores and bars stay as usual. Without it the chart is
// re-centred, no gap left.
// ---------------------------------------------------------------------------
// RSSS93 rhythm with 12 rows a page: 16 / 40 rows (BAR-02), 4 px card padding, 32 px between cards.
const CARD = { x: 0, width: 48, paddingY: 4, gap: 32, top: 30 }; // RSSS93 card
// Names end 16 px after the card plus the longest name, about 179 px
// («دارای استعداد ارائه و پذیرش محبّت»), measured on the render.
const TITLE_RIGHT = CARD.x + CARD.width + 16 + 180; // 244
const BAR = { x: TITLE_RIGHT + 8, width: 400, height: 16, pitch: 40 }; // 100 % = 400 px; 252 → 652
const MEAN = { left: BAR.x + BAR.width + 10, width: 51 }; // widest «3.75 از 5», measured, 662 → 713
const GRID_TOP = 22; // guides and the zero line start under the axis labels
const TICKS = [0, 25, 50, 75, 100];
// A percent stays inside its bar (white, 4 px before the end) when the bar is at
// least this wide, otherwise 6 px after the end in the dark colour (BAR-05 / 06,
// VIS-30). Valid scores never go below 20 % (80 px), so with scoring-valid data
// the percent is always inside; the outside branch only guards odd input.
const INSIDE_MIN = 40;
const COLOR = { light: "#94A3B8", dark: "#334155", track: "#E2E8F0" }; // neutral (JSS / BAR-13)

// Display groups (package §6, brief «ترتیب دسته‌ها و قوت‌ها»), codes in order.
const GROUPS = [
  { title: "خرد و دانش", codes: ["crea", "curi", "judg", "lear", "wisd"] },
  { title: "شجاعت", codes: ["brav", "pers", "hone", "zest"] },
  { title: "انسانیت", codes: ["love", "kind", "soci"] },
  { title: "عدالت", codes: ["team", "fair", "lead"] },
  { title: "اعتدال", codes: ["forg", "humi", "prud", "self"] },
  { title: "تعالی", codes: ["beau", "grat", "hope", "humo", "spir"] },
];
// Groups per page, and the header suffix that tells the two pages apart.
const PAGES = [
  { groups: [0, 1, 2], titleAppend: " - صفحهٔ 1" },
  { groups: [3, 4, 5], titleAppend: " - صفحهٔ 2" },
];

const groupHeight = (n) => (n - 1) * BAR.pitch + BAR.height + 2 * CARD.paddingY;
// The same on both pages (12 rows in three groups).
const PLOT_HEIGHT = Math.max(
  ...PAGES.map(
    (page) =>
      CARD.top +
      page.groups.reduce((h, g) => h + groupHeight(GROUPS[g].codes.length), 0) +
      (page.groups.length - 1) * CARD.gap
  )
); // 526

// Validity alert bar (PSQI93, Figma 6071:199259 reduced; VIS-18): one row, 46 px
// tall, spanning the chart's width; from the right 24 px padding, the 21 px alert
// icon, 12 px gap, then the text. The plot starts 24 px under it.
const ALERT = { height: 46, gap: 24, padRight: 24, icon: 21, iconGap: 12, iconTop: 14, baseline: 26.5 };
const ALERT_BLOCK = ALERT.height + ALERT.gap; // 70
const CHART = {
  width: MEAN.left + MEAN.width, // 713
  height: ALERT_BLOCK + PLOT_HEIGHT, // 596
};

const pctWidth = (p) => (Math.min(Math.max(p, 0), 100) * BAR.width) / 100;

class VIAYOUTH93 extends Profile {
  static pages = 2;

  // Names from the brief's table; keys from scoring/VIAYOUTH93.py:
  // `<code>_raw` = mean of the four items (1..5) and `<code>_percent` =
  // round_half_up(raw ÷ 5, 3), a fraction 0.200..1.000. Order = display order.
  labels = {
    L1: { eng: "crea_raw", title: "خلاقیّت، قوۀ ابتکار، و ابداع" },
    L2: { eng: "crea_percent" },
    L3: { eng: "curi_raw", title: "حس کنجکاوی و علاقه به دنیا" },
    L4: { eng: "curi_percent" },
    L5: { eng: "judg_raw", title: "داوری، تحلیل‌گری، و روشنفکری" },
    L6: { eng: "judg_percent" },
    L7: { eng: "lear_raw", title: "علاقه به یادگیری" },
    L8: { eng: "lear_percent" },
    L9: { eng: "wisd_raw", title: "دید (حکمت)" },
    L10: { eng: "wisd_percent" },
    L11: { eng: "brav_raw", title: "شجاعت و دلیری" },
    L12: { eng: "brav_percent" },
    L13: { eng: "pers_raw", title: "بردباری، تلاشگری، و پشتکاری" },
    L14: { eng: "pers_percent" },
    L15: { eng: "hone_raw", title: "صداقت، اعتبار و اصالت" },
    L16: { eng: "hone_percent" },
    L17: { eng: "zest_raw", title: "وجد و شادی، هیجان و انرژی" },
    L18: { eng: "zest_percent" },
    L19: { eng: "love_raw", title: "دارای استعداد ارائه و پذیرش محبّت" },
    L20: { eng: "love_percent" },
    L21: { eng: "kind_raw", title: "محبّت و سخاوت" },
    L22: { eng: "kind_percent" },
    L23: { eng: "soci_raw", title: "شعور اجتماعی" },
    L24: { eng: "soci_percent" },
    L25: { eng: "team_raw", title: "کار گروهی، تبعیت، و وفاداری" },
    L26: { eng: "team_percent" },
    L27: { eng: "fair_raw", title: "انصاف، برابری، و عدالت" },
    L28: { eng: "fair_percent" },
    L29: { eng: "lead_raw", title: "رهبری" },
    L30: { eng: "lead_percent" },
    L31: { eng: "forg_raw", title: "مهربانی و بخشندگی" },
    L32: { eng: "forg_percent" },
    L33: { eng: "humi_raw", title: "افتادگی و فروتنی" },
    L34: { eng: "humi_percent" },
    L35: { eng: "prud_raw", title: "محتاط بودن، هوشیاری، و بصیرت" },
    L36: { eng: "prud_percent" },
    L37: { eng: "self_raw", title: "خویشتن‌دار و منظبط" },
    L38: { eng: "self_percent" },
    L39: { eng: "beau_raw", title: "قدردان زیبائی و فضیلت" },
    L40: { eng: "beau_percent" },
    L41: { eng: "grat_raw", title: "قدرشناسی" },
    L42: { eng: "grat_percent" },
    L43: { eng: "hope_raw", title: "امید، خوش‌بینی و آینده‌نگری" },
    L44: { eng: "hope_percent" },
    L45: { eng: "humo_raw", title: "شوخ‌طبعی و سرزندگی" },
    L46: { eng: "humo_percent" },
    L47: { eng: "spir_raw", title: "معنویت، هدف‌گرایی و ایمان" },
    L48: { eng: "spir_percent" },
    L49: { eng: "status" }, // valid | invalid
    L50: { eng: "age_alert" }, // 1 = age empty or outside 10..17; 0 otherwise; None when invalid
  };

  profileSpec = {
    sample: {
      name: "قوت‌های منش نوجوانان",
      multiProfile: false,
      questions: false,
      defaultFields: true,
      fields: [],
    },
    profile: {
      get dimensions() {
        return {
          width: CHART.width + 2 * this.padding.x, // 713 → 903
          height: CHART.height + 2 * this.padding.y, // 596 → 714
        };
      },
      // Chart centred on the 943 × 754 design page, minus the 20 px the layout owns;
      // one size for both pages.
      padding: {
        x: (943 - CHART.width) / 2 - 20, // 95
        y: (754 - CHART.height) / 2 - 20, // 59
      },
    },
    labels: Object.values(this.labels),
  };

  constructor(dataset, options, config = {}) {
    super();
    // `_extractData` turns a stored 0 into undefined (`score[key] || …`); read the
    // scoring output itself so nothing missing can pass as a number.
    this.storedScore = (dataset && dataset.score) || {};
    this._init(dataset, options, config);
  }

  _stored(key) {
    const v = this.storedScore[key];
    if (v === undefined || v === null || v === "") return null;
    const n = Number(v);
    return Number.isFinite(n) ? n : null;
  }

  // One strength: its name, mean with two decimals and whole percent (halves up,
  // integer arithmetic on the stored 3-decimal fraction).
  _strength(code) {
    const label = Object.values(this.labels).find((l) => l.eng === `${code}_raw`);
    const raw = this._stored(`${code}_raw`);
    const percent = this._stored(`${code}_percent`);
    if (raw === null || percent === null) return null;
    const p = Math.min(Math.max(percent, 0), 1);
    const thousandths = Math.round(p * 1000);
    return { code, title: label.title, mean: raw.toFixed(2), pct: Math.floor((thousandths + 5) / 10), p };
  }

  _calcContext() {
    // All-or-nothing: the status is read first, so `?? 0` can never turn the
    // None scores of an invalid sheet into lowest scores.
    const scored = GROUPS.map((g) => ({ title: g.title, items: g.codes.map((c) => this._strength(c)) }));
    const complete = scored.every((g) => g.items.every(Boolean));
    if (this.storedScore.status !== "valid" || !complete)
      return PAGES.map((page) => ({ titleAppend: page.titleAppend, valid: false, box: { x: CHART.width / 2 } }));

    // Only an explicit 1 shows the alert, on both pages. With it the plot sits
    // under the alert bar; without it the plot moves up by half the alert block,
    // so the chart stays centred with no empty band where the alert would be.
    const ageAlert = this._stored("age_alert") === 1;
    const plotTop = ageAlert ? ALERT_BLOCK : ALERT_BLOCK / 2;
    const iconX = CHART.width - ALERT.padRight - ALERT.icon;

    return PAGES.map((page) => ({
      titleAppend: page.titleAppend,
      ...this._page(page.groups.map((g) => scored[g])),
      ageAlert,
      alert: {
        width: CHART.width - 1,
        height: ALERT.height - 1,
        iconX,
        iconY: ALERT.iconTop,
        textX: iconX - ALERT.iconGap, // right edge of the text
        baseline: ALERT.baseline,
      },
      plotTop,
    }));
  }

  // One page: its three groups, in fixed order, on the shared axis.
  _page(scored) {
    let top = CARD.top;
    const groups = scored.map((g) => {
      const height = groupHeight(g.items.length);
      const cardTop = top;
      top += height + CARD.gap;
      const items = g.items.map((s, i) => {
        const width = s.p * BAR.width; // fills from 0 by the stored fraction
        const inside = width >= INSIDE_MIN;
        const rowTop = cardTop + CARD.paddingY + i * BAR.pitch;
        return {
          code: s.code,
          title: s.title,
          mean: s.mean,
          pct: s.pct,
          width,
          radius: Math.min(2, width),
          top: rowTop,
          titleBaseline: rowTop + 11.505,
          scoreBaseline: rowTop + 12.55,
          percentX: inside ? BAR.x + width - 4 : BAR.x + width + 6,
          percentAnchor: inside ? "end" : "start",
          percentFill: inside ? "white" : COLOR.dark,
        };
      });
      return {
        title: g.title,
        top: cardTop,
        rectWidth: CARD.width - 1,
        rectHeight: height - 1,
        centerX: CARD.width / 2,
        centerY: height / 2,
        items,
      };
    });

    return {
        valid: true,
        groups,
        bar: BAR,
        color: COLOR,
        cardX: CARD.x,
        titleRight: TITLE_RIGHT,
        meanX: MEAN.left,
        gridTop: GRID_TOP,
        gridBottom: PLOT_HEIGHT,
        baselineX: BAR.x - 0.5,
        baselineHeight: PLOT_HEIGHT - GRID_TOP,
        ticks: TICKS.map((value) => ({
          value,
          x: BAR.x + pctWidth(value),
          labelX: value === 100 ? BAR.x + BAR.width + 1 : BAR.x + pctWidth(value),
          anchor: value === 100 ? "end" : "middle",
          dashed: value > 0,
        })),
    };
  }
}

module.exports = VIAYOUTH93;
