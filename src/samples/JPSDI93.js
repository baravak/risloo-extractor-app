const { Profile } = require("../Profile");

// ---------------------------------------------------------------------------
// No Figma design: agent design from the approved brief
// (docs/profiles/JPSDI_profile_brief_fa.md), in the visual language of CDRISC93
// / JSS93 (BAR-01…BAR-12), with the JSS93 total column beside the stage bars.
// Chart 850 × 250. Only the values the controller has to compute with live here;
// the static geometry is in the template.
// ---------------------------------------------------------------------------
const ROW = { top: 90, pitch: 40 }; // first bar row, row-to-row pitch (JSS93)
const BAR = { x: 229, length: 400 }; // the full track is 15 of 15
const BASELINE = 12.06; // 13 px text baseline, measured from the row top (JSS93)
const MAX = 15; // one option per set × 15 sets, for every stage
// Total column: vertical bar filling bottom → up, 60 = 180 px (3 px a point).
const TOTAL = { bottom: 246, coefficient: 3, max: 60, readoutGap: 4.5 };
const STAGE_NAMES = ["مرحلهٔ ۱", "مرحلهٔ ۲", "مرحلهٔ ۳", "مرحلهٔ ۴"];

class JPSDI93 extends Profile {
  static pages = 1;

  // JPSDI93 — پرسش‌نامه سطوح تحول روانی معنوی دکتر جان‌بزرگی. Four stage counts
  // (0–15, summing to 15 on a complete sheet) and `psdi`, the stage(s) with the
  // highest count, comma-joined on a tie (`level_2,level_3`). `total` (added
  // 2026-10-19) is Σ count × stage number, 15–60 on a complete sheet.
  // Names, order and on-page text come from the approved brief; keys from
  // scoring/JPSDI93.py. `_percent` is stored for the Excel export only — the
  // brief does not show a percentage, so it is not read here.
  labels = {
    L1: { eng: "level_1_raw", title: STAGE_NAMES[0] },
    L2: { eng: "level_2_raw", title: STAGE_NAMES[1] },
    L3: { eng: "level_3_raw", title: STAGE_NAMES[2] },
    L4: { eng: "level_4_raw", title: STAGE_NAMES[3] },
    L5: { eng: "psdi" },
    L6: { eng: "total_raw", title: "نمرهٔ کل", max: TOTAL.max },
  };

  profileSpec = {
    sample: {
      name: "پرسش‌نامه سطوح تحول روانی معنوی دکتر جان‌بزرگی",
      multiProfile: false,
      questions: false,
      defaultFields: true,
      fields: [],
    },
    profile: {
      get dimensions() {
        return {
          width: 850 + 2 * this.padding.x, // Chart 850 wide → 903
          height: 250 + 2 * this.padding.y, // Chart 250 tall → 714
        };
      },
      // Chart centred on the 943 × 754 design page, minus the 20 px the layout
      // already owns on every side, so the page resolves to 903 × 714.
      padding: {
        x: 26.5, // (943 − 850) / 2 − 20
        y: 232, // (754 − 250) / 2 − 20
      },
    },
    labels: Object.values(this.labels),
  };

  constructor(dataset, options, config = {}) {
    super();
    this._init(dataset, options, config);
  }

  _calcContext() {
    const s = this.dataset.score; // 4 stage counts, psdi, total

    const items = [];
    for (let i = 0; i < 4; i++) {
      const mark = s[i].mark ?? 0;
      const top = ROW.top + i * ROW.pitch;
      items.push({
        title: s[i].label.title,
        mark,
        max: MAX,
        // Brief: the bar fills score ÷ 15 of the track, from the raw count.
        width: (BAR.length * mark) / MAX,
        top,
        baseline: top + BASELINE,
      });
    }

    // `psdi` names the stages by key; the brief writes them as «مرحلهٔ N», in
    // stage order, joined Persian-style: «الف و ب», «الف، ب و ج».
    const stages = String(s[4].mark ?? "")
      .split(",")
      .map((key) => Number(key.replace("level_", "")))
      .filter((n) => n >= 1 && n <= 4)
      .sort((a, b) => a - b)
      .map((n) => STAGE_NAMES[n - 1]);
    const level =
      stages.length > 1
        ? `${stages.slice(0, -1).join("، ")} و ${stages[stages.length - 1]}`
        : stages[0] ?? "";

    // Gridline at every point of the 0–15 axis; the axis labels sit on 0/5/10/15.
    const grid = [];
    // Half-pixel lines like the 0 baseline at 228.5 (JSS93).
    for (let k = 1; k <= MAX; k++) grid.push(+(BAR.x - 0.5 + (BAR.length * k) / MAX).toFixed(2));

    // Brief: the column fills total ÷ 60 from its foot; the readout travels with
    // the tip. Cut lines at 15 / 30 / 45 are static in the template.
    const totalMark = s[5].mark ?? 0;
    const height = TOTAL.coefficient * totalMark;
    const tip = TOTAL.bottom - height;
    const total = { mark: totalMark, max: TOTAL.max, height, tip, baseline: tip + TOTAL.readoutGap };

    return [{ items, level, grid, total }];
  }
}

module.exports = JPSDI93;
