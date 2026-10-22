const { Profile } = require("../Profile");

// ---------------------------------------------------------------------------
// MCMI93 — آزمون شخصیت میلون (۳). One page.
//
// What is shown comes from the approved brief
// (docs/profiles/MCMI-93_profile_brief_fa.md). There is no Figma for this
// profile; the brief places it on the structure of page 1 of MCMI9A, so the
// geometry, palette and components below are MCMI9A page 1 (MCMI9A.js,
// MCMI9A_main_partial.hbs) with only the differences the brief names:
//   - 27 columns (X Y Z | 1 2A 2B 3 4 5 6A 6B 7 8A 8B, S C P | A H N D B T R,
//     SS CC PP); scale 4 replaces 4A/4B, so the personality chart is one
//     column (20 px) narrower;
//   - chart 1 has no boundary lines and no level labels; charts 2 and 3 use one
//     colour rule (< 75 gray, 75–84 orange, ≥ 85 rose), no yellow, no level
//     labels beside the axis; chart 2 keeps the 60 line;
//   - the BR printed on a column is the stored value, also below 0 or above 115;
//     only the bar is clamped to the axis;
//   - the disclosure (X) raw score is printed with two decimals;
//   - the side column holds the elevated codes (no cap), the V card, and one
//     alert card ("آزمون نامعتبر است" + each alert in table order). There is no
//     W card, no BR-adjustment card and no super-group label row.
//
// Data: Risloo sends `score` as `{ <scale>: { raw, br }, status, message,
// messages }` (risloo app/Http/Resources/ScoreMCMI93.php). Messages arrive in
// English; their Persian text is the one in risloo resources/lang/fa.json and
// in brief §۳, mapped here verbatim.
// ---------------------------------------------------------------------------

const PERSONALITY = [
  { key: "1", code: "1", fa: "اسکیزوئید" },
  { key: "2a", code: "2A", fa: "اجتنابی" },
  { key: "2b", code: "2B", fa: "افسرده" },
  { key: "3", code: "3", fa: "وابسته" },
  { key: "4", code: "4", fa: "نمایشی" },
  { key: "5", code: "5", fa: "خودشیفته" },
  { key: "6a", code: "6A", fa: "ضداجتماعی" },
  { key: "6b", code: "6B", fa: "آزارگر" },
  { key: "7", code: "7", fa: "اجباری" },
  { key: "8a", code: "8A", fa: "منفی‌گرا" },
  { key: "8b", code: "8B", fa: "خودناکام‌ساز" },
  { key: "s", code: "S", fa: "اسکیزوتایپی" },
  { key: "c", code: "C", fa: "مرزی" },
  { key: "p", code: "P", fa: "پارانوئید" },
];

const CLINICAL = [
  { key: "a", code: "A", fa: "اضطراب" },
  { key: "h", code: "H", fa: "شبه‌جسمی" },
  { key: "n", code: "N", fa: "دوقطبی؛ مانیا" },
  { key: "d", code: "D", fa: "افسرده‌خویی" },
  { key: "b", code: "B", fa: "وابستگی به الکل" },
  { key: "t", code: "T", fa: "وابستگی به مواد" },
  { key: "r", code: "R", fa: "اختلال استرس پس از ضربه" },
  { key: "ss", code: "SS", fa: "اختلال تفکر" },
  { key: "cc", code: "CC", fa: "افسردگی اساسی" },
  { key: "pp", code: "PP", fa: "اختلال هذیانی" },
];

const MODIFYING = [
  { key: "x", code: "X", fa: "افشاگری" },
  { key: "y", code: "Y", fa: "جامعه‌پسندی" },
  { key: "z", code: "Z", fa: "بدجلوه‌دهی" },
];

// The five alerts of brief §۳, in table order: the English message the
// scoring stores and the Persian text shown.
const ALERTS = [
  { message: "The age of the clients must be more than 18", fa: "سن آزمودنی باید ۱۸ سال یا بیشتر باشد." },
  { message: "The number of blank answers should not exceed 18", fa: "تعداد پاسخ‌های خالی نباید بیشتر از ۱۸ باشد." },
  { message: "Validity factor error", fa: "پاسخ‌های غیرعادی به گویه‌های اعتبارسنجی (مقیاس V)." },
  { message: "X factor must be between 34 and 178", fa: "نمره X باید بین ۳۴ و ۱۷۸ باشد." },
  { message: "1-8B less than 60", fa: "همه نمره‌های BR مقیاس‌های ۱ تا 8B کمتر از ۶۰ هستند." },
];

const THEMES = {
  blue: { gradient: "mcm93Blue", track: "#EFF6FF", dark: "#2563EB" },
  gray: { gradient: "mcm93Gray", track: "#F8FAFC", dark: "#475569" },
  orange: { gradient: "mcm93Orange", track: "#FFF7ED", dark: "#EA580C" },
  rose: { gradient: "mcm93Rose", track: "#FFF1F2", dark: "#E11D48" },
};

// V card: same states, colours and text positions as MCMI9A page 1.
const REPORTS = {
  valid: { text: "معتبر", background: "#ECFDF5", color: "#059669", rawY: 54.2, equalsY: 71, reportY: 96.8 },
  questionable: { text: "تفسیر با احتیاط", background: "#FEFCE8", color: "#CA8A04", rawY: 27.1, equalsY: 49.5, reportY: 102 },
  invalid: { text: "نامعتبر", background: "#FEF2F2", color: "#DC2626", rawY: 50.9, equalsY: 70, reportY: 99.8 },
};

// Geometry (chart space; MCMI9A page 1 shifted by the wider side column).
const BASE_Y = 464; // column baseline
const AXIS_TOP = 64; // top of every track (400 px)
const MAIN_INSIDE_SCORE_GAP = 2;
const OUTSIDE_SCORE_GAP = 6;
const MODIFYING_INSIDE = 25; // as MCMI9A
const SCALE_INSIDE = 75; // as the MCMI9A clinical chart (no yellow band here)
const CHART = { width: 892, height: 706 };

// Side column: three 32 px rails at x = 0, 40, 80.
const CODES = { top: 124, bottom: 416, rails: [0, 40] };
const ALERT_CARD = {
  length: 290, // along the page height, from the bottom of the side column
  titleY: 16,
  dividerY: 29,
  firstY: 42,
  pitch: 14,
  padEnd: 12,
};

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

// The four-segment BR axis of MCMI9A: 0–60 → 90, 60–75 → 105, 75–85 → 100,
// 85–115 → 105 px of 400.
function brHeight(br) {
  const value = clamp(br, 0, 115);
  if (value <= 60) return value * 1.5;
  if (value <= 75) return 90 + (value - 60) * 7;
  if (value <= 85) return 195 + (value - 75) * 10;
  return 295 + (value - 85) * 3.5;
}

function scaleTheme(br) {
  if (br >= 85) return THEMES.rose;
  if (br >= 75) return THEMES.orange;
  return THEMES.gray;
}

// Display: the stored value, without trailing decimal zeros (VIS-29), with the
// project's decimal separator.
function plain(value) {
  return String(Number(value.toFixed(2))).replace(".", "٬");
}

class MCMI93 extends Profile {
  static pages = 1;

  labels = Object.fromEntries(
    [...MODIFYING, ...PERSONALITY, ...CLINICAL, { key: "v" }, { key: "status" }, { key: "message" }, { key: "messages" }].map(
      ({ key }) => [`L${key}`, { eng: key }],
    ),
  );

  profileSpec = {
    sample: {
      name: "آزمون شخصیت میلون",
      multiProfile: false,
      questions: false,
      defaultFields: true,
      fields: [],
    },
    profile: {
      get dimensions() {
        return {
          width: CHART.width + 2 * this.padding.x,
          height: CHART.height + 2 * this.padding.y,
        };
      },
      padding: { x: 5.5, y: 4 },
    },
    labels: Object.values(this.labels),
  };

  constructor(dataset, options, config = {}) {
    super();
    this._init(dataset, options, config);
  }

  _calcContext() {
    const byKey = new Map(this.dataset.score.map((item) => [item.label.eng, item.mark]));
    const scale = (key) => byKey.get(key) ?? {};
    const num = (value) => {
      const n = Number(value ?? 0);
      return Number.isFinite(n) ? n : 0;
    };

    const column = (item, x, { inside, height, theme }) => {
      const { raw, br } = scale(item.key);
      const brValue = num(br);
      const barHeight = height(brValue);
      const barTop = BASE_Y - barHeight;
      const isInside = brValue >= inside;
      return {
        ...item,
        x,
        center: x + 6,
        raw: item.key === "x" ? num(raw).toFixed(2).replace(".", "٬") : plain(num(raw)),
        br: brValue,
        brText: plain(brValue),
        barHeight,
        barTop,
        scoreY: isInside ? barTop + MAIN_INSIDE_SCORE_GAP : barTop - OUTSIDE_SCORE_GAP,
        scoreAnchor: isInside ? "end" : "start",
        inside: isInside,
        theme: theme(brValue),
      };
    };

    const modifying = MODIFYING.map((item, i) =>
      column(item, 168 + i * 20, {
        inside: MODIFYING_INSIDE,
        height: (br) => clamp(br, 0, 100) * 4,
        theme: () => THEMES.blue,
      }),
    );
    const personality = PERSONALITY.map((item, i) =>
      column(item, i < 11 ? 300 + i * 20 : 536 + (i - 11) * 20, {
        inside: SCALE_INSIDE,
        height: brHeight,
        theme: scaleTheme,
      }),
    );
    const clinical = CLINICAL.map((item, i) =>
      column(item, i < 7 ? 676 + i * 20 : 832 + (i - 7) * 20, {
        inside: SCALE_INSIDE,
        height: brHeight,
        theme: scaleTheme,
      }),
    );

    // Elevated codes: every scale 1…PP with final BR ≥ 75, highest first, ties
    // in chart order; no cap. Up to 8 fit one rail of 32 px boxes; up to 16 use
    // a second rail; beyond that both rails switch to 20 px boxes (24 max).
    const elevated = [...personality, ...clinical]
      .map((item, order) => ({ code: item.code, br: item.br, order }))
      .filter((item) => item.br >= 75)
      .sort((a, b) => b.br - a.br || a.order - b.order);
    const compact = elevated.length > 16;
    const pitch = compact ? 24 : 36;
    const perRail = Math.floor((CODES.bottom - CODES.top + 4) / pitch);
    const codes = elevated.map((item, i) => {
      const rail = Math.floor(i / perRail);
      const y = CODES.top + (i % perRail) * pitch;
      const height = pitch - 4;
      return { code: item.code, x: CODES.rails[rail] ?? CODES.rails[CODES.rails.length - 1], y, height, center: y + height / 2 };
    });

    // V card from the raw validity score.
    const vRaw = num(scale("v").raw);
    const vState = vRaw >= 2 ? "invalid" : vRaw >= 1 ? "questionable" : "valid";
    const validity = { raw: plain(vRaw), ...REPORTS[vState] };

    // Alerts: what the scoring raised, in brief table order. An unknown message
    // is still shown (verbatim) after the known ones rather than dropped.
    const rawMessages = byKey.get("messages");
    const firstMessage = byKey.get("message");
    const messages = Array.isArray(rawMessages) && rawMessages.length ? rawMessages : firstMessage ? [firstMessage] : [];
    const known = ALERTS.filter((alert) => messages.includes(alert.message)).map((alert) => alert.fa);
    const unknown = messages.filter((m) => !ALERTS.some((alert) => alert.message === m)).map(String);
    const lines = [...known, ...unknown];
    const invalid = byKey.get("status") === "invalid" || lines.length > 0;
    const card = ALERT_CARD;
    const thickness = lines.length
      ? card.firstY + (lines.length - 1) * card.pitch + card.padEnd
      : card.dividerY + 3;
    const alert = invalid
      ? {
          length: card.length,
          thickness,
          titleY: card.titleY,
          dividerY: card.dividerY,
          lines: lines.map((text, i) => ({
            text,
            // Latin identifiers (X, V, BR, 8B) keep Latin digits, as the codes do.
            parts: text
              .split(/([A-Za-z0-9]*[A-Za-z][A-Za-z0-9]*)/)
              .filter(Boolean)
              .map((part) => ({ text: part, latin: /[A-Za-z]/.test(part) })),
            y: card.firstY + i * card.pitch,
          })),
        }
      : null;

    return [
      {
        modifying,
        personality,
        clinical,
        codes,
        validity,
        alert,
        chartHeight: CHART.height,
      },
    ];
  }
}

module.exports = MCMI93;
