const { Profile } = require("../Profile");

// ---------------------------------------------------------------------------
// No Figma design: design from the approved brief
// (docs/profiles/GHGAQ_profile_brief_fa.md), in the bar language of SPWB93 /
// SRQ93. Chart 700 × 354. Seven equal-length horizontal bars: the six factors
// in the brief's order, then the total after a visible gap. Each bar runs from
// 0 to its own maximum and is filled by its stored percent, so even the lowest
// valid score (2 of 10, 3 of 15, 16 of 80) fills a fifth of the bar. One solid
// colour for the factors, a darker one for the total, one track colour, exactly
// as the brief gives them; no levels, zones, boundary lines or score-dependent
// colour, never sorted or highlighted, nothing connecting the factors.
// ---------------------------------------------------------------------------
const ROW = { top: 54, pitch: 40, totalGap: 20 }; // first bar row, row pitch, extra gap before the total
const BAR = { x: 229, length: 400, height: 16, gap: 4, outsideGap: 6 }; // 100 % = 400 px
const BASELINE = 12.06; // 13 px text baseline, measured from the row top (JSS93 / TMPS93)
const LINE = 16; // line pitch of a two-line factor name, centred as one block on the row
// Brief palette (سطح‌بندی و رنگ): factors, total, unfilled part of every bar.
const COLOR = { factor: "#8A5A78", total: "#5C3550", track: "#F3E9EF" };
// The percentage moves outside the bar below 10 %, where "٪ NN" plus the 4 px
// tip gap would no longer fit. The lowest valid GHGAQ percent is 20 %, so it
// never fires on valid data.
const INSIDE_MIN_PCT = 10;

class GHGAQ93 extends Profile {
  static pages = 1;

  // GHGAQ93 — پرسشنامه دلبستگی به خدا غباری بناب و حدادی. 16 items scored
  // 1–5 (items 10, 13, 14 reversed), six factors and their total. Names, order
  // and maxima come from the approved brief; keys from scoring/GHGAQ93.py
  // (`<factor>_raw`, `<factor>_percent`). `percent` is the share of the row's
  // own maximum as a 3-decimal fraction; it drives both the bar length and the
  // "٪ NN" readout so the two never disagree. `lines` splits a name too long
  // for the 220 px label column; the brief leaves that break to the designer.
  labels = {
    L1_1: { eng: "try_to_closness_raw", title: "جوارجویی", max: 10 },
    L1_2: { eng: "try_to_closness_percent" },

    L2_1: { eng: "secure_haven_raw", title: "پناه‌گاه امن", max: 15 },
    L2_2: { eng: "secure_haven_percent" },

    L3_1: { eng: "secure_base_raw", title: "پایگاه امن", max: 15 },
    L3_2: { eng: "secure_base_percent" },

    L4_1: {
      eng: "objection_to_separation_raw",
      title: "اعتراض به جدایی (نگرانی از جدایی از دلبستگی)",
      lines: ["اعتراض به جدایی", "(نگرانی از جدایی از دلبستگی)"],
      max: 15,
    },
    L4_2: { eng: "objection_to_separation_percent" },

    L5_1: { eng: "positive_self_perception_raw", title: "ادراک مثبت از خود", max: 15 },
    L5_2: { eng: "positive_self_perception_percent" },

    L6_1: { eng: "positive_god_perception_raw", title: "ادراک مثبت از خدا", max: 10 },
    L6_2: { eng: "positive_god_perception_percent" },

    // The total is drawn last, set apart from the six factors by ROW.totalGap.
    L7_1: { eng: "total_raw", title: "نمره کل", max: 80, total: true },
    L7_2: { eng: "total_percent" },
  };

  profileSpec = {
    sample: {
      name: "پرسشنامه دلبستگی به خدا غباری بناب و حدادی",
      multiProfile: false,
      questions: false,
      defaultFields: true,
      fields: [],
    },
    profile: {
      get dimensions() {
        return {
          width: 700 + 2 * this.padding.x, // Chart 700 wide → 903
          height: 354 + 2 * this.padding.y, // Chart 354 tall → 714
        };
      },
      // Chart centred on the 943 × 754 design page, minus the 20 px the layout
      // already owns on every side, so the page resolves to 903 × 714.
      padding: {
        x: 101.5, // (943 − 700) / 2 − 20
        y: 180, // (754 − 354) / 2 − 20
      },
    },
    labels: Object.values(this.labels),
  };

  constructor(dataset, options, config = {}) {
    super();
    this._init(dataset, options, config);
  }

  _calcContext() {
    const s = this.dataset.score; // [raw, percent] × (6 factors + total), fixed order
    const rows = s.length / 2;

    const items = [];
    for (let i = 0; i < rows; i++) {
      const raw = s[2 * i];
      const { max, title, total } = raw.label;
      const top = ROW.top + i * ROW.pitch + (total ? ROW.totalGap : 0);
      const color = total ? COLOR.total : COLOR.factor;
      const baseline = top + BASELINE;

      // The name, as one line or as a block of lines centred on the row's line.
      const names = raw.label.lines || [title];
      const first = baseline - ((names.length - 1) * LINE) / 2;
      const lines = names.map((text, k) => ({ text, y: first + k * LINE }));

      // A missing raw mark means the score was not produced: the row keeps its
      // name and empty track, and shows no number (no 0 in place of a score).
      // No valid GHGAQ score is 0 (the lowest is 2), so a 0 cannot be hidden here.
      const produced = raw.mark !== undefined && raw.mark !== null;
      if (!produced) {
        items.push({ lines, top, color, produced, width: 0, baseline });
        continue;
      }

      // The stored percent is a 3-decimal fraction. The bar is drawn from it; the
      // page shows it × 100 rounded to a whole number with halves up, in integer
      // arithmetic so 0.865 reads 87, not 86 (as CAARS93 / SRQ93).
      const p = Math.min(Math.max(Number(s[2 * i + 1].mark ?? 0), 0), 1);
      const thousandths = Math.round(p * 1000);
      const pct = Math.floor((thousandths + 5) / 10);
      const width = (BAR.length * thousandths) / 1000;
      const inside = pct >= INSIDE_MIN_PCT;
      const tip = BAR.x + width;

      items.push({
        lines,
        mark: Number(raw.mark),
        max,
        pct,
        width,
        top,
        color,
        produced,
        inside,
        labelX: inside ? tip - BAR.gap : tip + BAR.outsideGap,
        baseline,
      });
    }

    return [{ items, track: COLOR.track }];
  }
}

module.exports = GHGAQ93;
