const { Profile } = require("../Profile");

// Answer keys from the scoring source (risloo-samples scoring/dictionary/Raven9A.py):
// Set I is the 12 practice items, Set II the 36 scored items.
const answersI = [8, 4, 5, 1, 2, 5, 6, 3, 7, 8, 7, 6];
const answersII = [
  5, 1, 7, 4, 3, 1, 6, 1, 8, 4, 5, 6,
  2, 1, 2, 4, 6, 7, 3, 8, 8, 7, 6, 3,
  7, 2, 7, 5, 6, 5, 4, 8, 5, 1, 3, 2,
];
// Below this many correct practice answers Set II is not scored and raw is set to 5
const PRE_MIN = 6;

// The five levels of the scoring source, keyed by its `report` value (profile brief, card order top to bottom)
const GREEN = ["#059669", "#10B981"];
const GRAY = ["#475569", "#64748B"];
const RED = ["#E11D48", "#F43F5E"];
const LEVELS = [
  { key: "gifted", title: "تیزهوش", min: 128, color: GREEN },
  { key: "superior_inteligence", title: "هوش برتر", min: 120, max: 127, color: GREEN },
  { key: "high_inteligence", title: "هوش بالا", min: 110, max: 119, color: GREEN },
  { key: "average", title: "متوسط", min: 90, max: 109, color: GRAY },
  { key: "below_average", title: "پایین‌تر از متوسط", min: 0, max: 89, color: RED },
];

// Card column: Raven93 card size and pitch; the lowest level sits apart by an extra gap
// (agent design for the brief's «فاصله یا رنگ، با طراح»). The column is centred on Raven93's.
const CARD = { height: 64, pitch: 78, lowGap: 26 };
const COLUMN_CENTER = 32 + (7 * CARD.pitch - (CARD.pitch - CARD.height)) / 2;

// Answer grid: Raven93 row geometry, 4 rows of 12
const GRID = { top: 338, pitch: 54, rowHeight: 42 };

// Alert bar (VIS-18 / PSQI93 pattern), spanning the answer grid content
const ALERT = { gap: 16, height: 68, x: 256, width: 475 };

// IQ axis of the Raven93 bell curve: 40 to 160, 5 px per point
const IQ_MIN = 40;
const IQ_MAX = 160;
// The marker line sits at chart x = 1 + 5·IQ and «رتبه درصدی» ends 93 units right of it
// (measured in the render). Raven93 never passes IQ 149; Raven9A reaches 154, so the
// badge cluster shifts left to keep that label 4 units inside the clip edge (chart x 859).
const LABEL_REACH = 93;
const LABEL_LIMIT = 855;
const markerLine = (iq) => 1 + 5 * iq;

class Raven9A extends Profile {
  // Number of pages
  static pages = 1;

  // Labels of the sample
  labels = {
    L1: { eng: "pre" },
    L2: { eng: "raw" },
    L3: { eng: "iq" },
    L4: { eng: "percentile" },
    L9: { eng: "report" },
  };

  profileSpec = {
    /* "sample" determines some important info about the sample and profile */
    /* Default prerequisites: 1. gender, 2. age, 3. education */
    /* "prerequisites" is synonym to "fields" in our program */
    sample: {
      name: "آزمون ریون پیشرفته" /* Name of the sample */,
      multiProfile: false /* Whether the sample has multiple profiles or not */,
      questions: true /* Determines whether to get questions from inital dataset or not */,
      defaultFields: true /* Determines whether to have default prerequisites in the profile or not */,
      fields: [] /* In case you want to get some additional fields and show in the profile */,
    },
    /* "profile" determines the dimensions of the drawn profile (to be used in svg tag viewbox) */
    /* Raven93's Chart, 22 px taller for the two-row alert bar under the four grid rows */
    profile: {
      get dimensions() {
        return {
          width: 815 + 2 * this.padding.x,
          height: 640 + 2 * this.padding.y,
        };
      },
      padding: {
        x: 44,
        y: 37,
      },
    },
    /* "labels" part which has to be provided for each profile */
    labels: Object.values(this.labels),
  };

  constructor(dataset, options, config = {}) {
    super();
    this._init(dataset, options, config);
  }

  _calcContext() {
    const { dataset } = this;
    const [, rawMark, iqMark, percentileMark, reportMark] = dataset.score.map((s) => s.mark);

    const raw = rawMark ?? 0;
    const percentile = percentileMark ?? 0;
    // IQ may carry a sign at the table ends ("<89", ">154"); the marker sits on the bare number
    const iqText = iqMark ?? null;
    const iq = iqText === null ? null : parseInt(String(iqText).replace(/[<>]/, ""), 10);
    const hasIq = Number.isFinite(iq);

    const levelKey =
      reportMark ?? (hasIq ? LEVELS.find((level) => iq >= level.min).key : null);
    const levels = LEVELS.map((level, index) => ({
      ...level,
      selected: level.key === levelKey,
      y: index * CARD.pitch + (index === LEVELS.length - 1 ? CARD.lowGap : 0),
    }));
    const columnHeight = levels[levels.length - 1].y + CARD.height;
    const columnTop = COLUMN_CENTER - columnHeight / 2;
    const selected = levels.find((level) => level.selected) ?? { color: GRAY };

    // Marker colour as in Raven93's intent: above 100 green, 100 gray, below 100 red
    const indic = { color: !hasIq ? GRAY : iq > 100 ? GREEN : iq === 100 ? GRAY : RED };
    const iqX = hasIq ? Math.min(Math.max(iq, IQ_MIN), IQ_MAX) : null;
    const labelShift = hasIq ? Math.min(0, LABEL_LIMIT - (markerLine(iqX) + LABEL_REACH)) : 0;

    const isCorrect = (key, item) => key === parseInt(item?.user_answered, 10);
    const questions = dataset.questions;
    const setI = answersI.map((key, i) => ({ index: i + 1, isTrue: isCorrect(key, questions[i]) }));
    const setII = answersII.map((key, i) => ({
      index: i + 13,
      isTrue: isCorrect(key, questions[i + 12]),
    }));
    const countI = setI.filter((item) => item.isTrue).length;
    const countII = setII.filter((item) => item.isTrue).length;

    const rows = [
      { items: setI, label: { key: "I", count: countI } },
      { items: setII.slice(0, 12) },
      { items: setII.slice(12, 24), label: { key: "II", count: countII } },
      { items: setII.slice(24, 36) },
    ].map((row, index) => ({ ...row, y: index * GRID.pitch }));
    // Bracket tying the three Set II rows to their single count
    const bracket = { top: GRID.pitch + 8, bottom: 3 * GRID.pitch + GRID.rowHeight - 8 };

    const alertTop = GRID.top + 3 * GRID.pitch + GRID.rowHeight + ALERT.gap;
    const alert =
      countI < PRE_MIN
        ? {
            top: alertTop,
            height: ALERT.height,
            x: ALERT.x,
            width: ALERT.width,
            // PSQI93 bar: icon 24 px from the right edge, text 12 px after the 21 px icon box
            iconX: ALERT.x + ALERT.width - 45,
            iconY: alertTop + 25,
            // Exact text of the approved brief, broken at its sentence boundary;
            // two 22 px rows around the bar's mid-line, as PSQI93's two-row bar
            lines: [
              "بخش تمرینی به حد نصاب نرسید (کمتر از 6 پاسخ درست).",
              "بخش اصلی نمره‌گذاری نشد و نمرهٔ خام 5 منظور شد.",
            ].map((text, i) => ({
              text,
              x: ALERT.x + ALERT.width - 57,
              y: alertTop + ALERT.height / 2 - 1 + (i - 0.5) * 22 + 4.5,
            })),
          }
        : null;

    return [
      {
        levels,
        columnTop,
        selected,
        indic,
        hasIq,
        iqX,
        labelShift,
        iqText,
        raw,
        percentile,
        rows,
        bracket,
        gridTop: GRID.top,
        alert,
      },
    ];
  }
}

module.exports = Raven9A;
