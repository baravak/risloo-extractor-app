const { Profile } = require("../Profile");

// MBTI93 — آزمون تیپ‌نمای مایرز-بریگز، فرم ۸۷سؤالی. Built from the approved brief
// docs/profiles/MBTI_profile_brief_fa.md; laid out like the 60-item profile (MBTI9A),
// whose files are not shared or imported here.
//
// Eight pole scores, each with its own fixed maximum (E 35, I 34, S 33, N 31, T 35, F 30,
// J 19, P 18). The two poles of a pair do not add up to a constant, so the 15-block bar
// of MBTI9A becomes two segmented half-bars back to back, seven blocks each: each half
// starts at its own letter tile (0) and fills toward the centre gap by its own stored
// percent (100% = the centre). The type code `report` decides the colours, never the
// bar lengths: the pole whose letter is in the type is teal; the other pole, and both
// poles of a tied pair (letters in parentheses, e.g. (EI)STJ), are violet. No levels,
// no explanatory text.
//
// Researcher, 2026-11-11: the lighter build was cluttered; the profile returns to
// MBTI9A's geometry and sizes (chart 590 × 621, code 40 px in a 142 × 60 box, framed
// rows at a 114 pitch, 36 px tiles, 24 px letters, 16 px percent and name).
const CHART = { width: 590, height: 621 };
// The code box is 142 wide for a four-letter code, as MBTI9A; a longer code (ties in
// parentheses) widens it around the same centre.
const CODE = { centerX: 295, minWidth: 142, padding: 24 };
// Approximate widths of the type-code glyphs at font-size 40, weight 800, used only to
// size the code box.
const CODE_GLYPH = { letter: 26, paren: 14 };
// MBTI9A's blocks: 12 wide at a 15 px pitch. Left half: 52..154; right half: 172..274;
// letter tiles at 0..36 and 290..326.
const BLOCK = { width: 12, pitch: 15, count: 7, radius: 4 };
const HALF = { leftX: 52, rightEnd: 274, span: (BLOCK.count - 1) * BLOCK.pitch + BLOCK.width };

// Row order and names as in MBTI9A: left pole before right pole.
const PAIRS = [
  ["e", "i"],
  ["n", "s"],
  ["t", "f"],
  ["j", "p"],
];

const COLORS = {
  chosen: { box: "#0D9488", letter: "#FFFFFF", accent: "#0D9488" },
  other: { box: "#F5F3FF", letter: "#7C3AED", accent: "#7C3AED" },
};
const TRACK = "#F5F3FF";

class MBTI93 extends Profile {
  // Number of pages
  static pages = 1;

  // Keys are the scoring output flattened by Risloo (`<pole>_raw`, `<pole>_percent`)
  // and the type code `report`. The old single-letter columns are not read.
  labels = {
    L1: { eng: "e_raw", pole: "e", fr: "برون‌گرایی" },
    L2: { eng: "e_percent", pole: "e" },
    L3: { eng: "i_raw", pole: "i", fr: "درون‌گرایی" },
    L4: { eng: "i_percent", pole: "i" },
    L5: { eng: "n_raw", pole: "n", fr: "شهودی" },
    L6: { eng: "n_percent", pole: "n" },
    L7: { eng: "s_raw", pole: "s", fr: "حسی" },
    L8: { eng: "s_percent", pole: "s" },
    L9: { eng: "t_raw", pole: "t", fr: "تفکری" },
    L10: { eng: "t_percent", pole: "t" },
    L11: { eng: "f_raw", pole: "f", fr: "احساسی" },
    L12: { eng: "f_percent", pole: "f" },
    L13: { eng: "j_raw", pole: "j", fr: "داوری‌کننده" },
    L14: { eng: "j_percent", pole: "j" },
    L15: { eng: "p_raw", pole: "p", fr: "ملاحظه‌کننده" },
    L16: { eng: "p_percent", pole: "p" },
    L17: { eng: "report", fr: "تیپ شخصیتی فرد" },
  };

  profileSpec = {
    sample: {
      name: "آزمون تیپ‌نمای مایرز-بریگز",
      multiProfile: false,
      questions: false,
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
        x: 156.5, // (943 − 590) / 2 − 20
        y: 46.5, // (754 − 621) / 2 − 20
      },
    },
    labels: Object.values(this.labels),
  };

  constructor(dataset, options, config = {}) {
    super();
    // `_extractData` turns a stored 0 into undefined (`score[key] || …`), but 0 is a
    // real raw score and percent here. Keep the scoring output itself so only an absent
    // or empty field counts as "not produced" (as BAI93 / SISRI93).
    this.storedScore = (dataset && dataset.score) || {};
    this._init(dataset, options, config);
  }

  _calcContext() {
    const stored = (key) => this.storedScore[key];
    const present = (v) => v !== undefined && v !== null && v !== "";

    const report = present(stored("report")) ? String(stored("report")) : "";
    const decided = this._parseType(report);

    // Seven blocks of one half-bar. `fromRight` counts blocks from the right end (the
    // right pole fills leftward from its tile). Each block shows the part of the fill
    // that falls on it; the gaps between blocks show nothing.
    const blocks = (fill, fromRight) => {
      const list = [];
      for (let k = 0; k < BLOCK.count; k++) {
        const x = fromRight
          ? HALF.rightEnd - BLOCK.width - k * BLOCK.pitch
          : HALF.leftX + k * BLOCK.pitch;
        const w = Math.min(Math.max(fill - k * BLOCK.pitch, 0), BLOCK.width);
        list.push({
          x,
          fillX: fromRight ? x + BLOCK.width - w : x,
          fill: w,
          radius: Math.min(BLOCK.radius, w / 2),
        });
      }
      return list;
    };

    const pole = (p, fromRight) => {
      const raw = stored(`${p}_raw`);
      const percent = stored(`${p}_percent`);
      const hasRaw = present(raw);
      const hasPercent = present(percent);
      // The stored percent is a 3-decimal fraction. The half-bar is drawn from it; the
      // page shows it × 100 rounded to a whole number with halves up, in integer
      // arithmetic.
      const fraction = hasPercent ? Math.min(Math.max(Number(percent), 0), 1) : 0;
      const thousandths = Math.round(fraction * 1000);
      const label = this.labels[Object.keys(this.labels).find((k) => this.labels[k].eng === `${p}_raw`)];
      return {
        eng: p.toUpperCase(),
        fr: label.fr,
        mark: hasRaw ? Number(raw) : "",
        percentage: hasPercent ? `${Math.floor((thousandths + 5) / 10)} ٪` : "",
        blocks: blocks((HALF.span * thousandths) / 1000, fromRight),
      };
    };

    const items = PAIRS.map(([left, right]) => {
      const a = pole(left, false);
      const b = pole(right, true);
      // Colour comes from the type code: the letter in the type is "chosen"; a tied
      // pair (both letters in parentheses) or a pair the code does not mention has
      // no chosen pole.
      const winner = decided[left] === true ? left : decided[right] === true ? right : null;
      a.colors = winner === left ? COLORS.chosen : COLORS.other;
      b.colors = winner === right ? COLORS.chosen : COLORS.other;
      return [a, b];
    });

    const codeWidth = Math.max(CODE.minWidth, this._codeTextWidth(report) + 2 * CODE.padding);

    return [
      {
        items,
        track: TRACK,
        report: { mark: report, fr: this.labels.L17.fr },
        code: { x: CODE.centerX - codeWidth / 2, width: codeWidth, centerX: CODE.centerX },
      },
    ];
  }

  // "ESTP" → { e: true, s: true, t: true, p: true }; "(EI)STJ" → { e: false, i: false, … }.
  // true = the pole's letter stands alone in the type; false = tied (in parentheses).
  _parseType(report) {
    const decided = {};
    const tokens = report.match(/\([A-Z]+\)|[A-Z]/g) || [];
    for (const token of tokens) {
      if (token.length === 1) decided[token.toLowerCase()] = true;
      else for (const ch of token.slice(1, -1)) decided[ch.toLowerCase()] = false;
    }
    return decided;
  }

  _codeTextWidth(report) {
    let w = 0;
    for (const ch of report) w += ch === "(" || ch === ")" ? CODE_GLYPH.paren : CODE_GLYPH.letter;
    return w;
  }
}

module.exports = MBTI93;
