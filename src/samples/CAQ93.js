const { Profile } = require("../Profile");

// ---------------------------------------------------------------------------
// No Figma design: design from the approved brief
// (docs/profiles/CAQ_profile_brief_fa.md), in the bar language of PNI93 /
// SISRI93. Chart 795 × 420.
//
// Eight equal-length horizontal bars in three groups set apart by a gap: the
// five factors; covert and overt anxiety; the total. Each bar runs from 0 to its
// own maximum and is filled by its stored percent. Beside each bar: the raw
// score of its maximum, the percent at the bar tip, and — for the five factors
// and the total only — the standard (sten) score in one column headed
// «نمره تراز شده». A sten score the scoring did not produce leaves its place
// empty. One colour for the seven part bars, a darker one for the total, one
// track colour, exactly as the brief gives them; no zones, boundary lines,
// score-dependent colour, sorting or highlighting.
//
// Below the total: «سطح اضطراب», the person's level name and a small strip of
// four equal parts (one per level, in level order) in which only the person's
// part is filled. The strip is tied to the total sten score, so it sits under
// the number columns, wholly outside the bars' x range. No frame for the
// specialist's notes (the brief left it to the designer; the researcher asked
// for it to be removed, 2026-10-22); the chart is centred on the page instead.
// ---------------------------------------------------------------------------
const W = 795;
const H = 420;
const TITLE_RIGHT = 245; // right edge of every row title (RTL "start"); the longest title starts near x = 5
const BAR = { x: 255, length: 360, height: 16, gap: 4, outsideGap: 6 }; // 100 % = 360 px, ends at 615
const RAW_LEFT = 629; // left edge of "N از M"
const STEN_CENTER = 745; // centre of the sten column and of its heading
const HEADER_BASELINE = 12; // «نمره تراز شده»
const ROW = { top: 30, pitch: 40, groupGap: 20 };
const BASELINE = 12.06; // 13 px text baseline, measured from the row top (as PNI93)
// The percentage moves outside the bar below 10 %, where "٪ NN" plus the 4 px
// tip gap no longer fits inside (as PNI93). A stored 0 is a real score: empty
// bar, "٪ 0" just past the origin.
const INSIDE_MIN_PCT = 10;
const LEVEL = { top: 398, height: 22, partWidth: 43, partGap: 2, nameGap: 12 };
// Brief palette (سطح‌بندی و رنگ).
const COLOR = { part: "#8A4F7D", total: "#621849", track: "#F1E8EF" };
// Anxiety levels: names and sten ranges exactly as the brief (and the scoring's
// `anxiety_level` 0–3: sten 0–3, 4–6, 7, 8–10). Shades light → dark; text on the
// two light shades #334155, on the two dark ones white.
const LEVELS = [
  { title: "شخصی آرام، پابرجا، راحت و تنش‌زدوده", range: "0 تا 3", fill: "#E3CCDC", ink: "#334155" },
  { title: "اضطراب متوسط", range: "4 تا 6", fill: "#C49AB8", ink: "#334155" },
  { title: "یک روان‌آزرده مضطرب", range: "7", fill: "#8A4F7D", ink: "white" },
  { title: "به وضوح نیاز به روان‌درمانگری دارد", range: "8 تا 10", fill: "#621849", ink: "white" },
];
const LEVEL_OFF = { fill: COLOR.track, ink: "#64748B" }; // parts that are not the person's level

class CAQ93 extends Profile {
  static pages = 1;

  // CAQ93 — آزمون اضطراب کتل. 40 three-option items scored 0, 1 or 2. Names,
  // order and maxima come from the approved brief; keys from scoring/CAQ93.py:
  // `<factor>_raw`, `<factor>_percent` for the eight scores, the sten scores
  // `c`, `l`, `o`, `q3`, `q4`, `result` (total), and `anxiety_level` (0–3).
  // `percent` is the share of the row's own maximum as a 3-decimal fraction; it
  // drives both the bar length and the "٪ NN" readout so the two never disagree.
  labels = {
    L1_1: { eng: "c_raw", sten: "c", title: "فقدان نیروی من و نوروزگرایی عمومی", max: 12, group: 0 },
    L1_2: { eng: "c_percent" },
    L1_3: { eng: "c" },

    L2_1: { eng: "l_raw", sten: "l", title: "ناایمنی پارانویایی", max: 8, group: 0 },
    L2_2: { eng: "l_percent" },
    L2_3: { eng: "l" },

    L3_1: { eng: "o_raw", sten: "o", title: "گرایش به احساس گناه", max: 24, group: 0 },
    L3_2: { eng: "o_percent" },
    L3_3: { eng: "o" },

    L4_1: { eng: "q3_raw", sten: "q3", title: "فقدان توحید‌یافتگی یا انسجام هوشیاری از خود", max: 16, group: 0 },
    L4_2: { eng: "q3_percent" },
    L4_3: { eng: "q3" },

    L5_1: { eng: "q4_raw", sten: "q4", title: "تنش ارگی (فشار بن)", max: 20, group: 0 },
    L5_2: { eng: "q4_percent" },
    L5_3: { eng: "q4" },

    // Covert and overt anxiety have no sten score (no `sten` key).
    L6_1: { eng: "hidden_anxiety_raw", title: "اضطراب پنهان", max: 40, group: 1 },
    L6_2: { eng: "hidden_anxiety_percent" },

    L7_1: { eng: "obvious_anxiety_raw", title: "اضطراب آشکار", max: 40, group: 1 },
    L7_2: { eng: "obvious_anxiety_percent" },

    L8_1: { eng: "total_raw", sten: "result", title: "نمره کل", max: 80, group: 2, total: true },
    L8_2: { eng: "total_percent" },
    L8_3: { eng: "result" },

    L9: { eng: "anxiety_level" },
  };

  profileSpec = {
    sample: {
      name: "آزمون اضطراب کتل (CAQ)",
      multiProfile: false,
      questions: false,
      defaultFields: true,
      fields: [],
    },
    profile: {
      get dimensions() {
        return {
          width: W + 2 * this.padding.x, // Chart 795 wide → 903
          height: H + 2 * this.padding.y, // Chart 420 tall → 714
        };
      },
      // Chart centred on the 943 × 754 design page, minus the 20 px the layout
      // already owns on every side, so the page resolves to 903 × 714.
      padding: {
        x: 54, // (943 − 795) / 2 − 20
        y: 147, // (754 − 420) / 2 − 20
      },
    },
    labels: Object.values(this.labels),
  };

  constructor(dataset, options, config = {}) {
    super();
    // `_extractData` turns a stored 0 into undefined (`score[key] || …`), and
    // in CAQ a 0 is common (raw, percent, sten 0, level 0). Keep the scoring
    // output itself so _calcContext can tell a stored number from a missing or
    // NULL one, as PNI93 / SISRI93 do.
    this.storedScore = (dataset && dataset.score) || {};
    this._init(dataset, options, config);
  }

  _stored(key) {
    if (!key) return null;
    const v = this.storedScore[key];
    if (v === undefined || v === null || v === "") return null;
    const n = Number(v);
    return Number.isFinite(n) ? n : null;
  }

  _calcContext() {
    const rows = Object.values(this.labels).filter((l) => l.title);

    const items = rows.map((label, i) => {
      const top = ROW.top + i * ROW.pitch + label.group * ROW.groupGap;
      const baseline = top + BASELINE;
      const color = label.total ? COLOR.total : COLOR.part;
      const stem = label.eng.replace(/_raw$/, "");

      // A sten score that was not produced (NULL — O and Q4 at raw 0–1) leaves
      // its place empty; a stored 0 is shown as 0.
      const sten = this._stored(label.sten);

      // A raw key that is absent or null means the score was not produced: the
      // row keeps its name and empty track, and shows no number.
      const mark = this._stored(label.eng);
      if (mark === null) {
        return { title: label.title, top, baseline, color, produced: false, width: 0, sten, hasSten: sten !== null };
      }

      // The stored percent is a 3-decimal fraction. The bar is drawn from it; the
      // page shows it × 100 rounded to a whole number with halves up, in integer
      // arithmetic so 0.625 reads 63, not 62 (as PNI93 / SISRI93).
      const p = Math.min(Math.max(this._stored(`${stem}_percent`) ?? 0, 0), 1);
      const thousandths = Math.round(p * 1000);
      const pct = Math.floor((thousandths + 5) / 10);
      const width = (BAR.length * thousandths) / 1000;
      const inside = pct >= INSIDE_MIN_PCT;
      const tip = BAR.x + width;

      return {
        title: label.title,
        mark,
        max: label.max,
        pct,
        width,
        top,
        baseline,
        color,
        produced: true,
        inside,
        labelX: inside ? tip - BAR.gap : tip + BAR.outsideGap,
        sten,
        hasSten: sten !== null,
      };
    });

    // Anxiety level from the scoring's own `anxiety_level` (0–3); a stored 0 is
    // the first level. Without it no part is filled and no name is drawn.
    const levelIndex = this._stored("anxiety_level");
    const level = Number.isInteger(levelIndex) && LEVELS[levelIndex] ? LEVELS[levelIndex] : null;
    const stripWidth = LEVELS.length * LEVEL.partWidth + (LEVELS.length - 1) * LEVEL.partGap;
    const stripLeft = W - stripWidth;
    const parts = LEVELS.map((l, i) => {
      const own = level === l;
      const x = stripLeft + i * (LEVEL.partWidth + LEVEL.partGap);
      return { x, mid: x + LEVEL.partWidth / 2, range: l.range, fill: own ? l.fill : LEVEL_OFF.fill, ink: own ? l.ink : LEVEL_OFF.ink, own };
    });

    return [
      {
        items,
        track: COLOR.track,
        bar: BAR,
        titleRight: TITLE_RIGHT,
        rawLeft: RAW_LEFT,
        stenCenter: STEN_CENTER,
        headerBaseline: HEADER_BASELINE,
        level: {
          top: LEVEL.top,
          height: LEVEL.height,
          partWidth: LEVEL.partWidth,
          baseline: LEVEL.top + 15.5,
          partBaseline: LEVEL.top + 15,
          nameRight: stripLeft - LEVEL.nameGap,
          title: level ? level.title : null,
          parts,
        },
      },
    ];
  }
}

module.exports = CAQ93;
