const { Profile } = require("../Profile");

// ---------------------------------------------------------------------------
// RSSS93 — مقیاس کشمکش‌های مذهبی و معنوی (فرم فارسی ۲۶ گویه‌ای، RSSS-FA26-J1).
// Designer revision 2026-10-11 (docs/design VIS-25…30): use the newer BAT bar
// language, omit optional explanations and redundant headings, centre the chart,
// label the aggregate «نمره کل», and trim insignificant decimal zeroes.
// The six domain means and total keep their input keys, order, valid range 1–5
// and all-or-nothing validity. Designer revision 2026-10-13: reserve 40px of
// fill at score 1, then map 1–5 linearly through the remaining 460px. The
// baseline has no zero label; every score stays 4px inside its bar end.
// Indigo domains and the JSS neutral total palette are decorative, never a
// clinical class or score threshold; the JSS zero baseline casts rightward.
// No raw sum, percentage, percentile, norm or new scoring calculation is added.
// Group membership follows the brief; neutral vertical title cards follow
// Figma 387:79429. The total stays outside all three domain groups.
// ---------------------------------------------------------------------------
const CHART = { width: 650, height: 430 };
// BAT: 500×16px bars, 40px row pitch, 2px terminal corners, 8px title gap.
const BAR = { x: 134, width: 500, minWidth: 40, height: 16, pitch: 40, totalGap: 64 };
// Source card width/radius; user refinement reduces the group gap to 32px.
// Multi-row cards add 4px above/below their bars, or 8px for supernatural.
// The single-row title keeps 80px.
const GROUP = {
  x: 0, top: 38, width: 48, paddingY: 4,
  paddingByTitle: { "فراطبیعی": 8 }, singleRowHeight: 80, gap: 32,
};
// Bounds measured from the rendered 13px Dana titles and 12px axis labels.
// Include the group cards when centring the visible chart.
const CONTENT = { left: GROUP.x, right: 638.015625, top: -1.78, bottom: CHART.height };
const OFFSET_X = (CHART.width - (CONTENT.right - CONTENT.left)) / 2 - CONTENT.left;
const OFFSET_Y = (CHART.height - (CONTENT.bottom - CONTENT.top)) / 2 - CONTENT.top;
const MIN = 1;
const MAX = 5;

// Use the same mapping for bar ends and axis guides; clamp geometry only.
const scoreWidth = (score) => BAR.minWidth +
  (Math.min(Math.max(score, MIN), MAX) - MIN) * (BAR.width - BAR.minWidth) / (MAX - MIN);

// Preserve the existing two-decimal precision; only remove display padding.
// «٬» (U+066C) keeps the existing Dana decimal-separator convention.
const decimal = (n) => n.toFixed(2).replace(/\.?0+$/, "").replace(".", "٬");

class RSSS93 extends Profile {
  static pages = 1;

  labels = {
    L1: { eng: "divine", title: "الهی", group: "فراطبیعی" },
    L2: { eng: "demonic", title: "اهریمنی", group: "فراطبیعی" },
    L3: { eng: "interpersonal", title: "بین‌فردی", group: "بین‌فردی" },
    L4: { eng: "moral", title: "اخلاقی", group: "درون‌فردی" },
    L5: { eng: "ultimate_meaning", title: "معنای غایی", group: "درون‌فردی" },
    L6: { eng: "doubt", title: "شک و تردید", group: "درون‌فردی" },
    L7: { eng: "total", title: "نمره کل" },
    L8: { eng: "status" }, // valid | incomplete | invalid
  };

  profileSpec = {
    sample: {
      name: "مقیاس کشمکش‌های مذهبی و معنوی",
      multiProfile: false,
      questions: false,
      defaultFields: true,
      fields: [],
    },
    profile: {
      get dimensions() {
        return {
          width: CHART.width + 2 * this.padding.x, // 650 → 903
          height: CHART.height + 2 * this.padding.y, // 430 → 714
        };
      },
      // Chart inset inside the 943 × 754 design page minus the 20 px the layout
      // owns on every side, so the with-sidebar page renders at scale 1.
      padding: {
        x: (943 - CHART.width) / 2 - 20,
        y: (754 - CHART.height) / 2 - 20,
      },
    },
    labels: Object.values(this.labels),
  };

  constructor(dataset, options, config = {}) {
    super();
    this._init(dataset, options, config);
  }

  _calcContext() {
    const s = this.dataset.score;

    // Anything but an explicit "valid" is no score: a missing or unknown status
    // must not let `?? 0` read as a score.
    if (s[7].mark !== "valid") return [{ valid: false }];

    const domains = s.slice(0, 6);
    const rowTops = [];
    let nextGroupTop = GROUP.top;
    const groups = [...new Set(domains.map((data) => data.label.group))].map((title) => {
      const count = domains.filter((data) => data.label.group === title).length;
      const rowsHeight = (count - 1) * BAR.pitch + BAR.height;
      const paddingY = GROUP.paddingByTitle[title] ?? GROUP.paddingY;
      const height = count === 1 ? GROUP.singleRowHeight : rowsHeight + 2 * paddingY;
      const top = nextGroupTop;
      const firstRowTop = top + (height - rowsHeight) / 2;
      rowTops.push(...Array.from({ length: count }, (_, i) => firstRowTop + i * BAR.pitch));
      nextGroupTop += height + GROUP.gap;
      return {
        title,
        x: GROUP.x,
        top,
        rectWidth: GROUP.width - 1,
        rectHeight: height - 1,
        centerX: GROUP.width / 2,
        centerY: height / 2,
      };
    });
    rowTops.push(rowTops[rowTops.length - 1] + BAR.totalGap);

    // Fixed order from `labels`; never sorted by score.
    const items = s.slice(0, 7).map((data, i) => {
      const mark = Number(data.mark ?? 0);
      const width = scoreWidth(mark);
      const top = rowTops[i];
      return {
        title: data.label.title,
        isTotal: data.label.eng === "total",
        mark: decimal(mark),
        width,
        radius: Math.min(2, width),
        top,
        titleBaseline: top + 11.505,
        scoreBaseline: top + 12.55,
        scoreX: BAR.x + width - 4,
      };
    });

    return [
      {
        valid: true,
        items,
        groups,
        gridBottom: CHART.height,
        baselineBottom: CHART.height - 0.5,
        shadowHeight: CHART.height - 16,
        offsetX: OFFSET_X,
        offsetY: OFFSET_Y,
        ticks: Array.from({ length: MAX - MIN + 1 }, (_, i) => ({
          value: MIN + i,
          x: BAR.x + scoreWidth(MIN + i),
        })),
      },
    ];
  }
}

module.exports = RSSS93;
