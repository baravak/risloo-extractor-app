const { Profile } = require("../Profile");

// ---------------------------------------------------------------------------
// No Figma design: design from the approved brief
// (docs/profiles/SISRI_profile_brief_fa.md), in the bar language of SRQ93 /
// MWAS93. Chart 700 × 274. Five equal-length horizontal bars: the four factors
// in the brief's order, then the total after a visible gap. Each bar runs from
// 0 to its own maximum and is filled by its stored percent. One solid colour for
// the factors, another for the total, one track colour, exactly as the brief
// gives them; no levels, zones, boundary lines or score-dependent colour, never
// sorted or highlighted.
// ---------------------------------------------------------------------------
const ROW = { top: 54, pitch: 40, totalGap: 20 }; // first bar row, row pitch, extra gap before the total
const BAR = { x: 229, length: 400, height: 16, gap: 4, outsideGap: 6 }; // 100 % = 400 px
const BASELINE = 12.06; // 13 px text baseline, measured from the row top (JSS93 / TMPS93)
// Brief palette (سطح‌بندی و رنگ): factors, total, unfilled part of every bar.
const COLOR = { factor: "#6B5B95", total: "#45396B", track: "#ECE8F3" };
// The percentage moves outside the bar below 10 %, where "٪ NN" plus the 4 px
// tip gap would no longer fit (placement is the designer's per the brief). Valid
// SISRI scores reach it: raw 1–2 of 28, 1 of 20 and 1–9 of 96.
const INSIDE_MIN_PCT = 10;

class SISRI93 extends Profile {
  static pages = 1;

  // SISRI93 — مقیاس هوش معنوی کینگ. 24 items scored 0–4 (item 6 reversed):
  // four factors of 5 or 7 items and their total. Names, order and maxima come
  // from the approved brief; keys from scoring/SISRI93.py (`<factor>_raw`,
  // `<factor>_percent`). `percent` is the share of the row's own maximum as a
  // 3-decimal fraction; it drives both the bar length and the "٪ NN" readout so
  // the two never disagree.
  labels = {
    L1_1: { eng: "critical_existential_thinking_raw", title: "تفکر وجودی انتقادی", max: 28 },
    L1_2: { eng: "critical_existential_thinking_percent" },

    L2_1: { eng: "personal_meaning_production_raw", title: "ایجاد معناداری شخصی", max: 20 },
    L2_2: { eng: "personal_meaning_production_percent" },

    L3_1: { eng: "transcendental_awareness_raw", title: "هشیاری متعالی", max: 28 },
    L3_2: { eng: "transcendental_awareness_percent" },

    L4_1: { eng: "conscious_state_expansion_raw", title: "گسترش حالت هشیاری", max: 20 },
    L4_2: { eng: "conscious_state_expansion_percent" },

    // The total is drawn last, set apart from the four factors by ROW.totalGap.
    L5_1: { eng: "total_raw", title: "نمره کل هوش معنوی", max: 96, total: true },
    L5_2: { eng: "total_percent" },
  };

  profileSpec = {
    sample: {
      name: "مقیاس هوش معنوی کینگ (SISRI-24)",
      multiProfile: false,
      questions: false,
      defaultFields: true,
      fields: [],
    },
    profile: {
      get dimensions() {
        return {
          width: 700 + 2 * this.padding.x, // Chart 700 wide → 903
          height: 274 + 2 * this.padding.y, // Chart 274 tall → 714
        };
      },
      // Chart centred on the 943 × 754 design page, minus the 20 px the layout
      // already owns on every side, so the page resolves to 903 × 714.
      padding: {
        x: 101.5, // (943 − 700) / 2 − 20
        y: 220, // (754 − 274) / 2 − 20
      },
    },
    labels: Object.values(this.labels),
  };

  constructor(dataset, options, config = {}) {
    super();
    // `_extractData` turns a stored 0 into undefined (`score[key] || …`), and a
    // raw SISRI score of 0 is valid and must show "0 از 28". Keep the scoring
    // output itself so _calcContext can tell a real 0 from a missing score.
    this.storedScore = (dataset && dataset.score) || {};
    this._init(dataset, options, config);
  }

  _calcContext() {
    const s = this.dataset.score; // [raw, percent] × (4 factors + total), fixed order

    const items = [];
    for (let i = 0; i < 5; i++) {
      const raw = s[2 * i];
      const { max, title, total } = raw.label;
      const top = ROW.top + i * ROW.pitch + (total ? ROW.totalGap : 0);
      const color = total ? COLOR.total : COLOR.factor;

      // A raw key that is absent or null means the score was not produced: the
      // row keeps its name and empty track, and shows no number (no 0 in place
      // of a score). A stored 0 is a real score: empty bar, its numbers shown.
      const stored = this.storedScore[raw.label.eng];
      const produced = stored !== undefined && stored !== null && stored !== "";
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

module.exports = SISRI93;
