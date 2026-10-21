const { Profile } = require("../Profile");

// ---------------------------------------------------------------------------
// No Figma design: design from the approved brief
// (docs/profiles/PNI_profile_brief_fa.md), in the bar language of SISRI93 /
// SRQ93. Chart 700 × 374. Eight equal-length horizontal bars: the seven factors
// in the brief's order, then the total after a visible gap. Each bar runs from
// 0 to its own maximum and is filled by its stored percent. One solid colour for
// the factors, a darker shade of it for the total, one track colour, exactly as
// the brief gives them; no levels, zones, boundary lines, groups of factors or
// score-dependent colour, never sorted or highlighted.
// ---------------------------------------------------------------------------
const ROW = { top: 54, pitch: 40, totalGap: 20 }; // first bar row, row pitch, extra gap before the total
const BAR = { x: 229, length: 400, height: 16, gap: 4, outsideGap: 6 }; // 100 % = 400 px
const BASELINE = 12.06; // 13 px text baseline, measured from the row top (as SISRI93)
// Brief palette (سطح‌بندی و رنگ): factors, total, unfilled part of every bar.
const COLOR = { factor: "#3D6B7D", total: "#24434F", track: "#E4ECEF" };
// The percentage moves outside the bar below 10 %, where "٪ NN" plus the 4 px
// tip gap would no longer fit (placement is the designer's per the brief). Every
// PNI answer scores at least 1, so a scored row is never below 17 % and this
// branch only guards data the scoring does not produce.
const INSIDE_MIN_PCT = 10;
const ROWS = 8;

class PNI93 extends Profile {
  static pages = 1;

  // PNI93 — پرسشنامه خودشیفتگی مرضی پینکس. 52 items scored 1–6, no reversed
  // item: seven factors of 5 to 12 items and their total. Names, order and
  // maxima come from the approved brief; keys from scoring/PNI93.py
  // (`<factor>_raw`, `<factor>_percent`, `total_raw`, `total_percent`).
  // `percent` is the share of the row's own maximum as a 3-decimal fraction; it
  // drives both the bar length and the "٪ NN" readout so the two never disagree.
  labels = {
    L1_1: { eng: "contingent_self_esteem_raw", title: "عزت‌نفس مشروط", max: 72 },
    L1_2: { eng: "contingent_self_esteem_percent" },

    L2_1: { eng: "exploitativeness_raw", title: "بهره‌کشی", max: 30 },
    L2_2: { eng: "exploitativeness_percent" },

    L3_1: { eng: "self_sacrificing_self_enhancement_raw", title: "ارتقاء خود یا از خود گذشتگی", max: 36 },
    L3_2: { eng: "self_sacrificing_self_enhancement_percent" },

    L4_1: { eng: "hiding_the_self_raw", title: "پنهان‌سازی خود", max: 42 },
    L4_2: { eng: "hiding_the_self_percent" },

    L5_1: { eng: "grandiose_fantasy_raw", title: "خیال‌پردازی‌های بزرگ‌منشانه", max: 42 },
    L5_2: { eng: "grandiose_fantasy_percent" },

    L6_1: { eng: "devaluing_raw", title: "بی‌ارزش‌سازی", max: 42 },
    L6_2: { eng: "devaluing_percent" },

    L7_1: { eng: "entitlement_rage_raw", title: "خشم محق", max: 48 },
    L7_2: { eng: "entitlement_rage_percent" },

    // The total is drawn last, set apart from the seven factors by ROW.totalGap.
    L8_1: { eng: "total_raw", title: "نمره کل", max: 312, total: true },
    L8_2: { eng: "total_percent" },
  };

  profileSpec = {
    sample: {
      name: "پرسشنامه خودشیفتگی مرضی پینکس",
      multiProfile: false,
      questions: false,
      defaultFields: true,
      fields: [],
    },
    profile: {
      get dimensions() {
        return {
          width: 700 + 2 * this.padding.x, // Chart 700 wide → 903
          height: 374 + 2 * this.padding.y, // Chart 374 tall → 714
        };
      },
      // Chart centred on the 943 × 754 design page, minus the 20 px the layout
      // already owns on every side, so the page resolves to 903 × 714.
      padding: {
        x: 101.5, // (943 − 700) / 2 − 20
        y: 170, // (754 − 374) / 2 − 20
      },
    },
    labels: Object.values(this.labels),
  };

  constructor(dataset, options, config = {}) {
    super();
    // `_extractData` turns a stored 0 into undefined (`score[key] || …`). Keep
    // the scoring output itself so _calcContext can tell a stored number from a
    // missing score, as SISRI93 does.
    this.storedScore = (dataset && dataset.score) || {};
    this._init(dataset, options, config);
  }

  _calcContext() {
    const s = this.dataset.score; // [raw, percent] × (7 factors + total), fixed order

    const items = [];
    for (let i = 0; i < ROWS; i++) {
      const raw = s[2 * i];
      const { max, title, total } = raw.label;
      const top = ROW.top + i * ROW.pitch + (total ? ROW.totalGap : 0);
      const color = total ? COLOR.total : COLOR.factor;

      // A raw key that is absent or null means the score was not produced: the
      // row keeps its name and empty track, and shows no number (no 0 in place
      // of a score).
      const stored = this.storedScore[raw.label.eng];
      const produced = stored !== undefined && stored !== null && stored !== "";
      if (!produced) {
        items.push({ title, top, color, produced, width: 0, baseline: top + BASELINE });
        continue;
      }

      // The stored percent is a 3-decimal fraction. The bar is drawn from it; the
      // page shows it × 100 rounded to a whole number with halves up, in integer
      // arithmetic so 0.625 reads 63, not 62 (as SISRI93 / SRQ93).
      const p = Math.min(Math.max(Number(s[2 * i + 1].mark ?? 0), 0), 1);
      const thousandths = Math.round(p * 1000);
      const pct = Math.floor((thousandths + 5) / 10);
      const width = (BAR.length * thousandths) / 1000;
      const inside = pct >= INSIDE_MIN_PCT;
      const tip = BAR.x + width;

      items.push({
        title,
        mark: Number(stored),
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

module.exports = PNI93;
