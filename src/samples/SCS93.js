const { Profile } = require("../Profile");

// ---------------------------------------------------------------------------
// No Figma design: design from the approved brief
// (docs/profiles/SCS-93_profile_brief_fa.md), in the bar language of SPWB93 /
// SRQ93. Chart 700 × 314. Six equal-length horizontal bars: the five factors in
// the brief's order, then the total after a visible gap. Each bar runs from 0
// to its own maximum and is filled by its stored percent, so the lowest valid
// score (11 of 55, 36 of 180, …) fills a fifth of the bar. One solid colour for
// the factors, a darker one for the total, one track colour, exactly as the
// brief gives them; no levels, zones, boundary lines or score-dependent colour,
// never sorted or highlighted, nothing connecting the factors.
// ---------------------------------------------------------------------------
const ROW = { top: 54, pitch: 40, totalGap: 20 }; // first bar row, row pitch, extra gap before the total
const BAR = { x: 229, length: 400, height: 16, gap: 4, outsideGap: 6 }; // 100 % = 400 px
const BASELINE = 12.06; // 13 px text baseline, measured from the row top (JSS93 / TMPS93)
// Brief palette (سطح‌بندی و رنگ): factors, total, unfilled part of every bar.
const COLOR = { factor: "#25705F", total: "#17463C", track: "#E3F0EC" };
// The percentage moves outside the bar below 10 %, where "٪ NN" plus the 4 px
// tip gap would no longer fit (placement is the designer's per the brief). The
// lowest valid SCS percent is 20 %, so it never fires on valid data.
const INSIDE_MIN_PCT = 10;

class SCS93 extends Profile {
  static pages = 1;

  // SCS93 — مقیاس خودکنترلی تانجنی، فرم ۳۶ سوالی. Five factors and their total
  // over all 36 items, each item scored 1–5 so that a higher score means more
  // self-control. Names, order and maxima come from the approved brief; keys
  // from scoring/SCS93.py (`<factor>_raw`, `<factor>_percent`). `percent` is the
  // share of the row's own maximum as a 3-decimal fraction; it drives both the
  // bar length and the "٪ NN" readout so the two never disagree.
  labels = {
    L1_1: { eng: "capacity_self_discipline_raw", title: "ظرفیت کلی برای خود نظم‌دهی", max: 55 },
    L1_2: { eng: "capacity_self_discipline_percent" },

    L2_1: { eng: "deliberate_action_raw", title: "کنش‌های عمدی (غیر تکانشی)", max: 50 },
    L2_2: { eng: "deliberate_action_percent" },

    L3_1: { eng: "healthy_habits_raw", title: "عادات سالم", max: 25 },
    L3_2: { eng: "healthy_habits_percent" },

    L4_1: { eng: "work_ethics_raw", title: "اخلاق کاری", max: 25 },
    L4_2: { eng: "work_ethics_percent" },

    L5_1: { eng: "reliability_raw", title: "قابلیت اعتماد", max: 25 },
    L5_2: { eng: "reliability_percent" },

    // The total is drawn last, set apart from the five factors by ROW.totalGap.
    L6_1: { eng: "total_raw", title: "نمره کل", max: 180, total: true },
    L6_2: { eng: "total_percent" },
  };

  profileSpec = {
    sample: {
      name: "مقیاس خودکنترلی تانجنی",
      multiProfile: false,
      questions: false,
      defaultFields: true,
      fields: [],
    },
    profile: {
      get dimensions() {
        return {
          width: 700 + 2 * this.padding.x, // Chart 700 wide → 903
          height: 314 + 2 * this.padding.y, // Chart 314 tall → 714
        };
      },
      // Chart centred on the 943 × 754 design page, minus the 20 px the layout
      // already owns on every side, so the page resolves to 903 × 714.
      padding: {
        x: 101.5, // (943 − 700) / 2 − 20
        y: 200, // (754 − 314) / 2 − 20
      },
    },
    labels: Object.values(this.labels),
  };

  constructor(dataset, options, config = {}) {
    super();
    this._init(dataset, options, config);
  }

  _calcContext() {
    const s = this.dataset.score; // [raw, percent] × (5 factors + total), fixed order
    const rows = s.length / 2;

    const items = [];
    for (let i = 0; i < rows; i++) {
      const raw = s[2 * i];
      const { max, title, total } = raw.label;
      const top = ROW.top + i * ROW.pitch + (total ? ROW.totalGap : 0);
      const color = total ? COLOR.total : COLOR.factor;

      // A missing raw mark means the score was not produced: the row keeps its
      // name and empty track, and shows no number (no 0 in place of a score).
      // Every valid SCS raw score is at least 5, so a real score is never 0.
      const produced = raw.mark !== undefined && raw.mark !== null;
      if (!produced) {
        items.push({ title, top, color, produced, width: 0, baseline: top + BASELINE });
        continue;
      }

      // The stored percent is a 3-decimal fraction. The bar is drawn from it; the
      // page shows it × 100 rounded to a whole number with halves up, in integer
      // arithmetic so 0.815 reads 82, not 81 (as CAARS93 / SRQ93).
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

    // The header shows the scale title; the form name follows it, as JSIQ9Q / JSIQ9V.
    return [{ items, track: COLOR.track, titleAppend: " - فرم ۳۶ سوالی" }];
  }
}

module.exports = SCS93;
