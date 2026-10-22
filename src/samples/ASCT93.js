const { Profile } = require("../Profile");

// ---------------------------------------------------------------------------
// No Figma design: design from the approved brief
// (docs/profiles/ASCT_profile_brief_fa.md), in the bar language of PNI93 /
// SISRI93. Chart 700 × 254. Five equal-length horizontal bars: the four factors
// in the brief's order, then the total after a visible gap. Each bar runs from
// 0 to its own maximum and is filled by its stored percent; a stored 0 is a real
// score and leaves the bar empty. The four factors share one colour that never
// changes with the score. The filled part of the total takes the colour of the
// respondent's level, and that level's name sits beside the total bar with a
// small swatch. No level strip, zones, boundary lines, sorting or highlighting.
// ---------------------------------------------------------------------------
const ROW = { top: 54, pitch: 40, totalGap: 20 }; // first bar row, row pitch, extra gap before the total
const BAR = { x: 89, length: 400, height: 16, gap: 4, outsideGap: 6 }; // 100 % = 400 px
const BASELINE = 12.06; // 13 px text baseline, measured from the row top (as PNI93 / SISRI93)
// Brief palette (سطح‌بندی و رنگ): factors, unfilled part of every bar, and the
// neutral used for a number beside an empty bar.
const COLOR = { factor: "#0F766E", track: "#F1F5F9", empty: "#64748B" };
// Total-score levels, exactly as the brief: name, highest raw score of the
// level, fill colour of the total bar, swatch colour beside the level name.
// «خلاقیت بسیار کم» is only a total of 0, whose bar is empty, so it has no fill
// colour; its swatch takes the brief's #C4B5FD.
const LEVELS = [
  { name: "خلاقیت بسیار کم", upTo: 0, fill: null, swatch: "#C4B5FD" },
  { name: "خلاقیت کم", upTo: 7, fill: "#8B5CF6", swatch: "#8B5CF6" },
  { name: "خلاقیت متوسط", upTo: 67, fill: "#7C3AED", swatch: "#7C3AED" },
  { name: "خلاقیت زیاد", upTo: 100, fill: "#5B21B6", swatch: "#5B21B6" },
  { name: "خلاقیت بسیار زیاد", upTo: 120, fill: "#3B0764", swatch: "#3B0764" },
];
// The percentage moves outside the bar below 10 %, where "٪ NN" plus the 4 px
// tip gap would no longer fit (placement is the designer's per the brief).
const INSIDE_MIN_PCT = 10;
const ROWS = 5;

class ASCT93 extends Profile {
  static pages = 1;

  // ASCT93 — پرسش‌نامه خلاقیت عابدی. 60 items with three options scored 0, 1, 2
  // (option − 1): four factors and their total. Names, order and maxima come
  // from the approved brief; keys from scoring/ASCT93.py (`<factor>_raw`,
  // `<factor>_percent`, `total_raw`, `total_percent`). `percent` is the share of
  // the row's own maximum as a 3-decimal fraction; it drives both the bar length
  // and the "٪ NN" readout so the two never disagree. The scoring produces no
  // level: the profile derives it from `total_raw` and the brief's boundaries.
  labels = {
    L1_1: { eng: "fluency_raw", title: "سیالی", max: 44 },
    L1_2: { eng: "fluency_percent" },

    L2_1: { eng: "elaboration_raw", title: "بسط", max: 22 },
    L2_2: { eng: "elaboration_percent" },

    L3_1: { eng: "originality_raw", title: "ابتکار", max: 32 },
    L3_2: { eng: "originality_percent" },

    L4_1: { eng: "flexibility_raw", title: "انعطاف‌پذیری", max: 22 },
    L4_2: { eng: "flexibility_percent" },

    // The total is drawn last, set apart from the four factors by ROW.totalGap.
    L5_1: { eng: "total_raw", title: "نمره کل", max: 120, total: true },
    L5_2: { eng: "total_percent" },
  };

  profileSpec = {
    sample: {
      name: "پرسش‌نامه خلاقیت عابدی",
      multiProfile: false,
      questions: false,
      defaultFields: true,
      fields: [],
    },
    profile: {
      get dimensions() {
        return {
          width: 700 + 2 * this.padding.x, // Chart 700 wide → 903
          height: 254 + 2 * this.padding.y, // Chart 254 tall → 714
        };
      },
      // Chart centred on the 943 × 754 design page, minus the 20 px the layout
      // already owns on every side, so the page resolves to 903 × 714.
      padding: {
        x: 101.5, // (943 − 700) / 2 − 20
        y: 230, // (754 − 254) / 2 − 20
      },
    },
    labels: Object.values(this.labels),
  };

  constructor(dataset, options, config = {}) {
    super();
    // `_extractData` turns a stored 0 into undefined (`score[key] || …`). Keep
    // the scoring output itself so _calcContext can tell a stored 0 from a
    // missing score, as PNI93 / SISRI93 do.
    this.storedScore = (dataset && dataset.score) || {};
    this._init(dataset, options, config);
  }

  _calcContext() {
    const s = this.dataset.score; // [raw, percent] × (4 factors + total), fixed order

    const items = [];
    let level = null;
    for (let i = 0; i < ROWS; i++) {
      const raw = s[2 * i];
      const { max, title, total } = raw.label;
      const top = ROW.top + i * ROW.pitch + (total ? ROW.totalGap : 0);
      const baseline = top + BASELINE;

      // A raw or percent key that is absent or empty means the score was not
      // produced (e.g. a result stored before the `_percent` columns existed):
      // the row keeps its name and empty track, and shows no number and no
      // level, rather than a raw score beside a bar that reads 0 %.
      const has = (v) => v !== undefined && v !== null && v !== "";
      const stored = this.storedScore[raw.label.eng];
      const produced = has(stored) && has(this.storedScore[s[2 * i + 1].label.eng]);
      if (!produced) {
        items.push({ title, top, produced, width: 0, baseline });
        continue;
      }

      const mark = Number(stored);
      let color = COLOR.factor;
      if (total) {
        level = LEVELS.find((l) => mark <= l.upTo) || LEVELS[LEVELS.length - 1];
        color = level.fill;
      }

      // The stored percent is a 3-decimal fraction. The bar is drawn from it; the
      // page shows it × 100 rounded to a whole number with halves up, in integer
      // arithmetic so 0.625 reads 63, not 62 (as PNI93 / SRQ93).
      const p = Math.min(Math.max(Number(s[2 * i + 1].mark ?? 0), 0), 1);
      const thousandths = Math.round(p * 1000);
      const pct = Math.floor((thousandths + 5) / 10);
      const width = (BAR.length * thousandths) / 1000;
      const inside = pct >= INSIDE_MIN_PCT && width > 0;
      const tip = BAR.x + width;

      items.push({
        title,
        mark,
        max,
        pct,
        width,
        top,
        color,
        // A number beside an empty bar has no fill colour to take.
        textColor: width > 0 ? color : COLOR.empty,
        produced,
        inside,
        labelX: inside ? tip - BAR.gap : tip + BAR.outsideGap,
        baseline,
      });
    }

    // The level sits on the total row, after its "N از 120".
    const totalRow = items[ROWS - 1];
    const levelBox = level && { name: level.name, swatch: level.swatch, baseline: totalRow.baseline, top: totalRow.top };

    return [{ items, track: COLOR.track, level: levelBox }];
  }
}

module.exports = ASCT93;
