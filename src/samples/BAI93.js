const { Profile } = require("../Profile");

// ---------------------------------------------------------------------------
// No Figma design: design from the approved brief
// (docs/profiles/BAI_profile_brief_fa.md), in the bar language of IAT93 and
// the Beck palette of BDI93. One page, Chart 840 × 676, two parts:
//
// 1. The total score: one horizontal bar from 0 (left) to 63 (right), filled by
//    the stored percent in the colour of the person's level, the rest the light
//    track. Directly under it a thin strip of the same length in four pale
//    parts, one per level, split between two neighbouring scores (7.5, 15.5,
//    25.5 of 63), each part with its level name and range under it. The raw
//    score of the maximum and the percent sit beside the bar; «درجه اضطراب» and
//    the person's level above it.
// 2. «پاسخ به نشانه‌ها»: all 21 symptoms grouped by the answer value, 3 → 0,
//    each group's name and value in a right-hand column with its colour as an
//    accent bar, its rows on a pale tint of the same colour, symptoms in
//    question order inside a group; an empty group is not drawn.
// ---------------------------------------------------------------------------
const CHART = { width: 840, height: 676 }; // tallest case: 21 rows in four groups ends at 676
const BAR = { x: 0, length: 700, top: 34, height: 20 }; // 63 points = 700 px
const STRIP = { gap: 3, height: 6, split: 1 }; // under the bar; 1 px each side of a border
const LEVEL_TEXT = { name: 21, range: 37 }; // baselines measured from the strip bottom
const NUMBERS = { raw: 14, percent: 80 }; // left edges, measured from the bar's 63 end
const TABLE = {
  titleBaseline: 146,
  top: 166,
  rowHeight: 20,
  rowPitch: 23,
  groupGap: 10,
  rowsRight: 728, // rows run 0 … 728; the group column 736 … 840
  groupRight: 840,
  accent: 4,
};
const TEXT_MID = 4.2; // 12–13 px Dana: baseline sits this far under the visual mid-line

// The four levels exactly as the brief names, bounds and colours them; indexed
// by the `range` code of the scoring (0: ≤ 7, 1: ≤ 15, 2: ≤ 25, 3: else).
const LEVELS = [
  { title: "هیچ یا کمترین حد", from: 0, to: 7, color: "#475569", pale: "#CBD5E1" },
  { title: "خفیف", from: 8, to: 15, color: "#EAB308", pale: "#FDE047" },
  { title: "متوسط", from: 16, to: 25, color: "#EA580C", pale: "#FDBA74" },
  { title: "شدید", from: 26, to: 63, color: "#E11D48", pale: "#FDA4AF" },
];
const TRACK = "#F1F5F9";

// The symptom groups by answer value (option number − 1): the short option
// name from the BAI form without its parenthesised note, and the brief's
// colour. Row tints are BDI93's pale tints of the same four hues.
const GROUPS = {
  3: { title: "شدید", color: "#E11D48", tint: "#FFF1F2" },
  2: { title: "متوسط", color: "#EA580C", tint: "#FFEDD580" },
  1: { title: "خفیف", color: "#EAB308", tint: "#FEFCE8BF" },
  0: { title: "اصلا", color: "#475569", tint: "#F8FAFC" },
};
const MAX = 63;

class BAI93 extends Profile {
  static pages = 1;

  // BAI93 — آزمون اضطراب بک. 21 items, four options each, worth option − 1
  // (0..3); one total (0..63). Keys per the approved brief: `total_raw`,
  // `total_percent` (raw ÷ 63 as a 3-decimal fraction) and `range` (level code).
  labels = {
    L1: { eng: "total_raw", max: MAX },
    L2: { eng: "total_percent" },
    L3: { eng: "range" },
  };

  profileSpec = {
    sample: {
      name: "آزمون اضطراب بک",
      multiProfile: false,
      questions: true,
      defaultFields: true,
      fields: [],
    },
    profile: {
      get dimensions() {
        return {
          width: CHART.width + 2 * this.padding.x, // → 903
          height: CHART.height + 2 * this.padding.y, // → 714
        };
      },
      // Chart centred on the 943 × 754 design page, minus the 20 px the layout
      // already owns on every side, so the page resolves to 903 × 714.
      padding: {
        x: 31.5, // (943 − 840) / 2 − 20
        y: 19, // (754 − 676) / 2 − 20
      },
    },
    labels: Object.values(this.labels),
  };

  constructor(dataset, options, config = {}) {
    super();
    // `_extractData` turns a stored 0 into undefined (`score[key] || …`), but 0
    // is a valid raw score, percent and level code here. Keep the scoring output
    // itself so only an absent or empty field counts as "not produced" (SISRI93).
    this.storedScore = (dataset && dataset.score) || {};
    this._init(dataset, options, config);
  }

  _calcContext() {
    const { score, questions } = this.dataset;
    const [raw, percent, range] = score;

    // A stored 0 is a real score (empty bar, «0 از 63», «٪ 0», the lowest level).
    // A missing total or level means no score was produced: the track, strip and
    // table stay, but no number, level or fill is drawn. A sheet with an
    // unanswered item is never scored, so this does not occur on real data.
    const stored = (key) => this.storedScore[key];
    const present = (v) => v !== undefined && v !== null && v !== "";
    const level = LEVELS[Number(stored(range.label.eng))];
    const hasScore = present(stored(raw.label.eng)) && level !== undefined;
    const mark = Number(raw.mark ?? 0);

    // The stored percent is a 3-decimal fraction. The bar is drawn from it; the
    // page shows it × 100 rounded to a whole number with halves up, in integer
    // arithmetic (as CAARS93 / SRQ93).
    const p = hasScore ? Math.min(Math.max(Number(percent.mark ?? 0), 0), 1) : 0;
    const thousandths = Math.round(p * 1000);
    const pct = Math.floor((thousandths + 5) / 10);
    const width = (BAR.length * thousandths) / 1000;

    // Level parts of the strip, split between two neighbouring scores.
    const at = (s) => BAR.x + (BAR.length * s) / MAX;
    const edges = [0, 7.5, 15.5, 25.5, MAX];
    const stripTop = BAR.top + BAR.height + STRIP.gap;
    const stripBottom = stripTop + STRIP.height;
    const parts = LEVELS.map((lv, i) => {
      const x0 = at(edges[i]) + (i > 0 ? STRIP.split : 0);
      const x1 = at(edges[i + 1]) - (i < LEVELS.length - 1 ? STRIP.split : 0);
      return { ...lv, x: x0, width: x1 - x0, mid: (at(edges[i]) + at(edges[i + 1])) / 2 };
    });

    // Symptom table: value = option number − 1; groups 3 → 0, question order
    // inside a group, empty groups dropped. An answer outside 1..4 cannot be
    // grouped and is left out; a sheet with one never reaches scoring.
    const answered = (questions || [])
      .map((q, i) => ({ i: i + 1, text: q.text, value: Number(q.user_answered) - 1 }))
      .filter((q) => Number.isInteger(q.value) && q.value >= 0 && q.value <= 3);

    const groups = [];
    let y = TABLE.top;
    for (const value of [3, 2, 1, 0]) {
      const members = answered.filter((q) => q.value === value);
      if (!members.length) continue;
      const top = y;
      const rows = members.map((q, k) => {
        const rowTop = top + k * TABLE.rowPitch;
        return { ...q, top: rowTop, baseline: rowTop + TABLE.rowHeight / 2 + TEXT_MID };
      });
      const height = (members.length - 1) * TABLE.rowPitch + TABLE.rowHeight;
      groups.push({
        ...GROUPS[value],
        value,
        rows,
        top,
        height,
        baseline: top + height / 2 + TEXT_MID,
      });
      y = top + height + (TABLE.rowPitch - TABLE.rowHeight) + TABLE.groupGap;
    }

    return [
      {
        bar: BAR,
        track: TRACK,
        width,
        hasScore,
        fill: hasScore ? level.color : "none",
        levelTitle: hasScore ? level.title : "",
        barBaseline: BAR.top + BAR.height / 2 + TEXT_MID,
        mark,
        max: raw.label.max,
        pct,
        rawX: at(MAX) + NUMBERS.raw,
        pctX: at(MAX) + NUMBERS.percent,
        stripTop,
        stripHeight: STRIP.height,
        nameBaseline: stripBottom + LEVEL_TEXT.name,
        rangeBaseline: stripBottom + LEVEL_TEXT.range,
        parts,
        table: TABLE,
        groupTextRight: TABLE.groupRight - TABLE.accent - 8,
        groupValueLeft: TABLE.rowsRight + 8 + 12, // the value's left edge, inside the group column
        groupX: TABLE.rowsRight + 8,
        groupWidth: TABLE.groupRight - TABLE.rowsRight - 8,
        numberRight: TABLE.rowsRight - 10,
        textRight: TABLE.rowsRight - 38,
        groups,
      },
    ];
  }
}

module.exports = BAI93;
