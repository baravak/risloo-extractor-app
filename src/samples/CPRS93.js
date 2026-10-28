const { Profile } = require("../Profile");

// CPRS93 — فرم کوتاه ویژهٔ والدین مقیاس درجه‌بندی کانرز (CPRS-48).
// Built from the approved brief docs/profiles/CPRS_profile_brief_fa.md; no Figma design exists, so this is an
// agent layout in the manner of CBCL9A, for the designer to review.
// Two pages, one per scoring of the same answer sheet (scoring/CPRS93.py):
//   page 1 «عوامل کلاسیک» — six scores: item mean (two decimals) and T; T axis even 30..180 (T reaches 175);
//   page 2 «تحلیل عاملی ایرانی» — five scores: raw, T and percentile (text, as printed: "96", "<99");
//          T axis even 30..110.
// No bands, no colour by score, one colour for every bar; only a line at T 50.
// Unless status is "valid", both pages show only «نمره تولید نشد».

const CHART = { width: 863, height: 653 };

class CPRS93 extends Profile {
  // Number of pages
  static pages = 2;

  // Labels of the sample — order is the brief's display order
  labels = {
    L1: { eng: "classic_conduct_mean", fa: ["مشکلات", "سلوک"] },
    L2: { eng: "classic_conduct_t" },
    L3: { eng: "classic_learning_mean", fa: ["مشکلات", "یادگیری"] },
    L4: { eng: "classic_learning_t" },
    L5: { eng: "classic_psychosomatic_mean", fa: ["روان‌تنی"] },
    L6: { eng: "classic_psychosomatic_t" },
    L7: { eng: "classic_impulsive_hyperactive_mean", fa: ["تکانشگری–", "بیش‌فعالی"] },
    L8: { eng: "classic_impulsive_hyperactive_t" },
    L9: { eng: "classic_anxiety_mean", fa: ["اضطراب"] },
    L10: { eng: "classic_anxiety_t" },
    L11: { eng: "classic_hyperkinesis_index_mean", fa: ["شاخص", "بیش‌فعالی"] },
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
          width: CHART.width + 2 * this.padding.x, // 863 → 903
          height: CHART.height + 2 * this.padding.y, // 653 → 714
        };
      },
      padding: {
        x: 20,
        y: 30.5,
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
    if (dataset.score[27].mark !== "valid") return pages.map((page) => ({ ...page, valid: false }));

    const classic = [];
    for (let i = 0; i < 12; i += 2) {
      const mean = dataset.score[i];
      const t = dataset.score[i + 1].mark ?? 0;
      classic.push({ label: mean.label.fa, mean: Number(mean.mark ?? 0).toFixed(2), t, ...bar(t, AXIS_1) });
    }
    const persian = [];
    for (let i = 12; i < 27; i += 3) {
      const raw = dataset.score[i];
      const t = dataset.score[i + 1].mark ?? 0;
      const pr = dataset.score[i + 2].mark ?? "";
      persian.push({ label: raw.label.fa, raw: raw.mark ?? 0, t, pr, ...bar(t, AXIS_2) });
    }

    return [
      { ...pages[0], valid: true, items: place(classic), ticks: ticks(AXIS_1), fifty: y(50, AXIS_1), axis: AXIS_1 },
      { ...pages[1], valid: true, items: place(persian), ticks: ticks(AXIS_2), fifty: y(50, AXIS_2), axis: AXIS_2 },
    ];
  }
}

const TITLE_1 = " - عوامل کلاسیک";
const TITLE_2 = " - تحلیل عاملی ایرانی";

// Plot box shared by both pages; each page has its own even T axis.
const PLOT = { left: 120, right: 800, top: 120, bottom: 520 };
const AXIS_1 = { min: 30, max: 180, step: 30 };
const AXIS_2 = { min: 30, max: 110, step: 20 };
const BAR_WIDTH = 40;
// A T label sits inside the bar when the bar is tall enough, otherwise just above it.
const INSIDE_MIN = 24;

function y(score, axis) {
  const clamped = Math.min(Math.max(score, axis.min), axis.max);
  return PLOT.bottom - ((clamped - axis.min) * (PLOT.bottom - PLOT.top)) / (axis.max - axis.min);
}

function bar(t, axis) {
  const top = y(t, axis);
  const height = PLOT.bottom - top;
  const inside = height >= INSIDE_MIN;
  return {
    height,
    transform: `translate(0, ${top - PLOT.top})`,
    tY: inside ? top - PLOT.top + 7 : top - PLOT.top - 18,
    tFill: inside ? "#ffffff" : "#475569",
  };
}

// Bars evenly spread over the plot width, first score on the left, as in CBCL9A.
function place(items) {
  const pitch = (PLOT.right - PLOT.left) / items.length;
  return items.map((item, index) => ({ ...item, x: PLOT.left + pitch * index + (pitch - BAR_WIDTH) / 2 }));
}

function ticks(axis) {
  const list = [];
  for (let value = axis.min; value <= axis.max; value += axis.step) list.push({ value, y: y(value, axis) });
  return list;
}

module.exports = CPRS93;
