const { Profile } = require("../Profile");

// CPRS93 — فرم کوتاه ویژهٔ والدین مقیاس درجه‌بندی کانرز (CPRS-48).
// Built from the approved brief docs/profiles/CPRS_profile_brief_fa.md; no Figma design exists, so this is an
// agent layout for the designer to review. The brief leaves the chart type to the designer.
// Horizontal bars in the STAXI293 / OHQ93 bar language (researcher's request, 2026-11-11: the first, vertical
// layout read as heavy): the name before each bar, the bar from the axis start to its T, the T at the bar's
// end, and the page's number columns after the bars.
// Two pages, one per scoring of the same answer sheet (scoring/CPRS93.py):
//   page 1 «عوامل کلاسیک» — six scores: raw sum and T (package D2, 2026-11-11: raw instead of the item mean);
//          T axis even 30..180 (T reaches 175);
//   page 2 «تحلیل عاملی ایرانی» — five scores: raw, T and percentile (text, as printed: "96", "<99");
//          T axis even 30..110.
// No bands, no colour by score, one colour for every bar; only a line at T 50.
// Unless status is "valid", both pages show only «نمره تولید نشد».

const CHART = { width: 800, height: 360 };

class CPRS93 extends Profile {
  // Number of pages
  static pages = 2;

  // Labels of the sample — order is the brief's display order
  labels = {
    L1: { eng: "classic_conduct_raw", fa: ["مشکلات", "سلوک"] },
    L2: { eng: "classic_conduct_t" },
    L3: { eng: "classic_learning_raw", fa: ["مشکلات", "یادگیری"] },
    L4: { eng: "classic_learning_t" },
    L5: { eng: "classic_psychosomatic_raw", fa: ["روان‌تنی"] },
    L6: { eng: "classic_psychosomatic_t" },
    L7: { eng: "classic_impulsive_hyperactive_raw", fa: ["تکانشگری–", "بیش‌فعالی"] },
    L8: { eng: "classic_impulsive_hyperactive_t" },
    L9: { eng: "classic_anxiety_raw", fa: ["اضطراب"] },
    L10: { eng: "classic_anxiety_t" },
    L11: { eng: "classic_hyperkinesis_index_raw", fa: ["شاخص", "بیش‌فعالی"] },
    L12: { eng: "classic_hyperkinesis_index_t" },

    L13: { eng: "persian_conduct_raw", fa: ["مشکلات", "سلوک"] },
    L14: { eng: "persian_conduct_t" },
    L15: { eng: "persian_conduct_pr" },
    L16: { eng: "persian_social_raw", fa: ["مشکلات", "اجتماعی"] },
    L17: { eng: "persian_social_t" },
    L18: { eng: "persian_social_pr" },
    L19: { eng: "persian_psychosomatic_raw", fa: ["مشکلات", "روان‌تنی"] },
    L20: { eng: "persian_psychosomatic_t" },
    L21: { eng: "persian_psychosomatic_pr" },
    L22: { eng: "persian_anxiety_shyness_raw", fa: ["اضطراب–", "خجالتی"] },
    L23: { eng: "persian_anxiety_shyness_t" },
    L24: { eng: "persian_anxiety_shyness_pr" },
    L25: { eng: "persian_total_raw", fa: ["نمرهٔ کل"] },
    L26: { eng: "persian_total_t" },
    L27: { eng: "persian_total_pr" },

    L28: { eng: "status" }, // valid | incomplete | invalid
  };

  profileSpec = {
    sample: {
      name: "مقیاس درجه‌بندی کانرز (۱۹۷۸)" /* Name of the sample */,
      multiProfile: false /* Whether the sample has multiple profiles or not */,
      questions: true /* Determines whether to get questions from inital dataset or not */,
      defaultFields: true /* Determines whether to have default prerequisites in the profile or not */,
      fields: ["relationship", "child_gender", "child_age"] /* Additional fields shown in the profile */,
    },
    profile: {
      get dimensions() {
        return {
          width: CHART.width + 2 * this.padding.x, // 800 → 903
          height: CHART.height + 2 * this.padding.y, // 360 → 714
        };
      },
      // Chart centred on the 943 × 754 design page, minus the 20 px the layout owns (STAXI293).
      padding: {
        x: (943 - CHART.width) / 2 - 20, // 51.5
        y: (754 - CHART.height) / 2 - 20, // 177
      },
    },
    labels: Object.values(this.labels),
  };

  constructor(dataset, options, config = {}) {
    super();
    this._init(dataset, options, config);
  }

  _calcContext() {
    const { dataset } = this;
    const pages = [{ titleAppend: TITLE_1 }, { titleAppend: TITLE_2 }];

    // All-or-nothing: anything but an explicit "valid" shows only «نمره تولید نشد» on both pages;
    // a missing status must not let `?? 0` read as the lowest score.
    if (dataset.score[27].mark !== "valid")
      return pages.map((page) => ({ ...page, valid: false, box: { x: CHART.width / 2 } }));

    const classic = [];
    for (let i = 0; i < 12; i += 2) {
      const raw = dataset.score[i];
      const t = dataset.score[i + 1].mark ?? 0;
      classic.push({ label: name(raw.label.fa), t, values: [raw.mark ?? 0] });
    }
    const persian = [];
    for (let i = 12; i < 27; i += 3) {
      const raw = dataset.score[i];
      const t = dataset.score[i + 1].mark ?? 0;
      const pr = dataset.score[i + 2].mark ?? "";
      persian.push({ label: name(raw.label.fa), t, values: [raw.mark ?? 0, pr] });
    }

    return [
      { ...pages[0], ...chart("عوامل کلاسیک", classic, AXIS_1, ["نمره خام"]) },
      { ...pages[1], ...chart("تحلیل عاملی ایرانی", persian, AXIS_2, ["نمره خام", "رتبه درصدی"]) },
    ];
  }
}

const TITLE_1 = " - عوامل کلاسیک";
const TITLE_2 = " - تحلیل عاملی ایرانی";

// Geometry in the chart's own space (translated by the padding in the template).
const TITLE_Y = 16; // page title baseline, centred on the chart
const HEAD_Y = 60; // baseline of the axis numbers and the column headings
const ROWS_TOP = 84; // top of the first bar
const ROW_PITCH = 48;
const BAR = { x: 162, width: 480, height: 18 }; // axis start → axis end: 162 → 642
const NAME_RIGHT = BAR.x - 12; // names end here, before the bar
const COLUMNS = [704, 768]; // centres of the number columns after the bars
const GRID_MARGIN = 14; // gridlines reach this far above the first and below the last bar
const AXIS_1 = { min: 30, max: 180, step: 30 };
const AXIS_2 = { min: 30, max: 110, step: 20 };
// The T stays inside the bar (white, 4 px before its end) when the bar is at least this wide,
// otherwise it sits 6 px after the end in the dark colour (STAXI293).
const INSIDE_MIN = 36;
const COLOR = { light: "#BAE6FD", dark: "#0369A1", track: "#E2E8F0", line: "#64748B" };

// The two-line names of the vertical layout become one line.
function name(lines) {
  return lines.reduce((text, line) => (text && !text.endsWith("–") ? `${text} ${line}` : text + line), "");
}

function x(score, axis) {
  const clamped = Math.min(Math.max(score, axis.min), axis.max);
  return BAR.x + ((clamped - axis.min) * BAR.width) / (axis.max - axis.min);
}

function chart(title, scores, axis, headings) {
  const items = scores.map((score, index) => {
    const top = ROWS_TOP + index * ROW_PITCH;
    const width = x(score.t, axis) - BAR.x;
    const inside = width >= INSIDE_MIN;
    return {
      label: score.label,
      t: score.t,
      top,
      width,
      radius: Math.min(2, width),
      baseline: top + BAR.height / 2,
      tX: inside ? BAR.x + width - 4 : BAR.x + width + 6,
      tAnchor: inside ? "end" : "start",
      tFill: inside ? "white" : COLOR.dark,
      values: score.values.map((value, column) => ({ value, x: COLUMNS[column] })),
    };
  });
  const ticks = [];
  for (let value = axis.min; value <= axis.max; value += axis.step) ticks.push({ value, x: x(value, axis) });
  const gridTop = ROWS_TOP - GRID_MARGIN;
  const gridBottom = ROWS_TOP + (scores.length - 1) * ROW_PITCH + BAR.height + GRID_MARGIN;
  return {
    valid: true,
    title,
    titleX: CHART.width / 2,
    titleY: TITLE_Y,
    headY: HEAD_Y,
    headings: headings.map((text, column) => ({ text, x: COLUMNS[column] })),
    // T 50 is labelled once: as a bold tick when it is one (page 2), otherwise on its own (page 1).
    ticks: ticks.map((tick) => ({ ...tick, fifty: tick.value === 50 })),
    fifty: { x: x(50, axis), label: !ticks.some((tick) => tick.value === 50) },
    items,
    gridTop,
    gridBottom,
    nameRight: NAME_RIGHT,
    bar: BAR,
    color: COLOR,
  };
}

module.exports = CPRS93;
