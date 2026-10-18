const { Profile } = require("../Profile");

// Answer key from the scoring source (risloo-samples scoring/dictionary/Raven9Q.py)
const answers = [
  4, 5, 1, 2, 6, 3, 6, 2, 1, 3, 4, 5,
  4, 5, 1, 6, 2, 1, 3, 4, 6, 3, 5, 2,
  2, 6, 1, 2, 1, 3, 5, 6, 4, 3, 4, 5,
];
// Three sets of 12 items, in grid order top to bottom
const SETS = ["A", "Ab", "B"];

// Raven93's seven levels and boundaries, chosen from the Iranian IQ (profile brief)
const GREEN = ["#059669", "#10B981"];
const GRAY = ["#475569", "#64748B"];
const RED = ["#E11D48", "#F43F5E"];
const LEVELS = [
  { title: "خیلی سرآمد", min: 149, color: GREEN },
  { title: "سرآمد", min: 125, max: 148, color: GREEN },
  { title: "متوسط بالا", min: 113, max: 124, color: GREEN },
  { title: "متوسط (بهنجار)", min: 89, max: 112, color: GRAY },
  { title: "متوسط پایین", min: 77, max: 88, color: RED },
  { title: "مرزی", min: 65, max: 76, color: RED },
  { title: "بسیار پایین", min: 0, max: 64, color: RED },
];

// IQ axis of the Raven93 bell curve: 40 to 160, 5 px per point
const IQ_MIN = 40;
const IQ_MAX = 160;
// As Raven9A: the marker line sits at chart x = 1 + 5·IQ; «رتبه درصدی» ends 93 units right
// of it and «نمره خام» 77 units left (measured in the render). Near either edge the badge
// cluster shifts inward to keep its labels 4 units inside the clip (chart x 159 to 859);
// the line and arrow stay on the IQ. Raven9Q reaches IQ 42 on the left, Raven9A does not.
const LABEL_REACH = { left: 77, right: 93 };
const LABEL_LIMIT = { left: 163, right: 855 };
const markerLine = (iq) => 1 + 5 * iq;
const clusterShift = (iq) =>
  Math.max(0, LABEL_LIMIT.left - (markerLine(iq) - LABEL_REACH.left)) +
  Math.min(0, LABEL_LIMIT.right - (markerLine(iq) + LABEL_REACH.right));

class Raven9Q extends Profile {
  // Number of pages
  static pages = 1;

  // Labels of the sample
  labels = {
    L1: { eng: "raw" },
    L2: { eng: "iq" },
    L3: { eng: "percentile" },
  };

  profileSpec = {
    /* "sample" determines some important info about the sample and profile */
    /* Default prerequisites: 1. gender, 2. age, 3. education */
    /* "prerequisites" is synonym to "fields" in our program */
    sample: {
      name: "آزمون ریون کودکان" /* Name of the sample */,
      multiProfile: false /* Whether the sample has multiple profiles or not */,
      questions: true /* Determines whether to get questions from inital dataset or not */,
      defaultFields: true /* Determines whether to have default prerequisites in the profile or not */,
      fields: [] /* In case you want to get some additional fields and show in the profile */,
    },
    /* "profile" determines the dimensions of the drawn profile (to be used in svg tag viewbox) */
    /* Raven93's page and Chart size */
    profile: {
      get dimensions() {
        return {
          width: 815 + 2 * this.padding.x,
          height: 618 + 2 * this.padding.y,
        };
      },
      padding: {
        x: 44,
        y: 48,
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
    const [rawMark, iqMark, percentileMark] = dataset.score.map((s) => s.mark);

    const raw = rawMark ?? 0;
    // Percentile is shown as stored, with its "-" or "+" at the table ends
    const percentile = percentileMark ?? 0;
    // The scoring stores IQ as text; no IQ (raw 0) draws no marker and selects no card
    const iqText = iqMark ?? null;
    const iq = iqText === null ? null : parseInt(String(iqText), 10);
    const hasIq = Number.isFinite(iq);

    const levels = LEVELS.map((level, index) => ({
      ...level,
      selected: hasIq && iq >= level.min && (level.max === undefined || iq <= level.max),
      y: index * 78,
    }));
    const selected = levels.find((level) => level.selected) ?? { color: GRAY };

    // Marker colour: above 100 green, 100 gray, below 100 red
    const indic = { color: !hasIq ? GRAY : iq > 100 ? GREEN : iq === 100 ? GRAY : RED };
    // IQ 161 to 165 stays on the right end of the axis with its real number in the badge
    const iqX = hasIq ? Math.min(Math.max(iq, IQ_MIN), IQ_MAX) : null;
    const labelShift = hasIq ? clusterShift(iqX) : 0;

    // An unanswered item counts as wrong
    const questions = SETS.map((key, set) => {
      const items = answers.slice(set * 12, set * 12 + 12).map((answer, i) => {
        const index = set * 12 + i;
        return {
          index: index + 1,
          isTrue: answer === parseInt(dataset.questions[index]?.user_answered, 10),
        };
      });
      return { key, items, length: items.filter((item) => item.isTrue).length };
    });

    return [{ levels, selected, indic, hasIq, iqX, labelShift, iqText, raw, percentile, questions }];
  }
}

module.exports = Raven9Q;
