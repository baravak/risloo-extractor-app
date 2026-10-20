const { Profile } = require("../Profile");

// ---------------------------------------------------------------------------
// No Figma design: agent design from the approved brief
// (docs/profiles/MWAS_profile_brief_fa.md), in the bar language of TMPS93 /
// CDRISC93. Chart 700 × 434. Nine equal-length horizontal bars: the eight
// factors in the brief's order, then the total after a visible gap. Each bar
// runs from 0 to its own maximum and is filled by its stored percent. One solid
// colour for the factors, another for the total, one track colour, exactly as
// the brief gives them; no levels, zones, boundary lines or score-dependent
// colour, never sorted or highlighted.
// ---------------------------------------------------------------------------
const ROW = { top: 54, pitch: 40, totalGap: 20 }; // first bar row, row pitch, extra gap before the total
const BAR = { x: 229, length: 400, height: 16, gap: 4, outsideGap: 6 }; // 100 % = 400 px
const BASELINE = 12.06; // 13 px text baseline, measured from the row top (JSS93 / TMPS93)
// Brief palette (سطح‌بندی و رنگ): factors, total, unfilled part of every bar.
const COLOR = { factor: "#4F46E5", total: "#334155", track: "#E2E8F0" };
// The percentage moves outside the bar below 10 %, where "٪ NN" plus the 4 px
// tip gap would no longer fit (agent rule; placement is the designer's per the
// brief). The lowest valid MWAS percent is 20 %, so it never fires on valid data.
const INSIDE_MIN_PCT = 10;

class MWAS93 extends Profile {
  static pages = 1;

  // MWAS93 — پرسشنامه سنجش خردمندی دانش‌آموزان. Eight factors of 3–7 items
  // scored 1–5, and their total. Names, order and maxima come from the approved
  // brief; keys from scoring/MWAS93.py (`<factor>_raw`, `<factor>_percent`).
  // `percent` is the share of the row's own maximum as a 3-decimal fraction; it
  // drives both the bar length and the "٪ NN" readout so the two never disagree.
  labels = {
    L1_1: { eng: "general_raw", title: "خردمندی عمومی", max: 35 },
    L1_2: { eng: "general_percent" },

    L2_1: { eng: "religious_raw", title: "خردمندی دینی", max: 25 },
    L2_2: { eng: "religious_percent" },

    L3_1: { eng: "emotional_raw", title: "خردمندی عاطفی", max: 25 },
    L3_2: { eng: "emotional_percent" },

    L4_1: { eng: "human_raw", title: "خردمندی انسانی", max: 25 },
    L4_2: { eng: "human_percent" },

    L5_1: { eng: "spiritual_raw", title: "خردمندی معنوی", max: 20 },
    L5_2: { eng: "spiritual_percent" },

    L6_1: { eng: "moral_raw", title: "خردمندی اخلاقی", max: 20 },
    L6_2: { eng: "moral_percent" },

    L7_1: { eng: "social_raw", title: "خردمندی اجتماعی", max: 15 },
    L7_2: { eng: "social_percent" },

    L8_1: { eng: "scientific_raw", title: "خردمندی علمی", max: 15 },
    L8_2: { eng: "scientific_percent" },

    // The total is drawn last, set apart from the eight factors by ROW.totalGap.
    L9_1: { eng: "total_raw", title: "نمرهٔ کل", max: 180, total: true },
    L9_2: { eng: "total_percent" },
  };

  profileSpec = {
    sample: {
      name: "پرسشنامه سنجش خردمندی دانش‌آموزان",
      multiProfile: false,
      questions: false,
      defaultFields: true,
      fields: [],
    },
    profile: {
      get dimensions() {
        return {
          width: 700 + 2 * this.padding.x, // Chart 700 wide → 903
          height: 434 + 2 * this.padding.y, // Chart 434 tall → 714
        };
      },
      // Chart centred on the 943 × 754 design page, minus the 20 px the layout
      // already owns on every side, so the page resolves to 903 × 714.
      padding: {
        x: 101.5, // (943 − 700) / 2 − 20
        y: 140, // (754 − 434) / 2 − 20
      },
    },
    labels: Object.values(this.labels),
  };

  constructor(dataset, options, config = {}) {
    super();
    this._init(dataset, options, config);
  }

  _calcContext() {
    const s = this.dataset.score; // [raw, percent] × (8 factors + total), fixed order

    const items = [];
    for (let i = 0; i < 9; i++) {
      const raw = s[2 * i];
      const { max, title, total } = raw.label;
      const top = ROW.top + i * ROW.pitch + (total ? ROW.totalGap : 0);
      const color = total ? COLOR.total : COLOR.factor;

      // Every valid MWAS raw score is at least 3, so a missing raw mark means the
      // score was not produced: the row keeps its name and empty track, and shows
      // no number (the brief forbids a 0 in place of a score that was not made).
      const produced = raw.mark !== undefined && raw.mark !== null;
      if (!produced) {
        items.push({ title, top, color, produced, width: 0, baseline: top + BASELINE });
        continue;
      }

      // The stored percent is a 3-decimal fraction. The bar is drawn from it; the
      // page shows it × 100 rounded to a whole number with halves up, in integer
      // arithmetic so 0.815 reads 82, not 81 (as CAARS93).
      const p = Math.min(Math.max(Number(s[2 * i + 1].mark ?? 0), 0), 1);
      const thousandths = Math.round(p * 1000);
      const pct = Math.floor((thousandths + 5) / 10);
      const width = (BAR.length * thousandths) / 1000;
      const inside = pct >= INSIDE_MIN_PCT;
      const tip = BAR.x + width;

      items.push({
        title,
        mark: Number(raw.mark),
        max,
        pct,
        width,
        top,
        color,
        produced,
        inside,
        labelX: inside ? tip - BAR.gap : tip + BAR.outsideGap,
        baseline: top + BASELINE,
      });
    }

    return [{ items, track: COLOR.track }];
  }
}

module.exports = MWAS93;
