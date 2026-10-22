const { Profile } = require("../Profile");

// MBTI93 — آزمون تیپ‌نمای مایرز-بریگز، فرم ۸۷سؤالی. Built from the approved brief
// docs/profiles/MBTI_profile_brief_fa.md; laid out like the 60-item profile (MBTI9A),
// whose files are not shared or imported here.
//
// Eight pole scores, each with its own fixed maximum (E 35, I 34, S 33, N 31, T 35, F 30,
// J 19, P 18). The two poles of a pair do not add up to a constant, so each pair row has
// two equal half-bars back to back instead of one shared bar: each half-bar starts at its
// own letter box (0) and fills toward the centre line by its own stored percent (100% =
// the centre line). The type code `report` decides the colours, never the bar lengths:
// the pole whose letter is in the type is teal; the other pole, and both poles of a tied
// pair (letters in parentheses, e.g. (EI)STJ), are violet. No levels, no explanatory text.

// Chart geometry. MBTI9A's composition (code box, title, framed rows of letter tile ·
// bar · letter tile) at a lighter scale, after the researcher found the first build
// bulky (2026-10-22): smaller code and tiles, thin half-bars, smaller text, more air.
const CHART = { width: 520, height: 456 };
// The code box is 112 wide for a four-letter code; a longer code (ties in parentheses)
// widens it around the same centre, keeping the same side space.
const CODE = { centerX: 260, minWidth: 112, height: 44, padding: 20, radius: 8, font: 28, titleY: 54, titleFont: 13 };
// Approximate widths of the type-code glyphs at font-size 28, weight 700 (measured on
// rendered PNGs of ESTP, (EI)NTP and (EI)(SN)(FT)(PJ)), used only to size the code box.
const CODE_GLYPH = { letter: 16, paren: 10 };
const FRAME = { y: 96, height: 360, radius: 16 };
const BOX = 28; // letter tile side
// Row: left tile 0..28 · left half-bar 42..142 · centre gap · right half-bar 146..246 ·
// right tile 260..288; the row is centred in the frame.
const ROW_WIDTH = 288;
const ROWS = { x: CHART.width / 2 - ROW_WIDTH / 2, top: FRAME.y + 40, pitch: 80 };
const HALF = { leftX: 42, rightEnd: 246, length: 100, height: 10, radius: 5 };
const TEXT = { letter: 15, raw: 11, percent: 13, name: 12, gap: 10, rawGap: 5 };

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
        x: 191.5, // (943 − 520) / 2 − 20
        y: 129, // (754 − 456) / 2 − 20
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

    const pole = (p) => {
      const raw = stored(`${p}_raw`);
      const percent = stored(`${p}_percent`);
      const hasRaw = present(raw);
      const hasPercent = present(percent);
      // The stored percent is a 3-decimal fraction. The half-bar is drawn from it; the
      // page shows it × 100 rounded to a whole number with halves up, in integer
      // arithmetic.
      const fraction = hasPercent ? Math.min(Math.max(Number(percent), 0), 1) : 0;
      const thousandths = Math.round(fraction * 1000);
      const width = (HALF.length * thousandths) / 1000;
      const label = this.labels[Object.keys(this.labels).find((k) => this.labels[k].eng === `${p}_raw`)];
      return {
        eng: p.toUpperCase(),
        fr: label.fr,
        mark: hasRaw ? Number(raw) : "",
        percentage: hasPercent ? `${Math.floor((thousandths + 5) / 10)} ٪` : "",
        width,
        radius: Math.min(HALF.radius, width / 2),
      };
    };

    const items = PAIRS.map(([left, right]) => {
      const a = pole(left);
      const b = pole(right);
      // Colour comes from the type code: the letter in the type is "chosen"; a tied
      // pair (both letters in parentheses) or a pair the code does not mention has
      // no chosen pole.
      const winner = decided[left] === true ? left : decided[right] === true ? right : null;
      a.colors = winner === left ? COLORS.chosen : COLORS.other;
      b.colors = winner === right ? COLORS.chosen : COLORS.other;
      a.fillX = HALF.leftX;
      b.fillX = HALF.rightEnd - b.width;
      return [a, b];
    });

    const codeWidth = Math.max(CODE.minWidth, this._codeTextWidth(report) + 2 * CODE.padding);

    return [
      {
        items,
        report: { mark: report, fr: this.labels.L17.fr },
        code: {
          x: CODE.centerX - codeWidth / 2,
          width: codeWidth,
          height: CODE.height,
          radius: CODE.radius,
          centerX: CODE.centerX,
          middle: CODE.height / 2,
          font: CODE.font,
          titleY: CODE.titleY,
          titleFont: CODE.titleFont,
        },
        frame: { width: CHART.width, ...FRAME },
        rows: ROWS,
        box: BOX,
        boxMiddle: BOX / 2,
        rightBoxX: ROW_WIDTH - BOX,
        text: {
          ...TEXT,
          rawY: BOX + TEXT.rawGap,
          // percent above the name, the two lines centred on the tile
          percentY: -1,
          nameY: 15,
          leftX: -TEXT.gap,
          rightX: BOX + TEXT.gap,
        },
        half: {
          leftX: HALF.leftX,
          rightX: HALF.rightEnd - HALF.length,
          y: BOX / 2 - HALF.height / 2,
          length: HALF.length,
          height: HALF.height,
          radius: HALF.radius,
        },
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
